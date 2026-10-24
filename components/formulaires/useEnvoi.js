'use client';

import { useState } from 'react';
import { verifier } from '@/lib/validation';

/**
 * Gère l’envoi d’un formulaire vers /api/formulaires :
 * lecture des champs, vérification, envoi, états (repos, envoi, succes, erreur).
 * Les cases multiples s’écrivent name="interets[]".
 *
 * @param {string} type     contact | demo | jobdating | newsletter
 * @param {string[]} requis champs obligatoires
 */
export function useEnvoi(type, requis = []) {
  const [etat, setEtat] = useState('repos');
  const [erreurs, setErreurs] = useState({});

  async function envoyer(evenement, extra = {}) {
    evenement.preventDefault();
    const formulaire = evenement.currentTarget;
    const champs = new FormData(formulaire);
    const donnees = {};
    for (const [cle, valeur] of champs.entries()) {
      if (cle.endsWith('[]')) (donnees[cle.slice(0, -2)] ??= []).push(valeur);
      else donnees[cle] = valeur;
    }
    if (formulaire.querySelector('[name="consentement"]')) donnees.consentement = champs.get('consentement') === 'on';
    Object.assign(donnees, extra);

    const trouvees = verifier(donnees, requis);
    setErreurs(trouvees);
    const premier = Object.keys(trouvees)[0];
    if (premier) {
      formulaire.querySelector(`[name="${premier}"]`)?.focus();
      return false;
    }

    setEtat('envoi');
    try {
      const reponse = await fetch('/api/formulaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...donnees }),
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      formulaire.reset();
      setEtat('succes');
      return true;
    } catch {
      setEtat('erreur');
      return false;
    }
  }

  return { etat, erreurs, envoyer };
}
