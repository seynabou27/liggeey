/* Adresses de la plateforme (/plateforme/…), partagées par la page Next (validation côté serveur)
   et par le prototype (barre d’adresse, boutons Précédent / Suivant du navigateur).

   - connexion et inscription : /plateforme/connexion, /plateforme/inscription,
     /plateforme/inscription?profil=chercheur, /plateforme/inscription/confirmation
   - écrans de l’application : /plateforme/{espace}/{écran}, par exemple
     /plateforme/chercheur/tableau-de-bord, /plateforme/admin/offres, /plateforme/cap-metier/orientation

   Les identifiants d’écran du prototype sont repris tels quels, sauf « dashboard » (tableau-de-bord).
   Un écran interne ne s’ouvre que si une session est ouverte dans ce navigateur pour cet espace :
   sinon, la plateforme affiche la connexion (voir le composant racine du prototype). */

const BASE = '/plateforme';

/** Espace du prototype → segment d’adresse. */
export const ESPACES_ADRESSE = {
  chercheur: 'chercheur',
  prestataire: 'prestataire',
  entreprise: 'entreprise',
  jeune: 'cap-metier',
  mentor: 'mentor',
  admin: 'admin',
};
const ESPACE_DEPUIS_SEGMENT = Object.fromEntries(Object.entries(ESPACES_ADRESSE).map(([e, s]) => [s, e]));

const ECRAN_VERS_SEGMENT = { dashboard: 'tableau-de-bord' };
const SEGMENT_VERS_ECRAN = Object.fromEntries(Object.entries(ECRAN_VERS_SEGMENT).map(([e, s]) => [s, e]));

const PROFILS_INSCRIPTION = ['chercheur', 'prestataire', 'entreprise', 'jeune', 'mentor'];

export const ECRANS_AUTH = ['login', 'signup-choice', 'signup-info', 'signup-confirm'];

/** Premier segment accepté sous /plateforme (le reste est vérifié par le prototype). */
export function premierSegmentValide(segment) {
  return segment === 'connexion' || segment === 'inscription' || segment in ESPACE_DEPUIS_SEGMENT;
}

/** État du prototype → adresse. */
export function adressePlateforme({ screen, espace, profil }) {
  if (screen === 'login') return `${BASE}/connexion`;
  if (screen === 'signup-choice') return `${BASE}/inscription`;
  if (screen === 'signup-info') return `${BASE}/inscription${profil ? `?profil=${profil}` : ''}`;
  if (screen === 'signup-confirm') return `${BASE}/inscription/confirmation`;
  const segEspace = ESPACES_ADRESSE[espace] || espace;
  return `${BASE}/${segEspace}/${ECRAN_VERS_SEGMENT[screen] || screen}`;
}

/**
 * Adresse → demande d’écran.
 * - segments : morceaux après /plateforme (ex. ['admin', 'offres'])
 * - profil : paramètre ?profil= de l’inscription
 * Renvoie { type: 'auth', screen, profil } | { type: 'app', espace, screen | null } | null (adresse inconnue).
 */
export function lireAdressePlateforme(segments = [], profil = null) {
  const [premier, second] = segments;
  if (!premier) return null;
  if (premier === 'connexion') return { type: 'auth', screen: 'login' };
  if (premier === 'inscription') {
    if (second === 'confirmation') return { type: 'auth', screen: 'signup-confirm' };
    const p = PROFILS_INSCRIPTION.includes(profil) ? profil : null;
    return p ? { type: 'auth', screen: 'signup-info', profil: p } : { type: 'auth', screen: 'signup-choice' };
  }
  const espace = ESPACE_DEPUIS_SEGMENT[premier];
  if (!espace) return null;
  return { type: 'app', espace, screen: second ? SEGMENT_VERS_ECRAN[second] || second : null };
}

/** Lecture de l’adresse courante du navigateur. */
export function lireAdresseNavigateur() {
  const { pathname, search } = window.location;
  if (!pathname.startsWith(BASE)) return null;
  const segments = pathname.slice(BASE.length).split('/').filter(Boolean).map(decodeURIComponent);
  return lireAdressePlateforme(segments, new URLSearchParams(search).get('profil'));
}
