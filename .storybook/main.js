import path from 'node:path';

/**
 * Storybook de LIGGEEY : fondations (tokens), composants du site et de l'application, écrans de l'application.
 * Lancer avec `npm run storybook` depuis site-liggeey/.
 */
const racine = process.cwd();

/*
 * Correctif de compatibilité Next.js 16.4 / @storybook/nextjs-vite 10.6.2.
 * Depuis Next 16.4, useRouter() lit LayoutRouterContext.parentRenderTree.data.bfcacheId ;
 * le routeur simulé de Storybook ne fournit pas encore ce champ, et toutes les stories
 * plantent (« Cannot read properties of undefined (reading 'data') »).
 * On l'ajoute au moment du chargement. À retirer quand Storybook le gérera.
 */
const AVANT = 'parentCacheNode: newLazyCacheNode,';
const APRES = 'parentCacheNode: newLazyCacheNode, parentRenderTree: { data: { bfcacheId: 0 }, slots: new Map() },';
const corriger = (code) => (code.includes(AVANT) && !code.includes('parentRenderTree') ? code.replace(AVANT, APRES) : null);

const correctifNext164 = {
  name: 'liggeey:storybook-next-16-4',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('@storybook/nextjs-vite')) return null;
    return corriger(code);
  },
};

// Même correctif pour les dépendances pré-compilées par Vite en mode développement.
const correctifNext164Esbuild = {
  name: 'liggeey:storybook-next-16-4',
  setup(build) {
    build.onLoad({ filter: /@storybook[\\/]nextjs-vite[\\/]dist[\\/].*\.js$/ }, async ({ path: fichier }) => {
      const fs = await import('node:fs/promises');
      const code = await fs.readFile(fichier, 'utf8');
      const corrige = corriger(code);
      return corrige ? { contents: corrige, loader: 'js' } : undefined;
    });
  },
};

const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  staticDirs: ['../public'],
  async viteFinal(config) {
    const existant = config.resolve?.alias ?? [];
    const liste = Array.isArray(existant) ? existant : Object.entries(existant).map(([find, replacement]) => ({ find, replacement }));
    config.resolve = {
      ...config.resolve,
      alias: [
        // lib/images lit le disque (node:fs) : dans le navigateur, on le remplace par une simulation.
        { find: /^@\/lib\/images$/, replacement: path.join(racine, '.storybook/simulations/images.js') },
        { find: /^@\//, replacement: `${racine}/` },
        ...liste,
      ],
    };
    config.plugins = [correctifNext164, ...(config.plugins ?? [])];
    config.optimizeDeps = {
      ...config.optimizeDeps,
      esbuildOptions: {
        ...config.optimizeDeps?.esbuildOptions,
        plugins: [correctifNext164Esbuild, ...(config.optimizeDeps?.esbuildOptions?.plugins ?? [])],
      },
    };
    return config;
  },
};

export default config;
