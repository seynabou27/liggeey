'use client';

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

/* Contrôles de l'application : boutons ronds, recherche, sélecteur de période, onglets, pagination, interrupteur. */

/** Bouton rond à icône seule (barre du haut, actions de ligne). Le libellé est lu par les lecteurs d'écran. */
export function BoutonIcone({ icone: Icone, label, onClick, pastille = false, variante = 'contour', taille = 'md', className = '', ...props }) {
  const dims = taille === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const styles = {
    contour: 'border border-base bg-surface text-secondaire hover:text-principal hover:border-forte',
    fantome: 'text-discret hover:bg-doux hover:text-principal',
    doux: 'bg-marque-doux text-marque-fort hover:bg-marque-doux-survol',
    'sur-sombre': 'text-sur-sombre-secondaire hover:bg-sombre-doux hover:text-sur-sombre',
  }[variante];
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={`relative inline-flex shrink-0 items-center justify-center rounded-full transition-colors ${dims} ${styles} ${className}`} {...props}>
      <Icone size={taille === 'sm' ? 15 : 19} strokeWidth={1.75} aria-hidden="true" />
      {pastille && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-marque ring-2 ring-[rgb(var(--fond-surface))]" aria-hidden="true" />}
    </button>
  );
}

/** Champ de recherche. variante : pilule (barre du haut) | carre (au-dessus d'un tableau). */
export function ChampRecherche({ valeur, onChange, placeholder = 'Rechercher…', label = 'Rechercher', variante = 'pilule', className = '', ...props }) {
  const forme = variante === 'pilule' ? 'h-11 rounded-full pl-11 pr-4 border-base' : 'h-10 rounded-md pl-10 pr-3 border-base';
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <Search size={17} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-discret ${variante === 'pilule' ? 'left-4' : 'left-3'}`} aria-hidden="true" />
      <input
        type="search"
        value={valeur}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full border bg-surface text-sm text-principal placeholder:text-discret focus:border-marque focus:outline-none focus:ring-2 focus:ring-focus/30 ${forme}`}
        {...props}
      />
    </label>
  );
}

/** Sélecteur sur fond doux (« Ce mois-ci ▾ »). Repose sur un <select> natif, accessible au clavier. */
export function SelecteurPeriode({ options, valeur, onChange, label = 'Période', icone: Icone = CalendarDays }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      {Icone && <Icone size={16} className="pointer-events-none absolute left-3.5 text-secondaire" aria-hidden="true" />}
      <select
        value={valeur}
        onChange={(e) => onChange?.(e.target.value)}
        className={`h-10 cursor-pointer appearance-none rounded-md bg-doux pr-9 text-sm font-medium text-principal hover:bg-doux-fort focus:outline-none focus:ring-2 focus:ring-focus/40 ${Icone ? 'pl-10' : 'pl-3.5'}`}
      >
        {options.map((o) => {
          const { id, label: texte } = typeof o === 'string' ? { id: o, label: o } : o;
          return (
            <option key={id} value={id}>
              {texte}
            </option>
          );
        })}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 text-secondaire" aria-hidden="true" />
    </label>
  );
}

/** Onglets soulignés. onglets : [{ id, label, compte? }] */
export function Onglets({ onglets, actif, onChange, label = 'Sections', pleineLargeur = false }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-base">
      {onglets.map((o) => {
        const estActif = o.id === actif;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={estActif}
            onClick={() => onChange?.(o.id)}
            className={`-mb-px inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors ${pleineLargeur ? 'flex-1' : ''} ${
              estActif ? 'border-marque text-principal' : 'border-transparent text-secondaire hover:text-principal'
            }`}
          >
            {o.label}
            {o.compte !== undefined && (
              <span className={`rounded px-1.5 text-[11px] font-semibold ${estActif ? 'bg-marque-doux text-marque-fort' : 'bg-doux-fort text-secondaire'}`}>{o.compte}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Segments (filtres courts) : boutons groupés sur fond doux. */
export function Segments({ options, actif, onChange, label = 'Filtre' }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-md bg-doux p-1">
      {options.map((o) => {
        const { id, label: texte } = typeof o === 'string' ? { id: o, label: o } : o;
        const estActif = id === actif;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={estActif}
            onClick={() => onChange?.(id)}
            className={`min-h-[36px] rounded px-3 text-sm font-medium transition-colors ${estActif ? 'bg-surface text-principal shadow-[0_1px_2px_rgb(var(--neutre-800)/0.08)]' : 'text-secondaire hover:text-principal'}`}
          >
            {texte}
          </button>
        );
      })}
    </div>
  );
}

/** Pagination « Affichage 1 à 10 sur 13 » avec numéros de page. */
export function PaginationApp({ page, total, parPage, onChange, libelle = 'résultats' }) {
  const pages = Math.max(1, Math.ceil(total / parPage));
  const debut = total === 0 ? 0 : (page - 1) * parPage + 1;
  const fin = Math.min(total, page * parPage);
  const bouton = 'inline-flex h-9 min-w-[36px] items-center justify-center border border-base px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-secondaire">
        Affichage de {debut} à {fin} sur {total} {libelle}
      </p>
      <div className="flex -space-x-px">
        <button type="button" className={`${bouton} rounded-l-md hover:bg-doux`} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Page précédente">
          <ChevronLeft size={15} aria-hidden="true" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${bouton} ${n === page ? 'relative z-10 border-marque bg-marque font-semibold text-sur-marque' : 'hover:bg-doux'}`}
          >
            {n}
          </button>
        ))}
        <button type="button" className={`${bouton} rounded-r-md hover:bg-doux`} onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Page suivante">
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

/** Interrupteur on/off (réglages). */
export function Interrupteur({ actif, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-2">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-principal">{label}</span>
        {description && <span className="block text-sm text-discret">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" role="switch" checked={actif} onChange={(e) => onChange?.(e.target.checked)} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-piste transition-colors peer-checked:bg-marque peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
