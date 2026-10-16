import { Share2 } from 'lucide-react';
import { jobDating } from '@/content/fr/services';
import { dateLongue } from '@/lib/format';
import { lienPartageWhatsApp } from '@/lib/liens';
import { site } from '@/lib/site';

/**
 * Lien « Partager sur WhatsApp ».
 * - avec `evenement` : message du Job Dating (titre, date, lieu, lien d'inscription) ;
 * - avec `texte` : message libre.
 */
export default function PartageWhatsApp({ evenement, texte, clair = false }) {
  const message = evenement
    ? jobDating.prochain.messagePartage
        .replace('{titre}', evenement.titre)
        .replace('{date}', dateLongue(evenement.date))
        .replace('{lieu}', evenement.lieu)
        .replace('{lien}', `${site.url}/job-dating/${evenement.slug}`)
    : texte;

  return (
    <a
      href={lienPartageWhatsApp(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center gap-2 font-semibold underline decoration-primaire-500 decoration-2 underline-offset-4 ${clair ? 'text-sur-sombre hover:text-marque-vif' : 'hover:text-marque'}`}
    >
      <Share2 className="h-4 w-4" aria-hidden="true" />
      Partager sur WhatsApp
    </a>
  );
}
