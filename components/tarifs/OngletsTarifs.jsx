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
      <span className="text-gris-fonce">{unite}</span>
    </p>
  );
}

/** Formules par public, avec onglets « Talents et indépendants » / « Entreprises ». */
export default function OngletsTarifs() {
  const [onglet, setOnglet] = useState(0);
  const e = tarifs.entreprise;

  return (
    <div>
      <div className="mx-auto mb-8 grid max-w-lg grid-cols-2 overflow-hidden rounded-lg border-2 border-ardoise">
        {tarifs.onglets.map((libelle, i) => (
          <button
            key={libelle}
            type="button"
            aria-pressed={onglet === i}
            onClick={() => setOnglet(i)}
            className={`min-h-[48px] px-3 text-sm font-semibold sm:text-base ${onglet === i ? 'bg-ardoise text-white' : 'bg-white'}`}
          >
            {libelle}
          </button>
        ))}
      </div>

      {onglet === 0 ? (
        <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {tarifs.formules.map((f) => (
            <li key={f.id} className={`flex flex-col rounded-lg bg-white p-7 ${f.etiquette ? 'border-[3px] border-ardoise' : 'border border-bordure'}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{f.nom}</h3>
                {f.etiquette && <span className="rounded-full bg-ardoise px-3 py-1 text-xs font-semibold text-white">{f.etiquette}</span>}
              </div>
              <Prix prix={f.prix} unite={f.unite} />
              <p className="mt-3 text-gris-fonce">{f.accroche}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {f.avantages.map((a) => (
                  <li key={a} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-texte" aria-hidden="true" />
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
        <div className="mx-auto flex max-w-xl flex-col rounded-lg border-[3px] border-ardoise bg-white p-7">
          <h3 className="text-xl font-semibold">{e.nom}</h3>
          <Prix prix={e.prix} unite={e.unite} />
          <p className="mt-3 text-gris-fonce">{e.accroche}</p>
          <Bouton href="/entreprises/demande-de-demo" pleineLargeur className="mt-7">
            {e.bouton}
          </Bouton>
        </div>
      )}
    </div>
  );
}
