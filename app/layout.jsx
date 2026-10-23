import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import EnTete from '@/components/layout/EnTete';
import PiedDePage from '@/components/layout/PiedDePage';
import BoutonWhatsApp from '@/components/layout/BoutonWhatsApp';
import Cadre from '@/components/layout/Cadre';
import { palettes } from '@/lib/tokens/couleurs.mjs';

// Plus Jakarta Sans (comme le modèle JobStock) est servie depuis le site (pas d'appel à Google au chargement).
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta' });

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.nom} · ${site.slogan}`, template: `%s · ${site.nom}` },
  description: site.description,
  openGraph: {
    siteName: site.nom,
    locale: 'fr_SN',
    type: 'website',
  },
  alternates: { canonical: '/' },
};

export const viewport = {
  themeColor: palettes.neutre[800], // couleur de la barre du navigateur sur mobile
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    // data-theme peut être posé avant l'hydratation par le script de thème de /plateforme.
    <html lang="fr" className={jakarta.variable} suppressHydrationWarning>
      <body id="haut" className="font-sans">
        <a href="#contenu" className="sr-only z-[70] rounded bg-marque px-4 py-3 font-semibold text-sur-marque focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Aller au contenu
        </a>
        <Cadre entete={<EnTete />} pied={<PiedDePage />} whatsapp={<BoutonWhatsApp />}>
          {children}
        </Cadre>
      </body>
    </html>
  );
}
