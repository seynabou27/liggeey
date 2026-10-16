import BoutonWhatsApp from '../../../components/layout/BoutonWhatsApp';
import PartageWhatsApp from '../../../components/blocs/PartageWhatsApp';
import { evenements } from '../../../content/evenements';

export const BoutonFlottant = {
  name: 'BoutonWhatsApp (flottant)',
  render: () => (
    <div className="relative h-48 rounded-lg border border-dashed border-forte p-4 text-sm text-secondaire [transform:translateZ(0)]">
      Le bouton est fixé en bas à droite de toutes les pages du site. Le libellé s’affiche à partir de 768 px.
      <BoutonWhatsApp />
    </div>
  ),
  parameters: {
    docs: { story: { inline: false, height: '220px' } },
  },
};

export const PartageEvenement = {
  name: 'PartageWhatsApp · Job Dating',
  render: () => <PartageWhatsApp evenement={evenements[0]} />,
};

export const PartageTexteLibre = {
  name: 'PartageWhatsApp · texte libre',
  render: () => <PartageWhatsApp texte="Découvrez LIGGEEY : https://liggeey.sn" />,
};

export const PartageSurFondSombre = {
  name: 'PartageWhatsApp · sur fond sombre',
  render: () => (
    <div className="rounded-lg bg-sombre p-6">
      <PartageWhatsApp texte="Découvrez LIGGEEY" clair />
    </div>
  ),
};

export default {
  title: 'Composants/Site/Actions/WhatsApp',
  parameters: {
    docs: {
      description: {
        component:
          'Liens WhatsApp du site. `BoutonWhatsApp` (components/layout) : bouton flottant de contact. `PartageWhatsApp` (components/blocs) : partage d’un Job Dating ou d’un texte libre.',
      },
    },
  },
};
