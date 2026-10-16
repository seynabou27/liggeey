'use client';

import { useState } from 'react';
import { tarifs } from '@/content/fr/tarifs';
import { lienInscription } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';

function Pastille({ actif, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`min-h-[44px] rounded-full border-2 px-4 text-sm font-semibold transition-colors ${actif ? 'border-principal bg-sombre text-sur-sombre' : 'border-base bg-surface hover:border-principal'}`}
    >
      {children}
    </button>
  );
}

/** Mini-guide « Quelle formule pour moi ? » : deux questions, réponse immédiate. */
export default function GuideFormule() {
  const t = tarifs.guide;
  const [profil, setProfil] = useState(null);
  const [priorite, setPriorite] = useState(null);

  const cle = profil === 'entreprise' ? 'entreprise' : priorite;
  const resultat = cle ? t.resultats[cle] : null;
  const priorites = t.priorites.filter((p) => !p.seulement || p.seulement === profil);
  const formule = cle === 'postuler' ? 'essentiel' : cle === 'mentor' || cle === 'former' ? 'premium' : undefined;

  return (
    <div className="rounded-lg bg-surface p-6 shadow-carte md:p-8">
      <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.titre}</h2>

      <fieldset className="mt-6">
        <legend className="font-semibold">1. {t.q1}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {t.profils.map((p) => (
            <Pastille
              key={p.id}
              actif={profil === p.id}
              onClick={() => {
                setProfil(p.id);
                setPriorite(null);
              }}
            >
              {p.label}
            </Pastille>
          ))}
        </div>
      </fieldset>

      {profil && profil !== 'entreprise' && (
        <fieldset className="mt-6">
          <legend className="font-semibold">2. {t.q2}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {priorites.map((p) => (
              <Pastille key={p.id} actif={priorite === p.id} onClick={() => setPriorite(p.id)}>
                {p.label}
              </Pastille>
            ))}
          </div>
        </fieldset>
      )}

      <div aria-live="polite">
        {resultat && (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border-2 border-dashed border-principal p-5">
            <p className="text-sm font-semibold text-marque">{t.conseil}</p>
            <p className="text-xl font-semibold">{resultat.titre}</p>
            <p className="text-secondaire">{resultat.texte}</p>
            <div className="flex flex-wrap items-center gap-4">
              {cle === 'entreprise' ? (
                <Bouton href="/entreprises/demande-de-demo">Demander une démo</Bouton>
              ) : (
                <Bouton href={lienInscription(profil, formule ? { formule } : {})}>Créer mon compte</Bouton>
              )}
              <button
                type="button"
                onClick={() => {
                  setProfil(null);
                  setPriorite(null);
                }}
                className="lien min-h-[44px]"
              >
                {t.recommencer}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
