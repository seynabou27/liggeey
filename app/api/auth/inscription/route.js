import { obtenirDb } from '@/lib/serveur/db.mjs';
import { verifierInscription, creerUtilisateur, comptePublic, ErreurDoublon } from '@/lib/serveur/comptes.mjs';
import { ouvrirSession } from '@/lib/serveur/session';
import { reponse, refuserSiAutreOrigine, lireJson } from '@/lib/serveur/http';

/**
 * Inscription : POST /api/auth/inscription
 * Corps : { profil, nom | responsable, email, telephone, naissance, motDePasse, cgu, …champs du profil,
 *           parentNom, parentTelephone, parentLien, parentInforme (Cap Métier, 15-17 ans) }
 * Réponses : 201 { ok, compte } (session ouverte) ; 422 { erreurs: { champ: message } } ; 409 doublon.
 */
export async function POST(requete) {
  const refus = refuserSiAutreOrigine(requete);
  if (refus) return refus;
  const corps = await lireJson(requete);
  if (!corps) return reponse({ ok: false, erreur: 'Requête invalide.' }, 400);

  const { erreurs, erreur, donnees } = verifierInscription(corps);
  if (erreur) return reponse({ ok: false, erreur }, 400);
  if (!donnees) return reponse({ ok: false, erreur: 'Merci de corriger les champs en rouge.', erreurs }, 422);

  try {
    const db = await obtenirDb();
    const utilisateur = await creerUtilisateur(db, donnees);
    await ouvrirSession(utilisateur.id, { souvenir: true, agentUtilisateur: requete.headers.get('user-agent') });
    // À venir : SMS au parent ou tuteur pour confirmer l'accord (Cap Métier), e-mail de bienvenue.
    return reponse({ ok: true, compte: comptePublic(utilisateur) }, 201);
  } catch (e) {
    if (e instanceof ErreurDoublon) return reponse({ ok: false, erreur: e.message, erreurs: { [e.champ]: e.message } }, 409);
    console.error('[inscription]', e);
    return reponse({ ok: false, erreur: "L'inscription est impossible pour le moment. Réessayez dans quelques minutes." }, 500);
  }
}
