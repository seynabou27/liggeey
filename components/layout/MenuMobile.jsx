'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, X } from 'lucide-react';
import { commun } from '@/content/fr/commun';
import { lienConnexion, lienInscription, lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';

/** Menu plein écran pour mobile et tablette. Échap ou ✕ pour fermer. */
export default function MenuMobile({ ouvert, onFermer }) {
  const boutonFermer = useRef(null);

  useEffect(() => {
    if (!ouvert) return undefined;
    const debordement = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    boutonFermer.current?.focus();
    const surTouche = (e) => e.key === 'Escape' && onFermer();
    window.addEventListener('keydown', surTouche);
    return () => {
      document.body.style.overflow = debordement;
      window.removeEventListener('keydown', surTouche);
    };
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  return (
    <div id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white text-ardoise xl:hidden">
      <div className="container flex h-[72px] shrink-0 items-center justify-between border-b border-bordure">
        <Image src="/logo/liggeey-ardoise.svg" alt="LIGGEEY" width={113} height={22} />
        <button ref={boutonFermer} type="button" onClick={onFermer} aria-label="Fermer le menu" className="inline-flex h-11 w-11 items-center justify-center rounded hover:bg-gris-fond">
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Menu" className="container flex-1 py-6">
        <Link href="/" onClick={onFermer} className="flex min-h-[48px] items-center text-xl font-semibold">
          Accueil
        </Link>
        {commun.groupes.map((groupe) => (
          <div key={groupe.titre} className="border-t border-bordure py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-texte">{groupe.titre}</p>
            <ul className="mt-2">
              {groupe.liens.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} onClick={onFermer} className="flex min-h-[48px] items-center text-lg font-semibold">
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="container flex flex-col gap-3 border-t border-bordure py-6">
        <Bouton href={lienConnexion()} variante="secondaire" pleineLargeur>
          {commun.connexion}
        </Bouton>
        <Bouton href={lienInscription()} pleineLargeur>
          {commun.inscription}
        </Bouton>
        <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer" className="lien inline-flex min-h-[44px] items-center justify-center gap-2">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {commun.whatsapp.libelle} WhatsApp
        </a>
      </div>
    </div>
  );
}
