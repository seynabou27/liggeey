/* Barres de progression et listes classées (« par secteur », « par ville »…). */

const COULEURS = {
  marque: 'bg-marque',
  succes: 'bg-statut-succes',
  danger: 'bg-statut-danger',
  info: 'bg-statut-info',
  neutre: 'bg-neutre-500',
};

/** Barre fine. valeur : 0 à 100. */
export function BarreProgression({ valeur, ton = 'marque', label, hauteur = 'fine' }) {
  const v = Math.max(0, Math.min(100, Math.round(valeur)));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full bg-doux-fort ${hauteur === 'fine' ? 'h-1.5' : 'h-2.5'}`}
    >
      <div className={`h-full rounded-full ${COULEURS[ton] || COULEURS.marque}`} style={{ width: `${v}%` }} />
    </div>
  );
}

/**
 * Liste classée : visuel, libellé, barre et pourcentage, valeur à droite.
 * elements : [{ id, libelle, pourcentage, valeur, visuel? }]
 */
export function ListeClassee({ elements }) {
  return (
    <ul className="divide-y divide-dashed divide-base">
      {elements.map((e) => (
        <li key={e.id || e.libelle} className="flex items-center gap-4 py-3.5">
          {e.visuel}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-principal">{e.libelle}</p>
            <div className="mt-1.5 flex items-center gap-3">
              <BarreProgression valeur={e.pourcentage} label={`${e.libelle} : ${e.pourcentage} %`} />
              <span className="w-10 shrink-0 text-right text-xs text-secondaire">{e.pourcentage}%</span>
            </div>
          </div>
          {e.valeur !== undefined && <span className="shrink-0 text-sm font-semibold text-principal">{e.valeur}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Anneau de progression (taux de complétion, période d’essai). */
export function Anneau({ valeur, taille = 64, epaisseur = 7, label, children }) {
  const v = Math.max(0, Math.min(100, valeur));
  const r = (taille - epaisseur) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: taille, height: taille }} role="img" aria-label={label || `${Math.round(v)} %`}>
      <svg width={taille} height={taille} className="-rotate-90" aria-hidden="true">
        <circle cx={taille / 2} cy={taille / 2} r={r} fill="none" strokeWidth={epaisseur} style={{ stroke: 'rgb(var(--fond-doux-fort))' }} />
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={r}
          fill="none"
          strokeWidth={epaisseur}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={{ stroke: 'rgb(var(--fond-marque))', transition: 'stroke-dashoffset .4s' }}
        />
      </svg>
      <span className="absolute text-sm font-semibold text-principal">{children ?? `${Math.round(v)}%`}</span>
    </div>
  );
}
