import { fn } from 'storybook/test';
import { Eye } from 'lucide-react';
import { Tableau, CelluleIdentite, Avatar, Badge, BoutonIcone, Carte } from '../../../../components/app';

const LIGNES = [
  { id: 1, nom: 'Moussa Diop', metier: 'Électricien bâtiment', ville: 'Dakar', date: '15/08/2026', statut: ['Nouveau', 'info'] },
  { id: 2, nom: 'Fatou Sarr', metier: 'Plombière sanitaire', ville: 'Thiès', date: '14/08/2026', statut: ['En attente', 'alerte'] },
  { id: 3, nom: 'Ibrahima Diallo', metier: 'Soudeur industriel', ville: 'Saint-Louis', date: '12/08/2026', statut: ['Retenu', 'succes'] },
  { id: 4, nom: 'Ousmane Ba', metier: 'Menuisier ébéniste', ville: 'Kaolack', date: '10/08/2026', statut: ['Rejeté', 'danger'] },
];

const COLONNES = [
  { cle: 'nom', titre: 'Candidat', rendu: (l) => <CelluleIdentite visuel={<Avatar nom={l.nom} />} titre={l.nom} sousTitre={l.metier} /> },
  { cle: 'ville', titre: 'Ville' },
  { cle: 'date', titre: 'Reçue le', masqueMobile: true },
  { cle: 'statut', titre: 'Statut', rendu: (l) => <Badge ton={l.statut[1]} taille="moyen">{l.statut[0]}</Badge> },
  { cle: 'actions', titre: 'Actions', alignement: 'droite', rendu: () => <BoutonIcone icone={Eye} label="Voir le détail" variante="fantome" taille="sm" /> },
];

export default {
  title: 'Composants/Application/Bibliothèque/Tableau',
  component: Tableau,
  parameters: { docs: { description: { component: 'Tableau de données. `components/app/Tableau.jsx`' } } },
};

export const Standard = {
  name: 'Tableau',
  render: (args) => (
    <Carte titre="Candidatures reçues">
      <Tableau {...args} colonnes={COLONNES} lignes={LIGNES} legende="Candidatures reçues" />
    </Carte>
  ),
  args: { onLigne: fn() },
};

export const Vide = {
  name: 'Tableau · vide',
  render: () => (
    <Carte titre="Candidatures reçues">
      <Tableau colonnes={COLONNES} lignes={[]} vide="Aucune candidature pour cette offre." />
    </Carte>
  ),
};
