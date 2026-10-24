import Link from 'next/link';
import { ChevronDown, Clock, MapPin, MessageCircle } from 'lucide-react';
import { site } from '@/lib/site';
import { lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import Icone from '@/components/ui/Icone';

/** Grille de cartes icône + titre + texte. */
export function GrilleAtouts({ items, colonnes = 3 }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[colonnes];
  return (
    <ul className={`grid gap-3 md:gap-5 ${cols}`}>
      {items.map((item) => (
        <li
          key={item.titre}
          className={`gap-3 rounded-lg border border-base bg-surface p-5 md:flex md:flex-col md:gap-3 md:p-6 ${item.icone ? 'grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1' : 'flex flex-col'}`}
        >
          {/* Mobile : icône à gauche du titre, pour des cartes plus courtes */}
          {item.icone && (
            <span className="row-span-2 grid h-10 w-10 place-items-center rounded-lg bg-marque-doux text-marque-fort md:h-12 md:w-12">
              <Icone nom={item.icone} />
            </span>
          )}
          <h3 className="self-center text-lg font-semibold md:self-auto">{item.titre}</h3>
          <p className="text-secondaire">{item.texte}</p>
        </li>
      ))}
    </ul>
  );
}

/** Étapes numérotées (1, 2, 3, 4). */
export function Etapes({ items }) {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {items.map((etape, i) => (
        <li key={etape.titre} className="flex gap-4 lg:flex-col">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sombre font-semibold text-sur-sombre" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3 className="text-lg font-semibold">{etape.titre}</h3>
            <p className="mt-1 text-secondaire">{etape.texte}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Questions-réponses dépliables, sans JavaScript (balises details / summary). */
export function Questions({ items }) {
  return (
    <div className="divide-y divide-base border-y border-base">
      {items.map(({ q, r }) => (
        <details key={q} className="group">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {q}
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="pb-5 pr-8 text-lg leading-relaxed text-secondaire">{r}</p>
        </details>
      ))}
    </div>
  );
}

/** Bande finale sombre avec un titre et des boutons. */
export function AppelFinal({ titre, children }) {
  return (
    <section className="bg-sombre py-12 text-sur-sombre md:py-20">
      <div className="container flex flex-col items-center gap-8 text-center">
        <h2 className="max-w-2xl text-balance text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{titre}</h2>
        <div className="flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </section>
  );
}

/** Accompagnement humain : bureau de Dakar et WhatsApp. */
export function BlocAide({ titre, texte }) {
  return (
    <section className="bg-marque-doux py-12 md:py-20">
      <div className="container grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{titre}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed">{texte}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Bouton href={lienWhatsApp()} variante="whatsapp" nouvelOnglet>
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Écrire sur WhatsApp
            </Bouton>
            <Link href="/contact#bureau" className="lien inline-flex min-h-[44px] items-center">
              Voir l’adresse du bureau
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg bg-surface p-6">
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-marque" aria-hidden="true" />
            <span>
              {site.bureau.adresse}, {site.bureau.ville}
            </span>
          </p>
          {site.bureau.horaires.map((h) => (
            <p key={h.jours} className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-marque" aria-hidden="true" />
              <span>
                {h.jours} : {h.heures}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
