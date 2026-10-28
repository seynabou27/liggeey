import BannierePub from '../../../components/blocs/BannierePub';
import { publicites } from '../../../content/fr/publicites';

// Campagne d’exemple de content/fr/publicites.js : les gabarits « Votre marque ici » (aucune vraie marque).
const EXEMPLE = publicites.exemple;

export default {
  title: 'Composants/Site/Publicité/BannierePub',
  component: BannierePub,
  args: { campagne: EXEMPLE },
  parameters: {
    docs: {
      description: {
        component:
          'Bannière d’une marque affiliée (components/blocs, aussi exportée par components/app). Campagnes dans content/fr/publicites.js, choix dans lib/publicites.js. Emplacements : accueil (sous la vitrine des offres), fin des articles Ressources, bas du tableau de bord chercheur, prestataire et entreprise (vrais comptes seulement). Image 320 × 100 sous 768 px, 728 × 90 au-dessus.',
      },
    },
  },
};

export const PendantUneCampagne = {
  name: 'Pendant une campagne',
};

export const SurMobile = {
  name: 'Sur mobile (320 × 100)',
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export const SansCampagne = {
  name: 'Sans campagne (rien ne s’affiche)',
  args: { campagne: null },
  parameters: { docs: { description: { story: 'Sans campagne en cours, le composant ne rend rien : la page garde son aspect habituel.' } } },
};
