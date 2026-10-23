import { Ecran, parametresEcran } from './_ecran';

/* Une story par entrée du menu de l'espace « Cap Métier » (NAV_ITEMS_BY_ESPACE.jeune).
   La jeune de démo a 16 ans : les règles pour les mineurs s'appliquent (séances en groupe ou au bureau). */
export default {
  title: 'Écrans/Cap Métier',
  parameters: parametresEcran,
};

export const Parcours = { name: 'Mon parcours', render: () => <Ecran ecran="dashboard" espace="jeune" /> };

export const Orientation = { name: "Bilan d'orientation", render: () => <Ecran ecran="orientation" espace="jeune" /> };

export const Ateliers = { name: 'Ateliers découverte', render: () => <Ecran ecran="ateliers" espace="jeune" /> };

export const Mentor = { name: 'Mon mentor', render: () => <Ecran ecran="mentor" espace="jeune" /> };

export const Profil = { name: 'Mon profil', render: () => <Ecran ecran="profil" espace="jeune" /> };

export const Messages = { name: "Messages", render: () => <Ecran ecran="messages" espace="jeune" /> };
