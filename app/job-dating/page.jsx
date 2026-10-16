import { jobDating } from '@/content/fr/services';
import { getProchainEvenement } from '@/lib/evenements';
import { Section, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { Etapes } from '@/components/blocs/Blocs';
import CarteEvenement from '@/components/jobdating/CarteEvenement';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

// La page se met à jour chaque jour : le « prochain » événement change avec la date.
export const revalidate = 86400;

export const metadata = { title: jobDating.meta.titre, description: jobDating.meta.description, alternates: { canonical: '/job-dating' } };

export default function PageJobDating() {
  const t = jobDating;
  const evenement = getProchainEvenement();

  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        {evenement && <Bouton href={`/job-dating/${evenement.slug}#inscription`}>{t.hero.bouton}</Bouton>}
      </EnTetePage>

      <Section>
        <TitreSection titre={t.prochain.titre} />
        {evenement ? <CarteEvenement evenement={evenement} lienDetails /> : <p className="rounded-lg bg-marque-doux p-8 text-lg">{t.prochain.vide}</p>}
      </Section>

      <Section fond="gris">
        <TitreSection titre={t.etapes.titre} />
        <Etapes items={t.etapes.items} />
      </Section>

      <Section fond="clair" etroit>
        <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.entreprises.titre}</h2>
        <p className="mt-3 text-lg">{t.entreprises.texte}</p>
        <div className="mt-6">
          <Bouton href="/entreprises/demande-de-demo?service=jobdating" variante="secondaire">
            {t.entreprises.bouton}
          </Bouton>
        </div>
      </Section>
      <BandeNewsletter />
    </>
  );
}
