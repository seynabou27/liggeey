import { useState } from 'react';
import { Briefcase, CalendarCheck, FileText } from 'lucide-react';
import { fn } from 'storybook/test';
import {
  StatCard, StatMini, ProgressBar, UsageMeter, Stars, RatingInput, Stepper, CandidatureStepper, ChecklistItem, SSLNote, COLORS,
} from '../../../components/plateforme/LiggeeyPrototype';
import { policeApp } from './_outils';

export const CarteChiffre = {
  name: 'StatCard',
  render: (args) => <div className="max-w-[240px]"><StatCard {...args} /></div>,
  args: { icon: Briefcase, value: 12, label: 'Candidatures envoyées' },
  argTypes: { icon: { control: false } },
};

export const CartesChiffres = {
  name: 'StatCard · rangée',
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
      <StatCard icon={FileText} value={4} label="Candidatures" />
      <StatCard icon={CalendarCheck} value={1} label="Entretien programmé" />
      <StatCard icon={Briefcase} value={36} label="Offres disponibles" />
    </div>
  ),
};

export const MiniChiffre = { name: 'StatMini', render: (args) => <div className="max-w-[160px]"><StatMini {...args} /></div>, args: { value: '4.8/5', label: 'Note moyenne' } };

export const Progression = {
  name: 'ProgressBar',
  render: (args) => <div className="max-w-sm"><ProgressBar {...args} /></div>,
  args: { pct: 50, color: COLORS.orange },
  argTypes: { pct: { control: { type: 'range', min: 0, max: 100 } }, color: { control: 'color' } },
};

export const ProgressionPaliers = {
  name: 'ProgressBar · paliers',
  render: () => (
    <div className="max-w-sm space-y-3">
      {[0, 25, 50, 75, 100].map((p) => (
        <div key={p} className="flex items-center gap-3 text-xs">
          <span className="w-10">{p} %</span>
          <div className="flex-1"><ProgressBar pct={p} color={p === 100 ? '#16A34A' : COLORS.orange} /></div>
        </div>
      ))}
    </div>
  ),
};

export const Consommation = {
  name: 'UsageMeter',
  render: (args) => <div className="max-w-sm rounded-lg bg-sombre p-5"><UsageMeter {...args} /></div>,
  args: { label: 'Candidatures ce mois-ci', used: 3, limit: 5 },
};

export const ConsommationAtteinte = { ...Consommation, name: 'UsageMeter · limite atteinte', args: { label: 'Candidatures ce mois-ci', used: 5, limit: 5 } };

export const ConsommationIllimitee = { ...Consommation, name: 'UsageMeter · illimité', args: { label: 'Candidatures ce mois-ci', used: 12, limit: Infinity } };

export const Etoiles = {
  name: 'Stars',
  render: (args) => <Stars {...args} />,
  args: { note: 4, size: 13 },
  argTypes: { note: { control: { type: 'range', min: 0, max: 5 } } },
};

export const Notation = {
  name: 'RatingInput',
  render: (args) => {
    const [valeur, setValeur] = useState(args.value);
    return (
      <div className="max-w-sm">
        <RatingInput {...args} value={valeur} onChange={(n) => { setValeur(n); args.onChange(n); }} />
      </div>
    );
  },
  args: { label: 'Intégration dans l’équipe', value: 3, onChange: fn() },
};

export const EtapesInscription1 = { name: 'Stepper (inscription) · étape 1', render: (args) => <div className="max-w-md"><Stepper {...args} /></div>, args: { step: 1 }, argTypes: { step: { control: 'inline-radio', options: [1, 2, 3] } } };

export const EtapesInscription2 = { ...EtapesInscription1, name: 'Stepper (inscription) · étape 2', args: { step: 2 } };

export const EtapesInscription3 = { ...EtapesInscription1, name: 'Stepper (inscription) · étape 3', args: { step: 3 } };

export const SuiviCandidature = {
  name: 'CandidatureStepper',
  render: (args) => <div className="max-w-md"><CandidatureStepper {...args} /></div>,
  args: { step: 2, negative: false },
  argTypes: { step: { control: 'inline-radio', options: [1, 2, 3, 4] } },
};

export const SuiviCandidatureEtapes = {
  name: 'CandidatureStepper · toutes les étapes',
  render: () => (
    <div className="max-w-md space-y-4">
      {[1, 2, 3, 4].map((s) => <CandidatureStepper key={s} step={s} />)}
      <CandidatureStepper step={4} negative />
    </div>
  ),
};

export const SuiviCandidatureNegatif = { ...SuiviCandidature, name: 'CandidatureStepper · réponse négative', args: { step: 4, negative: true } };

export const ElementDeListe = {
  name: 'ChecklistItem',
  render: () => (
    <div>
      <ChecklistItem label="Photo de profil" done />
      <ChecklistItem label="Diplômes" done />
      <ChecklistItem label="Compétences vérifiées" done={false} />
    </div>
  ),
};

export const NoteSecurite = { name: 'SSLNote', render: () => <SSLNote /> };

export default {
  title: 'Composants/Application/Indicateurs',
  decorators: [policeApp],
  parameters: { docs: { description: { component: 'Chiffres, barres de progression, consommation d’abonnement, notes, étapes.' } } },
};
