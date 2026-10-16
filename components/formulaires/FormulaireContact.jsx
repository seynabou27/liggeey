'use client';

import { CheckCircle } from 'lucide-react';
import { contact } from '@/content/fr/aide';
import { site } from '@/lib/site';
import { lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import { useEnvoi } from './useEnvoi';
import { CaseConsentement, ChampSelect, ChampTexte, ChampZone, MessageErreur, PotDeMiel } from './Champs';

/** Formulaire de contact unique, avec motif (préremplissable : /contact?motif=partenariat). */
export default function FormulaireContact({ motifInitial = '' }) {
  const t = contact.formulaire;
  const { etat, erreurs, envoyer } = useEnvoi('contact', ['nom', 'telephone', 'motif', 'message', 'consentement']);
  const motifValide = t.motifs.some((m) => m.id === motifInitial) ? motifInitial : '';

  if (etat === 'succes') {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg bg-marque-doux p-6 text-lg">
        <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-marque" aria-hidden="true" />
        {t.succes.replace('{delai}', site.delais.contact)}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(e) => envoyer(e)} className="relative flex flex-col gap-5">
      <PotDeMiel />
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampTexte nom="nom" label={t.champs.nom} requis erreur={erreurs.nom} autoComplete="name" />
        <ChampTexte nom="telephone" label={t.champs.telephone} requis erreur={erreurs.telephone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+221 77 000 00 00" />
        <ChampTexte nom="email" label={t.champs.email} erreur={erreurs.email} type="email" autoComplete="email" />
        <ChampSelect nom="profil" label={t.champs.profil} options={t.profils} />
      </div>
      <ChampSelect nom="motif" label={t.champs.motif} requis erreur={erreurs.motif} options={t.motifs} defaultValue={motifValide} />
      <ChampZone nom="message" label={t.champs.message} requis erreur={erreurs.message} />
      <CaseConsentement label={t.champs.consentement} erreur={erreurs.consentement} />
      {etat === 'erreur' && <MessageErreur lienWhatsApp={lienWhatsApp()} />}
      <div>
        <Bouton type="submit" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? 'Envoi…' : t.bouton}
        </Bouton>
      </div>
    </form>
  );
}
