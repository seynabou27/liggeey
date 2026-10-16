import { TrendingDown, TrendingUp } from 'lucide-react';

/* Cartes de l'application : fond blanc, filet fin, coins de 8 px, sans ombre. */

const TONS_PASTILLE = {
  marque: 'bg-marque-doux text-marque',
  succes: 'bg-statut-succes-doux text-statut-succes',
  alerte: 'bg-statut-alerte-doux text-statut-alerte',
  danger: 'bg-statut-danger-doux text-statut-danger',
  info: 'bg-statut-info-doux text-statut-info',
  neutre: 'bg-doux text-secondaire',
};

/** Icône posée sur un rond teinté. */
export function PastilleIcone({ icone: Icone, ton = 'marque', taille = 'md', forme = 'rond' }) {
  const dims = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' }[taille];
  const icone = { sm: 15, md: 18, lg: 24 }[taille];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${forme === 'rond' ? 'rounded-full' : 'rounded-lg'} ${dims} ${TONS_PASTILLE[ton] || TONS_PASTILLE.marque}`} aria-hidden="true">
      <Icone size={icone} strokeWidth={1.75} />
    </span>
  );
}

/**
 * Carte avec en-tête facultatif.
 * - titre, sousTitre : en-tête de la carte
 * - actions : éléments à droite de l'en-tête (sélecteur de période, bouton…)
 * - flush : le contenu touche les bords (tableaux, listes)
 */
export function Carte({ titre, sousTitre, actions, flush = false, as: Balise = 'section', className = '', children, ...props }) {
  const aEnTete = titre || actions;
  return (
    <Balise className={`rounded-lg border border-base bg-surface ${className}`} {...props}>
      {aEnTete && (
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 pb-2 pt-5">
          <div className="min-w-0">
            {titre && <h2 className="text-base font-semibold text-principal">{titre}</h2>}
            {sousTitre && <p className="mt-0.5 text-sm text-discret">{sousTitre}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={flush ? '' : `px-6 pb-6 ${aEnTete ? 'pt-3' : 'pt-6'}`}>{children}</div>
    </Balise>
  );
}

/**
 * Carte de chiffre clé : pastille d'icône, intitulé, détail (variation), grande valeur.
 * - tendance : hausse | baisse | aucune (colore le détail en vert ou rouge)
 * - visuel : élément facultatif à droite de la valeur (mini-graphique, anneau…)
 * - onClick : rend la carte cliquable
 */
export function CarteStat({ icone, ton = 'marque', titre, detail, tendance = 'aucune', valeur, visuel, onClick }) {
  const Balise = onClick ? 'button' : 'div';
  const couleurDetail = tendance === 'hausse' ? 'text-statut-succes' : tendance === 'baisse' ? 'text-statut-danger' : 'text-discret';
  const IconeTendance = tendance === 'hausse' ? TrendingUp : tendance === 'baisse' ? TrendingDown : null;
  return (
    <Balise
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full flex-col gap-5 rounded-lg border border-base bg-surface p-6 text-left ${onClick ? 'transition-colors hover:border-marque' : ''}`}
    >
      <div className="flex items-start gap-3">
        {icone && <PastilleIcone icone={icone} ton={ton} />}
        <div className="min-w-0">
          <p className="font-semibold text-principal">{titre}</p>
          {detail && (
            <p className={`mt-0.5 flex items-center gap-1 text-sm ${couleurDetail}`}>
              {IconeTendance && <IconeTendance size={14} aria-hidden="true" />}
              {detail}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <p className="text-[28px] font-bold leading-none tracking-tight text-principal">{valeur}</p>
        {visuel}
      </div>
    </Balise>
  );
}

/** Ligne « intitulé : valeur » avec icône, pour les fiches (profil, détail). */
export function LigneInfo({ icone: Icone, libelle, children }) {
  return (
    <div className="flex items-start gap-3 py-1.5 text-sm">
      {Icone && <Icone size={16} className="mt-0.5 shrink-0 text-discret" aria-hidden="true" />}
      <p className="min-w-0 text-secondaire">
        <span className="font-semibold text-principal">{libelle} : </span>
        {children}
      </p>
    </div>
  );
}

/** Message d'état vide, à l'intérieur d'une carte ou d'un tableau. */
export function EtatVide({ icone, titre, texte, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icone && <PastilleIcone icone={icone} ton="neutre" taille="lg" />}
      <p className="font-semibold text-principal">{titre}</p>
      {texte && <p className="max-w-sm text-sm text-secondaire">{texte}</p>}
      {action}
    </div>
  );
}

/**
 * Fiche de profil : bandeau aux couleurs de la marque, photo en surimpression, nom, badges,
 * informations (icône, libellé, valeur) et actions.
 * - infos : [{ icone, libelle, valeur }]
 * - badges, actions : éléments React
 */
export function CarteProfil({ photo, nom, sousTitre, badges, infos = [], actions, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-base bg-surface">
      <div className="relative h-28 overflow-hidden bg-sombre" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 112" preserveAspectRatio="xMidYMid slice">
          <circle cx="360" cy="-10" r="90" fill="none" strokeWidth="18" style={{ stroke: 'rgb(var(--primaire-500) / 0.85)' }} />
          <circle cx="360" cy="-10" r="130" fill="none" strokeWidth="2" style={{ stroke: 'rgb(var(--primaire-300) / 0.35)' }} />
          <circle cx="40" cy="140" r="70" style={{ fill: 'rgb(var(--neutre-700) / 0.6)' }} />
        </svg>
      </div>
      <div className="px-6 pb-6">
        <div className="relative -mt-12 flex flex-wrap items-end gap-4">
          {photo ? (
            <img src={photo} alt={nom} className="h-24 w-24 rounded-full border-4 border-[rgb(var(--fond-surface))] object-cover" />
          ) : (
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-full border-4 border-[rgb(var(--fond-surface))] bg-marque-doux text-2xl font-semibold text-marque">
              {nom
                .split(' ')
                .map((m) => m[0])
                .slice(0, 2)
                .join('')}
            </span>
          )}
          <div className="min-w-0 pb-1">
            <h2 className="text-xl font-semibold text-principal">{nom}</h2>
            {sousTitre && <p className="text-sm text-discret">{sousTitre}</p>}
          </div>
        </div>
        {badges && <div className="mt-4 flex flex-wrap gap-2">{badges}</div>}
        {infos.length > 0 && (
          <div className="mt-4 divide-y divide-dashed divide-base">
            {infos.map((i) => (
              <LigneInfo key={i.libelle} icone={i.icone} libelle={i.libelle}>
                {i.valeur}
              </LigneInfo>
            ))}
          </div>
        )}
        {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
        {children}
      </div>
    </section>
  );
}
