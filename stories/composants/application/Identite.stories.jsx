import { Logo, COLORS } from '../../../components/plateforme/LiggeeyPrototype';

export default {
  title: 'Composants/Application/Identité/Logo',
  component: Logo,
  args: { height: 24, iconOnly: false, color: COLORS.brandPale },
  argTypes: { color: { control: 'color' } },
  decorators: [(Story) => <div className="inline-flex rounded-lg bg-sombre px-6 py-5"><Story /></div>],
  parameters: { docs: { description: { component: 'Logo SVG de la plateforme, dessiné en code (couleur réglable). Sur le site, les logos sont des fichiers : voir Fondations / Logos.' } } },
};

export const Complet = {};

export const Monogramme = { args: { iconOnly: true, height: 32 } };

export const Orange = { args: { color: COLORS.orange } };

export const Grand = { args: { height: 48 } };

export const SurFondClair = {
  name: 'Sur fond clair',
  args: { color: COLORS.slate },
  decorators: [(Story) => <div className="inline-flex rounded-lg bg-surface px-6 py-5"><Story /></div>],
};
