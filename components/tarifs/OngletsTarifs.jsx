'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { tarifs } from '@/content/fr/tarifs';
import { lienInscription } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';

function Prix({ prix, unite }) {
  return (
    <p className="mt-3 flex items-baseline gap-2">
      <span className="text-4xl font-semibold">{prix}</span>
      <span className="text-secondaire">{unite}</span>
    </p>
  );
}

/** Formules par public, avec onglets « Talents et indépendants » / « Entreprises ». */
export default function OngletsTarifs() {
  const [onglet, setOnglet] = useState(0);
  const e = tarifs.entreprise;

  return (
    <div>
      <div className="mx-auto mb-8 grid max-w-lg grid-cols-2 overflow-hidden rounded-lg border-2 border-principal">
        {tarifs.onglets.map((libelle, i) => (
          <button
            key={libelle}
            type="button"
            aria-pressed={onglet === i}
            onClick={() => setOnglet(i)}
            className={`min-h-[48px] px-3 text-sm font-semibold sm:text-base ${onglet === i ? 'bg-sombre text-sur-sombre' : 'bg-surface'}`}
          >
            {libelle}
          </button>
        ))}
      </div>

      {onglet === 0 ? (
        <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {tarifs.formules.map((f) => (
            <li key={f.id} className={`flex flex-col rounded-lg bg-surface p-7 ${f.etiquette ? 'border-[3px] border-principal' : 'border border-base'}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{f.nom}</h3>
                {f.etiquette && <span className="rounded-full bg-sombre px-3 py-1 text-xs font-semibold text-sur-sombre">{f.etiquette}</span>}
              </div>
              <Prix prix={f.prix} unite={f.unite} />
              <p className="mt-3 text-secondaire">{f.accroche}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {f.avantages.map((a) => (
                  <li key={a} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-marque" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
              <Bouton href={lienInscription(undefined, { formule: f.id })} pleineLargeur className="mt-7">
                {f.bouton}
              </Bouton>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto flex max-w-xl flex-col rounded-lg border-[3px] border-principal bg-surface p-7">
          <h3 className="text-xl font-semibold">{e.nom}</h3>
          <Prix prix={e.prix} unite={e.unite} />
          <p className="mt-3 text-secondaire">{e.accroche}</p>
          <Bouton href="/entreprises/demande-de-demo" pleineLargeur className="mt-7">
            {e.bouton}
          </Bouton>
        </div>
      )}
    </div>
  );
}
