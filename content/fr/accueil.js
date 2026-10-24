/** Page d’accueil. Les noms d’icônes correspondent à components/ui/Icone.jsx. */
export const accueil = {
  meta: {
    titre: "LIGGEEY · Rendons l’insertion plus facile et plus juste",
    description:
      'Offres d’emploi vérifiées, valorisation des compétences et accompagnement humain au Sénégal. Pour les talents, les indépendants et les entreprises.',
  },
  hero: {
    surtitre: 'Emploi, compétences et accompagnement au Sénégal',
    titre: "Rendons l’insertion plus facile et plus juste.",
    texte: 'Des offres vérifiées, un profil qui montre ce que vous savez faire, et une équipe qui vous accompagne.',
    reperes: [
      { valeur: '90', unite: 'j', libelle: "de suivi après l’embauche" },
      { valeur: '48', unite: 'h', libelle: 'pour vérifier un profil' },
      { valeur: '100', unite: '%', libelle: 'des offres vérifiées avant publication' },
    ],
    image: '/images/accueil-hero.jpg',
  },
  recherche: {
    titre: 'Trouvez un emploi avec',
    marque: 'LIGGEEY',
    motCle: 'Rechercher un métier, un mot-clé…',
    secteur: 'Secteur',
    contrat: 'Type de contrat',
    ville: 'Ville',
    experience: 'Expérience',
    niveau: "Niveau d’études",
    tous: 'Tous',
    tousNiveaux: 'Tous niveaux, avec ou sans diplôme',
    bouton: 'Rechercher',
  },
  parcours: {
    intro: 'Une plateforme, trois parcours : choisissez le vôtre.',
    items: [
      { href: '/talents', label: 'Je cherche un emploi', icone: 'Briefcase' },
      { href: '/independants', label: 'Je travaille à mon compte', icone: 'Hammer' },
      { href: '/entreprises', label: 'Je recrute', icone: 'Building2' },
    ],
  },
  offres: {
    titre: 'Des offres vérifiées, en ce moment',
    texte: "Chaque offre est contrôlée par notre équipe avant d’être publiée.",
    badge: 'Entreprise vérifiée',
    voir: "Voir l’offre",
    partager: 'Partager sur WhatsApp',
    messagePartage: 'Offre vérifiée sur LIGGEEY : {titre} chez {entreprise}, {ville}.',
    toutes: 'Se connecter pour voir toutes les offres',
    sansResultat: "Pas d’offre en vitrine pour cette recherche. Créez votre compte pour voir toutes les offres.",
    aucune: 'Les premières offres vérifiées arrivent. Créez votre compte pour être prévenu.',
    effacer: 'Effacer la recherche',
    glisser: 'Faites glisser pour voir les autres offres.',
    detail: {
      fermer: 'Fermer',
      lieu: 'Lieu',
      contrat: 'Contrat',
      secteur: 'Secteur',
      experience: 'Expérience',
      niveau: "Niveau d’études",
      competences: 'Compétences recherchées',
      verifiee: "Cette offre a été vérifiée par l’équipe LIGGEEY avant sa publication.",
      connexionTitre: 'Connectez-vous pour postuler',
      connexionTexte: "Pour voir l’offre complète et envoyer votre candidature, connectez-vous à votre espace LIGGEEY.",
      connexion: 'Se connecter',
      inscription: 'Créer un compte',
      pasDeCompte: 'Pas encore de compte ?',
    },
  },
  secteurs: {
    titre: 'Explorer par secteur',
    texte: 'Un clic, et vous voyez les offres vérifiées du secteur.',
    lien: 'Voir les offres',
  },
  etapes: {
    titre: 'Comment ça marche',
    texte: 'Quelques étapes simples, que vous cherchiez un emploi ou que vous recrutiez.',
    capture: '/images/app-capture-connexion.png',
    talents: {
      titre: 'Talents et indépendants',
      items: [
        { icone: 'User', titre: 'Créez votre compte', texte: 'En quelques minutes, depuis votre téléphone.' },
        { icone: 'Award', titre: 'Montrez ce que vous savez faire', texte: 'Diplômes, expériences, savoir-faire : votre profil met vos compétences en avant.' },
        { icone: 'BadgeCheck', titre: 'Postulez en confiance', texte: 'Des offres vérifiées, et chaque candidature suivie : reçue, vue, entretien, réponse.' },
        { icone: 'GraduationCap', titre: 'Progressez', texte: 'Formations pratiques et mentorat pour aller plus loin.' },
      ],
    },
    entreprises: {
      titre: 'Entreprises',
      items: [
        { icone: 'Target', titre: 'Analyse du besoin', texte: 'Nous définissons avec vous le poste, les compétences et le profil recherché.' },
        { icone: 'ShieldCheck', titre: 'Préqualification', texte: 'Identité, diplômes, références et compétences sont vérifiés.' },
        { icone: 'ListChecks', titre: 'Short-list', texte: 'Vous recevez une sélection de profils conformes à vos critères.' },
        { icone: 'HeartHandshake', titre: 'Suivi pendant 90 jours', texte: "Nous accompagnons l’intégration de votre recrue." },
      ],
    },
  },
  constat: {
    surtitre: 'Pourquoi LIGGEEY',
    titre: 'Trouver un emploi ne devrait pas dépendre de qui vous connaissez.',
    texte:
      "Nous avons interrogé 200 personnes en 2026. Leurs réponses montrent ce qui freine l’accès à l’emploi, et ce que LIGGEEY veut changer.",
    chiffres: [
      { valeur: '78,5', unite: '%', texte: 'citent le manque de réseau parmi leurs difficultés.' },
      { valeur: '33,5', unite: '%', texte: "ont déjà été victimes d’une fausse offre d’emploi ou d’une arnaque." },
      { valeur: '81,5', unite: '%', texte: 'ne se sentent pas assez accompagnés dans leur parcours.' },
      { valeur: '22,9', unite: '%', texte: 'taux de chômage élargi au Sénégal, 1er trimestre 2026.' },
    ],
    // ⚠️ Chiffre ANSD à revérifier à la source avant publication.
    sources:
      "Sources : enquête LIGGEEY auprès de 200 personnes (2026) ; ANSD, Enquête nationale sur l’emploi au Sénégal, 1er trimestre 2026.",
    lien: { href: '/a-propos', label: 'Pourquoi LIGGEEY existe' },
  },
  video: {
    titre: 'LIGGEEY en vidéo',
    texte: 'Découvrez comment LIGGEEY vous accompagne, de la création du profil à l’embauche.',
    image: '/images/bande-constat.jpg',
    // Lien YouTube (ou fichier .mp4 dans /public/videos) de la vidéo de présentation. Vide : la bande vidéo n’est pas affichée.
    src: '',
    lire: 'Lire la vidéo de présentation',
    bientot: 'Vidéo bientôt disponible',
    fermer: 'Fermer la vidéo',
  },
  engagements: {
    titre: 'Nos engagements',
    texte: 'Ce sur quoi vous pouvez compter, à chaque étape.',
    items: [
      { icone: 'BadgeCheck', titre: 'Des offres vérifiées', texte: 'Chaque entreprise et chaque offre sont contrôlées avant publication.' },
      { icone: 'Lock', titre: 'Vos données protégées', texte: "Vos documents servent à vérifier votre profil, rien d’autre." },
      { icone: 'Eye', titre: 'Un suivi transparent', texte: 'Vous voyez où en est chaque candidature.' },
      { icone: 'Headphones', titre: 'Une équipe joignable', texte: "Sur WhatsApp ou à notre bureau de Dakar, quelqu’un vous répond." },
      { icone: 'Smartphone', titre: 'Un paiement simple', texte: 'Wave et Orange Money, directement depuis votre téléphone.' },
    ],
    lien: { href: '/verification', label: 'Comment nous vérifions' },
  },
  avenir: {
    jobDating: {
      titre: 'Prochain Job Dating',
      texte: 'Rencontrez des recruteurs en face à face.',
      bouton: "Je m’inscris",
      vide: 'Le prochain Job Dating sera annoncé ici. Abonnez-vous à la newsletter pour être prévenu.',
    },
    formations: {
      titre: 'Formations et mentorat',
      texte: 'Des formations pratiques et des mentors du métier pour progresser.',
      lien: 'Voir les formations',
      image: '/images/formation.jpg',
    },
  },
};
