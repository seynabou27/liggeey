'use client';

import { commun } from '@/content/fr/commun';
import { useEnvoi } from '@/components/formulaires/useEnvoi';
import { PotDeMiel } from '@/components/formulaires/Champs';

/** Bande orange d’inscription à la newsletter (comme la bande verte du modèle). */
export default function BandeNewsletter() {
  const t = commun.newsletter;
  const { etat, erreurs, envoyer } = useEnvoi('newsletter', ['email']);

  return (
    <section aria-labelledby="titre-newsletter" className="bg-marque py-12 text-sur-marque md:py-20">
      <div className="container flex flex-col items-center gap-4 text-center">
        <h2 id="titre-newsletter" className="text-[22px] font-semibold leading-[1.27] md:text-[32px] md:leading-[1.2]">
          {t.titre}
        </h2>
        {/* Une seule ligne à partir de 768 px ; sur téléphone, le texte passe à la ligne */}
        <p className="max-w-xl text-balance text-[15px] leading-[1.7] md:max-w-none">{t.texte}</p>
        {etat === 'succes' ? (
          <p role="status" className="mt-2 rounded-lg bg-surface px-6 py-4 font-semibold">
            {t.succes}
          </p>
        ) : (
          <form noValidate onSubmit={(e) => envoyer(e)} className="relative mt-2 w-full max-w-xl">
            <PotDeMiel />
            <div className="flex items-center gap-2 rounded-lg border-2 border-principal bg-surface p-1.5">
              <label htmlFor="newsletter-email" className="sr-only">
                {t.champ}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t.champ}
                aria-invalid={erreurs.email ? true : undefined}
                aria-describedby={erreurs.email ? 'newsletter-erreur' : undefined}
                className="h-11 min-w-0 flex-1 rounded px-3 text-[15px] placeholder:text-discret focus:outline-none"
              />
              <button type="submit" disabled={etat === 'envoi'} className="h-11 shrink-0 rounded bg-sombre px-[30px] text-[13px] font-medium text-sur-sombre hover:bg-sombre-doux disabled:opacity-60">
                {t.bouton}
              </button>
            </div>
            {erreurs.email && (
              <p id="newsletter-erreur" className="mt-2 font-medium">
                {erreurs.email}
              </p>
            )}
            {etat === 'erreur' && <p className="mt-2 font-medium">L’inscription n’a pas abouti. Réessayez dans un instant.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
