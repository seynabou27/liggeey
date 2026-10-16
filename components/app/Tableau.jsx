/* Tableau de données : en-tête sur fond doux aux coins arrondis, lignes séparées par un filet pointillé. */

/**
 * - colonnes : [{ cle, titre, rendu?(ligne), alignement?: 'gauche' | 'droite' | 'centre', largeur?, masqueMobile? }]
 * - lignes : tableau d'objets ; cleLigne : nom du champ identifiant (id par défaut)
 * - onLigne : rend chaque ligne cliquable (ouvre un détail)
 * - vide : contenu affiché quand il n'y a aucune ligne
 */
export function Tableau({ colonnes, lignes, cleLigne = 'id', onLigne, vide = 'Aucun élément à afficher.', legende, className = '' }) {
  const align = (a) => (a === 'droite' ? 'text-right' : a === 'centre' ? 'text-center' : 'text-left');
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        {legende && <caption className="sr-only">{legende}</caption>}
        <thead>
          <tr>
            {colonnes.map((c, i) => (
              <th
                key={c.cle}
                scope="col"
                style={c.largeur ? { width: c.largeur } : undefined}
                className={`bg-doux px-4 py-3.5 font-semibold text-principal ${align(c.alignement)} ${i === 0 ? 'rounded-l-md' : ''} ${i === colonnes.length - 1 ? 'rounded-r-md' : ''} ${c.masqueMobile ? 'hidden md:table-cell' : ''}`}
              >
                {c.titre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.length === 0 ? (
            <tr>
              <td colSpan={colonnes.length} className="px-4 py-10 text-center text-secondaire">
                {vide}
              </td>
            </tr>
          ) : (
            lignes.map((l, n) => (
              <tr
                key={l[cleLigne] ?? n}
                onClick={onLigne ? () => onLigne(l) : undefined}
                className={onLigne ? 'cursor-pointer transition-colors hover:bg-doux/60' : ''}
              >
                {colonnes.map((c) => (
                  <td
                    key={c.cle}
                    className={`border-b border-dashed border-base px-4 py-3.5 align-middle text-secondaire ${align(c.alignement)} ${c.masqueMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {c.rendu ? c.rendu(l) : l[c.cle]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Cellule « avatar ou vignette + nom + sous-texte », première colonne des tableaux. */
export function CelluleIdentite({ visuel, titre, sousTitre }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      {visuel}
      <span className="min-w-0">
        <span className="block truncate font-medium text-principal">{titre}</span>
        {sousTitre && <span className="block truncate text-[13px] text-marque">{sousTitre}</span>}
      </span>
    </span>
  );
}
