import { compteConnecte } from '@/lib/serveur/session';
import { reponse } from '@/lib/serveur/http';

/** Session en cours : GET /api/auth/session → { compte } (null si personne n’est connecté). */
export async function GET() {
  return reponse({ compte: await compteConnecte() });
}
