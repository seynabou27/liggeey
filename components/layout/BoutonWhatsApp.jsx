'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { commun } from '@/content/fr/commun';
import { lienWhatsApp } from '@/lib/liens';

/**
 * Bouton WhatsApp flottant, présent sur toutes les pages.
 * Il s’efface quand le pied de page est visible : celui-ci affiche déjà WhatsApp,
 * et le bouton ne recouvre plus la fin de la page.
 * Pastille ronde de 56 px pour ne pas masquer le contenu ; sur ordinateur, le libellé
 * se déplie au survol et au focus clavier.
 */
export default function BoutonWhatsApp() {
  const [masque, setMasque] = useState(false);

  useEffect(() => {
    const pied = document.querySelector('footer');
    if (!pied) return undefined;
    const observateur = new IntersectionObserver(([entree]) => setMasque(entree.isIntersecting));
    observateur.observe(pied);
    return () => observateur.disconnect();
  }, []);

  return (
    <a
      href={lienWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={commun.whatsapp.aria}
      aria-hidden={masque || undefined}
      tabIndex={masque ? -1 : undefined}
      className={`group fixed bottom-4 right-4 z-40 inline-flex h-14 min-w-[56px] items-center justify-center rounded-full bg-whatsapp px-4 font-semibold text-sur-marque shadow-carte transition-all duration-300 hover:scale-105 md:bottom-6 md:right-6 ${
        masque ? 'pointer-events-none translate-y-4 opacity-0' : ''
      }`}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 md:group-hover:ml-2 md:group-hover:max-w-[10rem] md:group-hover:opacity-100 md:group-focus-visible:ml-2 md:group-focus-visible:max-w-[10rem] md:group-focus-visible:opacity-100">
        {commun.whatsapp.libelle}
      </span>
    </a>
  );
}
