import { useEffect, useRef, useState } from 'react';
import { ICONES } from '../../components/ui/Icone';

/* Blocs d'affichage des pages « Fondations » (typographie, espacements, formes, icônes, logos).
   Les valeurs viennent de la charte (CLAUDE.md) et de tailwind.config.mjs. */

/* ---------- Typographie ---------- */

const ECHELLE = [
  { nom: 'Grand titre de l’accueil (h1)', classes: 'text-[25px] sm:text-[40px] lg:text-[57px] font-semibold leading-[1.3]', taille: '25 → 40 → 57 px', exemple: 'Rendons l’insertion plus facile' },
  { nom: 'Titre de page intérieure (h1)', classes: 'text-[25px] sm:text-[36px] lg:text-[48px] font-semibold leading-[1.3]', taille: '25 → 36 → 48 px', exemple: 'Des tarifs clairs, pour chacun' },
  { nom: 'Titre de section (h2)', classes: 'text-[22px] md:text-[35px] font-semibold leading-[1.27] md:leading-[1.2]', taille: '22 → 35 px', exemple: 'Ce que vous y trouvez' },
  { nom: 'Titre de carte (h3)', classes: 'text-lg font-semibold', taille: '18 px', exemple: 'Des offres vérifiées' },
  { nom: 'Texte du bandeau', classes: 'text-xl leading-[1.8]', taille: '20 px · interligne 1,8', exemple: 'LIGGEEY vous aide à montrer ce que vous savez faire.' },
  { nom: 'Phrase d’introduction', classes: 'text-[15px] leading-[1.7] text-secondaire', taille: '15 px · interligne 1,7', exemple: 'Chez LIGGEEY, vos compétences comptent autant que votre CV.' },
  { nom: 'Texte courant', classes: 'text-[15px] leading-normal', taille: '15 px · interligne 1,5', exemple: 'Entreprise identifiée, offre contrôlée : vous postulez sans craindre l’arnaque.' },
  { nom: 'Menu', classes: 'text-sm font-medium tracking-[0.2px]', taille: '14 px · moyen', exemple: 'Talents   Indépendants   Entreprises' },
  { nom: 'Surtitre', classes: 'surtitre', taille: '16 px · moyen · text-marque', exemple: 'Pour les talents' },
  { nom: 'Étiquette de formulaire', classes: 'text-xs font-medium', taille: '12 px', exemple: 'Secteur d’activité' },
  { nom: 'Pied de page : liens', classes: 'text-[13px] font-medium', taille: '13 px', exemple: 'Mentions légales' },
  { nom: 'Article (éditorial)', classes: 'font-serif text-xl leading-snug', taille: 'Georgia · 20 px', exemple: 'Préparer son premier entretien' },
];

export function EchelleTypo() {
  return (
    <div className="divide-y divide-base rounded-lg border border-base bg-surface">
      {ECHELLE.map((t) => (
        <div key={t.nom} className="grid gap-3 p-5 md:grid-cols-[220px_1fr]">
          <div className="text-xs">
            <p className="font-semibold">{t.nom}</p>
            <p className="text-secondaire">{t.taille}</p>
            <code className="mt-1 block break-words font-mono text-[11px] text-discret">{t.classes}</code>
          </div>
          <p className={t.classes}>{t.exemple}</p>
        </div>
      ))}
    </div>
  );
}

const GRAISSES = [
  { classe: 'font-normal', nom: 'Normal · 400', usage: 'Texte courant' },
  { classe: 'font-medium', nom: 'Moyen · 500', usage: 'Menu, étiquettes, liens du pied de page' },
  { classe: 'font-semibold', nom: 'Demi-gras · 600', usage: 'Tous les titres et les boutons (jamais de gras)' },
];

export function Polices() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-base bg-surface p-6">
        <p className="text-xs font-semibold text-secondaire">font-sans · interface</p>
        <p className="mt-2 font-sans text-3xl font-semibold">Plus Jakarta Sans</p>
        <p className="mt-2 font-sans">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 à é è ç ô</p>
        <ul className="mt-4 space-y-1 text-sm">
          {GRAISSES.map((g) => (
            <li key={g.classe} className={g.classe}>
              {g.nom} <span className="font-normal text-secondaire">· {g.usage}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-base bg-surface p-6">
        <p className="text-xs font-semibold text-secondaire">font-serif · contenus éditoriaux</p>
        <p className="mt-2 font-serif text-3xl">Georgia</p>
        <p className="mt-2 font-serif">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 à é è ç ô</p>
        <p className="mt-4 text-sm text-secondaire">Titres des articles de la rubrique Ressources.</p>
      </div>
    </div>
  );
}

/* ---------- Espacements ---------- */

const ESPACES = [
  { nom: 'Section', classe: 'py-20', px: 80, usage: 'Haut et bas de chaque section de page' },
  { nom: 'Bande d’appel', classe: 'py-16', px: 64, usage: 'AppelFinal (mobile), pied de page' },
  { nom: 'Bande parcours', classe: 'py-[50px]', px: 50, usage: 'Bande « trois parcours » de l’accueil' },
  { nom: 'Titre de section → contenu', classe: 'mb-10', px: 40, usage: 'Sous TitreSection' },
  { nom: 'Carte', classe: 'p-6', px: 24, usage: 'Intérieur des cartes' },
  { nom: 'Grille de cartes', classe: 'gap-5', px: 20, usage: 'Espace entre les cartes' },
  { nom: 'Champs de formulaire', classe: 'gap-5', px: 20, usage: 'Entre deux champs' },
  { nom: 'Conteneur', classe: 'container', px: 12, usage: 'Marges latérales (1 320 px de largeur max.)' },
];

export function Espaces() {
  return (
    <div className="divide-y divide-base rounded-lg border border-base bg-surface">
      {ESPACES.map((e) => (
        <div key={e.nom} className="grid items-center gap-3 p-4 md:grid-cols-[220px_120px_1fr]">
          <div className="text-sm">
            <p className="font-semibold">{e.nom}</p>
            <p className="text-xs text-secondaire">{e.usage}</p>
          </div>
          <code className="font-mono text-xs">
            {e.classe} · {e.px} px
          </code>
          <div className="h-4 rounded-sm bg-marque" style={{ width: e.px * 3 }} />
        </div>
      ))}
    </div>
  );
}

const TAILLES_CIBLES = [
  { nom: 'Zone cliquable minimale', hauteur: 44, classe: 'min-h-[44px]' },
  { nom: 'Champ de formulaire (site)', hauteur: 48, classe: 'h-12' },
  { nom: 'Champ de la recherche (accueil)', hauteur: 56, classe: 'h-14' },
  { nom: 'En-tête', hauteur: 72, classe: 'h-[72px]' },
];

export function Cibles() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {TAILLES_CIBLES.map((t) => (
        <div key={t.nom} className="flex flex-col items-start gap-2">
          <div className="grid w-40 place-items-center rounded border-2 border-dashed border-marque bg-marque-subtil text-xs font-semibold" style={{ height: t.hauteur }}>
            {t.hauteur} px
          </div>
          <p className="text-xs font-semibold">{t.nom}</p>
          <code className="font-mono text-[11px] text-secondaire">{t.classe}</code>
        </div>
      ))}
    </div>
  );
}

/* Points de rupture Tailwind, avec la largeur actuelle de la zone de prévisualisation. */
const POINTS = [
  { nom: 'sm', px: 640 },
  { nom: 'md', px: 768 },
  { nom: 'lg', px: 1024 },
  { nom: 'xl', px: 1280, note: 'menu complet de l’en-tête' },
  { nom: '2xl', px: 1320, note: 'largeur max. du conteneur' },
];

export function PointsDeRupture() {
  const [largeur, setLargeur] = useState(null);
  useEffect(() => {
    const lire = () => setLargeur(window.innerWidth);
    lire();
    window.addEventListener('resize', lire);
    return () => window.removeEventListener('resize', lire);
  }, []);
  return (
    <div className="overflow-x-auto rounded-lg border border-base">
      <table className="w-full text-left text-sm">
        <thead className="bg-doux text-xs text-secondaire">
          <tr>
            <th className="p-3">Préfixe</th>
            <th className="p-3">À partir de</th>
            <th className="p-3">Remarque</th>
            <th className="p-3">Actif ici ?</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base bg-surface">
          {POINTS.map((p) => (
            <tr key={p.nom}>
              <td className="p-3 font-mono font-semibold">{p.nom}:</td>
              <td className="p-3">{p.px} px</td>
              <td className="p-3 text-secondaire">{p.note ?? ''}</td>
              <td className="p-3">{largeur !== null && (largeur >= p.px ? '✓' : '—')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Formes et ombres ---------- */

export function Formes() {
  const formes = [
    { nom: 'Bouton', classe: 'rounded', valeur: '4 px' },
    { nom: 'Champ (recherche)', classe: 'rounded-md', valeur: '6 px' },
    { nom: 'Carte', classe: 'rounded-lg', valeur: '8 px' },
    { nom: 'Logo d’entreprise', classe: 'rounded-xl', valeur: '12 px' },
    { nom: 'Pastille, filtre', classe: 'rounded-full', valeur: '9999 px' },
  ];
  return (
    <div className="flex flex-wrap gap-6">
      {formes.map((f) => (
        <div key={f.nom} className="flex flex-col items-center gap-2 text-center">
          <div className={`h-20 w-28 border-2 border-principal bg-marque-doux ${f.classe}`} />
          <p className="text-sm font-semibold">{f.nom}</p>
          <code className="font-mono text-xs text-secondaire">
            {f.classe} · {f.valeur}
          </code>
        </div>
      ))}
    </div>
  );
}

export function Ombres() {
  const ombres = [
    { nom: 'Aucune, bordure', classe: 'border border-base', note: 'Cartes au repos' },
    { nom: 'Contour 1 px', classe: 'shadow-[0_0_0_1px_rgb(var(--bordure-base))]', note: 'Cartes de l’accueil' },
    { nom: 'shadow-carte', classe: 'shadow-carte', note: 'Survol des cartes, fenêtres, carte de recherche' },
    { nom: 'shadow-lg', classe: 'shadow-lg', note: 'En-tête après défilement' },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {ombres.map((o) => (
        <div key={o.nom} className={`rounded-lg bg-surface p-6 ${o.classe}`}>
          <p className="font-semibold">{o.nom}</p>
          <code className="mt-1 block break-words font-mono text-[11px] text-secondaire">{o.classe}</code>
          <p className="mt-2 text-sm text-secondaire">{o.note}</p>
        </div>
      ))}
    </div>
  );
}

export function Focus() {
  const ref = useRef(null);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button ref={ref} type="button" className="min-h-[44px] rounded bg-marque px-6 font-semibold text-sur-marque">
        Bouton
      </button>
      <button type="button" onClick={() => ref.current?.focus()} className="lien min-h-[44px]">
        Donner le focus au bouton (ou utiliser Tab)
      </button>
      <p className="text-sm text-secondaire">
        Contour de 3 px <code className="font-mono">--etat-focus</code>, décalé de 2 px (app/globals.css).
      </p>
    </div>
  );
}

/* ---------- Icônes ---------- */

export function GrilleIcones() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {Object.entries(ICONES).map(([nom, Composant]) => (
        <li key={nom} className="flex flex-col items-center gap-2 rounded-lg border border-base bg-surface p-4 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-marque-doux text-marque">
            <Composant className="h-6 w-6" aria-hidden="true" />
          </span>
          <code className="font-mono text-xs">{nom}</code>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Logos ---------- */

export function Logos() {
  const logos = [
    { src: '/logo/liggeey-ardoise.svg', nom: 'liggeey-ardoise.svg', usage: 'Sur fond clair (menu mobile)', fond: 'bg-surface' },
    { src: '/logo/liggeey-blanc.svg', nom: 'liggeey-blanc.svg', usage: 'Sur fond sombre (en-tête, pied de page)', fond: 'bg-sombre' },
    { src: '/logo/monogramme-orange.svg', nom: 'monogramme-orange.svg', usage: 'Monogramme (favicon, emplacement d’image)', fond: 'bg-marque-doux' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {logos.map((l) => (
        <div key={l.nom} className="overflow-hidden rounded-lg border border-base">
          <div className={`grid h-32 place-items-center ${l.fond}`}>
            <img src={l.src} alt={l.nom} className="max-h-12 max-w-[70%]" />
          </div>
          <div className="bg-surface p-3 text-sm">
            <code className="font-mono text-xs font-semibold">public/logo/{l.nom}</code>
            <p className="text-secondaire">{l.usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
