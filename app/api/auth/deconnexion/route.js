import { fermerSession } from '@/lib/serveur/session';
import { reponse, refuserSiAutreOrigine } from '@/lib/serveur/http';

/** Déconnexion : POST /api/auth/deconnexion (corps JSON vide accepté). */
export async function POST(requete) {
  const refus = refuserSiAutreOrigine(requete);
  if (refus) return refus;
  await fermerSession();
  return reponse({ ok: true });
}
