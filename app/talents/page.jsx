import Link from 'next/link';
import { talents } from '@/content/fr/talents';
import { tarifs } from '@/content/fr/tarifs';
import { lienInscription, lienWhatsApp } from '@/lib/liens';
import { Section, Source, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { AppelFinal, Etapes, GrilleAtouts, Questions } from '@/components/blocs/Blocs';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

export const metadata = { title: talents.meta.titre, description: talents.meta.description, alternates: { canonical: '/talents' } };

export default function PageTalents() {
  const t = talents;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        <Bouton href={lienInscription('talent')}>Créer mon compte</Bouton>
        <Bouton href="/tarifs" variante="clair">
          Voir les tarifs
        </Bouton>
      </EnTetePage>

      <Section fond="clair">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="text-balance text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.constat.titre}</h2>
            <p className="mt-4 text-lg">{t.constat.texte}</p>
          </div>
          <div>
            <dl className="grid grid-cols-2 gap-6">
              {t.constat.chiffres.map((c) => (
                <div key={c.valeur} className="flex flex-col-reverse gap-2">
                  <dt>{c.texte}</dt>
                  <dd className="text-5xl font-light text-orange-texte">{c.valeur}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <Source>{t.constat.source}</Source>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <TitreSection titre={t.atouts.titre} />
        <GrilleAtouts items={t.atouts.items} />
      </Section>

      <Section fond="gris">
        <TitreSection titre={t.etapes.titre} />
        <Etapes items={t.etapes.items} />
      </Section>

      <Section>
        <TitreSection titre={t.formules.titre} />
        <ul className="grid gap-5 md:grid-cols-2">
          {tarifs.formules.map((f) => (
            <li key={f.id} className="rounded-lg border border-bordure p-6">
              <h3 className="text-xl font-semibold">{f.nom}</h3>
              <p className="mt-2 text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">
                {f.prix} <span className="text-base font-normal text-gris-fonce">{f.unite}</span>
              </p>
              <p className="mt-2 text-gris-fonce">{f.accroche}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/tarifs" className="lien">
            {t.formules.lien}
          </Link>
        </p>
      </Section>

      <Section fond="clair" etroit>
        <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.confiance.titre}</h2>
        <p className="mt-4 text-lg">{t.confiance.texte}</p>
        <div className="mt-3">
          <Source>{t.confiance.source}</Source>
        </div>
        <p className="mt-6">
          <Link href="/verification" className="lien">
            {t.confiance.lien}
          </Link>
        </p>
      </Section>

      <Section etroit>
        <TitreSection titre="Questions" />
        <Questions items={t.faq} />
        <p className="mt-6">
          <Link href="/faq" className="lien">
            Toutes les questions
          </Link>
        </p>
      </Section>

      <AppelFinal titre={t.final.titre}>
        <Bouton href={lienInscription('talent')}>Créer mon compte</Bouton>
        <Bouton href={lienWhatsApp()} variante="clair" nouvelOnglet>
          Une question ? WhatsApp
        </Bouton>
      </AppelFinal>
      <BandeNewsletter />
    </>
  );
}
