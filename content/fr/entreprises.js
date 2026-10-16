export const entreprises = {
  meta: {
    titre: 'Pour les entreprises',
    description: 'Recrutement accompagné au Sénégal : analyse du besoin, préqualification, short-list, puis suivi de votre recrue pendant 90 jours.',
  },
  hero: {
    surtitre: 'Pour les entreprises',
    titre: 'Recrutez les bons profils. Nous faisons le tri.',
    texte: 'LIGGEEY analyse votre besoin, préqualifie les candidats et vous présente une short-list. Après l’embauche, nous suivons l’intégration de votre recrue pendant 90 jours.',
    image: '/images/entreprises-hero.jpg',
  },
  constat: {
    titre: 'Trouver le bon profil prend du temps.',
    texte: 'Trier les candidatures, vérifier les diplômes, évaluer les compétences : les recruteurs que nous avons rencontrés décrivent une étape longue, surtout pour les profils spécialisés.',
    source: 'Source : entretiens menés par LIGGEEY auprès de deux structures dakaroises (2026).',
  },
  recrutement: {
    titre: 'Le recrutement accompagné, en quatre étapes',
    items: [
      { titre: 'Analyse du besoin', texte: 'Nous définissons avec vous le poste, les compétences et le profil recherché.' },
      { titre: 'Publication et recherche', texte: 'Votre offre est publiée et nous identifions les profils qui correspondent.' },
      { titre: 'Préqualification', texte: 'Identité, diplômes, références et compétences sont vérifiés.' },
      { titre: 'Short-list', texte: 'Vous recevez une sélection de profils conformes à vos critères.' },
    ],
  },
  suivi: {
    titre: 'Après l’embauche, nous restons là.',
    texte: 'Pendant 90 jours, nous recueillons les retours de votre recrue et les vôtres. Si une compétence est à renforcer, nous proposons une formation ciblée.',
    jalons: [
      { jour: 'J+7', titre: 'Point de la première semaine' },
      { jour: 'J+30', titre: 'Bilan du premier mois' },
      { jour: 'J+60', titre: 'Point à mi-parcours' },
      { jour: 'J+90', titre: 'Fin de la période d’essai' },
    ],
    prix: 'Suivi post-embauche : 25 000 FCFA par recrue.',
  },
  jobDating: { texte: 'Rencontrez des candidats en face à face lors de nos Job Dating, chaque trimestre.', lien: 'Voir les prochaines dates' },
  tarifs: {
    titre: 'Tarifs',
    items: [
      { titre: 'Abonnement Entreprise', prix: '40 000 FCFA', unite: '/ mois', texte: 'Publication de vos offres, sélection et short-list des profils par LIGGEEY.' },
      { titre: 'Suivi post-embauche', prix: '25 000 FCFA', unite: '/ recrue', texte: 'L’intégration de votre recrue suivie pendant 90 jours.' },
    ],
    note: 'Paiement par Wave ou Orange Money. Facture mensuelle envoyée par e-mail.',
  },
  faq: [
    { q: 'Comment les candidats sont-ils vérifiés ?', r: 'Notre équipe contrôle l’identité, les diplômes et les références, et évalue les compétences. Tout est détaillé sur notre page « Comment nous vérifions ».' },
    { q: 'Puis-je publier mes offres moi-même ?', r: 'Oui, l’abonnement Entreprise inclut la publication d’offres. Nous nous chargeons ensuite de la sélection et de la short-list.' },
    { q: 'Je suis un particulier employeur. Est-ce pour moi ?', r: 'Oui, l’espace recruteur est ouvert aux entreprises comme aux particuliers.' },
  ],
  final: { titre: 'Parlons de votre prochain recrutement.' },
};

export const demo = {
  meta: { titre: 'Demander une démo', description: 'Présentez votre besoin de recrutement : LIGGEEY vous recontacte pour une démonstration.' },
  titre: 'Demander une démo',
  texte: 'Dites-nous ce que vous cherchez. Nous vous recontactons {delai} pour vous présenter LIGGEEY.',
  champs: {
    nom: 'Nom et prénom',
    entreprise: 'Entreprise',
    secteur: 'Secteur d’activité',
    taille: 'Nombre de salariés',
    postes: 'Poste(s) à pourvoir',
    interets: 'Ce qui vous intéresse',
    telephone: 'Téléphone (WhatsApp)',
    email: 'E-mail professionnel',
    message: 'Votre message',
    consentement: 'J’accepte d’être recontacté au sujet de ma demande.',
  },
  interets: ['Recrutement accompagné', 'Publication d’offres', 'Suivi post-embauche', 'Job Dating'],
  bouton: 'Envoyer ma demande',
  obligatoire: '* Champ obligatoire',
  succes: { titre: 'Merci, votre demande est envoyée.', texte: 'Nous vous recontactons {delai} par téléphone ou sur WhatsApp.' },
  aside: { titre: 'Vous préférez écrire ?', rappel: 'Abonnement Entreprise 40 000 FCFA / mois · suivi post-embauche 25 000 FCFA / recrue.' },
};
