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
  // Pas de lien « Accueil » dans l’en-tête : le logo y ramène (le menu mobile garde « Accueil »)
  nav: [...parcours, ...services, { href: '/contact', label: 'Contact' }],
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
  pied: {
    inscription: 'Créer mon compte',
    reseaux: { titre: 'Suivez-nous', nouvelOnglet: 'nouvel onglet' },
    contact: { titre: 'Nous contacter', whatsapp: 'WhatsApp', email: 'E-mail', bureau: "Bureau d’accueil", horaires: 'Horaires' },
  },
  newsletter: {
    titre: 'Recevez nos nouveaux articles',
    texte: 'Conseils emploi, compétences et recrutement, et les dates des prochains Job Dating.',
    champ: 'Votre adresse e-mail',
    bouton: "Je m’abonne",
    succes: "C’est fait ! Vous recevrez notre prochain envoi.",
  },
};
