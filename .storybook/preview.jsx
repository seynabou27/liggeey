import '../app/globals.css';

/* Bouton « Thème » dans la barre d'outils : bascule data-theme sur <html>,
   comme le fera le site le jour où le thème sombre sera activé. */
export const globalTypes = {
  theme: {
    description: 'Thème de couleur',
    toolbar: {
      title: 'Thème',
      icon: 'mirror',
      items: [
        { value: 'clair', title: 'Clair' },
        { value: 'sombre', title: 'Sombre' },
      ],
      dynamicTitle: true,
    },
  },
};

export const initialGlobals = { theme: 'clair' };

const avecTheme = (Story, { globals }) => {
  const theme = globals.theme || 'clair';
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    document.body.classList.add('bg-page', 'text-principal', 'font-sans');
  }
  return <Story />;
};

/* Photos présentes ou absentes (lib/images est simulé, voir .storybook/simulations/images.js). */
const avecPhotos = (Story, { parameters }) => {
  if (typeof window !== 'undefined') window.__LIGGEEY_SANS_PHOTOS__ = Boolean(parameters.sansPhotos);
  return <Story />;
};

/* Envoi des formulaires simulé : aucune requête ne part vers /api/formulaires.
   parameters.formulaire : 'succes' (par défaut) | 'erreur' | 'attente' (l'envoi ne se termine jamais). */
const fetchOrigine = typeof window !== 'undefined' ? window.fetch.bind(window) : null;
const avecFormulaires = (Story, { parameters }) => {
  if (typeof window !== 'undefined') {
    const mode = parameters.formulaire ?? 'succes';
    window.fetch = (url, options) => {
      if (String(url).includes('/api/formulaires')) {
        if (mode === 'attente') return new Promise(() => {});
        return new Promise((resoudre) =>
          setTimeout(() => resoudre(new Response('{}', { status: mode === 'erreur' ? 500 : 200 })), 600),
        );
      }
      return fetchOrigine(url, options);
    };
  }
  return <Story />;
};

const preview = {
  decorators: [avecTheme, avecPhotos, avecFormulaires],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Fondations',
          ['Couleurs', 'Typographie', 'Espacements', 'Formes et ombres', 'Icônes', 'Logos', 'Classes utilitaires'],
          'Composants',
          [
            'Site',
            ['Actions', 'Formulaires', 'Navigation', 'Mise en page', 'Contenus', 'Médias', 'Offres', 'Accueil', 'Tarifs', 'Job Dating', 'Ressources', 'Gabarits'],
            'Application',
            ['Identité', 'Actions', 'Badges et statuts', 'Indicateurs', 'Formulaires', 'Navigation', 'Cartes', 'Données', 'Retours et fenêtres'],
          ],
          'Écrans',
          ['Plateforme complète', 'Authentification', 'Chercheur', 'Prestataire', 'Entreprise', 'Admin'],
        ],
      },
    },
  },
};

export default preview;
