'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2, Table2 } from 'lucide-react';
import { exporterListe, FORMATS_EXPORT } from '@/lib/export';

/* Bouton « Exporter » au-dessus d’un tableau : menu PDF, Excel ou CSV.
   Exporte toutes les lignes reçues (la liste filtrée), pas seulement la page affichée. */

const ICONES = { pdf: FileText, xlsx: FileSpreadsheet, csv: Table2 };

/**
 * - titre : nom de la liste (titre du PDF, nom du fichier)
 * - colonnes : [{ titre, valeur(ligne) }], valeur renvoie un texte ou un nombre
 * - lignes : les lignes à exporter
 * - sousTitre : précision ajoutée sous le titre du PDF (filtres appliqués…)
 * - onTermine(nomFichier, format) / onErreur(erreur) : pour afficher une notification
 */
export function MenuExport({ titre, colonnes, lignes, sousTitre, onTermine, onErreur, className = '' }) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, setEnCours] = useState(null);
  const racine = useRef(null);
  const bouton = useRef(null);
  const items = useRef([]);
  const vide = lignes.length === 0;

  useEffect(() => {
    if (!ouvert) return undefined;
    items.current[0]?.focus();
    const fermerDehors = (e) => {
      if (!racine.current?.contains(e.target)) setOuvert(false);
    };
    document.addEventListener('mousedown', fermerDehors);
    return () => document.removeEventListener('mousedown', fermerDehors);
  }, [ouvert]);

  function clavier(e) {
    const liste = items.current.filter(Boolean);
    const i = liste.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      setOuvert(false);
      bouton.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      liste[(i + 1) % liste.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      liste[(i - 1 + liste.length) % liste.length]?.focus();
    } else if (e.key === 'Tab') {
      setOuvert(false);
    }
  }

  async function exporter(format) {
    setOuvert(false);
    setEnCours(format);
    try {
      const nom = await exporterListe({ format, titre, sousTitre, colonnes, lignes });
      onTermine?.(nom, format);
    } catch (err) {
      onErreur?.(err);
    } finally {
      setEnCours(null);
      bouton.current?.focus();
    }
  }

  return (
    <div ref={racine} className={`relative inline-block ${className}`} onKeyDown={ouvert ? clavier : undefined}>
      <button
        ref={bouton}
        type="button"
        disabled={vide || !!enCours}
        aria-haspopup="menu"
        aria-expanded={ouvert}
        onClick={() => setOuvert((o) => !o)}
        title={vide ? 'Aucune ligne à exporter' : undefined}
        className="inline-flex h-11 items-center gap-2 rounded-md border border-base bg-surface px-4 text-sm font-medium text-principal transition-colors hover:border-forte hover:bg-doux focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enCours ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
        {enCours ? 'Export en cours…' : 'Exporter'}
        <ChevronDown size={15} className="text-secondaire" aria-hidden="true" />
      </button>
      {ouvert && (
        <ul role="menu" aria-label={`Exporter ${titre}`} className="absolute right-0 z-30 mt-1.5 w-64 rounded-lg border border-base bg-surface p-1.5 shadow-carte">
          {FORMATS_EXPORT.map((f, i) => {
            const Icone = ICONES[f.id];
            return (
              <li key={f.id} role="none">
                <button
                  ref={(el) => (items.current[i] = el)}
                  type="button"
                  role="menuitem"
                  onClick={() => exporter(f.id)}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-doux focus:bg-doux focus:outline-none"
                >
                  <Icone size={18} className="shrink-0 text-marque" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-principal">{f.label}</span>
                    <span className="block text-xs text-secondaire">{f.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
          <li role="none" className="px-3 pb-1 pt-2 text-xs text-discret">
            {lignes.length} {lignes.length > 1 ? 'lignes' : 'ligne'}, avec les filtres appliqués.
          </li>
        </ul>
      )}
    </div>
  );
}
