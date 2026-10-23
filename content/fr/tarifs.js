/**
 * Tarifs. Montants du brief, affichés tels quels.
 * ⚠️ Unités (par mois, par séance…) et contenu détaillé des formules : PROVISOIRES.
 */
export const tarifs = {
  meta: { titre: 'Tarifs', description: 'Pack Essentiel 1 500 FCFA/mois, Premium 3 000 FCFA/mois, abonnement Entreprise 40 000 FCFA/mois. Paiement Wave et Orange Money.' },
  hero: {
    surtitre: 'Tarifs',
    titre: 'Des tarifs clairs, pour chacun',
    texte: 'Tous nos prix au même endroit. Paiement par Wave ou Orange Money, depuis votre téléphone.',
    image: '/images/tarifs-hero.jpg',
    inscription: 'Créer mon compte',
    demo: 'Vous recrutez ? Demander une démo',
  },
  formules: [
    {
      id: 'essentiel',
      nom: 'Pack Essentiel',
      prix: '1 500 FCFA',
      unite: '/ mois',
      accroche: 'Pour démarrer : les fonctionnalités essentielles de la plateforme.',
      avantages: ['Profil complet et badge « Profil vérifié »', 'Offres vérifiées', '5 candidatures par mois', 'Suivi des candidatures', 'Formations gratuites avec certificat', 'Guide de formalisation en ligne'],
      bouton: 'Choisir Essentiel',
    },
    {
      id: 'premium',
      nom: 'Premium',
      prix: '3 000 FCFA',
      unite: '/ mois',
      etiquette: 'Mentorat inclus',
      accroche: 'Pour aller plus loin : fonctionnalités avancées, mentorat, certaines formations.',
      avantages: ['Tout le Pack Essentiel', 'Candidatures illimitées', 'Profil mis en avant auprès des recruteurs', 'Sessions de mentorat collectives', 'Formations premium incluses', 'Voir qui a consulté votre profil'],
      bouton: 'Choisir Premium',
    },
  ],
  entreprise: {
    nom: 'Abonnement Entreprise',
    prix: '40 000 FCFA',
    unite: '/ mois',
    accroche: 'Publication d’offres, sélection et short-list des profils par LIGGEEY.',
    bouton: 'Demander une démo',
  },
  onglets: ['Talents et indépendants', 'Entreprises'],
  services: {
    titre: 'Services à la carte',
    items: [
      { nom: 'Mentorat personnalisé', prix: '15 000 FCFA', unite: '/ séance', texte: 'Un accompagnement individuel, adapté à votre profil et à vos objectifs.' },
      { nom: 'Formations et ateliers', prix: '40 000 FCFA', unite: '/ formation', texte: 'Des formations pratiques pour renforcer votre employabilité.' },
      { nom: 'Suivi post-embauche', prix: '25 000 FCFA', unite: '/ recrue', texte: 'L’intégration de votre recrue suivie pendant 90 jours.' },
      { nom: 'Job Dating', prix: '5 000 FCFA', unite: '/ participant', texte: 'Une rencontre directe entre candidats et entreprises.' },
      { nom: 'Accompagnement à la formalisation', prix: '5 000 FCFA', unite: '/ dossier', texte: 'Les démarches pour déclarer votre activité, expliquées et suivies.' },
      { nom: 'Publicité pour les marques affiliées', prix: '25 000 FCFA', unite: '/ campagne', texte: 'Faites connaître votre marque auprès des utilisateurs de la plateforme.' },
    ],
  },
  paiement: {
    titre: 'Payer simplement',
    texte: 'Wave et Orange Money, directement depuis votre téléphone.',
    // Repris des réponses de la FAQ ci-dessous
    points: ['Paiement depuis votre espace LIGGEEY', 'Sans engagement : changez ou arrêtez quand vous voulez', 'Votre formule reste active jusqu’à la fin du mois payé'],
  },
  guide: {
    titre: 'Quelle formule pour moi ?',
    q1: 'Vous êtes…',
    profils: [
      { id: 'talent', label: 'Je cherche un emploi' },
      { id: 'independant', label: 'Je travaille à mon compte' },
      { id: 'entreprise', label: 'Je recrute' },
    ],
    q2: 'Votre priorité ?',
    priorites: [
      { id: 'postuler', label: 'Chercher et postuler' },
      { id: 'mentor', label: 'Être conseillé par un mentor' },
      { id: 'former', label: 'Me former' },
      { id: 'formaliser', label: 'Formaliser mon activité', seulement: 'independant' },
    ],
    conseil: 'Notre conseil',
    resultats: {
      postuler: { titre: 'Pack Essentiel · 1 500 FCFA / mois', texte: 'Tout ce qu’il faut pour chercher, postuler et suivre vos candidatures.' },
      mentor: { titre: 'Premium · 3 000 FCFA / mois', texte: 'Les sessions de mentorat collectives sont incluses. Séance individuelle possible à 15 000 FCFA.' },
      former: { titre: 'Premium · 3 000 FCFA / mois', texte: 'Formations premium incluses, en plus des formations gratuites.' },
      formaliser: { titre: 'Accompagnement à la formalisation · 5 000 FCFA', texte: 'Nous vous guidons dans chaque démarche, jusqu’à votre immatriculation.' },
      entreprise: { titre: 'Abonnement Entreprise · 40 000 FCFA / mois', texte: 'Publication d’offres et short-list de profils préqualifiés. Suivi post-embauche en option.' },
    },
    recommencer: 'Recommencer',
  },
  faq: [
    { q: 'Comment payer ?', r: 'Par Wave ou Orange Money, depuis votre espace LIGGEEY.' },
    { q: 'Puis-je changer de formule ou arrêter ?', r: 'Oui, sans engagement : changez de formule ou arrêtez quand vous voulez depuis votre espace. Votre formule reste active jusqu’à la fin du mois payé.' },
    { q: 'Y a-t-il des réductions ?', r: 'Des réductions ponctuelles peuvent être proposées, par exemple au lancement ou pour les étudiants.' },
  ],
};
