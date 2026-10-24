'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { contact } from '@/content/fr/aide';
import { lienCarteEmbed, lienItineraire } from '@/lib/liens';
import { site } from '@/lib/site';

/**
 * Carte du bureau, chargée seulement au clic : la page reste légère en 4G
 * et aucun service tiers n’est appelé sans action du visiteur.
 */
export default function CarteBureau() {
  const [affichee, setAffichee] = useState(false);
  const t = contact.carte;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-base bg-doux">
        {affichee ? (
          <iframe
            src={lienCarteEmbed()}
            title={`Carte : ${site.bureau.nom}`}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <MapPin className="h-8 w-8 text-marque" aria-hidden="true" />
            <p className="font-semibold">{t.titre}</p>
            <button type="button" onClick={() => setAffichee(true)} className="min-h-[44px] rounded border-2 border-principal bg-surface px-5 font-semibold hover:bg-sombre hover:text-sur-sombre">
              {t.afficher}
            </button>
            <p className="text-sm text-secondaire">{t.note}</p>
          </div>
        )}
      </div>
      <a href={lienItineraire()} target="_blank" rel="noopener noreferrer" className="lien inline-flex min-h-[44px] items-center gap-2 self-start">
        <Navigation className="h-4 w-4" aria-hidden="true" />
        {contact.moyens.itineraire}
      </a>
    </div>
  );
}
