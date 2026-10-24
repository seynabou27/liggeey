import { site } from './site';

/** Correspondance entre les parcours du site et les profils de l’application. */
export const PROFILS = {
  talent: 'chercheur',
  independant: 'prestataire',
  entreprise: 'entreprise',
};

/** Inscription dans l’app, avec le profil déjà sélectionné si on le connaît. */
export function lienInscription(profil, extra = {}) {
  const params = new URLSearchParams(extra);
  if (profil) params.set('profil', PROFILS[profil] ?? profil);
  const q = params.toString();
  return `${site.appUrl}/inscription${q ? `?${q}` : ''}`;
}

export function lienConnexion() {
  return `${site.appUrl}/connexion`;
}

/*
 * Règle : le site ne renvoie vers la plateforme que par la connexion ou l’inscription.
 * Les offres se consultent sur le site (vitrine de l’accueil, filtrée par l’adresse) ;
 * pour aller plus loin, il faut se connecter.
 */

/** Offres de la vitrine de l’accueil, filtrées (secteur, ville…). */
export function lienOffresSite(filtres = {}) {
  const params = new URLSearchParams(Object.entries(filtres).filter(([, v]) => v));
  const q = params.toString();
  return `/${q ? `?${q}` : ''}#offres`;
}

/** Une offre de la vitrine, ouverte dans sa fenêtre de détail (liens partagés). */
export function lienOffre(id) {
  return lienOffresSite({ offre: id });
}

/** Adresse complète (partages WhatsApp), même quand la plateforme est servie par le site (/plateforme). */
export function lienAbsolu(chemin) {
  return /^https?:\/\//.test(chemin) ? chemin : `${site.url}${chemin}`;
}

/** Ouvre une conversation WhatsApp avec LIGGEEY, message prérempli. */
export function lienWhatsApp(message = "Bonjour LIGGEEY, j’ai une question : ") {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Partage d’un texte sur WhatsApp (offres, Job Dating). */
export function lienPartageWhatsApp(texte) {
  return `https://wa.me/?text=${encodeURIComponent(texte)}`;
}

const adresseComplete = () => `${site.bureau.adresse}, ${site.bureau.ville}, ${site.bureau.pays}`;

export function lienItineraire() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresseComplete())}`;
}

export function lienCarteEmbed() {
  return `https://www.google.com/maps?q=${encodeURIComponent(adresseComplete())}&output=embed`;
}
