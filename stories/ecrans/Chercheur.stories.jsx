import { Ecran, parametresEcran } from './_ecran';

/* Une story par entrée du menu de l’espace « Chercheur » (NAV_ITEMS_BY_ESPACE.chercheur). */
export default {
  title: 'Écrans/Chercheur',
  parameters: parametresEcran,
};

export const Dashboard = { name: "Tableau de bord", render: () => <Ecran ecran="dashboard" espace="chercheur" /> };

export const Offres = { name: "Offres d’emploi", render: () => <Ecran ecran="offres" espace="chercheur" /> };

export const Candidatures = { name: "Mes candidatures", render: () => <Ecran ecran="candidatures" espace="chercheur" /> };

export const Formations = { name: "Formations", render: () => <Ecran ecran="formations" espace="chercheur" /> };

export const Mentors = { name: "Mentors", render: () => <Ecran ecran="mentors" espace="chercheur" /> };

export const Suivi = { name: "Suivi post-embauche", render: () => <Ecran ecran="suivi" espace="chercheur" /> };

export const Profil = { name: "Mon profil", render: () => <Ecran ecran="profil" espace="chercheur" /> };

export const Abonnement = { name: "Abonnement", render: () => <Ecran ecran="abonnement" espace="chercheur" /> };

export const Messages = { name: "Messages", render: () => <Ecran ecran="messages" espace="chercheur" /> };
