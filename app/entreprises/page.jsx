import Link from 'next/link';
import { entreprises } from '@/content/fr/entreprises';
import { lienWhatsApp } from '@/lib/liens';
import { Section, Source, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { AppelFinal, Etapes, Questions } from '@/components/blocs/Blocs';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

export const metadata = { title: entreprises.meta.titre, description: entreprises.meta.description, alternates: { canonical: '/entreprises' } };

export default function PageEntreprises() {
  const t = entreprises;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        <Bouton href="/entreprises/demande-de-demo">Demander une démo</Bouton>
        <Bouton href="/tarifs" variante="clair">
          Voir les tarifs
        </Bouton>
      </EnTetePage>

      <Section etroit>
        <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.constat.titre}</h2>
        <p className="mt-4 text-lg">{t.constat.texte}</p>
        <div className="mt-3">
          <Source>{t.constat.source}</Source>
        </div>
      </Section>

      <Section fond="gris">
        <TitreSection titre={t.recrutement.titre} />
        <Etapes items={t.recrutement.items} />
      </Section>

      <Section fond="clair">
        <TitreSection titre={t.suivi.titre} texte={t.suivi.texte} />
        <ol className="relative grid gap-6 sm:grid-cols-4">
          <span className="absolute left-[12%] right-[12%] top-6 hidden h-0.5 bg-sombre sm:block" aria-hidden="true" />
          {t.suivi.jalons.map((j) => (
            <li key={j.jour} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sombre text-sm font-semibold text-sur-sombre">{j.jour}</span>
              <span className="font-semibold">{j.titre}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-lg font-semibold">{t.suivi.prix}</p>
      </Section>

      <Section>
        <div className="flex flex-col items-start gap-3 rounded-lg border border-base p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg">{t.jobDating.texte}</p>
          <Link href="/job-dating" className="lien shrink-0">
            {t.jobDating.lien}
          </Link>
        </div>

        <h2 className="mt-14 text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.tarifs.titre}</h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {t.tarifs.items.map((item) => (
            <li key={item.titre} className="rounded-lg border border-base p-6">
              <h3 className="text-xl font-semibold">{item.titre}</h3>
              <p className="mt-2 text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">
                {item.prix} <span className="text-base font-normal text-secondaire">{item.unite}</span>
              </p>
              <p className="mt-2 text-secondaire">{item.texte}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-secondaire">{t.tarifs.note}</p>
      </Section>

      <Section fond="gris" etroit>
        <TitreSection titre="Questions" />
        <Questions items={t.faq} />
      </Section>

      <AppelFinal titre={t.final.titre}>
        <Bouton href="/entreprises/demande-de-demo">Demander une démo</Bouton>
        <Bouton href={lienWhatsApp('Bonjour LIGGEEY, je souhaite recruter : ')} variante="clair" nouvelOnglet>
          Ou écrivez-nous sur WhatsApp
        </Bouton>
      </AppelFinal>
      <BandeNewsletter />
    </>
  );
}
