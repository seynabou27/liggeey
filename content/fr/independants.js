export const independants = {
  meta: {
    titre: 'Pour les indépendants',
    description: 'Restauration, coiffure, artisanat : formalisez votre activité ou faites reconnaître votre savoir-faire pour trouver un emploi.',
  },
  hero: {
    surtitre: 'Pour les indépendants',
    titre: 'Votre savoir-faire mérite d’être reconnu.',
    texte: 'Restauration, coiffure, artisanat… Vous travaillez à votre compte ? LIGGEEY vous accompagne pour formaliser votre activité, ou pour faire reconnaître vos compétences et trouver un emploi.',
    image: '/images/independants-hero.jpg',
    choixA: 'Formaliser mon activité',
    choixB: 'Trouver un emploi',
    audio: 'Écouter la présentation en wolof',
  },
  constat: {
    valeur: '70 %',
    titre: 'Des années de pratique, mais aucun papier pour le prouver ?',
    texte: 'C’est le cas de 70 % des personnes que nous avons interrogées : aucun document officiel lié à leur activité. Votre expérience a pourtant de la valeur.',
    source: 'Source : enquête LIGGEEY auprès de 200 personnes (2026).',
  },
  cheminA: {
    lettre: 'A',
    titre: 'Formaliser mon activité',
    texte: 'Une activité déclarée rassure vos clients et les entreprises. Nous vous expliquons chaque démarche et vous orientons vers les bons guichets.',
    etapes: [
      { titre: 'Pièce d’identité', texte: 'Carte d’identité ou passeport en cours de validité.' },
      { titre: 'NINEA', texte: 'L’identifiant de votre activité auprès de l’administration fiscale.' },
      { titre: 'Immatriculation', texte: 'Registre des métiers pour les artisans, RCCM pour une activité commerciale.' },
      { titre: 'Régime fiscal', texte: 'Celui qui s’applique selon votre chiffre d’affaires.' },
      { titre: 'Protection sociale', texte: 'Retraite ou mutuelle de santé. Facultatif.' },
      { titre: 'Assurance', texte: 'Responsabilité civile professionnelle. Facultatif.' },
    ],
    prix: 'Accompagnement à la formalisation : 5 000 FCFA par dossier.',
    note: 'Les démarches officielles se font auprès des organismes compétents. LIGGEEY vous accompagne et vous oriente.',
    bouton: 'Être accompagné',
  },
  cheminB: {
    lettre: 'B',
    titre: 'Faire reconnaître mes compétences',
    texte: 'Pas de diplôme ? Votre expérience compte. Montrez vos réalisations, faites évaluer vos compétences et accédez à des offres d’entreprises vérifiées.',
    items: [
      { icone: 'Camera', titre: 'Vos réalisations en photos', texte: 'Un profil qui montre votre travail.' },
      { icone: 'ClipboardCheck', titre: 'Des compétences évaluées', texte: 'Entretien avec un conseiller et mise en situation pratique, en ligne ou au bureau.' },
      { icone: 'BadgeCheck', titre: 'Des offres vérifiées', texte: 'Des entreprises identifiées et contrôlées.' },
      { icone: 'GraduationCap', titre: 'Des formations', texte: 'Pour aller plus loin dans votre métier.' },
    ],
    bouton: 'Créer mon profil',
  },
  wolof: {
    titre: 'Expliqué en wolof',
    texte: 'De courtes vidéos pour tout comprendre, sans avoir à lire.',
    // ⚠️ Vidéos à produire : renseigner « src » (fichier dans /public/videos ou lien YouTube) quand elles existent. Sans « src », la vidéo n’est pas affichée (et la section disparaît s’il n’y en a aucune).
    videos: [
      { id: 'presentation', titre: 'C’est quoi LIGGEEY ?', duree: '1 min', src: '' },
      { id: 'formalisation', titre: 'Formaliser mon activité', duree: '2 min', src: '' },
      { id: 'profil', titre: 'Créer mon profil sur mon téléphone', duree: '2 min', src: '' },
    ],
    bientot: 'Vidéo bientôt disponible',
  },
  aide: {
    titre: 'On le fait avec vous',
    texte: 'Au bureau de Dakar, un conseiller crée votre profil avec vous et répond à vos questions. Sur WhatsApp aussi, on vous répond.',
  },
  faq: [
    { q: 'LIGGEEY fait-il les démarches à ma place ?', r: 'Nous vous expliquons chaque étape, préparons les dossiers avec vous et vous orientons vers les bons organismes. Les démarches restent à votre nom.' },
    { q: 'Sans diplôme, puis-je trouver un emploi ?', r: 'Oui. Votre profil met en avant votre expérience et vos réalisations, et vos compétences peuvent être évaluées.' },
    { q: 'Je ne suis pas à l’aise avec Internet.', r: 'Venez au bureau ou écrivez-nous sur WhatsApp : nous vous aidons à chaque étape.' },
  ],
  final: { titre: 'Choisissez votre chemin.' },
};
