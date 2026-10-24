/**
 * Configuration générale du site.
 *
 * ⚠️ VALEURS PROVISOIRES : le numéro, l’e-mail, les horaires et les mentions
 * légales ci-dessous sont fictifs ou déduits du mémoire. À remplacer avant la
 * mise en ligne (liste complète dans README.md).
 */
export const site = {
  nom: 'LIGGEEY',
  slogan: "Rendons l’insertion plus facile et plus juste.",
  description:
    "LIGGEEY, plateforme sénégalaise d’insertion professionnelle : offres vérifiées, valorisation des compétences et accompagnement humain pour les talents, les indépendants et les entreprises.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://liggeey.sn',
  // Plateforme intégrée au site (/plateforme). Mettre l’adresse de l’app quand elle sera déployée à part.
  appUrl: process.env.NEXT_PUBLIC_APP_URL || '/plateforme',

  contact: {
    whatsapp: '221770000000', // format wa.me : indicatif + numéro, sans « + » ni espaces (FICTIF)
    whatsappAffiche: '+221 77 000 00 00', // (FICTIF)
    email: 'contact@liggeey.sn', // (FICTIF)
    // Pied de page : une icône par réseau qui a une adresse (noms reconnus : LinkedIn, Facebook,
    // Instagram, TikTok, YouTube, X ; voir components/ui/IconeReseau.jsx). Sans adresse, l’icône s’affiche sans lien.
    reseaux: [
      { nom: 'LinkedIn', url: '' },
      { nom: 'Facebook', url: '' },
      { nom: 'Instagram', url: '' },
      { nom: 'TikTok', url: '' },
    ],
  },

  bureau: {
    nom: "Bureau d’accueil LIGGEEY",
    adresse: 'Hann Maristes 1, Îlot J, Villa n° 63', // siège prévu dans le mémoire
    ville: 'Dakar',
    pays: 'Sénégal',
    horaires: [
      { jours: 'Du lundi au vendredi', heures: '9 h – 18 h' }, // (FICTIF)
      { jours: 'Le samedi', heures: '9 h – 13 h' }, // (FICTIF)
    ],
    horairesCourts: 'Lun.–ven. 9 h – 18 h · sam. 9 h – 13 h',
  },

  delais: {
    demo: 'sous 48 h ouvrées',
    contact: 'sous 24 h ouvrées',
    verification: '48 h ouvrées',
  },

  legal: {
    raisonSociale: 'LIGGEEY SARL',
    capital: '1 000 000 FCFA',
    siege: 'Hann Maristes 1, Îlot J, Villa n° 63, Dakar',
    ninea: "En cours d’attribution",
    rccm: "En cours d’attribution",
    directionPublication: 'La gérante de LIGGEEY SARL',
    hebergeur: 'Vercel Inc.',
    miseAJour: '15 octobre 2026',
  },
};
