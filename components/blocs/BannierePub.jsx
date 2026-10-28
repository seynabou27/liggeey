import { getImageProps } from 'next/image';
import { publicites } from '@/content/fr/publicites';
import PubLiggeey from './PubLiggeey';

/**
 * Bannière d’une marque affiliée (content/fr/publicites.js), sur le site et dans la plateforme.
 * Mention « Publicité » toujours visible, lien marqué rel="sponsored".
 * Pleine largeur, comme les cartes voisines. Image 16:10 sur mobile, 26:5 à partir de 768 px (balise <picture>),
 * chargée seulement à l’approche. La place est réservée (rapport largeur/hauteur fixe) : la page ne saute pas.
 * Campagne `animation: 'liggeey'` : bannière animée PubLiggeey au lieu d’une image.
 * Sans campagne, rien ne s’affiche.
 */
export default function BannierePub({ campagne, className = '' }) {
  if (!campagne) return null;
  if (campagne.animation === 'liggeey') {
    return (
      <aside aria-label={publicites.mention} className={`w-full ${className}`}>
        <Mention campagne={campagne} />
        <PubLiggeey campagne={campagne} />
      </aside>
    );
  }

  // Large : jusqu’à 1 300 px de large. Mobile : toute la largeur de l’écran.
  const {
    props: { srcSet: srcSetLarge },
  } = getImageProps({ alt: campagne.alt, src: campagne.image.large, width: 1300, height: 250, sizes: '(min-width: 1320px) 1300px, 100vw' });
  const { props: mobile } = getImageProps({ alt: campagne.alt, src: campagne.image.mobile, width: 320, height: 200, sizes: '100vw' });

  // Lien vers la marque : nouvel onglet. Lien interne au site : même onglet.
  const cible = campagne.lien.startsWith('/') ? { rel: 'sponsored' } : { target: '_blank', rel: 'sponsored noopener noreferrer' };

  return (
    <aside aria-label={publicites.mention} className={`w-full ${className}`}>
      <Mention campagne={campagne} />
      <a
        href={campagne.lien}
        {...cible}
        className="block overflow-hidden rounded-lg border border-base bg-doux"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={srcSetLarge} />
          {/* alt fourni par la campagne, dans `mobile` */}
          <img {...mobile} loading="lazy" className="block aspect-[16/10] h-auto w-full object-cover md:aspect-[26/5]" />
        </picture>
      </a>
    </aside>
  );
}

/** Mention « Publicité · annonceur », au-dessus de la bannière. */
function Mention({ campagne }) {
  return (
    <p className="mb-1.5 text-xs text-discret">
      {publicites.mention} · {campagne.annonceur}
    </p>
  );
}
