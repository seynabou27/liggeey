import { fn } from 'storybook/test';
import { Briefcase, ClipboardList, FileText, Inbox, Mail, MapPin, Phone, Users2 } from 'lucide-react';
import { Carte, CarteStat, CarteProfil, PastilleIcone, LigneInfo, EtatVide, Anneau, Badge, SelecteurPeriode } from '../../../../components/app';
import Bouton from '../../../../components/ui/Bouton';

export default {
  title: 'Composants/Application/Bibliothèque/Cartes',
  component: Carte,
  parameters: { docs: { description: { component: 'Cartes : fond blanc, filet fin, coins de 8 px. `components/app/Carte.jsx`' } } },
};

export const CarteSimple = {
  name: 'Carte',
  render: (args) => (
    <Carte {...args}>
      <p className="text-sm text-secondaire">Contenu de la carte.</p>
    </Carte>
  ),
  args: { titre: 'Dernières candidatures', sousTitre: 'Les 5 plus récentes' },
};

export const CarteAvecActions = {
  name: 'Carte · actions dans l’en-tête',
  render: () => (
    <Carte
      titre="Inscriptions mensuelles"
      actions={
        <>
          <SelecteurPeriode options={['Cette année', 'Ce mois-ci']} valeur="Cette année" onChange={fn()} />
          <Bouton petit variante="doux">Exporter</Bouton>
        </>
      }
    >
      <div className="h-40 rounded-md bg-doux" />
    </Carte>
  ),
};

export const ChiffresCles = {
  name: 'CarteStat · chiffres clés',
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CarteStat icone={Users2} titre="Utilisateurs" detail="+12 % sur le mois" tendance="hausse" valeur="25 694" />
      <CarteStat icone={Briefcase} ton="info" titre="Offres actives" detail="−3 % sur le mois" tendance="baisse" valeur="847" />
      <CarteStat icone={ClipboardList} ton="alerte" titre="En attente" detail="Les recruteurs répondent sous 15 jours" valeur="2" />
      <CarteStat icone={FileText} ton="succes" titre="Profil complété" detail="Un profil complet est vu plus souvent" valeur="70 %" visuel={<Anneau valeur={70} taille={56} epaisseur={6}>{' '}</Anneau>} onClick={fn()} />
    </div>
  ),
};

export const Pastilles = {
  name: 'PastilleIcone · tons',
  render: () => (
    <div className="flex flex-wrap gap-3">
      {['marque', 'succes', 'alerte', 'danger', 'info', 'neutre'].map((t) => (
        <PastilleIcone key={t} icone={Briefcase} ton={t} />
      ))}
    </div>
  ),
};

export const Profil = {
  name: 'CarteProfil',
  render: () => (
    <div className="max-w-md">
      <CarteProfil
        photo="/images/plateforme/portraits/absatou-diallo.jpg"
        nom="Absatou Diallo"
        sousTitre="Commerciale"
        badges={<><Badge ton="neutre" taille="moyen">Essentiel</Badge><Badge ton="alerte" taille="moyen">Vérification en cours</Badge></>}
        infos={[
          { icone: Mail, libelle: 'E-mail', valeur: 'absatou.diallo@example.com' },
          { icone: Phone, libelle: 'Téléphone', valeur: '+221 77 123 45 67' },
          { icone: MapPin, libelle: 'Ville', valeur: 'Dakar' },
        ]}
        actions={<><Bouton petit>Modifier le profil</Bouton><Bouton petit variante="neutre">Mes candidatures</Bouton></>}
      />
    </div>
  ),
};

export const ProfilSansPhoto = {
  name: 'CarteProfil · sans photo',
  render: () => <div className="max-w-md"><CarteProfil nom="Senegal Construction SARL" sousTitre="BTP · Dakar" /></div>,
};

export const Infos = {
  name: 'LigneInfo',
  render: () => (
    <Carte titre="Coordonnées">
      <LigneInfo icone={Mail} libelle="E-mail">contact@liggeey.sn</LigneInfo>
      <LigneInfo icone={MapPin} libelle="Adresse">Dakar, Sénégal</LigneInfo>
    </Carte>
  ),
};

export const Vide = {
  name: 'EtatVide',
  render: () => (
    <Carte>
      <EtatVide icone={Inbox} titre="Aucune candidature pour le moment" texte="Les candidatures reçues apparaîtront ici." action={<Bouton petit>Publier une offre</Bouton>} />
    </Carte>
  ),
};
