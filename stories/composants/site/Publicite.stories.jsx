import BannierePub from '../../../components/blocs/BannierePub';
import { publicites } from '../../../content/fr/publicites';

// Campagne d’exemple de content/fr/publicites.js : une publicité pour LIGGEEY elle-même.
const EXEMPLE = publicites.exemple;

// Gabarits envoyés aux marques (« Votre marque ici »), aux formats attendus.
const GABARIT = {
  ...EXEMPLE,
  id: 'gabarit',
  annonceur: 'Votre marque ici',
  lien: 'https://www.exemple.sn',
  alt: 'Exemple de bannière publicitaire : « Votre marque ici ».',
  image: { mobile: '/images/publicites/gabarit-320x200.png', large: '/images/publicites/gabarit-1300x250.png' },
};

export default {
  title: 'Composants/Site/Publicité/BannierePub',
  component: BannierePub,
  args: { campagne: EXEMPLE },
  parameters: {
    docs: {
      description: {
        component:
          'Bannière d’une marque affiliée (components/blocs, aussi exportée par components/app). Campagnes dans content/fr/publicites.js, choix dans lib/publicites.js. Emplacements : accueil (sous la vitrine des offres), fin des articles Ressources, bas du tableau de bord chercheur, prestataire et entreprise (vrais comptes seulement). Pleine largeur, comme les cartes voisines : image 16:10 sous 768 px, 26:5 au-dessus. La campagne d’exemple est la bannière animée LIGGEEY (PubLiggeey).',
      },
    },
  },
};

export const PendantUneCampagne = {
  name: 'Bannière animée LIGGEEY (campagne d’exemple)',
};

export const SurMobile = {
  name: 'Bannière animée LIGGEEY sur mobile',
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export const Gabarit = {
  name: 'Bannière image d’une marque (gabarit)',
  args: { campagne: GABARIT },
  parameters: { docs: { description: { story: 'Formats à envoyer aux marques : 640 × 400 px (mobile) et 2 600 × 500 px (ordinateur), moins de 200 Ko.' } } },
};

export const SansCampagne = {
  name: 'Sans campagne (rien ne s’affiche)',
  args: { campagne: null },
  parameters: { docs: { description: { story: 'Sans campagne en cours, le composant ne rend rien : la page garde son aspect habituel.' } } },
};
