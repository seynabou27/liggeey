import { fn } from 'storybook/test';
import { Row, InfoField, BorderedField, LockedRow, AdminInfoCard, AdminSubListCard, SafeImg, ProfileTierCard, MENTORS } from '../../../components/plateforme/LiggeeyPrototype';
import { AvecPlateforme, fondApp } from './_outils';

export const Ligne = { name: 'Row', render: (a) => <Row {...a} />, args: { label: 'Localisation', value: 'Dakar, Plateau' } };

export const Champ = { name: 'InfoField', render: (a) => <InfoField {...a} />, args: { label: 'Téléphone', value: '+221 77 123 45 67' } };

export const ChampEncadre = { name: 'BorderedField', render: (a) => <div className="max-w-sm"><BorderedField {...a} /></div>, args: { label: 'Salaire', value: '350 000 FCFA/mois', badge: false } };

export const ChampEncadreStatut = { ...ChampEncadre, name: 'BorderedField · statut', args: { label: 'Statut', value: 'Active', badge: true } };

export const LigneVerrouillee = { name: 'LockedRow (réservé Premium)', render: (a) => <LockedRow {...a} />, args: { label: 'Téléphone', onUnlock: fn() } };

export const FicheInfos = {
  name: 'AdminInfoCard',
  render: (a) => <div className="max-w-sm"><AdminInfoCard {...a} /></div>,
  args: {
    title: 'Informations',
    rows: [
      { label: 'Inscription', value: '12/03/2026' },
      { label: 'Ville', value: 'Dakar' },
      { label: 'Statut', value: 'Actif', badge: true },
    ],
  },
};

export const FicheListe = {
  name: 'AdminSubListCard',
  render: (a) => <div className="max-w-sm"><AdminSubListCard {...a} /></div>,
  args: {
    title: 'Candidatures',
    items: [
      { title: 'Chargée de clientèle', sub: 'Dakar · 28 juillet 2026', badge: 'Candidature retenue' },
      { title: 'Assistante RH', sub: 'Dakar · 1 août 2026', badge: 'Candidature reçue' },
      { title: 'Formations suivies', value: '3' },
    ],
  },
};

export const FicheListeVide = { ...FicheListe, name: 'AdminSubListCard · vide', args: { title: 'Candidatures', items: [] } };

export const Image = { name: 'SafeImg · photo', render: (a) => <SafeImg {...a} />, args: { src: MENTORS[0].photo, alt: MENTORS[0].nom, className: 'w-16 h-16 rounded-full object-cover' } };

export const ImageRepliAvatar = { name: 'SafeImg · repli avatar (initiales)', render: (a) => <SafeImg {...a} />, args: { src: '', alt: 'Absatou Diallo', className: 'w-16 h-16 rounded-full', kind: 'avatar' } };

export const ImageRepliPhoto = { name: 'SafeImg · repli photo', render: (a) => <SafeImg {...a} />, args: { src: '', alt: 'Réalisation', className: 'w-40 h-28 rounded-lg', kind: 'photo' } };

const niveau = (espace, formule) => ({
  render: () => (
    <AvecPlateforme espace={espace} formule={formule}>
      <div className="max-w-3xl"><ProfileTierCard /></div>
    </AvecPlateforme>
  ),
});

export const NiveauChercheurEssentiel = { name: 'ProfileTierCard · chercheur Essentiel', ...niveau('chercheur', 'essentiel') };
export const NiveauChercheurPremium = { name: 'ProfileTierCard · chercheur Premium', ...niveau('chercheur', 'premium') };
export const NiveauPrestataire = { name: 'ProfileTierCard · prestataire Essentiel', ...niveau('prestataire', 'essentiel') };
export const NiveauEntreprise = { name: 'ProfileTierCard · entreprise Premium', ...niveau('entreprise', 'premium') };

export default {
  title: 'Composants/Application/Données',
  decorators: [fondApp],
  parameters: { docs: { description: { component: 'Affichage d’informations : lignes, champs, fiches admin, images avec repli, carte du niveau d’abonnement.' } } },
};
