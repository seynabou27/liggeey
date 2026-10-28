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
    <div id={`etapes-${id}`} className={`${visible ? 'flex' : 'hidden'} flex-col gap-6 md:gap-8 lg:flex lg:gap-10`}>
      <p className="surtitre">{groupe.titre}</p>
      <ol className="flex flex-col gap-6 md:gap-8 lg:gap-12">
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

/** Maquette d’ordinateur portable, avec la capture de la plateforme. */
function Ordinateur({ avecCapture, capture }) {
  return (
    <div className="mx-auto w-full max-w-[600px] lg:max-w-none">
      <div className="mx-[5%] rounded-t-2xl bg-sombre p-2.5 pb-3 shadow-carte md:p-3 md:pb-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded bg-marque-doux">
          {avecCapture ? (
            <Image src={capture} alt="Écran de la plateforme LIGGEEY sur ordinateur" fill sizes="(min-width: 1024px) 720px, 600px" className="object-cover object-top" />
          ) : (
            <div className="grid h-full place-items-center">
              <Image src="/logo/monogramme-orange.svg" alt="" width={64} height={67} />
            </div>
          )}
        </div>
      </div>
      <div className="relative h-3.5 rounded-b-xl bg-sombre-doux shadow-carte md:h-4">
        <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-sombre" />
      </div>
    </div>
  );
}

/**
 * « Comment ça marche » autour d’un ordinateur.
 * Ordinateur : les étapes défilent à gauche, la maquette reste fixe à droite. Mobile : deux onglets.
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

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-14 lg:py-10">
            <Colonne id="talents" groupe={t.talents} visible={onglet === 'talents'} />
            <Colonne id="entreprises" groupe={t.entreprises} visible={onglet === 'entreprises'} />
          </div>
          {/* Masquée sur mobile (les étapes suffisent) ; fixe pendant le défilement des étapes sur ordinateur */}
          <div className="order-first hidden md:block lg:sticky lg:top-[max(7rem,calc(50vh-15rem))] lg:order-none">
            <Ordinateur avecCapture={avecCapture} capture={t.capture} />
          </div>
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
