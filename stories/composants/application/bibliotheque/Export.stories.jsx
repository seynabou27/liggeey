import { fn } from 'storybook/test';
import { MenuExport, Carte } from '../../../../components/app';

const LIGNES = [
  { nom: 'Moussa Diop', metier: 'Électricien bâtiment', ville: 'Dakar', date: '15/08/2026', statut: 'Nouveau' },
  { nom: 'Fatou Sarr', metier: 'Plombière sanitaire', ville: 'Thiès', date: '14/08/2026', statut: 'En attente' },
  { nom: 'Ibrahima Diallo', metier: 'Soudeur industriel', ville: 'Saint-Louis', date: '12/08/2026', statut: 'Vérifié' },
];

const COLONNES = [
  { titre: 'Nom', valeur: (l) => l.nom },
  { titre: 'Métier', valeur: (l) => l.metier },
  { titre: 'Ville', valeur: (l) => l.ville },
  { titre: "Date d'inscription", valeur: (l) => l.date },
  { titre: 'Statut', valeur: (l) => l.statut },
];

export default {
  title: 'Composants/Application/Bibliothèque/Export',
  component: MenuExport,
  parameters: {
    docs: {
      description: {
        component:
          'Bouton « Exporter » des listes de l’admin : PDF, Excel (.xlsx) ou CSV, avec toutes les lignes filtrées. `components/app/Export.jsx`, logique dans `lib/export.js`.',
      },
    },
  },
  args: { onTermine: fn(), onErreur: fn() },
};

export const Standard = {
  name: 'Menu d’export',
  render: (args) => (
    <Carte titre="Chercheurs d'emploi" actions={<MenuExport {...args} />}>
      <p className="pb-48 text-sm text-secondaire">Ouvrez le menu pour télécharger les {LIGNES.length} lignes.</p>
    </Carte>
  ),
  args: { titre: "Chercheurs d'emploi", colonnes: COLONNES, lignes: LIGNES, sousTitre: 'Filtres : Dakar' },
};

export const Vide = {
  name: 'Menu d’export · aucune ligne',
  render: (args) => <MenuExport {...args} />,
  args: { titre: "Chercheurs d'emploi", colonnes: COLONNES, lignes: [] },
};
