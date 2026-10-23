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
    <section aria-labelledby="titre-accueil" className="relative overflow-hidden bg-sombre text-sur-sombre">
      {avecPhoto && <Image src={hero.image} alt="" fill priority sizes="100vw" className="object-cover" />}
      {/* Voile sombre sous le texte (contraste), plus léger à droite pour laisser vivre la photo */}
      <div className="absolute inset-0 bg-sombre/75 xl:bg-transparent xl:bg-gradient-to-r xl:from-sombre/90 xl:via-sombre/60 xl:to-sombre/10" aria-hidden="true" />
      <VagueAccueil />

      {/* Deux colonnes seulement à partir de 1280 px : en dessous, le titre manque de place à côté de la carte */}
      <div className="container relative grid gap-8 pb-12 pt-[104px] sm:gap-10 sm:pt-[124px] xl:min-h-[740px] xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-14 xl:pb-32 xl:pt-[104px]">
        <div className="flex flex-col xl:pt-[78px]">
          <p className="flex items-center gap-2.5 text-sm font-medium text-marque-vif sm:text-base">
            <span className="h-0.5 w-6 shrink-0 bg-marque sm:w-9" aria-hidden="true" />
            {hero.surtitre}
          </p>
          <h1 id="titre-accueil" className="mt-3 max-w-[640px] text-balance text-[30px] font-semibold leading-[1.2] sm:mt-4 sm:text-[44px] xl:text-[57px]">
            {hero.titre}
          </h1>
          <p className="mt-4 max-w-[600px] text-pretty text-base leading-[1.7] text-white/90 sm:mt-6 sm:text-xl sm:leading-[1.8]">{hero.texte}</p>
          {/* Les trois repères toujours sur une ligne : grille jusqu'à 768 px, puis espacés librement */}
          <dl className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-6 md:flex md:flex-wrap md:gap-x-12 md:gap-y-5 xl:gap-x-8">
            {hero.reperes.map((r) => (
              <div key={r.libelle} className="flex flex-col-reverse justify-end gap-1.5 sm:gap-2">
                <dt className="text-xs leading-snug text-white/90 sm:text-sm md:text-base">{r.libelle}</dt>
                <dd className="text-[28px] font-light leading-none sm:text-4xl md:text-5xl">
                  <Compteur valeur={r.valeur} />
                  <span className={`ml-1 text-marque-vif sm:ml-1.5 ${r.petit ? 'text-2xl sm:text-3xl' : ''}`}>{r.unite}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {/* Carte empilée sous le texte jusqu'à 1280 px, sans s'étirer sur toute la largeur */}
        <div className="w-full max-w-2xl xl:max-w-none">
          <CarteRecherche />
        </div>
      </div>
    </section>
  );
}
