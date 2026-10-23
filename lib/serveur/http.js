import 'server-only';
import { NextResponse } from 'next/server';
import { and, eq, gt, count } from 'drizzle-orm';
import { obtenirDb } from './db.mjs';
import { tentativesConnexion } from './schema.mjs';

/** Réponse JSON, jamais mise en cache. */
export function reponse(corps, status = 200) {
  return NextResponse.json(corps, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Protection contre les requêtes venues d'un autre site (CSRF), en plus du cookie SameSite=Lax :
 * une requête qui modifie des données doit venir de notre propre origine, en JSON.
 * Renvoie une réponse d'erreur, ou null si tout va bien.
 */
export function refuserSiAutreOrigine(requete) {
  const origine = requete.headers.get('origin');
  const hote = requete.headers.get('x-forwarded-host') ?? requete.headers.get('host');
  if (origine) {
    try {
      if (new URL(origine).host !== hote) return reponse({ ok: false, erreur: 'Origine refusée.' }, 403);
    } catch {
      return reponse({ ok: false, erreur: 'Origine refusée.' }, 403);
    }
  }
  if (!requete.headers.get('content-type')?.includes('application/json')) {
    return reponse({ ok: false, erreur: 'Requête invalide.' }, 415);
  }
  return null;
}

/** Corps JSON de la requête, ou null s'il est illisible. */
export async function lireJson(requete) {
  try {
    const corps = await requete.json();
    return corps && typeof corps === 'object' ? corps : null;
  } catch {
    return null;
  }
}

export function adresseIp(requete) {
  return requete.headers.get('x-forwarded-for')?.split(',')[0].trim() || requete.headers.get('x-real-ip') || null;
}

/* Limite des essais de connexion : 5 échecs par identifiant, ou 30 par adresse IP, en 15 minutes. */
const FENETRE = 15 * 60 * 1000;
const MAX_PAR_IDENTIFIANT = 5;
const MAX_PAR_IP = 30;

export async function tropDEssais(identifiant, ip) {
  const db = await obtenirDb();
  const depuis = new Date(Date.now() - FENETRE);
  const echecs = (condition) =>
    db
      .select({ n: count() })
      .from(tentativesConnexion)
      .where(and(condition, eq(tentativesConnexion.reussie, false), gt(tentativesConnexion.creeLe, depuis)))
      .then(([r]) => r.n);
  if ((await echecs(eq(tentativesConnexion.identifiant, identifiant))) >= MAX_PAR_IDENTIFIANT) return true;
  return ip ? (await echecs(eq(tentativesConnexion.ip, ip))) >= MAX_PAR_IP : false;
}

export async function noterEssai(identifiant, ip, reussie) {
  const db = await obtenirDb();
  await db.insert(tentativesConnexion).values({ identifiant, ip, reussie });
}
