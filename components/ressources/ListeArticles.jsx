'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ressources } from '@/content/fr/aide';

/**
 * Liste des articles avec filtres par public (sans rechargement).
 * Reçoit des articles déjà préparés côté serveur (sans le contenu complet).
 */
export default function ListeArticles({ articles }) {
  const [filtre, setFiltre] = useState('tous');
  const liste = filtre === 'tous' ? articles : articles.filter((a) => a.public === filtre);
  const libelle = (id) => ressources.filtres.find((f) => f.id === id)?.label ?? id;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par public">
        {ressources.filtres.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtre === f.id}
            onClick={() => setFiltre(f.id)}
            className={`min-h-[44px] rounded-full border-2 px-4 text-sm font-semibold ${filtre === f.id ? 'border-ardoise bg-ardoise text-white' : 'border-bordure hover:border-ardoise'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {liste.length === 0 ? (
        <p role="status" className="mt-10 rounded-lg bg-orange-clair p-8 text-center text-lg">
          {ressources.vide}
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((a) => (
            <li key={a.slug}>
              <Link href={`/ressources/${a.slug}`} className="group flex h-full flex-col gap-3 rounded-lg border border-bordure p-6 hover:shadow-carte">
                <span className="self-start rounded-full bg-orange-clair px-3 py-1 text-xs font-semibold">{libelle(a.public)}</span>
                <h2 className="font-serif text-xl leading-snug group-hover:text-orange-texte">{a.titre}</h2>
                <p className="text-gris-fonce">{a.resume}</p>
                <p className="mt-auto text-sm text-gris-fonce">
                  {a.minutes} {ressources.minutes} · {a.auteur}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
