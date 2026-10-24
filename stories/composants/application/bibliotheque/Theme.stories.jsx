import { BoutonTheme, ChoixTheme, useTheme, useThemeApplique } from '../../../../components/app';

/* Dans ces stories, le choix est appliqué à la page (comme dans Plateforme.jsx) :
   il prend le pas sur le bouton « Thème » de la barre d’outils de Storybook. */
function AvecTheme({ children }) {
  useThemeApplique();
  const { preference, theme } = useTheme();
  return (
    <div className="space-y-4">
      {children}
      <p className="text-sm text-secondaire">
        Préférence : <span className="font-semibold text-principal">{preference}</span> · thème affiché : <span className="font-semibold text-principal">{theme}</span>
      </p>
    </div>
  );
}

export default {
  title: 'Composants/Application/Bibliothèque/Thème',
  component: BoutonTheme,
  parameters: {
    docs: {
      description: {
        component:
          'Thème clair ou sombre de la plateforme. `components/app/Theme.jsx` : `useTheme` (préférence gardée dans le navigateur), `useThemeApplique` (pose `data-theme` sur `<html>`), `BoutonTheme` (barre du haut, connexion) et `ChoixTheme` (paramètres).',
      },
    },
  },
};

export const Bouton = {
  name: 'BoutonTheme',
  render: () => (
    <AvecTheme>
      <div className="flex items-center gap-3">
        <BoutonTheme />
        <span className="rounded-lg bg-sombre p-1">
          <BoutonTheme variante="sur-sombre" />
        </span>
      </div>
    </AvecTheme>
  ),
};

export const Choix = {
  name: 'ChoixTheme',
  render: () => (
    <AvecTheme>
      <ChoixTheme />
    </AvecTheme>
  ),
};
