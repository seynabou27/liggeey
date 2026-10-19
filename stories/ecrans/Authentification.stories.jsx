import { Ecran, parametresEcran } from './_ecran';

export default {
  title: 'Écrans/Authentification',
  parameters: { ...parametresEcran, docs: { ...parametresEcran.docs, description: { component: 'Connexion et inscription en trois étapes. Ce sont les seuls écrans ouverts depuis le site (/plateforme/connexion, /plateforme/inscription).' } } },
};

export const Connexion = { render: () => <Ecran ecran="login" /> };

export const InscriptionChoix = { name: 'Inscription · 1. choix du profil', render: () => <Ecran ecran="signup-choice" /> };

export const InscriptionChercheur = { name: 'Inscription · 2. informations (chercheur)', render: () => <Ecran ecran="signup-info" profil="chercheur" /> };

export const InscriptionPrestataire = { name: 'Inscription · 2. informations (prestataire)', render: () => <Ecran ecran="signup-info" profil="prestataire" /> };

export const InscriptionEntreprise = { name: 'Inscription · 2. informations (entreprise)', render: () => <Ecran ecran="signup-info" profil="entreprise" /> };

export const InscriptionCapMetier = { name: 'Inscription · 2. informations (Cap Métier)', render: () => <Ecran ecran="signup-info" profil="jeune" /> };

export const InscriptionMentor = { name: 'Inscription · 2. informations (mentor)', render: () => <Ecran ecran="signup-info" profil="mentor" /> };

export const InscriptionConfirmation = { name: 'Inscription · 3. confirmation', render: () => <Ecran ecran="signup-confirm" profil="chercheur" /> };
