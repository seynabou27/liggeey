import { fn } from 'storybook/test';
import { Toaster, notify, ModalFrame, ArchiveConfirm, OffreDetail, FormationDetail, MentorDetail, defaultCoachings, FORMATIONS_ALL, MENTORS, UpgradeModal, PaymentModal, ProfilInfoModal, OFFRES_DATA, UPGRADE_REASONS, COLORS } from '../../../components/plateforme/LiggeeyPrototype';
import { AvecPlateforme, policeApp } from './_outils';

const grand = { docs: { story: { inline: false, height: '680px' } } };

export const Notifications = {
  name: 'Toaster et notify()',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <button type="button" className="rounded-md px-4 py-2 text-sm font-semibold text-sur-marque" style={{ background: COLORS.orange }} onClick={() => notify('Profil mis à jour.')}>
        Notification de succès
      </button>
      <button type="button" className="rounded-md border px-4 py-2 text-sm font-semibold" style={{ borderColor: COLORS.border }} onClick={() => notify('Vous êtes revenu(e) au profil Essentiel.', 'info')}>
        Notification d’information
      </button>
      <Toaster />
    </div>
  ),
  parameters: { docs: { story: { inline: false, height: '260px' } } },
};

export const Cadre = {
  name: 'ModalFrame',
  render: (a) => (
    <ModalFrame {...a}>
      <div className="p-6">
        <h2 id="titre-cadre" className="mb-2 text-lg font-bold">Titre de la fenêtre</h2>
        <p className="text-sm">Contenu libre. Échap ou un clic sur le fond ferme la fenêtre.</p>
      </div>
    </ModalFrame>
  ),
  args: { onClose: fn(), labelledBy: 'titre-cadre', maxWidth: 'max-w-md' },
  argTypes: { maxWidth: { control: 'inline-radio', options: ['max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-2xl'] } },
  parameters: grand,
};

export const Archivage = { name: 'ArchiveConfirm', render: (a) => <ArchiveConfirm {...a} />, args: { onCancel: fn(), onConfirm: fn() }, parameters: grand };

export const DetailOffre = {
  name: 'OffreDetail (postuler)',
  render: (a) => (
    <AvecPlateforme espace="chercheur">
      <OffreDetail {...a} />
    </AvecPlateforme>
  ),
  args: { offre: OFFRES_DATA[0], similaires: [OFFRES_DATA[4]], saved: false, onToggleSave: fn(), onOpen: fn(), onBack: fn(), onNavigate: fn() },
  parameters: grand,
};

export const FicheFormation = {
  name: 'FormationDetail (inscrit, en cours)',
  render: (a) => (
    <AvecPlateforme espace="chercheur">
      <FormationDetail {...a} />
    </AvecPlateforme>
  ),
  args: { formation: FORMATIONS_ALL[0], enrolled: true, progressCount: 6, premium: false, locked: false, similaires: [FORMATIONS_ALL[1]], onToggleEnroll: fn(), onAdvanceModule: fn(), onViewCertificate: fn(), onBack: fn(), onOpen: fn() },
  parameters: grand,
};

export const FicheFormationNonInscrit = {
  name: 'FormationDetail (Premium, verrouillée)',
  render: (a) => (
    <AvecPlateforme espace="chercheur">
      <FormationDetail {...a} />
    </AvecPlateforme>
  ),
  args: { formation: FORMATIONS_ALL[1], enrolled: false, progressCount: 0, premium: true, locked: true, onToggleEnroll: fn(), onAdvanceModule: fn(), onViewCertificate: fn(), onBack: fn(), onOpen: fn() },
  parameters: grand,
};

export const FicheMentor = {
  name: 'MentorDetail',
  render: (a) => (
    <AvecPlateforme espace="chercheur">
      <MentorDetail {...a} coachings={defaultCoachings(a.mentor)} />
    </AvecPlateforme>
  ),
  args: { mentor: MENTORS[0], onUpdate: fn(), onBack: fn() },
  parameters: grand,
};

export const Incitation = {
  name: 'UpgradeModal',
  render: (a) => (
    <AvecPlateforme espace={a.espace}>
      <UpgradeModal reasonKey={a.reasonKey} onClose={a.onClose} onNavigate={a.onNavigate} />
    </AvecPlateforme>
  ),
  args: { espace: 'chercheur', reasonKey: 'candidatures', onClose: fn(), onNavigate: fn() },
  argTypes: {
    espace: { control: 'inline-radio', options: ['chercheur', 'prestataire', 'entreprise'] },
    reasonKey: { control: 'select', options: Object.keys(UPGRADE_REASONS) },
  },
  parameters: grand,
};

export const IncitationEntreprise = { ...Incitation, name: 'UpgradeModal · entreprise (coordonnées)', args: { ...Incitation.args, espace: 'entreprise', reasonKey: 'coordonnees' } };

export const Paiement = {
  name: 'PaymentModal',
  render: (a) => (
    <AvecPlateforme espace={a.espace}>
      <PaymentModal planId="premium" onClose={a.onClose} />
    </AvecPlateforme>
  ),
  args: { espace: 'chercheur', onClose: fn() },
  argTypes: {
    espace: { control: 'inline-radio', options: ['chercheur', 'prestataire', 'entreprise'] },
  },
  parameters: { docs: { story: { inline: false, height: '820px' } } },
};

export const ModificationProfil = {
  name: 'ProfilInfoModal',
  render: (a) => <ProfilInfoModal {...a} />,
  args: {
    nom: 'Absatou Diallo',
    fields: [
      { key: 'profession', label: 'Profession' },
      { key: 'ville', label: 'Ville' },
      { key: 'email', label: 'E-mail', type: 'email' },
      { key: 'telephone', label: 'Téléphone', type: 'tel' },
    ],
    values: { email: 'absatou.diallo@example.com', ville: 'Dakar', profession: 'Commerciale', telephone: '+221 77 123 45 67' },
    onSave: fn(),
    onClose: fn(),
  },
  parameters: grand,
};

export default {
  title: 'Composants/Application/Retours et fenêtres',
  decorators: [policeApp],
  parameters: { docs: { description: { component: 'Notifications (Toaster), cadre de fenêtre modale et fenêtres : archivage, détail d’offre, incitation à passer Premium, paiement (Wave, Orange Money…), modification du profil.' } } },
};
