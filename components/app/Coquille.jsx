'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, ChevronRight, Menu, X } from 'lucide-react';
import { Avatar } from './Avatar';
import { Compteur } from './Badge';
import { BoutonIcone, ChampRecherche } from './Controles';

/* =====================================================================
   COQUILLE DE L'APPLICATION
   Barre latérale claire (groupes titrés, élément actif teinté), barre du haut
   (salutation, recherche, notifications, compte), en-tête de page (titre et
   fil d'Ariane), pied de page. Sur mobile, le menu s'ouvre en tiroir.
   ===================================================================== */

const CLE_REPLI = 'liggeey-menu-replie';

function lireRepli() {
  try {
    return window.localStorage.getItem(CLE_REPLI) === '1';
  } catch {
    return false;
  }
}

function ecrireRepli(v) {
  try {
    window.localStorage.setItem(CLE_REPLI, v ? '1' : '0');
  } catch {
    /* stockage indisponible : le choix n'est pas retenu */
  }
}

/* Ferme un menu au clic extérieur ou avec Échap. */
function useFermeture(ouvert, fermer) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ouvert) return undefined;
    const clic = (e) => ref.current && !ref.current.contains(e.target) && fermer();
    const touche = (e) => e.key === 'Escape' && fermer();
    document.addEventListener('mousedown', clic);
    document.addEventListener('keydown', touche);
    return () => {
      document.removeEventListener('mousedown', clic);
      document.removeEventListener('keydown', touche);
    };
  }, [ouvert, fermer]);
  return ref;
}

/** Regroupe des éléments { section } consécutifs en sections { titre, elements }. */
export function grouperParSection(elements) {
  const sections = [];
  elements.forEach((el) => {
    const derniere = sections[sections.length - 1];
    if (derniere && derniere.titre === el.section) derniere.elements.push(el);
    else sections.push({ titre: el.section, elements: [el] });
  });
  return sections;
}

/* ---------- Barre latérale ---------- */

/* Deux habillages : sombre (bleu ardoise, par défaut, celui de LIGGEEY) et claire. */
const HABILLAGES = {
  sombre: {
    fond: 'bg-sombre border-sur-sombre',
    section: 'text-sur-sombre-discret',
    filet: 'bg-[rgb(var(--bordure-sur-sombre))]',
    actif: 'bg-marque font-semibold text-sur-marque',
    iconeActive: '',
    inactif: 'font-medium text-sur-sombre-secondaire hover:bg-sombre-doux hover:text-sur-sombre',
    barre: false,
    compteurActif: 'inverse',
    fermer: 'sur-sombre',
  },
  claire: {
    fond: 'bg-doux border-base',
    section: 'text-discret',
    filet: 'bg-[rgb(var(--bordure-forte))]',
    actif: 'bg-marque-doux font-semibold text-marque-fort',
    iconeActive: 'text-marque-vif',
    inactif: 'font-medium text-secondaire hover:bg-surface hover:text-principal',
    barre: true,
    compteurActif: 'plein',
    fermer: 'fantome',
  },
};

/**
 * - elements : [{ id, label, icone, section }] (les sections suivent l'ordre)
 * - compteurs : { [id]: nombre } affichés en pastille
 * - replie : n'affiche que les icônes (ordinateur)
 * - encart : bloc en bas du menu (formule, aide…)
 * - habillage : sombre (bleu ardoise) | claire
 */
export function BarreLaterale({ elements, actif, onNaviguer, compteurs = {}, replie = false, logo, logoReduit, encart, onFermer, mobile = false, habillage = 'sombre' }) {
  const sections = useMemo(() => grouperParSection(elements), [elements]);
  const etroit = replie && !mobile;
  const h = HABILLAGES[habillage] || HABILLAGES.sombre;
  return (
    <aside
      className={`flex h-full flex-col border-r transition-[width] duration-200 ${h.fond} ${etroit ? 'w-[76px]' : 'w-[264px]'}`}
      aria-label="Menu de l'application"
    >
      <div className={`flex h-[72px] shrink-0 items-center ${etroit ? 'justify-center' : 'justify-between px-6'}`}>
        {etroit ? logoReduit : logo}
        {mobile && <BoutonIcone icone={X} label="Fermer le menu" variante={h.fermer} onClick={onFermer} />}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Navigation principale">
        {sections.map((s, i) => (
          <div key={s.titre || i} className={i > 0 ? 'mt-5' : 'mt-2'}>
            {s.titre &&
              (etroit ? (
                <div className={`mx-auto mb-2 h-px w-6 ${h.filet}`} aria-hidden="true" />
              ) : (
                <p className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] ${h.section}`}>{s.titre}</p>
              ))}
            <ul className="space-y-1">
              {s.elements.map((el) => {
                const Icone = el.icone;
                const estActif = el.id === actif;
                const compte = compteurs[el.id] || 0;
                return (
                  <li key={el.id} className="relative">
                    {estActif && h.barre && <span className="absolute -left-3 top-1.5 h-8 w-[3px] rounded-r bg-marque" aria-hidden="true" />}
                    <button
                      type="button"
                      onClick={() => onNaviguer(el.id)}
                      aria-current={estActif ? 'page' : undefined}
                      title={etroit ? el.label : undefined}
                      className={`relative flex min-h-[44px] w-full items-center gap-3 rounded-md text-left text-sm transition-colors ${etroit ? 'justify-center px-0' : 'px-3'} ${estActif ? h.actif : h.inactif}`}
                    >
                      {Icone && <Icone size={19} strokeWidth={estActif ? 2 : 1.75} aria-hidden="true" className={estActif ? h.iconeActive : ''} />}
                      {!etroit && <span className="flex-1 leading-tight">{el.label}</span>}
                      {compte > 0 &&
                        (etroit ? (
                          <span className={`absolute right-3 top-2 h-2 w-2 rounded-full ${estActif ? 'bg-surface' : 'bg-marque'}`} aria-label={`${compte} à traiter`} />
                        ) : (
                          <Compteur valeur={compte} ton={estActif ? h.compteurActif : 'plein'} />
                        ))}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {encart && !etroit && <div className="shrink-0 p-4">{encart}</div>}
    </aside>
  );
}

/* ---------- Barre d'icônes ---------- */

/**
 * Colonne étroite en bleu le plus foncé (neutre-900), placée avant la barre latérale (ordinateur seulement).
 * Rôle à définir : pour l'instant décorative (masquée aux lecteurs d'écran), sauf si les
 * éléments reçoivent un onClick, auquel cas ils deviennent des boutons avec leur libellé.
 * - elements : [{ icone, label, actif?, onClick? }]
 */
export function BarreIcones({ elements = [] }) {
  const interactive = elements.some((e) => e.onClick);
  return (
    <div className="flex h-full w-14 flex-col items-center gap-3 bg-sombre-profond py-4" aria-hidden={interactive ? undefined : 'true'}>
      {elements.map((el, i) => {
        const Icone = el.icone;
        const classes = `inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          el.actif ? 'bg-marque text-sur-marque' : 'text-sur-sombre-discret hover:bg-sombre-doux hover:text-sur-sombre'
        }`;
        return el.onClick ? (
          <button key={el.label || i} type="button" onClick={el.onClick} aria-label={el.label} title={el.label} className={classes}>
            <Icone size={16} aria-hidden="true" />
          </button>
        ) : (
          <span key={el.label || i} className={classes}>
            <Icone size={16} />
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Menus déroulants de la barre du haut ---------- */

function MenuNotifications({ notifications }) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useFermeture(ouvert, () => setOuvert(false));
  const total = notifications.length;
  return (
    <div className="relative" ref={ref}>
      <BoutonIcone icone={Bell} label={total ? `Notifications (${total})` : 'Notifications'} pastille={total > 0} onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert} aria-haspopup="true" />
      {ouvert && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-lg border border-base bg-surface shadow-carte">
          <div className="flex items-center justify-between border-b border-base px-4 py-3">
            <p className="font-semibold text-principal">Notifications</p>
            {total > 0 && <Compteur valeur={total} ton="marque" />}
          </div>
          {total === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-secondaire">Rien de nouveau pour le moment.</p>
          ) : (
            <ul className="max-h-[360px] divide-y divide-base overflow-y-auto">
              {notifications.map((n) => {
                const Icone = n.icone || Bell;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOuvert(false);
                        n.onClick?.();
                      }}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-doux"
                    >
                      <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${n.urgent ? 'bg-statut-danger-doux text-statut-danger' : 'bg-marque-doux text-marque'}`} aria-hidden="true">
                        <Icone size={16} />
                      </span>
                      <span className="min-w-0 text-sm">
                        <span className="block font-medium text-principal">{n.titre}</span>
                        {n.texte && <span className="block text-secondaire">{n.texte}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function MenuCompte({ utilisateur, elements }) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useFermeture(ouvert, () => setOuvert(false));
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-haspopup="true"
        aria-label={`Compte de ${utilisateur.nom}`}
        className="inline-flex min-h-[44px] items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Avatar nom={utilisateur.nom} src={utilisateur.photo} taille="md" ton="plein" />
      </button>
      {ouvert && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-lg border border-base bg-surface shadow-carte">
          <div className="flex items-center gap-3 border-b border-base px-4 py-3">
            <Avatar nom={utilisateur.nom} src={utilisateur.photo} taille="sm" ton="plein" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-principal">{utilisateur.nom}</p>
              <p className="truncate text-xs text-discret">{utilisateur.role}</p>
            </div>
          </div>
          <ul className="py-1.5">
            {elements.map((el) => {
              const Icone = el.icone;
              const classes = `flex min-h-[44px] w-full items-center gap-3 px-4 text-sm ${el.danger ? 'text-statut-danger' : 'text-secondaire hover:text-principal'} hover:bg-doux`;
              const contenu = (
                <>
                  {Icone && <Icone size={16} aria-hidden="true" />}
                  {el.label}
                </>
              );
              return (
                <li key={el.label}>
                  {el.href ? (
                    <a href={el.href} className={classes}>
                      {contenu}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={classes}
                      onClick={() => {
                        setOuvert(false);
                        el.onClick?.();
                      }}
                    >
                      {contenu}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* Recherche dans le menu : propose les pages dont le nom correspond. */
function RechercheMenu({ elements, onNaviguer }) {
  const [q, setQ] = useState('');
  const ref = useFermeture(q.length > 0, () => setQ(''));
  const norme = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const resultats = q ? elements.filter((e) => norme(e.label).includes(norme(q))).slice(0, 6) : [];
  return (
    <div className="relative hidden w-full max-w-[300px] md:block" ref={ref}>
      <ChampRecherche
        valeur={q}
        onChange={setQ}
        placeholder="Rechercher…"
        label="Rechercher une page de l'application"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && resultats[0]) {
            onNaviguer(resultats[0].id);
            setQ('');
          }
        }}
      />
      {q && (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-base bg-surface py-1.5 shadow-carte">
          {resultats.length === 0 ? (
            <li className="px-4 py-3 text-sm text-secondaire">Aucune page ne correspond.</li>
          ) : (
            resultats.map((r) => {
              const Icone = r.icone;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNaviguer(r.id);
                      setQ('');
                    }}
                    className="flex min-h-[44px] w-full items-center gap-3 px-4 text-left text-sm text-principal hover:bg-doux"
                  >
                    {Icone && <Icone size={16} className="text-discret" aria-hidden="true" />}
                    <span className="flex-1">{r.label}</span>
                    <span className="text-xs text-discret">{r.section}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

/* ---------- Barre du haut ---------- */

export function BarreHaut({ salutation, onMenu, menuOuvert, elements = [], onNaviguer, notifications = [], utilisateur, menuUtilisateur = [], actions }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-3 border-b border-base bg-surface/95 px-4 backdrop-blur sm:px-6">
      <BoutonIcone icone={Menu} label={menuOuvert ? 'Replier le menu' : 'Ouvrir le menu'} onClick={onMenu} aria-expanded={menuOuvert} />
      {salutation && <p className="hidden min-w-0 truncate text-lg font-semibold text-principal sm:block">{salutation}</p>}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <RechercheMenu elements={elements} onNaviguer={onNaviguer} />
        {actions}
        <MenuNotifications notifications={notifications} />
        {utilisateur && <MenuCompte utilisateur={utilisateur} elements={menuUtilisateur} />}
      </div>
    </header>
  );
}

/* ---------- En-tête de page ---------- */

/**
 * Titre de la page à gauche, fil d'Ariane à droite.
 * filAriane : [{ label, id? }] ; le dernier élément est la page courante.
 */
export function EnTetePage({ titre, filAriane = [], onNaviguer, racine = 'LIGGEEY', description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-principal">{titre}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-secondaire">{description}</p>}
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        {filAriane.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="order-first md:order-none">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              <li className="flex items-center gap-1.5">
                {onNaviguer ? (
                  <button type="button" onClick={() => onNaviguer('dashboard')} className="text-discret hover:text-principal">
                    {racine}
                  </button>
                ) : (
                  <span className="text-discret">{racine}</span>
                )}
              </li>
              {filAriane.map((it, i) => {
                const dernier = i === filAriane.length - 1;
                return (
                  <li key={`${it.label}-${i}`} className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-discret" aria-hidden="true" />
                    {!dernier && it.id && onNaviguer ? (
                      <button type="button" onClick={() => onNaviguer(it.id)} className="text-discret hover:text-principal">
                        {it.label}
                      </button>
                    ) : (
                      <span aria-current={dernier ? 'page' : undefined} className={dernier ? 'font-medium text-marque' : 'text-discret'}>
                        {it.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ---------- Pied de page ---------- */

export function PiedApp({ gauche = `© ${new Date().getFullYear()} LIGGEEY`, droite = 'Rendons l’insertion plus facile et plus juste.' }) {
  return (
    <footer className="mt-8 flex flex-col gap-1 rounded-t-lg border border-b-0 border-base bg-surface px-6 py-5 text-sm text-discret sm:flex-row sm:justify-between">
      <p>{gauche}</p>
      <p>{droite}</p>
    </footer>
  );
}

/* ---------- Coquille complète ---------- */

/**
 * Assemble barre d'icônes (rail, facultatif), barre latérale, barre du haut, en-tête de page, contenu et pied de page.
 * Sur ordinateur, le bouton menu replie la barre latérale (choix retenu) ;
 * sur mobile, il ouvre un tiroir qui se ferme après chaque navigation.
 */
export function Coquille({
  elements,
  actif,
  onNaviguer,
  compteurs,
  rail,
  habillage = 'sombre',
  logo,
  logoReduit,
  encart,
  salutation,
  notifications,
  utilisateur,
  menuUtilisateur,
  titre,
  filAriane,
  actionsBarre,
  pied,
  children,
  contenuRef,
}) {
  const [replie, setReplie] = useState(false);
  const [tiroir, setTiroir] = useState(false);

  useEffect(() => setReplie(lireRepli()), []);
  useEffect(() => {
    if (!tiroir) return undefined;
    const touche = (e) => e.key === 'Escape' && setTiroir(false);
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, [tiroir]);

  const basculer = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setTiroir((t) => !t);
    } else {
      setReplie((r) => {
        ecrireRepli(!r);
        return !r;
      });
    }
  };
  const naviguer = (id) => {
    setTiroir(false);
    onNaviguer(id);
  };

  const propsMenu = { elements, actif, onNaviguer: naviguer, compteurs, logo, logoReduit, encart, habillage };

  return (
    <div className="flex min-h-screen w-full bg-page font-sans text-principal">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:flex">
        {rail}
        <BarreLaterale {...propsMenu} replie={replie} />
      </div>

      {tiroir && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-sombre/50" aria-label="Fermer le menu" onClick={() => setTiroir(false)} />
          <div className="relative h-full w-[264px] shadow-carte">
            <BarreLaterale {...propsMenu} mobile onFermer={() => setTiroir(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <BarreHaut
          salutation={salutation}
          onMenu={basculer}
          menuOuvert={tiroir || !replie}
          elements={elements}
          onNaviguer={naviguer}
          notifications={notifications}
          utilisateur={utilisateur}
          menuUtilisateur={menuUtilisateur}
          actions={actionsBarre}
        />
        <main ref={contenuRef} className="flex flex-1 flex-col px-4 pt-6 sm:px-6">
          {titre && <EnTetePage titre={titre} filAriane={filAriane} onNaviguer={naviguer} />}
          <div className="flex-1">{children}</div>
          {pied ?? <PiedApp />}
        </main>
      </div>
    </div>
  );
}
