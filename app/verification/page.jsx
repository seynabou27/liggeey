import { Check } from 'lucide-react';
import { verification } from '@/content/fr/confiance';
import { lienInscription } from '@/lib/liens';
import { Section } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import Icone from '@/components/ui/Icone';
import EnTetePage from '@/components/blocs/EnTetePage';
import { AppelFinal } from '@/components/blocs/Blocs';

export const metadata = { title: verification.meta.titre, description: verification.meta.description, alternates: { canonical: '/verification' } };

export default function PageVerification() {
  const t = verification;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} source={t.hero.source} />

      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {t.controles.map((c) => (
            <li key={c.titre} className="flex flex-col gap-4 rounded-lg border border-bordure p-7">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-orange-clair text-orange-texte">
                  <Icone nom={c.icone} />
                </span>
                <h2 className="text-2xl font-semibold">{c.titre}</h2>
              </div>
              <p className="text-lg">{c.texte}</p>
              {c.liste && (
                <ul className="flex flex-col gap-2">
                  {c.liste.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-texte" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {c.delai && <p className="font-semibold">{c.delai}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section fond="clair">
        <dl className="grid gap-8 md:grid-cols-3">
          {t.ensuite.map((item) => (
            <div key={item.titre}>
              <dt className="text-xl font-semibold">{item.titre}</dt>
              <dd className="mt-2 text-lg">{item.texte}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <AppelFinal titre={t.final.titre}>
        <Bouton href={lienInscription()}>Créer mon compte</Bouton>
        <Bouton href="/entreprises/demande-de-demo" variante="clair">
          Demander une démo
        </Bouton>
      </AppelFinal>
    </>
  );
}
