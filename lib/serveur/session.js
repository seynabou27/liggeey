import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, lt } from 'drizzle-orm';
import { obtenirDb } from './db.mjs';
import { sessions, utilisateurs } from './schema.mjs';
import { comptePublic } from './comptes.mjs';

/* Sessions : un jeton aléatoire dans un cookie httpOnly, son empreinte SHA-256 en base.
   - « Se souvenir de moi » : 30 jours ;
   - sinon : cookie de navigateur (effacé à sa fermeture), session valable 24 h au plus. */

export const COOKIE_SESSION = 'liggeey_session';
const JOUR = 24 * 60 * 60 * 1000;
const DUREE_LONGUE = 30 * JOUR;
const DUREE_COURTE = JOUR;

const empreinte = (jeton) => createHash('sha256').update(jeton).digest('hex');

/** Ouvre une session pour l’utilisateur et pose le cookie. */
export async function ouvrirSession(utilisateurId, { souvenir = false, agentUtilisateur = null } = {}) {
  const db = await obtenirDb();
  const jeton = randomBytes(32).toString('base64url');
  const expireLe = new Date(Date.now() + (souvenir ? DUREE_LONGUE : DUREE_COURTE));
  await db.insert(sessions).values({ id: empreinte(jeton), utilisateurId, expireLe, agentUtilisateur: agentUtilisateur?.slice(0, 300) ?? null });
  // Ménage des sessions expirées de cet utilisateur.
  await db.delete(sessions).where(and(eq(sessions.utilisateurId, utilisateurId), lt(sessions.expireLe, new Date())));

  const magasin = await cookies();
  magasin.set(COOKIE_SESSION, jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(souvenir ? { expires: expireLe } : {}),
  });
}

/** Compte connecté (forme publique), ou null. Utilisable dans les pages et les routes de l’API. */
export async function compteConnecte() {
  const utilisateur = await utilisateurConnecte();
  return comptePublic(utilisateur);
}

/** Ligne utilisateur complète de la session en cours, ou null. Réservé au serveur. */
export async function utilisateurConnecte() {
  const jeton = (await cookies()).get(COOKIE_SESSION)?.value;
  if (!jeton) return null;
  const db = await obtenirDb();
  const [ligne] = await db
    .select({ utilisateur: utilisateurs })
    .from(sessions)
    .innerJoin(utilisateurs, eq(sessions.utilisateurId, utilisateurs.id))
    .where(and(eq(sessions.id, empreinte(jeton)), gt(sessions.expireLe, new Date())))
    .limit(1);
  if (!ligne || ligne.utilisateur.statut === 'suspendu') return null;
  return ligne.utilisateur;
}

/** Ferme la session en cours (base et cookie). */
export async function fermerSession() {
  const magasin = await cookies();
  const jeton = magasin.get(COOKIE_SESSION)?.value;
  if (jeton) {
    const db = await obtenirDb();
    await db.delete(sessions).where(eq(sessions.id, empreinte(jeton)));
  }
  magasin.delete(COOKIE_SESSION);
}
