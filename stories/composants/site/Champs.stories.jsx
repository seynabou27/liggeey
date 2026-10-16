import {
  CaseConsentement,
  ChampSelect,
  ChampTexte,
  ChampZone,
  GroupeCases,
  GroupeChoix,
  MessageErreur,
} from '../../../components/formulaires/Champs';
import { secteurs, taillesEntreprise } from '../../../content/referentiels';
import { demo } from '../../../content/fr/entreprises';

/* Tous les champs de components/formulaires/Champs.jsx, avec leurs états (repos, rempli, obligatoire, erreur). */
export default {
  title: 'Composants/Site/Formulaires/Champs',
  component: ChampTexte,
  args: { nom: 'email', label: 'Adresse e-mail', placeholder: 'vous@exemple.sn', requis: true, type: 'email' },
  argTypes: { type: { control: 'select', options: ['text', 'email', 'tel', 'password', 'number'] } },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'Champs des formulaires du site. Chaque champ porte son libellé, l’astérisque des champs obligatoires et le message d’erreur relié par `aria-describedby`.',
      },
    },
  },
};

export const Texte = {};

export const Rempli = { args: { defaultValue: 'awa.ndiaye@exemple.sn' } };

export const Facultatif = { args: { requis: false, label: 'E-mail (facultatif)' } };

export const AvecErreur = { args: { erreur: 'Indiquez une adresse e-mail valide.', defaultValue: 'abdou@' } };

export const Desactive = { name: 'Désactivé', args: { disabled: true, defaultValue: 'awa.ndiaye@exemple.sn' } };

export const Telephone = {
  name: 'Téléphone',
  args: { nom: 'telephone', label: 'Téléphone (WhatsApp)', type: 'tel', inputMode: 'tel', placeholder: '+221 77 000 00 00' },
};

export const ZoneDeTexte = {
  render: (args) => <ChampZone {...args} />,
  args: { nom: 'message', label: 'Message', requis: true, placeholder: 'Votre message' },
};

export const ZoneDeTexteErreur = {
  name: 'Zone de texte · erreur',
  render: (args) => <ChampZone {...args} />,
  args: { nom: 'message', label: 'Message', requis: true, erreur: 'Ce champ est obligatoire.' },
};

export const ListeDeroulante = {
  name: 'Liste déroulante',
  render: (args) => <ChampSelect {...args} />,
  args: { nom: 'secteur', label: 'Secteur d’activité', options: secteurs, vide: 'Choisir' },
};

export const ListeDeroulanteErreur = {
  name: 'Liste déroulante · erreur',
  render: (args) => <ChampSelect {...args} />,
  args: { nom: 'motif', label: 'Motif', requis: true, options: ['Une question', 'Partenariat'], erreur: 'Ce champ est obligatoire.' },
};

export const ChoixUnique = {
  name: 'Choix unique (pastilles)',
  render: (args) => <GroupeChoix {...args} />,
  args: { nom: 'taille', label: 'Nombre de salariés', options: taillesEntreprise, defaultValue: '11 à 50' },
};

export const ChoixMultiples = {
  name: 'Choix multiples (cases)',
  render: (args) => <GroupeCases {...args} />,
  args: { nom: 'interets', label: 'Ce qui vous intéresse', options: demo.interets, cochees: ['Recrutement accompagné'] },
};

export const Consentement = {
  render: (args) => <CaseConsentement {...args} />,
  args: { label: 'J’accepte la politique de confidentialité.' },
};

export const ConsentementErreur = {
  name: 'Consentement · erreur',
  render: (args) => <CaseConsentement {...args} />,
  args: { label: 'J’accepte la politique de confidentialité.', erreur: 'Merci de cocher cette case pour continuer.' },
};

export const EchecEnvoi = {
  name: 'Message d’échec d’envoi',
  render: () => <MessageErreur lienWhatsApp="https://wa.me/221770000000" />,
};
