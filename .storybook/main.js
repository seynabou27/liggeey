/** Storybook de LIGGEEY : fondations (couleurs) et composants du site. */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  staticDirs: ['../public'],
};
export default config;
