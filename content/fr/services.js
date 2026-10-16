export const formations = {
  meta: { titre: 'Formations et mentorat', description: 'Formations pratiques avec certificat et mentorat par des professionnels de votre secteur.' },
  hero: {
    surtitre: 'Formations et mentorat',
    titre: 'Apprenez auprès de ceux qui font le métier.',
    texte: 'Des formations pratiques et des mentors expérimentés pour renforcer vos compétences et préparer votre insertion.',
    image: '/images/formations-hero.jpg',
  },
  formations: {
    titre: 'Des formations pratiques',
    texte: '69,5 % des personnes que nous avons interrogées veulent se former sur du concret. Nos formations s’appuient sur des cas réels et se terminent par un certificat.',
    source: 'Source : enquête LIGGEEY auprès de 200 personnes (2026).',
    themesTitre: 'Exemples de thèmes',
    themes: ['Bureautique (Excel)', 'Développement web', 'Leadership', 'Entrepreneuriat', 'Électricité', 'Soudure', 'Peinture'],
    prix: 'Formations et ateliers : 40 000 FCFA par formation. Certaines formations sont incluses dans Premium.',
  },
  mentorat: {
    titre: 'Un mentor à vos côtés',
    texte: 'Un professionnel de votre secteur vous aide à préparer un entretien, à choisir une voie ou à lancer votre activité. Vous réservez un créneau depuis votre espace.',
    source: '49,5 % des personnes interrogées souhaitent un accompagnement personnalisé ou un mentorat. Source : enquête LIGGEEY (2026).',
    domainesTitre: 'Domaines',
    domaines: ['Ressources humaines', 'Marketing', 'Informatique', 'Finance', 'Gestion de projet', 'Droit', 'Comptabilité', 'Entrepreneuriat'],
    prix: 'Les sessions de mentorat collectives sont incluses dans Premium. En tête-à-tête, le mentorat personnalisé coûte 15 000 FCFA la séance.',
  },
  etapes: {
    titre: 'Comment ça marche',
    items: [
      { titre: 'Créez votre compte', texte: 'Talent ou indépendant.' },
      { titre: 'Choisissez', texte: 'Une formation ou un mentor.' },
      { titre: 'Réservez et payez', texte: 'Par Wave ou Orange Money.' },
      { titre: 'Progressez', texte: 'Un certificat à la fin de chaque formation.' },
    ],
  },
  final: { titre: 'Prêt à progresser ?' },
};

export const jobDating = {
  meta: { titre: 'Job Dating', description: 'Chaque trimestre, LIGGEEY réunit talents et entreprises à Dakar pour des entretiens en face à face.' },
  hero: {
    surtitre: 'Job Dating',
    titre: 'Rencontrez les recruteurs en face à face.',
    texte: 'Chaque trimestre, LIGGEEY réunit talents et entreprises pour des échanges directs.',
    image: '/images/job-dating-hero.jpg',
    bouton: 'Je m’inscris au prochain',
  },
  prochain: {
    titre: 'Prochain événement',
    participation: 'Participation',
    inscrire: 'Je m’inscris',
    details: 'Voir le programme',
    vide: 'Aucune date annoncée pour l’instant. Abonnez-vous à la newsletter pour être prévenu en premier.',
    messagePartage: '{titre} le {date} à {lieu} : rencontrez des recruteurs en face à face. Inscription : {lien}',
  },
  etapes: {
    titre: 'Comment ça se passe',
    items: [
      { titre: 'Inscrivez-vous', texte: 'En ligne, en deux minutes.' },
      { titre: 'Payez', texte: '5 000 FCFA par Wave ou Orange Money.' },
      { titre: 'Préparez-vous', texte: 'Nous vous envoyons le programme et nos conseils sur WhatsApp.' },
      { titre: 'Rencontrez', texte: 'Venez avec votre CV et échangez directement avec les recruteurs.' },
    ],
  },
  formulaire: {
    titre: 'Inscription',
    champs: { nom: 'Nom et prénom', telephone: 'Téléphone (WhatsApp)', email: 'E-mail', profil: 'Vous êtes', metier: 'Métier ou domaine', consentement: 'J’accepte la politique de confidentialité.' },
    profils: ['Je cherche un emploi', 'Je travaille à mon compte'],
    bouton: 'Valider mon inscription',
    succes: { titre: 'C’est noté !', texte: 'Il reste à régler les 5 000 FCFA de participation. Vous recevrez ensuite la confirmation et le programme sur WhatsApp.', wave: 'Payer avec Wave', om: 'Payer avec Orange Money', sansLien: 'Le lien de paiement vous sera envoyé sur WhatsApp.' },
  },
  entreprises: { titre: 'Vous recrutez ?', texte: 'Venez rencontrer des candidats lors du prochain Job Dating. Participation incluse dans l’abonnement Entreprise.', bouton: 'Participer en tant qu’entreprise' },
  programme: 'Programme',
  entreprisesParticipantes: 'Entreprises participantes',
};
