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

const preview = {
  decorators: [avecTheme],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: { storySort: { order: ['Fondations', ['Couleurs'], 'Composants'] } },
  },
};

export default preview;
