/* Avatars : photo ou initiales, avec indicateur de présence. */

const TAILLES = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-28 w-28 text-3xl',
};

const FONDS = {
  marque: 'bg-marque-doux text-marque-fort',
  plein: 'bg-marque text-sur-marque',
  sombre: 'bg-sombre text-sur-sombre',
  neutre: 'bg-doux-fort text-secondaire',
};

export function initiales(nom = '') {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join('');
}

/**
 * - nom : sert aux initiales et au texte alternatif
 * - src : photo (facultative)
 * - presence : en-ligne | absent | aucune
 */
export function Avatar({ nom, src, taille = 'sm', ton = 'marque', presence = 'aucune', className = '' }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={nom || ''} className={`${TAILLES[taille]} rounded-full object-cover`} />
      ) : (
        <span className={`${TAILLES[taille]} ${FONDS[ton]} inline-flex items-center justify-center rounded-full font-semibold`} aria-label={nom} role="img">
          {initiales(nom)}
        </span>
      )}
      {presence !== 'aucune' && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[rgb(var(--fond-surface))] ${presence === 'en-ligne' ? 'bg-statut-succes' : 'bg-neutre-350'}`}
          aria-label={presence === 'en-ligne' ? 'En ligne' : 'Absent'}
        />
      )}
    </span>
  );
}

/** Plusieurs avatars qui se chevauchent, avec « +n » au-delà de max. */
export function GroupeAvatars({ personnes = [], max = 4, taille = 'sm' }) {
  const visibles = personnes.slice(0, max);
  const reste = personnes.length - visibles.length;
  return (
    <div className="flex items-center -space-x-2">
      {visibles.map((p) => (
        <Avatar key={p.nom} nom={p.nom} src={p.src} taille={taille} ton={p.ton || 'marque'} className="rounded-full ring-2 ring-[rgb(var(--fond-surface))]" />
      ))}
      {reste > 0 && (
        <span className={`${TAILLES[taille]} inline-flex items-center justify-center rounded-full bg-doux-fort font-semibold text-secondaire ring-2 ring-[rgb(var(--fond-surface))]`}>+{reste}</span>
      )}
    </div>
  );
}
