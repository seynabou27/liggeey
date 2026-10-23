import { Check, Smartphone } from 'lucide-react';
import { tarifs } from '@/content/fr/tarifs';
import { lienInscription } from '@/lib/liens';
import { Section, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { Questions } from '@/components/blocs/Blocs';
import GuideFormule from '@/components/tarifs/GuideFormule';
import OngletsTarifs from '@/components/tarifs/OngletsTarifs';
import TableauServices from '@/components/tarifs/TableauServices';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

export const metadata = { title: tarifs.meta.titre, description: tarifs.meta.description, alternates: { canonical: '/tarifs' } };

export default function PageTarifs() {
  const t = tarifs;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        <Bouton href={lienInscription()}>{t.hero.inscription}</Bouton>
        <Bouton href="/entreprises/demande-de-demo" variante="clair">
          {t.hero.demo}
        </Bouton>
      </EnTetePage>

      <Section fond="clair" etroit>
        <GuideFormule />
      </Section>

      <Section>
        <OngletsTarifs />
      </Section>

      <Section fond="gris" etroit>
        <TableauServices />
      </Section>

      <Section etroit>
        <div className="grid gap-6 rounded-lg bg-marque-doux p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-surface text-marque" aria-hidden="true">
              <Smartphone className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold">{t.paiement.titre}</h2>
              <p className="mt-1 text-secondaire">{t.paiement.texte}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {t.paiement.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[15px]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-marque" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* À remplacer par les logos officiels (fichiers fournis par Wave et Orange Money) */}
          <div className="flex gap-3 md:flex-col">
            <span className="flex min-h-[56px] flex-1 items-center justify-center rounded-lg bg-surface px-6 font-semibold shadow-carte">Wave</span>
            <span className="flex min-h-[56px] flex-1 items-center justify-center rounded-lg bg-surface px-6 font-semibold shadow-carte">Orange Money</span>
          </div>
        </div>
        <div className="mt-14">
          <TitreSection titre="Questions" />
          <Questions items={t.faq} />
        </div>
      </Section>
      <BandeNewsletter />
    </>
  );
}
