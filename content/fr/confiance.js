export const verification = {
  meta: { titre: 'Comment nous vérifions', description: 'Entreprises, offres, diplômes, références : ce que LIGGEEY contrôle avant toute mise en relation, et comment.' },
  hero: {
    surtitre: 'Confiance',
    titre: 'Ce que nous vérifions, et comment.',
    texte: 'Un tiers des personnes que nous avons interrogées ont déjà été victimes d’une fausse offre. Voici ce que notre équipe contrôle avant toute mise en relation.',
    source: 'Source : enquête LIGGEEY auprès de 200 personnes (2026).',
  },
  controles: [
    { icone: 'Building2', titre: 'Les entreprises', texte: 'Avant toute publication, nous vérifions l’existence de l’entreprise : NINEA, RCCM et coordonnées.' },
    { icone: 'FileCheck2', titre: 'Les offres', texte: 'Chaque offre est relue avant d’être publiée : poste, missions, lieu, type de contrat. Une offre douteuse est suspendue.' },
    {
      icone: 'ShieldCheck',
      titre: 'Les profils',
      texte: 'Pour le badge « Profil vérifié », vous envoyez une pièce d’identité et vos diplômes. Nous contrôlons :',
      liste: ['le nom, identique à celui du profil', 'un document lisible et complet', 'une institution identifiable', 'la date et la signature', 'la cohérence avec les compétences déclarées'],
      delai: 'Délai : 48 h ouvrées.',
    },
    { icone: 'ClipboardCheck', titre: 'Les références et compétences', texte: 'Pour un recrutement accompagné, nous contactons les références et évaluons les compétences liées au poste, par un entretien avec un conseiller et une mise en situation pratique. Pour les indépendants : certifications et réalisations vérifiées.' },
  ],
  ensuite: [
    { titre: 'Après l’embauche', texte: 'Pendant le suivi, la recrue peut nous signaler un problème, comme un salaire en retard, des missions différentes de l’offre ou des conditions de travail.' },
    { titre: 'Ce que nous préparons', texte: 'Des partenariats avec les universités, les écoles et les institutions pour vérifier les diplômes à la source.' },
    { titre: 'Vos données', texte: 'Vos documents servent uniquement à la vérification et à la mise en relation. Ils ne sont jamais vendus ni partagés sans votre accord.' },
  ],
  final: { titre: 'La confiance, ça se vérifie.' },
};

export const apropos = {
  meta: { titre: 'À propos', description: 'LIGGEEY veut dire « travail » en wolof. Notre mission : rendre l’insertion professionnelle plus facile et plus juste au Sénégal.' },
  hero: {
    surtitre: 'À propos',
    titre: '« Liggeey » veut dire « travail » en wolof.',
    texte: 'Notre mission : rendre l’insertion professionnelle plus facile et plus juste au Sénégal, en rapprochant les compétences des opportunités.',
    image: '/images/a-propos-hero.jpg',
  },
  histoire: {
    titre: 'Tout est parti d’un paradoxe.',
    citation: 'Des talents cherchent des opportunités. Des entreprises cherchent des compétences.',
    paragraphes: [
      'Pourtant, la rencontre entre les deux n’est ni simple, ni rapide, ni sûre.',
      'Un jeune diplômé entend « expérience exigée », même pour un stage. Une cuisinière expérimentée n’a aucun document pour prouver son savoir-faire. Un recruteur passe des jours à trier des candidatures.',
      'Nous avons voulu un espace qui rapproche ces mondes et rend leur rencontre plus fiable. C’est ainsi qu’est né LIGGEEY.',
    ],
  },
  difference: { titre: 'Notre différence', texte: 'Plus qu’un site d’offres : nous valorisons les compétences, vérifions les offres et les profils, et accompagnons chaque parcours, avant, pendant et après l’embauche.' },
  valeurs: {
    titre: 'Nos valeurs',
    items: [
      { icone: 'Smartphone', titre: 'Accessibilité', texte: 'Des tarifs accessibles, un site simple sur téléphone, un bureau pour le face-à-face.' },
      { icone: 'ShieldCheck', titre: 'Confiance', texte: 'Des offres et des profils vérifiés, des données protégées.' },
      { icone: 'GraduationCap', titre: 'Professionnalisation', texte: 'Formations, mentorat et formalisation des activités.' },
      { icone: 'HeartHandshake', titre: 'Accompagnement', texte: 'Une équipe humaine à chaque étape.' },
    ],
  },
  equipe: {
    titre: 'L’équipe',
    // Photos à déposer dans /public/images/equipe/ (carrées, 400 × 400 px).
    membres: [
      { nom: 'Salimata MARENA', role: 'Cofondatrice, marketing et commercial', photo: '/images/equipe/salimata-marena.jpg' },
      { nom: 'Seynabou KA', role: 'Cofondatrice, développement et design UX/UI', photo: '/images/equipe/seynabou-ka.jpg' },
      { nom: 'Wagui DIANKHA', role: 'Chef de projet', photo: '/images/equipe/wagui-diankha.jpg' },
      { nom: 'Bamba DIOP', role: 'Comptable', photo: '/images/equipe/bamba-diop.jpg' },
    ],
  },
  bureau: { titre: 'Le bureau', texte: 'À Dakar, notre bureau d’accueil reçoit celles et ceux qui préfèrent être accompagnés en personne.' },
  partenaires: { titre: 'Construisons ensemble.', texte: 'Universités, écoles de formation, institutions : rejoignez-nous pour faire connaître LIGGEEY aux étudiants et renforcer la vérification des diplômes.', bouton: 'Devenir partenaire' },
};
