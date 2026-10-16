import Link from 'next/link';
import { commun } from '@/content/fr/commun';
import { legal } from '@/content/fr/legal';
import EnTetePage from '@/components/blocs/EnTetePage';

/** Gabarit commun aux mentions légales, CGU et politique de confidentialité. */
export default function PageLegale({ cle }) {
  const page = legal.pages[cle];
  return (
    <>
      <EnTetePage surtitre="Informations légales" titre={page.titre} texte={legal.miseAJour} />
      <div className="container grid gap-10 py-16 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Pages légales" className="flex flex-wrap gap-2 lg:flex-col">
          {commun.legal.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              aria-current={lien.href === `/${cle}` ? 'page' : undefined}
              className={`inline-flex min-h-[44px] items-center rounded-full border-2 px-4 text-sm font-semibold lg:rounded-lg ${lien.href === `/${cle}` ? 'border-principal bg-sombre text-sur-sombre' : 'border-base hover:border-principal'}`}
            >
              {lien.label}
            </Link>
          ))}
        </nav>
        <article className="max-w-3xl">
          <p role="note" className="rounded-lg bg-marque-doux p-4 font-medium">
            {legal.avertissement}
          </p>
          {page.sections.map((s) => (
            <section key={s.titre} className="mt-10">
              <h2 className="text-2xl font-semibold">{s.titre}</h2>
              {s.texte.map((p) => (
                <p key={p} className="mt-3 text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
