import Image from 'next/image';
import { imageExiste } from '@/lib/images';
import { VagueDouce } from '@/components/ui/Vague';

/**
 * Haut des pages intérieures : bandeau sombre (photo facultative), titre h1,
 * texte et boutons, avec une vague discrète. L'en-tête transparent se pose dessus.
 */
export default function EnTetePage({ surtitre, titre, texte, image, source, children }) {
  const avecPhoto = imageExiste(image);
  return (
    <section className="relative overflow-hidden bg-sombre pb-24 pt-[128px] text-sur-sombre md:pb-32 md:pt-[156px]">
      {avecPhoto && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />}
      <div className="absolute inset-0 bg-sombre/80" aria-hidden="true" />
      <div className="container relative">
        <div className="max-w-3xl">
          {surtitre && (
            <p className="flex items-center gap-2.5 text-base font-medium text-marque-vif">
              <span className="h-0.5 w-9 bg-marque" aria-hidden="true" />
              {surtitre}
            </p>
          )}
          <h1 className="mt-4 text-balance text-[25px] font-semibold leading-[1.3] sm:text-[36px] lg:text-[48px]">{titre}</h1>
          {texte && <p className="mt-5 max-w-2xl text-pretty text-lg leading-[1.8] text-white/90 sm:text-xl">{texte}</p>}
          {source && <p className="mt-3 text-sm text-white/80">{source}</p>}
          {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
      </div>
      <VagueDouce />
    </section>
  );
}
