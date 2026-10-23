'use client';

import dynamic from 'next/dynamic';
import { useThemeApplique } from '../app/Theme';

// Le prototype garde ses données de démo dans le navigateur (localStorage) : il n'est rendu que côté client.
const LiggeeyPrototype = dynamic(() => import('./LiggeeyPrototype'), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-screen place-items-center bg-sombre text-sur-sombre" role="status">
      <p className="text-lg font-semibold">Chargement de la plateforme…</p>
    </div>
  ),
});

/**
 * chemin : segments après /plateforme ; profil : ?profil= de l'inscription. L'adresse suit ensuite chaque écran.
 * compte : compte connecté, lu côté serveur (null si personne) ; comptesDemo : proposer les comptes de démo à la connexion.
 */
export default function Plateforme({ chemin = [], profil = null, compte = null, comptesDemo = false }) {
  useThemeApplique(); // thème clair ou sombre choisi dans l'application (components/app/Theme.jsx)
  return <LiggeeyPrototype cheminInitial={chemin} profilAdresse={profil} synchroniserAdresse compte={compte} comptesDemo={comptesDemo} />;
}
