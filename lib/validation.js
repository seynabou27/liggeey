/** Validations partagées par les formulaires (navigateur) et l'API (serveur). */

export function estEmail(valeur) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valeur ?? '').trim());
}

/**
 * Numéro sénégalais : mobiles 70, 75, 76, 77, 78 et fixes 33,
 * avec ou sans indicatif +221. Espaces, points et tirets acceptés.
 */
export function estTelephone(valeur) {
  const n = String(valeur ?? '').replace(/[\s.-]/g, '');
  return /^(\+?221)?(7[05678]|33)\d{7}$/.test(n);
}

export const MESSAGES = {
  requis: 'Ce champ est obligatoire.',
  email: 'Indiquez une adresse e-mail valide.',
  telephone: 'Indiquez un numéro valide, par exemple +221 77 000 00 00.',
  consentement: 'Merci de cocher cette case pour continuer.',
};

/**
 * Vérifie un formulaire.
 * @param {Record<string, any>} donnees valeurs saisies
 * @param {string[]} requis champs obligatoires
 * @returns {Record<string, string>} erreurs par champ (vide si tout va bien)
 */
export function verifier(donnees, requis = []) {
  const erreurs = {};
  for (const champ of requis) {
    const v = donnees[champ];
    if (v === undefined || v === null || String(v).trim() === '' || v === false) {
      erreurs[champ] = champ === 'consentement' ? MESSAGES.consentement : MESSAGES.requis;
    }
  }
  if (donnees.email && !erreurs.email && !estEmail(donnees.email)) erreurs.email = MESSAGES.email;
  if (donnees.telephone && !erreurs.telephone && !estTelephone(donnees.telephone)) erreurs.telephone = MESSAGES.telephone;
  return erreurs;
}
