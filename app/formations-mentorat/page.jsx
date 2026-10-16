import { formations } from '@/content/fr/services';
import { lienInscription } from '@/lib/liens';
import { Section, Source, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { AppelFinal, Etapes } from '@/components/blocs/Blocs';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

export const metadata = { title: formations.meta.titre, description: formations.meta.description, alternates: { canonical: '/formations-mentorat' } };

function Pastilles({ titre, items }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold">{titre}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-bordure bg-white px-4 py-2 text-sm font-medium">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PageFormations() {
  const t = formations;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        <Bouton href={lienInscription()}>Créer mon compte</Bouton>
        <Bouton href="/tarifs" variante="clair">
          Voir les tarifs
        </Bouton>
      </EnTetePage>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.formations.titre}</h2>
            <p className="mt-4 text-lg">{t.formations.texte}</p>
            <div className="mt-3">
              <Source>{t.formations.source}</Source>
            </div>
            <Pastilles titre={t.formations.themesTitre} items={t.formations.themes} />
            <p className="mt-6 font-semibold">{t.formations.prix}</p>
          </div>
          <div className="rounded-lg bg-orange-clair p-8">
            <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.mentorat.titre}</h2>
            <p className="mt-4 text-lg">{t.mentorat.texte}</p>
            <div className="mt-3">
              <Source>{t.mentorat.source}</Source>
            </div>
            <Pastilles titre={t.mentorat.domainesTitre} items={t.mentorat.domaines} />
            <p className="mt-6 font-semibold">{t.mentorat.prix}</p>
          </div>
        </div>
      </Section>

      <Section fond="gris">
        <TitreSection titre={t.etapes.titre} />
        <Etapes items={t.etapes.items} />
      </Section>

      <AppelFinal titre={t.final.titre}>
        <Bouton href={lienInscription()}>Créer mon compte</Bouton>
      </AppelFinal>
      <BandeNewsletter />
    </>
  );
}
