import { expect, userEvent, within } from 'storybook/test';
import FormulaireContact from '../../../components/formulaires/FormulaireContact';
import FormulaireDemo from '../../../components/formulaires/FormulaireDemo';
import FormulaireJobDating from '../../../components/formulaires/FormulaireJobDating';
import BandeNewsletter from '../../../components/blocs/BandeNewsletter';
import { evenements } from '../../../content/evenements';

/* Formulaires complets. L'envoi est simulé (preview.jsx, parameters.formulaire) : succès, erreur ou attente.
   Les états « erreurs », « envoi », « succès » et « échec » sont joués automatiquement (onglet Interactions). */

const remplir = async (canvas, champs) => {
  for (const [label, valeur] of champs) await userEvent.type(canvas.getByLabelText(label), valeur);
};
const cocher = (canvas) => userEvent.click(canvas.getByRole('checkbox', { name: /accepte/i }));
const envoyer = (canvas, nom) => userEvent.click(canvas.getByRole('button', { name: nom }));

const CONTACT = [
  [/Nom et prénom/, 'Awa Ndiaye'],
  [/Téléphone/, '77 000 00 00'],
  [/Message/, 'Bonjour, j’ai besoin d’aide pour créer mon profil.'],
];

/* ---------- Contact ---------- */

export const ContactRepos = {
  name: 'Contact · repos',
  render: (args) => <FormulaireContact {...args} />,
  args: { motifInitial: '' },
  argTypes: { motifInitial: { control: 'select', options: ['', 'question', 'aide-inscription', 'rendez-vous', 'offre-suspecte', 'partenariat', 'autre'] } },
};

export const ContactMotifPrerempli = {
  name: 'Contact · motif prérempli',
  render: () => <FormulaireContact motifInitial="partenariat" />,
};

export const ContactErreurs = {
  name: 'Contact · erreurs de validation',
  render: () => <FormulaireContact />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await envoyer(c, 'Envoyer');
    await expect(c.getAllByText('Ce champ est obligatoire.').length).toBeGreaterThan(0);
  },
};

export const ContactEnvoi = {
  name: 'Contact · envoi en cours',
  render: () => <FormulaireContact />,
  parameters: { formulaire: 'attente' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await remplir(c, CONTACT);
    await userEvent.selectOptions(c.getByLabelText(/Motif/), 'question');
    await cocher(c);
    await envoyer(c, 'Envoyer');
    await expect(await c.findByRole('button', { name: 'Envoi…' })).toBeDisabled();
  },
};

export const ContactSucces = {
  name: 'Contact · succès',
  render: () => <FormulaireContact />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await remplir(c, CONTACT);
    await userEvent.selectOptions(c.getByLabelText(/Motif/), 'question');
    await cocher(c);
    await envoyer(c, 'Envoyer');
    await expect(await c.findByRole('status')).toBeInTheDocument();
  },
};

export const ContactEchec = {
  name: 'Contact · échec de l’envoi',
  render: () => <FormulaireContact />,
  parameters: { formulaire: 'erreur' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await remplir(c, CONTACT);
    await userEvent.selectOptions(c.getByLabelText(/Motif/), 'question');
    await cocher(c);
    await envoyer(c, 'Envoyer');
    await expect(await c.findByRole('alert')).toBeInTheDocument();
  },
};

/* ---------- Demande de démo ---------- */

const DEMO = [
  [/Nom et prénom/, 'Moussa Diop'],
  [/^Entreprise/, 'Entreprise Exemple'],
  [/Téléphone/, '77 000 00 00'],
  [/E-mail professionnel/, 'rh@exemple.sn'],
];

export const DemoRepos = { name: 'Démo · repos', render: () => <FormulaireDemo /> };

export const DemoJobDating = { name: 'Démo · « Job Dating » coché', render: () => <FormulaireDemo service="jobdating" /> };

export const DemoErreurs = {
  name: 'Démo · erreurs de validation',
  render: () => <FormulaireDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByLabelText(/E-mail professionnel/), 'rh@exemple');
    await envoyer(c, 'Envoyer ma demande');
    await expect(c.getByText('Indiquez une adresse e-mail valide.')).toBeInTheDocument();
  },
};

export const DemoSucces = {
  name: 'Démo · succès',
  render: () => <FormulaireDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await remplir(c, DEMO);
    await cocher(c);
    await envoyer(c, 'Envoyer ma demande');
    await expect(await c.findByRole('status')).toBeInTheDocument();
  },
};

/* ---------- Job Dating ---------- */

const JD = [
  [/Nom et prénom/, 'Fatou Sarr'],
  [/Téléphone/, '76 000 00 00'],
];

export const JobDatingRepos = { name: 'Job Dating · repos', render: () => <FormulaireJobDating evenement={evenements[0]} /> };

export const JobDatingErreurs = {
  name: 'Job Dating · erreurs de validation',
  render: () => <FormulaireJobDating evenement={evenements[0]} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByLabelText(/Téléphone/), '12 34');
    await envoyer(c, 'Valider mon inscription');
    await expect(c.getByText(/Indiquez un numéro valide/)).toBeInTheDocument();
  },
};

export const JobDatingSucces = {
  name: 'Job Dating · succès (paiement)',
  render: () => <FormulaireJobDating evenement={evenements[0]} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await remplir(c, JD);
    await cocher(c);
    await envoyer(c, 'Valider mon inscription');
    await expect(await c.findByRole('status')).toBeInTheDocument();
  },
};

/* ---------- Newsletter ---------- */

export const NewsletterRepos = { name: 'Newsletter · repos', render: () => <BandeNewsletter />, parameters: { layout: 'fullscreen' } };

export const NewsletterErreur = {
  name: 'Newsletter · e-mail invalide',
  render: () => <BandeNewsletter />,
  parameters: { layout: 'fullscreen' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByPlaceholderText('Votre adresse e-mail'), 'awa@');
    await envoyer(c, "Je m'abonne");
  },
};

export const NewsletterSucces = {
  name: 'Newsletter · succès',
  render: () => <BandeNewsletter />,
  parameters: { layout: 'fullscreen' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByPlaceholderText('Votre adresse e-mail'), 'awa@exemple.sn');
    await envoyer(c, "Je m'abonne");
    await expect(await c.findByRole('status')).toBeInTheDocument();
  },
};

export const NewsletterEchec = {
  name: 'Newsletter · échec',
  render: () => <BandeNewsletter />,
  parameters: { layout: 'fullscreen', formulaire: 'erreur' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByPlaceholderText('Votre adresse e-mail'), 'awa@exemple.sn');
    await envoyer(c, "Je m'abonne");
  },
};

export default {
  title: 'Composants/Site/Formulaires/Formulaires complets',
  decorators: [(Story, { parameters }) => (parameters.layout === 'fullscreen' ? <Story /> : <div className="max-w-2xl"><Story /></div>)],
  parameters: {
    docs: {
      description: {
        component:
          'FormulaireContact, FormulaireDemo, FormulaireJobDating (components/formulaires) et BandeNewsletter (components/blocs). Ils passent tous par le hook `useEnvoi` : repos → erreurs → envoi → succès ou échec.',
      },
    },
  },
};
