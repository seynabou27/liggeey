'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { CLE_THEME, PREFERENCES_THEME, THEME_PAR_DEFAUT } from '../../lib/theme';
import { BoutonIcone } from './Controles';

/* =====================================================================
   THÈME DE L'APPLICATION (clair, sombre ou selon l'appareil)
   Une seule préférence pour toute la plateforme, gardée dans le navigateur.
   - useTheme : lit et change la préférence ;
   - useThemeApplique : pose data-theme sur <html> (une fois, à la racine) ;
   - BoutonTheme : bascule clair / sombre (barre du haut, connexion) ;
   - ChoixTheme : les trois choix (paramètres).
   ===================================================================== */

const abonnes = new Set();
let preference = null;

function lirePreference() {
  try {
    const v = window.localStorage.getItem(CLE_THEME);
    return PREFERENCES_THEME.includes(v) ? v : THEME_PAR_DEFAUT;
  } catch {
    return THEME_PAR_DEFAUT;
  }
}

const requeteSombre = () => window.matchMedia('(prefers-color-scheme: dark)');
const prevenir = () => abonnes.forEach((f) => f());

function abonner(f) {
  abonnes.add(f);
  const mq = requeteSombre();
  // Un autre onglet a changé le thème.
  const surStockage = (e) => {
    if (e.key === CLE_THEME) {
      preference = null;
      prevenir();
    }
  };
  mq.addEventListener('change', f);
  window.addEventListener('storage', surStockage);
  return () => {
    abonnes.delete(f);
    mq.removeEventListener('change', f);
    window.removeEventListener('storage', surStockage);
  };
}

// Instantané « préférence:thème effectif » : une chaîne, donc stable entre deux lectures.
function instantane() {
  if (preference === null) preference = lirePreference();
  const effectif = preference === 'systeme' ? (requeteSombre().matches ? 'sombre' : 'clair') : preference;
  return `${preference}:${effectif}`;
}

export function choisirTheme(p) {
  if (!PREFERENCES_THEME.includes(p)) return;
  preference = p;
  try {
    window.localStorage.setItem(CLE_THEME, p);
  } catch {
    /* stockage indisponible : le choix vaut pour cette visite */
  }
  prevenir();
}

/** { preference: clair|sombre|systeme, theme: clair|sombre, choisir, basculer } */
export function useTheme() {
  const [pref, theme] = useSyncExternalStore(abonner, instantane, () => `${THEME_PAR_DEFAUT}:${THEME_PAR_DEFAUT}`).split(':');
  return {
    preference: pref,
    theme,
    choisir: choisirTheme,
    basculer: () => choisirTheme(theme === 'sombre' ? 'clair' : 'sombre'),
  };
}

/** Applique le thème sur <html> tant que la plateforme est affichée ; le site repasse en clair ensuite. */
export function useThemeApplique() {
  const { theme } = useTheme();
  useEffect(() => {
    const racine = document.documentElement;
    if (theme === 'sombre') racine.dataset.theme = 'sombre';
    else delete racine.dataset.theme;
  }, [theme]);
  useEffect(() => () => delete document.documentElement.dataset.theme, []);
}

/** Bouton rond lune / soleil. */
export function BoutonTheme({ variante = 'contour', className = '' }) {
  const { theme, basculer } = useTheme();
  const sombre = theme === 'sombre';
  return (
    <BoutonIcone
      icone={sombre ? Sun : Moon}
      label={sombre ? 'Passer au thème clair' : 'Passer au thème sombre'}
      onClick={basculer}
      variante={variante}
      className={className}
    />
  );
}

const CHOIX = [
  { id: 'clair', label: 'Clair', icone: Sun },
  { id: 'sombre', label: 'Sombre', icone: Moon },
  { id: 'systeme', label: "Comme l'appareil", icone: Monitor },
];

/** Les trois choix, en boutons groupés. */
export function ChoixTheme({ label = 'Thème' }) {
  const { preference, choisir } = useTheme();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-md bg-doux p-1">
      {CHOIX.map(({ id, label: texte, icone: Icone }) => {
        const actif = preference === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={actif}
            onClick={() => choisir(id)}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded px-4 text-sm font-medium transition-colors ${actif ? 'bg-surface text-principal shadow-[0_1px_2px_rgb(var(--neutre-900)/0.12)]' : 'text-secondaire hover:text-principal'}`}
          >
            <Icone size={16} className={actif ? 'text-marque' : ''} aria-hidden="true" />
            {texte}
          </button>
        );
      })}
    </div>
  );
}
