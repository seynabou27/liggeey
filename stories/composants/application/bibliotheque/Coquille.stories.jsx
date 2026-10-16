import { fn } from 'storybook/test';
import { AlignJustify, Bell, Briefcase, Flame, Grid3x3, Layers, Triangle, Zap, Calendar, ClipboardList, Crown, GraduationCap, HeartHandshake, Home, LayoutDashboard, UserCircle2, UsersRound } from 'lucide-react';
import { Coquille, BarreIcones, BarreLaterale, BarreHaut, EnTetePage, PiedApp, Carte } from '../../../../components/app';
import Bouton from '../../../../components/ui/Bouton';

const ELEMENTS = [
  { id: 'dashboard', label: 'Tableau de bord', icone: LayoutDashboard, section: 'Ma recherche' },
  { id: 'offres', label: "Offres d'emploi", icone: Briefcase, section: 'Ma recherche' },
  { id: 'candidatures', label: 'Mes candidatures', icone: ClipboardList, section: 'Ma recherche' },
  { id: 'formations', label: 'Formations', icone: GraduationCap, section: 'Progresser' },
  { id: 'mentors', label: 'Mentors', icone: UsersRound, section: 'Progresser' },
  { id: 'suivi', label: 'Suivi post-embauche', icone: HeartHandshake, section: 'Mon emploi' },
  { id: 'profil', label: 'Mon profil', icone: UserCircle2, section: 'Mon compte' },
  { id: 'abonnement', label: 'Abonnement', icone: Crown, section: 'Mon compte' },
];

const RAIL = [Flame, Grid3x3, Zap, Triangle, AlignJustify, Layers, Bell].map((icone, i) => ({ icone, actif: i === 0 }));

const Logo = () => <img src="/logo/liggeey-ardoise.svg" alt="LIGGEEY" className="h-6" />;
const LogoReduit = () => <img src="/logo/monogramme-orange.svg" alt="LIGGEEY" className="h-6" />;

const Encart = () => (
  <div className="rounded-lg border border-base bg-surface p-4 text-center">
    <p className="text-sm font-semibold text-principal">Profil Essentiel</p>
    <p className="mb-3 mt-1 text-xs text-secondaire">Passez Premium pour être vu en priorité.</p>
    <Bouton petit pleineLargeur>Passer Premium</Bouton>
  </div>
);

const NOTIFICATIONS = [
  { id: 'n1', titre: 'Répondre au point de suivi « Bilan du premier mois »', icone: HeartHandshake },
  { id: 'n2', titre: 'Coaching avec Cheikh Fall : vendredi 16 octobre', icone: Calendar },
  { id: 'n3', titre: 'Accompagner 1 recrue à risque', icone: Bell, urgent: true },
];

const MENU_COMPTE = [
  { label: 'Mon profil', icone: UserCircle2 },
  { label: 'Abonnement', icone: Crown },
  { label: 'Retour au site', icone: Home, href: '#' },
];

export default {
  title: 'Composants/Application/Bibliothèque/Coquille',
  component: Coquille,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Coquille de l’application : barre latérale, barre du haut, en-tête de page, pied de page. `components/app/Coquille.jsx`' } },
  },
};

export const Complete = {
  name: 'Coquille complète',
  render: (args) => (
    <Coquille
      {...args}
      elements={ELEMENTS}
      rail={<BarreIcones elements={RAIL} />}
      logo={<Logo />}
      logoReduit={<LogoReduit />}
      encart={<Encart />}
      notifications={NOTIFICATIONS}
      utilisateur={{ nom: 'Absatou Diallo', role: "Chercheuse d'emploi" }}
      menuUtilisateur={MENU_COMPTE}
    >
      <Carte titre="Contenu de l’écran">
        <p className="text-sm text-secondaire">Les écrans s’affichent ici, sous l’en-tête de page.</p>
      </Carte>
    </Coquille>
  ),
  args: { actif: 'offres', compteurs: { suivi: 1 }, salutation: 'Bonjour, Absatou !', titre: "Offres d'emploi", filAriane: [{ label: "Offres d'emploi" }], onNaviguer: fn() },
  argTypes: { actif: { control: 'select', options: ELEMENTS.map((e) => e.id) } },
  parameters: { docs: { story: { inline: false, height: '720px' } } },
};

export const Mobile = {
  ...Complete,
  name: 'Coquille · mobile (menu en tiroir)',
  globals: { viewport: { value: 'mobile1' } },
  parameters: { ...Complete.parameters, viewport: { defaultViewport: 'mobile1' } },
};

export const Rail = {
  name: 'Barre d’icônes',
  render: () => <BarreIcones elements={RAIL} />,
  decorators: [(Story) => <div className="flex h-[420px]"><Story /></div>],
};

const cadre = (Story) => <div className="flex h-[720px]"><Story /></div>;

export const Menu = {
  name: 'Barre latérale',
  render: (args) => <BarreLaterale {...args} elements={ELEMENTS} logo={<Logo />} logoReduit={<LogoReduit />} encart={<Encart />} />,
  args: { actif: 'dashboard', compteurs: { suivi: 1, candidatures: 3 }, replie: false, onNaviguer: fn() },
  decorators: [cadre],
};

export const MenuReplie = { ...Menu, name: 'Barre latérale · repliée', args: { ...Menu.args, replie: true } };

export const Haut = {
  name: 'Barre du haut',
  render: (args) => <BarreHaut {...args} elements={ELEMENTS} notifications={NOTIFICATIONS} utilisateur={{ nom: 'Absatou Diallo', role: "Chercheuse d'emploi" }} menuUtilisateur={MENU_COMPTE} />,
  args: { salutation: 'Bonjour, Absatou !', onMenu: fn(), onNaviguer: fn() },
};

export const HautSansNotification = { ...Haut, name: 'Barre du haut · aucune notification', render: (args) => <BarreHaut {...args} elements={ELEMENTS} notifications={[]} utilisateur={{ nom: 'Admin LIGGEEY', role: 'Super admin' }} menuUtilisateur={MENU_COMPTE} />, args: { ...Haut.args, salutation: 'Bonjour !' } };

export const EnTete = {
  name: 'En-tête de page',
  render: (args) => <div className="p-6"><EnTetePage {...args} /></div>,
  args: { titre: 'Mon profil', filAriane: [{ label: 'Mon profil', id: 'profil' }, { label: 'Mes évaluations et avis' }], onNaviguer: fn() },
};

export const EnTeteAvecDescription = {
  ...EnTete,
  name: 'En-tête de page · description et actions',
  args: { titre: 'Mes offres', description: 'Publiez et suivez vos offres d’emploi.', filAriane: [{ label: 'Mes offres' }], actions: <Bouton petit>Publier une offre</Bouton>, onNaviguer: fn() },
};

export const Pied = { name: 'Pied de page', render: () => <div className="p-6"><PiedApp /></div> };
