import { Ecran, parametresEcran } from './_ecran';

/* Une story par entrée du menu de l'espace « Mentor » (NAV_ITEMS_BY_ESPACE.mentor). */
export default {
  title: 'Écrans/Mentor',
  parameters: parametresEcran,
};

export const Dashboard = { name: 'Tableau de bord', render: () => <Ecran ecran="dashboard" espace="mentor" /> };

export const Mentores = { name: 'Mes mentorés', render: () => <Ecran ecran="mentores" espace="mentor" /> };

export const Seances = { name: 'Séances', render: () => <Ecran ecran="seances" espace="mentor" /> };

export const Profil = { name: 'Mon profil mentor', render: () => <Ecran ecran="profil" espace="mentor" /> };

export const Messages = { name: "Messages", render: () => <Ecran ecran="messages" espace="mentor" /> };
