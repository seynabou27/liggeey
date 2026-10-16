import Link from 'next/link';
import { lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';

export const metadata = { title: 'Page introuvable' };

export default function PageIntrouvable() {
  return (
    <section className="bg-sombre pb-24 pt-[160px] text-sur-sombre">
      <div className="container max-w-2xl">
        <p className="text-sm font-semibold text-marque-vif">Erreur 404</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Cette page n'existe pas, ou plus.</h1>
        <p className="mt-5 text-lg text-white/90">Le lien est peut-être ancien. Voici où aller ensuite :</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Bouton href="/">Retour à l'accueil</Bouton>
          <Bouton href={lienWhatsApp()} variante="clair" nouvelOnglet>
            Nous écrire sur WhatsApp
          </Bouton>
        </div>
        <p className="mt-8">
          <Link href="/faq" className="font-semibold underline decoration-primaire-500 decoration-2 underline-offset-4 hover:text-marque-vif">
            Consulter la FAQ
          </Link>
        </p>
      </div>
    </section>
  );
}
