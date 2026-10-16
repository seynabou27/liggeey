import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, MapPin, MessageCircle } from 'lucide-react';
import { commun } from '@/content/fr/commun';
import { site } from '@/lib/site';
import { lienWhatsApp } from '@/lib/liens';

/**
 * Pied de page sombre, sur le modèle validé.
 * « Besoin d'aide ? » remplace les boutons App Store / Google Play du modèle,
 * et les moyens de paiement remplacent les compteurs.
 */
export default function PiedDePage() {
  const annee = new Date().getFullYear();
  const reseaux = site.contact.reseaux.filter((r) => r.url);

  return (
    <footer className="bg-sombre text-sur-sombre">
      <div className="container grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <Image src="/logo/liggeey-blanc.svg" alt="LIGGEEY" width={123} height={24} />
          <p className="max-w-xs text-[13px] font-medium leading-[1.8] text-white/85">{site.slogan}</p>
          <p className="flex items-start gap-2 text-[13px] font-medium leading-[1.8] text-white/85">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {site.bureau.adresse}, {site.bureau.ville}
          </p>
          {reseaux.length > 0 && (
            <ul className="flex flex-wrap gap-3 text-[13px] font-medium">
              {reseaux.map((r) => (
                <li key={r.nom}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-marque-vif">
                    {r.nom}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {commun.groupes.map((groupe) => (
          <nav key={groupe.titre} aria-label={groupe.titre}>
            <h2 className="text-[15px] font-semibold">{groupe.titre}</h2>
            <ul className="mt-5 flex flex-col">
              {groupe.liens.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="inline-flex min-h-[36px] items-center text-[13px] font-medium text-white/85 hover:text-marque-vif">
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-[15px] font-semibold">{commun.aide.titre}</h2>
          <div className="mt-5 flex flex-col gap-3">
            <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border-2 border-white/25 px-4 py-2.5 hover:border-marque">
              <MessageCircle className="h-6 w-6 text-marque-vif" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-white/80">{commun.aide.whatsapp[0]}</span>
                <span className="text-xl font-semibold">{commun.aide.whatsapp[1]}</span>
              </span>
            </a>
            <Link href="/contact#bureau" className="flex items-center gap-3 rounded-lg border-2 border-white/25 px-4 py-2.5 hover:border-marque">
              <MapPin className="h-6 w-6 text-marque-vif" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-white/80">{commun.aide.bureau[0]}</span>
                <span className="text-xl font-semibold">{commun.aide.bureau[1]}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container flex flex-col gap-4 py-5 text-[13px] font-medium text-white/85 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© {annee} LIGGEEY</span>
            {commun.legal.map((lien) => (
              <Link key={lien.href} href={lien.href} className="hover:text-marque-vif">
                {lien.label}
              </Link>
            ))}
          </p>
          <div className="flex items-center gap-3">
            <span>{commun.paiement}</span>
            {/* À remplacer par les logos officiels Wave et Orange Money (public/paiement/) */}
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-principal">Wave</span>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-principal">Orange Money</span>
            <a href="#haut" aria-label="Revenir en haut de la page" className="ml-2 grid h-11 w-11 place-items-center rounded bg-marque text-sur-marque hover:bg-marque-survol">
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
