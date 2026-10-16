import Image from 'next/image';
import { accueil } from '@/content/fr/accueil';
import { imageExiste } from '@/lib/images';
import { VagueAccueil } from '@/components/ui/Vague';
import Compteur from '@/components/ui/Compteur';
import CarteRecherche from './CarteRecherche';

/**
 * Bandeau d'accueil, calqué sur le modèle validé (étape 4, wireframe 2a) :
 * photo assombrie, titre et repères à gauche, carte de recherche à droite,
 * découpe en vague qui remonte vers la droite sous la carte.
 */
export default function BandeauAccueil() {
  const { hero } = accueil;
  const avecPhoto = imageExiste(hero.image);

  return (
    <section aria-labelledby="titre-accueil" className="relative overflow-hidden bg-ardoise text-white">
      {avecPhoto && <Image src={hero.image} alt="" fill priority sizes="100vw" className="object-cover" />}
      {/* Voile sombre sous le texte (contraste), plus léger à droite pour laisser vivre la photo */}
      <div className="absolute inset-0 bg-ardoise/75 lg:bg-transparent lg:bg-gradient-to-r lg:from-ardoise/90 lg:via-ardoise/60 lg:to-ardoise/10" aria-hidden="true" />
      <VagueAccueil />

      <div className="container relative grid gap-10 pb-12 pt-[124px] lg:min-h-[740px] lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-14 lg:pb-32 lg:pt-[104px]">
        <div className="flex flex-col lg:pt-[78px]">
          <p className="flex items-center gap-2.5 text-base font-medium text-orange">
            <span className="h-0.5 w-9 bg-orange" aria-hidden="true" />
            {hero.surtitre}
          </p>
          <h1 id="titre-accueil" className="mt-4 max-w-[640px] text-balance text-[25px] font-semibold leading-[1.3] sm:text-[40px] lg:text-[57px]">
            {hero.titre}
          </h1>
          <p className="mt-6 max-w-[600px] text-pretty text-xl leading-[1.8] text-white/90">{hero.texte}</p>
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
            {hero.reperes.map((r) => (
              <div key={r.libelle} className="flex flex-col-reverse gap-2">
                <dt className="text-sm text-white/90 sm:text-base">{r.libelle}</dt>
                <dd className="text-[32px] font-light leading-none sm:text-5xl">
                  <Compteur valeur={r.valeur} />
                  <span className={`ml-1.5 text-orange ${r.petit ? 'text-2xl sm:text-3xl' : ''}`}>{r.unite}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <CarteRecherche />
      </div>
    </section>
  );
}
