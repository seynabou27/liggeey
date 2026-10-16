import { notFound } from 'next/navigation';
import { jobDating } from '@/content/fr/services';
import { getEvenement, getEvenements } from '@/lib/evenements';
import { dateLongue, heure } from '@/lib/format';
import { Section } from '@/components/ui/Section';
import EnTetePage from '@/components/blocs/EnTetePage';
import CarteEvenement from '@/components/jobdating/CarteEvenement';
import FormulaireJobDating from '@/components/formulaires/FormulaireJobDating';

export function generateStaticParams() {
  return getEvenements().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const e = getEvenement(slug);
  if (!e) return {};
  return {
    title: e.titre,
    description: `${dateLongue(e.date)}, ${e.lieu} : rencontrez des recruteurs en face à face. Participation 5 000 FCFA.`,
    alternates: { canonical: `/job-dating/${e.slug}` },
  };
}

/** Fiche d'un Job Dating : détails, programme, entreprises confirmées, inscription. */
export default async function PageEvenement({ params }) {
  const { slug } = await params;
  const evenement = getEvenement(slug);
  if (!evenement) notFound();
  const t = jobDating;

  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={evenement.titre} texte={t.hero.texte} />

      <Section>
        <CarteEvenement evenement={evenement} />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">{t.programme}</h2>
            <ol className="mt-5 flex flex-col divide-y divide-bordure border-y border-bordure">
              {evenement.programme.map((etape) => (
                <li key={etape.heure} className="flex gap-6 py-4">
                  <span className="w-16 shrink-0 font-semibold">{heure(etape.heure)}</span>
                  {etape.titre}
                </li>
              ))}
            </ol>
            {/* Les entreprises ne sont affichées que si elles ont confirmé leur participation. */}
            {evenement.entreprises.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-semibold">{t.entreprisesParticipantes}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {evenement.entreprises.map((nom) => (
                    <li key={nom} className="rounded-full border border-bordure px-4 py-2 font-medium">
                      {nom}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="h-fit rounded-lg bg-orange-clair p-6">
            <h2 className="text-xl font-semibold">{evenement.lieu}</h2>
            <p className="mt-2 text-lg">{evenement.precisionLieu}.</p>
          </div>
        </div>
      </Section>

      <Section id="inscription" fond="gris" etroit>
        <h2 className="mb-8 text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.formulaire.titre}</h2>
        <FormulaireJobDating evenement={evenement} />
      </Section>
    </>
  );
}
