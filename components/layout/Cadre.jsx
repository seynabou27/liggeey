'use client';

import { usePathname } from 'next/navigation';

/**
 * En-tête, pied de page et bouton WhatsApp du site public.
 * La plateforme (/plateforme) a sa propre interface : elle s'affiche seule, en plein écran.
 */
export default function Cadre({ entete, pied, whatsapp, children }) {
  const chemin = usePathname() || '';

  if (chemin.startsWith('/plateforme')) {
    return <div id="contenu">{children}</div>;
  }

  return (
    <>
      {entete}
      <main id="contenu">{children}</main>
      {pied}
      {whatsapp}
    </>
  );
}
