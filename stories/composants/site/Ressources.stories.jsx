import { userEvent, within } from 'storybook/test';
import ListeArticles from '../../../components/ressources/ListeArticles';

/* Articles d'exemple (le site les lit dans content/ressources/, côté serveur). */
const ARTICLES = [
  { slug: 'exemple-entretien', titre: 'Préparer son premier entretien', resume: 'Article d’exemple pour Storybook.', public: 'talents', minutes: 4, auteur: 'L’équipe LIGGEEY' },
  { slug: 'exemple-formalisation', titre: 'Formaliser son activité, étape par étape', resume: 'Article d’exemple pour Storybook.', public: 'independants', minutes: 5, auteur: 'L’équipe LIGGEEY' },
  { slug: 'exemple-offre', titre: 'Rédiger une offre d’emploi claire', resume: 'Article d’exemple pour Storybook.', public: 'talents', minutes: 3, auteur: 'L’équipe LIGGEEY' },
];

export default {
  title: 'Composants/Site/Ressources/ListeArticles',
  component: ListeArticles,
  args: { articles: ARTICLES },
  parameters: { docs: { description: { component: 'Liste des articles avec filtres par public (components/ressources).' } } },
};

export const TousLesArticles = {};

export const Filtree = {
  name: 'Filtrée · Talents',
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Talents' }));
  },
};

export const FiltreVide = {
  name: 'Filtrée · aucun article',
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Entreprises' }));
  },
};

export const AucunArticle = { args: { articles: [] } };
