import { useState } from 'react';
import { fn } from 'storybook/test';
import {
  ProfileRadioCard, PROFILES, EditableTags, Pagination, ServiceForm, OffreEntrepriseForm, EventForm,
  CheckinForm, SignalementForm, PasswordChanger, SERVICES_INITIAL, OFFRES_ENTREPRISE_INITIAL, TYPES_SIGNALEMENT, JALONS,
} from '../../../components/plateforme/LiggeeyPrototype';
import { fondApp, policeApp } from './_outils';

export const ChoixProfil = {
  name: 'ProfileRadioCard',
  render: (args) => <div className="max-w-md"><ProfileRadioCard {...args} /></div>,
  args: { profile: PROFILES[0], selected: null, onSelect: fn() },
};

export const ChoixProfilSelectionne = { ...ChoixProfil, name: 'ProfileRadioCard · sélectionnée', args: { profile: PROFILES[0], selected: PROFILES[0].id, onSelect: fn() } };

export const ChoixProfilGroupe = {
  name: 'ProfileRadioCard · groupe interactif',
  render: () => {
    const [choix, setChoix] = useState('prestataire');
    return (
      <div className="max-w-md">
        {PROFILES.map((p) => <ProfileRadioCard key={p.id} profile={p} selected={choix} onSelect={setChoix} />)}
      </div>
    );
  },
};

export const Etiquettes = {
  name: 'EditableTags',
  render: (args) => {
    const [tags, setTags] = useState(args.tags);
    return <EditableTags tags={tags} onChange={(t) => { setTags(t); args.onChange(t); }} />;
  },
  args: { tags: ['BTP', 'Électricité', 'Génie civil'], onChange: fn() },
};

export const EtiquettesVides = { ...Etiquettes, name: 'EditableTags · vide', args: { tags: [], onChange: fn() } };

export const PaginationInteractive = {
  name: 'Pagination',
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={(p) => { setPage(p); args.onPageChange(p); }} />;
  },
  args: { page: 1, pageSize: 6, totalItems: 32, onPageChange: fn() },
};

export const PaginationDernierePage = { ...PaginationInteractive, name: 'Pagination · dernière page', args: { page: 6, pageSize: 6, totalItems: 32, onPageChange: fn() } };

export const PaginationVide = { ...PaginationInteractive, name: 'Pagination · aucun résultat', args: { page: 1, pageSize: 6, totalItems: 0, onPageChange: fn() } };

export const ServiceNouveau = { name: 'ServiceForm · nouveau service', render: (args) => <ServiceForm {...args} />, args: { onSave: fn(), onCancel: fn() } };

export const ServiceModification = { name: 'ServiceForm · modification', render: (args) => <ServiceForm {...args} />, args: { initial: SERVICES_INITIAL[0], onSave: fn(), onCancel: fn() } };

export const OffreNouvelle = { name: 'OffreEntrepriseForm · nouvelle offre', render: (args) => <OffreEntrepriseForm {...args} />, args: { onSave: fn(), onCancel: fn() } };

export const OffreModification = {
  name: 'OffreEntrepriseForm · modification',
  render: (args) => <OffreEntrepriseForm {...args} />,
  args: { initial: { ...OFFRES_ENTREPRISE_INITIAL[0], competencesTxt: (OFFRES_ENTREPRISE_INITIAL[0].competences || []).join(', ') }, onSave: fn(), onCancel: fn() },
};

export const Evenement = { name: 'EventForm (planning)', render: (args) => <div className="max-w-lg"><EventForm {...args} /></div>, args: { defaultDate: '2026-10-20', onSave: fn(), onCancel: fn() } };

export const PointDeSuivi = { name: 'CheckinForm (suivi post-embauche)', render: (args) => <div className="max-w-lg"><CheckinForm {...args} /></div>, args: { jalon: JALONS[1], onSubmit: fn(), onCancel: fn() } };

export const Signalement = {
  name: 'SignalementForm',
  render: (args) => <div className="max-w-lg"><SignalementForm {...args} /></div>,
  args: { types: TYPES_SIGNALEMENT, onSubmit: fn(), onCancel: fn() },
};

export const MotDePasse = { name: 'PasswordChanger', render: () => <div className="max-w-lg"><PasswordChanger /></div> };

export default {
  title: 'Composants/Application/Formulaires',
  decorators: [policeApp],
  parameters: { docs: { description: { component: 'Champs et formulaires de la plateforme : choix du profil, étiquettes, pagination, création de service, d’offre, d’événement, suivi post-embauche, signalement, mot de passe.' } } },
};
