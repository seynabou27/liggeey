import { Ecran, parametresEcran } from './_ecran';

/* Une story par entrée du menu de l'espace « Prestataire » (NAV_ITEMS_BY_ESPACE.prestataire). */
export default {
  title: 'Écrans/Prestataire',
  parameters: parametresEcran,
};

export const Dashboard = { name: "Tableau de bord", render: () => <Ecran ecran="dashboard" espace="prestataire" /> };

export const Missions = { name: "Missions", render: () => <Ecran ecran="missions" espace="prestataire" /> };

export const Services = { name: "Mes services", render: () => <Ecran ecran="services" espace="prestataire" /> };

export const Formations = { name: "Formations", render: () => <Ecran ecran="formations" espace="prestataire" /> };

export const Mentors = { name: "Mentors", render: () => <Ecran ecran="mentors" espace="prestataire" /> };

export const Regularisation = { name: "Régularisation", render: () => <Ecran ecran="regularisation" espace="prestataire" /> };

export const Profil = { name: "Mon profil", render: () => <Ecran ecran="profil" espace="prestataire" /> };

export const Abonnement = { name: "Abonnement", render: () => <Ecran ecran="abonnement" espace="prestataire" /> };

export const Evaluations = { name: 'Mes évaluations et avis', render: () => <Ecran ecran="evaluations" espace="prestataire" /> };

export const Realisations = { name: 'Mes réalisations', render: () => <Ecran ecran="realisations" espace="prestataire" /> };

export const Messages = { name: "Messages", render: () => <Ecran ecran="messages" espace="prestataire" /> };
