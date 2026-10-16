import { fn } from 'storybook/test';
import { AlertCircle, Calendar, ClipboardList, HeartHandshake } from 'lucide-react';
import { AuthShell, AppShell, Sidebar, IconRail, Breadcrumb, TodoPanel, NAV_ITEMS_BY_ESPACE, USER_BY_ESPACE } from '../../../components/plateforme/LiggeeyPrototype';
import { AvecPlateforme, policeApp } from './_outils';

const BarreLaterale = (espace, badges = {}, formule = 'essentiel') => ({
  render: (args) => (
    <AvecPlateforme espace={espace} formule={formule}>
      <div className="flex h-[720px] overflow-hidden">
        <Sidebar navItems={NAV_ITEMS_BY_ESPACE[espace]} active={args.active} onNavigate={args.onNavigate} user={USER_BY_ESPACE[espace]} badges={badges} />
      </div>
    </AvecPlateforme>
  ),
  args: { active: 'dashboard', onNavigate: fn() },
  argTypes: { active: { control: 'select', options: NAV_ITEMS_BY_ESPACE[espace].map((n) => n.id) } },
});

export const MenuChercheur = { name: 'Sidebar · chercheur', ...BarreLaterale('chercheur', { suivi: 1 }) };
export const MenuChercheurPremium = { name: 'Sidebar · chercheur Premium', ...BarreLaterale('chercheur', {}, 'premium') };
export const MenuPrestataire = { name: 'Sidebar · prestataire', ...BarreLaterale('prestataire', { regularisation: 3, missions: 2 }) };
export const MenuEntreprise = { name: 'Sidebar · entreprise', ...BarreLaterale('entreprise', { candidatures: 4, suivi: 2 }) };
export const MenuAdmin = { name: 'Sidebar · admin', ...BarreLaterale('admin', { suivi: 1, regularisations: 2, abonnements: 1 }) };

export const BarreIcones = { name: 'IconRail', render: () => <div className="flex h-[400px]"><IconRail /></div> };

export const FilAriane = {
  name: 'Breadcrumb',
  render: (args) => <Breadcrumb {...args} />,
  args: { items: [{ label: 'Mon profil', id: 'profil' }, { label: 'Mes évaluations et avis' }], onNavigate: fn() },
};

export const FilArianeSimple = { ...FilAriane, name: 'Breadcrumb · un niveau', args: { items: [{ label: 'Offres d’emploi' }], onNavigate: fn() } };

export const AFaire = {
  name: 'TodoPanel',
  render: (args) => <div className="max-w-2xl"><TodoPanel {...args} /></div>,
  args: {
    onNavigate: fn(),
    items: [
      { label: 'Accompagner 1 recrue à risque', to: 'suivi', icon: AlertCircle, urgent: true },
      { label: 'Répondre au point de suivi « Bilan du premier mois »', to: 'suivi', icon: HeartHandshake },
      { label: 'Coaching avec Cheikh Fall : 20/10/2026', to: 'mentors', icon: Calendar },
      { label: 'Traiter 3 nouvelles candidatures', to: 'candidatures', icon: ClipboardList },
    ],
  },
};

export const AFaireVide = { ...AFaire, name: 'TodoPanel · rien à faire (masqué)', args: { items: [], onNavigate: fn() } };

export const CoquilleApplication = {
  name: 'AppShell',
  render: (args) => (
    <AvecPlateforme espace="chercheur">
      <AppShell navItems={NAV_ITEMS_BY_ESPACE.chercheur} active="offres" onNavigate={args.onNavigate} user={USER_BY_ESPACE.chercheur} breadcrumb={[{ label: 'Offres d’emploi' }]} badges={{ suivi: 1 }}>
        <div className="rounded-lg border border-base bg-surface p-10 text-center text-secondaire">Contenu de l’écran</div>
      </AppShell>
    </AvecPlateforme>
  ),
  args: { onNavigate: fn() },
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '640px' } } },
};

export const CoquilleAuthentification = {
  name: 'AuthShell',
  render: (args) => (
    <AuthShell onNavigate={args.onNavigate}>
      <div className="rounded-lg border border-base p-10 text-center text-secondaire">Formulaire de connexion ou d’inscription</div>
    </AuthShell>
  ),
  args: { onNavigate: fn() },
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '640px' } } },
};

export default {
  title: 'Composants/Application/Navigation',
  decorators: [policeApp],
  parameters: { docs: { description: { component: 'Coquilles et navigation de la plateforme : AuthShell (connexion, inscription), AppShell (IconRail + Sidebar + barre du haut + en-tête de page, depuis components/app/Coquille.jsx), TodoPanel (« À faire maintenant »).' } } },
};
