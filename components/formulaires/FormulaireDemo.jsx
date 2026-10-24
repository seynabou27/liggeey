'use client';

import { CheckCircle } from 'lucide-react';
import { demo } from '@/content/fr/entreprises';
import { secteurs, taillesEntreprise } from '@/content/referentiels';
import { site } from '@/lib/site';
import { lienWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import { useEnvoi } from './useEnvoi';
import { CaseConsentement, ChampSelect, ChampTexte, ChampZone, GroupeCases, GroupeChoix, MessageErreur, PotDeMiel } from './Champs';

/**
 * Demande de démo entreprise.
 * `service="jobdating"` dans l’adresse coche d’avance « Job Dating ».
 */
export default function FormulaireDemo({ service = '' }) {
  const c = demo.champs;
  const { etat, erreurs, envoyer } = useEnvoi('demo', ['nom', 'entreprise', 'telephone', 'email', 'consentement']);
  const cochees = service === 'jobdating' ? ['Job Dating'] : ['Recrutement accompagné'];

  if (etat === 'succes') {
    return (
      <div role="status" className="flex flex-col gap-3 rounded-lg bg-marque-doux p-8">
        <CheckCircle className="h-8 w-8 text-marque" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">{demo.succes.titre}</h2>
        <p className="text-lg">{demo.succes.texte.replace('{delai}', site.delais.demo)}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(e) => envoyer(e)} className="relative flex flex-col gap-5">
      <PotDeMiel />
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampTexte nom="nom" label={c.nom} requis erreur={erreurs.nom} autoComplete="name" />
        <ChampTexte nom="entreprise" label={c.entreprise} requis erreur={erreurs.entreprise} autoComplete="organization" />
        <ChampSelect nom="secteur" label={c.secteur} options={secteurs} />
        <ChampTexte nom="postes" label={c.postes} placeholder="Ex. : comptable, commercial" />
      </div>
      <GroupeChoix nom="taille" label={c.taille} options={taillesEntreprise} />
      <GroupeCases nom="interets" label={c.interets} options={demo.interets} cochees={cochees} />
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampTexte nom="telephone" label={c.telephone} requis erreur={erreurs.telephone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+221 77 000 00 00" />
        <ChampTexte nom="email" label={c.email} requis erreur={erreurs.email} type="email" autoComplete="email" />
      </div>
      <ChampZone nom="message" label={c.message} />
      <CaseConsentement label={c.consentement} erreur={erreurs.consentement} />
      {etat === 'erreur' && <MessageErreur lienWhatsApp={lienWhatsApp()} />}
      <div className="flex flex-col gap-2">
        <Bouton type="submit" disabled={etat === 'envoi'} className="self-start">
          {etat === 'envoi' ? 'Envoi…' : demo.bouton}
        </Bouton>
        <p className="text-sm text-secondaire">{demo.obligatoire}</p>
      </div>
    </form>
  );
}
