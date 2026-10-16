import { Check, Pencil, Trash2, Upload } from 'lucide-react';
import { fn } from 'storybook/test';
import { ActionButton, FilePickerButton, COLORS } from '../../../components/plateforme/LiggeeyPrototype';
import { policeApp } from './_outils';

export const Principal = {
  render: (args) => <ActionButton {...args} />,
  args: { label: 'Valider', variant: 'primary', icon: Check, onClick: fn() },
  argTypes: { variant: { control: 'inline-radio', options: ['primary', 'neutral', 'warning', 'danger'] }, icon: { control: false } },
};

export const Neutre = { ...Principal, args: { ...Principal.args, label: 'Modifier', variant: 'neutral', icon: Pencil } };

export const Avertissement = { ...Principal, args: { ...Principal.args, label: 'Suspendre', variant: 'warning', icon: undefined } };

export const Danger = { ...Principal, args: { ...Principal.args, label: 'Supprimer', variant: 'danger', icon: Trash2 } };

export const Toutes = {
  name: 'Toutes les variantes',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ActionButton label="Valider" variant="primary" icon={Check} />
      <ActionButton label="Modifier" variant="neutral" icon={Pencil} />
      <ActionButton label="Suspendre" variant="warning" />
      <ActionButton label="Supprimer" variant="danger" icon={Trash2} />
    </div>
  ),
};

export const ChoixDeFichier = {
  name: 'FilePickerButton',
  render: (args) => (
    <FilePickerButton {...args} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold" style={{ borderColor: COLORS.border, color: COLORS.slate }}>
      <Upload size={15} /> Choisir un fichier
    </FilePickerButton>
  ),
  args: { accept: '.pdf,image/*', onPick: fn() },
  parameters: { docs: { description: { story: 'Bouton qui ouvre le sélecteur de fichiers du téléphone ; le fichier choisi est transmis à onPick.' } } },
};

export default {
  title: 'Composants/Application/Actions',
  decorators: [policeApp],
  parameters: { docs: { description: { component: 'ActionButton (boutons des fiches admin) et FilePickerButton (envoi de justificatifs, photos).' } } },
};
