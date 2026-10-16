/** Textes communs à toutes les pages (en-tête, menu, pied de page, newsletter). */

const parcours = [
  { href: '/talents', label: 'Talents' },
  { href: '/independants', label: 'Indépendants' },
  { href: '/entreprises', label: 'Entreprises' },
];
const services = [
  { href: '/formations-mentorat', label: 'Formations et mentorat' },
  { href: '/job-dating', label: 'Job Dating' },
  { href: '/tarifs', label: 'Tarifs' },
];
const liggeey = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/verification', label: 'Comment nous vérifions' },
  { href: '/ressources', label: 'Ressources' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export const commun = {
  nav: [{ href: '/', label: 'Accueil' }, ...parcours, ...services],
  groupes: [
    { titre: 'Parcours', liens: parcours },
    { titre: 'Services', liens: services },
    { titre: 'LIGGEEY', liens: liggeey },
  ],
  legal: [
    { href: '/mentions-legales', label: 'Mentions légales' },
    { href: '/cgu', label: 'CGU' },
    { href: '/confidentialite', label: 'Confidentialité' },
  ],
  connexion: 'Connexion',
  inscription: 'Inscription',
  whatsapp: { libelle: 'Une question ?', aria: 'Écrire à LIGGEEY sur WhatsApp' },
  aide: { titre: "Besoin d'aide ?", whatsapp: ['Écrivez-nous', 'WhatsApp'], bureau: ['Venez nous voir', "Bureau d'accueil"] },
  paiement: 'Paiement',
  newsletter: {
    titre: 'Recevez nos nouveaux articles',
    texte: 'Conseils emploi, compétences et recrutement, et les dates des prochains Job Dating.',
    champ: 'Votre adresse e-mail',
    bouton: "Je m'abonne",
    mention: 'Désabonnement en un clic.',
    succes: "C'est fait ! Vous recevrez notre prochain envoi.",
  },
};
