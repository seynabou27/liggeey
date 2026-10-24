'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, User } from 'lucide-react';
import { commun } from '@/content/fr/commun';
import { lienConnexion, lienInscription } from '@/lib/liens';
import MenuMobile from './MenuMobile';

/**
 * En-tête fixe, transparent au-dessus des bandeaux photo (comme le modèle),
 * puis ardoise dès que l’on fait défiler la page.
 * Le menu complet s’affiche à partir de 1280 px ; en dessous, menu mobile.
 */
export default function EnTete() {
  const chemin = usePathname();
  const [defile, setDefile] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const fermer = useCallback(() => setOuvert(false), []);

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 24);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  // Le menu mobile se ferme quand on change de page
  useEffect(() => setOuvert(false), [chemin]);

  const estActif = (href) => (href === '/' ? chemin === '/' : chemin.startsWith(href));

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${defile ? 'bg-sombre/95 shadow-lg backdrop-blur' : 'bg-transparent'}`}>
      <div className={`container flex h-[72px] items-center gap-8 border-b ${defile ? 'border-transparent' : 'border-white/15'}`}>
        <Link href="/" className="shrink-0" aria-label="LIGGEEY, retour à l’accueil">
          <Image src="/logo/liggeey-blanc.svg" alt="" width={123} height={24} priority />
        </Link>

        <nav aria-label="Navigation principale" className="hidden flex-1 xl:block">
          <ul className="flex items-center gap-6 whitespace-nowrap text-sm font-medium tracking-[0.2px] text-sur-sombre">
            {commun.nav.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? 'page' : undefined}
                  className={`transition-colors hover:text-marque-vif ${estActif(lien.href) ? 'text-marque-vif' : ''}`}
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <a href={lienConnexion()} className="hidden min-h-[44px] items-center gap-2 text-sm font-medium tracking-[0.2px] text-sur-sombre hover:text-marque-vif sm:inline-flex">
            <LogIn className="h-5 w-5" aria-hidden="true" />
            {commun.connexion}
          </a>
          <a
            href={lienInscription()}
            className="inline-flex h-[50px] items-center gap-2 rounded bg-marque px-4 text-sm font-medium tracking-[0.2px] text-sur-marque transition-colors hover:bg-marque-survol md:px-5"
          >
            <User className="hidden h-5 w-5 sm:block" aria-hidden="true" />
            {commun.inscription}
          </a>
          <button
            type="button"
            onClick={() => setOuvert(true)}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded text-sur-sombre hover:bg-white/10 xl:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MenuMobile ouvert={ouvert} onFermer={fermer} />
    </header>
  );
}
