/* Appels à l'API des comptes (app/api/auth/…), depuis le prototype.
   Chaque fonction renvoie { ok, compte?, erreur?, erreurs? } et ne lève jamais d'exception :
   une coupure réseau (fréquente en 4G) donne un message lisible. */

const HORS_LIGNE = 'Connexion au serveur impossible. Vérifiez votre connexion Internet, puis réessayez.';

async function envoyer(chemin, corps = {}) {
  try {
    const r = await fetch(chemin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps),
      credentials: 'same-origin',
    });
    const donnees = await r.json().catch(() => ({}));
    return { ok: r.ok && donnees.ok !== false, ...donnees };
  } catch {
    return { ok: false, erreur: HORS_LIGNE };
  }
}

export const apiConnexion = ({ identifiant, motDePasse, souvenir }) => envoyer('/api/auth/connexion', { identifiant, motDePasse, souvenir });

export const apiInscription = (donnees) => envoyer('/api/auth/inscription', donnees);

export const apiDeconnexion = () => envoyer('/api/auth/deconnexion');
