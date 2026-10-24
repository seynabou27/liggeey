import { MessageCircle } from 'lucide-react';
import { demo, entreprises } from '@/content/fr/entreprises';
import { site } from '@/lib/site';
import { lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import FormulaireDemo from '@/components/formulaires/FormulaireDemo';

export const metadata = { title: demo.meta.titre, description: demo.meta.description, alternates: { canonical: '/entreprises/demande-de-demo' } };

/** /entreprises/demande-de-demo?service=jobdating coche d’avance « Job Dating ». */
export default async function PageDemo({ searchParams }) {
  const { service = '' } = await searchParams;
  return (
    <>
      <EnTetePage surtitre="Entreprises" titre={demo.titre} texte={demo.texte.replace('{delai}', site.delais.demo)} image={entreprises.hero.image} />
      <div className="container grid gap-12 py-16 lg:grid-cols-[1fr_340px]">
        <FormulaireDemo service={service} />
        <aside className="flex h-fit flex-col gap-4 rounded-lg bg-marque-doux p-6">
          <h2 className="text-xl font-semibold">{demo.aside.titre}</h2>
          <Bouton href={lienWhatsApp('Bonjour LIGGEEY, je souhaite une démo : ')} variante="whatsapp" nouvelOnglet>
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </Bouton>
          <p className="text-secondaire">{demo.aside.rappel}</p>
        </aside>
      </div>
    </>
  );
}
