/* Thème de couleur de la plateforme : clair, sombre, ou celui de l'appareil.
   Le choix est gardé dans le navigateur. Le site public reste en clair. */

export const CLE_THEME = 'liggeey-theme';
export const PREFERENCES_THEME = ['clair', 'sombre', 'systeme'];
export const THEME_PAR_DEFAUT = 'clair';

/* Pose data-theme sur <html> avant le premier affichage, pour éviter un flash clair
   quand le thème sombre est choisi. Inséré dans la page /plateforme. */
export const SCRIPT_THEME = `(function(){try{var p=localStorage.getItem('${CLE_THEME}')||'${THEME_PAR_DEFAUT}';if(p==='sombre'||(p==='systeme'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='sombre';}catch(e){}})();`;
