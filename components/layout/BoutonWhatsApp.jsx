import { MessageCircle } from 'lucide-react';
import { commun } from '@/content/fr/commun';
import { lienWhatsApp } from '@/lib/liens';

/** Bouton WhatsApp flottant, présent sur toutes les pages. */
export default function BoutonWhatsApp() {
  return (
    <a
      href={lienWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={commun.whatsapp.aria}
      className="fixed bottom-4 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp px-4 font-semibold text-ardoise shadow-carte transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden md:inline">{commun.whatsapp.libelle}</span>
    </a>
  );
}
