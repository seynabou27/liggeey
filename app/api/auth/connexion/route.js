import { eq } from 'drizzle-orm';
import { obtenirDb } from '@/lib/serveur/db.mjs';
import { utilisateurs } from '@/lib/serveur/schema.mjs';
import { trouverParIdentifiant, comptePublic } from '@/lib/serveur/comptes.mjs';
import { verifierMotDePasse, verifierSansCompte } from '@/lib/serveur/motDePasse.mjs';
import { ouvrirSession } from '@/lib/serveur/session';
import { reponse, refuserSiAutreOrigine, lireJson, adresseIp, tropDEssais, noterEssai } from '@/lib/serveur/http';
import { normaliserEmail, normaliserTelephone } from '@/lib/comptes.mjs';

const ECHEC = 'E-mail, téléphone ou mot de passe incorrect.';

/**
 * Connexion : POST /api/auth/connexion
 * Corps : { identifiant (e-mail ou téléphone), motDePasse, souvenir }
 * Réponses : 200 { ok, compte } ; 401 identifiants incorrects ; 403 compte suspendu ; 429 trop d’essais.
 */
export async function POST(requete) {
  const refus = refuserSiAutreOrigine(requete);
  if (refus) return refus;
  const corps = await lireJson(requete);
  const identifiant = typeof corps?.identifiant === 'string' ? corps.identifiant.trim().slice(0, 200) : '';
  const motDePasse = typeof corps?.motDePasse === 'string' ? corps.motDePasse.slice(0, 200) : '';
  if (!identifiant || !motDePasse) return reponse({ ok: false, erreur: ECHEC }, 400);

  // Même clé pour « 77 000 00 00 » et « +221770000000 » : la limite d’essais ne se contourne pas par le format.
  const cle = identifiant.includes('@') ? normaliserEmail(identifiant) : normaliserTelephone(identifiant) ?? identifiant.toLowerCase();
  const ip = adresseIp(requete);

  try {
    if (await tropDEssais(cle, ip)) {
      return reponse({ ok: false, erreur: 'Trop de tentatives. Patientez 15 minutes, ou utilisez « Mot de passe oublié ».' }, 429);
    }

    const db = await obtenirDb();
    const utilisateur = await trouverParIdentifiant(db, identifiant);
    const valide = utilisateur ? await verifierMotDePasse(motDePasse, utilisateur.motDePasseHash) : await verifierSansCompte(motDePasse);
    await noterEssai(cle, ip, valide);
    if (!valide) return reponse({ ok: false, erreur: ECHEC }, 401);

    if (utilisateur.statut === 'suspendu') {
      return reponse({ ok: false, erreur: "Votre compte est suspendu. Contactez l’équipe LIGGEEY sur WhatsApp ou au bureau de Dakar." }, 403);
    }

    await ouvrirSession(utilisateur.id, { souvenir: corps.souvenir === true, agentUtilisateur: requete.headers.get('user-agent') });
    await db.update(utilisateurs).set({ derniereConnexionLe: new Date() }).where(eq(utilisateurs.id, utilisateur.id));
    return reponse({ ok: true, compte: comptePublic(utilisateur) });
  } catch (e) {
    console.error('[connexion]', e);
    return reponse({ ok: false, erreur: 'Connexion impossible pour le moment. Réessayez dans quelques minutes.' }, 500);
  }
}
