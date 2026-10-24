import { Ecran, parametresEcran } from './_ecran';

/* Une story par entrée du menu de l’espace « Entreprise » (NAV_ITEMS_BY_ESPACE.entreprise). */
export default {
  title: 'Écrans/Entreprise',
  parameters: parametresEcran,
};

export const Dashboard = { name: "Tableau de bord", render: () => <Ecran ecran="dashboard" espace="entreprise" /> };

export const Offres = { name: "Mes offres", render: () => <Ecran ecran="offres" espace="entreprise" /> };

export const Candidatures = { name: "Candidatures", render: () => <Ecran ecran="candidatures" espace="entreprise" /> };

export const Suivi = { name: "Suivi des recrues", render: () => <Ecran ecran="suivi" espace="entreprise" /> };

export const Prestataires = { name: "Trouver un prestataire", render: () => <Ecran ecran="prestataires" espace="entreprise" /> };

export const Profil = { name: "Profil entreprise", render: () => <Ecran ecran="profil" espace="entreprise" /> };

export const Abonnement = { name: "Abonnement", render: () => <Ecran ecran="abonnement" espace="entreprise" /> };

export const Messages = { name: "Messages", render: () => <Ecran ecran="messages" espace="entreprise" /> };
