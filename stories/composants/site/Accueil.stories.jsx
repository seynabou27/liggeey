import BandeauAccueil from '../../../components/accueil/BandeauAccueil';
import CommentCaMarche from '../../../components/accueil/CommentCaMarche';
import { AVenir, BandeConstat, BandeParcours, Engagements, GrilleSecteurs } from '../../../components/accueil/Sections';
import { evenements } from '../../../content/evenements';

export const Bandeau = { name: 'BandeauAccueil', render: () => <BandeauAccueil /> };

export const BandeauSansPhoto = { name: 'BandeauAccueil · sans photo', render: () => <BandeauAccueil />, parameters: { sansPhotos: true } };

export const BandeauMobile = {
  name: 'BandeauAccueil · mobile',
  render: () => <BandeauAccueil />,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export const Parcours = { name: 'BandeParcours', render: () => <BandeParcours /> };

export const Secteurs = { name: 'GrilleSecteurs', render: () => <GrilleSecteurs /> };

export const Constat = { name: 'BandeConstat', render: () => <BandeConstat /> };

export const NosEngagements = { name: 'Engagements', render: () => <Engagements /> };

export const AVenirAvecEvenement = {
  name: 'AVenir · prochain Job Dating',
  render: (args) => (
    <div className="pt-10">
      <AVenir {...args} />
    </div>
  ),
  args: { evenement: evenements[0] },
};

export const AVenirSansEvenement = {
  name: 'AVenir · aucune date annoncée',
  render: (args) => (
    <div className="pt-10">
      <AVenir {...args} />
    </div>
  ),
  args: { evenement: null },
};

export const Etapes = {
  name: 'CommentCaMarche · avec capture',
  render: (args) => <CommentCaMarche {...args} />,
  args: { avecCapture: true },
};

export const EtapesSansCapture = {
  name: 'CommentCaMarche · sans capture',
  render: (args) => <CommentCaMarche {...args} />,
  args: { avecCapture: false },
};

export const EtapesMobile = {
  name: 'CommentCaMarche · mobile (onglets)',
  render: (args) => <CommentCaMarche {...args} />,
  args: { avecCapture: true },
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export default {
  title: 'Composants/Site/Accueil',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sections propres à la page d’accueil (components/accueil) : bandeau avec recherche, trois parcours, secteurs, constat chiffré, engagements, à venir, comment ça marche.',
      },
    },
  },
};
