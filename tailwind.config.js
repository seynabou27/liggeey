/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './content/**/*.js'],
  theme: {
    container: {
      center: true,
      padding: '0.75rem',
      screens: { '2xl': '1320px' },
    },
    extend: {
      // Charte LIGGEEY (reprise du prototype)
      colors: {
        orange: {
          DEFAULT: '#F0891D', // boutons, accents (texte foncé dessus)
          clair: '#FDEBD3', // fonds doux
          texte: '#A85A0F', // orange lisible sur fond blanc (contraste 5:1)
          fonce: '#D9770F', // orange des grands titres sur fond blanc
          survol: '#E57D12',
        },
        ardoise: { DEFAULT: '#1E2733', 800: '#2A3441' },
        gris: { DEFAULT: '#6B7480', fonce: '#545C67', fond: '#F4F5F7' }, // « fonce » : texte secondaire lisible sur tous les fonds clairs
        bordure: '#E2E5E9',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'], // interface (Plus Jakarta Sans, comme JobStock)
        serif: ['Georgia', '"Times New Roman"', 'serif'], // contenus éditoriaux
      },
      boxShadow: { carte: '0 14px 34px rgba(30, 39, 51, 0.16)' },
    },
  },
  plugins: [],
};
