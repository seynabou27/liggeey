import { userEvent, within } from 'storybook/test';
import VideoWolof from '../../../components/blocs/VideoWolof';
import BandeVideo from '../../../components/accueil/BandeVideo';
import CarteBureau from '../../../components/blocs/CarteBureau';
import { independants } from '../../../content/fr/independants';

export const VideoBientot = {
  name: 'VideoWolof · bientôt disponible',
  render: (args) => (
    <div className="max-w-sm">
      <VideoWolof {...args} />
    </div>
  ),
  args: { video: independants.wolof.videos[0] },
};

export const VideoRenseignee = {
  name: 'VideoWolof · vidéo renseignée',
  render: (args) => (
    <div className="max-w-sm">
      <VideoWolof {...args} />
    </div>
  ),
  args: { video: { ...independants.wolof.videos[1], src: '/videos/formalisation.mp4' } },
  parameters: { docs: { description: { story: 'Avec un `src`, le bouton de lecture devient actif (le fichier vidéo n’existe pas encore).' } } },
};

export const VideosEnGrille = {
  name: 'VideoWolof · grille',
  render: () => (
    <ul className="grid gap-5 sm:grid-cols-3">
      {independants.wolof.videos.map((v) => (
        <li key={v.id}>
          <VideoWolof video={v} />
        </li>
      ))}
    </ul>
  ),
};

export const BandeVideoAvecPhoto = {
  name: 'BandeVideo · avec photo',
  render: (args) => <BandeVideo {...args} />,
  args: { avecPhoto: true },
  parameters: { layout: 'fullscreen' },
};

export const BandeVideoSansPhoto = {
  name: 'BandeVideo · sans photo',
  render: (args) => <BandeVideo {...args} />,
  args: { avecPhoto: false },
  parameters: { layout: 'fullscreen' },
};

export const CarteFermee = {
  name: 'CarteBureau · avant chargement',
  render: () => (
    <div className="max-w-xl">
      <CarteBureau />
    </div>
  ),
};

export const CarteAffichee = {
  name: 'CarteBureau · carte affichée',
  render: () => (
    <div className="max-w-xl">
      <CarteBureau />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Afficher la carte/ }));
  },
};

export default {
  title: 'Composants/Site/Médias',
  parameters: {
    docs: {
      description: {
        component:
          'Contenus chargés seulement au clic, pour économiser les données mobiles : VideoWolof (components/blocs), BandeVideo (components/accueil), CarteBureau (Google Maps, components/blocs).',
      },
    },
  },
};
