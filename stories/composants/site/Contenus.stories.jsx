import { Etapes, GrilleAtouts, Questions } from '../../../components/blocs/Blocs';
import Compteur from '../../../components/ui/Compteur';
import Icone, { ICONES } from '../../../components/ui/Icone';
import { talents } from '../../../content/fr/talents';

export const Atouts3Colonnes = {
  name: 'GrilleAtouts · 3 colonnes',
  render: (args) => <GrilleAtouts {...args} />,
  args: { items: talents.atouts.items, colonnes: 3 },
  argTypes: { colonnes: { control: 'inline-radio', options: [2, 3, 4] } },
};

export const Atouts2Colonnes = { ...Atouts3Colonnes, name: 'GrilleAtouts · 2 colonnes', args: { items: talents.atouts.items.slice(0, 4), colonnes: 2 } };

export const Atouts4Colonnes = { ...Atouts3Colonnes, name: 'GrilleAtouts · 4 colonnes', args: { items: talents.atouts.items.slice(0, 4), colonnes: 4 } };

export const AtoutsSansIcone = {
  ...Atouts3Colonnes,
  name: 'GrilleAtouts · sans icône',
  args: { items: talents.atouts.items.slice(0, 3).map(({ icone, ...reste }) => reste), colonnes: 3 },
};

export const EtapesNumerotees = {
  name: 'Etapes',
  render: (args) => <Etapes {...args} />,
  args: { items: talents.etapes.items },
};

export const QuestionsFermees = {
  name: 'Questions · fermées',
  render: (args) => <Questions {...args} />,
  args: { items: talents.faq },
};

export const QuestionOuverte = {
  name: 'Questions · une question ouverte',
  render: (args) => <Questions {...args} />,
  args: { items: talents.faq },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('details')?.setAttribute('open', '');
  },
};

export const CompteurAnime = {
  name: 'Compteur',
  render: (args) => (
    <p className="text-5xl font-light text-marque-titre">
      <Compteur key={`${args.valeur}-${args.duree}`} {...args} />
      <span className="ml-1">%</span>
    </p>
  ),
  args: { valeur: '78,5', duree: 1500 },
  parameters: { docs: { description: { story: 'Défile de 0 à la valeur quand il apparaît à l’écran. Valeur au format français (« 1 500 », « 78,5 »). Changez la valeur pour relancer.' } } },
};

export const IconeSeule = {
  name: 'Icone',
  render: (args) => (
    <span className="grid h-12 w-12 place-items-center rounded-lg bg-marque-doux text-marque">
      <Icone {...args} />
    </span>
  ),
  args: { nom: 'BadgeCheck', className: 'h-6 w-6' },
  argTypes: { nom: { control: 'select', options: Object.keys(ICONES) } },
};

export const IconeInconnue = {
  name: 'Icone · nom inconnu (repli)',
  render: () => (
    <span className="grid h-12 w-12 place-items-center rounded-lg bg-marque-doux text-marque">
      <Icone nom="NomInconnu" />
    </span>
  ),
  parameters: { docs: { description: { story: 'Un nom absent de la liste affiche BadgeCheck.' } } },
};

export default {
  title: 'Composants/Site/Contenus',
  parameters: {
    docs: {
      description: {
        component: 'Blocs de contenu : GrilleAtouts, Etapes, Questions (components/blocs/Blocs.jsx), Compteur et Icone (components/ui).',
      },
    },
  },
};
