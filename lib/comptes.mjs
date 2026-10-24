/* Règles des comptes, partagées par le prototype (navigateur), l’API et les scripts (serveur).
   Fichier .mjs : il est aussi lu par les scripts Node (scripts/), sans passer par Next. */

/** Profils ouverts à l’inscription. L’admin ne s’inscrit pas : son compte est créé par script. */
export const PROFILS_INSCRIPTION = ['chercheur', 'prestataire', 'entreprise', 'jeune', 'mentor'];
export const PROFILS = [...PROFILS_INSCRIPTION, 'admin'];

/* Âges d’accès, d’après le droit sénégalais (à faire valider par un juriste) :
   - majorité civile à 18 ans (Code de la famille) ;
   - travail et apprentissage dès 15 ans révolus (Code du travail, art. L.145 ; arrêté n° 3748 du 6 juin 2003) ;
   - un mineur non émancipé ne peut pas être commerçant (Acte uniforme OHADA).
   Les 15-17 ans passent donc par Cap Métier, avec l’accord d’un parent ou tuteur. */
export const AGE_MAJORITE = 18;
export const AGE_MIN_CAP_METIER = 15;
export const AGE_MIN_PAR_PROFIL = { chercheur: AGE_MAJORITE, prestataire: AGE_MAJORITE, mentor: AGE_MAJORITE, jeune: AGE_MIN_CAP_METIER };

export const LIENS_PARENT = ['Mère', 'Père', 'Tuteur ou tutrice légale'];

/** Libellé du rôle affiché sous le nom, dans la coquille. */
export const ROLE_PAR_PROFIL = {
  chercheur: "Chercheur d’emploi",
  prestataire: 'Prestataire',
  entreprise: 'Entreprise',
  jeune: 'Cap Métier',
  mentor: 'Mentor',
  admin: 'Admin LIGGEEY',
};

/** Âge révolu à la date ref, à partir d’une date « AAAA-MM-JJ » (null si vide ou invalide). */
export function ageAu(dateIso, ref = new Date()) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso || '');
  if (!m) return null;
  const [an, mois, jour] = [Number(m[1]), Number(m[2]), Number(m[3])];
  let age = ref.getFullYear() - an;
  if (ref.getMonth() + 1 < mois || (ref.getMonth() + 1 === mois && ref.getDate() < jour)) age -= 1;
  return age >= 0 && age < 120 ? age : null;
}

/** 8 caractères minimum, dont au moins un chiffre. */
export function motDePasseValide(mdp) {
  return typeof mdp === 'string' && mdp.length >= 8 && mdp.length <= 200 && /\d/.test(mdp);
}

export function normaliserEmail(valeur) {
  return String(valeur ?? '').trim().toLowerCase();
}

/**
 * Numéro sénégalais au format international (+221XXXXXXXXX), ou null s’il n’est pas valide.
 * Mobiles 70, 75, 76, 77, 78 et fixes 33, avec ou sans indicatif ; espaces, points et tirets acceptés.
 */
export function normaliserTelephone(valeur) {
  const n = String(valeur ?? '').replace(/[\s.()-]/g, '').replace(/^00/, '+');
  const m = /^(?:\+?221)?((?:7[05678]|33)\d{7})$/.exec(n);
  return m ? `+221${m[1]}` : null;
}

/** Initiales affichées dans l’avatar : « Awa Sarr » → « AS ». */
export function initiales(nom) {
  const mots = String(nom ?? '').trim().split(/\s+/).filter(Boolean);
  if (mots.length === 0) return '?';
  return (mots[0][0] + (mots.length > 1 ? mots[mots.length - 1][0] : '')).toUpperCase();
}
