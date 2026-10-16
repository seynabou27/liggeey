'use client';

/* Intégration Next.js : prototype de la plateforme repris tel quel (fichier d'origine : liggeey-app (3).jsx).
   Changements faits à l'original :
   - la directive 'use client' ci-dessus ;
   - les props ecranInitial / espaceInitial / profilInitial du composant racine (en bas du fichier),
     qui permettent au site d'ouvrir directement la connexion ou l'inscription ;
   - la barre « Mode test » n'est plus affichée (la sauvegarde locale de la démo est conservée) ;
   - liens de retour vers le site public (constante SITE_URL) : logo, « Retour au site » sur la
     connexion et l'inscription, et en bas du menu de l'application.
   Monté par components/plateforme/Plateforme.jsx sur /plateforme. */

/* =====================================================================
   LIGGEEY — PROTOTYPE INTERACTIF
   Sommaire du fichier (dans l'ordre) :
     1. Fondations : couleurs, date de démo, mémoire partagée (useStore)
     2. Composants réutilisables : logo, notifications, images, fichiers
     3. Connexion et inscription
     4. Coquille de l'application : menu groupé, fil d'Ariane, bloc « À faire »
     5. Espace chercheur : tableau de bord, offres, candidatures, formations, mentors, profil
     6. Espace prestataire : tableau de bord, services, missions, profil, évaluations
     7. Espace entreprise : tableau de bord, offres, candidatures, prestataires, profil
     8. Espace admin : utilisateurs, activité, contrôle, planning, communication, paramètres
     9. Abonnements Essentiel / Premium et paiement
    10. Profils Essentiel / Premium, mentors (coachings), suivi post-embauche, régularisation
    11. Profils modifiables
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
  Home,
  ChevronRight,
  FileText,
  CalendarCheck,
  Clock,
  Download,
  Wrench,
  ClipboardList,
  Plus,
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
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// Couleurs : tokens LIGGEEY (lib/tokens/couleurs.mjs), lus via les variables CSS du site.
// Les noms d'origine sont conservés ; chaque valeur suit le thème (clair ou sombre).
const COLORS = {
  orange: "rgb(var(--fond-marque))", // couleur de marque (primaire-500)
  orangeSoft: "rgb(var(--fond-marque-doux))",
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
  darkDeep: "rgb(var(--fond-sombre-profond))",
  darkLine: "rgb(var(--bordure-sur-sombre))",
  darkTrack: "rgb(var(--neutre-700))",
  onDark: "rgb(var(--texte-sur-sombre))",
  onDarkMuted: "rgb(var(--texte-sur-sombre-secondaire))",
  onDarkSubtle: "rgb(var(--texte-sur-sombre-discret))",
  brandPale: "rgb(var(--texte-marque-pale))",
  danger: "#DC2626",
};

/* =====================================================================
   FONDATIONS DU PROTOTYPE
   - DEMO_TODAY : la « date du jour » de la démo, pour que toutes les dates
     (rendez-vous, échéances, périodes d'essai) restent cohérentes entre elles.
   - useStore : mémoire partagée entre les écrans. Les données modifiées
     (services, missions, candidatures, inscriptions…) sont conservées quand
     on change de page ou d'espace.
   ===================================================================== */

const DEMO_TODAY = new Date(2026, 9, 14); // mercredi 14 octobre 2026
function demoNow() {
  return new Date(DEMO_TODAY.getTime());
}

const StoreContext = React.createContext(null);

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

/* Adresse du site public. La plateforme est servie par le site (/plateforme) : « / » ramène à l'accueil.
   Si la plateforme est un jour déployée à part, mettre ici l'adresse complète du site. */
const SITE_URL = "/";

function Logo({ color = COLORS.brandPale, height = 24, iconOnly = false }) {
  const viewW = iconOnly ? 658 : 3525;
  const width = height * (viewW / 690);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${viewW} 690`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M377.581 135.382L82.6807 600.007L122.668 689.674H0V0H316.209L377.581 135.382ZM657.888 689.674H278.254L445.47 600.007V135.382L604.317 0H657.888V689.674Z" fill={color} />
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

// Shared split-screen shell used by every auth screen
function AuthShell({ children, onNavigate }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <div
        className="relative hidden md:flex flex-col justify-between p-10 md:p-14"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgb(var(--primaire-500) / 0.35), transparent 45%), linear-gradient(160deg, rgb(var(--neutre-800)) 0%, rgb(var(--neutre-850)) 55%, rgb(var(--neutre-900)) 100%)",
          minHeight: "100vh",
        }}
      >
        <a href={SITE_URL} aria-label="LIGGEEY, retour au site" className="inline-flex self-start"><Logo /></a>
        <div className="max-w-md">
          <h1 className="text-4xl md:text-[2.5rem] leading-[1.1] font-bold text-sur-sombre">Rejoignez le mouvement</h1>
          <h1 className="text-4xl md:text-[2.5rem] leading-[1.1] font-bold mb-6" style={{ color: COLORS.orange }}>LIGGEEY</h1>
          <p className="text-white/70 text-base leading-relaxed mb-6 max-w-sm">
            Emploi, freelance ou service à la demande&nbsp;: créez votre profil et accédez à un accompagnement personnalisé, gratuitement.
          </p>
          <div className="w-14 h-[2px] mb-6" style={{ background: COLORS.orange }} />
          {/* Les offres se découvrent sur le site : la plateforme ne s'ouvre qu'après connexion */}
          <a
            href={`${SITE_URL}#offres`}
            className="inline-block text-sm font-medium px-5 py-2.5 rounded-md border transition-colors hover:bg-white/5"
            style={{ borderColor: COLORS.orange, color: COLORS.orange }}
          >
            Découvrir les offres sur le site
          </a>
        </div>
        <p className="text-xs text-white/40 max-w-xs leading-relaxed">
          © 2026 LIGGEEY. Tous droits réservés. Accompagnement à l'insertion professionnelle au Sénégal.
        </p>
      </div>

      <div className="flex items-center justify-center bg-surface px-6 py-10 md:py-16">
        <div className="w-full max-w-md">
          <a href={SITE_URL} className="inline-flex items-center gap-1.5 min-h-[44px] mb-4 text-sm font-medium hover:underline" style={{ color: COLORS.slateLight }}>
            <ArrowLeft size={15} /> Retour au site
          </a>
          <div className="md:hidden mb-8"><a href={SITE_URL} aria-label="LIGGEEY, retour au site" className="rounded-lg px-4 py-3 inline-flex" style={{ background: COLORS.dark }}><Logo /></a></div>
          {children}
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
    <div className="flex items-center mb-10">
      {steps.map((s, i) => {
        const state = s.n < step ? "done" : s.n === step ? "current" : "upcoming";
        return (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  background: state === "upcoming" ? COLORS.surface : COLORS.orange,
                  color: state === "upcoming" ? COLORS.slateLight : COLORS.onOrange,
                  border: state === "upcoming" ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                {state === "done" ? <Check size={13} /> : s.n}
              </div>
              <span
                className="text-sm whitespace-nowrap"
                style={{ color: state === "upcoming" ? COLORS.slateLight : COLORS.slate, fontWeight: state === "current" ? 600 : 400 }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px mx-3" style={{ background: COLORS.border }} />}
          </React.Fragment>
        );
      })}
    </div>
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
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  function go(p) {
    onPageChange(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div
      className="flex items-center justify-center gap-4 rounded-md border bg-surface py-3 text-sm mt-6"
      style={{ borderColor: COLORS.border, color: COLORS.slateLight }}
    >
      <button type="button" disabled={atStart} onClick={() => go(1)} style={{ opacity: atStart ? 0.35 : 1 }}>«</button>
      <button type="button" disabled={atStart} onClick={() => go(page - 1)} style={{ opacity: atStart ? 0.35 : 1 }}>‹</button>
      <span>Affichage {start} à {end} sur {totalItems} résultats</span>
      <button type="button" disabled={atEnd} onClick={() => go(page + 1)} style={{ opacity: atEnd ? 0.35 : 1 }}>›</button>
      <button type="button" disabled={atEnd} onClick={() => go(totalPages)} style={{ opacity: atEnd ? 0.35 : 1 }}>»</button>
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
          {t.tone === "info" ? <AlertCircle size={15} color={COLORS.orange} /> : <CheckCircle2 size={15} color="#4ADE80" />}
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
      <div role="img" aria-label={alt} className={`${className} flex items-center justify-center font-semibold text-sm`} style={{ background: COLORS.orangeSoft, color: COLORS.orange, ...style }}>
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

/* ---------- Screen 1 : Connexion ---------- */

function ConnexionScreen({ onNavigate }) {
  const [mode, setMode] = useState("login"); // login | forgot | sent
  const [email, setEmail] = useState("demo@liggeey.sn");
  const [password, setPassword] = useState("demo1234");
  const [espace, setEspace] = useState("chercheur");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetTouched, setResetTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const resetEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail);

  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setTouched(true);
    if (emailValid && passwordValid) {
      onNavigate("dashboard", { espace });
    } else {
      setStatus("error");
    }
  }

  function handleResetSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setResetTouched(true);
    if (resetEmailValid) setMode("sent");
  }

  if (mode === "forgot" || mode === "sent") {
    return (
      <form onSubmit={handleResetSubmit} noValidate>
        <button
          type="button"
          onClick={() => setMode("login")}
          className="flex items-center gap-1.5 text-sm font-medium mb-5"
          style={{ color: COLORS.orange }}
        >
          <ArrowLeft size={14} /> Retour à la connexion
        </button>
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.slate }}>Mot de passe oublié</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
          Saisissez votre adresse e-mail, nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {mode === "sent" ? (
          <div className="rounded-md px-4 py-3 text-sm mb-2" style={{ background: "#ECFDF5", color: "#047857" }}>
            Un lien de réinitialisation a été envoyé à <strong>{resetEmail}</strong>. Vérifiez votre boîte de réception.
          </div>
        ) : (
          <>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Adresse e-mail</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="exemple@liggeey.sn"
              className="w-full rounded-md border px-4 py-2.5 text-sm mb-1.5 outline-none transition-colors focus:border-primaire-400"
              style={{ borderColor: resetTouched && !resetEmailValid ? COLORS.danger : COLORS.border }}
            />
            <p className="text-xs mb-5" style={{ color: resetTouched && !resetEmailValid ? COLORS.danger : COLORS.slateLight }}>
              {resetTouched && !resetEmailValid ? "Veuillez saisir une adresse e-mail valide." : "Utilisez l'adresse associée à votre compte LIGGEEY"}
            </p>
            <button type="submit" className="w-full rounded-md py-3 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90" style={{ background: COLORS.orange }}>
              Envoyer le lien
            </button>
          </>
        )}
        <SSLNote />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.slate }}>Bon retour parmi nous</h2>
      <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>
        Pas encore de compte ?{" "}
        <button type="button" onClick={() => onNavigate("signup-choice")} className="font-semibold hover:underline" style={{ color: COLORS.orange }}>
          Inscrivez-vous
        </button>
      </p>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slateLight }}>
        Espace à ouvrir (démo)
      </label>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "chercheur", label: "Chercheur d'emploi" },
          { id: "prestataire", label: "Prestataire" },
          { id: "entreprise", label: "Entreprise" },
          { id: "admin", label: "Admin" },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setEspace(o.id)}
            className="flex-1 rounded-md py-2 text-xs font-semibold"
            style={{
              background: espace === o.id ? COLORS.orange : COLORS.surface,
              color: espace === o.id ? COLORS.onOrange : COLORS.slate,
              border: `1px solid ${espace === o.id ? COLORS.orange : COLORS.border}`,
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Adresse e-mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="exemple@liggeey.sn"
        className="w-full rounded-md border px-4 py-2.5 text-sm mb-1.5 outline-none transition-colors focus:border-primaire-400"
        style={{ borderColor: touched && !emailValid ? COLORS.danger : COLORS.border }}
      />
      <p className="text-xs mb-4" style={{ color: touched && !emailValid ? COLORS.danger : COLORS.slateLight }}>
        {touched && !emailValid ? "Veuillez saisir une adresse e-mail valide." : "Saisissez l'adresse e-mail utilisée lors de votre inscription"}
      </p>

      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold" style={{ color: COLORS.slate }}>Mot de passe</label>
        <button type="button" onClick={() => setMode("forgot")} className="text-sm font-medium hover:underline" style={{ color: COLORS.orange }}>Mot de passe oublié ?</button>
      </div>
      <div className="relative mb-1.5">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tapez votre mot de passe"
          className="w-full rounded-md border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primaire-400"
          style={{ borderColor: touched && !passwordValid ? COLORS.danger : COLORS.border }}
        />
        <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-discret hover:text-secondaire" aria-label="Afficher/masquer le mot de passe">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <p className="text-xs mb-5" style={{ color: touched && !passwordValid ? COLORS.danger : COLORS.slateLight }}>
        {touched && !passwordValid ? "8 caractères minimum requis." : "8 caractères minimum"}
      </p>

      <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-primaire-500" />
        <span className="text-sm" style={{ color: COLORS.slate }}>Se souvenir de moi</span>
      </label>

      <button type="submit" onClick={handleSubmit} className="w-full rounded-md py-3 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90" style={{ background: COLORS.orange }}>
        Se connecter
      </button>

      {status === "error" && (
        <div className="mt-5 rounded-md px-4 py-3 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C" }}>
          Merci de corriger les champs en rouge avant de continuer.
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
];

function ProfileRadioCard({ profile, selected, onSelect }) {
  const isSelected = selected === profile.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(profile.id)}
      className="w-full text-left rounded-lg border px-5 py-4 mb-3 transition-colors"
      style={{
        borderColor: isSelected ? COLORS.orange : COLORS.border,
        background: isSelected ? COLORS.orangeSoft : COLORS.surface,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold" style={{ color: COLORS.slate }}>{profile.title}</p>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>{profile.subtitle}</p>
        </div>
        <span
          className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-4"
          style={{ borderColor: isSelected ? COLORS.orange : COLORS.borderStrong }}
        >
          {isSelected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.orange }} />}
        </span>
      </div>
    </button>
  );
}

function SignupChoiceScreen({ onNavigate }) {
  const [selected, setSelected] = useState("chercheur");

  return (
    <div>
      <Stepper step={1} />
      <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.slate }}>Créer votre compte</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Déjà inscrit ?{" "}
        <button type="button" onClick={() => onNavigate("login")} className="font-semibold hover:underline" style={{ color: COLORS.orange }}>
          Connectez-vous
        </button>
      </p>

      {PROFILES.map((p) => (
        <ProfileRadioCard key={p.id} profile={p} selected={selected} onSelect={setSelected} />
      ))}

      <button
        type="button"
        onClick={() => onNavigate("signup-info", { profile: selected })}
        className="w-full rounded-md py-3 mt-3 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90"
        style={{ background: COLORS.orange }}
      >
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
};

const FIELD_CONFIG = {
  chercheur: [
    { name: "nom", label: "Nom complet", placeholder: "Ex: Moussa Diop", help: "Saisissez votre prénom et votre nom" },
    { name: "email", label: "Adresse e-mail", type: "email", placeholder: "moussa.diop@exemple.sn", help: "Saisissez une adresse e-mail valide pour la validation" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 77 000 00 00", help: "Exemple de format valide au Sénégal" },
  ],
  entreprise: [
    { name: "entreprise", label: "Nom de l'entreprise", placeholder: "Ex: Sonatel SA", help: "Saisissez le nom officiel de votre entreprise" },
    { name: "responsable", label: "Nom du responsable", placeholder: "Ex: Amadou Ba", help: "Prénom et Nom de la personne en charge des recrutements" },
    { name: "email", label: "Adresse e-mail professionnelle", type: "email", placeholder: "contact@entreprise.sn", help: "Utilisez une adresse e-mail professionnelle" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 33 000 00 00", help: "Numéro de contact de l'entreprise ou du recruteur" },
    { name: "secteur", label: "Secteur d'activité", placeholder: "Ex: Télécommunications", help: "Sélectionnez ou saisissez votre domaine principal" },
  ],
  prestataire: [
    { name: "nom", label: "Nom complet", placeholder: "Ex: Fatou Ndiaye", help: "Saisissez votre prénom et votre nom" },
    { name: "email", label: "Adresse e-mail", type: "email", placeholder: "fatou.ndiaye@exemple.sn", help: "Saisissez une adresse e-mail valide pour la validation" },
    { name: "telephone", label: "Téléphone", placeholder: "+221 77 000 00 00", help: "Exemple de format valide au Sénégal" },
    { name: "competences", label: "Domaine de compétence", placeholder: "Ex: Restauration, Nettoyage, Maintenance", help: "Saisissez vos compétences clés (séparées par des virgules)" },
    { name: "ville", label: "Ville", placeholder: "Ex: Dakar", help: "Votre ville de résidence principale au Sénégal" },
  ],
};

function SignupInfoScreen({ profile, onNavigate }) {
  const meta = PROFILE_META[profile] || PROFILE_META.chercheur;
  const fields = FIELD_CONFIG[profile] || FIELD_CONFIG.chercheur;

  const [values, setValues] = useState({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [touched, setTouched] = useState(false);

  const passwordValid = password.length >= 8 && /\d/.test(password);
  const fieldsValid = fields.every((f) => (values[f.name] || "").trim().length > 0);
  const emailField = fields.find((f) => f.type === "email");
  const emailValid = emailField ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[emailField.name] || "") : true;
  const formValid = fieldsValid && emailValid && passwordValid && accepted;

  function setField(name, val) {
    setValues((v) => ({ ...v, [name]: val }));
  }

  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setTouched(true);
    if (formValid) onNavigate("signup-confirm", { profile });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stepper step={2} />
      <span
        className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
        style={{ background: COLORS.orangeSoft, color: COLORS.orange }}
      >
        {meta.badge}
      </span>
      <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.slate }}>Créer votre compte</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Remplissez les informations suivantes pour finaliser votre inscription {meta.tagline}.
      </p>

      {fields.map((f) => {
        const val = values[f.name] || "";
        const invalid = touched && (val.trim().length === 0 || (f.type === "email" && !emailValid));
        return (
          <div key={f.name} className="mb-4">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>
              {f.label} <span style={{ color: COLORS.danger }}>*</span>
            </label>
            <input
              type={f.type || "text"}
              value={val}
              onChange={(e) => setField(f.name, e.target.value)}
              placeholder={f.placeholder}
              className="w-full rounded-md border px-4 py-2.5 text-sm mb-1.5 outline-none transition-colors focus:border-primaire-400"
              style={{ borderColor: invalid ? COLORS.danger : COLORS.border }}
            />
            <p className="text-xs" style={{ color: invalid ? COLORS.danger : COLORS.slateLight }}>
              {invalid ? "Ce champ est requis." : f.help}
            </p>
          </div>
        );
      })}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>
          Mot de passe <span style={{ color: COLORS.danger }}>*</span>
        </label>
        <div className="relative mb-1.5">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tapez votre mot de passe"
            className="w-full rounded-md border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primaire-400"
            style={{ borderColor: touched && !passwordValid ? COLORS.danger : COLORS.border }}
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-discret hover:text-secondaire" aria-label="Afficher/masquer le mot de passe">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs" style={{ color: touched && !passwordValid ? COLORS.danger : COLORS.slateLight }}>
          8 caractères minimum avec au moins un chiffre
        </p>
      </div>

      <label className="flex items-start gap-2.5 mb-6 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="w-4 h-4 rounded accent-primaire-500 mt-0.5"
        />
        <span className="text-sm" style={{ color: COLORS.slate }}>
          J'accepte les{" "}
          <a href="#" className="hover:underline" style={{ color: COLORS.orange }}>conditions d'utilisation</a> et la{" "}
          <a href="#" className="hover:underline" style={{ color: COLORS.orange }}>politique de confidentialité</a> de Liggeey.
        </span>
      </label>
      {touched && !accepted && (
        <p className="text-xs mb-4 -mt-4" style={{ color: COLORS.danger }}>Merci d'accepter les conditions pour continuer.</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onNavigate("signup-choice")}
          className="flex-1 rounded-md py-3 text-sm font-semibold border transition-colors hover:bg-doux"
          style={{ borderColor: COLORS.border, color: COLORS.slate }}
        >
          Retour
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex-1 rounded-md py-3 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90"
          style={{ background: COLORS.orange }}
        >
          Créer mon compte
        </button>
      </div>

      <SSLNote />
    </form>
  );
}

/* ---------- Screen 4 : Inscription — Confirmation ---------- */

function ConfirmationScreen({ profile, onNavigate }) {
  const meta = PROFILE_META[profile] || PROFILE_META.chercheur;
  return (
    <div>
      <Stepper step={3} />
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#ECFDF5" }}
      >
        <Check size={26} color="#047857" />
      </div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.slate }}>Compte créé avec succès</h2>
      <p className="text-sm mb-8 leading-relaxed" style={{ color: COLORS.slateLight }}>
        Bienvenue sur LIGGEEY ! Votre compte <strong style={{ color: COLORS.slate }}>{meta.tagline}</strong> est prêt.
      </p>
      <button
        type="button"
        onClick={() => onNavigate("dashboard", { espace: profile })}
        className="w-full rounded-md py-3 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90 mb-3"
        style={{ background: COLORS.orange }}
      >
        Accéder à mon tableau de bord
      </button>
      <button
        type="button"
        onClick={() => onNavigate("login")}
        className="w-full rounded-md py-3 text-sm font-semibold border transition-colors hover:bg-doux"
        style={{ borderColor: COLORS.border, color: COLORS.slate }}
      >
        Retour à la connexion
      </button>
      <SSLNote />
    </div>
  );
}

/* ---------- Coquille de l'application : menu groupé, fil d'Ariane, « À faire » ---------- */

const NAV_ITEMS_BY_ESPACE = {
  chercheur: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Ma recherche" },
    { id: "offres", label: "Offres d'emploi", icon: Briefcase, section: "Ma recherche" },
    { id: "candidatures", label: "Mes candidatures", icon: ClipboardList, section: "Ma recherche" },
    { id: "formations", label: "Formations", icon: GraduationCap, section: "Progresser" },
    { id: "mentors", label: "Mentors", icon: UsersRound, section: "Progresser" },
    { id: "suivi", label: "Suivi post-embauche", icon: HeartHandshake, section: "Mon emploi" },
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
    { id: "profil", label: "Mon profil", icon: UserCircle2, section: "Mon compte" },
    { id: "abonnement", label: "Abonnement", icon: Crown, section: "Mon compte" },
  ],
  entreprise: [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, section: "Recrutement" },
    { id: "offres", label: "Mes offres", icon: Briefcase, section: "Recrutement" },
    { id: "candidatures", label: "Candidatures", icon: ClipboardList, section: "Recrutement" },
    { id: "suivi", label: "Suivi des recrues", icon: HeartHandshake, section: "Recrutement" },
    { id: "prestataires", label: "Trouver un prestataire", icon: Users2, section: "Prestataires" },
    { id: "profil", label: "Profil entreprise", icon: Building2, section: "Mon compte" },
    { id: "abonnement", label: "Abonnement", icon: Crown, section: "Mon compte" },
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
    { id: "suivi", label: "Suivi post-embauche", icon: HeartHandshake, section: "Accompagnement" },
    { id: "verifications", label: "Vérification des documents", icon: ShieldCheck, section: "Contrôle" },
    { id: "regularisations", label: "Régularisations", icon: Landmark, section: "Contrôle" },
    { id: "abonnements", label: "Abonnements", icon: CreditCard, section: "Finances et réglages" },
    { id: "parametres", label: "Paramètres", icon: Settings, section: "Finances et réglages" },
  ],
};

/* Pages secondaires : rattachées à une entrée du menu, avec leur fil d'Ariane */
const SUB_PAGES = {
  evaluations: { parent: "profil", label: "Mes évaluations et avis" },
  realisations: { parent: "profil", label: "Mes réalisations" },
};

const USER_BY_ESPACE = {
  chercheur: { name: "Absatou Diallo", role: "Chercheuse d'emploi", initials: "AD" },
  prestataire: { name: "Mamadou Ndiaye", role: "Électricien · prestataire", initials: "MN" },
  entreprise: { name: "Awa Diallo", role: "Senegal Construction SARL", initials: "AD" },
  admin: { name: "Admin LIGGEEY", role: "Super admin", initials: "AL" },
};

const RAIL_ICONS = [Flame, Grid3x3, Zap, Triangle, AlignJustify, Layers, Bell];

function IconRail() {
  return (
    <div className="hidden md:flex flex-col items-center w-14 shrink-0 py-4 gap-3" style={{ background: COLORS.darkDeep }} aria-hidden="true">
      {RAIL_ICONS.map((Icon, i) => (
        <div key={i} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: i === 0 ? COLORS.orange : "transparent" }}>
          <Icon size={16} color={i === 0 ? "#fff" : i === RAIL_ICONS.length - 1 ? "#4ADE80" : COLORS.onDarkSubtle} />
        </div>
      ))}
    </div>
  );
}

function Sidebar({ navItems, active, onNavigate, user, badges = {} }) {
  const planApi = usePlan();
  const currentPlan = planApi && !planApi.isAdmin ? planApi.plan : null;
  const upgradeTo = currentPlan && currentPlan.prixMensuel === 0 ? planApi.nextPlan() : null;
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches);

  return (
    <div className="flex flex-col shrink-0 py-5 px-3 transition-all sticky top-0 h-screen overflow-y-auto" style={{ background: COLORS.dark, width: collapsed ? 64 : 240 }}>
      <div className={`flex items-center mb-6 px-1 ${collapsed ? "flex-col gap-3" : "justify-between"}`}>
        <a href={SITE_URL} aria-label="LIGGEEY, retour au site" title="Retour au site" className="inline-flex">
          {collapsed ? <Logo iconOnly height={22} /> : <Logo />}
        </a>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="w-6 h-6 rounded border flex items-center justify-center shrink-0"
          style={{ borderColor: COLORS.orange }}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          title={collapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {collapsed ? <PanelLeft size={13} color={COLORS.orange} /> : <PanelLeftClose size={13} color={COLORS.orange} />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5" aria-label="Navigation principale">
        {navItems.map((item, i) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          const newSection = item.section && (i === 0 || navItems[i - 1].section !== item.section);
          const badge = badges[item.id] || 0;
          return (
            <React.Fragment key={item.id}>
              {newSection && (collapsed ? (
                i > 0 && <div className="my-2 mx-2 h-px" style={{ background: COLORS.darkLine }} />
              ) : (
                <p className={`text-[11px] font-semibold px-3 mb-1 ${i > 0 ? "mt-4" : ""}`} style={{ color: COLORS.onDarkSubtle }}>{item.section}</p>
              ))}
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-2.5 rounded-md py-2 text-sm text-left transition-colors ${collapsed ? "justify-center px-0" : "px-3"}`}
                style={{ background: isActive ? COLORS.orange : "transparent", color: isActive ? COLORS.onOrange : COLORS.onDarkMuted, fontWeight: isActive ? 600 : 400 }}
              >
                <Icon size={17} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {badge > 0 && (collapsed ? (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full" style={{ background: COLORS.orange }} aria-label={`${badge} à traiter`} />
                ) : (
                  <span className="text-[11px] font-bold rounded-full px-1.5 min-w-[20px] text-center" style={{ background: isActive ? COLORS.surface : COLORS.orange, color: isActive ? COLORS.orange : COLORS.onOrange }} aria-label={`${badge} à traiter`}>{badge}</span>
                ))}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="pt-4 mt-4" style={{ borderTop: "1px solid #2C241C" }}>
        <div className={`flex items-center gap-2.5 mb-3 ${collapsed ? "justify-center px-0" : "px-1"}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orange, color: COLORS.onOrange }} title={collapsed ? `${user.name} · ${user.role}` : undefined}>
            {user.initials}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sur-sombre truncate">{user.name}</p>
              <p className="text-xs truncate" style={{ color: COLORS.onDarkSubtle }}>{user.role}</p>
            </div>
          )}
        </div>
        {currentPlan && (
          <button
            type="button"
            onClick={() => onNavigate("abonnement")}
            title={collapsed ? `Profil ${currentPlan.nom}` : undefined}
            className={`w-full rounded-md mb-3 flex items-center text-xs ${collapsed ? "justify-center py-2" : "justify-between px-3 py-2"}`}
            style={{ background: COLORS.darkLine }}
          >
            {collapsed ? (
              <Crown size={14} color={upgradeTo ? COLORS.onDarkSubtle : COLORS.orange} />
            ) : (
              <>
                <span className="flex items-center gap-1.5" style={{ color: COLORS.onDarkMuted }}>
                  {!upgradeTo && <Crown size={12} color={COLORS.orange} />} Profil {currentPlan.nom}
                </span>
                {upgradeTo && <span className="font-semibold" style={{ color: COLORS.orange }}>Passer {upgradeTo.nom}</span>}
              </>
            )}
          </button>
        )}
        <button type="button" onClick={() => onNavigate("login")} title="Changer d'espace" className={`flex items-center gap-1.5 text-xs ${collapsed ? "justify-center w-full" : "px-1"}`} style={{ color: COLORS.onDarkSubtle }}>
          <ArrowLeft size={12} /> {!collapsed && "Changer d'espace"}
        </button>
        <a href={SITE_URL} title="Retour au site" aria-label={collapsed ? "Retour au site" : undefined} className={`mt-3 flex items-center gap-1.5 text-xs hover:text-sur-sombre ${collapsed ? "justify-center w-full" : "px-1"}`} style={{ color: COLORS.onDarkSubtle }}>
          <Home size={12} /> {!collapsed && "Retour au site"}
        </a>
      </div>
    </div>
  );
}

function Breadcrumb({ items, onNavigate }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm mb-6 flex-wrap" style={{ color: COLORS.slateLight }}>
      <button type="button" onClick={() => onNavigate("dashboard")} aria-label="Tableau de bord" className="hover:opacity-70"><Home size={14} /></button>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            <ChevronRight size={13} />
            {!last && it.id ? (
              <button type="button" onClick={() => onNavigate(it.id)} className="hover:underline">{it.label}</button>
            ) : (
              <span aria-current={last ? "page" : undefined} style={{ color: last ? COLORS.slate : COLORS.slateLight, fontWeight: last ? 500 : 400 }}>{it.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function AppShell({ navItems, active, onNavigate, user, breadcrumb, badges, children }) {
  const mainRef = useRef(null);
  // Remonte en haut de page dès que l'écran (ou une vue détail) change.
  useEffect(() => {
    const el = mainRef.current;
    if (!el || typeof MutationObserver === "undefined") return undefined;
    let last = el.querySelector("h1")?.textContent;
    const obs = new MutationObserver(() => {
      const t = el.querySelector("h1")?.textContent;
      if (t !== last) {
        last = t;
        window.scrollTo(0, 0);
      }
    });
    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", background: COLORS.soft }}>
      <IconRail />
      <Sidebar navItems={navItems} active={active} onNavigate={onNavigate} user={user} badges={badges} />
      <main ref={mainRef} className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-6 md:py-8 overflow-x-hidden">
        <Breadcrumb items={breadcrumb} onNavigate={onNavigate} />
        {children}
      </main>
    </div>
  );
}

/* ----- Bloc « À faire » affiché en haut de chaque tableau de bord ----- */

function TodoPanel({ items, onNavigate }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-lg border bg-surface mb-6 overflow-hidden" style={{ borderColor: COLORS.border }}>
      <p className="px-5 pt-4 pb-2 font-semibold" style={{ color: COLORS.slate }}>À faire maintenant</p>
      {items.map((it) => {
        const Icon = it.icon || AlertCircle;
        return (
          <button key={it.label} type="button" onClick={() => onNavigate(it.to, it.data)} className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-[#F7F5F2]" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <span className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: it.urgent ? "#FEE2E2" : COLORS.orangeSoft }}>
                <Icon size={15} color={it.urgent ? "#B91C1C" : COLORS.orange} />
              </span>
              <span className="text-sm" style={{ color: COLORS.slate }}>{it.label}</span>
            </span>
            <ChevronRight size={16} color={COLORS.slateLight} className="shrink-0" />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Screen 5 : Dashboard (Chercheur d'emploi) ---------- */

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
      <div className="w-9 h-9 rounded-md flex items-center justify-center mb-4" style={{ background: COLORS.orangeSoft }}>
        <Icon size={17} color={COLORS.orange} />
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>{value}</p>
      <p className="text-sm" style={{ color: COLORS.slateLight }}>{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Entretien programmé": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Vue par le recruteur": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Réponse négative": { bg: "#FEE2E2", color: "#B91C1C" },
    "Candidature reçue": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Candidature Retenue": { bg: "#DCFCE7", color: "#16A34A" },
    "En attente": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Payé": { bg: "#DCFCE7", color: "#16A34A" },
    "Refusé": { bg: "#FEE2E2", color: "#B91C1C" },
    "Refusée": { bg: "#FEE2E2", color: "#B91C1C" },
    "Acceptée": { bg: "#DCFCE7", color: "#16A34A" },
    "En cours": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Terminée": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "Nouveau": { bg: "#DBEAFE", color: "#1D4ED8" },
    "Retenu": { bg: "#DCFCE7", color: "#16A34A" },
    "Rejeté": { bg: "#FEE2E2", color: "#B91C1C" },
    "Disponible": { bg: "#DCFCE7", color: "#16A34A" },
    "Occupé": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Vérifié": { bg: "#DCFCE7", color: "#16A34A" },
    "Validé": { bg: "#DCFCE7", color: "#16A34A" },
    "Suspendu": { bg: "#FEE2E2", color: "#B91C1C" },
    "Suspendue": { bg: "#FEE2E2", color: "#B91C1C" },
    "Actif": { bg: "#DCFCE7", color: "#16A34A" },
    "Active": { bg: "#DCFCE7", color: "#16A34A" },
    "En pause": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Complète": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "Brouillon": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "Expirée": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "Inactif": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "Annulée": { bg: "#FEE2E2", color: "#B91C1C" },
    "Annulé": { bg: "#FEE2E2", color: "#B91C1C" },
    "En révision": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "En cours d'apprentissage": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Apprenant": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Mentoré": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Remboursé": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "Fait": { bg: "#DCFCE7", color: "#16A34A" },
    "À compléter": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "À venir": { bg: COLORS.softStrong, color: COLORS.slateLight },
    "En période d'essai": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "À risque": { bg: "#FEE2E2", color: "#B91C1C" },
    "Confirmé": { bg: "#DCFCE7", color: "#16A34A" },
    "Ouvert": { bg: "#DBEAFE", color: "#1D4ED8" },
    "Traité": { bg: "#DCFCE7", color: "#16A34A" },
    "En vérification": { bg: COLORS.orangeSoft, color: COLORS.orange },
    "Échoué": { bg: "#FEE2E2", color: "#B91C1C" },
    "Échec de paiement": { bg: "#FEE2E2", color: "#B91C1C" },
  };
  const s = styles[status] || { bg: COLORS.softStrong, color: COLORS.slateLight };
  return (
    <span className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}


function DashboardScreen({ user, onNavigate, todos }) {
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const [coachings] = useStore("coachings-c", {});
  const mentor = MENTORS[0];
  const prochainCoaching = (coachings[mentor.id] || defaultCoachings(mentor)).upcoming[0];
  const enAttente = candidatures.filter((c) => c.statut === "Candidature reçue" || c.statut === "Vue par le recruteur").length;
  const entretiens = candidatures.filter((c) => c.statut === "Entretien programmé").length;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Bonjour, {user.name}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Voici un aperçu de votre recherche d'emploi et de votre nouveau poste.</p>
      <TodoPanel items={todos} onNavigate={onNavigate} />

      <div className="rounded-lg p-6 mb-6 flex items-center justify-between gap-6" style={{ background: COLORS.dark }}>
        <div className="flex-1">
          <p className="text-lg font-bold text-sur-sombre mb-1">Profil complété à 70%</p>
          <p className="text-sm mb-3" style={{ color: COLORS.orange }}>
            Les profils complets sont contactés bien plus souvent par les recruteurs.
          </p>
          <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.darkTrack }}>
            <div className="h-1.5 rounded-full" style={{ width: "70%", background: COLORS.orange }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("profil")}
          className="shrink-0 rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90"
          style={{ background: COLORS.orange }}
        >
          Compléter mon profil
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FileText} value={candidatures.length} label="Candidatures envoyées" />
        <StatCard icon={CalendarCheck} value={entretiens} label="Entretiens programmés" />
        <StatCard icon={Clock} value={enAttente} label="En attente de retour" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Candidatures récentes</h3>
            <button type="button" onClick={() => onNavigate("candidatures")} className="text-sm font-medium" style={{ color: COLORS.orange }}>
              Tout voir
            </button>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: COLORS.border }}>
            {candidatures.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>{c.poste}</p>
                  <p className="text-xs" style={{ color: COLORS.slateLight }}>{c.entreprise} · {c.ville}</p>
                </div>
                <StatusBadge status={c.statut} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Mentors</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold mb-3"
              style={{ background: COLORS.orangeSoft, color: COLORS.orange }}
            >
              CF
            </div>
            <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>Cheikh Fall</p>
            <p className="text-xs" style={{ color: COLORS.slateLight }}>Mentor · Ressources humaines</p>
          </div>
          <div className="pt-4 mb-4 text-center" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <p className="text-xs mb-1" style={{ color: COLORS.orange }}>Prochain coaching</p>
            <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{prochainCoaching ? prochainCoaching.date : "Aucun coaching prévu"}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("mentors", { mentorId: "cheikh-fall" })}
            className="w-full rounded-md py-2.5 text-sm font-semibold border transition-colors hover:bg-doux"
            style={{ borderColor: COLORS.border, color: COLORS.slate }}
          >
            Voir mon Mentor
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Screen 6 : Offres d'emploi ---------- */

const OFFRES_DATA = [
  {
    titre: "Développeur Full Stack",
    contrat: "CDI",
    entreprise: "Sonatel",
    secteur: "Télécommunications",
    localisation: "Dakar, Plateau",
    description:
      "Vous serez en charge du développement des applications web de l'entreprise, en utilisant des technologies modernes telles que React, Node.js et MongoDB. Vous travaillerez en équipe pour concevoir des interfaces utilisateur fluides et des backends robustes.",
    competences: ["React", "Node.js", "MongoDB"],
  },
  {
    titre: "Chargée de clientèle",
    contrat: "CDD",
    entreprise: "Banque Atlantique",
    secteur: "Finance & Banque",
    localisation: "Dakar",
    description:
      "Vous accueillez, conseillez et fidélisez un portefeuille de clients particuliers, en veillant à la qualité de service et à l'atteinte des objectifs commerciaux de l'agence.",
    competences: ["Relation client", "Vente", "Sens du service"],
  },
  {
    titre: "Assistante comptable",
    contrat: "CDI",
    entreprise: "Teranga Capital",
    secteur: "Investissement",
    localisation: "Dakar",
    description:
      "Vous assurez la saisie comptable, le suivi des factures fournisseurs/clients et participez à la préparation des clôtures mensuelles sous la supervision du responsable financier.",
    competences: ["Comptabilité", "Excel", "Rigueur"],
  },
  {
    titre: "Responsable marketing digital",
    contrat: "CDI",
    entreprise: "Wave Mobile",
    secteur: "Fintech",
    localisation: "Dakar",
    description:
      "Vous définissez et pilotez la stratégie d'acquisition digitale (SEO, SEA, réseaux sociaux) et analysez la performance des campagnes pour optimiser le coût d'acquisition.",
    competences: ["SEO/SEA", "Réseaux sociaux", "Analytics"],
  },
  {
    titre: "Ingénieur réseau",
    contrat: "Stage",
    entreprise: "Expresso Sénégal",
    secteur: "Télécommunications",
    localisation: "Dakar",
    description:
      "Vous participez à la supervision et à l'optimisation de l'infrastructure réseau, sous l'encadrement de l'équipe technique.",
    competences: ["Réseaux", "Supervision", "Dépannage"],
  },
  {
    titre: "Chef de projet IT",
    contrat: "CDI",
    entreprise: "Atos Sénégal",
    secteur: "Consulting IT",
    localisation: "Dakar",
    description:
      "Vous pilotez des projets d'intégration IT pour des clients grands comptes, de la phase de cadrage jusqu'à la mise en production.",
    competences: ["Gestion de projet", "Agile", "Relation client"],
  },
  {
    titre: "Community Manager",
    contrat: "CDD",
    entreprise: "Jumia Sénégal",
    secteur: "E-commerce",
    localisation: "Dakar",
    description:
      "Vous animez les réseaux sociaux de la marque, créez du contenu engageant et suivez les indicateurs de performance des publications.",
    competences: ["Réseaux sociaux", "Création de contenu", "Reporting"],
  },
];

function OfferCard({ offre, onOpen, applied }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(offre)}
      className="text-left rounded-lg border bg-surface p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <p className="font-semibold" style={{ color: COLORS.slate }}>{offre.titre}</p>
        {offre.sponsorisee && <PremiumChip label="Sponsorisée" />}
      </div>
      <p className="text-xs mb-4" style={{ color: applied ? "#16A34A" : COLORS.slateLight }}>{offre.contrat}{applied ? " · Déjà postulé" : ""}</p>
      <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="w-8 h-8 rounded-full shrink-0" style={{ background: COLORS.orangeSoft }} />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{offre.entreprise}</p>
          <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{offre.secteur}</p>
        </div>
      </div>
    </button>
  );
}

function OfferModal({ offre, onClose }) {
  const [applied, setApplied] = useState(false);
  const planApi = usePlan();
  const [candidatures, setCandidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!offre) return null;
  const existing = candidatures.find((c) => c.poste === offre.titre && c.entreprise === offre.entreprise);
  const restantes = planApi ? planApi.remaining("candidatures") : UNLIMITED;
  function postuler() {
    if (planApi && restantes <= 0) { planApi.requestUpgrade("candidatures"); return; }
    if (planApi) planApi.consume("candidatures");
    setCandidatures((l) => [{ id: `cand-${Date.now()}`, poste: offre.titre, entreprise: offre.entreprise, ville: offre.localisation.split(",")[0], date: frLongDate(demoNow()), statut: "Candidature reçue", step: 1 }, ...l]);
    setApplied(true);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(15,11,8,0.55)" }} onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-lg bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: COLORS.slate }}>{offre.titre}</h3>
          <button type="button" onClick={onClose} className="text-discret hover:text-secondaire text-xl leading-none">×</button>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <Row label="Entreprise" value={`${offre.entreprise} · ${offre.secteur}`} />
          <Row label="Type de contrat" value={offre.contrat} />
          <Row label="Localisation" value={offre.localisation} />
          <Row label="Description" value={offre.description} />
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.slateLight }}>Compétences requises</p>
            <div className="flex flex-wrap gap-1.5">
              {offre.competences.map((c) => (
                <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {applied ? (
          <div className="rounded-md px-4 py-3 text-sm mb-2" style={{ background: "#ECFDF5", color: "#047857" }}>
            Candidature envoyée. Vous la retrouverez dans « Mes candidatures ».
          </div>
        ) : existing ? (
          <div className="rounded-md px-4 py-3 text-sm mb-2 flex items-center justify-between gap-3" style={{ background: COLORS.soft, color: COLORS.slate }}>
            <span>Vous avez déjà postulé le {existing.date}.</span>
            <StatusBadge status={existing.statut} />
          </div>
        ) : (
          <>
          {restantes !== UNLIMITED && (
            <p className="text-xs mb-3" style={{ color: restantes > 0 ? COLORS.slateLight : COLORS.danger }}>
              {restantes > 0 ? `Il vous reste ${restantes} candidature${restantes > 1 ? "s" : ""} ce mois-ci avec le profil ${planApi.plan.nom}.` : `Vous avez utilisé toutes vos candidatures du mois avec le profil ${planApi.plan.nom}.`}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-5 py-2.5 text-sm font-semibold border transition-colors hover:bg-doux"
              style={{ borderColor: COLORS.border, color: COLORS.slate }}
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={postuler}
              className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90"
              style={{ background: COLORS.orange }}
            >
              Postuler
            </button>
          </div>
          </>
        )}
      </div>
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

function OffresScreen({ extraOffres = [] }) {
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  const ALL_OFFRES = [...extraOffres, ...OFFRES_DATA].sort((a, b) => (b.sponsorisee ? 1 : 0) - (a.sponsorisee ? 1 : 0));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = ALL_OFFRES.filter((o) =>
    (o.titre + o.entreprise + o.secteur).toLowerCase().includes(query.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Offres d'emploi</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Un statut réel pour chaque candidature, mis à jour à chaque étape – jamais de silence indéfini.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Rechercher ici"
        className="w-full max-w-sm rounded-md border px-4 py-2.5 text-sm mb-6 outline-none focus:border-primaire-400"
        style={{ borderColor: COLORS.border }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((o) => (
          <OfferCard key={o.titre + o.entreprise} offre={o} onOpen={setSelected} applied={candidatures.some((c) => c.poste === o.titre && c.entreprise === o.entreprise)} />
        ))}
        {paged.length === 0 && (
          <p className="text-sm col-span-full" style={{ color: COLORS.slateLight }}>Aucune offre ne correspond à votre recherche.</p>
        )}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />

      <OfferModal key={selected ? selected.titre + selected.entreprise : "none"} offre={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ---------- Screen 7 : Mes candidatures ---------- */

const CANDIDATURES = [
  { id: "cand-sonatel", poste: "Chargée de clientèle", entreprise: "Sonatel", ville: "Dakar", date: "28 juillet 2026", statut: "Candidature Retenue", step: 4, embauche: true },
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
  { poste: "Assistante RH", entreprise: "Auchan Sénégal", ville: "Dakar", date: "1 août 2026", statut: "Candidature reçue", step: 1 },
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

function CandidatureCard({ c, onNavigate }) {
  return (
    <div className="rounded-lg border bg-surface p-5 mb-4" style={{ borderColor: c.embauche ? "#86EFAC" : COLORS.border }}>
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="font-semibold" style={{ color: COLORS.slate }}>{c.poste}</p>
        <StatusBadge status={c.statut} />
      </div>
      <p className="text-xs" style={{ color: COLORS.slateLight }}>
        {c.entreprise} · {c.ville} · Postulé le {c.date}
      </p>
      <CandidatureStepper step={c.step} negative={c.negative} />
      {c.negative && (
        <div className="mt-4 rounded-md px-4 py-3 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C" }}>
          <strong>Motif communiqué par le recruteur : </strong>{c.motif}
        </div>
      )}
      {c.embauche && (
        <div className="mt-4 rounded-md px-4 py-3 text-sm flex items-center justify-between gap-3 flex-wrap" style={{ background: "#ECFDF5", color: "#047857" }}>
          <span>Vous avez été recrutée. LIGGEEY vous accompagne pendant vos six premiers mois.</span>
          <button type="button" onClick={() => onNavigate("suivi")} className="font-semibold underline">Voir mon suivi post-embauche</button>
        </div>
      )}
    </div>
  );
}

function CandidaturesScreen({ onNavigate }) {
  const [candidatures] = useStore("candidatures-chercheur", CANDIDATURES);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Mes candidatures</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Suivez en temps réel l'avancement de vos dossiers de candidature auprès des entreprises sénégalaises.
      </p>
      {candidatures.length === 0 && (
        <div className="rounded-lg border bg-surface p-6 text-sm" style={{ borderColor: COLORS.border, color: COLORS.slateLight }}>
          Vous n'avez pas encore postulé. <button type="button" onClick={() => onNavigate("offres")} className="font-semibold" style={{ color: COLORS.orange }}>Parcourir les offres</button>
        </div>
      )}
      {candidatures.map((c) => (
        <CandidatureCard key={c.id || c.poste} c={c} onNavigate={onNavigate} />
      ))}
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
    const duree = `${Math.max(1, Math.round((formation.heures / total) * 2) / 2)}h`;
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
  "Complété": { bg: "#DCFCE7", color: "#16A34A" },
  "En cours": { bg: COLORS.orangeSoft, color: COLORS.orange },
  "Verrouillé": { bg: COLORS.softStrong, color: COLORS.slateLight },
};

const FORMATIONS_ALL = [
  { id: "marketing", nom: "Marketing Digital", modules: 12, heures: 28, enrolled: true, progressCount: 6, coach: "aissatou.fall@email.com", tagline: "Élaborer une stratégie marketing digitale efficace.", description: "Vous apprendrez à construire une stratégie de contenu, à piloter des campagnes publicitaires en ligne et à mesurer la performance de vos actions marketing." },
  { id: "devweb", nom: "Développement Web", modules: 10, heures: 24, enrolled: false, coach: "ibrahima.diouf@email.com", tagline: "Concevoir des sites web modernes et responsives.", description: "Une introduction complète au développement web, du HTML/CSS aux bases de JavaScript, pour construire vos premiers sites." },
  { id: "compta", nom: "Comptabilité & Finance", modules: 15, heures: 40, enrolled: true, progressCount: 8, coach: "khadija.sy@email.com", tagline: "Gérer la comptabilité et les finances d'une entreprise.", description: "Les bases de la comptabilité générale et de la gestion financière, pour tenir les comptes d'une petite structure." },
  { id: "comdigitale", nom: "Communication Digitale", modules: 8, heures: 18, enrolled: true, progressCount: 5, coach: "jean-pierre.dupont@email.com", tagline: "Maîtriser les règles et usages de la communication digitale.", description: "Cette formation vise à transmettre les fondamentaux opérationnels de l'écosystème numérique. Vous apprendrez à concevoir des campagnes sur les réseaux sociaux, structurer votre SEO, rédiger pour le web et utiliser les leviers d'acquisition digitaux indispensables pour piloter la visibilité de votre entreprise.", linkedCandidature: { poste: "Chargée de clientèle", date: "28 juillet 2026", ville: "Dakar", step: 4, statut: "Candidature Retenue" } },
  { id: "gestionprojet", nom: "Gestion de Projet", modules: 12, heures: 32, enrolled: true, progressCount: 7, coach: "moussa.ndao@email.com", tagline: "Piloter un projet de bout en bout.", description: "Les méthodologies agiles et classiques pour cadrer, planifier et livrer un projet dans les temps." },
  { id: "anglais", nom: "Anglais Professionnel", modules: 14, heures: 36, enrolled: true, progressCount: 9, coach: "sarah.johnson@email.com", tagline: "Communiquer avec aisance en anglais professionnel.", description: "Un entraînement à l'oral et à l'écrit pour gagner en aisance dans un contexte professionnel anglophone." },
  { id: "excel", nom: "Excel Avancé", modules: 6, heures: 12, enrolled: false, coach: "oumar.ba@email.com", tagline: "Exploiter les fonctions avancées d'Excel.", description: "Tableaux croisés dynamiques, macros et modélisation pour aller au-delà des bases d'Excel." },
  { id: "leadership", nom: "Leadership & Management", modules: 10, heures: 20, enrolled: false, coach: "fatima.sarr@email.com", tagline: "Manager et motiver une équipe.", description: "Déléguer, motiver et prendre des décisions : les fondamentaux du management d'équipe." },
  { id: "rh", nom: "Ressources Humaines", modules: 8, heures: 16, enrolled: false, coach: "cheikh.gueye@email.com", tagline: "Maîtriser les fondamentaux des ressources humaines.", description: "Recrutement, gestion de la paie et droit du travail sénégalais : les bases RH essentielles." },
  { id: "entrepreneuriat", nom: "Entrepreneuriat", modules: 20, heures: 50, enrolled: false, coach: "awa.diagne@email.com", tagline: "Structurer et lancer votre projet entrepreneurial.", description: "De l'idée au business plan : structurez votre projet entrepreneurial étape par étape." },
];

function FormationCard({ f, onOpen, premium, locked }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(f)}
      className="text-left rounded-lg border bg-surface p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLORS.orangeSoft }}>
          <GraduationCap size={16} color={COLORS.orange} />
        </div>
        {premium && <PremiumChip locked={locked} />}
      </div>
      <p className="font-semibold text-sm mb-0.5" style={{ color: COLORS.slate }}>{f.nom}</p>
      <p className="text-xs" style={{ color: COLORS.slateLight }}>{f.modules} Modules · {f.heures}h</p>
    </button>
  );
}

function FormationDetail({ formation, enrolled, progressCount, onToggleEnroll, onAdvanceModule, onViewCertificate, onBack }) {
  const total = formation.modules;
  const modulesList = buildModules(formation);
  const isComplete = enrolled && progressCount >= total;
  const globalProgress = enrolled ? Math.min(100, Math.round(((progressCount + (progressCount < total ? 0.5 : 0)) / total) * 100)) : 0;

  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour aux formations
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.slate }}>{formation.nom}</h1>
        {!enrolled && (
          <button type="button" onClick={onToggleEnroll} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
            S'inscrire à cette formation
          </button>
        )}
        {isComplete && (
          <button type="button" onClick={onViewCertificate} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
            Voir mon certificat
          </button>
        )}
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>{formation.tagline}</p>

      <div className="rounded-lg border bg-surface divide-y mb-6" style={{ borderColor: COLORS.border }}>
        <Row label="Libellé" value={formation.nom} />
        <div className="px-5 py-3"><Row label="Description" value={formation.description} /></div>
        <div className="px-5 py-3"><Row label="Coach" value={formation.coach} /></div>
        <div className="px-5 py-3"><Row label="Modules" value={`${formation.modules} Modules · ${formation.heures}h d'apprentissage`} /></div>
        <div className="px-5 py-3"><Row label="Durée" value={dureeFromHeures(formation.heures)} /></div>
        <div className="px-5 py-3 flex items-center justify-between">
          <p className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>Statut</p>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: enrolled ? "#DCFCE7" : COLORS.softStrong, color: enrolled ? "#16A34A" : COLORS.slateLight }}>
            {isComplete ? "Terminée" : enrolled ? "Actif" : "Non inscrit"}
          </span>
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-5 mb-6" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: COLORS.slate }}>Modules</h3>
          {enrolled && <p className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>{Math.min(progressCount, total)} / {total} modules validés</p>}
        </div>
        {enrolled && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs" style={{ color: COLORS.slateLight }}>Progression globale</p>
              <p className="text-xs font-semibold" style={{ color: COLORS.orange }}>{globalProgress}%</p>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.softStrong }}>
              <div className="h-1.5 rounded-full" style={{ width: `${globalProgress}%`, background: "#16A34A" }} />
            </div>
          </div>
        )}
        <div className="flex flex-col divide-y" style={{ borderColor: COLORS.border }}>
          {modulesList.map((m, i) => {
            const status = moduleStatus(i, enrolled, progressCount);
            const style = MODULE_BADGE_STYLE[status];
            return (
              <div key={m.n} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>MODULE {m.n}</p>
                  <p className="text-sm font-semibold" style={{ color: status === "Verrouillé" ? COLORS.slateLight : COLORS.slate }}>{m.titre}</p>
                  <p className="text-xs" style={{ color: COLORS.slateLight }}>Durée : {m.duree}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {status === "En cours" && (
                    <button type="button" onClick={onAdvanceModule} className="rounded-md px-3 py-1.5 text-xs font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
                      Marquer comme terminé
                    </button>
                  )}
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: style.bg, color: style.color }}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {formation.linkedCandidature && (
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-start justify-between mb-1">
            <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>{formation.linkedCandidature.poste}</p>
            <StatusBadge status={formation.linkedCandidature.statut} />
          </div>
          <p className="text-xs" style={{ color: COLORS.slateLight }}>{formation.linkedCandidature.ville} · {formation.linkedCandidature.date}</p>
          <CandidatureStepper step={formation.linkedCandidature.step} />
        </div>
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
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Certificat de formation</h1>
      <p className="text-sm mb-6" style={{ color: "#16A34A" }}>Félicitations ! Vous avez complété la formation avec succès.</p>

      <div className="rounded-lg border-2 p-8 mb-6 text-center" style={{ borderColor: COLORS.orange }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: COLORS.orangeSoft }}>
          <ShieldCheck size={28} color={COLORS.orange} />
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>CERTIFICAT DE RÉUSSITE</h2>
        <p className="text-xs mb-5" style={{ color: COLORS.slateLight }}>Délivré par la plateforme nationale LIGGEEY pour l'insertion des professionnels</p>
        <p className="text-sm" style={{ color: COLORS.slateLight }}>Ce document atteste que</p>
        <p className="text-xl font-bold mb-3" style={{ color: COLORS.slate }}>{userName}</p>
        <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>a suivi et validé avec succès l'ensemble des modules obligatoires requis pour la formation :</p>
        <p className="text-lg font-bold mb-6" style={{ color: COLORS.orange }}>{formation.nom}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>DATE D'OBTENTION</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>30 octobre 2026</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>VOLUME HORAIRE</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{formation.modules} Modules · {formation.heures}h</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>MENTION</p><p className="text-sm font-semibold" style={{ color: "#16A34A" }}>Très bien (87/100)</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>ID UNIQUE</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>CERT-{formation.id.slice(0, 2).toUpperCase()}-2026-0042</p></div>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button type="button" onClick={() => setFeedback("téléchargé")} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Télécharger (PDF)</button>
        <button type="button" onClick={() => setFeedback("partagé")} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Partager</button>
        {feedback && <span className="self-center text-sm" style={{ color: "#047857" }}>Certificat {feedback} (démo).</span>}
      </div>

      <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Formations recommandées pour vous</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommandees.map((f) => (
          <div key={f.id} className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>Recommandé</span>
            <p className="font-semibold text-sm mt-2" style={{ color: COLORS.slate }}>{f.nom}</p>
            <p className="text-xs" style={{ color: COLORS.slateLight }}>{f.modules} Modules · {f.heures}h</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const FORMATIONS_PRESTATAIRE_ALL = [
  { id: "securite-elec", nom: "Sécurité Électrique", modules: 8, heures: 24, enrolled: true, progressCount: 4, coach: "cheikh.fall@cneap.sn", tagline: "Maîtriser les normes de sécurité sur chantier électrique.", description: "Formation qualifiante couvrant l'ensemble des protocoles de sécurité requis en habilitation électrique B2V, ainsi que la gestion des situations d'urgence sur chantier.", moduleNames: [
    { titre: "Introduction aux normes NF C 15-100", duree: "2h30" },
    { titre: "Protection des personnes et des biens", duree: "3h00" },
    { titre: "Dimensionnement des circuits", duree: "4h00" },
    { titre: "Lecture de schémas électriques", duree: "2h30" },
    { titre: "Gestes de sécurité essentiels", duree: "3h30" },
    { titre: "Procédures de contrôle", duree: "3h00" },
    { titre: "Mise en pratique — TP sur site", duree: "3h00" },
    { titre: "Évaluation finale", duree: "3h00" },
  ] },
  { id: "peinture-moderne", nom: "Peinture Moderne", modules: 8, heures: 24, enrolled: false, coach: "aida.sarr@centreartisanat.sn", tagline: "Techniques modernes de peinture décorative et finitions.", description: "Apprenez les techniques actuelles de peinture décorative, enduits et finitions haut de gamme recherchées par les clients particuliers." },
  { id: "gestion-micro", nom: "Gestion Micro-Entreprise", modules: 12, heures: 32, enrolled: true, progressCount: 5, coach: "fatou.ba@cneap.sn", tagline: "Gérer et développer sa petite activité indépendante.", description: "Comptabilité de base, fixation des tarifs, gestion des devis et développement de la clientèle pour les travailleurs indépendants." },
  { id: "soudure-tech", nom: "Techniques de Soudure", modules: 14, heures: 48, enrolled: false, coach: "moussa.diagne@cneap.sn", tagline: "Perfectionner ses techniques de soudure TIG et MIG.", description: "Formation avancée en soudure industrielle pour les professionnels souhaitant élargir leur champ de compétences." },
  { id: "maconnerie-fond", nom: "Maçonnerie & Fondations", modules: 16, heures: 44, enrolled: false, coach: "ibrahima.sy@institutbtp.sn", tagline: "Construire des fondations solides et durables.", description: "Techniques de fondations, dosage du béton et lecture de plans pour les maçons professionnels." },
  { id: "normes-btp", nom: "Normes BTP & Sécurité", modules: 10, heures: 28, enrolled: true, progressCount: 6, coach: "khadija.ndoye@institutbtp.sn", tagline: "Connaître et appliquer les normes de sécurité BTP.", description: "Les règles de sécurité incontournables sur un chantier de construction, port des équipements et prévention des accidents." },
  { id: "coiffure-esthetique", nom: "Coiffure & Esthétique", modules: 10, heures: 26, enrolled: false, coach: "aissatou.fall@centreartisanat.sn", tagline: "Techniques de coiffure et de soins esthétiques.", description: "Tresses, soins capillaires et techniques esthétiques recherchées par une clientèle exigeante." },
  { id: "relation-client", nom: "Relation Client", modules: 6, heures: 16, enrolled: true, progressCount: 6, coach: "omar.gueye@cneap.sn", tagline: "Fidéliser sa clientèle et gérer les réclamations.", description: "Communiquer efficacement avec ses clients, gérer les insatisfactions et construire une réputation solide." },
  { id: "mecanique-auto", nom: "Mécanique Auto", modules: 18, heures: 50, enrolled: false, coach: "papa.diouf@institutbtp.sn", tagline: "Diagnostiquer et réparer les pannes mécaniques courantes.", description: "Bases de la mécanique automobile : diagnostic de panne, entretien courant et réparations essentielles." },
  { id: "couture-confection", nom: "Couture & Confection", modules: 12, heures: 30, enrolled: false, coach: "ndeye.diop@centreartisanat.sn", tagline: "Perfectionner ses techniques de couture sur mesure.", description: "Techniques avancées de couture, patronage et confection sur mesure pour les professionnels du textile." },
  { id: "installation-sanitaire", nom: "Installation Sanitaire", modules: 12, heures: 34, enrolled: false, coach: "modou.diagne@institutbtp.sn", tagline: "Installer et entretenir des systèmes sanitaires complets.", description: "Installation de sanitaires, raccordements et mise aux normes des systèmes de plomberie résidentiels." },
  { id: "peinture-batiment", nom: "Peinture Bâtiment", modules: 8, heures: 20, enrolled: false, coach: "aida.sarr@centreartisanat.sn", tagline: "Techniques de peinture pour le bâtiment.", description: "Préparation des surfaces, application et finitions pour des chantiers de peinture en bâtiment." },
];

function FormationsScreen({ initialTab, dataset, userName }) {
  const ALL = dataset || FORMATIONS_ALL;
  const [tab, setTab] = useState(initialTab || "toutes");
  const [query, setQuery] = useState("");
  const storeKey = ALL === FORMATIONS_PRESTATAIRE_ALL ? "p" : "c";
  const [enrolledIds, setEnrolledIds] = useStore(`formations-inscrites-${storeKey}`, () => ALL.filter((f) => f.enrolled).map((f) => f.id));
  const [progressCounts, setProgressCounts] = useStore(`formations-progression-${storeKey}`, () => Object.fromEntries(ALL.map((f) => [f.id, f.progressCount || 0])));
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("list"); // list | detail | certificate
  const [page, setPage] = useState(1);

  const planApi = usePlan();
  const isLocked = (f) => !!f && PREMIUM_FORMATIONS.has(f.id) && !enrolledIds.includes(f.id) && !(planApi && planApi.can("formationsPremium"));
  function toggleEnroll(id) {
    if (isLocked(ALL.find((f) => f.id === id))) { planApi.requestUpgrade("formationsPremium"); return; }
    setEnrolledIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setProgressCounts((p) => ({ ...p, [id]: p[id] || 0 }));
  }
  function advanceModule(id, total) {
    setProgressCounts((p) => ({ ...p, [id]: Math.min(total, (p[id] || 0) + 1) }));
  }

  const source = tab === "mes" ? ALL.filter((f) => enrolledIds.includes(f.id)) : ALL;
  const filtered = source.filter((f) => f.nom.toLowerCase().includes(query.toLowerCase()));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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
        formation={selected}
        enrolled={enrolledIds.includes(selected.id)}
        progressCount={progressCounts[selected.id] || 0}
        onToggleEnroll={() => toggleEnroll(selected.id)}
        onAdvanceModule={() => advanceModule(selected.id, selected.modules)}
        onViewCertificate={() => setView("certificate")}
        onBack={() => { setSelectedId(null); setView("list"); }}
      />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Formations</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Développez vos compétences avec des formations pensées pour le marché sénégalais.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {[{ id: "toutes", label: "Toutes les formations" }, { id: "mes", label: "Mes formations" }].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); setPage(1); }}
            className="rounded-md px-4 py-2 text-sm font-semibold"
            style={{ background: tab === t.id ? COLORS.orange : COLORS.surface, color: tab === t.id ? COLORS.onOrange : COLORS.slate, border: `1px solid ${tab === t.id ? COLORS.orange : COLORS.border}` }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder={tab === "mes" ? "Rechercher parmi mes formations..." : "Rechercher une formation..."}
        className="w-full max-w-sm rounded-md border px-4 py-2.5 text-sm mb-6 outline-none focus:border-primaire-400"
        style={{ borderColor: COLORS.border }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((f) => (
          <FormationCard key={f.id} f={f} premium={PREMIUM_FORMATIONS.has(f.id)} locked={isLocked(f)} onOpen={(ff) => { setSelectedId(ff.id); setView("detail"); }} />
        ))}
        {paged.length === 0 && (
          <p className="text-sm col-span-full" style={{ color: COLORS.slateLight }}>Aucune formation à afficher.</p>
        )}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Screen 9 : Mentors ---------- */

const MENTORS = [
  { id: "cheikh-fall", nom: "Cheikh Fall", role: "Responsable RH", exp: 12, photo: "https://randomuser.me/api/portraits/men/32.jpg", tagline: "Accompagne des jeunes diplômés depuis 8 ans sur la préparation aux entretiens et la construction de parcours.", competences: ["Préparation entretien", "Rédaction CV", "Orientation professionnelle", "Négociation salariale", "Personal branding", "Réseautage", "Gestion du stress", "Prise de parole"], stats: { mentores: 24, note: "4.8/5", anciennete: "3 ans", heures: 156 }, historique: [
      { date: "30 juillet 2026", note: "Simulation d'entretien pour le poste de Chargée de clientèle chez Sonatel. Point à travailler : structurer les réponses avec la méthode STAR." },
      { date: "18 juillet 2026", note: "Relecture du CV : mise en avant des compétences Excel et suppression des expériences non pertinentes." },
      { date: "2 juillet 2026", note: "Premier échange : définition des secteurs ciblés (banque, télécoms) et du rythme de candidatures." },
    ], documents: [
      { nom: "Guide de préparation aux entretiens.pdf", meta: "PDF · 15 mars 2026" },
      { nom: "Template CV professionnel.docx", meta: "DOCX · 2 avril 2026" },
      { nom: "Liste des entreprises qui recrutent.xlsx", meta: "XLSX · 20 juin 2026" },
    ], prochainRdv: "Jeudi 11 août 2026 · 15h00 – 16h00" },
  { id: "aminata-ndiaye", nom: "Aminata Ndiaye", role: "Directrice Marketing", exp: 15, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "moussa-diop", nom: "Moussa Diop", role: "Ingénieur Logiciel", exp: 10, photo: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: "fatou-sarr", nom: "Fatou Sarr", role: "Consultante Finance", exp: 18, photo: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "ousmane-ba", nom: "Ousmane Ba", role: "Chef de Projet", exp: 8, photo: "https://randomuser.me/api/portraits/men/76.jpg" },
  { id: "mariama-sow", nom: "Mariama Sow", role: "Avocate d'affaires", exp: 14, photo: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: "ibrahima-diallo", nom: "Ibrahima Diallo", role: "Architecte", exp: 20, photo: "https://randomuser.me/api/portraits/men/12.jpg" },
  { id: "aissatou-dia", nom: "Aissatou Dia", role: "Data Scientist", exp: 7, photo: "https://randomuser.me/api/portraits/women/56.jpg" },
  { id: "papa-seck", nom: "Papa Seck", role: "Entrepreneur", exp: 16, photo: "https://randomuser.me/api/portraits/men/63.jpg" },
  { id: "khady-toure", nom: "Khady Touré", role: "Journaliste", exp: 11, photo: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "babacar-niang", nom: "Babacar Niang", role: "Médecin", exp: 22, photo: "https://randomuser.me/api/portraits/men/85.jpg" },
  { id: "ndeye-mbaye", nom: "Ndèye Mbaye", role: "Comptable", exp: 9, photo: "https://randomuser.me/api/portraits/women/12.jpg" },
];

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function MentorCard({ m, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(m)}
      className="text-left rounded-lg border bg-surface p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-start justify-between mb-3">
        <SafeImg src={m.photo} alt={m.nom} className="w-11 h-11 rounded-full object-cover" />
        {m.historique && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#16A34A" }}>Votre mentor</span>}
      </div>
      <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>{m.nom}</p>
      <p className="text-xs" style={{ color: COLORS.slateLight }}>{m.role} · {m.exp} ans d'expérience</p>
    </button>
  );
}

function StatMini({ value, label }) {
  return (
    <div className="rounded-lg border bg-surface p-4 text-center" style={{ borderColor: COLORS.border }}>
      <p className="text-2xl font-bold" style={{ color: COLORS.orange }}>{value}</p>
      <p className="text-xs" style={{ color: COLORS.slateLight }}>{label}</p>
    </div>
  );
}

const MENTORS_PRESTATAIRE = [
  { id: "cheikh-fall-artisan", nom: "Cheikh Fall", role: "Maître Électricien", exp: 12, photo: "https://randomuser.me/api/portraits/men/52.jpg", tagline: "Accompagne les électriciens et techniciens depuis 8 ans sur les normes de sécurité, la gestion de chantier et le développement de leur activité.", competences: ["Normes électriques", "Devis & Facturation", "Relation client", "Installation solaire", "Gestion de chantier", "Domotique"], stats: { mentores: 24, note: "4.8/5", anciennete: "3 ans", heures: 156 }, historique: [
      { date: "30 juillet 2026", note: "Revue des procédures de sécurité électrique : mise en conformité NF C 15-100, check-list d'intervention et documentation des travaux. Point à travailler : devis détaillés avec schémas." },
      { date: "18 juillet 2026", note: "Stratégie de spécialisation : positionnement sur l'installation de panneaux solaires et la domotique, deux marchés en forte croissance au Sénégal." },
      { date: "2 juillet 2026", note: "Premier échange : évaluation des compétences techniques, identification des certifications à obtenir et plan de développement." },
    ], documents: [
      { nom: "Guide des normes NF C 15-100.pdf", meta: "PDF · 15 mars 2026" },
      { nom: "Modèle de devis professionnel.docx", meta: "DOCX · 2 avril 2026" },
      { nom: "Liste des clients qui recrutent.xlsx", meta: "XLSX · 20 juin 2026" },
    ], prochainRdv: "Jeudi 11 août 2026 · 15h00 – 16h00" },
  { id: "aminata-ndiaye-couture", nom: "Aminata Ndiaye", role: "Couturière & Styliste", exp: 15, photo: "https://randomuser.me/api/portraits/women/50.jpg" },
  { id: "moussa-diop-menuisier", nom: "Moussa Diop", role: "Maître Menuisier", exp: 10, photo: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: "fatou-sarr-elec", nom: "Fatou Sarr", role: "Électricienne Bâtiment", exp: 18, photo: "https://randomuser.me/api/portraits/women/78.jpg" },
  { id: "ousmane-ba-macon", nom: "Ousmane Ba", role: "Chef Maçon BTP", exp: 8, photo: "https://randomuser.me/api/portraits/men/41.jpg" },
  { id: "mariama-sow-plomberie", nom: "Mariama Sow", role: "Plombière Sanitaire", exp: 14, photo: "https://randomuser.me/api/portraits/women/31.jpg" },
  { id: "ibrahima-diallo-soudeur", nom: "Ibrahima Diallo", role: "Soudeur Industriel", exp: 20, photo: "https://randomuser.me/api/portraits/men/18.jpg" },
  { id: "aissatou-dia-patisserie", nom: "Aissatou Dia", role: "Pâtissière & Restauratrice", exp: 7, photo: "https://randomuser.me/api/portraits/women/62.jpg" },
  { id: "papa-seck-btp", nom: "Papa Seck", role: "Entrepreneur BTP", exp: 16, photo: "https://randomuser.me/api/portraits/men/71.jpg" },
  { id: "khady-toure-teinture", nom: "Khady Touré", role: "Teinturière & Formatrice", exp: 11, photo: "https://randomuser.me/api/portraits/women/39.jpg" },
  { id: "babacar-niang-carrelage", nom: "Babacar Niang", role: "Carreleur & Décorateur", exp: 22, photo: "https://randomuser.me/api/portraits/men/91.jpg" },
  { id: "ndeye-mbaye-coiffure", nom: "Ndèye Mbaye", role: "Coiffeuse & Gérante de Salon", exp: 9, photo: "https://randomuser.me/api/portraits/women/17.jpg" },
];

function MentorsScreen({ initialMentorId, dataset }) {
  const ALL = dataset || MENTORS;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => ALL.find((m) => m.id === initialMentorId) || null);
  const [coachings, setCoachings] = useStore(`coachings-${ALL === MENTORS_PRESTATAIRE ? "p" : "c"}`, {});
  const [page, setPage] = useState(1);

  if (selected) {
    const current = coachings[selected.id] || defaultCoachings(selected);
    return (
      <MentorDetail
        mentor={selected}
        coachings={current}
        onUpdate={(fn) => setCoachings((c) => ({ ...c, [selected.id]: fn(c[selected.id] || defaultCoachings(selected)) }))}
        onBack={() => setSelected(null)}
      />
    );
  }

  const filtered = ALL.filter((m) => (m.nom + m.role).toLowerCase().includes(query.toLowerCase()));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Mentors</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Un accompagnement personnalisé pour préparer votre insertion.</p>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Rechercher un mentor, une compétence..."
        className="w-full max-w-sm rounded-md border px-4 py-2.5 text-sm mb-6 outline-none focus:border-primaire-400"
        style={{ borderColor: COLORS.border }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((m) => (
          <MentorCard key={m.id} m={m} onOpen={setSelected} />
        ))}
      </div>
      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Screen 10 : Mon Profil ---------- */

function ChecklistItem({ label, done }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: done ? "#16A34A" : "transparent", border: done ? "none" : `1.5px solid ${COLORS.orange}` }}
      >
        {done && <Check size={11} color="#fff" />}
      </span>
      <span className="text-sm" style={{ color: done ? COLORS.slate : COLORS.orange, fontWeight: done ? 400 : 600 }}>{label}</span>
      {!done && <span className="text-xs" style={{ color: COLORS.slateLight }}> - à compléter</span>}
    </div>
  );
}

function ProfilScreen({ onNavigate }) {
  const [info, setInfo] = useStore("profil-chercheur", PROFIL_CHERCHEUR_INITIAL);
  const [editing, setEditing] = useState(false);
  const [cv, setCv] = useState({ nom: "CV_Absatou_Diallo.pdf", date: "28/07/2026" });
  const [showVerifInfo, setShowVerifInfo] = useState(false);
  const [documentsSubmitted, setDocumentsSubmitted] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Mon profil</h1>
          <ProfileTierBadge />
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
            Vérification en cours
          </span>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          Modifier le profil
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Gérez vos informations personnelles, suivez la progression de votre dossier et mettez en valeur vos compétences.
      </p>
      <ProfileTierCard />
      {editing && (
        <ProfilInfoModal
          nom="Absatou Diallo"
          values={info}
          fields={[{ key: "email", label: "E-mail", type: "email" }, { key: "telephone", label: "Téléphone", type: "tel" }, { key: "ville", label: "Ville" }, { key: "profession", label: "Profession" }]}
          onSave={setInfo}
          onClose={() => setEditing(false)}
        />
      )}

      <div className="rounded-lg border bg-surface p-6 mb-4 flex items-start gap-5" style={{ borderColor: COLORS.border }}>
        <SafeImg src="https://randomuser.me/api/portraits/women/65.jpg" alt="Absatou Diallo" className="w-20 h-20 rounded-full object-cover shrink-0" />
        <div className="flex flex-wrap gap-x-16 gap-y-3 flex-1">
          <p className="text-lg font-bold w-full" style={{ color: COLORS.slate }}>Absatou Diallo</p>
          <InfoField label="E-mail" value={info.email} />
        <InfoField label="Ville" value={info.ville} />
        <InfoField label="Profession" value={info.profession} />
        <InfoField label="Téléphone" value={info.telephone} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Progression du profil</h3>
            <span className="text-lg font-bold" style={{ color: COLORS.orange }}>75%</span>
          </div>
          <p className="text-xs mb-2" style={{ color: COLORS.slateLight }}>Complétion de dossier</p>
          <div className="w-full h-1.5 rounded-full mb-4" style={{ background: COLORS.softStrong }}>
            <div className="h-1.5 rounded-full" style={{ width: "75%", background: COLORS.orange }} />
          </div>
          <ChecklistItem label="Informations personnelles" done />
          <ChecklistItem label="Compétences" done />
          <ChecklistItem label="Disponibilité" done />
          <ChecklistItem label="Vérification d'identité" done={false} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Disponibilité & CV</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#16A34A" }}>Disponible immédiatement</span>
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-2">
                <FileText size={16} color={COLORS.slateLight} />
                <div>
                  <p className="text-sm font-medium break-all" style={{ color: COLORS.slate }}>{cv.nom}</p>
                  <p className="text-xs" style={{ color: COLORS.slateLight }}>Ajouté le {cv.date}</p>
                </div>
              </div>
              <FilePickerButton
                accept=".pdf,.doc,.docx"
                onPick={(f) => { setCv({ nom: f.name, date: demoNow().toLocaleDateString("fr-FR") }); notify("CV remplacé."); }}
                className="text-sm font-semibold shrink-0"
                style={{ color: COLORS.orange }}
              >
                Remplacer
              </FilePickerButton>
            </div>
          </div>

          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Langues</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#16A34A" }}>3 langues</span>
            </div>
            {[{ l: "Français", n: "Courant" }, { l: "Wolof", n: "Langue maternelle" }, { l: "Anglais", n: "Intermédiaire" }].map((x) => (
              <div key={x.l} className="flex items-center gap-2 text-sm py-0.5">
                <Check size={14} color="#16A34A" />
                <span className="font-medium" style={{ color: COLORS.slate }}>{x.l}</span>
                <span style={{ color: COLORS.slateLight }}>{x.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-6 mb-4" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Compétences</h3>
        <div className="flex flex-wrap gap-2">
          {["Gestion de projet", "Excel avancé", "Anglais professionnel", "Communication", "Comptabilité de base"].map((c) => (
            <span key={c} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-6 mb-6" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>Vérification d'identité</h3>
        <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>
          Pour obtenir le badge « profil vérifié » et rassurer les employeurs sénégalais partenaires, transmettez une pièce d'identité en cours de validité ainsi que vos diplômes.
        </p>
        {documentsSubmitted ? (
          <div className="rounded-md px-4 py-3 text-sm inline-block" style={{ background: "#ECFDF5", color: "#047857" }}>
            Documents transmis — vérification en cours sous 48h.
          </div>
        ) : (
          <div className="flex gap-3">
            <button type="button" onClick={() => setDocumentsSubmitted(true)} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
              Transmettre mes documents
            </button>
            <button type="button" onClick={() => setShowVerifInfo((v) => !v)} aria-expanded={showVerifInfo} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
              {showVerifInfo ? "Masquer" : "En savoir plus"}
            </button>
          </div>
        )}
        {showVerifInfo && !documentsSubmitted && (
          <p className="text-sm mt-4 max-w-2xl leading-relaxed" style={{ color: COLORS.slateLight }}>
            L'équipe LIGGEEY contrôle votre pièce d'identité et vos diplômes sous 48&nbsp;h ouvrées. Un profil vérifié affiche un badge auprès des recruteurs et remonte en priorité dans leurs recherches. Vos documents ne sont jamais partagés sans votre accord.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-1" style={{ color: COLORS.slate }}>Mes candidatures</h3>
          <p className="text-3xl font-bold mb-1" style={{ color: COLORS.orange }}>5</p>
          <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Candidatures envoyées</p>
          <button type="button" onClick={() => onNavigate("candidatures")} className="w-full rounded-md py-2.5 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>
            Voir mes candidatures
          </button>
        </div>
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-1" style={{ color: COLORS.slate }}>Mes formations</h3>
          <p className="text-3xl font-bold mb-1" style={{ color: COLORS.orange }}>5</p>
          <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Formations suivies</p>
          <button type="button" onClick={() => onNavigate("formations", { tab: "mes" })} className="w-full rounded-md py-2.5 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>
            Voir mes formations
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Screen 11 : Dashboard Prestataire ---------- */

const DEMANDES_RECENTES = [
  { titre: "Installation électrique", client: "Fatou Sarr", ville: "Dakar Plateau", prix: "85 000 FCFA", priorite: "Urgent", date: "Aujourd'hui, 10:30" },
  { titre: "Réparation plomberie", client: "Ousmane Ba", ville: "Médina", prix: "35 000 FCFA", priorite: "Normal", date: "Hier, 18:15" },
  { titre: "Câblage réseau bureau", client: "Aminata Diop", ville: "Almadies", prix: "120 000 FCFA", priorite: "Normal", date: "Aujourd'hui, 09:10" },
  { titre: "Dépannage compteur", client: "Cheikh Fall", ville: "Parcelles Assainies", prix: "25 000 FCFA", priorite: "Urgent", date: "Aujourd'hui, 08:45" },
];

function DemandeCard({ d }) {
  return (
    <div className="rounded-lg border p-4 mb-3" style={{ borderColor: COLORS.border, background: COLORS.soft }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>{d.titre}</p>
          <p className="text-xs" style={{ color: COLORS.orange }}>{d.client} · {d.ville}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{d.priorite}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{d.prix}</p>
        <p className="text-xs" style={{ color: COLORS.slateLight }}>{d.date}</p>
      </div>
    </div>
  );
}

function PrestataireDashboardScreen({ user, onNavigate, todos }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Bonjour, {user.name}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Voici un aperçu de votre activité de prestataire.</p>
      <TodoPanel items={todos} onNavigate={onNavigate} />

      <div className="rounded-lg p-6 mb-6 flex items-center justify-between gap-6" style={{ background: COLORS.dark }}>
        <div className="flex-1">
          <p className="text-lg font-bold text-sur-sombre mb-1">Profil complété à 70%</p>
          <p className="text-sm mb-3" style={{ color: COLORS.orange }}>
            Un profil complet et vérifié rassure vos futurs clients.
          </p>
          <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.darkTrack }}>
            <div className="h-1.5 rounded-full" style={{ width: "70%", background: COLORS.orange }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("profil")}
          className="shrink-0 rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre transition-opacity hover:opacity-90"
          style={{ background: COLORS.orange }}
        >
          Compléter mon profil
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wrench} value={6} label="Services actifs" />
        <StatCard icon={FileText} value="450 000" label="Revenus générés (FCFA)" />
        <StatCard icon={Check} value="4.8/5" label="Note moyenne" />
        <StatCard icon={ClipboardList} value={3} label="Missions en cours" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Dernières demandes</h3>
            <button type="button" onClick={() => onNavigate("missions")} className="text-sm font-medium" style={{ color: COLORS.orange }}>
              Tout voir
            </button>
          </div>
          {DEMANDES_RECENTES.map((d, i) => (
            <DemandeCard key={i} d={d} />
          ))}
        </div>

        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Mes services actifs</h3>
            <button type="button" onClick={() => onNavigate("services")} className="text-sm font-medium" style={{ color: COLORS.orange }}>
              Ajouter
            </button>
          </div>
          {SERVICES_INITIAL.filter((s) => s.disponible).slice(0, 3).map((s) => (
            <p key={s.id} className="text-sm py-1.5" style={{ color: COLORS.slate }}>{s.nom}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Screen 12 : Services (Prestataire) ---------- */

const SERVICES_INITIAL = [
  { id: "elec-bat", nom: "Électricité bâtiment", tag: "Bâtiment", tarifBase: "25 000 FCFA", note: 4.5, missions: 15, disponible: true, description: "Installation, réparation et mise aux normes de systèmes électriques résidentiels et commerciaux. Câblage complet, pose de tableaux électriques, installation de prises et éclairage, dépannage urgent.", tarifDeplacement: "5 000 FCFA", tarifSimple: "15 000 - 25 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Pikine, Guédiawaye, Rufisque", disponibilite: "Lundi-Samedi, 8h-18h | Urgences 24h/7", avis: [{ auteur: "Fatou Sarr", note: 5, commentaire: "Excellent travail, rapide et soigné" }, { auteur: "Ousmane Ba", note: 4, commentaire: "Bon prestataire, ponctuel" }] },
  { id: "cablage", nom: "Câblage réseau", tag: "Informatique", tarifBase: "50 000 FCFA", note: 4.8, missions: 8, disponible: true, description: "Installation et maintenance de réseaux informatiques et de télécommunication pour bureaux et résidences.", tarifDeplacement: "5 000 FCFA", tarifSimple: "40 000 - 60 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar", disponibilite: "Lundi-Samedi, 8h-18h", avis: [{ auteur: "Aminata Diop", note: 5, commentaire: "Très satisfaite du câblage de mon bureau" }] },
  { id: "depannage", nom: "Dépannage électrique", tag: "Urgence", tarifBase: "15 000 FCFA", note: 4.6, missions: 32, disponible: false, description: "Intervention rapide en cas de panne électrique, urgences comprises, 24h/24 et 7j/7.", tarifDeplacement: "5 000 FCFA", tarifSimple: "10 000 - 20 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Guédiawaye", disponibilite: "Urgences 24h/7", avis: [{ auteur: "Cheikh Fall", note: 5, commentaire: "Intervention rapide en urgence" }] },
  { id: "solaire", nom: "Installation solaire", tag: "Énergie", tarifBase: "150 000 FCFA", note: 4.4, missions: 5, disponible: true, description: "Pose et raccordement de panneaux solaires domestiques.", tarifDeplacement: "10 000 FCFA", tarifSimple: "120 000 - 180 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Thiès", disponibilite: "Lundi-Vendredi, 8h-17h", avis: [] },
  { id: "maintenance", nom: "Maintenance préventive", tag: "Maintenance", tarifBase: "20 000 FCFA", note: 4.7, missions: 12, disponible: false, description: "Contrôle et entretien périodique des installations électriques.", tarifDeplacement: "5 000 FCFA", tarifSimple: "15 000 - 25 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar", disponibilite: "Lundi-Samedi, 8h-18h", avis: [] },
  { id: "plomberie", nom: "Plomberie sanitaire", tag: "Plomberie", tarifBase: "30 000 FCFA", note: 4.9, missions: 22, disponible: true, description: "Installation et réparation de systèmes sanitaires, débouchage de canalisations, pose de sanitaires.", tarifDeplacement: "5 000 FCFA", tarifSimple: "20 000 - 40 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Pikine", disponibilite: "Lundi-Samedi, 8h-18h", avis: [] },
  { id: "soudure", nom: "Soudure métallique", tag: "Métallurgie", tarifBase: "35 000 FCFA", note: 4.3, missions: 18, disponible: true, description: "Soudure et fabrication de structures métalliques sur mesure.", tarifDeplacement: "8 000 FCFA", tarifSimple: "25 000 - 45 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar, Thiès", disponibilite: "Lundi-Samedi, 8h-18h", avis: [] },
  { id: "menuiserie", nom: "Menuiserie bois", tag: "Artisanat", tarifBase: "45 000 FCFA", note: 4.6, missions: 9, disponible: true, description: "Fabrication et réparation de mobilier en bois sur mesure.", tarifDeplacement: "5 000 FCFA", tarifSimple: "35 000 - 55 000 FCFA", tarifComplete: "Sur devis", zone: "Dakar", disponibilite: "Lundi-Vendredi, 8h-17h", avis: [] },
  { id: "formation-elec", nom: "Formation électricité", tag: "Formation", tarifBase: "75 000 FCFA", note: 5.0, missions: 2, disponible: true, description: "Initiation aux normes électriques et aux gestes de sécurité pour particuliers et professionnels.", tarifDeplacement: "—", tarifSimple: "75 000 FCFA / session", tarifComplete: "Sur devis (groupe)", zone: "Dakar", disponibilite: "Sur rendez-vous", avis: [] },
];

function ServiceCard({ s, onOpen, onEdit, onArchive }) {
  return (
    <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
      <p className="font-semibold text-base mb-1.5" style={{ color: COLORS.slate }}>{s.nom}</p>
      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{s.tag}</span>
      <p className="text-sm mb-0.5" style={{ color: COLORS.slate }}>À partir de {s.tarifBase}</p>
      <p className="text-sm mb-3" style={{ color: COLORS.slateLight }}>{s.note.toFixed(1)}/5</p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-sur-sombre" style={{ background: s.disponible ? "#16A34A" : COLORS.danger }}>
          {s.disponible ? "Disponible" : "Indisponible"}
        </span>
        <span className="text-sm" style={{ color: COLORS.slateLight }}>{s.missions} missions</span>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => onOpen(s)} className="w-9 h-9 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.border }} title="Voir">
          <Eye size={15} color={COLORS.slate} />
        </button>
        <button type="button" onClick={() => onEdit(s)} className="w-9 h-9 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.border }} title="Modifier">
          <Pencil size={15} color={COLORS.slate} />
        </button>
        <button type="button" onClick={() => onArchive(s)} className="w-9 h-9 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.border }} title="Archiver">
          <Archive size={15} color={COLORS.slate} />
        </button>
      </div>
    </div>
  );
}

function ServiceForm({ initial, onSave, onCancel }) {
  const [values, setValues] = useState(
    initial || { nom: "", tag: "", description: "", tarifBase: "", tarifDeplacement: "", tarifSimple: "", tarifComplete: "Sur devis", zone: "", disponibilite: "", disponible: true, note: 0, missions: 0, avis: [] }
  );
  const valid = values.nom.trim() && values.tag.trim() && values.description.trim() && values.tarifBase.trim();

  function set(k, v) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  return (
    <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
      <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>{initial ? "Modifier un service" : "Ajouter un service"}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Nom du service *</label>
          <input value={values.nom} onChange={(e) => set("nom", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Catégorie *</label>
          <input value={values.tag} onChange={(e) => set("tag", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Zone d'intervention</label>
          <input value={values.zone} onChange={(e) => set("zone", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Description *</label>
          <textarea value={values.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Tarif de base *</label>
          <input value={values.tarifBase} onChange={(e) => set("tarifBase", e.target.value)} placeholder="Ex: 25 000 FCFA" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Disponibilité</label>
          <input value={values.disponibilite} onChange={(e) => set("disponibilite", e.target.value)} placeholder="Ex: Lundi-Samedi, 8h-18h" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
      </div>
      <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
        <input type="checkbox" checked={values.disponible} onChange={(e) => set("disponible", e.target.checked)} className="w-4 h-4 rounded accent-primaire-500" />
        <span className="text-sm" style={{ color: COLORS.slate }}>Service disponible</span>
      </label>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          Annuler
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSave({ ...values, id: initial?.id || values.nom.toLowerCase().replace(/\s+/g, "-") })}
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre"
          style={{ background: COLORS.orange, opacity: valid ? 1 : 0.5 }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function ArchiveConfirm({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(15,11,8,0.55)" }} onClick={onCancel}>
      <div className="w-full max-w-sm rounded-lg bg-surface p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.slate }}>Archiver ce service ?</h3>
        <p className="text-sm mb-5" style={{ color: COLORS.slateLight }}>
          Ce service ne sera plus visible par vos clients. Vous pourrez le réactiver plus tard.
        </p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
            Annuler
          </button>
          <button type="button" onClick={onConfirm} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.danger }}>
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ service, onEdit, onDelete, onBack }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour aux services
      </button>

      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>{service.nom}</h1>
        <div className="flex gap-3">
          <button type="button" onClick={onEdit} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>
            Modifier le service
          </button>
          <button type="button" onClick={onDelete} className="text-sm font-semibold" style={{ color: COLORS.orange }}>
            {service.disponible ? "Désactiver" : "Réactiver"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: service.disponible ? "#DCFCE7" : "#FEE2E2", color: service.disponible ? "#16A34A" : COLORS.danger }}>
          {service.disponible ? "Actif" : "Inactif"}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{service.tag}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>Description</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{service.description}</p>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Tarification</h3>
            <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Déplacement</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{service.tarifDeplacement}</p></div>
            <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Intervention simple</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{service.tarifSimple}</p></div>
            <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Installation complète</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{service.tarifComplete}</p></div>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>Zone d'intervention</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{service.zone}</p>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>Disponibilité</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{service.disponibilite}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Stats</h3>
            <div className="flex items-center justify-between py-1"><p className="text-sm" style={{ color: COLORS.slateLight }}>Note moyenne</p><p className="text-sm font-semibold" style={{ color: COLORS.orange }}>{service.note.toFixed(1)}/5</p></div>
            <div className="flex items-center justify-between py-1"><p className="text-sm" style={{ color: COLORS.slateLight }}>Missions réalisées</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{service.missions}</p></div>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Derniers avis clients</h3>
            {service.avis.length === 0 && <p className="text-sm" style={{ color: COLORS.slateLight }}>Aucun avis pour le moment.</p>}
            {service.avis.map((a, i) => (
              <div key={i} className="py-2" style={{ borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{a.auteur}</p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.orange }}>{a.note}/5</p>
                </div>
                <p className="text-sm" style={{ color: COLORS.slateLight }}>{a.commentaire}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesScreen() {
  const [services, setServices] = useStore("services", SERVICES_INITIAL);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
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
  const filtered = services.filter((s) => (s.nom + s.tag).toLowerCase().includes(query.toLowerCase()));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function saveService(values) {
    setServices((list) => {
      const exists = list.some((s) => s.id === values.id);
      return exists ? list.map((s) => (s.id === values.id ? values : s)) : [...list, values];
    });
    setSelected(values);
    setMode("view");
  }

  function confirmDelete() {
    setServices((list) => list.filter((s) => s.id !== toDelete.id));
    setToDelete(null);
    setSelected(null);
    setMode("view");
  }

  function toggleDisponible(id) {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, disponible: !s.disponible } : s)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, disponible: !sel.disponible } : sel));
  }

  if (mode === "create") {
    return <ServiceForm onSave={saveService} onCancel={() => setMode("view")} />;
  }
  if (selected && mode === "edit") {
    return <ServiceForm initial={selected} onSave={saveService} onCancel={() => setMode("view")} />;
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
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Mes services</h1>
        <button type="button" onClick={openCreate} className="flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
          <Plus size={15} /> Ajouter un service
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Gérez les prestations que vous proposez à vos clients.
        {serviceLimit !== UNLIMITED && <span> {services.length} / {serviceLimit} services utilisés avec le profil {planApi.plan.nom}.</span>}
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Rechercher un service..."
        className="w-full max-w-sm rounded-md border px-4 py-2.5 text-sm mb-6 outline-none focus:border-primaire-400"
        style={{ borderColor: COLORS.border }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((s) => (
          <ServiceCard
            key={s.id}
            s={s}
            onOpen={setSelected}
            onEdit={(ss) => { setSelected(ss); setMode("edit"); }}
            onArchive={(ss) => setToDelete(ss)}
          />
        ))}
        {paged.length === 0 && <p className="text-sm col-span-full" style={{ color: COLORS.slateLight }}>Aucun service à afficher.</p>}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
      {toDelete && <ArchiveConfirm onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />}
    </div>
  );
}

/* ---------- Screen 13 : Missions & Clients (Prestataire) ---------- */

const MISSIONS_INITIAL = [
  { id: "m1", titre: "Installation électrique complète", client: "Fatou Sarr", ville: "Dakar Plateau", budget: "85 000 FCFA", dateDemande: "Aujourd'hui, 10:30", statut: "En attente", description: "Le client souhaite une installation électrique complète pour un appartement de 4 pièces. Travaux incluant le câblage, la pose du tableau électrique, l'installation des prises et interrupteurs, et la mise en conformité.", type: "Installation complète", lieu: "Rue 10, Dakar Plateau", dateSouhaitee: "1er septembre 2026", dureeEstimee: "3 jours", telephone: "+221 77 123 45 67", email: "fatou.sarr@email.sn", membreDepuis: "Mars 2025", missionsPrecedentes: 2 },
  { id: "m2", titre: "Réparation prise défectueuse", client: "Ibrahima Diallo", ville: "Médina", budget: "15 000 FCFA", dateDemande: "Aujourd'hui, 05:15", statut: "En attente", description: "Une prise électrique dans la cuisine ne fonctionne plus et présente un léger échauffement. Intervention rapide souhaitée par sécurité.", type: "Dépannage", lieu: "Médina, Dakar", dateSouhaitee: "Dès que possible", dureeEstimee: "2 heures", telephone: "+221 77 456 78 90", email: "ibrahima.diallo@email.sn", membreDepuis: "Janvier 2024", missionsPrecedentes: 5 },
  { id: "m3", titre: "Câblage bureau 3 pièces", client: "Aminata Diop", ville: "Almadies", budget: "120 000 FCFA", dateDemande: "Hier, 09:10", statut: "Acceptée", description: "Câblage réseau et électrique complet pour un bureau de 3 pièces destiné à une petite entreprise.", type: "Câblage réseau", lieu: "Almadies, Dakar", dateSouhaitee: "5 septembre 2026", dureeEstimee: "2 jours", telephone: "+221 76 234 56 78", email: "aminata.diop@email.sn", membreDepuis: "Juin 2024", missionsPrecedentes: 1 },
  { id: "m4", titre: "Mise aux normes tableau", client: "Cheikh Fall", ville: "Parcelles Assainies", budget: "65 000 FCFA", dateDemande: "Aujourd'hui, 08:45", statut: "En cours", description: "Le tableau électrique doit être mis aux normes NF C 15-100 suite à un contrôle d'assurance.", type: "Mise aux normes", lieu: "Parcelles Assainies, Dakar", dateSouhaitee: "En cours", dureeEstimee: "1 jour", telephone: "+221 77 345 67 89", email: "cheikh.fall2@email.sn", membreDepuis: "Février 2023", missionsPrecedentes: 4 },
  { id: "m5", titre: "Installation éclairage LED", client: "Mariama Sow", ville: "Ouakam", budget: "45 000 FCFA", dateDemande: "Il y a 1 semaine", statut: "Terminée", description: "Remplacement de l'éclairage traditionnel par des LED basse consommation dans toute la maison.", type: "Installation", lieu: "Ouakam, Dakar", dateSouhaitee: "Terminée", dureeEstimee: "1 jour", telephone: "+221 76 567 89 01", email: "mariama.sow@email.sn", membreDepuis: "Mai 2022", missionsPrecedentes: 3 },
  { id: "m6", titre: "Dépannage urgent tableau", client: "Ousmane Ba", ville: "Médina", budget: "20 000 FCFA", dateDemande: "Il y a 2 jours", statut: "En attente", description: "Coupure générale récurrente sur le tableau électrique, intervention urgente demandée.", type: "Dépannage urgent", lieu: "Médina, Dakar", dateSouhaitee: "Dès que possible", dureeEstimee: "3 heures", telephone: "+221 78 678 90 12", email: "ousmane.ba@email.sn", membreDepuis: "Août 2024", missionsPrecedentes: 0 },
  { id: "m7", titre: "Maintenance annuelle installation", client: "Khady Touré", ville: "Liberté 6", budget: "30 000 FCFA", dateDemande: "Il y a 3 jours", statut: "Acceptée", description: "Contrôle et entretien annuel de l'installation électrique d'une villa.", type: "Maintenance", lieu: "Liberté 6, Dakar", dateSouhaitee: "10 septembre 2026", dureeEstimee: "1 jour", telephone: "+221 77 789 01 23", email: "khady.toure@email.sn", membreDepuis: "Mars 2021", missionsPrecedentes: 6 },
  { id: "m8", titre: "Installation panneaux solaires", client: "Babacar Niang", ville: "Ngor", budget: "200 000 FCFA", dateDemande: "Il y a 2 semaines", statut: "Terminée", description: "Installation d'un kit solaire domestique avec raccordement au tableau existant.", type: "Installation", lieu: "Ngor, Dakar", dateSouhaitee: "Terminée", dureeEstimee: "4 jours", telephone: "+221 76 890 12 34", email: "babacar.niang@email.sn", membreDepuis: "Octobre 2023", missionsPrecedentes: 2 },
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
    <div className="rounded-lg border bg-surface p-5 mb-4" style={{ borderColor: COLORS.border }}>
      <div className="flex items-start justify-between mb-1">
        <button type="button" onClick={() => onOpen(m)} className="font-semibold text-sm text-left flex items-center gap-1.5" style={{ color: COLORS.slate }}>
          {m.titre} <Check size={14} color="#16A34A" />
        </button>
        <StatusBadge status={m.statut} />
      </div>
      <p className="text-xs mb-3" style={{ color: COLORS.slateLight }}>{m.client} · {m.ville}</p>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-8">
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>Date de demande</p><p className="text-sm" style={{ color: COLORS.slate }}>{m.dateDemande}</p></div>
          <div><p className="text-xs" style={{ color: COLORS.slateLight }}>Budget proposé</p><p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{m.budget}</p></div>
        </div>
        {m.statut === "En attente" ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => onAccept(m.id)} className="rounded-md px-4 py-1.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Accepter</button>
            <button type="button" onClick={() => onRefuse(m.id)} className="rounded-md px-4 py-1.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Refuser</button>
          </div>
        ) : (
          <button type="button" onClick={() => onOpen(m)} className="text-sm font-medium" style={{ color: COLORS.orange }}>Voir détails</button>
        )}
      </div>
    </div>
  );
}

function MissionDetail({ mission, onBack, onAccept, onRefuse, onCounterOffer }) {
  const planApi = usePlan();
  const [counterMode, setCounterMode] = useState(false);
  const [counterValue, setCounterValue] = useState("");

  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour aux missions
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.slate }}>{mission.titre}</h1>
          <StatusBadge status={mission.statut} />
        </div>
        {mission.statut === "En attente" && !counterMode && (
          <div className="flex gap-3">
            <button type="button" onClick={() => onRefuse(mission.id)} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
              Refuser
            </button>
            <button type="button" onClick={() => (planApi ? planApi.gate("contreOffre", () => setCounterMode(true)) : setCounterMode(true))} className="rounded-md px-4 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.orange, color: COLORS.orange }}>
              {planApi && !planApi.can("contreOffre") && <Lock size={13} />} Proposer un autre tarif
            </button>
            <button type="button" onClick={() => onAccept(mission.id)} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
              Accepter la mission
            </button>
          </div>
        )}
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Demande reçue le {mission.dateDemande}</p>

      {counterMode && (
        <div className="rounded-lg border bg-surface p-5 flex items-end gap-3 mb-4" style={{ borderColor: COLORS.border }}>
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Votre contre-proposition (FCFA)</label>
            <input
              type="text"
              value={counterValue}
              onChange={(e) => setCounterValue(e.target.value)}
              placeholder="Ex: 70 000"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400"
              style={{ borderColor: COLORS.border }}
            />
          </div>
          <button
            type="button"
            disabled={!counterValue.trim()}
            onClick={() => { onCounterOffer(mission.id, counterValue); setCounterMode(false); }}
            className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre"
            style={{ background: COLORS.orange, opacity: counterValue.trim() ? 1 : 0.5 }}
          >
            Envoyer
          </button>
          <button type="button" onClick={() => setCounterMode(false)} className="rounded-md px-4 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
            Annuler
          </button>
        </div>
      )}

      {mission.contreOffre && (
        <div className="rounded-md px-4 py-3 text-sm mb-4" style={{ background: "#ECFDF5", color: "#047857" }}>
          Contre-proposition envoyée : {mission.contreOffre} FCFA — en attente de la réponse du client.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>Description de la mission</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{mission.description}</p>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Détails</h3>
            <div className="grid grid-cols-2 gap-4">
              <Row label="Type" value={mission.type} />
              <Row label="Lieu" value={mission.lieu} />
              <Row label="Date souhaitée" value={mission.dateSouhaitee} />
              <Row label="Durée estimée" value={mission.dureeEstimee} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Informations client</h3>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
                {initials(mission.client)}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{mission.client}</p>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>Client LIGGEEY</p>
              </div>
            </div>
            <Row label="Téléphone" value={mission.telephone} />
            <div className="h-2" />
            <Row label="Email" value={mission.email} />
            <div className="h-2" />
            <Row label="Membre depuis" value={mission.membreDepuis} />
            <div className="h-2" />
            <Row label="Missions précédentes" value={mission.missionsPrecedentes} />
          </div>
          <div className="rounded-lg border bg-surface p-5 text-center" style={{ borderColor: COLORS.border }}>
            <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Budget proposé</p>
            <p className="text-2xl font-bold" style={{ color: COLORS.orange }}>{mission.budget}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionsScreen() {
  const [missions, setMissions] = useStore("missions", MISSIONS_INITIAL);
  const [tab, setTab] = useState("toutes");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const counts = MISSION_TABS.reduce((acc, t) => {
    acc[t.id] = t.id === "toutes" ? missions.length : missions.filter((m) => m.statut === t.id).length;
    return acc;
  }, {});

  const filtered = tab === "toutes" ? missions : missions.filter((m) => m.statut === tab);
  const paged = filtered.slice((page - 1) * 4, page * 4);
  const selected = missions.find((m) => m.id === selectedId);

  function setStatut(id, statut) {
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, statut } : m)));
  }
  function setCounterOffer(id, value) {
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, contreOffre: value } : m)));
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
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Missions</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Suivez les demandes de prestations reçues de vos clients.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {MISSION_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); setPage(1); }}
            className="rounded-md px-4 py-2 text-sm font-semibold"
            style={{ background: tab === t.id ? COLORS.orange : COLORS.surface, color: tab === t.id ? COLORS.onOrange : COLORS.slate, border: `1px solid ${tab === t.id ? COLORS.orange : COLORS.border}` }}
          >
            {t.label} ({counts[t.id]})
          </button>
        ))}
      </div>

      {paged.map((m) => (
        <MissionCard
          key={m.id}
          m={m}
          onOpen={(mm) => setSelectedId(mm.id)}
          onAccept={(id) => setStatut(id, "Acceptée")}
          onRefuse={(id) => setStatut(id, "Refusée")}
        />
      ))}
      {paged.length === 0 && <p className="text-sm" style={{ color: COLORS.slateLight }}>Aucune demande dans cette catégorie.</p>}

      <Pagination page={page} pageSize={4} totalItems={filtered.length} onPageChange={setPage} />
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
  { id: "r1", titre: "Installation tableau électrique — Villa Almadies", photo: "https://picsum.photos/seed/liggeey-elec1/480/360", date: "Juillet 2026", lieu: "Almadies, Dakar", description: "Installation complète d'un tableau électrique neuf pour une villa de 5 pièces, avec mise aux normes NF C 15-100." },
  { id: "r2", titre: "Panneaux solaires — Résidence Ngor", photo: "https://picsum.photos/seed/liggeey-solar2/480/360", date: "Juin 2026", lieu: "Ngor, Dakar", description: "Pose et raccordement d'un kit solaire domestique de 3kW avec onduleur." },
  { id: "r3", titre: "Câblage réseau — Bureau Plateau", photo: "https://picsum.photos/seed/liggeey-cable3/480/360", date: "Mai 2026", lieu: "Plateau, Dakar", description: "Câblage réseau complet pour un open-space de 12 postes de travail." },
  { id: "r4", titre: "Mise aux normes — Immeuble Médina", photo: "https://picsum.photos/seed/liggeey-norms4/480/360", date: "Avril 2026", lieu: "Médina, Dakar", description: "Mise en conformité de l'installation électrique d'un immeuble de 4 étages suite à un contrôle d'assurance." },
  { id: "r5", titre: "Dépannage urgence — Appartement Sacré-Cœur", photo: "https://picsum.photos/seed/liggeey-fix5/480/360", date: "Mars 2026", lieu: "Sacré-Cœur, Dakar", description: "Intervention d'urgence suite à une coupure générale, remplacement du disjoncteur principal." },
  { id: "r6", titre: "Éclairage extérieur — Villa Ouakam", photo: "https://picsum.photos/seed/liggeey-light6/480/360", date: "Février 2026", lieu: "Ouakam, Dakar", description: "Installation d'un éclairage extérieur basse consommation pour un jardin et une allée." },
  { id: "r7", titre: "Installation domotique — Résidence Fann", photo: "https://picsum.photos/seed/liggeey-domo7/480/360", date: "Janvier 2026", lieu: "Fann, Dakar", description: "Mise en place d'un système domotique pour la gestion de l'éclairage et des volets roulants." },
  { id: "r8", titre: "Rénovation électrique complète — Maison Yoff", photo: "https://picsum.photos/seed/liggeey-reno8/480/360", date: "Décembre 2025", lieu: "Yoff, Dakar", description: "Rénovation complète de l'installation électrique d'une maison ancienne, câblage neuf de bout en bout." },
];

function RealisationsScreen({ onBack }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour au profil
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Mes réalisations</h1>
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
  const [info, setInfo] = useStore("profil-prestataire", PROFIL_PRESTATAIRE_INITIAL);
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Mon profil</h1>
          <ProfileTierBadge />
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#16A34A" }}>Vérifié</span>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          Modifier le profil
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Complétez votre profil pour augmenter votre visibilité auprès des clients.</p>
      <ProfileTierCard />
      {editing && (
        <ProfilInfoModal
          nom="Mamadou Ndiaye"
          values={info}
          fields={[{ key: "metier", label: "Métier" }, { key: "email", label: "E-mail", type: "email" }, { key: "telephone", label: "Téléphone", type: "tel" }, { key: "localisation", label: "Localisation" }]}
          onSave={setInfo}
          onClose={() => setEditing(false)}
        />
      )}

      <div className="rounded-lg border bg-surface p-6 mb-4" style={{ borderColor: COLORS.border }}>
        <div className="flex items-start gap-5 flex-wrap">
          <SafeImg src="https://randomuser.me/api/portraits/men/67.jpg" alt="Mamadou Ndiaye" className="w-24 h-24 rounded-full object-cover shrink-0" />
          <div className="flex flex-wrap gap-x-16 gap-y-3 flex-1">
            <div className="w-full flex items-center gap-2">
              <p className="text-lg font-bold" style={{ color: COLORS.slate }}>Mamadou Ndiaye</p>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#16A34A" }}>Actif</span>
              <RegulBadge size="sm" />
            </div>
            <InfoField label="Métier" value={info.metier} />
            <InfoField label="Membre depuis" value="Janvier 2024" />
            <InfoField label="E-mail" value={info.email} />
            <InfoField label="Téléphone" value={info.telephone} />
            <InfoField label="Localisation" value={info.localisation} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={ClipboardList} value={24} label="Missions terminées" />
        <StatCard icon={Star} value={`${AVG_NOTE}/5`} label="Note moyenne" />
        <StatCard icon={CalendarCheck} value={8} label="Ans d'expérience" />
        <StatCard icon={Check} value="96%" label="Taux de satisfaction" />
      </div>

      <div className="rounded-lg border bg-surface p-6 mb-4" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold" style={{ color: COLORS.slate }}>Profil complété à 75%</h3>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.softStrong }}>
          <div className="h-1.5 rounded-full" style={{ width: "75%", background: COLORS.orange }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Compétences & Métiers</h3>
          <div className="flex flex-wrap gap-2">
            {["Électricité bâtiment", "Câblage réseau", "Installation solaire", "Dépannage", "Mise aux normes", "Tableau électrique"].map((c) => (
              <span key={c} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Disponibilité</h3>
          <p className="text-sm" style={{ color: COLORS.slate }}>Lundi – Samedi · 8h-18h</p>
          <p className="text-sm" style={{ color: COLORS.slate }}>Urgences · 24h/7j</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Certifications</h3>
          {[
            { titre: "Certificat d'aptitude professionnelle (CAP) Électricité", annee: 2018 },
            { titre: "Formation sécurité électrique SENELEC", annee: 2020 },
            { titre: "Attestation installation solaire", annee: 2023 },
          ].map((c) => (
            <div key={c.titre} className="flex items-start gap-2 py-1.5">
              <Check size={14} color="#16A34A" className="mt-0.5 shrink-0" />
              <p className="text-sm" style={{ color: COLORS.slate }}>{c.titre} <span style={{ color: COLORS.slateLight }}>· {c.annee}</span></p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Langues & Zone d'intervention</h3>
          <div className="flex items-center gap-2 text-sm mb-1"><Check size={14} color="#16A34A" /><span style={{ color: COLORS.slate }}>Wolof</span><span style={{ color: COLORS.slateLight }}>natif</span></div>
          <div className="flex items-center gap-2 text-sm mb-3"><Check size={14} color="#16A34A" /><span style={{ color: COLORS.slate }}>Français</span><span style={{ color: COLORS.slateLight }}>courant</span></div>
          <div className="flex flex-wrap gap-2">
            {["Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès"].map((v) => (
              <span key={v} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.softStrong, color: COLORS.slate }}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-6 mb-4" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: COLORS.slate }}>Portfolio / Réalisations</h3>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {PORTFOLIO_REALISATIONS.slice(0, 4).map((r) => (
            <div key={r.id}>
              <SafeImg kind="photo" src={r.photo} alt={r.titre} className="w-full h-24 object-cover rounded-md mb-1.5" />
              <p className="text-xs font-medium truncate" style={{ color: COLORS.slate }}>{r.titre}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onNavigate("realisations")} className="w-full rounded-md py-2.5 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>
          Voir mes réalisations
        </button>
      </div>

      <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: COLORS.slate }}>Avis récents</h3>
          <button type="button" onClick={() => onNavigate("evaluations")} className="text-sm font-medium" style={{ color: COLORS.orange }}>
            Voir mes évaluations
          </button>
        </div>
        {REVIEWS_DATA.slice(0, 2).map((r) => (
          <div key={r.auteur} className="py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{r.auteur}</p>
              <Stars note={r.note} />
            </div>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>"{r.commentaire}"</p>
          </div>
        ))}
      </div>
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
      <button type="button" onClick={() => onNavigate("profil")} className="flex items-center gap-1.5 text-sm font-medium rounded-md border px-3 py-1.5 mb-5" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
        <ArrowLeft size={14} /> Retour
      </button>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Mes évaluations et avis</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez les retours de vos clients après chaque prestation.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.3fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-6 text-center" style={{ borderColor: COLORS.border }}>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>NOTE MOYENNE</p>
          <p className="text-4xl font-bold mb-2" style={{ color: COLORS.orange }}>{AVG_NOTE}/5</p>
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
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Rechercher un avis"
          className="rounded-md border px-4 py-2 text-sm outline-none focus:border-primaire-400 flex-1 max-w-xs"
          style={{ borderColor: COLORS.border }}
        />
        {[{ id: "tous", label: "Tous" }, { id: "5", label: "5 étoiles" }, { id: "4", label: "4 étoiles" }, { id: "3", label: "3 étoiles" }, { id: "recents", label: "Récents" }].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => { setFilter(f.id); setPage(1); }}
            className="rounded-md px-3 py-1.5 text-xs font-semibold"
            style={{ background: filter === f.id ? COLORS.orange : COLORS.surface, color: filter === f.id ? COLORS.onOrange : COLORS.slate, border: `1px solid ${filter === f.id ? COLORS.orange : COLORS.border}` }}
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

const OFFRES_ENTREPRISE_INITIAL = [
  { id: "off1", titre: "Chef d'équipe électricité", categorie: "BTP", contrat: "CDI", salaire: "350 000 FCFA/mois", localisation: "Dakar, Plateau", statut: "Active", nbCandidatures: 12, experience: "5-10 ans", dateLimite: "30 nov. 2026", description: "Nous recherchons un Chef d'équipe électricité expérimenté pour superviser nos chantiers résidentiels et tertiaires à Dakar. Vous serez garant de la conformité réglementaire (normes NF C 15-100) et animerez une équipe d'électriciens qualifiés.", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d'équipe"], candidats: [
    { nom: "Moussa Diop", metier: "Électricien bâtiment", date: "15/08", statut: "Nouveau", photo: "https://randomuser.me/api/portraits/men/14.jpg" },
    { nom: "Fatou Sarr", metier: "Plombière", date: "14/08", statut: "En cours", photo: "https://randomuser.me/api/portraits/women/24.jpg" },
    { nom: "Ibrahima Diallo", metier: "Soudeur", date: "12/08", statut: "Retenu", photo: "https://randomuser.me/api/portraits/men/36.jpg" },
    { nom: "Aminata Ndiaye", metier: "Couturière", date: "10/08", statut: "Rejeté", photo: "https://randomuser.me/api/portraits/women/29.jpg" },
  ] },
  { id: "off2", titre: "Technicienne plomberie", categorie: "Plomberie", contrat: "CDD", salaire: "250 000 FCFA/mois", localisation: "Dakar, Médina", statut: "Active", nbCandidatures: 8, experience: "2-5 ans", dateLimite: "15 nov. 2026", description: "Poste de technicienne plomberie pour l'entretien et l'installation de systèmes sanitaires sur nos chantiers.", competences: ["Plomberie sanitaire", "Diagnostic de panne"], candidats: [
    { nom: "Fatou Mbaye", metier: "Plombière sanitaire", date: "13/08", statut: "Nouveau", photo: "https://randomuser.me/api/portraits/women/41.jpg" },
  ] },
  { id: "off3", titre: "Soudeur TIG/MIG", categorie: "Industrie", contrat: "CDI", salaire: "300 000 FCFA/mois", localisation: "Thiès", statut: "Active", nbCandidatures: 15, experience: "3-8 ans", dateLimite: "10 déc. 2026", description: "Soudeur qualifié TIG/MIG pour la fabrication et l'assemblage de structures métalliques industrielles.", competences: ["Soudure TIG", "Soudure MIG", "Lecture de plans"], candidats: [
    { nom: "Ibrahima Diallo", metier: "Soudeur industriel", date: "11/08", statut: "Retenu", photo: "https://randomuser.me/api/portraits/men/36.jpg" },
    { nom: "Ousmane Diaw", metier: "Soudeur TIG/MIG", date: "09/08", statut: "En cours", photo: "https://randomuser.me/api/portraits/men/48.jpg" },
  ] },
  { id: "off4", titre: "Carreleur expérimenté", categorie: "BTP", contrat: "CDD", salaire: "280 000 FCFA/mois", localisation: "Dakar, Almadies", statut: "En pause", nbCandidatures: 6, experience: "3-6 ans", dateLimite: "5 nov. 2026", description: "Carreleur expérimenté pour la finition de villas haut standing aux Almadies.", competences: ["Pose de carrelage", "Finitions"], candidats: [
    { nom: "Mariama Tall", metier: "Carreleuse", date: "07/08", statut: "En cours", photo: "https://randomuser.me/api/portraits/women/53.jpg" },
  ] },
  { id: "off5", titre: "Menuisier ébéniste", categorie: "Artisanat", contrat: "CDI", salaire: "300 000 FCFA/mois", localisation: "Saint-Louis", statut: "Clôturée", nbCandidatures: 5, experience: "5+ ans", dateLimite: "1 août 2026", description: "Menuisier ébéniste pour la fabrication de mobilier sur mesure.", competences: ["Menuiserie", "Ébénisterie"], candidats: [
    { nom: "Ousmane Ba", metier: "Menuisier ébéniste", date: "28/07", statut: "Nouveau", photo: "https://randomuser.me/api/portraits/men/59.jpg" },
  ] },
  { id: "off6", titre: "Peintre bâtiment", categorie: "BTP", contrat: "CDD", salaire: "220 000 FCFA/mois", localisation: "Dakar, Parcelles", statut: "Active", nbCandidatures: 9, experience: "1-3 ans", dateLimite: "20 nov. 2026", description: "Peintre bâtiment pour travaux de finition sur nos chantiers résidentiels.", competences: ["Peinture intérieure/extérieure", "Enduits"], candidats: [
    { nom: "Abdoulaye Sow", metier: "Peintre bâtiment", date: "18/08", statut: "Nouveau", photo: "https://randomuser.me/api/portraits/men/64.jpg" },
  ] },
];

function EntrepriseDashboardScreen({ user, offres, onNavigate, todos }) {
  const [candidaturesRecues] = useStore("candidatures-entreprise", CANDIDATURES_ENTREPRISE_INITIAL);
  const dernieresCandidatures = candidaturesRecues.slice(0, 4).map((c) => ({ nom: c.nom, poste: c.offre, statut: c.statut }));
  const actives = offres.filter((o) => o.statut !== "Clôturée").slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Bonjour, {user.name}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Voici un aperçu de vos recrutements chez Senegal Construction SARL.</p>
      <TodoPanel items={todos} onNavigate={onNavigate} />

      <div className="rounded-lg p-6 mb-6 flex items-center justify-between gap-6" style={{ background: COLORS.dark }}>
        <div className="flex-1">
          <p className="text-lg font-bold text-sur-sombre mb-1">Profil complété à 85%</p>
          <p className="text-sm mb-3" style={{ color: COLORS.orange }}>Un profil complet augmente votre attractivité auprès des meilleurs talents.</p>
          <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.darkTrack }}>
            <div className="h-1.5 rounded-full" style={{ width: "85%", background: COLORS.orange }} />
          </div>
        </div>
        <button type="button" onClick={() => onNavigate("profil")} className="shrink-0 rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
          Compléter mon profil
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Briefcase} value={offres.filter((o) => o.statut === "Active").length} label="Offres actives" />
        <StatCard icon={FileText} value={47} label="Candidatures reçues" />
        <StatCard icon={Star} value="4.6/5" label="Note moyenne" />
        <StatCard icon={Users2} value={8} label="Prestataires engagés" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Dernières candidatures</h3>
            <button type="button" onClick={() => onNavigate("candidatures")} className="text-sm font-medium" style={{ color: COLORS.orange }}>Tout voir</button>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: COLORS.border }}>
            {dernieresCandidatures.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: COLORS.slate }}>{c.nom}</p>
                  <p className="text-xs" style={{ color: COLORS.slateLight }}>{c.poste}</p>
                </div>
                <StatusBadge status={c.statut} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Mes offres actives</h3>
            <button type="button" onClick={() => onNavigate("offres")} className="text-sm font-medium" style={{ color: COLORS.orange }}>Gérer</button>
          </div>
          {actives.map((o) => (
            <p key={o.id} className="text-sm py-1.5" style={{ color: COLORS.slate }}>{o.titre}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function OffreEntrepriseCard({ o, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(o)} className="text-left rounded-lg border bg-surface p-5 transition-shadow hover:shadow-md" style={{ borderColor: o.sponsorisee ? COLORS.orange : COLORS.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: COLORS.softStrong, color: COLORS.slate }}>{o.categorie}</span>
          {o.sponsorisee && <PremiumChip label="Sponsorisée" />}
        </span>
        <StatusBadge status={o.statut} />
      </div>
      <p className="font-semibold text-sm mb-0.5" style={{ color: COLORS.slate }}>{o.titre}</p>
      <p className="text-xs mb-3" style={{ color: COLORS.slateLight }}>{o.salaire} · {o.localisation}</p>
      <p className="text-xs font-semibold" style={{ color: COLORS.orange }}>{o.nbCandidatures} candidatures</p>
    </button>
  );
}

function OffreEntrepriseForm({ initial, onSave, onCancel }) {
  const [v, setV] = useState(initial || { titre: "", categorie: "", contrat: "CDI", salaire: "", localisation: "", experience: "", dateLimite: "", description: "", competencesTxt: "" });
  const valid = v.titre.trim() && v.categorie.trim() && v.localisation.trim() && v.salaire.trim() && v.description.trim();

  function set(k, val) { setV((s) => ({ ...s, [k]: val })); }

  return (
    <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
      <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>{initial ? "Modifier l'offre" : "Créer une offre d'emploi"}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Titre du poste *</label>
          <input value={v.titre} onChange={(e) => set("titre", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Catégorie *</label>
          <input value={v.categorie} onChange={(e) => set("categorie", e.target.value)} placeholder="Ex: BTP, Plomberie..." className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Type de contrat *</label>
          <select value={v.contrat} onChange={(e) => set("contrat", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }}>
            {["CDI", "CDD", "Stage", "Freelance", "Bénévolat"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Localisation *</label>
          <input value={v.localisation} onChange={(e) => set("localisation", e.target.value)} placeholder="Ex: Dakar, Plateau" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Salaire mensuel *</label>
          <input value={v.salaire} onChange={(e) => set("salaire", e.target.value)} placeholder="Ex: 300 000 FCFA/mois" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Expérience requise</label>
          <input value={v.experience} onChange={(e) => set("experience", e.target.value)} placeholder="Ex: 3-5 ans" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Date limite</label>
          <input value={v.dateLimite} onChange={(e) => set("dateLimite", e.target.value)} placeholder="Ex : 30 nov. 2026" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Description du poste *</label>
          <textarea value={v.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Compétences requises</label>
          <input value={v.competencesTxt} onChange={(e) => set("competencesTxt", e.target.value)} placeholder="Séparées par des virgules" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSave({
            id: initial?.id || v.titre.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
            titre: v.titre, categorie: v.categorie, contrat: v.contrat, salaire: v.salaire, localisation: v.localisation,
            statut: initial?.statut || "Active", nbCandidatures: initial?.nbCandidatures || 0, experience: v.experience,
            dateLimite: v.dateLimite, description: v.description,
            competences: v.competencesTxt.split(",").map((s) => s.trim()).filter(Boolean),
            candidats: initial?.candidats || [],
          })}
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre"
          style={{ background: COLORS.orange, opacity: valid ? 1 : 0.5 }}
        >
          {initial ? "Enregistrer" : "Publier l'offre"}
        </button>
      </div>
    </div>
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
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour aux offres
      </button>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.slate }}>{offre.titre}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.3fr] gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Détails de l'offre</h3>
          <BorderedField label="Catégorie" value={offre.categorie} />
          <BorderedField label="Contrat" value={offre.contrat} />
          <BorderedField label="Localisation" value={offre.localisation} />
          <BorderedField label="Salaire" value={offre.salaire} />
          <BorderedField label="Expérience" value={offre.experience} />
          <BorderedField label="Date limite" value={offre.dateLimite} />
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: COLORS.slateLight }}>Statut</p>
            <StatusBadge status={offre.statut} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>Description du poste</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{offre.description}</p>
            {offre.competences?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {offre.competences.map((c) => (
                  <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Candidatures reçues ({offre.candidats?.length || 0})</h3>
            {(offre.candidats || []).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3" style={{ borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <SafeImg src={c.photo} alt={c.nom} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{c.nom}</p>
                    <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{c.metier} · Postulé le {c.date}</p>
                  </div>
                </div>
                <StatusBadge status={c.statut} />
              </div>
            ))}
            {(!offre.candidats || offre.candidats.length === 0) && <p className="text-sm" style={{ color: COLORS.slateLight }}>Aucune candidature pour le moment.</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end flex-wrap gap-3">
        {offre.statut === "Active" && onSponsor && (
          offre.sponsorisee ? (
            <span className="rounded-md px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-1.5" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
              <Crown size={14} /> Sponsorisée pendant 7 jours
            </span>
          ) : (
            <button type="button" onClick={() => planApi.gate("sponsoring", onSponsor)} className="rounded-md px-5 py-2.5 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.orange, color: COLORS.orange }}>
              {planApi.can("sponsoring") ? <Sparkles size={14} /> : <Lock size={14} />} Sponsoriser l'offre
            </button>
          )
        )}
        <button type="button" onClick={onEdit} className="rounded-md px-5 py-2.5 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>
          Modifier
        </button>
        {offre.statut !== "Clôturée" && (
          <button type="button" onClick={onToggleStatut} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
            Clôturer l'offre
          </button>
        )}
      </div>
    </div>
  );
}

function MesOffresScreen({ offres, setOffres }) {
  const [query, setQuery] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("view");

  const planApi = usePlan();
  const offresRestantes = planApi ? planApi.remaining("offres") : UNLIMITED;
  function openCreate() {
    if (offresRestantes <= 0) { planApi.requestUpgrade("offres"); return; }
    setMode("create");
  }
  function sponsoriser(id) {
    setOffres((list) => list.map((o) => (o.id === id ? { ...o, sponsorisee: true } : o)));
    notify("Offre sponsorisée : elle apparaît en tête des résultats pendant 7 jours.");
  }
  const filtered = offres.filter((o) =>
    (o.titre + o.categorie + o.localisation).toLowerCase().includes(query.toLowerCase()) &&
    (statutFilter === "Tous" || o.statut === statutFilter)
  ).sort((a, b) => (b.sponsorisee ? 1 : 0) - (a.sponsorisee ? 1 : 0));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = offres.find((o) => o.id === selectedId);

  function saveOffre(values) {
    if (planApi && !offres.some((o) => o.id === values.id)) planApi.consume("offres");
    setOffres((list) => {
      const exists = list.some((o) => o.id === values.id);
      return exists ? list.map((o) => (o.id === values.id ? values : o)) : [values, ...list];
    });
    setSelectedId(values.id);
    setMode("view");
  }
  function cloturer(id) {
    setOffres((list) => list.map((o) => (o.id === id ? { ...o, statut: "Clôturée" } : o)));
  }

  if (mode === "create") return <OffreEntrepriseForm onSave={saveOffre} onCancel={() => setMode("view")} />;
  if (selected && mode === "edit") return <OffreEntrepriseForm initial={selected} onSave={saveOffre} onCancel={() => setMode("view")} />;
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
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Mes offres d'emploi</h1>
        <button type="button" onClick={openCreate} className="flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
          <Plus size={15} /> Nouvelle offre
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>
        Gérez vos offres d'emploi et suivez les candidatures reçues.
        {offresRestantes !== UNLIMITED && <span> {Math.max(0, offresRestantes)} nouvelle{offresRestantes > 1 ? "s" : ""} offre{offresRestantes > 1 ? "s" : ""} disponible{offresRestantes > 1 ? "s" : ""} ce mois-ci avec le profil {planApi.plan.nom}.</span>}
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Rechercher une offre..."
          className="rounded-md border px-4 py-2.5 text-sm outline-none focus:border-primaire-400 flex-1 max-w-xs"
          style={{ borderColor: COLORS.border }}
        />
        {["Tous", "Active", "En pause", "Clôturée"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setStatutFilter(s); setPage(1); }}
            className="rounded-md px-3 py-1.5 text-xs font-semibold"
            style={{ background: statutFilter === s ? COLORS.orange : COLORS.surface, color: statutFilter === s ? COLORS.onOrange : COLORS.slate, border: `1px solid ${statutFilter === s ? COLORS.orange : COLORS.border}` }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((o) => (
          <OffreEntrepriseCard key={o.id} o={o} onOpen={(oo) => setSelectedId(oo.id)} />
        ))}
        {paged.length === 0 && <p className="text-sm col-span-full" style={{ color: COLORS.slateLight }}>Aucune offre ne correspond.</p>}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Screen 16 : Candidatures & Recrutement (Entreprise) ---------- */

const CANDIDATURES_ENTREPRISE_INITIAL = [
  { id: "c1", nom: "Moussa Diop", metier: "Électricien bâtiment", localisation: "Dakar", offre: "Chef d'équipe électricité", date: "15/08/2026", statut: "Nouveau", experience: "8 ans d'expérience", telephone: "+221 77 123 45 67", email: "moussa.diop@email.sn", lettre: "Bonjour, je suis très intéressé par votre offre de Chef d'équipe électricité. Fort de mes 8 ans d'expérience sur divers chantiers à Dakar et Thiès, je maîtrise l'installation électrique complète, le câblage industriel et l'encadrement des équipes sur le terrain dans le respect strict des normes NF C 15-100. Motivé et rigoureux, je suis disponible immédiatement.", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d'équipe", "Habilitation B2V"], documents: [{ nom: "CV_Moussa_Diop.pdf", taille: "1.2 Mo" }, { nom: "Certificat_Habilitation.pdf", taille: "850 Ko" }] },
  { id: "c2", nom: "Fatou Sarr", metier: "Plombière sanitaire", localisation: "Dakar", offre: "Technicienne plomberie", date: "14/08/2026", statut: "En cours", experience: "5 ans d'expérience", telephone: "+221 76 234 56 78", email: "fatou.sarr@email.sn", lettre: "Madame, Monsieur, je souhaite postuler au poste de technicienne plomberie. J'ai travaillé 5 ans sur des chantiers résidentiels et je maîtrise le diagnostic de panne et l'installation sanitaire complète.", competences: ["Plomberie sanitaire", "Diagnostic de panne"], documents: [{ nom: "CV_Fatou_Sarr.pdf", taille: "1.0 Mo" }] },
  { id: "c3", nom: "Ibrahima Diallo", metier: "Soudeur industriel", localisation: "Dakar", offre: "Soudeur TIG/MIG", date: "12/08/2026", statut: "Retenu", experience: "6 ans d'expérience", telephone: "+221 78 345 67 89", email: "ibrahima.diallo@email.sn", lettre: "Je suis soudeur industriel qualifié TIG et MIG, avec 6 ans d'expérience dans la fabrication de structures métalliques. Je souhaite mettre mon expertise au service de votre équipe.", competences: ["Soudure TIG", "Soudure MIG", "Lecture de plans"], documents: [{ nom: "CV_Ibrahima_Diallo.pdf", taille: "980 Ko" }, { nom: "Certificat_Soudure.pdf", taille: "620 Ko" }] },
  { id: "c4", nom: "Aminata Ndiaye", metier: "Couturière", localisation: "Dakar", offre: "Responsable atelier couture", date: "10/08/2026", statut: "Rejeté", experience: "10 ans d'expérience", telephone: "+221 77 456 78 90", email: "aminata.ndiaye@email.sn", lettre: "Couturière expérimentée, je gère depuis 10 ans un petit atelier et souhaite rejoindre une structure plus importante pour développer mes compétences en gestion d'équipe.", competences: ["Couture sur mesure", "Gestion d'atelier"], documents: [{ nom: "CV_Aminata_Ndiaye.pdf", taille: "1.1 Mo" }] },
  { id: "c5", nom: "Ousmane Ba", metier: "Menuisier ébéniste", localisation: "Saint-Louis", offre: "Menuisier ébéniste", date: "09/08/2026", statut: "Nouveau", experience: "12 ans d'expérience", telephone: "+221 76 567 89 01", email: "ousmane.ba@email.sn", lettre: "Menuisier ébéniste depuis 12 ans, spécialisé dans le mobilier sur mesure, je suis disponible pour rejoindre votre atelier à Saint-Louis.", competences: ["Menuiserie", "Ébénisterie"], documents: [{ nom: "CV_Ousmane_Ba.pdf", taille: "900 Ko" }] },
  { id: "c6", nom: "Mariama Tall", metier: "Carreleur", localisation: "Dakar", offre: "Carreleur expérimenté", date: "08/08/2026", statut: "En cours", experience: "4 ans d'expérience", telephone: "+221 78 678 90 12", email: "mariama.tall@email.sn", lettre: "Carreleuse spécialisée dans les finitions haut de gamme, je souhaite intégrer votre équipe pour vos chantiers résidentiels aux Almadies.", competences: ["Pose de carrelage", "Finitions"], documents: [{ nom: "CV_Mariama_Tall.pdf", taille: "1.0 Mo" }] },
  { id: "c7", nom: "Abdoulaye Sow", metier: "Peintre bâtiment", localisation: "Dakar", offre: "Peintre bâtiment", date: "07/08/2026", statut: "Nouveau", experience: "3 ans d'expérience", telephone: "+221 77 789 01 23", email: "abdoulaye.sow@email.sn", lettre: "Peintre en bâtiment depuis 3 ans, je maîtrise les enduits et les finitions intérieures/extérieures. Disponible rapidement.", competences: ["Peinture intérieure/extérieure", "Enduits"], documents: [{ nom: "CV_Abdoulaye_Sow.pdf", taille: "870 Ko" }] },
  { id: "c8", nom: "Aissatou Gueye", metier: "Électricienne", localisation: "Dakar", offre: "Chef d'équipe électricité", date: "06/08/2026", statut: "Retenu", experience: "7 ans d'expérience", telephone: "+221 76 890 12 34", email: "aissatou.gueye@email.sn", lettre: "Électricienne qualifiée avec 7 ans d'expérience en encadrement de chantier, je suis particulièrement intéressée par un poste à responsabilités.", competences: ["Normes NF C 15-100", "Management d'équipe", "Habilitation B2V"], documents: [{ nom: "CV_Aissatou_Gueye.pdf", taille: "1.3 Mo" }] },
];

function CandidatureEntrepriseRow({ c, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(c)}
      className="w-full flex items-center justify-between gap-4 rounded-lg border bg-surface px-5 py-4 mb-3 text-left transition-shadow hover:shadow-md"
      style={{ borderColor: PREMIUM_CANDIDATS.has(c.id) ? COLORS.orange : COLORS.border }}
    >
      <div className="flex items-center gap-3 min-w-0" style={{ flex: "1 1 30%" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
          {initials(c.nom)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate flex items-center gap-1.5" style={{ color: COLORS.slate }}>{c.nom} {PREMIUM_CANDIDATS.has(c.id) && <TierBadge premium size="sm" />}</p>
          <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{c.metier}</p>
        </div>
      </div>
      <p className="text-sm truncate" style={{ flex: "1 1 25%", color: COLORS.slate }}>{c.offre}</p>
      <p className="text-sm" style={{ flex: "0 0 auto", color: COLORS.slateLight }}>{c.date}</p>
      <StatusBadge status={c.statut} />
    </button>
  );
}

function LockedRow({ label, onUnlock }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: COLORS.slateLight }}>{label}</p>
      <button type="button" onClick={onUnlock} className="text-sm inline-flex items-center gap-1.5 font-medium" style={{ color: COLORS.orange }}>
        <Lock size={13} /> Débloquer
      </button>
    </div>
  );
}

function CandidatureEntrepriseDetail({ candidat, onDecide, onBack }) {
  const planApi = usePlan();
  const coordOk = !planApi || planApi.can("coordonnees");
  const unlock = () => planApi.requestUpgrade("coordonnees");
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}>
        <ArrowLeft size={14} /> Retour aux candidatures
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
              {initials(candidat.nom)}
            </div>
            <div>
              <p className="font-semibold" style={{ color: COLORS.slate }}>{candidat.nom}</p>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{candidat.metier}</p>
            </div>
          </div>
          <Row label="Localisation" value={candidat.localisation} />
          <div className="h-2" />
          <Row label="Expérience" value={candidat.experience} />
          <div className="h-2" />
          {coordOk ? <Row label="Téléphone" value={candidat.telephone} /> : <LockedRow label="Téléphone" onUnlock={unlock} />}
          <div className="h-2" />
          {coordOk ? <Row label="Email" value={candidat.email} /> : <LockedRow label="Email" onUnlock={unlock} />}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Détails de la candidature</h3>
              <StatusBadge status={candidat.statut} />
            </div>
            <p className="text-xs mb-3" style={{ color: COLORS.slateLight }}>Offre : {candidat.offre} · Déposée le {candidat.date}</p>
            <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Lettre de motivation</p>
            <p className="text-sm" style={{ color: COLORS.slate }}>{candidat.lettre}</p>
          </div>
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Compétences clés</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {candidat.competences.map((c) => (
                <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>
              ))}
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Documents joints</p>
            {candidat.documents.map((d) => (
              <div key={d.nom} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <FileText size={15} color={COLORS.slateLight} />
                  <p className="text-sm" style={{ color: COLORS.slate }}>{d.nom}</p>
                </div>
                {coordOk ? (
                  <button type="button" onClick={() => notify(`${d.nom} téléchargé.`)} className="text-xs inline-flex items-center gap-1" style={{ color: COLORS.slateLight }}>
                    {d.taille} <Download size={13} />
                  </button>
                ) : (
                  <button type="button" onClick={unlock} className="text-xs inline-flex items-center gap-1 font-medium" style={{ color: COLORS.orange }}>
                    <Lock size={12} /> Débloquer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onDecide(candidat.id, "Rejeté")} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>
          Rejeter
        </button>
        <button type="button" onClick={() => onDecide(candidat.id, "En cours")} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.orange, color: COLORS.orange }}>
          Planifier entretien
        </button>
        <button type="button" onClick={() => onDecide(candidat.id, "Retenu")} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
          Retenir la candidature
        </button>
      </div>
    </div>
  );
}

function CandidaturesEntrepriseScreen() {
  const [candidats, setCandidats] = useStore("candidatures-entreprise", CANDIDATURES_ENTREPRISE_INITIAL);
  const [query, setQuery] = useState("");
  const [offreFilter, setOffreFilter] = useState("Toutes les offres");
  const [statutFilter, setStatutFilter] = useState("Tous les statuts");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const offresList = ["Toutes les offres", ...Array.from(new Set(CANDIDATURES_ENTREPRISE_INITIAL.map((c) => c.offre)))];
  const statutsList = ["Tous les statuts", "Nouveau", "En cours", "Retenu", "Rejeté"];

  const filtered = candidats.filter((c) =>
    (c.nom + c.metier).toLowerCase().includes(query.toLowerCase()) &&
    (offreFilter === "Toutes les offres" || c.offre === offreFilter) &&
    (statutFilter === "Tous les statuts" || c.statut === statutFilter)
  ).sort(premiumFirst((c) => PREMIUM_CANDIDATS.has(c.id)));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = candidats.find((c) => c.id === selectedId);

  function decide(id, statut) {
    setCandidats((list) => list.map((c) => (c.id === id ? { ...c, statut } : c)));
  }

  if (selected) {
    return <CandidatureEntrepriseDetail candidat={selected} onDecide={decide} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Candidatures reçues</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Visualisez et gérez toutes les candidatures reçues pour vos offres d'emploi.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Rechercher un candidat..."
          className="rounded-md border px-4 py-2.5 text-sm outline-none focus:border-primaire-400 flex-1 max-w-xs"
          style={{ borderColor: COLORS.border }}
        />
        <select value={offreFilter} onChange={(e) => { setOffreFilter(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2.5 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          {offresList.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={statutFilter} onChange={(e) => { setStatutFilter(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2.5 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          {statutsList.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {paged.map((c) => (
        <CandidatureEntrepriseRow key={c.id} c={c} onOpen={(cc) => setSelectedId(cc.id)} />
      ))}
      {paged.length === 0 && <p className="text-sm" style={{ color: COLORS.slateLight }}>Aucune candidature ne correspond à ces filtres.</p>}

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Screen 17 : Recherche de Prestataires (Entreprise) ---------- */

const PRESTATAIRES_SEARCH = [
  {
    id: "p1", nom: "Amadou Niang", metier: "Électricien bâtiment", localisation: "Dakar, Plateau", experience: "10 ans d'expérience", note: 4.8, disponible: true,
    telephone: "+221 76 456 78 90", email: "amadou.niang@email.sn",
    timeline: [
      { poste: "Chef d'équipe électricité", periode: "2020 – Présent", lieu: "Senegal Construction", description: "Supervision des chantiers de câblage résidentiels et gestion d'une équipe de 5 électriciens." },
      { poste: "Électricien senior", periode: "2016 – 2020", lieu: "BTP Dakar", description: "Diagnostic de pannes complexes et réalisation de plans électriques pour bâtiments tertiaires." },
      { poste: "Électricien", periode: "2014 – 2016", lieu: "Artisan Elec", description: "Travaux d'installation courants forts et faibles en rénovation immobilière." },
    ],
    competences: ["Installation électrique", "Normes NF C 15-100", "Câblage industriel", "Domotique", "Lecture de plans", "Habilitation B2V"],
    avis: [
      { auteur: "Moussa Sy", date: "12 mai 2026", note: 5, commentaire: "Excellent travail sur mon chantier à Mermoz. Amadou est très professionnel et respecte les normes." },
      { auteur: "Fatoumata Diop", date: "28 avr. 2026", note: 5, commentaire: "Disponible et compétent. A rapidement résolu un problème de court-circuit complexe." },
    ],
    certifications: ["Habilitation électrique B2V / BR / BC", "CAP Électricien - Lycée Technique de Dakar", "Attestation de formation sécurité chantier BTP"],
  },
  { id: "p2", nom: "Fatou Mbaye", metier: "Plombière sanitaire", localisation: "Thiès", experience: "6 ans d'expérience", note: 4.5, disponible: true, telephone: "+221 77 567 89 01", email: "fatou.mbaye@email.sn", timeline: [{ poste: "Plombière sanitaire", periode: "2020 – Présent", lieu: "Indépendante", description: "Installation et dépannage sanitaire pour particuliers et professionnels." }], competences: ["Plomberie sanitaire", "Diagnostic de panne"], avis: [{ auteur: "Cheikh Ba", date: "3 mai 2026", note: 5, commentaire: "Très efficace et de bon conseil." }], certifications: ["CAP Plomberie sanitaire et thermique"] },
  { id: "p3", nom: "Cheikh Fall", metier: "Électricien industriel", localisation: "Dakar, Plateau", experience: "12 ans d'expérience", note: 4.9, disponible: false, telephone: "+221 78 678 90 12", email: "cheikh.fall3@email.sn", timeline: [{ poste: "Électricien industriel", periode: "2018 – Présent", lieu: "Industries Sénégal", description: "Maintenance électrique de lignes de production industrielles." }], competences: ["Électricité industrielle", "Automatisme", "Normes NF C 15-100"], avis: [{ auteur: "Senegal Construction SARL", date: "20 avr. 2026", note: 5, commentaire: "Intervention rapide et de très haute qualité." }], certifications: ["BTS Électrotechnique", "Habilitation B2V/BR"] },
  { id: "p4", nom: "Mariama Seck", metier: "Couturière", localisation: "Saint-Louis", experience: "8 ans d'expérience", note: 4.7, disponible: true, telephone: "+221 76 789 01 23", email: "mariama.seck@email.sn", timeline: [{ poste: "Couturière", periode: "2017 – Présent", lieu: "Atelier Seck", description: "Confection et retouche de vêtements sur mesure." }], competences: ["Couture sur mesure", "Retouches"], avis: [{ auteur: "Awa Diallo", date: "15 avr. 2026", note: 5, commentaire: "Travail soigné et délais respectés." }], certifications: ["Certificat de qualification professionnelle Couture"] },
  { id: "p5", nom: "Ibrahima Gueye", metier: "Menuisier ébéniste", localisation: "Dakar, Plateau", experience: "15 ans d'expérience", note: 4.6, disponible: true, telephone: "+221 77 890 12 34", email: "ibrahima.gueye@email.sn", timeline: [{ poste: "Menuisier ébéniste", periode: "2015 – Présent", lieu: "Atelier Gueye", description: "Fabrication de mobilier sur mesure pour particuliers et entreprises." }], competences: ["Menuiserie", "Ébénisterie", "Finitions bois"], avis: [{ auteur: "Khady Touré", date: "2 avr. 2026", note: 5, commentaire: "Un vrai artisan, travail impeccable." }], certifications: ["CAP Menuiserie du bâtiment"] },
  { id: "p6", nom: "Ousmane Diaw", metier: "Soudeur TIG/MIG", localisation: "Thiès", experience: "7 ans d'expérience", note: 4.4, disponible: false, telephone: "+221 78 901 23 45", email: "ousmane.diaw@email.sn", timeline: [{ poste: "Soudeur TIG/MIG", periode: "2019 – Présent", lieu: "Industries Sénégal", description: "Soudure de structures métalliques industrielles." }], competences: ["Soudure TIG", "Soudure MIG"], avis: [{ auteur: "Babacar Niang", date: "18 mars 2026", note: 4, commentaire: "Bon travail, quelques retards sur le planning." }], certifications: ["Certificat de soudage industriel"] },
];

function PrestataireSearchCard({ p, onOpen }) {
  return (
    <div className="rounded-lg border bg-surface p-5 flex flex-col" style={{ borderColor: PREMIUM_PRESTATAIRES.has(p.id) ? COLORS.orange : COLORS.border }}>
      <div className="flex flex-wrap gap-1.5 mb-3 min-h-[20px]">
        {PREMIUM_PRESTATAIRES.has(p.id) && <TierBadge premium size="sm" />}
        {PRESTATAIRES_REGULARISES.has(p.id) && <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#DCFCE7", color: "#16A34A" }}><BadgeCheck size={10} /> Activité régularisée</span>}
      </div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
          {initials(p.nom)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: COLORS.slate }}>{p.nom}</p>
          <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{p.metier}</p>
        </div>
      </div>
      <p className="text-xs mb-2" style={{ color: COLORS.slateLight }}>{p.localisation} · {p.experience}</p>
      <div className="flex items-center justify-between mb-3">
        <Stars note={Math.round(p.note)} />
        <StatusBadge status={p.disponible ? "Disponible" : "Occupé"} />
      </div>
      <button type="button" onClick={() => onOpen(p)} className="w-full rounded-md py-2.5 text-sm font-semibold mt-auto" style={{ background: COLORS.softStrong, color: COLORS.slate }}>
        Voir profil
      </button>
    </div>
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
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.slateLight }}>
        <ArrowLeft size={14} /> Retour à la recherche
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
              {initials(p.nom)}
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: COLORS.slate }}>{p.nom}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{p.metier}</p>
              <Stars note={Math.round(p.note)} size={14} />
            </div>
          </div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: p.disponible ? "#DCFCE7" : COLORS.orangeSoft, color: p.disponible ? "#16A34A" : COLORS.orange }}>
            {p.disponible ? "Disponible" : "Occupé"}
          </span>
          <div className="flex items-center gap-2 text-sm mb-1.5"><Phone size={14} color={COLORS.slateLight} /><span style={{ color: COLORS.slate }}>{p.telephone}</span></div>
          <div className="flex items-center gap-2 text-sm mb-1.5"><Mail size={14} color={COLORS.slateLight} /><span style={{ color: COLORS.slate }}>{p.email}</span></div>
          <div className="flex items-center gap-2 text-sm"><MapPin size={14} color={COLORS.slateLight} /><span style={{ color: COLORS.slate }}>{p.localisation}</span></div>
        </div>

        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Expérience professionnelle</h3>
          <div className="flex flex-col gap-3">
            {p.timeline.map((t, i) => (
              <div key={i} className="pb-3" style={{ borderBottom: i < p.timeline.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{t.poste}</p>
                  <span className="text-xs font-semibold" style={{ color: COLORS.orange }}>{t.periode}</span>
                </div>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{t.lieu}</p>
                <p className="text-xs mt-1" style={{ color: COLORS.slateLight }}>{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Compétences</h3>
          <div className="flex flex-wrap gap-1.5">
            {p.competences.map((c) => (
              <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Avis clients</h3>
          {p.avis.map((a, i) => (
            <div key={i} className="py-2" style={{ borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{a.auteur}</p>
                <span className="text-xs" style={{ color: COLORS.slateLight }}>{a.date}</span>
              </div>
              <Stars note={a.note} size={12} />
              <p className="text-xs mt-1" style={{ color: COLORS.slateLight }}>{a.commentaire}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Certifications</h3>
          {p.certifications.map((c) => (
            <div key={c} className="flex items-start gap-2 py-1">
              <ShieldCheck size={14} color={COLORS.orange} className="mt-0.5 shrink-0" />
              <p className="text-sm" style={{ color: COLORS.slate }}>{c}</p>
            </div>
          ))}
        </div>

      </div>

      {proposed ? (
        <div className="rounded-md px-4 py-3 text-sm inline-block" style={{ background: "#ECFDF5", color: "#047857" }}>
          Mission proposée à {p.nom} — vous serez notifié(e) de sa réponse.
        </div>
      ) : (
        <div className="flex gap-3">
          <button type="button" onClick={() => gateContact(() => setContactOpen((o) => !o))} aria-expanded={contactOpen} className="rounded-md px-5 py-2.5 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.border, color: COLORS.slate }}>{!contactOk && <Lock size={13} />} Contacter</button>
          <button type="button" onClick={() => gateContact(() => setProposed(true))} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre inline-flex items-center gap-1.5" style={{ background: COLORS.orange }}>{!contactOk && <Lock size={13} />} Proposer une mission</button>
        </div>
      )}
      {contactOpen && (
        <div className="rounded-lg border bg-surface p-5 mt-4 max-w-xl" style={{ borderColor: COLORS.border }}>
          <label htmlFor="contact-msg" className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Message à {p.nom}</label>
          <textarea id="contact-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bonjour, je souhaiterais échanger sur un besoin…" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          <div className="flex gap-2 mt-3">
            <button type="button" disabled={!message.trim()} onClick={() => { notify(`Message envoyé à ${p.nom}.`); setMessage(""); setContactOpen(false); }} className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: message.trim() ? 1 : 0.5 }}>
              <Send size={14} /> Envoyer
            </button>
            <button type="button" onClick={() => setContactOpen(false)} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PrestatairesSearchScreen() {
  const [query, setQuery] = useState("");
  const [metier, setMetier] = useState("Tous les métiers");
  const [dispo, setDispo] = useState("Tous");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const metiers = ["Tous les métiers", ...Array.from(new Set(PRESTATAIRES_SEARCH.map((p) => p.metier)))];
  const filtered = PRESTATAIRES_SEARCH.filter((p) =>
    (p.nom + p.metier + p.localisation).toLowerCase().includes(query.toLowerCase()) &&
    (metier === "Tous les métiers" || p.metier === metier) &&
    (dispo === "Tous" || (dispo === "Disponible" ? p.disponible : !p.disponible))
  ).sort(premiumFirst((p) => PREMIUM_PRESTATAIRES.has(p.id)));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = PRESTATAIRES_SEARCH.find((p) => p.id === selectedId);

  if (selected) return <PrestataireProfilDetail p={selected} onBack={() => setSelectedId(null)} />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Trouver un prestataire</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Trouvez des artisans et techniciens qualifiés pour vos besoins.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Rechercher un artisan..."
          className="rounded-md border px-4 py-2.5 text-sm outline-none focus:border-primaire-400 flex-1 max-w-xs"
          style={{ borderColor: COLORS.border }}
        />
        <select value={metier} onChange={(e) => { setMetier(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2.5 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          {metiers.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={dispo} onChange={(e) => { setDispo(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2.5 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          {["Tous", "Disponible", "Occupé"].map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((p) => (
          <PrestataireSearchCard key={p.id} p={p} onOpen={(pp) => setSelectedId(pp.id)} />
        ))}
        {paged.length === 0 && <p className="text-sm col-span-full" style={{ color: COLORS.slateLight }}>Aucun prestataire ne correspond à ces critères.</p>}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Screen 18 : Profil Entreprise ---------- */

const PROFIL_ENTREPRISE_INITIAL = {
  nom: "Senegal Construction SARL",
  secteurPrincipal: "BTP & Construction",
  ninea: "2938472 2G3",
  rccm: "SN-DKR-2008-B-1120",
  taille: "45-50 employés",
  chiffreAffaires: "500M - 1B FCFA",
  telephone: "+221 33 824 55 99",
  email: "contact@senegalconstruct.sn",
  siteWeb: "www.senegalconstruct.sn",
  adresse: "Avenue Cheikh Anta Diop, Dakar",
  fondee: "2008",
  ville: "Dakar, Sénégal",
  description: "Senegal Construction SARL est un acteur leader du BTP au Sénégal depuis plus de 15 ans. Nous intervenons sur des projets d'envergure nationale, résidentiels et industriels, en garantissant des standards de qualité et de sécurité internationaux. Notre force réside dans nos équipes locales hautement qualifiées.",
  secteurs: ["BTP", "Électricité", "Plomberie", "Maçonnerie"],
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
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Ajouter un secteur..."
          className="rounded-md border px-3 py-1.5 text-sm outline-none focus:border-primaire-400"
          style={{ borderColor: COLORS.border }}
        />
        <button type="button" onClick={add} className="rounded-md px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          + Ajouter
        </button>
      </div>
    </div>
  );
}

function ProfilEntrepriseEdit({ profile, onSave, onCancel }) {
  const [v, setV] = useState(profile);
  function set(k, val) { setV((s) => ({ ...s, [k]: val })); }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.slate }}>Modifier le profil</h1>
      <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-4 mb-6">
          {v.logo ? (
            <img src={v.logo} alt={`Logo ${v.nom}`} className="w-14 h-14 rounded-md object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-md flex items-center justify-center text-sm font-bold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
              {initials(v.nom)}
            </div>
          )}
          <FilePickerButton
            accept="image/*"
            onPick={(f) => { const r = new FileReader(); r.onload = () => set("logo", r.result); r.readAsDataURL(f); }}
            className="rounded-md px-4 py-2 text-sm font-semibold border"
            style={{ borderColor: COLORS.border, color: COLORS.slate }}
          >
            Changer le logo
          </FilePickerButton>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Nom de l'entreprise *</label>
            <input value={v.nom} onChange={(e) => set("nom", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Secteur principal *</label>
            <input value={v.secteurPrincipal} onChange={(e) => set("secteurPrincipal", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Taille de l'entreprise *</label>
            <select value={v.taille} onChange={(e) => set("taille", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }}>
              {["1-10 employés", "11-45 employés", "45-50 employés", "50-100 employés", "100+ employés"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>NINEA *</label>
            <input value={v.ninea} onChange={(e) => set("ninea", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>RCCM *</label>
            <input value={v.rccm} onChange={(e) => set("rccm", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Téléphone *</label>
            <input value={v.telephone} onChange={(e) => set("telephone", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Email de contact *</label>
            <input value={v.email} onChange={(e) => set("email", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Site web</label>
            <input value={v.siteWeb} onChange={(e) => set("siteWeb", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Adresse de l'établissement principal *</label>
            <input value={v.adresse} onChange={(e) => set("adresse", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Présentation / Description *</label>
            <textarea value={v.description} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: COLORS.slate }}>Tags de secteurs d'activité associés</label>
            <EditableTags tags={v.secteurs} onChange={(tags) => set("secteurs", tags)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
          <button type="button" onClick={() => onSave(v)} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

function ProfilEntrepriseScreen({ offres, onNavigate }) {
  const [profile, setProfile] = useState(PROFIL_ENTREPRISE_INITIAL);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfilEntrepriseEdit
        profile={profile}
        onCancel={() => setEditing(false)}
        onSave={(v) => { setProfile(v); setEditing(false); }}
      />
    );
  }

  const activesOffres = offres.filter((o) => o.statut !== "Clôturée");

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Profil entreprise</h1>
          <ProfileTierBadge />
        </div>
        <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
          <Pencil size={14} /> Modifier le profil
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Gérez la visibilité publique de votre marque employeur.</p>
      <ProfileTierCard />

      <div className="rounded-lg border bg-surface p-6 mb-4" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {profile.logo ? (
              <img src={profile.logo} alt={`Logo ${profile.nom}`} className="w-12 h-12 rounded-md object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-md flex items-center justify-center text-sm font-bold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
                {initials(profile.nom)}
              </div>
            )}
            <div>
              <p className="text-lg font-bold" style={{ color: COLORS.slate }}>{profile.nom}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{profile.secteurPrincipal} · {profile.ville} · Fondé en {profile.fondee}</p>
            </div>
          </div>
          <div className="text-right w-40 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>Profil complété</p>
              <p className="text-sm font-bold" style={{ color: COLORS.orange }}>85%</p>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.softStrong }}>
              <div className="h-1.5 rounded-full" style={{ width: "85%", background: COLORS.orange }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Informations administratives</h3>
          <Row label="NINEA" value={profile.ninea} />
          <div className="h-2" />
          <Row label="RCCM" value={profile.rccm} />
          <div className="h-2" />
          <Row label="Taille de l'entreprise" value={profile.taille} />
          <div className="h-2" />
          <Row label="Chiffre d'affaires" value={profile.chiffreAffaires} />
          <div className="h-2" />
          <Row label="Téléphone" value={profile.telephone} />
          <div className="h-2" />
          <Row label="Email" value={profile.email} />
          <div className="h-2" />
          <Row label="Site web" value={profile.siteWeb} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-2" style={{ color: COLORS.slate }}>À propos de l'entreprise</h3>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{profile.description}</p>
          </div>
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Secteurs d'activité</h3>
            <div className="flex flex-wrap gap-2">
              {profile.secteurs.map((s) => (
                <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: COLORS.softStrong, color: COLORS.slate }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: COLORS.slate }}>Nos offres d'emploi actives</h3>
          <button type="button" onClick={() => onNavigate("offres")} className="text-sm font-medium" style={{ color: COLORS.orange }}>Gérer les offres</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {activesOffres.map((o) => (
            <div key={o.id} className="rounded-md border px-4 py-3 flex items-center justify-between" style={{ borderColor: COLORS.border }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{o.titre}</p>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{o.localisation.split(",")[0]} · {o.contrat}</p>
              </div>
              <StatusBadge status={o.statut} />
            </div>
          ))}
          {activesOffres.length === 0 && <p className="text-sm col-span-full" style={{ color: COLORS.slateLight }}>Aucune offre active pour le moment.</p>}
        </div>
      </div>
    </div>
  );
}

/* ================= ADMIN ESPACE ================= */

const ADMIN_PAGE_SIZE = 8;

function ActionButton({ label, variant = "primary", onClick, icon: Icon }) {
  const styles = {
    danger: { border: `1px solid ${COLORS.danger}`, color: COLORS.danger, background: COLORS.surface },
    warning: { border: `1px solid #D97706`, color: "#D97706", background: COLORS.surface },
    primary: { border: "none", color: COLORS.onOrange, background: COLORS.orange },
    neutral: { border: `1px solid ${COLORS.border}`, color: COLORS.slate, background: COLORS.surface },
  };
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-semibold" style={styles[variant]}>
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

function AdminEntityModule({ title, subtitle, columns, filters, initialData, searchKeys, renderDetail }) {
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>{title}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>{subtitle}</p>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder={`Rechercher...`}
          className="rounded-md border px-4 py-2.5 text-sm outline-none focus:border-primaire-400 flex-1 max-w-xs"
          style={{ borderColor: COLORS.border }}
        />
        {filters.map((f) => (
          <select
            key={f.key}
            value={filterValues[f.key]}
            onChange={(e) => { setFilterValues((v) => ({ ...v, [f.key]: e.target.value })); setPage(1); }}
            className="rounded-md border px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: COLORS.border, color: COLORS.slate }}
          >
            <option value="all">{f.label}</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      <div className="rounded-lg border bg-surface overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center px-5 py-3" style={{ background: COLORS.soft, borderBottom: `1px solid ${COLORS.border}` }}>
          {columns.map((c) => (
            <p key={c.key} className="text-xs font-semibold" style={{ flex: c.flex || 1, color: COLORS.slateLight }}>{c.label}</p>
          ))}
          <p className="text-xs font-semibold w-16 text-right" style={{ color: COLORS.slateLight }}>Actions</p>
        </div>
        {paged.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => setSelectedId(row.id)}
            className="w-full flex items-center px-5 py-3.5 text-left hover:bg-doux"
            style={{ borderBottom: `1px solid ${COLORS.border}` }}
          >
            {columns.map((c) => (
              <div key={c.key} style={{ flex: c.flex || 1 }} className="pr-3">
                {c.render ? c.render(row) : <span className="text-sm" style={{ color: COLORS.slate }}>{row[c.key]}</span>}
              </div>
            ))}
            <span className="w-16 text-right text-xs font-semibold shrink-0" style={{ color: COLORS.orange }}>Voir</span>
          </button>
        ))}
        {paged.length === 0 && <p className="text-sm p-5" style={{ color: COLORS.slateLight }}>Aucun résultat.</p>}
      </div>

      <Pagination page={page} pageSize={ADMIN_PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

function IdentityCell({ nom, sub, photo }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {photo ? (
        <SafeImg src={photo} alt={nom} className="w-8 h-8 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>
          {initials(nom)}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{nom}</p>
        {sub && <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ---------- Admin Dashboard ---------- */

const INSCRIPTIONS_MENSUELLES = [
  { mois: "Jan", valeur: 320 }, { mois: "Fév", valeur: 360 }, { mois: "Mar", valeur: 430 },
  { mois: "Avr", valeur: 390 }, { mois: "Mai", valeur: 460 }, { mois: "Jun", valeur: 520 },
  { mois: "Jul", valeur: 560 }, { mois: "Aoû", valeur: 610 },
];
const REPARTITION_PROFILS = [
  { name: "Chercheurs", value: 58, color: "#3B82F6" },
  { name: "Prestataires", value: 27, color: "#16A34A" },
  { name: "Entreprises", value: 15, color: COLORS.orange },
];
const DERNIERES_INSCRIPTIONS = [
  { nom: "Amadou Diallo", type: "Chercheur d'emploi", ville: "Dakar", date: "12/07/2026", statut: "Nouveau" },
  { nom: "Sokhna Fall", type: "Prestataire", ville: "Thiès", date: "11/07/2026", statut: "Vérifié" },
  { nom: "Senegal Construction", type: "Entreprise", ville: "Dakar", date: "10/07/2026", statut: "Nouveau" },
  { nom: "Marième Diop", type: "Chercheur d'emploi", ville: "Dakar", date: "09/07/2026", statut: "Vérifié" },
  { nom: "Amadou Sow", type: "Prestataire", ville: "Thiès", date: "08/07/2026", statut: "Nouveau" },
];

function AdminDashboardScreen({ onNavigate, todos }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Tableau de bord</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Vue d'ensemble de la plateforme LIGGEEY et de ses utilisateurs.</p>
      <TodoPanel items={todos} onNavigate={onNavigate} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Utilisateurs totaux", value: "25 694", delta: "+12%" },
          { label: "Offres actives", value: "847", delta: "+8%" },
          { label: "Candidatures", value: "3 421", delta: "+15%" },
          { label: "Missions en cours", value: "156", delta: "+5%" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <p className="text-xs mb-2" style={{ color: COLORS.slateLight }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: COLORS.slate }}>{s.value} <span className="text-xs font-semibold" style={{ color: "#16A34A" }}>{s.delta}</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Inscriptions mensuelles</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={INSCRIPTIONS_MENSUELLES}>
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: COLORS.slateLight }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: COLORS.slateLight }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="valeur" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Répartition des profils</h3>
          <div className="flex items-center gap-6">
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={REPARTITION_PROFILS} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {REPARTITION_PROFILS.map((p) => <Cell key={p.name} fill={p.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {REPARTITION_PROFILS.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                  <span style={{ color: COLORS.slate }}>{p.name}</span>
                  <span className="font-semibold" style={{ color: COLORS.slate }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: COLORS.slate }}>Dernières inscriptions</h3>
            <span className="text-sm font-medium" style={{ color: COLORS.orange }}>Voir tout</span>
          </div>
          {DERNIERES_INSCRIPTIONS.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{ borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
              <IdentityCell nom={d.nom} sub={`${d.type} · ${d.ville}`} />
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs" style={{ color: COLORS.slateLight }}>{d.date}</span>
                <StatusBadge status={d.statut} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Alertes & Actions requises</h3>
          {[
            { label: "Profils en attente de vérification", value: 23, target: "verifications" },
            { label: "Signalements en cours", value: 7, target: "candidatures" },
            { label: "Utilisateurs suspendus", value: 4, target: "chercheurs" },
          ].map((a) => (
            <div key={a.label} className="flex items-center justify-between py-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
              <div>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{a.label}</p>
                <p className="text-xl font-bold" style={{ color: COLORS.slate }}>{a.value}</p>
              </div>
              <button type="button" onClick={() => onNavigate(a.target)} className="text-sm font-semibold" style={{ color: COLORS.orange }}>Voir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Chercheurs (Admin) ---------- */

const CHERCHEURS_ADMIN_INITIAL = [
  { id: "ch1", nom: "Moussa Diop", photo: "https://randomuser.me/api/portraits/men/8.jpg", metier: "Électricien bâtiment", ville: "Dakar", date: "12/06/2025", statut: "Actif", email: "moussa.diop@email.sn", telephone: "+221 77 123 45 67", naissance: "15/03/1992", genre: "Homme", experience: "8 ans d'expérience", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d'équipe", "Habilitation B2V"], inscritLe: "12/06/2025", derniereConnexion: "25/08/2026", candidatures: [{ title: "Chef d'équipe électricité", sub: "Senegal Construction", badge: "En cours" }, { title: "Technicien maintenance", sub: "Dakar Services", badge: "Retenu" }, { title: "Électricien chantier", sub: "Mbour Construction", badge: "Rejeté" }], formations: [{ title: "Sécurité Électrique", badge: "Certifié" }, { title: "Lecture de plans BTP", badge: "En cours d'apprentissage" }] },
  { id: "ch2", nom: "Fatou Sarr", photo: "https://randomuser.me/api/portraits/women/8.jpg", metier: "Plombière sanitaire", ville: "Thiès", date: "14/08/2025", statut: "En attente", email: "fatou.sarr@email.sn", telephone: "+221 76 234 56 78", naissance: "02/07/1995", genre: "Femme", experience: "5 ans d'expérience", competences: ["Plomberie sanitaire", "Diagnostic de panne"], inscritLe: "14/08/2025", derniereConnexion: "20/08/2026", candidatures: [{ title: "Plombier qualifié", sub: "Diallo & Fils", badge: "En cours" }], formations: [] },
  { id: "ch3", nom: "Ibrahima Diallo", photo: "https://randomuser.me/api/portraits/men/19.jpg", metier: "Soudeur industriel", ville: "Saint-Louis", date: "20/09/2025", statut: "Actif", email: "ibrahima.diallo@email.sn", telephone: "+221 78 345 67 89", naissance: "22/11/1990", genre: "Homme", experience: "6 ans d'expérience", competences: ["Soudure TIG", "Soudure MIG"], inscritLe: "20/09/2025", derniereConnexion: "23/08/2026", candidatures: [{ title: "Technicien maintenance", sub: "Dakar Services Pro", badge: "Retenu" }], formations: [{ title: "Soudure TIG-MIG", badge: "Certifié" }] },
  { id: "ch4", nom: "Aminata Ndiaye", photo: "https://randomuser.me/api/portraits/women/19.jpg", metier: "Couturière", ville: "Dakar", date: "03/11/2025", statut: "Vérifié", email: "aminata.ndiaye@email.sn", telephone: "+221 77 456 78 90", naissance: "10/01/1988", genre: "Femme", experience: "10 ans d'expérience", competences: ["Couture sur mesure", "Gestion d'atelier"], inscritLe: "03/11/2025", derniereConnexion: "22/08/2026", candidatures: [{ title: "Couturière atelier", sub: "Atelier Couture", badge: "Rejeté" }], formations: [] },
  { id: "ch5", nom: "Ousmane Ba", photo: "https://randomuser.me/api/portraits/men/27.jpg", metier: "Menuisier ébéniste", ville: "Kaolack", date: "18/01/2026", statut: "Suspendu", email: "ousmane.ba@email.sn", telephone: "+221 76 567 89 01", naissance: "05/05/1993", genre: "Homme", experience: "4 ans d'expérience", competences: ["Menuiserie", "Ébénisterie"], inscritLe: "18/01/2026", derniereConnexion: "10/06/2026", candidatures: [{ title: "Menuisier ébéniste", sub: "Ndiaye Menuiserie", badge: "En cours" }], formations: [] },
  { id: "ch6", nom: "Mariama Tall", photo: "https://randomuser.me/api/portraits/women/27.jpg", metier: "Carreleur", ville: "Rufisque", date: "25/03/2026", statut: "Actif", email: "mariama.tall@email.sn", telephone: "+221 78 678 90 12", naissance: "18/09/1994", genre: "Femme", experience: "4 ans d'expérience", competences: ["Pose de carrelage", "Finitions"], inscritLe: "25/03/2026", derniereConnexion: "21/08/2026", candidatures: [{ title: "Carreleur intérieur", sub: "Senegal Construction", badge: "Nouveau" }], formations: [] },
  { id: "ch7", nom: "Abdoulaye Sow", photo: "https://randomuser.me/api/portraits/men/38.jpg", metier: "Peintre bâtiment", ville: "Ziguinchor", date: "10/05/2026", statut: "Nouveau", email: "abdoulaye.sow@email.sn", telephone: "+221 77 789 01 23", naissance: "30/12/1996", genre: "Homme", experience: "3 ans d'expérience", competences: ["Peinture intérieure/extérieure", "Enduits"], inscritLe: "10/05/2026", derniereConnexion: "19/08/2026", candidatures: [{ title: "Peintre bâtiment", sub: "Rufisque Bâtiment", badge: "En cours" }], formations: [] },
  { id: "ch8", nom: "Aissatou Gueye", photo: "https://randomuser.me/api/portraits/women/38.jpg", metier: "Électricienne", ville: "Mbour", date: "02/07/2026", statut: "En attente", email: "aissatou.gueye@email.sn", telephone: "+221 76 890 12 34", naissance: "14/02/1991", genre: "Femme", experience: "7 ans d'expérience", competences: ["Normes NF C 15-100", "Management d'équipe", "Habilitation B2V"], inscritLe: "02/07/2026", derniereConnexion: "24/08/2026", candidatures: [{ title: "Électricien chantier", sub: "Thiès Électrique", badge: "Nouveau" }], formations: [] },
];

function ChercheursAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail du profil</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez le profil de ce chercheur d'emploi</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Profil du chercheur</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <SafeImg src={row.photo} alt={row.nom} className="w-14 h-14 rounded-full object-cover mb-2" />
            <p className="font-bold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.metier} · {row.ville}</p>
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="Email" value={row.email} /><div className="h-2" />
          <Row label="Date de naissance" value={row.naissance} /><div className="h-2" />
          <Row label="Genre" value={row.genre} /><div className="h-2" />
          <Row label="Expérience" value={row.experience} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>)}
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
      title="Chercheurs d'emploi"
      subtitle="Gérez et suivez les profils des chercheurs d'emploi inscrits sur LIGGEEY"
      initialData={CHERCHEURS_ADMIN_INITIAL}
      searchKeys={["nom", "metier", "ville"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Vérifié", "Suspendu", "Nouveau"], matcher: (r, v) => r.statut === v },
        { key: "profil", label: "Tous les profils", options: ["Essentiel", "Premium"], matcher: (r, v) => adminTier(r.nom, "chercheur") === v },
      ]}
      columns={[
        { key: "nom", label: "Utilisateur", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} photo={r.photo} /> },
        { key: "profil", label: "Profil", flex: 1, render: (r) => <TierBadge premium={adminTier(r.nom, "chercheur") === "Premium"} size="sm" /> },
        { key: "ville", label: "Localisation", flex: 1 },
        { key: "date", label: "Date d'inscription", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={ChercheursAdminDetail}
    />
  );
}

/* ---------- Prestataires (Admin) ---------- */

const PRESTATAIRES_ADMIN_INITIAL = [
  { id: "pa1", nom: "Cheikh Fall", photo: "https://randomuser.me/api/portraits/men/52.jpg", metier: "Électricité générale", ville: "Dakar", missions: 47, note: 4.8, statut: "Vérifié", telephone: "+221 76 543 21 09", email: "cheikh.fall@email.sn", ninea: "12345678", anneesActivite: "12 ans", competences: ["Installation électrique", "Dépannage", "Câblage industriel"], inscritLe: "18/02/2026", derniereConnexion: "24/08/2026", missionsRecentes: [{ title: "Installation de tableau de bord", sub: "Senegal Construction", badge: "Terminée" }, { title: "Dépannage réseau triphasé", sub: "Particulier (Plateau)", badge: "En cours" }, { title: "Rénovation électrique complète", sub: "Thiès Électrique", badge: "Terminée" }], avis: [{ title: "Alassane Diop", sub: "Travail très soigné, ponctuel et respectueux des normes.", value: "★ 5.0" }, { title: "Mariama Ndiaye", sub: "Installation rapide et efficace de nos nouveaux luminaires.", value: "★ 4.5" }] },
  { id: "pa2", nom: "Awa Diallo", photo: "https://randomuser.me/api/portraits/women/9.jpg", metier: "Plomberie", ville: "Thiès", missions: 32, note: 4.6, statut: "Actif", telephone: "+221 77 123 98 76", email: "awa.diallo@email.sn", ninea: "23456789", anneesActivite: "6 ans", competences: ["Plomberie sanitaire"], inscritLe: "10/03/2026", derniereConnexion: "20/08/2026", missionsRecentes: [{ title: "Installation sanitaire", sub: "Particulier", badge: "Terminée" }], avis: [{ title: "Cheikh Ba", sub: "Très efficace.", value: "★ 5.0" }] },
  { id: "pa3", nom: "Mamadou Sy", photo: "https://randomuser.me/api/portraits/men/9.jpg", metier: "Maçonnerie", ville: "Dakar", missions: 65, note: 4.9, statut: "Vérifié", telephone: "+221 78 234 56 78", email: "mamadou.sy@email.sn", ninea: "34567890", anneesActivite: "15 ans", competences: ["Maçonnerie générale", "Fondations"], inscritLe: "05/01/2026", derniereConnexion: "25/08/2026", missionsRecentes: [{ title: "Construction villa", sub: "Modou Fall", badge: "En cours" }], avis: [{ title: "Awa Ndiaye", sub: "Excellent maçon.", value: "★ 5.0" }] },
  { id: "pa4", nom: "Ndèye Fatou Mbaye", photo: "https://randomuser.me/api/portraits/women/15.jpg", metier: "Couture/Textile", ville: "Kaolack", missions: 28, note: 4.7, statut: "Actif", telephone: "+221 76 345 67 89", email: "ndeye.mbaye@email.sn", ninea: "45678901", anneesActivite: "9 ans", competences: ["Couture sur mesure"], inscritLe: "12/02/2026", derniereConnexion: "18/08/2026", missionsRecentes: [], avis: [] },
  { id: "pa5", nom: "Alioune Ndiaye", photo: "https://randomuser.me/api/portraits/men/15.jpg", metier: "Menuiserie", ville: "Saint-Louis", missions: 41, note: 4.5, statut: "En attente", telephone: "+221 77 456 78 90", email: "alioune.ndiaye@email.sn", ninea: "56789012", anneesActivite: "10 ans", competences: ["Menuiserie", "Ébénisterie"], inscritLe: "20/04/2026", derniereConnexion: "15/08/2026", missionsRecentes: [], avis: [] },
  { id: "pa6", nom: "Sokhna Dieng", photo: "https://randomuser.me/api/portraits/women/26.jpg", metier: "Peinture", ville: "Dakar", missions: 19, note: 4.3, statut: "Nouveau", telephone: "+221 78 567 89 01", email: "sokhna.dieng@email.sn", ninea: "67890123", anneesActivite: "3 ans", competences: ["Peinture intérieure"], inscritLe: "01/07/2026", derniereConnexion: "22/08/2026", missionsRecentes: [], avis: [] },
  { id: "pa7", nom: "Babacar Faye", photo: "https://randomuser.me/api/portraits/men/26.jpg", metier: "Carrelage", ville: "Rufisque", missions: 53, note: 4.8, statut: "Vérifié", telephone: "+221 76 678 90 12", email: "babacar.faye@email.sn", ninea: "78901234", anneesActivite: "11 ans", competences: ["Pose de carrelage"], inscritLe: "15/01/2026", derniereConnexion: "23/08/2026", missionsRecentes: [], avis: [] },
  { id: "pa8", nom: "Khady Thiam", photo: "https://randomuser.me/api/portraits/women/34.jpg", metier: "Électricité", ville: "Mbour", missions: 22, note: 4.4, statut: "Suspendu", telephone: "+221 77 789 01 23", email: "khady.thiam@email.sn", ninea: "89012345", anneesActivite: "5 ans", competences: ["Électricité domestique"], inscritLe: "08/03/2026", derniereConnexion: "01/07/2026", missionsRecentes: [], avis: [] },
];

function PrestatairesAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail du prestataire</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez le profil de ce prestataire de services</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Profil du prestataire</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <SafeImg src={row.photo} alt={row.nom} className="w-14 h-14 rounded-full object-cover mb-2" />
            <p className="font-bold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.metier} · {row.ville}</p>
            <Stars note={Math.round(row.note)} size={13} />
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="Email" value={row.email} /><div className="h-2" />
          <Row label="NINEA" value={row.ninea} /><div className="h-2" />
          <Row label="Années d'activité" value={row.anneesActivite} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>)}
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
      subtitle="Gérez et suivez les prestataires de services inscrits sur LIGGEEY"
      initialData={PRESTATAIRES_ADMIN_INITIAL}
      searchKeys={["nom", "metier", "ville"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Vérifié", "Suspendu", "Nouveau"], matcher: (r, v) => r.statut === v }, { key: "profil", label: "Tous les profils", options: ["Essentiel", "Premium"], matcher: (r, v) => adminTier(r.nom, "prestataire") === v }]}
      columns={[
        { key: "nom", label: "Prestataire", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} photo={r.photo} /> },
        { key: "profil", label: "Profil", flex: 1, render: (r) => <TierBadge premium={adminTier(r.nom, "prestataire") === "Premium"} size="sm" /> },
        { key: "ville", label: "Localisation", flex: 1 },
        { key: "missions", label: "Missions", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.missions} missions</span> },
        { key: "note", label: "Note", flex: 1, render: (r) => <span className="text-sm font-semibold" style={{ color: COLORS.orange }}>★ {r.note}</span> },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={PrestatairesAdminDetail}
    />
  );
}

/* ---------- Entreprises (Admin) ---------- */

const ENTREPRISES_ADMIN_INITIAL = [
  { id: "ea1", nom: "Senegal Construction SARL", secteur: "BTP", ville: "Dakar", offresActives: 12, employes: "45-50 emp.", statut: "Actif", ninea: "2938472 2G3", rccm: "SN-DKR-2008-B-1120", telephone: "+221 33 821 45 67", email: "contact@senegalconstruct.sn", siteWeb: "www.senegalconstruct.sn", secteurs: ["BTP", "Électricité", "Plomberie", "Maçonnerie"], inscritLe: "10/01/2026", derniereActivite: "26/08/2026", offresListe: [{ title: "Chef d'équipe électricité", value: "5 candidatures" }, { title: "Maçon qualifié", value: "12 candidatures" }, { title: "Plombier chantier", value: "3 candidatures" }], recrutements: [{ title: "Moussa Diop", sub: "Embauché le 20/08/2026" }, { title: "Fatou Sarr", sub: "Embauchée le 15/07/2026" }] },
  { id: "ea2", nom: "Thiès Électrique", secteur: "Électricité", ville: "Thiès", offresActives: 5, employes: "15-20 emp.", statut: "Vérifié", ninea: "1122334 4G5", rccm: "SN-THS-2015-B-0234", telephone: "+221 33 951 23 45", email: "contact@thieselectrique.sn", siteWeb: "www.thieselectrique.sn", secteurs: ["Électricité"], inscritLe: "22/05/2025", derniereActivite: "20/08/2026", offresListe: [], recrutements: [] },
  { id: "ea3", nom: "Diallo & Fils Plomberie", secteur: "Plomberie", ville: "Saint-Louis", offresActives: 3, employes: "8-10 emp.", statut: "Actif", ninea: "5566778 8G9", rccm: "SN-STL-2012-B-0456", telephone: "+221 33 961 34 56", email: "contact@dialloplomberie.sn", siteWeb: "", secteurs: ["Plomberie"], inscritLe: "14/03/2024", derniereActivite: "18/08/2026", offresListe: [], recrutements: [] },
  { id: "ea4", nom: "Ndiaye Menuiserie", secteur: "Menuiserie", ville: "Kaolack", offresActives: 7, employes: "20-25 emp.", statut: "En attente", ninea: "9900112 2G3", rccm: "SN-KLK-2018-B-0678", telephone: "+221 33 941 45 67", email: "contact@ndiayemenuiserie.sn", siteWeb: "", secteurs: ["Menuiserie"], inscritLe: "05/06/2026", derniereActivite: "10/08/2026", offresListe: [], recrutements: [] },
  { id: "ea5", nom: "Dakar Services Pro", secteur: "Multi-services", ville: "Dakar", offresActives: 15, employes: "100+ emp.", statut: "Vérifié", ninea: "3344556 6G7", rccm: "SN-DKR-2010-B-0890", telephone: "+221 33 823 56 78", email: "contact@dakarservicespro.sn", siteWeb: "www.dakarservicespro.sn", secteurs: ["Multi-services"], inscritLe: "01/02/2024", derniereActivite: "26/08/2026", offresListe: [], recrutements: [] },
  { id: "ea6", nom: "Mbour Construction", secteur: "BTP", ville: "Mbour", offresActives: 4, employes: "30-35 emp.", statut: "Nouveau", ninea: "7788990 0G1", rccm: "SN-MBR-2023-B-0123", telephone: "+221 33 957 67 89", email: "contact@mbourconstruction.sn", siteWeb: "", secteurs: ["BTP"], inscritLe: "15/07/2026", derniereActivite: "24/08/2026", offresListe: [], recrutements: [] },
  { id: "ea7", nom: "Atelier Couture Nationale", secteur: "Textile", ville: "Dakar", offresActives: 6, employes: "12-15 emp.", statut: "Actif", ninea: "1234567 8G9", rccm: "SN-DKR-2016-B-0345", telephone: "+221 33 825 78 90", email: "contact@ateliercouture.sn", siteWeb: "", secteurs: ["Textile"], inscritLe: "10/09/2025", derniereActivite: "19/08/2026", offresListe: [], recrutements: [] },
  { id: "ea8", nom: "Rufisque Bâtiment", secteur: "BTP", ville: "Rufisque", offresActives: 8, employes: "25-30 emp.", statut: "Suspendu", ninea: "2233445 5G6", rccm: "SN-RFQ-2014-B-0567", telephone: "+221 33 836 89 01", email: "contact@rufisquebatiment.sn", siteWeb: "", secteurs: ["BTP"], inscritLe: "18/11/2024", derniereActivite: "02/07/2026", offresListe: [], recrutements: [] },
];

function EntreprisesAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail de l'entreprise</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez le profil de cette entreprise</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Profil de l'entreprise</h3>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-14 h-14 rounded-md flex items-center justify-center text-sm font-semibold mb-2" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(row.nom)}</div>
            <p className="font-bold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.secteur} · {row.ville}</p>
          </div>
          <Row label="NINEA" value={row.ninea} /><div className="h-2" />
          <Row label="RCCM" value={row.rccm} /><div className="h-2" />
          <Row label="Taille" value={row.employes} /><div className="h-2" />
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="Email" value={row.email} />
          {row.siteWeb && <><div className="h-2" /><Row label="Site web" value={row.siteWeb} /></>}
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Secteurs d'activité</p>
          <div className="flex flex-wrap gap-1.5">
            {row.secteurs.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.softStrong, color: COLORS.slate }}>{c}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut du compte entreprise" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Inscrit le", value: row.inscritLe }, { label: "Dernière activité", value: row.derniereActivite }]} />
          <AdminSubListCard title={`Offres d'emploi actives (${row.offresListe.length})`} items={row.offresListe} />
          <AdminSubListCard title={`Recrutements récents (${row.recrutements.length})`} items={row.recrutements} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendu" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendu" ? "Actif" : "Suspendu" })} />
        <ActionButton label="Vérifier l'entreprise" variant="primary" onClick={() => update({ statut: "Vérifié" })} />
      </div>
    </div>
  );
}

function EntreprisesAdminScreen() {
  return (
    <AdminEntityModule
      title="Entreprises"
      subtitle="Gérez et suivez les entreprises et recruteurs inscrits sur LIGGEEY"
      initialData={ENTREPRISES_ADMIN_INITIAL}
      searchKeys={["nom", "secteur", "ville"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Vérifié", "Suspendu", "Nouveau"], matcher: (r, v) => r.statut === v }, { key: "profil", label: "Tous les profils", options: ["Essentiel", "Premium"], matcher: (r, v) => adminTier(r.nom, "entreprise") === v }]}
      columns={[
        { key: "nom", label: "Entreprise", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.secteur} /> },
        { key: "profil", label: "Profil", flex: 1, render: (r) => <TierBadge premium={adminTier(r.nom, "entreprise") === "Premium"} size="sm" /> },
        { key: "ville", label: "Localisation", flex: 1 },
        { key: "offresActives", label: "Offres actives", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.offresActives} offres</span> },
        { key: "employes", label: "Employés", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={EntreprisesAdminDetail}
    />
  );
}

/* ---------- Offres (Admin) ---------- */

const OFFRES_ADMIN_INITIAL = [
  { id: "oa1", titre: "Chef d'équipe électricité", entreprise: "Senegal Construction SARL", secteur: "BTP & Construction", candidatures: 5, date: "15/07/2026", statut: "Active", localisation: "Dakar, Plateau", contrat: "CDI", experience: "5+ ans", salaire: "350 000 - 450 000 FCFA/mois", description: "Nous recherchons un Chef d'équipe électricité expérimenté pour superviser nos chantiers de construction résidentiels et tertiaires à Dakar. Vous serez responsable de la gestion d'une équipe d'électriciens, de la planification des travaux et du respect rigoureux des consignes de sécurité sur le terrain.", competences: ["Normes NF C 15-100", "Management d'équipe", "Lecture de plans", "Câblage industriel"], publieeLe: "15/07/2026", expireLe: "15/09/2026", candidatsRecents: [{ title: "Moussa Diop", sub: "Électricien bâtiment", badge: "En cours" }, { title: "Fatou Sarr", sub: "Plombière sanitaire", badge: "Retenu" }, { title: "Ibrahima Diallo", sub: "Soudeur industriel", badge: "Rejeté" }] },
  { id: "oa2", titre: "Plombier qualifié", entreprise: "Diallo & Fils", secteur: "Plomberie", candidatures: 8, date: "10/07/2026", statut: "Active", localisation: "Saint-Louis", contrat: "CDD", experience: "2-5 ans", salaire: "200 000 - 250 000 FCFA/mois", description: "Poste de plombier qualifié pour l'entretien et l'installation de systèmes sanitaires.", competences: ["Plomberie sanitaire"], publieeLe: "10/07/2026", expireLe: "10/09/2026", candidatsRecents: [] },
  { id: "oa3", titre: "Menuisier ébéniste", entreprise: "Ndiaye Menuiserie", secteur: "Menuiserie", candidatures: 12, date: "05/07/2026", statut: "Active", localisation: "Kaolack", contrat: "CDI", experience: "5+ ans", salaire: "280 000 - 320 000 FCFA/mois", description: "Fabrication de mobilier sur mesure.", competences: ["Menuiserie", "Ébénisterie"], publieeLe: "05/07/2026", expireLe: "05/09/2026", candidatsRecents: [] },
  { id: "oa4", titre: "Technicien maintenance", entreprise: "Dakar Services Pro", secteur: "Multi-services", candidatures: 3, date: "01/07/2026", statut: "En révision", localisation: "Dakar", contrat: "CDI", experience: "3-5 ans", salaire: "250 000 FCFA/mois", description: "Maintenance générale de bâtiments tertiaires.", competences: ["Maintenance générale"], publieeLe: "01/07/2026", expireLe: "01/09/2026", candidatsRecents: [] },
  { id: "oa5", titre: "Maçon qualifié", entreprise: "Mbour Construction", secteur: "BTP", candidatures: 15, date: "25/06/2026", statut: "Active", localisation: "Mbour", contrat: "CDD", experience: "3-8 ans", salaire: "250 000 - 300 000 FCFA/mois", description: "Travaux de maçonnerie générale sur chantiers résidentiels.", competences: ["Maçonnerie", "Fondations"], publieeLe: "25/06/2026", expireLe: "25/08/2026", candidatsRecents: [] },
  { id: "oa6", titre: "Électricien chantier", entreprise: "Thiès Électrique", secteur: "Électricité", candidatures: 0, date: "20/06/2026", statut: "Expirée", localisation: "Thiès", contrat: "CDD", experience: "1-3 ans", salaire: "180 000 FCFA/mois", description: "Installation électrique sur chantier.", competences: ["Électricité de base"], publieeLe: "20/06/2026", expireLe: "20/08/2026", candidatsRecents: [] },
  { id: "oa7", titre: "Peintre bâtiment", entreprise: "Rufisque Bâtiment", secteur: "BTP", candidatures: 7, date: "15/06/2026", statut: "Suspendue", localisation: "Rufisque", contrat: "CDD", experience: "1-3 ans", salaire: "180 000 - 220 000 FCFA/mois", description: "Travaux de peinture sur chantiers résidentiels.", competences: ["Peinture", "Enduits"], publieeLe: "15/06/2026", expireLe: "15/08/2026", candidatsRecents: [] },
  { id: "oa8", titre: "Carreleur intérieur", entreprise: "Senegal Construction", secteur: "BTP", candidatures: 4, date: "10/06/2026", statut: "Active", localisation: "Dakar", contrat: "CDD", experience: "2-4 ans", salaire: "230 000 FCFA/mois", description: "Pose de carrelage sur chantiers résidentiels.", competences: ["Pose de carrelage"], publieeLe: "10/06/2026", expireLe: "10/08/2026", candidatsRecents: [] },
];

function OffresAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.slate }}>Détail de l'offre</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez et gérez cette offre d'emploi</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(row.entreprise)}</div>
              <div>
                <p className="font-bold" style={{ color: COLORS.slate }}>{row.titre}</p>
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
              {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>)}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut de l'offre" rows={[{ label: "Statut actuel", value: row.statut, badge: true }, { label: "Publiée le", value: row.publieeLe }, { label: "Expire le", value: row.expireLe }]} />
          <AdminSubListCard title={`Candidatures récentes (${row.candidatsRecents.length})`} items={row.candidatsRecents} />
        </div>
      </div>
      <div className="flex gap-3">
        <ActionButton label="Supprimer" variant="danger" onClick={remove} />
        <ActionButton label={row.statut === "Suspendue" ? "Réactiver" : "Suspendre"} variant="warning" onClick={() => update({ statut: row.statut === "Suspendue" ? "Active" : "Suspendue" })} />
        <ActionButton label="Valider l'offre" variant="primary" onClick={() => update({ statut: "Active" })} />
      </div>
    </div>
  );
}

function OffresAdminScreen() {
  return (
    <AdminEntityModule
      title="Offres d'emploi"
      subtitle="Gérez toutes les offres d'emploi publiées sur la plateforme LIGGEEY"
      initialData={OFFRES_ADMIN_INITIAL}
      searchKeys={["titre", "entreprise", "secteur"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Active", "En révision", "Expirée", "Suspendue"], matcher: (r, v) => r.statut === v },
        { key: "secteur", label: "Tous les secteurs", options: Array.from(new Set(OFFRES_ADMIN_INITIAL.map((o) => o.secteur))), matcher: (r, v) => r.secteur === v },
      ]}
      columns={[
        { key: "titre", label: "Offre", flex: 2, render: (r) => <IdentityCell nom={r.titre} sub={r.entreprise} /> },
        { key: "secteur", label: "Secteur", flex: 1 },
        { key: "candidatures", label: "Candidatures", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.candidatures} candidatures</span> },
        { key: "date", label: "Date de publication", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={OffresAdminDetail}
    />
  );
}

/* ---------- Formations (Admin) ---------- */

const FORMATIONS_ADMIN_INITIAL = [
  { id: "fa1", nom: "Sécurité Électrique", organisme: "CNEAP Dakar", categorie: "Sécurité", inscrits: 45, duree: "40h", statut: "Active", niveau: "Intermédiaire", tarif: "75 000 FCFA", description: "Cette formation qualifiante est spécifiquement conçue pour sensibiliser et former les électriciens professionnels aux dangers inhérents aux chantiers. Elle couvre l'ensemble des protocoles de sécurité requis en habilitation électrique B2V, ainsi que la gestion des situations d'urgence.", prerequis: ["Expérience électricité", "Habilitation B2V"], enCoursApprentissage: 38, certificatsDelivres: 7, dernieresInscriptions: [{ title: "Moussa Diop", sub: "Inscrit le 12/08/2026", badge: "Apprenant" }, { title: "Fatou Sarr", sub: "Inscrit le 14/08/2026", badge: "Apprenant" }, { title: "Ibrahima Diallo", sub: "Inscrit le 15/08/2026", badge: "Apprenant" }] },
  { id: "fa2", nom: "Lecture de plans BTP", organisme: "Institut BTP", categorie: "Technique", inscrits: 32, duree: "24h", statut: "Active", niveau: "Débutant", tarif: "50 000 FCFA", description: "Apprendre à lire et interpréter des plans de construction BTP.", prerequis: [], enCoursApprentissage: 20, certificatsDelivres: 12, dernieresInscriptions: [] },
  { id: "fa3", nom: "Normes NF C 15-100", organisme: "CNEAP Dakar", categorie: "Réglementation", inscrits: 28, duree: "16h", statut: "Active", niveau: "Intermédiaire", tarif: "45 000 FCFA", description: "Maîtriser les normes électriques françaises appliquées au Sénégal.", prerequis: ["Expérience électricité"], enCoursApprentissage: 18, certificatsDelivres: 10, dernieresInscriptions: [] },
  { id: "fa4", nom: "Plomberie sanitaire", organisme: "Centre Formation Thiès", categorie: "Plomberie", inscrits: 18, duree: "32h", statut: "Complète", niveau: "Débutant", tarif: "60 000 FCFA", description: "Formation complète en plomberie sanitaire résidentielle.", prerequis: [], enCoursApprentissage: 18, certificatsDelivres: 0, dernieresInscriptions: [] },
  { id: "fa5", nom: "Soudure TIG-MIG", organisme: "CNEAP Dakar", categorie: "Technique", inscrits: 22, duree: "48h", statut: "Active", niveau: "Avancé", tarif: "90 000 FCFA", description: "Techniques avancées de soudure TIG et MIG.", prerequis: ["Expérience soudure"], enCoursApprentissage: 15, certificatsDelivres: 7, dernieresInscriptions: [] },
  { id: "fa6", nom: "Gestion de chantier", organisme: "Institut BTP", categorie: "Management", inscrits: 15, duree: "20h", statut: "Brouillon", niveau: "Intermédiaire", tarif: "65 000 FCFA", description: "Piloter un chantier de construction de bout en bout.", prerequis: [], enCoursApprentissage: 0, certificatsDelivres: 0, dernieresInscriptions: [] },
  { id: "fa7", nom: "Menuiserie avancée", organisme: "Centre Artisanat", categorie: "Menuiserie", inscrits: 12, duree: "36h", statut: "Active", niveau: "Avancé", tarif: "70 000 FCFA", description: "Techniques avancées de menuiserie et ébénisterie.", prerequis: ["Bases menuiserie"], enCoursApprentissage: 10, certificatsDelivres: 2, dernieresInscriptions: [] },
  { id: "fa8", nom: "Peinture décorative", organisme: "Centre Artisanat", categorie: "Peinture", inscrits: 8, duree: "16h", statut: "Suspendue", niveau: "Débutant", tarif: "35 000 FCFA", description: "Techniques de peinture décorative et finitions.", prerequis: [], enCoursApprentissage: 0, certificatsDelivres: 0, dernieresInscriptions: [] },
];

function FormationsAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail de la formation</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6 mt-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: COLORS.orangeSoft }}><GraduationCap size={18} color={COLORS.orange} /></div>
            <div>
              <p className="font-bold" style={{ color: COLORS.slate }}>{row.nom}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>Organisme : {row.organisme} · Niveau {row.niveau}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Row label="Catégorie" value={row.categorie} />
            <Row label="Durée" value={row.duree} />
            <Row label="Tarif d'inscription" value={row.tarif} />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Description de la formation</p>
          <p className="text-sm mb-4" style={{ color: COLORS.slate }}>{row.description}</p>
          {row.prerequis.length > 0 && (
            <>
              <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.slateLight }}>Prérequis recommandés</p>
              <div className="flex flex-wrap gap-1.5">
                {row.prerequis.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>)}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <AdminInfoCard title="Statut opérationnel" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Inscrits totaux", value: `${row.inscrits} apprenants` }, { label: "En cours d'apprentissage", value: `${row.enCoursApprentissage} apprenants` }, { label: "Certificats délivrés", value: `${row.certificatsDelivres} diplômés` }]} />
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
      subtitle="Gérez le catalogue de formations disponibles sur LIGGEEY"
      initialData={FORMATIONS_ADMIN_INITIAL}
      searchKeys={["nom", "organisme", "categorie"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Active", "Complète", "Brouillon", "Suspendue"], matcher: (r, v) => r.statut === v },
        { key: "categorie", label: "Toutes les catégories", options: Array.from(new Set(FORMATIONS_ADMIN_INITIAL.map((f) => f.categorie))), matcher: (r, v) => r.categorie === v },
      ]}
      columns={[
        { key: "nom", label: "Formation", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.organisme} /> },
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
  { id: "ma1", nom: "Cheikh Fall", photo: "https://randomuser.me/api/portraits/men/52.jpg", metier: "Électricien", mentoresActifs: 3, specialite: "Électricité générale", note: 4.9, statut: "Actif", telephone: "+221 77 654 32 10", email: "cheikh.fall@email.sn", experience: "12 ans d'expérience", ninea: "1234567 2G3", competences: ["Installation électrique", "Dépannage rapide", "Câblage industriel"], certifications: [{ title: "Habilitation électrique B2V", badge: "Validé" }, { title: "Sécurité sur chantier BTP", badge: "Validé" }], totalAccompagnes: 5, membresActuels: [{ title: "Moussa Diop", sub: "Depuis le 01/06/2026", badge: "Mentoré" }, { title: "Abdoulaye Sow", sub: "Depuis le 15/07/2026", badge: "Mentoré" }, { title: "Aissatou Gueye", sub: "Depuis le 01/08/2026", badge: "Mentoré" }] },
  { id: "ma2", nom: "Mamadou Sy", photo: "https://randomuser.me/api/portraits/men/9.jpg", metier: "Maçon", mentoresActifs: 5, specialite: "Maçonnerie", note: 4.8, statut: "Actif", telephone: "+221 78 765 43 21", email: "mamadou.sy@email.sn", experience: "15 ans d'expérience", ninea: "2345678 3G4", competences: ["Maçonnerie générale"], certifications: [], totalAccompagnes: 8, membresActuels: [] },
  { id: "ma3", nom: "Awa Diallo", photo: "https://randomuser.me/api/portraits/women/9.jpg", metier: "Plombière", mentoresActifs: 2, specialite: "Plomberie", note: 4.7, statut: "Actif", telephone: "+221 76 876 54 32", email: "awa.diallo@email.sn", experience: "9 ans d'expérience", ninea: "3456789 4G5", competences: ["Plomberie sanitaire"], certifications: [], totalAccompagnes: 4, membresActuels: [] },
  { id: "ma4", nom: "Babacar Faye", photo: "https://randomuser.me/api/portraits/men/26.jpg", metier: "Carreleur", mentoresActifs: 4, specialite: "Carrelage", note: 4.6, statut: "Actif", telephone: "+221 77 987 65 43", email: "babacar.faye@email.sn", experience: "11 ans d'expérience", ninea: "4567890 5G6", competences: ["Pose de carrelage"], certifications: [], totalAccompagnes: 6, membresActuels: [] },
  { id: "ma5", nom: "Ndèye Mbaye", photo: "https://randomuser.me/api/portraits/women/15.jpg", metier: "Couturière", mentoresActifs: 1, specialite: "Couture", note: 4.5, statut: "En attente", telephone: "+221 78 098 76 54", email: "ndeye.mbaye@email.sn", experience: "9 ans d'expérience", ninea: "5678901 6G7", competences: ["Couture sur mesure"], certifications: [], totalAccompagnes: 1, membresActuels: [] },
  { id: "ma6", nom: "Alioune Ndiaye", photo: "https://randomuser.me/api/portraits/men/15.jpg", metier: "Menuisier", mentoresActifs: 3, specialite: "Menuiserie", note: 4.4, statut: "Inactif", telephone: "+221 76 109 87 65", email: "alioune.ndiaye@email.sn", experience: "10 ans d'expérience", ninea: "6789012 7G8", competences: ["Menuiserie"], certifications: [], totalAccompagnes: 5, membresActuels: [] },
  { id: "ma7", nom: "Sokhna Dieng", photo: "https://randomuser.me/api/portraits/women/26.jpg", metier: "Peintre", mentoresActifs: 2, specialite: "Peinture", note: 4.3, statut: "Actif", telephone: "+221 77 210 98 76", email: "sokhna.dieng@email.sn", experience: "3 ans d'expérience", ninea: "7890123 8G9", competences: ["Peinture intérieure"], certifications: [], totalAccompagnes: 2, membresActuels: [] },
  { id: "ma8", nom: "Khady Thiam", photo: "https://randomuser.me/api/portraits/women/34.jpg", metier: "Électricienne", mentoresActifs: 0, specialite: "Électricité", note: 0, statut: "En attente", telephone: "+221 78 321 09 87", email: "khady.thiam@email.sn", experience: "5 ans d'expérience", ninea: "8901234 9G0", competences: ["Électricité domestique"], certifications: [], totalAccompagnes: 0, membresActuels: [] },
];

function MentoratAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail du mentor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4 mb-6 mt-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex flex-col items-center text-center mb-4">
            <SafeImg src={row.photo} alt={row.nom} className="w-14 h-14 rounded-full object-cover mb-2" />
            <p className="font-bold" style={{ color: COLORS.slate }}>{row.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.specialite} · {row.metier}</p>
            {row.note > 0 && <Stars note={Math.round(row.note)} size={13} />}
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="Email" value={row.email} /><div className="h-2" />
          <Row label="Expérience professionnelle" value={row.experience} /><div className="h-2" />
          <Row label="NINEA" value={row.ninea} />
          <p className="text-xs font-semibold mt-4 mb-2" style={{ color: COLORS.slateLight }}>Compétences</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>)}
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
          <AdminInfoCard title="Statut Mentor" rows={[{ label: "Statut", value: row.statut, badge: true }, { label: "Mentorés actifs", value: `${row.mentoresActifs} apprenants` }, { label: "Total accompagnés", value: `${row.totalAccompagnes} professionnels` }]} />
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
      subtitle="Gérez les mentors et relations de mentorat sur LIGGEEY"
      initialData={MENTORAT_ADMIN_INITIAL}
      searchKeys={["nom", "metier", "specialite"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Actif", "En attente", "Inactif"], matcher: (r, v) => r.statut === v }]}
      columns={[
        { key: "nom", label: "Mentor", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} photo={r.photo} /> },
        { key: "mentoresActifs", label: "Mentorés actifs", flex: 1, render: (r) => <span className="text-sm" style={{ color: COLORS.slate }}>{r.mentoresActifs} mentorés</span> },
        { key: "specialite", label: "Spécialité", flex: 1 },
        { key: "note", label: "Note globale", flex: 1, render: (r) => <span className="text-sm font-semibold" style={{ color: COLORS.orange }}>★ {r.note}/5</span> },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={MentoratAdminDetail}
    />
  );
}

/* ---------- Services (Admin) ---------- */

const SERVICES_ADMIN_INITIAL = [
  { id: "sa1", prestataire: "Moussa Diop", service: "Plomberie générale", categorie: "Plomberie", tarif: "15 000 FCFA/h", statut: "Actif", date: "12/04/2026", metier: "Plombier qualifié", experience: "5 ans d'expérience", description: "Service complet d'installation, de réparation et de dépannage de plomberie générale. Intervention sur fuites d'eau, débouchage de canalisations, pose de sanitaires, chauffe-eau et raccordements divers. Travail soigné et respect des normes de sécurité.", tarifHoraire: "15 000 FCFA / heure", forfaitInstallation: "45 000 FCFA", zones: ["Dakar Ville", "Pikine", "Guédiawaye", "Rufisque"], devisRecus: 47, missionsTerminees: 38, note: 4.5, avis: [{ title: "Amadou Bamba", sub: "Intervention rapide pour une fuite d'eau urgente. Très professionnel !", value: "5/5" }, { title: "Khady Sy", sub: "Installation propre du nouveau lavabo. Service fiable et courtois.", value: "4/5" }] },
  { id: "sa2", prestataire: "Fatou Cissé", service: "Couture traditionnelle", categorie: "Couture", tarif: "25 000 FCFA/forfait", statut: "Actif", date: "08/04/2026", metier: "Couturière", experience: "10 ans d'expérience", description: "Confection de vêtements traditionnels sur mesure.", tarifHoraire: "—", forfaitInstallation: "25 000 FCFA / pièce", zones: ["Dakar"], devisRecus: 30, missionsTerminees: 25, note: 4.7, avis: [] },
  { id: "sa3", prestataire: "Ibrahima Diallo", service: "Installation & dépannage électrique", categorie: "Électricité", tarif: "12 000 FCFA/h", statut: "En pause", date: "05/04/2026", metier: "Électricien", experience: "6 ans d'expérience", description: "Installation et dépannage électrique résidentiel.", tarifHoraire: "12 000 FCFA / heure", forfaitInstallation: "—", zones: ["Saint-Louis"], devisRecus: 20, missionsTerminees: 15, note: 4.6, avis: [] },
  { id: "sa4", prestataire: "Amadou Sow", service: "Rénovation de maison", categorie: "Maçonnerie", tarif: "35 000 FCFA/jour", statut: "Actif", date: "30/03/2026", metier: "Maçon", experience: "8 ans d'expérience", description: "Travaux de rénovation complète de maisons.", tarifHoraire: "—", forfaitInstallation: "35 000 FCFA / jour", zones: ["Dakar"], devisRecus: 25, missionsTerminees: 20, note: 4.8, avis: [] },
  { id: "sa5", prestataire: "Khady Ndiaye", service: "Tresses & soins capillaires", categorie: "Esthétique", tarif: "10 000 FCFA/forfait", statut: "Actif", date: "24/03/2026", metier: "Coiffeuse", experience: "7 ans d'expérience", description: "Tresses, soins et coiffures pour femmes.", tarifHoraire: "—", forfaitInstallation: "10 000 FCFA / prestation", zones: ["Dakar"], devisRecus: 40, missionsTerminees: 35, note: 4.9, avis: [] },
  { id: "sa6", prestataire: "Ousmane Fall", service: "Fabrication de meubles", categorie: "Menuiserie", tarif: "150 000 FCFA/forfait", statut: "Suspendu", date: "15/03/2026", metier: "Menuisier", experience: "12 ans d'expérience", description: "Fabrication de meubles sur mesure.", tarifHoraire: "—", forfaitInstallation: "150 000 FCFA / meuble", zones: ["Dakar"], devisRecus: 10, missionsTerminees: 8, note: 4.5, avis: [] },
  { id: "sa7", prestataire: "Babacar Gueye", service: "Peinture intérieure/extérieure", categorie: "Peinture", tarif: "8 000 FCFA/h", statut: "Actif", date: "10/03/2026", metier: "Peintre", experience: "5 ans d'expérience", description: "Peinture intérieure et extérieure de bâtiments.", tarifHoraire: "8 000 FCFA / heure", forfaitInstallation: "—", zones: ["Dakar"], devisRecus: 18, missionsTerminees: 14, note: 4.4, avis: [] },
  { id: "sa8", prestataire: "Mariama Sarr", service: "Entretien & réparation climatisation", categorie: "Froid & Climatisation", tarif: "20 000 FCFA/forfait", statut: "En pause", date: "02/03/2026", metier: "Technicienne froid", experience: "6 ans d'expérience", description: "Entretien et réparation de climatiseurs.", tarifHoraire: "—", forfaitInstallation: "20 000 FCFA / intervention", zones: ["Dakar"], devisRecus: 22, missionsTerminees: 18, note: 4.6, avis: [] },
];

function ServicesAdminDetail(row, { onBack, update }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail du service</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4 mb-6 mt-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(row.prestataire)}</div>
            <div>
              <p className="font-bold" style={{ color: COLORS.slate }}>{row.prestataire}</p>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{row.metier} · {row.experience}</p>
            </div>
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }}>Description du service</p>
          <p className="text-sm mb-4" style={{ color: COLORS.slate }}>{row.description}</p>
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Tarification et modalité</p>
          <Row label="Tarif horaire standard" value={row.tarifHoraire} /><div className="h-2" />
          <Row label="Forfait" value={row.forfaitInstallation} />
          <p className="text-xs font-semibold mt-4 mb-1.5" style={{ color: COLORS.slateLight }}>Zone d'intervention</p>
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
      subtitle="Gérez tous les services proposés par les prestataires sur la plateforme LIGGEEY"
      initialData={SERVICES_ADMIN_INITIAL}
      searchKeys={["prestataire", "service", "categorie"]}
      filters={[
        { key: "statut", label: "Tous les statuts", options: ["Actif", "En pause", "Suspendu"], matcher: (r, v) => r.statut === v },
        { key: "categorie", label: "Toutes les catégories", options: Array.from(new Set(SERVICES_ADMIN_INITIAL.map((s) => s.categorie))), matcher: (r, v) => r.categorie === v },
      ]}
      columns={[
        { key: "prestataire", label: "Prestataire", flex: 2, render: (r) => <IdentityCell nom={r.prestataire} sub={r.metier} /> },
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
  { id: "cda1", nom: "Moussa Diop", metier: "Électricien", offre: "Chef d'équipe électricité", entreprise: "Senegal Construction", date: "15/08/2026", statut: "Nouveau", localisation: "Dakar", experience: "8 ans d'expérience", telephone: "+221 77 123 45 67", email: "moussa.diop@email.sn", lettre: "Je me permets de postuler à votre offre de chef d'équipe en électricité. Fort de mes 8 années d'expérience en électricité de bâtiment, j'ai supervisé plusieurs chantiers d'envergure à Dakar, assurant à la fois le respect des délais et des strictes normes réglementaires. Dynamique et rigoureux, je souhaite mettre mes compétences de meneur d'hommes au service de Senegal Construction.", competences: ["Normes NF C 15-100", "Lecture de plans", "Management d'équipe", "Habilitation B2V"], documents: [{ nom: "CV_Moussa_Diop.pdf" }, { nom: "Certificat_NF_C15.pdf" }] },
  { id: "cda2", nom: "Fatou Sarr", metier: "Plombière", offre: "Plombier qualifié", entreprise: "Diallo & Fils", date: "14/08/2026", statut: "En cours", localisation: "Thiès", experience: "5 ans d'expérience", telephone: "+221 76 234 56 78", email: "fatou.sarr@email.sn", lettre: "Je souhaite postuler au poste de plombier qualifié. J'ai 5 ans d'expérience en installation et dépannage sanitaire.", competences: ["Plomberie sanitaire"], documents: [{ nom: "CV_Fatou_Sarr.pdf" }] },
  { id: "cda3", nom: "Ibrahima Diallo", metier: "Soudeur", offre: "Technicien maintenance", entreprise: "Dakar Services Pro", date: "12/08/2026", statut: "Retenu", localisation: "Saint-Louis", experience: "6 ans d'expérience", telephone: "+221 78 345 67 89", email: "ibrahima.diallo@email.sn", lettre: "Soudeur industriel qualifié, je souhaite intégrer votre équipe de maintenance.", competences: ["Soudure TIG", "Soudure MIG"], documents: [{ nom: "CV_Ibrahima_Diallo.pdf" }] },
  { id: "cda4", nom: "Aminata Ndiaye", metier: "Couturière", offre: "Couturière atelier", entreprise: "Atelier Couture", date: "10/08/2026", statut: "Rejeté", localisation: "Dakar", experience: "10 ans d'expérience", telephone: "+221 77 456 78 90", email: "aminata.ndiaye@email.sn", lettre: "Couturière expérimentée, je gère un atelier depuis 10 ans.", competences: ["Couture sur mesure"], documents: [{ nom: "CV_Aminata_Ndiaye.pdf" }] },
  { id: "cda5", nom: "Ousmane Ba", metier: "Menuisier", offre: "Menuisier ébéniste", entreprise: "Ndiaye Menuiserie", date: "09/08/2026", statut: "En cours", localisation: "Kaolack", experience: "12 ans d'expérience", telephone: "+221 76 567 89 01", email: "ousmane.ba@email.sn", lettre: "Menuisier ébéniste depuis 12 ans, spécialisé dans le mobilier sur mesure.", competences: ["Menuiserie", "Ébénisterie"], documents: [{ nom: "CV_Ousmane_Ba.pdf" }] },
  { id: "cda6", nom: "Mariama Tall", metier: "Carreleur", offre: "Carreleur intérieur", entreprise: "Senegal Construction", date: "08/08/2026", statut: "Nouveau", localisation: "Rufisque", experience: "4 ans d'expérience", telephone: "+221 78 678 90 12", email: "mariama.tall@email.sn", lettre: "Carreleuse spécialisée dans les finitions haut de gamme.", competences: ["Pose de carrelage"], documents: [{ nom: "CV_Mariama_Tall.pdf" }] },
  { id: "cda7", nom: "Abdoulaye Sow", metier: "Peintre", offre: "Peintre bâtiment", entreprise: "Rufisque Bâtiment", date: "07/08/2026", statut: "En cours", localisation: "Ziguinchor", experience: "3 ans d'expérience", telephone: "+221 77 789 01 23", email: "abdoulaye.sow@email.sn", lettre: "Peintre en bâtiment depuis 3 ans, disponible rapidement.", competences: ["Peinture", "Enduits"], documents: [{ nom: "CV_Abdoulaye_Sow.pdf" }] },
  { id: "cda8", nom: "Aissatou Gueye", metier: "Électricienne", offre: "Électricien chantier", entreprise: "Thiès Électrique", date: "05/08/2026", statut: "Nouveau", localisation: "Mbour", experience: "7 ans d'expérience", telephone: "+221 76 890 12 34", email: "aissatou.gueye@email.sn", lettre: "Électricienne qualifiée avec 7 ans d'expérience en encadrement de chantier.", competences: ["Normes NF C 15-100", "Management d'équipe"], documents: [{ nom: "CV_Aissatou_Gueye.pdf" }] },
];

function CandidaturesAdminDetail(row, { onBack, update, remove }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLORS.slate }}>Détail de la candidature</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-4 mb-6">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(row.nom)}</div>
            <div>
              <p className="font-bold" style={{ color: COLORS.slate }}>{row.nom}</p>
              <p className="text-xs" style={{ color: COLORS.slateLight }}>{row.metier} · {row.localisation}</p>
            </div>
          </div>
          <Row label="Téléphone" value={row.telephone} /><div className="h-2" />
          <Row label="Email" value={row.email} /><div className="h-2" />
          <Row label="Expérience" value={row.experience} />
          <p className="text-xs font-semibold mt-4 mb-1.5" style={{ color: COLORS.slateLight }}>Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {row.competences.map((c) => <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Détails de l'application</h3>
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
      subtitle="Suivez toutes les candidatures déposées sur la plateforme LIGGEEY"
      initialData={CANDIDATURES_ADMIN_INITIAL}
      searchKeys={["nom", "offre", "entreprise"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["Nouveau", "En cours", "Retenu", "Rejeté"], matcher: (r, v) => r.statut === v }]}
      columns={[
        { key: "nom", label: "Candidat", flex: 2, render: (r) => <IdentityCell nom={r.nom} sub={r.metier} /> },
        { key: "offre", label: "Offre postulée", flex: 1.2 },
        { key: "entreprise", label: "Entreprise", flex: 1 },
        { key: "date", label: "Date", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
      ]}
      renderDetail={CandidaturesAdminDetail}
    />
  );
}

/* ---------- Missions (Admin) — custom detail ---------- */

const MISSIONS_ADMIN_INITIAL = [
  { id: "mia1", refId: "M-2026-041", description: "Réparation fuite d'eau urgente", prestataire: "Moussa Diop", client: "Alioune Sow", service: "Plomberie", statut: "En cours", montant: "45 000 FCFA", dateDebut: "15/04/2026 à 09:00", dateFin: "15/04/2026 à 13:00", duree: "4 heures", statutPaiement: "En attente", historique: [{ label: "Mission créée & Devis validé", meta: "14/04/2026 à 15:30 · Par Alioune Sow" }, { label: "Prestataire assigné", meta: "14/04/2026 à 16:00 · Moussa Diop" }, { label: "Début des travaux validé", meta: "15/04/2026 à 09:15 · Par le prestataire" }] },
  { id: "mia2", refId: "M-2026-039", description: "Couture de rideaux sur mesure", prestataire: "Fatou Cissé", client: "Awa Ndiaye", service: "Couture", statut: "Terminée", montant: "65 000 FCFA", dateDebut: "10/04/2026 à 10:00", dateFin: "12/04/2026 à 17:00", duree: "2 jours", statutPaiement: "Payé", historique: [{ label: "Mission créée & Devis validé", meta: "09/04/2026 à 11:00 · Par Awa Ndiaye" }, { label: "Mission terminée", meta: "12/04/2026 à 17:00 · Par le prestataire" }] },
  { id: "mia3", refId: "M-2026-038", description: "Installation tableau électrique", prestataire: "Ibrahima Diallo", client: "Dakar Bâtiment", service: "Électricité", statut: "Terminée", montant: "80 000 FCFA", dateDebut: "05/04/2026 à 08:00", dateFin: "05/04/2026 à 16:00", duree: "8 heures", statutPaiement: "Payé", historique: [] },
  { id: "mia4", refId: "M-2026-035", description: "Construction mur de clôture", prestataire: "Amadou Sow", client: "Modou Fall", service: "Maçonnerie", statut: "En attente", montant: "120 000 FCFA", dateDebut: "20/04/2026 à 08:00", dateFin: "25/04/2026 à 18:00", duree: "5 jours", statutPaiement: "En attente", historique: [] },
  { id: "mia5", refId: "M-2026-032", description: "Peinture façade extérieure", prestataire: "Babacar Gueye", client: "Seynabou Diop", service: "Peinture", statut: "Annulée", montant: "35 000 FCFA", dateDebut: "—", dateFin: "—", duree: "—", statutPaiement: "Annulé", historique: [] },
  { id: "mia6", refId: "M-2026-030", description: "Entretien climatiseur split", prestataire: "Mariama Sarr", client: "Pathé Gueye", service: "Climatisation", statut: "Terminée", montant: "20 000 FCFA", dateDebut: "01/04/2026 à 09:00", dateFin: "01/04/2026 à 11:00", duree: "2 heures", statutPaiement: "Payé", historique: [] },
  { id: "mia7", refId: "M-2026-027", description: "Soudure structure métallique", prestataire: "Cheikh Ndiaye", client: "Gorgui Diouf", service: "Soudure", statut: "Terminée", montant: "45 000 FCFA", dateDebut: "20/03/2026 à 08:00", dateFin: "21/03/2026 à 17:00", duree: "2 jours", statutPaiement: "Payé", historique: [] },
  { id: "mia8", refId: "M-2026-025", description: "Tresses et soins capillaires", prestataire: "Khady Ndiaye", client: "Aicha Cissé", service: "Esthétique", statut: "Terminée", montant: "10 000 FCFA", dateDebut: "15/03/2026 à 10:00", dateFin: "15/03/2026 à 12:00", duree: "2 heures", statutPaiement: "Payé", historique: [] },
];

function MissionsAdminDetail(row, { onBack, update }) {
  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}><ArrowLeft size={14} /> Retour</button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.slate }}>Détail de la mission</h1>
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
      subtitle="Suivez toutes les missions de service en cours et terminées sur la plateforme LIGGEEY"
      initialData={MISSIONS_ADMIN_INITIAL}
      searchKeys={["refId", "prestataire", "client", "service"]}
      filters={[{ key: "statut", label: "Tous les statuts", options: ["En cours", "Terminée", "En attente", "Annulée"], matcher: (r, v) => r.statut === v }]}
      columns={[
        { key: "refId", label: "ID Mission", flex: 1 },
        { key: "prestataire", label: "Prestataire", flex: 1.4, render: (r) => <IdentityCell nom={r.prestataire} /> },
        { key: "client", label: "Client", flex: 1 },
        { key: "service", label: "Service", flex: 1 },
        { key: "statut", label: "Statut", flex: 1, render: (r) => <StatusBadge status={r.statut} /> },
        { key: "montant", label: "Montant", flex: 1 },
      ]}
      renderDetail={MissionsAdminDetail}
    />
  );
}

/* ---------- Vérification CV & Diplômes (Admin) ---------- */

const DOCUMENTS_ADMIN_INITIAL = [
  { id: "da1", nom: "Moustapha Diop", metier: "Électricien BTP", document: "Diplôme d'État (CAP)", fichier: "CAP_Electricite_Diop.pdf", date: "14 Août 2026", statut: "En attente", taille: "2.4 MB", pages: 2, correspondance: 85 },
  { id: "da2", nom: "Fatoumata Diallo", metier: "Couturière Styliste", document: "Certificat de couture", fichier: "Attestation_Diallo.pdf", date: "14 Août 2026", statut: "En attente", taille: "1.1 MB", pages: 1, correspondance: 72 },
  { id: "da3", nom: "Amadou Sow", metier: "Maçon Applicateur", document: "CV Technique", fichier: "CV_Sow_Macon.pdf", date: "13 Août 2026", statut: "En cours", taille: "0.8 MB", pages: 2, correspondance: 60 },
  { id: "da4", nom: "Aissatou Ndiaye", metier: "Coiffeuse Esthéticienne", document: "Certificat Pro", fichier: "Certif_Salon.pdf", date: "12 Août 2026", statut: "Validé", taille: "1.5 MB", pages: 1, correspondance: 90 },
  { id: "da5", nom: "Ibrahima Fall", metier: "Mécanicien Auto", document: "CAP Mécanique", fichier: "CAP_Meca_Fall.pdf", date: "11 Août 2026", statut: "Validé", taille: "2.0 MB", pages: 2, correspondance: 88 },
  { id: "da6", nom: "Mariama Sarr", metier: "Transformateur Agro", document: "Attestation", fichier: "Attestation_Sarr.pdf", date: "10 Août 2026", statut: "Rejeté", taille: "0.9 MB", pages: 1, correspondance: 40 },
  { id: "da7", nom: "Ousmane Cissé", metier: "Plombier Sanitaire", document: "CV Technique", fichier: "CV_Cisse_Plomberie.pdf", date: "09 Août 2026", statut: "Validé", taille: "1.2 MB", pages: 2, correspondance: 82 },
  { id: "da8", nom: "Aminata Gueye", metier: "Teinturière Artisanale", document: "Attestation", fichier: "Certif_Teinture.pdf", date: "08 Août 2026", statut: "En attente", taille: "1.0 MB", pages: 1, correspondance: 65 },
];

function DocumentControlScreen({ doc, onBack, onDecide }) {
  const [zoom, setZoom] = useState(100);
  return (
    <div>
      <p className="text-sm mb-1" style={{ color: COLORS.slateLight }}>
        <button type="button" onClick={onBack} className="hover:underline">Vérifications CV</button> / {doc.nom}
      </p>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Contrôle du document</h1>
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
              <button type="button" onClick={() => setZoom((z) => Math.max(60, z - 10))} className="w-7 h-7 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.border }}><ZoomOut size={13} /></button>
              <span className="text-xs font-semibold w-10 text-center" style={{ color: COLORS.slate }}>{zoom}%</span>
              <button type="button" onClick={() => setZoom((z) => Math.min(150, z + 10))} className="w-7 h-7 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.border }}><ZoomIn size={13} /></button>
            </div>
          </div>
          <div className="rounded-lg border bg-surface p-10 flex items-center justify-center" style={{ borderColor: COLORS.border, minHeight: 480 }}>
            <div
              className="text-center px-10 py-10"
              style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.15s", border: "1px solid #E5E0D5", maxWidth: 460 }}
            >
              <p className="text-xs tracking-widest mb-6" style={{ color: "#9A8F7A" }}>RÉPUBLIQUE DU SÉNÉGAL</p>
              <div className="w-14 h-14 rounded-full border-2 mx-auto mb-6" style={{ borderColor: "#C9A227" }} />
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#2B2B2B", fontFamily: "Georgia, serif" }}>Certificat d'Aptitude<br />Professionnelle</h2>
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
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(doc.nom)}</div>
              <div><p className="font-semibold" style={{ color: COLORS.slate }}>{doc.nom}</p><p className="text-xs" style={{ color: COLORS.slateLight }}>{doc.metier} · Dakar</p></div>
            </div>
            <Row label="Type de document" value={doc.document} /><div className="h-2" />
            <Row label="Soumis le" value={doc.date} /><div className="h-2" />
            <Row label="N° de dossier" value={`LIG-2026-${doc.id.slice(2).padStart(4, "0")}`} />
          </div>

          <div className="rounded-lg p-4" style={{ background: "#ECFDF5" }}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold" style={{ color: "#047857" }}>Correspondance profil</p>
              <span className="text-sm font-bold" style={{ color: "#047857" }}>{doc.correspondance}%</span>
            </div>
            <p className="text-xs" style={{ color: "#047857" }}>Le diplôme et la spécialité correspondent aux compétences déclarées sur le profil.</p>
          </div>

          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Points de contrôle</h3>
            {["Nom identique au profil", "Document lisible et complet", "Institution identifiable", "Date et signature présentes"].map((p) => (
              <div key={p} className="flex items-center gap-2 py-1">
                <Check size={13} color="#16A34A" />
                <p className="text-sm" style={{ color: COLORS.slate }}>{p}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.slate }}>Décision de contrôle</h3>
            <p className="text-xs mb-4" style={{ color: COLORS.slateLight }}>Confirmez uniquement après avoir vérifié toutes les informations visibles.</p>
            <button type="button" onClick={() => onDecide(doc.id, "Validé")} className="w-full rounded-md py-2.5 text-sm font-semibold text-sur-sombre mb-2" style={{ background: COLORS.orange }}>Valider</button>
            <button type="button" onClick={() => onDecide(doc.id, "Rejeté")} className="w-full rounded-md py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.danger }}>Rejeter</button>
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
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Vérification des documents</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Consultez les documents soumis. Les décisions sont prises sur la page de contrôle dédiée.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {["Tous", "En attente", "Validés", "Rejetés"].map((t) => (
          <button key={t} type="button" onClick={() => { setTab(t); setPage(1); }} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: tab === t ? COLORS.orange : COLORS.surface, color: tab === t ? COLORS.onOrange : COLORS.slate, border: `1px solid ${tab === t ? COLORS.orange : COLORS.border}` }}>
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Rechercher un candidat..."
        className="w-full max-w-sm rounded-md border px-4 py-2.5 text-sm mb-5 outline-none focus:border-primaire-400"
        style={{ borderColor: COLORS.border }}
      />

      <div className="rounded-lg border bg-surface overflow-hidden" style={{ borderColor: COLORS.border }}>
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
            <p className="text-sm truncate" style={{ flex: 1.4, color: COLORS.orange }}>{d.fichier}</p>
            <p className="text-sm" style={{ flex: 1, color: COLORS.slateLight }}>{d.date}</p>
            <div style={{ flex: 1 }}><StatusBadge status={d.statut} /></div>
            <button type="button" onClick={() => setSelectedId(d.id)} className="w-20 text-right text-sm font-semibold shrink-0" style={{ color: COLORS.orange }}>Consulter</button>
          </div>
        ))}
        {paged.length === 0 && <p className="text-sm p-5" style={{ color: COLORS.slateLight }}>Aucun document.</p>}
      </div>

      <Pagination page={page} pageSize={ADMIN_PAGE_SIZE} totalItems={filtered.length} onPageChange={setPage} />
    </div>
  );
}

/* ---------- Messagerie (Admin) ---------- */

const CONVERSATIONS_INITIAL = [
  {
    id: "c1", nom: "Moustapha Diop", role: "Prestataire · Électricien", nonLu: 2,
    messages: [
      { de: "eux", texte: "Bonjour, j'ai envoyé mon diplôme CAP électricité hier. Pouvez-vous me dire si le format convient ?", heure: "09:12" },
      { de: "moi", texte: "Bonjour Moustapha, nous l'avons bien reçu. Le scan est un peu flou en bas de page.", heure: "09:40" },
      { de: "eux", texte: "D'accord, je peux le renvoyer en meilleure qualité ce soir.", heure: "10:02" },
      { de: "eux", texte: "Faut-il aussi l'attestation de stage ?", heure: "10:03" },
    ],
  },
  {
    id: "c2", nom: "Senegal Construction SARL", role: "Entreprise · BTP", nonLu: 1,
    messages: [
      { de: "eux", texte: "Notre offre « Chef de chantier » a été signalée. Pouvons-nous savoir pourquoi ?", heure: "Hier" },
    ],
  },
  {
    id: "c3", nom: "Absatou Diallo", role: "Chercheuse d'emploi", nonLu: 0,
    messages: [
      { de: "eux", texte: "Merci pour la mise en relation avec Cheikh Fall, la première séance s'est très bien passée.", heure: "Lun." },
      { de: "moi", texte: "Avec plaisir Absatou ! N'hésitez pas à revenir vers nous après la simulation d'entretien.", heure: "Lun." },
    ],
  },
  {
    id: "c4", nom: "Fatou Sow", role: "Prestataire · Couturière", nonLu: 0,
    messages: [
      { de: "moi", texte: "Bonjour Fatou, il reste 3 places pour l'atelier couture de Pikine. Souhaitez-vous animer la seconde session ?", heure: "28 sept." },
      { de: "eux", texte: "Oui, avec plaisir. Je suis disponible le samedi.", heure: "28 sept." },
    ],
  },
  {
    id: "c5", nom: "Diallo & Fils", role: "Client · Particulier", nonLu: 0,
    messages: [
      { de: "eux", texte: "La mission de plomberie est terminée et réglée. Comment laisser un avis au prestataire ?", heure: "25 sept." },
      { de: "moi", texte: "Depuis l'onglet Missions, cliquez sur la mission terminée puis sur « Laisser un avis ».", heure: "25 sept." },
    ],
  },
];

function MessagerieTab() {
  const [convs, setConvs] = useState(CONVERSATIONS_INITIAL);
  const [activeId, setActiveId] = useState(null);
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

  function send() {
    const texte = draft.trim();
    if (!texte || !active) return;
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setConvs((list) => list.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, { de: "moi", texte, heure }] } : c)));
    setDraft("");
  }

  function archive() {
    setConvs((list) => list.filter((c) => c.id !== active.id));
    notify(`Conversation avec ${active.nom} archivée.`);
    setActiveId(null);
  }

  return (
    <div className="rounded-lg border bg-surface overflow-hidden grid grid-cols-1 md:grid-cols-[300px,1fr]" style={{ borderColor: COLORS.border, minHeight: 480 }}>
      <div className={`${active ? "hidden md:flex" : "flex"} flex-col`} style={{ borderRight: `1px solid ${COLORS.border}` }}>
        <div className="p-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-2 rounded-md border px-3 py-2" style={{ borderColor: COLORS.border }}>
            <Search size={14} color={COLORS.slateLight} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une conversation" aria-label="Rechercher une conversation" className="flex-1 text-sm outline-none bg-transparent min-w-0" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {visible.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <button key={c.id} type="button" onClick={() => open(c.id)} className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-doux" style={{ background: c.id === activeId ? COLORS.orangeSubtle : undefined, borderBottom: `1px solid ${COLORS.border}` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(c.nom)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{c.nom}</p>
                    <span className="text-[11px] shrink-0" style={{ color: COLORS.slateLight }}>{last ? last.heure : ""}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: c.nonLu ? COLORS.slate : COLORS.slateLight, fontWeight: c.nonLu ? 600 : 400 }}>
                    {last ? (last.de === "moi" ? "Vous : " : "") + last.texte : ""}
                  </p>
                </div>
                {c.nonLu > 0 && <span className="text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-sur-sombre" style={{ background: COLORS.orange }}>{c.nonLu}</span>}
              </button>
            );
          })}
          {visible.length === 0 && <p className="text-sm p-4" style={{ color: COLORS.slateLight }}>Aucune conversation ne correspond à « {query} ».</p>}
        </div>
      </div>

      {active ? (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-3 min-w-0">
              <button type="button" onClick={() => setActiveId(null)} className="md:hidden" aria-label="Retour aux conversations"><ArrowLeft size={16} color={COLORS.slate} /></button>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{active.nom}</p>
                <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{active.role}</p>
              </div>
            </div>
            <button type="button" onClick={archive} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border shrink-0" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
              <Archive size={13} /> Archiver
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ background: COLORS.soft, maxHeight: 420 }}>
            {active.messages.map((m, i) => (
              <div key={i} className={`max-w-[80%] ${m.de === "moi" ? "self-end" : "self-start"}`}>
                <div className="rounded-lg px-3.5 py-2.5 text-sm leading-relaxed" style={m.de === "moi" ? { background: COLORS.orange, color: COLORS.onOrange } : { background: COLORS.surface, color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                  {m.texte}
                </div>
                <p className={`text-[11px] mt-1 ${m.de === "moi" ? "text-right" : ""}`} style={{ color: COLORS.slateLight }}>{m.heure}</p>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="flex items-end gap-2 p-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Écrire à ${active.nom}…`}
              aria-label="Votre message"
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400 resize-none"
              style={{ borderColor: COLORS.border }}
            />
            <button type="button" onClick={send} disabled={!draft.trim()} className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: draft.trim() ? 1 : 0.5 }}>
              <Send size={14} /> Envoyer
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col items-center justify-center p-8 text-center">
          <MessageCircle size={28} color={COLORS.slateLight} />
          <p className="text-sm font-semibold mt-3" style={{ color: COLORS.slate }}>Sélectionnez une conversation</p>
          <p className="text-sm mt-1 max-w-xs" style={{ color: COLORS.slateLight }}>Répondez aux chercheurs, prestataires et entreprises depuis un seul endroit.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Archives (Admin) ---------- */

const ARCHIVES_INITIAL = [
  { id: "a1", titre: "Diplôme BTS Comptabilité — Mariama Ba", type: "Document", categorie: "Vérification", date: "12/09/2026", taille: "1,2 Mo" },
  { id: "a2", titre: "Signalement offre #2791 — résolu", type: "Discussion", categorie: "Modération", date: "08/09/2026", taille: "14 messages" },
  { id: "a3", titre: "Contrat mission #M-2026-0745", type: "Document", categorie: "Missions", date: "02/09/2026", taille: "340 Ko" },
  { id: "a4", titre: "Litige paiement — Diallo & Fils", type: "Discussion", categorie: "Missions", date: "29/08/2026", taille: "22 messages" },
  { id: "a5", titre: "Attestation formation Électricité Pro (lot de 15)", type: "Document", categorie: "Formations", date: "06/08/2026", taille: "4,8 Mo" },
  { id: "a6", titre: "Pièce d'identité — Ibrahima Faye", type: "Document", categorie: "Vérification", date: "30/07/2026", taille: "860 Ko" },
  { id: "a7", titre: "Demande de suppression de compte — Khady Ndour", type: "Discussion", categorie: "Comptes", date: "21/07/2026", taille: "6 messages" },
  { id: "a8", titre: "Kbis / RCCM — Dakar Services SARL", type: "Document", categorie: "Vérification", date: "15/07/2026", taille: "1,9 Mo" },
  { id: "a9", titre: "Retour participants — Atelier Couture Pikine", type: "Discussion", categorie: "Formations", date: "02/07/2026", taille: "31 messages" },
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
    notify(`« ${a.titre} » restauré dans l'espace actif.`);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}><p className="text-2xl font-bold" style={{ color: COLORS.slate }}>{items.length}</p><p className="text-sm" style={{ color: COLORS.slateLight }}>Éléments archivés</p></div>
        <div className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}><p className="text-2xl font-bold" style={{ color: COLORS.slate }}>{docs}</p><p className="text-sm" style={{ color: COLORS.slateLight }}>Documents</p></div>
        <div className="rounded-lg border bg-surface p-4" style={{ borderColor: COLORS.border }}><p className="text-2xl font-bold" style={{ color: COLORS.slate }}>{discussions}</p><p className="text-sm" style={{ color: COLORS.slateLight }}>Discussions résolues</p></div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-surface flex-1 max-w-xs" style={{ borderColor: COLORS.border }}>
          <Search size={14} color={COLORS.slateLight} />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Rechercher dans les archives" aria-label="Rechercher dans les archives" className="flex-1 text-sm outline-none bg-transparent min-w-0" />
        </div>
        <div className="flex gap-2">
          {["Tous", "Document", "Discussion"].map((t) => (
            <button key={t} type="button" onClick={() => { setType(t); setPage(1); }} className="rounded-md px-3 py-1.5 text-xs font-semibold" style={{ background: type === t ? COLORS.softStrong : COLORS.surface, color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
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
                <button type="button" onClick={() => restore(a)} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.orange }}>
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
  Formation: { bg: "#DBEAFE", color: "#1D4ED8" },
  Mission: { bg: COLORS.orangeSoft, color: COLORS.orange },
  Deadline: { bg: "#FEE2E2", color: "#B91C1C" },
  Événement: { bg: "#DCFCE7", color: "#16A34A" },
};

const PLANNING_EVENTS_INITIAL = [
  { id: "e1", titre: "Formation Électricité Pro", type: "Formation", debut: "2026-10-03", fin: "2026-10-05", meta: "15 inscrits" },
  { id: "e2", titre: "Atelier Couture Pikine", type: "Mission", debut: "2026-10-10", fin: "2026-10-10", meta: "28 places" },
  { id: "e3", titre: "Limite Candidatures Offres BTP", type: "Deadline", debut: "2026-10-15", fin: "2026-10-15", meta: "Alerte système" },
  { id: "e4", titre: "Session Mentorat Individuel", type: "Événement", debut: "2026-10-18", fin: "2026-10-19", meta: "12 sessions" },
  { id: "e5", titre: "Forum Emploi Artisanat", type: "Événement", debut: "2026-10-25", fin: "2026-10-25", meta: "500 attendus" },
  { id: "e6", titre: "Formation Plomberie sanitaire", type: "Formation", debut: "2026-11-07", fin: "2026-11-09", meta: "12 inscrits" },
  { id: "e7", titre: "Clôture offres Hôtellerie", type: "Deadline", debut: "2026-11-21", fin: "2026-11-21", meta: "Alerte système" },
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
  const [v, setV] = useState({ titre: "", type: "Formation", debut: defaultDate, fin: defaultDate, meta: "" });
  const [error, setError] = useState("");
  function set(k, val) { setV((s) => ({ ...s, [k]: val, ...(k === "debut" && s.fin < val ? { fin: val } : {}) })); }
  function submit() {
    if (!v.titre.trim()) return setError("Donnez un titre à l'événement.");
    if (v.fin < v.debut) return setError("La date de fin doit suivre la date de début.");
    onSave({ ...v, titre: v.titre.trim(), id: `e${Date.now()}` });
  }
  const field = "w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400";
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(15,11,8,0.55)" }} role="dialog" aria-modal="true" aria-labelledby="event-form-title">
      <div className="w-full max-w-md rounded-lg bg-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 id="event-form-title" className="text-lg font-bold" style={{ color: COLORS.slate }}>Ajouter un événement</h2>
          <button type="button" onClick={onCancel} aria-label="Fermer"><X size={18} color={COLORS.slateLight} /></button>
        </div>
        <label htmlFor="ev-titre" className="block text-xs font-semibold mb-1" style={{ color: COLORS.slate }}>Titre *</label>
        <input id="ev-titre" value={v.titre} onChange={(e) => set("titre", e.target.value)} placeholder="Ex. Formation Soudure niveau 1" className={`${field} mb-3`} style={{ borderColor: COLORS.border }} />
        <label htmlFor="ev-type" className="block text-xs font-semibold mb-1" style={{ color: COLORS.slate }}>Type</label>
        <select id="ev-type" value={v.type} onChange={(e) => set("type", e.target.value)} className={`${field} mb-3`} style={{ borderColor: COLORS.border }}>
          {Object.keys(EVENT_TYPE_COLORS).map((t) => <option key={t}>{t}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="ev-debut" className="block text-xs font-semibold mb-1" style={{ color: COLORS.slate }}>Début</label>
            <input id="ev-debut" type="date" value={v.debut} onChange={(e) => set("debut", e.target.value)} className={field} style={{ borderColor: COLORS.border }} />
          </div>
          <div>
            <label htmlFor="ev-fin" className="block text-xs font-semibold mb-1" style={{ color: COLORS.slate }}>Fin</label>
            <input id="ev-fin" type="date" value={v.fin} min={v.debut} onChange={(e) => set("fin", e.target.value)} className={field} style={{ borderColor: COLORS.border }} />
          </div>
        </div>
        <label htmlFor="ev-meta" className="block text-xs font-semibold mb-1" style={{ color: COLORS.slate }}>Détail (lieu, places…)</label>
        <input id="ev-meta" value={v.meta} onChange={(e) => set("meta", e.target.value)} placeholder="Ex. 20 places · Pikine" className={`${field} mb-4`} style={{ borderColor: COLORS.border }} />
        {error && <p className="text-xs mb-3" style={{ color: COLORS.danger }}>{error}</p>}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
          <button type="button" onClick={submit} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Ajouter l'événement</button>
        </div>
      </div>
    </div>
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
          <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Planning</h1>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>Gérez le calendrier des formations, événements et activités de la plateforme LIGGEEY</p>
        </div>
        <button type="button" onClick={() => setFormOpen(true)} className="flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold text-sur-sombre shrink-0" style={{ background: COLORS.orange }}>
          <Plus size={15} /> Ajouter un événement
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mt-6 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => move(-1)} aria-label="Période précédente" className="w-7 h-7 rounded-md border flex items-center justify-center bg-surface" style={{ borderColor: COLORS.border }}><ArrowLeft size={13} /></button>
          <p className="font-bold text-lg" style={{ color: COLORS.slate }} aria-live="polite">{title}</p>
          <button type="button" onClick={() => move(1)} aria-label="Période suivante" className="w-7 h-7 rounded-md border flex items-center justify-center bg-surface" style={{ borderColor: COLORS.border }}><ChevronRight size={13} /></button>
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
                  <button type="button" onClick={() => setFormOpen(true)} className="mt-3 text-sm font-semibold" style={{ color: COLORS.orange }}>Planifier un événement</button>
                </div>
              ) : dayEvents.map((e) => (
                <div key={e.id} className="rounded-md p-4 mb-3" style={{ background: EVENT_TYPE_COLORS[e.type].bg }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-bold" style={{ color: EVENT_TYPE_COLORS[e.type].color }}>{e.titre}</p>
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
  { id: "n1", titre: "Nouveau profil en attente de vérification", badge: "Utilisateurs", description: "Moustapha Diop a soumis un document d'électricien CAP.", temps: "Il y a 5 min", lu: false, icon: UserPlus, target: "verifications" },
  { id: "n2", titre: "Signalement reçu – Offre #2847", badge: "Système", description: "Offre signalée pour motif d'informations suspicieuses par un utilisateur.", temps: "Il y a 2 heures", lu: false, icon: AlertCircle, target: "offres" },
  { id: "n3", titre: "Formation complétée par 15 participants", badge: "Système", description: "La formation « Électricité Pro » s'est achevée avec succès.", temps: "Il y a 4 heures", lu: true, icon: CheckCircle2, target: "formations" },
  { id: "n4", titre: "Mission #M-2024-0892 terminée", badge: "Système", description: "Diallo & Fils a marqué le travail de plomberie comme payé.", temps: "Hier", lu: true, icon: CheckCircle2, target: "missions" },
  { id: "n5", titre: "3 nouveaux avis à modérer", badge: "Utilisateurs", description: "Les avis d'utilisateurs sur les prestataires de Pikine attendent approbation.", temps: "Hier", lu: true, icon: AlertCircle, target: "prestataires" },
];

function CommunicationScreen({ onNavigate }) {
  const [mainTab, setMainTab] = useState("Notifications");
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
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Centre de communication</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Gérez les notifications, messages et archives de la plateforme LIGGEEY</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {["Notifications", "Messagerie", "Archives"].map((t) => (
          <button key={t} type="button" onClick={() => setMainTab(t)} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: mainTab === t ? COLORS.orange : COLORS.surface, color: mainTab === t ? COLORS.onOrange : COLORS.slate, border: `1px solid ${mainTab === t ? COLORS.orange : COLORS.border}` }}>
            {t}
          </button>
        ))}
      </div>

      {mainTab === "Messagerie" && <MessagerieTab />}
      {mainTab === "Archives" && <ArchivesTab />}

      {mainTab === "Notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1fr] gap-4">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex gap-2">
                {[{ id: "Toutes", label: "Toutes" }, { id: "Non lues", label: `Non lues (${nonLues})` }, { id: "Système", label: "Système" }, { id: "Utilisateurs", label: "Utilisateurs" }].map((t) => (
                  <button key={t.id} type="button" onClick={() => setSubTab(t.id)} className="rounded-md px-3 py-1.5 text-xs font-semibold" style={{ background: subTab === t.id ? COLORS.softStrong : COLORS.surface, color: COLORS.slate, border: `1px solid ${COLORS.border}` }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setNotifs((list) => list.map((n) => ({ ...n, lu: true })))} className="rounded-md px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
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
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: n.badge === "Système" ? COLORS.orangeSoft : "#EDE9FE", color: n.badge === "Système" ? COLORS.orange : "#7C3AED" }}>{n.badge}</span>
                    </div>
                    <p className="text-sm" style={{ color: COLORS.slateLight }}>{n.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{n.temps}</p>
                    <button type="button" onClick={() => onNavigate(n.target)} className="text-sm font-semibold" style={{ color: COLORS.orange }}>Gérer</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Statistiques de communication</h3>
              <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Total envoyées</p><p className="text-sm font-bold" style={{ color: COLORS.slate }}>1 247</p></div>
              <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Taux de lecture</p><p className="text-sm font-bold" style={{ color: "#16A34A" }}>78%</p></div>
              <div className="flex items-center justify-between py-1.5"><p className="text-sm" style={{ color: COLORS.slateLight }}>Messages en attente</p><p className="text-sm font-bold" style={{ color: COLORS.orange }}>5</p></div>
            </div>
            <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-2 mb-2"><Archive size={16} color={COLORS.slate} /><h3 className="font-semibold" style={{ color: COLORS.slate }}>Archives plateforme</h3></div>
              <p className="text-sm mb-3" style={{ color: COLORS.slateLight }}>Accédez à l'historique complet des dossiers archivés pour libérer l'espace actif de la base.</p>
              <div className="flex items-center justify-between py-1"><p className="text-sm" style={{ color: COLORS.slateLight }}>Documents archivés</p><p className="text-sm font-bold" style={{ color: COLORS.slate }}>342</p></div>
              <div className="flex items-center justify-between py-1 mb-3"><p className="text-sm" style={{ color: COLORS.slateLight }}>Discussions résolues</p><p className="text-sm font-bold" style={{ color: COLORS.slate }}>89</p></div>
              <button type="button" onClick={() => setMainTab("Archives")} className="w-full rounded-md py-2.5 text-sm font-semibold" style={{ background: COLORS.softStrong, color: COLORS.slate }}>Consulter les archives</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Paramètres (Admin) ---------- */

function PasswordChanger() {
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const [error, setError] = useState("");

  function submit() {
    if (!pwd.actuel) return setError("Saisissez votre mot de passe actuel.");
    if (pwd.nouveau.length < 8) return setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
    if (pwd.nouveau !== pwd.confirmation) return setError("Les deux nouveaux mots de passe ne correspondent pas.");
    setError("");
    setPwd({ actuel: "", nouveau: "", confirmation: "" });
    setOpen(false);
    notify("Mot de passe modifié.");
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-3 rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
        Changer le mot de passe
      </button>
    );
  }
  return (
    <div className="mt-3 rounded-md border p-4 max-w-md" style={{ borderColor: COLORS.border }}>
      {[{ k: "actuel", l: "Mot de passe actuel" }, { k: "nouveau", l: "Nouveau mot de passe" }, { k: "confirmation", l: "Confirmer le nouveau mot de passe" }].map((f) => (
        <div key={f.k} className="mb-3">
          <label htmlFor={`pwd-${f.k}`} className="block text-xs font-semibold mb-1" style={{ color: COLORS.slate }}>{f.l}</label>
          <input id={`pwd-${f.k}`} type="password" value={pwd[f.k]} onChange={(e) => setPwd((s) => ({ ...s, [f.k]: e.target.value }))} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
        </div>
      ))}
      {error && <p className="text-xs mb-3" style={{ color: COLORS.danger }}>{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={submit} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Changer le mot de passe</button>
        <button type="button" onClick={() => { setOpen(false); setError(""); }} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
      </div>
    </div>
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
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Paramètres</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Gérez votre compte administrateur et les préférences de la plateforme LIGGEEY</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Compte administrateur</h3>
          <Row label="Nom" value="Admin LIGGEEY" /><div className="h-2" />
          <Row label="Rôle" value="Super Admin" /><div className="h-2" />
          <Row label="Email" value="admin@liggeey.sn" />
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

      <button type="button" onClick={() => setSaved(true)} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
        Enregistrer les modifications
      </button>
      {saved && <span className="ml-3 text-sm" style={{ color: "#047857" }}>Préférences enregistrées.</span>}
    </div>
  );
}

/* =====================================================================
   ABONNEMENTS & OFFRES PREMIUM
   - Offres par type d'utilisateur (chercheur, prestataire, entreprise)
   - Limites mensuelles + fonctionnalités réservées
   - Paiement mobile money (Wave, Orange Money, Free Money) ou carte
   - Pilotage admin : tarifs, quotas, abonnés, transactions
   ===================================================================== */

const PlanContext = React.createContext(null);
function usePlan() {
  return React.useContext(PlanContext);
}

const UNLIMITED = Infinity;

function fcfa(n) {
  return `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

function todayFr(offsetMonths = 0) {
  const d = demoNow();
  d.setMonth(d.getMonth() + offsetMonths);
  return d.toLocaleDateString("fr-FR");
}

const PLANS_INITIAL = {
  chercheur: [
    { id: "essentiel", nom: "Essentiel", prixMensuel: 0, description: "Le profil de base pour démarrer votre recherche.", limits: { candidatures: 5 }, features: {}, avantages: ["5 candidatures par mois", "Formations gratuites et certificats", "Suivi de vos candidatures et de votre embauche"] },
    { id: "premium", nom: "Premium", prixMensuel: 2500, recommande: true, description: "Un profil mis en avant pour être recruté(e) plus vite.", limits: { candidatures: UNLIMITED }, features: { formationsPremium: true, mentorat: true, miseEnAvant: true }, avantages: ["Profil en tête des résultats des recruteurs", "Candidatures illimitées", "Toutes les formations, y compris premium", "Coaching individuel avec un mentor", "Voir qui a consulté votre profil"] },
  ],
  prestataire: [
    { id: "essentiel", nom: "Essentiel", prixMensuel: 0, commission: 15, description: "Le profil de base pour proposer vos services.", limits: { services: 10 }, features: {}, avantages: ["Jusqu'à 10 services publiés", "Commission de 15 % par mission", "Guide de régularisation en ligne"] },
    { id: "premium", nom: "Premium", prixMensuel: 5000, commission: 8, recommande: true, description: "Un profil prioritaire pour développer votre clientèle.", limits: { services: UNLIMITED }, features: { formationsPremium: true, mentorat: true, contreOffre: true, badgePro: true, accompagnementRegularisation: true }, avantages: ["Profil prioritaire et badge Premium", "Services illimités", "Commission réduite à 8 % par mission", "Contre-propositions de tarif aux clients", "Conseiller dédié pour régulariser votre activité", "Formations premium et coaching"] },
  ],
  entreprise: [
    { id: "essentiel", nom: "Essentiel", prixMensuel: 0, description: "Le profil de base pour un premier recrutement.", limits: { offres: 1 }, features: {}, avantages: ["1 nouvelle offre par mois", "Réception et tri des candidatures", "Suivi post-embauche des recrues"] },
    { id: "premium", nom: "Premium", prixMensuel: 35000, recommande: true, description: "Un profil Recruteur Premium pour recruter sans limite.", limits: { offres: UNLIMITED }, features: { coordonnees: true, contactPrestataires: true, sponsoring: true }, avantages: ["Badge Recruteur Premium", "Offres illimitées", "Coordonnées et CV des candidats", "Contact direct et missions aux prestataires", "Offres sponsorisées en tête de liste"] },
  ],
};

const ESPACE_LABELS = { chercheur: "Chercheur d'emploi", prestataire: "Prestataire", entreprise: "Entreprise" };

const LIMIT_LABELS = {
  candidatures: "Candidatures ce mois-ci",
  services: "Services publiés",
  offres: "Offres publiées ce mois-ci",
};

const UPGRADE_REASONS = {
  candidatures: { titre: "Vous avez utilisé toutes vos candidatures du mois", texte: "Avec le profil Premium, postulez sans limite aux offres qui vous intéressent.", limit: "candidatures" },
  formationsPremium: { titre: "Cette formation est réservée au profil Premium", texte: "Débloquez toutes les formations et obtenez les certificats associés.", feature: "formationsPremium" },
  mentorat: { titre: "Le coaching individuel est réservé au profil Premium", texte: "Échangez en tête-à-tête avec un professionnel expérimenté de votre secteur.", feature: "mentorat" },
  services: { titre: "Vous avez atteint le nombre maximum de services", texte: "Publiez autant de services que vous le souhaitez avec le profil Premium.", limit: "services" },
  contreOffre: { titre: "Les contre-propositions sont réservées au profil Premium", texte: "Négociez le tarif d'une mission directement avec le client.", feature: "contreOffre" },
  offres: { titre: "Vous avez publié toutes vos offres du mois", texte: "Publiez davantage d'offres et touchez plus de candidats.", limit: "offres" },
  coordonnees: { titre: "Coordonnées et CV réservés au profil Premium", texte: "Contactez directement les candidats et téléchargez leurs documents.", feature: "coordonnees" },
  contactPrestataires: { titre: "Le contact direct avec les prestataires est réservé au profil Premium", texte: "Échangez avec les artisans et proposez-leur des missions.", feature: "contactPrestataires" },
  accompagnementRegularisation: { titre: "L'accompagnement par un conseiller est inclus dans Premium", texte: "Un conseiller LIGGEEY prépare vos dossiers avec vous et vous oriente vers les bons guichets.", feature: "accompagnementRegularisation" },
  sponsoring: { titre: "Les offres sponsorisées sont réservées au profil Premium", texte: "Placez votre offre en tête des résultats pendant 7 jours.", feature: "sponsoring" },
};

const PREMIUM_FORMATIONS = new Set(["devweb", "excel", "leadership", "entrepreneuriat", "peinture-moderne", "soudure-tech"]);

const SUBS_INITIAL = {
  chercheur: { planId: "essentiel", cycle: "mensuel" },
  prestataire: { planId: "essentiel", cycle: "mensuel" },
  entreprise: { planId: "essentiel", cycle: "mensuel" },
};

const USAGE_INITIAL = {
  chercheur: { candidatures: 3 },
  prestataire: { services: 9 },
  entreprise: { offres: 0 },
};

const PAYMENT_METHODS = [
  { id: "wave", nom: "Wave", couleur: "#1DC8F2", type: "mobile" },
  { id: "om", nom: "Orange Money", couleur: "#FF7900", type: "mobile" },
  { id: "free", nom: "Free Money", couleur: "#CD1E25", type: "mobile" },
  { id: "carte", nom: "Carte bancaire", couleur: COLORS.slate, type: "carte" },
];

const TRANSACTIONS_INITIAL = [
  { id: "t1", ref: "LIG-26-10-0418", date: "07/10/2026", client: "Sonatel SA", espace: "entreprise", offre: "Premium", cycle: "Mensuel", montant: 35000, moyen: "Orange Money", statut: "Payé" },
  { id: "t2", ref: "LIG-26-10-0417", date: "06/10/2026", client: "Fatou Cissé", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 5000, moyen: "Wave", statut: "Payé" },
  { id: "t3", ref: "LIG-26-10-0415", date: "05/10/2026", client: "Moussa Diop", espace: "chercheur", offre: "Premium", cycle: "Annuel", montant: 25000, moyen: "Wave", statut: "Payé" },
  { id: "t4", ref: "LIG-26-10-0411", date: "04/10/2026", client: "Kirène", espace: "entreprise", offre: "Premium", cycle: "Mensuel", montant: 35000, moyen: "Carte bancaire", statut: "Échoué" },
  { id: "t5", ref: "LIG-26-10-0409", date: "03/10/2026", client: "Ibrahima Diallo", espace: "prestataire", offre: "Premium", cycle: "Annuel", montant: 50000, moyen: "Free Money", statut: "Payé" },
  { id: "t6", ref: "LIG-26-10-0402", date: "02/10/2026", client: "Aïcha Ndoye", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 2500, moyen: "Orange Money", statut: "Payé" },
  { id: "t7", ref: "LIG-26-10-0397", date: "01/10/2026", client: "Teranga Capital", espace: "entreprise", offre: "Premium", cycle: "Annuel", montant: 350000, moyen: "Carte bancaire", statut: "Payé" },
  { id: "t8", ref: "LIG-26-09-0388", date: "29/09/2026", client: "Khady Ndiaye", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 5000, moyen: "Wave", statut: "Remboursé" },
  { id: "t9", ref: "LIG-26-09-0381", date: "27/09/2026", client: "Ousmane Fall", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 2500, moyen: "Wave", statut: "Échoué" },
  { id: "t10", ref: "LIG-26-09-0376", date: "25/09/2026", client: "Dakar Bâtiment", espace: "entreprise", offre: "Premium", cycle: "Mensuel", montant: 35000, moyen: "Orange Money", statut: "Payé" },
];

const ABONNES_ADMIN_INITIAL = [
  { id: "ab1", nom: "Sonatel SA", espace: "entreprise", offre: "Premium", cycle: "Mensuel", montant: 35000, depuis: "07/03/2026", prochain: "07/11/2026", statut: "Actif" },
  { id: "ab2", nom: "Teranga Capital", espace: "entreprise", offre: "Premium", cycle: "Annuel", montant: 350000, depuis: "01/10/2026", prochain: "01/10/2027", statut: "Actif" },
  { id: "ab3", nom: "Kirène", espace: "entreprise", offre: "Premium", cycle: "Mensuel", montant: 35000, depuis: "04/06/2026", prochain: "04/10/2026", statut: "Échec de paiement" },
  { id: "ab4", nom: "Dakar Bâtiment", espace: "entreprise", offre: "Premium", cycle: "Mensuel", montant: 35000, depuis: "25/05/2026", prochain: "25/10/2026", statut: "Actif" },
  { id: "ab5", nom: "Fatou Cissé", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 5000, depuis: "06/07/2026", prochain: "06/11/2026", statut: "Actif" },
  { id: "ab6", nom: "Ibrahima Diallo", espace: "prestataire", offre: "Premium", cycle: "Annuel", montant: 50000, depuis: "03/10/2026", prochain: "03/10/2027", statut: "Actif" },
  { id: "ab7", nom: "Khady Ndiaye", espace: "prestataire", offre: "Premium", cycle: "Mensuel", montant: 5000, depuis: "29/08/2026", prochain: "—", statut: "Suspendu" },
  { id: "ab8", nom: "Moussa Diop", espace: "chercheur", offre: "Premium", cycle: "Annuel", montant: 25000, depuis: "05/10/2026", prochain: "05/10/2027", statut: "Actif" },
  { id: "ab9", nom: "Aïcha Ndoye", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 2500, depuis: "02/08/2026", prochain: "02/11/2026", statut: "Actif" },
  { id: "ab10", nom: "Ousmane Fall", espace: "chercheur", offre: "Premium", cycle: "Mensuel", montant: 2500, depuis: "27/07/2026", prochain: "27/09/2026", statut: "Échec de paiement" },
];

const REVENUS_MOIS = [
  { mois: "Mai", montant: 612000 },
  { mois: "Juin", montant: 748000 },
  { mois: "Juil.", montant: 803000 },
  { mois: "Août", montant: 921000 },
  { mois: "Sept.", montant: 1086000 },
  { mois: "Oct.", montant: 1204000 },
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
      const montant = cycle === "annuel" ? target.prixMensuel * 10 : target.prixMensuel;
      const ref = `LIG-26-10-${String(Math.floor(1000 + Math.random() * 8999))}`;
      setSubs((s) => ({ ...s, [espace]: { planId, cycle, moyen, depuis: todayFr(), prochain: todayFr(cycle === "annuel" ? 12 : 1) } }));
      setTransactions((t) => [{ id: `t${Date.now()}`, ref, date: todayFr(), client: user.name, espace, offre: target.nom, cycle: cycle === "annuel" ? "Annuel" : "Mensuel", montant, moyen, statut: "Payé" }, ...t]);
      return { ref, montant, prochain: todayFr(cycle === "annuel" ? 12 : 1) };
    },
    downgrade: () => {
      const free = espacePlans.find((p) => p.prixMensuel === 0);
      if (!free) return;
      setSubs((s) => ({ ...s, [espace]: { planId: free.id, cycle: "mensuel" } }));
      notify(`Vous êtes revenu(e) au profil ${free.nom}.`, "info");
    },
  };
  return api;
}

/* ----- Petits éléments réutilisables ----- */

function PremiumChip({ label = "Premium", locked }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: COLORS.dark, color: COLORS.brandPale }}>
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
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: unlimited ? "#4ADE80" : full ? "#F87171" : COLORS.orange }} />
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

/* ----- Modale d'incitation : s'ouvre quand une action est verrouillée ----- */

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
        <h3 id="upgrade-title" className="text-lg font-bold text-sur-sombre mt-4 mb-1">{reason.titre}</h3>
        <p className="text-sm" style={{ color: COLORS.onDarkMuted }}>{reason.texte}</p>
      </div>

      {target ? (
        <div className="p-6">
          <div className="flex items-baseline justify-between mb-3">
            <p className="font-semibold" style={{ color: COLORS.slate }}>Profil {target.nom}</p>
            <p className="text-sm" style={{ color: COLORS.slateLight }}><span className="text-xl font-bold" style={{ color: COLORS.slate }}>{fcfa(target.prixMensuel)}</span> / mois</p>
          </div>
          <ul className="flex flex-col gap-2 mb-6">
            {target.avantages.slice(0, 4).map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm" style={{ color: COLORS.slate }}>
                <Check size={15} color="#16A34A" className="mt-0.5 shrink-0" /> {a}
              </li>
            ))}
          </ul>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button type="button" onClick={() => { onClose(); onNavigate("abonnement"); }} className="rounded-md px-4 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
              Comparer les profils
            </button>
            <button type="button" onClick={() => { onClose(); api.startPayment(target.id, "mensuel"); }} className="rounded-md px-4 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
              Passer à {target.nom}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-sm" style={{ color: COLORS.slateLight }}>Aucun profil supérieur n'est disponible pour votre espace.</div>
      )}
    </ModalFrame>
  );
}

/* ----- Paiement (simulé) ----- */

function PaymentModal({ planId, initialCycle, onClose }) {
  const api = usePlan();
  const target = api.espacePlans.find((p) => p.id === planId);
  const [cycle, setCycle] = useState(initialCycle || "mensuel");
  const [method, setMethod] = useState("wave");
  const [phone, setPhone] = useState("77 123 45 67");
  const [card, setCard] = useState({ numero: "", expiration: "", cvc: "" });
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState("form"); // form | pending | done
  const [receipt, setReceipt] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  if (!target) return null;

  const m = PAYMENT_METHODS.find((x) => x.id === method);
  const montant = cycle === "annuel" ? target.prixMensuel * 10 : target.prixMensuel;
  const digits = phone.replace(/\D/g, "").replace(/^221/, "");
  const phoneValid = /^7[05678]\d{7}$/.test(digits);
  const cardValid = card.numero.replace(/\D/g, "").length === 16 && /^\d{2}\/\d{2}$/.test(card.expiration) && /^\d{3}$/.test(card.cvc);
  const valid = m.type === "mobile" ? phoneValid : cardValid;

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

  const inputCls = "w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-primaire-400";

  return (
    <ModalFrame onClose={step === "pending" ? () => {} : onClose} labelledBy="pay-title">
      {step === "form" && (
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 id="pay-title" className="text-lg font-bold" style={{ color: COLORS.slate }}>Passer au profil {target.nom}</h3>
              <p className="text-sm" style={{ color: COLORS.slateLight }}>{target.description}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Fermer" className="text-xl leading-none" style={{ color: COLORS.slateLight }}>×</button>
          </div>

          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Durée</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[{ id: "mensuel", label: "Mensuel", sub: `${fcfa(target.prixMensuel)} / mois` }, { id: "annuel", label: "Annuel", sub: `${fcfa(target.prixMensuel * 10)} · 2 mois offerts` }].map((c) => (
              <button key={c.id} type="button" onClick={() => setCycle(c.id)} aria-pressed={cycle === c.id} className="rounded-md border px-3 py-2.5 text-left" style={{ borderColor: cycle === c.id ? COLORS.orange : COLORS.border, background: cycle === c.id ? COLORS.orangeSoft : COLORS.surface }}>
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{c.label}</p>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{c.sub}</p>
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Moyen de paiement</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PAYMENT_METHODS.map((pm) => (
              <button key={pm.id} type="button" onClick={() => { setMethod(pm.id); setTouched(false); }} aria-pressed={method === pm.id} className="rounded-md border px-3 py-2.5 flex items-center gap-2.5 text-sm font-medium" style={{ borderColor: method === pm.id ? COLORS.orange : COLORS.border, color: COLORS.slate, background: method === pm.id ? COLORS.orangeSoft : COLORS.surface }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: pm.couleur }}>
                  {pm.type === "mobile" ? <Smartphone size={12} color="#fff" /> : <CreditCard size={12} color="#fff" />}
                </span>
                {pm.nom}
              </button>
            ))}
          </div>

          {m.type === "mobile" ? (
            <div className="mb-5">
              <label htmlFor="pay-phone" className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Numéro {m.nom}</label>
              <div className="flex">
                <span className="rounded-l-md border border-r-0 px-3 py-2.5 text-sm" style={{ borderColor: COLORS.border, color: COLORS.slateLight, background: COLORS.soft }}>+221</span>
                <input id="pay-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputCls} rounded-l-none`} style={{ borderColor: touched && !phoneValid ? COLORS.danger : COLORS.border }} />
              </div>
              {touched && !phoneValid && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>Saisissez un numéro sénégalais à 9 chiffres, par exemple 77 123 45 67.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="col-span-2">
                <label htmlFor="card-num" className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Numéro de carte</label>
                <input id="card-num" inputMode="numeric" placeholder="4970 1012 3456 7890" value={card.numero} onChange={(e) => setCard((c) => ({ ...c, numero: e.target.value }))} className={inputCls} style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label htmlFor="card-exp" className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Expiration</label>
                <input id="card-exp" placeholder="MM/AA" value={card.expiration} onChange={(e) => setCard((c) => ({ ...c, expiration: e.target.value }))} className={inputCls} style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label htmlFor="card-cvc" className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.slate }}>Code CVC</label>
                <input id="card-cvc" inputMode="numeric" placeholder="123" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} className={inputCls} style={{ borderColor: COLORS.border }} />
              </div>
              {touched && !cardValid && <p className="col-span-2 text-xs" style={{ color: COLORS.danger }}>Vérifiez le numéro (16 chiffres), la date (MM/AA) et le code CVC (3 chiffres).</p>}
            </div>
          )}

          <div className="rounded-md px-4 py-3 mb-5 flex items-center justify-between" style={{ background: COLORS.soft }}>
            <span className="text-sm" style={{ color: COLORS.slateLight }}>Total à payer</span>
            <span className="text-lg font-bold" style={{ color: COLORS.slate }}>{fcfa(montant)}</span>
          </div>

          <button type="button" onClick={pay} className="w-full rounded-md px-4 py-3 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>
            Payer {fcfa(montant)}
          </button>
          <p className="text-xs text-center mt-3 flex items-center justify-center gap-1.5" style={{ color: COLORS.slateLight }}>
            <Lock size={11} /> Paiement sécurisé · résiliable à tout moment
          </p>
        </div>
      )}

      {step === "pending" && (
        <div className="p-8 text-center" aria-live="polite">
          <Loader2 size={32} color={COLORS.orange} className="mx-auto mb-4 animate-spin" />
          <h3 id="pay-title" className="text-lg font-bold mb-1" style={{ color: COLORS.slate }}>
            {m.type === "mobile" ? `Confirmez sur votre téléphone` : "Vérification de la carte"}
          </h3>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>
            {m.type === "mobile" ? `Une demande de paiement ${m.nom} de ${fcfa(montant)} a été envoyée au +221 ${phone}. Saisissez votre code secret pour valider.` : "Votre banque valide le paiement, cela prend quelques secondes."}
          </p>
        </div>
      )}

      {step === "done" && receipt && (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#DCFCE7" }}>
            <CheckCircle2 size={24} color="#16A34A" />
          </div>
          <h3 id="pay-title" className="text-lg font-bold mb-1" style={{ color: COLORS.slate }}>Paiement confirmé</h3>
          <p className="text-sm mb-5" style={{ color: COLORS.slateLight }}>
            Votre profil {target.nom} est actif. Prochain renouvellement le {receipt.prochain}.
          </p>
          <div className="rounded-md px-4 py-3 mb-6 text-left text-sm flex flex-col gap-1.5" style={{ background: COLORS.soft }}>
            <div className="flex justify-between"><span style={{ color: COLORS.slateLight }}>Référence</span><span className="font-semibold" style={{ color: COLORS.slate }}>{receipt.ref}</span></div>
            <div className="flex justify-between"><span style={{ color: COLORS.slateLight }}>Montant</span><span className="font-semibold" style={{ color: COLORS.slate }}>{fcfa(receipt.montant)}</span></div>
            <div className="flex justify-between"><span style={{ color: COLORS.slateLight }}>Moyen</span><span className="font-semibold" style={{ color: COLORS.slate }}>{m.nom}</span></div>
          </div>
          <button type="button" onClick={onClose} className="w-full rounded-md px-4 py-3 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Terminer</button>
        </div>
      )}
    </ModalFrame>
  );
}

/* ----- Écran « Abonnement » (chercheur, prestataire, entreprise) ----- */

function AbonnementScreen() {
  const api = usePlan();
  const { plan, sub, espacePlans } = api;
  const [cycle, setCycle] = useState(sub?.cycle || "mensuel");
  const [confirmDowngrade, setConfirmDowngrade] = useState(false);
  const history = api.transactions.filter((t) => t.espace === api.espace && t.client === api.user.name);
  const isPaid = plan.prixMensuel > 0;
  const limitKeys = Object.keys(plan.limits);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Mon abonnement</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Choisissez le profil adapté à votre activité. Vous pouvez changer ou résilier à tout moment.</p>

      <div className="rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-6" style={{ background: COLORS.dark }}>
        <div>
          <p className="text-sm mb-1" style={{ color: COLORS.onDarkMuted }}>Profil actuel</p>
          <p className="text-2xl font-bold text-sur-sombre flex items-center gap-2">
            {plan.nom} {isPaid && <Crown size={20} color={COLORS.orange} />}
          </p>
          <p className="text-sm mt-1" style={{ color: COLORS.orange }}>
            {isPaid ? `${fcfa(sub.cycle === "annuel" ? plan.prixMensuel * 10 : plan.prixMensuel)} / ${sub.cycle === "annuel" ? "an" : "mois"} · renouvellement le ${sub.prochain}` : "Sans engagement, sans frais"}
          </p>
          {plan.commission !== undefined && <p className="text-sm mt-3" style={{ color: COLORS.onDarkMuted }}>Commission sur vos missions : <span className="text-sur-sombre font-semibold">{plan.commission} %</span></p>}
          {isPaid && (
            <button type="button" onClick={() => setConfirmDowngrade(true)} className="text-xs font-semibold mt-4 underline" style={{ color: COLORS.onDarkMuted }}>
              Résilier l'abonnement
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
        <h2 className="text-xl font-bold" style={{ color: COLORS.slate }}>Choisir votre profil</h2>
        <div className="inline-flex rounded-md border p-0.5" style={{ borderColor: COLORS.border, background: COLORS.surface }} role="group" aria-label="Durée de facturation">
          {[{ id: "mensuel", label: "Mensuel" }, { id: "annuel", label: "Annuel · 2 mois offerts" }].map((c) => (
            <button key={c.id} type="button" onClick={() => setCycle(c.id)} aria-pressed={cycle === c.id} className="rounded px-3 py-1.5 text-sm font-semibold" style={{ background: cycle === c.id ? COLORS.dark : "transparent", color: cycle === c.id ? COLORS.onDark : COLORS.slateLight }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${espacePlans.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"} gap-4 mb-10`}>
        {espacePlans.map((p) => {
          const isCurrent = p.id === plan.id;
          const free = p.prixMensuel === 0;
          const price = cycle === "annuel" ? p.prixMensuel * 10 : p.prixMensuel;
          const sameCycle = free || sub.cycle === cycle;
          let cta;
          if (isCurrent && sameCycle) cta = { label: "Profil actuel", disabled: true };
          else if (free) cta = { label: `Revenir à ${p.nom}`, onClick: () => setConfirmDowngrade(true), secondary: true };
          else if (isCurrent) cta = { label: cycle === "annuel" ? "Passer en annuel" : "Passer en mensuel", onClick: () => api.startPayment(p.id, cycle) };
          else cta = { label: p.prixMensuel > plan.prixMensuel ? `Passer à ${p.nom}` : `Choisir ${p.nom}`, onClick: () => api.startPayment(p.id, cycle) };
          return (
            <div key={p.id} className="rounded-lg bg-surface p-6 flex flex-col relative" style={{ border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? COLORS.orange : COLORS.border}` }}>
              <div className="flex items-center justify-between mb-1 min-h-[24px]">
                <p className="font-bold text-lg" style={{ color: COLORS.slate }}>{p.nom}</p>
                {p.recommande && !isCurrent && <PremiumChip label="Recommandé" />}
                {isCurrent && <span className="text-xs font-semibold" style={{ color: COLORS.orange }}>Votre profil</span>}
              </div>
              <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>{p.description}</p>
              <p className="mb-5">
                <span className="text-3xl font-bold" style={{ color: COLORS.slate }}>{free ? "0" : fcfa(price).replace(" FCFA", "")}</span>
                <span className="text-sm ml-1" style={{ color: COLORS.slateLight }}>FCFA / {cycle === "annuel" ? "an" : "mois"}</span>
              </p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {p.avantages.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm" style={{ color: COLORS.slate }}>
                    <Check size={15} color={free ? COLORS.slateLight : "#16A34A"} className="mt-0.5 shrink-0" /> {a}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={cta.disabled}
                onClick={cta.onClick}
                className="w-full rounded-md px-4 py-2.5 text-sm font-semibold"
                style={cta.disabled ? { background: COLORS.softStrong, color: COLORS.slateLight, cursor: "default" } : cta.secondary ? { border: `1px solid ${COLORS.border}`, color: COLORS.slate } : { background: COLORS.orange, color: COLORS.onOrange }}
              >
                {cta.label}
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.slate }}>Historique des paiements</h2>
      <div className="rounded-lg border bg-surface overflow-x-auto" style={{ borderColor: COLORS.border }}>
        {history.length === 0 ? (
          <div className="p-6 text-sm flex items-center gap-2" style={{ color: COLORS.slateLight }}>
            <Receipt size={16} /> Aucun paiement pour l'instant. Vos reçus apparaîtront ici après votre premier abonnement.
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
            <h3 id="downgrade-title" className="text-lg font-bold mb-2" style={{ color: COLORS.slate }}>Résilier le profil {plan.nom} ?</h3>
            <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Vous reviendrez au profil Essentiel et perdrez l'accès à :</p>
            <ul className="flex flex-col gap-1.5 mb-6">
              {plan.avantages.slice(0, 3).map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm" style={{ color: COLORS.slate }}><X size={14} color={COLORS.danger} className="mt-0.5 shrink-0" /> {a}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDowngrade(false)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Garder mon offre</button>
              <button type="button" onClick={() => { api.downgrade(); setConfirmDowngrade(false); }} className="rounded-md px-4 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Résilier</button>
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

  const tabs = [{ id: "abonnes", label: "Abonnés" }, { id: "transactions", label: "Transactions" }, { id: "tarifs", label: "Profils et tarifs" }];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Abonnements</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Suivez les revenus, gérez les abonnés et ajustez les profils de chaque espace.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CreditCard} value={fcfa(mrr)} label="Revenu mensuel récurrent" />
        <StatCard icon={Crown} value={actifs.length} label="Abonnés payants actifs" />
        <StatCard icon={Sparkles} value="6,8 %" label="Conversion gratuit → payant" />
        <StatCard icon={AlertCircle} value={echecs} label="Paiements échoués" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4 mb-8">
        <div className="rounded-lg border bg-surface p-5" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Revenus des abonnements (6 derniers mois)</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUS_MOIS}>
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: COLORS.slateLight }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.slateLight }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} width={40} />
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

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); setPage(1); }} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: tab === t.id ? COLORS.orange : COLORS.surface, color: tab === t.id ? COLORS.onOrange : COLORS.slate, border: `1px solid ${tab === t.id ? COLORS.orange : COLORS.border}` }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "tarifs" && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder={tab === "abonnes" ? "Rechercher un abonné..." : "Rechercher un client ou une référence..."} className="rounded-md border px-4 py-2.5 text-sm outline-none focus:border-primaire-400 flex-1 max-w-xs" style={{ borderColor: COLORS.border }} />
            <select value={espaceFilter} onChange={(e) => { setEspaceFilter(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2.5 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }} aria-label="Filtrer par espace">
              <option value="tous">Tous les espaces</option>
              <option value="chercheur">Chercheurs d'emploi</option>
              <option value="prestataire">Prestataires</option>
              <option value="entreprise">Entreprises</option>
            </select>
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
                      {a.statut === "Échec de paiement" && <button type="button" onClick={() => notify(`Relance de paiement envoyée à ${a.nom}.`)} className="text-xs font-semibold mr-3" style={{ color: COLORS.orange }}>Relancer</button>}
                      <button type="button" onClick={() => { setAbonnes((l) => l.map((x) => (x.id === a.id ? { ...x, statut: x.statut === "Suspendu" ? "Actif" : "Suspendu" } : x))); notify(a.statut === "Suspendu" ? `Abonnement de ${a.nom} réactivé.` : `Abonnement de ${a.nom} suspendu.`, "info"); }} className="text-xs font-semibold" style={{ color: a.statut === "Suspendu" ? "#16A34A" : COLORS.danger }}>
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
                      {t.statut === "Échoué" && <button type="button" onClick={() => notify(`Relance de paiement envoyée à ${t.client}.`)} className="text-xs font-semibold" style={{ color: COLORS.orange }}>Relancer</button>}
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
          <p className="text-sm mb-4" style={{ color: COLORS.slateLight }}>Les prix et quotas modifiés ici s'appliquent immédiatement aux écrans « Abonnement » de chaque espace.</p>
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
                        <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }} htmlFor={`prix-${esp}-${p.id}`}>Prix mensuel (FCFA)</label>
                        <input id={`prix-${esp}-${p.id}`} type="number" min={0} step={500} disabled={p.prixMensuel === 0 && p.id === draft[esp][0].id} value={p.prixMensuel} onChange={(e) => setPlanField(esp, p.id, "prix", Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-md border px-3 py-2 text-sm mb-3 bg-surface outline-none focus:border-primaire-400 disabled:opacity-60" style={{ borderColor: COLORS.border }} />
                        <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.slateLight }} htmlFor={`lim-${esp}-${p.id}`}>{LIMIT_LABELS[limitKey]}</label>
                        <div className="flex items-center gap-2">
                          <input id={`lim-${esp}-${p.id}`} type="number" min={1} disabled={lim === UNLIMITED} value={lim === UNLIMITED ? "" : lim} placeholder="Illimité" onChange={(e) => setPlanField(esp, p.id, limitKey, Math.max(1, Number(e.target.value) || 1))} className="flex-1 min-w-0 rounded-md border px-3 py-2 text-sm bg-surface outline-none focus:border-primaire-400 disabled:opacity-60" style={{ borderColor: COLORS.border }} />
                          <label className="flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: COLORS.slate }}>
                            <input type="checkbox" checked={lim === UNLIMITED} onChange={(e) => setPlanField(esp, p.id, limitKey, e.target.checked ? UNLIMITED : 5)} /> Illimité
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
            <button type="button" disabled={!dirty} onClick={() => setDraft(api.plans)} className="rounded-md px-5 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate, opacity: dirty ? 1 : 0.5 }}>Annuler les modifications</button>
            <button type="button" disabled={!dirty} onClick={() => { api.setPlans(draft); notify("Tarifs et quotas enregistrés."); }} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: dirty ? 1 : 0.5 }}>Enregistrer les tarifs</button>
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
    ["Mentorat individuel", "—", "Inclus"],
  ],
  prestataire: [
    ["Position dans les recherches", "Standard", "Prioritaire"],
    ["Badge sur le profil", "—", "Badge Premium"],
    ["Commission par mission", "15 %", "8 %"],
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
  { nom: "Sonatel", quand: "Aujourd'hui" },
  { nom: "Teranga Capital", quand: "Hier" },
  { nom: "Wave Mobile", quand: "Il y a 3 jours" },
];

function isPremiumPlan(plan) {
  return !!plan && plan.prixMensuel > 0;
}

function TierBadge({ premium, size = "md" }) {
  const cls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1";
  return premium ? (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.dark, color: COLORS.brandPale }}>
      <Crown size={size === "sm" ? 10 : 12} color={COLORS.orange} /> Premium
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.softStrong, color: COLORS.slateLight }}>
      Essentiel
    </span>
  );
}

function ProfileTierBadge() {
  const api = usePlan();
  if (!api || api.isAdmin) return null;
  return <TierBadge premium={isPremiumPlan(api.plan)} />;
}

function ProfileTierCard() {
  const api = usePlan();
  if (!api || api.isAdmin) return null;
  const premium = isPremiumPlan(api.plan);
  const premiumPlan = api.espacePlans.find((p) => p.prixMensuel > 0);
  const rows = PROFILE_TIER_PERKS[api.espace] || [];

  return (
    <div className="rounded-lg bg-surface mb-4 overflow-hidden" style={{ border: `1px solid ${premium ? COLORS.orange : COLORS.border}` }}>
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ background: premium ? COLORS.dark : COLORS.soft }}>
        <div>
          <p className="font-semibold" style={{ color: premium ? COLORS.onDark : COLORS.slate }}>
            {premium ? "Votre profil est Premium" : "Votre profil est Essentiel"}
          </p>
          <p className="text-sm" style={{ color: premium ? COLORS.onDarkMuted : COLORS.slateLight }}>
            {premium ? `Actif jusqu'au ${api.sub.prochain || "prochain renouvellement"}.` : "Passez au profil Premium pour être vu en priorité."}
          </p>
        </div>
        {!premium && premiumPlan && (
          <button type="button" onClick={() => api.startPayment(premiumPlan.id, "mensuel")} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre inline-flex items-center gap-1.5" style={{ background: COLORS.orange }}>
            <Crown size={14} /> Passer au profil Premium · {fcfa(premiumPlan.prixMensuel)}/mois
          </button>
        )}
      </div>

      {premium && api.espace === "chercheur" && (
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-x-8 gap-y-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <p className="text-2xl font-bold" style={{ color: COLORS.slate }}>48</p>
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
          <TrendingUp size={18} color="#16A34A" />
          <p className="text-sm" style={{ color: COLORS.slate }}>
            {api.espace === "prestataire" ? "Votre profil s'affiche en priorité : 3,2 fois plus de vues que le mois dernier." : "Vos offres portent le badge Recruteur Premium et remontent dans les résultats."}
          </p>
        </div>
      )}

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
    </div>
  );
}

/* Niveaux affichés pour les autres utilisateurs (vus par les entreprises et l'admin) */
const PREMIUM_CANDIDATS = new Set(["c1", "c3", "c8"]);
const PREMIUM_PRESTATAIRES = new Set(["p1", "p3", "p5"]);
const PRESTATAIRES_REGULARISES = new Set(["p1", "p3", "p4", "p5"]);

function adminTier(nom, espace) {
  return ABONNES_ADMIN_INITIAL.some((a) => a.nom === nom && a.espace === espace && a.statut !== "Suspendu") ? "Premium" : "Essentiel";
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
  const ancien = 1 + (h % 3);
  return {
    bio: m.tagline || `${m.role} avec ${m.exp} ans d'expérience. ${m.nom.split(" ")[0]} accompagne les professionnels qui veulent progresser dans son domaine.`,
    langues: ["Français", "Wolof", ...(h % 2 ? ["Anglais"] : [])],
    formats: ["Visio", "Téléphone", ...(h % 3 === 0 ? [] : ["Présentiel à Dakar"])],
    stats: m.stats || { mentores: 6 + (h % 20), note: `${(4.3 + (h % 7) / 10).toFixed(1)}/5`, anciennete: `${ancien} an${ancien > 1 ? "s" : ""}`, heures: 20 + (h % 90) },
    parcours: [
      { poste: m.role, structure: emp(0), periode: `${pivot} – aujourd'hui`, description: "Pilote une équipe et forme les nouvelles recrues sur le terrain." },
      { poste: "Mentor bénévole", structure: "LIGGEEY", periode: `${2026 - ancien} – aujourd'hui`, description: "Accompagnement individuel de jeunes professionnels et de personnes en reconversion." },
      { poste: "Postes à responsabilité", structure: emp(4), periode: `${milieu} – ${pivot}`, description: "Gestion de projets et encadrement d'équipes de terrain." },
      { poste: "Débuts professionnels", structure: emp(7), periode: `${debut} – ${milieu}`, description: "Premières expériences et apprentissage du métier." },
    ],
    themes: m.competences ? m.competences.slice(0, 6) : ["Orientation professionnelle", "Développement des compétences", "Préparation d'entretien", "Gestion de carrière"],
  };
}

function defaultCoachings(m) {
  if (!m.historique) return { upcoming: [], history: [] };
  const history = m.historique.map((x, i) => {
    const hasColon = x.note.includes(":");
    const theme = hasColon ? x.note.split(":")[0].trim() : x.note.split(" ").slice(0, 2).join(" ");
    return { id: `h${i}`, date: x.date, theme, compteRendu: hasColon ? x.note.split(":").slice(1).join(":").trim() : x.note, duree: "1 h", format: i === m.historique.length - 1 ? "Présentiel" : "Visio", note: i === 0 ? null : 5 };
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
        const label = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
        out.push(`${label.charAt(0).toUpperCase() + label.slice(1)} · ${hr}h00 – ${hr + 1}h00`);
      }
    }
  }
  return out;
}

function BookingPanel({ profile, title, submitLabel, onConfirm, onCancel }) {
  const slots = React.useMemo(() => nextSlots(6), []);
  const [slot, setSlot] = useState(null);
  const [theme, setTheme] = useState(profile.themes[0]);
  const [format, setFormat] = useState(profile.formats[0]);
  const [message, setMessage] = useState("");
  return (
    <div className="rounded-lg border bg-surface p-5 mb-4" style={{ borderColor: COLORS.orange }}>
      <h4 className="font-semibold mb-3" style={{ color: COLORS.slate }}>{title}</h4>
      <p className="text-xs font-semibold mb-2" style={{ color: COLORS.slateLight }}>Créneaux disponibles</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {slots.map((s) => (
          <button key={s} type="button" onClick={() => setSlot(s)} aria-pressed={slot === s} className="rounded-md border px-3 py-2 text-sm text-left" style={{ borderColor: slot === s ? COLORS.orange : COLORS.border, background: slot === s ? COLORS.orangeSoft : COLORS.surface, color: COLORS.slate }}>
            {s}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <label className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>
          Sujet de la séance
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
            {profile.themes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>
          Format
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
            {profile.formats.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-xs font-semibold mb-4" style={{ color: COLORS.slateLight }}>
        Message au mentor (facultatif)
        <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ce que vous aimeriez travailler pendant la séance…" className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border, color: COLORS.slate }} />
      </label>
      <div className="flex gap-2">
        <button type="button" disabled={!slot} onClick={() => onConfirm({ date: slot, theme, format, message })} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: slot ? 1 : 0.5 }}>{submitLabel}</button>
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
      </div>
    </div>
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

  return (
    <div>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: COLORS.orange }}>
        <ArrowLeft size={14} /> Retour aux mentors
      </button>

      <div className="rounded-lg p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5" style={{ background: COLORS.dark }}>
        <div className="flex items-center gap-4 min-w-0">
          <SafeImg src={mentor.photo} alt={mentor.nom} className="w-16 h-16 rounded-full object-cover border-2 shrink-0" style={{ borderColor: COLORS.orange }} />
          <div className="min-w-0">
            <p className="text-xl font-bold text-sur-sombre">{mentor.nom}</p>
            <p className="text-sm mb-1" style={{ color: COLORS.orange }}>{mentor.role} · {mentor.exp} ans d'expérience</p>
            <p className="text-sm text-white/60">{profile.bio}</p>
            <p className="text-xs mt-2" style={{ color: COLORS.onDarkSubtle }}>Parle {profile.langues.join(", ")} · {profile.formats.join(", ")}</p>
          </div>
        </div>
        <button type="button" onClick={openBooking} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre shrink-0 inline-flex items-center gap-1.5 self-start md:self-auto" style={{ background: COLORS.orange }}>
          {locked ? <Lock size={14} /> : <Calendar size={14} />} Réserver un coaching
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatMini value={profile.stats.mentores} label="Mentorés accompagnés" />
        <StatMini value={profile.stats.note} label="Note de satisfaction" />
        <StatMini value={profile.stats.anciennete} label="Sur LIGGEEY" />
        <StatMini value={profile.stats.heures} label="Heures de mentorat" />
      </div>

      <div className="flex flex-wrap gap-2 mb-5" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: tab === t.id ? COLORS.orange : COLORS.surface, color: tab === t.id ? COLORS.onOrange : COLORS.slate, border: `1px solid ${tab === t.id ? COLORS.orange : COLORS.border}` }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profil" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4">
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Parcours professionnel</h3>
            <ol className="relative">
              {profile.parcours.map((p, i) => (
                <li key={i} className="flex gap-3 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ background: i === 0 ? COLORS.orange : COLORS.border }} />
                    {i < profile.parcours.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: COLORS.border }} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{p.poste} · {p.structure}</p>
                    <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{p.periode}</p>
                    <p className="text-sm" style={{ color: COLORS.slateLight }}>{p.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Domaines d'accompagnement</h3>
            <div className="flex flex-wrap gap-2">
              {(mentor.competences || profile.themes).map((c) => (
                <span key={c} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{c}</span>
              ))}
            </div>
          </div>
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
              <button type="button" onClick={openBooking} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre inline-flex items-center gap-1.5" style={{ background: COLORS.orange }}>
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
                    <button type="button" onClick={() => { onUpdate((c) => ({ ...c, upcoming: c.upcoming.filter((x) => x.id !== u.id) })); setToCancel(null); notify("Séance annulée. Le mentor a été prévenu.", "info"); }} className="rounded-md px-3 py-1.5 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Oui, annuler</button>
                    <button type="button" onClick={() => setToCancel(null)} className="rounded-md px-3 py-1.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Non</button>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {u.format !== "Présentiel à Dakar" && (
                      <button type="button" onClick={() => notify(`Connexion à la séance avec ${mentor.nom}…`)} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Rejoindre</button>
                    )}
                    <button type="button" onClick={() => setBooking({ mode: "move", id: u.id })} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Reprogrammer</button>
                    <button type="button" onClick={() => setToCancel(u.id)} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ color: COLORS.danger }}>Annuler</button>
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
              Vous n'avez pas encore eu de séance avec {prenom}. Les comptes rendus apparaîtront ici après chaque coaching.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.slate }}>Mes notes personnelles</h3>
            <textarea value={note} onChange={(e) => { setNote(e.target.value); setSaved(false); }} placeholder="Ajoutez vos notes ici..." rows={4} className="w-full rounded-md border px-4 py-3 text-sm outline-none focus:border-primaire-400 mb-3" style={{ borderColor: COLORS.border }} />
            <button type="button" onClick={() => setSaved(true)} className="rounded-md px-5 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Enregistrer</button>
            {saved && <span className="ml-3 text-sm" style={{ color: "#047857" }}>Note enregistrée.</span>}
          </div>
        </div>
      )}
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
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
function joursDepuis(iso) {
  return Math.max(0, Math.floor((DEMO_TODAY.getTime() - new Date(`${iso}T00:00:00`).getTime()) / JOUR_MS));
}

const JALONS = [
  { id: "j7", jour: 7, label: "Point d'étape de la première semaine" },
  { id: "j30", jour: 30, label: "Bilan du premier mois" },
  { id: "j60", jour: 60, label: "Point à mi-parcours" },
  { id: "j90", jour: 90, label: "Fin de la période d'essai" },
  { id: "j180", jour: 180, label: "Bilan à six mois" },
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
  { id: "o2", label: "Suivre la formation d'accueil sur les outils clients" },
  { id: "o3", label: "Traiter ses premiers dossiers en autonomie" },
  { id: "o4", label: "Faire un point objectifs avec son manager" },
  { id: "o5", label: "Valider la période d'essai" },
];

const CHECKIN_QUESTIONS = [
  { id: "missions", label: "Vos missions correspondent-elles à l'offre ?" },
  { id: "formation", label: "Avez-vous été formé(e) ou accompagné(e) à votre arrivée ?" },
  { id: "salaire", label: "Votre salaire est-il versé à temps ?" },
  { id: "integration", label: "Vous sentez-vous bien intégré(e) dans l'équipe ?" },
];
const HUMEURS = ["Très difficile", "Difficile", "Correct", "Bien", "Très bien"];
const TYPES_SIGNALEMENT = ["Retard ou absence de salaire", "Missions différentes de l'offre", "Conditions de travail", "Conflit avec la hiérarchie ou l'équipe", "Contrat non remis", "Autre"];

const SUIVI_CHERCHEUR_INITIAL = {
  reponses: {
    j7: { humeur: 4, reponses: { missions: "Oui", formation: "Oui", salaire: "Oui", integration: "Oui" }, commentaire: "Très bon accueil de l'équipe. Beaucoup à apprendre sur les outils internes." },
  },
  objectifs: { o1: true, o2: true },
};

const SIGNALEMENTS_INITIAL = [
  { id: "s1", date: "09/10/2026", auteur: "Modou Faye", espace: "chercheur", concerne: "Dakar Bâtiment · Aide-maçon", type: "Retard ou absence de salaire", description: "Le salaire de septembre n'a toujours pas été versé.", statut: "Ouvert" },
  { id: "s2", date: "02/10/2026", auteur: "Thiès Électrique", espace: "entreprise", concerne: "Alioune Ndiaye · Électricien", type: "Absences répétées", description: "Trois absences non justifiées depuis la prise de poste.", statut: "Traité" },
];

const RECRUES_INITIAL = [
  { id: "r1", nom: "Ibrahima Diallo", poste: "Soudeur TIG/MIG", contrat: "CDD 12 mois", dateIso: isoFromOffset(-57), statut: "En période d'essai", ressenti: 4, evaluations: { j7: { competences: 4, integration: 4, ponctualite: 5, commentaire: "Bonne prise en main des postes de soudure." }, j30: { competences: 4, integration: 4, ponctualite: 4, commentaire: "Autonome sur les travaux courants." } } },
  { id: "r2", nom: "Aissatou Gueye", poste: "Chef d'équipe électricité", contrat: "CDI", dateIso: isoFromOffset(-35), statut: "À risque", ressenti: 2, evaluations: { j7: { competences: 5, integration: 2, ponctualite: 4, commentaire: "A du mal à s'imposer auprès de l'équipe déjà en place." } } },
  { id: "r3", nom: "Khadim Sarr", poste: "Maçon coffreur", contrat: "CDI", dateIso: isoFromOffset(-150), statut: "Confirmé", ressenti: 5, evaluations: { j7: { competences: 4, integration: 5, ponctualite: 5, commentaire: "Très bon départ." }, j30: { competences: 4, integration: 5, ponctualite: 5, commentaire: "Fiable." }, j60: { competences: 5, integration: 5, ponctualite: 5, commentaire: "Prend des initiatives." }, j90: { competences: 5, integration: 5, ponctualite: 5, commentaire: "Embauche confirmée." } } },
];

const PLACEMENTS_AUTRES = [
  { id: "pl1", nom: "Moussa Diop", entreprise: "Senelec", poste: "Technicien réseau", jour: 120, statut: "Confirmé" },
  { id: "pl2", nom: "Modou Faye", entreprise: "Dakar Bâtiment", poste: "Aide-maçon", jour: 38, statut: "À risque" },
  { id: "pl3", nom: "Awa Ndiaye", entreprise: "Teranga Capital", poste: "Assistante comptable", jour: 74, statut: "En période d'essai" },
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
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm" style={{ color: COLORS.slate }}>{label}</span>
      <div className="flex gap-0.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} sur 5`} onClick={() => onChange(n)}>
            <Star size={18} color={COLORS.orange} fill={n <= value ? COLORS.orange : "none"} />
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
  const complete = humeur > 0 && CHECKIN_QUESTIONS.every((q) => rep[q.id]);
  return (
    <div className="rounded-md p-4 mt-3" style={{ background: COLORS.soft }}>
      <p className="text-sm font-semibold mb-2" style={{ color: COLORS.slate }}>Comment se passe votre poste en ce moment ?</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {HUMEURS.map((h, i) => (
          <button key={h} type="button" onClick={() => setHumeur(i + 1)} aria-pressed={humeur === i + 1} className="rounded-full px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: humeur === i + 1 ? COLORS.orange : COLORS.border, background: humeur === i + 1 ? COLORS.orange : COLORS.surface, color: humeur === i + 1 ? COLORS.onOrange : COLORS.slate }}>
            {h}
          </button>
        ))}
      </div>
      {CHECKIN_QUESTIONS.map((q) => (
        <div key={q.id} className="flex items-center justify-between gap-3 py-1.5 flex-wrap">
          <span className="text-sm" style={{ color: COLORS.slate }}>{q.label}</span>
          <div className="flex gap-1">
            {["Oui", "En partie", "Non"].map((o) => (
              <button key={o} type="button" onClick={() => setRep((r) => ({ ...r, [q.id]: o }))} aria-pressed={rep[q.id] === o} className="rounded-md px-2.5 py-1 text-xs font-semibold border" style={{ borderColor: rep[q.id] === o ? COLORS.slate : COLORS.border, background: rep[q.id] === o ? COLORS.dark : COLORS.surface, color: rep[q.id] === o ? COLORS.onDark : COLORS.slate }}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <textarea rows={2} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Un commentaire pour votre référente LIGGEEY (facultatif)" className="w-full rounded-md border px-3 py-2 text-sm mt-3 outline-none focus:border-primaire-400 bg-surface" style={{ borderColor: COLORS.border }} />
      <div className="flex gap-2 mt-3">
        <button type="button" disabled={!complete} onClick={() => onSubmit({ humeur, reponses: rep, commentaire })} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: complete ? 1 : 0.5 }}>Envoyer le point de suivi</button>
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold border bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Plus tard</button>
      </div>
      {!complete && <p className="text-xs mt-2" style={{ color: COLORS.slateLight }}>Répondez à toutes les questions pour envoyer le point de suivi.</p>}
    </div>
  );
}

function SignalementForm({ types, onSubmit, onCancel, intro }) {
  const [type, setType] = useState(types[0]);
  const [description, setDescription] = useState("");
  return (
    <div className="rounded-md p-4" style={{ background: COLORS.soft }}>
      {intro && <p className="text-xs mb-3" style={{ color: COLORS.slateLight }}>{intro}</p>}
      <label className="block text-xs font-semibold mb-3" style={{ color: COLORS.slateLight }}>
        Type de difficulté
        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="block text-xs font-semibold mb-3" style={{ color: COLORS.slateLight }}>
        Décrivez la situation
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400 bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }} />
      </label>
      <div className="flex gap-2">
        <button type="button" disabled={!description.trim()} onClick={() => onSubmit({ type, description })} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre inline-flex items-center gap-1.5" style={{ background: COLORS.orange, opacity: description.trim() ? 1 : 0.5 }}><Flag size={14} /> Envoyer le signalement</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold border bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>}
      </div>
    </div>
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
      notify(`Merci. ${e.referent.nom} a été prévenue et vous recontactera sous 48 h.`, "info");
    } else {
      notify("Point de suivi envoyé. Merci !");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Suivi post-embauche</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>LIGGEEY reste à vos côtés pendant les six premiers mois de votre nouveau poste.</p>

      <div className="rounded-lg p-6 mb-6" style={{ background: COLORS.dark }}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p className="text-xl font-bold text-sur-sombre">{e.poste} · {e.entreprise}</p>
            <p className="text-sm" style={{ color: COLORS.onDarkMuted }}>{e.contrat} · {e.ville} · Responsable : {e.manager}</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: COLORS.darkLine, color: COLORS.orange }}>En poste depuis {jour} jours</span>
        </div>
        <div className="flex justify-between text-sm mb-1.5">
          <span style={{ color: COLORS.onDarkMuted }}>Période d'essai</span>
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
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: statut === "Fait" ? "#DCFCE7" : statut === "À compléter" ? COLORS.orange : COLORS.softStrong, color: statut === "Fait" ? "#16A34A" : statut === "À compléter" ? COLORS.onOrange : COLORS.slateLight }}>
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
                        <button type="button" onClick={() => setOpenJalon(j.id)} className="rounded-md px-3 py-1.5 text-xs font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Répondre</button>
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
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(e.referent.nom)}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{e.referent.nom}</p>
                <p className="text-xs" style={{ color: COLORS.slateLight }}>{e.referent.role}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button type="button" onClick={() => notify(`Appel vers ${e.referent.telephone}…`)} className="rounded-md px-3 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.border, color: COLORS.slate }}><Phone size={14} /> Appeler</button>
              <button type="button" onClick={() => notify(`Demande de rendez-vous envoyée à ${e.referent.nom}.`)} className="rounded-md px-3 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.border, color: COLORS.slate }}><Calendar size={14} /> Prendre rendez-vous</button>
            </div>
          </div>

          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: COLORS.slate }}>Objectifs d'intégration</h3>
              <span className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>{objectifsFaits}/{OBJECTIFS_INTEGRATION.length}</span>
            </div>
            <div className="mb-3"><ProgressBar pct={(objectifsFaits / OBJECTIFS_INTEGRATION.length) * 100} color="#16A34A" /></div>
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
            <p className="text-sm" style={{ color: COLORS.slateLight }}>Votre référente traite chaque signalement. Votre employeur n'est contacté qu'avec votre accord.</p>
          </div>
          {!signalOpen && <button type="button" onClick={() => setSignalOpen(true)} className="rounded-md px-4 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.orange, color: COLORS.orange }}><Flag size={14} /> Signaler une difficulté</button>}
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
  const ok = v.competences && v.integration && v.ponctualite;
  return (
    <div className="rounded-md p-4 mt-3" style={{ background: COLORS.soft }}>
      <RatingInput label="Compétences techniques" value={v.competences} onChange={(n) => setV((s) => ({ ...s, competences: n }))} />
      <RatingInput label="Intégration dans l'équipe" value={v.integration} onChange={(n) => setV((s) => ({ ...s, integration: n }))} />
      <RatingInput label="Ponctualité et assiduité" value={v.ponctualite} onChange={(n) => setV((s) => ({ ...s, ponctualite: n }))} />
      <textarea rows={2} value={v.commentaire} onChange={(e) => setV((s) => ({ ...s, commentaire: e.target.value }))} placeholder="Commentaire (facultatif)" className="w-full rounded-md border px-3 py-2 text-sm mt-2 outline-none focus:border-primaire-400 bg-surface" style={{ borderColor: COLORS.border }} />
      <div className="flex gap-2 mt-3">
        <button type="button" disabled={!ok} onClick={() => onSubmit(v)} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: ok ? 1 : 0.5 }}>Enregistrer l'évaluation</button>
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold border bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
      </div>
    </div>
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
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: COLORS.slate }}>{r.nom} <StatusBadge status={r.statut} /></h1>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>{r.poste} · {r.contrat} · en poste depuis {jour} jours</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {r.statut !== "Confirmé" && (
            <button type="button" onClick={() => { onUpdate({ statut: "Confirmé" }); notify(`Embauche de ${r.nom} confirmée.`); }} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre inline-flex items-center gap-1.5" style={{ background: "#16A34A" }}><UserCheck size={14} /> Confirmer l'embauche</button>
          )}
          <button type="button" onClick={() => setSignalOpen((o) => !o)} className="rounded-md px-4 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.orange, color: COLORS.orange }}><Flag size={14} /> Signaler un problème</button>
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
                    <button type="button" onClick={() => setOpenJalon(j.id)} className="rounded-md px-3 py-1.5 text-xs font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Évaluer</button>
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
            <h3 className="font-semibold mb-3" style={{ color: COLORS.slate }}>Période d'essai</h3>
            <p className="text-sm mb-2" style={{ color: COLORS.slateLight }}>{jour >= DUREE_ESSAI ? "Terminée" : `Jour ${jour} sur ${DUREE_ESSAI} · fin le ${frLongDate(jalonDate(r.dateIso, DUREE_ESSAI))}`}</p>
            <ProgressBar pct={(jour / DUREE_ESSAI) * 100} />
          </div>
          <div className="rounded-lg border bg-surface p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.slate }}>Ressenti de la recrue</h3>
            <p className="text-xs mb-3" style={{ color: COLORS.slateLight }}>Partagé par la recrue lors de son dernier point de suivi.</p>
            <p className="text-lg font-bold" style={{ color: r.ressenti <= 2 ? COLORS.danger : r.ressenti >= 4 ? "#16A34A" : COLORS.slate }}>{HUMEURS[r.ressenti - 1]}</p>
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
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Suivi des recrues</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Accompagnez vos nouvelles recrues jusqu'à la fin de leur période d'essai et au-delà.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <button key={r.id} type="button" onClick={() => setSelectedId(r.id)} className="w-full text-left rounded-lg border bg-surface px-5 py-4 grid grid-cols-1 md:grid-cols-[1.4fr,1.2fr,1fr,auto] gap-3 md:items-center hover:shadow-md transition-shadow" style={{ borderColor: r.statut === "À risque" ? "#FCA5A5" : COLORS.border }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: COLORS.orangeSoft, color: COLORS.orange }}>{initials(r.nom)}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: COLORS.slate }}>{r.nom}</p>
                  <p className="text-xs truncate" style={{ color: COLORS.slateLight }}>{r.poste} · {r.contrat}</p>
                </div>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{jour >= DUREE_ESSAI ? "Période d'essai terminée" : `Essai : jour ${jour}/${DUREE_ESSAI}`}</p>
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
    { id: "pl0", nom: "Absatou Diallo", entreprise: EMBAUCHE_CHERCHEUR.entreprise, poste: EMBAUCHE_CHERCHEUR.poste, jour: joursDepuis(EMBAUCHE_CHERCHEUR.dateIso), statut: "En période d'essai" },
    ...recrues.map((r) => ({ id: r.id, nom: r.nom, entreprise: "Senegal Construction SARL", poste: r.poste, jour: joursDepuis(r.dateIso), statut: r.statut })),
    ...PLACEMENTS_AUTRES,
  ];
  const ouverts = signalements.filter((s) => s.statut === "Ouvert");
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Suivi post-embauche</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Suivez les personnes placées via LIGGEEY et traitez les signalements des recrues et des employeurs.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={HeartHandshake} value={placements.length} label="Placements suivis" />
        <StatCard icon={TrendingUp} value="87 %" label="Toujours en poste à 3 mois" />
        <StatCard icon={AlertCircle} value={placements.filter((p) => p.statut === "À risque").length} label="Placements à risque" />
        <StatCard icon={Flag} value={ouverts.length} label="Signalements ouverts" />
      </div>

      <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.slate }}>Signalements</h2>
      <div className="flex flex-col gap-3 mb-8">
        {signalements.map((s) => (
          <div key={s.id} className="rounded-lg border bg-surface p-5 flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: s.statut === "Ouvert" ? "#FCA5A5" : COLORS.border }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{s.type}</p>
              <p className="text-xs mb-1" style={{ color: COLORS.slateLight }}>{s.date} · par {s.auteur} ({ESPACE_LABELS[s.espace]}) · concerne {s.concerne}</p>
              <p className="text-sm" style={{ color: COLORS.slate }}>{s.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={s.statut} />
              {s.statut === "Ouvert" && (
                <>
                  <button type="button" onClick={() => notify(`Prise de contact avec ${s.auteur} enregistrée.`)} className="rounded-md px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Contacter</button>
                  <button type="button" onClick={() => { setSignalements((l) => l.map((x) => (x.id === s.id ? { ...x, statut: "Traité" } : x))); notify("Signalement marqué comme traité."); }} className="rounded-md px-3 py-1.5 text-xs font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Marquer traité</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.slate }}>Placements en cours de suivi</h2>
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
   RÉGULARISATION DE L'ACTIVITÉ (prestataires)
   ===================================================================== */

const REGUL_STEPS_INITIAL = [
  { id: "identite", titre: "Pièce d'identité", obligatoire: true, statut: "Validé", description: "Carte nationale d'identité CEDEAO ou passeport en cours de validité.", ou: "Déjà fournie lors de votre inscription.", document: "CNI_Mamadou_Ndiaye.pdf" },
  { id: "ninea", titre: "Numéro NINEA", obligatoire: true, statut: "Refusé", motif: "Le document est illisible. Envoyez une photo nette de l'attestation complète.", champ: "Numéro NINEA", valeur: "", description: "Identifiant unique de votre activité auprès de l'administration fiscale.", ou: "Centre des services fiscaux de votre zone ou guichet unique de l'APIX.", document: "attestation_ninea.jpg" },
  { id: "immatriculation", titre: "Immatriculation de l'activité", obligatoire: true, statut: "À compléter", champ: "Numéro d'immatriculation", valeur: "", description: "Inscription au Registre des métiers pour les artisans, ou au RCCM pour une activité commerciale.", ou: "Chambre de métiers de votre région, ou greffe du tribunal de commerce." },
  { id: "fiscal", titre: "Régime fiscal", obligatoire: true, statut: "À compléter", choix: ["Contribution globale unique (CGU)", "Régime du réel", "Je ne sais pas encore"], valeur: "", description: "Le régime d'imposition qui s'applique à votre activité, selon votre chiffre d'affaires.", ou: "Centre des services fiscaux ou conseiller LIGGEEY." },
  { id: "social", titre: "Protection sociale", obligatoire: false, statut: "À compléter", description: "Affiliation à une caisse de retraite ou à une mutuelle de santé pour vous protéger, vous et votre famille.", ou: "IPRES, Caisse de sécurité sociale ou mutuelle de santé de votre commune." },
  { id: "assurance", titre: "Assurance responsabilité civile professionnelle", obligatoire: false, statut: "À compléter", description: "Couvre les dommages causés chez vos clients pendant une intervention.", ou: "Compagnies d'assurance agréées au Sénégal." },
];

const REGUL_DEMANDES_AUTRES = [
  { id: "rd1", prestataire: "Fatou Cissé", metier: "Couturière", etape: "Numéro NINEA", document: "ninea_fatou_cisse.pdf", valeur: "008 765 432", date: "11/10/2026", statut: "En vérification" },
  { id: "rd2", prestataire: "Babacar Gueye", metier: "Peintre", etape: "Immatriculation de l'activité", document: "carte_artisan_bgueye.jpg", valeur: "RM-DKR-2026-0412", date: "10/10/2026", statut: "En vérification" },
  { id: "rd3", prestataire: "Khady Ndiaye", metier: "Esthéticienne", etape: "Régime fiscal", document: "—", valeur: "Contribution globale unique (CGU)", date: "08/10/2026", statut: "En vérification" },
];

function regulSummary(steps) {
  const obligatoires = steps.filter((s) => s.obligatoire);
  const valides = obligatoires.filter((s) => s.statut === "Validé").length;
  return { valides, total: obligatoires.length, complete: valides === obligatoires.length };
}

function RegulBadge({ size = "md" }) {
  const api = usePlan();
  if (!api || !api.regulSteps) return null;
  const { complete } = regulSummary(api.regulSteps);
  const cls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1";
  return complete ? (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: "#DCFCE7", color: "#16A34A" }}><BadgeCheck size={12} /> Activité régularisée</span>
  ) : (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls}`} style={{ background: COLORS.orangeSoft, color: COLORS.orange }}><Landmark size={12} /> Régularisation en cours</span>
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
    <div className="rounded-lg border bg-surface" style={{ borderColor: step.statut === "Refusé" ? "#FCA5A5" : COLORS.border }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: step.statut === "Validé" ? "#DCFCE7" : COLORS.softStrong, color: step.statut === "Validé" ? "#16A34A" : COLORS.slate }}>
            {step.statut === "Validé" ? <Check size={13} /> : index + 1}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLORS.slate }}>{step.titre}</p>
            <p className="text-xs" style={{ color: COLORS.slateLight }}>{step.obligatoire ? "Obligatoire" : "Recommandé"}</p>
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
          <p className="text-sm mt-1 mb-3" style={{ color: COLORS.slateLight }}><span className="font-semibold">Où l'obtenir : </span>{step.ou}</p>
          {step.statut === "Refusé" && step.motif && (
            <div className="rounded-md px-3 py-2 text-sm mb-3 flex items-start gap-2" style={{ background: "#FEE2E2", color: "#B91C1C" }}><AlertCircle size={15} className="mt-0.5 shrink-0" /> {step.motif}</div>
          )}
          {step.statut === "En vérification" && <p className="text-sm" style={{ color: COLORS.orange }}>Document reçu le {step.envoyeLe}. Vérification par l'équipe LIGGEEY sous 72 h.</p>}
          {step.statut === "Validé" && step.document && <p className="text-sm flex items-center gap-1.5" style={{ color: "#16A34A" }}><FileCheck2 size={15} /> {step.document}{step.valeur ? ` · ${step.valeur}` : ""}</p>}
          {editable && (
            <div className="flex flex-col gap-3">
              {step.champ && (
                <label className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>
                  {step.champ}
                  <input value={valeur} onChange={(e) => setValeur(e.target.value)} className="mt-1 w-full max-w-sm block rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border, color: COLORS.slate }} />
                </label>
              )}
              {step.choix && (
                <label className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>
                  Votre régime
                  <select value={valeur} onChange={(e) => setValeur(e.target.value)} className="mt-1 w-full max-w-sm block rounded-md border px-3 py-2 text-sm outline-none" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
                    <option value="">Choisir…</option>
                    {step.choix.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <FilePickerButton accept=".pdf,image/*" onPick={(f) => setFile(f.name)} className="rounded-md px-4 py-2 text-sm font-semibold border inline-flex items-center gap-1.5" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
                  <Upload size={14} /> {file ? "Changer le justificatif" : step.choix ? "Ajouter un justificatif (facultatif)" : "Ajouter le justificatif"}
                </FilePickerButton>
                {file && <span className="text-sm" style={{ color: COLORS.slate }}>{file}</span>}
              </div>
              <div>
                <button type="button" disabled={!ready} onClick={() => onChange({ statut: "En vérification", valeur, document: file || "—", envoyeLe: todayFr(), motif: null })} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange, opacity: ready ? 1 : 0.5 }}>
                  Envoyer pour vérification
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RegularisationScreen({ steps, setSteps }) {
  const planApi = usePlan();
  const { valides, total, complete } = regulSummary(steps);
  const enVerif = steps.filter((s) => s.statut === "En vérification").length;
  const accompOk = planApi && planApi.can("accompagnementRegularisation");
  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap mb-1">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.slate }}>Régularisation de l'activité</h1>
        <RegulBadge />
      </div>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Formalisez votre activité pour rassurer vos clients et accéder aux missions des entreprises.</p>

      <div className="rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-[1fr,1.2fr] gap-6" style={{ background: COLORS.dark }}>
        <div>
          <p className="text-sm mb-1" style={{ color: COLORS.onDarkMuted }}>Étapes obligatoires validées</p>
          <p className="text-3xl font-bold text-sur-sombre mb-3">{valides} / {total}</p>
          <ProgressBar pct={(valides / total) * 100} color={complete ? "#4ADE80" : COLORS.orange} track={COLORS.darkLine} />
          <p className="text-sm mt-3" style={{ color: COLORS.onDarkMuted }}>{complete ? "Votre activité est régularisée. Le badge s'affiche sur votre profil." : enVerif ? `${enVerif} document${enVerif > 1 ? "s" : ""} en cours de vérification.` : "Complétez les étapes ci-dessous pour obtenir le badge."}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-sur-sombre mb-2">Ce que la régularisation vous apporte</p>
          {["Badge « Activité régularisée » visible par les clients", "Accès aux missions proposées par les entreprises", "Factures et devis conformes", "Dossier prêt pour un crédit ou un microfinancement"].map((a) => (
            <p key={a} className="text-sm flex items-start gap-2 py-0.5" style={{ color: COLORS.onDarkMuted }}><Check size={14} color={COLORS.orange} className="mt-0.5 shrink-0" /> {a}</p>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-surface p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: accompOk ? COLORS.border : COLORS.orange }}>
        <div>
          <p className="font-semibold flex items-center gap-2" style={{ color: COLORS.slate }}>Accompagnement par un conseiller {!accompOk && <PremiumChip locked />}</p>
          <p className="text-sm" style={{ color: COLORS.slateLight }}>Un conseiller LIGGEEY vous aide à préparer vos dossiers et vous oriente vers les bons guichets.</p>
        </div>
        <button type="button" onClick={() => planApi.gate("accompagnementRegularisation", () => notify("Demande envoyée : un conseiller vous appelle sous 48 h."))} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre shrink-0 inline-flex items-center gap-1.5" style={{ background: COLORS.orange }}>
          {!accompOk && <Lock size={13} />} Être rappelé(e) par un conseiller
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <RegulStepCard key={s.id + s.statut} step={s} index={i} onChange={(patch) => { setSteps((l) => l.map((x) => (x.id === s.id ? { ...x, ...patch } : x))); notify(`« ${s.titre} » envoyé pour vérification.`); }} />
        ))}
      </div>
      <p className="text-xs mt-4" style={{ color: COLORS.slateLight }}>Les démarches et organismes indiqués sont donnés à titre d'orientation. Renseignez-vous auprès de l'organisme concerné pour les conditions et frais en vigueur.</p>
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
      <h1 className="text-3xl font-bold mb-1" style={{ color: COLORS.slate }}>Régularisations</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.slateLight }}>Vérifiez les justificatifs envoyés par les prestataires pour régulariser leur activité.</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FileCheck2} value={demandes.length} label="Justificatifs à vérifier" />
        <StatCard icon={BadgeCheck} value="38 %" label="Prestataires régularisés" />
        <StatCard icon={Clock} value="41 h" label="Délai moyen de vérification" />
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
                  <button type="button" onClick={() => setRefusing(d.id)} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.danger, color: COLORS.danger }}>Refuser</button>
                  <button type="button" onClick={() => decide(d, "Validé")} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: "#16A34A" }}>Valider</button>
                </div>
              )}
            </div>
            {refusing === d.id && (
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <input value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Motif du refus, visible par le prestataire" className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-primaire-400" style={{ borderColor: COLORS.border }} />
                <button type="button" disabled={!motif.trim()} onClick={() => decide(d, "Refusé", motif)} className="rounded-md px-4 py-2 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.danger, opacity: motif.trim() ? 1 : 0.5 }}>Confirmer le refus</button>
                <button type="button" onClick={() => { setRefusing(null); setMotif(""); }} className="rounded-md px-4 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {traitees.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.slate }}>Traités récemment</h2>
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

const PROFIL_CHERCHEUR_INITIAL = { email: "absatou.diallo@example.com", ville: "Dakar", profession: "Commerciale", telephone: "+221 77 123 45 67" };
const PROFIL_PRESTATAIRE_INITIAL = { metier: "Électricien bâtiment", email: "mamadou.ndiaye@email.sn", telephone: "+221 76 412 33 08", localisation: "Dakar, Sénégal" };

function ProfilInfoModal({ nom, fields, values, onSave, onClose }) {
  const [v, setV] = useState(values);
  const [touched, setTouched] = useState(false);
  const emailOk = !("email" in v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email);
  const filled = fields.every((f) => String(v[f.key] || "").trim());
  function save() {
    setTouched(true);
    if (!emailOk || !filled) return;
    onSave(v);
    notify("Profil mis à jour.");
    onClose();
  }
  return (
    <ModalFrame onClose={onClose} labelledBy="edit-profil-title">
      <div className="p-6">
        <h3 id="edit-profil-title" className="text-lg font-bold mb-1" style={{ color: COLORS.slate }}>Modifier le profil</h3>
        <p className="text-sm mb-5" style={{ color: COLORS.slateLight }}>{nom} · le nom est vérifié et ne peut pas être modifié ici.</p>
        <div className="flex flex-col gap-3 mb-5">
          {fields.map((f) => (
            <label key={f.key} className="text-xs font-semibold" style={{ color: COLORS.slateLight }}>
              {f.label}
              <input
                type={f.type || "text"}
                value={v[f.key] || ""}
                onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
                className="mt-1 w-full block rounded-md border px-3 py-2.5 text-sm outline-none focus:border-primaire-400"
                style={{ borderColor: touched && (!String(v[f.key] || "").trim() || (f.key === "email" && !emailOk)) ? COLORS.danger : COLORS.border, color: COLORS.slate }}
              />
            </label>
          ))}
          {touched && !filled && <p className="text-xs" style={{ color: COLORS.danger }}>Tous les champs sont obligatoires.</p>}
          {touched && filled && !emailOk && <p className="text-xs" style={{ color: COLORS.danger }}>Saisissez une adresse e-mail valide, par exemple nom@exemple.com.</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2.5 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
          <button type="button" onClick={save} className="rounded-md px-4 py-2.5 text-sm font-semibold text-sur-sombre" style={{ background: COLORS.orange }}>Enregistrer</button>
        </div>
      </div>
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
   VERSION DE TEST
   - Sauvegarde automatique dans le navigateur du testeur (localStorage)
   - Barre « Mode test » : scénarios à dérouler, commentaire sur l'écran,
     réinitialisation de la démo
   ===================================================================== */

const TEST_STORAGE_KEY = "liggeey-test-v1";
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
  { id: "p1", espace: "prestataire", to: "regularisation", label: "Renvoyer le justificatif NINEA refusé" },
  { id: "p2", espace: "prestataire", to: "missions", label: "Accepter une demande de mission" },
  { id: "p3", espace: "prestataire", to: "services", label: "Ajouter des services jusqu'à la limite du profil Essentiel" },
  { id: "e1", espace: "entreprise", to: "offres", label: "Publier une offre, puis la retrouver dans l'espace chercheur" },
  { id: "e2", espace: "entreprise", to: "candidatures", label: "Ouvrir une candidature et débloquer les coordonnées" },
  { id: "e3", espace: "entreprise", to: "suivi", label: "Évaluer une recrue et confirmer son embauche" },
  { id: "a1", espace: "admin", to: "regularisations", label: "Valider les justificatifs envoyés par le prestataire" },
  { id: "a2", espace: "admin", to: "suivi", label: "Traiter un signalement post-embauche" },
  { id: "a3", espace: "admin", to: "abonnements", label: "Changer un tarif et le voir dans l'espace concerné" },
];
const TEST_ESPACE_LABELS = { chercheur: "Chercheur d'emploi", prestataire: "Prestataire", entreprise: "Entreprise", admin: "Admin" };

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
              <div className="h-full rounded-full" style={{ width: `${(faits / total) * 100}%`, background: "#16A34A" }} />
            </div>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {Object.keys(groups).map((esp) => (
              <div key={esp}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: esp === espace ? COLORS.orange : COLORS.slateLight }}>
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
              <button type="button" disabled={commentState === "busy"} onClick={comment} className="w-full rounded-md px-3 py-2 text-sm font-semibold text-sur-sombre flex items-center justify-center gap-1.5" style={{ background: COLORS.orange }}>
                <MessageCircle size={14} /> Commenter cet écran
              </button>
            ) : (
              <p className="text-xs" style={{ color: COLORS.slateLight }}>Les commentaires ne sont pas disponibles depuis cette page. Notez vos remarques et transmettez-les à l'équipe LIGGEEY.</p>
            )}
            {!confirmReset ? (
              <button type="button" onClick={() => setConfirmReset(true)} className="w-full rounded-md px-3 py-2 text-sm font-semibold border" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
                Réinitialiser la démo
              </button>
            ) : (
              <div className="rounded-md p-3" style={{ background: "#FEF2F2" }}>
                <p className="text-xs mb-2" style={{ color: "#B91C1C" }}>Toutes vos actions de test seront effacées et la démo repartira de zéro.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { clearSnapshot(); window.location.reload(); }} className="flex-1 rounded-md px-3 py-1.5 text-xs font-semibold text-sur-sombre" style={{ background: COLORS.danger }}>Tout effacer</button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="flex-1 rounded-md px-3 py-1.5 text-xs font-semibold border bg-surface" style={{ borderColor: COLORS.border, color: COLORS.slate }}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiggeeyPrototype({ ecranInitial = null, espaceInitial = null, profilInitial = null } = {}) {
  const [saved] = useState(loadSnapshot);
  /* Écran demandé par le site public (Connexion, Inscription, Offres), sinon la dernière session de test */
  const [screen, setScreen] = useState(ecranInitial || saved?.screen || "login");
  const [espace, setEspace] = useState(espaceInitial || saved?.espace || "chercheur");
  const [signupProfile, setSignupProfile] = useState(profilInitial);
  const [presetMentorId, setPresetMentorId] = useState(null);
  const [presetFormationsTab, setPresetFormationsTab] = useState("toutes");
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
    if (data?.espace) setEspace(data.espace);
    if (next === "mentors") setPresetMentorId(data?.mentorId || null);
    if (next === "formations") setPresetFormationsTab(data?.tab || "toutes");
    if (next === "login") setEspace("chercheur");
    setScreen(next);
  }

  const currentUser = USER_BY_ESPACE[espace];
  const navItems = NAV_ITEMS_BY_ESPACE[espace];
  const planApi = buildPlanApi({ espace, user: currentUser, plans, setPlans, subs, setSubs, usage, setUsage, transactions, setTransactions, setUpgrade, setPayment });
  planApi.regulSteps = espace === "prestataire" ? regulSteps : null;

  /* Fil d'Ariane et entrée active du menu, déduits du menu lui-même */
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
  const regulRefusees = regulSteps.filter((st) => st.statut === "Refusé");
  const regulACompleter = regulSteps.filter((st) => st.obligatoire && st.statut === "À compléter");
  const missionsEnAttente = missionsData.filter((m) => m.statut === "En attente").length;
  const evaluationsAFaire = recrues.reduce((n, r) => n + JALONS.filter((j) => jalonStatut(r.dateIso, j, r.evaluations[j.id]) === "À compléter").length, 0);
  const recruesARisque = recrues.filter((r) => r.statut === "À risque").length;
  const nouvellesCandidatures = candidaturesEntreprise.filter((c) => c.statut === "Nouveau").length;
  const regulAVerifier = regulSteps.filter((st) => st.statut === "En vérification").length + regulAutres.filter((d) => d.statut === "En vérification").length;
  const signalementsOuverts = signalements.filter((x) => x.statut === "Ouvert").length;
  const paiementsEchoues = transactions.filter((t) => t.statut === "Échoué").length;
  const pl = (n, one, many) => `${n} ${n > 1 ? many : one}`;

  const TODOS = {
    chercheur: [
      ...pointsSuivi.map((j) => ({ label: `Répondre au point de suivi « ${j.label} »`, to: "suivi", icon: HeartHandshake })),
      prochainCoaching && { label: `Coaching avec ${MENTORS[0].nom} : ${prochainCoaching.date}`, to: "mentors", data: { mentorId: MENTORS[0].id }, icon: Calendar },
    ],
    prestataire: [
      ...regulRefusees.map((st) => ({ label: `Renvoyer le justificatif « ${st.titre} », refusé par LIGGEEY`, to: "regularisation", icon: Landmark, urgent: true })),
      regulACompleter.length > 0 && { label: `Compléter ${pl(regulACompleter.length, "étape", "étapes")} de régularisation`, to: "regularisation", icon: Landmark },
      missionsEnAttente > 0 && { label: `Répondre à ${pl(missionsEnAttente, "demande de mission", "demandes de mission")}`, to: "missions", icon: ClipboardList },
    ],
    entreprise: [
      recruesARisque > 0 && { label: `Accompagner ${pl(recruesARisque, "recrue à risque", "recrues à risque")}`, to: "suivi", icon: AlertCircle, urgent: true },
      evaluationsAFaire > 0 && { label: `Évaluer vos recrues (${pl(evaluationsAFaire, "point de suivi", "points de suivi")})`, to: "suivi", icon: HeartHandshake },
      nouvellesCandidatures > 0 && { label: `Traiter ${pl(nouvellesCandidatures, "nouvelle candidature", "nouvelles candidatures")}`, to: "candidatures", icon: ClipboardList },
    ],
    admin: [
      signalementsOuverts > 0 && { label: `Traiter ${pl(signalementsOuverts, "signalement post-embauche", "signalements post-embauche")}`, to: "suivi", icon: Flag, urgent: true },
      regulAVerifier > 0 && { label: `Vérifier ${pl(regulAVerifier, "justificatif de régularisation", "justificatifs de régularisation")}`, to: "regularisations", icon: Landmark },
      paiementsEchoues > 0 && { label: `Relancer ${pl(paiementsEchoues, "paiement échoué", "paiements échoués")}`, to: "abonnements", icon: CreditCard },
    ],
  };
  const todos = (TODOS[espace] || []).filter(Boolean);
  const BADGES = {
    chercheur: { suivi: pointsSuivi.length },
    prestataire: { regularisation: regulRefusees.length + regulACompleter.length, missions: missionsEnAttente },
    entreprise: { candidatures: nouvellesCandidatures, suivi: evaluationsAFaire + recruesARisque },
    admin: { suivi: signalementsOuverts, regularisations: regulAVerifier, abonnements: paiementsEchoues },
  };

  /* Les offres actives publiées par l'entreprise apparaissent aussi côté chercheur */
  const offresPubliees = offresEntreprise.filter((o) => o.statut === "Active").map((o) => ({
    titre: o.titre, contrat: o.contrat || "CDI", entreprise: "Senegal Construction SARL", secteur: "BTP & Construction",
    localisation: o.localisation, description: o.description || "", competences: o.competences || [o.categorie], sponsorisee: o.sponsorisee,
  }));

  function renderContent() {
    if (screen === "dashboard" && espace === "chercheur") return <DashboardScreen user={currentUser} onNavigate={navigate} todos={todos} />;
    if (screen === "dashboard" && espace === "prestataire") return <PrestataireDashboardScreen user={currentUser} onNavigate={navigate} todos={todos} />;
    if (screen === "dashboard" && espace === "entreprise") return <EntrepriseDashboardScreen user={currentUser} offres={offresEntreprise} onNavigate={navigate} todos={todos} />;
    if (screen === "dashboard" && espace === "admin") return <AdminDashboardScreen onNavigate={navigate} todos={todos} />;
    if (screen === "chercheurs" && espace === "admin") return <ChercheursAdminScreen />;
    if (screen === "prestataires" && espace === "admin") return <PrestatairesAdminScreen />;
    if (screen === "entreprises" && espace === "admin") return <EntreprisesAdminScreen />;
    if (screen === "offres" && espace === "admin") return <OffresAdminScreen />;
    if (screen === "candidatures" && espace === "admin") return <CandidaturesAdminScreen />;
    if (screen === "formations" && espace === "admin") return <FormationsAdminScreen />;
    if (screen === "mentorat" && espace === "admin") return <MentoratAdminScreen />;
    if (screen === "services" && espace === "admin") return <ServicesAdminScreen />;
    if (screen === "missions" && espace === "admin") return <MissionsAdminScreen />;
    if (screen === "verifications" && espace === "admin") return <VerificationCVScreen />;
    if (screen === "planning" && espace === "admin") return <PlanningScreen />;
    if (screen === "communication" && espace === "admin") return <CommunicationScreen onNavigate={navigate} />;
    if (screen === "parametres" && espace === "admin") return <ParametresScreen />;
    if (screen === "abonnements" && espace === "admin") return <AbonnementsAdminScreen />;
    if (screen === "abonnement" && espace !== "admin") return <AbonnementScreen />;
    if (screen === "suivi" && espace === "chercheur") return <SuiviEmbaucheScreen suivi={suiviChercheur} setSuivi={setSuiviChercheur} signalements={signalements} onSignal={addSignalement} />;
    if (screen === "suivi" && espace === "entreprise") return <SuiviRecruesScreen recrues={recrues} setRecrues={setRecrues} onSignal={addSignalement} />;
    if (screen === "suivi" && espace === "admin") return <SuiviPostEmbaucheAdminScreen signalements={signalements} setSignalements={setSignalements} recrues={recrues} />;
    if (screen === "regularisation" && espace === "prestataire") return <RegularisationScreen steps={regulSteps} setSteps={setRegulSteps} />;
    if (screen === "regularisations" && espace === "admin") return <RegularisationsAdminScreen steps={regulSteps} setSteps={setRegulSteps} />;
    if (screen === "offres" && espace === "entreprise") return <MesOffresScreen offres={offresEntreprise} setOffres={setOffresEntreprise} />;
    if (screen === "offres") return <OffresScreen extraOffres={offresPubliees} />;
    if (screen === "services") return <ServicesScreen />;
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
      <StoreContext.Provider value={storeApi}>
      <PlanContext.Provider value={planApi}>
        <AppShell
          navItems={navItems}
          active={activeNav}
          onNavigate={navigate}
          user={currentUser}
          breadcrumb={breadcrumb}
          badges={BADGES[espace]}
        >
          {renderContent()}
          {upgrade && <UpgradeModal reasonKey={upgrade} onClose={() => setUpgrade(null)} onNavigate={navigate} />}
          {payment && <PaymentModal key={payment.planId + payment.cycle} planId={payment.planId} initialCycle={payment.cycle} onClose={() => setPayment(null)} />}
          <Toaster />
        </AppShell>
      </PlanContext.Provider>
      </StoreContext.Provider>
    );
  }

  return (
    <AuthShell onNavigate={navigate}>
      {screen === "login" && <ConnexionScreen onNavigate={navigate} />}
      {screen === "signup-choice" && <SignupChoiceScreen onNavigate={navigate} />}
      {screen === "signup-info" && <SignupInfoScreen profile={signupProfile} onNavigate={navigate} />}
      {screen === "signup-confirm" && <ConfirmationScreen profile={signupProfile} onNavigate={navigate} />}
      <Toaster />
    </AuthShell>
  );
}
