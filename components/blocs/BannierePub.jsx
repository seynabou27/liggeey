import { getImageProps } from 'next/image';
import { publicites } from '@/content/fr/publicites';

/**
 * Bannière d’une marque affiliée (content/fr/publicites.js), sur le site et dans la plateforme.
 * Mention « Publicité » toujours visible, lien marqué rel="sponsored".
 * Grand format : image 16:10 sur toute la largeur sur mobile (320 × 200), 970 × 250 à partir de 768 px
 * (balise <picture>), chargée seulement à l’approche.
 * La place est réservée (rapport largeur/hauteur fixe) : la page ne saute pas au chargement.
 * Sans campagne, rien ne s’affiche.
 */
export default function BannierePub({ campagne, className = '' }) {
  if (!campagne) return null;

  // Large : jusqu’à 970 px de large. Mobile : toute la largeur de l’écran.
  const {
    props: { srcSet: srcSetLarge },
  } = getImageProps({ alt: campagne.alt, src: campagne.image.large, width: 970, height: 250, sizes: '(min-width: 1010px) 970px, 100vw' });
  const { props: mobile } = getImageProps({ alt: campagne.alt, src: campagne.image.mobile, width: 320, height: 200, sizes: '100vw' });

  // Lien vers la marque : nouvel onglet. Lien interne (campagne d’exemple → /tarifs) : même onglet.
  const cible = campagne.lien.startsWith('/') ? { rel: 'sponsored' } : { target: '_blank', rel: 'sponsored noopener noreferrer' };

  return (
    <aside aria-label={publicites.mention} className={`mx-auto w-full max-w-[970px] ${className}`}>
      <p className="mb-1.5 text-xs text-discret">
        {publicites.mention} · {campagne.annonceur}
      </p>
      <a
        href={campagne.lien}
        {...cible}
        className="block overflow-hidden rounded-lg border border-base bg-doux"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={srcSetLarge} />
          {/* alt fourni par la campagne, dans `mobile` */}
          <img {...mobile} loading="lazy" className="block aspect-[16/10] h-auto w-full object-cover md:aspect-[970/250]" />
        </picture>
      </a>
    </aside>
  );
}
