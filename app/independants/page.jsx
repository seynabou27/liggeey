import Link from 'next/link';
import { Check } from 'lucide-react';
import { independants } from '@/content/fr/independants';
import { lienInscription } from '@/lib/liens';
import { Section, Source, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { AppelFinal, BlocAide, GrilleAtouts, Questions } from '@/components/blocs/Blocs';
import VideoWolof from '@/components/blocs/VideoWolof';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

export const metadata = { title: independants.meta.titre, description: independants.meta.description, alternates: { canonical: '/independants' } };

function Lettre({ children }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sombre font-semibold text-sur-sombre" aria-hidden="true">
      {children}
    </span>
  );
}

export default function PageIndependants() {
  const t = independants;
  // Seules les vidéos déjà produites s'affichent ; sans vidéo, la section et son lien sont masqués
  const videos = t.wolof.videos.filter((v) => v.src);
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        <Bouton href="#formaliser">{t.hero.choixA}</Bouton>
        <Bouton href="#emploi" variante="clair">
          {t.hero.choixB}
        </Bouton>
        {videos.length > 0 && (
          <Link href="#wolof" className="inline-flex min-h-[44px] items-center font-semibold underline decoration-primaire-500 decoration-2 underline-offset-4">
            {t.hero.audio}
          </Link>
        )}
      </EnTetePage>

      <Section fond="clair">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
          <p className="text-7xl font-light text-marque">{t.constat.valeur}</p>
          <div>
            <h2 className="text-balance text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.constat.titre}</h2>
            <p className="mt-3 text-lg">{t.constat.texte}</p>
            <div className="mt-3">
              <Source>{t.constat.source}</Source>
            </div>
          </div>
        </div>
      </Section>

      <Section id="formaliser">
        <div className="flex items-center gap-4">
          <Lettre>{t.cheminA.lettre}</Lettre>
          <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.cheminA.titre}</h2>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-secondaire">{t.cheminA.texte}</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.cheminA.etapes.map((e) => (
            <li key={e.titre} className="flex gap-3 rounded-lg border border-base p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-marque" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">{e.titre}</h3>
                <p className="mt-1 text-secondaire">{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-lg font-semibold">{t.cheminA.prix}</p>
        <p className="mt-2 text-secondaire">{t.cheminA.note}</p>
        <div className="mt-6">
          <Bouton href={lienInscription('independant', { objectif: 'formaliser' })}>{t.cheminA.bouton}</Bouton>
        </div>
      </Section>

      <Section id="emploi" fond="gris">
        <div className="flex items-center gap-4">
          <Lettre>{t.cheminB.lettre}</Lettre>
          <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.cheminB.titre}</h2>
        </div>
        <p className="mb-8 mt-4 max-w-2xl text-lg text-secondaire">{t.cheminB.texte}</p>
        <GrilleAtouts items={t.cheminB.items} colonnes={4} />
        <div className="mt-8">
          <Bouton href={lienInscription('independant', { objectif: 'emploi' })}>{t.cheminB.bouton}</Bouton>
        </div>
      </Section>

      {videos.length > 0 && (
        <Section id="wolof">
          <TitreSection titre={t.wolof.titre} texte={t.wolof.texte} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.id}>
                <VideoWolof video={v} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <BlocAide titre={t.aide.titre} texte={t.aide.texte} />

      <Section etroit>
        <TitreSection titre="Questions" />
        <Questions items={t.faq} />
        <p className="mt-6">
          <Link href="/tarifs" className="lien">
            Voir tous les tarifs
          </Link>
        </p>
      </Section>

      <AppelFinal titre={t.final.titre}>
        <Bouton href={lienInscription('independant', { objectif: 'formaliser' })}>{t.hero.choixA}</Bouton>
        <Bouton href={lienInscription('independant', { objectif: 'emploi' })} variante="clair">
          {t.hero.choixB}
        </Bouton>
      </AppelFinal>
      <BandeNewsletter />
    </>
  );
}
