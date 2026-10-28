import { getImageProps } from 'next/image';
import { publicites } from '@/content/fr/publicites';

/**
 * Bannière d’une marque affiliée (content/fr/publicites.js), sur le site et dans la plateforme.
 * Mention « Publicité » toujours visible, lien marqué rel="sponsored".
 * Image 320 × 100 sur mobile, 728 × 90 à partir de 768 px (balise <picture>), chargée seulement à l’approche.
 * La place est réservée (rapport largeur/hauteur fixe) : la page ne saute pas au chargement.
 * Sans campagne, rien ne s’affiche.
 */
export default function BannierePub({ campagne, className = '' }) {
  if (!campagne) return null;

  // Large : largeur fixe (728 px), servie en 1x et 2x. Mobile : toute la largeur de l’écran.
  const {
    props: { srcSet: srcSetLarge },
  } = getImageProps({ alt: campagne.alt, src: campagne.image.large, width: 728, height: 90 });
  const { props: mobile } = getImageProps({ alt: campagne.alt, src: campagne.image.mobile, width: 320, height: 100, sizes: '100vw' });

  return (
    <aside aria-label={publicites.mention} className={`mx-auto w-full max-w-[728px] ${className}`}>
      <p className="mb-1.5 text-xs text-discret">
        {publicites.mention} · {campagne.annonceur}
      </p>
      <a
        href={campagne.lien}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="block overflow-hidden rounded-lg border border-base bg-doux"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={srcSetLarge} />
          {/* alt fourni par la campagne, dans `mobile` */}
          <img {...mobile} loading="lazy" className="block aspect-[16/5] h-auto w-full object-cover md:aspect-[728/90]" />
        </picture>
      </a>
    </aside>
  );
}
