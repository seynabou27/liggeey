import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import { commun } from '@/content/fr/commun';
import { site } from '@/lib/site';
import { lienConnexion, lienInscription, lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import IconeReseau from '@/components/ui/IconeReseau';

/** Une ligne de contact : icône, libellé discret, puis la valeur (lien ou texte). */
function LigneContact({ icone: IconeContact, libelle, valeur, href, externe = false }) {
  const contenu = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-marque-vif" aria-hidden="true">
        <IconeContact className="h-[18px] w-[18px]" />
      </span>
      <span className="flex min-w-0 flex-col leading-snug">
        <span className="text-xs text-white/70">{libelle}</span>
        <span className="text-[13px] font-medium text-white group-hover:text-marque-vif">{valeur}</span>
      </span>
    </>
  );
  const classes = 'group flex min-h-[44px] items-center gap-3';

  if (!href) return <li className={classes}>{contenu}</li>;
  const cible = externe ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <li>
      <a href={href} className={classes} {...cible}>
        {contenu}
      </a>
    </li>
  );
}

/**
 * Pied de page sombre, sur le modèle validé.
 * À gauche : présentation et accès à la plateforme ; au centre : les liens ; à droite : les coordonnées.
 */
export default function PiedDePage({ reseaux: listeReseaux = site.contact.reseaux }) {
  const annee = new Date().getFullYear();
  // Réseaux sans adresse : icône affichée seule, sans lien (en attendant les vrais comptes)
  const reseaux = listeReseaux;
  const t = commun.pied;

  return (
    <footer className="border-t-4 border-marque bg-sombre text-sur-sombre">
      {/*
        Mobile : présentation, puis Parcours et Services côte à côte, LIGGEEY sur toute la largeur (liens sur deux colonnes), puis contact.
        Tablette et petit ordinateur : présentation en ligne (texte à gauche, boutons à droite), liens sur une rangée de trois, contact en 2 × 2.
        À partir de 1 280 px : cinq colonnes.
      */}
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-3 md:gap-x-10 md:py-16 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]">
        <div className="col-span-2 flex flex-col gap-5 md:col-span-3 md:flex-row md:items-center md:justify-between xl:col-span-1 xl:flex-col xl:items-start xl:justify-start">
          <div className="flex flex-col gap-4">
            <Image src="/logo/liggeey-blanc.svg" alt="LIGGEEY" width={123} height={24} />
            <p className="max-w-xs text-[13px] font-medium leading-[1.8] text-white/85">{site.slogan}</p>
            {reseaux.length > 0 && (
              <div>
                <p className="text-xs text-white/70">{t.reseaux.titre}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {reseaux.map((r) => {
                    const classes = 'grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white';
                    return (
                      <li key={r.nom}>
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${r.nom} (${t.reseaux.nouvelOnglet})`}
                            title={r.nom}
                            className={`${classes} transition-colors hover:bg-marque hover:text-sur-marque`}
                          >
                            <IconeReseau nom={r.nom} />
                          </a>
                        ) : (
                          <span role="img" aria-label={r.nom} title={r.nom} className={classes}>
                            <IconeReseau nom={r.nom} />
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          {/* À partir de 1 280 px, la colonne est étroite : boutons empilés, de même largeur */}
          <div className="flex flex-wrap items-center gap-3 xl:w-56 xl:flex-col xl:items-stretch">
            <Bouton href={lienInscription()} petit>
              {t.inscription}
            </Bouton>
            <Bouton href={lienConnexion()} variante="clair" petit>
              {commun.connexion}
            </Bouton>
          </div>
        </div>

        {commun.groupes.map((groupe, i) => {
          // Sur mobile, le dernier groupe (impair) prend toute la largeur pour ne pas laisser de vide à droite
          const pleineLargeur = i === commun.groupes.length - 1 && commun.groupes.length % 2 === 1;
          return (
            <nav key={groupe.titre} aria-label={groupe.titre} className={pleineLargeur ? 'col-span-2 md:col-span-1' : ''}>
              <h2 className="text-[15px] font-semibold">{groupe.titre}</h2>
              <ul className={`mt-3 md:mt-4 ${pleineLargeur ? 'grid grid-cols-2 gap-x-6 md:flex md:flex-col' : 'flex flex-col'}`}>
                {groupe.liens.map((lien) => (
                  <li key={lien.href}>
                    <Link href={lien.href} className="inline-flex min-h-[44px] items-center text-[13px] font-medium text-white/85 hover:text-marque-vif">
                      {lien.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}

        <div className="col-span-2 md:col-span-3 xl:col-span-1">
          <h2 className="text-[15px] font-semibold">{t.contact.titre}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-x-6 md:mt-4 xl:grid-cols-1">
            <LigneContact icone={MessageCircle} libelle={t.contact.whatsapp} valeur={site.contact.whatsappAffiche} href={lienWhatsApp()} externe />
            <LigneContact icone={Mail} libelle={t.contact.email} valeur={site.contact.email} href={`mailto:${site.contact.email}`} />
            <LigneContact icone={MapPin} libelle={t.contact.bureau} valeur={`${site.bureau.adresse}, ${site.bureau.ville}`} href="/contact#bureau" />
            <LigneContact icone={Clock} libelle={t.contact.horaires} valeur={site.bureau.horairesCourts} />
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        {/* Mobile : liens légaux sur toute la largeur, puis © et flèche ; à partir de 768 px : tout sur une ligne */}
        <div className="container grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-5 text-[13px] font-medium text-white/85 md:flex">
          <p className="col-span-2 flex flex-wrap gap-x-4 md:order-2">
            {commun.legal.map((lien) => (
              <Link key={lien.href} href={lien.href} className="inline-flex min-h-[44px] items-center hover:text-marque-vif">
                {lien.label}
              </Link>
            ))}
          </p>
          <span className="md:order-1">© {annee} LIGGEEY</span>
          {/* Le bouton WhatsApp flottant s’efface quand le pied de page est visible : la flèche peut rester au bord droit */}
          <a href="#haut" aria-label="Revenir en haut de la page" className="grid h-11 w-11 shrink-0 place-items-center rounded bg-marque text-sur-marque hover:bg-marque-survol md:order-3 md:ml-auto">
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
