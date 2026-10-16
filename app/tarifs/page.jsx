import { tarifs } from '@/content/fr/tarifs';
import { Section, TitreSection } from '@/components/ui/Section';
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
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} />

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
        <div className="flex flex-col gap-6 rounded-lg border border-bordure p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{t.paiement.titre}</h2>
            <p className="mt-2 text-gris-fonce">{t.paiement.texte}</p>
          </div>
          {/* À remplacer par les logos officiels (fichiers fournis par Wave et Orange Money) */}
          <div className="flex gap-3">
            <span className="rounded-lg border border-bordure px-5 py-3 font-semibold">Wave</span>
            <span className="rounded-lg border border-bordure px-5 py-3 font-semibold">Orange Money</span>
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
