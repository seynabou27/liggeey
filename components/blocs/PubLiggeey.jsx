import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { publicites } from '@/content/fr/publicites';

/**
 * Bannière animée de LIGGEEY (campagne d’exemple, content/fr/publicites.js › liggeey).
 * Diaporama de 4 messages de 5 secondes, en CSS seulement (classes .pub-… de app/globals.css) :
 * fondu, léger zoom sur la photo, texte qui glisse, barres de progression, flèche du bouton.
 * Pause au survol et au clavier ; immobile (premier message) si l’appareil demande moins d’animations.
 * Pleine largeur (la même que les cartes voisines), 260 px de haut sur mobile, 290 px à partir de 768 px.
 */
export default function PubLiggeey({ campagne }) {
  const t = publicites.liggeey;

  return (
    <a
      href={campagne.lien}
      rel="sponsored"
      aria-label={campagne.alt}
      className="pub-liggeey relative block h-[260px] overflow-hidden md:h-[290px] rounded-lg bg-sombre text-sur-sombre"
    >
      {/* Diapos : photo à droite, fondue dans le fond ardoise, et message à gauche */}
      {t.diapos.map((d, i) => (
        <div key={d.photo} className="pub-diapo absolute inset-0" style={{ '--i': i }} aria-hidden="true">
          <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden md:w-[52%]">
            <Image
              src={d.photo}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 55vw"
              className="pub-photo object-cover"
              style={{ objectPosition: d.cadrage }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sombre via-sombre/80 to-sombre/10 md:via-sombre/50 md:to-transparent" />
          </div>
          <div className="pub-texte absolute left-5 top-[56px] max-w-[62%] md:left-11 md:top-[70px] md:max-w-[58%]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-marque-vif md:text-[13px]">{d.surtitre}</p>
            <p className="mt-1.5 text-balance text-lg font-semibold leading-tight md:text-[28px]">
              {d.titre} <span className="block text-marque-vif">{d.accent}</span>
            </p>
          </div>
        </div>
      ))}

      {/* Éléments fixes : filet, cercles, logo, atouts, bouton, progression */}
      <span className="absolute inset-y-0 left-0 w-1.5 bg-marque" aria-hidden="true" />
      <span className="pub-anneau pointer-events-none absolute -top-24 right-[30%] hidden h-56 w-56 rounded-full border-2 border-dashed border-marque/30 md:block" aria-hidden="true" />
      <Image src="/logo/liggeey-blanc.svg" alt="" width={113} height={22} className="absolute left-5 top-5 h-[18px] w-auto md:left-11 md:top-7 md:h-[22px]" />

      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 md:bottom-7 md:left-11 md:right-7">
        <div className="flex flex-col gap-3">
          <ul className="hidden flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-sur-sombre/90 lg:flex" aria-hidden="true">
            {t.atouts.map((a) => (
              <li key={a} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-marque-vif" strokeWidth={3} />
                {a}
              </li>
            ))}
          </ul>
          <span className="pub-bouton relative inline-flex min-h-[44px] items-center gap-2 self-start overflow-hidden rounded bg-marque px-4 text-sm font-semibold text-sur-marque md:px-5 md:text-[15px]">
            {t.bouton}
            <ArrowRight className="pub-fleche h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <span className="pub-progres flex gap-1.5 pb-1" aria-hidden="true">
          {t.diapos.map((d, i) => (
            <span key={d.photo} className="h-1 w-6 overflow-hidden rounded-full bg-white/25 md:w-8">
              <span className="block h-full rounded-full bg-marque" style={{ '--i': i }} />
            </span>
          ))}
        </span>
      </div>
    </a>
  );
}
