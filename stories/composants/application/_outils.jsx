import React, { useMemo, useState } from 'react';
import {
  StoreContext,
  PlanContext,
  buildPlanApi,
  PLANS_INITIAL,
  SUBS_INITIAL,
  USAGE_INITIAL,
  TRANSACTIONS_INITIAL,
  REGUL_STEPS_INITIAL,
  USER_BY_ESPACE,
  UpgradeModal,
  PaymentModal,
  Toaster,
} from '../../../components/plateforme/LiggeeyPrototype';

/**
 * Reproduit, pour une story, l'environnement que le composant racine de la plateforme fournit :
 * mémoire partagée (StoreContext), abonnement (PlanContext), fenêtres d'abonnement et notifications.
 *
 * - espace : chercheur | prestataire | entreprise | admin
 * - formule : essentiel | premium
 * - regularise : pour un prestataire, toutes les étapes de régularisation validées
 */
export function AvecPlateforme({ espace = 'chercheur', formule = 'essentiel', regularise = false, children }) {
  const [plans, setPlans] = useState(PLANS_INITIAL);
  const [subs, setSubs] = useState(() => (espace === 'admin' ? SUBS_INITIAL : { ...SUBS_INITIAL, [espace]: { planId: formule, cycle: 'mensuel' } }));
  const [usage, setUsage] = useState(USAGE_INITIAL);
  const [transactions, setTransactions] = useState(TRANSACTIONS_INITIAL);
  const [upgrade, setUpgrade] = useState(null);
  const [payment, setPayment] = useState(null);
  const [storeData, setStoreData] = useState({});

  const store = useMemo(
    () => ({
      data: storeData,
      set: (key, v, init) =>
        setStoreData((d) => {
          const prev = Object.prototype.hasOwnProperty.call(d, key) ? d[key] : init;
          return { ...d, [key]: typeof v === 'function' ? v(prev) : v };
        }),
    }),
    [storeData],
  );

  const api = buildPlanApi({ espace, user: USER_BY_ESPACE[espace], plans, setPlans, subs, setSubs, usage, setUsage, transactions, setTransactions, setUpgrade, setPayment });
  api.regulSteps = espace === 'prestataire' ? (regularise ? REGUL_STEPS_INITIAL.map((s) => ({ ...s, statut: 'Validé' })) : REGUL_STEPS_INITIAL) : null;

  return (
    <StoreContext.Provider value={store}>
      <PlanContext.Provider value={api}>
        {children}
        {upgrade && <UpgradeModal reasonKey={upgrade} onClose={() => setUpgrade(null)} onNavigate={() => setUpgrade(null)} />}
        {payment && <PaymentModal planId={payment.planId} initialCycle={payment.cycle} onClose={() => setPayment(null)} />}
        <Toaster />
      </PlanContext.Provider>
    </StoreContext.Provider>
  );
}

/** Décorateur : enveloppe la story dans AvecPlateforme, réglé par parameters.plateforme. */
export const avecPlateforme = (Story, { parameters }) => (
  <AvecPlateforme {...(parameters.plateforme ?? {})}>
    <Story />
  </AvecPlateforme>
);

/** Police de l'application (le prototype utilise Inter en style en ligne). */
export const policeApp = (Story) => (
  <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
    <Story />
  </div>
);

/** Fond gris de l'application, derrière les cartes. */
export const fondApp = (Story) => (
  <div className="rounded-lg bg-doux p-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
    <Story />
  </div>
);

/** Statuts connus de StatusBadge (copiés de LiggeeyPrototype.jsx, à tenir à jour). */
export const STATUTS = [
  'Entretien programmé', 'Vue par le recruteur', 'Réponse négative', 'Candidature reçue', 'Candidature Retenue', 'En attente', 'Payé',
  'Refusé', 'Refusée', 'Acceptée', 'En cours', 'Terminée', 'Nouveau', 'Retenu', 'Rejeté', 'Disponible', 'Occupé', 'Vérifié', 'Validé',
  'Suspendu', 'Suspendue', 'Actif', 'Active', 'En pause', 'Complète', 'Brouillon', 'Expirée', 'Inactif', 'Annulée', 'Annulé', 'En révision',
  "En cours d'apprentissage", 'Apprenant', 'Mentoré', 'Remboursé', 'Fait', 'À compléter', 'À venir', "En période d'essai", 'À risque',
  'Confirmé', 'Ouvert', 'Traité', 'En vérification', 'Échoué', 'Échec de paiement',
];
