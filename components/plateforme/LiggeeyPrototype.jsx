'use client';

/* Intégration Next.js : prototype de la plateforme repris tel quel (fichier d’origine : liggeey-app (3).jsx).
   Changements faits à l’original :
   - la directive 'use client' ci-dessus ;
   - les props ecranInitial / espaceInitial / profilInitial (Storybook) et cheminInitial / profilAdresse /
     synchroniserAdresse du composant racine (en bas du fichier) : chaque écran a son adresse
     (/plateforme/{espace}/{écran}, voir lib/routesPlateforme.js) ;
   - la barre « Mode test » n’est plus affichée (la sauvegarde locale de la démo est conservée) ;
   - liens de retour vers le site public (constante SITE_URL) : logo, « Retour au site » sur la
     connexion et l’inscription, et en bas du menu de l’application ;
   - comptes réels (props compte / comptesDemo, ServeurContext) : connexion, inscription et déconnexion
     par l’API app/api/auth/… (components/plateforme/apiComptes.js). Sans ces props (Storybook), tout reste simulé.
   Monté par components/plateforme/Plateforme.jsx sur /plateforme. */

/* =====================================================================
   LIGGEEY — PROTOTYPE INTERACTIF
   Sommaire du fichier (dans l’ordre) :
     1. Fondations : couleurs, date de démo, mémoire partagée (useStore)
     2. Composants réutilisables : logo, notifications, images, fichiers
     3. Connexion et inscription (date de naissance et règles d’âge)
     4. Coquille de l’application : menu groupé, fil d’Ariane, bloc « À faire »
     5. Espace chercheur : tableau de bord, offres, candidatures, formations, mentors, profil
     6. Espace prestataire : tableau de bord, services, missions, profil, évaluations
     7. Espace entreprise : tableau de bord, offres, candidatures, prestataires, profil
     8. Espace admin : utilisateurs, activité, contrôle, planning, communication, paramètres
     9. Abonnements Essentiel / Premium et paiement
    10. Profils Essentiel / Premium, mentors (coachings), suivi post-embauche, régularisation
    11. Profils modifiables
    11 bis. Cap Métier (jeunes sans métier, dès 15 ans) et espace mentor
    12. Version de test : sauvegarde locale, scénarios, commentaires
    13. Composant racine : état global, navigation, routage des écrans
   ===================================================================== */

import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Check,
  LayoutDashboard,
  Briefcase,
  UsersRound,
  GraduationCap,
  UserCircle2,
  Flame,
  Grid3x3,
  Zap,
  Triangle,
  AlignJustify,
  Layers,
  Bell,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  Home,
  ChevronRight,
  ChevronDown,
  FileText,
  CalendarCheck,
  Clock,
  Download,
  Wrench,
  ClipboardList,
  Plus,
  Wallet,
  Pencil,
  Send,
  Search,
  RotateCcw,
  X,
  Building2,
  Users2,
  Star,
  Heart,
  Package,
  ClipboardCheck,
  ShieldCheck,
  Settings,
  CalendarDays,
  MessageCircle,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Archive,
  ZoomIn,
  ZoomOut,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Crown,
  CreditCard,
  Smartphone,
  Sparkles,
  Receipt,
  Loader2,
  HeartHandshake,
  Landmark,
  FileCheck2,
  BadgeCheck,
  Video,
  Flag,
  Upload,
  UserCheck,
  TrendingUp,
  FlaskConical,
  Compass,
  LogOut,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";
// Bibliothèque de l’application (components/app) : coquille, cartes, badges, tableaux… sur les tokens LIGGEEY.
import * as App from "../app";
import { site } from "@/lib/site";
import { lienPartageWhatsApp, lienWhatsApp } from "@/lib/liens";
import { adressePlateforme, lireAdressePlateforme, lireAdresseNavigateur, ECRANS_AUTH } from "@/lib/routesPlateforme";
// Comptes réels (API app/api/auth/…) : règles partagées avec le serveur, appels réseau, comptes de démonstration.
import { AGE_MAJORITE, AGE_MIN_CAP_METIER, AGE_MIN_PAR_PROFIL, LIENS_PARENT, normaliserTelephone } from "@/lib/comptes.mjs";
import { COMPTES_DEMO, MOT_DE_PASSE_DEMO } from "@/lib/comptesDemo.mjs";
import { apiConnexion, apiInscription, apiDeconnexion } from "./apiComptes";

// Couleurs : tokens LIGGEEY (lib/tokens/couleurs.mjs), lus via les variables CSS du site.
// Les noms d’origine sont conservés ; chaque valeur suit le thème (clair ou sombre).
const COLORS = {
  orange: "rgb(var(--fond-marque))", // couleur de marque (primaire-500)
  orangeSoft: "rgb(var(--fond-marque-doux))",
  // Texte orange : jamais l’orange de fond (2,5:1 sur blanc). Lisible sur blanc, sur orange doux, sur fond sombre.
  orangeText: "rgb(var(--texte-marque))",
  orangeStrong: "rgb(var(--texte-marque-fort))",
  orangeOnDark: "rgb(var(--texte-marque-vif))",
  orangeSubtle: "rgb(var(--fond-marque-subtil))",
  onOrange: "rgb(var(--texte-sur-marque))", // texte sur orange : ardoise, contraste 6:1
  slate: "rgb(var(--texte-principal))",
  slateLight: "rgb(var(--texte-discret))",
  border: "rgb(var(--bordure-base))",
  borderStrong: "rgb(var(--bordure-forte))",
  surface: "rgb(var(--fond-surface))",
  soft: "rgb(var(--fond-doux))",
  softStrong: "rgb(var(--fond-doux-fort))",
  dark: "rgb(var(--fond-sombre))", // menu, bandeaux sombres
  darkSoft: "rgb(var(--fond-sombre-doux))", // pastilles et logos sombres : restent visibles en thème sombre
  darkDeep: "rgb(var(--fond-sombre-profond))",
  darkLine: "rgb(var(--bordure-sur-sombre))",
  darkTrack: "rgb(var(--neutre-700))",
  onDark: "rgb(var(--texte-sur-sombre))",
  onDarkMuted: "rgb(var(--texte-sur-sombre-secondaire))",
  onDarkSubtle: "rgb(var(--texte-sur-sombre-discret))",
  brandPale: "rgb(var(--texte-marque-pale))",
  // Statuts : suivent le thème clair ou sombre (lib/tokens/couleurs.mjs, groupe statut).
  success: "rgb(var(--statut-succes))",
  successSoft: "rgb(var(--statut-succes-doux))",
  successBright: "rgb(var(--statut-succes-vif))", // sur fond sombre (toasts, jauges)
  warning: "rgb(var(--statut-alerte))",
  danger: "rgb(var(--statut-danger))",
  dangerSoft: "rgb(var(--statut-danger-doux))",
  dangerBright: "rgb(var(--statut-danger-vif))",
  info: "rgb(var(--statut-info))",
  infoSoft: "rgb(var(--statut-info-doux))",
  onStatus: "rgb(var(--texte-sur-statut))", // texte sur un fond de statut plein
};

/* =====================================================================
   FONDATIONS DU PROTOTYPE
   - DEMO_TODAY : la « date du jour » de la démo, pour que toutes les dates
     (rendez-vous, échéances, périodes d’essai) restent cohérentes entre elles.
   - useStore : mémoire partagée entre les écrans. Les données modifiées
     (services, missions, candidatures, inscriptions…) sont conservées quand
     on change de page ou d’espace.
   ===================================================================== */

const DEMO_TODAY = new Date(2026, 9, 14); // mercredi 14 octobre 2026

/* Dates affichées : toujours en toutes lettres, « 1er août 2026 », « 28 juillet 2026 ». */
const MOIS_LONGS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function dateFr(d) {
  const j = d.getDate();
  return `${j === 1 ? "1er" : j} ${MOIS_LONGS[d.getMonth()]} ${d.getFullYear()}`;
}
function demoNow() {
  return new Date(DEMO_TODAY.getTime());
}

const StoreContext = React.createContext(null);

/* Comptes réels : fourni par le composant racine quand la plateforme tourne avec le serveur (/plateforme).
   null dans Storybook : la connexion et l’inscription restent simulées, comme dans le prototype d’origine.
   { compte, comptesDemo, onConnecte(compte), onDeconnexion() } */
const ServeurContext = React.createContext(null);

function useStore(key, initial) {
  const store = React.useContext(StoreContext);
  const [local, setLocal] = useState(initial);
  if (!store) return [local, setLocal];
  const has = Object.prototype.hasOwnProperty.call(store.data, key);
  const value = has ? store.data[key] : local;
  const set = (v) => store.set(key, v, local);
  return [value, set];
}

function readStore(data, key, initial) {
  return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : initial;
}

/* ---------- Reusable pieces ---------- */

/* Adresse du site public. La plateforme est servie par le site (/plateforme) : « / » ramène à l’accueil.
   Si la plateforme est un jour déployée à part, mettre ici l’adresse complète du site. */
const SITE_URL = "/";

function Logo({ color = COLORS.brandPale, iconColor, height = 24, iconOnly = false }) {
  const viewW = iconOnly ? 658 : 3525;
  const width = height * (viewW / 690);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${viewW} 690`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M377.581 135.382L82.6807 600.007L122.668 689.674H0V0H316.209L377.581 135.382ZM657.888 689.674H278.254L445.47 600.007V135.382L604.317 0H657.888V689.674Z" fill={iconColor || color} />
      <path d="M991.291 571.692V117.982H1046.23V522.954H1257.14V571.692H991.291Z" fill={color} />
      <path d="M1397.15 117.982V571.692H1342.21V117.982H1397.15Z" fill={color} />
      <path d="M1817.46 259.766C1812.59 244.849 1806.16 231.483 1798.19 219.668C1790.36 207.705 1780.98 197.514 1770.05 189.096C1759.27 180.677 1747.01 174.253 1733.28 169.822C1719.54 165.391 1704.48 163.176 1688.08 163.176C1661.2 163.176 1636.76 170.117 1614.75 184C1592.75 197.883 1575.25 218.339 1562.25 245.366C1549.25 272.394 1542.75 305.551 1542.75 344.837C1542.75 384.123 1549.33 417.28 1562.47 444.308C1575.62 471.335 1593.41 491.791 1615.86 505.674C1638.31 519.557 1663.57 526.498 1691.63 526.498C1717.62 526.498 1740.51 520.96 1760.31 509.883C1780.24 498.658 1795.75 482.855 1806.83 462.474C1818.05 441.944 1823.67 417.797 1823.67 390.031L1840.5 393.575H1704.03V344.837H1876.83V393.575C1876.83 430.941 1868.86 463.434 1852.91 491.052C1837.11 518.67 1815.25 540.086 1787.33 555.298C1759.57 570.363 1727.67 577.895 1691.63 577.895C1651.46 577.895 1616.16 568.443 1585.73 549.538C1555.46 530.634 1531.83 503.754 1514.84 468.898C1498 434.043 1489.59 392.689 1489.59 344.837C1489.59 308.948 1494.39 276.677 1503.99 248.025C1513.73 219.225 1527.47 194.708 1545.19 174.474C1562.91 154.24 1583.89 138.733 1608.11 127.951C1632.33 117.17 1658.99 111.779 1688.08 111.779C1712.01 111.779 1734.31 115.397 1754.99 122.634C1775.81 129.723 1794.35 139.84 1810.59 152.985C1826.99 165.982 1840.65 181.563 1851.58 199.729C1862.51 217.748 1870.04 237.76 1874.18 259.766H1817.46Z" fill={color} />
      <path d="M2281.09 259.766C2276.21 244.849 2269.79 231.483 2261.81 219.668C2253.98 207.705 2244.61 197.514 2233.68 189.096C2222.9 180.677 2210.64 174.253 2196.9 169.822C2183.17 165.391 2168.1 163.176 2151.71 163.176C2124.83 163.176 2100.38 170.117 2078.38 184C2056.37 197.883 2038.87 218.339 2025.87 245.366C2012.88 272.394 2006.38 305.551 2006.38 344.837C2006.38 384.123 2012.95 417.28 2026.1 444.308C2039.24 471.335 2057.04 491.791 2079.49 505.674C2101.94 519.557 2127.19 526.498 2155.25 526.498C2181.25 526.498 2204.14 520.96 2223.93 509.883C2243.87 498.658 2259.38 482.855 2270.45 462.474C2281.68 441.944 2287.29 417.797 2287.29 390.031L2304.13 393.575H2167.66V344.837H2340.46V393.575C2340.46 430.941 2332.48 463.434 2316.53 491.052C2300.73 518.67 2278.87 540.086 2250.96 555.298C2223.19 570.363 2191.29 577.895 2155.25 577.895C2115.08 577.895 2079.78 568.443 2049.36 549.538C2019.08 530.634 1995.45 503.754 1978.46 468.898C1961.63 434.043 1953.21 392.689 1953.21 344.837C1953.21 308.948 1958.01 276.677 1967.61 248.025C1977.36 219.225 1991.09 194.708 2008.82 174.474C2026.54 154.24 2047.51 138.733 2071.73 127.951C2095.95 117.17 2122.61 111.779 2151.71 111.779C2175.63 111.779 2197.94 115.397 2218.61 122.634C2239.44 129.723 2257.97 139.84 2274.22 152.985C2290.61 165.982 2304.27 181.563 2315.2 199.729C2326.13 217.748 2333.66 237.76 2337.8 259.766H2281.09Z" fill={color} />
      <path d="M2434.56 571.692V117.982H2708.38V166.72H2489.5V320.025H2694.2V368.763H2489.5V522.954H2711.92V571.692H2434.56Z" fill={color} />
      <path d="M2807.41 571.692V117.982H3081.23V166.72H2862.35V320.025H3067.05V368.763H2862.35V522.954H3084.77V571.692H2807.41Z" fill={color} />
      <path d="M3141.26 117.982H3204.18L3330.01 329.772H3335.33L3461.16 117.982H3524.08L3360.14 384.714V571.692H3305.2V384.714L3141.26 117.982Z" fill={color} />
    </svg>
  );
}

/* ---------- Coquille des écrans de connexion et d’inscription ----------
   Écran partagé : panneau de marque à gauche (dégradé bleu ardoise, accents orange),
   formulaire à droite. Le panneau change de message selon le mode : connexion ou inscription.
   Sur mobile, le panneau est remplacé par un bandeau ardoise compact au-dessus du formulaire. */

const AUTH_PANNEAU = {
  connexion: {
    surtitre: "Espace LIGGEEY",
    titre: "Rendons l’insertion",
    accent: "plus facile et plus juste.",
    texte: "Retrouvez vos candidatures, vos missions et votre accompagnement là où vous les avez laissés.",
    liste: [
      { icon: ShieldCheck, titre: "Offres et profils vérifiés", texte: "Chaque entreprise et chaque offre sont contrôlées avant publication." },
      { icon: HeartHandshake, titre: "Un accompagnement humain", texte: "Sur WhatsApp et au bureau d’accueil de Dakar." },
      { icon: Smartphone, titre: "Pensé pour votre téléphone", texte: "Paiement par Wave ou Orange Money." },
    ],
  },
  inscription: {
    surtitre: "Créer votre compte",
    titre: "Un compte,",
    accent: "un parcours pour chacun.",
    texte: "Choisissez le vôtre : LIGGEEY vous accompagne avant, pendant et après l’embauche.",
    liste: [
      { icon: Briefcase, titre: "Talents", texte: "Valorisez vos compétences et postulez à des offres vérifiées." },
      { icon: Wrench, titre: "Indépendants", texte: "Formalisez votre activité et trouvez des missions." },
      { icon: Building2, titre: "Entreprises", texte: "Recrutez avec un suivi de vos recrues pendant 90 jours." },
      { icon: Compass, titre: "Jeunes et mentors", texte: "Cap Métier dès 15 ans pour trouver sa voie, avec des mentors du métier." },
    ],
  },
};

function AuthPanneau({ mode }) {
  const t = AUTH_PANNEAU[mode] || AUTH_PANNEAU.connexion;
  return (
    <aside
      className="relative hidden md:flex flex-col overflow-hidden text-sur-sombre px-10 py-10 lg:px-14 lg:py-12"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, rgb(var(--neutre-750)) 0%, rgb(var(--neutre-800)) 45%, rgb(var(--neutre-900)) 100%)",
      }}
    >
      {/* Décor : reflet orange discret en haut, grand monogramme en filigrane en bas */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ background: "rgb(var(--primaire-500) / 0.11)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute -right-28 -bottom-24 opacity-[0.035]" aria-hidden="true">
        <Logo iconOnly height={560} color="rgb(var(--neutre-50))" />
      </div>

      {/* Haut : logo et liens vers le site */}
      <div className="relative flex items-center justify-between gap-4">
        <a href={SITE_URL} aria-label="LIGGEEY, retour au site" className="inline-flex">
          <Logo color="rgb(var(--texte-sur-sombre))" iconColor={COLORS.orange} height={26} />
        </a>
        <a href={`${SITE_URL}#offres`} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-marque-vif">
          Voir les offres <ChevronRight size={15} aria-hidden="true" />
        </a>
      </div>

      {/* Centre : message et points clés */}
      <div className="relative flex flex-1 flex-col justify-center py-12">
        <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wider text-marque-vif">
          <span className="h-0.5 w-9 bg-marque" aria-hidden="true" />
          {t.surtitre}
        </p>
        <p className="mt-4 max-w-md text-balance text-[34px] font-semibold leading-[1.15] lg:text-[42px]">
          {t.titre} <span className="text-marque-vif">{t.accent}</span>
        </p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">{t.texte}</p>

        <ul className="mt-9 flex max-w-md flex-col gap-3">
          {t.liste.map(({ icon: Icon, titre, texte }) => (
            <li key={titre} className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-marque-vif" style={{ background: "rgb(var(--primaire-500) / 0.14)" }}>
                <Icon size={19} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{titre}</span>
                <span className="block text-sm leading-relaxed text-white/70">{texte}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bas : aide et mentions */}
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span>
            <span className="block text-sm font-semibold">Besoin d’aide pour vous inscrire ?</span>
            <span className="flex items-center gap-1.5 text-xs text-white/65">
              <MapPin size={12} aria-hidden="true" /> {site.bureau.adresse}, {site.bureau.ville}
            </span>
          </span>
          <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded border border-white/25 px-4 text-sm font-semibold transition-colors hover:border-whatsapp hover:text-whatsapp">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
        </div>
        <p className="text-xs text-white/50">© 2026 LIGGEEY · Insertion professionnelle au Sénégal</p>
      </div>
    </aside>
  );
}

// Écran partagé par la connexion et l’inscription
function AuthShell({ children, mode = "connexion" }) {
  const t = AUTH_PANNEAU[mode] || AUTH_PANNEAU.connexion;
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] font-sans">
      <AuthPanneau mode={mode} />

      <div className="relative flex flex-col bg-surface">
        {/* Conteneur positionné : le bouton garde sa propre classe relative (pastille) */}
        <div className="absolute right-6 top-6 z-10 hidden md:block">
          <App.BoutonTheme />
        </div>
        {/* Mobile : bandeau ardoise avec le message du panneau, le formulaire remonte dessus en feuille arrondie */}
        <div className="md:hidden relative overflow-hidden px-5 pt-2 pb-10 text-sur-sombre" style={{ background: "linear-gradient(155deg, rgb(var(--neutre-750)) 0%, rgb(var(--neutre-800)) 45%, rgb(var(--neutre-900)) 100%)" }}>
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full blur-3xl" style={{ background: "rgb(var(--primaire-500) / 0.14)" }} aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-2">
            <a href={SITE_URL} aria-label="LIGGEEY, retour au site" className="inline-flex min-h-[44px] items-center">
              <Logo color="rgb(var(--texte-sur-sombre))" iconColor={COLORS.orange} height={22} />
            </a>
            <div className="flex items-center">
              <App.BoutonTheme variante="sur-sombre" />
              <a href={SITE_URL} className="inline-flex min-h-[44px] items-center gap-1.5 pl-2 text-sm font-medium text-white/85">
                <ArrowLeft size={15} aria-hidden="true" /> Retour au site
              </a>
            </div>
          </div>
          <p className="relative mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-marque-vif">
            <span className="h-0.5 w-6 bg-marque" aria-hidden="true" />
            {t.surtitre}
          </p>
          <p className="relative mt-2 max-w-xs text-balance text-[22px] font-semibold leading-tight">
            {t.titre} <span className="text-marque-vif">{t.accent}</span>
          </p>
        </div>

        <div className="relative z-10 -mt-5 flex flex-1 items-start justify-center rounded-t-xl bg-surface px-5 pt-7 pb-8 md:mt-0 md:items-center md:rounded-none md:px-6 md:py-16">
          <div className="w-full max-w-md">
            <a href={SITE_URL} className="hidden md:inline-flex items-center gap-1.5 min-h-[44px] mb-4 text-sm font-medium hover:underline" style={{ color: COLORS.slateLight }}>
              <ArrowLeft size={15} aria-hidden="true" /> Retour au site
            </a>
            {children}

            {/* Mobile : l’aide du panneau, en bas du formulaire */}
            <div className="md:hidden mt-8 flex items-center justify-between gap-3 rounded-lg border border-base bg-doux px-4 py-3">
              <span>
                <span className="block text-sm font-semibold text-principal">Besoin d’aide ?</span>
                <span className="block text-xs text-secondaire">Sur WhatsApp ou au bureau de {site.bureau.ville}.</span>
              </span>
              <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded border border-forte bg-surface px-4 text-sm font-semibold text-principal transition-colors hover:border-whatsapp">
                <MessageCircle size={16} aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const steps = [
    { n: 1, label: "Choix du profil" },
    { n: 2, label: "Informations" },
    { n: 3, label: "Confirmation" },
  ];
  return (
    <ol className="flex items-center mb-10" aria-label="Étapes de l’inscription">
      {steps.map((s, i) => {
        const state = s.n < step ? "done" : s.n === step ? "current" : "upcoming";
        return (
          <React.Fragment key={s.n}>
            <li className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  state === "upcoming" ? "border border-forte bg-surface text-discret" : "bg-marque text-sur-marque"
                }`}
              >
                {state === "done" ? <Check size={14} aria-hidden="true" /> : s.n}
              </span>
              {/* Sur mobile, seul le libellé de l’étape en cours s’affiche ; les autres restent annoncés aux lecteurs d’écran. */}
              <span className={`whitespace-nowrap text-sm ${state === "current" ? "" : "sr-only sm:not-sr-only"} ${state === "upcoming" ? "text-discret" : state === "current" ? "font-semibold text-principal" : "text-secondaire"}`}>
                {s.label}
              </span>
            </li>
            {i < steps.length - 1 && <li className={`mx-2 h-px min-w-[16px] flex-1 sm:mx-3 ${state === "done" ? "bg-marque" : "bg-[rgb(var(--bordure-base))]"}`} aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </ol>
  );
}

function SSLNote() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs mt-5" style={{ color: COLORS.slateLight }}>
      <Lock size={13} /> Connexion sécurisée SSL 256-bit
    </p>
  );
}

function Pagination({ page, pageSize, totalItems, onPageChange }) {
  return (
    <div className="mt-6 rounded-lg border border-base bg-surface px-5 py-3">
      <App.PaginationApp page={page} total={totalItems} parPage={pageSize} onChange={onPageChange} />
    </div>
  );
}


/* ---------- Toasts (feedback des actions) ---------- */

const toastListeners = new Set();
function notify(message, tone = "success") {
  toastListeners.forEach((l) => l({ message, tone }));
}

function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const listener = ({ message, tone }) => {
      const id = Date.now() + Math.random();
      setItems((s) => [...s, { id, message, tone }]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 3500);
    };
    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 items-stretch sm:items-end pointer-events-none" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="pointer-events-auto rounded-md px-4 py-3 text-sm font-medium shadow-lg flex items-center gap-2 sm:max-w-sm" style={{ background: COLORS.dark, color: COLORS.onDark }}>
          {t.tone === "info" ? <AlertCircle size={15} color={COLORS.orange} /> : <CheckCircle2 size={15} color={COLORS.successBright} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ---------- Images avec repli (les images distantes peuvent être bloquées) ---------- */

function SafeImg({ src, alt = "", className = "", style, kind = "avatar" }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = !src || failedSrc === src;
  if (failed) {
    if (kind === "photo") {
      return (
        <div role="img" aria-label={alt} className={`${className} flex items-center justify-center`} style={{ background: "linear-gradient(135deg, rgb(var(--fond-marque-doux)) 0%, rgb(var(--fond-doux)) 100%)", ...style }}>
          <Wrench size={22} color={COLORS.orange} />
        </div>
      );
    }
    return (
      <div role="img" aria-label={alt} className={`${className} flex items-center justify-center font-semibold text-sm`} style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong, ...style }}>
        {initials(alt || "?")}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" onError={() => setFailedSrc(src)} />;
}

/* ---------- Sélecteur de fichier caché ---------- */

function FilePickerButton({ accept, onPick, className, style, children }) {
  const ref = useRef(null);
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) onPick(f); e.target.value = ""; }} />
      <button type="button" onClick={() => ref.current && ref.current.click()} className={className} style={style}>{children}</button>
    </>
  );
}

/* ---------- Styles partagés des écrans de connexion et d’inscription ----------
   Mêmes règles que la bibliothèque components/app : champs de 48 px, focus orange,
   liens en text-marque (orange lisible sur blanc), sélection en fond orange léger. */

const AUTH = {
  titre: "text-2xl md:text-3xl font-semibold text-principal mb-2",
  intro: "text-sm text-secondaire",
  libelle: "block text-sm font-semibold text-principal mb-1.5",
  // 16 px sur mobile : en dessous, Safari sur iPhone zoome sur le champ touché.
  champ: (erreur) =>
    `h-12 w-full rounded-md border bg-surface px-4 text-base md:text-[15px] text-principal placeholder:text-discret outline-none transition-colors focus:border-marque focus:ring-2 focus:ring-focus/40 ${
      erreur ? "border-statut-danger" : "border-base hover:border-forte"
    }`,
  aide: (erreur) => `mt-1.5 text-xs ${erreur ? "text-statut-danger" : "text-discret"}`,
  lien: "font-semibold text-marque underline-offset-4 hover:underline",
  principal:
    "inline-flex min-h-[48px] w-full items-center justify-center rounded bg-marque px-6 text-[15px] font-semibold text-sur-marque transition-colors hover:bg-marque-survol active:bg-marque-actif",
  secondaire:
    "inline-flex min-h-[48px] w-full items-center justify-center rounded border border-forte bg-surface px-6 text-[15px] font-semibold text-principal transition-colors hover:bg-doux",
  case: "h-5 w-5 shrink-0 rounded accent-primaire-500",
  oeil: "absolute right-1.5 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-md text-discret hover:bg-doux hover:text-secondaire",
};

/* ---------- Champs de formulaire de l’application ----------
   Mêmes styles que AUTH, pour tous les formulaires des espaces (services, offres,
   profils, événements…). Champ : libellé relié, contrôle, aide ou erreur. */

const FORM = {
  champ: AUTH.champ,
  zone: (erreur) => `${AUTH.champ(erreur).replace("h-12 ", "")} py-3`,
  liste: (erreur) => `${AUTH.champ(erreur)} appearance-none pr-10`,
  section: "mb-4 text-sm font-semibold text-principal",
  grille: "grid grid-cols-1 gap-5 sm:grid-cols-2",
  actions: "mt-6 flex flex-col-reverse gap-3 border-t border-base pt-5 sm:flex-row sm:justify-end",
  // Bouton de choix en pastille (suggestions, motifs, réponses courtes).
  pastille: (actif) =>
    `inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
      actif ? "border-marque bg-marque-doux text-principal" : "border-base bg-surface text-secondaire hover:border-forte hover:text-principal"
    }`,
  encart: "rounded-lg border border-base bg-surface p-5",
  fichier: "inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-forte bg-surface px-4 text-sm font-semibold text-principal transition-colors hover:bg-doux",
};

function Champ({ id, label, requis, aide, erreur, children, large }) {
  return (
    <div className={large ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className={AUTH.libelle}>
        {label}{requis && <span aria-hidden="true" className="text-marque"> *</span>}
      </label>
      {children}
      {(erreur || aide) && <p id={`${id}-aide`} className={AUTH.aide(erreur)}>{erreur || aide}</p>}
    </div>
  );
}

/**
 * État d’un formulaire : valeurs, erreurs (affichées après un premier essai d’envoi)
 * et attributs des champs. `verifier(v)` renvoie { clé: message | false }.
 */
function useFormulaire(initial, verifier = () => ({})) {
  const [v, setV] = useState(initial);
  const [essai, setEssai] = useState(false);
  const erreurs = verifier(v);
  const invalide = Object.values(erreurs).some(Boolean);
  const err = (k) => (essai && erreurs[k]) || null;
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }));
  const attrs = (id, k, { requis, aide } = {}) => ({
    id,
    value: v[k] ?? "",
    onChange: (e) => set(k, e.target.value),
    "aria-required": requis || undefined,
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) || aide ? `${id}-aide` : undefined,
  });
  const soumettre = (action) => (e) => {
    e.preventDefault();
    setEssai(true);
    if (!invalide) action(v);
  };
  return { v, setV, set, err, attrs, soumettre, essai, invalide, setEssai };
}

/** Rappel global sous un formulaire incomplet. */
function AlerteFormulaire({ visible, children = "Complétez les champs signalés." }) {
  if (!visible) return null;
  return <p role="alert" className="mt-5 text-sm text-statut-danger">{children}</p>;
}

/** Action destructrice (refuser, archiver…), au gabarit des boutons de l’application. */
function BoutonDanger({ className = "", children, ...props }) {
  return (
    <button type="button" className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded bg-statut-danger px-6 text-[15px] font-semibold text-sur-statut transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...props}>
      {children}
    </button>
  );
}

/** Liste déroulante avec flèche, au style des champs. */
function ListeChamp({ erreur, className = "", children, ...props }) {
  return (
    <div className="relative">
      <select className={`${FORM.liste(erreur)} ${className}`} {...props}>{children}</select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-discret" aria-hidden="true" />
    </div>
  );
}

/* ---------- Screen 1 : Connexion ---------- */

const ESPACES_DEMO = [
  { id: "chercheur", label: "Chercheur d’emploi" },
  { id: "prestataire", label: "Prestataire" },
  { id: "entreprise", label: "Entreprise" },
  { id: "jeune", label: "Cap Métier" },
  { id: "mentor", label: "Mentor" },
  { id: "admin", label: "Admin" },
];

/* Compte de démonstration d’un espace (lib/comptesDemo.mjs, créés par npm run db:amorcer). */
const compteDemo = (espace) => COMPTES_DEMO.find((c) => c.profil === espace);

function ConnexionScreen({ onNavigate }) {
  /* Avec le serveur : vrai compte (e-mail ou téléphone), vérifié par l’API. Le choix d’espace ne sert qu’à
     préremplir un compte de démonstration (NEXT_PUBLIC_COMPTES_DEMO). Sans serveur (Storybook) : simulation. */
  const serveur = React.useContext(ServeurContext);
  const avecDemo = !serveur || serveur.comptesDemo;
  const [mode, setMode] = useState("login"); // login | forgot | sent
  const [email, setEmail] = useState(!serveur ? "demo@liggeey.sn" : avecDemo ? compteDemo("chercheur").email : "");
  const [password, setPassword] = useState(avecDemo ? MOT_DE_PASSE_DEMO : "");
  const [espace, setEspace] = useState("chercheur");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState(null);
  const [erreurServeur, setErreurServeur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetTouched, setResetTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || (!!serveur && !!normaliserTelephone(email));
  const passwordValid = password.length >= 8;
  const resetEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail);

  function choisirEspace(id) {
    setEspace(id);
    if (serveur) {
      setEmail(compteDemo(id).email);
      setPassword(MOT_DE_PASSE_DEMO);
      setErreurServeur("");
    }
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setTouched(true);
    setErreurServeur("");
    if (!emailValid || !passwordValid) {
      setStatus("error");
      return;
    }
    setStatus(null);
    if (!serveur) {
      onNavigate("dashboard", { espace });
      return;
    }
    setEnvoi(true);
    const r = await apiConnexion({ identifiant: email.trim(), motDePasse: password, souvenir: remember });
    setEnvoi(false);
    if (r.ok) serveur.onConnecte(r.compte);
    else setErreurServeur(r.erreur || "Connexion impossible pour le moment.");
  }

  function handleResetSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setResetTouched(true);
    if (resetEmailValid) setMode("sent");
  }

  if (mode === "forgot" || mode === "sent") {
    const erreur = resetTouched && !resetEmailValid;
    return (
      <form onSubmit={handleResetSubmit} noValidate>
        <button type="button" onClick={() => setMode("login")} className={`inline-flex min-h-[44px] items-center gap-1.5 text-sm mb-3 ${AUTH.lien}`}>
          <ArrowLeft size={15} aria-hidden="true" /> Retour à la connexion
        </button>
        <h2 className={AUTH.titre}>Mot de passe oublié</h2>
        <p className={`${AUTH.intro} mb-6`}>
          Saisissez votre adresse e-mail, nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {mode === "sent" ? (
          <div role="status" className="flex items-start gap-3 rounded-md bg-statut-succes-doux px-4 py-3 text-sm text-statut-succes mb-2">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>Un lien de réinitialisation a été envoyé à <strong>{resetEmail}</strong>. Vérifiez votre boîte de réception.</span>
          </div>
        ) : (
          <>
            <label htmlFor="reset-email" className={AUTH.libelle}>Adresse e-mail</label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="exemple@liggeey.sn"
              aria-invalid={erreur || undefined}
              aria-describedby="reset-email-aide"
              className={AUTH.champ(erreur)}
            />
            <p id="reset-email-aide" className={`${AUTH.aide(erreur)} mb-6`}>
              {erreur ? "Veuillez saisir une adresse e-mail valide." : "Utilisez l’adresse associée à votre compte LIGGEEY"}
            </p>
            <button type="submit" className={AUTH.principal}>Envoyer le lien</button>
          </>
        )}
        <SSLNote />
      </form>
    );
  }

  const emailErreur = touched && !emailValid;
  const passwordErreur = touched && !passwordValid;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={AUTH.titre}>Bon retour parmi nous</h2>
      <p className={`${AUTH.intro} mb-6`}>
        Pas encore de compte ?{" "}
        <button type="button" onClick={() => onNavigate("signup-choice")} className={AUTH.lien}>
          Inscrivez-vous
        </button>
      </p>

      {avecDemo && (
      <fieldset className="mb-5 md:mb-6">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-discret">{serveur ? "Compte de démonstration" : "Espace à ouvrir (démo)"}</legend>
        <div className="grid grid-cols-3 gap-2">
          {ESPACES_DEMO.map((o) => {
            const actif = espace === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={actif}
                onClick={() => choisirEspace(o.id)}
                className={`min-h-[44px] rounded-md border px-2 text-xs font-semibold leading-tight transition-colors ${
                  actif ? "border-marque bg-marque-doux text-marque-fort" : "border-base bg-surface text-secondaire hover:bg-doux hover:text-principal"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      )}

      <div className="mb-4">
        <label htmlFor="connexion-email" className={AUTH.libelle}>{serveur ? "E-mail ou téléphone" : "Adresse e-mail"}</label>
        <input
          id="connexion-email"
          type={serveur ? "text" : "email"}
          inputMode={serveur ? "email" : undefined}
          autoComplete={serveur ? "username" : "email"}
          autoCapitalize="none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={serveur ? "exemple@liggeey.sn ou 77 000 00 00" : "exemple@liggeey.sn"}
          aria-invalid={emailErreur || undefined}
          aria-describedby="connexion-email-aide"
          className={AUTH.champ(emailErreur)}
        />
        <p id="connexion-email-aide" className={AUTH.aide(emailErreur)}>
          {serveur
            ? emailErreur ? "Saisissez une adresse e-mail ou un numéro sénégalais valide." : "L’adresse e-mail ou le numéro utilisé lors de votre inscription"
            : emailErreur ? "Veuillez saisir une adresse e-mail valide." : "Saisissez l’adresse e-mail utilisée lors de votre inscription"}
        </p>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="connexion-mdp" className="text-sm font-semibold text-principal">Mot de passe</label>
          <button type="button" onClick={() => setMode("forgot")} className={`text-sm ${AUTH.lien}`}>Mot de passe oublié ?</button>
        </div>
        <div className="relative">
          <input
            id="connexion-mdp"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tapez votre mot de passe"
            aria-invalid={passwordErreur || undefined}
            aria-describedby="connexion-mdp-aide"
            className={`${AUTH.champ(passwordErreur)} pr-12`}
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className={AUTH.oeil} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
        <p id="connexion-mdp-aide" className={AUTH.aide(passwordErreur)}>
          {passwordErreur ? "8 caractères minimum requis." : "8 caractères minimum"}
        </p>
      </div>

      <label className="flex min-h-[44px] items-center gap-3 mb-4 cursor-pointer select-none">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className={AUTH.case} />
        <span className="text-sm text-principal">Se souvenir de moi</span>
      </label>

      <button type="submit" disabled={envoi} aria-busy={envoi || undefined} className={`${AUTH.principal} gap-2 disabled:opacity-70`}>
        {envoi && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {envoi ? "Connexion…" : "Se connecter"}
      </button>

      {(status === "error" || erreurServeur) && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-md bg-statut-danger-doux px-4 py-3 text-sm text-statut-danger">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          {erreurServeur || "Merci de corriger les champs en rouge avant de continuer."}
        </div>
      )}

      <SSLNote />
    </form>
  );
}

/* ---------- Screen 2 : Inscription — Choix du profil ---------- */

const PROFILES = [
  { id: "chercheur", title: "Je cherche un emploi", subtitle: "Jeune diplômé ou en recherche active" },
  { id: "prestataire", title: "Je suis prestataire", subtitle: "Freelance ou travailleur du secteur informel" },
  { id: "entreprise", title: "Je recrute", subtitle: "Entreprise ou particulier employeur" },
  { id: "jeune", title: "Je cherche ma voie", subtitle: "Dès 15 ans, sans métier : orientation, formation et mentor" },
  { id: "mentor", title: "Je veux devenir mentor", subtitle: "Professionnel expérimenté qui accompagne des jeunes" },
];

function ProfileRadioCard({ profile, selected, onSelect }) {
  const isSelected = selected === profile.id;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(profile.id)}
      className={`w-full text-left rounded-lg border px-5 py-4 mb-3 transition-colors ${
        isSelected ? "border-marque bg-marque-doux" : "border-base bg-surface hover:border-forte hover:bg-doux"
      }`}
    >
      <span className="flex items-center justify-between gap-4">
        <span>
          <span className={`block font-semibold ${isSelected ? "text-marque-fort" : "text-principal"}`}>{profile.title}</span>
          <span className="block text-sm text-secondaire">{profile.subtitle}</span>
        </span>
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${isSelected ? "border-marque" : "border-forte"}`} aria-hidden="true">
          {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-marque" />}
        </span>
      </span>
    </button>
  );
}

function SignupChoiceScreen({ onNavigate }) {
  const [selected, setSelected] = useState("chercheur");

  return (
    <div>
      <Stepper step={1} />
      <h2 className={AUTH.titre}>Créer votre compte</h2>
      <p className={`${AUTH.intro} mb-6`}>
        Déjà inscrit ?{" "}
        <button type="button" onClick={() => onNavigate("login")} className={AUTH.lien}>
          Connectez-vous
        </button>
      </p>

      <div role="radiogroup" aria-label="Votre profil">
        {PROFILES.map((p) => (
          <ProfileRadioCard key={p.id} profile={p} selected={selected} onSelect={setSelected} />
        ))}
      </div>

      <button type="button" onClick={() => onNavigate("signup-info", { profile: selected })} className={`${AUTH.principal} mt-3`}>
        Continuer
      </button>

      <SSLNote />
    </div>
  );
}

/* ---------- Screen 3 : Inscription — Informations (par profil) ---------- */

const PROFILE_META = {
  chercheur: { badge: "Profil : Je cherche un emploi", tagline: "chercheur" },
  prestataire: { badge: "Profil : Je suis prestataire", tagline: "prestataire" },
  entreprise: { badge: "Profil : Je recrute", tagline: "recruteur" },
  jeune: { badge: "Parcours : Cap Métier", tagline: "Cap Métier" },
  mentor: { badge: "Profil : Je veux devenir mentor", tagline: "mentor" },
};

/* Âges d’accès, d’après le droit sénégalais (à faire valider par un juriste) :
   - moins de 18 ans = enfant ; majorité civile à 18 ans (Code de la famille) ;
   - travail et apprentissage dès 15 ans révolus, travaux dangereux interdits avant 18 ans
     (Code du travail, art. L.145 ; arrêté n° 3748 du 6 juin 2003) ;
   - un mineur non émancipé ne peut pas être commerçant (Acte uniforme OHADA sur le droit commercial général).
   Les 15-17 ans passent donc par Cap Métier, avec l’accord d’un parent ou tuteur.
   AGE_MAJORITE, AGE_MIN_CAP_METIER, AGE_MIN_PAR_PROFIL et LIENS_PARENT viennent de lib/comptes.mjs,
   partagé avec l’API, qui revérifie ces règles à l’inscription. */

/* Âge révolu à la date de démo, à partir d’une date « AAAA-MM-JJ » (null si la date est vide ou invalide) */
function ageAu(dateIso, ref = demoNow()) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso || "");
  if (!m) return null;
  const [an, mois, jour] = [Number(m[1]), Number(m[2]), Number(m[3])];
  let age = ref.getFullYear() - an;
  if (ref.getMonth() + 1 < mois || (ref.getMonth() + 1 === mois && ref.getDate() < jour)) age -= 1;
  return age >= 0 && age < 120 ? age : null;
}

function isoDuJour(d = demoNow()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const CHAMP_NAISSANCE = (help) => ({ name: "naissance", label: "Date de naissance", type: "date", help });

const FIELD_CONFIG = {
  chercheur: [
    { name: "nom", label: "Nom complet", placeholder: "Ex. : Moussa Diop", help: "Saisissez votre prénom et votre nom" },
    CHAMP_NAISSANCE("L’espace emploi est ouvert à partir de 18 ans"),
    { name: "email", label: "Adresse e-mail", type: "email", placeholder: "moussa.diop@exemple.sn", help: "Saisissez une adresse e-mail valide pour la validation" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 77 000 00 00", help: "Exemple de format valide au Sénégal" },
  ],
  entreprise: [
    { name: "entreprise", label: "Nom de l’entreprise", placeholder: "Ex. : Sonatel SA", help: "Saisissez le nom officiel de votre entreprise" },
    { name: "responsable", label: "Nom du responsable", placeholder: "Ex. : Amadou Ba", help: "Prénom et nom de la personne en charge des recrutements" },
    { name: "email", label: "Adresse e-mail professionnelle", type: "email", placeholder: "contact@entreprise.sn", help: "Utilisez une adresse e-mail professionnelle" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 33 000 00 00", help: "Numéro de contact de l’entreprise ou du recruteur" },
    { name: "secteur", label: "Secteur d’activité", placeholder: "Ex. : Télécommunications", help: "Sélectionnez ou saisissez votre domaine principal" },
  ],
  prestataire: [
    { name: "nom", label: "Nom complet", placeholder: "Ex. : Fatou Ndiaye", help: "Saisissez votre prénom et votre nom" },
    CHAMP_NAISSANCE("L’espace prestataire est réservé aux personnes de 18 ans et plus"),
    { name: "email", label: "Adresse e-mail", type: "email", placeholder: "fatou.ndiaye@exemple.sn", help: "Saisissez une adresse e-mail valide pour la validation" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 77 000 00 00", help: "Exemple de format valide au Sénégal" },
    { name: "competences", label: "Domaine de compétence", placeholder: "Ex. : restauration, nettoyage, maintenance", help: "Saisissez vos compétences clés (séparées par des virgules)" },
    { name: "ville", label: "Ville", placeholder: "Ex. : Dakar", help: "Votre ville de résidence principale au Sénégal" },
  ],
  jeune: [
    { name: "nom", label: "Nom complet", placeholder: "Ex. : Awa Sarr", help: "Saisissez votre prénom et votre nom" },
    CHAMP_NAISSANCE("Cap Métier est ouvert dès 15 ans. Avant 18 ans, nous demandons l’accord d’un parent ou tuteur"),
    { name: "telephone", label: "Téléphone", placeholder: "+221 77 000 00 00", help: "Nous vous écrirons surtout par SMS ou WhatsApp" },
    { name: "email", label: "Adresse e-mail", type: "email", optional: true, placeholder: "awa.sarr@exemple.sn", help: "Facultatif" },
    { name: "ville", label: "Ville ou quartier", placeholder: "Ex. : Pikine", help: "Pour vous proposer des ateliers près de chez vous" },
  ],
  mentor: [
    { name: "nom", label: "Nom complet", placeholder: "Ex. : Mariama Ba", help: "Saisissez votre prénom et votre nom" },
    CHAMP_NAISSANCE("Les mentors doivent avoir 18 ans ou plus"),
    { name: "email", label: "Adresse e-mail", type: "email", placeholder: "mariama.ba@exemple.sn", help: "Saisissez une adresse e-mail valide pour la validation" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 77 000 00 00", help: "Exemple de format valide au Sénégal" },
    { name: "metier", label: "Métier ou domaine d’expertise", placeholder: "Ex. : couturière, responsable RH, électricien", help: "Le domaine dans lequel vous accompagnerez les jeunes" },
    { name: "experience", label: "Années d’expérience", type: "number", placeholder: "Ex. : 10", help: "Dans ce métier ou ce domaine" },
  ],
};

/* Message affiché quand l’âge ne permet pas d’ouvrir l’espace choisi */
function AgeRefus({ profil, age, onCapMetier }) {
  if (age < AGE_MIN_CAP_METIER) {
    return (
      <div role="alert" className="mt-2 rounded-md border border-statut-alerte bg-statut-alerte-doux p-4 text-sm text-principal">
        <p className="mb-1 font-semibold">LIGGEEY accueille les jeunes à partir de 15 ans.</p>
        <p className="mb-3 text-secondaire">
          Avant cet âge, la loi sénégalaise interdit le travail, et l’école reste la priorité. Avec vos parents, vous pouvez nous écrire sur WhatsApp ou passer au bureau de Dakar : nous vous orienterons.
        </p>
        <a href={lienWhatsApp("Bonjour LIGGEEY, je voudrais des conseils d’orientation pour mon enfant.")} target="_blank" rel="noopener noreferrer" className={AUTH.lien}>
          Écrire à LIGGEEY sur WhatsApp
        </a>
      </div>
    );
  }
  if (profil === "mentor") {
    return (
      <p role="alert" className="mt-2 rounded-md border border-statut-alerte bg-statut-alerte-doux p-4 text-sm text-principal">
        Pour devenir mentor, il faut avoir 18 ans ou plus. Vous cherchez vous-même votre voie ? Le parcours Cap Métier est fait pour vous.
      </p>
    );
  }
  return (
    <div role="alert" className="mt-2 rounded-md border border-statut-alerte bg-statut-alerte-doux p-4 text-sm text-principal">
      <p className="mb-1 font-semibold">
        {profil === "prestataire" ? "L’espace prestataire est réservé aux personnes de 18 ans et plus." : "L’espace emploi est réservé aux personnes de 18 ans et plus."}
      </p>
      <p className="mb-3 text-secondaire">
        {profil === "prestataire"
          ? "Avant 18 ans, la loi ne permet pas d’exercer une activité à son compte. "
          : "Avant 18 ans, la loi protège les jeunes de certains travaux. "}
        Le parcours Cap Métier vous aide à choisir un métier, à vous former et à trouver un apprentissage, avec un mentor.
      </p>
      <button type="button" onClick={onCapMetier} className="inline-flex min-h-[44px] items-center rounded bg-marque px-4 text-sm font-semibold text-sur-marque hover:bg-marque-survol">
        Continuer avec Cap Métier
      </button>
    </div>
  );
}

function SignupInfoScreen({ profile, onNavigate }) {
  /* Le profil peut basculer vers Cap Métier si l’âge saisi l’exige (les champs déjà remplis sont gardés).
     Avec le serveur, le compte est créé par l’API, qui revérifie tout (âge, doublons…) et renvoie ses erreurs par champ. */
  const serveur = React.useContext(ServeurContext);
  const [envoi, setEnvoi] = useState(false);
  const [erreursServeur, setErreursServeur] = useState({});
  const [erreurServeur, setErreurServeur] = useState("");
  const [profil, setProfil] = useState(profile);
  const meta = PROFILE_META[profil] || PROFILE_META.chercheur;
  const fields = FIELD_CONFIG[profil] || FIELD_CONFIG.chercheur;

  const [values, setValues] = useState({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [touched, setTouched] = useState(false);

  const passwordValid = password.length >= 8 && /\d/.test(password);
  const fieldsValid = fields.every((f) => f.optional || (values[f.name] || "").trim().length > 0);
  const emailField = fields.find((f) => f.type === "email");
  const emailSaisi = emailField ? (values[emailField.name] || "").trim() : "";
  const emailValid = emailField && (emailSaisi || !emailField.optional) ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSaisi) : true;

  const avecNaissance = fields.some((f) => f.name === "naissance");
  const age = avecNaissance ? ageAu(values.naissance) : null;
  const naissanceValide = !avecNaissance || age !== null;
  const ageMin = AGE_MIN_PAR_PROFIL[profil];
  const tropJeune = age !== null && ageMin !== undefined && age < ageMin;
  const mineur = profil === "jeune" && age !== null && age >= AGE_MIN_CAP_METIER && age < AGE_MAJORITE;
  const parentValide = !mineur || (["parentNom", "parentTelephone"].every((k) => (values[k] || "").trim().length > 0) && values.parentLien && values.parentInforme);

  const formValid = fieldsValid && emailValid && naissanceValide && !tropJeune && parentValide && passwordValid && accepted;

  function setField(name, val) {
    setValues((v) => ({ ...v, [name]: val }));
    if (erreursServeur[name]) setErreursServeur(({ [name]: _retire, ...reste }) => reste);
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setTouched(true);
    setErreurServeur("");
    if (!formValid || envoi) return;
    const suite = { profile: profil, inscription: { mineur, parentNom: values.parentNom } };
    if (!serveur) {
      onNavigate("signup-confirm", suite);
      return;
    }
    setEnvoi(true);
    const r = await apiInscription({ ...values, profil, motDePasse: password, cgu: accepted });
    setEnvoi(false);
    if (r.ok) {
      serveur.retenirCompte(r.compte);
      onNavigate("signup-confirm", suite);
      return;
    }
    setErreursServeur(r.erreurs || {});
    setErreurServeur(r.erreur || "L’inscription est impossible pour le moment.");
  }

  function passerCapMetier() {
    setProfil("jeune");
    setTouched(false);
  }

  const passwordErreur = touched && !passwordValid;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stepper step={2} />
      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-marque-doux text-marque-fort">{meta.badge}</span>
      <h2 className={AUTH.titre}>Créer votre compte</h2>
      <p className={`${AUTH.intro} mb-6`}>
        Remplissez les informations suivantes pour finaliser votre inscription {meta.tagline}.
      </p>

      {fields.map((f) => {
        const val = values[f.name] || "";
        const estNaissance = f.name === "naissance";
        const vide = !f.optional && val.trim().length === 0;
        const erreurApi = erreursServeur[f.name];
        const invalid = (touched && (vide || (f.type === "email" && !emailValid) || (estNaissance && !naissanceValide))) || !!erreurApi;
        const message = erreurApi || (vide ? "Ce champ est requis." : f.type === "email" ? "Veuillez saisir une adresse e-mail valide." : "Veuillez saisir une date de naissance valide.");
        const id = `inscription-${f.name}`;
        return (
          <div key={f.name} className="mb-4">
            <label htmlFor={id} className={AUTH.libelle}>
              {f.label} {!f.optional && <span className="text-statut-danger" aria-hidden="true">*</span>}
            </label>
            <input
              id={id}
              type={f.type || "text"}
              value={val}
              onChange={(e) => setField(f.name, e.target.value)}
              placeholder={f.placeholder}
              max={estNaissance ? isoDuJour() : undefined}
              min={f.type === "number" ? 0 : undefined}
              aria-required={!f.optional || undefined}
              aria-invalid={invalid || tropJeune && estNaissance || undefined}
              aria-describedby={`${id}-aide`}
              className={AUTH.champ(invalid || (estNaissance && tropJeune))}
            />
            <p id={`${id}-aide`} className={AUTH.aide(invalid)}>
              {invalid ? message : f.help}
            </p>
            {estNaissance && tropJeune && <AgeRefus profil={profil} age={age} onCapMetier={passerCapMetier} />}
          </div>
        );
      })}

      {mineur && (
        <fieldset className="mb-4 rounded-lg border border-base bg-doux p-4">
          <legend className="px-1 text-sm font-semibold text-principal">Votre parent ou tuteur</legend>
          <p className="mb-4 text-sm text-secondaire">
            Vous avez {age} ans. Avant 18 ans, la loi demande l’accord d’un parent ou d’un tuteur. Il recevra un SMS pour confirmer, et il sera prévenu de vos séances.
          </p>
          {[
            { name: "parentNom", label: "Nom du parent ou tuteur", placeholder: "Ex. : Ndèye Sarr" },
            { name: "parentTelephone", label: "Téléphone du parent ou tuteur", placeholder: "+221 77 000 00 00" },
          ].map((f) => {
            const invalid = touched && !(values[f.name] || "").trim();
            const id = `inscription-${f.name}`;
            return (
              <div key={f.name} className="mb-4">
                <label htmlFor={id} className={AUTH.libelle}>
                  {f.label} <span className="text-statut-danger" aria-hidden="true">*</span>
                </label>
                <input id={id} type="text" value={values[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} placeholder={f.placeholder} aria-required="true" aria-invalid={invalid || undefined} className={AUTH.champ(invalid)} />
                {invalid && <p className={AUTH.aide(true)}>Ce champ est requis.</p>}
              </div>
            );
          })}
          <div className="mb-4">
            <label htmlFor="inscription-parentLien" className={AUTH.libelle}>
              Lien avec vous <span className="text-statut-danger" aria-hidden="true">*</span>
            </label>
            <select id="inscription-parentLien" value={values.parentLien || ""} onChange={(e) => setField("parentLien", e.target.value)} aria-required="true" aria-invalid={(touched && !values.parentLien) || undefined} className={AUTH.champ(touched && !values.parentLien)}>
              <option value="">Choisir</option>
              {LIENS_PARENT.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <label className="flex cursor-pointer select-none items-start gap-3">
            <input type="checkbox" checked={!!values.parentInforme} onChange={(e) => setField("parentInforme", e.target.checked)} className={`${AUTH.case} mt-0.5`} />
            <span className="text-sm text-principal">Mon parent ou tuteur est au courant de mon inscription à Cap Métier.</span>
          </label>
          {touched && !values.parentInforme && <p role="alert" className="mt-2 text-xs text-statut-danger">Parlez-en d’abord à votre parent ou tuteur, puis cochez cette case.</p>}
        </fieldset>
      )}

      <div className="mb-4">
        <label htmlFor="inscription-mdp" className={AUTH.libelle}>
          Mot de passe <span className="text-statut-danger" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <input
            id="inscription-mdp"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tapez votre mot de passe"
            aria-required="true"
            aria-invalid={passwordErreur || undefined}
            aria-describedby="inscription-mdp-aide"
            className={`${AUTH.champ(passwordErreur)} pr-12`}
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className={AUTH.oeil} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
        <p id="inscription-mdp-aide" className={AUTH.aide(passwordErreur)}>
          8 caractères minimum avec au moins un chiffre
        </p>
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className={`${AUTH.case} mt-0.5`} />
        <span className="text-sm text-principal">
          J’accepte les{" "}
          <a href="/cgu" className={AUTH.lien}>conditions d’utilisation</a> et la{" "}
          <a href="/confidentialite" className={AUTH.lien}>politique de confidentialité</a> de LIGGEEY.
        </span>
      </label>
      {touched && !accepted && (
        <p role="alert" className="text-xs mb-4 -mt-4 text-statut-danger">Merci d’accepter les conditions pour continuer.</p>
      )}

      {erreurServeur && (
        <div role="alert" className="mb-4 flex items-start gap-3 rounded-md bg-statut-danger-doux px-4 py-3 text-sm text-statut-danger">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {erreurServeur}
            {/* Erreurs sur des champs sans message propre (parent, mot de passe, conditions) */}
            {Object.entries(erreursServeur)
              .filter(([champ]) => !fields.some((f) => f.name === champ))
              .map(([champ, msg]) => <span key={champ} className="mt-1 block">{msg}</span>)}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("signup-choice")} className={AUTH.secondaire}>
          Retour
        </button>
        <button type="submit" disabled={envoi} aria-busy={envoi || undefined} className={`${AUTH.principal} gap-2 disabled:opacity-70`}>
          {envoi && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {envoi ? "Envoi…" : profil === "mentor" ? "Envoyer ma candidature" : "Créer mon compte"}
        </button>
      </div>

      <SSLNote />
    </form>
  );
}

/* ---------- Screen 4 : Inscription — Confirmation ---------- */

function ConfirmationScreen({ profile, inscription, onNavigate }) {
  const meta = PROFILE_META[profile] || PROFILE_META.chercheur;
  const estMentor = profile === "mentor";
  // Avec le serveur, aucun SMS ni e-mail n’est encore envoyé automatiquement : l’équipe prend contact.
  const serveur = React.useContext(ServeurContext);
  return (
    <div>
      <Stepper step={3} />
      <div className="grid h-14 w-14 place-items-center rounded-full bg-statut-succes-doux text-statut-succes mb-6">
        <Check size={26} aria-hidden="true" />
      </div>
      <h2 className={AUTH.titre}>{estMentor ? "Candidature envoyée" : "Compte créé avec succès"}</h2>
      {estMentor ? (
        <p className={`${AUTH.intro} mb-8 leading-relaxed`}>
          Merci de vouloir accompagner des jeunes ! L’équipe LIGGEEY vérifie votre identité, votre expérience et vos références, puis vous propose de signer la charte du mentor. {serveur ? "Nous vous contacterons dès que votre compte sera validé." : "Vous recevrez un e-mail dès que votre compte sera validé."}
        </p>
      ) : (
        <p className={`${AUTH.intro} mb-8 leading-relaxed`}>
          Bienvenue sur LIGGEEY ! Votre compte <strong className="text-principal">{meta.tagline}</strong> est prêt.
          {inscription?.mineur && (
            <>
              {" "}{serveur ? "Nous allons contacter" : "Nous avons envoyé un SMS à"} {inscription.parentNom || "votre parent ou tuteur"} pour confirmer son accord. Un mentor vous sera attribué dès sa réponse.
            </>
          )}
        </p>
      )}
      <div className="flex flex-col gap-3">
        <button type="button" onClick={() => onNavigate("dashboard", { espace: profile })} className={AUTH.principal}>
          {estMentor ? "Découvrir l’espace mentor (démo)" : profile === "jeune" ? "Voir mon parcours" : "Accéder à mon tableau de bord"}
        </button>
        <button type="button" onClick={() => onNavigate("login")} className={AUTH.secondaire}>
          Retour à la connexion
        </button>
      </div>
      <SSLNote />
    </div>
  );
}

/* ---------- Coquille de l’application : menu groupé, fil d’Ariane, « À faire » ---------- */

const NAV_ITEMS_BY_ESPACE = {
  chercheur: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Ma recherche" },
    { id: "offres", label: "Offres d’emploi", icon: Briefcase, section: "Ma recherche" },
    { id: "candidatures", label: "Mes candidatures", icon: ClipboardList, section: "Ma recherche" },
    { id: "formations", label: "Formations", icon: GraduationCap, section: "Progresser" },
    { id: "mentors", label: "Mentors", icon: UsersRound, section: "Progresser" },
    { id: "suivi", label: "Suivi post-embauche", icon: HeartHandshake, section: "Mon emploi" },
    { id: "messages", label: "Messages", icon: MessageCircle, section: "Mon compte" },
    { id: "profil", label: "Mon profil", icon: UserCircle2, section: "Mon compte" },
    { id: "abonnement", label: "Abonnement", icon: Crown, section: "Mon compte" },
  ],
  prestataire: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Mon activité" },
    { id: "missions", label: "Missions", icon: ClipboardList, section: "Mon activité" },
    { id: "services", label: "Mes services", icon: Wrench, section: "Mon activité" },
    { id: "formations", label: "Formations", icon: GraduationCap, section: "Progresser" },
    { id: "mentors", label: "Mentors", icon: UsersRound, section: "Progresser" },
    { id: "regularisation", label: "Régularisation", icon: Landmark, section: "Mon compte" },
    { id: "messages", label: "Messages", icon: MessageCircle, section: "Mon compte" },
    { id: "profil", label: "Mon profil", icon: UserCircle2, section: "Mon compte" },
    { id: "abonnement", label: "Abonnement", icon: Crown, section: "Mon compte" },
  ],
  entreprise: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Recrutement" },
    { id: "offres", label: "Mes offres", icon: Briefcase, section: "Recrutement" },
    { id: "candidatures", label: "Candidatures", icon: ClipboardList, section: "Recrutement" },
    { id: "suivi", label: "Suivi des recrues", icon: HeartHandshake, section: "Recrutement" },
    { id: "prestataires", label: "Trouver un prestataire", icon: Users2, section: "Prestataires" },
    { id: "messages", label: "Messages", icon: MessageCircle, section: "Mon compte" },
    { id: "profil", label: "Profil entreprise", icon: Building2, section: "Mon compte" },
    { id: "abonnement", label: "Abonnement", icon: Crown, section: "Mon compte" },
  ],
  jeune: [
    { id: "dashboard", label: "Mon parcours", icon: LayoutDashboard, section: "Cap Métier" },
    { id: "orientation", label: "Bilan d’orientation", icon: Compass, section: "Cap Métier" },
    { id: "ateliers", label: "Ateliers découverte", icon: GraduationCap, section: "Cap Métier" },
    { id: "mentor", label: "Mon mentor", icon: UsersRound, section: "Être accompagné" },
    { id: "messages", label: "Messages", icon: MessageCircle, section: "Mon compte" },
    { id: "profil", label: "Mon profil", icon: UserCircle2, section: "Mon compte" },
  ],
  mentor: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Mon mentorat" },
    { id: "mentores", label: "Mes mentorés", icon: Users2, section: "Mon mentorat" },
    { id: "seances", label: "Séances", icon: CalendarDays, section: "Mon mentorat" },
    { id: "messages", label: "Messages", icon: MessageCircle, section: "Mon compte" },
    { id: "profil", label: "Mon profil mentor", icon: UserCircle2, section: "Mon compte" },
  ],
  admin: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Pilotage" },
    { id: "planning", label: "Planning", icon: CalendarDays, section: "Pilotage" },
    { id: "communication", label: "Communication", icon: MessageCircle, section: "Pilotage" },
    { id: "chercheurs", label: "Chercheurs", icon: Users2, section: "Utilisateurs" },
    { id: "prestataires", label: "Prestataires", icon: Wrench, section: "Utilisateurs" },
    { id: "entreprises", label: "Entreprises", icon: Building2, section: "Utilisateurs" },
    { id: "offres", label: "Offres", icon: Briefcase, section: "Activité" },
    { id: "candidatures", label: "Candidatures", icon: ClipboardList, section: "Activité" },
    { id: "services", label: "Services", icon: Package, section: "Activité" },
    { id: "missions", label: "Missions", icon: ClipboardCheck, section: "Activité" },
    { id: "formations", label: "Formations", icon: GraduationCap, section: "Accompagnement" },
    { id: "mentorat", label: "Mentorat", icon: Heart, section: "Accompagnement" },
    { id: "cap-metier", label: "Cap Métier", icon: Compass, section: "Accompagnement" },
    { id: "suivi", label: "Suivi post-embauche", icon: HeartHandshake, section: "Accompagnement" },
    { id: "verifications", label: "Vérification des documents", icon: ShieldCheck, section: "Contrôle" },
    { id: "regularisations", label: "Régularisations", icon: Landmark, section: "Contrôle" },
    { id: "abonnements", label: "Abonnements", icon: CreditCard, section: "Finances et réglages" },
    { id: "parametres", label: "Paramètres", icon: Settings, section: "Finances et réglages" },
  ],
};

/* Pages secondaires : rattachées à une entrée du menu, avec leur fil d’Ariane */
const SUB_PAGES = {
  evaluations: { parent: "profil", label: "Mes évaluations et avis" },
  realisations: { parent: "profil", label: "Mes réalisations" },
};

const USER_BY_ESPACE = {
  chercheur: { name: "Absatou Diallo", role: "Chercheuse d’emploi", initials: "AD" },
  prestataire: { name: "Mamadou Ndiaye", role: "Électricien · prestataire", initials: "MN" },
  entreprise: { name: "Awa Diallo", role: "Senegal Construction SARL", initials: "AD" },
  jeune: { name: "Mame Diarra Sène", role: "Cap Métier · 16 ans", initials: "MS" },
  mentor: { name: "Cheikh Fall", role: "Mentor · Responsable RH", initials: "CF" },
  admin: { name: "Admin LIGGEEY", role: "Super admin", initials: "AL" },
};

/* La coquille vient de la bibliothèque de l’application (components/app/Coquille.jsx) :
   barre latérale claire, barre du haut, en-tête de page avec fil d’Ariane, pied de page.
   Sidebar, Breadcrumb et AppShell gardent leur nom et leurs props d’origine. */

/* Barre d’icônes, en première position avant le menu (bleu le plus foncé, neutre-900).
   Elle garde les icônes d’origine du prototype, dans le même ordre ; chacune a un rôle fixe, adapté à chaque espace :
   Flame = priorités (tableau de bord et « À faire »), Grid3x3 = explorer, Zap = action rapide,
   Triangle = à surveiller, AlignJustify = mes suivis, Layers = progresser, Bell = messages.
   Une icône sans équivalent dans l’espace n’est pas affichée. « creer » ouvre directement le formulaire de création ;
   le compteur reprend celui du menu. */
const RAIL_ICONS = [Flame, Grid3x3, Zap, Triangle, AlignJustify, Layers, Bell];

const RACCOURCIS_PAR_ESPACE = {
  chercheur: [
    { to: "dashboard", label: "Mes priorités" },
    { to: "offres", label: "Parcourir les offres" },
    { to: "abonnement", label: "Booster mon profil" },
    { to: "suivi", label: "Points de suivi à compléter" },
    { to: "candidatures", label: "Mes candidatures" },
    { to: "formations", label: "Me former" },
    { to: "messages", label: "Messages" },
  ],
  prestataire: [
    { to: "dashboard", label: "Mes priorités" },
    { to: "services", label: "Mes services" },
    { to: "services", label: "Ajouter un service", creer: true },
    { to: "regularisation", label: "Régularisation" },
    { to: "missions", label: "Mes missions" },
    { to: "formations", label: "Me former" },
    { to: "messages", label: "Messages" },
  ],
  entreprise: [
    { to: "dashboard", label: "Mes priorités" },
    { to: "prestataires", label: "Trouver un prestataire" },
    { to: "offres", label: "Publier une offre", creer: true },
    { to: "suivi", label: "Recrues à accompagner" },
    { to: "candidatures", label: "Candidatures" },
    { to: "offres", label: "Mes offres" },
    { to: "messages", label: "Messages" },
  ],
  jeune: [
    { to: "dashboard", label: "Mon parcours" },
    { to: "ateliers", label: "Ateliers découverte" },
    { to: "orientation", label: "Faire mon bilan d’orientation" },
    null,
    { to: "mentor", label: "Mon mentor" },
    null,
    { to: "messages", label: "Messages" },
  ],
  mentor: [
    { to: "dashboard", label: "Mes priorités" },
    null,
    null,
    { to: "seances", label: "Demandes de séance" },
    { to: "mentores", label: "Mes mentorés" },
    null,
    { to: "messages", label: "Messages" },
  ],
  admin: [
    { to: "dashboard", label: "Priorités du jour" },
    { to: "chercheurs", label: "Utilisateurs" },
    { to: "offres", label: "Vérifier les offres" },
    { to: "suivi", label: "Signalements ouverts" },
    { to: "candidatures", label: "Candidatures" },
    { to: "formations", label: "Formations" },
    { to: "communication", label: "Messagerie", data: { onglet: "Messagerie" } },
  ],
};

function IconRail({ espace, active, onNavigate = () => {}, badges = {}, taches = 0 }) {
  const raccourcis = RAIL_ICONS.map((icone, i) => {
    const r = (RACCOURCIS_PAR_ESPACE[espace] || [])[i];
    if (!r) return null;
    const compteur = r.creer ? 0 : r.to === "dashboard" ? taches : badges[r.to] || 0;
    return {
      icone,
      label: r.label,
      // Une seule icône active par écran : celle de la vue (pas l’action « créer »).
      actif: !r.creer && r.to === active && !(RACCOURCIS_PAR_ESPACE[espace] || []).slice(0, i).some((p) => p && !p.creer && p.to === active),
      compteur,
      onClick: () => onNavigate(r.to, r.creer ? { creer: true } : r.data),
    };
  }).filter(Boolean);
  return <App.BarreIcones elements={raccourcis} />;
}

const toElementsMenu = (navItems) => navItems.map((n) => ({ id: n.id, label: n.label, icone: n.icon, section: n.section }));

const LogoMenu = () => (
  <a href={SITE_URL} aria-label="LIGGEEY, retour au site" title="Retour au site" className="inline-flex">
    <Logo color={COLORS.onDark} iconColor={COLORS.orange} height={26} />
  </a>
);
const LogoMenuReduit = () => (
  <a href={SITE_URL} aria-label="LIGGEEY, retour au site" title="Retour au site" className="inline-flex">
    <Logo iconOnly color={COLORS.orange} height={26} />
  </a>
);

/* Encart du bas du menu : formule en cours, invitation à passer à la formule supérieure. */
function EncartFormule({ onNavigate }) {
  const planApi = usePlan();
  const currentPlan = planApi && !planApi.isAdmin ? planApi.plan : null;
  if (!currentPlan) return null;
  const upgradeTo = planApi.nextPlan();
  return (
    <div className="rounded-lg border border-sur-sombre bg-sombre-doux p-4 text-center">
      <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-marque text-sur-marque" aria-hidden="true">
        <Crown size={20} />
      </span>
      <p className="text-sm font-semibold text-sur-sombre">Formule {currentPlan.nom}</p>
      <p className="mb-3 mt-1 text-xs text-sur-sombre-secondaire">
        {upgradeTo ? `Passez ${upgradeTo.nom} pour être vu en priorité par les recruteurs.` : "Toutes les fonctions sont ouvertes."}
      </p>
      <App.Bouton petit pleineLargeur variante={upgradeTo ? "principal" : "clair"} onClick={() => onNavigate("abonnement")}>
        {upgradeTo ? `Passer ${upgradeTo.nom}` : "Gérer ma formule"}
      </App.Bouton>
    </div>
  );
}

function Sidebar({ navItems, active, onNavigate, badges = {}, replie = false }) {
  return (
    <App.BarreLaterale
      elements={toElementsMenu(navItems)}
      actif={active}
      onNaviguer={onNavigate}
      compteurs={badges}
      replie={replie}
      logo={<LogoMenu />}
      logoReduit={<LogoMenuReduit />}
      encart={<EncartFormule onNavigate={onNavigate} />}
    />
  );
}

function Breadcrumb({ items, onNavigate, title }) {
  return <App.EnTetePage titre={title || items[items.length - 1]?.label} filAriane={items} onNaviguer={onNavigate} />;
}

function AppShell({ espace, navItems, active, onNavigate, user, breadcrumb, badges, todos = [], children }) {
  const mainRef = useRef(null);
  // Remonte en haut de page dès que l’écran (ou une vue détail) change.
  useEffect(() => {
    const el = mainRef.current;
    if (!el || typeof MutationObserver === "undefined") return undefined;
    let last = el.querySelector("h2")?.textContent;
    const obs = new MutationObserver(() => {
      const t = el.querySelector("h2")?.textContent;
      if (t !== last) {
        last = t;
        window.scrollTo(0, 0);
      }
    });
    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  const serveur = React.useContext(ServeurContext);
  const estAdmin = espace === "admin";
  const avecAbonnement = navItems.some((n) => n.id === "abonnement");
  const prenom = user.name.split(" ")[0];
  const menuCompte = [
    !estAdmin && { label: "Mon profil", icone: UserCircle2, onClick: () => onNavigate("profil") },
    avecAbonnement && { label: "Abonnement", icone: Crown, onClick: () => onNavigate("abonnement") },
    estAdmin && { label: "Paramètres", icone: Settings, onClick: () => onNavigate("parametres") },
    serveur
      ? { label: "Se déconnecter", icone: LogOut, onClick: serveur.onDeconnexion }
      : { label: "Changer d’espace", icone: ArrowLeft, onClick: () => onNavigate("login") },
    { label: "Retour au site", icone: Home, href: SITE_URL },
  ].filter(Boolean);
  const notifications = todos.map((t, i) => ({
    id: `${t.to}-${i}`,
    titre: t.label,
    icone: t.icon,
    urgent: t.urgent,
    onClick: () => onNavigate(t.to, t.data),
  }));

  return (
    <App.Coquille
      elements={toElementsMenu(navItems)}
      actif={active}
      onNaviguer={onNavigate}
      compteurs={badges}
      rail={<IconRail espace={espace} active={active} onNavigate={onNavigate} badges={badges} taches={todos.length} />}
      logo={<LogoMenu />}
      logoReduit={<LogoMenuReduit />}
      encart={<EncartFormule onNavigate={onNavigate} />}
      salutation={estAdmin ? "Bonjour !" : `Bonjour, ${prenom} !`}
      notifications={notifications}
      utilisateur={{ nom: user.name, role: user.role }}
      menuUtilisateur={menuCompte}
      titre={breadcrumb[breadcrumb.length - 1]?.label}
      filAriane={breadcrumb}
      contenuRef={mainRef}
    >
      {children}
    </App.Coquille>
  );
}

/* ----- Bloc « À faire » affiché en haut de chaque tableau de bord ----- */

function TodoPanel({ items, onNavigate }) {
  if (!items || items.length === 0) return null;
  return (
    <App.Carte titre="À faire maintenant" sousTitre={`${items.length} ${items.length > 1 ? "actions" : "action"} en attente`} flush className="mb-6">
      <ul className="px-3 pb-3">
        {items.map((it) => (
          <li key={it.label}>
            <button type="button" onClick={() => onNavigate(it.to, it.data)} className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-doux">
              <span className="flex min-w-0 items-center gap-3">
                <App.PastilleIcone icone={it.icon || AlertCircle} ton={it.urgent ? "danger" : "marque"} taille="sm" />
                <span className="text-sm text-principal">{it.label}</span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-discret" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </App.Carte>
  );
}

/* ---------- Screen 5 : Dashboard (Chercheur d’emploi) ---------- */

function StatCard({ icon, value, label, detail, tone = "marque", onClick }) {
  return <App.CarteStat icone={icon} ton={tone} titre={label} detail={detail} valeur={value} onClick={onClick} />;
}

/* Ton de badge de chaque statut (App.Badge : succes, alerte, danger, info, marque, neutre). */
const STATUT_TONS = {
  "Entretien programmé": "marque",
  "Vue par le recruteur": "alerte",
  "Réponse négative": "danger",
  "Candidature reçue": "alerte",
  "Candidature retenue": "succes",
  "En attente": "alerte",
  "Payé": "succes",
  "Refusé": "danger",
  "Refusée": "danger",
  "Acceptée": "succes",
  "En cours": "marque",
  "Terminée": "neutre",
  "Nouveau": "info",
  "Retenu": "succes",
  "Rejeté": "danger",
  "Disponible": "succes",
  "Occupé": "marque",
  "Vérifié": "succes",
  "Validé": "succes",
  "Suspendu": "danger",
  "Suspendue": "danger",
  "Actif": "succes",
  "Active": "succes",
  "En pause": "alerte",
  "Complète": "neutre",
  "Brouillon": "neutre",
  "Expirée": "neutre",
  "Inactif": "neutre",
  "Annulée": "danger",
  "Annulé": "danger",
  "En cours d’apprentissage": "marque",
  "Apprenant": "marque",
  "Mentoré": "marque",
  "Remboursé": "neutre",
  "Fait": "succes",
  "À compléter": "alerte",
  "À venir": "neutre",
  "En période d’essai": "marque",
  "À risque": "danger",
  "Confirmé": "succes",
  "Ouvert": "info",
  "Traité": "succes",
  "En vérification": "alerte",
  "Échoué": "danger",
  "Échec de paiement": "danger",
  // Cap Métier et mentorat
  "Accord parental en attente": "alerte",
  "Accord en attente": "alerte",
  "Accord confirmé": "succes",
  "Mentor à attribuer": "info",
  "Accompagné": "marque",
  "Projet prêt": "succes",
  "Demandée": "alerte",
  "Confirmée": "succes",
  "Signée": "succes",
};

function StatusBadge({ status }) {
  return <App.Badge ton={STATUT_TONS[status] || "neutre"} taille="moyen">{status}</App.Badge>;
}


function DashboardScreen({ user, onNavigate, todos }) {
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const [coachings] = useStore("coachings-c", {});
  const mentor = MENTORS[0];
  const prochainCoaching = (coachings[mentor.id] || defaultCoachings(mentor)).upcoming[0];
  const enAttente = candidatures.filter((c) => c.statut === "Candidature reçue" || c.statut === "Vue par le recruteur").length;
  const entretiens = candidatures.filter((c) => c.statut === "Entretien programmé").length;
  const COMPLETION = useCompletionChercheur().valeur;

  /* Où en sont les candidatures : part de chaque statut */
  const parStatut = Object.entries(candidatures.reduce((acc, c) => ({ ...acc, [c.statut]: (acc[c.statut] || 0) + 1 }), {}))
    .sort((x, y) => y[1] - x[1])
    .map(([statut, n]) => ({
      id: statut,
      libelle: statut,
      pourcentage: Math.round((n / candidatures.length) * 100),
      valeur: `${n} ${n > 1 ? "candidatures" : "candidature"}`,
      visuel: <App.PastilleIcone icone={ClipboardList} ton={STATUT_TONS[statut] || "neutre"} taille="sm" />,
    }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Voici un aperçu de votre recherche d’emploi et de votre nouveau poste.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} value={candidatures.length} label="Candidatures envoyées" detail="Depuis votre inscription" onClick={() => onNavigate("candidatures")} />
        <StatCard icon={CalendarCheck} value={entretiens} label="Entretiens programmés" detail={entretiens ? "Préparez-vous avec votre mentor" : "Aucun pour le moment"} tone="info" />
        <StatCard icon={Clock} value={enAttente} label="En attente de retour" detail="Les recruteurs répondent sous 15 jours" tone="alerte" />
        <App.CarteStat
          icone={UserCircle2}
          ton="succes"
          titre="Profil complété"
          detail="Un profil complet est vu plus souvent"
          valeur={`${COMPLETION} %`}
          visuel={<App.Anneau valeur={COMPLETION} taille={56} epaisseur={6} label={`Profil complété à ${COMPLETION} %`}>{" "}</App.Anneau>}
          onClick={() => onNavigate("profil")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte
          titre="Candidatures récentes"
          className="xl:col-span-2"
          actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("candidatures")}>Tout voir</App.Bouton>}
        >
          <App.Tableau
            legende="Candidatures récentes"
            cleLigne="poste"
            lignes={candidatures.slice(0, 5)}
            onLigne={() => onNavigate("candidatures")}
            colonnes={[
              { cle: "poste", titre: "Poste", rendu: (c) => <App.CelluleIdentite visuel={<App.Avatar nom={c.entreprise} taille="sm" ton="neutre" />} titre={c.poste} sousTitre={c.entreprise} /> },
              { cle: "ville", titre: "Ville" },
              { cle: "date", titre: "Envoyée le", masqueMobile: true },
              { cle: "statut", titre: "Statut", rendu: (c) => <StatusBadge status={c.statut} /> },
            ]}
          />
        </App.Carte>

        <App.Carte titre="Mon mentor">
          <div className="flex flex-col items-center text-center">
            <SafeImg src={mentor.photo} alt={mentor.nom} className="mb-3 h-20 w-20 rounded-full object-cover" />
            <p className="font-semibold text-principal">{mentor.nom}</p>
            <p className="text-sm text-discret">{mentor.role}</p>
          </div>
          <div className="my-5 flex items-center gap-3 rounded-md bg-doux px-4 py-3.5 text-sm">
            <App.PastilleIcone icone={CalendarDays} taille="sm" />
            <span className="min-w-0">
              <span className="block text-xs text-discret">Prochain coaching</span>
              <span className="block font-semibold text-principal">{prochainCoaching ? prochainCoaching.date : "Aucun coaching prévu"}</span>
            </span>
          </div>
          <App.Bouton pleineLargeur variante="neutre" onClick={() => onNavigate("mentors", { mentorId: mentor.id })}>
            Voir mon mentor
          </App.Bouton>
        </App.Carte>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte titre="Où en sont mes candidatures" sousTitre="Répartition par statut" className="xl:col-span-2">
          <App.ListeClassee elements={parStatut} />
        </App.Carte>
        <TodoPanel items={todos} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

/* ---------- Screen 6 : Offres d’emploi ---------- */

const OFFRES_DATA = [
  {
    titre: "Développeur full stack",
    contrat: "CDI",
    entreprise: "Sonatel",
    secteur: "Télécommunications",
    localisation: "Dakar, Plateau",
    experience: "2-5 ans",
    publieeLe: "2026-10-13",
    dateLimite: "15 novembre 2026",
    description:
      "Vous serez en charge du développement des applications web de l’entreprise, en utilisant des technologies modernes telles que React, Node.js et MongoDB. Vous travaillerez en équipe pour concevoir des interfaces utilisateur fluides et des backends robustes.",
    missions: [
      "Développer de nouvelles fonctionnalités, de l’interface jusqu’à l’API.",
      "Relire le code de l’équipe et écrire des tests.",
      "Participer aux choix techniques avec le responsable produit.",
    ],
    competences: ["React", "Node.js", "MongoDB"],
  },
  {
    titre: "Chargée de clientèle",
    contrat: "CDD",
    entreprise: "Banque Atlantique",
    secteur: "Finance et banque",
    localisation: "Dakar",
    experience: "1-2 ans",
    publieeLe: "2026-10-12",
    dateLimite: "31 octobre 2026",
    description:
      "Vous accueillez, conseillez et fidélisez un portefeuille de clients particuliers, en veillant à la qualité de service et à l’atteinte des objectifs commerciaux de l’agence.",
    missions: [
      "Accueillir et conseiller les clients de l’agence.",
      "Présenter les produits adaptés à chaque besoin.",
      "Suivre votre portefeuille et vos objectifs commerciaux.",
    ],
    competences: ["Relation client", "Vente", "Sens du service"],
  },
  {
    titre: "Assistante comptable",
    contrat: "CDI",
    entreprise: "Teranga Capital",
    secteur: "Investissement",
    localisation: "Dakar",
    experience: "1-2 ans",
    publieeLe: "2026-10-09",
    dateLimite: "10 novembre 2026",
    description:
      "Vous assurez la saisie comptable, le suivi des factures fournisseurs/clients et participez à la préparation des clôtures mensuelles sous la supervision du responsable financier.",
    missions: [
      "Saisir les écritures comptables courantes.",
      "Suivre les factures des clients et des fournisseurs.",
      "Préparer les clôtures mensuelles avec le responsable financier.",
    ],
    competences: ["Comptabilité", "Excel", "Rigueur"],
  },
  {
    titre: "Responsable marketing digital",
    contrat: "CDI",
    entreprise: "Wave Mobile",
    secteur: "Fintech",
    localisation: "Dakar",
    experience: "5-10 ans",
    publieeLe: "2026-10-07",
    dateLimite: "7 novembre 2026",
    description:
      "Vous définissez et pilotez la stratégie d’acquisition digitale (SEO, SEA, réseaux sociaux) et analysez la performance des campagnes pour optimiser le coût d’acquisition.",
    missions: [
      "Construire le plan d’acquisition digitale.",
      "Piloter les campagnes et le budget associé.",
      "Mesurer les résultats et proposer des améliorations.",
    ],
    competences: ["SEO/SEA", "Réseaux sociaux", "Analytics"],
  },
  {
    titre: "Ingénieur réseau",
    contrat: "Stage",
    entreprise: "Expresso Sénégal",
    secteur: "Télécommunications",
    localisation: "Dakar",
    experience: "Débutant",
    publieeLe: "2026-10-05",
    dateLimite: "30 octobre 2026",
    description:
      "Vous participez à la supervision et à l’optimisation de l’infrastructure réseau, sous l’encadrement de l’équipe technique.",
    missions: [
      "Surveiller l’état du réseau et signaler les incidents.",
      "Participer aux interventions de maintenance.",
      "Documenter les procédures avec l’équipe technique.",
    ],
    competences: ["Réseaux", "Supervision", "Dépannage"],
  },
  {
    titre: "Chef de projet IT",
    contrat: "CDI",
    entreprise: "Atos Sénégal",
    secteur: "Consulting IT",
    localisation: "Dakar",
    experience: "5-10 ans",
    publieeLe: "2026-10-01",
    dateLimite: "1er novembre 2026",
    description:
      "Vous pilotez des projets d’intégration IT pour des clients grands comptes, de la phase de cadrage jusqu’à la mise en production.",
    missions: [
      "Cadrer les besoins avec le client.",
      "Planifier le projet et coordonner l’équipe.",
      "Suivre les délais, le budget et la mise en production.",
    ],
    competences: ["Gestion de projet", "Agile", "Relation client"],
  },
  {
    titre: "Community manager",
    contrat: "CDD",
    entreprise: "Jumia Sénégal",
    secteur: "E-commerce",
    localisation: "Dakar",
    experience: "1-2 ans",
    publieeLe: "2026-09-28",
    dateLimite: "28 octobre 2026",
    description:
      "Vous animez les réseaux sociaux de la marque, créez du contenu engageant et suivez les indicateurs de performance des publications.",
    missions: [
      "Publier et animer les réseaux sociaux de la marque.",
      "Créer les visuels et les textes des publications.",
      "Suivre les résultats et répondre à la communauté.",
    ],
    competences: ["Réseaux sociaux", "Création de contenu", "Reporting"],
  },
];

/* Offres d’emploi (modèle JobStock) : liste en cartes horizontales, filtres, offres sauvegardées,
   et fiche détail en page (en-tête, description, aperçu de l’offre, candidature, offres similaires). */

const sansAccents = (t) => String(t ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const cleOffre = (o) => `${o.titre}|${o.entreprise}`;
const initialesEntreprise = (nom) => nom.split(/\s+/).map((m) => m[0]).join("").slice(0, 2).toUpperCase();

function publieeIlYa(iso) {
  if (!iso) return null;
  const j = joursDepuis(iso);
  if (j === 0) return "Publiée aujourd’hui";
  if (j === 1) return "Publiée hier";
  return `Publiée il y a ${j} jours`;
}

function LogoEntreprise({ nom, taille = "md" }) {
  const dims = taille === "lg" ? "h-16 w-16 text-xl" : "h-12 w-12 text-base";
  return (
    <span className={`grid shrink-0 place-items-center rounded-lg bg-sombre-doux font-semibold text-sur-sombre ${dims}`} aria-hidden="true">
      {initialesEntreprise(nom)}
    </span>
  );
}

/* Méta-informations sur une ligne : icône discrète + texte. */
function MetaOffre({ icone: Icone, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-secondaire">
      <Icone size={14} className="shrink-0 text-discret" aria-hidden="true" />
      {children}
    </span>
  );
}

function BoutonSauvegarde({ saved, onToggle, titre }) {
  const Icone = saved ? BookmarkCheck : Bookmark;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
      aria-pressed={!!saved}
      aria-label={saved ? `Retirer « ${titre} » des offres sauvegardées` : `Sauvegarder « ${titre} »`}
      title={saved ? "Retirer des offres sauvegardées" : "Sauvegarder"}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${saved ? "border-marque bg-marque-doux text-marque-fort" : "border-base text-secondaire hover:border-forte hover:text-principal"}`}
    >
      <Icone size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

/* Pièces communes des listes et des fiches (offres, formations, mentors), sur le modèle JobStock :
   barre de filtres, compteur de résultats, en-tête de fiche, colonne « Aperçu », listes à coches et étiquettes. */

function BoutonRetour({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-secondaire hover:text-principal">
      <ArrowLeft size={15} aria-hidden="true" /> {children}
    </button>
  );
}

function BarreFiltres({ label, children }) {
  return (
    <section className="rounded-lg border border-base bg-surface p-4" aria-label={label}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">{children}</div>
    </section>
  );
}

function CompteResultats({ n, nom, feminin = false }) {
  const pluriel = n > 1 ? "s" : "";
  return (
    <p className="text-sm text-secondaire" aria-live="polite">
      <span className="font-semibold text-principal">{n}</span> {nom}{pluriel} trouvé{feminin ? "e" : ""}{pluriel}
    </p>
  );
}

function EnTeteFiche({ visuel, badges, titre, sousTitre, meta, actions }) {
  return (
    <section className="overflow-hidden rounded-lg border border-base bg-surface">
      <div className="h-2 bg-marque" aria-hidden="true" />
      <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {visuel}
          <div className="min-w-0">
            {badges && <div className="mb-2 flex flex-wrap items-center gap-2">{badges}</div>}
            <h2 className="text-xl font-semibold leading-snug text-principal sm:text-2xl">{titre}</h2>
            {sousTitre && <p className="mt-0.5 text-secondaire">{sousTitre}</p>}
            {meta && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">{meta}</div>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </section>
  );
}

/* Fiche en deux colonnes : contenu principal, colonne latérale (aperçu, actions). */
function MiseEnPageFiche({ principal, cote }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-6">{principal}</div>
      <aside className="space-y-6">{cote}</aside>
    </div>
  );
}

/* Carte « Aperçu » : icône sur pastille, intitulé, valeur. items : [{ icone, libelle, valeur }] */
function ApercuFiche({ titre, items }) {
  return (
    <App.Carte titre={titre}>
      <dl className="space-y-4">
        {items.filter((i) => i.valeur !== undefined && i.valeur !== null && i.valeur !== "").map(({ icone, libelle, valeur }) => (
          <div key={libelle} className="flex items-start gap-3">
            <App.PastilleIcone icone={icone} ton="marque" forme="carre" />
            <div className="min-w-0">
              <dt className="text-xs font-medium text-discret">{libelle}</dt>
              <dd className="text-sm font-semibold text-principal">{valeur}</dd>
            </div>
          </div>
        ))}
      </dl>
    </App.Carte>
  );
}

function ListeCoches({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((m) => (
        <li key={m} className="flex items-start gap-3 text-[15px] leading-[1.6] text-secondaire">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-marque-doux text-marque-fort" aria-hidden="true">
            <Check size={12} strokeWidth={2.5} />
          </span>
          {m}
        </li>
      ))}
    </ul>
  );
}

function Etiquettes({ items, max }) {
  const visibles = max ? items.slice(0, max) : items;
  const reste = items.length - visibles.length;
  return (
    <ul className="flex flex-wrap gap-2">
      {visibles.map((c) => (
        <li key={c} className="rounded-full bg-doux px-3 py-1.5 text-[13px] font-medium text-principal">{c}</li>
      ))}
      {reste > 0 && <li className="rounded-full px-2 py-1.5 text-[13px] font-medium text-discret">+{reste}</li>}
    </ul>
  );
}

const ELEMENTS_PAR_PAGE = 5;

/* Pagination des listes : 5 éléments par page ; la page revient dans les bornes quand les filtres réduisent la liste. */
function usePaginationListe(items, parPage = ELEMENTS_PAR_PAGE) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / parPage));
  const courante = Math.min(page, pages);
  return { page: courante, setPage, parPage, total: items.length, paged: items.slice((courante - 1) * parPage, courante * parPage) };
}

function PiedListe({ pagination: p }) {
  if (p.total <= p.parPage) return null;
  return <Pagination page={p.page} pageSize={p.parPage} totalItems={p.total} onPageChange={p.setPage} />;
}

function ListeVide({ icone = Search, titre, texte, action }) {
  return (
    <div className="rounded-lg border border-base bg-surface">
      <App.EtatVide icone={icone} titre={titre} texte={texte} action={action} />
    </div>
  );
}

/* Carte horizontale des listes : visuel, titre et badges, sous-titre, informations, contenu libre, actions à droite.
   Toute la carte ouvre la fiche (onOpen) ; les actions de droite ne la déclenchent pas. */
function CarteListe({ visuel, titre, badges, sousTitre, meta, children, aside, actions, onOpen, accent = false }) {
  return (
    <article
      onClick={onOpen}
      className={`group flex flex-col gap-4 rounded-lg border bg-surface p-5 transition-shadow hover:shadow-carte sm:flex-row sm:items-center ${onOpen ? "cursor-pointer" : ""} ${accent ? "border-marque" : "border-base"}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {visuel}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-base font-semibold text-principal ${onOpen ? "group-hover:text-marque" : ""}`}>{titre}</h3>
            {badges}
          </div>
          {sousTitre && <p className="mt-0.5 text-sm text-secondaire">{sousTitre}</p>}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">{meta}</div>}
          {children}
        </div>
      </div>
      {(aside || actions) && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-base pt-4 sm:border-0 sm:pt-0" onClick={(e) => e.stopPropagation()}>
          {aside}
          {actions}
        </div>
      )}
    </article>
  );
}

function VisuelIcone({ icone: Icone, taille = "md" }) {
  const dims = taille === "lg" ? "h-16 w-16" : "h-12 w-12";
  return (
    <span className={`grid shrink-0 place-items-center rounded-lg bg-marque-doux text-marque-fort ${dims}`} aria-hidden="true">
      <Icone size={taille === "lg" ? 28 : 22} strokeWidth={1.75} />
    </span>
  );
}

function AvatarListe({ nom, photo, taille = "md" }) {
  const dims = taille === "lg" ? "h-16 w-16" : "h-12 w-12";
  return <SafeImg src={photo} alt={nom} className={`${dims} shrink-0 rounded-full object-cover`} />;
}

/* Pavé de date (jour + mois), pour les ateliers et les séances. */
function VisuelDate({ iso, taille = "md" }) {
  const d = new Date(`${iso}T00:00:00`);
  const dims = taille === "lg" ? "h-16 w-16" : "h-12 w-12";
  return (
    <span className={`flex shrink-0 flex-col items-center justify-center rounded-lg bg-marque-doux text-marque-fort ${dims}`} aria-hidden="true">
      <span className={`font-semibold leading-none ${taille === "lg" ? "text-2xl" : "text-lg"}`}>{d.getDate()}</span>
      <span className="mt-0.5 text-[11px] font-semibold uppercase">{d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}</span>
    </span>
  );
}

/* Avis clients : auteur, note, date, commentaire. avis : [{ auteur, note, date?, commentaire }] */
function ListeAvis({ avis, vide = "Aucun avis pour le moment." }) {
  if (!avis.length) return <p className="text-sm text-secondaire">{vide}</p>;
  return (
    <ul className="divide-y divide-base">
      {avis.map((a, i) => (
        <li key={i} className="flex gap-3 py-4 first:pt-0 last:pb-0">
          <SafeImg alt={a.auteur} className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-principal">{a.auteur}</p>
              {a.date && <span className="text-xs text-discret">{a.date}</span>}
            </div>
            <Stars note={a.note} size={12} />
            <p className="mt-1 text-sm text-secondaire">{a.commentaire}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* Parcours professionnel en frise. etapes : [{ poste, structure, periode, description }] */
function FriseParcours({ etapes }) {
  return (
    <ol>
      {etapes.map((p, i) => (
        <li key={i} className="flex gap-3 pb-5 last:pb-0">
          <div className="flex flex-col items-center">
            <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-marque" : "bg-doux-fort"}`} />
            {i < etapes.length - 1 && <div className="mt-1 w-px flex-1 bg-doux-fort" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-principal">{p.poste}{p.structure ? ` · ${p.structure}` : ""}</p>
            <p className="mb-1 text-xs text-discret">{p.periode}</p>
            <p className="text-sm text-secondaire">{p.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function OfferCard({ offre, onOpen, applied, saved, onToggleSave }) {
  const publiee = publieeIlYa(offre.publieeLe);
  return (
    <article
      onClick={() => onOpen(offre)}
      className="group flex cursor-pointer flex-col gap-4 rounded-lg border border-base bg-surface p-5 transition-shadow hover:shadow-carte sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <LogoEntreprise nom={offre.entreprise} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-principal group-hover:text-marque">{offre.titre}</h3>
            {offre.sponsorisee && <PremiumChip label="Sponsorisée" />}
          </div>
          <p className="mt-0.5 text-sm text-secondaire">{offre.entreprise} · {offre.secteur}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <App.Badge ton="info" taille="moyen">{offre.contrat}</App.Badge>
            <MetaOffre icone={MapPin}>{offre.localisation}</MetaOffre>
            {offre.experience && <MetaOffre icone={Briefcase}>{offre.experience}</MetaOffre>}
            {publiee && <MetaOffre icone={Clock}>{publiee}</MetaOffre>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-base pt-4 sm:border-0 sm:pt-0">
        {applied && <App.Badge ton="succes" point taille="moyen" className="mr-auto sm:mr-1">Déjà postulé</App.Badge>}
        {onToggleSave && <BoutonSauvegarde saved={saved} onToggle={onToggleSave} titre={offre.titre} />}
        <App.Bouton
          petit
          variante={applied ? "neutre" : "principal"}
          onClick={(e) => { e.stopPropagation(); onOpen(offre); }}
          aria-label={`Voir l’offre : ${offre.titre}`}
          className={applied ? "" : "ml-auto sm:ml-0"}
        >
          Voir l’offre
        </App.Bouton>
      </div>
    </article>
  );
}

/* Candidature à une offre : quota du profil, enregistrement dans « Mes candidatures ». */
function usePostuler(offre) {
  const planApi = usePlan();
  const [candidatures, setCandidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const existing = offre ? candidatures.find((c) => c.poste === offre.titre && c.entreprise === offre.entreprise) : null;
  const restantes = planApi ? planApi.remaining("candidatures") : UNLIMITED;
  function postuler() {
    if (!offre || existing) return;
    if (planApi && restantes <= 0) { planApi.requestUpgrade("candidatures"); return; }
    if (planApi) planApi.consume("candidatures");
    setCandidatures((l) => [{ id: `cand-${Date.now()}`, poste: offre.titre, entreprise: offre.entreprise, ville: offre.localisation.split(",")[0], date: frLongDate(demoNow()), statut: "Candidature reçue", step: 1 }, ...l]);
    notify("Candidature envoyée. Retrouvez-la dans « Mes candidatures ».");
  }
  return { existing, restantes, planApi, postuler };
}

function messagePartageOffre(o) {
  return `Offre vérifiée sur LIGGEEY : ${o.titre} chez ${o.entreprise} (${o.localisation}). Créez votre compte pour postuler.`;
}

function OffreDetail({ offre, similaires = [], onOpen, onBack, onNavigate, saved, onToggleSave }) {
  const { existing, restantes, planApi, postuler } = usePostuler(offre);
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const publiee = publieeIlYa(offre.publieeLe);
  const apercu = [
    { icone: CalendarDays, libelle: "Date de publication", valeur: offre.publieeLe && frLongDate(new Date(`${offre.publieeLe}T00:00:00`)) },
    { icone: MapPin, libelle: "Lieu", valeur: offre.localisation },
    { icone: FileText, libelle: "Type de contrat", valeur: offre.contrat },
    { icone: Layers, libelle: "Secteur", valeur: offre.secteur },
    { icone: TrendingUp, libelle: "Expérience", valeur: offre.experience },
    { icone: Wallet, libelle: "Salaire", valeur: offre.salaire },
    { icone: Clock, libelle: "Date limite", valeur: offre.dateLimite },
  ].filter((i) => i.valeur);

  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux offres</BoutonRetour>

      <EnTeteFiche
        visuel={<LogoEntreprise nom={offre.entreprise} taille="lg" />}
        badges={<>
          <App.Badge ton="succes" taille="moyen"><BadgeCheck size={13} aria-hidden="true" /> Offre vérifiée</App.Badge>
          {offre.sponsorisee && <PremiumChip label="Sponsorisée" />}
        </>}
        titre={offre.titre}
        sousTitre={`${offre.entreprise} · ${offre.secteur}`}
        meta={<>
          <App.Badge ton="info" taille="moyen">{offre.contrat}</App.Badge>
          <MetaOffre icone={MapPin}>{offre.localisation}</MetaOffre>
          {offre.experience && <MetaOffre icone={Briefcase}>{offre.experience}</MetaOffre>}
          {publiee && <MetaOffre icone={Clock}>{publiee}</MetaOffre>}
        </>}
        actions={<>
          {existing ? (
            <StatusBadge status={existing.statut} />
          ) : (
            <App.Bouton onClick={postuler}>
              <Send size={16} aria-hidden="true" /> Postuler
            </App.Bouton>
          )}
          <BoutonSauvegarde saved={saved} onToggle={onToggleSave} titre={offre.titre} />
          <a
            href={lienPartageWhatsApp(messagePartageOffre(offre))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Partager « ${offre.titre} » sur WhatsApp`}
            title="Partager sur WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-base text-secondaire transition-colors hover:border-forte hover:text-principal"
          >
            <Share2 size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Contenu de l’offre */}
        <div className="space-y-6">
          <App.Carte titre="Description du poste">
            <p className="text-[15px] leading-[1.7] text-secondaire">{offre.description}</p>
          </App.Carte>

          {offre.missions?.length > 0 && (
            <App.Carte titre="Vos missions">
              <ListeCoches items={offre.missions} />
            </App.Carte>
          )}

          {offre.competences?.length > 0 && (
            <App.Carte titre="Compétences recherchées">
              <Etiquettes items={offre.competences} />
            </App.Carte>
          )}
        </div>

        {/* Colonne latérale */}
        <aside className="space-y-6">
          <ApercuFiche titre="Aperçu de l’offre" items={apercu} />

          <App.Carte titre="Votre candidature">
            {existing ? (
              <div className="space-y-4">
                <p className="text-sm text-secondaire">Vous avez postulé le {existing.date}. Nous vous informons à chaque étape.</p>
                <StatusBadge status={existing.statut} />
                {onNavigate && (
                  <App.Bouton pleineLargeur variante="neutre" onClick={() => onNavigate("candidatures")}>Suivre ma candidature</App.Bouton>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-secondaire">Votre profil LIGGEEY est transmis au recruteur. Vous suivez chaque étape dans « Mes candidatures ».</p>
                {restantes !== UNLIMITED && (
                  <p className={`text-sm ${restantes > 0 ? "text-discret" : "text-statut-danger"}`}>
                    {restantes > 0
                      ? `Il vous reste ${restantes} candidature${restantes > 1 ? "s" : ""} ce mois-ci avec la formule ${planApi.plan.nom}.`
                      : `Vous avez utilisé toutes vos candidatures du mois avec la formule ${planApi.plan.nom}.`}
                  </p>
                )}
                <App.Bouton pleineLargeur onClick={postuler}>
                  <Send size={16} aria-hidden="true" /> Postuler à cette offre
                </App.Bouton>
              </div>
            )}
          </App.Carte>

          <App.Carte titre="L’entreprise">
            <div className="flex items-center gap-3">
              <LogoEntreprise nom={offre.entreprise} />
              <div className="min-w-0">
                <p className="font-semibold text-principal">{offre.entreprise}</p>
                <p className="text-sm text-discret">{offre.secteur}</p>
              </div>
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-md bg-marque-doux px-3 py-2.5 text-sm text-principal">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-marque" aria-hidden="true" />
              Entreprise et offre vérifiées par l’équipe LIGGEEY.
            </p>
          </App.Carte>
        </aside>
      </div>

      {similaires.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-principal">Offres similaires</h2>
          <div className="space-y-4">
            {similaires.map((o) => (
              <OfferCard key={cleOffre(o)} offre={o} onOpen={onOpen} applied={candidatures.some((c) => c.poste === o.titre && c.entreprise === o.entreprise)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: COLORS.slateLight }}>{label}</p>
      <p className="text-sm" style={{ color: COLORS.slate }}>{value}</p>
    </div>
  );
}

const PAGE_SIZE = 6;
const OFFRES_PAR_PAGE = 5;

function OffresScreen({ extraOffres = [], onNavigate }) {
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const [sauvegardees, setSauvegardees] = useStore("offres-sauvegardees", []);
  const ALL_OFFRES = [...extraOffres, ...OFFRES_DATA];
  const [query, setQuery] = useState("");
  const [secteur, setSecteur] = useState("tous");
  const [contrat, setContrat] = useState("tous");
  const [vue, setVue] = useState("toutes");
  const [selectedKey, setSelectedKey] = useState(null);
  const [page, setPage] = useState(1);

  const secteurs = Array.from(new Set(ALL_OFFRES.map((o) => o.secteur))).sort();
  const contrats = Array.from(new Set(ALL_OFFRES.map((o) => o.contrat)));
  const aPostule = (o) => candidatures.some((c) => c.poste === o.titre && c.entreprise === o.entreprise);
  const estSauvegardee = (o) => sauvegardees.includes(cleOffre(o));
  const basculer = (o) => {
    const k = cleOffre(o);
    const deja = sauvegardees.includes(k);
    setSauvegardees(deja ? sauvegardees.filter((x) => x !== k) : [...sauvegardees, k]);
    notify(deja ? "Offre retirée de vos offres sauvegardées." : "Offre sauvegardée.", deja ? "info" : "success");
  };

  const q = sansAccents(query.trim());
  const filtered = ALL_OFFRES
    .filter((o) =>
      (!q || sansAccents([o.titre, o.entreprise, o.secteur, o.localisation, ...(o.competences || [])].join(" ")).includes(q)) &&
      (secteur === "tous" || o.secteur === secteur) &&
      (contrat === "tous" || o.contrat === contrat) &&
      (vue === "toutes" || estSauvegardee(o)))
    // Sponsorisées en tête, puis les plus récentes (les offres publiées par l’entreprise n’ont pas de date : en tête)
    .sort((a, b) => (b.sponsorisee ? 1 : 0) - (a.sponsorisee ? 1 : 0) || (b.publieeLe || "9999").localeCompare(a.publieeLe || "9999"));
  const pages = Math.max(1, Math.ceil(filtered.length / OFFRES_PAR_PAGE));
  const pageCourante = Math.min(page, pages);
  const paged = filtered.slice((pageCourante - 1) * OFFRES_PAR_PAGE, pageCourante * OFFRES_PAR_PAGE);
  const filtresActifs = q || secteur !== "tous" || contrat !== "tous" || vue !== "toutes";
  const reinitialiser = () => { setQuery(""); setSecteur("tous"); setContrat("tous"); setVue("toutes"); setPage(1); };

  const selected = ALL_OFFRES.find((o) => cleOffre(o) === selectedKey);
  const ouvrir = (o) => { setSelectedKey(cleOffre(o)); window.scrollTo(0, 0); };

  if (selected) {
    const similaires = ALL_OFFRES
      .filter((o) => cleOffre(o) !== selectedKey && (o.secteur === selected.secteur || o.contrat === selected.contrat))
      .slice(0, 3);
    return (
      <OffreDetail
        key={selectedKey}
        offre={selected}
        similaires={similaires}
        onOpen={ouvrir}
        onBack={() => setSelectedKey(null)}
        onNavigate={onNavigate}
        saved={estSauvegardee(selected)}
        onToggleSave={() => basculer(selected)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">
        Toutes les offres sont vérifiées par l’équipe LIGGEEY. Chaque candidature reçoit un statut réel, mis à jour à chaque étape.
      </p>

      {/* Barre de recherche et filtres */}
      <BarreFiltres label="Rechercher et filtrer les offres">
          <App.ChampRecherche
            variante="carre"
            valeur={query}
            onChange={(v) => { setQuery(v); setPage(1); }}
            placeholder="Poste, entreprise, compétence ou ville…"
            label="Rechercher une offre d’emploi"
            className="w-full lg:flex-1"
          />
          <div className="flex flex-wrap items-center gap-2">
            <App.SelecteurPeriode
              icone={Layers}
              label="Secteur"
              valeur={secteur}
              onChange={(v) => { setSecteur(v); setPage(1); }}
              options={[{ id: "tous", label: "Tous les secteurs" }, ...secteurs]}
            />
            <App.SelecteurPeriode
              icone={FileText}
              label="Type de contrat"
              valeur={contrat}
              onChange={(v) => { setContrat(v); setPage(1); }}
              options={[{ id: "tous", label: "Tous les contrats" }, ...contrats]}
            />
          </div>
      </BarreFiltres>

      {/* Résultats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Afficher"
          actif={vue}
          onChange={(v) => { setVue(v); setPage(1); }}
          options={[
            { id: "toutes", label: `Toutes (${ALL_OFFRES.length})` },
            { id: "sauvegardees", label: `Sauvegardées (${sauvegardees.filter((k) => ALL_OFFRES.some((o) => cleOffre(o) === k)).length})` },
          ]}
        />
        <CompteResultats n={filtered.length} nom="offre" feminin />
      </div>

      {paged.length > 0 ? (
        <div className="space-y-4">
          {paged.map((o) => (
            <OfferCard key={cleOffre(o)} offre={o} onOpen={ouvrir} applied={aPostule(o)} saved={estSauvegardee(o)} onToggleSave={() => basculer(o)} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-base bg-surface">
          <App.EtatVide
            icone={vue === "sauvegardees" && !q ? Bookmark : Search}
            titre={vue === "sauvegardees" && !q ? "Aucune offre sauvegardée" : "Aucune offre ne correspond à votre recherche"}
            texte={vue === "sauvegardees" && !q ? "Touchez l’icône de signet sur une offre pour la retrouver ici." : "Essayez d’autres mots-clés ou retirez un filtre."}
            action={filtresActifs && <App.Bouton petit variante="neutre" onClick={reinitialiser}>Effacer les filtres</App.Bouton>}
          />
        </div>
      )}

      {filtered.length > OFFRES_PAR_PAGE && (
        <Pagination page={pageCourante} pageSize={OFFRES_PAR_PAGE} totalItems={filtered.length} onPageChange={setPage} />
      )}
    </div>
  );
}

/* ---------- Screen 7 : Mes candidatures ---------- */

const CANDIDATURES = [
  { id: "cand-sonatel", poste: "Chargée de clientèle", entreprise: "Sonatel", ville: "Dakar", date: "28 juillet 2026", statut: "Candidature retenue", step: 4, embauche: true },
  { poste: "Assistante comptable", entreprise: "Teranga Capital", ville: "Dakar", date: "22 juillet 2026", statut: "Vue par le recruteur", step: 2 },
  {
    poste: "Chargée de communication",
    entreprise: "Kirène",
    ville: "Thiès",
    date: "15 juillet 2026",
    statut: "Réponse négative",
    step: 4,
    negative: true,
    motif: "Poste pourvu en interne. Votre profil a été conservé pour de prochaines offres similaires.",
  },
  { poste: "Assistante RH", entreprise: "Auchan Sénégal", ville: "Dakar", date: "1er août 2026", statut: "Candidature reçue", step: 1 },
];

const STEP_LABELS = ["Reçue", "Vue", "Entretien", "Réponse"];

function CandidatureStepper({ step, negative }) {
  const lineColor = negative ? COLORS.danger : COLORS.orange;
  return (
    <div className="flex items-center mt-4">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n <= step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: done ? lineColor : COLORS.surface,
                  color: done ? (negative ? COLORS.onDark : COLORS.onOrange) : COLORS.slateLight,
                  border: done ? "none" : `1px solid ${COLORS.border}`,
                }}
              >
                {n}
              </div>
              <span className="text-xs mt-1.5" style={{ color: done ? COLORS.slate : COLORS.slateLight }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 -mt-4" style={{ background: n < step ? lineColor : COLORS.border }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const GROUPES_CANDIDATURE = [
  { id: "toutes", label: "Toutes", test: () => true },
  { id: "cours", label: "En cours", test: (c) => ["Candidature reçue", "Vue par le recruteur", "Entretien programmé"].includes(c.statut) },
  { id: "retenues", label: "Retenues", test: (c) => c.statut === "Candidature retenue" },
  { id: "refusees", label: "Réponses négatives", test: (c) => !!c.negative || c.statut === "Réponse négative" },
];

function CandidatureCard({ c, onNavigate }) {
  return (
    <CarteListe
      accent={!!c.embauche}
      visuel={<LogoEntreprise nom={c.entreprise} />}
      titre={c.poste}
      badges={<StatusBadge status={c.statut} />}
      sousTitre={c.entreprise}
      meta={<>
        <MetaOffre icone={MapPin}>{c.ville}</MetaOffre>
        <MetaOffre icone={CalendarDays}>Postulé le {c.date}</MetaOffre>
      </>}
    >
      <div className="max-w-md">
        <CandidatureStepper step={c.step} negative={c.negative} />
      </div>
      {c.negative && (
        <p className="mt-4 rounded-md bg-statut-danger-doux px-4 py-3 text-sm text-statut-danger">
          <span className="font-semibold">Motif communiqué par le recruteur : </span>{c.motif}
        </p>
      )}
      {c.embauche && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-statut-succes-doux px-4 py-3 text-sm text-statut-succes">
          <span>Vous avez été recrutée. LIGGEEY vous accompagne pendant vos 90 premiers jours.</span>
          {onNavigate && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate("suivi"); }} className="inline-flex min-h-[44px] items-center font-semibold underline">
              Voir mon suivi post-embauche
            </button>
          )}
        </div>
      )}
    </CarteListe>
  );
}

function CandidaturesScreen({ onNavigate }) {
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const [query, setQuery] = useState("");
  const [groupe, setGroupe] = useState("toutes");
  const q = sansAccents(query.trim());
  const test = GROUPES_CANDIDATURE.find((g) => g.id === groupe).test;
  const filtered = candidatures.filter((c) => (!q || sansAccents([c.poste, c.entreprise, c.ville].join(" ")).includes(q)) && test(c));
  const pagination = usePaginationListe(filtered);
  const filtresActifs = q || groupe !== "toutes";

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">
        Suivez en temps réel l’avancement de vos candidatures. Chaque étape est mise à jour : jamais de silence indéfini.
      </p>

      <BarreFiltres label="Rechercher dans mes candidatures">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Poste, entreprise ou ville…"
          label="Rechercher une candidature"
          className="w-full lg:flex-1"
        />
        {onNavigate && (
          <App.Bouton petit variante="doux" onClick={() => onNavigate("offres")}>
            <Briefcase size={15} aria-hidden="true" /> Voir les offres
          </App.Bouton>
        )}
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Afficher"
          actif={groupe}
          onChange={(v) => { setGroupe(v); pagination.setPage(1); }}
          options={GROUPES_CANDIDATURE.map((g) => ({ id: g.id, label: `${g.label} (${candidatures.filter(g.test).length})` }))}
        />
        <CompteResultats n={filtered.length} nom="candidature" feminin />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((c) => <CandidatureCard key={c.id || c.poste} c={c} onNavigate={onNavigate} />)}
        </div>
      ) : candidatures.length === 0 ? (
        <ListeVide
          icone={ClipboardList}
          titre="Vous n’avez pas encore postulé"
          texte="Parcourez les offres vérifiées et envoyez votre première candidature."
          action={onNavigate && <App.Bouton petit onClick={() => onNavigate("offres")}>Parcourir les offres</App.Bouton>}
        />
      ) : (
        <ListeVide
          titre="Aucune candidature ne correspond"
          texte="Essayez d’autres mots-clés ou un autre filtre."
          action={filtresActifs && <App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setGroupe("toutes"); }}>Effacer les filtres</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Screen 8 : Formations ---------- */

function dureeFromHeures(h) {
  if (h <= 20) return "1 mois intensif";
  if (h <= 35) return "2 mois intensifs";
  return "3 mois intensifs";
}

const GENERIC_MODULE_TEMPLATES = ["Introduction et fondamentaux", "Concepts clés et théorie", "Techniques et bonnes pratiques", "Étude de cas pratique", "Mise en situation réelle", "Outils et méthodes avancées", "Contrôle qualité et normes", "Évaluation et certification"];

function buildModules(formation) {
  if (formation.moduleNames) {
    return formation.moduleNames.map((m, i) => ({ n: i + 1, titre: m.titre, duree: m.duree }));
  }
  const total = formation.modules;
  const list = [];
  for (let i = 0; i < total; i++) {
    const titre = GENERIC_MODULE_TEMPLATES[i % GENERIC_MODULE_TEMPLATES.length];
    const duree = `${Math.max(1, Math.round((formation.heures / total) * 2) / 2).toLocaleString("fr-FR")} h`;
    list.push({ n: i + 1, titre, duree });
  }
  return list;
}

function moduleStatus(index, enrolled, progressCount) {
  if (!enrolled) return "Verrouillé";
  if (index < progressCount) return "Complété";
  if (index === progressCount) return "En cours";
  return "Verrouillé";
}

const MODULE_BADGE_STYLE = {
  "Complété": { bg: COLORS.successSoft, color: COLORS.success },
  "En cours": { bg: COLORS.orangeSoft, color: COLORS.orangeStrong },
  "Verrouillé": { bg: COLORS.softStrong, color: COLORS.slateLight },
};

const FORMATIONS_ALL = [
  { id: "marketing", nom: "Marketing digital", modules: 12, heures: 28, enrolled: true, progressCount: 6, coach: "aissatou.fall@email.com", tagline: "Élaborer une stratégie marketing digitale efficace.", description: "Vous apprendrez à construire une stratégie de contenu, à piloter des campagnes publicitaires en ligne et à mesurer la performance de vos actions marketing." },
  { id: "devweb", nom: "Développement web", modules: 10, heures: 24, enrolled: false, coach: "ibrahima.diouf@email.com", tagline: "Concevoir des sites web modernes et responsives.", description: "Une introduction complète au développement web, du HTML/CSS aux bases de JavaScript, pour construire vos premiers sites." },
  { id: "compta", nom: "Comptabilité et finance", modules: 15, heures: 40, enrolled: true, progressCount: 8, coach: "khadija.sy@email.com", tagline: "Gérer la comptabilité et les finances d’une entreprise.", description: "Les bases de la comptabilité générale et de la gestion financière, pour tenir les comptes d’une petite structure." },
  { id: "comdigitale", nom: "Communication digitale", modules: 8, heures: 18, enrolled: true, progressCount: 5, coach: "jean-pierre.dupont@email.com", tagline: "Maîtriser les règles et usages de la communication digitale.", description: "Cette formation vise à transmettre les fondamentaux opérationnels de l’écosystème numérique. Vous apprendrez à concevoir des campagnes sur les réseaux sociaux, structurer votre SEO, rédiger pour le web et utiliser les leviers d’acquisition digitaux indispensables pour piloter la visibilité de votre entreprise.", linkedCandidature: { poste: "Chargée de clientèle", date: "28 juillet 2026", ville: "Dakar", step: 4, statut: "Candidature retenue" } },
  { id: "gestionprojet", nom: "Gestion de projet", modules: 12, heures: 32, enrolled: true, progressCount: 7, coach: "moussa.ndao@email.com", tagline: "Piloter un projet de bout en bout.", description: "Les méthodologies agiles et classiques pour cadrer, planifier et livrer un projet dans les temps." },
  { id: "anglais", nom: "Anglais professionnel", modules: 14, heures: 36, enrolled: true, progressCount: 9, coach: "sarah.johnson@email.com", tagline: "Communiquer avec aisance en anglais professionnel.", description: "Un entraînement à l’oral et à l’écrit pour gagner en aisance dans un contexte professionnel anglophone." },
  { id: "excel", nom: "Excel avancé", modules: 6, heures: 12, enrolled: false, coach: "oumar.ba@email.com", tagline: "Exploiter les fonctions avancées d’Excel.", description: "Tableaux croisés dynamiques, macros et modélisation pour aller au-delà des bases d’Excel." },
  { id: "leadership", nom: "Leadership et management", modules: 10, heures: 20, enrolled: false, coach: "fatima.sarr@email.com", tagline: "Manager et motiver une équipe.", description: "Déléguer, motiver et prendre des décisions : les fondamentaux du management d’équipe." },
  { id: "rh", nom: "Ressources humaines", modules: 8, heures: 16, enrolled: false, coach: "cheikh.gueye@email.com", tagline: "Maîtriser les fondamentaux des ressources humaines.", description: "Recrutement, gestion de la paie et droit du travail sénégalais : les bases RH essentielles." },
  { id: "entrepreneuriat", nom: "Entrepreneuriat", modules: 20, heures: 50, enrolled: false, coach: "awa.diagne@email.com", tagline: "Structurer et lancer votre projet entrepreneurial.", description: "De l’idée au business plan : structurez votre projet entrepreneurial étape par étape." },
];

/* Nom lisible à partir de l’adresse du formateur (aissatou.fall@… → Aissatou Fall). */
function nomDepuisEmail(email) {
  return email.split("@")[0].split(/[.-]/).map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(" ");
}

function progressionFormation(f, inscrit, fait) {
  if (!inscrit) return 0;
  return Math.min(100, Math.round((Math.min(fait, f.modules) / f.modules) * 100));
}

function VisuelFormation({ taille = "md" }) {
  const dims = taille === "lg" ? "h-16 w-16" : "h-12 w-12";
  return (
    <span className={`grid shrink-0 place-items-center rounded-lg bg-marque-doux text-marque-fort ${dims}`} aria-hidden="true">
      <GraduationCap size={taille === "lg" ? 28 : 22} strokeWidth={1.75} />
    </span>
  );
}

function FormationCard({ f, onOpen, premium, locked, inscrit = false, progression = 0 }) {
  const terminee = inscrit && progression >= 100;
  return (
    <article
      onClick={() => onOpen(f)}
      className="group flex cursor-pointer flex-col gap-4 rounded-lg border border-base bg-surface p-5 transition-shadow hover:shadow-carte sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <VisuelFormation />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-principal group-hover:text-marque">{f.nom}</h3>
            {premium && <PremiumChip locked={locked} />}
          </div>
          {f.tagline && <p className="mt-0.5 text-sm text-secondaire">{f.tagline}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <MetaOffre icone={Layers}>{f.modules} modules</MetaOffre>
            <MetaOffre icone={Clock}>{f.heures} h</MetaOffre>
            <MetaOffre icone={CalendarDays}>{dureeFromHeures(f.heures)}</MetaOffre>
          </div>
          {inscrit && (
            <div className="mt-3 flex max-w-sm items-center gap-3">
              <App.BarreProgression valeur={progression} ton={terminee ? "succes" : "marque"} label={`Progression : ${progression} %`} />
              <span className="shrink-0 text-xs font-semibold text-secondaire">{progression} %</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-base pt-4 sm:border-0 sm:pt-0">
        {inscrit && <App.Badge ton={terminee ? "succes" : "marque"} point taille="moyen" className="mr-auto sm:mr-1">{terminee ? "Terminée" : "Inscrit"}</App.Badge>}
        <App.Bouton
          petit
          variante={inscrit ? "neutre" : "principal"}
          onClick={(e) => { e.stopPropagation(); onOpen(f); }}
          aria-label={`${inscrit ? "Continuer" : "Voir"} la formation : ${f.nom}`}
          className={inscrit ? "" : "ml-auto sm:ml-0"}
        >
          {inscrit ? (terminee ? "Voir" : "Continuer") : "Voir la formation"}
        </App.Bouton>
      </div>
    </article>
  );
}

function FormationDetail({ formation, enrolled, progressCount, onToggleEnroll, onAdvanceModule, onViewCertificate, onBack, premium = false, locked = false, similaires = [], onOpen, carteProps = () => ({}) }) {
  const total = formation.modules;
  const modulesList = buildModules(formation);
  const isComplete = enrolled && progressCount >= total;
  const progression = progressionFormation(formation, enrolled, progressCount);
  const statut = isComplete ? "Terminée" : enrolled ? "En cours" : "Non inscrit";
  const TON_MODULE = { "Complété": "succes", "En cours": "marque", "Verrouillé": "neutre" };

  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux formations</BoutonRetour>

      <EnTeteFiche
        visuel={<VisuelFormation taille="lg" />}
        badges={<>
          <App.Badge ton={isComplete ? "succes" : enrolled ? "marque" : "neutre"} point taille="moyen">{statut}</App.Badge>
          {premium && <PremiumChip locked={locked} />}
        </>}
        titre={formation.nom}
        sousTitre={formation.tagline}
        meta={<>
          <MetaOffre icone={Layers}>{total} modules</MetaOffre>
          <MetaOffre icone={Clock}>{formation.heures} h d’apprentissage</MetaOffre>
          <MetaOffre icone={CalendarDays}>{dureeFromHeures(formation.heures)}</MetaOffre>
        </>}
        actions={
          !enrolled ? (
            <App.Bouton onClick={onToggleEnroll}>
              {locked ? <Lock size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />} S’inscrire à cette formation
            </App.Bouton>
          ) : isComplete ? (
            <App.Bouton onClick={onViewCertificate}>
              <ShieldCheck size={16} aria-hidden="true" /> Voir mon certificat
            </App.Bouton>
          ) : null
        }
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="À propos de la formation">
            <p className="text-[15px] leading-[1.7] text-secondaire">{formation.description}</p>
          </App.Carte>

          <App.Carte titre="Programme" sousTitre={enrolled ? `${Math.min(progressCount, total)} / ${total} modules validés` : `${total} modules`} flush>
            <ol className="divide-y divide-base border-t border-base">
              {modulesList.map((m, i) => {
                const status = moduleStatus(i, enrolled, progressCount);
                return (
                  <li key={m.n} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${status === "Complété" ? "bg-statut-succes-doux text-statut-succes" : status === "En cours" ? "bg-marque text-sur-marque" : "bg-doux text-discret"}`} aria-hidden="true">
                        {status === "Complété" ? <Check size={14} strokeWidth={2.5} /> : m.n}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${status === "Verrouillé" ? "text-secondaire" : "text-principal"}`}>{m.titre}</p>
                        <p className="text-xs text-discret">Module {m.n} · {m.duree}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-11 sm:pl-0">
                      {status === "En cours" && <App.Bouton petit onClick={onAdvanceModule}>Marquer comme terminé</App.Bouton>}
                      <App.Badge ton={TON_MODULE[status]} taille="moyen">{status === "Verrouillé" && <Lock size={11} aria-hidden="true" />}{status}</App.Badge>
                    </div>
                  </li>
                );
              })}
            </ol>
          </App.Carte>

          {formation.linkedCandidature && (
            <App.Carte titre="Candidature liée" actions={<StatusBadge status={formation.linkedCandidature.statut} />}>
              <p className="text-sm font-semibold text-principal">{formation.linkedCandidature.poste}</p>
              <p className="text-xs text-discret">{formation.linkedCandidature.ville} · {formation.linkedCandidature.date}</p>
              <CandidatureStepper step={formation.linkedCandidature.step} />
            </App.Carte>
          )}
        </>}
        cote={<>
          <ApercuFiche
            titre="Aperçu de la formation"
            items={[
              { icone: Layers, libelle: "Modules", valeur: `${total} modules` },
              { icone: Clock, libelle: "Volume horaire", valeur: `${formation.heures} h` },
              { icone: CalendarDays, libelle: "Durée", valeur: dureeFromHeures(formation.heures) },
              { icone: UserCircle2, libelle: "Formateur", valeur: nomDepuisEmail(formation.coach) },
              { icone: Crown, libelle: "Accès", valeur: premium ? "Formule Premium" : "Inclus dans votre formule" },
            ]}
          />

          <App.Carte titre="Votre progression">
            {enrolled ? (
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <p className="text-[28px] font-semibold leading-none text-principal">{progression} %</p>
                  <p className="text-sm text-discret">{Math.min(progressCount, total)} / {total} modules</p>
                </div>
                <App.BarreProgression valeur={progression} ton={isComplete ? "succes" : "marque"} hauteur="epaisse" label="Progression de la formation" />
                <p className="text-sm text-secondaire">
                  {isComplete ? "Bravo, vous avez terminé tous les modules. Votre certificat est prêt." : "Validez chaque module pour débloquer le suivant et obtenir votre certificat."}
                </p>
                {isComplete && <App.Bouton pleineLargeur variante="neutre" onClick={onViewCertificate}>Voir mon certificat</App.Bouton>}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-secondaire">
                  {locked ? "Cette formation fait partie de la formule Premium." : "Inscrivez-vous pour suivre les modules à votre rythme et obtenir un certificat LIGGEEY."}
                </p>
                <App.Bouton pleineLargeur onClick={onToggleEnroll}>
                  {locked ? <Lock size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />} S’inscrire
                </App.Bouton>
              </div>
            )}
          </App.Carte>
        </>}
      />

      {similaires.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-principal">Autres formations</h2>
          <div className="space-y-4">
            {similaires.map((f) => <FormationCard key={f.id} f={f} onOpen={onOpen} {...carteProps(f)} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function CertificateScreen({ formation, userName, onBack, dataset }) {
  const recommandees = (dataset || FORMATIONS_ALL).filter((f) => f.id !== formation.id).slice(0, 3);
  const [feedback, setFeedback] = useState(null);

  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour à la formation
      </button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Certificat de formation</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.success }}>Félicitations ! Vous avez complété la formation avec succès.</p>

      <div className="rounded-lg border-2 p-8 mb-6 text-center" style={{ borderColor: COLORS.orange }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: COLORS.orangeSoft }}>
          <ShieldCheck size={28} color={COLORS.orange} />
        </div>
        <h2 className="text-2xl font-semibold mb-1" style={{ color: COLORS.slate }}>CERTIFICAT DE RÉUSSITE</h2>
        <p className="text-xs mb-5" style={{ color: COLORS.slateLight }}>Délivré par la plateforme nationale LIGGEEY pour l’insertion des professionnels</p>
        <p className="text-sm" style={{ color: COLORS.slateLight }}>Ce document atteste que</p>
        <p className="text-xl font-semibold mb-3" style={{ color: COLORS.slate }}>{userName}</p>
        <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>a suivi et validé avec succès l’ensemble des modules obligatoires requis pour la formation :</p>
        <p className="text-lg font-semibold mb-6" style={{ color: COLORS.orangeText }}>{formation.nom}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>DATE D’OBTENTION</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>30 octobre 2026</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>VOLUME HORAIRE</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{formation.modules} modules · {formation.heures}h</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>MENTION</p><p className="text-sm font-semibold" style={{ color: COLORS.success }}>Très bien (87/100)</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>ID UNIQUE</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>CERT-{formation.id.slice(0, 2).toUpperCase()}-2026-0042</p></div>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button type="button" onClick={() => setFeedback("téléchargé")} className="rounded px-5 py-2.5 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Télécharger (PDF)</button>
        <button type="button" onClick={() => setFeedback("partagé")} className="rounded px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Partager</button>
        {feedback && <span className="self-center text-sm" style={{ color: COLORS.success }}>Certificat {feedback} (démo).</span>}
      </div>

      <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Formations recommandées pour vous</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommandees.map((f) => (
          <div key={f.id} className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>Recommandé</span>
            <p className="font-semibold text-sm mt-2" style={{ color: COLORS.slate }}>{f.nom}</p>
            <p className="text-xs" style={{ color: COLORS.slateLight }}>{f.modules} modules · {f.heures} h</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const FORMATIONS_PRESTATAIRE_ALL = [
  { id: "securite-elec", domaines: ["electricite"], nom: "Sécurité électrique", modules: 8, heures: 24, enrolled: true, progressCount: 4, coach: "cheikh.fall@cneap.sn", tagline: "Maîtriser les normes de sécurité sur chantier électrique.", description: "Formation qualifiante couvrant l’ensemble des protocoles de sécurité requis en habilitation électrique B2V, ainsi que la gestion des situations d’urgence sur chantier.", moduleNames: [
    { titre: "Introduction aux normes NF C 15-100", duree: "2 h 30" },
    { titre: "Protection des personnes et des biens", duree: "3 h" },
    { titre: "Dimensionnement des circuits", duree: "4 h" },
    { titre: "Lecture de schémas électriques", duree: "2 h 30" },
    { titre: "Gestes de sécurité essentiels", duree: "3 h 30" },
    { titre: "Procédures de contrôle", duree: "3 h" },
    { titre: "Mise en pratique — TP sur site", duree: "3 h" },
    { titre: "Évaluation finale", duree: "3 h" },
  ] },
  { id: "peinture-moderne", domaines: ["btp"], nom: "Peinture moderne", modules: 8, heures: 24, enrolled: false, coach: "aida.sarr@centreartisanat.sn", tagline: "Techniques modernes de peinture décorative et finitions.", description: "Apprenez les techniques actuelles de peinture décorative, enduits et finitions haut de gamme recherchées par les clients particuliers." },
  { id: "gestion-micro", domaines: ["tous"], nom: "Gestion de micro-entreprise", modules: 12, heures: 32, enrolled: true, progressCount: 5, coach: "fatou.ba@cneap.sn", tagline: "Gérer et développer sa petite activité indépendante.", description: "Comptabilité de base, fixation des tarifs, gestion des devis et développement de la clientèle pour les travailleurs indépendants." },
  { id: "soudure-tech", domaines: ["metallerie"], nom: "Techniques de soudure", modules: 14, heures: 48, enrolled: false, coach: "moussa.diagne@cneap.sn", tagline: "Perfectionner ses techniques de soudure TIG et MIG.", description: "Formation avancée en soudure industrielle pour les professionnels souhaitant élargir leur champ de compétences." },
  { id: "maconnerie-fond", domaines: ["btp"], nom: "Maçonnerie et fondations", modules: 16, heures: 44, enrolled: false, coach: "ibrahima.sy@institutbtp.sn", tagline: "Construire des fondations solides et durables.", description: "Techniques de fondations, dosage du béton et lecture de plans pour les maçons professionnels." },
  { id: "normes-btp", domaines: ["btp", "electricite", "plomberie", "menuiserie", "metallerie"], nom: "Normes BTP et sécurité", modules: 10, heures: 28, enrolled: true, progressCount: 6, coach: "khadija.ndoye@institutbtp.sn", tagline: "Connaître et appliquer les normes de sécurité BTP.", description: "Les règles de sécurité incontournables sur un chantier de construction, port des équipements et prévention des accidents." },
  { id: "coiffure-esthetique", domaines: ["coiffure"], nom: "Coiffure et esthétique", modules: 10, heures: 26, enrolled: false, coach: "aissatou.fall@centreartisanat.sn", tagline: "Techniques de coiffure et de soins esthétiques.", description: "Tresses, soins capillaires et techniques esthétiques recherchées par une clientèle exigeante." },
  { id: "relation-client", domaines: ["tous"], nom: "Relation client", modules: 6, heures: 16, enrolled: true, progressCount: 6, coach: "omar.gueye@cneap.sn", tagline: "Fidéliser sa clientèle et gérer les réclamations.", description: "Communiquer efficacement avec ses clients, gérer les insatisfactions et construire une réputation solide." },
  { id: "mecanique-auto", domaines: ["mecanique"], nom: "Mécanique auto", modules: 18, heures: 50, enrolled: false, coach: "papa.diouf@institutbtp.sn", tagline: "Diagnostiquer et réparer les pannes mécaniques courantes.", description: "Bases de la mécanique automobile : diagnostic de panne, entretien courant et réparations essentielles." },
  { id: "couture-confection", domaines: ["couture"], nom: "Couture et confection", modules: 12, heures: 30, enrolled: false, coach: "ndeye.diop@centreartisanat.sn", tagline: "Perfectionner ses techniques de couture sur mesure.", description: "Techniques avancées de couture, patronage et confection sur mesure pour les professionnels du textile." },
  { id: "installation-sanitaire", domaines: ["plomberie"], nom: "Installation sanitaire", modules: 12, heures: 34, enrolled: false, coach: "modou.diagne@institutbtp.sn", tagline: "Installer et entretenir des systèmes sanitaires complets.", description: "Installation de sanitaires, raccordements et mise aux normes des systèmes de plomberie résidentiels." },
  { id: "peinture-batiment", domaines: ["btp"], nom: "Peinture bâtiment", modules: 8, heures: 20, enrolled: false, coach: "aida.sarr@centreartisanat.sn", tagline: "Techniques de peinture pour le bâtiment.", description: "Préparation des surfaces, application et finitions pour des chantiers de peinture en bâtiment." },
  { id: "solaire-pv", domaines: ["electricite"], nom: "Installation solaire photovoltaïque", modules: 10, heures: 30, enrolled: false, coach: "ousmane.diop@cneap.sn", tagline: "Dimensionner et poser une installation solaire domestique.", description: "Calcul des besoins, choix des panneaux et des batteries, pose et raccordement d’un kit solaire en toute sécurité." },
  { id: "domotique-maison", domaines: ["electricite"], nom: "Domotique et maison connectée", modules: 8, heures: 20, enrolled: false, coach: "aminata.fall@cneap.sn", tagline: "Installer des équipements pilotés à distance.", description: "Éclairage, volets et climatisation pilotés depuis un téléphone : installation, paramétrage et dépannage." },
];

const FORMATIONS_PAR_PAGE = 5;

function FormationsScreen({ initialTab, dataset, userName }) {
  const BASE = dataset || FORMATIONS_ALL;
  const estPrestataire = BASE === FORMATIONS_PRESTATAIRE_ALL;
  const { metier, domaine } = useDomainePrestataire();
  const ALL = estPrestataire ? BASE.filter((f) => dansDomaine(f, domaine)) : BASE;
  const [tab, setTab] = useState(initialTab || "toutes");
  const [query, setQuery] = useState("");
  const [acces, setAcces] = useState("tous");
  const storeKey = estPrestataire ? "p" : "c";
  const [enrolledIds, setEnrolledIds] = useStore(`formations-inscrites-${storeKey}`, () => BASE.filter((f) => f.enrolled).map((f) => f.id));
  const [progressCounts, setProgressCounts] = useStore(`formations-progression-${storeKey}`, () => Object.fromEntries(BASE.map((f) => [f.id, f.progressCount || 0])));
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("list"); // list | detail | certificate
  const [page, setPage] = useState(1);

  const planApi = usePlan();
  const isLocked = (f) => !!f && PREMIUM_FORMATIONS.has(f.id) && !enrolledIds.includes(f.id) && !(planApi && planApi.can("formationsPremium"));
  function toggleEnroll(id) {
    if (isLocked(ALL.find((f) => f.id === id))) { planApi.requestUpgrade("formationsPremium"); return; }
    setEnrolledIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setProgressCounts((p) => ({ ...p, [id]: p[id] || 0 }));
    notify("Inscription confirmée. Bonne formation !");
  }
  function advanceModule(id, total) {
    setProgressCounts((p) => ({ ...p, [id]: Math.min(total, (p[id] || 0) + 1) }));
  }
  const carteProps = (f) => {
    const inscrit = enrolledIds.includes(f.id);
    return { premium: PREMIUM_FORMATIONS.has(f.id), locked: isLocked(f), inscrit, progression: progressionFormation(f, inscrit, progressCounts[f.id] || 0) };
  };
  const ouvrir = (f) => { setSelectedId(f.id); setView("detail"); window.scrollTo(0, 0); };

  const mes = ALL.filter((f) => enrolledIds.includes(f.id));
  const source = tab === "mes" ? mes : ALL;
  const q = sansAccents(query.trim());
  const filtered = source.filter((f) =>
    (!q || sansAccents([f.nom, f.tagline, f.description].join(" ")).includes(q)) &&
    (acces === "tous" || (acces === "premium") === PREMIUM_FORMATIONS.has(f.id)));
  const pages = Math.max(1, Math.ceil(filtered.length / FORMATIONS_PAR_PAGE));
  const pageCourante = Math.min(page, pages);
  const paged = filtered.slice((pageCourante - 1) * FORMATIONS_PAR_PAGE, pageCourante * FORMATIONS_PAR_PAGE);
  const filtresActifs = q || acces !== "tous";
  const selected = ALL.find((f) => f.id === selectedId);

  if (selected && view === "certificate") {
    return (
      <CertificateScreen
        formation={selected}
        userName={userName || "Mamadou Ndiaye"}
        dataset={ALL}
        onBack={() => setView("detail")}
      />
    );
  }
  if (selected) {
    return (
      <FormationDetail
        key={selected.id}
        formation={selected}
        enrolled={enrolledIds.includes(selected.id)}
        progressCount={progressCounts[selected.id] || 0}
        premium={PREMIUM_FORMATIONS.has(selected.id)}
        locked={isLocked(selected)}
        onToggleEnroll={() => toggleEnroll(selected.id)}
        onAdvanceModule={() => advanceModule(selected.id, selected.modules)}
        onViewCertificate={() => setView("certificate")}
        onBack={() => { setSelectedId(null); setView("list"); }}
        similaires={ALL.filter((f) => f.id !== selected.id && !enrolledIds.includes(f.id)).slice(0, 3)}
        onOpen={ouvrir}
        carteProps={carteProps}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">
        Développez vos compétences avec des formations pensées pour le marché sénégalais. Chaque formation terminée vous donne un certificat LIGGEEY.
      </p>
      {estPrestataire && <NoteDomaine metier={metier} domaine={domaine} texte="Formations choisies" />}

      <BarreFiltres label="Rechercher et filtrer les formations">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          placeholder="Nom ou thème de la formation…"
          label="Rechercher une formation"
          className="w-full lg:flex-1"
        />
        <App.SelecteurPeriode
          icone={Crown}
          label="Accès"
          valeur={acces}
          onChange={(v) => { setAcces(v); setPage(1); }}
          options={[{ id: "tous", label: "Tous les accès" }, { id: "inclus", label: "Incluses dans mon profil" }, { id: "premium", label: "Premium" }]}
        />
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Afficher"
          actif={tab}
          onChange={(v) => { setTab(v); setPage(1); }}
          options={[
            { id: "toutes", label: `Toutes (${ALL.length})` },
            { id: "mes", label: `Mes formations (${mes.length})` },
          ]}
        />
        <CompteResultats n={filtered.length} nom="formation" feminin />
      </div>

      {paged.length > 0 ? (
        <div className="space-y-4">
          {paged.map((f) => <FormationCard key={f.id} f={f} onOpen={ouvrir} {...carteProps(f)} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-base bg-surface">
          <App.EtatVide
            icone={tab === "mes" && !filtresActifs ? GraduationCap : Search}
            titre={tab === "mes" && !filtresActifs ? "Vous ne suivez aucune formation" : "Aucune formation ne correspond à votre recherche"}
            texte={tab === "mes" && !filtresActifs ? "Parcourez le catalogue et inscrivez-vous à une première formation." : "Essayez d’autres mots-clés ou retirez un filtre."}
            action={
              tab === "mes" && !filtresActifs
                ? <App.Bouton petit onClick={() => setTab("toutes")}>Voir toutes les formations</App.Bouton>
                : filtresActifs && <App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setAcces("tous"); setPage(1); }}>Effacer les filtres</App.Bouton>
            }
          />
        </div>
      )}

      {filtered.length > FORMATIONS_PAR_PAGE && (
        <Pagination page={pageCourante} pageSize={FORMATIONS_PAR_PAGE} totalItems={filtered.length} onPageChange={setPage} />
      )}
    </div>
  );
}

/* ---------- Screen 9 : Mentors ---------- */

const MENTORS = [
  { id: "cheikh-fall", nom: "Cheikh Fall", role: "Responsable RH", exp: 12, photo: "/images/plateforme/portraits/cheikh-fall-cadre.jpg", tagline: "Accompagne des jeunes diplômés depuis 8 ans sur la préparation aux entretiens et la construction de parcours.", competences: ["Préparation entretien", "Rédaction CV", "Orientation professionnelle", "Négociation salariale", "Personal branding", "Réseautage", "Gestion du stress", "Prise de parole"], stats: { mentores: 24, note: "4,8/5", anciennete: "3 ans", heures: 156 }, historique: [
      { date: "30 juillet 2026", note: "Simulation d’entretien pour le poste de Chargée de clientèle chez Sonatel. Point à travailler : structurer les réponses avec la méthode STAR." },
      { date: "18 juillet 2026", note: "Relecture du CV : mise en avant des compétences Excel et suppression des expériences non pertinentes." },
      { date: "2 juillet 2026", note: "Premier échange : définition des secteurs ciblés (banque, télécoms) et du rythme de candidatures." },
    ], documents: [
      { nom: "Guide de préparation aux entretiens.pdf", meta: "PDF · 15 mars 2026" },
      { nom: "Template CV professionnel.docx", meta: "DOCX · 2 avril 2026" },
      { nom: "Liste des entreprises qui recrutent.xlsx", meta: "XLSX · 20 juin 2026" },
    ], prochainRdv: "Jeudi 11 août 2026 · 15 h – 16 h" },
  { id: "aminata-ndiaye", nom: "Aminata Ndiaye", role: "Directrice marketing", exp: 15, photo: "/images/plateforme/portraits/aminata-ndiaye-cadre.jpg" },
  { id: "moussa-diop", nom: "Moussa Diop", role: "Ingénieur logiciel", exp: 10, photo: "/images/plateforme/portraits/moussa-diop-cadre.jpg" },
  { id: "fatou-sarr", nom: "Fatou Sarr", role: "Consultante finance", exp: 18, photo: "/images/plateforme/portraits/fatou-sarr-cadre.jpg" },
  { id: "ousmane-ba", nom: "Ousmane Ba", role: "Chef de projet", exp: 8, photo: "/images/plateforme/portraits/ousmane-ba-cadre.jpg" },
  { id: "mariama-sow", nom: "Mariama Sow", role: "Avocate d’affaires", exp: 14, photo: "/images/plateforme/portraits/mariama-sow-cadre.jpg" },
  { id: "ibrahima-diallo", nom: "Ibrahima Diallo", role: "Architecte", exp: 20, photo: "/images/plateforme/portraits/ibrahima-diallo-cadre.jpg" },
  { id: "aissatou-dia", nom: "Aissatou Dia", role: "Data scientist", exp: 7, photo: "/images/plateforme/portraits/aissatou-dia-cadre.jpg" },
  { id: "papa-seck", nom: "Papa Seck", role: "Entrepreneur", exp: 16, photo: "/images/plateforme/portraits/papa-seck-cadre.jpg" },
  { id: "khady-toure", nom: "Khady Touré", role: "Journaliste", exp: 11, photo: "/images/plateforme/portraits/khady-toure-cadre.jpg" },
  { id: "babacar-niang", nom: "Babacar Niang", role: "Médecin", exp: 22, photo: "/images/plateforme/portraits/babacar-niang-cadre.jpg" },
  { id: "ndeye-mbaye", nom: "Ndèye Mbaye", role: "Comptable", exp: 9, photo: "/images/plateforme/portraits/ndeye-mbaye-cadre.jpg" },
];

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function MentorCard({ m, onOpen }) {
  const profil = mentorProfile(m);
  const themes = m.competences || profil.themes;
  return (
    <article
      onClick={() => onOpen(m)}
      className="group flex cursor-pointer flex-col gap-4 rounded-lg border border-base bg-surface p-5 transition-shadow hover:shadow-carte sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <SafeImg src={m.photo} alt={m.nom} className="h-14 w-14 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-principal group-hover:text-marque">{m.nom}</h3>
            {m.historique && <App.Badge ton="succes" point taille="moyen">Votre mentor</App.Badge>}
          </div>
          <p className="mt-0.5 text-sm text-secondaire">{m.role} · {m.exp} ans d’expérience</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <MetaOffre icone={Star}>{profil.stats.note}</MetaOffre>
            <MetaOffre icone={UsersRound}>{profil.stats.mentores} mentorés</MetaOffre>
            <MetaOffre icone={MessageCircle}>{profil.langues.join(", ")}</MetaOffre>
          </div>
          <div className="mt-3">
            <Etiquettes items={themes} max={3} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-base pt-4 sm:border-0 sm:pt-0">
        <App.Bouton
          petit
          variante={m.historique ? "neutre" : "principal"}
          onClick={(e) => { e.stopPropagation(); onOpen(m); }}
          aria-label={`Voir le profil de ${m.nom}`}
        >
          Voir le profil
        </App.Bouton>
      </div>
    </article>
  );
}

function StatMini({ value, label }) {
  return (
    <div className="rounded-lg border bg-surface p-4 text-center" style={{ borderColor: COLORS.border }}>
      <p className="text-2xl font-semibold" style={{ color: COLORS.orangeText }}>{value}</p>
      <p className="text-xs" style={{ color: COLORS.slateLight }}>{label}</p>
    </div>
  );
}

const MENTORS_PRESTATAIRE = [
  { id: "cheikh-fall-artisan", domaines: ["electricite"], nom: "Cheikh Fall", role: "Maître électricien", exp: 12, photo: "/images/plateforme/portraits/cheikh-fall.jpg", tagline: "Accompagne les électriciens et techniciens depuis 8 ans sur les normes de sécurité, la gestion de chantier et le développement de leur activité.", competences: ["Normes électriques", "Devis & Facturation", "Relation client", "Installation solaire", "Gestion de chantier", "Domotique"], stats: { mentores: 24, note: "4,8/5", anciennete: "3 ans", heures: 156 }, historique: [
      { date: "30 juillet 2026", note: "Revue des procédures de sécurité électrique : mise en conformité NF C 15-100, check-list d’intervention et documentation des travaux. Point à travailler : devis détaillés avec schémas." },
      { date: "18 juillet 2026", note: "Stratégie de spécialisation : positionnement sur l’installation de panneaux solaires et la domotique, deux marchés en forte croissance au Sénégal." },
      { date: "2 juillet 2026", note: "Premier échange : évaluation des compétences techniques, identification des certifications à obtenir et plan de développement." },
    ], documents: [
      { nom: "Guide des normes NF C 15-100.pdf", meta: "PDF · 15 mars 2026" },
      { nom: "Modèle de devis professionnel.docx", meta: "DOCX · 2 avril 2026" },
      { nom: "Liste des clients qui recrutent.xlsx", meta: "XLSX · 20 juin 2026" },
    ], prochainRdv: "Jeudi 11 août 2026 · 15 h – 16 h" },
  { id: "aminata-ndiaye-couture", domaines: ["couture"], competences: ["Couture sur mesure", "Patronage", "Gestion d’atelier", "Tarifs et devis"], nom: "Aminata Ndiaye", role: "Couturière et styliste", exp: 15, photo: "/images/plateforme/portraits/aminata-ndiaye.jpg" },
  { id: "moussa-diop-menuisier", domaines: ["menuiserie"], competences: ["Mobilier sur mesure", "Lecture de plans", "Devis", "Sécurité en atelier"], nom: "Moussa Diop", role: "Maître menuisier", exp: 10, photo: "/images/plateforme/portraits/moussa-diop.jpg" },
  { id: "fatou-sarr-elec", domaines: ["electricite"], competences: ["Normes NF C 15-100", "Installation résidentielle", "Sécurité sur chantier", "Devis & Facturation"], nom: "Fatou Sarr", role: "Électricienne bâtiment", exp: 18, photo: "/images/plateforme/portraits/fatou-sarr.jpg" },
  { id: "ousmane-ba-macon", domaines: ["btp"], competences: ["Maçonnerie", "Lecture de plans", "Gestion de chantier", "Devis"], nom: "Ousmane Ba", role: "Chef maçon BTP", exp: 8, photo: "/images/plateforme/portraits/ousmane-ba.jpg" },
  { id: "mariama-sow-plomberie", domaines: ["plomberie"], competences: ["Installation sanitaire", "Recherche de fuite", "Relation client", "Devis"], nom: "Mariama Sow", role: "Plombière sanitaire", exp: 14, photo: "/images/plateforme/portraits/mariama-sow.jpg" },
  { id: "ibrahima-diallo-soudeur", domaines: ["metallerie"], competences: ["Soudure TIG/MIG", "Portails et grilles", "Sécurité", "Devis"], nom: "Ibrahima Diallo", role: "Soudeur industriel", exp: 20, photo: "/images/plateforme/portraits/ibrahima-diallo.jpg" },
  { id: "aissatou-dia-patisserie", domaines: ["cuisine"], competences: ["Pâtisserie", "Hygiène alimentaire", "Prix de revient", "Vente"], nom: "Aissatou Dia", role: "Pâtissière et restauratrice", exp: 7, photo: "/images/plateforme/portraits/aissatou-dia.jpg" },
  { id: "papa-seck-btp", domaines: ["btp", "electricite", "plomberie", "menuiserie", "metallerie"], competences: ["Créer son entreprise", "Répondre aux appels d’offres", "Gestion de chantier", "Constituer une équipe"], nom: "Papa Seck", role: "Entrepreneur BTP", exp: 16, photo: "/images/plateforme/portraits/papa-seck.jpg" },
  { id: "khady-toure-teinture", domaines: ["couture"], competences: ["Teinture", "Création de motifs", "Vente en ligne", "Gestion de stock"], nom: "Khady Touré", role: "Teinturière et formatrice", exp: 11, photo: "/images/plateforme/portraits/khady-toure.jpg" },
  { id: "babacar-niang-carrelage", domaines: ["btp"], competences: ["Carrelage", "Finitions", "Métrés", "Devis"], nom: "Babacar Niang", role: "Carreleur et décorateur", exp: 22, photo: "/images/plateforme/portraits/babacar-niang.jpg" },
  { id: "ndeye-mbaye-coiffure", domaines: ["coiffure"], competences: ["Coiffure", "Tresses", "Gestion de salon", "Fidélisation"], nom: "Ndèye Mbaye", role: "Coiffeuse et gérante de salon", exp: 9, photo: "/images/plateforme/portraits/ndeye-mbaye.jpg" },
];

const MENTORS_PAR_PAGE = 5;

/* Encart « Votre mentor » en tête de l’écran Mentors : le mentor attitré (celui qui a un historique de séances),
   son prochain coaching et l’accès direct à son profil. */
function MentorAttitreCard({ m, coachings, onOpen }) {
  const profil = mentorProfile(m);
  const prochain = coachings.upcoming[0];
  return (
    <section aria-labelledby="mentor-attitre" className="overflow-hidden rounded-lg border border-marque bg-surface">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <SafeImg src={m.photo} alt={m.nom} className="h-20 w-20 shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <App.Badge ton="marque" point taille="moyen">Votre mentor</App.Badge>
            <h2 id="mentor-attitre" className="mt-2 text-xl font-semibold text-principal">{m.nom}</h2>
            <p className="text-sm text-secondaire">{m.role} · {m.exp} ans d’expérience</p>
            <p className="mt-2 text-sm leading-[1.7] text-secondaire">{profil.bio}</p>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 lg:w-72 lg:grid-cols-1">
          <div className="rounded-md bg-marque-doux px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-marque-fort"><Calendar size={14} aria-hidden="true" /> Prochain coaching</p>
            <p className="mt-0.5 text-sm font-semibold text-principal">{prochain ? prochain.date : "Aucun coaching prévu"}</p>
            {prochain && <p className="text-xs text-secondaire">{prochain.theme} · {prochain.format}</p>}
          </div>
          <div className="rounded-md bg-doux px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-secondaire"><CheckCircle2 size={14} aria-hidden="true" /> Séances réalisées</p>
            <p className="mt-0.5 text-sm font-semibold text-principal">{coachings.history.length}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base bg-doux/50 px-5 py-3 sm:px-6">
        <Etiquettes items={m.competences || profil.themes} max={3} />
        <App.Bouton petit onClick={() => onOpen(m)} aria-label={`Voir le profil et les séances de ${m.nom}`}>
          Voir son profil et mes séances <ChevronRight size={15} aria-hidden="true" />
        </App.Bouton>
      </div>
    </section>
  );
}
const FORMATS_MENTORAT = ["Visio", "Téléphone", "Au bureau de Dakar"];

function MentorsScreen({ initialMentorId, dataset }) {
  const BASE = dataset || MENTORS;
  const estPrestataire = BASE === MENTORS_PRESTATAIRE;
  const { metier, domaine } = useDomainePrestataire();
  const ALL = estPrestataire ? BASE.filter((m) => dansDomaine(m, domaine)) : BASE;
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("tous");
  const [selected, setSelected] = useState(() => ALL.find((m) => m.id === initialMentorId) || null);
  const [coachings, setCoachings] = useStore(`coachings-${estPrestataire ? "p" : "c"}`, {});
  const [page, setPage] = useState(1);
  const ouvrir = (m) => { setSelected(m); window.scrollTo(0, 0); };

  if (selected) {
    const current = coachings[selected.id] || defaultCoachings(selected);
    return (
      <MentorDetail
        key={selected.id}
        mentor={selected}
        coachings={current}
        onUpdate={(fn) => setCoachings((c) => ({ ...c, [selected.id]: fn(c[selected.id] || defaultCoachings(selected)) }))}
        onBack={() => setSelected(null)}
      />
    );
  }

  // Le mentor attitré est mis en avant à part ; la liste montre les autres mentors à découvrir.
  const attitre = ALL.find((m) => m.historique);
  const autres = attitre ? ALL.filter((m) => m.id !== attitre.id) : ALL;
  const q = sansAccents(query.trim());
  const filtered = autres.filter((m) => {
    const profil = mentorProfile(m);
    return (!q || sansAccents([m.nom, m.role, ...(m.competences || profil.themes)].join(" ")).includes(q)) &&
      (format === "tous" || profil.formats.includes(format));
  });
  const pages = Math.max(1, Math.ceil(filtered.length / MENTORS_PAR_PAGE));
  const pageCourante = Math.min(page, pages);
  const paged = filtered.slice((pageCourante - 1) * MENTORS_PAR_PAGE, pageCourante * MENTORS_PAR_PAGE);
  const filtresActifs = q || format !== "tous";

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">
        {estPrestataire
          ? "Des professionnels de votre métier, vérifiés par LIGGEEY, vous aident à développer votre activité : devis, normes, clientèle."
          : "Des professionnels vérifiés par LIGGEEY vous accompagnent pour préparer votre insertion : CV, entretiens, orientation."}
      </p>
      {estPrestataire && <NoteDomaine metier={metier} domaine={domaine} texte="Mentors choisis" />}

      {attitre && <MentorAttitreCard m={attitre} coachings={coachings[attitre.id] || defaultCoachings(attitre)} onOpen={ouvrir} />}

      <div>
        <h2 className="text-lg font-semibold text-principal">{attitre ? "Découvrir d’autres mentors" : "Choisir un mentor"}</h2>
        <p className="mt-1 text-sm text-secondaire">
          {attitre
            ? `Besoin d’un autre regard ? Consultez leurs profils et réservez un coaching avec le mentor de votre choix, en plus de ${attitre.nom.split(" ")[0]}.`
            : "Consultez les profils et réservez un premier coaching avec le mentor de votre choix."}
        </p>
      </div>

      <BarreFiltres label="Rechercher et filtrer les mentors">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          placeholder="Nom, métier ou compétence…"
          label="Rechercher un mentor"
          className="w-full lg:flex-1"
        />
        <App.SelecteurPeriode
          icone={Video}
          label="Format des séances"
          valeur={format}
          onChange={(v) => { setFormat(v); setPage(1); }}
          options={[{ id: "tous", label: "Tous les formats" }, ...FORMATS_MENTORAT]}
        />
      </BarreFiltres>

      <div className="flex justify-end">
        <CompteResultats n={filtered.length} nom="mentor" />
      </div>

      {paged.length > 0 ? (
        <div className="space-y-4">
          {paged.map((m) => <MentorCard key={m.id} m={m} onOpen={ouvrir} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-base bg-surface">
          <App.EtatVide
            icone={Search}
            titre="Aucun mentor ne correspond à votre recherche"
            texte="Essayez d’autres mots-clés ou retirez un filtre."
            action={filtresActifs && <App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setFormat("tous"); setPage(1); }}>Effacer les filtres</App.Bouton>}
          />
        </div>
      )}

      {filtered.length > MENTORS_PAR_PAGE && (
        <Pagination page={pageCourante} pageSize={MENTORS_PAR_PAGE} totalItems={filtered.length} onPageChange={setPage} />
      )}
    </div>
  );
}

/* ---------- Profils : pièces communes ----------
   Chaque espace a sa page « Mon profil » au même format que les fiches (en-tête, chiffres clés,
   contenu à gauche, colonne « Mes informations » à droite). Les chiffres viennent des mêmes données
   que les autres écrans, et la complétion du profil est calculée par les mêmes fonctions que le
   tableau de bord, pour que tout concorde. */

function pourcentageFait(items) {
  return Math.round((items.filter((i) => i.fait).length / items.length) * 100);
}

function CarteCompletion({ completion, onAction }) {
  return (
    <App.Carte titre="Profil complété" actions={<span className="text-lg font-semibold text-marque">{completion.valeur} %</span>}>
      <App.BarreProgression valeur={completion.valeur} ton={completion.valeur === 100 ? "succes" : "marque"} label={`Profil complété à ${completion.valeur} %`} />
      <div className="mt-4">
        {completion.items.map((i) => <ChecklistItem key={i.label} label={i.label} done={i.fait} />)}
      </div>
      {onAction && completion.valeur < 100 && (
        <div className="mt-4">
          <App.Bouton petit variante="doux" onClick={onAction}>Compléter mon profil</App.Bouton>
        </div>
      )}
    </App.Carte>
  );
}

function ChiffresProfil({ items }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => <StatCard key={s.label} icon={s.icone} value={s.valeur} label={s.label} detail={s.detail} tone={s.ton} onClick={s.onClick} />)}
    </div>
  );
}

/* ---------- Chercheur d’emploi ---------- */

const CV_CHERCHEUR_INITIAL = { nom: "CV_Absatou_Diallo.pdf", date: "28 juillet 2026" };
const LANGUES_CHERCHEUR = [{ l: "Français", n: "Courant" }, { l: "Wolof", n: "Langue maternelle" }, { l: "Anglais", n: "Intermédiaire" }];
const COMPETENCES_CHERCHEUR = ["Relation client", "Communication", "Excel", "Comptabilité de base", "Anglais professionnel"];
const VERIF_CHERCHEUR = {
  "a-transmettre": { ton: "neutre", label: "Identité à vérifier" },
  "en-cours": { ton: "alerte", label: "Vérification en cours" },
  verifie: { ton: "succes", label: "Profil vérifié" },
};

function useCompletionChercheur() {
  const [info] = useStore("profil-chercheur", PROFIL_CHERCHEUR_INITIAL);
  const [cv] = useStore("cv-chercheur", CV_CHERCHEUR_INITIAL);
  const [verif] = useStore("verif-chercheur", "a-transmettre");
  const items = [
    { label: "Informations personnelles", fait: ["email", "telephone", "ville", "profession"].every((k) => String(info[k] || "").trim()) },
    { label: "CV", fait: !!cv },
    { label: "Compétences et langues", fait: COMPETENCES_CHERCHEUR.length > 0 && LANGUES_CHERCHEUR.length > 0 },
    { label: "Vérification d’identité", fait: verif === "verifie" },
  ];
  return { items, valeur: pourcentageFait(items) };
}

/* ---------- Prestataire ---------- */

const PRESTATAIRE_DETAILS = {
  experience: "8 ans",
  membreDepuis: "Janvier 2024",
  disponibilite: "Lundi – samedi, 8 h – 18 h · urgences 24 h/24",
  langues: [{ l: "Wolof", n: "Langue maternelle" }, { l: "Français", n: "Courant" }],
  certifications: ["CAP Électricité (2018)", "Formation sécurité électrique Senelec (2020)", "Attestation installation solaire (2023)"],
};

function useCompletionPrestataire() {
  const [info] = useStore("profil-prestataire", PROFIL_PRESTATAIRE_INITIAL);
  const [services] = useStore("services", SERVICES_INITIAL);
  const api = usePlan();
  const regul = api && api.regulSteps ? regulSummary(api.regulSteps) : null;
  const items = [
    { label: "Informations personnelles", fait: ["metier", "email", "telephone", "localisation"].every((k) => String(info[k] || "").trim()) },
    { label: "Au moins un service", fait: services.length > 0 },
    { label: "Réalisations", fait: PORTFOLIO_REALISATIONS.length > 0 },
  ];
  return { items, valeur: pourcentageFait(items), regul };
}

/* ---------- Entreprise ---------- */

const CHAMPS_PROFIL_ENTREPRISE = [
  ["nom", "Nom de l’entreprise"], ["secteurPrincipal", "Secteur"], ["ninea", "NINEA"], ["rccm", "RCCM"],
  ["telephone", "Téléphone"], ["email", "E-mail"], ["siteWeb", "Site web"], ["adresse", "Adresse"], ["description", "Présentation"], ["logo", "Logo"],
];
const RECRUTEUR_ENTREPRISE = { fonction: "Responsable du recrutement", telephone: "+221 77 845 21 10", email: "awa.diallo@senegalconstruct.sn" };

function useCompletionEntreprise() {
  const [profile] = useStore("profil-entreprise", PROFIL_ENTREPRISE_INITIAL);
  const manquants = CHAMPS_PROFIL_ENTREPRISE.filter(([k]) => !String(profile[k] || "").trim());
  const items = [
    { label: "Informations légales (NINEA, RCCM)", fait: !!(profile.ninea && profile.rccm) },
    { label: "Coordonnées", fait: !!(profile.telephone && profile.email && profile.adresse) },
    { label: "Présentation", fait: !!String(profile.description || "").trim() },
    { label: "Logo", fait: !!profile.logo },
  ];
  return { items, valeur: Math.round(((CHAMPS_PROFIL_ENTREPRISE.length - manquants.length) / CHAMPS_PROFIL_ENTREPRISE.length) * 100) };
}

/* ---------- Screen 10 : Mon Profil ---------- */

function ChecklistItem({ label, done }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: done ? COLORS.success : "transparent", border: done ? "none" : `1.5px solid ${COLORS.orange}` }}
      >
        {done && <Check size={11} color={COLORS.onStatus} />}
      </span>
      <span className="text-sm" style={{ color: done ? COLORS.slate : COLORS.orangeText, fontWeight: done ? 400 : 600 }}>{label}</span>
      {!done && <span className="text-xs" style={{ color: COLORS.slateLight }}> - à compléter</span>}
    </div>
  );
}

function ProfilScreen({ onNavigate }) {
  const user = USER_BY_ESPACE.chercheur;
  const [info, setInfo] = useStore("profil-chercheur", PROFIL_CHERCHEUR_INITIAL);
  const [cv, setCv] = useStore("cv-chercheur", CV_CHERCHEUR_INITIAL);
  const [verif, setVerif] = useStore("verif-chercheur", "a-transmettre");
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const [formationsInscrites] = useStore("formations-inscrites-c", () => FORMATIONS_ALL.filter((f) => f.enrolled).map((f) => f.id));
  const [editing, setEditing] = useState(false);
  const [showVerifInfo, setShowVerifInfo] = useState(false);
  const completion = useCompletionChercheur();

  const embauche = candidatures.find((c) => c.embauche);
  const enCours = candidatures.filter(GROUPES_CANDIDATURE.find((g) => g.id === "cours").test).length;
  const mentor = MENTORS.find((m) => m.historique);
  const etatVerif = VERIF_CHERCHEUR[verif] || VERIF_CHERCHEUR["a-transmettre"];

  return (
    <div className="space-y-6">
      {editing && (
        <ProfilInfoModal
          nom={user.name}
          values={info}
          fields={[{ key: "profession", label: "Métier recherché" }, { key: "email", label: "E-mail", type: "email" }, { key: "telephone", label: "Téléphone", type: "tel" }, { key: "ville", label: "Ville" }]}
          onSave={(v) => { setInfo(v); notify("Profil mis à jour."); }}
          onClose={() => setEditing(false)}
        />
      )}

      <EnTeteFiche
        visuel={<AvatarListe nom={user.name} photo="/images/plateforme/portraits/absatou-diallo.jpg" taille="lg" />}
        badges={<>
          <ProfileTierBadge />
          <App.Badge ton={etatVerif.ton} taille="moyen">{etatVerif.label}</App.Badge>
          {embauche
            ? <App.Badge ton="succes" point taille="moyen">En poste chez {embauche.entreprise}</App.Badge>
            : <App.Badge ton="succes" point taille="moyen">Disponible immédiatement</App.Badge>}
        </>}
        titre={user.name}
        sousTitre={embauche ? `${embauche.poste} · ${embauche.entreprise}` : info.profession}
        meta={<>
          <MetaOffre icone={MapPin}>{info.ville}</MetaOffre>
          {!embauche && <MetaOffre icone={Briefcase}>Métier recherché : {info.profession}</MetaOffre>}
          {embauche && <MetaOffre icone={HeartHandshake}>Suivi post-embauche en cours</MetaOffre>}
        </>}
        actions={<>
          <App.Bouton onClick={() => setEditing(true)}><Pencil size={16} aria-hidden="true" /> Modifier le profil</App.Bouton>
        </>}
      />

      <ChiffresProfil
        items={[
          { icone: FileText, valeur: candidatures.length, label: "Candidatures envoyées", detail: "Voir mes candidatures", onClick: () => onNavigate("candidatures") },
          { icone: ClipboardList, valeur: enCours, label: "Candidatures en cours", detail: "En attente de réponse", ton: "alerte", onClick: () => onNavigate("candidatures") },
          { icone: GraduationCap, valeur: formationsInscrites.length, label: "Formations suivies", detail: "Voir mes formations", ton: "info", onClick: () => onNavigate("formations", { tab: "mes" }) },
          { icone: UserCircle2, valeur: `${completion.valeur} %`, label: "Profil complété", detail: completion.valeur < 100 ? "Encore quelques étapes" : "Profil complet", ton: "succes" },
        ]}
      />

      <MiseEnPageFiche
        principal={<>
          {embauche && (
            <App.Carte titre="Mon emploi" actions={<StatusBadge status="Candidature retenue" />}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <LogoEntreprise nom={embauche.entreprise} />
                  <div className="min-w-0">
                    <p className="font-semibold text-principal">{embauche.poste}</p>
                    <p className="text-sm text-discret">{embauche.entreprise} · {embauche.ville} · retenue le {embauche.date}</p>
                  </div>
                </div>
                <App.Bouton petit variante="doux" onClick={() => onNavigate("suivi")}><HeartHandshake size={15} aria-hidden="true" /> Mon suivi post-embauche</App.Bouton>
              </div>
            </App.Carte>
          )}

          <App.Carte titre="Compétences">
            <Etiquettes items={COMPETENCES_CHERCHEUR} />
          </App.Carte>

          <App.Carte titre="Mon CV">
            <div className="flex items-center justify-between gap-3 rounded-md border border-base px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <App.PastilleIcone icone={FileText} taille="sm" />
                <div className="min-w-0">
                  <p className="break-all text-sm font-medium text-principal">{cv ? cv.nom : "Aucun CV"}</p>
                  {cv && <p className="text-xs text-discret">Ajouté le {cv.date}</p>}
                </div>
              </div>
              <FilePickerButton
                accept=".pdf,.doc,.docx"
                onPick={(f) => { setCv({ nom: f.name, date: dateFr(demoNow()) }); notify("CV remplacé."); }}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded bg-marque-doux px-4 text-sm font-semibold text-marque-fort hover:bg-marque-doux-survol"
              >
                {cv ? "Remplacer" : "Ajouter"}
              </FilePickerButton>
            </div>
          </App.Carte>

          <App.Carte titre="Vérification d’identité" sousTitre="Obtenez le badge « profil vérifié »" actions={<App.Badge ton={etatVerif.ton} taille="moyen">{etatVerif.label}</App.Badge>}>
            {verif === "verifie" ? (
              <p className="text-sm text-secondaire">Votre pièce d’identité et vos diplômes ont été vérifiés par l’équipe LIGGEEY.</p>
            ) : verif === "en-cours" ? (
              <p className="inline-flex items-center gap-2 rounded-md bg-statut-succes-doux px-4 py-3 text-sm text-statut-succes">
                <CheckCircle2 size={16} aria-hidden="true" /> Documents transmis : vérification sous 48 h ouvrées.
              </p>
            ) : (
              <>
                <p className="mb-4 text-sm text-secondaire">
                  Pour rassurer les employeurs, transmettez une pièce d’identité en cours de validité et vos diplômes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <App.Bouton petit onClick={() => { setVerif("en-cours"); notify("Documents transmis. Vérification sous 48 h ouvrées."); }}>Transmettre mes documents</App.Bouton>
                  <App.Bouton petit variante="neutre" onClick={() => setShowVerifInfo((v) => !v)} aria-expanded={showVerifInfo}>
                    {showVerifInfo ? "Masquer" : "En savoir plus"}
                  </App.Bouton>
                </div>
                {showVerifInfo && (
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondaire">
                    L’équipe LIGGEEY contrôle votre pièce d’identité et vos diplômes sous 48&nbsp;h ouvrées. Un profil vérifié affiche un badge auprès des recruteurs et remonte en priorité dans leurs recherches. Vos documents ne sont jamais partagés sans votre accord.
                  </p>
                )}
              </>
            )}
          </App.Carte>

          {mentor && (
            <App.Carte titre="Mon mentor">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <AvatarListe nom={mentor.nom} photo={mentor.photo} />
                  <div className="min-w-0">
                    <p className="font-semibold text-principal">{mentor.nom}</p>
                    <p className="text-sm text-discret">{mentor.role} · {mentor.exp} ans d’expérience</p>
                  </div>
                </div>
                <App.Bouton petit variante="neutre" onClick={() => onNavigate("mentors", { mentorId: mentor.id })}>Voir mon mentor</App.Bouton>
              </div>
            </App.Carte>
          )}
        </>}
        cote={<>
          <ApercuFiche
            titre="Mes informations"
            items={[
              { icone: Briefcase, libelle: "Métier recherché", valeur: info.profession },
              { icone: Mail, libelle: "E-mail", valeur: info.email },
              { icone: Phone, libelle: "Téléphone", valeur: info.telephone },
              { icone: MapPin, libelle: "Ville", valeur: info.ville },
            ]}
          />
          <CarteCompletion completion={completion} />
          <App.Carte titre="Langues">
            <ul className="divide-y divide-dashed divide-base">
              {LANGUES_CHERCHEUR.map((x) => (
                <li key={x.l} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-principal">{x.l}</span>
                  <span className="text-secondaire">{x.n}</span>
                </li>
              ))}
            </ul>
          </App.Carte>
          <ProfileTierCard />
        </>}
      />
    </div>
  );
}

/* ---------- Screen 11 : Dashboard Prestataire ---------- */

const DEMANDES_RECENTES = [
  { titre: "Installation électrique", client: "Fatou Sarr", ville: "Dakar Plateau", prix: "85 000 FCFA", priorite: "Urgent", date: "Aujourd’hui, 10 h 30" },
  { titre: "Remplacement de disjoncteur", client: "Ousmane Ba", ville: "Médina", prix: "35 000 FCFA", priorite: "Normal", date: "Hier, 18 h 15" },
  { titre: "Câblage réseau bureau", client: "Aminata Diop", ville: "Almadies", prix: "120 000 FCFA", priorite: "Normal", date: "Aujourd’hui, 9 h 10" },
  { titre: "Dépannage compteur", client: "Cheikh Fall", ville: "Parcelles Assainies", prix: "25 000 FCFA", priorite: "Urgent", date: "Aujourd’hui, 8 h 45" },
];

function DemandeCard({ d }) {
  return (
    <div className="rounded-lg border p-4 mb-3" style={{ borderColor: COLORS.border, background: COLORS.soft }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>{d.titre}</p>
          <p className="text-xs" style={{ color: COLORS.orangeText }}>{d.client} · {d.ville}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{d.priorite}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{d.prix}</p>
        <p className="text-xs" style={{ color: COLORS.slateLight }}>{d.date}</p>
      </div>
    </div>
  );
}

function PrestataireDashboardScreen({ user, onNavigate, todos }) {
  const COMPLETION = useCompletionPrestataire().valeur;
  const [tousServices] = useStore("services", SERVICES_INITIAL);
  const [missions] = useStore("missions", MISSIONS_INITIAL);
  const services = tousServices.filter((sv) => sv.disponible);
  const missionsEnCours = missions.filter((m) => m.statut === "En cours" || m.statut === "Acceptée").length;
  const missionsTerminees = missions.filter((m) => m.statut === "Terminée").length;
  const maxMissions = Math.max(...services.map((sv) => sv.missions), 1);
  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Voici un aperçu de votre activité de prestataire.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} value={missionsEnCours} label="Missions en cours" detail="Acceptées ou en cours" onClick={() => onNavigate("missions")} />
        <StatCard icon={ClipboardCheck} value={missionsTerminees} label="Missions terminées" detail="Voir mes missions" tone="succes" onClick={() => onNavigate("missions")} />
        <StatCard icon={Star} value={`${noteFr(AVG_NOTE)}/5`} label="Note moyenne" detail={`${REVIEWS_DATA.length} avis de vos clients`} tone="alerte" onClick={() => onNavigate("evaluations")} />
        <App.CarteStat
          icone={UserCircle2}
          ton="info"
          titre="Profil complété"
          detail="Un profil vérifié rassure vos clients"
          valeur={`${COMPLETION} %`}
          visuel={<App.Anneau valeur={COMPLETION} taille={56} epaisseur={6} label={`Profil complété à ${COMPLETION} %`}>{" "}</App.Anneau>}
          onClick={() => onNavigate("profil")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte
          titre="Dernières demandes"
          className="xl:col-span-2"
          actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("missions")}>Tout voir</App.Bouton>}
        >
          <App.Tableau
            legende="Dernières demandes de mission"
            cleLigne="titre"
            lignes={DEMANDES_RECENTES}
            onLigne={() => onNavigate("missions")}
            colonnes={[
              { cle: "titre", titre: "Demande", rendu: (d) => <App.CelluleIdentite visuel={<App.Avatar nom={d.client} taille="sm" />} titre={d.titre} sousTitre={`${d.client} · ${d.ville}`} /> },
              { cle: "prix", titre: "Budget", rendu: (d) => <span className="font-medium text-principal">{d.prix}</span> },
              { cle: "date", titre: "Reçue", masqueMobile: true },
              { cle: "priorite", titre: "Priorité", rendu: (d) => <App.Badge ton={d.priorite === "Urgent" ? "danger" : "neutre"} taille="moyen">{d.priorite}</App.Badge> },
            ]}
          />
        </App.Carte>

        <App.Carte
          titre="Mes services actifs"
          sousTitre="Missions réalisées par service"
          actions={<App.BoutonIcone icone={Plus} label="Ajouter un service" variante="doux" taille="sm" onClick={() => onNavigate("services", { creer: true })} />}
        >
          <App.ListeClassee
            elements={services.slice(0, 5).map((sv) => ({
              id: sv.id,
              libelle: sv.nom,
              pourcentage: Math.round((sv.missions / maxMissions) * 100),
              valeur: `${sv.missions} missions`,
              visuel: <App.PastilleIcone icone={Wrench} taille="sm" />,
            }))}
          />
        </App.Carte>
      </div>

      <TodoPanel items={todos} onNavigate={onNavigate} />
    </div>
  );
}

/* ---------- Screen 12 : Services (Prestataire) ---------- */

/* ---------- Domaines de métier des prestataires ----------
   Le domaine est déduit du métier inscrit sur le profil du prestataire connecté. Il décide de ce qu’on
   lui propose : catégories et modèles de services, formations et mentors. Les formations et mentors
   marqués « tous » (gestion, relation client) sont proposés à tous les métiers. */

const DOMAINES_METIER = [
  {
    id: "electricite", label: "Électricité", mots: ["electri", "solaire", "domotique", "cablage"],
    categories: ["Installation", "Dépannage", "Mise aux normes", "Énergie solaire", "Domotique", "Éclairage", "Câblage réseau", "Maintenance", "Formation"],
    suggestions: [
      { nom: "Installation électrique complète", tag: "Installation" },
      { nom: "Remplacement de tableau électrique", tag: "Mise aux normes" },
      { nom: "Dépannage urgent", tag: "Dépannage" },
      { nom: "Pose de climatiseur", tag: "Installation" },
      { nom: "Kit solaire domestique", tag: "Énergie solaire" },
      { nom: "Contrôle annuel de l’installation", tag: "Maintenance" },
    ],
  },
  {
    id: "plomberie", label: "Plomberie", mots: ["plomb", "sanitaire"],
    categories: ["Installation sanitaire", "Dépannage", "Débouchage", "Chauffe-eau", "Maintenance"],
    suggestions: [
      { nom: "Réparation de fuite", tag: "Dépannage" },
      { nom: "Débouchage de canalisation", tag: "Débouchage" },
      { nom: "Pose de sanitaires", tag: "Installation sanitaire" },
      { nom: "Installation de chauffe-eau", tag: "Chauffe-eau" },
    ],
  },
  {
    id: "btp", label: "Bâtiment", mots: ["macon", "carrel", "peint", "btp", "batiment"],
    categories: ["Maçonnerie", "Carrelage", "Peinture", "Rénovation", "Finitions"],
    suggestions: [
      { nom: "Pose de carrelage", tag: "Carrelage" },
      { nom: "Peinture intérieure", tag: "Peinture" },
      { nom: "Construction de mur", tag: "Maçonnerie" },
      { nom: "Rénovation de pièce", tag: "Rénovation" },
    ],
  },
  {
    id: "metallerie", label: "Métallerie", mots: ["soud", "metal", "ferron"],
    categories: ["Soudure", "Portails et grilles", "Structures métalliques", "Réparation"],
    suggestions: [
      { nom: "Fabrication de portail", tag: "Portails et grilles" },
      { nom: "Grilles de fenêtre", tag: "Portails et grilles" },
      { nom: "Soudure sur place", tag: "Soudure" },
    ],
  },
  {
    id: "menuiserie", label: "Menuiserie", mots: ["menuis", "ebenist", "bois"],
    categories: ["Mobilier sur mesure", "Portes et fenêtres", "Réparation", "Agencement"],
    suggestions: [
      { nom: "Meuble sur mesure", tag: "Mobilier sur mesure" },
      { nom: "Pose de porte", tag: "Portes et fenêtres" },
      { nom: "Placard et dressing", tag: "Agencement" },
    ],
  },
  {
    id: "couture", label: "Couture", mots: ["coutur", "styl", "tailleur", "confection", "teintur"],
    categories: ["Confection sur mesure", "Retouches", "Tenues de cérémonie", "Teinture"],
    suggestions: [
      { nom: "Tenue sur mesure", tag: "Confection sur mesure" },
      { nom: "Retouches", tag: "Retouches" },
      { nom: "Grand boubou de cérémonie", tag: "Tenues de cérémonie" },
    ],
  },
  {
    id: "coiffure", label: "Coiffure et esthétique", mots: ["coiff", "esthet", "maquill"],
    categories: ["Coiffure", "Tresses", "Soins", "Maquillage", "À domicile"],
    suggestions: [
      { nom: "Tresses", tag: "Tresses" },
      { nom: "Coiffure de mariage", tag: "Coiffure" },
      { nom: "Maquillage", tag: "Maquillage" },
    ],
  },
  {
    id: "mecanique", label: "Mécanique", mots: ["mecan", "garag", "moto", "auto"],
    categories: ["Diagnostic", "Entretien", "Réparation", "Dépannage sur place"],
    suggestions: [
      { nom: "Vidange et entretien", tag: "Entretien" },
      { nom: "Diagnostic de panne", tag: "Diagnostic" },
      { nom: "Dépannage sur place", tag: "Dépannage sur place" },
    ],
  },
  {
    id: "cuisine", label: "Cuisine et pâtisserie", mots: ["cuisin", "patiss", "restaur", "traiteur"],
    categories: ["Traiteur", "Pâtisserie", "Cours de cuisine", "Événements"],
    suggestions: [
      { nom: "Service traiteur", tag: "Traiteur" },
      { nom: "Gâteau sur commande", tag: "Pâtisserie" },
      { nom: "Buffet pour cérémonie", tag: "Événements" },
    ],
  },
];

function domaineDuMetier(metier) {
  const t = sansAccents(metier);
  return DOMAINES_METIER.find((d) => d.mots.some((m) => t.includes(m))) || null;
}

/* Domaine du prestataire connecté (d’après le métier de son profil). */
function useDomainePrestataire() {
  const [info] = useStore("profil-prestataire", PROFIL_PRESTATAIRE_INITIAL);
  const metier = (info && info.metier) || PROFIL_PRESTATAIRE_INITIAL.metier;
  return { metier, domaine: domaineDuMetier(metier) };
}

/* Un élément (formation, mentor) concerne le domaine s’il le cite, ou s’il est marqué « tous ». */
function dansDomaine(item, domaine) {
  if (!domaine || !item.domaines) return true;
  return item.domaines.includes("tous") || item.domaines.includes(domaine.id);
}

function NoteDomaine({ metier, domaine, texte }) {
  if (!domaine) return null;
  return (
    <p className="flex items-start gap-2 rounded-md bg-marque-doux px-4 py-3 text-sm text-principal">
      <Wrench size={16} className="mt-0.5 shrink-0 text-marque" aria-hidden="true" />
      <span>{texte} pour votre métier : <span className="font-semibold">{metier}</span> ({domaine.label}). Pour changer de métier, modifiez votre profil.</span>
    </p>
  );
}

const SERVICES_INITIAL = [
  { id: "elec-bat", nom: "Électricité bâtiment", tag: "Installation", tarifBase: "25 000 FCFA", note: 4.5, missions: 15, disponible: true, description: "Installation, réparation et mise aux normes de systèmes électriques résidentiels et commerciaux. Câblage complet, pose de tableaux électriques, installation de prises et éclairage, dépannage urgent.", tarifDeplacement: "5 000 FCFA", tarifSimple: "15 000 - 25 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Pikine, Guédiawaye, Rufisque", disponibilite: "Du lundi au samedi, 8 h – 18 h | Urgences 24 h/7", avis: [{ auteur: "Fatou Sarr", note: 5, commentaire: "Excellent travail, rapide et soigné" }, { auteur: "Ousmane Ba", note: 4, commentaire: "Bon prestataire, ponctuel" }] },
  { id: "cablage", nom: "Câblage réseau", tag: "Câblage réseau", tarifBase: "50 000 FCFA", note: 4.8, missions: 8, disponible: true, description: "Installation et maintenance de réseaux informatiques et de télécommunication pour bureaux et résidences.", tarifDeplacement: "5 000 FCFA", tarifSimple: "40 000 - 60 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar", disponibilite: "Du lundi au samedi, 8 h – 18 h", avis: [{ auteur: "Aminata Diop", note: 5, commentaire: "Très satisfaite du câblage de mon bureau" }] },
  { id: "depannage", nom: "Dépannage électrique", tag: "Dépannage", tarifBase: "15 000 FCFA", note: 4.6, missions: 32, disponible: false, description: "Intervention rapide en cas de panne électrique, urgences comprises, 24 h/24 et 7j/7.", tarifDeplacement: "5 000 FCFA", tarifSimple: "10 000 - 20 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Guédiawaye", disponibilite: "Urgences 24 h/7", avis: [{ auteur: "Cheikh Fall", note: 5, commentaire: "Intervention rapide en urgence" }] },
  { id: "solaire", nom: "Installation solaire", tag: "Énergie solaire", tarifBase: "150 000 FCFA", note: 4.4, missions: 5, disponible: true, description: "Pose et raccordement de panneaux solaires domestiques.", tarifDeplacement: "10 000 FCFA", tarifSimple: "120 000 - 180 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Thiès", disponibilite: "Du lundi au vendredi, 8 h – 17 h", avis: [] },
  { id: "maintenance", nom: "Maintenance préventive", tag: "Maintenance", tarifBase: "20 000 FCFA", note: 4.7, missions: 12, disponible: false, description: "Contrôle et entretien périodique des installations électriques.", tarifDeplacement: "5 000 FCFA", tarifSimple: "15 000 - 25 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar", disponibilite: "Du lundi au samedi, 8 h – 18 h", avis: [] },
  { id: "domotique", nom: "Installation domotique", tag: "Domotique", tarifBase: "60 000 FCFA", note: 4.9, missions: 22, disponible: true, description: "Pilotage de l’éclairage, des volets et de la climatisation depuis un téléphone ou un interrupteur central.", tarifDeplacement: "5 000 FCFA", tarifSimple: "60 000 - 90 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Pikine", disponibilite: "Du lundi au samedi, 8 h – 18 h", avis: [] },
  { id: "eclairage", nom: "Éclairage LED", tag: "Éclairage", tarifBase: "20 000 FCFA", note: 4.3, missions: 18, disponible: true, description: "Remplacement de l’éclairage par des LED basse consommation, à l’intérieur comme à l’extérieur.", tarifDeplacement: "5 000 FCFA", tarifSimple: "20 000 - 45 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Thiès", disponibilite: "Du lundi au samedi, 8 h – 18 h", avis: [] },
  { id: "normes", nom: "Mise aux normes électriques", tag: "Mise aux normes", tarifBase: "40 000 FCFA", note: 4.6, missions: 9, disponible: true, description: "Diagnostic de l’installation et mise en conformité avec la norme NF C 15-100, avec un rapport remis au client.", tarifDeplacement: "5 000 FCFA", tarifSimple: "40 000 - 65 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar", disponibilite: "Du lundi au vendredi, 8 h – 17 h", avis: [] },
  { id: "formation-elec", nom: "Formation électricité", tag: "Formation", tarifBase: "75 000 FCFA", note: 5.0, missions: 2, disponible: true, description: "Initiation aux normes électriques et aux gestes de sécurité pour particuliers et professionnels.", tarifDeplacement: "—", tarifSimple: "75 000 FCFA / session", tarifComplete: "Sur devis (groupe)", zone: "Dakar", disponibilite: "Sur rendez-vous", avis: [] },
];

function ServiceCard({ s, onOpen, onEdit, onArchive }) {
  return (
    <CarteListe
      onOpen={() => onOpen(s)}
      visuel={<VisuelIcone icone={Wrench} />}
      titre={s.nom}
      badges={<App.Badge ton={s.disponible ? "succes" : "neutre"} point taille="moyen">{s.disponible ? "Disponible" : "Indisponible"}</App.Badge>}
      sousTitre={s.tag}
      meta={<>
        <MetaOffre icone={Wallet}>À partir de {s.tarifBase}</MetaOffre>
        <MetaOffre icone={Star}>{noteFr(s.note)}/5</MetaOffre>
        <MetaOffre icone={ClipboardCheck}>{s.missions} missions</MetaOffre>
        {s.zone && <MetaOffre icone={MapPin}>{s.zone}</MetaOffre>}
      </>}
      actions={<>
        {onEdit && <App.BoutonIcone icone={Pencil} label={`Modifier ${s.nom}`} onClick={() => onEdit(s)} />}
        {onArchive && <App.BoutonIcone icone={Archive} label={`Archiver ${s.nom}`} onClick={() => onArchive(s)} />}
        <App.Bouton petit variante="neutre" onClick={() => onOpen(s)}>Voir le service</App.Bouton>
      </>}
    />
  );
}

function ServiceForm({ initial, onSave, onCancel }) {
  const { metier, domaine } = useDomainePrestataire();
  const [values, setValues] = useState(
    initial || { nom: "", tag: "", description: "", tarifBase: "", tarifDeplacement: "", tarifSimple: "", tarifComplete: "Sur devis", zone: "", disponibilite: "", disponible: true, note: 0, missions: 0, avis: [] }
  );
  const [essai, setEssai] = useState(false);
  const erreurs = {
    nom: !values.nom.trim() && "Donnez un nom à votre service.",
    tag: !values.tag.trim() && "Choisissez une catégorie.",
    description: !values.description.trim() && "Décrivez votre service en quelques phrases.",
    tarifBase: !values.tarifBase.trim() && "Indiquez un tarif de base.",
  };
  const err = (k) => (essai ? erreurs[k] : null);

  function set(k, v) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  function enregistrer(e) {
    e.preventDefault();
    setEssai(true);
    if (Object.values(erreurs).some(Boolean)) return;
    onSave({ ...values, id: initial?.id || values.nom.toLowerCase().replace(/\s+/g, "-") });
  }

  const attrs = (id, k, requis, aide) => ({
    id,
    value: values[k],
    onChange: (e) => set(k, e.target.value),
    "aria-required": requis || undefined,
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) || aide ? `${id}-aide` : undefined,
  });

  return (
    <App.Carte
      as="form"
      onSubmit={enregistrer}
      noValidate
      titre={initial ? "Modifier un service" : "Ajouter un service"}
      sousTitre="Les champs marqués d’un * sont obligatoires."
    >
      {!initial && domaine && (
        <fieldset className="mb-6 rounded-lg bg-doux p-4">
          <legend className="sr-only">Services courants</legend>
          <p className="mb-3 text-sm text-secondaire">Services courants pour votre métier ({metier}) : choisissez-en un pour gagner du temps.</p>
          <div className="flex flex-wrap gap-2">
            {domaine.suggestions.map((sg) => {
              const choisi = values.nom === sg.nom;
              return (
                <button
                  key={sg.nom}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, nom: sg.nom, tag: sg.tag }))}
                  aria-pressed={choisi}
                  className={FORM.pastille(choisi)}
                >
                  {choisi && <Check size={15} className="text-marque" aria-hidden="true" />}
                  {sg.nom}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <h3 className={FORM.section}>Le service</h3>
      <div className={`${FORM.grille} mb-8`}>
        <Champ id="service-nom" label="Nom du service" requis erreur={err("nom")} large>
          <input {...attrs("service-nom", "nom", true)} placeholder="Ex. : Installation électrique" className={AUTH.champ(err("nom"))} />
        </Champ>
        <Champ id="service-categorie" label="Catégorie" requis erreur={err("tag")}>
          {domaine ? (
            <ListeChamp {...attrs("service-categorie", "tag", true)} erreur={err("tag")}>
              <option value="">Choisir ({domaine.label})</option>
              {[...domaine.categories, ...(values.tag && !domaine.categories.includes(values.tag) ? [values.tag] : [])].map((c) => <option key={c}>{c}</option>)}
            </ListeChamp>
          ) : (
            <input {...attrs("service-categorie", "tag", true)} placeholder="Ex. : Électricité" className={AUTH.champ(err("tag"))} />
          )}
        </Champ>
        <Champ id="service-zone" label="Zone d’intervention" aide="Quartiers ou villes où vous vous déplacez.">
          <input {...attrs("service-zone", "zone", false, true)} placeholder="Ex. : Dakar, Pikine" className={AUTH.champ()} />
        </Champ>
        <Champ id="service-description" label="Description" requis erreur={err("description")} aide="Ce que vous faites, votre matériel, votre expérience." large>
          <textarea {...attrs("service-description", "description", true, true)} rows={4} className={FORM.zone(err("description"))} />
        </Champ>
      </div>

      <h3 className={FORM.section}>Tarif et disponibilité</h3>
      <div className={`${FORM.grille} mb-4`}>
        <Champ id="service-tarif" label="Tarif de base" requis erreur={err("tarifBase")} aide="Le prix de départ affiché aux clients.">
          <input {...attrs("service-tarif", "tarifBase", true, true)} placeholder="Ex. : 25 000 FCFA" className={AUTH.champ(err("tarifBase"))} />
        </Champ>
        <Champ id="service-disponibilite" label="Disponibilité">
          <input {...attrs("service-disponibilite", "disponibilite")} placeholder="Ex. : Lundi au samedi, 8 h à 18 h" className={AUTH.champ()} />
        </Champ>
      </div>
      <div className="rounded-lg border border-base px-4 py-2">
        <App.Interrupteur
          actif={values.disponible}
          onChange={(v) => set("disponible", v)}
          label="Service disponible"
          description="Les clients peuvent vous envoyer une demande pour ce service."
        />
      </div>

      {essai && Object.values(erreurs).some(Boolean) && (
        <p role="alert" className="mt-5 text-sm text-statut-danger">Complétez les champs signalés pour enregistrer le service.</p>
      )}
      <div className={FORM.actions}>
        <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
        <App.Bouton type="submit">{initial ? "Enregistrer les modifications" : "Ajouter le service"}</App.Bouton>
      </div>
    </App.Carte>
  );
}

function ArchiveConfirm({ onCancel, onConfirm }) {
  return (
    <ModalFrame onClose={onCancel} labelledBy="archive-service-title" maxWidth="max-w-sm">
      <div className="p-6">
        <h3 id="archive-service-title" className="mb-2 text-lg font-semibold text-principal">Archiver ce service ?</h3>
        <p className="mb-6 text-sm text-secondaire">
          Ce service ne sera plus visible par vos clients. Vous pourrez le réactiver plus tard.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
          <BoutonDanger onClick={onConfirm}>Archiver</BoutonDanger>
        </div>
      </div>
    </ModalFrame>
  );
}

function ServiceDetail({ service, onEdit, onDelete, onBack }) {
  const note = noteFr(service.note);
  const tarifs = [
    ["Déplacement", service.tarifDeplacement],
    ["Intervention simple", service.tarifSimple],
    ["Installation complète", service.tarifComplete],
  ].filter(([, v]) => v);
  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux services</BoutonRetour>

      <EnTeteFiche
        visuel={<VisuelIcone icone={Wrench} taille="lg" />}
        badges={<>
          <App.Badge ton={service.disponible ? "succes" : "neutre"} point taille="moyen">{service.disponible ? "Actif" : "Inactif"}</App.Badge>
          <App.Badge ton="marque" taille="moyen">{service.tag}</App.Badge>
        </>}
        titre={service.nom}
        sousTitre={`À partir de ${service.tarifBase}`}
        meta={<>
          <MetaOffre icone={Star}>{note}/5</MetaOffre>
          <MetaOffre icone={ClipboardCheck}>{service.missions} missions réalisées</MetaOffre>
          {service.zone && <MetaOffre icone={MapPin}>{service.zone}</MetaOffre>}
        </>}
        actions={<>
          <App.Bouton variante="neutre" onClick={onEdit}><Pencil size={16} aria-hidden="true" /> Modifier</App.Bouton>
          <App.Bouton variante={service.disponible ? "doux" : "principal"} onClick={onDelete}>{service.disponible ? "Désactiver" : "Réactiver"}</App.Bouton>
        </>}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Description">
            <p className="text-[15px] leading-[1.7] text-secondaire">{service.description}</p>
          </App.Carte>
          {tarifs.length > 0 && (
            <App.Carte titre="Tarification">
              <dl className="divide-y divide-base">
                {tarifs.map(([libelle, valeur]) => (
                  <div key={libelle} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <dt className="text-sm text-secondaire">{libelle}</dt>
                    <dd className="text-sm font-semibold text-principal">{valeur}</dd>
                  </div>
                ))}
              </dl>
            </App.Carte>
          )}
          <App.Carte titre="Derniers avis clients" sousTitre={`${(service.avis || []).length} avis`}>
            <ListeAvis avis={service.avis || []} />
          </App.Carte>
        </>}
        cote={
          <ApercuFiche
            titre="Aperçu du service"
            items={[
              { icone: Wallet, libelle: "Tarif de base", valeur: service.tarifBase },
              { icone: MapPin, libelle: "Zone d’intervention", valeur: service.zone },
              { icone: Clock, libelle: "Disponibilité", valeur: service.disponibilite },
              { icone: Star, libelle: "Note moyenne", valeur: `${note}/5` },
              { icone: ClipboardCheck, libelle: "Missions réalisées", valeur: service.missions },
            ]}
          />
        }
      />
    </div>
  );
}

function ServicesScreen({ creer = false }) {
  const [services, setServices] = useStore("services", SERVICES_INITIAL);
  const [query, setQuery] = useState("");
  const [categorie, setCategorie] = useState("toutes");
  const [dispo, setDispo] = useState("tous");
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit | create
  const [toDelete, setToDelete] = useState(null);

  const planApi = usePlan();
  const serviceLimit = planApi ? planApi.limitOf("services") : UNLIMITED;
  useEffect(() => { if (planApi) planApi.setUsed("services", services.length); }, [services.length]);
  function openCreate() {
    if (services.length >= serviceLimit) { planApi.requestUpgrade("services"); return; }
    setMode("create");
  }
  // Ouvert depuis le raccourci « Ajouter un service » de la barre d’icônes.
  useEffect(() => { if (creer) openCreate(); }, []);

  const categories = Array.from(new Set(services.map((s) => s.tag))).sort();
  const q = sansAccents(query.trim());
  const DISPOS = [
    { id: "tous", label: "Tous", test: () => true },
    { id: "disponibles", label: "Disponibles", test: (s) => s.disponible },
    { id: "indisponibles", label: "Indisponibles", test: (s) => !s.disponible },
  ];
  const filtered = services.filter((s) =>
    (!q || sansAccents([s.nom, s.tag, s.description, s.zone].join(" ")).includes(q)) &&
    (categorie === "toutes" || s.tag === categorie) &&
    DISPOS.find((d) => d.id === dispo).test(s));
  const pagination = usePaginationListe(filtered);
  const filtresActifs = q || categorie !== "toutes" || dispo !== "tous";

  function saveService(values) {
    setServices((list) => {
      const exists = list.some((s) => s.id === values.id);
      return exists ? list.map((s) => (s.id === values.id ? values : s)) : [...list, values];
    });
    setSelected(values);
    setMode("view");
    notify("Service enregistré.");
  }

  function confirmDelete() {
    setServices((list) => list.filter((s) => s.id !== toDelete.id));
    setToDelete(null);
    setSelected(null);
    setMode("view");
    notify("Service archivé.", "info");
  }

  function toggleDisponible(id) {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, disponible: !s.disponible } : s)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, disponible: !sel.disponible } : sel));
  }

  if (mode === "create") {
    return (
      <div className="space-y-6">
        <BoutonRetour onClick={() => setMode("view")}>Retour aux services</BoutonRetour>
        <ServiceForm onSave={saveService} onCancel={() => setMode("view")} />
      </div>
    );
  }
  if (selected && mode === "edit") {
    return (
      <div className="space-y-6">
        <BoutonRetour onClick={() => setMode("view")}>Retour au service</BoutonRetour>
        <ServiceForm initial={selected} onSave={saveService} onCancel={() => setMode("view")} />
      </div>
    );
  }
  if (selected) {
    return (
      <ServiceDetail
        service={selected}
        onEdit={() => setMode("edit")}
        onDelete={() => toggleDisponible(selected.id)}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">
        Gérez les prestations que vous proposez à vos clients.
        {serviceLimit !== UNLIMITED && <span> {services.length} / {serviceLimit} services utilisés avec la formule {planApi.plan.nom}.</span>}
      </p>

      <BarreFiltres label="Rechercher et filtrer mes services">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Nom, catégorie ou zone…"
          label="Rechercher un service"
          className="w-full lg:flex-1"
        />
        <div className="flex flex-wrap items-center gap-2">
          <App.SelecteurPeriode
            icone={Layers}
            label="Catégorie"
            valeur={categorie}
            onChange={(v) => { setCategorie(v); pagination.setPage(1); }}
            options={[{ id: "toutes", label: "Toutes les catégories" }, ...categories]}
          />
          <App.Bouton petit onClick={openCreate}><Plus size={15} aria-hidden="true" /> Ajouter un service</App.Bouton>
        </div>
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Disponibilité"
          actif={dispo}
          onChange={(v) => { setDispo(v); pagination.setPage(1); }}
          options={DISPOS.map((d) => ({ id: d.id, label: `${d.label} (${services.filter(d.test).length})` }))}
        />
        <CompteResultats n={filtered.length} nom="service" />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((s) => (
            <ServiceCard
              key={s.id}
              s={s}
              onOpen={(ss) => { setSelected(ss); window.scrollTo(0, 0); }}
              onEdit={(ss) => { setSelected(ss); setMode("edit"); }}
              onArchive={(ss) => setToDelete(ss)}
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <ListeVide icone={Wrench} titre="Aucun service pour le moment" texte="Ajoutez votre premier service pour recevoir des demandes de clients." action={<App.Bouton petit onClick={openCreate}>Ajouter un service</App.Bouton>} />
      ) : (
        <ListeVide
          titre="Aucun service ne correspond"
          texte="Essayez d’autres mots-clés ou retirez un filtre."
          action={filtresActifs && <App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setCategorie("toutes"); setDispo("tous"); }}>Effacer les filtres</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
      {toDelete && <ArchiveConfirm onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />}
    </div>
  );
}

/* ---------- Screen 13 : Missions & Clients (Prestataire) ---------- */

const MISSIONS_INITIAL = [
  { id: "m1", titre: "Installation électrique complète", client: "Fatou Sarr", ville: "Dakar Plateau", budget: "85 000 FCFA", dateDemande: "Aujourd’hui, 10 h 30", statut: "En attente", description: "Le client souhaite une installation électrique complète pour un appartement de 4 pièces. Travaux incluant le câblage, la pose du tableau électrique, l’installation des prises et interrupteurs, et la mise en conformité.", type: "Installation complète", lieu: "Rue 10, Dakar Plateau", dateSouhaitee: "1er septembre 2026", dureeEstimee: "3 jours", telephone: "+221 77 123 45 67", email: "fatou.sarr@email.sn", membreDepuis: "Mars 2025", missionsPrecedentes: 2 },
  { id: "m2", titre: "Réparation prise défectueuse", client: "Ibrahima Diallo", ville: "Médina", budget: "15 000 FCFA", dateDemande: "Aujourd’hui, 5 h 15", statut: "En attente", description: "Une prise électrique dans la cuisine ne fonctionne plus et présente un léger échauffement. Intervention rapide souhaitée par sécurité.", type: "Dépannage", lieu: "Médina, Dakar", dateSouhaitee: "Dès que possible", dureeEstimee: "2 heures", telephone: "+221 77 456 78 90", email: "ibrahima.diallo@email.sn", membreDepuis: "Janvier 2024", missionsPrecedentes: 5 },
  { id: "m3", titre: "Câblage bureau 3 pièces", client: "Aminata Diop", ville: "Almadies", budget: "120 000 FCFA", dateDemande: "Hier, 9 h 10", statut: "Acceptée", description: "Câblage réseau et électrique complet pour un bureau de 3 pièces destiné à une petite entreprise.", type: "Câblage réseau", lieu: "Almadies, Dakar", dateSouhaitee: "5 septembre 2026", dureeEstimee: "2 jours", telephone: "+221 76 234 56 78", email: "aminata.diop@email.sn", membreDepuis: "Juin 2024", missionsPrecedentes: 1 },
  { id: "m4", titre: "Mise aux normes tableau", client: "Cheikh Fall", ville: "Parcelles Assainies", budget: "65 000 FCFA", dateDemande: "Aujourd’hui, 8 h 45", statut: "En cours", description: "Le tableau électrique doit être mis aux normes NF C 15-100 suite à un contrôle d’assurance.", type: "Mise aux normes", lieu: "Parcelles Assainies, Dakar", dateSouhaitee: "En cours", dureeEstimee: "1 jour", telephone: "+221 77 345 67 89", email: "cheikh.fall2@email.sn", membreDepuis: "Février 2023", missionsPrecedentes: 4 },
  { id: "m5", titre: "Installation éclairage LED", client: "Mariama Sow", ville: "Ouakam", budget: "45 000 FCFA", dateDemande: "Il y a 1 semaine", statut: "Terminée", description: "Remplacement de l’éclairage traditionnel par des LED basse consommation dans toute la maison.", type: "Installation", lieu: "Ouakam, Dakar", dateSouhaitee: "Terminée", dureeEstimee: "1 jour", telephone: "+221 76 567 89 01", email: "mariama.sow@email.sn", membreDepuis: "Mai 2022", missionsPrecedentes: 3 },
  { id: "m6", titre: "Dépannage urgent tableau", client: "Ousmane Ba", ville: "Médina", budget: "20 000 FCFA", dateDemande: "Il y a 2 jours", statut: "En attente", description: "Coupure générale récurrente sur le tableau électrique, intervention urgente demandée.", type: "Dépannage urgent", lieu: "Médina, Dakar", dateSouhaitee: "Dès que possible", dureeEstimee: "3 heures", telephone: "+221 78 678 90 12", email: "ousmane.ba@email.sn", membreDepuis: "Août 2024", missionsPrecedentes: 0 },
  { id: "m7", titre: "Maintenance annuelle installation", client: "Khady Touré", ville: "Liberté 6", budget: "30 000 FCFA", dateDemande: "Il y a 3 jours", statut: "Acceptée", description: "Contrôle et entretien annuel de l’installation électrique d’une villa.", type: "Maintenance", lieu: "Liberté 6, Dakar", dateSouhaitee: "10 septembre 2026", dureeEstimee: "1 jour", telephone: "+221 77 789 01 23", email: "khady.toure@email.sn", membreDepuis: "Mars 2021", missionsPrecedentes: 6 },
  { id: "m8", titre: "Installation panneaux solaires", client: "Babacar Niang", ville: "Ngor", budget: "200 000 FCFA", dateDemande: "Il y a 2 semaines", statut: "Terminée", description: "Installation d’un kit solaire domestique avec raccordement au tableau existant.", type: "Installation", lieu: "Ngor, Dakar", dateSouhaitee: "Terminée", dureeEstimee: "4 jours", telephone: "+221 76 890 12 34", email: "babacar.niang@email.sn", membreDepuis: "Octobre 2023", missionsPrecedentes: 2 },
];

const MISSION_TABS = [
  { id: "toutes", label: "Toutes" },
  { id: "En attente", label: "En attente" },
  { id: "Acceptée", label: "Acceptées" },
  { id: "En cours", label: "En cours" },
  { id: "Terminée", label: "Terminées" },
];

function MissionCard({ m, onOpen, onAccept, onRefuse }) {
  return (
    <CarteListe
      onOpen={() => onOpen(m)}
      visuel={<AvatarListe nom={m.client} />}
      titre={m.titre}
      badges={<StatusBadge status={m.statut} />}
      sousTitre={`${m.client} · ${m.ville}`}
      meta={<>
        <MetaOffre icone={Wallet}>{m.budget}</MetaOffre>
        <MetaOffre icone={Clock}>{m.dateDemande}</MetaOffre>
        {m.type && <MetaOffre icone={Wrench}>{m.type}</MetaOffre>}
      </>}
      actions={m.statut === "En attente" ? (
        <>
          <App.Bouton petit variante="neutre" onClick={() => onRefuse(m.id)}>Refuser</App.Bouton>
          <App.Bouton petit onClick={() => onAccept(m.id)}>Accepter</App.Bouton>
        </>
      ) : (
        <App.Bouton petit variante="neutre" onClick={() => onOpen(m)}>Voir la mission</App.Bouton>
      )}
    />
  );
}

function MissionDetail({ mission, onBack, onAccept, onRefuse, onCounterOffer }) {
  const planApi = usePlan();
  const [counterMode, setCounterMode] = useState(false);
  const [counterValue, setCounterValue] = useState("");
  const enAttente = mission.statut === "En attente";

  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux missions</BoutonRetour>

      <EnTeteFiche
        visuel={<AvatarListe nom={mission.client} taille="lg" />}
        badges={<>
          <StatusBadge status={mission.statut} />
          {mission.type && <App.Badge ton="neutre" taille="moyen">{mission.type}</App.Badge>}
        </>}
        titre={mission.titre}
        sousTitre={`Demande de ${mission.client} · ${mission.dateDemande}`}
        meta={<>
          <MetaOffre icone={MapPin}>{mission.lieu}</MetaOffre>
          <MetaOffre icone={CalendarDays}>{mission.dateSouhaitee}</MetaOffre>
          <MetaOffre icone={Clock}>{mission.dureeEstimee}</MetaOffre>
        </>}
        actions={enAttente && !counterMode && (
          <>
            <App.Bouton variante="neutre" onClick={() => onRefuse(mission.id)}>Refuser</App.Bouton>
            <App.Bouton variante="doux" onClick={() => (planApi ? planApi.gate("contreOffre", () => setCounterMode(true)) : setCounterMode(true))}>
              {planApi && !planApi.can("contreOffre") && <Lock size={15} aria-hidden="true" />} Proposer un autre tarif
            </App.Bouton>
            <App.Bouton onClick={() => onAccept(mission.id)}>Accepter la mission</App.Bouton>
          </>
        )}
      />

      {counterMode && (
        <App.Carte titre="Votre contre-proposition">
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => { e.preventDefault(); if (!counterValue.trim()) return; onCounterOffer(mission.id, counterValue); setCounterMode(false); }}
          >
            <div className="flex-1">
              <label htmlFor="contre-proposition" className={AUTH.libelle}>Montant proposé (FCFA)</label>
              <input
                id="contre-proposition"
                type="text"
                inputMode="numeric"
                value={counterValue}
                onChange={(e) => setCounterValue(e.target.value)}
                placeholder="Ex. : 70 000"
                className={FORM.champ()}
              />
            </div>
            <App.Bouton variante="neutre" onClick={() => setCounterMode(false)} className="min-h-[48px]">Annuler</App.Bouton>
            <App.Bouton type="submit" disabled={!counterValue.trim()} className="min-h-[48px]">Envoyer</App.Bouton>
          </form>
        </App.Carte>
      )}

      {mission.contreOffre && (
        <p className="rounded-md bg-statut-succes-doux px-4 py-3 text-sm text-statut-succes">
          Contre-proposition envoyée : {mission.contreOffre} FCFA. En attente de la réponse du client.
        </p>
      )}

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Description de la mission">
            <p className="text-[15px] leading-[1.7] text-secondaire">{mission.description}</p>
          </App.Carte>
          <App.Carte titre="Le client">
            <div className="mb-4 flex items-center gap-3">
              <AvatarListe nom={mission.client} />
              <div className="min-w-0">
                <p className="font-semibold text-principal">{mission.client}</p>
                <p className="text-sm text-discret">Client LIGGEEY depuis {mission.membreDepuis.toLowerCase()}</p>
              </div>
            </div>
            <div className="divide-y divide-dashed divide-base">
              <App.LigneInfo icone={Phone} libelle="Téléphone">{mission.telephone}</App.LigneInfo>
              <App.LigneInfo icone={Mail} libelle="E-mail">{mission.email}</App.LigneInfo>
              <App.LigneInfo icone={ClipboardCheck} libelle="Missions précédentes">{mission.missionsPrecedentes}</App.LigneInfo>
            </div>
          </App.Carte>
        </>}
        cote={<>
          <App.Carte titre="Budget proposé">
            <p className="text-[28px] font-semibold leading-none text-principal">{mission.budget}</p>
          </App.Carte>
          <ApercuFiche
            titre="Détails de la mission"
            items={[
              { icone: Wrench, libelle: "Type", valeur: mission.type },
              { icone: MapPin, libelle: "Lieu", valeur: mission.lieu },
              { icone: CalendarDays, libelle: "Date souhaitée", valeur: mission.dateSouhaitee },
              { icone: Clock, libelle: "Durée estimée", valeur: mission.dureeEstimee },
            ]}
          />
        </>}
      />
    </div>
  );
}

function MissionsScreen() {
  const [missions, setMissions] = useStore("missions", MISSIONS_INITIAL);
  const [tab, setTab] = useState("toutes");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const q = sansAccents(query.trim());
  const filtered = missions.filter((m) =>
    (tab === "toutes" || m.statut === tab) &&
    (!q || sansAccents([m.titre, m.client, m.ville, m.type].join(" ")).includes(q)));
  const pagination = usePaginationListe(filtered);
  const selected = missions.find((m) => m.id === selectedId);

  function setStatut(id, statut) {
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, statut } : m)));
    notify(statut === "Acceptée" ? "Mission acceptée. Le client est prévenu." : "Mission refusée. Le client est prévenu.", statut === "Acceptée" ? "success" : "info");
  }
  function setCounterOffer(id, value) {
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, contreOffre: value } : m)));
    notify("Contre-proposition envoyée au client.");
  }

  if (selected) {
    return (
      <MissionDetail
        mission={selected}
        onBack={() => setSelectedId(null)}
        onAccept={(id) => setStatut(id, "Acceptée")}
        onRefuse={(id) => setStatut(id, "Refusée")}
        onCounterOffer={setCounterOffer}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Suivez les demandes de prestations reçues de vos clients.</p>

      <BarreFiltres label="Rechercher dans mes missions">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Mission, client ou quartier…"
          label="Rechercher une mission"
          className="w-full lg:flex-1"
        />
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Statut"
          actif={tab}
          onChange={(v) => { setTab(v); pagination.setPage(1); }}
          options={MISSION_TABS.map((t) => ({ id: t.id, label: `${t.label} (${t.id === "toutes" ? missions.length : missions.filter((m) => m.statut === t.id).length})` }))}
        />
        <CompteResultats n={filtered.length} nom="mission" feminin />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((m) => (
            <MissionCard
              key={m.id}
              m={m}
              onOpen={(mm) => { setSelectedId(mm.id); window.scrollTo(0, 0); }}
              onAccept={(id) => setStatut(id, "Acceptée")}
              onRefuse={(id) => setStatut(id, "Refusée")}
            />
          ))}
        </div>
      ) : (
        <ListeVide
          icone={ClipboardList}
          titre="Aucune mission dans cette catégorie"
          texte={q ? "Essayez d’autres mots-clés." : "Les nouvelles demandes de vos clients apparaîtront ici."}
          action={(q || tab !== "toutes") && <App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setTab("toutes"); }}>Voir toutes les missions</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Screen 14 : Profil Prestataire + Évaluations & Avis ---------- */

const REVIEWS_DATA = [
  { auteur: "Fatou Sarr", service: "Installation électrique complète", note: 5, date: "il y a 3 jours", commentaire: "Excellent travail, intervention rapide et propre. Je recommande vivement." },
  { auteur: "Ibrahima Diallo", service: "Réparation prise défectueuse", note: 4, date: "il y a 1 semaine", commentaire: "Bon travail, ponctuel et de bon conseil." },
  { auteur: "Aminata Diop", service: "Câblage réseau", note: 5, date: "il y a 2 semaines", commentaire: "Très satisfaite, tout fonctionne parfaitement." },
  { auteur: "Cheikh Fall", service: "Mise aux normes tableau", note: 5, date: "il y a 3 semaines", commentaire: "Sérieux, professionnel et de bon conseil." },
  { auteur: "Mariama Sow", service: "Installation éclairage LED", note: 5, date: "il y a 1 mois", commentaire: "Rapide et soigné, je referai appel à lui." },
  { auteur: "Ousmane Ba", service: "Dépannage urgent tableau", note: 3, date: "il y a 2 mois", commentaire: "Correct mais un léger retard sur le planning initial." },
];
const AVG_NOTE = (REVIEWS_DATA.reduce((s, r) => s + r.note, 0) / REVIEWS_DATA.length).toFixed(1);
const SOUS_SCORES = [
  { label: "Qualité", value: 4.8 },
  { label: "Ponctualité", value: 4.6 },
  { label: "Communication", value: 4.7 },
  { label: "Rapport qualité/prix", value: 4.5 },
];

function Stars({ note, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} color={COLORS.orange} fill={n <= note ? COLORS.orange : "none"} />
      ))}
    </div>
  );
}

const PORTFOLIO_REALISATIONS = [
  { id: "r1", titre: "Installation tableau électrique — Villa Almadies", photo: "/images/plateforme/realisations/realisation-1.jpg", date: "Juillet 2026", lieu: "Almadies, Dakar", description: "Installation complète d’un tableau électrique neuf pour une villa de 5 pièces, avec mise aux normes NF C 15-100." },
  { id: "r2", titre: "Panneaux solaires — Résidence Ngor", photo: "/images/plateforme/realisations/realisation-2.jpg", date: "Juin 2026", lieu: "Ngor, Dakar", description: "Pose et raccordement d’un kit solaire domestique de 3kW avec onduleur." },
  { id: "r3", titre: "Câblage réseau — Bureau Plateau", photo: "/images/plateforme/realisations/realisation-3.jpg", date: "Mai 2026", lieu: "Plateau, Dakar", description: "Câblage réseau complet pour un open-space de 12 postes de travail." },
  { id: "r4", titre: "Mise aux normes — Immeuble Médina", photo: "/images/plateforme/realisations/realisation-4.jpg", date: "Avril 2026", lieu: "Médina, Dakar", description: "Mise en conformité de l’installation électrique d’un immeuble de 4 étages suite à un contrôle d’assurance." },
  { id: "r5", titre: "Dépannage urgence — Appartement Sacré-Cœur", photo: "/images/plateforme/realisations/realisation-5.jpg", date: "Mars 2026", lieu: "Sacré-Cœur, Dakar", description: "Intervention d’urgence suite à une coupure générale, remplacement du disjoncteur principal." },
  { id: "r6", titre: "Éclairage extérieur — Villa Ouakam", photo: "/images/plateforme/realisations/realisation-6.jpg", date: "Février 2026", lieu: "Ouakam, Dakar", description: "Installation d’un éclairage extérieur basse consommation pour un jardin et une allée." },
  { id: "r7", titre: "Installation domotique — Résidence Fann", photo: "/images/plateforme/realisations/realisation-7.jpg", date: "Janvier 2026", lieu: "Fann, Dakar", description: "Mise en place d’un système domotique pour la gestion de l’éclairage et des volets roulants." },
  { id: "r8", titre: "Rénovation électrique complète — Maison Yoff", photo: "/images/plateforme/realisations/realisation-8.jpg", date: "Décembre 2025", lieu: "Yoff, Dakar", description: "Rénovation complète de l’installation électrique d’une maison ancienne, câblage neuf de bout en bout." },
];

function RealisationsScreen({ onBack }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour au profil
      </button>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>{PORTFOLIO_REALISATIONS.length} réalisations mises en avant sur votre profil.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PORTFOLIO_REALISATIONS.map((r) => (
          <div key={r.id} className="rounded-lg border bg-surface overflow-hidden" style={{ borderColor: COLORS.border }}>
            <SafeImg kind="photo" src={r.photo} alt={r.titre} className="w-full h-36 object-cover" />
            <div className="p-4">
              <p className="font-semibold text-sm mb-1" style={{ color: COLORS.slate }}>{r.titre}</p>
              <p className="text-xs mb-2" style={{ color: COLORS.slateLight }}>{r.lieu} · {r.date}</p>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{r.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilPrestataireScreen({ onNavigate }) {
  const user = USER_BY_ESPACE.prestataire;
  const [stored, setInfo] = useStore("profil-prestataire", PROFIL_PRESTATAIRE_INITIAL);
  const info = { ...PROFIL_PRESTATAIRE_INITIAL, ...stored };
  const [services] = useStore("services", SERVICES_INITIAL);
  const [missions] = useStore("missions", MISSIONS_INITIAL);
  const [editing, setEditing] = useState(false);
  const completion = useCompletionPrestataire();

  const actifs = services.filter((s) => s.disponible);
  const enCours = missions.filter((m) => m.statut === "En cours" || m.statut === "Acceptée").length;
  const enAttente = missions.filter((m) => m.statut === "En attente").length;
  const zones = Array.from(new Set(services.flatMap((s) => String(s.zone || "").split(",").map((z) => z.trim()).filter(Boolean))));

  return (
    <div className="space-y-6">
      {editing && (
        <ProfilInfoModal
          nom={user.name}
          values={info}
          fields={[{ key: "metier", label: "Métier" }, { key: "email", label: "E-mail", type: "email" }, { key: "telephone", label: "Téléphone", type: "tel" }, { key: "localisation", label: "Localisation" }]}
          onSave={(v) => { setInfo(v); notify("Profil mis à jour."); }}
          onClose={() => setEditing(false)}
        />
      )}

      <EnTeteFiche
        visuel={<AvatarListe nom={user.name} photo="/images/plateforme/portraits/mamadou-ndiaye.jpg" taille="lg" />}
        badges={<>
          <ProfileTierBadge />
          <RegulBadge size="sm" />
          <App.Badge ton={actifs.length ? "succes" : "neutre"} point taille="moyen">{actifs.length ? "Disponible pour des missions" : "Aucun service actif"}</App.Badge>
        </>}
        titre={user.name}
        sousTitre={`${info.metier} · ${PRESTATAIRE_DETAILS.experience} d’expérience`}
        meta={<>
          <MetaOffre icone={MapPin}>{info.localisation}</MetaOffre>
          <MetaOffre icone={Star}>{noteFr(AVG_NOTE)}/5 · {REVIEWS_DATA.length} avis</MetaOffre>
          <MetaOffre icone={CalendarCheck}>Membre depuis {PRESTATAIRE_DETAILS.membreDepuis.toLowerCase()}</MetaOffre>
        </>}
        actions={<>
          <App.Bouton onClick={() => setEditing(true)}><Pencil size={16} aria-hidden="true" /> Modifier le profil</App.Bouton>
        </>}
      />

      <ChiffresProfil
        items={[
          { icone: ClipboardList, valeur: enCours, label: "Missions en cours", detail: `${enAttente} demande${enAttente > 1 ? "s" : ""} en attente`, onClick: () => onNavigate("missions") },
          { icone: Wrench, valeur: actifs.length, label: "Services actifs", detail: `${services.length} au total`, ton: "info", onClick: () => onNavigate("services") },
          { icone: Star, valeur: `${noteFr(AVG_NOTE)}/5`, label: "Note moyenne", detail: "Voir mes évaluations", ton: "alerte", onClick: () => onNavigate("evaluations") },
          { icone: UserCircle2, valeur: `${completion.valeur} %`, label: "Profil complété", detail: completion.valeur === 100 ? "Profil complet" : "Voir ce qui manque", ton: "succes", onClick: completion.valeur < 100 ? () => onNavigate("profil") : undefined },
        ]}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Mes services" sousTitre={`${actifs.length} service${actifs.length > 1 ? "s" : ""} proposé${actifs.length > 1 ? "s" : ""} aux clients`} actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("services")}>Gérer</App.Bouton>} flush>
            {actifs.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-secondaire">Aucun service actif. Ajoutez-en un pour recevoir des demandes.</p>
            ) : (
              <ul className="divide-y divide-base border-t border-base">
                {actifs.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <App.PastilleIcone icone={Wrench} forme="carre" taille="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-principal">{s.nom}</p>
                        <p className="truncate text-xs text-discret">{s.tag} · à partir de {s.tarifBase}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-discret">{s.missions} missions</span>
                  </li>
                ))}
              </ul>
            )}
          </App.Carte>

          <App.Carte titre="Réalisations" sousTitre={`${PORTFOLIO_REALISATIONS.length} réalisations sur votre profil`} actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("realisations")}>Tout voir</App.Bouton>}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PORTFOLIO_REALISATIONS.slice(0, 4).map((r) => (
                <div key={r.id}>
                  <SafeImg kind="photo" src={r.photo} alt={r.titre} className="mb-1.5 h-24 w-full rounded-md object-cover" />
                  <p className="truncate text-xs font-medium text-principal">{r.titre}</p>
                </div>
              ))}
            </div>
          </App.Carte>

          <App.Carte titre="Avis récents" sousTitre={`${REVIEWS_DATA.length} avis · ${noteFr(AVG_NOTE)}/5`} actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("evaluations")}>Mes évaluations</App.Bouton>}>
            <ListeAvis avis={REVIEWS_DATA.slice(0, 2)} />
          </App.Carte>

          <App.Carte titre="Certifications">
            <ListeCoches items={PRESTATAIRE_DETAILS.certifications} />
          </App.Carte>
        </>}
        cote={<>
          <ApercuFiche
            titre="Mes informations"
            items={[
              { icone: Wrench, libelle: "Métier", valeur: info.metier },
              { icone: TrendingUp, libelle: "Expérience", valeur: PRESTATAIRE_DETAILS.experience },
              { icone: Mail, libelle: "E-mail", valeur: info.email },
              { icone: Phone, libelle: "Téléphone", valeur: info.telephone },
              { icone: MapPin, libelle: "Localisation", valeur: info.localisation },
              { icone: Clock, libelle: "Disponibilité", valeur: PRESTATAIRE_DETAILS.disponibilite },
            ]}
          />
          <App.Carte titre="Zone d’intervention" sousTitre="D’après vos services">
            <Etiquettes items={zones} />
          </App.Carte>
          <App.Carte titre="Langues">
            <ul className="divide-y divide-dashed divide-base">
              {PRESTATAIRE_DETAILS.langues.map((x) => (
                <li key={x.l} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-principal">{x.l}</span>
                  <span className="text-secondaire">{x.n}</span>
                </li>
              ))}
            </ul>
          </App.Carte>
          <CarteCompletion completion={completion} />
          <CarteRegularisationProfil onNavigate={onNavigate} />
          <ProfileTierCard />
        </>}
      />
    </div>
  );
}

function EvaluationsScreen({ onNavigate }) {
  const [filter, setFilter] = useState("tous");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const distribution = [5, 4, 3, 2, 1].map((n) => ({ n, count: REVIEWS_DATA.filter((r) => r.note === n).length }));
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  const filtered = REVIEWS_DATA.filter((r) => {
    const matchesQuery = (r.auteur + r.service + r.commentaire).toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "tous" ? true : filter === "recents" ? true : r.note === Number(filter);
    return matchesQuery && matchesFilter;
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <button type="button" onClick={() => onNavigate("profil")} className="flex items-center gap-1.5 text-sm font-medium rounded border px-3 py-1.5 mb-5" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
        <ArrowLeft size={14} /> Retour
      </button>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez les retours de vos clients après chaque prestation.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.3fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-6 text-center" style={{ borderColor: COLORS.border }}>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Note moyenne</p>
          <p className="text-4xl font-semibold mb-2" style={{ color: COLORS.orangeText }}>{noteFr(AVG_NOTE)}/5</p>
          <Stars note={Math.round(AVG_NOTE)} size={16} />
          <p className="text-xs mt-2" style={{ color: COLORS.slateLight }}>{REVIEWS_DATA.length} avis au total</p>
        </div>
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          {distribution.map((d) => (
            <div key={d.n} className="flex items-center gap-3 mb-1.5">
              <span className="text-xs w-8" style={{ color: COLORS.slateLight }}>{d.n}★</span>
              <div className="flex-1 h-2 rounded-full" style={{ background: COLORS.softStrong }}>
                <div className="h-2 rounded-full" style={{ width: `${(d.count / maxCount) * 100}%`, background: COLORS.orange }} />
              </div>
              <span className="text-xs w-4" style={{ color: COLORS.slateLight }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {SOUS_SCORES.map((s) => (
          <StatMini key={s.label} value={s.value} label={s.label} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          placeholder="Rechercher un avis"
          label="Rechercher un avis"
          className="min-w-[220px] flex-1 max-w-xs"
        />
        {[{ id: "tous", label: "Tous" }, { id: "5", label: "5 étoiles" }, { id: "4", label: "4 étoiles" }, { id: "3", label: "3 étoiles" }, { id: "recents", label: "Récents" }].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => { setFilter(f.id); setPage(1); }}
            className={`min-h-[32px] rounded px-3 text-xs font-semibold transition-colors ${filter === f.id ? "bg-surface text-principal shadow-[0_1px_2px_rgb(var(--neutre-800)/0.08)]" : "text-secondaire hover:text-principal"}`}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      {paged.map((r, i) => (
        <div key={i} className="rounded-lg border bg-surface p-5 mb-3" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{r.auteur}</p>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{r.service}</p>
            </div>
            <div className="text-right">
              <Stars note={r.note} />
              <p className="text-xs mt-1" style={{ color: COLORS.slateLight }}>{r.date}</p>
            </div>
          </div>
          <p className="text-sm mt-2" style={{ color: COLORS.slateLight }}>"{r.commentaire}"</p>
        </div>
      ))}
      {paged.length === 0 && <p className="text-sm" style={{ color: COLORS.slateLight }}>Aucun avis ne correspond à ce filtre.</p>}

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Screen 15 : Dashboard & Offres (Entreprise) ---------- */

/* Entreprise connectée dans la démo : ses offres passent par la vérification de l’admin. */
const ENTREPRISE_DEMO_NOM = "Senegal Construction SARL";

const OFFRES_ENTREPRISE_INITIAL = [
  { id: "off1", titre: "Chef d’équipe électricité", categorie: "BTP", contrat: "CDI", salaire: "350 000 FCFA/mois", localisation: "Dakar, Plateau", statut: "Active", nbCandidatures: 12, experience: "5-10 ans", dateLimite: "30 novembre 2026", description: "Nous recherchons un Chef d’équipe électricité expérimenté pour superviser nos chantiers résidentiels et tertiaires à Dakar. Vous serez garant de la conformité réglementaire (normes NF C 15-100) et animerez une équipe d’électriciens qualifiés.", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d’équipe"], candidats: [
    { nom: "Moussa Diop", metier: "Électricien bâtiment", date: "15/08", statut: "Nouveau", photo: "/images/plateforme/portraits/moussa-diop.jpg" },
    { nom: "Fatou Sarr", metier: "Plombière", date: "14/08", statut: "En cours", photo: "/images/plateforme/portraits/fatou-sarr.jpg" },
    { nom: "Ibrahima Diallo", metier: "Soudeur", date: "12/08", statut: "Retenu", photo: "/images/plateforme/portraits/ibrahima-diallo.jpg" },
    { nom: "Aminata Ndiaye", metier: "Couturière", date: "10/08", statut: "Rejeté", photo: "/images/plateforme/portraits/aminata-ndiaye.jpg" },
  ] },
  { id: "off2", titre: "Technicienne plomberie", categorie: "Plomberie", contrat: "CDD", salaire: "250 000 FCFA/mois", localisation: "Dakar, Médina", statut: "Active", nbCandidatures: 8, experience: "2-5 ans", dateLimite: "15 novembre 2026", description: "Poste de technicienne plomberie pour l’entretien et l’installation de systèmes sanitaires sur nos chantiers.", competences: ["Plomberie sanitaire", "Diagnostic de panne"], candidats: [
    { nom: "Fatou Mbaye", metier: "Plombière sanitaire", date: "13/08", statut: "Nouveau", photo: "/images/plateforme/portraits/fatou-mbaye.jpg" },
  ] },
  { id: "off3", titre: "Soudeur TIG/MIG", categorie: "Industrie", contrat: "CDI", salaire: "300 000 FCFA/mois", localisation: "Thiès", statut: "Active", nbCandidatures: 15, experience: "3-8 ans", dateLimite: "10 décembre 2026", description: "Soudeur qualifié TIG/MIG pour la fabrication et l’assemblage de structures métalliques industrielles.", competences: ["Soudure TIG", "Soudure MIG", "Lecture de plans"], candidats: [
    { nom: "Ibrahima Diallo", metier: "Soudeur industriel", date: "11/08", statut: "Retenu", photo: "/images/plateforme/portraits/ibrahima-diallo.jpg" },
    { nom: "Ousmane Diaw", metier: "Soudeur TIG/MIG", date: "09/08", statut: "En cours", photo: "/images/plateforme/portraits/ousmane-diaw.jpg" },
  ] },
  { id: "off4", titre: "Carreleur expérimenté", categorie: "BTP", contrat: "CDD", salaire: "280 000 FCFA/mois", localisation: "Dakar, Almadies", statut: "En pause", nbCandidatures: 6, experience: "3-6 ans", dateLimite: "5 novembre 2026", description: "Carreleur expérimenté pour la finition de villas haut standing aux Almadies.", competences: ["Pose de carrelage", "Finitions"], candidats: [
    { nom: "Mariama Tall", metier: "Carreleuse", date: "07/08", statut: "En cours", photo: "/images/plateforme/portraits/mariama-tall.jpg" },
  ] },
  { id: "off5", titre: "Menuisier ébéniste", categorie: "Artisanat", contrat: "CDI", salaire: "300 000 FCFA/mois", localisation: "Saint-Louis", statut: "Clôturée", nbCandidatures: 5, experience: "5+ ans", dateLimite: "1er août 2026", description: "Menuisier ébéniste pour la fabrication de mobilier sur mesure.", competences: ["Menuiserie", "Ébénisterie"], candidats: [
    { nom: "Ousmane Ba", metier: "Menuisier ébéniste", date: "28/07", statut: "Nouveau", photo: "/images/plateforme/portraits/ousmane-ba.jpg" },
  ] },
  { id: "off6", titre: "Peintre bâtiment", categorie: "BTP", contrat: "CDD", salaire: "220 000 FCFA/mois", localisation: "Dakar, Parcelles", statut: "Active", nbCandidatures: 9, experience: "1-3 ans", dateLimite: "20 novembre 2026", description: "Peintre bâtiment pour travaux de finition sur nos chantiers résidentiels.", competences: ["Peinture intérieure/extérieure", "Enduits"], candidats: [
    { nom: "Abdoulaye Sow", metier: "Peintre bâtiment", date: "18/08", statut: "Nouveau", photo: "/images/plateforme/portraits/abdoulaye-sow.jpg" },
  ] },
  { id: "off7", titre: "Aide-électricien (apprenti)", categorie: "BTP", contrat: "CDD", salaire: "120 000 FCFA/mois", localisation: "Dakar, Pikine", statut: "En vérification", soumiseLe: "18 octobre 2026", nbCandidatures: 0, experience: "Débutant accepté", dateLimite: "15 décembre 2026", description: "Nous recherchons un aide-électricien pour accompagner nos chefs d’équipe sur des chantiers résidentiels. Formation assurée sur le terrain, encadrement par un électricien confirmé.", competences: ["Motivation", "Travail en équipe", "Bases en électricité"], candidats: [] },
];

function EntrepriseDashboardScreen({ user, offres, onNavigate, todos }) {
  const [candidaturesRecues] = useStore("candidatures-entreprise", CANDIDATURES_ENTREPRISE_INITIAL);
  const actives = offres.filter((o) => o.statut === "Active");
  const COMPLETION = useCompletionEntreprise().valeur;
  const maxCand = Math.max(...actives.map((o) => o.nbCandidatures || 0), 1);
  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Voici un aperçu de vos recrutements chez Senegal Construction SARL.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} value={actives.length} label="Offres actives" detail="Visibles par les talents" onClick={() => onNavigate("offres")} />
        <StatCard icon={FileText} value={offres.reduce((t, o) => t + (o.nbCandidatures || 0), 0)} label="Candidatures reçues" detail="Toutes offres confondues" tone="info" onClick={() => onNavigate("candidatures")} />
        <StatCard icon={Users2} value={8} label="Prestataires engagés" detail="Missions confiées" tone="succes" />
        <App.CarteStat
          icone={Building2}
          ton="alerte"
          titre="Profil entreprise"
          detail="Un profil complet attire plus de talents"
          valeur={`${COMPLETION} %`}
          visuel={<App.Anneau valeur={COMPLETION} taille={56} epaisseur={6} label={`Profil complété à ${COMPLETION} %`}>{" "}</App.Anneau>}
          onClick={() => onNavigate("profil")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte
          titre="Dernières candidatures"
          className="xl:col-span-2"
          actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("candidatures")}>Tout voir</App.Bouton>}
        >
          <App.Tableau
            legende="Dernières candidatures reçues"
            lignes={candidaturesRecues.slice(0, 5)}
            onLigne={() => onNavigate("candidatures")}
            colonnes={[
              { cle: "nom", titre: "Candidat", rendu: (c) => <IdentityCell nom={c.nom} sub={c.metier} photo={c.photo} /> },
              { cle: "offre", titre: "Offre", rendu: (c) => <span className="text-principal">{c.offre}</span> },
              { cle: "date", titre: "Reçue le", masqueMobile: true },
              { cle: "statut", titre: "Statut", rendu: (c) => <StatusBadge status={c.statut} /> },
            ]}
          />
        </App.Carte>

        <App.Carte
          titre="Mes offres actives"
          sousTitre="Candidatures reçues par offre"
          actions={<App.Bouton petit variante="neutre" onClick={() => onNavigate("offres")}>Gérer</App.Bouton>}
        >
          <App.ListeClassee
            elements={actives.slice(0, 5).map((o) => ({
              id: o.id,
              libelle: o.titre,
              pourcentage: Math.round(((o.nbCandidatures || 0) / maxCand) * 100),
              valeur: `${o.nbCandidatures || 0}`,
              visuel: <App.PastilleIcone icone={Briefcase} taille="sm" />,
            }))}
          />
        </App.Carte>
      </div>

      <TodoPanel items={todos} onNavigate={onNavigate} />
    </div>
  );
}

function OffreEntrepriseCard({ o, onOpen }) {
  return (
    <CarteListe
      onOpen={() => onOpen(o)}
      accent={!!o.sponsorisee}
      visuel={<VisuelIcone icone={Briefcase} />}
      titre={o.titre}
      badges={<>
        <StatusBadge status={o.statut} />
        {o.sponsorisee && <PremiumChip label="Sponsorisée" />}
      </>}
      sousTitre={`${o.categorie} · ${o.salaire}`}
      meta={<>
        <App.Badge ton="info" taille="moyen">{o.contrat}</App.Badge>
        <MetaOffre icone={MapPin}>{o.localisation}</MetaOffre>
        {o.dateLimite && <MetaOffre icone={Clock}>Jusqu’au {o.dateLimite}</MetaOffre>}
      </>}
      aside={
        <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-marque-doux px-3 text-sm font-semibold text-marque-fort">
          <UsersRound size={15} aria-hidden="true" /> {o.nbCandidatures} candidature{o.nbCandidatures > 1 ? "s" : ""}
        </span>
      }
      actions={<App.Bouton petit variante="neutre" onClick={() => onOpen(o)}>Gérer</App.Bouton>}
    />
  );
}

function OffreEntrepriseForm({ initial, onSave, onCancel }) {
  const [v, setV] = useState(initial || { titre: "", categorie: "", contrat: "CDI", salaire: "", localisation: "", experience: "", dateLimite: "", description: "", competencesTxt: "" });
  const [essai, setEssai] = useState(false);
  const erreurs = {
    titre: !v.titre.trim() && "Indiquez le titre du poste.",
    categorie: !v.categorie.trim() && "Indiquez la catégorie.",
    localisation: !v.localisation.trim() && "Indiquez où se trouve le poste.",
    salaire: !v.salaire.trim() && "Indiquez le salaire mensuel.",
    description: !v.description.trim() && "Décrivez le poste et ses missions.",
  };
  const err = (k) => (essai ? erreurs[k] : null);

  function set(k, val) { setV((s) => ({ ...s, [k]: val })); }
  const attrs = (id, k, requis, aide) => ({
    id,
    value: v[k],
    onChange: (e) => set(k, e.target.value),
    "aria-required": requis || undefined,
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) || aide ? `${id}-aide` : undefined,
  });

  function envoyer(e) {
    e.preventDefault();
    setEssai(true);
    if (Object.values(erreurs).some(Boolean)) return;
    onSave({
      id: initial?.id || v.titre.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      titre: v.titre, categorie: v.categorie, contrat: v.contrat, salaire: v.salaire, localisation: v.localisation,
      // Nouvelle offre, ou offre refusée puis corrigée : elle repart en vérification chez l’admin.
      statut: !initial || initial.statut === "Refusée" ? "En vérification" : initial.statut,
      soumiseLe: !initial || initial.statut === "Refusée" ? dateFr(demoNow()) : initial.soumiseLe,
      motifRefus: null,
      nbCandidatures: initial?.nbCandidatures || 0, experience: v.experience,
      dateLimite: v.dateLimite, description: v.description,
      competences: v.competencesTxt.split(",").map((s) => s.trim()).filter(Boolean),
      candidats: initial?.candidats || [],
    });
  }

  return (
    <App.Carte
      as="form"
      onSubmit={envoyer}
      noValidate
      titre={initial ? "Modifier l’offre" : "Créer une offre d’emploi"}
      sousTitre="Les champs marqués d’un * sont obligatoires."
    >
      {(!initial || initial.statut === "Refusée") && (
        <p className="mb-6 flex items-start gap-3 rounded-lg bg-doux p-4 text-sm text-secondaire">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-marque" aria-hidden="true" />
          L’équipe LIGGEEY vérifie chaque offre avant sa mise en ligne. Elle sera visible des candidats dès sa validation.
        </p>
      )}
      {initial?.statut === "Refusée" && initial.motifRefus && (
        <p className="mb-6 rounded-lg bg-statut-danger-doux px-4 py-3 text-sm text-principal"><span className="font-semibold">Motif du refus :</span> {initial.motifRefus}</p>
      )}

      <h3 className={FORM.section}>Le poste</h3>
      <div className={`${FORM.grille} mb-8`}>
        <Champ id="offre-titre" label="Titre du poste" requis erreur={err("titre")} large>
          <input {...attrs("offre-titre", "titre", true)} placeholder="Ex. : Électricien du bâtiment" className={FORM.champ(err("titre"))} />
        </Champ>
        <Champ id="offre-categorie" label="Catégorie" requis erreur={err("categorie")}>
          <input {...attrs("offre-categorie", "categorie", true)} placeholder="Ex. : BTP, plomberie" className={FORM.champ(err("categorie"))} />
        </Champ>
        <Champ id="offre-contrat" label="Type de contrat" requis>
          <ListeChamp {...attrs("offre-contrat", "contrat", true)}>
            {["CDI", "CDD", "Stage", "Freelance", "Bénévolat"].map((c) => <option key={c}>{c}</option>)}
          </ListeChamp>
        </Champ>
        <Champ id="offre-description" label="Description du poste" requis erreur={err("description")} aide="Les missions, le cadre de travail, les horaires." large>
          <textarea {...attrs("offre-description", "description", true, true)} rows={4} className={FORM.zone(err("description"))} />
        </Champ>
      </div>

      <h3 className={FORM.section}>Conditions</h3>
      <div className={`${FORM.grille} mb-8`}>
        <Champ id="offre-localisation" label="Localisation" requis erreur={err("localisation")}>
          <input {...attrs("offre-localisation", "localisation", true)} placeholder="Ex. : Dakar, Plateau" className={FORM.champ(err("localisation"))} />
        </Champ>
        <Champ id="offre-salaire" label="Salaire mensuel" requis erreur={err("salaire")}>
          <input {...attrs("offre-salaire", "salaire", true)} placeholder="Ex. : 300 000 FCFA par mois" className={FORM.champ(err("salaire"))} />
        </Champ>
        <Champ id="offre-experience" label="Expérience requise">
          <input {...attrs("offre-experience", "experience")} placeholder="Ex. : 3 à 5 ans" className={FORM.champ()} />
        </Champ>
        <Champ id="offre-date-limite" label="Date limite de candidature">
          <input {...attrs("offre-date-limite", "dateLimite")} placeholder="Ex. : 30 novembre 2026" className={FORM.champ()} />
        </Champ>
      </div>

      <h3 className={FORM.section}>Profil recherché</h3>
      <div className={FORM.grille}>
        <Champ id="offre-competences" label="Compétences requises" aide="Séparez-les par des virgules." large>
          <input {...attrs("offre-competences", "competencesTxt", false, true)} placeholder="Ex. : lecture de plans, câblage, habilitation électrique" className={FORM.champ()} />
        </Champ>
      </div>

      {essai && Object.values(erreurs).some(Boolean) && (
        <p role="alert" className="mt-5 text-sm text-statut-danger">Complétez les champs signalés pour envoyer l’offre.</p>
      )}
      <div className={FORM.actions}>
        <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
        <App.Bouton type="submit">{!initial ? "Envoyer pour vérification" : initial.statut === "Refusée" ? "Renvoyer pour vérification" : "Enregistrer"}</App.Bouton>
      </div>
    </App.Carte>
  );
}

function BorderedField({ label, value, badge }) {
  return (
    <div className="rounded-md border px-4 py-3 flex items-center justify-between mb-3" style={{ borderColor: COLORS.border }}>
      <p className="text-sm" style={{ color: COLORS.slateLight }}>{label}</p>
      {badge ? <StatusBadge status={value} /> : <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{value}</p>}
    </div>
  );
}

function OffreEntrepriseDetail({ offre, onEdit, onToggleStatut, onSponsor, onBack }) {
  const planApi = usePlan();
  const candidats = offre.candidats || [];
  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux offres</BoutonRetour>

      <EnTeteFiche
        visuel={<VisuelIcone icone={Briefcase} taille="lg" />}
        badges={<>
          <StatusBadge status={offre.statut} />
          {offre.sponsorisee && <PremiumChip label="Sponsorisée" />}
        </>}
        titre={offre.titre}
        sousTitre={`${offre.categorie} · ${offre.localisation}`}
        meta={<>
          <App.Badge ton="info" taille="moyen">{offre.contrat}</App.Badge>
          <MetaOffre icone={Wallet}>{offre.salaire}</MetaOffre>
          {offre.experience && <MetaOffre icone={TrendingUp}>{offre.experience}</MetaOffre>}
          {offre.dateLimite && <MetaOffre icone={Clock}>Jusqu’au {offre.dateLimite}</MetaOffre>}
        </>}
        actions={<>
          {offre.statut === "Active" && onSponsor && (
            offre.sponsorisee ? (
              <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-marque-doux px-4 text-sm font-semibold text-marque-fort">
                <Crown size={15} aria-hidden="true" /> Sponsorisée 7 jours
              </span>
            ) : (
              <App.Bouton variante="doux" onClick={() => planApi.gate("sponsoring", onSponsor)}>
                {planApi.can("sponsoring") ? <Sparkles size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />} Sponsoriser
              </App.Bouton>
            )
          )}
          <App.Bouton variante="neutre" onClick={onEdit}><Pencil size={16} aria-hidden="true" /> Modifier</App.Bouton>
          {offre.statut !== "Clôturée" && offre.statut !== "En vérification" && offre.statut !== "Refusée" && <App.Bouton onClick={onToggleStatut}>Clôturer l’offre</App.Bouton>}
        </>}
      />

      {offre.statut === "En vérification" && (
        <div className="flex items-start gap-3 rounded-lg border border-base bg-statut-alerte-doux p-4" role="status">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-principal" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-principal">En cours de vérification par l’équipe LIGGEEY</p>
            <p className="text-sm text-secondaire">Envoyée le {offre.soumiseLe || "—"}. L’offre n’est pas encore visible des candidats : elle sera publiée dès sa validation.</p>
          </div>
        </div>
      )}
      {offre.statut === "Refusée" && (
        <div className="flex flex-col gap-3 rounded-lg border border-base bg-statut-danger-doux p-4 sm:flex-row sm:items-center sm:justify-between" role="status">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-statut-danger" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-principal">Offre refusée par l’équipe LIGGEEY</p>
              <p className="text-sm text-secondaire">{offre.motifRefus ? `Motif : ${offre.motifRefus}` : "Corrigez l’offre puis renvoyez-la."}</p>
            </div>
          </div>
          <App.Bouton petit onClick={onEdit}><Pencil size={15} aria-hidden="true" /> Corriger et renvoyer</App.Bouton>
        </div>
      )}

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Description du poste">
            <p className="text-[15px] leading-[1.7] text-secondaire">{offre.description}</p>
          </App.Carte>
          {offre.competences?.length > 0 && (
            <App.Carte titre="Compétences recherchées">
              <Etiquettes items={offre.competences} />
            </App.Carte>
          )}
          <App.Carte titre="Candidatures reçues" sousTitre={`${candidats.length} candidature${candidats.length > 1 ? "s" : ""}`} flush>
            {candidats.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-secondaire">Aucune candidature pour le moment.</p>
            ) : (
              <ul className="divide-y divide-base border-t border-base">
                {candidats.map((c, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <AvatarListe nom={c.nom} photo={c.photo} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-principal">{c.nom}</p>
                        <p className="truncate text-xs text-discret">{c.metier} · Postulé le {c.date}</p>
                      </div>
                    </div>
                    <StatusBadge status={c.statut} />
                  </li>
                ))}
              </ul>
            )}
          </App.Carte>
        </>}
        cote={
          <ApercuFiche
            titre="Aperçu de l’offre"
            items={[
              { icone: Layers, libelle: "Catégorie", valeur: offre.categorie },
              { icone: FileText, libelle: "Type de contrat", valeur: offre.contrat },
              { icone: MapPin, libelle: "Lieu", valeur: offre.localisation },
              { icone: Wallet, libelle: "Salaire", valeur: offre.salaire },
              { icone: TrendingUp, libelle: "Expérience", valeur: offre.experience },
              { icone: Clock, libelle: "Date limite", valeur: offre.dateLimite },
              { icone: UsersRound, libelle: "Candidatures", valeur: offre.nbCandidatures },
            ]}
          />
        }
      />
    </div>
  );
}

const STATUTS_OFFRE_ENTREPRISE = ["Tous", "Active", "En vérification", "Refusée", "En pause", "Clôturée"];

function MesOffresScreen({ offres, setOffres, creer = false }) {
  const [query, setQuery] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("view");

  const planApi = usePlan();
  const offresRestantes = planApi ? planApi.remaining("offres") : UNLIMITED;
  function openCreate() {
    if (offresRestantes <= 0) { planApi.requestUpgrade("offres"); return; }
    setMode("create");
  }
  // Ouvert depuis le raccourci « Publier une offre » de la barre d’icônes.
  useEffect(() => { if (creer) openCreate(); }, []);
  function sponsoriser(id) {
    setOffres((list) => list.map((o) => (o.id === id ? { ...o, sponsorisee: true } : o)));
    notify("Offre sponsorisée : elle apparaît en tête des résultats pendant 7 jours.");
  }
  const q = sansAccents(query.trim());
  const filtered = offres.filter((o) =>
    (!q || sansAccents([o.titre, o.categorie, o.localisation].join(" ")).includes(q)) &&
    (statutFilter === "Tous" || o.statut === statutFilter)
  ).sort((a, b) => (b.sponsorisee ? 1 : 0) - (a.sponsorisee ? 1 : 0));
  const pagination = usePaginationListe(filtered);
  const selected = offres.find((o) => o.id === selectedId);

  function saveOffre(values) {
    if (planApi && !offres.some((o) => o.id === values.id)) planApi.consume("offres");
    setOffres((list) => {
      const exists = list.some((o) => o.id === values.id);
      return exists ? list.map((o) => (o.id === values.id ? values : o)) : [values, ...list];
    });
    setSelectedId(values.id);
    setMode("view");
    notify(values.statut === "En vérification" ? "Offre envoyée à l’équipe LIGGEEY. Elle sera publiée après vérification." : "Offre enregistrée.");
  }
  function cloturer(id) {
    setOffres((list) => list.map((o) => (o.id === id ? { ...o, statut: "Clôturée" } : o)));
    notify("Offre clôturée.", "info");
  }

  if (mode === "create") {
    return (
      <div className="space-y-6">
        <BoutonRetour onClick={() => setMode("view")}>Retour aux offres</BoutonRetour>
        <OffreEntrepriseForm onSave={saveOffre} onCancel={() => setMode("view")} />
      </div>
    );
  }
  if (selected && mode === "edit") {
    return (
      <div className="space-y-6">
        <BoutonRetour onClick={() => setMode("view")}>Retour à l’offre</BoutonRetour>
        <OffreEntrepriseForm initial={selected} onSave={saveOffre} onCancel={() => setMode("view")} />
      </div>
    );
  }
  if (selected) {
    return (
      <OffreEntrepriseDetail
        offre={selected}
        onEdit={() => setMode("edit")}
        onToggleStatut={() => cloturer(selected.id)}
        onSponsor={() => sponsoriser(selected.id)}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">
        Gérez vos offres d’emploi et suivez les candidatures reçues.
        {offresRestantes !== UNLIMITED && <span> {Math.max(0, offresRestantes)} nouvelle{offresRestantes > 1 ? "s" : ""} offre{offresRestantes > 1 ? "s" : ""} disponible{offresRestantes > 1 ? "s" : ""} ce mois-ci avec le profil {planApi.plan.nom}.</span>}
      </p>

      <BarreFiltres label="Rechercher dans mes offres">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Poste, catégorie ou lieu…"
          label="Rechercher une offre"
          className="w-full lg:flex-1"
        />
        <App.Bouton petit onClick={openCreate}><Plus size={15} aria-hidden="true" /> Nouvelle offre</App.Bouton>
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Statut"
          actif={statutFilter}
          onChange={(v) => { setStatutFilter(v); pagination.setPage(1); }}
          options={STATUTS_OFFRE_ENTREPRISE.map((s) => ({ id: s, label: `${s === "Tous" ? "Toutes" : s} (${s === "Tous" ? offres.length : offres.filter((o) => o.statut === s).length})` }))}
        />
        <CompteResultats n={filtered.length} nom="offre" feminin />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((o) => <OffreEntrepriseCard key={o.id} o={o} onOpen={(oo) => { setSelectedId(oo.id); window.scrollTo(0, 0); }} />)}
        </div>
      ) : offres.length === 0 ? (
        <ListeVide icone={Briefcase} titre="Aucune offre publiée" texte="Publiez votre première offre : l’équipe LIGGEEY la vérifie avant sa mise en ligne." action={<App.Bouton petit onClick={openCreate}>Nouvelle offre</App.Bouton>} />
      ) : (
        <ListeVide
          titre="Aucune offre ne correspond"
          texte="Essayez d’autres mots-clés ou un autre statut."
          action={<App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setStatutFilter("Tous"); }}>Effacer les filtres</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Screen 16 : Candidatures & Recrutement (Entreprise) ---------- */

const CANDIDATURES_ENTREPRISE_INITIAL = [
  { id: "c1", nom: "Moussa Diop", metier: "Électricien bâtiment", localisation: "Dakar", offre: "Chef d’équipe électricité", date: "15 août 2026", statut: "Nouveau", experience: "8 ans d’expérience", telephone: "+221 77 123 45 67", email: "moussa.diop@email.sn", lettre: "Bonjour, je suis très intéressé par votre offre de Chef d’équipe électricité. Fort de mes 8 ans d’expérience sur divers chantiers à Dakar et Thiès, je maîtrise l’installation électrique complète, le câblage industriel et l’encadrement des équipes sur le terrain dans le respect strict des normes NF C 15-100. Motivé et rigoureux, je suis disponible immédiatement.", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d’équipe", "Habilitation B2V"], documents: [{ nom: "CV_Moussa_Diop.pdf", taille: "1,2 Mo" }, { nom: "Certificat_Habilitation.pdf", taille: "850 Ko" }] },
  { id: "c2", nom: "Fatou Sarr", metier: "Plombière sanitaire", localisation: "Dakar", offre: "Technicienne plomberie", date: "14 août 2026", statut: "En cours", experience: "5 ans d’expérience", telephone: "+221 76 234 56 78", email: "fatou.sarr@email.sn", lettre: "Madame, Monsieur, je souhaite postuler au poste de technicienne plomberie. J’ai travaillé 5 ans sur des chantiers résidentiels et je maîtrise le diagnostic de panne et l’installation sanitaire complète.", competences: ["Plomberie sanitaire", "Diagnostic de panne"], documents: [{ nom: "CV_Fatou_Sarr.pdf", taille: "1,0 Mo" }] },
  { id: "c3", nom: "Ibrahima Diallo", metier: "Soudeur industriel", localisation: "Dakar", offre: "Soudeur TIG/MIG", date: "12 août 2026", statut: "Retenu", experience: "6 ans d’expérience", telephone: "+221 78 345 67 89", email: "ibrahima.diallo@email.sn", lettre: "Je suis soudeur industriel qualifié TIG et MIG, avec 6 ans d’expérience dans la fabrication de structures métalliques. Je souhaite mettre mon expertise au service de votre équipe.", competences: ["Soudure TIG", "Soudure MIG", "Lecture de plans"], documents: [{ nom: "CV_Ibrahima_Diallo.pdf", taille: "980 Ko" }, { nom: "Certificat_Soudure.pdf", taille: "620 Ko" }] },
  { id: "c4", nom: "Aminata Ndiaye", metier: "Couturière", localisation: "Dakar", offre: "Responsable atelier couture", date: "10 août 2026", statut: "Rejeté", experience: "10 ans d’expérience", telephone: "+221 77 456 78 90", email: "aminata.ndiaye@email.sn", lettre: "Couturière expérimentée, je gère depuis 10 ans un petit atelier et souhaite rejoindre une structure plus importante pour développer mes compétences en gestion d’équipe.", competences: ["Couture sur mesure", "Gestion d’atelier"], documents: [{ nom: "CV_Aminata_Ndiaye.pdf", taille: "1,1 Mo" }] },
  { id: "c5", nom: "Ousmane Ba", metier: "Menuisier ébéniste", localisation: "Saint-Louis", offre: "Menuisier ébéniste", date: "9 août 2026", statut: "Nouveau", experience: "12 ans d’expérience", telephone: "+221 76 567 89 01", email: "ousmane.ba@email.sn", lettre: "Menuisier ébéniste depuis 12 ans, spécialisé dans le mobilier sur mesure, je suis disponible pour rejoindre votre atelier à Saint-Louis.", competences: ["Menuiserie", "Ébénisterie"], documents: [{ nom: "CV_Ousmane_Ba.pdf", taille: "900 Ko" }] },
  { id: "c6", nom: "Mariama Tall", metier: "Carreleur", localisation: "Dakar", offre: "Carreleur expérimenté", date: "8 août 2026", statut: "En cours", experience: "4 ans d’expérience", telephone: "+221 78 678 90 12", email: "mariama.tall@email.sn", lettre: "Carreleuse spécialisée dans les finitions haut de gamme, je souhaite intégrer votre équipe pour vos chantiers résidentiels aux Almadies.", competences: ["Pose de carrelage", "Finitions"], documents: [{ nom: "CV_Mariama_Tall.pdf", taille: "1,0 Mo" }] },
  { id: "c7", nom: "Abdoulaye Sow", metier: "Peintre bâtiment", localisation: "Dakar", offre: "Peintre bâtiment", date: "7 août 2026", statut: "Nouveau", experience: "3 ans d’expérience", telephone: "+221 77 789 01 23", email: "abdoulaye.sow@email.sn", lettre: "Peintre en bâtiment depuis 3 ans, je maîtrise les enduits et les finitions intérieures/extérieures. Disponible rapidement.", competences: ["Peinture intérieure/extérieure", "Enduits"], documents: [{ nom: "CV_Abdoulaye_Sow.pdf", taille: "870 Ko" }] },
  { id: "c8", nom: "Aissatou Gueye", metier: "Électricienne", localisation: "Dakar", offre: "Chef d’équipe électricité", date: "6 août 2026", statut: "Retenu", experience: "7 ans d’expérience", telephone: "+221 76 890 12 34", email: "aissatou.gueye@email.sn", lettre: "Électricienne qualifiée avec 7 ans d’expérience en encadrement de chantier, je suis particulièrement intéressée par un poste à responsabilités.", competences: ["Normes NF C 15-100", "Management d’équipe", "Habilitation B2V"], documents: [{ nom: "CV_Aissatou_Gueye.pdf", taille: "1,3 Mo" }] },
];

function CandidatureEntrepriseRow({ c, onOpen }) {
  const premium = PREMIUM_CANDIDATS.has(c.id);
  return (
    <CarteListe
      onOpen={() => onOpen(c)}
      accent={premium}
      visuel={<AvatarListe nom={c.nom} photo={c.photo} />}
      titre={c.nom}
      badges={<>
        {premium && <TierBadge premium size="sm" />}
        <StatusBadge status={c.statut} />
      </>}
      sousTitre={`${c.metier} · ${c.experience}`}
      meta={<>
        <MetaOffre icone={Briefcase}>{c.offre}</MetaOffre>
        <MetaOffre icone={MapPin}>{c.localisation}</MetaOffre>
        <MetaOffre icone={CalendarDays}>Reçue le {c.date}</MetaOffre>
      </>}
      actions={<App.Bouton petit variante="neutre" onClick={() => onOpen(c)}>Voir la candidature</App.Bouton>}
    />
  );
}

function LockedRow({ label, onUnlock }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: COLORS.slateLight }}>{label}</p>
      <button type="button" onClick={onUnlock} className="text-sm inline-flex items-center gap-1.5 font-medium" style={{ color: COLORS.orangeText }}>
        <Lock size={13} /> Débloquer
      </button>
    </div>
  );
}

function CandidatureEntrepriseDetail({ candidat, onDecide, onBack }) {
  const planApi = usePlan();
  const coordOk = !planApi || planApi.can("coordonnees");
  const unlock = () => planApi.requestUpgrade("coordonnees");
  const premium = PREMIUM_CANDIDATS.has(candidat.id);
  const verrou = (
    <button type="button" onClick={unlock} className="inline-flex min-h-[32px] items-center gap-1.5 font-semibold text-marque">
      <Lock size={13} aria-hidden="true" /> Débloquer avec la formule Premium
    </button>
  );
  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux candidatures</BoutonRetour>

      <EnTeteFiche
        visuel={<AvatarListe nom={candidat.nom} photo={candidat.photo} taille="lg" />}
        badges={<>
          <StatusBadge status={candidat.statut} />
          {premium && <TierBadge premium size="sm" />}
        </>}
        titre={candidat.nom}
        sousTitre={`${candidat.metier} · ${candidat.experience}`}
        meta={<>
          <MetaOffre icone={Briefcase}>{candidat.offre}</MetaOffre>
          <MetaOffre icone={MapPin}>{candidat.localisation}</MetaOffre>
          <MetaOffre icone={CalendarDays}>Reçue le {candidat.date}</MetaOffre>
        </>}
        actions={<>
          <App.Bouton variante="neutre" onClick={() => onDecide(candidat.id, "Rejeté")}>Rejeter</App.Bouton>
          <App.Bouton variante="doux" onClick={() => onDecide(candidat.id, "En cours")}><CalendarCheck size={16} aria-hidden="true" /> Planifier un entretien</App.Bouton>
          <App.Bouton onClick={() => onDecide(candidat.id, "Retenu")}>Retenir</App.Bouton>
        </>}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Lettre de motivation">
            <p className="text-[15px] leading-[1.7] text-secondaire">{candidat.lettre}</p>
          </App.Carte>
          <App.Carte titre="Compétences clés">
            <Etiquettes items={candidat.competences} />
          </App.Carte>
          <App.Carte titre="Documents joints" flush>
            <ul className="divide-y divide-base border-t border-base">
              {candidat.documents.map((d) => (
                <li key={d.nom} className="flex items-center justify-between gap-3 px-6 py-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <App.PastilleIcone icone={FileText} ton="neutre" forme="carre" taille="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-principal">{d.nom}</span>
                      <span className="block text-xs text-discret">{d.taille}</span>
                    </span>
                  </span>
                  {coordOk ? (
                    <App.BoutonIcone icone={Download} label={`Télécharger ${d.nom}`} onClick={() => notify(`${d.nom} téléchargé.`)} />
                  ) : (
                    <App.BoutonIcone icone={Lock} label={`Débloquer ${d.nom}`} onClick={unlock} />
                  )}
                </li>
              ))}
            </ul>
          </App.Carte>
        </>}
        cote={<>
          <ApercuFiche
            titre="Aperçu du candidat"
            items={[
              { icone: Briefcase, libelle: "Métier", valeur: candidat.metier },
              { icone: TrendingUp, libelle: "Expérience", valeur: candidat.experience },
              { icone: MapPin, libelle: "Localisation", valeur: candidat.localisation },
              { icone: FileText, libelle: "Offre", valeur: candidat.offre },
              { icone: CalendarDays, libelle: "Reçue le", valeur: candidat.date },
            ]}
          />
          <App.Carte titre="Coordonnées">
            <div className="divide-y divide-dashed divide-base">
              <App.LigneInfo icone={Phone} libelle="Téléphone">{coordOk ? candidat.telephone : verrou}</App.LigneInfo>
              <App.LigneInfo icone={Mail} libelle="E-mail">{coordOk ? candidat.email : verrou}</App.LigneInfo>
            </div>
          </App.Carte>
        </>}
      />
    </div>
  );
}

const STATUTS_CANDIDATURE_ENTREPRISE = ["Tous", "Nouveau", "En cours", "Retenu", "Rejeté"];
const LIBELLES_STATUT_CANDIDATURE = { Tous: "Toutes", Nouveau: "Nouvelles", "En cours": "En cours", Retenu: "Retenues", Rejeté: "Rejetées" };

function CandidaturesEntrepriseScreen() {
  const [candidats, setCandidats] = useStore("candidatures-entreprise", CANDIDATURES_ENTREPRISE_INITIAL);
  const [query, setQuery] = useState("");
  const [offreFilter, setOffreFilter] = useState("toutes");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [selectedId, setSelectedId] = useState(null);

  const offresList = Array.from(new Set(candidats.map((c) => c.offre)));
  const q = sansAccents(query.trim());
  const filtered = candidats.filter((c) =>
    (!q || sansAccents([c.nom, c.metier, c.localisation, ...(c.competences || [])].join(" ")).includes(q)) &&
    (offreFilter === "toutes" || c.offre === offreFilter) &&
    (statutFilter === "Tous" || c.statut === statutFilter)
  ).sort(premiumFirst((c) => PREMIUM_CANDIDATS.has(c.id)));
  const pagination = usePaginationListe(filtered);
  const selected = candidats.find((c) => c.id === selectedId);

  function decide(id, statut) {
    setCandidats((list) => list.map((c) => (c.id === id ? { ...c, statut } : c)));
    notify({ Retenu: "Candidature retenue.", "En cours": "Candidature passée en entretien.", Rejeté: "Candidature rejetée." }[statut] || "Candidature mise à jour.", statut === "Rejeté" ? "info" : "success");
  }

  if (selected) {
    return <CandidatureEntrepriseDetail candidat={selected} onDecide={decide} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Visualisez et gérez toutes les candidatures reçues pour vos offres d’emploi.</p>

      <BarreFiltres label="Rechercher et filtrer les candidatures">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Nom, métier ou compétence…"
          label="Rechercher un candidat"
          className="w-full lg:flex-1"
        />
        <App.SelecteurPeriode
          icone={Briefcase}
          label="Offre"
          valeur={offreFilter}
          onChange={(v) => { setOffreFilter(v); pagination.setPage(1); }}
          options={[{ id: "toutes", label: "Toutes les offres" }, ...offresList]}
        />
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Statut"
          actif={statutFilter}
          onChange={(v) => { setStatutFilter(v); pagination.setPage(1); }}
          options={STATUTS_CANDIDATURE_ENTREPRISE.map((s) => ({ id: s, label: `${LIBELLES_STATUT_CANDIDATURE[s]} (${s === "Tous" ? candidats.length : candidats.filter((c) => c.statut === s).length})` }))}
        />
        <CompteResultats n={filtered.length} nom="candidature" feminin />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((c) => <CandidatureEntrepriseRow key={c.id} c={c} onOpen={(cc) => { setSelectedId(cc.id); window.scrollTo(0, 0); }} />)}
        </div>
      ) : (
        <ListeVide
          icone={ClipboardList}
          titre="Aucune candidature ne correspond"
          texte="Essayez d’autres mots-clés ou retirez un filtre."
          action={<App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setOffreFilter("toutes"); setStatutFilter("Tous"); }}>Effacer les filtres</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Screen 17 : Recherche de Prestataires (Entreprise) ---------- */

const PRESTATAIRES_SEARCH = [
  {
    id: "p1", nom: "Amadou Niang", metier: "Électricien bâtiment", localisation: "Dakar, Plateau", experience: "10 ans d’expérience", note: 4.8, disponible: true,
    telephone: "+221 76 456 78 90", email: "amadou.niang@email.sn",
    timeline: [
      { poste: "Chef d’équipe électricité", periode: "2020 – Présent", lieu: "Senegal Construction", description: "Supervision des chantiers de câblage résidentiels et gestion d’une équipe de 5 électriciens." },
      { poste: "Électricien senior", periode: "2016 – 2020", lieu: "BTP Dakar", description: "Diagnostic de pannes complexes et réalisation de plans électriques pour bâtiments tertiaires." },
      { poste: "Électricien", periode: "2014 – 2016", lieu: "Artisan Elec", description: "Travaux d’installation courants forts et faibles en rénovation immobilière." },
    ],
    competences: ["Installation électrique", "Normes NF C 15-100", "Câblage industriel", "Domotique", "Lecture de plans", "Habilitation B2V"],
    avis: [
      { auteur: "Moussa Sy", date: "12 mai 2026", note: 5, commentaire: "Excellent travail sur mon chantier à Mermoz. Amadou est très professionnel et respecte les normes." },
      { auteur: "Fatoumata Diop", date: "28 avril 2026", note: 5, commentaire: "Disponible et compétent. A rapidement résolu un problème de court-circuit complexe." },
    ],
    certifications: ["Habilitation électrique B2V / BR / BC", "CAP électricien – Lycée technique de Dakar", "Attestation de formation sécurité chantier BTP"],
  },
  { id: "p2", nom: "Fatou Mbaye", metier: "Plombière sanitaire", localisation: "Thiès", experience: "6 ans d’expérience", note: 4.5, disponible: true, telephone: "+221 77 567 89 01", email: "fatou.mbaye@email.sn", timeline: [{ poste: "Plombière sanitaire", periode: "2020 – Présent", lieu: "Indépendante", description: "Installation et dépannage sanitaire pour particuliers et professionnels." }], competences: ["Plomberie sanitaire", "Diagnostic de panne"], avis: [{ auteur: "Cheikh Ba", date: "3 mai 2026", note: 5, commentaire: "Très efficace et de bon conseil." }], certifications: ["CAP Plomberie sanitaire et thermique"] },
  { id: "p3", nom: "Cheikh Fall", metier: "Électricien industriel", localisation: "Dakar, Plateau", experience: "12 ans d’expérience", note: 4.9, disponible: false, telephone: "+221 78 678 90 12", email: "cheikh.fall3@email.sn", timeline: [{ poste: "Électricien industriel", periode: "2018 – Présent", lieu: "Industries Sénégal", description: "Maintenance électrique de lignes de production industrielles." }], competences: ["Électricité industrielle", "Automatisme", "Normes NF C 15-100"], avis: [{ auteur: "Senegal Construction SARL", date: "20 avril 2026", note: 5, commentaire: "Intervention rapide et de très haute qualité." }], certifications: ["BTS électrotechnique", "Habilitation B2V/BR"] },
  { id: "p4", nom: "Mariama Seck", metier: "Couturière", localisation: "Saint-Louis", experience: "8 ans d’expérience", note: 4.7, disponible: true, telephone: "+221 76 789 01 23", email: "mariama.seck@email.sn", timeline: [{ poste: "Couturière", periode: "2017 – Présent", lieu: "Atelier Seck", description: "Confection et retouche de vêtements sur mesure." }], competences: ["Couture sur mesure", "Retouches"], avis: [{ auteur: "Awa Diallo", date: "15 avril 2026", note: 5, commentaire: "Travail soigné et délais respectés." }], certifications: ["Certificat de qualification professionnelle en couture"] },
  { id: "p5", nom: "Ibrahima Gueye", metier: "Menuisier ébéniste", localisation: "Dakar, Plateau", experience: "15 ans d’expérience", note: 4.6, disponible: true, telephone: "+221 77 890 12 34", email: "ibrahima.gueye@email.sn", timeline: [{ poste: "Menuisier ébéniste", periode: "2015 – Présent", lieu: "Atelier Gueye", description: "Fabrication de mobilier sur mesure pour particuliers et entreprises." }], competences: ["Menuiserie", "Ébénisterie", "Finitions bois"], avis: [{ auteur: "Khady Touré", date: "2 avril 2026", note: 5, commentaire: "Un vrai artisan, travail impeccable." }], certifications: ["CAP Menuiserie du bâtiment"] },
  { id: "p6", nom: "Ousmane Diaw", metier: "Soudeur TIG/MIG", localisation: "Thiès", experience: "7 ans d’expérience", note: 4.4, disponible: false, telephone: "+221 78 901 23 45", email: "ousmane.diaw@email.sn", timeline: [{ poste: "Soudeur TIG/MIG", periode: "2019 – Présent", lieu: "Industries Sénégal", description: "Soudure de structures métalliques industrielles." }], competences: ["Soudure TIG", "Soudure MIG"], avis: [{ auteur: "Babacar Niang", date: "18 mars 2026", note: 4, commentaire: "Bon travail, quelques retards sur le planning." }], certifications: ["Certificat de soudage industriel"] },
];

function BadgesPrestataire({ p }) {
  return (
    <>
      {PREMIUM_PRESTATAIRES.has(p.id) && <TierBadge premium size="sm" />}
      {PRESTATAIRES_REGULARISES.has(p.id) && <App.Badge ton="succes" taille="moyen"><BadgeCheck size={13} aria-hidden="true" /> Activité régularisée</App.Badge>}
    </>
  );
}

function PrestataireSearchCard({ p, onOpen }) {
  return (
    <CarteListe
      onOpen={() => onOpen(p)}
      accent={PREMIUM_PRESTATAIRES.has(p.id)}
      visuel={<AvatarListe nom={p.nom} photo={p.photo} />}
      titre={p.nom}
      badges={<BadgesPrestataire p={p} />}
      sousTitre={`${p.metier} · ${p.experience}`}
      meta={<>
        <StatusBadge status={p.disponible ? "Disponible" : "Occupé"} />
        <MetaOffre icone={Star}>{noteFr(p.note)}/5</MetaOffre>
        <MetaOffre icone={MapPin}>{p.localisation}</MetaOffre>
      </>}
      actions={<App.Bouton petit variante="neutre" onClick={() => onOpen(p)}>Voir le profil</App.Bouton>}
    >
      <div className="mt-3">
        <Etiquettes items={p.competences} max={3} />
      </div>
    </CarteListe>
  );
}

function PrestataireProfilDetail({ p, onBack }) {
  const planApi = usePlan();
  const contactOk = !planApi || planApi.can("contactPrestataires");
  const gateContact = (fn) => (planApi ? planApi.gate("contactPrestataires", fn) : fn());
  const [proposed, setProposed] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour à la recherche</BoutonRetour>

      <EnTeteFiche
        visuel={<AvatarListe nom={p.nom} photo={p.photo} taille="lg" />}
        badges={<>
          <StatusBadge status={p.disponible ? "Disponible" : "Occupé"} />
          <BadgesPrestataire p={p} />
        </>}
        titre={p.nom}
        sousTitre={`${p.metier} · ${p.experience}`}
        meta={<>
          <MetaOffre icone={Star}>{noteFr(p.note)}/5 · {p.avis.length} avis</MetaOffre>
          <MetaOffre icone={MapPin}>{p.localisation}</MetaOffre>
        </>}
        actions={proposed ? (
          <App.Badge ton="succes" taille="moyen"><Check size={13} aria-hidden="true" /> Mission proposée</App.Badge>
        ) : (
          <>
            <App.Bouton variante="neutre" onClick={() => gateContact(() => setContactOpen((o) => !o))} aria-expanded={contactOpen}>
              {contactOk ? <MessageCircle size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />} Contacter
            </App.Bouton>
            <App.Bouton onClick={() => gateContact(() => { setProposed(true); notify(`Mission proposée à ${p.nom}. Vous serez prévenu(e) de sa réponse.`); })}>
              {contactOk ? <Send size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />} Proposer une mission
            </App.Bouton>
          </>
        )}
      />

      {contactOpen && (
        <App.Carte titre={`Message à ${p.nom}`}>
          <label htmlFor="contact-msg" className="sr-only">Message à {p.nom}</label>
          <textarea id="contact-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bonjour, je souhaiterais échanger sur un besoin…" className={FORM.zone()} />
          <div className="mt-3 flex flex-wrap gap-2">
            <App.Bouton petit disabled={!message.trim()} onClick={() => { notify(`Message envoyé à ${p.nom}.`); setMessage(""); setContactOpen(false); }}>
              <Send size={15} aria-hidden="true" /> Envoyer
            </App.Bouton>
            <App.Bouton petit variante="neutre" onClick={() => setContactOpen(false)}>Annuler</App.Bouton>
          </div>
        </App.Carte>
      )}

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Expérience professionnelle">
            <FriseParcours etapes={p.timeline.map((t) => ({ poste: t.poste, structure: t.lieu, periode: t.periode, description: t.description }))} />
          </App.Carte>
          <App.Carte titre="Avis clients" sousTitre={`${p.avis.length} avis · note moyenne ${noteFr(p.note)}/5`}>
            <ListeAvis avis={p.avis} />
          </App.Carte>
        </>}
        cote={<>
          <ApercuFiche
            titre="Aperçu du prestataire"
            items={[
              { icone: Wrench, libelle: "Métier", valeur: p.metier },
              { icone: TrendingUp, libelle: "Expérience", valeur: p.experience },
              { icone: MapPin, libelle: "Localisation", valeur: p.localisation },
              { icone: Star, libelle: "Note moyenne", valeur: `${noteFr(p.note)}/5` },
              { icone: Phone, libelle: "Téléphone", valeur: p.telephone },
              { icone: Mail, libelle: "E-mail", valeur: p.email },
            ]}
          />
          <App.Carte titre="Compétences">
            <Etiquettes items={p.competences} />
          </App.Carte>
          <App.Carte titre="Certifications">
            <ListeCoches items={p.certifications} />
          </App.Carte>
        </>}
      />
    </div>
  );
}

function PrestatairesSearchScreen() {
  const [query, setQuery] = useState("");
  const [metier, setMetier] = useState("tous");
  const [dispo, setDispo] = useState("tous");
  const [selectedId, setSelectedId] = useState(null);

  const metiers = Array.from(new Set(PRESTATAIRES_SEARCH.map((p) => p.metier))).sort();
  const DISPOS = [
    { id: "tous", label: "Tous", test: () => true },
    { id: "disponibles", label: "Disponibles", test: (p) => p.disponible },
    { id: "occupes", label: "Occupés", test: (p) => !p.disponible },
  ];
  const q = sansAccents(query.trim());
  const filtered = PRESTATAIRES_SEARCH.filter((p) =>
    (!q || sansAccents([p.nom, p.metier, p.localisation, ...p.competences].join(" ")).includes(q)) &&
    (metier === "tous" || p.metier === metier) &&
    DISPOS.find((d) => d.id === dispo).test(p)
  ).sort(premiumFirst((p) => PREMIUM_PRESTATAIRES.has(p.id)));
  const pagination = usePaginationListe(filtered);
  const selected = PRESTATAIRES_SEARCH.find((p) => p.id === selectedId);

  if (selected) return <PrestataireProfilDetail key={selected.id} p={selected} onBack={() => setSelectedId(null)} />;

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Trouvez des artisans et techniciens qualifiés, vérifiés par LIGGEEY, pour vos besoins.</p>

      <BarreFiltres label="Rechercher et filtrer les prestataires">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Nom, métier, compétence ou ville…"
          label="Rechercher un prestataire"
          className="w-full lg:flex-1"
        />
        <App.SelecteurPeriode
          icone={Wrench}
          label="Métier"
          valeur={metier}
          onChange={(v) => { setMetier(v); pagination.setPage(1); }}
          options={[{ id: "tous", label: "Tous les métiers" }, ...metiers]}
        />
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Disponibilité"
          actif={dispo}
          onChange={(v) => { setDispo(v); pagination.setPage(1); }}
          options={DISPOS.map((d) => ({ id: d.id, label: `${d.label} (${PRESTATAIRES_SEARCH.filter(d.test).length})` }))}
        />
        <CompteResultats n={filtered.length} nom="prestataire" />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((p) => <PrestataireSearchCard key={p.id} p={p} onOpen={(pp) => { setSelectedId(pp.id); window.scrollTo(0, 0); }} />)}
        </div>
      ) : (
        <ListeVide
          titre="Aucun prestataire ne correspond"
          texte="Essayez d’autres mots-clés ou retirez un filtre."
          action={<App.Bouton petit variante="neutre" onClick={() => { setQuery(""); setMetier("tous"); setDispo("tous"); }}>Effacer les filtres</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Screen 18 : Profil Entreprise ---------- */

const PROFIL_ENTREPRISE_INITIAL = {
  nom: "Senegal Construction SARL",
  secteurPrincipal: "BTP et construction",
  ninea: "2938472 2G3",
  rccm: "SN-DKR-2008-B-1120",
  taille: "45-50 employés",
  chiffreAffaires: "500 millions à 1 milliard de FCFA",
  telephone: "+221 33 824 55 99",
  email: "contact@senegalconstruct.sn",
  siteWeb: "www.senegalconstruct.sn",
  adresse: "Avenue Cheikh Anta Diop, Dakar",
  fondee: "2008",
  ville: "Dakar, Sénégal",
  description: "Senegal Construction SARL est un acteur leader du BTP au Sénégal depuis plus de 15 ans. Nous intervenons sur des projets d’envergure nationale, résidentiels et industriels, en garantissant des standards de qualité et de sécurité internationaux. Notre force réside dans nos équipes locales hautement qualifiées.",
  secteurs: ["BTP", "Électricité", "Plomberie", "Maçonnerie", "Métallerie"],
};

function EditableTags({ tags, onChange }) {
  const [input, setInput] = useState("");
  function add() {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput("");
    }
  }
  return (
    <div>
      {tags.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="inline-flex items-center gap-1 rounded-full bg-marque-doux py-1 pl-3 pr-1 text-sm font-medium text-marque-fort">
              {t}
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Retirer ${t}`} className="grid h-7 w-7 place-items-center rounded-full hover:bg-marque-doux-survol">
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Ajouter un secteur"
          aria-label="Ajouter un secteur"
          className={`${FORM.champ()} flex-1`}
        />
        <App.Bouton variante="doux" onClick={add} className="min-h-[48px]"><Plus size={16} aria-hidden="true" /> Ajouter</App.Bouton>
      </div>
    </div>
  );
}

const TAILLES_ENTREPRISE = ["1-10 employés", "11-45 employés", "45-50 employés", "50-100 employés", "100+ employés"];

function ProfilEntrepriseEdit({ profile, onSave, onCancel }) {
  const vide = (x) => !String(x || "").trim();
  const f = useFormulaire(profile, (v) => ({
    nom: vide(v.nom) && "Indiquez le nom de l’entreprise.",
    secteurPrincipal: vide(v.secteurPrincipal) && "Indiquez le secteur principal.",
    ninea: vide(v.ninea) && "Indiquez le NINEA.",
    rccm: vide(v.rccm) && "Indiquez le numéro RCCM.",
    telephone: vide(v.telephone) && "Indiquez un numéro de téléphone.",
    email: vide(v.email) ? "Indiquez une adresse e-mail." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) && "Saisissez une adresse e-mail valide, par exemple nom@exemple.com.",
    adresse: vide(v.adresse) && "Indiquez l’adresse de l’établissement.",
    description: vide(v.description) && "Présentez votre entreprise en quelques phrases.",
  }));
  const { v, set, err, attrs } = f;
  const texte = (id, k, label, props = {}) => (
    <Champ id={id} label={label} requis={props.requis} erreur={err(k)} aide={props.aide} large={props.large}>
      <input {...attrs(id, k, { requis: props.requis, aide: props.aide })} type={props.type || "text"} placeholder={props.placeholder} className={FORM.champ(err(k))} />
    </Champ>
  );

  return (
    <App.Carte as="form" onSubmit={f.soumettre(onSave)} noValidate titre="Modifier le profil" sousTitre="Les champs marqués d’un * sont obligatoires.">
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-doux p-4">
        {v.logo ? (
          <img src={v.logo} alt={`Logo ${v.nom}`} className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-marque-doux text-base font-semibold text-marque-fort" aria-hidden="true">
            {initials(v.nom)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-principal">Logo de l’entreprise</p>
          <p className="text-sm text-discret">Image carrée, au format JPG ou PNG.</p>
        </div>
        <FilePickerButton
          accept="image/*"
          onPick={(fichier) => { const r = new FileReader(); r.onload = () => set("logo", r.result); r.readAsDataURL(fichier); }}
          className={FORM.fichier}
        >
          <Upload size={15} aria-hidden="true" /> Changer le logo
        </FilePickerButton>
      </div>

      <h3 className={FORM.section}>L’entreprise</h3>
      <div className={`${FORM.grille} mb-8`}>
        {texte("ent-nom", "nom", "Nom de l’entreprise", { requis: true, large: true })}
        {texte("ent-secteur", "secteurPrincipal", "Secteur principal", { requis: true, placeholder: "Ex. : BTP" })}
        <Champ id="ent-taille" label="Taille de l’entreprise" requis>
          <ListeChamp {...attrs("ent-taille", "taille", { requis: true })}>
            {TAILLES_ENTREPRISE.map((t) => <option key={t}>{t}</option>)}
          </ListeChamp>
        </Champ>
        <Champ id="ent-description" label="Présentation" requis erreur={err("description")} aide="Votre activité, vos valeurs, ce que vous proposez à vos équipes." large>
          <textarea {...attrs("ent-description", "description", { requis: true, aide: true })} rows={4} className={FORM.zone(err("description"))} />
        </Champ>
        <div className="sm:col-span-2">
          <p className={AUTH.libelle}>Secteurs d’activité associés</p>
          <EditableTags tags={v.secteurs || []} onChange={(tags) => set("secteurs", tags)} />
        </div>
      </div>

      <h3 className={FORM.section}>Informations légales</h3>
      <div className={`${FORM.grille} mb-8`}>
        {texte("ent-ninea", "ninea", "NINEA", { requis: true })}
        {texte("ent-rccm", "rccm", "RCCM", { requis: true, placeholder: "Ex. : SN-DKR-2020-B-1234" })}
      </div>

      <h3 className={FORM.section}>Coordonnées</h3>
      <div className={FORM.grille}>
        {texte("ent-telephone", "telephone", "Téléphone", { requis: true, type: "tel", placeholder: "Ex. : 77 123 45 67" })}
        {texte("ent-email", "email", "E-mail de contact", { requis: true, type: "email", placeholder: "contact@entreprise.sn" })}
        {texte("ent-site", "siteWeb", "Site web", { placeholder: "Ex. : www.entreprise.sn" })}
        {texte("ent-adresse", "adresse", "Adresse de l’établissement principal", { requis: true, placeholder: "Ex. : Rue 10, Plateau, Dakar" })}
      </div>

      <AlerteFormulaire visible={f.essai && f.invalide}>Complétez les champs signalés pour enregistrer le profil.</AlerteFormulaire>
      <div className={FORM.actions}>
        <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
        <App.Bouton type="submit">Enregistrer le profil</App.Bouton>
      </div>
    </App.Carte>
  );
}

function ProfilEntrepriseScreen({ offres, onNavigate }) {
  const user = USER_BY_ESPACE.entreprise;
  const [profile, setProfile] = useStore("profil-entreprise", PROFIL_ENTREPRISE_INITIAL);
  const [candidats] = useStore("candidatures-entreprise", CANDIDATURES_ENTREPRISE_INITIAL);
  const [editing, setEditing] = useState(false);
  const completion = useCompletionEntreprise();

  if (editing) {
    return (
      <div className="space-y-6">
        <BoutonRetour onClick={() => setEditing(false)}>Retour au profil</BoutonRetour>
        <ProfilEntrepriseEdit
          profile={profile}
          onCancel={() => setEditing(false)}
          onSave={(v) => { setProfile(v); setEditing(false); notify("Profil de l’entreprise mis à jour."); }}
        />
      </div>
    );
  }

  const actives = offres.filter((o) => o.statut === "Active");
  const totalCandidatures = offres.reduce((s, o) => s + (o.nbCandidatures || 0), 0);
  const aTraiter = candidats.filter((c) => c.statut === "Nouveau").length;

  return (
    <div className="space-y-6">
      <EnTeteFiche
        visuel={profile.logo
          ? <img src={profile.logo} alt={`Logo ${profile.nom}`} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
          : <LogoEntreprise nom={profile.nom} taille="lg" />}
        badges={<>
          <ProfileTierBadge />
          <App.Badge ton="marque" taille="moyen">{profile.secteurPrincipal}</App.Badge>
        </>}
        titre={profile.nom}
        sousTitre={`${profile.taille} · fondée en ${profile.fondee}`}
        meta={<>
          <MetaOffre icone={MapPin}>{profile.ville}</MetaOffre>
          <MetaOffre icone={Briefcase}>{actives.length} offre{actives.length > 1 ? "s" : ""} active{actives.length > 1 ? "s" : ""}</MetaOffre>
          {profile.siteWeb && <MetaOffre icone={Building2}>{profile.siteWeb}</MetaOffre>}
        </>}
        actions={<>
          <App.Bouton variante="neutre" onClick={() => onNavigate("offres", { creer: true })}><Plus size={16} aria-hidden="true" /> Publier une offre</App.Bouton>
          <App.Bouton onClick={() => setEditing(true)}><Pencil size={16} aria-hidden="true" /> Modifier le profil</App.Bouton>
        </>}
      />

      <ChiffresProfil
        items={[
          { icone: Briefcase, valeur: actives.length, label: "Offres actives", detail: `${offres.length} offres au total`, onClick: () => onNavigate("offres") },
          { icone: FileText, valeur: totalCandidatures, label: "Candidatures reçues", detail: "Toutes offres confondues", ton: "info", onClick: () => onNavigate("candidatures") },
          { icone: ClipboardList, valeur: aTraiter, label: "Candidatures à traiter", detail: "Nouvelles candidatures", ton: "alerte", onClick: () => onNavigate("candidatures") },
          { icone: Building2, valeur: `${completion.valeur} %`, label: "Profil complété", detail: completion.valeur < 100 ? "Ajoutez les éléments manquants" : "Profil complet", ton: "succes", onClick: completion.valeur < 100 ? () => setEditing(true) : undefined },
        ]}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="À propos de l’entreprise">
            <p className="text-[15px] leading-[1.7] text-secondaire">{profile.description}</p>
          </App.Carte>
          <App.Carte titre="Nos offres actives" sousTitre="Visibles par les talents sur LIGGEEY" actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("offres")}>Gérer les offres</App.Bouton>} flush>
            {actives.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-secondaire">Aucune offre active pour le moment.</p>
            ) : (
              <ul className="divide-y divide-base border-t border-base">
                {actives.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <App.PastilleIcone icone={Briefcase} forme="carre" taille="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-principal">{o.titre}</p>
                        <p className="truncate text-xs text-discret">{o.localisation} · {o.contrat} · {o.salaire}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-marque">{o.nbCandidatures} candidatures</span>
                  </li>
                ))}
              </ul>
            )}
          </App.Carte>
          <App.Carte titre="Secteurs d’activité">
            <Etiquettes items={profile.secteurs} />
          </App.Carte>
        </>}
        cote={<>
          <App.Carte titre="Votre contact recrutement">
            <div className="mb-4 flex items-center gap-3">
              <AvatarListe nom={user.name} />
              <div className="min-w-0">
                <p className="font-semibold text-principal">{user.name}</p>
                <p className="text-sm text-discret">{RECRUTEUR_ENTREPRISE.fonction}</p>
              </div>
            </div>
            <div className="divide-y divide-dashed divide-base">
              <App.LigneInfo icone={Phone} libelle="Téléphone">{RECRUTEUR_ENTREPRISE.telephone}</App.LigneInfo>
              <App.LigneInfo icone={Mail} libelle="E-mail">{RECRUTEUR_ENTREPRISE.email}</App.LigneInfo>
            </div>
          </App.Carte>
          <ApercuFiche
            titre="Informations administratives"
            items={[
              { icone: FileCheck2, libelle: "NINEA", valeur: profile.ninea },
              { icone: FileText, libelle: "RCCM", valeur: profile.rccm },
              { icone: Users2, libelle: "Taille", valeur: profile.taille },
              { icone: Wallet, libelle: "Chiffre d’affaires", valeur: profile.chiffreAffaires },
              { icone: MapPin, libelle: "Adresse", valeur: profile.adresse },
              { icone: Phone, libelle: "Standard", valeur: profile.telephone },
              { icone: Mail, libelle: "E-mail", valeur: profile.email },
            ]}
          />
          <CarteCompletion completion={completion} onAction={() => setEditing(true)} />
          <ProfileTierCard />
        </>}
      />
    </div>
  );
}

/* ================= ADMIN ESPACE ================= */

const ADMIN_PAGE_SIZE = 8;

function ActionButton({ label, variant = "primary", onClick, icon: Icon }) {
  const styles = {
    danger: { border: `1px solid ${COLORS.danger}`, color: COLORS.danger, background: COLORS.surface },
    warning: { border: `1px solid ${COLORS.warning}`, color: COLORS.warning, background: COLORS.surface },
    primary: { border: "none", color: COLORS.onOrange, background: COLORS.orange },
    neutral: { border: `1px solid ${COLORS.border}`, color: COLORS.slate, background: COLORS.surface },
  };
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1.5 rounded px-5 py-2.5 text-sm font-semibold" style={styles[variant]}>
      {Icon && <Icon size={14} />} {label}
    </button>
  );
}

function AdminSubListCard({ title, items }) {
  return (
    <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
      <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>{title}</h3>
      {items.length === 0 && <p className="text-sm" style={{ color: COLORS.slateLight }}>Aucun élément.</p>}
      {items.map((it, i) => (
        <div key={i} className="flex items-center justify-between py-2" style={{ borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{it.title}</p>
            {it.sub && <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{it.sub}</p>}
          </div>
          {it.badge ? <StatusBadge status={it.badge} /> : it.value ? <span className="text-xs font-semibold shrink-0" style={{ color: COLORS.slateLight }}>{it.value}</span> : null}
        </div>
      ))}
    </div>
  );
}

function AdminInfoCard({ title, rows }) {
  return (
    <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
      <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>{title}</h3>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between py-1.5">
          <p className="text-sm" style={{ color: COLORS.slateLight }}>{r.label}</p>
          {r.badge ? <StatusBadge status={r.value} /> : <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{r.value}</p>}
        </div>
      ))}
    </div>
  );
}

function AdminEntityModule({ title, subtitle, columns, filters, initialData, searchKeys, renderDetail, exportExtra = [] }) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState(() => Object.fromEntries(filters.map((f) => [f.key, "all"])));
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const selected = data.find((d) => d.id === selectedId);

  function update(id, patch) {
    setData((list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }
  function remove(id) {
    setData((list) => list.filter((d) => d.id !== id));
    setSelectedId(null);
  }

  if (selected) {
    return renderDetail(selected, {
      onBack: () => setSelectedId(null),
      update: (patch) => update(selected.id, patch),
      remove: () => remove(selected.id),
    });
  }

  const filtered = data.filter((row) => {
    const matchesQuery = searchKeys.map((k) => row[k]).join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesFilters = filters.every((f) => filterValues[f.key] === "all" || f.matcher(row, filterValues[f.key]));
    return matchesQuery && matchesFilters;
  });
  const paged = filtered.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE);

  // Export : toutes les lignes filtrées. Une colonne exporte row[key], ou exportValue(row) ;
  // exportSub ajoute le sous-texte de la cellule (métier, entreprise…) dans sa propre colonne.
  const colonnesExport = [
    ...columns.flatMap((c) => [
      { titre: c.label, valeur: c.exportValue || ((r) => r[c.key]) },
      ...(c.exportSub ? [{ titre: c.exportSub.label, valeur: (r) => r[c.exportSub.key] }] : []),
    ]),
    ...exportExtra.map((x) => ({ titre: x.label, valeur: x.value || ((r) => r[x.key]) })),
  ];
  const filtresActifs = [
    ...filters.filter((f) => filterValues[f.key] !== "all").map((f) => filterValues[f.key]),
    ...(query.trim() ? [`recherche « ${query.trim()} »`] : []),
  ];

  const colonnes = [
    ...columns.map((c) => ({ cle: c.key, titre: c.label, rendu: c.render ? c.render : (row) => <span className="text-principal">{row[c.key]}</span> })),
    {
      cle: "__actions",
      titre: "Actions",
      alignement: "droite",
      rendu: (row) => (
        <App.BoutonIcone icone={Eye} label={`Voir le détail`} variante="fantome" taille="sm" onClick={(e) => { e.stopPropagation(); setSelectedId(row.id); }} />
      ),
    },
  ];

  return (
    <div>
      {subtitle && <p className="mb-6 text-sm text-secondaire">{subtitle}</p>}

      <App.Carte titre={title} sousTitre={`${filtered.length} ${filtered.length > 1 ? "éléments" : "élément"}`} flush>
        <div className="flex flex-wrap items-center gap-3 px-6 pb-4 pt-2">
          <App.ChampRecherche
            variante="carre"
            valeur={query}
            onChange={(v) => { setQuery(v); setPage(1); }}
            placeholder="Rechercher…"
            label={`Rechercher dans ${title.toLowerCase()}`}
            className="w-full max-w-xs"
          />
          {filters.map((f) => (
            <App.SelecteurPeriode
              key={f.key}
              icone={null}
              label={f.label}
              valeur={filterValues[f.key]}
              onChange={(v) => { setFilterValues((fv) => ({ ...fv, [f.key]: v })); setPage(1); }}
              options={[{ id: "all", label: f.label }, ...f.options.map((o) => ({ id: o, label: o }))]}
            />
          ))}
          <ExportAdmin titre={title} colonnes={colonnesExport} lignes={filtered} filtres={filtresActifs} className="ml-auto" />
        </div>
        <App.Tableau colonnes={colonnes} lignes={paged} onLigne={(row) => setSelectedId(row.id)} vide="Aucun résultat pour cette recherche." legende={title} className="px-6" />
        <div className="px-6 py-4">
          <App.PaginationApp page={page} total={filtered.length} parPage={ADMIN_PAGE_SIZE} onChange={setPage} />
        </div>
      </App.Carte>
    </div>
  );
}

/* Bouton « Exporter » des listes admin (PDF, Excel, CSV), avec notification à la fin. */
function ExportAdmin({ titre, colonnes, lignes, filtres = [], className }) {
  return (
    <App.MenuExport
      titre={titre}
      colonnes={colonnes}
      lignes={lignes}
      sousTitre={filtres.length ? `Filtres : ${filtres.join(", ")}` : undefined}
      onTermine={(nom) => notify(`Fichier « ${nom} » téléchargé.`)}
      onErreur={() => notify("L’export n’a pas abouti. Réessayez dans un instant.", "info")}
      className={className}
    />
  );
}

function IdentityCell({ nom, sub, photo }) {
  return (
    <App.CelluleIdentite
      visuel={photo ? <SafeImg src={photo} alt={nom} className="h-9 w-9 shrink-0 rounded-full object-cover" /> : <App.Avatar nom={nom} taille="sm" />}
      titre={nom}
      sousTitre={sub}
    />
  );
}

/* ---------- Admin Dashboard ---------- */

const INSCRIPTIONS_MENSUELLES = [
  { mois: "Jan", valeur: 320 }, { mois: "Fév", valeur: 360 }, { mois: "Mar", valeur: 430 },
  { mois: "Avr", valeur: 390 }, { mois: "Mai", valeur: 460 }, { mois: "Jun", valeur: 520 },
  { mois: "Jul", valeur: 560 }, { mois: "Aoû", valeur: 610 },
];
const REPARTITION_PROFILS = [
  { name: "Chercheurs", value: 58, color: "rgb(var(--primaire-500))" },
  { name: "Prestataires", value: 27, color: "rgb(var(--texte-secondaire))" },
  { name: "Entreprises", value: 15, color: "rgb(var(--primaire-250))" },
];
const DERNIERES_INSCRIPTIONS = [
  { nom: "Amadou Diallo", type: "Chercheur d’emploi", ville: "Dakar", date: "12 juillet 2026", statut: "Nouveau" },
  { nom: "Sokhna Fall", type: "Prestataire", ville: "Thiès", date: "11 juillet 2026", statut: "Vérifié" },
  { nom: "Senegal Construction", type: "Entreprise", ville: "Dakar", date: "10 juillet 2026", statut: "Nouveau" },
  { nom: "Marième Diop", type: "Chercheur d’emploi", ville: "Dakar", date: "9 juillet 2026", statut: "Vérifié" },
  { nom: "Amadou Sow", type: "Prestataire", ville: "Thiès", date: "8 juillet 2026", statut: "Nouveau" },
];

/* Infobulle des graphiques, aux couleurs de la bibliothèque */
function InfoBulleGraphique({ active, payload, label, unite = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-base bg-surface px-3 py-2 text-sm shadow-carte">
      <p className="text-discret">{label}</p>
      <p className="font-semibold text-principal">{payload[0].value.toLocaleString("fr-FR")}{unite}</p>
    </div>
  );
}

const AXE = { fontSize: 12, fill: COLORS.slateLight };

function AdminDashboardScreen({ onNavigate, todos }) {
  const kpis = [
    { label: "Utilisateurs", value: "25 694", delta: "+12 % sur le mois", icon: Users2, to: "chercheurs" },
    { label: "Offres actives", value: "847", delta: "+8 % sur le mois", icon: Briefcase, to: "offres" },
    { label: "Candidatures", value: "3 421", delta: "+15 % sur le mois", icon: ClipboardList, to: "candidatures" },
    { label: "Missions en cours", value: "156", delta: "+5 % sur le mois", icon: ClipboardCheck, to: "missions" },
  ];
  const alertes = [
    { label: "Profils en attente de vérification", value: 23, target: "verifications", icon: ShieldCheck, ton: "alerte" },
    { label: "Signalements en cours", value: 7, target: "candidatures", icon: Flag, ton: "danger" },
    { label: "Utilisateurs suspendus", value: 4, target: "chercheurs", icon: Users2, ton: "neutre" },
  ];
  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Vue d’ensemble de la plateforme LIGGEEY et de ses utilisateurs.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <App.CarteStat key={k.label} icone={k.icon} titre={k.label} detail={k.delta} tendance="hausse" valeur={k.value} onClick={() => onNavigate(k.to)} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte titre="Inscriptions mensuelles" sousTitre="Nouveaux comptes créés, tous profils" className="xl:col-span-2">
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={INSCRIPTIONS_MENSUELLES} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="degradeInscriptions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--primaire-500))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="rgb(var(--primaire-500))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgb(var(--bordure-base))" />
                <XAxis dataKey="mois" tick={AXE} axisLine={false} tickLine={false} />
                <YAxis tick={AXE} axisLine={false} tickLine={false} />
                <Tooltip content={<InfoBulleGraphique unite=" inscriptions" />} cursor={{ stroke: "rgb(var(--bordure-forte))" }} />
                <Area type="monotone" dataKey="valeur" stroke="rgb(var(--primaire-500))" strokeWidth={2.5} fill="url(#degradeInscriptions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </App.Carte>

        <App.Carte titre="Répartition des profils" sousTitre="Part de chaque type de compte">
          <div className="mx-auto" style={{ width: 200, height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={REPARTITION_PROFILS} dataKey="value" innerRadius={68} outerRadius={92} paddingAngle={3} stroke="none">
                  {REPARTITION_PROFILS.map((p) => <Cell key={p.name} fill={p.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {REPARTITION_PROFILS.map((p) => (
              <li key={p.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                <span className="text-secondaire">{p.name}</span>
                <span className="font-semibold text-principal">{p.value} %</span>
              </li>
            ))}
          </ul>
        </App.Carte>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte
          titre="Dernières inscriptions"
          className="xl:col-span-2"
          actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("chercheurs")}>Voir tout</App.Bouton>}
        >
          <App.Tableau
            legende="Dernières inscriptions"
            cleLigne="nom"
            lignes={DERNIERES_INSCRIPTIONS}
            colonnes={[
              { cle: "nom", titre: "Utilisateur", rendu: (d) => <IdentityCell nom={d.nom} sub={d.type} /> },
              { cle: "ville", titre: "Ville" },
              { cle: "date", titre: "Inscription" },
              { cle: "statut", titre: "Statut", rendu: (d) => <StatusBadge status={d.statut} /> },
            ]}
          />
        </App.Carte>

        <div className="space-y-4">
          <TodoPanel items={todos} onNavigate={onNavigate} />
          <App.Carte titre="Points de vigilance">
            <ul className="divide-y divide-dashed divide-base">
              {alertes.map((a) => (
                <li key={a.label}>
                  <button type="button" onClick={() => onNavigate(a.target)} className="flex w-full items-center gap-3 py-3 text-left">
                    <App.PastilleIcone icone={a.icon} ton={a.ton} taille="sm" />
                    <span className="min-w-0 flex-1 text-sm text-secondaire">{a.label}</span>
                    <span className="text-lg font-semibold text-principal">{a.value}</span>
                    <ChevronRight size={16} className="text-discret" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </App.Carte>
        </div>
      </div>
    </div>
  );
}

/* ---------- Chercheurs (Admin) ---------- */

const CHERCHEURS_ADMIN_INITIAL = [
  { id: "ch1", nom: "Moussa Diop", photo: "/images/plateforme/portraits/moussa-diop.jpg", metier: "Électricien bâtiment", ville: "Dakar", date: "12 juin 2025", statut: "Actif", email: "moussa.diop@email.sn", telephone: "+221 77 123 45 67", naissance: "15 mars 1992", genre: "Homme", experience: "8 ans d’expérience", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d’équipe", "Habilitation B2V"], inscritLe: "12 juin 2025", derniereConnexion: "25 août 2026", candidatures: [{ title: "Chef d’équipe électricité", sub: "Senegal Construction", badge: "En cours" }, { title: "Technicien maintenance", sub: "Dakar Services", badge: "Retenu" }, { title: "Électricien chantier", sub: "Mbour Construction", badge: "Rejeté" }], formations: [{ title: "Sécurité électrique", badge: "Certifié" }, { title: "Lecture de plans BTP", badge: "En cours d’apprentissage" }] },
  { id: "ch2", nom: "Fatou Sarr", photo: "/images/plateforme/portraits/fatou-sarr.jpg", metier: "Plombière sanitaire", ville: "Thiès", date: "14 août 2025", statut: "En attente", email: "fatou.sarr@email.sn", telephone: "+221 76 234 56 78", naissance: "2 juillet 1995", genre: "Femme", experience: "5 ans d’expérience", competences: ["Plomberie sanitaire", "Diagnostic de panne"], inscritLe: "14 août 2025", derniereConnexion: "20 août 2026", candidatures: [{ title: "Plombier qualifié", sub: "Diallo & Fils", badge: "En cours" }], formations: [] },
  { id: "ch3", nom: "Ibrahima Diallo", photo: "/images/plateforme/portraits/ibrahima-diallo.jpg", metier: "Soudeur industriel", ville: "Saint-Louis", date: "20 septembre 2025", statut: "Actif", email: "ibrahima.diallo@email.sn", telephone: "+221 78 345 67 89", naissance: "22 novembre 1990", genre: "Homme", experience: "6 ans d’expérience", competences: ["Soudure TIG", "Soudure MIG"], inscritLe: "20 septembre 2025", derniereConnexion: "23 août 2026", candidatures: [{ title: "Technicien maintenance", sub: "Dakar Services Pro", badge: "Retenu" }], formations: [{ title: "Soudure TIG-MIG", badge: "Certifié" }] },
  { id: "ch4", nom: "Aminata Ndiaye", photo: "/images/plateforme/portraits/aminata-ndiaye.jpg", metier: "Couturière", ville: "Dakar", date: "3 novembre 2025", statut: "Vérifié", email: "aminata.ndiaye@email.sn", telephone: "+221 77 456 78 90", naissance: "10 janvier 1988", genre: "Femme", experience: "10 ans d’expérience", competences: ["Couture sur mesure", "Gestion d’atelier"], inscritLe: "3 novembre 2025", derniereConnexion: "22 août 2026", candidatures: [{ title: "Couturière atelier", sub: "Atelier Couture", badge: "Rejeté" }], formations: [] },
  { id: "ch5", nom: "Ousmane Ba", photo: "/images/plateforme/portraits/ousmane-ba.jpg", metier: "Menuisier ébéniste", ville: "Kaolack", date: "18 janvier 2026", statut: "Suspendu", email: "ousmane.ba@email.sn", telephone: "+221 76 567 89 01", naissance: "5 mai 1993", genre: "Homme", experience: "4 ans d’expérience", competences: ["Menuiserie", "Ébénisterie"], inscritLe: "18 janvier 2026", derniereConnexion: "10 juin 2026", candidatures: [{ title: "Menuisier ébéniste", sub: "Ndiaye Menuiserie", badge: "En cours" }], formations: [] },
  { id: "ch6", nom: "Mariama Tall", photo: "/images/plateforme/portraits/mariama-tall.jpg", metier: "Carreleur", ville: "Rufisque", date: "25 mars 2026", statut: "Actif", email: "mariama.tall@email.sn", telephone: "+221 78 678 90 12", naissance: "18 septembre 1994", genre: "Femme", experience: "4 ans d’expérience", competences: ["Pose de carrelage", "Finitions"], inscritLe: "25 mars 2026", derniereConnexion: "21 août 2026", candidatures: [{ title: "Carreleur intérieur", sub: "Senegal Construction", badge: "Nouveau" }], formations: [] },
  { id: "ch7", nom: "Abdoulaye Sow", photo: "/images/plateforme/portraits/abdoulaye-sow.jpg", metier: "Peintre bâtiment", ville: "Ziguinchor", date: "10 mai 2026", statut: "Nouveau", email: "abdoulaye.sow@email.sn", telephone: "+221 77 789 01 23", naissance: "30 décembre 1996", genre: "Homme", experience: "3 ans d’expérience", competences: ["Peinture intérieure/extérieure", "Enduits"], inscritLe: "10 mai 2026", derniereConnexion: "19 août 2026", candidatures: [{ title: "Peintre bâtiment", sub: "Rufisque Bâtiment", badge: "En cours" }], formations: [] },
  { id: "ch8", nom: "Aissatou Gueye", photo: "/images/plateforme/portraits/aissatou-gueye.jpg", metier: "Électricienne", ville: "Mbour", date: "2 juillet 2026", statut: "En attente", email: "aissatou.gueye@email.sn", telephone: "+221 76 890 12 34", naissance: "14 février 1991", genre: "Femme", experience: "7 ans d’expérience", competences: ["Normes NF C 15-100", "Management d’équipe", "Habilitation B2V"], inscritLe: "2 juillet 2026", derniereConnexion: "24 août 2026", candidatures: [{ title: "Électricien chantier", sub: "Thiès Électrique", badge: "Nouveau" }], formations: [] },
];

function ChercheursAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail du profil</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez le profil de ce chercheur d’emploi.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Profil du chercheur</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <SafeImg src={row.photo} alt={row.nom} className="w-14 h-14 rounded-full object-cover mb-2" />
            <p className="font-semibold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.metier} · {row.ville}</p>
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="E-mail" value={row.email} /><div className="h-2" />
          <Row label="Date de naissance" value={row.naissance} /><div className="h-2" />
          <Row label="Genre" value={row.genre} /><div className="h-2" />
          <Row label="Expérience" value={row.experience} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{c}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut du compte" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Inscrit le", value: row.inscritLe }, { label: "Dernière connexion", value: row.derniereConnexion }]} />
          <AdminSubListCard title={`Candidatures (${row.candidatures.length})`} items={row.candidatures} />
          <AdminSubListCard title="Formations suivies" items={row.formations} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer le compte" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendu" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendu" ? "Actif" : "Suspendu" })} />
        <ActionButton label="Vérifier le profil" variant="primary" onClick={() => update({ statut: "Vérifié" })} />
      </div>
    </div>
  );
}

function ChercheursAdminScreen() {
  return (
    <AdminEntityModule
      title="Chercheurs d’emploi"
      subtitle="Gérez et suivez les profils des chercheurs d’emploi inscrits sur LIGGEEY."
      initialData={CHERCHEURS_ADMIN_INITIAL}
      searchKeys={["nom", "metier", "ville"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Vérifié", "Suspendu", "Nouveau"], matcher: (r, v) => r.statut === v },
        { key: "profil", label: "Toutes les formules", options: ["Essentiel", "Premium"], matcher: (r, v) => adminTier(r.nom, "chercheur") === v },
      ]}
      columns={[
        { key: "nom", label: "Utilisateur", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} photo={r.photo} />, exportSub: { label: "Métier", key: "metier" } },
        { key: "profil", label: "Formule", flex: 1, render: (r) => <TierBadge premium={adminTier(r.nom, "chercheur") === "Premium"} size="sm" />, exportValue: (r) => adminTier(r.nom, "chercheur") },
        { key: "ville", label: "Localisation", flex: 1 },
        { key: "date", label: "Date d’inscription", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      exportExtra={[{ label: "Téléphone", key: "telephone" }, { label: "E-mail", key: "email" }]}
      renderDetail={ChercheursAdminDetail}
    />
  );
}

/* ---------- Prestataires (Admin) ---------- */

const PRESTATAIRES_ADMIN_INITIAL = [
  { id: "pa1", nom: "Cheikh Fall", photo: "/images/plateforme/portraits/cheikh-fall.jpg", metier: "Électricité générale", ville: "Dakar", missions: 47, note: 4.8, statut: "Vérifié", telephone: "+221 76 543 21 09", email: "cheikh.fall@email.sn", ninea: "12345678", anneesActivite: "12 ans", competences: ["Installation électrique", "Dépannage", "Câblage industriel"], inscritLe: "18 février 2026", derniereConnexion: "24 août 2026", missionsRecentes: [{ title: "Installation de tableau de bord", sub: "Senegal Construction", badge: "Terminée" }, { title: "Dépannage réseau triphasé", sub: "Particulier (Plateau)", badge: "En cours" }, { title: "Rénovation électrique complète", sub: "Thiès Électrique", badge: "Terminée" }], avis: [{ title: "Alassane Diop", sub: "Travail très soigné, ponctuel et respectueux des normes.", value: "★ 5,0" }, { title: "Mariama Ndiaye", sub: "Installation rapide et efficace de nos nouveaux luminaires.", value: "★ 4,5" }] },
  { id: "pa2", nom: "Awa Diallo", photo: "/images/plateforme/portraits/awa-diallo.jpg", metier: "Plomberie", ville: "Thiès", missions: 32, note: 4.6, statut: "Actif", telephone: "+221 77 123 98 76", email: "awa.diallo@email.sn", ninea: "23456789", anneesActivite: "6 ans", competences: ["Plomberie sanitaire"], inscritLe: "10 mars 2026", derniereConnexion: "20 août 2026", missionsRecentes: [{ title: "Installation sanitaire", sub: "Particulier", badge: "Terminée" }], avis: [{ title: "Cheikh Ba", sub: "Très efficace.", value: "★ 5,0" }] },
  { id: "pa3", nom: "Mamadou Sy", photo: "/images/plateforme/portraits/mamadou-sy.jpg", metier: "Maçonnerie", ville: "Dakar", missions: 65, note: 4.9, statut: "Vérifié", telephone: "+221 78 234 56 78", email: "mamadou.sy@email.sn", ninea: "34567890", anneesActivite: "15 ans", competences: ["Maçonnerie générale", "Fondations"], inscritLe: "5 janvier 2026", derniereConnexion: "25 août 2026", missionsRecentes: [{ title: "Construction villa", sub: "Modou Fall", badge: "En cours" }], avis: [{ title: "Awa Ndiaye", sub: "Excellent maçon.", value: "★ 5,0" }] },
  { id: "pa4", nom: "Ndèye Fatou Mbaye", photo: "/images/plateforme/portraits/ndeye-fatou-mbaye.jpg", metier: "Couture/Textile", ville: "Kaolack", missions: 28, note: 4.7, statut: "Actif", telephone: "+221 76 345 67 89", email: "ndeye.mbaye@email.sn", ninea: "45678901", anneesActivite: "9 ans", competences: ["Couture sur mesure"], inscritLe: "12 février 2026", derniereConnexion: "18 août 2026", missionsRecentes: [], avis: [] },
  { id: "pa5", nom: "Alioune Ndiaye", photo: "/images/plateforme/portraits/alioune-ndiaye.jpg", metier: "Menuiserie", ville: "Saint-Louis", missions: 41, note: 4.5, statut: "En attente", telephone: "+221 77 456 78 90", email: "alioune.ndiaye@email.sn", ninea: "56789012", anneesActivite: "10 ans", competences: ["Menuiserie", "Ébénisterie"], inscritLe: "20 avril 2026", derniereConnexion: "15 août 2026", missionsRecentes: [], avis: [] },
  { id: "pa6", nom: "Sokhna Dieng", photo: "/images/plateforme/portraits/sokhna-dieng.jpg", metier: "Peinture", ville: "Dakar", missions: 19, note: 4.3, statut: "Nouveau", telephone: "+221 78 567 89 01", email: "sokhna.dieng@email.sn", ninea: "67890123", anneesActivite: "3 ans", competences: ["Peinture intérieure"], inscritLe: "1er juillet 2026", derniereConnexion: "22 août 2026", missionsRecentes: [], avis: [] },
  { id: "pa7", nom: "Babacar Faye", photo: "/images/plateforme/portraits/babacar-faye.jpg", metier: "Carrelage", ville: "Rufisque", missions: 53, note: 4.8, statut: "Vérifié", telephone: "+221 76 678 90 12", email: "babacar.faye@email.sn", ninea: "78901234", anneesActivite: "11 ans", competences: ["Pose de carrelage"], inscritLe: "15 janvier 2026", derniereConnexion: "23 août 2026", missionsRecentes: [], avis: [] },
  { id: "pa8", nom: "Khady Thiam", photo: "/images/plateforme/portraits/khady-thiam.jpg", metier: "Électricité", ville: "Mbour", missions: 22, note: 4.4, statut: "Suspendu", telephone: "+221 77 789 01 23", email: "khady.thiam@email.sn", ninea: "89012345", anneesActivite: "5 ans", competences: ["Électricité domestique"], inscritLe: "8 mars 2026", derniereConnexion: "1er juillet 2026", missionsRecentes: [], avis: [] },
];

function PrestatairesAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail du prestataire</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez le profil de ce prestataire de services.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Profil du prestataire</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <SafeImg src={row.photo} alt={row.nom} className="w-14 h-14 rounded-full object-cover mb-2" />
            <p className="font-semibold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.metier} · {row.ville}</p>
            <Stars note={Math.round(row.note)} size={13} />
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="E-mail" value={row.email} /><div className="h-2" />
          <Row label="NINEA" value={row.ninea} /><div className="h-2" />
          <Row label="Années d’activité" value={row.anneesActivite} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{c}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut du compte" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Inscrit le", value: row.inscritLe }, { label: "Dernière connexion", value: row.derniereConnexion }]} />
          <AdminSubListCard title="Missions récentes" items={row.missionsRecentes} />
          <AdminSubListCard title="Avis clients récents" items={row.avis} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendu" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendu" ? "Actif" : "Suspendu" })} />
        <ActionButton label="Vérifier le profil" variant="primary" onClick={() => update({ statut: "Vérifié" })} />
      </div>
    </div>
  );
}

function PrestatairesAdminScreen() {
  return (
    <AdminEntityModule
      title="Prestataires"
      subtitle="Gérez et suivez les prestataires de services inscrits sur LIGGEEY."
      initialData={PRESTATAIRES_ADMIN_INITIAL}
      searchKeys={["nom", "metier", "ville"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Vérifié", "Suspendu", "Nouveau"], matcher: (r, v) => r.statut === v }, { key: "profil", label: "Toutes les formules", options: ["Essentiel", "Premium"], matcher: (r, v) => adminTier(r.nom, "prestataire") === v }]}
      columns={[
        { key: "nom", label: "Prestataire", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} photo={r.photo} />, exportSub: { label: "Métier", key: "metier" } },
        { key: "profil", label: "Formule", flex: 1, render: (r) => <TierBadge premium={adminTier(r.nom, "prestataire") === "Premium"} size="sm" />, exportValue: (r) => adminTier(r.nom, "prestataire") },
        { key: "ville", label: "Localisation", flex: 1 },
        { key: "missions", label: "Missions", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.missions} missions</span> },
        { key: "note", label: "Note", flex: 1, render: (r) => <span className="text-sm font-semibold" style={{ color: COLORS.orangeText }}>★ {noteFr(r.note)}</span> },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      exportExtra={[{ label: "Téléphone", key: "telephone" }, { label: "E-mail", key: "email" }]}
      renderDetail={PrestatairesAdminDetail}
    />
  );
}

/* ---------- Entreprises (Admin) ---------- */

const ENTREPRISES_ADMIN_INITIAL = [
  { id: "ea1", nom: "Senegal Construction SARL", secteur: "BTP", ville: "Dakar", offresActives: 12, employes: "45-50 emp.", statut: "Actif", ninea: "2938472 2G3", rccm: "SN-DKR-2008-B-1120", telephone: "+221 33 821 45 67", email: "contact@senegalconstruct.sn", siteWeb: "www.senegalconstruct.sn", secteurs: ["BTP", "Électricité", "Plomberie", "Maçonnerie"], inscritLe: "10 janvier 2026", derniereActivite: "26 août 2026", offresListe: [{ title: "Chef d’équipe électricité", value: "5 candidatures" }, { title: "Maçon qualifié", value: "12 candidatures" }, { title: "Plombier chantier", value: "3 candidatures" }], recrutements: [{ title: "Moussa Diop", sub: "Embauché le 20 août 2026" }, { title: "Fatou Sarr", sub: "Embauchée le 15 juillet 2026" }] },
  { id: "ea2", nom: "Thiès Électrique", secteur: "Électricité", ville: "Thiès", offresActives: 5, employes: "15-20 emp.", statut: "Vérifié", ninea: "1122334 4G5", rccm: "SN-THS-2015-B-0234", telephone: "+221 33 951 23 45", email: "contact@thieselectrique.sn", siteWeb: "www.thieselectrique.sn", secteurs: ["Électricité"], inscritLe: "22 mai 2025", derniereActivite: "20 août 2026", offresListe: [], recrutements: [] },
  { id: "ea3", nom: "Diallo & Fils Plomberie", secteur: "Plomberie", ville: "Saint-Louis", offresActives: 3, employes: "8-10 emp.", statut: "Actif", ninea: "5566778 8G9", rccm: "SN-STL-2012-B-0456", telephone: "+221 33 961 34 56", email: "contact@dialloplomberie.sn", siteWeb: "", secteurs: ["Plomberie"], inscritLe: "14 mars 2024", derniereActivite: "18 août 2026", offresListe: [], recrutements: [] },
  { id: "ea4", nom: "Ndiaye Menuiserie", secteur: "Menuiserie", ville: "Kaolack", offresActives: 7, employes: "20-25 emp.", statut: "En attente", ninea: "9900112 2G3", rccm: "SN-KLK-2018-B-0678", telephone: "+221 33 941 45 67", email: "contact@ndiayemenuiserie.sn", siteWeb: "", secteurs: ["Menuiserie"], inscritLe: "5 juin 2026", derniereActivite: "10 août 2026", offresListe: [], recrutements: [] },
  { id: "ea5", nom: "Dakar Services Pro", secteur: "Multi-services", ville: "Dakar", offresActives: 15, employes: "100+ emp.", statut: "Vérifié", ninea: "3344556 6G7", rccm: "SN-DKR-2010-B-0890", telephone: "+221 33 823 56 78", email: "contact@dakarservicespro.sn", siteWeb: "www.dakarservicespro.sn", secteurs: ["Multi-services"], inscritLe: "1er février 2024", derniereActivite: "26 août 2026", offresListe: [], recrutements: [] },
  { id: "ea6", nom: "Mbour Construction", secteur: "BTP", ville: "Mbour", offresActives: 4, employes: "30-35 emp.", statut: "Nouveau", ninea: "7788990 0G1", rccm: "SN-MBR-2023-B-0123", telephone: "+221 33 957 67 89", email: "contact@mbourconstruction.sn", siteWeb: "", secteurs: ["BTP"], inscritLe: "15 juillet 2026", derniereActivite: "24 août 2026", offresListe: [], recrutements: [] },
  { id: "ea7", nom: "Atelier Couture Nationale", secteur: "Textile", ville: "Dakar", offresActives: 6, employes: "12-15 emp.", statut: "Actif", ninea: "1234567 8G9", rccm: "SN-DKR-2016-B-0345", telephone: "+221 33 825 78 90", email: "contact@ateliercouture.sn", siteWeb: "", secteurs: ["Textile"], inscritLe: "10 septembre 2025", derniereActivite: "19 août 2026", offresListe: [], recrutements: [] },
  { id: "ea8", nom: "Rufisque Bâtiment", secteur: "BTP", ville: "Rufisque", offresActives: 8, employes: "25-30 emp.", statut: "Suspendu", ninea: "2233445 5G6", rccm: "SN-RFQ-2014-B-0567", telephone: "+221 33 836 89 01", email: "contact@rufisquebatiment.sn", siteWeb: "", secteurs: ["BTP"], inscritLe: "18 novembre 2024", derniereActivite: "2 juillet 2026", offresListe: [], recrutements: [] },
];

function EntreprisesAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail de l’entreprise</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez le profil de cette entreprise.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Profil de l’entreprise</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-14 h-14 rounded-md flex items-center justify-center text-sm font-semibold mb-2" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(row.nom)}</div>
            <p className="font-semibold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.secteur} · {row.ville}</p>
          </div>
          <Row label="NINEA" value={row.ninea} /><div className="h-2" />
          <Row label="RCCM" value={row.rccm} /><div className="h-2" />
          <Row label="Taille" value={row.employes} /><div className="h-2" />
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="E-mail" value={row.email} />
          {row.siteWeb && <><div className="h-2" /><Row label="Site web" value={row.siteWeb} /></>}
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Secteurs d’activité</p>
          <div className="flex flex-wrap gap-1.5">
            {row.secteurs.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.softStrong, color: COLORS.slate }}>{c}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut du compte entreprise" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Inscrit le", value: row.inscritLe }, { label: "Dernière activité", value: row.derniereActivite }]} />
          <AdminSubListCard title={`Offres d’emploi actives (${row.offresListe.length})`} items={row.offresListe} />
          <AdminSubListCard title={`Recrutements récents (${row.recrutements.length})`} items={row.recrutements} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendu" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendu" ? "Actif" : "Suspendu" })} />
        <ActionButton label="Vérifier l’entreprise" variant="primary" onClick={() => update({ statut: "Vérifié" })} />
      </div>
    </div>
  );
}

function EntreprisesAdminScreen() {
  return (
    <AdminEntityModule
      title="Entreprises"
      subtitle="Gérez et suivez les entreprises et recruteurs inscrits sur LIGGEEY."
      initialData={ENTREPRISES_ADMIN_INITIAL}
      searchKeys={["nom", "secteur", "ville"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Vérifié", "Suspendu", "Nouveau"], matcher: (r, v) => r.statut === v }, { key: "profil", label: "Toutes les formules", options: ["Sans formule", "Entreprise"], matcher: (r, v) => adminTier(r.nom, "entreprise") === v }]}
      columns={[
        { key: "nom", label: "Entreprise", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.secteur} />, exportSub: { label: "Secteur", key: "secteur" } },
        { key: "profil", label: "Formule", flex: 1, render: (r) => <TierBadge premium={adminTier(r.nom, "entreprise") === "Entreprise"} label={adminTier(r.nom, "entreprise")} size="sm" />, exportValue: (r) => adminTier(r.nom, "entreprise") },
        { key: "ville", label: "Localisation", flex: 1 },
        { key: "offresActives", label: "Offres actives", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.offresActives} offres</span> },
        { key: "employes", label: "Employés", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      exportExtra={[{ label: "Téléphone", key: "telephone" }, { label: "E-mail", key: "email" }]}
      renderDetail={EntreprisesAdminDetail}
    />
  );
}

/* ---------- Offres (Admin) ---------- */

const OFFRES_ADMIN_INITIAL = [
  { id: "oa1", titre: "Chef d’équipe électricité", entreprise: "Senegal Construction SARL", secteur: "BTP et construction", candidatures: 5, date: "15 juillet 2026", statut: "Active", localisation: "Dakar, Plateau", contrat: "CDI", experience: "5+ ans", salaire: "350 000 - 450 000 FCFA/mois", description: "Nous recherchons un Chef d’équipe électricité expérimenté pour superviser nos chantiers de construction résidentiels et tertiaires à Dakar. Vous serez responsable de la gestion d’une équipe d’électriciens, de la planification des travaux et du respect rigoureux des consignes de sécurité sur le terrain.", competences: ["Normes NF C 15-100", "Management d’équipe", "Lecture de plans", "Câblage industriel"], publieeLe: "15 juillet 2026", expireLe: "15 septembre 2026", candidatsRecents: [{ title: "Moussa Diop", sub: "Électricien bâtiment", badge: "En cours" }, { title: "Fatou Sarr", sub: "Plombière sanitaire", badge: "Retenu" }, { title: "Ibrahima Diallo", sub: "Soudeur industriel", badge: "Rejeté" }] },
  { id: "oa2", titre: "Plombier qualifié", entreprise: "Diallo & Fils", secteur: "Plomberie", candidatures: 8, date: "10 juillet 2026", statut: "Active", localisation: "Saint-Louis", contrat: "CDD", experience: "2-5 ans", salaire: "200 000 - 250 000 FCFA/mois", description: "Poste de plombier qualifié pour l’entretien et l’installation de systèmes sanitaires.", competences: ["Plomberie sanitaire"], publieeLe: "10 juillet 2026", expireLe: "10 septembre 2026", candidatsRecents: [] },
  { id: "oa3", titre: "Menuisier ébéniste", entreprise: "Ndiaye Menuiserie", secteur: "Menuiserie", candidatures: 12, date: "5 juillet 2026", statut: "Active", localisation: "Kaolack", contrat: "CDI", experience: "5+ ans", salaire: "280 000 - 320 000 FCFA/mois", description: "Fabrication de mobilier sur mesure.", competences: ["Menuiserie", "Ébénisterie"], publieeLe: "5 juillet 2026", expireLe: "5 septembre 2026", candidatsRecents: [] },
  { id: "oa4", titre: "Technicien maintenance", entreprise: "Dakar Services Pro", secteur: "Multi-services", candidatures: 3, date: "1er juillet 2026", statut: "En vérification", localisation: "Dakar", contrat: "CDI", experience: "3-5 ans", salaire: "250 000 FCFA/mois", description: "Maintenance générale de bâtiments tertiaires.", competences: ["Maintenance générale"], publieeLe: "1er juillet 2026", expireLe: "1er septembre 2026", candidatsRecents: [] },
  { id: "oa5", titre: "Maçon qualifié", entreprise: "Mbour Construction", secteur: "BTP", candidatures: 15, date: "25 juin 2026", statut: "Active", localisation: "Mbour", contrat: "CDD", experience: "3-8 ans", salaire: "250 000 - 300 000 FCFA/mois", description: "Travaux de maçonnerie générale sur chantiers résidentiels.", competences: ["Maçonnerie", "Fondations"], publieeLe: "25 juin 2026", expireLe: "25 août 2026", candidatsRecents: [] },
  { id: "oa6", titre: "Électricien chantier", entreprise: "Thiès Électrique", secteur: "Électricité", candidatures: 0, date: "20 juin 2026", statut: "Expirée", localisation: "Thiès", contrat: "CDD", experience: "1-3 ans", salaire: "180 000 FCFA/mois", description: "Installation électrique sur chantier.", competences: ["Électricité de base"], publieeLe: "20 juin 2026", expireLe: "20 août 2026", candidatsRecents: [] },
  { id: "oa7", titre: "Peintre bâtiment", entreprise: "Rufisque Bâtiment", secteur: "BTP", candidatures: 7, date: "15 juin 2026", statut: "Suspendue", localisation: "Rufisque", contrat: "CDD", experience: "1-3 ans", salaire: "180 000 - 220 000 FCFA/mois", description: "Travaux de peinture sur chantiers résidentiels.", competences: ["Peinture", "Enduits"], publieeLe: "15 juin 2026", expireLe: "15 août 2026", candidatsRecents: [] },
  { id: "oa8", titre: "Carreleur intérieur", entreprise: "Senegal Construction", secteur: "BTP", candidatures: 4, date: "10 juin 2026", statut: "Active", localisation: "Dakar", contrat: "CDD", experience: "2-4 ans", salaire: "230 000 FCFA/mois", description: "Pose de carrelage sur chantiers résidentiels.", competences: ["Pose de carrelage"], publieeLe: "10 juin 2026", expireLe: "10 août 2026", candidatsRecents: [] },
];

function OffresAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.slate }}>Détail de l’offre</h2>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez cette offre d’emploi.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(row.entreprise)}</div>
              <div>
                <p className="font-semibold" style={{ color: COLORS.slate }}>{row.titre}</p>
                <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.entreprise}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Row label="Secteur" value={row.secteur} />
              <Row label="Localisation" value={row.localisation} />
              <Row label="Type de contrat" value={row.contrat} />
              <Row label="Expérience requise" value={row.experience} />
              <Row label="Salaire" value={row.salaire} />
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Description du poste</p>
            <p className="text-sm mb-4" style={{ color: COLORS.slate }}>{row.description}</p>
            <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.slateLight }}>Compétences requises</p>
            <div className="flex flex-wrap gap-1.5">
              {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{c}</span>)}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut de l’offre" rows={[{ label: "Statut actuel", value: row.statut, badge: true }, { label: "Publiée le", value: row.publieeLe }, { label: "Expire le", value: row.expireLe }]} />
          <AdminSubListCard title={`Candidatures récentes (${row.candidatsRecents.length})`} items={row.candidatsRecents} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendue" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendue" ? "Active" : "Suspendue" })} />
        <ActionButton label="Valider l’offre" variant="primary" onClick={() => update({ statut: "Active" })} />
      </div>
    </div>
  );
}

/* Points contrôlés par l’admin avant de publier une offre d’entreprise. */
const CONTROLES_OFFRE = [
  { id: "entreprise", label: "L’entreprise est vérifiée (NINEA, RCCM, coordonnées)" },
  { id: "poste", label: "Le poste, les missions et le lieu sont clairs et réels" },
  { id: "salaire", label: "Le salaire et le type de contrat sont indiqués et cohérents" },
  { id: "frais", label: "Aucun frais n’est demandé aux candidats" },
  { id: "discrimination", label: "Aucun critère discriminatoire (âge, sexe, religion, ethnie…)" },
];
const MOTIFS_REFUS_OFFRE = [
  "Informations sur le poste incomplètes",
  "Salaire absent ou incohérent",
  "Frais demandés aux candidats",
  "Critère discriminatoire dans l’annonce",
  "Entreprise non vérifiée",
];

function OffreAVerifierCard({ offre, entreprise, onDecide }) {
  const [ouverte, setOuverte] = useState(false);
  const [coches, setCoches] = useState({});
  const [refus, setRefus] = useState(false);
  const [motif, setMotif] = useState("");
  const toutCoche = CONTROLES_OFFRE.every((c) => coches[c.id]);
  return (
    <div className="rounded-lg border border-base bg-surface p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-principal">{offre.titre}</p>
            <StatusBadge status={offre.statut} />
          </div>
          <p className="text-xs text-discret">{entreprise} · {offre.categorie} · envoyée le {offre.soumiseLe || "—"}</p>
          <p className="mt-1 text-sm text-secondaire">{offre.contrat} · {offre.localisation} · {offre.salaire}{offre.experience ? ` · ${offre.experience}` : ""}</p>
        </div>
        <App.Bouton petit variante="neutre" onClick={() => setOuverte((o) => !o)} aria-expanded={ouverte}>
          {ouverte ? "Masquer" : "Vérifier l’offre"}
        </App.Bouton>
      </div>

      {ouverte && (
        <div className="mt-4 grid grid-cols-1 gap-5 border-t border-dashed border-base pt-4 lg:grid-cols-[1.3fr,1fr]">
          <div>
            <p className="mb-1 text-xs font-semibold text-discret">Description du poste</p>
            <p className="mb-3 text-sm leading-[1.7] text-principal">{offre.description}</p>
            {offre.competences?.length > 0 && (<>
              <p className="mb-1.5 text-xs font-semibold text-discret">Compétences demandées</p>
              <Etiquettes items={offre.competences} />
            </>)}
            {offre.dateLimite && <p className="mt-3 text-sm text-secondaire">Date limite : {offre.dateLimite}</p>}
          </div>
          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-discret">Points à contrôler avant publication</legend>
            <div className="space-y-1">
              {CONTROLES_OFFRE.map((c) => (
                <label key={c.id} className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-principal hover:bg-doux">
                  <input type="checkbox" checked={!!coches[c.id]} onChange={(e) => setCoches((x) => ({ ...x, [c.id]: e.target.checked }))} className="h-4 w-4 shrink-0 accent-[rgb(var(--fond-marque))]" />
                  {c.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {ouverte && !refus && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => setRefus(true)} className="min-h-[44px] rounded border px-4 text-sm font-semibold" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Refuser</button>
          <button type="button" disabled={!toutCoche} onClick={() => onDecide("Active")} title={toutCoche ? undefined : "Cochez tous les points de contrôle"} className="min-h-[44px] rounded px-4 text-sm font-semibold text-sur-marque disabled:cursor-not-allowed disabled:opacity-50" style={{ background: COLORS.orange }}>
            Valider et publier
          </button>
        </div>
      )}
      {ouverte && refus && (
        <div className="mt-4 space-y-2">
          <label className={AUTH.libelle} htmlFor={`motif-${offre.id}`}>Motif du refus, visible par l’entreprise</label>
          <div className="flex flex-wrap gap-2">
            {MOTIFS_REFUS_OFFRE.map((m) => (
              <button key={m} type="button" onClick={() => setMotif(m)} aria-pressed={motif === m} className={FORM.pastille(motif === m)}>{m}</button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id={`motif-${offre.id}`} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Expliquez ce que l’entreprise doit corriger" className={`${FORM.champ()} flex-1`} />
            <App.Bouton variante="neutre" onClick={() => { setRefus(false); setMotif(""); }} className="min-h-[48px]">Annuler</App.Bouton>
            <BoutonDanger disabled={!motif.trim()} onClick={() => onDecide("Refusée", motif.trim())}>Confirmer le refus</BoutonDanger>
          </div>
        </div>
      )}
    </div>
  );
}

/* Offres créées par les entreprises : vérifiées par l’admin avant d’être visibles des candidats. */
function VerificationOffresAdmin({ offres, setOffres, entreprise }) {
  const aVerifier = offres.filter((o) => o.statut === "En vérification");
  const traitees = offres.filter((o) => o.decision);

  function decide(o, statut, motif) {
    const le = dateFr(demoNow());
    setOffres((l) => l.map((x) => (x.id === o.id ? { ...x, statut, motifRefus: motif || null, decision: { statut, le, motif: motif || null } } : x)));
    notify(statut === "Active" ? `Offre « ${o.titre} » validée : elle est maintenant visible des candidats.` : `Offre « ${o.titre} » refusée. L’entreprise est prévenue.`, statut === "Active" ? "success" : "info");
  }

  return (
    <section aria-labelledby="offres-a-verifier" className="mb-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="offres-a-verifier" className="text-lg font-semibold text-principal">Offres à vérifier ({aVerifier.length})</h2>
        <ExportAdmin
          titre="Offres à vérifier"
          lignes={aVerifier}
          colonnes={[
            { titre: "Offre", valeur: (o) => o.titre },
            { titre: "Entreprise", valeur: () => entreprise },
            { titre: "Catégorie", valeur: (o) => o.categorie },
            { titre: "Contrat", valeur: (o) => o.contrat },
            { titre: "Lieu", valeur: (o) => o.localisation },
            { titre: "Salaire", valeur: (o) => o.salaire },
            { titre: "Envoyée le", valeur: (o) => o.soumiseLe },
          ]}
        />
      </div>
      <div className="space-y-3">
        {aVerifier.length === 0 && (
          <div className="rounded-lg border border-base bg-surface p-6 text-sm text-secondaire">Aucune offre en attente. Les nouvelles offres des entreprises apparaîtront ici avant leur publication.</div>
        )}
        {aVerifier.map((o) => <OffreAVerifierCard key={o.id} offre={o} entreprise={entreprise} onDecide={(statut, motif) => decide(o, statut, motif)} />)}
      </div>
      {traitees.length > 0 && (<>
        <h3 className="mb-2 mt-6 text-sm font-semibold text-principal">Vérifiées récemment</h3>
        <div className="flex flex-col gap-2">
          {traitees.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-base bg-surface px-4 py-3">
              <span className="text-sm text-principal">{o.titre} · {entreprise}<span className="text-discret"> · le {o.decision.le}{o.decision.motif ? ` · ${o.decision.motif}` : ""}</span></span>
              <StatusBadge status={o.decision.statut === "Active" ? "Validé" : "Refusé"} />
            </div>
          ))}
        </div>
      </>)}
    </section>
  );
}

function OffresAdminScreen({ offresEntreprise, setOffresEntreprise }) {
  return (
    <>
    {/* Phrase d’introduction en tête de page, comme sur les autres écrans, avant le bloc « Offres à vérifier » */}
    <p className="mb-6 text-sm text-secondaire">Gérez toutes les offres d’emploi publiées sur la plateforme LIGGEEY.</p>
    {offresEntreprise && <VerificationOffresAdmin offres={offresEntreprise} setOffres={setOffresEntreprise} entreprise={ENTREPRISE_DEMO_NOM} />}
    <AdminEntityModule
      title="Offres d’emploi"
      initialData={OFFRES_ADMIN_INITIAL}
      searchKeys={["titre", "entreprise", "secteur"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Active", "En vérification", "Expirée", "Suspendue"], matcher: (r, v) => r.statut === v },
        { key: "secteur", label: "Tous les secteurs", options: Array.from(new Set(OFFRES_ADMIN_INITIAL.map((o) => o.secteur))), matcher: (r, v) => r.secteur === v },
      ]}
      columns={[
        { key: "titre", label: "Offre", flex: 2, render: (r) => <IdentityCell nom={r.titre} sub={r.entreprise} />, exportSub: { label: "Entreprise", key: "entreprise" } },
        { key: "secteur", label: "Secteur", flex: 1 },
        { key: "candidatures", label: "Candidatures", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.candidatures} candidatures</span> },
        { key: "date", label: "Date de publication", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      exportExtra={[{ label: "Lieu", key: "localisation" }, { label: "Contrat", key: "contrat" }, { label: "Salaire", key: "salaire" }]}
      renderDetail={OffresAdminDetail}
    />
    </>
  );
}

/* ---------- Formations (Admin) ---------- */

const FORMATIONS_ADMIN_INITIAL = [
  { id: "fa1", nom: "Sécurité électrique", organisme: "CNEAP Dakar", categorie: "Sécurité", inscrits: 45, duree: "40 h", statut: "Active", niveau: "Intermédiaire", tarif: "75 000 FCFA", description: "Cette formation qualifiante est spécifiquement conçue pour sensibiliser et former les électriciens professionnels aux dangers inhérents aux chantiers. Elle couvre l’ensemble des protocoles de sécurité requis en habilitation électrique B2V, ainsi que la gestion des situations d’urgence.", prerequis: ["Expérience électricité", "Habilitation B2V"], enCoursApprentissage: 38, certificatsDelivres: 7, dernieresInscriptions: [{ title: "Moussa Diop", sub: "Inscrit le 12 août 2026", badge: "Apprenant" }, { title: "Fatou Sarr", sub: "Inscrit le 14 août 2026", badge: "Apprenant" }, { title: "Ibrahima Diallo", sub: "Inscrit le 15 août 2026", badge: "Apprenant" }] },
  { id: "fa2", nom: "Lecture de plans BTP", organisme: "Institut BTP", categorie: "Technique", inscrits: 32, duree: "24 h", statut: "Active", niveau: "Débutant", tarif: "50 000 FCFA", description: "Apprendre à lire et interpréter des plans de construction BTP.", prerequis: [], enCoursApprentissage: 20, certificatsDelivres: 12, dernieresInscriptions: [] },
  { id: "fa3", nom: "Normes NF C 15-100", organisme: "CNEAP Dakar", categorie: "Réglementation", inscrits: 28, duree: "16 h", statut: "Active", niveau: "Intermédiaire", tarif: "45 000 FCFA", description: "Maîtriser les normes électriques françaises appliquées au Sénégal.", prerequis: ["Expérience électricité"], enCoursApprentissage: 18, certificatsDelivres: 10, dernieresInscriptions: [] },
  { id: "fa4", nom: "Plomberie sanitaire", organisme: "Centre de formation de Thiès", categorie: "Plomberie", inscrits: 18, duree: "32 h", statut: "Complète", niveau: "Débutant", tarif: "60 000 FCFA", description: "Formation complète en plomberie sanitaire résidentielle.", prerequis: [], enCoursApprentissage: 18, certificatsDelivres: 0, dernieresInscriptions: [] },
  { id: "fa5", nom: "Soudure TIG-MIG", organisme: "CNEAP Dakar", categorie: "Technique", inscrits: 22, duree: "48 h", statut: "Active", niveau: "Avancé", tarif: "90 000 FCFA", description: "Techniques avancées de soudure TIG et MIG.", prerequis: ["Expérience soudure"], enCoursApprentissage: 15, certificatsDelivres: 7, dernieresInscriptions: [] },
  { id: "fa6", nom: "Gestion de chantier", organisme: "Institut BTP", categorie: "Management", inscrits: 15, duree: "20 h", statut: "Brouillon", niveau: "Intermédiaire", tarif: "65 000 FCFA", description: "Piloter un chantier de construction de bout en bout.", prerequis: [], enCoursApprentissage: 0, certificatsDelivres: 0, dernieresInscriptions: [] },
  { id: "fa7", nom: "Menuiserie avancée", organisme: "Centre d’artisanat", categorie: "Menuiserie", inscrits: 12, duree: "36 h", statut: "Active", niveau: "Avancé", tarif: "70 000 FCFA", description: "Techniques avancées de menuiserie et ébénisterie.", prerequis: ["Bases menuiserie"], enCoursApprentissage: 10, certificatsDelivres: 2, dernieresInscriptions: [] },
  { id: "fa8", nom: "Peinture décorative", organisme: "Centre d’artisanat", categorie: "Peinture", inscrits: 8, duree: "16 h", statut: "Suspendue", niveau: "Débutant", tarif: "35 000 FCFA", description: "Techniques de peinture décorative et finitions.", prerequis: [], enCoursApprentissage: 0, certificatsDelivres: 0, dernieresInscriptions: [] },
];

function FormationsAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail de la formation</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6 mt-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: COLORS.orangeSoft }}><GraduationCap size={18} color={COLORS.orange} /></div>
            <div>
              <p className="font-semibold" style={{ color: COLORS.slate }}>{row.nom}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>Organisme : {row.organisme} · Niveau {row.niveau}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Row label="Catégorie" value={row.categorie} />
            <Row label="Durée" value={row.duree} />
            <Row label="Tarif d’inscription" value={row.tarif} />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Description de la formation</p>
          <p className="text-sm mb-4" style={{ color: COLORS.slate }}>{row.description}</p>
          {row.prerequis.length > 0 && (
            <>
              <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.slateLight }}>Prérequis recommandés</p>
              <div className="flex flex-wrap gap-1.5">
                {row.prerequis.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{c}</span>)}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut opérationnel" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Inscrits totaux", value: `${row.inscrits} apprenants` }, { label: "En cours d’apprentissage", value: `${row.enCoursApprentissage} apprenants` }, { label: "Certificats délivrés", value: `${row.certificatsDelivres} diplômés` }]} />
          <AdminSubListCard title={`Dernières inscriptions (${row.dernieresInscriptions.length})`} items={row.dernieresInscriptions} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendue" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendue" ? "Active" : "Suspendue" })} />
        <ActionButton label="Valider la formation" variant="primary" onClick={() => update({ statut: "Active" })} />
      </div>
    </div>
  );
}

function FormationsAdminScreen() {
  return (
    <AdminEntityModule
      title="Formations"
      subtitle="Gérez le catalogue de formations disponibles sur LIGGEEY."
      initialData={FORMATIONS_ADMIN_INITIAL}
      searchKeys={["nom", "organisme", "categorie"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Active", "Complète", "Brouillon", "Suspendue"], matcher: (r, v) => r.statut === v },
        { key: "categorie", label: "Toutes les catégories", options: Array.from(new Set(FORMATIONS_ADMIN_INITIAL.map((f) => f.categorie))), matcher: (r, v) => r.categorie === v },
      ]}
      columns={[
        { key: "nom", label: "Formation", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.organisme} />, exportSub: { label: "Organisme", key: "organisme" } },
        { key: "categorie", label: "Catégorie", flex: 1 },
        { key: "inscrits", label: "Inscrits", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.inscrits} inscrits</span> },
        { key: "duree", label: "Durée", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={FormationsAdminDetail}
    />
  );
}

/* ---------- Mentorat (Admin) ---------- */

const MENTORAT_ADMIN_INITIAL = [
  { id: "ma1", nom: "Cheikh Fall", photo: "/images/plateforme/portraits/cheikh-fall.jpg", metier: "Électricien", mentoresActifs: 3, specialite: "Électricité générale", note: 4.9, statut: "Actif", telephone: "+221 77 654 32 10", email: "cheikh.fall@email.sn", experience: "12 ans d’expérience", ninea: "1234567 2G3", competences: ["Installation électrique", "Dépannage rapide", "Câblage industriel"], certifications: [{ title: "Habilitation électrique B2V", badge: "Validé" }, { title: "Sécurité sur chantier BTP", badge: "Validé" }], totalAccompagnes: 5, membresActuels: [{ title: "Moussa Diop", sub: "Depuis le 1er juin 2026", badge: "Mentoré" }, { title: "Abdoulaye Sow", sub: "Depuis le 15 juillet 2026", badge: "Mentoré" }, { title: "Aissatou Gueye", sub: "Depuis le 1er août 2026", badge: "Mentoré" }] },
  { id: "ma2", nom: "Mamadou Sy", photo: "/images/plateforme/portraits/mamadou-sy.jpg", metier: "Maçon", mentoresActifs: 5, specialite: "Maçonnerie", note: 4.8, statut: "Actif", telephone: "+221 78 765 43 21", email: "mamadou.sy@email.sn", experience: "15 ans d’expérience", ninea: "2345678 3G4", competences: ["Maçonnerie générale"], certifications: [], totalAccompagnes: 8, membresActuels: [] },
  { id: "ma3", nom: "Awa Diallo", photo: "/images/plateforme/portraits/awa-diallo.jpg", metier: "Plombière", mentoresActifs: 2, specialite: "Plomberie", note: 4.7, statut: "Actif", telephone: "+221 76 876 54 32", email: "awa.diallo@email.sn", experience: "9 ans d’expérience", ninea: "3456789 4G5", competences: ["Plomberie sanitaire"], certifications: [], totalAccompagnes: 4, membresActuels: [] },
  { id: "ma4", nom: "Babacar Faye", photo: "/images/plateforme/portraits/babacar-faye.jpg", metier: "Carreleur", mentoresActifs: 4, specialite: "Carrelage", note: 4.6, statut: "Actif", telephone: "+221 77 987 65 43", email: "babacar.faye@email.sn", experience: "11 ans d’expérience", ninea: "4567890 5G6", competences: ["Pose de carrelage"], certifications: [], totalAccompagnes: 6, membresActuels: [] },
  { id: "ma5", nom: "Ndèye Mbaye", photo: "/images/plateforme/portraits/ndeye-mbaye.jpg", metier: "Couturière", mentoresActifs: 1, specialite: "Couture", note: 4.5, statut: "En attente", telephone: "+221 78 098 76 54", email: "ndeye.mbaye@email.sn", experience: "9 ans d’expérience", ninea: "5678901 6G7", competences: ["Couture sur mesure"], certifications: [], totalAccompagnes: 1, membresActuels: [] },
  { id: "ma6", nom: "Alioune Ndiaye", photo: "/images/plateforme/portraits/alioune-ndiaye.jpg", metier: "Menuisier", mentoresActifs: 3, specialite: "Menuiserie", note: 4.4, statut: "Inactif", telephone: "+221 76 109 87 65", email: "alioune.ndiaye@email.sn", experience: "10 ans d’expérience", ninea: "6789012 7G8", competences: ["Menuiserie"], certifications: [], totalAccompagnes: 5, membresActuels: [] },
  { id: "ma7", nom: "Sokhna Dieng", photo: "/images/plateforme/portraits/sokhna-dieng.jpg", metier: "Peintre", mentoresActifs: 2, specialite: "Peinture", note: 4.3, statut: "Actif", telephone: "+221 77 210 98 76", email: "sokhna.dieng@email.sn", experience: "3 ans d’expérience", ninea: "7890123 8G9", competences: ["Peinture intérieure"], certifications: [], totalAccompagnes: 2, membresActuels: [] },
  { id: "ma8", nom: "Khady Thiam", photo: "/images/plateforme/portraits/khady-thiam.jpg", metier: "Électricienne", mentoresActifs: 0, specialite: "Électricité", note: 0, statut: "En attente", telephone: "+221 78 321 09 87", email: "khady.thiam@email.sn", experience: "5 ans d’expérience", ninea: "8901234 9G0", competences: ["Électricité domestique"], certifications: [], totalAccompagnes: 0, membresActuels: [] },
];

function MentoratAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail du mentor</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6 mt-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex flex-col items-center text-center mb-4">
            <SafeImg src={row.photo} alt={row.nom} className="w-14 h-14 rounded-full object-cover mb-2" />
            <p className="font-semibold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.specialite} · {row.metier}</p>
            {row.note > 0 && <Stars note={Math.round(row.note)} size={13} />}
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="E-mail" value={row.email} /><div className="h-2" />
          <Row label="Expérience professionnelle" value={row.experience} /><div className="h-2" />
          <Row label="NINEA" value={row.ninea} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Compétences</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{c}</span>)}
          </div>
          {row.certifications.length > 0 && (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Certifications vérifiées</p>
              {row.certifications.map((c) => (
                <div key={c.title} className="flex items-center justify-between py-1">
                  <p className="text-sm" style={{ color: COLORS.slate }}>{c.title}</p>
                  <StatusBadge status={c.badge} />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut mentor" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Mentorés actifs", value: `${row.mentoresActifs} apprenants` }, { label: "Total accompagnés", value: `${row.totalAccompagnes} professionnels` }]} />
          <AdminSubListCard title={`Membres accompagnés actuellement (${row.membresActuels.length})`} items={row.membresActuels} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Inactif" ? "Réactiver" : "Désactiver"} variant="warning" onClick={() => update({ statut: row.statut === "Inactif" ? "Actif" : "Inactif" })} />
        <ActionButton label="Vérifier le profil" variant="primary" onClick={() => update({ statut: "Actif" })} />
      </div>
    </div>
  );
}

function MentoratAdminScreen() {
  return (
    <AdminEntityModule
      title="Mentorat"
      subtitle="Gérez les mentors et relations de mentorat sur LIGGEEY."
      initialData={MENTORAT_ADMIN_INITIAL}
      searchKeys={["nom", "metier", "specialite"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Inactif"], matcher: (r, v) => r.statut === v }]}
      columns={[
        { key: "nom", label: "Mentor", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} photo={r.photo} />, exportSub: { label: "Métier", key: "metier" } },
        { key: "mentoresActifs", label: "Mentorés actifs", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.mentoresActifs} mentorés</span> },
        { key: "specialite", label: "Spécialité", flex: 1 },
        { key: "note", label: "Note globale", flex: 1, render: (r) => <span className="text-sm font-semibold" style={{ color: COLORS.orangeText }}>★ {noteFr(r.note)}/5</span> },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      exportExtra={[{ label: "Téléphone", key: "telephone" }, { label: "E-mail", key: "email" }]}
      renderDetail={MentoratAdminDetail}
    />
  );
}

/* ---------- Services (Admin) ---------- */

const SERVICES_ADMIN_INITIAL = [
  { id: "sa1", prestataire: "Moussa Diop", service: "Plomberie générale", categorie: "Plomberie", tarif: "15 000 FCFA/h", statut: "Actif", date: "12 avril 2026", metier: "Plombier qualifié", experience: "5 ans d’expérience", description: "Service complet d’installation, de réparation et de dépannage de plomberie générale. Intervention sur fuites d’eau, débouchage de canalisations, pose de sanitaires, chauffe-eau et raccordements divers. Travail soigné et respect des normes de sécurité.", tarifHoraire: "15 000 FCFA / heure", forfaitInstallation: "45 000 FCFA", zones: ["Dakar Ville", "Pikine", "Guédiawaye", "Rufisque"], devisRecus: 47, missionsTerminees: 38, note: 4.5, avis: [{ title: "Amadou Bamba", sub: "Intervention rapide pour une fuite d’eau urgente. Très professionnel !", value: "5/5" }, { title: "Khady Sy", sub: "Installation propre du nouveau lavabo. Service fiable et courtois.", value: "4/5" }] },
  { id: "sa2", prestataire: "Fatou Cissé", service: "Couture traditionnelle", categorie: "Couture", tarif: "25 000 FCFA/forfait", statut: "Actif", date: "8 avril 2026", metier: "Couturière", experience: "10 ans d’expérience", description: "Confection de vêtements traditionnels sur mesure.", tarifHoraire: "—", forfaitInstallation: "25 000 FCFA / pièce", zones: ["Dakar"], devisRecus: 30, missionsTerminees: 25, note: 4.7, avis: [] },
  { id: "sa3", prestataire: "Ibrahima Diallo", service: "Installation & dépannage électrique", categorie: "Électricité", tarif: "12 000 FCFA/h", statut: "En pause", date: "5 avril 2026", metier: "Électricien", experience: "6 ans d’expérience", description: "Installation et dépannage électrique résidentiel.", tarifHoraire: "12 000 FCFA / heure", forfaitInstallation: "—", zones: ["Saint-Louis"], devisRecus: 20, missionsTerminees: 15, note: 4.6, avis: [] },
  { id: "sa4", prestataire: "Amadou Sow", service: "Rénovation de maison", categorie: "Maçonnerie", tarif: "35 000 FCFA/jour", statut: "Actif", date: "30 mars 2026", metier: "Maçon", experience: "8 ans d’expérience", description: "Travaux de rénovation complète de maisons.", tarifHoraire: "—", forfaitInstallation: "35 000 FCFA / jour", zones: ["Dakar"], devisRecus: 25, missionsTerminees: 20, note: 4.8, avis: [] },
  { id: "sa5", prestataire: "Khady Ndiaye", service: "Tresses & soins capillaires", categorie: "Esthétique", tarif: "10 000 FCFA/forfait", statut: "Actif", date: "24 mars 2026", metier: "Coiffeuse", experience: "7 ans d’expérience", description: "Tresses, soins et coiffures pour femmes.", tarifHoraire: "—", forfaitInstallation: "10 000 FCFA / prestation", zones: ["Dakar"], devisRecus: 40, missionsTerminees: 35, note: 4.9, avis: [] },
  { id: "sa6", prestataire: "Ousmane Fall", service: "Fabrication de meubles", categorie: "Menuiserie", tarif: "150 000 FCFA/forfait", statut: "Suspendu", date: "15 mars 2026", metier: "Menuisier", experience: "12 ans d’expérience", description: "Fabrication de meubles sur mesure.", tarifHoraire: "—", forfaitInstallation: "150 000 FCFA / meuble", zones: ["Dakar"], devisRecus: 10, missionsTerminees: 8, note: 4.5, avis: [] },
  { id: "sa7", prestataire: "Babacar Gueye", service: "Peinture intérieure/extérieure", categorie: "Peinture", tarif: "8 000 FCFA/h", statut: "Actif", date: "10 mars 2026", metier: "Peintre", experience: "5 ans d’expérience", description: "Peinture intérieure et extérieure de bâtiments.", tarifHoraire: "8 000 FCFA / heure", forfaitInstallation: "—", zones: ["Dakar"], devisRecus: 18, missionsTerminees: 14, note: 4.4, avis: [] },
  { id: "sa8", prestataire: "Mariama Sarr", service: "Entretien & réparation climatisation", categorie: "Froid et climatisation", tarif: "20 000 FCFA/forfait", statut: "En pause", date: "2 mars 2026", metier: "Technicienne froid", experience: "6 ans d’expérience", description: "Entretien et réparation de climatiseurs.", tarifHoraire: "—", forfaitInstallation: "20 000 FCFA / intervention", zones: ["Dakar"], devisRecus: 22, missionsTerminees: 18, note: 4.6, avis: [] },
];

function ServicesAdminDetail(row, { onBack, update }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail du service</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6 mt-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(row.prestataire)}</div>
            <div>
              <p className="font-semibold" style={{ color: COLORS.slate }}>{row.prestataire}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.metier} · {row.experience}</p>
            </div>
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Description du service</p>
          <p className="text-sm mb-4" style={{ color: COLORS.slate }}>{row.description}</p>
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Tarification et modalité</p>
          <Row label="Tarif horaire standard" value={row.tarifHoraire} /><div className="h-2" />
          <Row label="Forfait" value={row.forfaitInstallation} />
          <p className="text-xs font-semibold mt-4 mb-1.5" style={{ color: COLORS.slateLight }}>Zone d’intervention</p>
          <div className="flex flex-wrap gap-1.5">
            {row.zones.map((z) => <span key={z} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.softStrong, color: COLORS.slate }}>{z}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut du service" rows={[{ label: "Statut administratif", value: row.statut, badge: true }]} />
          <AdminInfoCard title="Performance & Activité" rows={[{ label: "Demandes de devis reçues", value: `${row.devisRecus} demandes` }, { label: "Missions terminées avec succès", value: `${row.missionsTerminees} terminées` }, { label: "Note moyenne globale", value: `${row.note} / 5` }]} />
          <AdminSubListCard title={`Derniers avis clients (${row.avis.length})`} items={row.avis} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label={row.statut === "Suspendu" ? "Réactiver" : "Suspendre"} variant="danger" onClick={() => update({ statut: row.statut === "Suspendu" ? "Actif" : "Suspendu" })} />
        <ActionButton label="Contacter" variant="neutral" onClick={() => {}} />
        <ActionButton label="Modifier" variant="primary" onClick={() => {}} />
      </div>
    </div>
  );
}

function ServicesAdminScreen() {
  return (
    <AdminEntityModule
      title="Services"
      subtitle="Gérez tous les services proposés par les prestataires sur la plateforme LIGGEEY."
      initialData={SERVICES_ADMIN_INITIAL}
      searchKeys={["prestataire", "service", "categorie"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Actif", "En pause", "Suspendu"], matcher: (r, v) => r.statut === v },
        { key: "categorie", label: "Toutes les catégories", options: Array.from(new Set(SERVICES_ADMIN_INITIAL.map((s) => s.categorie))), matcher: (r, v) => r.categorie === v },
      ]}
      columns={[
        { key: "prestataire", label: "Prestataire", flex: 2, render: (r) => <IdentityCell nom={r.prestataire} sub={r.metier} />, exportSub: { label: "Métier", key: "metier" } },
        { key: "service", label: "Service proposé", flex: 1.4 },
        { key: "categorie", label: "Catégorie", flex: 1 },
        { key: "tarif", label: "Tarif", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
        { key: "date", label: "Date création", flex: 1 },
      ]}
      renderDetail={ServicesAdminDetail}
    />
  );
}

/* ---------- Candidatures (Admin) — custom detail ---------- */

const CANDIDATURES_ADMIN_INITIAL = [
  { id: "cda1", nom: "Moussa Diop", metier: "Électricien", offre: "Chef d’équipe électricité", entreprise: "Senegal Construction", date: "15 août 2026", statut: "Nouveau", localisation: "Dakar", experience: "8 ans d’expérience", telephone: "+221 77 123 45 67", email: "moussa.diop@email.sn", lettre: "Je me permets de postuler à votre offre de chef d’équipe en électricité. Fort de mes 8 années d’expérience en électricité de bâtiment, j’ai supervisé plusieurs chantiers d’envergure à Dakar, assurant à la fois le respect des délais et des strictes normes réglementaires. Dynamique et rigoureux, je souhaite mettre mes compétences de meneur d’hommes au service de Senegal Construction.", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d’équipe", "Habilitation B2V"], documents: [{ nom: "CV_Moussa_Diop.pdf" }, { nom: "Certificat_NF_C15.pdf" }] },
  { id: "cda2", nom: "Fatou Sarr", metier: "Plombière", offre: "Plombier qualifié", entreprise: "Diallo & Fils", date: "14 août 2026", statut: "En cours", localisation: "Thiès", experience: "5 ans d’expérience", telephone: "+221 76 234 56 78", email: "fatou.sarr@email.sn", lettre: "Je souhaite postuler au poste de plombier qualifié. J’ai 5 ans d’expérience en installation et dépannage sanitaire.", competences: ["Plomberie sanitaire"], documents: [{ nom: "CV_Fatou_Sarr.pdf" }] },
  { id: "cda3", nom: "Ibrahima Diallo", metier: "Soudeur", offre: "Technicien maintenance", entreprise: "Dakar Services Pro", date: "12 août 2026", statut: "Retenu", localisation: "Saint-Louis", experience: "6 ans d’expérience", telephone: "+221 78 345 67 89", email: "ibrahima.diallo@email.sn", lettre: "Soudeur industriel qualifié, je souhaite intégrer votre équipe de maintenance.", competences: ["Soudure TIG", "Soudure MIG"], documents: [{ nom: "CV_Ibrahima_Diallo.pdf" }] },
  { id: "cda4", nom: "Aminata Ndiaye", metier: "Couturière", offre: "Couturière atelier", entreprise: "Atelier Couture", date: "10 août 2026", statut: "Rejeté", localisation: "Dakar", experience: "10 ans d’expérience", telephone: "+221 77 456 78 90", email: "aminata.ndiaye@email.sn", lettre: "Couturière expérimentée, je gère un atelier depuis 10 ans.", competences: ["Couture sur mesure"], documents: [{ nom: "CV_Aminata_Ndiaye.pdf" }] },
  { id: "cda5", nom: "Ousmane Ba", metier: "Menuisier", offre: "Menuisier ébéniste", entreprise: "Ndiaye Menuiserie", date: "9 août 2026", statut: "En cours", localisation: "Kaolack", experience: "12 ans d’expérience", telephone: "+221 76 567 89 01", email: "ousmane.ba@email.sn", lettre: "Menuisier ébéniste depuis 12 ans, spécialisé dans le mobilier sur mesure.", competences: ["Menuiserie", "Ébénisterie"], documents: [{ nom: "CV_Ousmane_Ba.pdf" }] },
  { id: "cda6", nom: "Mariama Tall", metier: "Carreleur", offre: "Carreleur intérieur", entreprise: "Senegal Construction", date: "8 août 2026", statut: "Nouveau", localisation: "Rufisque", experience: "4 ans d’expérience", telephone: "+221 78 678 90 12", email: "mariama.tall@email.sn", lettre: "Carreleuse spécialisée dans les finitions haut de gamme.", competences: ["Pose de carrelage"], documents: [{ nom: "CV_Mariama_Tall.pdf" }] },
  { id: "cda7", nom: "Abdoulaye Sow", metier: "Peintre", offre: "Peintre bâtiment", entreprise: "Rufisque Bâtiment", date: "7 août 2026", statut: "En cours", localisation: "Ziguinchor", experience: "3 ans d’expérience", telephone: "+221 77 789 01 23", email: "abdoulaye.sow@email.sn", lettre: "Peintre en bâtiment depuis 3 ans, disponible rapidement.", competences: ["Peinture", "Enduits"], documents: [{ nom: "CV_Abdoulaye_Sow.pdf" }] },
  { id: "cda8", nom: "Aissatou Gueye", metier: "Électricienne", offre: "Électricien chantier", entreprise: "Thiès Électrique", date: "5 août 2026", statut: "Nouveau", localisation: "Mbour", experience: "7 ans d’expérience", telephone: "+221 76 890 12 34", email: "aissatou.gueye@email.sn", lettre: "Électricienne qualifiée avec 7 ans d’expérience en encadrement de chantier.", competences: ["Normes NF C 15-100", "Management d’équipe"], documents: [{ nom: "CV_Aissatou_Gueye.pdf" }] },
];

function CandidaturesAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-6" style={{ color: COLORS.slate }}>Détail de la candidature</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(row.nom)}</div>
            <div>
              <p className="font-semibold" style={{ color: COLORS.slate }}>{row.nom}</p>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{row.metier} · {row.localisation}</p>
            </div>
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="E-mail" value={row.email} /><div className="h-2" />
          <Row label="Expérience" value={row.experience} />
          <p className="text-xs font-semibold mt-4 mb-1.5" style={{ color: COLORS.slateLight }}>Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{c}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Détails de l’application</h3>
              <StatusBadge status={row.statut} />
            </div>
            <Row label="Offre postulée" value={row.offre} /><div className="h-2" />
            <Row label="Entreprise" value={row.entreprise} /><div className="h-2" />
            <Row label="Date de postulation" value={row.date} />
            <p className="text-xs font-semibold mt-4 mb-1" style={{ color: COLORS.slateLight }}>Lettre de motivation</p>
            <p className="text-sm" style={{ color: COLORS.slate }}>{row.lettre}</p>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Documents joints</p>
            {row.documents.map((d) => (
              <div key={d.nom} className="flex items-center gap-2 py-1">
                <FileText size={15} color={COLORS.slateLight} />
                <p className="text-sm" style={{ color: COLORS.slate }}>{d.nom}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label="Signaler" variant="warning" onClick={() => {}} />
        <ActionButton label="Valider" variant="primary" onClick={() => update({ statut: "Retenu" })} />
      </div>
    </div>
  );
}

function CandidaturesAdminScreen() {
  return (
    <AdminEntityModule
      title="Candidatures"
      subtitle="Suivez toutes les candidatures déposées sur la plateforme LIGGEEY."
      initialData={CANDIDATURES_ADMIN_INITIAL}
      searchKeys={["nom", "offre", "entreprise"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Nouveau", "En cours", "Retenu", "Rejeté"], matcher: (r, v) => r.statut === v }]}
      columns={[
        { key: "nom", label: "Candidat", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} />, exportSub: { label: "Métier", key: "metier" } },
        { key: "offre", label: "Offre postulée", flex: 1.2 },
        { key: "entreprise", label: "Entreprise", flex: 1 },
        { key: "date", label: "Date", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      exportExtra={[{ label: "Téléphone", key: "telephone" }, { label: "E-mail", key: "email" }]}
      renderDetail={CandidaturesAdminDetail}
    />
  );
}

/* ---------- Missions (Admin) — custom detail ---------- */

const MISSIONS_ADMIN_INITIAL = [
  { id: "mia1", refId: "M-2026-041", description: "Réparation fuite d’eau urgente", prestataire: "Moussa Diop", client: "Alioune Sow", service: "Plomberie", statut: "En cours", montant: "45 000 FCFA", dateDebut: "15 avril 2026 à 9 h", dateFin: "15 avril 2026 à 13 h", duree: "4 heures", statutPaiement: "En attente", historique: [{ label: "Mission créée et devis validé", meta: "14 avril 2026 à 15 h 30 · Par Alioune Sow" }, { label: "Prestataire assigné", meta: "14 avril 2026 à 16 h · Moussa Diop" }, { label: "Début des travaux validé", meta: "15 avril 2026 à 9 h 15 · Par le prestataire" }] },
  { id: "mia2", refId: "M-2026-039", description: "Couture de rideaux sur mesure", prestataire: "Fatou Cissé", client: "Awa Ndiaye", service: "Couture", statut: "Terminée", montant: "65 000 FCFA", dateDebut: "10 avril 2026 à 10 h", dateFin: "12 avril 2026 à 17 h", duree: "2 jours", statutPaiement: "Payé", historique: [{ label: "Mission créée et devis validé", meta: "9 avril 2026 à 11 h · Par Awa Ndiaye" }, { label: "Mission terminée", meta: "12 avril 2026 à 17 h · Par le prestataire" }] },
  { id: "mia3", refId: "M-2026-038", description: "Installation tableau électrique", prestataire: "Ibrahima Diallo", client: "Dakar Bâtiment", service: "Électricité", statut: "Terminée", montant: "80 000 FCFA", dateDebut: "5 avril 2026 à 8 h", dateFin: "5 avril 2026 à 16 h", duree: "8 heures", statutPaiement: "Payé", historique: [] },
  { id: "mia4", refId: "M-2026-035", description: "Construction mur de clôture", prestataire: "Amadou Sow", client: "Modou Fall", service: "Maçonnerie", statut: "En attente", montant: "120 000 FCFA", dateDebut: "20 avril 2026 à 8 h", dateFin: "25 avril 2026 à 18 h", duree: "5 jours", statutPaiement: "En attente", historique: [] },
  { id: "mia5", refId: "M-2026-032", description: "Peinture façade extérieure", prestataire: "Babacar Gueye", client: "Seynabou Diop", service: "Peinture", statut: "Annulée", montant: "35 000 FCFA", dateDebut: "—", dateFin: "—", duree: "—", statutPaiement: "Annulé", historique: [] },
  { id: "mia6", refId: "M-2026-030", description: "Entretien climatiseur split", prestataire: "Mariama Sarr", client: "Pathé Gueye", service: "Climatisation", statut: "Terminée", montant: "20 000 FCFA", dateDebut: "1er avril 2026 à 9 h", dateFin: "1er avril 2026 à 11 h", duree: "2 heures", statutPaiement: "Payé", historique: [] },
  { id: "mia7", refId: "M-2026-027", description: "Soudure structure métallique", prestataire: "Cheikh Ndiaye", client: "Gorgui Diouf", service: "Soudure", statut: "Terminée", montant: "45 000 FCFA", dateDebut: "20 mars 2026 à 8 h", dateFin: "21 mars 2026 à 17 h", duree: "2 jours", statutPaiement: "Payé", historique: [] },
  { id: "mia8", refId: "M-2026-025", description: "Tresses et soins capillaires", prestataire: "Khady Ndiaye", client: "Aicha Cissé", service: "Esthétique", statut: "Terminée", montant: "10 000 FCFA", dateDebut: "15 mars 2026 à 10 h", dateFin: "15 mars 2026 à 12 h", duree: "2 heures", statutPaiement: "Payé", historique: [] },
];

function MissionsAdminDetail(row, { onBack, update }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orangeText }}><ArrowLeft size={14} /> Retour</button>
      <h2 className="text-xl font-semibold mb-1" style={{ color: COLORS.slate }}>Détail de la mission</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Mission #{row.refId}</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Informations de la mission</h3>
          <Row label="Service requis" value={row.description} /><div className="h-2" />
          <Row label="Prestataire assigné" value={row.prestataire} /><div className="h-2" />
          <Row label="Client demandeur" value={row.client} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Planning et dates clés</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Row label="Date de début" value={row.dateDebut} />
            <Row label="Date de fin" value={row.dateFin} />
            <Row label="Durée totale" value={row.duree} />
          </div>
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Montant et paiement</p>
          <Row label="Montant total convenu" value={row.montant} /><div className="h-2" />
          <div className="flex items-center justify-between py-1">
            <p className="text-sm" style={{ color: COLORS.slateLight }}>Statut du paiement</p>
            <StatusBadge status={row.statutPaiement} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut actuel de la mission" rows={[{ label: "Statut opérationnel", value: row.statut, badge: true }]} />
          {row.historique.length > 0 && (
            <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Historique des étapes</h3>
              {row.historique.map((h, i) => (
                <div key={i} className="flex gap-3 py-2">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: COLORS.orange }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{h.label}</p>
                    <p className="text-xs" style={{ color: COLORS.slateLight }}>{h.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Annuler la mission" variant="danger" onClick={() => update({ statut: "Annulée" })} />
        <ActionButton label="Contacter" variant="neutral" onClick={() => {}} />
        <ActionButton label="Marquer comme terminée" variant="primary" onClick={() => update({ statut: "Terminée", statutPaiement: "Payé" })} />
      </div>
    </div>
  );
}

function MissionsAdminScreen() {
  return (
    <AdminEntityModule
      title="Missions"
      subtitle="Suivez toutes les missions de service en cours et terminées sur la plateforme LIGGEEY."
      initialData={MISSIONS_ADMIN_INITIAL}
      searchKeys={["refId", "prestataire", "client", "service"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["En cours", "Terminée", "En attente", "Annulée"], matcher: (r, v) => r.statut === v }]}
      columns={[
        { key: "refId", label: "Numéro de mission", flex: 1 },
        { key: "prestataire", label: "Prestataire", flex: 1.4, render: (r) => <IdentityCell nom={r.prestataire} /> },
        { key: "client", label: "Client", flex: 1 },
        { key: "service", label: "Service", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
        { key: "montant", label: "Montant", flex: 1 },
      ]}
      exportExtra={[{ label: "Description", key: "description" }, { label: "Début", key: "dateDebut" }, { label: "Paiement", key: "statutPaiement" }]}
      renderDetail={MissionsAdminDetail}
    />
  );
}

/* ---------- Vérification CV & Diplômes (Admin) ---------- */

const DOCUMENTS_ADMIN_INITIAL = [
  { id: "da1", nom: "Moustapha Diop", metier: "Électricien BTP", document: "Diplôme d’État (CAP)", fichier: "CAP_Electricite_Diop.pdf", date: "14 août 2026", statut: "En attente", taille: "2.4 MB", pages: 2, correspondance: 85 },
  { id: "da2", nom: "Fatoumata Diallo", metier: "Couturière styliste", document: "Certificat de couture", fichier: "Attestation_Diallo.pdf", date: "14 août 2026", statut: "En attente", taille: "1.1 MB", pages: 1, correspondance: 72 },
  { id: "da3", nom: "Amadou Sow", metier: "Maçon applicateur", document: "CV technique", fichier: "CV_Sow_Macon.pdf", date: "13 août 2026", statut: "En cours", taille: "0.8 MB", pages: 2, correspondance: 60 },
  { id: "da4", nom: "Aissatou Ndiaye", metier: "Coiffeuse esthéticienne", document: "Certificat Pro", fichier: "Certif_Salon.pdf", date: "12 août 2026", statut: "Validé", taille: "1.5 MB", pages: 1, correspondance: 90 },
  { id: "da5", nom: "Ibrahima Fall", metier: "Mécanicien auto", document: "CAP mécanique", fichier: "CAP_Meca_Fall.pdf", date: "11 août 2026", statut: "Validé", taille: "2.0 MB", pages: 2, correspondance: 88 },
  { id: "da6", nom: "Mariama Sarr", metier: "Transformateur agroalimentaire", document: "Attestation", fichier: "Attestation_Sarr.pdf", date: "10 août 2026", statut: "Rejeté", taille: "0.9 MB", pages: 1, correspondance: 40 },
  { id: "da7", nom: "Ousmane Cissé", metier: "Plombier sanitaire", document: "CV technique", fichier: "CV_Cisse_Plomberie.pdf", date: "9 août 2026", statut: "Validé", taille: "1.2 MB", pages: 2, correspondance: 82 },
  { id: "da8", nom: "Aminata Gueye", metier: "Teinturière artisanale", document: "Attestation", fichier: "Certif_Teinture.pdf", date: "8 août 2026", statut: "En attente", taille: "1.0 MB", pages: 1, correspondance: 65 },
];

function DocumentControlScreen({ doc, onBack, onDecide }) {
  const [zoom, setZoom] = useState(100);
  return (
    <div>
      <p className="text-sm mb-1" style={{ color: COLORS.slateLight }}>
        <button type="button" onClick={onBack} className="hover:underline">Vérifications CV</button> / {doc.nom}
      </p>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.slate }}>Contrôle du document</h2>
        <StatusBadge status={doc.statut} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr,1fr] gap-4">
        <div>
          <div className="rounded-lg border bg-surface px-4 py-3 mb-3 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{doc.fichier}</p>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{doc.taille} · {doc.pages} pages</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setZoom((z) => Math.max(60, z - 10))} className="w-7 h-7 rounded border flex items-center justify-center" style={{ borderColor: COLORS.border }}><ZoomOut size={13} /></button>
              <span className="text-xs font-semibold w-10 text-center" style={{ color: COLORS.slate }}>{zoom}%</span>
              <button type="button" onClick={() => setZoom((z) => Math.min(150, z + 10))} className="w-7 h-7 rounded border flex items-center justify-center" style={{ borderColor: COLORS.border }}><ZoomIn size={13} /></button>
            </div>
          </div>
          <div className="rounded-lg border bg-surface p-10 flex items-center justify-center" style={{ borderColor: COLORS.border, minHeight: 480 }}>
            {/* Fac-similé d’un document papier : il reste clair, quel que soit le thème. */}
            <div
              data-theme="clair"
              className="bg-surface text-center px-10 py-10"
              style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.15s", border: "1px solid #E5E0D5", maxWidth: 460 }}
            >
              <p className="text-xs tracking-widest mb-6" style={{ color: "#9A8F7A" }}>RÉPUBLIQUE DU SÉNÉGAL</p>
              <div className="w-14 h-14 rounded-full border-2 mx-auto mb-6" style={{ borderColor: "#C9A227" }} />
              <h2 className="text-2xl font-semibold mb-1" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>Certificat d’Aptitude<br />Professionnelle</h2>
              <p className="text-sm italic my-4" style={{ color: "#6B6259" }}>Électricité - Équipement industriel</p>
              <div className="w-full h-px my-4" style={{ background: "#E5E0D5" }} />
              <p className="text-xs" style={{ color: "#9A8F7A" }}>Décerné à</p>
              <p className="text-lg font-semibold mb-4" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>{doc.nom}</p>
              <p className="text-xs leading-relaxed mb-6" style={{ color: "#6B6259" }}>Pour avoir satisfait aux épreuves réglementaires de la session 2025.</p>
              <p className="text-xs" style={{ color: "#9A8F7A" }}>Le Directeur<br />Dakar, le 18 juillet 2025</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(doc.nom)}</div>
              <div><p className="font-semibold" style={{ color: COLORS.slate }}>{doc.nom}</p><p className="text-xs" style={{ color: COLORS.slateLight }}>{doc.metier} · Dakar</p></div>
            </div>
            <Row label="Type de document" value={doc.document} /><div className="h-2" />
            <Row label="Soumis le" value={doc.date} /><div className="h-2" />
            <Row label="N° de dossier" value={`LIG-2026-${doc.id.slice(2).padStart(4, "0")}`} />
          </div>

          <div className="rounded-lg p-4" style={{ background: COLORS.successSoft }}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold" style={{ color: COLORS.success }}>Correspondance profil</p>
              <span className="text-sm font-semibold" style={{ color: COLORS.success }}>{doc.correspondance}%</span>
            </div>
            <p className="text-xs" style={{ color: COLORS.success }}>Le diplôme et la spécialité correspondent aux compétences déclarées sur le profil.</p>
          </div>

          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Points de contrôle</h3>
            {["Nom identique au profil", "Document lisible et complet", "Institution identifiable", "Date et signature présentes"].map((p) => (
              <div key={p} className="flex items-center gap-2 py-1">
                <Check size={13} color={COLORS.success} />
                <p className="text-sm" style={{ color: COLORS.slate }}>{p}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.slate }}>Décision de contrôle</h3>
            <p className="text-xs mb-4" style={{ color: COLORS.slateLight }}>Confirmez uniquement après avoir vérifié toutes les informations visibles.</p>
            <button type="button" onClick={() => onDecide(doc.id, "Validé")} className="w-full rounded py-2.5 text-sm font-semibold text-sur-marque mb-2" style={{ background: COLORS.orange }}>Valider</button>
            <button type="button" onClick={() => onDecide(doc.id, "Rejeté")} className="w-full rounded py-2.5 text-sm font-semibold text-sur-statut" style={{ background: COLORS.danger }}>Rejeter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationCVScreen() {
  const [docs, setDocs] = useState(DOCUMENTS_ADMIN_INITIAL);
  const [tab, setTab] = useState("Tous");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const counts = {
    Tous: docs.length,
    "En attente": docs.filter((d) => d.statut === "En attente").length,
    Validés: docs.filter((d) => d.statut === "Validé").length,
    Rejetés: docs.filter((d) => d.statut === "Rejeté").length,
  };
  const filtered = docs.filter((d) => {
    const matchesTab = tab === "Tous" || (tab === "En attente" && d.statut === "En attente") || (tab === "Validés" && d.statut === "Validé") || (tab === "Rejetés" && d.statut === "Rejeté");
    const matchesQuery = (d.nom + d.metier).toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });
  const paged = filtered.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE);
  const selected = docs.find((d) => d.id === selectedId);

  function decide(id, statut) {
    setDocs((list) => list.map((d) => (d.id === id ? { ...d, statut } : d)));
    setSelectedId(null);
  }

  if (selected) {
    return <DocumentControlScreen doc={selected} onBack={() => setSelectedId(null)} onDecide={decide} />;
  }

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez les documents soumis. Les décisions sont prises sur la page de contrôle dédiée.</p>

      {/* Même barre que les autres listes : recherche dans une carte, puis filtres et nombre de résultats */}
      <BarreFiltres label="Rechercher un document">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          placeholder="Rechercher un candidat…"
          label="Rechercher un candidat"
          className="w-full"
        />
      </BarreFiltres>

      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Filtrer les documents"
          options={["Tous", "En attente", "Validés", "Rejetés"].map((t) => ({ id: t, label: `${t} (${counts[t]})` }))}
          actif={tab}
          onChange={(t) => { setTab(t); setPage(1); }}
        />
        <CompteResultats n={filtered.length} nom="document" />
      </div>

      {/* Comme les autres tableaux de l’admin : défilement horizontal sur téléphone, colonnes jamais écrasées */}
      <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
        <div className="min-w-[760px]">
        <div className="flex items-center px-5 py-3" style={{ background: COLORS.soft, borderBottom: `1px solid ${COLORS.border}` }}>
          <p className="text-xs font-semibold" style={{ flex: 2, color: COLORS.slateLight }}>Utilisateur</p>
          <p className="text-xs font-semibold" style={{ flex: 1.2, color: COLORS.slateLight }}>Document</p>
          <p className="text-xs font-semibold" style={{ flex: 1.4, color: COLORS.slateLight }}>Fichier PDF</p>
          <p className="text-xs font-semibold" style={{ flex: 1, color: COLORS.slateLight }}>Soumission</p>
          <p className="text-xs font-semibold" style={{ flex: 1, color: COLORS.slateLight }}>Statut</p>
          <p className="text-xs font-semibold w-20 text-right" style={{ color: COLORS.slateLight }}>Action</p>
        </div>
        {paged.map((d) => (
          <div key={d.id} className="flex items-center px-5 py-3.5" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ flex: 2 }}><IdentityCell nom={d.nom} sub={d.metier} /></div>
            <p className="text-sm" style={{ flex: 1.2, color: COLORS.slate }}>{d.document}</p>
            <p className="text-sm truncate" style={{ flex: 1.4, color: COLORS.orangeText }}>{d.fichier}</p>
            <p className="text-sm" style={{ flex: 1, color: COLORS.slateLight }}>{d.date}</p>
            <div style={{ flex: 1 }}><StatusBadge status={d.statut} /></div>
            <button type="button" onClick={() => setSelectedId(d.id)} className="w-20 text-right text-sm font-semibold shrink-0" style={{ color: COLORS.orangeText }}>Consulter</button>
          </div>
        ))}
        {paged.length === 0 && <p className="text-sm p-5" style={{ color: COLORS.slateLight }}>Aucun document.</p>}
        </div>
      </div>

      <Pagination page={page} pageSize={ADMIN_PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Messagerie (Admin et profils) ----------
   Une seule messagerie : chaque profil échange avec l’équipe LIGGEEY, et l’admin répond depuis
   Communication › Messagerie. Les conversations sont partagées (mémoire « conversations »).
   - de : "moi" = l’équipe LIGGEEY (admin), "eux" = le profil ;
   - espace : rattache la conversation au profil connecté de cet espace (démo) ;
   - nonLu : messages non lus par l’admin ; nonLuProfil : non lus par le profil. */

const CONVERSATIONS_INITIAL = [
  {
    id: "c1", nom: "Moustapha Diop", role: "Prestataire · Électricien", nonLu: 2,
    messages: [
      { de: "eux", texte: "Bonjour, j’ai envoyé mon diplôme CAP électricité hier. Pouvez-vous me dire si le format convient ?", heure: "09:12" },
      { de: "moi", texte: "Bonjour Moustapha, nous l’avons bien reçu. Le scan est un peu flou en bas de page.", heure: "09:40" },
      { de: "eux", texte: "D’accord, je peux le renvoyer en meilleure qualité ce soir.", heure: "10:02" },
      { de: "eux", texte: "Faut-il aussi l’attestation de stage ?", heure: "10:03" },
    ],
  },
  {
    id: "c2", espace: "entreprise", nom: "Senegal Construction SARL", role: "Entreprise · BTP", nonLu: 1,
    messages: [
      { de: "eux", texte: "Notre offre « Chef de chantier » a été signalée. Pouvons-nous savoir pourquoi ?", heure: "Hier" },
    ],
  },
  {
    id: "c3", espace: "chercheur", nom: "Absatou Diallo", role: "Chercheuse d’emploi", nonLu: 0, nonLuProfil: 1,
    messages: [
      { de: "eux", texte: "Merci pour la mise en relation avec Cheikh Fall, la première séance s’est très bien passée.", heure: "Lun." },
      { de: "moi", texte: "Avec plaisir Absatou ! N’hésitez pas à revenir vers nous après la simulation d’entretien.", heure: "Lun." },
    ],
  },
  {
    id: "c6", espace: "prestataire", nom: "Mamadou Ndiaye", role: "Prestataire · Électricien", nonLu: 0, nonLuProfil: 1,
    messages: [
      { de: "moi", texte: "Bonjour Mamadou, bienvenue sur LIGGEEY ! Si un jour vous souhaitez régulariser votre activité, nous pouvons vous accompagner : tout est expliqué dans l’écran Régularisation. Ce n’est pas obligatoire.", heure: "Hier" },
    ],
  },
  {
    id: "c4", nom: "Fatou Sow", role: "Prestataire · Couturière", nonLu: 0,
    messages: [
      { de: "moi", texte: "Bonjour Fatou, il reste 3 places pour l’atelier couture de Pikine. Souhaitez-vous animer la seconde session ?", heure: "28 sept." },
      { de: "eux", texte: "Oui, avec plaisir. Je suis disponible le samedi.", heure: "28 sept." },
    ],
  },
  {
    id: "c5", nom: "Diallo & Fils", role: "Client · Particulier", nonLu: 0,
    messages: [
      { de: "eux", texte: "La mission de plomberie est terminée et réglée. Comment laisser un avis au prestataire ?", heure: "25 sept." },
      { de: "moi", texte: "Depuis l’onglet Missions, cliquez sur la mission terminée puis sur « Laisser un avis ».", heure: "25 sept." },
    ],
  },
];

function MessagerieTab() {
  const [convs, setConvs] = useStore("conversations", CONVERSATIONS_INITIAL);
  // Sur ordinateur, la première conversation est ouverte d’emblée ; sur mobile, on part de la liste.
  const [activeId, setActiveId] = useState(() => (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(min-width: 768px)").matches ? CONVERSATIONS_INITIAL[0]?.id ?? null : null));
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  const active = convs.find((c) => c.id === activeId);
  const messageCount = active ? active.messages.length : 0;
  const visible = convs.filter((c) => `${c.nom} ${c.role}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (endRef.current && endRef.current.scrollIntoView) endRef.current.scrollIntoView({ block: "end" });
  }, [activeId, messageCount]);

  function open(id) {
    setActiveId(id);
    setConvs((list) => list.map((c) => (c.id === id ? { ...c, nonLu: 0 } : c)));
  }

  function send(contenu) {
    const texte = (contenu ?? draft).trim();
    if (!texte || !active) return;
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setConvs((list) => list.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, { de: "moi", texte, heure }], nonLuProfil: (c.nonLuProfil || 0) + 1 } : c)));
    setDraft("");
  }

  function archive() {
    setConvs((list) => list.filter((c) => c.id !== active.id));
    notify(`Conversation avec ${active.nom} archivée.`);
    setActiveId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px,1fr]">
      <div className={`${active ? "hidden md:flex" : "flex"} min-w-0 flex-col gap-3`}>
        <App.ChampRecherche valeur={query} onChange={setQuery} placeholder="Rechercher une conversation" label="Rechercher une conversation" />
        <div className="flex max-h-[560px] flex-col gap-2 overflow-y-auto pr-1">
          {visible.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <App.ElementConversation
                key={c.id}
                nom={c.nom}
                apercu={last ? (last.de === "moi" ? "Vous : " : "") + last.texte : c.role}
                heure={last ? last.heure : ""}
                nonLus={c.nonLu}
                actif={c.id === activeId}
                onClick={() => open(c.id)}
              />
            );
          })}
          {visible.length === 0 && <p className="p-4 text-sm text-secondaire">Aucune conversation ne correspond à « {query} ».</p>}
        </div>
      </div>

      {active ? (
        <App.Carte flush className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-base px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <App.BoutonIcone icone={ArrowLeft} label="Retour aux conversations" variante="fantome" taille="sm" className="md:hidden" onClick={() => setActiveId(null)} />
              <App.Avatar nom={active.nom} taille="md" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-principal">{active.nom}</p>
                <p className="truncate text-sm text-discret">{active.role}</p>
              </div>
            </div>
            <App.BoutonIcone icone={Archive} label="Archiver la conversation" variante="fantome" onClick={archive} />
          </div>
          <div className="flex max-h-[460px] min-h-[360px] flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
            {active.messages.map((m, i) => {
              const suivant = active.messages[i + 1];
              return (
                <App.BulleMessage
                  key={i}
                  texte={m.texte}
                  heure={m.heure}
                  moi={m.de === "moi"}
                  nom={m.de === "moi" ? "Admin LIGGEEY" : active.nom}
                  montrerAvatar={!suivant || suivant.de !== m.de}
                />
              );
            })}
            <div ref={endRef} />
          </div>
          <App.ZoneSaisie onEnvoyer={(texte) => send(texte)} placeholder={`Écrire à ${active.nom}…`} />
        </App.Carte>
      ) : (
        <App.Carte className="hidden md:block">
          <App.EtatVide icone={MessageCircle} titre="Sélectionnez une conversation" texte="Répondez aux chercheurs, prestataires et entreprises depuis un seul endroit." />
        </App.Carte>
      )}
    </div>
  );
}

/* ---------- Messages (profils) : conversation avec l’équipe LIGGEEY ---------- */

const ROLE_CONVERSATION = { chercheur: "Chercheur d’emploi", prestataire: "Prestataire", entreprise: "Entreprise", jeune: "Cap Métier", mentor: "Mentor" };

function MessagesScreen({ espace, user }) {
  const [convs, setConvs] = useStore("conversations", CONVERSATIONS_INITIAL);
  const conv = convs.find((c) => c.espace === espace);
  const messages = conv?.messages || [];
  const endRef = useRef(null);
  const nonLus = conv?.nonLuProfil || 0;

  useEffect(() => {
    if (nonLus > 0) setConvs((l) => l.map((c) => (c.espace === espace ? { ...c, nonLuProfil: 0 } : c)));
  }, [nonLus]);
  useEffect(() => {
    if (endRef.current && endRef.current.scrollIntoView) endRef.current.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function envoyer(texte) {
    const t = texte.trim();
    if (!t) return;
    const msg = { de: "eux", texte: t, heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
    setConvs((l) =>
      l.some((c) => c.espace === espace)
        ? l.map((c) => (c.espace === espace ? { ...c, messages: [...c.messages, msg], nonLu: (c.nonLu || 0) + 1 } : c))
        : [{ id: `conv-${espace}`, espace, nom: espace === "entreprise" ? user.role : user.name, role: ROLE_CONVERSATION[espace], nonLu: 1, nonLuProfil: 0, messages: [msg] }, ...l]
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,300px]">
      <App.Carte flush className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3 border-b border-base px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sombre"><Logo height={14} iconOnly /></span>
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-principal">Équipe LIGGEEY</h2>
            <p className="truncate text-sm text-discret">Une question sur votre compte, une offre, un paiement ? Écrivez-nous ici.</p>
          </div>
        </div>
        <div className="flex max-h-[460px] min-h-[360px] flex-1 flex-col gap-4 overflow-y-auto px-5 py-5" aria-live="polite">
          {messages.length === 0 ? (
            <App.EtatVide icone={MessageCircle} titre="Aucun message pour l’instant" texte="Écrivez votre question ci-dessous : l’équipe LIGGEEY vous répond ici même." />
          ) : (
            messages.map((m, i) => {
              const suivant = messages[i + 1];
              return (
                <App.BulleMessage
                  key={i}
                  texte={m.texte}
                  heure={m.heure}
                  moi={m.de === "eux"}
                  nom={m.de === "eux" ? user.name : "Équipe LIGGEEY"}
                  photo={m.de === "eux" ? undefined : "/logo/monogramme-orange.svg"}
                  montrerAvatar={!suivant || suivant.de !== m.de}
                />
              );
            })
          )}
          <div ref={endRef} />
        </div>
        <App.ZoneSaisie onEnvoyer={envoyer} placeholder="Écrire à l’équipe LIGGEEY…" />
      </App.Carte>

      <div className="space-y-4">
        <App.Carte titre="Autres moyens de nous joindre">
          <p className="mb-3 text-sm text-secondaire">Vous préférez parler de vive voix ? Écrivez-nous sur WhatsApp ou passez au bureau d’accueil de Dakar.</p>
          <a href={lienWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded bg-doux px-4 text-sm font-semibold text-principal hover:bg-doux-fort">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
        </App.Carte>
        <App.Carte titre="Votre sécurité">
          <p className="text-sm text-secondaire">L’équipe LIGGEEY ne vous demandera jamais votre mot de passe ni un code de paiement Wave ou Orange Money.</p>
        </App.Carte>
      </div>
    </div>
  );
}

/* ---------- Archives (Admin) ---------- */

const ARCHIVES_INITIAL = [
  { id: "a1", titre: "Diplôme BTS Comptabilité — Mariama Ba", type: "Document", categorie: "Vérification", date: "12 septembre 2026", taille: "1,2 Mo" },
  { id: "a2", titre: "Signalement offre #2791 — résolu", type: "Discussion", categorie: "Modération", date: "8 septembre 2026", taille: "14 messages" },
  { id: "a3", titre: "Contrat mission #M-2026-0745", type: "Document", categorie: "Missions", date: "2 septembre 2026", taille: "340 Ko" },
  { id: "a4", titre: "Litige paiement — Diallo & Fils", type: "Discussion", categorie: "Missions", date: "29 août 2026", taille: "22 messages" },
  { id: "a5", titre: "Attestation formation Électricité Pro (lot de 15)", type: "Document", categorie: "Formations", date: "6 août 2026", taille: "4,8 Mo" },
  { id: "a6", titre: "Pièce d’identité — Ibrahima Faye", type: "Document", categorie: "Vérification", date: "30 juillet 2026", taille: "860 Ko" },
  { id: "a7", titre: "Demande de suppression de compte — Khady Ndour", type: "Discussion", categorie: "Comptes", date: "21 juillet 2026", taille: "6 messages" },
  { id: "a8", titre: "Kbis / RCCM — Dakar Services SARL", type: "Document", categorie: "Vérification", date: "15 juillet 2026", taille: "1,9 Mo" },
  { id: "a9", titre: "Retour participants — Atelier couture à Pikine", type: "Discussion", categorie: "Formations", date: "2 juillet 2026", taille: "31 messages" },
];

function ArchivesTab() {
  const [items, setItems] = useState(ARCHIVES_INITIAL);
  const [type, setType] = useState("Tous");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = items.filter((a) => (type === "Tous" || a.type === type) && `${a.titre} ${a.categorie}`.toLowerCase().includes(query.toLowerCase()));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const docs = items.filter((a) => a.type === "Document").length;
  const discussions = items.length - docs;

  function restore(a) {
    setItems((list) => list.filter((x) => x.id !== a.id));
    notify(`« ${a.titre} » restauré dans l’espace actif.`);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}><p className="text-2xl font-semibold" style={{ color: COLORS.slate }}>{items.length}</p><p className="text-sm" style={{ color: COLORS.slateLight }}>Éléments archivés</p></div>
        <div className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}><p className="text-2xl font-semibold" style={{ color: COLORS.slate }}>{docs}</p><p className="text-sm" style={{ color: COLORS.slateLight }}>Documents</p></div>
        <div className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}><p className="text-2xl font-semibold" style={{ color: COLORS.slate }}>{discussions}</p><p className="text-sm" style={{ color: COLORS.slateLight }}>Discussions résolues</p></div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          placeholder="Rechercher dans les archives…"
          label="Rechercher dans les archives"
          className="w-full sm:max-w-xs sm:flex-1"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Type d’archive">
          {["Tous", "Document", "Discussion"].map((t) => (
            <button key={t} type="button" onClick={() => { setType(t); setPage(1); }} aria-pressed={type === t} className={FORM.pastille(type === t)}>
              {t === "Tous" ? "Tous" : t === "Document" ? "Documents" : "Discussions"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[2.4fr,1fr,1fr,0.9fr,110px] px-5 py-3 text-xs font-semibold" style={{ background: COLORS.soft, borderBottom: `1px solid ${COLORS.border}`, color: COLORS.slateLight }}>
            <p>Élément</p><p>Catégorie</p><p>Archivé le</p><p>Taille</p><p className="text-right">Action</p>
          </div>
          {paged.map((a) => (
            <div key={a.id} className="grid grid-cols-[2.4fr,1fr,1fr,0.9fr,110px] items-center px-5 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                {a.type === "Document" ? <FileText size={16} color={COLORS.slateLight} className="shrink-0" /> : <MessageCircle size={16} color={COLORS.slateLight} className="shrink-0" />}
                <p className="text-sm font-medium truncate" style={{ color: COLORS.slate }}>{a.titre}</p>
              </div>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{a.categorie}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{a.date}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{a.taille}</p>
              <div className="text-right">
                <button type="button" onClick={() => restore(a)} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.orangeText }}>
                  <RotateCcw size={13} /> Restaurer
                </button>
              </div>
            </div>
          ))}
          {paged.length === 0 && <p className="text-sm p-5" style={{ color: COLORS.slateLight }}>{items.length === 0 ? "Les archives sont vides." : "Aucun élément ne correspond à ces filtres."}</p>}
        </div>
      </div>
      <Pagination page={page} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Planning (Admin) ---------- */

const EVENT_TYPE_COLORS = {
  Formation: { bg: COLORS.infoSoft, color: COLORS.info },
  Mission: { bg: COLORS.orangeSoft, color: COLORS.orangeStrong },
  "Date limite": { bg: COLORS.dangerSoft, color: COLORS.danger },
  Événement: { bg: COLORS.successSoft, color: COLORS.success },
};

const PLANNING_EVENTS_INITIAL = [
  { id: "e1", titre: "Formation Électricité Pro", type: "Formation", debut: "2026-10-03", fin: "2026-10-05", meta: "15 inscrits" },
  { id: "e2", titre: "Atelier couture à Pikine", type: "Mission", debut: "2026-10-10", fin: "2026-10-10", meta: "28 places" },
  { id: "e3", titre: "Limite des candidatures, offres BTP", type: "Date limite", debut: "2026-10-15", fin: "2026-10-15", meta: "Alerte système" },
  { id: "e4", titre: "Session de mentorat individuel", type: "Événement", debut: "2026-10-18", fin: "2026-10-19", meta: "12 sessions" },
  { id: "e5", titre: "Forum emploi et artisanat", type: "Événement", debut: "2026-10-25", fin: "2026-10-25", meta: "500 attendus" },
  { id: "e6", titre: "Formation Plomberie sanitaire", type: "Formation", debut: "2026-11-07", fin: "2026-11-09", meta: "12 inscrits" },
  { id: "e7", titre: "Clôture des offres hôtellerie", type: "Date limite", debut: "2026-11-21", fin: "2026-11-21", meta: "Alerte système" },
  { id: "e8", titre: "Journée portes ouvertes LIGGEEY", type: "Événement", debut: "2026-10-10", fin: "2026-10-10", meta: "Guédiawaye" },
];

const MOIS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const JOURS_FR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseIso(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function startOfWeek(d) {
  const day = (d.getDay() + 6) % 7; // lundi = 0
  return addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), -day);
}
function eventsOn(events, d) {
  const k = isoDate(d);
  return events.filter((e) => e.debut <= k && k <= e.fin);
}
function formatRange(e) {
  const a = parseIso(e.debut), b = parseIso(e.fin);
  const m = (x) => MOIS_FR[x.getMonth()].toLowerCase();
  if (e.debut === e.fin) return `${a.getDate()} ${m(a)}`;
  if (a.getMonth() === b.getMonth()) return `${a.getDate()}-${b.getDate()} ${m(b)}`;
  return `${a.getDate()} ${m(a)} – ${b.getDate()} ${m(b)}`;
}

function EventChip({ e }) {
  return (
    <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded mb-0.5 truncate" title={e.titre} style={{ background: EVENT_TYPE_COLORS[e.type].bg, color: EVENT_TYPE_COLORS[e.type].color }}>
      {e.titre}
    </div>
  );
}

function EventForm({ defaultDate, onSave, onCancel }) {
  const f = useFormulaire({ titre: "", type: "Formation", debut: defaultDate, fin: defaultDate, meta: "" }, (v) => ({
    titre: !v.titre.trim() && "Donnez un titre à l’événement.",
    fin: v.fin < v.debut && "La date de fin doit suivre la date de début.",
  }));
  const { v, err, attrs } = f;
  // Un début après la fin repousse la fin.
  const changerDebut = (e) => { const val = e.target.value; f.setV((s) => ({ ...s, debut: val, ...(s.fin < val ? { fin: val } : {}) })); };

  return (
    <ModalFrame onClose={onCancel} labelledBy="event-form-title">
      <form onSubmit={f.soumettre((val) => onSave({ ...val, titre: val.titre.trim(), id: `e${Date.now()}` }))} noValidate className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="event-form-title" className="text-lg font-semibold text-principal">Ajouter un événement</h2>
            <p className="mt-0.5 text-sm text-discret">Les champs marqués d’un * sont obligatoires.</p>
          </div>
          <App.BoutonIcone icone={X} label="Fermer" onClick={onCancel} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Champ id="ev-titre" label="Titre" requis erreur={err("titre")} large>
            <input {...attrs("ev-titre", "titre", { requis: true })} placeholder="Ex. : Formation soudure, niveau 1" className={FORM.champ(err("titre"))} />
          </Champ>
          <Champ id="ev-type" label="Type" large>
            <ListeChamp {...attrs("ev-type", "type")}>
              {Object.keys(EVENT_TYPE_COLORS).map((t) => <option key={t}>{t}</option>)}
            </ListeChamp>
          </Champ>
          <Champ id="ev-debut" label="Début">
            <input {...attrs("ev-debut", "debut")} onChange={changerDebut} type="date" className={FORM.champ()} />
          </Champ>
          <Champ id="ev-fin" label="Fin" erreur={err("fin")}>
            <input {...attrs("ev-fin", "fin")} type="date" min={v.debut} className={FORM.champ(err("fin"))} />
          </Champ>
          <Champ id="ev-meta" label="Détail" aide="Lieu, nombre de places…" large>
            <input {...attrs("ev-meta", "meta", { aide: true })} placeholder="Ex. : 20 places, Pikine" className={FORM.champ()} />
          </Champ>
        </div>
        <div className={FORM.actions}>
          <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
          <App.Bouton type="submit">Ajouter l’événement</App.Bouton>
        </div>
      </form>
    </ModalFrame>
  );
}

function PlanningScreen() {
  const [view, setView] = useState("Mois");
  const [cursor, setCursor] = useState(new Date(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), 1));
  const [selected, setSelected] = useState(demoNow());
  const [events, setEvents] = useState(PLANNING_EVENTS_INITIAL);
  const [formOpen, setFormOpen] = useState(false);

  function move(dir) {
    if (view === "Mois") {
      const n = new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1);
      setCursor(n);
      setSelected(n);
    } else {
      const n = addDays(selected, dir * (view === "Semaine" ? 7 : 1));
      setSelected(n);
      setCursor(new Date(n.getFullYear(), n.getMonth(), 1));
    }
  }

  function pickDay(d) {
    setSelected(d);
    setView("Jour");
  }

  const title = (() => {
    if (view === "Mois") return `${MOIS_FR[cursor.getMonth()]} ${cursor.getFullYear()}`;
    if (view === "Jour") return `${JOURS_FR[(selected.getDay() + 6) % 7]} ${selected.getDate()} ${MOIS_FR[selected.getMonth()].toLowerCase()} ${selected.getFullYear()}`;
    const a = startOfWeek(selected), b = addDays(a, 6);
    return `Semaine du ${a.getDate()} ${MOIS_FR[a.getMonth()].toLowerCase()} au ${b.getDate()} ${MOIS_FR[b.getMonth()].toLowerCase()}`;
  })();

  const monthStart = startOfWeek(cursor);
  const monthWeeks = [];
  for (let w = 0; w < 6; w++) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(monthStart, w * 7 + i));
    if (w > 3 && days[0].getMonth() !== cursor.getMonth()) break;
    monthWeeks.push(days);
  }
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selected), i));
  const dayEvents = eventsOn(events, selected);
  const fromKey = isoDate(view === "Mois" ? cursor : selected);
  const upcoming = events.filter((e) => e.fin >= fromKey).sort((a, b) => a.debut.localeCompare(b.debut)).slice(0, 6);
  const selKey = isoDate(selected);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1 flex-wrap">
        <div>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>Gérez le calendrier des formations, événements et activités de la plateforme LIGGEEY.</p>
        </div>
        <button type="button" onClick={() => setFormOpen(true)} className="flex items-center gap-1.5 rounded px-4 py-2.5 text-sm font-semibold text-sur-marque shrink-0" style={{ background: COLORS.orange }}>
          <Plus size={15} /> Ajouter un événement
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mt-6 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => move(-1)} aria-label="Période précédente" className="w-7 h-7 rounded border flex items-center justify-center bg-surface" style={{ borderColor: COLORS.border }}><ArrowLeft size={13} /></button>
          <p className="font-semibold text-lg" style={{ color: COLORS.slate }} aria-live="polite">{title}</p>
          <button type="button" onClick={() => move(1)} aria-label="Période suivante" className="w-7 h-7 rounded border flex items-center justify-center bg-surface" style={{ borderColor: COLORS.border }}><ChevronRight size={13} /></button>
        </div>
        <div className="flex rounded-md border overflow-hidden" style={{ borderColor: COLORS.border }}>
          {["Mois", "Semaine", "Jour"].map((v) => (
            <button key={v} type="button" onClick={() => { setView(v); if (v === "Mois") setCursor(new Date(selected.getFullYear(), selected.getMonth(), 1)); }} aria-pressed={view === v} className="px-4 py-1.5 text-sm" style={{ background: view === v ? COLORS.surface : "transparent", color: COLORS.slate, fontWeight: view === v ? 700 : 400 }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2.4fr,1fr] gap-4">
        <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
          {view !== "Jour" && (
            <div className="min-w-[560px]">
              <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {JOURS_FR.map((d) => <p key={d} className="text-xs font-semibold text-center py-2.5" style={{ color: COLORS.slateLight }}>{d}</p>)}
              </div>
              {(view === "Mois" ? monthWeeks : [weekDays]).map((week, wi, all) => (
                <div key={wi} className="grid grid-cols-7" style={{ borderBottom: wi < all.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  {week.map((d, ci) => {
                    const out = view === "Mois" && d.getMonth() !== cursor.getMonth();
                    const isSel = isoDate(d) === selKey;
                    return (
                      <button key={ci} type="button" onClick={() => pickDay(d)} className={`p-2 text-left align-top hover:bg-doux ${view === "Semaine" ? "min-h-[220px]" : "min-h-[84px]"}`} style={{ borderRight: ci < 6 ? `1px solid ${COLORS.border}` : "none", opacity: out ? 0.35 : 1 }} aria-label={`${d.getDate()} ${MOIS_FR[d.getMonth()]}, ${eventsOn(events, d).length} événement(s)`}>
                        <span className="text-xs font-semibold mb-1 inline-flex w-6 h-6 items-center justify-center rounded-full" style={isSel ? { background: COLORS.orange, color: COLORS.onOrange } : { color: COLORS.slate }}>{d.getDate()}</span>
                        {eventsOn(events, d).map((e) => <EventChip key={e.id} e={e} />)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {view === "Jour" && (
            <div className="p-5">
              {dayEvents.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>Aucun événement ce jour-là</p>
                  <button type="button" onClick={() => setFormOpen(true)} className="mt-3 text-sm font-semibold" style={{ color: COLORS.orangeText }}>Planifier un événement</button>
                </div>
              ) : dayEvents.map((e) => (
                <div key={e.id} className="rounded p-4 mb-3" style={{ background: EVENT_TYPE_COLORS[e.type].bg }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: EVENT_TYPE_COLORS[e.type].color }}>{e.titre}</p>
                    <span className="text-xs font-semibold" style={{ color: EVENT_TYPE_COLORS[e.type].color }}>{e.type}</span>
                  </div>
                  <p className="text-xs" style={{ color: COLORS.slate }}>{formatRange(e)}{e.meta ? ` · ${e.meta}` : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Prochains événements</h3>
          {upcoming.length === 0 && <p className="text-sm" style={{ color: COLORS.slateLight }}>Rien de prévu après cette date.</p>}
          {upcoming.map((e, i) => (
            <button key={e.id} type="button" onClick={() => pickDay(parseIso(e.debut))} className="w-full text-left py-3" style={{ borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: EVENT_TYPE_COLORS[e.type].color }}>{formatRange(e)}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: EVENT_TYPE_COLORS[e.type].bg, color: EVENT_TYPE_COLORS[e.type].color }}>{e.type}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{e.titre}</p>
              {e.meta && <p className="text-xs flex items-center gap-1" style={{ color: COLORS.slateLight }}><Users2 size={11} /> {e.meta}</p>}
            </button>
          ))}
        </div>
      </div>

      {formOpen && (
        <EventForm
          defaultDate={selKey}
          onCancel={() => setFormOpen(false)}
          onSave={(ev) => {
            setEvents((list) => [...list, ev]);
            setFormOpen(false);
            const d = parseIso(ev.debut);
            setSelected(d);
            setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
            notify(`« ${ev.titre} » ajouté au planning.`);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Centre de communication (Admin) ---------- */

const NOTIFICATIONS_INITIAL = [
  { id: "n1", titre: "Nouveau profil en attente de vérification", badge: "Utilisateurs", description: "Moustapha Diop a soumis un document d’électricien CAP.", temps: "Il y a 5 min", lu: false, icon: UserPlus, target: "verifications" },
  { id: "n2", titre: "Signalement reçu – Offre #2847", badge: "Système", description: "Offre signalée pour motif d’informations suspicieuses par un utilisateur.", temps: "Il y a 2 heures", lu: false, icon: AlertCircle, target: "offres" },
  { id: "n3", titre: "Formation complétée par 15 participants", badge: "Système", description: "La formation « Électricité Pro » s’est achevée avec succès.", temps: "Il y a 4 heures", lu: true, icon: CheckCircle2, target: "formations" },
  { id: "n4", titre: "Mission #M-2024-0892 terminée", badge: "Système", description: "Diallo & Fils a marqué le travail de plomberie comme payé.", temps: "Hier", lu: true, icon: CheckCircle2, target: "missions" },
  { id: "n5", titre: "3 nouveaux avis à modérer", badge: "Utilisateurs", description: "Les avis d’utilisateurs sur les prestataires de Pikine attendent approbation.", temps: "Hier", lu: true, icon: AlertCircle, target: "prestataires" },
];

function CommunicationScreen({ onNavigate, ongletInitial }) {
  const [mainTab, setMainTab] = useState(ongletInitial || "Notifications");
  const [subTab, setSubTab] = useState("Toutes");
  const [notifs, setNotifs] = useState(NOTIFICATIONS_INITIAL);

  const nonLues = notifs.filter((n) => !n.lu).length;
  const filtered = notifs.filter((n) => {
    if (subTab === "Toutes") return true;
    if (subTab === "Non lues") return !n.lu;
    return n.badge === subTab;
  });

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Gérez les notifications, messages et archives de la plateforme LIGGEEY.</p>

      <div className="mb-5">
        <App.Onglets label="Sections de la communication" onglets={["Notifications", "Messagerie", "Archives"].map((t) => ({ id: t, label: t }))} actif={mainTab} onChange={setMainTab} />
      </div>

      {mainTab === "Messagerie" && <MessagerieTab />}
      {mainTab === "Archives" && <ArchivesTab />}

      {mainTab === "Notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1fr] gap-4">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex gap-2">
                {[{ id: "Toutes", label: "Toutes" }, { id: "Non lues", label: `Non lues (${nonLues})` }, { id: "Système", label: "Système" }, { id: "Utilisateurs", label: "Utilisateurs" }].map((t) => (
                  <button key={t.id} type="button" onClick={() => setSubTab(t.id)} className="rounded px-3 py-1.5 text-xs font-semibold" style={{ background: subTab === t.id ? COLORS.softStrong : COLORS.surface, color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setNotifs((list) => list.map((n) => ({ ...n, lu: true })))} className="rounded px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
                Tout marquer comme lu
              </button>
            </div>

            {filtered.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="rounded-lg border p-4 mb-3 flex items-start gap-3" style={{ borderColor: COLORS.border, background: n.lu ? COLORS.surface : COLORS.orangeSubtle }}>
                  {!n.lu && <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: COLORS.orange }} />}
                  <Icon size={16} color={COLORS.slateLight} className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{n.titre}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: n.badge === "Système" ? COLORS.orangeSoft : COLORS.infoSoft, color: n.badge === "Système" ? COLORS.orangeStrong : COLORS.info }}>{n.badge}</span>
                    </div>
                    <p className="text-sm" style={{ color: COLORS.slateLight }}>{n.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{n.temps}</p>
                    <button type="button" onClick={() => onNavigate(n.target)} className="text-sm font-semibold" style={{ color: COLORS.orangeText }}>Gérer</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Statistiques de communication</h3>
              <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Total envoyées</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>1 247</p></div>
              <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Taux de lecture</p><p className="text-sm font-semibold" style={{ color: COLORS.success }}>78%</p></div>
              <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Messages en attente</p><p className="text-sm font-semibold" style={{ color: COLORS.orangeText }}>5</p></div>
            </div>
            <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-2 mb-2"><Archive size={16} color={COLORS.slate} /><h3 className="font-semibold" style={{ color: COLORS.slate }}>Archives plateforme</h3></div>
              <p className="text-sm mb-3" style={{ color: COLORS.slateLight }}>Accédez à l’historique complet des dossiers archivés pour libérer l’espace actif de la base.</p>
              <div className="flex items-center justify-between py-1"><p className="text-sm" style={{ color: COLORS.slateLight }}>Documents archivés</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>342</p></div>
              <div className="flex items-center justify-between py-1 mb-3"><p className="text-sm" style={{ color: COLORS.slateLight }}>Discussions résolues</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>89</p></div>
              <button type="button" onClick={() => setMainTab("Archives")} className="w-full rounded py-2.5 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>Consulter les archives</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Paramètres (Admin) ---------- */

const CHAMPS_MOT_DE_PASSE = [
  { k: "actuel", l: "Mot de passe actuel", auto: "current-password" },
  { k: "nouveau", l: "Nouveau mot de passe", auto: "new-password", aide: "8 caractères minimum." },
  { k: "confirmation", l: "Confirmer le nouveau mot de passe", auto: "new-password" },
];

function PasswordChanger() {
  const [open, setOpen] = useState(false);
  const f = useFormulaire({ actuel: "", nouveau: "", confirmation: "" }, (p) => ({
    actuel: !p.actuel && "Saisissez votre mot de passe actuel.",
    nouveau: p.nouveau.length < 8 && "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    confirmation: p.nouveau !== p.confirmation && "Les deux nouveaux mots de passe ne correspondent pas.",
  }));

  function fermer() {
    f.setV({ actuel: "", nouveau: "", confirmation: "" });
    f.setEssai(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <App.Bouton variante="neutre" petit onClick={() => setOpen(true)} className="mt-3">
        <Lock size={15} aria-hidden="true" /> Changer le mot de passe
      </App.Bouton>
    );
  }
  return (
    <form onSubmit={f.soumettre(() => { fermer(); notify("Mot de passe modifié."); })} noValidate className="mt-3 max-w-md space-y-4 rounded-lg border border-base p-5">
      {CHAMPS_MOT_DE_PASSE.map((c) => (
        <Champ key={c.k} id={`pwd-${c.k}`} label={c.l} requis aide={c.aide} erreur={f.err(c.k)}>
          <input {...f.attrs(`pwd-${c.k}`, c.k, { requis: true, aide: c.aide })} type="password" autoComplete={c.auto} className={FORM.champ(f.err(c.k))} />
        </Champ>
      ))}
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <App.Bouton variante="neutre" onClick={fermer}>Annuler</App.Bouton>
        <App.Bouton type="submit">Changer le mot de passe</App.Bouton>
      </div>
    </form>
  );
}

function ParametresScreen() {
  const [toggles, setToggles] = useState({
    notifNouveauProfil: true,
    notifSignalement: true,
    notifFormation: false,
    doubleAuth: true,
  });
  const [saved, setSaved] = useState(false);

  function toggle(key) {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
    setSaved(false);
  }

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Gérez votre compte administrateur et les préférences de la plateforme LIGGEEY.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Compte administrateur</h3>
          <Row label="Nom" value="Admin LIGGEEY" /><div className="h-2" />
          <Row label="Rôle" value="Super admin" /><div className="h-2" />
          <Row label="E-mail" value="admin@liggeey.sn" />
        </div>
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Sécurité</h3>
          <label className="flex items-center justify-between py-1.5 cursor-pointer">
            <span className="text-sm" style={{ color: COLORS.slate }}>Authentification à deux facteurs</span>
            <input type="checkbox" checked={toggles.doubleAuth} onChange={() => toggle("doubleAuth")} className="w-4 h-4 accent-primaire-500" />
          </label>
          <PasswordChanger />
        </div>
      </div>

      <App.Carte titre="Apparence" sousTitre="Le thème s’applique tout de suite et reste mémorisé sur cet appareil." className="mb-4">
        <App.ChoixTheme label="Thème de la plateforme" />
      </App.Carte>

      <div className="rounded-lg border bg-surface p-6 mb-4" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Notifications administrateur</h3>
        {[
          { key: "notifNouveauProfil", label: "Nouveau profil en attente de vérification" },
          { key: "notifSignalement", label: "Signalement reçu sur une offre ou un profil" },
          { key: "notifFormation", label: "Formation complétée par des participants" },
        ].map((n) => (
          <label key={n.key} className="flex items-center justify-between py-2 cursor-pointer" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <span className="text-sm" style={{ color: COLORS.slate }}>{n.label}</span>
            <input type="checkbox" checked={toggles[n.key]} onChange={() => toggle(n.key)} className="w-4 h-4 accent-primaire-500" />
          </label>
        ))}
      </div>

      <button type="button" onClick={() => setSaved(true)} className="rounded px-5 py-2.5 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>
        Enregistrer les modifications
      </button>
      {saved && <span className="ml-3 text-sm" style={{ color: COLORS.success }}>Préférences enregistrées.</span>}
    </div>
  );
}

/* =====================================================================
   ABONNEMENTS & OFFRES PREMIUM
   - Offres par type d’utilisateur (chercheur, prestataire, entreprise)
   - Limites mensuelles + fonctionnalités réservées
   - Paiement mobile money (Wave, Orange Money), tarifs alignés sur la page Tarifs du site
   - Pilotage admin : tarifs, quotas, abonnés, transactions
   ===================================================================== */

const PlanContext = React.createContext(null);
function usePlan() {
  return React.useContext(PlanContext);
}

const UNLIMITED = Infinity;

/* Note sur 5, à la française : 4,5 (virgule décimale). */
function noteFr(n) {
  return Number(n || 0).toFixed(1).replace(".", ",");
}

function fcfa(n) {
  // Espaces insécables : un montant n’est jamais coupé en fin de ligne.
  return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0FCFA`;
}

function todayFr(offsetMonths = 0) {
  const d = demoNow();
  d.setMonth(d.getMonth() + offsetMonths);
  return dateFr(d);
}

const PLANS_INITIAL = {
  chercheur: [
    { id: "essentiel", nom: "Essentiel", prixMensuel: 1500, description: "Les fonctionnalités essentielles pour démarrer votre recherche.", limits: { candidatures: 5 }, features: {}, avantages: ["Profil complet et badge « Profil vérifié »", "Offres vérifiées", "5 candidatures par mois", "Suivi des candidatures", "Formations gratuites avec certificat"] },
    { id: "premium", nom: "Premium", prixMensuel: 3000, recommande: true, description: "Pour aller plus loin : fonctionnalités avancées, mentorat, certaines formations.", limits: { candidatures: UNLIMITED }, features: { formationsPremium: true, mentorat: true, miseEnAvant: true }, avantages: ["Tout le Pack Essentiel", "Candidatures illimitées", "Profil mis en avant auprès des recruteurs", "Sessions de mentorat collectives", "Formations premium incluses", "Voir qui a consulté votre profil"] },
  ],
  prestataire: [
    { id: "essentiel", nom: "Essentiel", prixMensuel: 1500, description: "Les fonctionnalités essentielles pour proposer vos services.", limits: { services: 10 }, features: {}, avantages: ["Profil complet et badge « Profil vérifié »", "Jusqu’à 10 services publiés", "Formations gratuites avec certificat", "Guide de formalisation en ligne"] },
    { id: "premium", nom: "Premium", prixMensuel: 3000, recommande: true, description: "Pour aller plus loin : fonctionnalités avancées, mentorat, certaines formations.", limits: { services: UNLIMITED }, features: { formationsPremium: true, mentorat: true, contreOffre: true, badgePro: true, accompagnementRegularisation: true }, avantages: ["Tout le Pack Essentiel", "Services illimités", "Profil prioritaire et badge Premium", "Contre-propositions de tarif aux clients", "Sessions de mentorat collectives", "Formations premium incluses"] },
  ],
  entreprise: [
    { id: "premium", nom: "Entreprise", prixMensuel: 40000, description: "Publication d’offres, sélection et short-list des profils par LIGGEEY.", limits: { offres: UNLIMITED }, features: { coordonnees: true, contactPrestataires: true, sponsoring: true }, avantages: ["Offres illimitées", "Sélection et short-list des profils par LIGGEEY", "Coordonnées et CV des candidats", "Contact direct et missions aux prestataires", "Offres sponsorisées en tête de liste"] },
  ],
};

const ESPACE_LABELS = { chercheur: "Chercheur d’emploi", prestataire: "Prestataire", entreprise: "Entreprise" };

const LIMIT_LABELS = {
  candidatures: "Candidatures ce mois-ci",
  services: "Services publiés",
  offres: "Offres publiées ce mois-ci",
};

const UPGRADE_REASONS = {
  candidatures: { titre: "Vous avez utilisé toutes vos candidatures du mois", texte: "Avec la formule Premium, postulez sans limite aux offres qui vous intéressent.", limit: "candidatures" },
  formationsPremium: { titre: "Cette formation est réservée à la formule Premium", texte: "Débloquez toutes les formations et obtenez les certificats associés.", feature: "formationsPremium" },
  mentorat: { titre: "Le mentorat est réservé à la formule Premium", texte: "Profitez des sessions de mentorat collectives avec des professionnels de votre secteur.", feature: "mentorat" },
  services: { titre: "Vous avez atteint le nombre maximum de services", texte: "Publiez autant de services que vous le souhaitez avec la formule Premium.", limit: "services" },
  contreOffre: { titre: "Les contre-propositions sont réservées à la formule Premium", texte: "Négociez le tarif d’une mission directement avec le client.", feature: "contreOffre" },
  offres: { titre: "Vous avez publié toutes vos offres du mois", texte: "Publiez davantage d’offres et touchez plus de candidats.", limit: "offres" },
  coordonnees: { titre: "Coordonnées et CV réservés à la formule Premium", texte: "Contactez directement les candidats et téléchargez leurs documents.", feature: "coordonnees" },
  contactPrestataires: { titre: "Le contact direct avec les prestataires est réservé à la formule Premium", texte: "Échangez avec les artisans et proposez-leur des missions.", feature: "contactPrestataires" },
  accompagnementRegularisation: { titre: "L’accompagnement par un conseiller est inclus dans Premium", texte: "Un conseiller LIGGEEY prépare vos dossiers avec vous et vous oriente vers les bons guichets.", feature: "accompagnementRegularisation" },
  sponsoring: { titre: "Les offres sponsorisées sont réservées à la formule Premium", texte: "Placez votre offre en tête des résultats pendant 7 jours.", feature: "sponsoring" },
};

const PREMIUM_FORMATIONS = new Set(["devweb", "excel", "leadership", "entrepreneuriat", "peinture-moderne", "soudure-tech", "solaire-pv"]);

const SUBS_INITIAL = {
  chercheur: { planId: "essentiel", cycle: "mensuel", moyen: "Wave", depuis: "1er septembre 2026", prochain: "1er novembre 2026" },
  prestataire: { planId: "essentiel", cycle: "mensuel", moyen: "Orange Money", depuis: "15 août 2026", prochain: "15 octobre 2026" },
  entreprise: { planId: "premium", cycle: "mensuel", moyen: "Wave", depuis: "3 septembre 2026", prochain: "3 novembre 2026" },
};

const USAGE_INITIAL = {
  chercheur: { candidatures: 3 },
  prestataire: { services: 9 },
  entreprise: { offres: 0 },
};

const PAYMENT_METHODS = [
  { id: "wave", nom: "Wave", couleur: "#1DC8F2", type: "mobile" },
  { id: "om", nom: "Orange Money", couleur: "#FF7900", type: "mobile" },
];

/* Titulaire d’un paiement : la personne, ou l’entreprise pour l’espace entreprise. */
function clientPaiement(espace, user) {
  return espace === "entreprise" ? user.role : user.name;
}

const TRANSACTIONS_INITIAL = [
  { id: "t1", ref: "LIG-26-10-0418", date: "7 octobre 2026", client: "Sonatel SA", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, moyen: "Orange Money", statut: "Payé" },
  { id: "t2", ref: "LIG-26-10-0417", date: "6 octobre 2026", client: "Fatou Cissé", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 3000, moyen: "Wave", statut: "Payé" },
  { id: "t3", ref: "LIG-26-10-0415", date: "5 octobre 2026", client: "Moussa Diop", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 3000, moyen: "Wave", statut: "Payé" },
  { id: "t4", ref: "LIG-26-10-0411", date: "4 octobre 2026", client: "Kirène", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, moyen: "Wave", statut: "Échoué" },
  { id: "t11", ref: "LIG-26-10-0410", date: "3 octobre 2026", client: "Senegal Construction SARL", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, moyen: "Wave", statut: "Payé" },
  { id: "t5", ref: "LIG-26-10-0409", date: "3 octobre 2026", client: "Ibrahima Diallo", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 3000, moyen: "Orange Money", statut: "Payé" },
  { id: "t6", ref: "LIG-26-10-0402", date: "2 octobre 2026", client: "Aïcha Ndoye", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 3000, moyen: "Orange Money", statut: "Payé" },
  { id: "t12", ref: "LIG-26-10-0398", date: "1er octobre 2026", client: "Absatou Diallo", espace: "chercheur", offre: "Essentiel", cycle: "Mensuel", montant: 1500, moyen: "Wave", statut: "Payé" },
  { id: "t7", ref: "LIG-26-10-0397", date: "1er octobre 2026", client: "Teranga Capital", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, moyen: "Wave", statut: "Payé" },
  { id: "t8", ref: "LIG-26-09-0388", date: "29 septembre 2026", client: "Khady Ndiaye", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 3000, moyen: "Wave", statut: "Remboursé" },
  { id: "t9", ref: "LIG-26-09-0381", date: "27 septembre 2026", client: "Ousmane Fall", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 3000, moyen: "Wave", statut: "Échoué" },
  { id: "t10", ref: "LIG-26-09-0376", date: "25 septembre 2026", client: "Dakar Bâtiment", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, moyen: "Orange Money", statut: "Payé" },
  { id: "t13", ref: "LIG-26-09-0367", date: "15 septembre 2026", client: "Mamadou Ndiaye", espace: "prestataire", offre: "Essentiel", cycle: "Mensuel", montant: 1500, moyen: "Orange Money", statut: "Payé" },
  { id: "t14", ref: "LIG-26-09-0352", date: "3 septembre 2026", client: "Senegal Construction SARL", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, moyen: "Wave", statut: "Payé" },
  { id: "t15", ref: "LIG-26-09-0348", date: "1er septembre 2026", client: "Absatou Diallo", espace: "chercheur", offre: "Essentiel", cycle: "Mensuel", montant: 1500, moyen: "Wave", statut: "Payé" },
  { id: "t16", ref: "LIG-26-08-0331", date: "15 août 2026", client: "Mamadou Ndiaye", espace: "prestataire", offre: "Essentiel", cycle: "Mensuel", montant: 1500, moyen: "Orange Money", statut: "Payé" },
];

const ABONNES_ADMIN_INITIAL = [
  { id: "ab1", nom: "Sonatel SA", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, depuis: "7 mars 2026", prochain: "7 novembre 2026", statut: "Actif" },
  { id: "ab2", nom: "Teranga Capital", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, depuis: "1er octobre 2026", prochain: "1er novembre 2026", statut: "Actif" },
  { id: "ab3", nom: "Kirène", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, depuis: "4 juin 2026", prochain: "4 octobre 2026", statut: "Échec de paiement" },
  { id: "ab4", nom: "Dakar Bâtiment", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, depuis: "25 mai 2026", prochain: "25 octobre 2026", statut: "Actif" },
  { id: "ab5", nom: "Fatou Cissé", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 3000, depuis: "6 juillet 2026", prochain: "6 novembre 2026", statut: "Actif" },
  { id: "ab6", nom: "Ibrahima Diallo", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 3000, depuis: "3 octobre 2026", prochain: "3 novembre 2026", statut: "Actif" },
  { id: "ab7", nom: "Khady Ndiaye", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 3000, depuis: "29 août 2026", prochain: "—", statut: "Suspendu" },
  { id: "ab8", nom: "Moussa Diop", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 3000, depuis: "5 octobre 2026", prochain: "5 novembre 2026", statut: "Actif" },
  { id: "ab9", nom: "Aïcha Ndoye", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 3000, depuis: "2 août 2026", prochain: "2 novembre 2026", statut: "Actif" },
  { id: "ab10", nom: "Ousmane Fall", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 3000, depuis: "27 juillet 2026", prochain: "27 septembre 2026", statut: "Échec de paiement" },
  // Comptes de démonstration (même formule que dans leur espace, voir SUBS_INITIAL)
  { id: "ab11", nom: "Senegal Construction SARL", espace: "entreprise", offre: "Entreprise", cycle: "Mensuel", montant: 40000, depuis: "3 septembre 2026", prochain: "3 novembre 2026", statut: "Actif" },
  { id: "ab12", nom: "Mamadou Ndiaye", espace: "prestataire", offre: "Essentiel", cycle: "Mensuel", montant: 1500, depuis: "15 août 2026", prochain: "15 octobre 2026", statut: "Actif" },
  { id: "ab13", nom: "Absatou Diallo", espace: "chercheur", offre: "Essentiel", cycle: "Mensuel", montant: 1500, depuis: "1er septembre 2026", prochain: "1er novembre 2026", statut: "Actif" },
];

/* Revenus mensuels des abonnements. Le mois en cours reprend le revenu mensuel récurrent
   calculé sur les abonnés actifs, pour que le graphique et la carte affichent le même montant. */
const REVENUS_MOIS = [
  { mois: "Mai", montant: 92000 },
  { mois: "Juin", montant: 107000 },
  { mois: "Juil.", montant: 121500 },
  { mois: "Août", montant: 138000 },
  { mois: "Sept.", montant: 156500 },
  { mois: "Oct.", montant: 175000 },
];

/* ----- API exposée à tous les écrans via le contexte ----- */

function buildPlanApi({ espace, user, plans, setPlans, subs, setSubs, usage, setUsage, transactions, setTransactions, setUpgrade, setPayment }) {
  const espacePlans = plans[espace] || [];
  const sub = subs[espace];
  const plan = espacePlans.find((p) => p.id === sub?.planId) || espacePlans[0] || null;
  const espaceUsage = usage[espace] || {};

  const api = {
    espace,
    user,
    plans,
    setPlans,
    espacePlans,
    plan,
    sub,
    transactions,
    setTransactions,
    isAdmin: espace === "admin",
    can: (feature) => espace === "admin" || !!plan?.features?.[feature],
    limitOf: (key) => (plan?.limits?.[key] ?? UNLIMITED),
    used: (key) => espaceUsage[key] || 0,
    remaining: (key) => api.limitOf(key) - api.used(key),
    consume: (key) => setUsage((u) => ({ ...u, [espace]: { ...(u[espace] || {}), [key]: ((u[espace] || {})[key] || 0) + 1 } })),
    setUsed: (key, value) => setUsage((u) => ((u[espace] || {})[key] === value ? u : { ...u, [espace]: { ...(u[espace] || {}), [key]: value } })),
    requestUpgrade: (reasonKey) => setUpgrade(reasonKey),
    gate: (feature, fn) => {
      if (api.can(feature)) fn && fn();
      else setUpgrade(feature);
    },
    nextPlan: () => espacePlans.find((p) => plan && p.prixMensuel > plan.prixMensuel) || null,
    startPayment: (planId, cycle = "mensuel") => setPayment({ planId, cycle }),
    subscribe: (planId, cycle, moyen) => {
      const target = espacePlans.find((p) => p.id === planId);
      if (!target) return null;
      const montant = target.prixMensuel;
      const ref = `LIG-26-10-${String(Math.floor(1000 + Math.random() * 8999))}`;
      setSubs((s) => ({ ...s, [espace]: { planId, cycle, moyen, depuis: todayFr(), prochain: todayFr(1) } }));
      setTransactions((t) => [{ id: `t${Date.now()}`, ref, date: todayFr(), client: clientPaiement(espace, user), espace, offre: target.nom, cycle: "Mensuel", montant, moyen, statut: "Payé" }, ...t]);
      return { ref, montant, prochain: todayFr(1) };
    },
    downgrade: () => {
      const base = espacePlans[0];
      if (!base || base.id === plan?.id) return;
      setSubs((s) => ({ ...s, [espace]: { ...s[espace], planId: base.id, cycle: "mensuel" } }));
      notify(`Vous êtes revenu(e) à la formule ${base.nom}.`, "info");
    },
  };
  return api;
}

/* ----- Petits éléments réutilisables ----- */

function PremiumChip({ label = "Premium", locked }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: COLORS.darkSoft, color: COLORS.brandPale }}>
      {locked ? <Lock size={10} /> : <Crown size={10} color={COLORS.orange} />}
      {label}
    </span>
  );
}

function UsageMeter({ label, used, limit }) {
  const unlimited = limit === UNLIMITED;
  const pct = unlimited ? 100 : Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
  const full = !unlimited && used >= limit;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span style={{ color: COLORS.onDarkMuted }}>{label}</span>
        <span className="font-semibold text-sur-sombre">{unlimited ? "Illimité" : `${used} / ${limit}`}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.darkLine }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: unlimited ? COLORS.successBright : full ? COLORS.dangerBright : COLORS.orange }} />
      </div>
    </div>
  );
}

function ModalFrame({ onClose, children, labelledBy, maxWidth = "max-w-md" }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,11,8,0.55)" }} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={`w-full ${maxWidth} rounded-lg bg-surface max-h-[92vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ----- Modale d’incitation : s’ouvre quand une action est verrouillée ----- */

function UpgradeModal({ reasonKey, onClose, onNavigate }) {
  const api = usePlan();
  const reason = UPGRADE_REASONS[reasonKey] || { titre: "Fonctionnalité réservée", texte: "Passez à une offre supérieure pour y accéder." };
  const current = api.plan;
  const target = api.espacePlans.find((p) => {
    if (!current || p.prixMensuel <= current.prixMensuel) return false;
    if (reason.feature) return !!p.features[reason.feature];
    if (reason.limit) return (p.limits[reason.limit] ?? 0) > (current.limits[reason.limit] ?? 0);
    return true;
  });

  return (
    <ModalFrame onClose={onClose} labelledBy="upgrade-title">
      <div className="p-6" style={{ background: COLORS.dark }}>
        <div className="flex items-start justify-between gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: COLORS.darkLine }}>
            <Crown size={18} color={COLORS.orange} />
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-xl leading-none" style={{ color: COLORS.onDarkSubtle }}>×</button>
        </div>
        <h3 id="upgrade-title" className="text-lg font-semibold text-sur-sombre mt-4 mb-1">{reason.titre}</h3>
        <p className="text-sm" style={{ color: COLORS.onDarkMuted }}>{reason.texte}</p>
      </div>

      {target ? (
        <div className="p-6">
          <div className="flex items-baseline justify-between mb-3">
            <p className="font-semibold" style={{ color: COLORS.slate }}>Profil {target.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}><span className="text-xl font-semibold" style={{ color: COLORS.slate }}>{fcfa(target.prixMensuel)}</span> / mois</p>
          </div>
          <ul className="flex flex-col gap-2 mb-6">
            {target.avantages.slice(0, 4).map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm" style={{ color: COLORS.slate }}>
                <Check size={15} color={COLORS.success} className="mt-0.5 shrink-0" /> {a}
              </li>
            ))}
          </ul>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button type="button" onClick={() => { onClose(); onNavigate("abonnement"); }} className="rounded px-4 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
              Comparer les profils
            </button>
            <button type="button" onClick={() => { onClose(); api.startPayment(target.id, "mensuel"); }} className="rounded px-4 py-2.5 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>
              Passer à {target.nom}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-sm" style={{ color: COLORS.slateLight }}>Aucun profil supérieur n’est disponible pour votre espace.</div>
      )}
    </ModalFrame>
  );
}

/* ----- Paiement (simulé) ----- */

function PaymentModal({ planId, initialCycle, onClose }) {
  const api = usePlan();
  const target = api.espacePlans.find((p) => p.id === planId);
  const cycle = "mensuel";
  const [method, setMethod] = useState("wave");
  const [phone, setPhone] = useState("77 123 45 67");
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState("form"); // form | pending | done
  const [receipt, setReceipt] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  if (!target) return null;

  const m = PAYMENT_METHODS.find((x) => x.id === method);
  const montant = target.prixMensuel;
  const digits = phone.replace(/\D/g, "").replace(/^221/, "");
  const phoneValid = /^7[05678]\d{7}$/.test(digits);
  const valid = phoneValid;

  function pay() {
    setTouched(true);
    if (!valid) return;
    setStep("pending");
    timer.current = setTimeout(() => {
      const r = api.subscribe(target.id, cycle, m.nom);
      setReceipt(r);
      setStep("done");
      notify(`Profil ${target.nom} activé.`);
    }, 2200);
  }

  return (
    <ModalFrame onClose={step === "pending" ? () => {} : onClose} labelledBy="pay-title">
      {step === "form" && (
        <form onSubmit={(e) => { e.preventDefault(); pay(); }} noValidate className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 id="pay-title" className="text-lg font-semibold text-principal">Passer à la formule {target.nom}</h3>
              <p className="mt-0.5 text-sm text-secondaire">{target.description}</p>
            </div>
            <App.BoutonIcone icone={X} label="Fermer" onClick={onClose} />
          </div>

          <fieldset className="mb-5">
            <legend className={AUTH.libelle}>Moyen de paiement</legend>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => { setMethod(pm.id); setTouched(false); }}
                  aria-pressed={method === pm.id}
                  className={`flex min-h-[48px] items-center gap-2.5 rounded-md border px-3 text-[15px] font-medium text-principal transition-colors ${method === pm.id ? "border-marque bg-marque-doux" : "border-base bg-surface hover:border-forte"}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: pm.couleur }}>
                    <Smartphone size={14} className="text-sur-sombre" aria-hidden="true" />
                  </span>
                  {pm.nom}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mb-5">
            <label htmlFor="pay-phone" className={AUTH.libelle}>Numéro {m.nom}</label>
            <div className="flex">
              <span className="inline-flex h-12 items-center rounded-l-md border border-r-0 border-base bg-doux px-3.5 text-[15px] text-secondaire">+221</span>
              <input
                id="pay-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={(touched && !phoneValid) || undefined}
                aria-describedby="pay-phone-aide"
                className={`${FORM.champ(touched && !phoneValid)} rounded-l-none`}
              />
            </div>
            <p id="pay-phone-aide" className={AUTH.aide(touched && !phoneValid)}>
              {touched && !phoneValid ? "Saisissez un numéro sénégalais à 9 chiffres, par exemple 77 123 45 67." : `Vous recevrez une demande de paiement ${m.nom} sur ce numéro.`}
            </p>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-lg bg-doux px-4 py-3">
            <span className="text-sm text-secondaire">Total à payer</span>
            <span className="text-lg font-semibold text-principal">{fcfa(montant)}</span>
          </div>

          <App.Bouton type="submit" pleineLargeur className="min-h-[48px]">Payer {fcfa(montant)}</App.Bouton>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-discret">
            <Lock size={12} aria-hidden="true" /> Paiement sécurisé · résiliable à tout moment
          </p>
        </form>
      )}

      {step === "pending" && (
        <div className="p-8 text-center" aria-live="polite">
          <Loader2 size={32} color={COLORS.orange} className="mx-auto mb-4 animate-spin" />
          <h3 id="pay-title" className="text-lg font-semibold mb-1" style={{ color: COLORS.slate }}>
            Confirmez sur votre téléphone
          </h3>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>
            {`Une demande de paiement ${m.nom} de ${fcfa(montant)} a été envoyée au +221 ${phone}. Saisissez votre code secret pour valider.`}
          </p>
        </div>
      )}

      {step === "done" && receipt && (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: COLORS.successSoft }}>
            <CheckCircle2 size={24} color={COLORS.success} />
          </div>
          <h3 id="pay-title" className="text-lg font-semibold mb-1" style={{ color: COLORS.slate }}>Paiement confirmé</h3>
          <p className="text-sm mb-5" style={{ color: COLORS.slateLight }}>
            Votre formule {target.nom} est active. Prochain renouvellement le {receipt.prochain}.
          </p>
          <div className="rounded-md px-4 py-3 mb-6 text-left text-sm flex flex-col gap-1.5" style={{ background: COLORS.soft }}>
            <div className="flex justify-between"><span style={{ color: COLORS.slateLight }}>Référence</span><span className="font-semibold" style={{ color: COLORS.slate }}>{receipt.ref}</span></div>
            <div className="flex justify-between"><span style={{ color: COLORS.slateLight }}>Montant</span><span className="font-semibold" style={{ color: COLORS.slate }}>{fcfa(receipt.montant)}</span></div>
            <div className="flex justify-between"><span style={{ color: COLORS.slateLight }}>Moyen</span><span className="font-semibold" style={{ color: COLORS.slate }}>{m.nom}</span></div>
          </div>
          <button type="button" onClick={onClose} className="w-full rounded px-4 py-3 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Terminer</button>
        </div>
      )}
    </ModalFrame>
  );
}

/* ----- Écran « Abonnement » (chercheur, prestataire, entreprise) ----- */

function AbonnementScreen() {
  const api = usePlan();
  const { plan, sub, espacePlans } = api;
  const [confirmDowngrade, setConfirmDowngrade] = useState(false);
  const history = api.transactions.filter((t) => t.espace === api.espace && t.client === clientPaiement(api.espace, api.user));
  const base = espacePlans[0];
  const canDowngrade = espacePlans.length > 1 && plan.id !== base.id;
  const limitKeys = Object.keys(plan.limits);

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Choisissez la formule adaptée à votre activité. Vous pouvez changer ou résilier à tout moment.</p>

      <div className="rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-6" style={{ background: COLORS.dark }}>
        <div>
          <p className="text-sm mb-1" style={{ color: COLORS.onDarkMuted }}>Formule actuelle</p>
          <p className="text-2xl font-semibold text-sur-sombre flex items-center gap-2">
            {plan.nom} {plan.id !== "essentiel" && <Crown size={20} color={COLORS.orange} />}
          </p>
          <p className="text-sm mt-1" style={{ color: COLORS.orangeOnDark }}>
            {`${fcfa(plan.prixMensuel)} / mois${sub.prochain ? ` · renouvellement le ${sub.prochain}` : ""}`}
          </p>
          {canDowngrade && (
            <button type="button" onClick={() => setConfirmDowngrade(true)} className="text-xs font-semibold mt-4 underline" style={{ color: COLORS.onDarkMuted }}>
              Résilier l’abonnement
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4 justify-center">
          {limitKeys.map((k) => (
            <UsageMeter key={k} label={LIMIT_LABELS[k] || k} used={api.used(k)} limit={api.limitOf(k)} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.slate }}>Choisir votre formule</h2>
        <p className="text-sm" style={{ color: COLORS.slateLight }}>Paiement mensuel par Wave ou Orange Money</p>
      </div>

      <div className={`grid grid-cols-1 ${espacePlans.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"} gap-4 mb-10`}>
        {espacePlans.map((p) => {
          const isCurrent = p.id === plan.id;
          const isBase = p.id === base.id;
          let cta;
          if (isCurrent) cta = { label: "Formule actuelle", disabled: true };
          else if (isBase) cta = { label: `Revenir à ${p.nom}`, onClick: () => setConfirmDowngrade(true), secondary: true };
          else cta = { label: p.prixMensuel > plan.prixMensuel ? `Passer à ${p.nom}` : `Choisir ${p.nom}`, onClick: () => api.startPayment(p.id, "mensuel") };
          return (
            <div key={p.id} className="rounded-lg bg-surface p-6 flex flex-col relative" style={{ border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? COLORS.orange : COLORS.border}` }}>
              <div className="flex items-center justify-between mb-1 min-h-[24px]">
                <p className="font-semibold text-lg" style={{ color: COLORS.slate }}>{p.nom}</p>
                {p.recommande && !isCurrent && <PremiumChip label="Recommandé" />}
                {isCurrent && <span className="text-xs font-semibold" style={{ color: COLORS.orangeText }}>Votre formule</span>}
              </div>
              <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>{p.description}</p>
              <p className="mb-5">
                <span className="text-3xl font-semibold" style={{ color: COLORS.slate }}>{fcfa(p.prixMensuel).replace(" FCFA", "")}</span>
                <span className="text-sm ml-1" style={{ color: COLORS.slateLight }}>FCFA / mois</span>
              </p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {p.avantages.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm" style={{ color: COLORS.slate }}>
                    <Check size={15} color={isBase ? COLORS.slateLight : COLORS.success} className="mt-0.5 shrink-0" /> {a}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={cta.disabled}
                onClick={cta.onClick}
                className="w-full rounded px-4 py-2.5 text-sm font-semibold"
                style={cta.disabled ? { background: COLORS.softStrong, color: COLORS.slateLight, cursor: "default" } : cta.secondary ? { border: `1px solid ${COLORS.border}`, color: COLORS.slate } : { background: COLORS.orange, color: COLORS.onOrange }}
              >
                {cta.label}
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.slate }}>Historique des paiements</h2>
      <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
        {history.length === 0 ? (
          <div className="p-6 text-sm flex items-center gap-2" style={{ color: COLORS.slateLight }}>
            <Receipt size={16} /> Aucun paiement pour l’instant. Vos reçus apparaîtront ici après votre premier abonnement.
          </div>
        ) : (
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr style={{ color: COLORS.slateLight, borderBottom: `1px solid ${COLORS.border}` }}>
                {["Date", "Offre", "Montant", "Moyen", "Référence", "Statut", ""].map((h, i) => <th key={i} className="text-left font-semibold px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {history.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.border}`, color: COLORS.slate }}>
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">{t.offre} · {t.cycle}</td>
                  <td className="px-4 py-3 font-semibold">{fcfa(t.montant)}</td>
                  <td className="px-4 py-3">{t.moyen}</td>
                  <td className="px-4 py-3" style={{ color: COLORS.slateLight }}>{t.ref}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.statut} /></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => notify(`Reçu ${t.ref} téléchargé.`)} aria-label={`Télécharger le reçu ${t.ref}`}><Download size={16} color={COLORS.slateLight} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmDowngrade && (
        <ModalFrame onClose={() => setConfirmDowngrade(false)} labelledBy="downgrade-title">
          <div className="p-6">
            <h3 id="downgrade-title" className="text-lg font-semibold mb-2" style={{ color: COLORS.slate }}>Résilier la formule {plan.nom} ?</h3>
            <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Vous reviendrez à la formule {base.nom} et perdrez l’accès à :</p>
            <ul className="flex flex-col gap-1.5 mb-6">
              {plan.avantages.slice(0, 3).map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm" style={{ color: COLORS.slate }}><X size={14} color={COLORS.danger} className="mt-0.5 shrink-0" /> {a}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDowngrade(false)} className="rounded px-4 py-2.5 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Garder mon offre</button>
              <button type="button" onClick={() => { api.downgrade(); setConfirmDowngrade(false); }} className="rounded px-4 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Résilier</button>
            </div>
          </div>
        </ModalFrame>
      )}
    </div>
  );
}

/* ----- Écran admin « Abonnements » ----- */

function AbonnementsAdminScreen() {
  const api = usePlan();
  const [tab, setTab] = useState("abonnes");
  const [abonnes, setAbonnes] = useState(ABONNES_ADMIN_INITIAL);
  const [query, setQuery] = useState("");
  const [espaceFilter, setEspaceFilter] = useState("tous");
  const [draft, setDraft] = useState(api.plans);
  const [page, setPage] = useState(1);

  const mensuel = (a) => (a.cycle === "Annuel" ? a.montant / 12 : a.montant);
  const actifs = abonnes.filter((a) => a.statut === "Actif");
  const mrr = actifs.reduce((s, a) => s + mensuel(a), 0);
  const revenusMois = REVENUS_MOIS.map((r, i) => (i === REVENUS_MOIS.length - 1 ? { ...r, montant: mrr } : r));
  const echecs = api.transactions.filter((t) => t.statut === "Échoué").length;
  const payes = api.transactions.filter((t) => t.statut === "Payé");
  const parMoyen = PAYMENT_METHODS.map((pm) => ({ name: pm.nom, value: payes.filter((t) => t.moyen === pm.nom).reduce((s, t) => s + t.montant, 0), color: pm.couleur })).filter((x) => x.value > 0);

  const filteredAbonnes = abonnes.filter((a) => a.nom.toLowerCase().includes(query.toLowerCase()) && (espaceFilter === "tous" || a.espace === espaceFilter));
  const filteredTx = api.transactions.filter((t) => (t.client + t.ref).toLowerCase().includes(query.toLowerCase()) && (espaceFilter === "tous" || t.espace === espaceFilter));
  const list = tab === "abonnes" ? filteredAbonnes : filteredTx;
  const paged = list.slice((page - 1) * 8, page * 8);

  function setPlanField(espace, planId, field, value) {
    setDraft((d) => ({ ...d, [espace]: d[espace].map((p) => (p.id !== planId ? p : field === "prix" ? { ...p, prixMensuel: value } : { ...p, limits: { ...p.limits, [field]: value } })) }));
  }
  const dirty = JSON.stringify(draft, (k, v) => (v === Infinity ? "inf" : v)) !== JSON.stringify(api.plans, (k, v) => (v === Infinity ? "inf" : v));

  const tabs = [{ id: "abonnes", label: "Abonnés" }, { id: "transactions", label: "Transactions" }, { id: "tarifs", label: "Formules et tarifs" }];

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Suivez les revenus, gérez les abonnés et ajustez les formules de chaque espace.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CreditCard} value={fcfa(mrr)} label="Revenu mensuel récurrent" />
        <StatCard icon={Crown} value={actifs.length} label="Abonnés payants actifs" />
        <StatCard icon={Sparkles} value="6,8 %" label="Passage Essentiel → Premium" />
        <StatCard icon={AlertCircle} value={echecs} label="Paiements échoués" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4 mb-8">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Revenus des abonnements (6 derniers mois)</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenusMois}>
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: COLORS.slateLight }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.slateLight }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString("fr-FR")} width={60} />
                <Tooltip formatter={(v) => fcfa(v)} cursor={{ fill: COLORS.soft }} />
                <Bar dataKey="montant" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Encaissements par moyen de paiement</h3>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={parMoyen} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={2}>
                  {parMoyen.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => fcfa(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1.5 mt-3">
            {parMoyen.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2" style={{ color: COLORS.slate }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} /> {e.name}</span>
                <span style={{ color: COLORS.slateLight }}>{fcfa(e.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <App.Onglets label="Sections des abonnements" onglets={tabs} actif={tab} onChange={(t) => { setTab(t); setPage(1); }} />
      </div>

      {tab !== "tarifs" && (
        <>
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-base bg-surface p-4 lg:flex-row lg:items-center">
            <App.ChampRecherche
              variante="carre"
              valeur={query}
              onChange={(v) => { setQuery(v); setPage(1); }}
              placeholder={tab === "abonnes" ? "Rechercher un abonné…" : "Rechercher un client ou une référence…"}
              label={tab === "abonnes" ? "Rechercher un abonné" : "Rechercher une transaction"}
              className="w-full lg:flex-1"
            />
            <App.SelecteurPeriode
              icone={Layers}
              label="Filtrer par espace"
              valeur={espaceFilter}
              onChange={(v) => { setEspaceFilter(v); setPage(1); }}
              options={[
                { id: "tous", label: "Tous les espaces" },
                { id: "chercheur", label: "Chercheurs d’emploi" },
                { id: "prestataire", label: "Prestataires" },
                { id: "entreprise", label: "Entreprises" },
              ]}
            />
            <ExportAdmin
              className="lg:ml-auto"
              titre={tab === "abonnes" ? "Abonnés" : "Transactions"}
              lignes={list}
              filtres={[...(espaceFilter !== "tous" ? [ESPACE_LABELS[espaceFilter]] : []), ...(query.trim() ? [`recherche « ${query.trim()} »`] : [])]}
              colonnes={tab === "abonnes"
                ? [
                    { titre: "Abonné", valeur: (a) => a.nom },
                    { titre: "Espace", valeur: (a) => ESPACE_LABELS[a.espace] },
                    { titre: "Offre", valeur: (a) => a.offre },
                    { titre: "Cycle", valeur: (a) => a.cycle },
                    { titre: "Montant (FCFA)", valeur: (a) => a.montant },
                    { titre: "Abonné depuis", valeur: (a) => a.depuis },
                    { titre: "Prochain paiement", valeur: (a) => a.prochain },
                    { titre: "Statut", valeur: (a) => a.statut },
                  ]
                : [
                    { titre: "Date", valeur: (t) => t.date },
                    { titre: "Référence", valeur: (t) => t.ref },
                    { titre: "Client", valeur: (t) => t.client },
                    { titre: "Espace", valeur: (t) => ESPACE_LABELS[t.espace] },
                    { titre: "Offre", valeur: (t) => t.offre },
                    { titre: "Cycle", valeur: (t) => t.cycle },
                    { titre: "Montant (FCFA)", valeur: (t) => t.montant },
                    { titre: "Moyen", valeur: (t) => t.moyen },
                    { titre: "Statut", valeur: (t) => t.statut },
                  ]}
            />
          </div>

          <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr style={{ color: COLORS.slateLight, borderBottom: `1px solid ${COLORS.border}` }}>
                  {(tab === "abonnes" ? ["Abonné", "Offre", "Montant", "Abonné depuis", "Prochain paiement", "Statut", ""] : ["Date", "Client", "Offre", "Montant", "Moyen", "Statut", ""]).map((h, i) => <th key={i} className="text-left font-semibold px-4 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tab === "abonnes" && paged.map((a) => (
                  <tr key={a.id} style={{ borderBottom: `1px solid ${COLORS.border}`, color: COLORS.slate }}>
                    <td className="px-4 py-3"><p className="font-semibold">{a.nom}</p><p className="text-xs" style={{ color: COLORS.slateLight }}>{ESPACE_LABELS[a.espace]}</p></td>
                    <td className="px-4 py-3">{a.offre} · {a.cycle}</td>
                    <td className="px-4 py-3 font-semibold">{fcfa(a.montant)}</td>
                    <td className="px-4 py-3">{a.depuis}</td>
                    <td className="px-4 py-3">{a.prochain}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.statut} /></td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {a.statut === "Échec de paiement" && <button type="button" onClick={() => notify(`Relance de paiement envoyée à ${a.nom}.`)} className="text-xs font-semibold mr-3" style={{ color: COLORS.orangeText }}>Relancer</button>}
                      <button type="button" onClick={() => { setAbonnes((l) => l.map((x) => (x.id === a.id ? { ...x, statut: x.statut === "Suspendu" ? "Actif" : "Suspendu" } : x))); notify(a.statut === "Suspendu" ? `Abonnement de ${a.nom} réactivé.` : `Abonnement de ${a.nom} suspendu.`, "info"); }} className="text-xs font-semibold" style={{ color: a.statut === "Suspendu" ? COLORS.success : COLORS.danger }}>
                        {a.statut === "Suspendu" ? "Réactiver" : "Suspendre"}
                      </button>
                    </td>
                  </tr>
                ))}
                {tab === "transactions" && paged.map((t) => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.border}`, color: COLORS.slate }}>
                    <td className="px-4 py-3"><p>{t.date}</p><p className="text-xs" style={{ color: COLORS.slateLight }}>{t.ref}</p></td>
                    <td className="px-4 py-3"><p className="font-semibold">{t.client}</p><p className="text-xs" style={{ color: COLORS.slateLight }}>{ESPACE_LABELS[t.espace]}</p></td>
                    <td className="px-4 py-3">{t.offre} · {t.cycle}</td>
                    <td className="px-4 py-3 font-semibold">{fcfa(t.montant)}</td>
                    <td className="px-4 py-3">{t.moyen}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.statut} /></td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {t.statut === "Payé" && <button type="button" onClick={() => { api.setTransactions((l) => l.map((x) => (x.id === t.id ? { ...x, statut: "Remboursé" } : x))); notify(`Transaction ${t.ref} remboursée.`, "info"); }} className="text-xs font-semibold" style={{ color: COLORS.danger }}>Rembourser</button>}
                      {t.statut === "Échoué" && <button type="button" onClick={() => notify(`Relance de paiement envoyée à ${t.client}.`)} className="text-xs font-semibold" style={{ color: COLORS.orangeText }}>Relancer</button>}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-sm" style={{ color: COLORS.slateLight }}>Aucun résultat pour ces critères.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={8} totalItems={list.length} onPageChange={setPage} />
        </>
      )}

      {tab === "tarifs" && (
        <div>
          <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Les prix et quotas modifiés ici s’appliquent immédiatement aux écrans « Abonnement » de chaque espace.</p>
          <div className="flex flex-col gap-4">
            {Object.keys(draft).map((esp) => (
              <div key={esp} className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
                <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>{ESPACE_LABELS[esp]}</h3>
                <div className={`grid grid-cols-1 ${draft[esp].length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-3`}>
                  {draft[esp].map((p) => {
                    const limitKey = Object.keys(p.limits)[0];
                    const lim = p.limits[limitKey];
                    return (
                      <div key={p.id} className="rounded-md p-4" style={{ background: COLORS.soft }}>
                        <p className="font-semibold mb-3" style={{ color: COLORS.slate }}>{p.nom}</p>
                        <label className={AUTH.libelle} htmlFor={`prix-${esp}-${p.id}`}>Prix mensuel (FCFA)</label>
                        <input id={`prix-${esp}-${p.id}`} type="number" min={0} step={500} value={p.prixMensuel} onChange={(e) => setPlanField(esp, p.id, "prix", Math.max(0, Number(e.target.value) || 0))} className={`${FORM.champ()} mb-4`} />
                        <label className={AUTH.libelle} htmlFor={`lim-${esp}-${p.id}`}>{LIMIT_LABELS[limitKey]}</label>
                        <div className="flex items-center gap-3">
                          <input id={`lim-${esp}-${p.id}`} type="number" min={1} disabled={lim === UNLIMITED} value={lim === UNLIMITED ? "" : lim} placeholder="Illimité" onChange={(e) => setPlanField(esp, p.id, limitKey, Math.max(1, Number(e.target.value) || 1))} className={`${FORM.champ()} min-w-0 flex-1 disabled:bg-doux disabled:text-discret`} />
                          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-principal">
                            <input type="checkbox" checked={lim === UNLIMITED} onChange={(e) => setPlanField(esp, p.id, limitKey, e.target.checked ? UNLIMITED : 5)} className={AUTH.case} /> Illimité
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button type="button" disabled={!dirty} onClick={() => setDraft(api.plans)} className="rounded px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate, opacity: dirty ? 1 : 0.5 }}>Annuler les modifications</button>
            <button type="button" disabled={!dirty} onClick={() => { api.setPlans(draft); notify("Tarifs et quotas enregistrés."); }} className="rounded px-5 py-2.5 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange, opacity: dirty ? 1 : 0.5 }}>Enregistrer les tarifs</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   PROFILS ESSENTIEL / PREMIUM
   ===================================================================== */

const PROFILE_TIER_PERKS = {
  chercheur: [
    ["Visibilité auprès des recruteurs", "Standard", "En tête des résultats"],
    ["Badge sur le profil", "—", "Badge Premium"],
    ["Candidatures", "5 par mois", "Illimitées"],
    ["Qui a consulté votre profil", "—", "Visible"],
    ["Mentorat collectif", "—", "Inclus"],
  ],
  prestataire: [
    ["Position dans les recherches", "Standard", "Prioritaire"],
    ["Badge sur le profil", "—", "Badge Premium"],
    ["Services publiés", "10", "Illimités"],
    ["Aide à la régularisation", "Guide en ligne", "Conseiller dédié"],
  ],
  entreprise: [
    ["Page employeur", "Standard", "Mise en avant"],
    ["Badge sur les offres", "—", "Recruteur Premium"],
    ["Nouvelles offres", "1 par mois", "Illimitées"],
    ["Coordonnées et CV des candidats", "Masqués", "Visibles"],
    ["Offres sponsorisées", "—", "Incluses"],
  ],
};

const PROFILE_VIEWERS = [
  { nom: "Sonatel", quand: "Aujourd’hui" },
  { nom: "Teranga Capital", quand: "Hier" },
  { nom: "Wave Mobile", quand: "Il y a 3 jours" },
];

function isPremiumPlan(plan) {
  return !!plan && plan.id !== "essentiel";
}

function TierBadge({ premium, label, size = "md" }) {
  const cls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1";
  return premium ? (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.darkSoft, color: COLORS.brandPale }}>
      <Crown size={size === "sm" ? 10 : 12} color={COLORS.orange} /> {label || "Premium"}
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.softStrong, color: COLORS.slateLight }}>
      {label || "Essentiel"}
    </span>
  );
}

function ProfileTierBadge() {
  const api = usePlan();
  if (!api || api.isAdmin) return null;
  return <TierBadge premium={isPremiumPlan(api.plan)} label={api.plan.nom} />;
}

function ProfileTierCard() {
  const api = usePlan();
  if (!api || api.isAdmin) return null;
  const premium = isPremiumPlan(api.plan);
  const premiumPlan = api.espacePlans.find((p) => isPremiumPlan(p));
  const rows = api.espacePlans.length > 1 ? PROFILE_TIER_PERKS[api.espace] || [] : [];

  return (
    <div className="rounded-lg bg-surface mb-4 overflow-hidden" style={{ border: `1px solid ${premium ? COLORS.orange : COLORS.border}` }}>
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ background: premium ? COLORS.dark : COLORS.soft }}>
        <div>
          <p className="font-semibold" style={{ color: premium ? COLORS.onDark : COLORS.slate }}>
            {`Votre formule : ${api.plan.nom}`}
          </p>
          <p className="text-sm" style={{ color: premium ? COLORS.onDarkMuted : COLORS.slateLight }}>
            {premium ? `Actif jusqu’au ${api.sub.prochain || "prochain renouvellement"}.` : "Passez à la formule Premium pour être vu en priorité."}
          </p>
        </div>
        {!premium && premiumPlan && (
          <button type="button" onClick={() => api.startPayment(premiumPlan.id, "mensuel")} className="rounded px-4 py-2 text-sm font-semibold text-sur-marque inline-flex items-center gap-1.5" style={{ background: COLORS.orange }}>
            <Crown size={14} /> Passer à la formule Premium · {fcfa(premiumPlan.prixMensuel)}/mois
          </button>
        )}
      </div>

      {premium && api.espace === "chercheur" && (
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-x-8 gap-y-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <p className="text-2xl font-semibold" style={{ color: COLORS.slate }}>48</p>
            <p className="text-xs" style={{ color: COLORS.slateLight }}>vues cette semaine, +35 %</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.slateLight }}>Recruteurs qui ont consulté votre profil</p>
            <div className="flex flex-wrap gap-2">
              {PROFILE_VIEWERS.map((v) => (
                <span key={v.nom} className="text-xs rounded-full px-2.5 py-1" style={{ background: COLORS.orangeSoft, color: COLORS.slate }}>{v.nom} · {v.quand}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      {premium && api.espace !== "chercheur" && (
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <TrendingUp size={18} color={COLORS.success} />
          <p className="text-sm" style={{ color: COLORS.slate }}>
            {api.espace === "prestataire" ? "Votre profil s’affiche en priorité : 3,2 fois plus de vues que le mois dernier." : "Vos offres peuvent être sponsorisées et remonter en tête des résultats."}
          </p>
        </div>
      )}

      {rows.length > 0 && (
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr style={{ color: COLORS.slateLight }}>
              <th className="text-left font-semibold px-6 py-3">Ce qui change sur votre profil</th>
              <th className="text-left font-semibold px-4 py-3" style={{ background: !premium ? COLORS.orangeSoft : "transparent", color: !premium ? COLORS.slate : COLORS.slateLight }}>Essentiel</th>
              <th className="text-left font-semibold px-4 py-3" style={{ background: premium ? COLORS.orangeSoft : "transparent", color: premium ? COLORS.slate : COLORS.slateLight }}>Premium</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, ess, prem]) => (
              <tr key={label} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td className="px-6 py-2.5" style={{ color: COLORS.slate }}>{label}</td>
                <td className="px-4 py-2.5" style={{ color: COLORS.slateLight, background: !premium ? COLORS.orangeSubtle : "transparent" }}>{ess}</td>
                <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.slate, background: premium ? COLORS.orangeSubtle : "transparent" }}>{prem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

/* Niveaux affichés pour les autres utilisateurs (vus par les entreprises et l’admin) */
const PREMIUM_CANDIDATS = new Set(["c1", "c3", "c8"]);
const PREMIUM_PRESTATAIRES = new Set(["p1", "p3", "p5"]);
const PRESTATAIRES_REGULARISES = new Set(["p1", "p3", "p4", "p5"]);

function adminTier(nom, espace) {
  const abonnement = ABONNES_ADMIN_INITIAL.find((a) => a.nom === nom && a.espace === espace && a.statut !== "Suspendu");
  // Les entreprises ont une formule unique (Entreprise) : abonnée ou sans formule.
  if (espace === "entreprise") return abonnement ? "Entreprise" : "Sans formule";
  return abonnement?.offre === "Premium" ? "Premium" : "Essentiel";
}

function premiumFirst(isPremium) {
  return (a, b) => (isPremium(b) ? 1 : 0) - (isPremium(a) ? 1 : 0);
}

/* =====================================================================
   MENTORS : expérience, coachings à venir, historique des coachings
   ===================================================================== */

const MENTOR_EMPLOYEURS = ["Sonatel", "Ecobank Sénégal", "Senelec", "Port Autonome de Dakar", "Teranga Capital", "Wave Mobile", "Kirène", "Orange Digital Center", "Eiffage Sénégal", "Chambre de métiers de Dakar", "CNEAP", "Atelier indépendant"];

function hashStr(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function mentorProfile(m) {
  const h = hashStr(m.id);
  const emp = (k) => MENTOR_EMPLOYEURS[(h + k) % MENTOR_EMPLOYEURS.length];
  const debut = 2026 - m.exp;
  const pivot = 2026 - Math.max(2, Math.round(m.exp / 3));
  const milieu = Math.round((debut + pivot) / 2);
  const ancien = (m.stats && parseInt(m.stats.anciennete, 10)) || 1 + (h % 3);
  return {
    bio: m.tagline || `${m.role} avec ${m.exp} ans d’expérience. ${m.nom.split(" ")[0]} accompagne les professionnels qui veulent progresser dans son domaine.`,
    langues: ["Français", "Wolof", ...(h % 2 ? ["Anglais"] : [])],
    formats: ["Visio", "Téléphone", ...(h % 3 === 0 ? [] : ["Au bureau de Dakar"])],
    stats: m.stats || { mentores: 6 + (h % 20), note: `${noteFr(4.3 + (h % 7) / 10)}/5`, anciennete: `${ancien} an${ancien > 1 ? "s" : ""}`, heures: 20 + (h % 90) },
    parcours: [
      { poste: m.role, structure: emp(0), periode: `${pivot} – aujourd’hui`, description: "Pilote une équipe et forme les nouvelles recrues sur le terrain." },
      { poste: "Mentor bénévole", structure: "LIGGEEY", periode: `${2026 - ancien} – aujourd’hui`, description: "Accompagnement individuel de jeunes professionnels et de personnes en reconversion." },
      { poste: "Postes à responsabilité", structure: emp(4), periode: `${milieu} – ${pivot}`, description: "Gestion de projets et encadrement d’équipes de terrain." },
      { poste: "Débuts professionnels", structure: emp(7), periode: `${debut} – ${milieu}`, description: "Premières expériences et apprentissage du métier." },
    ],
    themes: m.competences ? m.competences.slice(0, 6) : ["Orientation professionnelle", "Développement des compétences", "Préparation d’entretien", "Gestion de carrière"],
  };
}

function defaultCoachings(m) {
  if (!m.historique) return { upcoming: [], history: [] };
  const history = m.historique.map((x, i) => {
    const hasColon = x.note.includes(":");
    const theme = hasColon ? x.note.split(":")[0].trim() : x.note.split(" ").slice(0, 2).join(" ");
    return { id: `h${i}`, date: x.date, theme, compteRendu: hasColon ? x.note.split(":").slice(1).join(":").trim() : x.note, duree: "1 h", format: i === m.historique.length - 1 ? "Présentiel" : "Visio", note: i === 0 ? null : 5 };
  });
  const upcoming = [{ id: "u1", date: nextSlots(4)[3], theme: "Point de suivi mensuel", format: "Visio" }];
  return { upcoming, history };
}

function nextSlots(n = 6) {
  const out = [];
  const d = demoNow();
  d.setHours(0, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    for (const hr of [10, 16]) {
      if (out.length < n) {
        const label = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).replace(/ 1 /, " 1er ");
        out.push(`${label.charAt(0).toUpperCase() + label.slice(1)} · ${hr} h – ${hr + 1} h`);
      }
    }
  }
  return out;
}

function BookingPanel({ profile, title, submitLabel, onConfirm, onCancel }) {
  const slots = React.useMemo(() => nextSlots(6), []);
  const f = useFormulaire({ slot: null, theme: profile.themes[0], format: profile.formats[0], message: "" }, (v) => ({
    slot: !v.slot && "Choisissez un créneau.",
  }));
  const { v, set, err, attrs } = f;
  return (
    <form
      onSubmit={f.soumettre((val) => onConfirm({ date: val.slot, theme: val.theme, format: val.format, message: val.message }))}
      noValidate
      className="mb-4 rounded-lg border border-marque bg-surface p-5"
    >
      <h4 className="mb-4 font-semibold text-principal">{title}</h4>
      <fieldset className="mb-5" aria-describedby={err("slot") ? "booking-slot-aide" : undefined}>
        <legend className={AUTH.libelle}>Créneaux disponibles <span aria-hidden="true" className="text-marque">*</span></legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("slot", s)}
              aria-pressed={v.slot === s}
              className={`flex min-h-[48px] items-center gap-2 rounded-md border px-3.5 text-left text-[15px] text-principal transition-colors ${v.slot === s ? "border-marque bg-marque-doux font-medium" : "border-base bg-surface hover:border-forte"}`}
            >
              <Clock size={15} className={v.slot === s ? "text-marque" : "text-discret"} aria-hidden="true" />
              {s}
            </button>
          ))}
        </div>
        {err("slot") && <p id="booking-slot-aide" className={AUTH.aide(true)}>{err("slot")}</p>}
      </fieldset>
      <div className={`${FORM.grille} mb-5`}>
        <Champ id="booking-theme" label="Sujet de la séance">
          <ListeChamp {...attrs("booking-theme", "theme")}>
            {profile.themes.map((t) => <option key={t}>{t}</option>)}
          </ListeChamp>
        </Champ>
        <Champ id="booking-format" label="Format">
          <ListeChamp {...attrs("booking-format", "format")}>
            {profile.formats.map((fo) => <option key={fo}>{fo}</option>)}
          </ListeChamp>
        </Champ>
        <Champ id="booking-message" label="Message au mentor (facultatif)" large>
          <textarea {...attrs("booking-message", "message")} rows={3} placeholder="Ce que vous aimeriez travailler pendant la séance…" className={FORM.zone()} />
        </Champ>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
        <App.Bouton type="submit">{submitLabel}</App.Bouton>
      </div>
    </form>
  );
}

function MentorDetail({ mentor, coachings, onUpdate, onBack }) {
  const planApi = usePlan();
  const profile = React.useMemo(() => mentorProfile(mentor), [mentor]);
  const [tab, setTab] = useState(coachings.upcoming.length ? "avenir" : "profil");
  const [booking, setBooking] = useState(null); // null | { mode: "new" } | { mode: "move", id }
  const [toCancel, setToCancel] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const prenom = mentor.nom.split(" ")[0];
  const locked = planApi && !planApi.can("mentorat");

  function openBooking() {
    const go = () => { setTab("avenir"); setBooking({ mode: "new" }); };
    if (planApi) planApi.gate("mentorat", go); else go();
  }
  function confirmBooking(v) {
    if (booking.mode === "move") {
      onUpdate((c) => ({ ...c, upcoming: c.upcoming.map((u) => (u.id === booking.id ? { ...u, date: v.date } : u)) }));
      notify(`Séance reprogrammée : ${v.date}.`);
    } else {
      onUpdate((c) => ({ ...c, upcoming: [...c.upcoming, { id: `u${Date.now()}`, date: v.date, theme: v.theme, format: v.format }] }));
      notify(`Demande de coaching envoyée à ${mentor.nom}.`);
    }
    setBooking(null);
  }
  function rate(id, n) {
    onUpdate((c) => ({ ...c, history: c.history.map((h) => (h.id === id ? { ...h, note: n } : h)) }));
    notify("Merci pour votre évaluation.");
  }

  const tabs = [
    { id: "profil", label: "Profil et expérience" },
    { id: "avenir", label: `Coachings à venir (${coachings.upcoming.length})` },
    { id: "historique", label: `Historique (${coachings.history.length})` },
    { id: "documents", label: "Documents et notes" },
  ];

  const themes = mentor.competences || profile.themes;

  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux mentors</BoutonRetour>

      <EnTeteFiche
        visuel={<SafeImg src={mentor.photo} alt={mentor.nom} className="h-16 w-16 shrink-0 rounded-full object-cover" />}
        badges={<>
          <App.Badge ton="succes" taille="moyen"><BadgeCheck size={13} aria-hidden="true" /> Mentor vérifié</App.Badge>
          {mentor.historique && <App.Badge ton="marque" point taille="moyen">Votre mentor</App.Badge>}
        </>}
        titre={mentor.nom}
        sousTitre={`${mentor.role} · ${mentor.exp} ans d’expérience`}
        meta={<>
          <MetaOffre icone={Star}>{profile.stats.note}</MetaOffre>
          <MetaOffre icone={UsersRound}>{profile.stats.mentores} mentorés</MetaOffre>
          <MetaOffre icone={Clock}>{profile.stats.heures} h de mentorat</MetaOffre>
        </>}
        actions={
          <App.Bouton onClick={openBooking}>
            {locked ? <Lock size={16} aria-hidden="true" /> : <Calendar size={16} aria-hidden="true" />} Réserver un coaching
          </App.Bouton>
        }
      />

      <MiseEnPageFiche
        cote={<>
          <ApercuFiche
            titre="Aperçu du mentor"
            items={[
              { icone: Briefcase, libelle: "Expérience", valeur: `${mentor.exp} ans · ${mentor.role}` },
              { icone: MessageCircle, libelle: "Langues", valeur: profile.langues.join(", ") },
              { icone: Video, libelle: "Formats des séances", valeur: profile.formats.join(", ") },
              { icone: UsersRound, libelle: "Mentorés accompagnés", valeur: profile.stats.mentores },
              { icone: Star, libelle: "Note de satisfaction", valeur: profile.stats.note },
              { icone: CalendarDays, libelle: "Sur LIGGEEY depuis", valeur: profile.stats.anciennete },
            ]}
          />
          <App.Carte titre="Domaines d’accompagnement">
            <Etiquettes items={themes} />
          </App.Carte>
        </>}
        principal={<>
      <App.Onglets onglets={tabs} actif={tab} onChange={setTab} label="Sections du profil du mentor" />

      {tab === "profil" && (
        <div className="space-y-6">
          <App.Carte titre="À propos">
            <p className="text-[15px] leading-[1.7] text-secondaire">{profile.bio}</p>
          </App.Carte>
          <App.Carte titre="Parcours professionnel">
            <ol className="relative">
              {profile.parcours.map((p, i) => (
                <li key={i} className="flex gap-3 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-marque" : "bg-doux-fort"}`} />
                    {i < profile.parcours.length - 1 && <div className="mt-1 w-px flex-1 bg-doux-fort" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-principal">{p.poste} · {p.structure}</p>
                    <p className="mb-1 text-xs text-discret">{p.periode}</p>
                    <p className="text-sm text-secondaire">{p.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </App.Carte>
        </div>
      )}

      {tab === "avenir" && (
        <div>
          {booking && (
            <BookingPanel
              profile={profile}
              title={booking.mode === "move" ? "Choisir un nouveau créneau" : `Réserver un coaching avec ${prenom}`}
              submitLabel={booking.mode === "move" ? "Reprogrammer" : "Envoyer la demande"}
              onConfirm={confirmBooking}
              onCancel={() => setBooking(null)}
            />
          )}
          {coachings.upcoming.length === 0 && !booking && (
            <div className="rounded-lg border bg-surface p-6 text-center" style={{ borderColor: COLORS.border }}>
              <p className="text-sm mb-3" style={{ color: COLORS.slateLight }}>Aucun coaching prévu avec {prenom}. Réservez un créneau pour commencer.</p>
              <button type="button" onClick={openBooking} className="rounded px-4 py-2 text-sm font-semibold text-sur-marque inline-flex items-center gap-1.5" style={{ background: COLORS.orange }}>
                {locked && <Lock size={13} />} Réserver un coaching
              </button>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {coachings.upcoming.map((u) => (
              <div key={u.id} className="rounded-lg border bg-surface p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0" style={{ background: COLORS.orangeSoft }}>
                    {u.format === "Visio" ? <Video size={17} color={COLORS.orange} /> : u.format === "Téléphone" ? <Phone size={17} color={COLORS.orange} /> : <MapPin size={17} color={COLORS.orange} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{u.date}</p>
                    <p className="text-sm" style={{ color: COLORS.slateLight }}>{u.theme} · {u.format}</p>
                  </div>
                </div>
                {toCancel === u.id ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm" style={{ color: COLORS.slate }}>Annuler cette séance ?</span>
                    <button type="button" onClick={() => { onUpdate((c) => ({ ...c, upcoming: c.upcoming.filter((x) => x.id !== u.id) })); setToCancel(null); notify("Séance annulée. Le mentor a été prévenu.", "info"); }} className="rounded px-3 py-1.5 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Oui, annuler</button>
                    <button type="button" onClick={() => setToCancel(null)} className="rounded px-3 py-1.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Non</button>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {u.format !== "Au bureau de Dakar" && (
                      <button type="button" onClick={() => notify(`Connexion à la séance avec ${mentor.nom}…`)} className="rounded px-4 py-2 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Rejoindre</button>
                    )}
                    <button type="button" onClick={() => setBooking({ mode: "move", id: u.id })} className="rounded px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Reprogrammer</button>
                    <button type="button" onClick={() => setToCancel(u.id)} className="rounded px-4 py-2 text-sm font-semibold" style={{ color: COLORS.danger }}>Annuler</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "historique" && (
        <div className="flex flex-col gap-3">
          {coachings.history.length === 0 && (
            <div className="rounded-lg border bg-surface p-6 text-sm" style={{ borderColor: COLORS.border, color: COLORS.slateLight }}>
              Vous n’avez pas encore eu de séance avec {prenom}. Les comptes rendus apparaîtront ici après chaque coaching.
            </div>
          )}
          {coachings.history.map((h) => (
            <div key={h.id} className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{h.theme}</p>
                  <p className="text-xs" style={{ color: COLORS.slateLight }}>{h.date} · {h.duree} · {h.format}</p>
                </div>
                {h.note ? (
                  <Stars note={h.note} />
                ) : (
                  <div className="flex items-center gap-1" aria-label="Noter cette séance">
                    <span className="text-xs mr-1" style={{ color: COLORS.slateLight }}>Noter :</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => rate(h.id, n)} aria-label={`${n} sur 5`}><Star size={15} color={COLORS.orange} /></button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: COLORS.slateLight }}>Compte rendu du mentor</p>
              <p className="text-sm" style={{ color: COLORS.slate }}>{h.compteRendu}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "documents" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Documents partagés</h3>
            {mentor.documents ? (
              <div className="flex flex-col divide-y">
                {mentor.documents.map((d) => (
                  <div key={d.nom} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} color={COLORS.slateLight} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: COLORS.slate }}>{d.nom}</p>
                        <p className="text-xs" style={{ color: COLORS.slateLight }}>{d.meta}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => notify(`${d.nom} téléchargé.`)} aria-label={`Télécharger ${d.nom}`}><Download size={16} color={COLORS.slateLight} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{prenom} partagera ses documents après votre première séance.</p>
            )}
          </div>
          <App.Carte titre="Mes notes personnelles" sousTitre="Visibles par vous seul.">
            <label htmlFor="notes-mentor" className="sr-only">Mes notes personnelles</label>
            <textarea id="notes-mentor" value={note} onChange={(e) => { setNote(e.target.value); setSaved(false); }} placeholder="Ajoutez vos notes ici…" rows={4} className={`${FORM.zone()} mb-4`} />
            <div className="flex flex-wrap items-center gap-3">
              <App.Bouton onClick={() => setSaved(true)}>Enregistrer</App.Bouton>
              {saved && <span role="status" className="inline-flex items-center gap-1.5 text-sm text-statut-succes"><CheckCircle2 size={16} aria-hidden="true" /> Note enregistrée.</span>}
            </div>
          </App.Carte>
        </div>
      )}
        </>}
      />
    </div>
  );
}

/* =====================================================================
   SUIVI POST-EMBAUCHE
   ===================================================================== */

const JOUR_MS = 86400000;
function isoFromOffset(n) {
  const d = demoNow();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function jalonDate(iso, jours) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + jours);
  return d;
}
function frLongDate(d) {
  return dateFr(d);
}
function joursDepuis(iso) {
  return Math.max(0, Math.floor((DEMO_TODAY.getTime() - new Date(`${iso}T00:00:00`).getTime()) / JOUR_MS));
}

const JALONS = [
  { id: "j7", jour: 7, label: "Point de la première semaine" },
  { id: "j30", jour: 30, label: "Bilan du premier mois" },
  { id: "j60", jour: 60, label: "Point à mi-parcours" },
  { id: "j90", jour: 90, label: "Fin de la période d’essai" },
];
const DUREE_ESSAI = 90;

function jalonStatut(iso, jalon, done) {
  if (done) return "Fait";
  return jalonDate(iso, jalon.jour) <= demoNow() ? "À compléter" : "À venir";
}

const EMBAUCHE_CHERCHEUR = {
  poste: "Chargée de clientèle",
  entreprise: "Sonatel",
  ville: "Dakar",
  contrat: "CDI",
  dateIso: isoFromOffset(-43),
  manager: "Ndèye Fall, responsable du service client",
  referent: { nom: "Khadija Sy", role: "Conseillère insertion LIGGEEY", telephone: "+221 77 500 12 34" },
};

const OBJECTIFS_INTEGRATION = [
  { id: "o1", label: "Signer le contrat et remettre les documents administratifs" },
  { id: "o2", label: "Suivre la formation d’accueil sur les outils clients" },
  { id: "o3", label: "Traiter ses premiers dossiers en autonomie" },
  { id: "o4", label: "Faire un point objectifs avec son manager" },
  { id: "o5", label: "Valider la période d’essai" },
];

const CHECKIN_QUESTIONS = [
  { id: "missions", label: "Vos missions correspondent-elles à l’offre ?" },
  { id: "formation", label: "Avez-vous été formé(e) ou accompagné(e) à votre arrivée ?" },
  { id: "salaire", label: "Votre salaire est-il versé à temps ?" },
  { id: "integration", label: "Vous sentez-vous bien intégré(e) dans l’équipe ?" },
];
const HUMEURS = ["Très difficile", "Difficile", "Correct", "Bien", "Très bien"];
const TYPES_SIGNALEMENT = ["Retard ou absence de salaire", "Missions différentes de l’offre", "Conditions de travail", "Conflit avec la hiérarchie ou l’équipe", "Contrat non remis", "Autre"];

const SUIVI_CHERCHEUR_INITIAL = {
  reponses: {
    j7: { humeur: 4, reponses: { missions: "Oui", formation: "Oui", salaire: "Oui", integration: "Oui" }, commentaire: "Très bon accueil de l’équipe. Beaucoup à apprendre sur les outils internes." },
  },
  objectifs: { o1: true, o2: true },
};

const SIGNALEMENTS_INITIAL = [
  { id: "s1", date: "9 octobre 2026", auteur: "Modou Faye", espace: "chercheur", concerne: "Dakar Bâtiment · Aide-maçon", type: "Retard ou absence de salaire", description: "Le salaire de septembre n’a toujours pas été versé.", statut: "Ouvert" },
  { id: "s2", date: "2 octobre 2026", auteur: "Thiès Électrique", espace: "entreprise", concerne: "Alioune Ndiaye · Électricien", type: "Absences répétées", description: "Trois absences non justifiées depuis la prise de poste.", statut: "Traité" },
];

const RECRUES_INITIAL = [
  { id: "r1", nom: "Ibrahima Diallo", poste: "Soudeur TIG/MIG", contrat: "CDD 12 mois", dateIso: isoFromOffset(-57), statut: "En période d’essai", ressenti: 4, evaluations: { j7: { competences: 4, integration: 4, ponctualite: 5, commentaire: "Bonne prise en main des postes de soudure." }, j30: { competences: 4, integration: 4, ponctualite: 4, commentaire: "Autonome sur les travaux courants." } } },
  { id: "r2", nom: "Aissatou Gueye", poste: "Chef d’équipe électricité", contrat: "CDI", dateIso: isoFromOffset(-35), statut: "À risque", ressenti: 2, evaluations: { j7: { competences: 5, integration: 2, ponctualite: 4, commentaire: "A du mal à s’imposer auprès de l’équipe déjà en place." } } },
  { id: "r3", nom: "Khadim Sarr", poste: "Maçon coffreur", contrat: "CDI", dateIso: isoFromOffset(-150), statut: "Confirmé", ressenti: 5, evaluations: { j7: { competences: 4, integration: 5, ponctualite: 5, commentaire: "Très bon départ." }, j30: { competences: 4, integration: 5, ponctualite: 5, commentaire: "Fiable." }, j60: { competences: 5, integration: 5, ponctualite: 5, commentaire: "Prend des initiatives." }, j90: { competences: 5, integration: 5, ponctualite: 5, commentaire: "Embauche confirmée." } } },
];

const PLACEMENTS_AUTRES = [
  { id: "pl1", nom: "Moussa Diop", entreprise: "Senelec", poste: "Technicien réseau", jour: 120, statut: "Confirmé" },
  { id: "pl2", nom: "Modou Faye", entreprise: "Dakar Bâtiment", poste: "Aide-maçon", jour: 38, statut: "À risque" },
  { id: "pl3", nom: "Awa Ndiaye", entreprise: "Teranga Capital", poste: "Assistante comptable", jour: 74, statut: "En période d’essai" },
];

function ProgressBar({ pct, color = COLORS.orange, track = COLORS.softStrong }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: track }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

function RatingInput({ label, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1">
      <span className="text-sm font-medium text-principal">{label}</span>
      <div className="flex" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} sur 5`} onClick={() => onChange(n)} className="grid h-11 w-11 place-items-center rounded-md hover:bg-doux">
            <Star size={20} className="text-primaire-500" fill={n <= value ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckinForm({ jalon, onSubmit, onCancel }) {
  const [humeur, setHumeur] = useState(0);
  const [rep, setRep] = useState({});
  const [commentaire, setCommentaire] = useState("");
  const [essai, setEssai] = useState(false);
  const complete = humeur > 0 && CHECKIN_QUESTIONS.every((q) => rep[q.id]);
  const idCommentaire = `checkin-${jalon?.id || "point"}-commentaire`;
  function envoyer(e) {
    e.preventDefault();
    setEssai(true);
    if (complete) onSubmit({ humeur, reponses: rep, commentaire });
  }
  return (
    <form onSubmit={envoyer} noValidate className={`${FORM.encart} mt-3`}>
      <fieldset className="mb-5">
        <legend className={AUTH.libelle}>Comment se passe votre poste en ce moment ?</legend>
        <div className="flex flex-wrap gap-2">
          {HUMEURS.map((h, i) => (
            <button key={h} type="button" onClick={() => setHumeur(i + 1)} aria-pressed={humeur === i + 1} className={FORM.pastille(humeur === i + 1)}>
              {h}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="divide-y divide-base border-y border-base">
        {CHECKIN_QUESTIONS.map((q) => (
          <div key={q.id} role="group" aria-label={q.label} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span className="text-sm text-principal">{q.label}</span>
            <div className="flex gap-2">
              {["Oui", "En partie", "Non"].map((o) => (
                <button key={o} type="button" onClick={() => setRep((r) => ({ ...r, [q.id]: o }))} aria-pressed={rep[q.id] === o} className={FORM.pastille(rep[q.id] === o)}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <label htmlFor={idCommentaire} className={AUTH.libelle}>Un commentaire pour votre référente LIGGEEY (facultatif)</label>
        <textarea id={idCommentaire} rows={3} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} className={FORM.zone()} />
      </div>
      <AlerteFormulaire visible={essai && !complete}>Répondez à toutes les questions pour envoyer le point de suivi.</AlerteFormulaire>
      <div className={FORM.actions}>
        <App.Bouton variante="neutre" onClick={onCancel}>Plus tard</App.Bouton>
        <App.Bouton type="submit">Envoyer le point de suivi</App.Bouton>
      </div>
    </form>
  );
}

function SignalementForm({ types, onSubmit, onCancel, intro }) {
  const f = useFormulaire({ type: types[0], description: "" }, (v) => ({
    description: !v.description.trim() && "Décrivez la situation en quelques mots.",
  }));
  const { err, attrs } = f;
  return (
    <form onSubmit={f.soumettre(onSubmit)} noValidate className={FORM.encart}>
      {intro && <p className="mb-4 text-sm text-secondaire">{intro}</p>}
      <div className="space-y-5">
        <Champ id="signalement-type" label="Type de difficulté">
          <ListeChamp {...attrs("signalement-type", "type")}>
            {types.map((t) => <option key={t}>{t}</option>)}
          </ListeChamp>
        </Champ>
        <Champ id="signalement-description" label="Décrivez la situation" requis erreur={err("description")}>
          <textarea {...attrs("signalement-description", "description", { requis: true })} rows={4} className={FORM.zone(err("description"))} />
        </Champ>
      </div>
      <div className={FORM.actions}>
        {onCancel && <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>}
        <App.Bouton type="submit"><Flag size={16} aria-hidden="true" /> Envoyer le signalement</App.Bouton>
      </div>
    </form>
  );
}

function SuiviEmbaucheScreen({ suivi, setSuivi, signalements, onSignal }) {
  const e = EMBAUCHE_CHERCHEUR;
  const [openJalon, setOpenJalon] = useState(null);
  const [signalOpen, setSignalOpen] = useState(false);
  const jour = joursDepuis(e.dateIso);
  const finEssai = jalonDate(e.dateIso, DUREE_ESSAI);
  const objectifsFaits = OBJECTIFS_INTEGRATION.filter((o) => suivi.objectifs[o.id]).length;
  const mesSignalements = signalements.filter((s) => s.espace === "chercheur" && s.auteur === "Absatou Diallo");

  function submitCheckin(jalon, data) {
    setSuivi((s) => ({ ...s, reponses: { ...s.reponses, [jalon.id]: data } }));
    setOpenJalon(null);
    const alerte = data.humeur <= 2 || Object.values(data.reponses).includes("Non");
    if (alerte) {
      onSignal({ espace: "chercheur", auteur: "Absatou Diallo", concerne: `${e.entreprise} · ${e.poste}`, type: `Alerte du point « ${jalon.label} »`, description: data.commentaire || "Réponses négatives au questionnaire de suivi." });
      notify(`Merci. ${e.referent.nom} a été prévenue et vous recontactera sous 48 h.`, "info");
    } else {
      notify("Point de suivi envoyé. Merci !");
    }
  }

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>LIGGEEY reste à vos côtés pendant les 90 premiers jours de votre nouveau poste.</p>

      <div className="rounded-lg p-6 mb-6" style={{ background: COLORS.dark }}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p className="text-xl font-semibold text-sur-sombre">{e.poste} · {e.entreprise}</p>
            <p className="text-sm" style={{ color: COLORS.onDarkMuted }}>{e.contrat} · {e.ville} · Responsable : {e.manager}</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: COLORS.darkLine, color: COLORS.brandPale }}>En poste depuis {jour} jours</span>
        </div>
        <div className="flex justify-between text-sm mb-1.5">
          <span style={{ color: COLORS.onDarkMuted }}>Période d’essai</span>
          <span className="text-sur-sombre font-semibold">{jour >= DUREE_ESSAI ? "Terminée" : `Jour ${jour} sur ${DUREE_ESSAI} · fin le ${frLongDate(finEssai)}`}</span>
        </div>
        <ProgressBar pct={(jour / DUREE_ESSAI) * 100} track={COLORS.darkLine} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Points de suivi</h3>
          <ol>
            {JALONS.map((j, i) => {
              const done = suivi.reponses[j.id];
              const statut = jalonStatut(e.dateIso, j, done);
              return (
                <li key={j.id} className="flex gap-3 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ background: statut === "Fait" ? COLORS.successSoft : statut === "À compléter" ? COLORS.orange : COLORS.softStrong, color: statut === "Fait" ? COLORS.success : statut === "À compléter" ? COLORS.onOrange : COLORS.slateLight }}>
                      {statut === "Fait" ? <Check size={12} /> : i + 1}
                    </div>
                    {i < JALONS.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: COLORS.border }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{j.label}</p>
                        <p className="text-xs" style={{ color: COLORS.slateLight }}>Jour {j.jour} · {frLongDate(jalonDate(e.dateIso, j.jour))}</p>
                      </div>
                      {statut === "À compléter" && openJalon !== j.id ? (
                        <button type="button" onClick={() => setOpenJalon(j.id)} className="rounded px-3 py-1.5 text-xs font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Répondre</button>
                      ) : (
                        <StatusBadge status={statut} />
                      )}
                    </div>
                    {done && (
                      <p className="text-xs mt-1.5" style={{ color: COLORS.slateLight }}>
                        Ressenti : <span className="font-semibold" style={{ color: COLORS.slate }}>{HUMEURS[done.humeur - 1]}</span>{done.commentaire ? ` · « ${done.commentaire} »` : ""}
                      </p>
                    )}
                    {openJalon === j.id && <CheckinForm jalon={j} onSubmit={(d) => submitCheckin(j, d)} onCancel={() => setOpenJalon(null)} />}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Votre référente</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(e.referent.nom)}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{e.referent.nom}</p>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{e.referent.role}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button type="button" onClick={() => notify(`Appel vers ${e.referent.telephone}…`)} className="rounded px-3 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.border, color: COLORS.slate }}><Phone size={14} /> Appeler</button>
              <button type="button" onClick={() => notify(`Demande de rendez-vous envoyée à ${e.referent.nom}.`)} className="rounded px-3 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.border, color: COLORS.slate }}><Calendar size={14} /> Prendre rendez-vous</button>
            </div>
          </div>

          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Objectifs d’intégration</h3>
              <span className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>{objectifsFaits}/{OBJECTIFS_INTEGRATION.length}</span>
            </div>
            <div className="mb-3"><ProgressBar pct={(objectifsFaits / OBJECTIFS_INTEGRATION.length) * 100} color={COLORS.success} /></div>
            {OBJECTIFS_INTEGRATION.map((o) => (
              <label key={o.id} className="flex items-start gap-2.5 py-1.5 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-primaire-500" checked={!!suivi.objectifs[o.id]} onChange={(ev) => setSuivi((s) => ({ ...s, objectifs: { ...s.objectifs, [o.id]: ev.target.checked } }))} />
                <span className="text-sm" style={{ color: suivi.objectifs[o.id] ? COLORS.slateLight : COLORS.slate, textDecoration: suivi.objectifs[o.id] ? "line-through" : "none" }}>{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div>
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Une difficulté dans votre poste ?</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>Votre référente traite chaque signalement. Votre employeur n’est contacté qu’avec votre accord.</p>
          </div>
          {!signalOpen && <button type="button" onClick={() => setSignalOpen(true)} className="rounded px-4 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.orange, color: COLORS.orangeText }}><Flag size={14} /> Signaler une difficulté</button>}
        </div>
        {signalOpen && (
          <SignalementForm
            types={TYPES_SIGNALEMENT}
            onCancel={() => setSignalOpen(false)}
            onSubmit={(v) => { onSignal({ espace: "chercheur", auteur: "Absatou Diallo", concerne: `${e.entreprise} · ${e.poste}`, ...v }); setSignalOpen(false); notify("Signalement envoyé à votre référente."); }}
          />
        )}
        {mesSignalements.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {mesSignalements.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-3 rounded-md px-4 py-3" style={{ background: COLORS.soft }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{s.type}</p>
                  <p className="text-xs" style={{ color: COLORS.slateLight }}>Envoyé le {s.date} · {s.description}</p>
                </div>
                <StatusBadge status={s.statut} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EvaluationRecrueForm({ onSubmit, onCancel }) {
  const [v, setV] = useState({ competences: 0, integration: 0, ponctualite: 0, commentaire: "" });
  const [essai, setEssai] = useState(false);
  const ok = v.competences && v.integration && v.ponctualite;
  function envoyer(e) {
    e.preventDefault();
    setEssai(true);
    if (ok) onSubmit(v);
  }
  return (
    <form onSubmit={envoyer} noValidate className={`${FORM.encart} mt-3`}>
      <div className="divide-y divide-base border-b border-base pb-1">
        <RatingInput label="Compétences techniques" value={v.competences} onChange={(n) => setV((s) => ({ ...s, competences: n }))} />
        <RatingInput label="Intégration dans l’équipe" value={v.integration} onChange={(n) => setV((s) => ({ ...s, integration: n }))} />
        <RatingInput label="Ponctualité et assiduité" value={v.ponctualite} onChange={(n) => setV((s) => ({ ...s, ponctualite: n }))} />
      </div>
      <div className="mt-5">
        <label htmlFor="evaluation-commentaire" className={AUTH.libelle}>Commentaire (facultatif)</label>
        <textarea id="evaluation-commentaire" rows={3} value={v.commentaire} onChange={(e) => setV((s) => ({ ...s, commentaire: e.target.value }))} className={FORM.zone()} />
      </div>
      <AlerteFormulaire visible={essai && !ok}>Donnez une note à chacun des trois critères.</AlerteFormulaire>
      <div className={FORM.actions}>
        <App.Bouton variante="neutre" onClick={onCancel}>Annuler</App.Bouton>
        <App.Bouton type="submit">Enregistrer l’évaluation</App.Bouton>
      </div>
    </form>
  );
}

function RecrueDetail({ r, onUpdate, onSignal, onBack }) {
  const [openJalon, setOpenJalon] = useState(null);
  const [signalOpen, setSignalOpen] = useState(false);
  const jour = joursDepuis(r.dateIso);
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}><ArrowLeft size={14} /> Retour aux recrues</button>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-3" style={{ color: COLORS.slate }}>{r.nom} <StatusBadge status={r.statut} /></h2>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>{r.poste} · {r.contrat} · en poste depuis {jour} jours</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {r.statut !== "Confirmé" && (
            <button type="button" onClick={() => { onUpdate({ statut: "Confirmé" }); notify(`Embauche de ${r.nom} confirmée.`); }} className="rounded px-4 py-2 text-sm font-semibold text-sur-statut inline-flex items-center gap-1.5" style={{ background: COLORS.success }}><UserCheck size={14} /> Confirmer l’embauche</button>
          )}
          <button type="button" onClick={() => setSignalOpen((o) => !o)} className="rounded px-4 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.orange, color: COLORS.orangeText }}><Flag size={14} /> Signaler un problème</button>
        </div>
      </div>

      {signalOpen && (
        <div className="mb-6">
          <SignalementForm
            types={["Absences répétées", "Compétences insuffisantes", "Comportement", "Départ annoncé", "Autre"]}
            intro="Un conseiller LIGGEEY vous recontacte pour trouver une solution avec la recrue."
            onCancel={() => setSignalOpen(false)}
            onSubmit={(v) => { onSignal({ espace: "entreprise", auteur: "Senegal Construction SARL", concerne: `${r.nom} · ${r.poste}`, ...v }); onUpdate({ statut: "À risque" }); setSignalOpen(false); notify("Signalement transmis à LIGGEEY."); }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Évaluations aux points de suivi</h3>
          {JALONS.map((j) => {
            const ev = r.evaluations[j.id];
            const statut = jalonStatut(r.dateIso, j, ev);
            return (
              <div key={j.id} className="py-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{j.label}</p>
                    <p className="text-xs" style={{ color: COLORS.slateLight }}>{frLongDate(jalonDate(r.dateIso, j.jour))}</p>
                  </div>
                  {statut === "À compléter" && openJalon !== j.id ? (
                    <button type="button" onClick={() => setOpenJalon(j.id)} className="rounded px-3 py-1.5 text-xs font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Évaluer</button>
                  ) : (
                    <StatusBadge status={statut} />
                  )}
                </div>
                {ev && (
                  <p className="text-xs mt-1.5" style={{ color: COLORS.slateLight }}>
                    Compétences {ev.competences}/5 · Intégration {ev.integration}/5 · Ponctualité {ev.ponctualite}/5{ev.commentaire ? ` · « ${ev.commentaire} »` : ""}
                  </p>
                )}
                {openJalon === j.id && (
                  <EvaluationRecrueForm onCancel={() => setOpenJalon(null)} onSubmit={(v) => { onUpdate({ evaluations: { ...r.evaluations, [j.id]: v } }); setOpenJalon(null); notify("Évaluation enregistrée."); }} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Période d’essai</h3>
            <p className="text-sm mb-2" style={{ color: COLORS.slateLight }}>{jour >= DUREE_ESSAI ? "Terminée" : `Jour ${jour} sur ${DUREE_ESSAI} · fin le ${frLongDate(jalonDate(r.dateIso, DUREE_ESSAI))}`}</p>
            <ProgressBar pct={(jour / DUREE_ESSAI) * 100} />
          </div>
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.slate }}>Ressenti de la recrue</h3>
            <p className="text-xs mb-3" style={{ color: COLORS.slateLight }}>Partagé par la recrue lors de son dernier point de suivi.</p>
            <p className="text-lg font-semibold" style={{ color: r.ressenti <= 2 ? COLORS.danger : r.ressenti >= 4 ? COLORS.success : COLORS.slate }}>{HUMEURS[r.ressenti - 1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuiviRecruesScreen({ recrues, setRecrues, onSignal }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = recrues.find((r) => r.id === selectedId);
  if (selected) {
    return <RecrueDetail r={selected} onSignal={onSignal} onBack={() => setSelectedId(null)} onUpdate={(patch) => setRecrues((l) => l.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)))} />;
  }
  const aEvaluer = recrues.reduce((n, r) => n + JALONS.filter((j) => jalonStatut(r.dateIso, j, r.evaluations[j.id]) === "À compléter").length, 0);
  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Accompagnez vos nouvelles recrues jusqu’à la fin de leur période d’essai et au-delà.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users2} value={recrues.length} label="Recrues suivies" />
        <StatCard icon={UserCheck} value={recrues.filter((r) => r.statut === "Confirmé").length} label="Embauches confirmées" />
        <StatCard icon={AlertCircle} value={recrues.filter((r) => r.statut === "À risque").length} label="Recrues à risque" />
        <StatCard icon={ClipboardCheck} value={aEvaluer} label="Évaluations à faire" />
      </div>
      <div className="flex flex-col gap-3">
        {recrues.map((r) => {
          const jour = joursDepuis(r.dateIso);
          const next = JALONS.find((j) => !r.evaluations[j.id]);
          return (
            <button key={r.id} type="button" onClick={() => setSelectedId(r.id)} className="w-full text-left rounded-lg border bg-surface px-5 py-4 grid grid-cols-1 md:grid-cols-[1.4fr,1.2fr,1fr,auto] gap-3 md:items-center hover:shadow-md transition-shadow" style={{ borderColor: r.statut === "À risque" ? COLORS.danger : COLORS.border }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}>{initials(r.nom)}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{r.nom}</p>
                  <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{r.poste} · {r.contrat}</p>
                </div>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{jour >= DUREE_ESSAI ? "Période d’essai terminée" : `Essai : jour ${jour}/${DUREE_ESSAI}`}</p>
                <ProgressBar pct={(jour / DUREE_ESSAI) * 100} />
              </div>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{next ? `Prochain point : ${frLongDate(jalonDate(r.dateIso, next.jour))}` : "Suivi terminé"}</p>
              <StatusBadge status={r.statut} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SuiviPostEmbaucheAdminScreen({ signalements, setSignalements, recrues }) {
  const placements = [
    { id: "pl0", nom: "Absatou Diallo", entreprise: EMBAUCHE_CHERCHEUR.entreprise, poste: EMBAUCHE_CHERCHEUR.poste, jour: joursDepuis(EMBAUCHE_CHERCHEUR.dateIso), statut: "En période d’essai" },
    ...recrues.map((r) => ({ id: r.id, nom: r.nom, entreprise: "Senegal Construction SARL", poste: r.poste, jour: joursDepuis(r.dateIso), statut: r.statut })),
    ...PLACEMENTS_AUTRES,
  ];
  const ouverts = signalements.filter((s) => s.statut === "Ouvert");
  return (
    <div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Suivez les personnes placées via LIGGEEY et traitez les signalements des recrues et des employeurs.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={HeartHandshake} value={placements.length} label="Placements suivis" />
        <StatCard icon={TrendingUp} value="87 %" label="Toujours en poste à 3 mois" />
        <StatCard icon={AlertCircle} value={placements.filter((p) => p.statut === "À risque").length} label="Placements à risque" />
        <StatCard icon={Flag} value={ouverts.length} label="Signalements ouverts" />
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold" style={{ color: COLORS.slate }}>Signalements</h2>
        <ExportAdmin
          titre="Signalements post-embauche"
          lignes={signalements}
          colonnes={[
            { titre: "Date", valeur: (x) => x.date },
            { titre: "Type", valeur: (x) => x.type },
            { titre: "Auteur", valeur: (x) => x.auteur },
            { titre: "Espace", valeur: (x) => ESPACE_LABELS[x.espace] },
            { titre: "Concerne", valeur: (x) => x.concerne },
            { titre: "Description", valeur: (x) => x.description },
            { titre: "Statut", valeur: (x) => x.statut },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3 mb-8">
        {signalements.map((s) => (
          <div key={s.id} className="rounded-lg border bg-surface p-5 flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: s.statut === "Ouvert" ? COLORS.danger : COLORS.border }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{s.type}</p>
              <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{s.date} · par {s.auteur} ({ESPACE_LABELS[s.espace]}) · concerne {s.concerne}</p>
              <p className="text-sm" style={{ color: COLORS.slate }}>{s.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={s.statut} />
              {s.statut === "Ouvert" && (
                <>
                  <button type="button" onClick={() => notify(`Prise de contact avec ${s.auteur} enregistrée.`)} className="rounded px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Contacter</button>
                  <button type="button" onClick={() => { setSignalements((l) => l.map((x) => (x.id === s.id ? { ...x, statut: "Traité" } : x))); notify("Signalement marqué comme traité."); }} className="rounded px-3 py-1.5 text-xs font-semibold text-sur-marque" style={{ background: COLORS.orange }}>Marquer traité</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold" style={{ color: COLORS.slate }}>Placements en cours de suivi</h2>
        <ExportAdmin
          titre="Placements suivis"
          lignes={placements}
          colonnes={[
            { titre: "Personne placée", valeur: (p) => p.nom },
            { titre: "Poste", valeur: (p) => p.poste },
            { titre: "Employeur", valeur: (p) => p.entreprise },
            { titre: "Ancienneté (jours)", valeur: (p) => p.jour },
            { titre: "Statut", valeur: (p) => p.statut },
          ]}
        />
      </div>
      <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr style={{ color: COLORS.slateLight, borderBottom: `1px solid ${COLORS.border}` }}>
              {["Personne placée", "Employeur", "Ancienneté", "Statut"].map((h) => <th key={h} className="text-left font-semibold px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {placements.map((p) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}`, color: COLORS.slate }}>
                <td className="px-4 py-3"><p className="font-semibold">{p.nom}</p><p className="text-xs" style={{ color: COLORS.slateLight }}>{p.poste}</p></td>
                <td className="px-4 py-3">{p.entreprise}</td>
                <td className="px-4 py-3">{p.jour} jours</td>
                <td className="px-4 py-3"><StatusBadge status={p.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =====================================================================
   RÉGULARISATION DE L’ACTIVITÉ (prestataires)
   ===================================================================== */

const REGUL_STEPS_INITIAL = [
  { id: "identite", titre: "Pièce d’identité", obligatoire: true, statut: "Validé", description: "Carte nationale d’identité CEDEAO ou passeport en cours de validité.", ou: "Déjà fournie lors de votre inscription.", document: "CNI_Mamadou_Ndiaye.pdf" },
  { id: "ninea", titre: "Numéro NINEA", obligatoire: true, statut: "À compléter", champ: "Numéro NINEA", valeur: "", description: "Identifiant unique de votre activité auprès de l’administration fiscale.", ou: "Centre des services fiscaux de votre zone ou guichet unique de l’APIX." },
  { id: "immatriculation", titre: "Immatriculation de l’activité", obligatoire: true, statut: "À compléter", champ: "Numéro d’immatriculation", valeur: "", description: "Inscription au Registre des métiers pour les artisans, ou au RCCM pour une activité commerciale.", ou: "Chambre de métiers de votre région, ou greffe du tribunal de commerce." },
  { id: "fiscal", titre: "Régime fiscal", obligatoire: true, statut: "À compléter", choix: ["Contribution globale unique (CGU)", "Régime du réel", "Je ne sais pas encore"], valeur: "", description: "Le régime d’imposition qui s’applique à votre activité, selon votre chiffre d’affaires.", ou: "Centre des services fiscaux ou conseiller LIGGEEY." },
  { id: "social", titre: "Protection sociale", obligatoire: false, statut: "À compléter", description: "Affiliation à une caisse de retraite ou à une mutuelle de santé pour vous protéger, vous et votre famille.", ou: "IPRES, Caisse de sécurité sociale ou mutuelle de santé de votre commune." },
  { id: "assurance", titre: "Assurance responsabilité civile professionnelle", obligatoire: false, statut: "À compléter", description: "Couvre les dommages causés chez vos clients pendant une intervention.", ou: "Compagnies d’assurance agréées au Sénégal." },
];

const REGUL_DEMANDES_AUTRES = [
  { id: "rd1", prestataire: "Fatou Cissé", metier: "Couturière", etape: "Numéro NINEA", document: "ninea_fatou_cisse.pdf", valeur: "008 765 432", date: "11 octobre 2026", statut: "En vérification" },
  { id: "rd2", prestataire: "Babacar Gueye", metier: "Peintre", etape: "Immatriculation de l’activité", document: "carte_artisan_bgueye.jpg", valeur: "RM-DKR-2026-0412", date: "10 octobre 2026", statut: "En vérification" },
  { id: "rd3", prestataire: "Khady Ndiaye", metier: "Esthéticienne", etape: "Régime fiscal", document: "—", valeur: "Contribution globale unique (CGU)", date: "8 octobre 2026", statut: "En vérification" },
];

/* La régularisation est facultative : le prestataire choisit de la faire (« regul-choix » : "oui"),
   de la remettre à plus tard ("plus-tard"), ou n’a encore rien choisi (null). Envoyer un justificatif
   vaut engagement. Les rappels (tâches, compteur du menu, badge « en cours ») ne concernent que
   les prestataires engagés. */
/* « Votre étape validée est gardée » / « Vos 2 étapes validées sur 4 sont gardées » */
function etapesGardees(valides, total) {
  return valides > 1
    ? `Vos ${valides} étapes validées${total ? ` sur ${total}` : ""} sont gardées`
    : `L’étape déjà validée${total ? ` (1 sur ${total})` : ""} est gardée`;
}

function regulCommencee(steps) {
  return steps.some((st) => st.id !== "identite" && st.statut !== "À compléter");
}

function regulEngage(steps, choix) {
  if (choix === "oui") return true;
  if (choix === "plus-tard") return false;
  return regulCommencee(steps);
}

function regulSummary(steps) {
  const obligatoires = steps.filter((s) => s.obligatoire);
  const valides = obligatoires.filter((s) => s.statut === "Validé").length;
  return { valides, total: obligatoires.length, complete: valides === obligatoires.length };
}

function RegulBadge({ size = "md" }) {
  const api = usePlan();
  if (!api || !api.regulSteps) return null;
  const { complete } = regulSummary(api.regulSteps);
  if (!complete && !regulEngage(api.regulSteps, api.regulChoix)) return null;
  const cls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1";
  return complete ? (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.successSoft, color: COLORS.success }}><BadgeCheck size={12} /> Activité régularisée</span>
  ) : (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.orangeSoft, color: COLORS.orangeStrong }}><Landmark size={12} /> Régularisation en cours</span>
  );
}

function RegulStepCard({ step, index, onChange }) {
  const [open, setOpen] = useState(step.statut === "Refusé" || step.statut === "À compléter");
  const [valeur, setValeur] = useState(step.valeur || "");
  const [file, setFile] = useState(null);
  const editable = step.statut === "À compléter" || step.statut === "Refusé";
  const needsValue = step.champ || step.choix;
  const ready = (!needsValue || valeur.trim()) && (file || step.choix);

  return (
    <div className="rounded-lg border bg-surface" style={{ borderColor: step.statut === "Refusé" ? COLORS.danger : COLORS.border }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: step.statut === "Validé" ? COLORS.successSoft : COLORS.softStrong, color: step.statut === "Validé" ? COLORS.success : COLORS.slate }}>
            {step.statut === "Validé" ? <Check size={13} /> : index + 1}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{step.titre}</p>
            <p className="text-xs" style={{ color: COLORS.slateLight }}>{step.obligatoire ? "Requis pour le badge" : "Conseillé, en plus"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={step.statut} />
          <ChevronRight size={16} color={COLORS.slateLight} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <p className="text-sm mt-4" style={{ color: COLORS.slate }}>{step.description}</p>
          <p className="text-sm mt-1 mb-3" style={{ color: COLORS.slateLight }}><span className="font-semibold">Où l’obtenir : </span>{step.ou}</p>
          {step.statut === "Refusé" && step.motif && (
            <div className="rounded-md px-3 py-2 text-sm mb-3 flex items-start gap-2" style={{ background: COLORS.dangerSoft, color: COLORS.danger }}><AlertCircle size={15} className="mt-0.5 shrink-0" /> {step.motif}</div>
          )}
          {step.statut === "En vérification" && <p className="text-sm" style={{ color: COLORS.orangeText }}>Document reçu le {step.envoyeLe}. Vérification par l’équipe LIGGEEY sous 72 h.</p>}
          {step.statut === "Validé" && step.document && <p className="text-sm flex items-center gap-1.5" style={{ color: COLORS.success }}><FileCheck2 size={15} /> {step.document}{step.valeur ? ` · ${step.valeur}` : ""}</p>}
          {editable && (
            <div className="flex flex-col gap-3">
              {step.champ && (
                <div className="max-w-sm">
                  <label htmlFor={`regul-${step.id ?? index}-valeur`} className={AUTH.libelle}>{step.champ}</label>
                  <input id={`regul-${step.id ?? index}-valeur`} value={valeur} onChange={(e) => setValeur(e.target.value)} className={FORM.champ()} />
                </div>
              )}
              {step.choix && (
                <div className="max-w-sm">
                  <label htmlFor={`regul-${step.id ?? index}-regime`} className={AUTH.libelle}>Votre régime</label>
                  <ListeChamp id={`regul-${step.id ?? index}-regime`} value={valeur} onChange={(e) => setValeur(e.target.value)}>
                    <option value="">Choisir…</option>
                    {step.choix.map((c) => <option key={c}>{c}</option>)}
                  </ListeChamp>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <FilePickerButton accept=".pdf,image/*" onPick={(f) => setFile(f.name)} className={FORM.fichier}>
                  <Upload size={15} aria-hidden="true" /> {file ? "Changer le justificatif" : step.choix ? "Ajouter un justificatif (facultatif)" : "Ajouter le justificatif"}
                </FilePickerButton>
                {file && <span className="inline-flex items-center gap-1.5 text-sm text-principal"><FileCheck2 size={15} className="text-statut-succes" aria-hidden="true" /> {file}</span>}
              </div>
              <div>
                <App.Bouton disabled={!ready} onClick={() => onChange({ statut: "En vérification", valeur, document: file || "—", envoyeLe: todayFr(), motif: null })}>
                  Envoyer pour vérification
                </App.Bouton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const REGUL_ETAPES_EXPLIQUEES = [
  { icone: Compass, titre: "Vous décidez", texte: "Rien n’est imposé. Vous commencez quand vous voulez, et vous pouvez faire une pause." },
  { icone: MapPin, titre: "Vous obtenez vos papiers", texte: "Pour chaque étape, nous indiquons le document et le guichet où l’obtenir." },
  { icone: Upload, titre: "Vous les envoyez ici", texte: "Une photo nette suffit. L’équipe LIGGEEY vérifie chaque document." },
  { icone: BadgeCheck, titre: "Vous recevez le badge", texte: "« Activité régularisée » s’affiche sur votre profil, à la vue des clients." },
];

const REGUL_AVEC_SANS = [
  ["Publier vos services et recevoir des missions", true, true],
  ["Être payé par Wave ou Orange Money via LIGGEEY", true, true],
  ["Badge « Activité régularisée » sur votre profil", false, true],
  ["Devis et factures avec votre NINEA, souvent demandés par les entreprises", false, true],
  ["Dossier prêt pour un crédit ou un microfinancement", false, true],
  ["Protection sociale et assurance (étapes conseillées)", false, true],
];

const REGUL_QUESTIONS = [
  { q: "Est-ce obligatoire pour travailler sur LIGGEEY ?", r: "Non. Vous pouvez proposer vos services et être payé sans régulariser votre activité. La régularisation vous ouvre simplement plus de portes." },
  { q: "Combien ça coûte ?", r: "Le suivi sur LIGGEEY est gratuit, avec un guide en ligne. Certains organismes demandent des frais pour leurs documents : renseignez-vous auprès d’eux. Avec Premium, un conseiller prépare les dossiers avec vous." },
  { q: "Qui voit mes documents ?", r: "Seule l’équipe LIGGEEY, pour les vérifier. Vos clients voient uniquement le badge." },
  { q: "Je change d’avis : puis-je commencer plus tard ?", r: "Oui. Même si vous avez répondu « Non », vous pouvez commencer à tout moment depuis cet écran ou depuis votre profil." },
  { q: "J’ai commencé mais je ne veux plus continuer : que se passe-t-il ?", r: "Vous arrêtez quand vous voulez avec le bouton « Arrêter la régularisation ». Vous ne recevez plus de rappels, vos missions et vos paiements continuent normalement. Les étapes déjà validées sont gardées, et les documents envoyés restent vus seulement par l’équipe LIGGEEY. Si vous reprenez un jour, vous repartez là où vous vous étiez arrêté." },
];

/* Écran Régularisation, organisé autour d’une question :
   - pas encore de réponse : « Souhaitez-vous qu’on vous accompagne… ? » ;
   - Oui (ou démarche déjà commencée) : les étapes à suivre ;
   - Non : seulement les informations à savoir, avec la possibilité de changer d’avis. */
function RegulQuestion({ choix, onOui, onNon, reprise = null }) {
  const dejaNon = choix === "plus-tard";
  return (
    <section aria-labelledby="regul-question" className="rounded-lg border border-marque bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <App.PastilleIcone icone={HeartHandshake} taille="lg" />
        <div className="min-w-0 flex-1">
          <h2 id="regul-question" className="text-lg font-semibold text-principal">
            {reprise ? "Vous voulez reprendre ?" : dejaNon ? "Vous changez d’avis ?" : "Souhaitez-vous qu’on vous accompagne dans la régularisation de votre activité ?"}
          </h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-secondaire">
            {reprise
              ? `Vous repartez là où vous vous étiez arrêté : ${reprise.valides} étape${reprise.valides > 1 ? "s" : ""} sur ${reprise.total} déjà validée${reprise.valides > 1 ? "s" : ""}.`
              : dejaNon
              ? "LIGGEEY peut vous guider étape par étape quand vous le souhaitez : quels papiers demander, où les obtenir, et la vérification de vos documents."
              : "Régulariser, c’est déclarer officiellement votre activité (NINEA, immatriculation, régime fiscal). Ce n’est pas obligatoire : vous pouvez travailler et être payé sur LIGGEEY sans le faire. Si vous le souhaitez, nous vous guidons étape par étape."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <App.Bouton onClick={onOui}>{reprise ? "Reprendre ma régularisation" : "Oui, accompagnez-moi"}</App.Bouton>
            {!dejaNon && <App.Bouton variante="neutre" onClick={onNon}>Non, pas maintenant</App.Bouton>}
          </div>
          <p className="mt-3 text-xs text-discret">Votre réponse ne change rien à vos missions ni à vos paiements. Vous pourrez changer d’avis à tout moment.</p>
        </div>
      </div>
    </section>
  );
}

function RegulInfos() {
  return (
    <>
      <section aria-labelledby="regul-comment">
        <h2 id="regul-comment" className="mb-3 text-lg font-semibold text-principal">Bon à savoir : comment ça marche</h2>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {REGUL_ETAPES_EXPLIQUEES.map((e, i) => (
            <li key={e.titre} className="rounded-lg border border-base bg-surface p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-marque-doux text-xs font-semibold text-marque-fort">{i + 1}</span>
                <e.icone size={17} className="text-marque" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-principal">{e.titre}</p>
              <p className="mt-1 text-sm text-secondaire">{e.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <App.Carte titre="Avec ou sans régularisation" flush>
        <div className="overflow-x-auto px-6 pb-4">
          <table className="w-full min-w-[480px] text-sm">
            <caption className="sr-only">Ce que vous pouvez faire avec ou sans régularisation</caption>
            <thead>
              <tr className="text-left text-discret">
                <th scope="col" className="py-2 pr-4 font-semibold">Sur LIGGEEY, vous pouvez…</th>
                <th scope="col" className="w-28 py-2 text-center font-semibold">Sans</th>
                <th scope="col" className="w-28 py-2 text-center font-semibold text-marque">Avec</th>
              </tr>
            </thead>
            <tbody>
              {REGUL_AVEC_SANS.map(([label, sans, avec]) => (
                <tr key={label} className="border-t border-dashed border-base">
                  <td className="py-2.5 pr-4 text-principal">{label}</td>
                  {[sans, avec].map((ok, k) => (
                    <td key={k} className="py-2.5 text-center">
                      {ok ? <Check size={17} className="inline text-statut-succes" aria-label="Oui" /> : <span className="text-discret" aria-label="Non">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </App.Carte>
    </>
  );
}

function RegulQuestionsFrequentes() {
  return (
    <App.Carte titre="Vos questions">
      <div className="divide-y divide-dashed divide-base">
        {REGUL_QUESTIONS.map((x) => (
          <details key={x.q} className="group py-3">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-principal">
              {x.q}
              <ChevronRight size={16} className="shrink-0 text-discret transition-transform group-open:rotate-90" aria-hidden="true" />
            </summary>
            <p className="pb-1 text-sm leading-[1.7] text-secondaire">{x.r}</p>
          </details>
        ))}
      </div>
    </App.Carte>
  );
}

/* Carte « Régularisation » du profil prestataire : reflète le choix (pas encore répondu, non, oui)
   et mène à l’écran Régularisation. */
function CarteRegularisationProfil({ onNavigate }) {
  const api = usePlan();
  const [choix, setChoix] = useStore("regul-choix", null);
  if (!api || !api.regulSteps) return null;
  const steps = api.regulSteps;
  const { valides, total, complete } = regulSummary(steps);
  const engage = complete || regulEngage(steps, choix);

  if (complete) {
    return (
      <App.Carte titre="Régularisation">
        <p className="flex items-center gap-2 text-sm font-semibold text-statut-succes"><BadgeCheck size={16} aria-hidden="true" /> Activité régularisée</p>
        <p className="mt-1 text-sm text-secondaire">Le badge s’affiche sur votre profil, à la vue des clients.</p>
      </App.Carte>
    );
  }
  if (engage) {
    return (
      <App.Carte titre="Régularisation" actions={<App.Badge ton="alerte" taille="moyen">En cours</App.Badge>}>
        <p className="mb-2 text-sm text-secondaire">{valides} étape{valides > 1 ? "s" : ""} validée{valides > 1 ? "s" : ""} sur {total} pour obtenir le badge.</p>
        <App.BarreProgression valeur={Math.round((valides / total) * 100)} label={`${valides} étapes validées sur ${total}`} />
        <div className="mt-4"><App.Bouton petit variante="doux" onClick={() => onNavigate("regularisation")}>Continuer mes étapes</App.Bouton></div>
      </App.Carte>
    );
  }
  if (choix === "plus-tard" && regulCommencee(steps)) {
    return (
      <App.Carte titre="Régularisation" actions={<App.Badge ton="neutre" taille="moyen">Arrêtée</App.Badge>}>
        <p className="text-sm text-secondaire">Vous avez arrêté en cours de route. {etapesGardees(valides, total)}.</p>
        <div className="mt-4"><App.Bouton petit variante="doux" onClick={() => { setChoix("oui"); onNavigate("regularisation"); }}>Reprendre ma régularisation</App.Bouton></div>
      </App.Carte>
    );
  }
  if (choix === "plus-tard") {
    return (
      <App.Carte titre="Régularisation" actions={<App.Badge ton="neutre" taille="moyen">Facultatif</App.Badge>}>
        <p className="text-sm text-secondaire">Vous avez choisi de ne pas régulariser votre activité pour l’instant. Vos missions et vos paiements continuent normalement.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <App.Bouton petit onClick={() => { setChoix("oui"); onNavigate("regularisation"); }}>J’ai changé d’avis</App.Bouton>
          <App.Bouton petit variante="doux" onClick={() => onNavigate("regularisation")}>En savoir plus</App.Bouton>
        </div>
      </App.Carte>
    );
  }
  return (
    <App.Carte titre="Régularisation" actions={<App.Badge ton="neutre" taille="moyen">Facultatif</App.Badge>}>
      <p className="text-sm font-semibold text-principal">Souhaitez-vous qu’on vous accompagne dans la régularisation de votre activité ?</p>
      <p className="mt-1 text-sm text-secondaire">Ce n’est pas obligatoire : vous pouvez travailler et être payé sans le faire.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <App.Bouton petit onClick={() => { setChoix("oui"); onNavigate("regularisation"); }}>Oui</App.Bouton>
        <App.Bouton petit variante="neutre" onClick={() => { setChoix("plus-tard"); notify("C’est noté : aucun rappel ne vous sera envoyé.", "info"); }}>Non, pas maintenant</App.Bouton>
      </div>
    </App.Carte>
  );
}

function RegularisationScreen({ steps, setSteps }) {
  const planApi = usePlan();
  const [choix, setChoix] = useStore("regul-choix", null);
  const { valides, total, complete } = regulSummary(steps);
  const enVerif = steps.filter((st) => st.statut === "En vérification").length;
  const accompOk = planApi && planApi.can("accompagnementRegularisation");
  const engage = complete || regulEngage(steps, choix);
  const arretee = !engage && choix === "plus-tard" && regulCommencee(steps);
  const [confirmerArret, setConfirmerArret] = useState(false);

  const oui = () => { setChoix("oui"); window.scrollTo(0, 0); notify(arretee ? "Bon retour ! Vous reprenez là où vous vous étiez arrêté." : "C’est parti ! Voici les étapes à suivre, à votre rythme."); };
  const non = () => { setChoix("plus-tard"); window.scrollTo(0, 0); notify("C’est noté : aucun rappel ne vous sera envoyé. Les informations restent disponibles ici.", "info"); };
  const arreter = () => { setConfirmerArret(false); setChoix("plus-tard"); window.scrollTo(0, 0); notify("Régularisation arrêtée. Vos étapes validées sont gardées : vous pourrez reprendre à tout moment.", "info"); };

  // Pas encore de réponse : la question seule.
  if (!engage && choix === null) {
    return (
      <div className="space-y-6">
        <RegulQuestion choix={choix} onOui={oui} onNon={non} />
      </div>
    );
  }

  // Non : les informations à savoir, et la possibilité de changer d’avis.
  if (!engage) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-base bg-doux p-4">
          <Check size={18} className="mt-0.5 shrink-0 text-statut-succes" aria-hidden="true" />
          <p className="text-sm text-principal">
            {arretee
              ? <>Vous avez arrêté votre régularisation. <span className="text-secondaire">Vos services, vos missions et vos paiements continuent normalement. {etapesGardees(valides, total)}{enVerif ? `, et ${enVerif} document${enVerif > 1 ? "s" : ""} déjà envoyé${enVerif > 1 ? "s" : ""} ${enVerif > 1 ? "sont" : "est"} encore vérifié${enVerif > 1 ? "s" : ""} par l’équipe` : ""}.</span></>
              : <>Vous avez choisi de ne pas régulariser votre activité pour l’instant. <span className="text-secondaire">Vos services, vos missions et vos paiements continuent normalement.</span></>}
          </p>
        </div>
        {arretee && <RegulQuestion choix={choix} onOui={oui} onNon={non} reprise={{ valides, total }} />}
        <RegulInfos />
        <RegulQuestionsFrequentes />
        {!arretee && <RegulQuestion choix={choix} onOui={oui} onNon={non} />}
        <p className="text-xs text-discret">Les démarches et organismes indiqués sont donnés à titre d’orientation. Renseignez-vous auprès de l’organisme concerné pour les conditions et frais en vigueur.</p>
      </div>
    );
  }

  // Oui : les étapes à suivre.
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 rounded-lg p-6 md:grid-cols-[1fr,auto] md:items-center" style={{ background: COLORS.dark }}>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-sur-sombre">Votre régularisation, accompagnée par LIGGEEY</p>
            <RegulBadge size="sm" />
          </div>
          <p className="mb-1 text-sm" style={{ color: COLORS.onDarkMuted }}>Étapes validées pour le badge</p>
          <p className="mb-3 text-3xl font-semibold text-sur-sombre">{valides} / {total}</p>
          <ProgressBar pct={(valides / total) * 100} color={complete ? COLORS.successBright : COLORS.orange} track={COLORS.darkLine} />
          <p className="mt-3 text-sm" style={{ color: COLORS.onDarkMuted }}>{complete ? "Votre activité est régularisée. Le badge s’affiche sur votre profil." : enVerif ? `${enVerif} document${enVerif > 1 ? "s" : ""} en cours de vérification.` : "Suivez les étapes ci-dessous, à votre rythme."}</p>
        </div>
        {!complete && (
          <App.Bouton petit variante="clair" onClick={() => setConfirmerArret(true)} className="justify-self-start md:justify-self-end">
            <X size={16} aria-hidden="true" /> Arrêter la régularisation
          </App.Bouton>
        )}
      </div>

      {confirmerArret && (
        <ModalFrame onClose={() => setConfirmerArret(false)} labelledBy="regul-arret-titre">
          <div className="p-6">
            <h3 id="regul-arret-titre" className="mb-2 text-lg font-semibold text-principal">Ne plus continuer la régularisation ?</h3>
            <p className="mb-3 text-sm text-secondaire">C’est votre choix, et vous pouvez revenir dessus à tout moment.</p>
            <ul className="mb-6 space-y-2 text-sm text-principal">
              {[
                "Vos missions et vos paiements continuent normalement.",
                "Vous ne recevez plus de rappels.",
                `${etapesGardees(valides)} : vous reprendrez là où vous vous êtes arrêté.`,
                "Le badge « Activité régularisée » ne s’affichera que si vous allez jusqu’au bout.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-statut-succes" aria-hidden="true" /> {t}</li>
              ))}
            </ul>
            <div className="flex flex-wrap justify-end gap-2">
              <App.Bouton petit variante="neutre" onClick={() => setConfirmerArret(false)}>Continuer mes étapes</App.Bouton>
              <App.Bouton petit onClick={arreter}>Oui, arrêter</App.Bouton>
            </div>
          </div>
        </ModalFrame>
      )}

      <section aria-labelledby="regul-etapes">
        <h2 id="regul-etapes" className="mb-1 text-lg font-semibold text-principal">Les étapes à suivre</h2>
        <p className="mb-3 text-sm text-secondaire">Pour chaque étape : le document à obtenir, où le demander, puis l’envoi ici. L’équipe LIGGEEY vérifie chaque document.</p>
        <div className="flex flex-col gap-3">
          {steps.map((st, i) => (
            <RegulStepCard key={st.id + st.statut} step={st} index={i} onChange={(patch) => { setSteps((l) => l.map((x) => (x.id === st.id ? { ...x, ...patch } : x))); if (choix !== "oui") setChoix("oui"); notify(`« ${st.titre} » envoyé pour vérification.`); }} />
          ))}
        </div>
        {!complete && (
          <div className="mt-3 flex flex-col gap-3 rounded-lg border border-base bg-doux p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-principal">
              Vous ne souhaitez plus continuer ? <span className="text-secondaire">Vous pouvez arrêter à tout moment : vos missions et vos paiements ne changent pas.</span>
            </p>
            <App.Bouton petit variante="neutre" onClick={() => setConfirmerArret(true)} className="shrink-0 border border-forte">
              <X size={16} aria-hidden="true" /> Arrêter la régularisation
            </App.Bouton>
          </div>
        )}
      </section>

      <div className="flex flex-col justify-between gap-3 rounded-lg border bg-surface p-5 sm:flex-row sm:items-center" style={{ borderColor: accompOk ? COLORS.border : COLORS.orange }}>
        <div>
          <p className="flex items-center gap-2 font-semibold" style={{ color: COLORS.slate }}>Besoin d’aide pour vos dossiers ? {!accompOk && <PremiumChip locked />}</p>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>Un conseiller LIGGEEY prépare les dossiers avec vous et vous oriente vers les bons guichets.</p>
        </div>
        <button type="button" onClick={() => planApi.gate("accompagnementRegularisation", () => notify("Demande envoyée : un conseiller vous appelle sous 48 h."))} className="inline-flex shrink-0 items-center gap-1.5 rounded px-4 py-2 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }}>
          {!accompOk && <Lock size={13} />} Être rappelé(e) par un conseiller
        </button>
      </div>

      <RegulQuestionsFrequentes />
      <p className="text-xs text-discret">Les démarches et organismes indiqués sont donnés à titre d’orientation. Renseignez-vous auprès de l’organisme concerné pour les conditions et frais en vigueur.</p>
    </div>
  );
}

function RegularisationsAdminScreen({ steps, setSteps }) {
  const [others, setOthers] = useStore("regul-autres", REGUL_DEMANDES_AUTRES);
  const [refusing, setRefusing] = useState(null);
  const [motif, setMotif] = useState("");
  const demo = steps.filter((s) => s.statut === "En vérification").map((s) => ({ id: `demo-${s.id}`, stepId: s.id, prestataire: "Mamadou Ndiaye", metier: "Électricien bâtiment", etape: s.titre, document: s.document, valeur: s.valeur, date: s.envoyeLe, statut: s.statut }));
  const demandes = [...demo, ...others.filter((o) => o.statut === "En vérification")];
  const traitees = others.filter((o) => o.statut !== "En vérification");

  function decide(d, statut, m) {
    if (d.stepId) setSteps((l) => l.map((x) => (x.id === d.stepId ? { ...x, statut, motif: m || null } : x)));
    else setOthers((l) => l.map((x) => (x.id === d.id ? { ...x, statut } : x)));
    setRefusing(null);
    setMotif("");
    notify(statut === "Validé" ? `« ${d.etape} » validé pour ${d.prestataire}.` : `« ${d.etape} » refusé pour ${d.prestataire}.`, statut === "Validé" ? "success" : "info");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm" style={{ color: COLORS.slateLight }}>Vérifiez les justificatifs envoyés par les prestataires pour régulariser leur activité.</p>
        <ExportAdmin
          titre="Justificatifs de régularisation"
          lignes={[...demandes, ...traitees]}
          colonnes={[
            { titre: "Prestataire", valeur: (d) => d.prestataire },
            { titre: "Métier", valeur: (d) => d.metier },
            { titre: "Étape", valeur: (d) => d.etape },
            { titre: "Document", valeur: (d) => d.document },
            { titre: "Valeur déclarée", valeur: (d) => d.valeur },
            { titre: "Envoyé le", valeur: (d) => d.date },
            { titre: "Statut", valeur: (d) => d.statut },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FileCheck2} value={demandes.length} label="Justificatifs à vérifier" />
        <StatCard icon={BadgeCheck} value="38 %" label="Prestataires régularisés" />
        <StatCard icon={Clock} value="41 h" label="Délai moyen de vérification" />
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {demandes.length === 0 && <div className="rounded-lg border bg-surface p-6 text-sm" style={{ borderColor: COLORS.border, color: COLORS.slateLight }}>Aucun justificatif en attente. Les nouveaux envois apparaîtront ici.</div>}
        {demandes.map((d) => (
          <div key={d.id} className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{d.prestataire} · {d.etape}</p>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{d.metier} · envoyé le {d.date}</p>
                <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: COLORS.slate }}><FileText size={14} color={COLORS.slateLight} /> {d.document}{d.valeur ? ` · ${d.valeur}` : ""}</p>
              </div>
              {refusing !== d.id && (
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => setRefusing(d.id)} className="rounded px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Refuser</button>
                  <button type="button" onClick={() => decide(d, "Validé")} className="rounded px-4 py-2 text-sm font-semibold text-sur-statut" style={{ background: COLORS.success }}>Valider</button>
                </div>
              )}
            </div>
            {refusing === d.id && (
              <div className="mt-4">
                <label htmlFor={`motif-regul-${d.id}`} className={AUTH.libelle}>Motif du refus, visible par le prestataire</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input id={`motif-regul-${d.id}`} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Ex. : document illisible, merci de le renvoyer" className={`${FORM.champ()} flex-1`} />
                  <App.Bouton variante="neutre" onClick={() => { setRefusing(null); setMotif(""); }} className="min-h-[48px]">Annuler</App.Bouton>
                  <BoutonDanger disabled={!motif.trim()} onClick={() => decide(d, "Refusé", motif)}>Confirmer le refus</BoutonDanger>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {traitees.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.slate }}>Traités récemment</h2>
          <div className="flex flex-col gap-2">
            {traitees.map((d) => (
              <div key={d.id} className="rounded-md border bg-surface px-4 py-3 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
                <span className="text-sm" style={{ color: COLORS.slate }}>{d.prestataire} · {d.etape}</span>
                <StatusBadge status={d.statut} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =====================================================================
   PROFILS : informations modifiables (chercheur et prestataire)
   ===================================================================== */

const PROFIL_CHERCHEUR_INITIAL = { email: "absatou.diallo@example.com", ville: "Dakar", profession: "Chargée de clientèle", telephone: "+221 77 123 45 67" };
const PROFIL_PRESTATAIRE_INITIAL = { metier: "Électricien bâtiment", email: "mamadou.ndiaye@email.sn", telephone: "+221 76 412 33 08", localisation: "Dakar, Sénégal" };

function ProfilInfoModal({ nom, fields, values, onSave, onClose }) {
  const f = useFormulaire(values, (v) => Object.fromEntries(fields.map((c) => {
    const val = String(v[c.key] || "").trim();
    if (!val) return [c.key, `Indiquez : ${c.label.toLowerCase()}.`];
    if (c.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return [c.key, "Saisissez une adresse e-mail valide, par exemple nom@exemple.com."];
    return [c.key, false];
  })));
  function save(v) {
    onSave(v);
    notify("Profil mis à jour.");
    onClose();
  }
  return (
    <ModalFrame onClose={onClose} labelledBy="edit-profil-title">
      <form onSubmit={f.soumettre(save)} noValidate className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 id="edit-profil-title" className="text-lg font-semibold text-principal">Modifier le profil</h3>
            <p className="mt-0.5 text-sm text-secondaire">{nom} · le nom est vérifié et ne peut pas être modifié ici.</p>
          </div>
          <App.BoutonIcone icone={X} label="Fermer" onClick={onClose} />
        </div>
        <div className="space-y-5">
          {fields.map((c) => (
            <Champ key={c.key} id={`profil-${c.key}`} label={c.label} requis erreur={f.err(c.key)}>
              <input {...f.attrs(`profil-${c.key}`, c.key, { requis: true })} type={c.type || "text"} className={FORM.champ(f.err(c.key))} />
            </Champ>
          ))}
        </div>
        <div className={FORM.actions}>
          <App.Bouton variante="neutre" onClick={onClose}>Annuler</App.Bouton>
          <App.Bouton type="submit">Enregistrer</App.Bouton>
        </div>
      </form>
    </ModalFrame>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>{label}</p>
      <p className="text-sm" style={{ color: COLORS.slate }}>{value}</p>
    </div>
  );
}

/* =====================================================================
   CAP MÉTIER ET ESPACE MENTOR
   - Cap Métier : suivi et coaching des jeunes sans métier, dès 15 ans
     (accord d’un parent ou tuteur avant 18 ans : voir AGE_MIN_PAR_PROFIL).
   - Espace mentor : mentorés attribués (Cap Métier et chercheurs d’emploi),
     séances, comptes rendus.
   - Admin : attribution des mentors aux jeunes, accords parentaux.
   Protection des mineurs, appliquée dans la démo :
   - un mentor n’est attribué qu’après l’accord du parent ou tuteur ;
   - les séances avec un mineur ont lieu en groupe ou au bureau de Dakar ;
   - le mentor ne voit ni le téléphone ni l’adresse d’un mineur ;
   - pas de photo pour les jeunes (initiales seulement).
   Mémoire partagée (useStore) : cap-jeunes, mentorat-seances, mentorat-notes,
   cap-ateliers, cap-orientation, mentor-disponible.
   ===================================================================== */

const MENTOR_CONNECTE = MENTORS[0]; // Cheikh Fall : le mentor de l’espace mentor de démo
const JEUNE_CONNECTE_ID = "mame-diarra-sene"; // la jeune de l’espace Cap Métier de démo

const ETAPES_CAP = [
  { id: "bilan", label: "Bilan d’orientation", texte: "Ce que vous aimez, vos forces, vos contraintes." },
  { id: "piste", label: "Choix d’une piste métier", texte: "Un ou deux métiers à explorer." },
  { id: "decouverte", label: "Découverte et formation", texte: "Ateliers, rencontres avec des professionnels, bases du métier." },
  { id: "apprentissage", label: "Apprentissage ou stage", texte: "Apprendre auprès d’un professionnel, possible dès 15 ans." },
  { id: "projet", label: "Projet prêt", texte: "Vers l’emploi ou une activité à son compte, à partir de 18 ans." },
];

const FORMATS_SEANCE = ["Visio", "Téléphone", "Au bureau de Dakar", "En groupe, au bureau de Dakar"];
const FORMATS_SEANCE_MINEUR = ["Au bureau de Dakar", "En groupe, au bureau de Dakar"];
const HEURES_SEANCE = ["10 h", "14 h", "16 h", "18 h"];

const JEUNES_CAP_INITIAL = [
  { id: "mame-diarra-sene", nom: "Mame Diarra Sène", naissance: "2010-03-12", ville: "Pikine", telephone: "+221 77 000 11 22", parent: { nom: "Ndèye Sène", lien: "Mère", telephone: "+221 77 000 12 34", accord: "Confirmé" }, etape: 2, piste: "Couture et stylisme", mentorId: "cheikh-fall", souhait: "", inscription: "2 septembre 2026", objectifs: ["Choisir entre la couture et la coiffure", "Trouver un atelier d’apprentissage à Pikine"] },
  { id: "serigne-mbaye", nom: "Serigne Mbaye", naissance: "2004-01-15", ville: "Dakar, Médina", telephone: "+221 78 000 22 33", parent: null, etape: 3, piste: "Électricité bâtiment", mentorId: "cheikh-fall", souhait: "", inscription: "10 juin 2026", objectifs: ["Terminer l’apprentissage chez un électricien de la Médina", "Préparer un CV pour les entreprises du BTP"] },
  { id: "ousmane-diatta", nom: "Ousmane Diatta", naissance: "2007-06-02", ville: "Ziguinchor", telephone: "+221 76 000 33 44", parent: null, etape: 1, piste: "Mécanique auto et moto", mentorId: null, souhait: "Un professionnel de la mécanique ou du froid", inscription: "28 septembre 2026", objectifs: [] },
  { id: "fatoumata-kane", nom: "Fatoumata Kane", naissance: "2009-11-20", ville: "Thiès", telephone: "+221 77 000 44 55", parent: { nom: "Abdou Kane", lien: "Père", telephone: "+221 77 000 45 67", accord: "En attente" }, etape: 0, piste: "", mentorId: null, souhait: "Quelqu’un qui travaille dans la santé", inscription: "12 octobre 2026", objectifs: [] },
  { id: "lamine-badji", nom: "Lamine Badji", naissance: "2008-02-28", ville: "Kaolack", telephone: "+221 70 000 55 66", parent: null, etape: 0, piste: "", mentorId: null, souhait: "Quelqu’un qui connaît l’agriculture", inscription: "8 octobre 2026", objectifs: [] },
  { id: "aicha-faye", nom: "Aïcha Faye", naissance: "2006-09-05", ville: "Rufisque", telephone: "+221 76 000 66 77", parent: null, etape: 4, piste: "Cuisine et pâtisserie", mentorId: "aminata-ndiaye", souhait: "", inscription: "3 mars 2026", objectifs: ["Ouvrir l’espace chercheur d’emploi", "Postuler dans les pâtisseries de Rufisque et de Dakar"] },
];

/* Chercheurs d’emploi suivis par le mentor connecté (en plus des jeunes Cap Métier) */
const MENTORES_CHERCHEURS = [
  { id: "absatou-diallo", nom: "Absatou Diallo", parcours: "Chercheuse d’emploi", ville: "Dakar", objectif: "Décrocher un poste de chargée de clientèle", depuis: "2 juillet 2026", candidatures: CANDIDATURES },
  { id: "pape-ndiaye", nom: "Pape Ndiaye", parcours: "Jeune diplômé en comptabilité", ville: "Dakar, Grand Yoff", objectif: "Trouver un premier poste d’assistant comptable", depuis: "15 septembre 2026", candidatures: [{ poste: "Assistant comptable", entreprise: "Cabinet Diop & Associés", date: "5 octobre 2026", statut: "Vue par le recruteur" }] },
];

const NOTES_MENTORAT_INITIAL = {
  "absatou-diallo": MENTORS[0].historique,
  "mame-diarra-sene": [
    { date: "3 octobre 2026", note: "Atelier découverte couture, en groupe : très motivée, à l’aise avec la machine. Prochaine étape : rencontrer une couturière de Pikine qui prend des apprentis." },
    { date: "19 septembre 2026", note: "Bilan d’orientation au bureau, avec sa mère : intérêt pour la couture et la coiffure. Elle veut continuer les cours du soir." },
  ],
  "serigne-mbaye": [{ date: "6 octobre 2026", note: "Point d’étape : l’apprentissage se passe bien. Il note chaque chantier pour préparer son CV." }],
};

const SEANCES_INITIAL = [
  { id: "se1", mentoreId: "absatou-diallo", date: "2026-10-16", heure: "16 h", format: "Visio", statut: "Confirmée" }, // même créneau que le « prochain coaching » vu par Absatou (nextSlots)
  { id: "se2", mentoreId: "mame-diarra-sene", date: "2026-10-17", heure: "10 h", format: "En groupe, au bureau de Dakar", statut: "Confirmée" },
  { id: "se3", mentoreId: "serigne-mbaye", date: "2026-10-20", heure: "18 h", format: "Visio", statut: "Demandée", message: "Je voudrais qu’on travaille mon CV ensemble." },
  { id: "se4", mentoreId: "pape-ndiaye", date: "2026-10-22", heure: "16 h", format: "Téléphone", statut: "Demandée", message: "Préparer mon entretien au cabinet Diop & Associés." },
];

const ATELIERS_CAP = [
  { id: "at-couture", titre: "Découvrir la couture", lieu: "Bureau LIGGEEY, Dakar", date: "2026-10-24", heure: "10 h – 12 h", places: 12, texte: "Prendre en main une machine à coudre et réaliser une première pièce simple." },
  { id: "at-numerique", titre: "Les métiers du numérique", lieu: "En ligne", date: "2026-10-28", heure: "16 h – 17 h", places: 30, texte: "Graphisme, réseaux sociaux, maintenance informatique : qui fait quoi, et comment s’y former ?" },
  { id: "at-cuisine", titre: "Cuisine et pâtisserie", lieu: "Bureau LIGGEEY, Dakar", date: "2026-11-07", heure: "10 h – 12 h", places: 10, texte: "Rencontrer une pâtissière et découvrir le travail en cuisine." },
  { id: "at-electricite", titre: "Électricité : le métier et la sécurité", lieu: "Bureau LIGGEEY, Dakar", date: "2026-11-14", heure: "10 h – 12 h", places: 12, texte: "Comprendre le métier, ses risques et les règles de sécurité.", noteMineur: "Avant 18 ans : démonstration seulement, sans manipulation." },
];

const GOUTS_ORIENTATION = [
  { id: "mains", label: "Travailler avec mes mains" },
  { id: "creer", label: "Créer, dessiner, décorer" },
  { id: "aider", label: "Aider et prendre soin des autres" },
  { id: "cuisine", label: "Cuisiner" },
  { id: "reparer", label: "Réparer, comprendre comment ça marche" },
  { id: "numerique", label: "Le téléphone, l’ordinateur, internet" },
  { id: "dehors", label: "Être dehors, la nature" },
  { id: "vendre", label: "Parler aux gens, vendre" },
];

/* dangereux : apprentissage possible dès 15 ans, mais certaines tâches sont interdites avant 18 ans */
const PISTES_METIER = [
  { id: "couture", nom: "Couture et stylisme", gouts: ["mains", "creer"] },
  { id: "coiffure", nom: "Coiffure et esthétique", gouts: ["creer", "aider", "vendre"] },
  { id: "patisserie", nom: "Cuisine et pâtisserie", gouts: ["cuisine", "mains"] },
  { id: "mecanique", nom: "Mécanique auto et moto", gouts: ["reparer", "mains"], dangereux: true },
  { id: "electricite", nom: "Électricité bâtiment", gouts: ["reparer", "mains"], dangereux: true },
  { id: "froid", nom: "Froid et climatisation", gouts: ["reparer"], dangereux: true },
  { id: "maintenance", nom: "Maintenance informatique et téléphones", gouts: ["numerique", "reparer"] },
  { id: "graphisme", nom: "Graphisme et réseaux sociaux", gouts: ["numerique", "creer", "vendre"] },
  { id: "agriculture", nom: "Agriculture et maraîchage", gouts: ["dehors", "mains"] },
  { id: "aide-personne", nom: "Aide à la personne", gouts: ["aider"] },
  { id: "commerce", nom: "Vente et commerce", gouts: ["vendre"] },
];

const CHARTE_MENTOR = [
  "J’échange avec les jeunes uniquement par LIGGEEY : messagerie et séances prévues.",
  "Avec un jeune de moins de 18 ans, je le rencontre seulement en groupe ou au bureau de Dakar.",
  "Je ne demande jamais d’argent, de service ni de photo.",
  "Je garde pour moi ce que le jeune me confie, sauf s’il est en danger.",
  "Je signale à l’équipe LIGGEEY toute situation préoccupante.",
];

function estMineur(j) {
  const age = ageAu(j.naissance);
  return age !== null && age < AGE_MAJORITE;
}

function statutCap(j) {
  if (j.parent && j.parent.accord !== "Confirmé") return "Accord parental en attente";
  if (!j.mentorId) return "Mentor à attribuer";
  if (j.etape >= ETAPES_CAP.length - 1) return "Projet prêt";
  return "Accompagné";
}

function dateLongue(iso) {
  const d = new Date(`${iso}T12:00:00`);
  const t = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).replace(/ 1 /, " 1er ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function dateDuJourLongue() {
  return dateFr(demoNow());
}

function dateMajorite(naissance) {
  const [a, m, j] = naissance.split("-").map(Number);
  return dateFr(new Date(a + AGE_MAJORITE, m - 1, j));
}

// Tri des séances par date puis par heure (« 9 h » avant « 16 h »).
const heureTri = (h) => String(parseInt(h, 10) || 0).padStart(2, "0");
const parDate = (a, b) => (a.date + heureTri(a.heure)).localeCompare(b.date + heureTri(b.heure));

/* Mentorés d’un mentor : jeunes Cap Métier attribués, et chercheurs d’emploi pour le mentor de démo */
function mentoresDe(mentorId, jeunes) {
  return [
    ...jeunes.filter((j) => j.mentorId === mentorId).map((j) => ({ id: j.id, nom: j.nom, type: "Cap Métier", sous: j.piste ? `Cap Métier · ${j.piste}` : "Cap Métier", mineur: estMineur(j), age: ageAu(j.naissance), jeune: j })),
    ...(mentorId === MENTOR_CONNECTE.id ? MENTORES_CHERCHEURS : []).map((c) => ({ id: c.id, nom: c.nom, type: "Chercheur", sous: c.parcours, mineur: false, chercheur: c })),
  ];
}

function nomMentore(id, jeunes) {
  return (jeunes.find((j) => j.id === id) || MENTORES_CHERCHEURS.find((c) => c.id === id))?.nom || "Mentoré";
}

function BadgeMineur({ age }) {
  return <App.Badge ton="info" taille="moyen">Mineur · {age} ans</App.Badge>;
}

/* Étapes du parcours Cap Métier (liste verticale) */
function EtapesCap({ etape }) {
  return (
    <ol className="space-y-1">
      {ETAPES_CAP.map((e, i) => {
        const fait = i < etape;
        const enCours = i === etape;
        return (
          <li key={e.id} aria-current={enCours ? "step" : undefined} className={`flex items-start gap-3 rounded-md p-3 ${enCours ? "bg-marque-doux" : ""}`}>
            <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${fait ? "bg-statut-succes-doux text-statut-succes" : enCours ? "bg-marque text-sur-marque" : "bg-doux-fort text-secondaire"}`}>
              {fait ? <Check size={14} aria-hidden="true" /> : i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-principal">
                {e.label}
                {fait && <span className="sr-only"> (terminée)</span>}
                {enCours && <span className="ml-2 text-xs font-medium text-marque">En cours</span>}
              </span>
              <span className="block text-sm text-secondaire">{e.texte}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* Rappel des règles pour les moins de 18 ans */
function NoteMineur({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-statut-info-doux p-4 text-sm text-principal">
      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-statut-info" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function useJeuneConnecte() {
  const [jeunes, setJeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const moi = jeunes.find((j) => j.id === JEUNE_CONNECTE_ID) || jeunes[0];
  const majMoi = (patch) => setJeunes((l) => l.map((j) => (j.id === moi.id ? { ...j, ...(typeof patch === "function" ? patch(j) : patch) } : j)));
  return { moi, majMoi, jeunes };
}

/* ---------- Cap Métier (jeune) : mon parcours ---------- */

function CapParcoursScreen({ onNavigate, todos }) {
  const { moi } = useJeuneConnecte();
  const [seances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const mentor = MENTORS.find((m) => m.id === moi.mentorId);
  const prochaine = seances.filter((s) => s.mentoreId === moi.id && s.statut === "Confirmée").sort(parDate)[0];
  const mineur = estMineur(moi);
  const progression = Math.round((moi.etape / (ETAPES_CAP.length - 1)) * 100);

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Votre parcours pour trouver un métier qui vous ressemble, étape par étape.</p>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte titre="Mes étapes" sousTitre={`Étape ${moi.etape + 1} sur ${ETAPES_CAP.length}`} className="xl:col-span-2">
          <App.BarreProgression valeur={progression} label={`Parcours avancé à ${progression} %`} />
          <div className="mt-4">
            <EtapesCap etape={moi.etape} />
          </div>
        </App.Carte>

        <div className="space-y-4">
          <App.Carte titre="Mon mentor">
            {mentor ? (
              <div className="flex flex-col items-center text-center">
                <SafeImg src={mentor.photo} alt={mentor.nom} className="mb-3 h-20 w-20 rounded-full object-cover" />
                <p className="font-semibold text-principal">{mentor.nom}</p>
                <p className="mb-4 text-sm text-discret">{mentor.role}</p>
                <p className="mb-4 w-full rounded-md bg-doux p-3 text-sm">
                  <span className="block text-xs text-discret">Prochaine séance</span>
                  <span className="block font-semibold text-principal">{prochaine ? `${dateLongue(prochaine.date)} · ${prochaine.heure}` : "Aucune séance prévue"}</span>
                  {prochaine && <span className="block text-xs text-secondaire">{prochaine.format}</span>}
                </p>
                <App.Bouton pleineLargeur variante="neutre" onClick={() => onNavigate("mentor")}>Voir mon mentor</App.Bouton>
              </div>
            ) : (
              <App.EtatVide icone={UsersRound} titre="Mentor en cours d’attribution" texte="L’équipe LIGGEEY choisit le mentor qui vous correspond." />
            )}
          </App.Carte>

          <App.Carte titre="Mes objectifs">
            {moi.objectifs.length ? (
              <ul className="space-y-2">
                {moi.objectifs.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-principal">
                    <Flag size={15} className="mt-0.5 shrink-0 text-marque" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-secondaire">Vous fixerez vos objectifs avec votre mentor, lors de votre première séance.</p>
            )}
          </App.Carte>
        </div>
      </div>

      {mineur && moi.parent && (
        <NoteMineur>
          {moi.parent.accord === "Confirmé"
            ? `${moi.parent.nom} (${moi.parent.lien.toLowerCase()}) a donné son accord et reçoit un SMS avant chaque séance. `
            : `Nous attendons l’accord de ${moi.parent.nom}. `}
          Avant 18 ans, vos séances ont lieu en groupe ou au bureau de Dakar. À partir du {dateMajorite(moi.naissance)}, vous pourrez aussi ouvrir l’espace emploi ou l’espace prestataire.
        </NoteMineur>
      )}

      <TodoPanel items={todos} onNavigate={onNavigate} />
    </div>
  );
}

/* ---------- Cap Métier (jeune) : bilan d’orientation ---------- */

function CapOrientationScreen({ onNavigate }) {
  const { moi, majMoi } = useJeuneConnecte();
  const [gouts, setGouts] = useStore("cap-orientation", ["mains", "creer"]);
  const mineur = estMineur(moi);
  const pistes = PISTES_METIER.map((p) => ({ ...p, score: p.gouts.filter((g) => gouts.includes(g)).length }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  function basculer(id) {
    setGouts((l) => (l.includes(id) ? l.filter((g) => g !== id) : [...l, id]));
  }
  function choisir(p) {
    majMoi((j) => ({ piste: p.nom, etape: Math.max(j.etape, 2) }));
    notify(`Piste « ${p.nom} » enregistrée. Vous en parlerez avec votre mentor.`);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Il n’y a pas de bonne ou de mauvaise réponse. Choisissez ce qui vous plaît vraiment : nous vous proposons des pistes métier.</p>

      <App.Carte titre="Ce que vous aimez" sousTitre="Plusieurs choix possibles">
        <div className="flex flex-wrap gap-2">
          {GOUTS_ORIENTATION.map((g) => {
            const actif = gouts.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={actif}
                onClick={() => basculer(g.id)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${actif ? "border-marque bg-marque-doux text-marque-fort" : "border-base bg-surface text-secondaire hover:bg-doux hover:text-principal"}`}
              >
                {actif && <Check size={14} aria-hidden="true" />}
                {g.label}
              </button>
            );
          })}
        </div>
      </App.Carte>

      <App.Carte titre="Des pistes métier pour vous">
        {pistes.length === 0 ? (
          <App.EtatVide icone={Compass} titre="Choisissez au moins une réponse" texte="Vos pistes métier apparaîtront ici." />
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {pistes.map((p) => {
              const choisie = moi.piste === p.nom;
              return (
                <li key={p.id} className={`flex flex-col gap-3 rounded-lg border p-4 ${choisie ? "border-marque bg-marque-doux" : "border-base"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-principal">{p.nom}</p>
                    {choisie && <App.Badge ton="succes" taille="moyen">Ma piste</App.Badge>}
                  </div>
                  {p.dangereux && mineur && (
                    <p className="text-xs text-secondaire">Apprentissage possible dès 15 ans. Certaines tâches sont interdites avant 18 ans : votre maître d’apprentissage doit les respecter.</p>
                  )}
                  {!choisie && (
                    <App.Bouton petit variante="doux" onClick={() => choisir(p)}>Choisir cette piste</App.Bouton>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </App.Carte>

      <div className="flex flex-wrap gap-3">
        <App.Bouton variante="neutre" onClick={() => onNavigate("ateliers")}>Voir les ateliers découverte</App.Bouton>
      </div>
    </div>
  );
}

/* ---------- Cap Métier (jeune) : ateliers découverte ---------- */

function CapAteliersScreen() {
  const { moi } = useJeuneConnecte();
  const [inscrits, setInscrits] = useStore("cap-ateliers", ["at-couture"]);
  const [vue, setVue] = useState("tous");
  const [query, setQuery] = useState("");
  const mineur = estMineur(moi);

  function basculer(a) {
    if (inscrits.includes(a.id)) {
      setInscrits((l) => l.filter((x) => x !== a.id));
      notify("Inscription annulée.", "info");
    } else {
      setInscrits((l) => [...l, a.id]);
      notify(mineur ? "Inscription enregistrée. Votre parent ou tuteur est prévenu par SMS." : "Inscription enregistrée.");
    }
  }

  const q = sansAccents(query.trim());
  const filtered = ATELIERS_CAP.filter((a) =>
    (vue === "tous" || inscrits.includes(a.id)) &&
    (!q || sansAccents([a.titre, a.texte, a.lieu].join(" ")).includes(q)));
  const pagination = usePaginationListe(filtered);

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Des ateliers courts pour découvrir un métier avant de vous lancer, avec des professionnels.</p>

      <BarreFiltres label="Rechercher un atelier">
        <App.ChampRecherche
          variante="carre"
          valeur={query}
          onChange={(v) => { setQuery(v); pagination.setPage(1); }}
          placeholder="Métier ou lieu…"
          label="Rechercher un atelier"
          className="w-full lg:flex-1"
        />
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Afficher"
          actif={vue}
          onChange={(v) => { setVue(v); pagination.setPage(1); }}
          options={[
            { id: "tous", label: `Tous (${ATELIERS_CAP.length})` },
            { id: "mes", label: `Mes inscriptions (${ATELIERS_CAP.filter((a) => inscrits.includes(a.id)).length})` },
          ]}
        />
        <CompteResultats n={filtered.length} nom="atelier" />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((a) => {
            const inscrit = inscrits.includes(a.id);
            return (
              <CarteListe
                key={a.id}
                visuel={<VisuelDate iso={a.date} />}
                titre={a.titre}
                badges={inscrit && <App.Badge ton="succes" point taille="moyen">Inscrit</App.Badge>}
                sousTitre={a.texte}
                meta={<>
                  <MetaOffre icone={Clock}>{dateLongue(a.date)} · {a.heure}</MetaOffre>
                  <MetaOffre icone={MapPin}>{a.lieu}</MetaOffre>
                  <MetaOffre icone={UsersRound}>{a.places} places</MetaOffre>
                </>}
                actions={
                  <App.Bouton petit variante={inscrit ? "neutre" : "principal"} onClick={() => basculer(a)}>
                    {inscrit ? "Annuler mon inscription" : "M’inscrire"}
                  </App.Bouton>
                }
              >
                {mineur && a.noteMineur && <p className="mt-3 text-xs font-medium text-statut-info">{a.noteMineur}</p>}
              </CarteListe>
            );
          })}
        </div>
      ) : (
        <ListeVide
          icone={GraduationCap}
          titre={vue === "mes" && !q ? "Vous n’êtes inscrit à aucun atelier" : "Aucun atelier ne correspond"}
          texte={vue === "mes" && !q ? "Choisissez un atelier pour découvrir un métier." : "Essayez un autre mot-clé."}
          action={<App.Bouton petit variante="neutre" onClick={() => { setVue("tous"); setQuery(""); }}>Voir tous les ateliers</App.Bouton>}
        />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Cap Métier (jeune) : mon mentor ---------- */

function DemandeSeanceForm({ mineur, onEnvoyer, libelle = "Envoyer ma demande", avecMessage = true }) {
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState(HEURES_SEANCE[0]);
  const formats = mineur ? FORMATS_SEANCE_MINEUR : FORMATS_SEANCE;
  const [format, setFormat] = useState(formats[0]);
  const [message, setMessage] = useState("");
  const [essai, setEssai] = useState(false);
  const uid = React.useId();

  function envoyer(e) {
    e.preventDefault();
    setEssai(true);
    if (!date) return;
    onEnvoyer({ date, heure, format, message: message.trim() });
    setDate("");
    setMessage("");
    setEssai(false);
  }

  return (
    <form onSubmit={envoyer} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Champ id={`${uid}-date`} label="Date" requis erreur={essai && !date ? "Choisissez une date." : null} large>
          <input id={`${uid}-date`} type="date" value={date} min={isoDuJour()} onChange={(e) => setDate(e.target.value)} aria-required="true" aria-invalid={(essai && !date) || undefined} aria-describedby={essai && !date ? `${uid}-date-aide` : undefined} className={FORM.champ(essai && !date)} />
        </Champ>
        <Champ id={`${uid}-heure`} label="Heure">
          <ListeChamp id={`${uid}-heure`} value={heure} onChange={(e) => setHeure(e.target.value)}>
            {HEURES_SEANCE.map((h) => <option key={h}>{h}</option>)}
          </ListeChamp>
        </Champ>
        <Champ id={`${uid}-format`} label="Format" large aide={mineur ? "Avant 18 ans, les séances ont lieu au bureau de Dakar ou en groupe." : null}>
          <ListeChamp id={`${uid}-format`} value={format} onChange={(e) => setFormat(e.target.value)} aria-describedby={mineur ? `${uid}-format-aide` : undefined}>
            {formats.map((f) => <option key={f}>{f}</option>)}
          </ListeChamp>
        </Champ>
        {avecMessage && (
          <Champ id={`${uid}-message`} label="Message (facultatif)" large>
            <textarea id={`${uid}-message`} value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={FORM.zone()} />
          </Champ>
        )}
      </div>
      <div className="mt-5">
        <App.Bouton type="submit">{libelle}</App.Bouton>
      </div>
    </form>
  );
}

function ListeSeances({ seances, jeunes, avecNom = false, actions }) {
  if (seances.length === 0) return <p className="text-sm text-secondaire">Aucune séance pour le moment.</p>;
  return (
    <ul className="divide-y divide-base">
      {seances.map((s) => (
        <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            {avecNom && <p className="text-sm font-semibold text-principal">{nomMentore(s.mentoreId, jeunes)}</p>}
            <p className={`text-sm ${avecNom ? "text-secondaire" : "font-semibold text-principal"}`}>{dateLongue(s.date)} · {s.heure}</p>
            <p className="text-xs text-discret">{s.format}</p>
            {s.message && <p className="mt-1 text-sm italic text-secondaire">« {s.message} »</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={s.statut} />
            {actions && actions(s)}
          </div>
        </li>
      ))}
    </ul>
  );
}

function CapMentorScreen() {
  const { moi, majMoi } = useJeuneConnecte();
  const [seances, setSeances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const [notes] = useStore("mentorat-notes", NOTES_MENTORAT_INITIAL);
  const [souhait, setSouhait] = useState(moi.souhait || "");
  const mentor = MENTORS.find((m) => m.id === moi.mentorId);
  const mineur = estMineur(moi);
  const mesSeances = seances.filter((s) => s.mentoreId === moi.id && ["Confirmée", "Demandée"].includes(s.statut)).sort(parDate);
  const mesNotes = notes[moi.id] || [];

  if (!mentor) {
    return (
      <div className="space-y-6">
        <App.Carte titre="Demander un mentor">
          <p className="mb-4 text-sm text-secondaire">Dites-nous quel professionnel vous aimeriez rencontrer. L’équipe LIGGEEY choisit votre mentor et vous prévient.</p>
          <label htmlFor="souhait-mentor" className={AUTH.libelle}>Le mentor que vous souhaitez</label>
          <textarea id="souhait-mentor" value={souhait} onChange={(e) => setSouhait(e.target.value)} rows={3} placeholder="Ex. : une couturière qui a son propre atelier" className={FORM.zone()} />
          <div className="mt-4">
            <App.Bouton onClick={() => { majMoi({ souhait: souhait.trim() }); notify("Demande envoyée. L’équipe LIGGEEY vous propose un mentor dès que possible."); }}>Envoyer ma demande</App.Bouton>
          </div>
        </App.Carte>
        {mineur && moi.parent?.accord !== "Confirmé" && <NoteMineur>Votre mentor sera attribué dès que votre parent ou tuteur aura confirmé son accord.</NoteMineur>}
      </div>
    );
  }

  const profil = mentorProfile(mentor);
  const prochaine = mesSeances[0];

  return (
    <div className="space-y-6">
      <EnTeteFiche
        visuel={<AvatarListe nom={mentor.nom} photo={mentor.photo} taille="lg" />}
        badges={<App.Badge ton="succes" taille="moyen"><BadgeCheck size={13} aria-hidden="true" /> Mentor vérifié par LIGGEEY</App.Badge>}
        titre={mentor.nom}
        sousTitre={`${mentor.role} · ${mentor.exp} ans d’expérience`}
        meta={<>
          <MetaOffre icone={MessageCircle}>{profil.langues.join(", ")}</MetaOffre>
          {prochaine && <MetaOffre icone={CalendarDays}>Prochaine séance : {dateLongue(prochaine.date)} · {prochaine.heure}</MetaOffre>}
        </>}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Mes séances" sousTitre={`${mesSeances.length} séance${mesSeances.length > 1 ? "s" : ""} prévue${mesSeances.length > 1 ? "s" : ""} ou demandée${mesSeances.length > 1 ? "s" : ""}`}>
            <ListeSeances seances={mesSeances} jeunes={[moi]} />
          </App.Carte>
          <App.Carte titre="Demander une séance">
            <DemandeSeanceForm
              mineur={mineur}
              onEnvoyer={(s) => {
                setSeances((l) => [...l, { id: `se${Date.now()}`, mentoreId: moi.id, statut: "Demandée", ...s }]);
                notify(mineur ? `Demande envoyée à ${mentor.nom}. Votre parent ou tuteur est prévenu par SMS.` : `Demande envoyée à ${mentor.nom}.`);
              }}
            />
          </App.Carte>
          <App.Carte titre="Comptes rendus de mon mentor">
            {mesNotes.length === 0 ? (
              <p className="text-sm text-secondaire">Après chaque séance, votre mentor écrit ici ce que vous avez vu ensemble.</p>
            ) : (
              <ul className="space-y-4">
                {mesNotes.map((n) => (
                  <li key={n.date + n.note} className="border-l-2 border-marque pl-4">
                    <p className="text-xs font-semibold text-discret">{n.date}</p>
                    <p className="text-sm text-principal">{n.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </App.Carte>
        </>}
        cote={<>
          <ApercuFiche
            titre="Aperçu du mentor"
            items={[
              { icone: Briefcase, libelle: "Métier", valeur: mentor.role },
              { icone: TrendingUp, libelle: "Expérience", valeur: `${mentor.exp} ans` },
              { icone: MessageCircle, libelle: "Langues", valeur: profil.langues.join(", ") },
              { icone: Video, libelle: "Séances", valeur: (mineur ? FORMATS_SEANCE_MINEUR : FORMATS_SEANCE).join(", ") },
            ]}
          />
          {mentor.tagline && (
            <App.Carte titre="À propos">
              <p className="text-sm leading-[1.7] text-secondaire">{mentor.tagline}</p>
            </App.Carte>
          )}
          {mineur && <NoteMineur>Un souci avec une séance ou avec votre mentor ? Parlez-en à votre parent ou écrivez à l’équipe LIGGEEY sur WhatsApp : nous sommes là pour vous protéger.</NoteMineur>}
        </>}
      />
    </div>
  );
}

/* ---------- Cap Métier (jeune) : mon profil ---------- */

function CapProfilScreen({ onNavigate = () => {} }) {
  const { moi } = useJeuneConnecte();
  const [inscrits] = useStore("cap-ateliers", ["at-couture"]);
  const [seances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const [notes] = useStore("mentorat-notes", NOTES_MENTORAT_INITIAL);
  const age = ageAu(moi.naissance);
  const mineur = age < AGE_MAJORITE;
  const naissance = dateFr(new Date(`${moi.naissance}T12:00:00`));
  const mentor = MENTORS.find((m) => m.id === moi.mentorId);
  const mesAteliers = ATELIERS_CAP.filter((a) => inscrits.includes(a.id));
  const mesSeances = seances.filter((s) => s.mentoreId === moi.id && ["Confirmée", "Demandée"].includes(s.statut));
  const mesNotes = notes[moi.id] || [];
  const etape = ETAPES_CAP[Math.min(moi.etape, ETAPES_CAP.length - 1)];

  return (
    <div className="space-y-6">
      <EnTeteFiche
        visuel={<AvatarListe nom={moi.nom} taille="lg" />}
        badges={<>
          <App.Badge ton="marque" taille="moyen">Cap Métier</App.Badge>
          {mineur && <BadgeMineur age={age} />}
          {moi.parent && <StatusBadge status={moi.parent.accord === "Confirmé" ? "Accord confirmé" : "Accord en attente"} />}
        </>}
        titre={moi.nom}
        sousTitre={moi.piste ? `Piste métier : ${moi.piste}` : "Piste métier à choisir avec votre mentor"}
        meta={<>
          <MetaOffre icone={MapPin}>{moi.ville}</MetaOffre>
          <MetaOffre icone={CalendarCheck}>Inscription : {moi.inscription}</MetaOffre>
        </>}
      />

      <ChiffresProfil
        items={[
          { icone: Flag, valeur: `${moi.etape + 1} / ${ETAPES_CAP.length}`, label: "Étape du parcours", detail: etape.label, onClick: () => onNavigate("dashboard") },
          { icone: GraduationCap, valeur: mesAteliers.length, label: "Ateliers réservés", detail: "Voir les ateliers", ton: "info", onClick: () => onNavigate("ateliers") },
          { icone: CalendarDays, valeur: mesSeances.length, label: "Séances avec mon mentor", detail: "Prévues ou demandées", ton: "alerte", onClick: () => onNavigate("mentor") },
          { icone: FileText, valeur: mesNotes.length, label: "Comptes rendus", detail: "Écrits par votre mentor", ton: "succes", onClick: () => onNavigate("mentor") },
        ]}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="Mon parcours" sousTitre={moi.piste ? `Piste : ${moi.piste}` : "Piste métier à choisir"}>
            <EtapesCap etape={moi.etape} />
            <p className="mb-2 mt-4 text-sm font-semibold text-principal">Mes objectifs</p>
            {moi.objectifs.length === 0 ? (
              <p className="text-sm text-secondaire">Vous les fixerez avec votre mentor.</p>
            ) : (
              <ListeCoches items={moi.objectifs} />
            )}
          </App.Carte>

          <App.Carte titre="Mes ateliers" actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("ateliers")}>Voir les ateliers</App.Bouton>} flush>
            {mesAteliers.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-secondaire">Vous n’êtes inscrit à aucun atelier pour le moment.</p>
            ) : (
              <ul className="divide-y divide-base border-t border-base">
                {mesAteliers.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 px-6 py-4">
                    <VisuelDate iso={a.date} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-principal">{a.titre}</p>
                      <p className="truncate text-xs text-discret">{a.heure} · {a.lieu}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </App.Carte>

          <App.Carte titre="Mon mentor">
            {mentor ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <AvatarListe nom={mentor.nom} photo={mentor.photo} />
                  <div className="min-w-0">
                    <p className="font-semibold text-principal">{mentor.nom}</p>
                    <p className="text-sm text-discret">{mentor.role} · {mentor.exp} ans d’expérience</p>
                  </div>
                </div>
                <App.Bouton petit variante="neutre" onClick={() => onNavigate("mentor")}>Voir mon mentor</App.Bouton>
              </div>
            ) : (
              <p className="text-sm text-secondaire">
                {mineur && moi.parent?.accord !== "Confirmé"
                  ? "Votre mentor sera attribué dès que votre parent ou tuteur aura confirmé son accord."
                  : "L’équipe LIGGEEY choisit votre mentor et vous prévient."}
              </p>
            )}
          </App.Carte>
        </>}
        cote={<>
          <ApercuFiche
            titre="Mes informations"
            items={[
              { icone: Calendar, libelle: "Date de naissance", valeur: `${naissance} (${age} ans)` },
              { icone: MapPin, libelle: "Ville", valeur: moi.ville },
              { icone: Phone, libelle: "Téléphone", valeur: moi.telephone },
              { icone: CalendarCheck, libelle: "Inscription", valeur: moi.inscription },
            ]}
          />
          {moi.parent && (
            <App.Carte titre="Mon parent ou tuteur" actions={<StatusBadge status={moi.parent.accord === "Confirmé" ? "Accord confirmé" : "Accord en attente"} />}>
              <div className="divide-y divide-dashed divide-base">
                <App.LigneInfo icone={UserCircle2} libelle="Nom">{moi.parent.nom}</App.LigneInfo>
                <App.LigneInfo icone={HeartHandshake} libelle="Lien">{moi.parent.lien}</App.LigneInfo>
                <App.LigneInfo icone={Phone} libelle="Téléphone">{moi.parent.telephone}</App.LigneInfo>
              </div>
            </App.Carte>
          )}
          <App.Carte titre="À 18 ans">
            <p className="text-sm text-secondaire">
              {mineur
                ? `À partir du ${dateMajorite(moi.naissance)}, vous pourrez ouvrir l’espace emploi pour postuler aux offres, ou l’espace prestataire pour travailler à votre compte. Votre parcours Cap Métier vous suivra.`
                : "Vous pouvez ouvrir l’espace emploi ou l’espace prestataire. Votre mentor vous aide à choisir."}
            </p>
          </App.Carte>
        </>}
      />
    </div>
  );
}

/* ---------- Espace mentor : tableau de bord ---------- */

function MentorDashboardScreen({ onNavigate, todos }) {
  const [jeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const [seances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const mentores = mentoresDe(MENTOR_CONNECTE.id, jeunes);
  const ids = new Set(mentores.map((m) => m.id));
  const miennes = seances.filter((s) => ids.has(s.mentoreId));
  const aVenir = miennes.filter((s) => s.statut === "Confirmée").sort(parDate);
  const demandes = miennes.filter((s) => s.statut === "Demandée");

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Voici les jeunes que vous accompagnez et vos prochaines séances.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users2} value={mentores.length} label="Mentorés" detail={`Dont ${mentores.filter((m) => m.type === "Cap Métier").length} en Cap Métier`} onClick={() => onNavigate("mentores")} />
        <StatCard icon={CalendarCheck} value={aVenir.length} label="Séances à venir" detail="Confirmées" tone="succes" onClick={() => onNavigate("seances")} />
        <StatCard icon={Bell} value={demandes.length} label="Demandes de séance" detail={demandes.length ? "À accepter ou refuser" : "Aucune en attente"} tone="alerte" onClick={() => onNavigate("seances")} />
        <StatCard icon={Clock} value={MENTOR_CONNECTE.stats.heures} label="Heures de mentorat" detail="Depuis votre arrivée" tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.Carte titre="Prochaines séances" className="xl:col-span-2" actions={<App.Bouton petit variante="doux" onClick={() => onNavigate("seances")}>Tout voir</App.Bouton>}>
          <App.Tableau
            legende="Prochaines séances de mentorat"
            lignes={aVenir}
            vide="Aucune séance confirmée."
            onLigne={(s) => onNavigate("mentores", { mentoreId: s.mentoreId })}
            colonnes={[
              { cle: "mentoreId", titre: "Mentoré", rendu: (s) => <App.CelluleIdentite visuel={<App.Avatar nom={nomMentore(s.mentoreId, jeunes)} taille="sm" />} titre={nomMentore(s.mentoreId, jeunes)} sousTitre={s.format} /> },
              { cle: "date", titre: "Date", rendu: (s) => <span className="text-principal">{dateLongue(s.date)} · {s.heure}</span> },
              { cle: "statut", titre: "Statut", rendu: (s) => <StatusBadge status={s.statut} /> },
            ]}
          />
        </App.Carte>

        <App.Carte titre="Mes mentorés" flush>
          <ul className="px-3 pb-3">
            {mentores.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => onNavigate("mentores", { mentoreId: m.id })} className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left hover:bg-doux">
                  <span className="flex min-w-0 items-center gap-3">
                    <App.Avatar nom={m.nom} taille="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-principal">{m.nom}</span>
                      <span className="block truncate text-xs text-discret">{m.sous}</span>
                    </span>
                  </span>
                  {m.mineur ? <BadgeMineur age={m.age} /> : <ChevronRight size={16} className="shrink-0 text-discret" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </App.Carte>
      </div>

      <TodoPanel items={todos} onNavigate={onNavigate} />
    </div>
  );
}

/* ---------- Espace mentor : mes mentorés ---------- */

function MentoreDetail({ mentore, onBack }) {
  const [jeunes, setJeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const [seances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const [notes, setNotes] = useStore("mentorat-notes", NOTES_MENTORAT_INITIAL);
  const [brouillon, setBrouillon] = useState("");
  const [objectif, setObjectif] = useState("");
  const jeune = mentore.jeune ? jeunes.find((j) => j.id === mentore.id) : null;
  const prenom = mentore.nom.split(" ")[0];
  const sesNotes = notes[mentore.id] || [];
  const sesSeances = seances.filter((s) => s.mentoreId === mentore.id).sort(parDate);
  const majJeune = (patch) => setJeunes((l) => l.map((j) => (j.id === mentore.id ? { ...j, ...patch } : j)));
  const ville = mentore.mineur ? "Masquée" : (jeune || mentore.chercheur).ville;
  const depuis = jeune ? jeune.inscription : mentore.chercheur.depuis;

  function ajouterNote() {
    if (!brouillon.trim()) return;
    setNotes((n) => ({ ...n, [mentore.id]: [{ date: dateDuJourLongue(), note: brouillon.trim() }, ...(n[mentore.id] || [])] }));
    setBrouillon("");
    notify(`Compte rendu enregistré. ${prenom} peut le lire dans son espace.`);
  }

  return (
    <div className="space-y-6">
      <BoutonRetour onClick={onBack}>Retour aux mentorés</BoutonRetour>

      <EnTeteFiche
        visuel={<AvatarListe nom={mentore.nom} taille="lg" />}
        badges={<>
          {mentore.mineur && <BadgeMineur age={mentore.age} />}
          <App.Badge ton="marque" taille="moyen">{mentore.type}</App.Badge>
        </>}
        titre={mentore.nom}
        sousTitre={mentore.sous}
        meta={<>
          <MetaOffre icone={MapPin}>{ville}</MetaOffre>
          <MetaOffre icone={CalendarCheck}>Suivi depuis le {depuis}</MetaOffre>
          {jeune && <MetaOffre icone={Flag}>Étape {jeune.etape + 1} / {ETAPES_CAP.length}</MetaOffre>}
        </>}
        actions={
          <App.Bouton variante="neutre" onClick={() => notify("Signalement transmis à l’équipe LIGGEEY. Elle vous recontacte rapidement.")}>
            <AlertCircle size={16} aria-hidden="true" /> Signaler une situation
          </App.Bouton>
        }
      />

      <MiseEnPageFiche
        principal={<>
          {jeune && (
            <App.Carte
              titre="Parcours Cap Métier"
              sousTitre={jeune.piste ? `Piste : ${jeune.piste}` : "Piste métier à choisir"}
              actions={jeune.etape < ETAPES_CAP.length - 1 && (
                <App.Bouton petit variante="doux" onClick={() => { majJeune({ etape: jeune.etape + 1 }); notify(`Étape « ${ETAPES_CAP[jeune.etape].label} » validée.`); }}>
                  Valider l’étape en cours
                </App.Bouton>
              )}
            >
              <EtapesCap etape={jeune.etape} />
              <p className="mb-2 mt-4 text-sm font-semibold text-principal">Objectifs</p>
              <ul className="mb-3 space-y-1.5">
                {jeune.objectifs.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-principal">
                    <Flag size={14} className="mt-0.5 shrink-0 text-marque" aria-hidden="true" />{o}
                  </li>
                ))}
                {jeune.objectifs.length === 0 && <li className="text-sm text-secondaire">Aucun objectif pour le moment.</li>}
              </ul>
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!objectif.trim()) return; majJeune({ objectifs: [...jeune.objectifs, objectif.trim()] }); setObjectif(""); }}>
                <label htmlFor="nouvel-objectif" className="sr-only">Nouvel objectif</label>
                <input id="nouvel-objectif" value={objectif} onChange={(e) => setObjectif(e.target.value)} placeholder="Ajouter un objectif" className={`${FORM.champ()} min-w-0 flex-1`} />
                <App.Bouton type="submit" variante="doux" className="min-h-[48px]"><Plus size={16} aria-hidden="true" /> Ajouter</App.Bouton>
              </form>
            </App.Carte>
          )}

          {mentore.chercheur && (
            <App.Carte titre="Candidatures" sousTitre={`Objectif : ${mentore.chercheur.objectif}`} flush>
              <ul className="divide-y divide-base border-t border-base">
                {mentore.chercheur.candidatures.map((c) => (
                  <li key={c.poste + c.entreprise} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <LogoEntreprise nom={c.entreprise} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-principal">{c.poste}</p>
                        <p className="truncate text-xs text-discret">{c.entreprise} · {c.date}</p>
                      </div>
                    </div>
                    <StatusBadge status={c.statut} />
                  </li>
                ))}
              </ul>
            </App.Carte>
          )}

          <App.Carte titre="Comptes rendus" sousTitre={`${prenom} les voit dans son espace`}>
            <label htmlFor="nouveau-compte-rendu" className={AUTH.libelle}>Nouveau compte rendu</label>
            <textarea id="nouveau-compte-rendu" value={brouillon} onChange={(e) => setBrouillon(e.target.value)} rows={3} placeholder="Ce que vous avez vu ensemble, et la prochaine étape" className={FORM.zone()} />
            <div className="mb-5 mt-3">
              <App.Bouton onClick={ajouterNote} disabled={!brouillon.trim()}>Enregistrer</App.Bouton>
            </div>
            <ul className="space-y-4">
              {sesNotes.map((n) => (
                <li key={n.date + n.note} className="border-l-2 border-marque pl-4">
                  <p className="text-xs font-semibold text-discret">{n.date}</p>
                  <p className="text-sm text-principal">{n.note}</p>
                </li>
              ))}
            </ul>
          </App.Carte>
        </>}
        cote={<>
          <ApercuFiche
            titre="Aperçu du mentoré"
            items={[
              { icone: Compass, libelle: "Parcours", valeur: mentore.type },
              { icone: MapPin, libelle: "Ville", valeur: ville },
              { icone: Phone, libelle: "Téléphone", valeur: mentore.mineur ? "Masqué" : jeune ? jeune.telephone : "Par la messagerie LIGGEEY" },
              { icone: CalendarCheck, libelle: "Suivi depuis", valeur: depuis },
            ]}
          />
          <App.Carte titre="Séances">
            <ListeSeances seances={sesSeances} jeunes={jeunes} />
          </App.Carte>
          {mentore.mineur && (
            <NoteMineur>{prenom} a moins de 18 ans. Vos échanges passent par LIGGEEY, et les séances ont lieu en groupe ou au bureau de Dakar. Son parent ou tuteur est prévenu de chaque séance.</NoteMineur>
          )}
        </>}
      />
    </div>
  );
}

function MentoresScreen({ initialId }) {
  const [jeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const mentores = mentoresDe(MENTOR_CONNECTE.id, jeunes);
  const [selectedId, setSelectedId] = useState(initialId || null);
  const [filtre, setFiltre] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const selected = mentores.find((m) => m.id === selectedId);
  const TYPES = [
    { id: "tous", label: "Tous", test: () => true },
    { id: "cap", label: "Cap Métier", test: (m) => m.type === "Cap Métier" },
    { id: "chercheur", label: "Chercheurs d’emploi", test: (m) => m.type === "Chercheur" },
  ];
  const q = sansAccents(recherche.trim());
  const liste = mentores.filter((m) => TYPES.find((t) => t.id === filtre).test(m) && (!q || sansAccents(m.nom + " " + m.sous).includes(q)));
  const pagination = usePaginationListe(liste);

  if (selected) return <MentoreDetail mentore={selected} onBack={() => setSelectedId(null)} />;

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Les jeunes que l’équipe LIGGEEY vous a confiés.</p>

      <BarreFiltres label="Rechercher un mentoré">
        <App.ChampRecherche
          variante="carre"
          valeur={recherche}
          onChange={(v) => { setRecherche(v); pagination.setPage(1); }}
          placeholder="Nom ou parcours…"
          label="Rechercher un mentoré"
          className="w-full lg:flex-1"
        />
      </BarreFiltres>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <App.Segments
          label="Type de parcours"
          actif={filtre}
          onChange={(v) => { setFiltre(v); pagination.setPage(1); }}
          options={TYPES.map((t) => ({ id: t.id, label: `${t.label} (${mentores.filter(t.test).length})` }))}
        />
        <CompteResultats n={liste.length} nom="mentoré" />
      </div>

      {pagination.paged.length > 0 ? (
        <div className="space-y-4">
          {pagination.paged.map((m) => (
            <CarteListe
              key={m.id}
              onOpen={() => { setSelectedId(m.id); window.scrollTo(0, 0); }}
              visuel={<AvatarListe nom={m.nom} />}
              titre={m.nom}
              badges={<>
                {m.mineur && <BadgeMineur age={m.age} />}
                <App.Badge ton="marque" taille="moyen">{m.type}</App.Badge>
              </>}
              sousTitre={m.sous}
              meta={<>
                {m.jeune && <MetaOffre icone={Flag}>Étape {m.jeune.etape + 1} / {ETAPES_CAP.length}</MetaOffre>}
                {m.chercheur && <MetaOffre icone={ClipboardList}>{m.chercheur.candidatures.length} candidature{m.chercheur.candidatures.length > 1 ? "s" : ""}</MetaOffre>}
                {!m.mineur && (m.jeune || m.chercheur)?.ville && <MetaOffre icone={MapPin}>{(m.jeune || m.chercheur).ville}</MetaOffre>}
              </>}
              actions={<App.Bouton petit variante="neutre" onClick={() => setSelectedId(m.id)}>Voir le suivi</App.Bouton>}
            />
          ))}
        </div>
      ) : (
        <ListeVide icone={Users2} titre="Aucun mentoré" texte="Aucun mentoré ne correspond à votre recherche." />
      )}

      <PiedListe pagination={pagination} />
    </div>
  );
}

/* ---------- Espace mentor : séances ---------- */

function SeancesMentorScreen() {
  const [jeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const [seances, setSeances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const mentores = mentoresDe(MENTOR_CONNECTE.id, jeunes);
  const ids = new Set(mentores.map((m) => m.id));
  const miennes = seances.filter((s) => ids.has(s.mentoreId)).sort(parDate);
  const demandes = miennes.filter((s) => s.statut === "Demandée");
  const aVenir = miennes.filter((s) => s.statut === "Confirmée");
  const [onglet, setOnglet] = useState(demandes.length ? "demandes" : "avenir");
  const [pourId, setPourId] = useState(mentores[0]?.id || "");
  const pour = mentores.find((m) => m.id === pourId);
  const statut = (id, s) => setSeances((l) => l.map((x) => (x.id === id ? { ...x, statut: s } : x)));
  const liste = onglet === "demandes" ? demandes : aVenir;
  const pagination = usePaginationListe(liste);

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Acceptez les demandes de vos mentorés et retrouvez vos séances à venir.</p>

      <MiseEnPageFiche
        principal={<>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <App.Segments
              label="Séances"
              actif={onglet}
              onChange={(v) => { setOnglet(v); pagination.setPage(1); }}
              options={[{ id: "demandes", label: `Demandes (${demandes.length})` }, { id: "avenir", label: `À venir (${aVenir.length})` }]}
            />
            <CompteResultats n={liste.length} nom="séance" feminin />
          </div>

          {pagination.paged.length > 0 ? (
            <div className="space-y-4">
              {pagination.paged.map((s) => {
                const m = mentores.find((x) => x.id === s.mentoreId);
                return (
                  <CarteListe
                    key={s.id}
                    visuel={<VisuelDate iso={s.date} />}
                    titre={nomMentore(s.mentoreId, jeunes)}
                    badges={<>
                      <StatusBadge status={s.statut} />
                      {m?.mineur && <BadgeMineur age={m.age} />}
                    </>}
                    sousTitre={`${dateLongue(s.date)} · ${s.heure}`}
                    meta={<MetaOffre icone={s.format === "Visio" ? Video : s.format === "Téléphone" ? Phone : MapPin}>{s.format}</MetaOffre>}
                    actions={onglet === "demandes" ? (
                      <>
                        <App.Bouton petit variante="neutre" onClick={() => { statut(s.id, "Refusée"); notify("Demande refusée. Proposez un autre créneau au mentoré.", "info"); }}>Refuser</App.Bouton>
                        <App.Bouton petit onClick={() => { statut(s.id, "Confirmée"); notify("Séance confirmée. Le mentoré est prévenu."); }}>Accepter</App.Bouton>
                      </>
                    ) : (
                      <App.Bouton petit variante="neutre" onClick={() => { statut(s.id, "Annulée"); notify("Séance annulée. Le mentoré est prévenu.", "info"); }}>Annuler</App.Bouton>
                    )}
                  >
                    {s.message && <p className="mt-3 text-sm italic text-secondaire">« {s.message} »</p>}
                  </CarteListe>
                );
              })}
            </div>
          ) : (
            <ListeVide
              icone={CalendarDays}
              titre={onglet === "demandes" ? "Aucune demande en attente" : "Aucune séance à venir"}
              texte="Proposez une séance à l’un de vos mentorés."
            />
          )}

          <PiedListe pagination={pagination} />
        </>}
        cote={
          <App.Carte titre="Proposer une séance">
            <div className="mb-5">
              <label htmlFor="seance-mentore" className={AUTH.libelle}>Mentoré</label>
              <ListeChamp id="seance-mentore" value={pourId} onChange={(e) => setPourId(e.target.value)}>
                {mentores.map((m) => <option key={m.id} value={m.id}>{m.nom}{m.mineur ? " (mineur)" : ""}</option>)}
              </ListeChamp>
            </div>
            {pour && (
              <DemandeSeanceForm
                key={pour.id}
                mineur={pour.mineur}
                avecMessage={false}
                libelle="Programmer la séance"
                onEnvoyer={(s) => {
                  setSeances((l) => [...l, { id: `se${Date.now()}`, mentoreId: pour.id, statut: "Confirmée", ...s }]);
                  notify(pour.mineur ? `Séance programmée. ${pour.nom.split(" ")[0]} et son parent ou tuteur sont prévenus.` : `Séance programmée. ${pour.nom.split(" ")[0]} est prévenu.`);
                }}
              />
            )}
          </App.Carte>
        }
      />
    </div>
  );
}

/* ---------- Espace mentor : mon profil ---------- */

function MentorProfilScreen({ onNavigate = () => {} }) {
  const [disponible, setDisponible] = useStore("mentor-disponible", true);
  const [jeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const [seances] = useStore("mentorat-seances", SEANCES_INITIAL);
  const [notes] = useStore("mentorat-notes", NOTES_MENTORAT_INITIAL);
  const mentor = MENTOR_CONNECTE;
  const m = mentorProfile(mentor);
  const mentores = mentoresDe(mentor.id, jeunes);
  const ids = new Set(mentores.map((x) => x.id));
  const miennes = seances.filter((s) => ids.has(s.mentoreId));
  const aVenir = miennes.filter((s) => s.statut === "Confirmée").length;
  const demandes = miennes.filter((s) => s.statut === "Demandée").length;
  const comptesRendus = mentores.reduce((n, x) => n + (notes[x.id] || []).length, 0);

  return (
    <div className="space-y-6">
      <EnTeteFiche
        visuel={<AvatarListe nom={mentor.nom} photo={mentor.photo} taille="lg" />}
        badges={<>
          <App.Badge ton="succes" taille="moyen"><BadgeCheck size={13} aria-hidden="true" /> Mentor vérifié par LIGGEEY</App.Badge>
          <App.Badge ton={disponible ? "succes" : "neutre"} point taille="moyen">{disponible ? "Accepte de nouveaux mentorés" : "Complet pour le moment"}</App.Badge>
        </>}
        titre={mentor.nom}
        sousTitre={`${mentor.role} · ${mentor.exp} ans d’expérience`}
        meta={<>
          <MetaOffre icone={MessageCircle}>{m.langues.join(", ")}</MetaOffre>
          <MetaOffre icone={Video}>{m.formats.join(", ")}</MetaOffre>
          <MetaOffre icone={Star}>{m.stats.note}</MetaOffre>
        </>}
      />

      <ChiffresProfil
        items={[
          { icone: Users2, valeur: mentores.length, label: "Mentorés suivis", detail: (() => { const n = mentores.filter((x) => x.mineur).length; return `dont ${n} mineur${n > 1 ? "s" : ""}`; })(), onClick: () => onNavigate("mentores") },
          { icone: CalendarDays, valeur: aVenir, label: "Séances à venir", detail: "Confirmées", ton: "info", onClick: () => onNavigate("seances") },
          { icone: ClipboardList, valeur: demandes, label: "Demandes à traiter", detail: "Séances demandées", ton: "alerte", onClick: () => onNavigate("seances") },
          { icone: FileText, valeur: comptesRendus, label: "Comptes rendus", detail: "Rédigés pour vos mentorés", ton: "succes", onClick: () => onNavigate("mentores") },
        ]}
      />

      <MiseEnPageFiche
        principal={<>
          <App.Carte titre="À propos">
            <p className="text-[15px] leading-[1.7] text-secondaire">{m.bio}</p>
          </App.Carte>
          <App.Carte titre="Parcours professionnel">
            <FriseParcours etapes={m.parcours} />
          </App.Carte>
          <App.Carte titre="Domaines d’accompagnement">
            <Etiquettes items={mentor.competences || m.themes} />
          </App.Carte>
          <App.Carte titre="Charte du mentor" actions={<StatusBadge status="Signée" />}>
            <ListeCoches items={CHARTE_MENTOR} />
          </App.Carte>
        </>}
        cote={<>
          <App.Carte titre="Disponibilité">
            <App.Interrupteur
              actif={disponible}
              onChange={setDisponible}
              label="Accepter de nouveaux mentorés"
              description="L’équipe LIGGEEY vous attribue des jeunes seulement si cette option est active."
            />
          </App.Carte>
          <ApercuFiche
            titre="Mes informations"
            items={[
              { icone: Briefcase, libelle: "Métier", valeur: mentor.role },
              { icone: TrendingUp, libelle: "Expérience", valeur: `${mentor.exp} ans` },
              { icone: MessageCircle, libelle: "Langues", valeur: m.langues.join(", ") },
              { icone: Video, libelle: "Formats des séances", valeur: m.formats.join(", ") },
              { icone: CalendarCheck, libelle: "Mentor sur LIGGEEY depuis", valeur: m.stats.anciennete },
              { icone: UsersRound, libelle: "Mentorés accompagnés au total", valeur: m.stats.mentores },
              { icone: Star, libelle: "Note des mentorés", valeur: m.stats.note },
            ]}
          />
        </>}
      />
    </div>
  );
}

/* ---------- Admin : Cap Métier (attribution des mentors, accords parentaux) ---------- */

function CapMetierAdminDetail({ jeune, onBack, maj }) {
  const [mentorId, setMentorId] = useState(jeune.mentorId || "");
  const age = ageAu(jeune.naissance);
  const mineur = age < AGE_MAJORITE;
  const accordManquant = jeune.parent && jeune.parent.accord !== "Confirmé";
  const mentor = MENTORS.find((m) => m.id === jeune.mentorId);

  function attribuer() {
    const m = MENTORS.find((x) => x.id === mentorId);
    if (!m || accordManquant) return;
    maj({ mentorId: m.id });
    notify(`${m.nom} est maintenant le mentor de ${jeune.nom}.${mineur ? " Le parent ou tuteur est prévenu par SMS." : ""}`);
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-marque">
        <ArrowLeft size={14} aria-hidden="true" /> Retour à Cap Métier
      </button>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <App.CarteProfil
          nom={jeune.nom}
          sousTitre={jeune.piste ? `Piste : ${jeune.piste}` : "Piste métier à choisir"}
          badges={<>{mineur && <BadgeMineur age={age} />}<StatusBadge status={statutCap(jeune)} /></>}
          infos={[
            { icone: Calendar, libelle: "Âge", valeur: `${age} ans` },
            { icone: MapPin, libelle: "Ville", valeur: jeune.ville },
            { icone: Phone, libelle: "Téléphone", valeur: jeune.telephone },
            { icone: CalendarCheck, libelle: "Inscription", valeur: jeune.inscription },
          ]}
        >
          {jeune.souhait && <p className="mt-4 rounded-md bg-doux p-3 text-sm text-principal"><span className="block text-xs font-semibold text-discret">Mentor souhaité</span>{jeune.souhait}</p>}
        </App.CarteProfil>

        <div className="space-y-4 xl:col-span-2">
          {jeune.parent && (
            <App.Carte titre="Parent ou tuteur" actions={<StatusBadge status={jeune.parent.accord === "Confirmé" ? "Accord confirmé" : "Accord en attente"} />}>
              <App.LigneInfo icone={UserCircle2} libelle="Nom">{jeune.parent.nom} ({jeune.parent.lien.toLowerCase()})</App.LigneInfo>
              <App.LigneInfo icone={Phone} libelle="Téléphone">{jeune.parent.telephone}</App.LigneInfo>
              {accordManquant && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <App.Bouton petit variante="doux" onClick={() => notify(`SMS de relance envoyé à ${jeune.parent.nom}.`)}>Relancer par SMS</App.Bouton>
                  <App.Bouton petit variante="neutre" onClick={() => { maj({ parent: { ...jeune.parent, accord: "Confirmé" } }); notify("Accord parental enregistré."); }}>Enregistrer l’accord reçu</App.Bouton>
                </div>
              )}
            </App.Carte>
          )}

          <App.Carte titre="Mentor" sousTitre={mentor ? `Actuellement : ${mentor.nom}` : "Aucun mentor attribué"}>
            {accordManquant ? (
              <NoteMineur>Le mentor pourra être attribué après l’accord du parent ou tuteur.</NoteMineur>
            ) : (
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1">
                  <label htmlFor={`mentor-${jeune.id}`} className={AUTH.libelle}>Choisir un mentor</label>
                  <ListeChamp id={`mentor-${jeune.id}`} value={mentorId} onChange={(e) => setMentorId(e.target.value)}>
                    <option value="">Choisir</option>
                    {MENTORS.map((m) => <option key={m.id} value={m.id}>{m.nom} · {m.role}</option>)}
                  </ListeChamp>
                </div>
                <App.Bouton className="min-h-[48px]" onClick={attribuer} disabled={!mentorId || mentorId === jeune.mentorId}>{mentor ? "Changer de mentor" : "Attribuer"}</App.Bouton>
              </div>
            )}
          </App.Carte>

          <App.Carte titre="Parcours">
            <EtapesCap etape={jeune.etape} />
          </App.Carte>
        </div>
      </div>
    </div>
  );
}

function CapMetierAdminScreen() {
  const [jeunes, setJeunes] = useStore("cap-jeunes", JEUNES_CAP_INITIAL);
  const [filtre, setFiltre] = useState("tous");
  const [selectedId, setSelectedId] = useState(null);
  const selected = jeunes.find((j) => j.id === selectedId);

  if (selected) {
    return <CapMetierAdminDetail key={selected.id} jeune={selected} onBack={() => setSelectedId(null)} maj={(patch) => setJeunes((l) => l.map((j) => (j.id === selected.id ? { ...j, ...patch } : j)))} />;
  }

  const FILTRES = {
    tous: () => true,
    attribuer: (j) => statutCap(j) === "Mentor à attribuer",
    accord: (j) => statutCap(j) === "Accord parental en attente",
    mineurs: estMineur,
  };
  const liste = jeunes.filter(FILTRES[filtre]);
  const compte = (k) => jeunes.filter(FILTRES[k]).length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondaire">Les jeunes sans métier accompagnés par LIGGEEY, dès 15 ans. Attribuez un mentor à chacun, après l’accord du parent ou tuteur pour les mineurs.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Compass} value={jeunes.length} label="Jeunes suivis" detail="Parcours Cap Métier" onClick={() => setFiltre("tous")} />
        <StatCard icon={ShieldCheck} value={compte("mineurs")} label="Mineurs" detail="15 à 17 ans" tone="info" onClick={() => setFiltre("mineurs")} />
        <StatCard icon={UsersRound} value={compte("attribuer")} label="Mentor à attribuer" detail="Demandes en attente" tone="alerte" onClick={() => setFiltre("attribuer")} />
        <StatCard icon={Phone} value={compte("accord")} label="Accords parentaux" detail="En attente de réponse" tone="danger" onClick={() => setFiltre("accord")} />
      </div>
      <App.Carte flush>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <App.Segments
            label="Filtrer les jeunes"
            actif={filtre}
            onChange={setFiltre}
            options={[{ id: "tous", label: "Tous" }, { id: "attribuer", label: "Mentor à attribuer" }, { id: "accord", label: "Accord en attente" }, { id: "mineurs", label: "Mineurs" }]}
          />
          <ExportAdmin
            titre="Jeunes Cap Métier"
            lignes={liste}
            filtres={filtre !== "tous" ? [{ attribuer: "Mentor à attribuer", accord: "Accord en attente", mineurs: "Mineurs" }[filtre]] : []}
            colonnes={[
              { titre: "Jeune", valeur: (j) => j.nom },
              { titre: "Ville", valeur: (j) => j.ville },
              { titre: "Âge", valeur: (j) => ageAu(j.naissance) },
              { titre: "Mineur", valeur: (j) => (estMineur(j) ? "Oui" : "Non") },
              { titre: "Piste métier", valeur: (j) => j.piste || "À choisir" },
              { titre: "Mentor", valeur: (j) => MENTORS.find((m) => m.id === j.mentorId)?.nom || "" },
              { titre: "Statut", valeur: (j) => statutCap(j) },
            ]}
          />
        </div>
        <div className="px-4 pb-4">
          <App.Tableau
            legende="Jeunes du parcours Cap Métier"
            lignes={liste}
            onLigne={(j) => setSelectedId(j.id)}
            vide="Aucun jeune dans cette catégorie."
            colonnes={[
              { cle: "nom", titre: "Jeune", rendu: (j) => <App.CelluleIdentite visuel={<App.Avatar nom={j.nom} taille="sm" />} titre={j.nom} sousTitre={j.ville} /> },
              { cle: "naissance", titre: "Âge", rendu: (j) => (estMineur(j) ? <BadgeMineur age={ageAu(j.naissance)} /> : <span className="text-principal">{ageAu(j.naissance)} ans</span>) },
              { cle: "piste", titre: "Piste métier", masqueMobile: true, rendu: (j) => <span className="text-principal">{j.piste || "À choisir"}</span> },
              { cle: "mentorId", titre: "Mentor", masqueMobile: true, rendu: (j) => <span className="text-principal">{MENTORS.find((m) => m.id === j.mentorId)?.nom || "—"}</span> },
              { cle: "statut", titre: "Statut", rendu: (j) => <StatusBadge status={statutCap(j)} /> },
            ]}
          />
        </div>
      </App.Carte>
    </div>
  );
}

/* =====================================================================
   VERSION DE TEST
   - Sauvegarde automatique dans le navigateur du testeur (localStorage)
   - Barre « Mode test » : scénarios à dérouler, commentaire sur l’écran,
     réinitialisation de la démo
   ===================================================================== */

// v3 : régularisation facultative (question Oui / Non) ; les sessions de démo plus anciennes repartent de zéro.
const TEST_STORAGE_KEY = "liggeey-test-v4"; // v4 : harmonisation des libellés et des données de démo (octobre 2026)
const TEST_SCENARIOS_KEY = "liggeey-test-scenarios-v1";

function encodeState(value) {
  return JSON.stringify(value, (k, v) => (v === Infinity ? "__INF__" : v));
}
function decodeState(text) {
  return JSON.parse(text, (k, v) => (v === "__INF__" ? Infinity : v));
}
function loadSnapshot() {
  try {
    const raw = window.localStorage.getItem(TEST_STORAGE_KEY);
    return raw ? decodeState(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveSnapshot(snapshot) {
  try {
    window.localStorage.setItem(TEST_STORAGE_KEY, encodeState(snapshot));
  } catch (e) {
    /* stockage indisponible : la démo fonctionne sans sauvegarde */
  }
}
function clearSnapshot() {
  try {
    window.localStorage.removeItem(TEST_STORAGE_KEY);
    window.localStorage.removeItem(TEST_SCENARIOS_KEY);
  } catch (e) {
    /* rien à faire */
  }
}

const TEST_SCENARIOS = [
  { id: "c1", espace: "chercheur", to: "offres", label: "Postuler à une offre et la retrouver dans « Mes candidatures »" },
  { id: "c2", espace: "chercheur", to: "offres", label: "Atteindre la limite de 5 candidatures puis passer Premium (paiement simulé)" },
  { id: "c3", espace: "chercheur", to: "suivi", label: "Répondre au point de suivi post-embauche du premier mois" },
  { id: "c4", espace: "chercheur", to: "mentors", label: "Réserver, reprogrammer puis annuler un coaching avec un mentor" },
  { id: "c5", espace: "chercheur", to: "profil", label: "Modifier ses informations de profil" },
  { id: "p1", espace: "prestataire", to: "regularisation", label: "Répondre à la question sur la régularisation, puis envoyer un justificatif" },
  { id: "p2", espace: "prestataire", to: "missions", label: "Accepter une demande de mission" },
  { id: "p3", espace: "prestataire", to: "services", label: "Ajouter des services jusqu’à la limite de la formule Essentiel" },
  { id: "e1", espace: "entreprise", to: "offres", label: "Publier une offre, puis la retrouver dans l’espace chercheur" },
  { id: "e2", espace: "entreprise", to: "candidatures", label: "Ouvrir une candidature et débloquer les coordonnées" },
  { id: "e3", espace: "entreprise", to: "suivi", label: "Évaluer une recrue et confirmer son embauche" },
  { id: "a1", espace: "admin", to: "regularisations", label: "Valider les justificatifs envoyés par le prestataire" },
  { id: "a2", espace: "admin", to: "suivi", label: "Traiter un signalement post-embauche" },
  { id: "a3", espace: "admin", to: "abonnements", label: "Changer un tarif et le voir dans l’espace concerné" },
];
const TEST_ESPACE_LABELS = { chercheur: "Chercheur d’emploi", prestataire: "Prestataire", entreprise: "Entreprise", admin: "Admin" };

function loadScenarios() {
  try {
    return JSON.parse(window.localStorage.getItem(TEST_SCENARIOS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function TestModeBar({ espace, defaultOpen, onNavigate }) {
  const [open, setOpen] = useState(defaultOpen);
  const [done, setDone] = useState(loadScenarios);
  const [confirmReset, setConfirmReset] = useState(false);
  const [commentState, setCommentState] = useState("idle"); // idle | off | opened | busy
  const commentsRef = useRef(undefined);

  useEffect(() => {
    let alive = true;
    const c = typeof window !== "undefined" && window.claude && typeof window.claude.use === "function" ? window.claude.use("comments") : null;
    if (!c) { commentsRef.current = null; return undefined; }
    c.then((ns) => { if (alive) commentsRef.current = ns; }).catch(() => { if (alive) commentsRef.current = null; });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(TEST_SCENARIOS_KEY, JSON.stringify(done)); } catch (e) { /* ignoré */ }
  }, [done]);

  const total = TEST_SCENARIOS.length;
  const faits = TEST_SCENARIOS.filter((s) => done[s.id]).length;
  const ordered = [...TEST_SCENARIOS].sort((a, b) => (a.espace === espace ? -1 : 0) - (b.espace === espace ? -1 : 0));
  const groups = ordered.reduce((acc, s) => { (acc[s.espace] = acc[s.espace] || []).push(s); return acc; }, {});

  async function comment() {
    const ns = commentsRef.current;
    if (!ns) { setCommentState("off"); return; }
    const target = document.querySelector("main") || document.body;
    setCommentState("busy");
    try {
      const r = await ns.openComposer({ element: target });
      setCommentState(r && r.opened === false ? "idle" : "opened");
      if (r && r.opened !== false) setOpen(false);
    } catch (e) {
      setCommentState(e && e.code === "forbidden" ? "off" : "idle");
    }
  }

  return (
    <div className="fixed z-40 right-3 flex flex-col items-end" style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full pl-3 pr-3.5 py-1.5 text-xs font-semibold shadow-md flex items-center gap-1.5"
        style={{ background: COLORS.dark, color: COLORS.brandPale }}
      >
        <FlaskConical size={13} color={COLORS.orange} /> Mode test · {faits}/{total}
      </button>

      {open && (
        <div className="mt-2 w-[min(360px,calc(100vw-24px))] max-h-[80vh] overflow-y-auto rounded-lg bg-surface shadow-xl" style={{ border: `1px solid ${COLORS.border}` }} role="dialog" aria-label="Mode test">
          <div className="p-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold" style={{ color: COLORS.slate }}>Version de test de LIGGEEY</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="text-lg leading-none" style={{ color: COLORS.slateLight }}>×</button>
            </div>
            <p className="text-xs mt-1" style={{ color: COLORS.slateLight }}>
              Paiements, e-mails, appels et documents sont simulés. Vos actions sont enregistrées dans ce navigateur uniquement. Pour vous connecter, gardez les identifiants déjà saisis et choisissez un espace.
            </p>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.softStrong }}>
              <div className="h-full rounded-full" style={{ width: `${(faits / total) * 100}%`, background: COLORS.success }} />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {Object.keys(groups).map((esp) => (
              <div key={esp}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: esp === espace ? COLORS.orangeText : COLORS.slateLight }}>
                  {TEST_ESPACE_LABELS[esp]}{esp === espace ? " · espace actuel" : ""}
                </p>
                {groups[esp].map((s) => (
                  <div key={s.id} className="flex items-start gap-2 py-1">
                    <input type="checkbox" className="mt-1 accent-primaire-500" checked={!!done[s.id]} onChange={(e) => setDone((d) => ({ ...d, [s.id]: e.target.checked }))} aria-label={`Scénario terminé : ${s.label}`} />
                    <button type="button" onClick={() => { onNavigate(s.to, { espace: s.espace }); setOpen(false); }} className="text-sm text-left hover:underline" style={{ color: done[s.id] ? COLORS.slateLight : COLORS.slate, textDecoration: done[s.id] ? "line-through" : undefined }}>
                      {s.label}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="p-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            {commentState !== "off" ? (
              <button type="button" disabled={commentState === "busy"} onClick={comment} className="w-full rounded px-3 py-2 text-sm font-semibold text-sur-marque flex items-center justify-center gap-1.5" style={{ background: COLORS.orange }}>
                <MessageCircle size={14} /> Commenter cet écran
              </button>
            ) : (
              <p className="text-xs" style={{ color: COLORS.slateLight }}>Les commentaires ne sont pas disponibles depuis cette page. Notez vos remarques et transmettez-les à l’équipe LIGGEEY.</p>
            )}
            {!confirmReset ? (
              <button type="button" onClick={() => setConfirmReset(true)} className="w-full rounded px-3 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
                Réinitialiser la démo
              </button>
            ) : (
              <div className="rounded-md p-3" style={{ background: COLORS.dangerSoft }}>
                <p className="text-xs mb-2" style={{ color: COLORS.danger }}>Toutes vos actions de test seront effacées et la démo repartira de zéro.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { clearSnapshot(); window.location.reload(); }} className="flex-1 rounded px-3 py-1.5 text-xs font-semibold text-sur-statut" style={{ background: COLORS.danger }}>Tout effacer</button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="flex-1 rounded px-3 py-1.5 text-xs font-semibold border bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Écran valide pour un espace : entrée du menu ou sous-page (sinon, tableau de bord). */
function ecranValide(espace, ecran) {
  return (NAV_ITEMS_BY_ESPACE[espace] || []).some((n) => n.id === ecran) || (ecran in SUB_PAGES && espace === "prestataire");
}

/* Une session de test est ouverte quand le dernier écran enregistré est un écran de l’application. */
function sessionOuverte(saved, espace) {
  return !!saved && !ECRANS_AUTH.includes(saved.screen) && saved.espace === espace;
}

/* Écran d’ouverture :
   0. avec le serveur (compte fourni, même null) : la page /plateforme a déjà vérifié la session et redirigé
      si besoin. Un écran interne s’ouvre donc dans l’espace du compte connecté ;
   1. ecranInitial / espaceInitial (Storybook) ;
   2. l’adresse (/plateforme/connexion, /plateforme/admin/offres…) : un écran interne ne s’ouvre
      que si une session est ouverte pour cet espace. Session ouverte dans un autre espace : son
      tableau de bord ; aucune session : la connexion ;
   3. /plateforme seul : la dernière session de test, sinon la connexion. */
function ecranDeDepart({ ecranInitial, espaceInitial, profilInitial, cheminInitial, profilAdresse, saved, compte }) {
  if (compte !== undefined) {
    const demande = cheminInitial?.length ? lireAdressePlateforme(cheminInitial, profilAdresse) : null;
    if (demande?.type === "auth") return { screen: demande.screen, espace: compte?.profil || "chercheur", profil: demande.profil || null };
    if (!compte) return { screen: "login", espace: "chercheur", profil: null };
    const ecran = demande?.type === "app" && demande.espace === compte.profil && demande.screen && ecranValide(compte.profil, demande.screen) ? demande.screen : "dashboard";
    return { screen: ecran, espace: compte.profil, profil: null };
  }
  const espaceSession = saved?.espace || "chercheur";
  if (ecranInitial) return { screen: ecranInitial, espace: espaceInitial || espaceSession, profil: profilInitial };
  const demande = cheminInitial?.length ? lireAdressePlateforme(cheminInitial, profilAdresse) : null;
  if (demande?.type === "auth") return { screen: demande.screen, espace: espaceSession, profil: demande.profil || null };
  if (demande?.type === "app") {
    if (!sessionOuverte(saved, demande.espace)) {
      return sessionOuverte(saved, saved?.espace) ? { screen: "dashboard", espace: saved.espace, profil: null } : { screen: "login", espace: "chercheur", profil: null };
    }
    return { screen: demande.screen && ecranValide(demande.espace, demande.screen) ? demande.screen : "dashboard", espace: demande.espace, profil: null };
  }
  return { screen: saved?.screen || "login", espace: espaceSession, profil: profilInitial };
}

/* compte : compte connecté, lu par le serveur (null si personne). undefined (Storybook) : connexion simulée, sans serveur.
   comptesDemo : l’écran de connexion propose les comptes de démonstration. */
export default function LiggeeyPrototype({ ecranInitial = null, espaceInitial = null, profilInitial = null, cheminInitial = null, profilAdresse = null, synchroniserAdresse = false, compte = undefined, comptesDemo = false } = {}) {
  const modeServeur = compte !== undefined;
  const [compteCourant, setCompteCourant] = useState(compte ?? null);
  const compteRef = useRef(compteCourant);
  compteRef.current = compteCourant;
  const [saved] = useState(loadSnapshot);
  const [depart] = useState(() => ecranDeDepart({ ecranInitial, espaceInitial, profilInitial, cheminInitial, profilAdresse, saved, compte }));
  const [screen, setScreen] = useState(depart.screen);
  const [espace, setEspace] = useState(depart.espace);
  const [signupProfile, setSignupProfile] = useState(depart.profil);

  /* Adresse du navigateur : elle suit l’écran affiché (/plateforme/{espace}/{écran}).
     Précédent / Suivant rouvrent l’écran correspondant. Désactivé dans Storybook. */
  const adresseAppliquee = useRef(false);
  const depuisHistorique = useRef(false);
  useEffect(() => {
    if (!synchroniserAdresse) return;
    const url = adressePlateforme({ screen, espace, profil: signupProfile });
    const actuelle = window.location.pathname + window.location.search;
    if (url !== actuelle) {
      // Première adresse, ou correction après Précédent / Suivant : on remplace ; sinon nouvelle entrée d’historique.
      if (!adresseAppliquee.current || depuisHistorique.current) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    }
    adresseAppliquee.current = true;
    depuisHistorique.current = false;
  }, [synchroniserAdresse, screen, espace, signupProfile]);
  useEffect(() => {
    if (!synchroniserAdresse) return undefined;
    const surHistorique = () => {
      const demande = lireAdresseNavigateur();
      depuisHistorique.current = true;
      if (!demande) { setScreen("login"); return; }
      if (demande.type === "auth") {
        if (demande.profil) setSignupProfile(demande.profil);
        setScreen(demande.screen);
        return;
      }
      // Avec le serveur, un écran interne n’est ouvert qu’au compte connecté de cet espace.
      const compteActuel = compteRef.current;
      if (modeServeur && !compteActuel) { setScreen("login"); return; }
      if (modeServeur && demande.espace !== compteActuel.profil) { setEspace(compteActuel.profil); setScreen("dashboard"); return; }
      setEspace(demande.espace);
      setScreen(demande.screen && ecranValide(demande.espace, demande.screen) ? demande.screen : "dashboard");
    };
    window.addEventListener("popstate", surHistorique);
    return () => window.removeEventListener("popstate", surHistorique);
  }, [synchroniserAdresse, modeServeur]);
  const [signupInscription, setSignupInscription] = useState(null);
  const [presetMentorId, setPresetMentorId] = useState(null);
  const [presetMentoreId, setPresetMentoreId] = useState(null);
  const [presetFormationsTab, setPresetFormationsTab] = useState("toutes");
  const [presetOnglet, setPresetOnglet] = useState(null);
  const [presetCreer, setPresetCreer] = useState(0); // horodatage : chaque raccourci « créer » rouvre le formulaire
  const [offresEntreprise, setOffresEntreprise] = useState(saved?.offresEntreprise || OFFRES_ENTREPRISE_INITIAL);
  const [plans, setPlans] = useState(saved?.plans || PLANS_INITIAL);
  const [subs, setSubs] = useState(saved?.subs || SUBS_INITIAL);
  const [usage, setUsage] = useState(saved?.usage || USAGE_INITIAL);
  const [transactions, setTransactions] = useState(saved?.transactions || TRANSACTIONS_INITIAL);
  const [upgrade, setUpgrade] = useState(null);
  const [payment, setPayment] = useState(null);
  const [suiviChercheur, setSuiviChercheur] = useState(saved?.suiviChercheur || SUIVI_CHERCHEUR_INITIAL);
  const [signalements, setSignalements] = useState(saved?.signalements || SIGNALEMENTS_INITIAL);
  const [recrues, setRecrues] = useState(saved?.recrues || RECRUES_INITIAL);
  const [regulSteps, setRegulSteps] = useState(saved?.regulSteps || REGUL_STEPS_INITIAL);
  const [storeData, setStoreData] = useState(saved?.storeData || {});

  /* Sauvegarde automatique de la session de test dans le navigateur */
  useEffect(() => {
    const t = setTimeout(() => {
      saveSnapshot({ screen, espace, offresEntreprise, plans, subs, usage, transactions, suiviChercheur, signalements, recrues, regulSteps, storeData });
    }, 300);
    return () => clearTimeout(t);
  }, [screen, espace, offresEntreprise, plans, subs, usage, transactions, suiviChercheur, signalements, recrues, regulSteps, storeData]);
  const storeApi = React.useMemo(() => ({
    data: storeData,
    set: (key, v, init) => setStoreData((d) => {
      const prev = Object.prototype.hasOwnProperty.call(d, key) ? d[key] : init;
      return { ...d, [key]: typeof v === "function" ? v(prev) : v };
    }),
  }), [storeData]);
  function addSignalement(sig) {
    setSignalements((l) => [{ id: `s${Date.now()}`, date: todayFr(), statut: "Ouvert", ...sig }, ...l]);
  }

  function navigate(next, data) {
    if (data?.profile) setSignupProfile(data.profile);
    if (next === "signup-confirm") setSignupInscription(data?.inscription || null);
    if (data?.espace) setEspace(data.espace);
    if (next === "mentors") setPresetMentorId(data?.mentorId || null);
    if (next === "mentores") setPresetMentoreId(data?.mentoreId || null);
    if (next === "formations") setPresetFormationsTab(data?.tab || "toutes");
    if (next === "communication") setPresetOnglet(data?.onglet || null);
    if (next === "offres" || next === "services") setPresetCreer(data?.creer ? Date.now() : 0);
    if (next === "login") setEspace("chercheur");
    setScreen(next);
  }

  /* Comptes réels : connexion, inscription et déconnexion passent par l’API (components/plateforme/apiComptes.js). */
  const serveurApi = React.useMemo(() => (modeServeur ? {
    compte: compteCourant,
    comptesDemo,
    retenirCompte: setCompteCourant,
    onConnecte: (c) => { setCompteCourant(c); navigate("dashboard", { espace: c.profil }); },
    onDeconnexion: async () => {
      const r = await apiDeconnexion();
      if (!r.ok) { notify(r.erreur || "Déconnexion impossible pour le moment.", "info"); return; }
      setCompteCourant(null);
      navigate("login");
    },
  } : null), [modeServeur, compteCourant, comptesDemo]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Le nom, le rôle et les initiales affichés viennent du compte connecté ; les données des écrans restent celles de la démo.
     Comptes de démonstration : profil de démo d’origine (USER_BY_ESPACE), pour que l’affichage reste celui des captures. */
  const estCompteDemo = !!compteCourant && COMPTES_DEMO.some((c) => c.email === compteCourant.email);
  const currentUser = compteCourant && compteCourant.profil === espace && !estCompteDemo
    ? { ...USER_BY_ESPACE[espace], name: compteCourant.nom, role: compteCourant.role, initials: compteCourant.initiales }
    : USER_BY_ESPACE[espace];
  const navItems = NAV_ITEMS_BY_ESPACE[espace];
  const planApi = buildPlanApi({ espace, user: currentUser, plans, setPlans, subs, setSubs, usage, setUsage, transactions, setTransactions, setUpgrade, setPayment });
  planApi.regulSteps = espace === "prestataire" ? regulSteps : null;
  planApi.regulChoix = readStore(storeData, "regul-choix", null);

  /* Fil d’Ariane et entrée active du menu, déduits du menu lui-même */
  const subPage = SUB_PAGES[screen];
  const navEntry = navItems.find((n) => n.id === (subPage ? subPage.parent : screen));
  const breadcrumb = subPage ? [{ label: navEntry?.label, id: subPage.parent }, { label: subPage.label }] : [{ label: navEntry?.label || "Tableau de bord" }];
  const activeNav = subPage ? subPage.parent : screen;
  const APP_SCREENS = navItems.map((n) => n.id).concat(Object.keys(SUB_PAGES));

  /* Tâches à traiter : alimentent le bloc « À faire » et les compteurs du menu */
  const missionsData = readStore(storeData, "missions", MISSIONS_INITIAL);
  const candidaturesEntreprise = readStore(storeData, "candidatures-entreprise", CANDIDATURES_ENTREPRISE_INITIAL);
  const coachingsChercheur = readStore(storeData, "coachings-c", {});
  const regulAutres = readStore(storeData, "regul-autres", REGUL_DEMANDES_AUTRES);
  const pointsSuivi = JALONS.filter((j) => jalonStatut(EMBAUCHE_CHERCHEUR.dateIso, j, suiviChercheur.reponses[j.id]) === "À compléter");
  const prochainCoaching = (coachingsChercheur[MENTORS[0].id] || defaultCoachings(MENTORS[0])).upcoming[0];
  const regulChoix = readStore(storeData, "regul-choix", null);
  const regulActif = regulEngage(regulSteps, regulChoix);
  const regulRefusees = regulActif ? regulSteps.filter((st) => st.statut === "Refusé") : [];
  const regulACompleter = regulActif ? regulSteps.filter((st) => st.obligatoire && st.statut === "À compléter") : [];
  const missionsEnAttente = missionsData.filter((m) => m.statut === "En attente").length;
  const evaluationsAFaire = recrues.reduce((n, r) => n + JALONS.filter((j) => jalonStatut(r.dateIso, j, r.evaluations[j.id]) === "À compléter").length, 0);
  const recruesARisque = recrues.filter((r) => r.statut === "À risque").length;
  const nouvellesCandidatures = candidaturesEntreprise.filter((c) => c.statut === "Nouveau").length;
  const regulAVerifier = regulSteps.filter((st) => st.statut === "En vérification").length + regulAutres.filter((d) => d.statut === "En vérification").length;
  const signalementsOuverts = signalements.filter((x) => x.statut === "Ouvert").length;
  const paiementsEchoues = transactions.filter((t) => t.statut === "Échoué").length;
  const conversations = readStore(storeData, "conversations", CONVERSATIONS_INITIAL);
  const messagesAdminNonLus = conversations.reduce((n, c) => n + (c.nonLu || 0), 0);
  const messagesProfilNonLus = conversations.find((c) => c.espace === espace)?.nonLuProfil || 0;
  const offresAVerifier = offresEntreprise.filter((o) => o.statut === "En vérification").length;
  const offresRefusees = offresEntreprise.filter((o) => o.statut === "Refusée");
  const pl = (n, one, many) => `${n} ${n > 1 ? many : one}`;
  const tacheMessages = messagesProfilNonLus > 0 && { label: `Lire ${pl(messagesProfilNonLus, "message", "messages")} de l’équipe LIGGEEY`, to: "messages", icon: MessageCircle };

  /* Cap Métier et mentorat */
  const jeunesCap = readStore(storeData, "cap-jeunes", JEUNES_CAP_INITIAL);
  const seancesMentorat = readStore(storeData, "mentorat-seances", SEANCES_INITIAL);
  const jeuneConnecte = jeunesCap.find((j) => j.id === JEUNE_CONNECTE_ID);
  const mentorJeune = MENTORS.find((m) => m.id === jeuneConnecte?.mentorId);
  const seanceJeune = seancesMentorat.filter((s) => s.mentoreId === JEUNE_CONNECTE_ID && s.statut === "Confirmée").sort(parDate)[0];
  const idsMentores = new Set(mentoresDe(MENTOR_CONNECTE.id, jeunesCap).map((m) => m.id));
  const seancesMentor = seancesMentorat.filter((s) => idsMentores.has(s.mentoreId));
  const demandesSeance = seancesMentor.filter((s) => s.statut === "Demandée").length;
  const seanceMentor = seancesMentor.filter((s) => s.statut === "Confirmée").sort(parDate)[0];
  const capAAttribuer = jeunesCap.filter((j) => statutCap(j) === "Mentor à attribuer").length;
  const capAccords = jeunesCap.filter((j) => statutCap(j) === "Accord parental en attente").length;

  const TODOS = {
    chercheur: [
      tacheMessages,
      ...pointsSuivi.map((j) => ({ label: `Répondre au point de suivi « ${j.label} »`, to: "suivi", icon: HeartHandshake })),
      prochainCoaching && { label: `Coaching avec ${MENTORS[0].nom} : ${prochainCoaching.date}`, to: "mentors", data: { mentorId: MENTORS[0].id }, icon: Calendar },
    ],
    prestataire: [
      tacheMessages,
      ...regulRefusees.map((st) => ({ label: `Renvoyer le justificatif « ${st.titre} », refusé par LIGGEEY`, to: "regularisation", icon: Landmark, urgent: true })),
      regulACompleter.length > 0 && { label: `Compléter ${pl(regulACompleter.length, "étape", "étapes")} de régularisation`, to: "regularisation", icon: Landmark },
      missionsEnAttente > 0 && { label: `Répondre à ${pl(missionsEnAttente, "demande de mission", "demandes de mission")}`, to: "missions", icon: ClipboardList },
    ],
    entreprise: [
      tacheMessages,
      ...offresRefusees.map((o) => ({ label: `Corriger l’offre « ${o.titre} », refusée par LIGGEEY`, to: "offres", icon: Briefcase, urgent: true })),
      recruesARisque > 0 && { label: `Accompagner ${pl(recruesARisque, "recrue à risque", "recrues à risque")}`, to: "suivi", icon: AlertCircle, urgent: true },
      evaluationsAFaire > 0 && { label: `Évaluer vos recrues (${pl(evaluationsAFaire, "point de suivi", "points de suivi")})`, to: "suivi", icon: HeartHandshake },
      nouvellesCandidatures > 0 && { label: `Traiter ${pl(nouvellesCandidatures, "nouvelle candidature", "nouvelles candidatures")}`, to: "candidatures", icon: ClipboardList },
    ],
    jeune: [
      tacheMessages,
      jeuneConnecte && !jeuneConnecte.piste && { label: "Faire votre bilan d’orientation", to: "orientation", icon: Compass },
      seanceJeune && mentorJeune && { label: `Séance avec ${mentorJeune.nom} : ${dateLongue(seanceJeune.date)} à ${seanceJeune.heure}`, to: "mentor", icon: Calendar },
    ],
    mentor: [
      tacheMessages,
      demandesSeance > 0 && { label: `Répondre à ${pl(demandesSeance, "demande de séance", "demandes de séance")}`, to: "seances", icon: CalendarDays },
      seanceMentor && { label: `Séance avec ${nomMentore(seanceMentor.mentoreId, jeunesCap)} : ${dateLongue(seanceMentor.date)} à ${seanceMentor.heure}`, to: "mentores", data: { mentoreId: seanceMentor.mentoreId }, icon: Calendar },
    ],
    admin: [
      messagesAdminNonLus > 0 && { label: `Répondre à ${pl(messagesAdminNonLus, "message", "messages")} des utilisateurs`, to: "communication", data: { onglet: "Messagerie" }, icon: MessageCircle },
      offresAVerifier > 0 && { label: `Vérifier ${pl(offresAVerifier, "offre d’emploi", "offres d’emploi")} avant publication`, to: "offres", icon: Briefcase, urgent: true },
      capAccords > 0 && { label: `Relancer ${pl(capAccords, "parent", "parents")} pour l’accord parental (Cap Métier)`, to: "cap-metier", icon: Phone },
      capAAttribuer > 0 && { label: `Attribuer un mentor à ${pl(capAAttribuer, "jeune", "jeunes")} (Cap Métier)`, to: "cap-metier", icon: Compass },
      signalementsOuverts > 0 && { label: `Traiter ${pl(signalementsOuverts, "signalement post-embauche", "signalements post-embauche")}`, to: "suivi", icon: Flag, urgent: true },
      regulAVerifier > 0 && { label: `Vérifier ${pl(regulAVerifier, "justificatif de régularisation", "justificatifs de régularisation")}`, to: "regularisations", icon: Landmark },
      paiementsEchoues > 0 && { label: `Relancer ${pl(paiementsEchoues, "paiement échoué", "paiements échoués")}`, to: "abonnements", icon: CreditCard },
    ],
  };
  const todos = (TODOS[espace] || []).filter(Boolean);
  const BADGES = {
    chercheur: { messages: messagesProfilNonLus, suivi: pointsSuivi.length },
    prestataire: { messages: messagesProfilNonLus, regularisation: regulRefusees.length + regulACompleter.length, missions: missionsEnAttente },
    entreprise: { messages: messagesProfilNonLus, offres: offresRefusees.length, candidatures: nouvellesCandidatures, suivi: evaluationsAFaire + recruesARisque },
    jeune: { messages: messagesProfilNonLus },
    mentor: { messages: messagesProfilNonLus, seances: demandesSeance },
    admin: { communication: messagesAdminNonLus, offres: offresAVerifier, suivi: signalementsOuverts, regularisations: regulAVerifier, abonnements: paiementsEchoues, "cap-metier": capAAttribuer + capAccords },
  };

  /* Les offres actives publiées par l’entreprise apparaissent aussi côté chercheur */
  const offresPubliees = offresEntreprise.filter((o) => o.statut === "Active").map((o) => ({
    titre: o.titre, contrat: o.contrat || "CDI", entreprise: ENTREPRISE_DEMO_NOM, secteur: "BTP et construction",
    localisation: o.localisation, description: o.description || "", competences: o.competences || [o.categorie], sponsorisee: o.sponsorisee,
    experience: o.experience, salaire: o.salaire, dateLimite: o.dateLimite,
  }));

  function renderContent() {
    if (screen === "dashboard" && espace === "chercheur") return <DashboardScreen user={currentUser} onNavigate={navigate} todos={todos} />;
    if (screen === "dashboard" && espace === "prestataire") return <PrestataireDashboardScreen user={currentUser} onNavigate={navigate} todos={todos} />;
    if (screen === "dashboard" && espace === "entreprise") return <EntrepriseDashboardScreen user={currentUser} offres={offresEntreprise} onNavigate={navigate} todos={todos} />;
    if (screen === "dashboard" && espace === "admin") return <AdminDashboardScreen onNavigate={navigate} todos={todos} />;
    if (espace === "jeune") {
      if (screen === "dashboard") return <CapParcoursScreen onNavigate={navigate} todos={todos} />;
      if (screen === "orientation") return <CapOrientationScreen onNavigate={navigate} />;
      if (screen === "ateliers") return <CapAteliersScreen />;
      if (screen === "mentor") return <CapMentorScreen />;
      if (screen === "profil") return <CapProfilScreen onNavigate={navigate} />;
    }
    if (espace === "mentor") {
      if (screen === "dashboard") return <MentorDashboardScreen onNavigate={navigate} todos={todos} />;
      if (screen === "mentores") return <MentoresScreen key={presetMentoreId || "liste"} initialId={presetMentoreId} />;
      if (screen === "seances") return <SeancesMentorScreen />;
      if (screen === "profil") return <MentorProfilScreen onNavigate={navigate} />;
    }
    if (screen === "cap-metier" && espace === "admin") return <CapMetierAdminScreen />;
    if (screen === "chercheurs" && espace === "admin") return <ChercheursAdminScreen />;
    if (screen === "prestataires" && espace === "admin") return <PrestatairesAdminScreen />;
    if (screen === "entreprises" && espace === "admin") return <EntreprisesAdminScreen />;
    if (screen === "offres" && espace === "admin") return <OffresAdminScreen offresEntreprise={offresEntreprise} setOffresEntreprise={setOffresEntreprise} />;
    if (screen === "candidatures" && espace === "admin") return <CandidaturesAdminScreen />;
    if (screen === "formations" && espace === "admin") return <FormationsAdminScreen />;
    if (screen === "mentorat" && espace === "admin") return <MentoratAdminScreen />;
    if (screen === "services" && espace === "admin") return <ServicesAdminScreen />;
    if (screen === "missions" && espace === "admin") return <MissionsAdminScreen />;
    if (screen === "verifications" && espace === "admin") return <VerificationCVScreen />;
    if (screen === "planning" && espace === "admin") return <PlanningScreen />;
    if (screen === "communication" && espace === "admin") return <CommunicationScreen key={presetOnglet || "notifications"} onNavigate={navigate} ongletInitial={presetOnglet} />;
    if (screen === "messages" && espace !== "admin") return <MessagesScreen espace={espace} user={currentUser} />;
    if (screen === "parametres" && espace === "admin") return <ParametresScreen />;
    if (screen === "abonnements" && espace === "admin") return <AbonnementsAdminScreen />;
    if (screen === "abonnement" && espace !== "admin") return <AbonnementScreen />;
    if (screen === "suivi" && espace === "chercheur") return <SuiviEmbaucheScreen suivi={suiviChercheur} setSuivi={setSuiviChercheur} signalements={signalements} onSignal={addSignalement} />;
    if (screen === "suivi" && espace === "entreprise") return <SuiviRecruesScreen recrues={recrues} setRecrues={setRecrues} onSignal={addSignalement} />;
    if (screen === "suivi" && espace === "admin") return <SuiviPostEmbaucheAdminScreen signalements={signalements} setSignalements={setSignalements} recrues={recrues} />;
    if (screen === "regularisation" && espace === "prestataire") return <RegularisationScreen steps={regulSteps} setSteps={setRegulSteps} />;
    if (screen === "regularisations" && espace === "admin") return <RegularisationsAdminScreen steps={regulSteps} setSteps={setRegulSteps} />;
    if (screen === "offres" && espace === "entreprise") return <MesOffresScreen key={presetCreer || "liste"} creer={!!presetCreer} offres={offresEntreprise} setOffres={setOffresEntreprise} />;
    if (screen === "offres") return <OffresScreen extraOffres={offresPubliees} onNavigate={navigate} />;
    if (screen === "services") return <ServicesScreen key={presetCreer || "liste"} creer={!!presetCreer} />;
    if (screen === "missions") return <MissionsScreen />;
    if (screen === "candidatures" && espace === "chercheur") return <CandidaturesScreen onNavigate={navigate} />;
    if (screen === "candidatures" && espace === "entreprise") return <CandidaturesEntrepriseScreen />;
    if (screen === "prestataires" && espace === "entreprise") return <PrestatairesSearchScreen />;
    if (screen === "formations") return <FormationsScreen key={presetFormationsTab + espace} initialTab={presetFormationsTab} dataset={espace === "prestataire" ? FORMATIONS_PRESTATAIRE_ALL : FORMATIONS_ALL} userName={currentUser.name} />;
    if (screen === "mentors") return <MentorsScreen key={(presetMentorId || "list") + espace} initialMentorId={presetMentorId} dataset={espace === "prestataire" ? MENTORS_PRESTATAIRE : MENTORS} />;
    if (screen === "profil" && espace === "chercheur") return <ProfilScreen onNavigate={navigate} />;
    if (screen === "profil" && espace === "prestataire") return <ProfilPrestataireScreen onNavigate={navigate} />;
    if (screen === "profil" && espace === "entreprise") return <ProfilEntrepriseScreen offres={offresEntreprise} onNavigate={navigate} />;
    if (screen === "evaluations" && espace === "prestataire") return <EvaluationsScreen onNavigate={navigate} />;
    if (screen === "realisations" && espace === "prestataire") return <RealisationsScreen onBack={() => navigate("profil")} />;
    return (
      <div className="rounded-lg border bg-surface p-8 text-center" style={{ borderColor: COLORS.border }}>
        <p className="text-sm" style={{ color: COLORS.slateLight }}>
          Écran « {navItems.find((n) => n.id === screen)?.label || screen} » — prochaine étape du prototype.
        </p>
      </div>
    );
  }

  if (APP_SCREENS.includes(screen)) {
    return (
      <ServeurContext.Provider value={serveurApi}>
      <StoreContext.Provider value={storeApi}>
      <PlanContext.Provider value={planApi}>
        <AppShell
          espace={espace}
          navItems={navItems}
          active={activeNav}
          onNavigate={navigate}
          user={currentUser}
          breadcrumb={breadcrumb}
          badges={BADGES[espace]}
          todos={todos}
        >
          {renderContent()}
          {upgrade && <UpgradeModal reasonKey={upgrade} onClose={() => setUpgrade(null)} onNavigate={navigate} />}
          {payment && <PaymentModal key={payment.planId + payment.cycle} planId={payment.planId} initialCycle={payment.cycle} onClose={() => setPayment(null)} />}
          <Toaster />
        </AppShell>
      </PlanContext.Provider>
      </StoreContext.Provider>
      </ServeurContext.Provider>
    );
  }

  return (
    <ServeurContext.Provider value={serveurApi}>
    <AuthShell mode={screen === "login" ? "connexion" : "inscription"}>
      {screen === "login" && <ConnexionScreen onNavigate={navigate} />}
      {screen === "signup-choice" && <SignupChoiceScreen onNavigate={navigate} />}
      {screen === "signup-info" && <SignupInfoScreen profile={signupProfile} onNavigate={navigate} />}
      {screen === "signup-confirm" && <ConfirmationScreen profile={signupProfile} inscription={signupInscription} onNavigate={navigate} />}
      <Toaster />
    </AuthShell>
    </ServeurContext.Provider>
  );
}

/* =====================================================================
   EXPORTS POUR STORYBOOK (ajout au fichier d’origine)
   Les composants et données de démo ci-dessous sont exposés pour être
   présentés un à un dans Storybook (stories/composants/application/).
   Le comportement de la plateforme ne change pas.
   ===================================================================== */
export {
  // Fondations et contextes
  COLORS, StoreContext, PlanContext, buildPlanApi, notify,
  PLANS_INITIAL, SUBS_INITIAL, USAGE_INITIAL, TRANSACTIONS_INITIAL, UPGRADE_REASONS,
  USER_BY_ESPACE, NAV_ITEMS_BY_ESPACE, REGUL_STEPS_INITIAL, TYPES_SIGNALEMENT, JALONS, TEST_STORAGE_KEY,
  // Identité, actions
  Logo, ActionButton, FilePickerButton,
  // Badges et statuts
  StatusBadge, TierBadge, PremiumChip, RegulBadge, EventChip, PLANNING_EVENTS_INITIAL,
  // Indicateurs
  StatCard, StatMini, ProgressBar, UsageMeter, Stars, RatingInput, Stepper, CandidatureStepper, ChecklistItem, SSLNote,
  // Formulaires
  ProfileRadioCard, PROFILES, EditableTags, Pagination, ServiceForm, OffreEntrepriseForm, EventForm,
  CheckinForm, SignalementForm, PasswordChanger, SERVICES_INITIAL, OFFRES_ENTREPRISE_INITIAL,
  // Navigation
  AuthShell, AppShell, Sidebar, IconRail, Breadcrumb, TodoPanel,
  // Cartes
  OfferCard, FormationCard, MentorCard, CandidatureCard, DemandeCard, ServiceCard, MissionCard,
  OffreEntrepriseCard, CandidatureEntrepriseRow, PrestataireSearchCard, IdentityCell,
  OFFRES_DATA, CANDIDATURES, FORMATIONS_ALL, MENTORS, DEMANDES_RECENTES, MISSIONS_INITIAL,
  CANDIDATURES_ENTREPRISE_INITIAL, PRESTATAIRES_SEARCH,
  // Données
  Row, InfoField, BorderedField, LockedRow, AdminInfoCard, AdminSubListCard, SafeImg, ProfileTierCard,
  // Retours et fenêtres
  Toaster, ModalFrame, ArchiveConfirm, OffreDetail, FormationDetail, MentorDetail, defaultCoachings, UpgradeModal, PaymentModal, ProfilInfoModal,
};
