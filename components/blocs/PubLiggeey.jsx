'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react';
import { publicites } from '@/content/fr/publicites';

/**
 * Bannière animée de LIGGEEY (campagne d’exemple, content/fr/publicites.js › liggeey).
 * Style « pub moderne » : personne détourée qui dépasse du haut de la carte, posée sur un disque orange,
 * formes lumineuses qui bougent, badge qui apparaît, étiquette qui flotte, effet de profondeur à la souris.
 * 4 messages de 5 secondes, animés en CSS (classes .pub-… de app/globals.css) ; le JavaScript ne sert
 * qu’à la profondeur (variables --mx et --my). Pause au survol et au clavier ; immobile (premier message)
 * si l’appareil demande moins d’animations.
 * Pleine largeur (la même que les cartes voisines) ; carte de 260 px de haut sur mobile, 290 px au-dessus.
 */
export default function PubLiggeey({ campagne }) {
  const t = publicites.liggeey;
  const ref = useRef(null);

  // Profondeur : la position de la souris (-1 à 1) déplace les plans à des vitesses différentes.
  function suivre(e) {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    ref.current.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  }
  function recentrer() {
    ref.current.style.setProperty('--mx', '0');
    ref.current.style.setProperty('--my', '0');
  }

  return (
    <a
      ref={ref}
      href={campagne.lien}
      rel="sponsored"
      aria-label={campagne.alt}
      onPointerMove={suivre}
      onPointerLeave={recentrer}
      className="pub-liggeey relative block h-[292px] text-sur-sombre md:h-[330px]"
    >
      {/* Carte : fond ardoise, formes lumineuses, trame de points, disque orange */}
      <div className="absolute inset-x-0 bottom-0 top-8 overflow-hidden rounded-lg bg-sombre md:top-10" aria-hidden="true">
        <div className="pub-plan-lent absolute inset-0">
          <span className="pub-forme absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-marque/30 blur-3xl" />
          <span className="pub-forme pub-forme-2 absolute -top-24 right-[22%] h-64 w-64 rounded-full bg-primaire-300/20 blur-3xl" />
        </div>
        <span className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_left,black,transparent)]" />
        <div className="pub-plan-moyen absolute -bottom-[38%] right-[2%] aspect-square w-[52%] md:right-[7%] md:w-[30%]">
          <span className="pub-disque block h-full w-full rounded-full bg-marque" />
          <span className="pub-tour absolute -inset-4 rounded-full border-2 border-dashed border-marque/40" />
        </div>
        <span className="absolute inset-y-0 left-0 w-1.5 bg-marque" />
      </div>

      {/* Personnes détourées : elles dépassent du haut de la carte */}
      <div className="pub-plan-rapide pointer-events-none absolute bottom-0 right-[1%] top-0 w-[45%] md:right-[6%] md:w-[33%]" aria-hidden="true">
        {t.diapos.map((d, i) => (
          <div key={d.photo} className="pub-diapo absolute inset-0" style={{ '--i': i }}>
            <div className="pub-personne absolute inset-0">
              <Image src={d.photo} alt="" fill sizes="(min-width: 768px) 33vw, 45vw" className="object-contain object-bottom" />
            </div>
            <span className="absolute left-0 top-[46%] hidden -translate-x-1/2 md:block">
              <span className="pub-badge block">
                <span className="pub-flotte inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-principal shadow-carte md:px-4 md:py-2 md:text-sm">
                  <BadgeCheck className="h-4 w-4 text-marque" aria-hidden="true" />
                  {d.badge}
                </span>
              </span>
            </span>
          </div>
        ))}
        <span className="pub-flotte pub-flotte-2 absolute bottom-[16%] right-0 hidden items-center gap-1.5 rounded-full bg-sombre/80 px-3 py-1.5 text-xs font-medium text-sur-sombre ring-1 ring-white/15 backdrop-blur md:inline-flex">
          <MapPin className="h-3.5 w-3.5 text-marque-vif" aria-hidden="true" />
          {t.lieu}
        </span>
      </div>

      {/* Textes : logo, message de la diapo, bouton et progression */}
      <div className="absolute inset-x-0 bottom-0 top-8 flex flex-col justify-between p-5 pr-[44%] md:top-10 md:px-11 md:py-7 md:pr-[42%]">
        <Image src="/logo/liggeey-blanc.svg" alt="" width={113} height={22} className="h-[18px] w-auto self-start md:h-[22px]" />
        <div className="grid">
          {t.diapos.map((d, i) => (
            <div key={d.photo} className="pub-diapo [grid-area:1/1]" style={{ '--i': i }} aria-hidden="true">
              <div className="pub-texte">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-marque-vif md:text-[13px]">{d.surtitre}</p>
                <p className="mt-1.5 text-balance text-lg font-semibold leading-tight md:text-[34px] md:leading-[1.15]">
                  {d.titre} <span className="block text-marque-vif">{d.accent}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <span className="pub-bouton relative inline-flex min-h-[44px] items-center gap-2 overflow-hidden whitespace-nowrap rounded bg-marque px-4 text-sm font-semibold text-sur-marque md:px-5 md:text-[15px]">
            {t.bouton}
            <ArrowRight className="pub-fleche h-4 w-4" aria-hidden="true" />
          </span>
          <span className="pub-progres hidden gap-1.5 sm:flex" aria-hidden="true">
            {t.diapos.map((d, i) => (
              <span key={d.photo} className="h-1 w-8 overflow-hidden rounded-full bg-white/20">
                <span className="block h-full rounded-full bg-marque" style={{ '--i': i }} />
              </span>
            ))}
          </span>
        </div>
      </div>
    </a>
  );
}
