import { fn } from 'storybook/test';
import { CarteOffre, GrilleOffres } from '../../../components/accueil/CarteOffre';
import DetailOffre, { PastilleSecteur } from '../../../components/accueil/DetailOffre';
import VitrineOffres from '../../../components/accueil/VitrineOffres';
import CarteRecherche from '../../../components/accueil/CarteRecherche';
import offres from '../../../content/offres-demo.json';

/* Offres d'exemple : content/offres-demo.json (entreprises fictives). */

export const Carte = {
  name: 'CarteOffre',
  render: (args) => (
    <div className="max-w-xs">
      <CarteOffre {...args} />
    </div>
  ),
  args: { offre: offres[0], onVoir: fn() },
};

export const CarteSansCompetences = {
  name: 'CarteOffre · sans compétences',
  render: (args) => (
    <div className="max-w-xs">
      <CarteOffre {...args} />
    </div>
  ),
  args: { offre: { ...offres[1], competences: [] }, onVoir: fn() },
};

export const Pastille = {
  name: 'PastilleSecteur · secteur connu et repli (initiales)',
  render: () => (
    <div className="flex items-center gap-3">
      <PastilleSecteur offre={offres[0]} />
      <PastilleSecteur offre={offres[2]} className="h-14 w-14" />
      <PastilleSecteur offre={{ ...offres[0], secteur: 'inconnu' }} />
    </div>
  ),
};

export const Grille = {
  name: 'GrilleOffres',
  render: (args) => <GrilleOffres {...args} />,
  args: { offres: offres.slice(0, 8) },
};

export const GrilleAvecOffreOuverte = {
  name: 'GrilleOffres · lien partagé (fenêtre ouverte)',
  render: (args) => <GrilleOffres {...args} />,
  args: { offres: offres.slice(0, 8), offreInitiale: offres[0].id },
  parameters: { docs: { story: { inline: false, height: '720px' } } },
};

export const Detail = {
  name: 'DetailOffre (fenêtre)',
  render: (args) => <DetailOffre {...args} />,
  args: { offre: offres[2], onFermer: fn() },
  parameters: { docs: { story: { inline: false, height: '760px' } } },
};

export const DetailMinimal = {
  name: 'DetailOffre · informations minimales',
  render: (args) => <DetailOffre {...args} />,
  args: { offre: { id: 'x', titre: 'Vendeur(se) en boutique', entreprise: 'Boutique Exemple', ville: 'Thiès', contrat: 'CDD' }, onFermer: fn() },
  parameters: { docs: { story: { inline: false, height: '640px' } } },
};

export const Vitrine = {
  name: 'VitrineOffres · sans filtre',
  render: (args) => <VitrineOffres {...args} />,
  args: { offres },
};

export const VitrineFiltree = {
  name: 'VitrineOffres · filtrée (secteur)',
  render: (args) => <VitrineOffres {...args} />,
  args: { offres },
  parameters: { nextjs: { navigation: { query: { secteur: offres[0].secteur } } } },
};

export const VitrineSansResultat = {
  name: 'VitrineOffres · aucun résultat',
  render: (args) => <VitrineOffres {...args} />,
  args: { offres },
  parameters: { nextjs: { navigation: { query: { q: 'astronaute' } } } },
};

export const VitrineVide = {
  name: 'VitrineOffres · aucune offre publiée',
  render: (args) => <VitrineOffres {...args} />,
  args: { offres: [] },
};

export const Recherche = {
  name: 'CarteRecherche',
  render: () => (
    <div className="max-w-[480px] rounded-lg bg-sombre p-6">
      <CarteRecherche />
    </div>
  ),
};

export const RechercheMobile = {
  name: 'CarteRecherche · mobile (3 critères)',
  render: () => <CarteRecherche />,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export default {
  title: 'Composants/Site/Offres',
  parameters: {
    docs: {
      description: {
        component:
          'La vitrine des offres de l’accueil (components/accueil) : CarteRecherche filtre par l’adresse (?secteur=…, ?q=…), VitrineOffres affiche GrilleOffres, chaque CarteOffre ouvre DetailOffre, qui invite à se connecter.',
      },
    },
  },
};
