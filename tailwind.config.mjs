import { palettes, semantiques, variablesCss } from './lib/tokens/couleurs.mjs';

// Couleur Tailwind qui lit une variable CSS et accepte l'opacité (ex. bg-sombre/80).
const v = (nom) => `rgb(var(--${nom}) / <alpha-value>)`;
const palette = (nom) => Object.fromEntries(Object.keys(palettes[nom]).map((n) => [n, v(`${nom}-${n}`)]));
const groupe = (nom) => Object.fromEntries(Object.keys(semantiques[nom]).map((t) => [t, v(`${nom}-${t}`)]));

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './content/**/*.js', './stories/**/*.{js,jsx,mdx}'],
  // Thème sombre : il s'active avec <html data-theme="sombre"> (plateforme, voir components/app/Theme.jsx).
  darkMode: ['selector', '[data-theme="sombre"]'],
  theme: {
    container: {
      center: true,
      padding: '0.75rem',
      screens: { '2xl': '1320px' },
    },
    extend: {
      // Charte LIGGEEY : tokens définis dans lib/tokens/couleurs.mjs
      colors: {
        primaire: palette('primaire'), // orange de marque, 50 à 900
        neutre: palette('neutre'), // bleu ardoise, 50 à 900
        sombre: v('fond-sombre'), // dégradés sur photo (from-sombre/90)
        whatsapp: '#25D366',
        statut: groupe('statut'), // badges : bg-statut-succes-doux text-statut-succes, danger, alerte, info
      },
      backgroundColor: groupe('fond'), // bg-page, bg-surface, bg-doux, bg-sombre, bg-marque, bg-marque-survol…
      textColor: groupe('texte'), // text-principal, text-secondaire, text-discret, text-sur-marque, text-marque…
      borderColor: groupe('bordure'), // border-base, border-forte, border-principal, border-marque…
      ringColor: { focus: v('etat-focus') },
      outlineColor: { focus: v('etat-focus') },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'], // interface (Plus Jakarta Sans, comme JobStock)
        serif: ['Georgia', '"Times New Roman"', 'serif'], // contenus éditoriaux
      },
      boxShadow: { carte: '0 14px 34px rgb(var(--neutre-800) / 0.16)' },
    },
  },
  plugins: [
    function variablesDeCouleur({ addBase }) {
      addBase({
        ':root': { ...variablesCss('clair'), 'color-scheme': 'light' },
        // Permet de forcer le clair sur un bloc à l'intérieur d'une page sombre (aperçus Storybook…)
        '[data-theme="clair"]': { ...variablesCss('clair', { avecPalettes: false }), 'color-scheme': 'light' },
        '[data-theme="sombre"]': { ...variablesCss('sombre', { avecPalettes: false }),'color-scheme': 'dark' },
      });
    },
  ],
};
