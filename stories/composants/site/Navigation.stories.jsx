import { useState } from 'react';
import { fn } from 'storybook/test';
import EnTete from '../../../components/layout/EnTete';
import MenuMobile from '../../../components/layout/MenuMobile';
import PiedDePage from '../../../components/layout/PiedDePage';
import Cadre from '../../../components/layout/Cadre';

/* Faux contenu de page sous l’en-tête fixe : une photo sombre, puis de quoi faire défiler. */
function PageFictive({ children }) {
  return (
    <div className="[transform:translateZ(0)]">
      {children}
      <div className="relative h-[420px] bg-sombre">
        <img src="/images/accueil-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      </div>
      <div className="container space-y-4 py-20 text-secondaire">
        <p>Faites défiler la page : l’en-tête devient ardoise.</p>
        <div className="h-[900px] rounded-lg border border-dashed border-forte" />
      </div>
    </div>
  );
}

export const EnTeteTransparent = {
  name: 'En-tête · transparent (haut de page)',
  render: () => (
    <PageFictive>
      <EnTete />
    </PageFictive>
  ),
  parameters: { nextjs: { navigation: { pathname: '/' } } },
};

export const EnTeteDefile = {
  name: 'En-tête · après défilement',
  render: () => (
    <PageFictive>
      <EnTete />
    </PageFictive>
  ),
  play: async () => {
    window.scrollTo(0, 200);
    window.dispatchEvent(new Event('scroll'));
  },
};

export const EnTeteLienActif = {
  name: 'En-tête · page « Tarifs » active',
  render: () => (
    <PageFictive>
      <EnTete />
    </PageFictive>
  ),
  parameters: { nextjs: { navigation: { pathname: '/tarifs' } } },
};

export const EnTeteMobile = {
  name: 'En-tête · mobile',
  render: () => (
    <PageFictive>
      <EnTete />
    </PageFictive>
  ),
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export const MenuMobileOuvert = {
  name: 'Menu mobile · ouvert',
  render: (args) => (
    <div className="[transform:translateZ(0)] min-h-[720px]">
      <MenuMobile {...args} />
    </div>
  ),
  args: { ouvert: true, onFermer: fn() },
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export const MenuMobileInteractif = {
  name: 'Menu mobile · ouvrir et fermer',
  render: () => {
    const [ouvert, setOuvert] = useState(false);
    return (
      <div className="[transform:translateZ(0)] min-h-[720px] p-4">
        <button type="button" onClick={() => setOuvert(true)} className="min-h-[44px] rounded bg-sombre px-4 font-semibold text-sur-sombre">
          Ouvrir le menu
        </button>
        <MenuMobile ouvert={ouvert} onFermer={() => setOuvert(false)} />
      </div>
    );
  },
};

export const PiedDePageComplet = { name: 'Pied de page', render: () => <PiedDePage /> };

/* Adresses d’exemple, pour voir les icônes avant que les vrais comptes soient renseignés dans lib/site.js. */
export const PiedDePageReseaux = {
  name: 'Pied de page · avec réseaux',
  render: () => (
    <PiedDePage
      reseaux={['LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'X'].map((nom) => ({ nom, url: 'https://example.com' }))}
    />
  ),
};

export const CadreSite = {
  name: 'Cadre · page du site',
  render: () => (
    <Cadre
      entete={<div className="bg-sombre p-4 text-sur-sombre">[ entete ]</div>}
      pied={<div className="bg-sombre p-4 text-sur-sombre">[ pied ]</div>}
      whatsapp={<div className="p-4 text-right">[ whatsapp ]</div>}
    >
      <div className="p-10 text-center">Contenu de la page</div>
    </Cadre>
  ),
  parameters: { nextjs: { navigation: { pathname: '/talents' } } },
};

export const CadrePlateforme = {
  name: 'Cadre · plateforme (sans en-tête ni pied)',
  render: () => (
    <Cadre
      entete={<div className="bg-sombre p-4 text-sur-sombre">[ entete ]</div>}
      pied={<div className="bg-sombre p-4 text-sur-sombre">[ pied ]</div>}
      whatsapp={<div className="p-4 text-right">[ whatsapp ]</div>}
    >
      <div className="p-10 text-center">La plateforme s’affiche seule, en plein écran.</div>
    </Cadre>
  ),
  parameters: { nextjs: { navigation: { pathname: '/plateforme/connexion' } } },
};

export default {
  title: 'Composants/Site/Navigation',
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '520px' },
      description: {
        component:
          'components/layout : EnTete (fixe, transparent puis ardoise au défilement ; menu complet à partir de 1 280 px), MenuMobile (plein écran, Échap pour fermer), PiedDePage, Cadre (masque en-tête et pied sur /plateforme).',
      },
    },
  },
};
