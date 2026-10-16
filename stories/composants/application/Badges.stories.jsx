import { StatusBadge, TierBadge, PremiumChip, RegulBadge, EventChip, PLANNING_EVENTS_INITIAL } from '../../../components/plateforme/LiggeeyPrototype';
import { AvecPlateforme, STATUTS, policeApp } from './_outils';

export const Statut = {
  name: 'StatusBadge',
  render: (args) => <StatusBadge {...args} />,
  args: { status: 'Entretien programmé' },
  argTypes: { status: { control: 'select', options: STATUTS } },
};

export const TousLesStatuts = {
  name: 'StatusBadge · tous les statuts',
  render: () => (
    <div className="flex flex-wrap gap-2">
      {STATUTS.map((s) => (
        <StatusBadge key={s} status={s} />
      ))}
      <StatusBadge status="Statut inconnu" />
    </div>
  ),
  parameters: { docs: { description: { story: 'Quatre tons : positif (vert), en cours (orange), négatif (rouge), neutre (gris), plus « Nouveau » et « Ouvert » en bleu. Un statut inconnu s’affiche en gris.' } } },
};

export const NiveauPremium = { name: 'TierBadge · Premium', render: (args) => <TierBadge {...args} />, args: { premium: true, size: 'md' }, argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } } };

export const NiveauEssentiel = { ...NiveauPremium, name: 'TierBadge · Essentiel', args: { premium: false, size: 'md' } };

export const NiveauPetit = {
  name: 'TierBadge · petite taille',
  render: () => (
    <div className="flex gap-2">
      <TierBadge premium size="sm" />
      <TierBadge size="sm" />
    </div>
  ),
};

export const Puce = { name: 'PremiumChip', render: (args) => <PremiumChip {...args} />, args: { label: 'Premium', locked: false } };

export const PuceVerrouillee = { name: 'PremiumChip · verrouillée', render: (args) => <PremiumChip {...args} />, args: { label: 'Premium', locked: true } };

export const PuceSponsorisee = { name: 'PremiumChip · sponsorisée', render: (args) => <PremiumChip {...args} />, args: { label: 'Sponsorisée' } };

export const RegularisationEnCours = {
  name: 'RegulBadge · en cours',
  render: () => (
    <AvecPlateforme espace="prestataire">
      <RegulBadge />
    </AvecPlateforme>
  ),
};

export const RegularisationTerminee = {
  name: 'RegulBadge · activité régularisée',
  render: () => (
    <AvecPlateforme espace="prestataire" regularise>
      <RegulBadge />
    </AvecPlateforme>
  ),
};

export const Evenements = {
  name: 'EventChip (planning)',
  render: () => (
    <div className="w-40 space-y-1">
      {PLANNING_EVENTS_INITIAL.slice(0, 5).map((e) => (
        <EventChip key={e.id} e={e} />
      ))}
    </div>
  ),
  parameters: { docs: { description: { story: 'Types : Formation (bleu), Mission (orange), Deadline (rouge), Événement (vert).' } } },
};

export default {
  title: 'Composants/Application/Badges et statuts',
  decorators: [policeApp],
  parameters: { docs: { description: { component: 'Pastilles de statut, de niveau d’abonnement (Essentiel / Premium), de régularisation et d’événement.' } } },
};
