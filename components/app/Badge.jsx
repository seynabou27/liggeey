/* Badges et pastilles de l'application. Fonds doux, texte contrasté (≥ 4,5:1), d'après les tokens de statut. */

export const TONS = {
  marque: 'bg-marque-doux text-marque-fort',
  succes: 'bg-statut-succes-doux text-statut-succes',
  alerte: 'bg-statut-alerte-doux text-statut-alerte',
  danger: 'bg-statut-danger-doux text-statut-danger',
  info: 'bg-statut-info-doux text-statut-info',
  neutre: 'bg-doux-fort text-secondaire',
  plein: 'bg-marque text-sur-marque',
  inverse: 'bg-surface text-marque-fort', // pastille sur un élément orange
};

/**
 * Petite étiquette de statut.
 * - ton : marque | succes | alerte | danger | info | neutre | plein | inverse
 * - point : affiche une pastille ronde devant le texte
 * - taille : petit (tableaux, listes) | moyen
 */
export function Badge({ ton = 'neutre', point = false, taille = 'petit', className = '', children }) {
  const dims = taille === 'moyen' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded font-semibold ${dims} ${TONS[ton] || TONS.neutre} ${className}`}>
      {point && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Compteur rond (menu, notifications). */
export function Compteur({ valeur, ton = 'plein', label }) {
  if (!valeur) return null;
  return (
    <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${TONS[ton] || TONS.plein}`} aria-label={label || `${valeur} à traiter`}>
      {valeur > 99 ? '99+' : valeur}
    </span>
  );
}
