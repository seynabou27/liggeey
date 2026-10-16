'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Chiffre qui défile de 0 jusqu'à sa valeur quand il apparaît à l'écran (comme les compteurs du modèle).
 * - Rendu serveur et sans JavaScript : la valeur finale s'affiche directement.
 * - Les lecteurs d'écran lisent la valeur finale, pas le défilement.
 * - Pas d'animation si l'utilisateur a demandé à réduire les mouvements.
 * @param {{ valeur: string, duree?: number }} props  valeur au format français, par exemple « 1 500 » ou « 78,5 »
 */
export default function Compteur({ valeur, duree = 1500 }) {
  const cible = Number(String(valeur).replace(/\s/g, '').replace(',', '.'));
  const decimales = (String(valeur).split(',')[1] ?? '').length;
  const [affiche, setAffiche] = useState(valeur);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || Number.isNaN(cible) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let image;
    const lancer = () => {
      const debut = performance.now();
      const etape = (maintenant) => {
        const t = Math.min((maintenant - debut) / duree, 1);
        const adouci = 1 - Math.pow(1 - t, 3); // ralentit en fin de course
        setAffiche((cible * adouci).toLocaleString('fr-FR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }));
        if (t < 1) image = requestAnimationFrame(etape);
        else setAffiche(valeur);
      };
      image = requestAnimationFrame(etape);
    };

    setAffiche((0).toLocaleString('fr-FR', { minimumFractionDigits: decimales }));
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          observateur.disconnect();
          lancer();
        }
      },
      { threshold: 0.4 },
    );
    observateur.observe(element);
    return () => {
      observateur.disconnect();
      cancelAnimationFrame(image);
    };
  }, [cible, decimales, duree, valeur]);

  return (
    <span ref={ref}>
      <span className="sr-only">{valeur}</span>
      <span aria-hidden="true" className="tabular-nums">
        {affiche}
      </span>
    </span>
  );
}
