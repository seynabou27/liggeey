import { Ecran, parametresEcran } from './_ecran';

/* Une story par entrée du menu de l'espace « Admin » (NAV_ITEMS_BY_ESPACE.admin). */
export default {
  title: 'Écrans/Admin',
  parameters: parametresEcran,
};

export const Dashboard = { name: "Tableau de bord", render: () => <Ecran ecran="dashboard" espace="admin" /> };

export const Planning = { name: "Planning", render: () => <Ecran ecran="planning" espace="admin" /> };

export const Communication = { name: "Communication", render: () => <Ecran ecran="communication" espace="admin" /> };

export const Chercheurs = { name: "Chercheurs", render: () => <Ecran ecran="chercheurs" espace="admin" /> };

export const Prestataires = { name: "Prestataires", render: () => <Ecran ecran="prestataires" espace="admin" /> };

export const Entreprises = { name: "Entreprises", render: () => <Ecran ecran="entreprises" espace="admin" /> };

export const Offres = { name: "Offres", render: () => <Ecran ecran="offres" espace="admin" /> };

export const Candidatures = { name: "Candidatures", render: () => <Ecran ecran="candidatures" espace="admin" /> };

export const Services = { name: "Services", render: () => <Ecran ecran="services" espace="admin" /> };

export const Missions = { name: "Missions", render: () => <Ecran ecran="missions" espace="admin" /> };

export const Formations = { name: "Formations", render: () => <Ecran ecran="formations" espace="admin" /> };

export const Mentorat = { name: "Mentorat", render: () => <Ecran ecran="mentorat" espace="admin" /> };

export const CapMetier = { name: "Cap Métier", render: () => <Ecran ecran="cap-metier" espace="admin" /> };

export const Suivi = { name: "Suivi post-embauche", render: () => <Ecran ecran="suivi" espace="admin" /> };

export const Verifications = { name: "Vérification des documents", render: () => <Ecran ecran="verifications" espace="admin" /> };

export const Regularisations = { name: "Régularisations", render: () => <Ecran ecran="regularisations" espace="admin" /> };

export const Abonnements = { name: "Abonnements", render: () => <Ecran ecran="abonnements" espace="admin" /> };

export const Parametres = { name: "Paramètres", render: () => <Ecran ecran="parametres" espace="admin" /> };
