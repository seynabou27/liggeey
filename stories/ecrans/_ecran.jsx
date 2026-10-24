import LiggeeyPrototype, { TEST_STORAGE_KEY } from '../../components/plateforme/LiggeeyPrototype';

/**
 * Affiche un écran de la plateforme tel qu’il apparaît dans l’application, avec sa coquille
 * (menu, fil d’Ariane) et les données de démo remises à zéro.
 * La navigation reste active : on peut cliquer partout depuis l’écran affiché.
 */
export function Ecran({ ecran, espace = 'chercheur', profil = null }) {
  try {
    window.localStorage.removeItem(TEST_STORAGE_KEY);
  } catch {
    /* stockage indisponible : rien à effacer */
  }
  return <LiggeeyPrototype key={`${espace}-${ecran}-${profil}`} ecranInitial={ecran} espaceInitial={espace} profilInitial={profil} />;
}

export const parametresEcran = {
  layout: 'fullscreen',
  docs: { story: { inline: false, height: '760px' } },
};
