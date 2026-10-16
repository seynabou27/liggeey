import { fn } from 'storybook/test';
import {
  OfferCard, FormationCard, MentorCard, CandidatureCard, DemandeCard, ServiceCard, MissionCard, OffreEntrepriseCard,
  CandidatureEntrepriseRow, PrestataireSearchCard, IdentityCell,
  OFFRES_DATA, CANDIDATURES, FORMATIONS_ALL, MENTORS, DEMANDES_RECENTES, SERVICES_INITIAL, MISSIONS_INITIAL,
  OFFRES_ENTREPRISE_INITIAL, CANDIDATURES_ENTREPRISE_INITIAL, PRESTATAIRES_SEARCH,
} from '../../../components/plateforme/LiggeeyPrototype';
import { fondApp } from './_outils';

/* Les données sont celles de la démo du prototype. */
const carte = (Composant, args, largeur = 'max-w-xs') => ({
  render: (a) => <div className={largeur}><Composant {...a} /></div>,
  args,
});

/* ---------- Chercheur d'emploi ---------- */

export const Offre = { name: 'OfferCard', ...carte(OfferCard, { offre: OFFRES_DATA[0], applied: false, onOpen: fn() }) };
export const OffreDejaPostulee = { name: 'OfferCard · déjà postulé', ...carte(OfferCard, { offre: OFFRES_DATA[1], applied: true, onOpen: fn() }) };
export const OffreSponsorisee = { name: 'OfferCard · sponsorisée', ...carte(OfferCard, { offre: { ...OFFRES_DATA[2], sponsorisee: true }, applied: false, onOpen: fn() }) };

export const Formation = { name: 'FormationCard', ...carte(FormationCard, { f: FORMATIONS_ALL[0], premium: false, locked: false, onOpen: fn() }) };
export const FormationPremium = { name: 'FormationCard · Premium débloquée', ...carte(FormationCard, { f: FORMATIONS_ALL[1], premium: true, locked: false, onOpen: fn() }) };
export const FormationVerrouillee = { name: 'FormationCard · Premium verrouillée', ...carte(FormationCard, { f: FORMATIONS_ALL[1], premium: true, locked: true, onOpen: fn() }) };

export const Mentor = { name: 'MentorCard · votre mentor', ...carte(MentorCard, { m: MENTORS[0], onOpen: fn() }) };
export const MentorAutre = { name: 'MentorCard', ...carte(MentorCard, { m: { ...MENTORS[1], historique: undefined }, onOpen: fn() }) };
export const MentorSansPhoto = { name: 'MentorCard · sans photo (initiales)', ...carte(MentorCard, { m: { ...MENTORS[1], photo: '', historique: undefined }, onOpen: fn() }) };

export const CandidatureRecue = { name: 'CandidatureCard · reçue', ...carte(CandidatureCard, { c: CANDIDATURES.find((c) => c.step === 1), onNavigate: fn() }, 'max-w-2xl') };
export const CandidatureVue = { name: 'CandidatureCard · vue', ...carte(CandidatureCard, { c: CANDIDATURES.find((c) => c.step === 2), onNavigate: fn() }, 'max-w-2xl') };
export const CandidatureRetenue = { name: 'CandidatureCard · retenue (embauche)', ...carte(CandidatureCard, { c: CANDIDATURES.find((c) => c.embauche), onNavigate: fn() }, 'max-w-2xl') };
export const CandidatureRefusee = { name: 'CandidatureCard · réponse négative', ...carte(CandidatureCard, { c: CANDIDATURES.find((c) => c.negative), onNavigate: fn() }, 'max-w-2xl') };

/* ---------- Prestataire ---------- */

export const Demande = { name: 'DemandeCard', ...carte(DemandeCard, { d: DEMANDES_RECENTES[0] }, 'max-w-md') };
export const DemandeNormale = { name: 'DemandeCard · priorité normale', ...carte(DemandeCard, { d: DEMANDES_RECENTES[1] }, 'max-w-md') };

export const Service = { name: 'ServiceCard · disponible', ...carte(ServiceCard, { s: SERVICES_INITIAL[0], onOpen: fn(), onEdit: fn(), onArchive: fn() }) };
export const ServiceIndisponible = { name: 'ServiceCard · indisponible', ...carte(ServiceCard, { s: SERVICES_INITIAL.find((s) => !s.disponible), onOpen: fn(), onEdit: fn(), onArchive: fn() }) };

export const MissionEnAttente = { name: 'MissionCard · en attente', ...carte(MissionCard, { m: MISSIONS_INITIAL.find((m) => m.statut === 'En attente'), onOpen: fn(), onAccept: fn(), onRefuse: fn() }, 'max-w-2xl') };
export const MissionAcceptee = { name: 'MissionCard · acceptée', ...carte(MissionCard, { m: MISSIONS_INITIAL.find((m) => m.statut !== 'En attente'), onOpen: fn(), onAccept: fn(), onRefuse: fn() }, 'max-w-2xl') };

/* ---------- Entreprise ---------- */

export const OffreEntreprise = { name: 'OffreEntrepriseCard', ...carte(OffreEntrepriseCard, { o: OFFRES_ENTREPRISE_INITIAL[0], onOpen: fn() }) };
export const OffreEntrepriseSponsorisee = { name: 'OffreEntrepriseCard · sponsorisée', ...carte(OffreEntrepriseCard, { o: { ...OFFRES_ENTREPRISE_INITIAL[0], sponsorisee: true }, onOpen: fn() }) };
export const OffreEntrepriseAutreStatut = { name: 'OffreEntrepriseCard · autre statut', ...carte(OffreEntrepriseCard, { o: OFFRES_ENTREPRISE_INITIAL.find((o) => o.statut !== 'Active') ?? OFFRES_ENTREPRISE_INITIAL[1], onOpen: fn() }) };

export const LigneCandidat = { name: 'CandidatureEntrepriseRow · Premium', ...carte(CandidatureEntrepriseRow, { c: CANDIDATURES_ENTREPRISE_INITIAL[0], onOpen: fn() }, 'max-w-3xl') };
export const LigneCandidatEssentiel = { name: 'CandidatureEntrepriseRow · Essentiel', ...carte(CandidatureEntrepriseRow, { c: CANDIDATURES_ENTREPRISE_INITIAL[1], onOpen: fn() }, 'max-w-3xl') };

export const Prestataire = { name: 'PrestataireSearchCard · Premium et régularisé', ...carte(PrestataireSearchCard, { p: PRESTATAIRES_SEARCH[0], onOpen: fn() }) };
export const PrestataireSimple = { name: 'PrestataireSearchCard · Essentiel', ...carte(PrestataireSearchCard, { p: PRESTATAIRES_SEARCH[1], onOpen: fn() }) };

/* ---------- Admin ---------- */

export const Identite = { name: 'IdentityCell · initiales', ...carte(IdentityCell, { nom: 'Absatou Diallo', sub: 'absatou.diallo@example.com' }) };
export const IdentitePhoto = { name: 'IdentityCell · photo', ...carte(IdentityCell, { nom: MENTORS[0].nom, sub: MENTORS[0].role, photo: MENTORS[0].photo }) };

export const Grille = {
  name: 'Grille de cartes (offres)',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {OFFRES_DATA.slice(0, 6).map((o) => <OfferCard key={o.titre} offre={o} onOpen={() => {}} />)}
    </div>
  ),
};

export default {
  title: 'Composants/Application/Cartes',
  decorators: [fondApp],
  parameters: { docs: { description: { component: 'Cartes de la plateforme, regroupées par espace : chercheur (offres, formations, mentors, candidatures), prestataire (demandes, services, missions), entreprise (offres, candidats, prestataires), admin.' } } },
};
