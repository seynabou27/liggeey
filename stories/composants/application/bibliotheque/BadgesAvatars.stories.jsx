import { Badge, Compteur, Avatar, GroupeAvatars } from '../../../../components/app';

export default {
  title: 'Composants/Application/Bibliothèque/Badges et avatars',
  component: Badge,
  parameters: { docs: { description: { component: 'Badges (`components/app/Badge.jsx`) et avatars (`components/app/Avatar.jsx`).' } } },
};

const TONS = ['marque', 'succes', 'alerte', 'danger', 'info', 'neutre', 'plein'];

export const Badges = {
  name: 'Badge · tons',
  render: () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">{TONS.map((t) => <Badge key={t} ton={t}>{t}</Badge>)}</div>
      <div className="flex flex-wrap gap-2">{TONS.map((t) => <Badge key={t} ton={t} taille="moyen" point>{t}</Badge>)}</div>
    </div>
  ),
};

export const BadgeReglable = {
  name: 'Badge',
  render: (args) => <Badge {...args} />,
  args: { ton: 'succes', taille: 'moyen', point: false, children: 'Candidature retenue' },
  argTypes: { ton: { control: 'inline-radio', options: TONS }, taille: { control: 'inline-radio', options: ['petit', 'moyen'] } },
};

export const Compteurs = {
  name: 'Compteur',
  render: () => (
    <div className="flex gap-3">
      <Compteur valeur={1} />
      <Compteur valeur={12} ton="marque" />
      <Compteur valeur={150} />
    </div>
  ),
};

export const Avatars = {
  name: 'Avatar · tailles et présence',
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {['xs', 'sm', 'md', 'lg', 'xl'].map((t) => <Avatar key={t} nom="Absatou Diallo" taille={t} />)}
      <Avatar nom="Cheikh Fall" src="https://randomuser.me/api/portraits/men/32.jpg" taille="md" presence="en-ligne" />
      <Avatar nom="Awa Diallo" taille="md" ton="plein" presence="absent" />
      <Avatar nom="Senegal Construction" taille="md" ton="neutre" />
    </div>
  ),
};

export const Groupe = {
  name: 'GroupeAvatars',
  render: () => <GroupeAvatars personnes={['Absatou Diallo', 'Moussa Diop', 'Fatou Sarr', 'Ibrahima Diallo', 'Aminata Ndiaye', 'Ousmane Ba'].map((nom) => ({ nom }))} max={4} />,
};
