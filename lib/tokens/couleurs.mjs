/* =====================================================================
   LIGGEEY — TOKENS DE COULEUR (source unique)
   Lus par tailwind.config.mjs (variables CSS + classes) et par Storybook
   (page « Fondations / Couleurs »). Ne pas écrire de code couleur ailleurs.

   Deux niveaux :
   1. les palettes (primitives) : primaire (orange, couleur de marque) et
      neutre (bleu ardoise), 18 nuances chacune, de 50 à 900 ;
   2. les tokens sémantiques : un rôle (fond, texte, bordure…) qui pointe vers
      une nuance, avec une valeur pour le thème clair et une pour le sombre.
   Les composants n'utilisent que les tokens sémantiques ; les palettes restent
   disponibles pour les cas particuliers (illustrations, graphiques).
   ===================================================================== */

export const NUANCES = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900];

export const palettes = {
  // Orange de marque : boutons, accents, éléments de marque. Référence : 500 (#F0891D).
  primaire: {
    50: '#FDF6EB',
    100: '#FDEBD3',
    150: '#FDDFB7',
    200: '#FFD29D',
    250: '#FFC383',
    300: '#FFB467',
    350: '#FFA54B',
    400: '#FA9936',
    450: '#F6912A',
    500: '#F0891D',
    550: '#E57D12',
    600: '#D9770F',
    650: '#C1690F',
    700: '#A85A0F',
    750: '#904C0D',
    800: '#783F0C',
    850: '#60320B',
    900: '#46240A',
  },
  // Bleu ardoise, couleur neutre : textes, fonds, bordures. Référence : 800 (#1E2733).
  neutre: {
    50: '#F4F5F7',
    100: '#ECEEF1',
    150: '#E2E5E9',
    200: '#D9DDE2',
    250: '#CCD1D8',
    300: '#BCC2CB',
    350: '#A9B1BB',
    400: '#979FAA',
    450: '#818A96',
    500: '#6B7480',
    550: '#606874',
    600: '#545C67',
    650: '#454E59',
    700: '#37404D',
    750: '#2A3441',
    800: '#1E2733',
    850: '#151C26',
    900: '#0C121A',
  },
};

export const BLANC = '#FFFFFF';

/* Tokens sémantiques : [clair, sombre]. Une valeur est soit « palette.nuance »,
   soit « blanc ». Le nom devient la variable CSS --<groupe>-<nom>. */
export const semantiques = {
  fond: {
    page: { clair: 'blanc', sombre: 'neutre.900', role: 'Fond de la page' },
    surface: { clair: 'blanc', sombre: 'neutre.850', role: 'Cartes, champs, fenêtres' },
    doux: { clair: 'neutre.50', sombre: 'neutre.800', role: 'Sections et zones en retrait' },
    'doux-fort': { clair: 'neutre.100', sombre: 'neutre.750', role: 'Étiquettes neutres, survol de ligne' },
    sombre: { clair: 'neutre.800', sombre: 'neutre.850', role: 'Bandes sombres : en-tête, pied de page, menu de l’application' },
    'sombre-doux': { clair: 'neutre.750', sombre: 'neutre.750', role: 'Survol et blocs sur fond sombre' },
    'sombre-profond': { clair: 'neutre.900', sombre: 'neutre.900', role: 'Barre d’icônes de l’application' },
    marque: { clair: 'primaire.500', sombre: 'primaire.500', role: 'Boutons principaux, éléments de marque' },
    'marque-survol': { clair: 'primaire.550', sombre: 'primaire.400', role: 'Survol des boutons principaux' },
    'marque-actif': { clair: 'primaire.600', sombre: 'primaire.600', role: 'Bouton principal pressé' },
    'marque-doux': { clair: 'primaire.100', sombre: 'primaire.900', role: 'Fonds doux de marque, pastilles' },
    'marque-subtil': { clair: 'primaire.50', sombre: 'primaire.900', role: 'Mise en avant légère (non lu, formule choisie)' },
  },
  texte: {
    principal: { clair: 'neutre.800', sombre: 'neutre.50', role: 'Texte courant et titres' },
    secondaire: { clair: 'neutre.600', sombre: 'neutre.300', role: 'Texte secondaire (contraste ≥ 4,5:1)' },
    discret: { clair: 'neutre.500', sombre: 'neutre.400', role: 'Indications, textes d’aide, icônes' },
    'sur-sombre': { clair: 'blanc', sombre: 'neutre.50', role: 'Texte sur les bandes sombres' },
    'sur-sombre-secondaire': { clair: 'neutre.300', sombre: 'neutre.300', role: 'Texte secondaire sur fond sombre' },
    'sur-sombre-discret': { clair: 'neutre.400', sombre: 'neutre.400', role: 'Libellés discrets sur fond sombre' },
    'sur-marque': { clair: 'neutre.800', sombre: 'neutre.800', role: 'Texte sur fond orange (contraste 6:1)' },
    marque: { clair: 'primaire.700', sombre: 'primaire.400', role: 'Texte orange lisible (contraste 5:1)' },
    'marque-titre': { clair: 'primaire.600', sombre: 'primaire.400', role: 'Grands titres orange' },
    'marque-vif': { clair: 'primaire.500', sombre: 'primaire.500', role: 'Orange vif : icônes, liens actifs sur fond sombre' },
    'marque-pale': { clair: 'primaire.100', sombre: 'primaire.100', role: 'Logo et pastilles sur fond sombre' },
  },
  bordure: {
    base: { clair: 'neutre.150', sombre: 'neutre.750', role: 'Bordures et séparateurs' },
    forte: { clair: 'neutre.300', sombre: 'neutre.650', role: 'Bordures de champs, cases à cocher' },
    principal: { clair: 'neutre.800', sombre: 'neutre.50', role: 'Bordure des boutons secondaires' },
    'sur-sombre': { clair: 'neutre.750', sombre: 'neutre.700', role: 'Séparateurs sur fond sombre' },
    marque: { clair: 'primaire.500', sombre: 'primaire.500', role: 'Bordure active, sélection' },
  },
  etat: {
    focus: { clair: 'primaire.500', sombre: 'primaire.400', role: 'Contour de focus clavier' },
  },
};

export function hex(reference) {
  if (reference === 'blanc') return BLANC;
  const [palette, nuance] = reference.split('.');
  return palettes[palette][nuance];
}

// « #F0891D » -> « 240 137 29 » : format attendu par Tailwind pour l'opacité (bg-marque/40).
export function canaux(code) {
  return [1, 3, 5].map((i) => parseInt(code.slice(i, i + 2), 16)).join(' ');
}

export function variable(groupe, nom) {
  return `--${groupe}-${nom}`;
}

// Variables CSS d'un thème, prêtes pour addBase (Tailwind). Les palettes ne changent pas
// d'un thème à l'autre : on ne les écrit qu'une fois, dans :root (avecPalettes).
export function variablesCss(theme, { avecPalettes = true } = {}) {
  const vars = {};
  if (avecPalettes) {
    for (const [palette, nuances] of Object.entries(palettes)) {
      for (const [nuance, code] of Object.entries(nuances)) vars[`--${palette}-${nuance}`] = canaux(code);
    }
  }
  for (const [groupe, tokens] of Object.entries(semantiques)) {
    for (const [nom, t] of Object.entries(tokens)) {
      const ref = t[theme];
      vars[variable(groupe, nom)] = ref === 'blanc' ? canaux(BLANC) : `var(--${ref.replace('.', '-')})`;
    }
  }
  return vars;
}

// Couleur CSS complète, pour les styles en ligne : couleur('texte', 'principal') -> rgb(var(--texte-principal)).
export function couleur(groupe, nom, alpha) {
  return alpha === undefined ? `rgb(var(${variable(groupe, nom)}))` : `rgb(var(${variable(groupe, nom)}) / ${alpha})`;
}
