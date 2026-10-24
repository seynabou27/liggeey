import Image from 'next/image';
import { apropos } from '@/content/fr/confiance';
import { site } from '@/lib/site';
import { imageExiste } from '@/lib/images';
import { Section, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { GrilleAtouts } from '@/components/blocs/Blocs';
import CarteBureau from '@/components/blocs/CarteBureau';

export const metadata = { title: apropos.meta.titre, description: apropos.meta.description, alternates: { canonical: '/a-propos' } };

/** Initiales affichées tant que la photo d’un membre n’est pas fournie. */
const initiales = (nom) =>
  nom
    .split(/\s+/)
    .map((m) => m[0])
    .join('')
    .slice(0, 2);

export default function PageAPropos() {
  const t = apropos;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image} />

      <Section etroit>
        <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.histoire.titre}</h2>
        <blockquote className="mt-8 border-y-2 border-principal py-6 font-serif text-2xl leading-snug md:text-3xl">{t.histoire.citation}</blockquote>
        <div className="mt-8 flex flex-col gap-5 font-serif text-xl leading-relaxed">
          {t.histoire.paragraphes.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section fond="clair" etroit>
        <h2 className="text-2xl font-semibold">{t.difference.titre}</h2>
        <p className="mt-3 text-lg">{t.difference.texte}</p>
      </Section>

      <Section>
        <TitreSection titre={t.valeurs.titre} />
        <GrilleAtouts items={t.valeurs.items} colonnes={4} />
      </Section>

      <Section fond="gris">
        <TitreSection titre={t.equipe.titre} />
        <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {t.equipe.membres.map((m) => (
            <li key={m.nom} className="flex flex-col items-center gap-3 text-center">
              <div className="relative grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-marque-doux text-3xl font-semibold text-marque-fort">
                {imageExiste(m.photo) ? <Image src={m.photo} alt={`Portrait de ${m.nom}`} fill sizes="128px" className="object-cover" /> : <span aria-hidden="true">{initiales(m.nom)}</span>}
              </div>
              <h3 className="text-lg font-semibold">{m.nom}</h3>
              <p className="text-secondaire">{m.role}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.bureau.titre}</h2>
            <p className="mt-3 text-lg">{t.bureau.texte}</p>
            <p className="mt-4 font-semibold">
              {site.bureau.adresse}, {site.bureau.ville}
            </p>
            <p className="text-secondaire">{site.bureau.horairesCourts}</p>
          </div>
          <CarteBureau />
        </div>
      </Section>

      <Section fond="clair" etroit>
        <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.partenaires.titre}</h2>
        <p className="mt-3 text-lg">{t.partenaires.texte}</p>
        <div className="mt-6">
          <Bouton href="/contact?motif=partenariat">{t.partenaires.bouton}</Bouton>
        </div>
      </Section>
    </>
  );
}
