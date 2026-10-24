'use client';

import { useState } from 'react';
import Image from 'next/image';
import { accueil } from '@/content/fr/accueil';
import { lienInscription } from '@/lib/liens';
import { TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import Icone from '@/components/ui/Icone';

function Colonne({ id, groupe, visible }) {
  return (
    <div id={`etapes-${id}`} className={`${visible ? 'flex' : 'hidden'} flex-col gap-6 md:gap-8 lg:flex`}>
      <p className="surtitre">{groupe.titre}</p>
      <ol className="flex flex-col gap-6 md:gap-8">
        {groupe.items.map((etape) => (
          <li key={etape.titre} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-marque-doux text-marque-fort">
              <Icone nom={etape.icone} />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold">{etape.titre}</h3>
              <p className="mt-1 text-sm leading-[1.7] text-secondaire">{etape.texte}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * « Comment ça marche » autour d’un téléphone (comme le modèle).
 * Ordinateur : talents à gauche, entreprises à droite. Mobile : deux onglets.
 * @param {{ avecCapture: boolean }} props  capture de l’app présente dans /public ?
 */
export default function CommentCaMarche({ avecCapture }) {
  const t = accueil.etapes;
  const [onglet, setOnglet] = useState('talents');

  return (
    <section aria-labelledby="titre-etapes" className="bg-surface py-12 md:py-20">
      <div className="container">
        <TitreSection id="titre-etapes" centre titre={t.titre} texte={t.texte} />

        <div className="mx-auto mb-8 grid max-w-md grid-cols-2 overflow-hidden rounded-lg border-2 border-principal lg:hidden">
          {['talents', 'entreprises'].map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={onglet === id}
              aria-controls={`etapes-${id}`}
              onClick={() => setOnglet(id)}
              className={`min-h-[44px] px-3 text-sm font-semibold ${onglet === id ? 'bg-sombre text-sur-sombre' : 'bg-surface'}`}
            >
              {t[id].titre}
            </button>
          ))}
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_280px_1fr] lg:gap-14">
          <Colonne id="talents" groupe={t.talents} visible={onglet === 'talents'} />
          {/* La maquette du téléphone est masquée sur mobile : les étapes suffisent */}
          <div className="order-first mx-auto hidden w-[220px] md:block lg:order-none lg:w-[260px]">
            <div className="relative aspect-[9/18] overflow-hidden rounded-[36px] border-[10px] border-principal bg-marque-doux shadow-carte">
              {avecCapture ? (
                <Image src={t.capture} alt="Écran de l’application LIGGEEY" fill sizes="260px" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center">
                  <Image src="/logo/monogramme-orange.svg" alt="" width={64} height={67} />
                </div>
              )}
            </div>
          </div>
          <Colonne id="entreprises" groupe={t.entreprises} visible={onglet === 'entreprises'} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
          <Bouton href={lienInscription()}>Créer mon compte</Bouton>
          <Bouton href="/entreprises/demande-de-demo" variante="secondaire">
            Demander une démo
          </Bouton>
        </div>
      </div>
    </section>
  );
}
