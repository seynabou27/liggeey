import { expect, userEvent, within } from 'storybook/test';
import OngletsTarifs from '../../../components/tarifs/OngletsTarifs';
import GuideFormule from '../../../components/tarifs/GuideFormule';
import TableauServices from '../../../components/tarifs/TableauServices';
import { tarifs } from '../../../content/fr/tarifs';

export const OngletTalents = { name: 'OngletsTarifs · talents et indépendants', render: () => <OngletsTarifs /> };

export const OngletEntreprises = {
  name: 'OngletsTarifs · entreprises',
  render: () => <OngletsTarifs />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: tarifs.onglets[1] }));
  },
};

export const GuideVide = { name: 'GuideFormule · question 1', render: () => <GuideFormule /> };

export const GuideQuestion2 = {
  name: 'GuideFormule · question 2',
  render: () => <GuideFormule />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: tarifs.guide.profils[0].label }));
  },
};

export const GuideResultat = {
  name: 'GuideFormule · conseil affiché',
  render: () => <GuideFormule />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: tarifs.guide.profils[0].label }));
    const priorites = tarifs.guide.priorites.filter((p) => !p.seulement || p.seulement === tarifs.guide.profils[0].id);
    await userEvent.click(c.getByRole('button', { name: priorites[0].label }));
    await expect(c.getByText(tarifs.guide.conseil)).toBeInTheDocument();
  },
};

export const GuideEntreprise = {
  name: 'GuideFormule · entreprise',
  render: () => <GuideFormule />,
  play: async ({ canvasElement }) => {
    const entreprise = tarifs.guide.profils.find((p) => p.id === 'entreprise');
    if (entreprise) await userEvent.click(within(canvasElement).getByRole('button', { name: entreprise.label }));
  },
};

export const Services = { name: 'TableauServices', render: () => <TableauServices /> };

export default {
  title: 'Composants/Site/Tarifs',
  decorators: [(Story) => <div className="mx-auto max-w-5xl"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: 'Page Tarifs (components/tarifs). Les prix viennent de content/fr/tarifs.js et ne se modifient pas dans les composants.',
      },
    },
  },
};
