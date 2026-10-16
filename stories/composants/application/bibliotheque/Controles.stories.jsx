import { useState } from 'react';
import { fn } from 'storybook/test';
import { Bell, Pencil, Trash2 } from 'lucide-react';
import { BoutonIcone, ChampRecherche, SelecteurPeriode, Onglets, Segments, PaginationApp, Interrupteur } from '../../../../components/app';
import Bouton from '../../../../components/ui/Bouton';

export default {
  title: 'Composants/Application/Bibliothèque/Contrôles',
  component: BoutonIcone,
  parameters: { docs: { description: { component: 'Contrôles de l’application. `components/app/Controles.jsx` ; boutons : `components/ui/Bouton.jsx` (variantes doux et neutre).' } } },
};

export const Boutons = {
  name: 'Bouton · variantes de l’application',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Bouton petit>Publier une offre</Bouton>
      <Bouton petit variante="doux">Filtrer</Bouton>
      <Bouton petit variante="neutre">Annuler</Bouton>
      <Bouton petit variante="secondaire">Exporter</Bouton>
    </div>
  ),
};

export const BoutonsIcones = {
  name: 'BoutonIcone',
  render: () => (
    <div className="flex items-center gap-3">
      <BoutonIcone icone={Bell} label="Notifications" pastille onClick={fn()} />
      <BoutonIcone icone={Pencil} label="Modifier" variante="fantome" taille="sm" onClick={fn()} />
      <BoutonIcone icone={Trash2} label="Supprimer" variante="doux" taille="sm" onClick={fn()} />
    </div>
  ),
};

export const Recherche = {
  name: 'ChampRecherche',
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div className="flex max-w-md flex-col gap-4">
        <ChampRecherche valeur={q} onChange={setQ} placeholder="Rechercher…" />
        <ChampRecherche valeur={q} onChange={setQ} variante="carre" placeholder="Rechercher un candidat…" />
      </div>
    );
  },
};

export const Periode = {
  name: 'SelecteurPeriode',
  render: () => {
    const [v, setV] = useState('mois');
    return <SelecteurPeriode valeur={v} onChange={setV} options={[{ id: 'mois', label: 'Ce mois-ci' }, { id: 'semaine', label: 'Cette semaine' }, { id: 'annee', label: 'Cette année' }]} />;
  },
};

export const OngletsSoulignes = {
  name: 'Onglets',
  render: () => {
    const [a, setA] = useState('toutes');
    return <Onglets actif={a} onChange={setA} onglets={[{ id: 'toutes', label: 'Toutes les formations' }, { id: 'mes', label: 'Mes formations', compte: 3 }, { id: 'certificats', label: 'Certificats' }]} />;
  },
};

export const SegmentsFiltres = {
  name: 'Segments',
  render: () => {
    const [a, setA] = useState('Toutes');
    return <Segments actif={a} onChange={setA} options={['Toutes', 'Non lues', 'Système', 'Utilisateurs']} />;
  },
};

export const Pagination = {
  name: 'PaginationApp',
  render: () => {
    const [p, setP] = useState(1);
    return <PaginationApp page={p} total={23} parPage={8} onChange={setP} />;
  },
};

export const Interrupteurs = {
  name: 'Interrupteur',
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div className="max-w-md divide-y divide-base">
        <Interrupteur actif={a} onChange={setA} label="Notifications par e-mail" description="Un résumé chaque matin." />
        <Interrupteur actif={b} onChange={setB} label="Profil visible des recruteurs" />
      </div>
    );
  },
};
