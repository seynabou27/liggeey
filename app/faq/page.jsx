import { MessageCircle } from 'lucide-react';
import { faq } from '@/content/fr/aide';
import { lienWhatsApp } from '@/lib/liens';
import { Section } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import { Questions } from '@/components/blocs/Blocs';

export const metadata = { title: faq.meta.titre, description: faq.meta.description, alternates: { canonical: '/faq' } };

export default function PageFaq() {
  const t = faq;
  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Sommaire des rubriques : pastilles qui passent à la ligne sur mobile (toutes visibles), colonne sur ordinateur */}
          <nav aria-label="Rubriques">
            <ul className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:flex-col">
              {t.rubriques.map((r) => (
                <li key={r.id}>
                  <a href={`#${r.id}`} className="inline-flex min-h-[44px] items-center rounded-full border-2 border-base px-4 text-sm font-semibold hover:border-principal lg:w-full lg:rounded-lg">
                    {r.titre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex max-w-3xl flex-col gap-14">
            {t.rubriques.map((r) => (
              <section key={r.id} id={r.id} aria-labelledby={`titre-${r.id}`}>
                <h2 id={`titre-${r.id}`} className="mb-4 text-2xl font-semibold">
                  {r.titre}
                </h2>
                <Questions items={r.questions} />
              </section>
            ))}
          </div>
        </div>
      </Section>

      <Section fond="clair" etroit>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">{t.pasTrouve.titre}</h2>
          <Bouton href={lienWhatsApp()} variante="whatsapp" nouvelOnglet>
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {t.pasTrouve.bouton}
          </Bouton>
        </div>
      </Section>
    </>
  );
}
