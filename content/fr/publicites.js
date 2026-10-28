/**
 * Publicités des marques affiliées (service « Publicité pour les marques affiliées », 25 000 FCFA / campagne).
 *
 * Une bannière ne s’affiche que pendant sa campagne. Sans campagne en cours, aucun emplacement n’apparaît.
 *
 * Emplacements :
 * - 'accueil' : sous la vitrine des offres de l’accueil ;
 * - 'ressources' : en fin d’article, dans les Ressources ;
 * - 'tableau-de-bord' : en bas du tableau de bord de la plateforme (chercheur, prestataire, entreprise).
 *   Jamais dans l’espace Cap Métier (mineurs), ni chez les mentors et l’admin, ni pour les comptes de démonstration.
 *
 * Ajouter une campagne :
 * 1. déposer les deux images dans public/images/publicites/ (JPEG ou PNG, moins de 200 Ko chacune) :
 *    - mobile : 640 × 400 px (format 16:10) ;
 *    - large : 2 600 × 500 px (format 26:5, affichée jusqu’à 1 300 × 250 à partir de 768 px de large) ;
 *    La bannière prend toute la largeur, comme les cartes voisines. GIF ou WebP animés acceptés (légers : 4G).
 * 2. ajouter un objet dans `campagnes`, sur ce modèle :
 *    {
 *      id: 'marque-novembre-2026',
 *      annonceur: 'Nom de la marque',
 *      lien: 'https://www.exemple.sn',
 *      alt: 'Ce que montre la bannière, en une phrase.',
 *      image: { mobile: '/images/publicites/marque-mobile.jpg', large: '/images/publicites/marque-large.jpg' },
 *      emplacements: ['accueil', 'tableau-de-bord'],
 *      espaces: ['chercheur', 'prestataire'], // facultatif : sans ce champ, les trois espaces
 *      debut: '2026-11-01', // inclus
 *      fin: '2026-11-30', // inclus
 *    }
 * Si plusieurs campagnes visent le même emplacement, une est tirée au hasard à chaque affichage.
 *
 * `exemple` : campagne de démonstration, une publicité animée pour LIGGEEY elle-même (aucune marque tierce), sur les trois
 * emplacements et aussi pour les comptes de démonstration. Affichée seulement si NEXT_PUBLIC_PUB_EXEMPLE=true,
 * pour les tests et les captures. Mettre cette variable à false avant la mise en ligne.
 * Les gabarits gabarit-320x200.png et gabarit-1300x250.png (« Votre marque ici ») montrent les formats aux marques.
 */
export const publicites = {
  mention: 'Publicité',
  campagnes: [],
  exemple: {
    id: 'exemple-liggeey',
    annonceur: 'LIGGEEY',
    lien: '/a-propos',
    alt: 'LIGGEEY : rendons l’insertion plus facile et plus juste. Découvrir LIGGEEY.',
    animation: 'liggeey', // bannière animée components/blocs/PubLiggeey.jsx, textes ci-dessous
    emplacements: ['accueil', 'ressources', 'tableau-de-bord'],
    debut: '2000-01-01',
    fin: '2999-12-31',
  },
  // Textes de la bannière animée LIGGEEY : 4 messages de 5 secondes, chacun avec sa photo (public/images/).
  liggeey: {
    diapos: [
      { surtitre: 'Insertion professionnelle au Sénégal', titre: 'Rendons l’insertion', accent: 'plus facile et plus juste.', photo: '/images/talents-hero.jpg', cadrage: '62% 25%' },
      { surtitre: 'Pour les talents', titre: 'Postulez à des offres', accent: 'vérifiées par notre équipe.', photo: '/images/accueil-hero.jpg', cadrage: '50% 30%' },
      { surtitre: 'Pour les indépendants', titre: 'Votre savoir-faire', accent: 'mérite d’être reconnu.', photo: '/images/independants-hero.jpg', cadrage: '40% 30%' },
      { surtitre: 'Pour les entreprises', titre: 'Recrutez les bons profils.', accent: 'Nous faisons le tri.', photo: '/images/entreprises-hero.jpg', cadrage: '60% 40%' },
    ],
    atouts: ['Offres vérifiées', 'Accompagnement humain', 'Bureau à Dakar'],
    bouton: 'Découvrir LIGGEEY',
  },

};
