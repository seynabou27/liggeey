'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Le prototype garde ses données dans le navigateur (localStorage) : il n'est rendu que côté client.
const LiggeeyPrototype = dynamic(() => import('./LiggeeyPrototype'), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-screen place-items-center bg-sombre text-sur-sombre" role="status">
      <p className="text-lg font-semibold">Chargement de la plateforme…</p>
    </div>
  ),
});

export default function Plateforme({ ecranInitial = null, espaceInitial = null, profilInitial = null }) {
  // L'écran demandé est ouvert : l'adresse redevient /plateforme, pour qu'un rechargement reprenne la session de test.
  useEffect(() => {
    if (window.location.pathname !== '/plateforme' || window.location.search) {
      window.history.replaceState(null, '', '/plateforme');
    }
  }, []);

  return <LiggeeyPrototype ecranInitial={ecranInitial} espaceInitial={espaceInitial} profilInitial={profilInitial} />;
}
