'use client';

import { CheckCircle } from 'lucide-react';
import { jobDating } from '@/content/fr/services';
import { lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import { useEnvoi } from './useEnvoi';
import { CaseConsentement, ChampTexte, GroupeChoix, MessageErreur, PotDeMiel } from './Champs';

// Liens de paiement marchand (Wave, Orange Money) définis dans .env.local
const PAIEMENT_WAVE = process.env.NEXT_PUBLIC_WAVE_PAYMENT_URL;
const PAIEMENT_OM = process.env.NEXT_PUBLIC_OM_PAYMENT_URL;

/** Inscription au Job Dating, puis paiement de la participation (5 000 FCFA). */
export default function FormulaireJobDating({ evenement }) {
  const t = jobDating.formulaire;
  const { etat, erreurs, envoyer } = useEnvoi('jobdating', ['nom', 'telephone', 'consentement']);

  if (etat === 'succes') {
    return (
      <div role="status" className="flex flex-col gap-4 rounded-lg bg-marque-doux p-8">
        <CheckCircle className="h-8 w-8 text-marque" aria-hidden="true" />
        <h3 className="text-2xl font-semibold">{t.succes.titre}</h3>
        <p className="text-lg">{t.succes.texte}</p>
        {PAIEMENT_WAVE || PAIEMENT_OM ? (
          <div className="flex flex-wrap gap-3">
            {PAIEMENT_WAVE && <Bouton href={PAIEMENT_WAVE} nouvelOnglet>{t.succes.wave}</Bouton>}
            {PAIEMENT_OM && <Bouton href={PAIEMENT_OM} variante="secondaire" nouvelOnglet>{t.succes.om}</Bouton>}
          </div>
        ) : (
          <p>{t.succes.sansLien}</p>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(e) => envoyer(e, { evenement: evenement.slug })} className="relative flex flex-col gap-5">
      <PotDeMiel />
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampTexte nom="nom" label={t.champs.nom} requis erreur={erreurs.nom} autoComplete="name" />
        <ChampTexte nom="telephone" label={t.champs.telephone} requis erreur={erreurs.telephone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+221 77 000 00 00" />
        <ChampTexte nom="email" label={t.champs.email} erreur={erreurs.email} type="email" autoComplete="email" />
        <ChampTexte nom="metier" label={t.champs.metier} />
      </div>
      <GroupeChoix nom="profil" label={t.champs.profil} options={t.profils} defaultValue={t.profils[0]} />
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
