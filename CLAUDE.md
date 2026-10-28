# LIGGEEY : site public et plateforme

Contexte pour Claude Code. À lire avant toute modification.

## Le projet

LIGGEEY (« travail » en wolof) est une plateforme sénégalaise d'insertion professionnelle. Elle rapproche les compétences des opportunités, vérifie les offres et les profils, et ajoute un accompagnement humain : WhatsApp et un bureau d'accueil à Dakar.

- Slogan : « Rendons l'insertion plus facile et plus juste. »
- Trois parcours, toujours séparés sur le site :
  - **talents** : chercheurs d'emploi et jeunes diplômés ;
  - **indépendants** : formalisation de l'activité ou accès à l'emploi ;
  - **entreprises** : recrutement accompagné et suivi pendant 90 jours.
- Statut : pilote. Les visiteurs accèdent directement à la plateforme, par les boutons Connexion et Inscription.
- Public : surtout sur téléphone, en 4G. Le site est pensé d'abord pour le mobile, avec des pages légères et des textes simples.

## Ce dépôt

Un seul projet Next.js 16 (App Router, JavaScript, Tailwind CSS 3), qui contient :

1. **le site public** :
   - `app/` : les pages ;
   - `components/` : les composants ;
   - `content/fr/` : tous les textes ;
   - `lib/` : la configuration et les liens ;
2. **la plateforme** : le prototype React, servi sur `/plateforme` (`components/plateforme/`) ;
3. **le back-end** : l'API (`app/api/`) et le code serveur (`lib/serveur/`), avec une base PostgreSQL. Voir la section « Back-end ».

Commandes : `npm install`, `npm run db:amorcer` (comptes de démonstration), `npm run dev` (http://localhost:3000), `npm run build`, `npm run storybook` (http://localhost:6006, fondations et composants). Copier `.env.example` en `.env.local`.

## Règles à respecter

- **Parité visuelle avec les captures (depuis octobre 2026)** : la version de la branche `feat/harmonisation-design` sert de référence aux captures du document et du prototype. Elle remplace `feat/back-socle` depuis la passe d’harmonisation validée le 24 octobre 2026 (contrastes, typographie, vocabulaire, données de démo) : les captures faites avant sont à refaire.
  - Le back-end se branche **sous** les écrans, sans changer leur aspect : même mise en page, mêmes textes, mêmes composants.
  - Les comptes de démonstration (`lib/comptesDemo.mjs`) affichent toujours les mêmes données fictives. Quand un domaine passe au serveur (offres, candidatures…), `npm run db:amorcer` recrée exactement les données de démo du prototype (`OFFRES_ENTREPRISE_INITIAL`, `CANDIDATURES`…). La date de démo (`DEMO_TODAY`, 14 octobre 2026) reste fixe pour ces comptes.
  - Tout changement visible (texte, disposition, écran ajouté ou retiré) est soumis à validation avant d'être fait. Seules exceptions : les messages d'erreur et d'attente propres au serveur (« Connexion… », « Connexion au serveur impossible… »).

- **N'inventer aucun chiffre, témoignage, partenaire ou logo client.** Les chiffres affichés viennent de l'enquête LIGGEEY (200 répondants, 2026) ou de l'ANSD, toujours avec leur source.
- **Tarifs, à afficher tels quels** :
  - Pack Essentiel : 1 500 FCFA par mois ;
  - Abonnement Premium : 3 000 FCFA par mois ;
  - Abonnement Entreprise : 40 000 FCFA ;
  - Services complémentaires :
    - mentorat personnalisé : 15 000 FCFA ;
    - formations et ateliers : 40 000 FCFA ;
    - suivi post-embauche : 25 000 FCFA ;
    - Job Dating : 5 000 FCFA ;
    - accompagnement à la formalisation : 5 000 FCFA ;
    - publicité pour les marques affiliées, sur la plateforme : 25 000 FCFA.
  - Paiement : Wave et Orange Money.
- **Textes** : en français, avec le vouvoiement, des phrases courtes et un ton chaleureux et professionnel.
  - Ils vivent dans `content/fr/`, pas dans les composants.
  - Le wolof et l'anglais pourront s'ajouter plus tard dans `content/wo/` et `content/en/`.
  - **Typographie française**, sur le site comme dans la plateforme :
    - apostrophe typographique ’ (jamais l’apostrophe droite) et points de suspension « … » ;
    - majuscule au premier mot et aux noms propres seulement : « Marketing digital », « Chef de projet », « Candidature retenue » ;
    - virgule décimale : « 4,5/5 », « 43,5 % », « 1,2 Mo » (`noteFr` dans le prototype) ;
    - dates en toutes lettres, mois en minuscules : « 28 juillet 2026 », « 1er août 2026 » (`dateFr` dans le prototype) ; jamais « 28/07/2026 » ni « 30 nov. » ;
    - heures : « 15 h », « 9 h 30 », « 16 h – 17 h » ;
    - exemples des champs : « Ex. : Moussa Diop ».
  - **Vocabulaire** :
    - abonnements : « formule » (Essentiel, Premium, Entreprise), jamais « profil », qui désigne le profil de la personne ; l’entreprise n’a qu’une formule, « Entreprise » ;
    - suivi post-embauche : 90 jours, jalons J+7 (point de la première semaine), J+30, J+60 et J+90 (fin de la période d’essai), comme la page Entreprises ;
    - statut d’une offre en attente de l’admin : « En vérification ».
- **Accessibilité** :
  - contraste de 4,5:1 minimum ;
  - l'orange (`bg-marque`, #F0891D) sert de fond, toujours avec du texte ardoise (`text-sur-marque`), ou de couleur de grand titre ;
  - le texte orange sur fond blanc utilise `text-marque` (primaire-700, #A85A0F) ;
  - zones cliquables de 44 px minimum, focus visible, `alt` sur les images, un seul `h1` par page.
- **Âges d'accès (droit sénégalais, à faire valider par un juriste)** : date de naissance demandée à l'inscription (`AGE_MIN_PAR_PROFIL` dans le prototype).
  - chercheur d'emploi, prestataire et mentor : 18 ans minimum (majorité civile ; un mineur non émancipé ne peut pas être commerçant, droit OHADA) ;
  - Cap Métier (jeunes sans métier) : dès 15 ans (âge minimum du travail et de l'apprentissage : Code du travail, art. L.145, arrêté n° 3748 du 6 juin 2003), avec l'accord d'un parent ou tuteur avant 18 ans ;
  - avant 15 ans : pas de compte, orientation vers le bureau ou WhatsApp ;
  - protection des mineurs : mentor attribué par l'admin seulement après l'accord parental, séances en groupe ou au bureau de Dakar, coordonnées masquées pour le mentor, pas de photo.
- **Photos** : elles montrent en grande majorité des personnes africaines, ou des scènes en Afrique (le Sénégal en priorité). Pas de service d'avatars aléatoires (randomuser.me, picsum…) : les photos sont hébergées dans `public/images/` et créditées (`content/fr/legal.js`).
- **Performance** :
  - pas de bibliothèque lourde sur les pages du site ;
  - images avec `next/image`, compressées (moins de 300 Ko pour les grands bandeaux).

## Charte graphique

- **Couleurs** : source unique dans `lib/tokens/couleurs.mjs`, lue par `tailwind.config.mjs` et par Storybook (page « Fondations / Couleurs »). Aucun code couleur dans les composants.
  - **Palettes** de 18 nuances (50 à 900) :
    - `primaire` : l'orange de marque, la couleur principale (boutons, accents). Référence : `primaire-500` = #F0891D ;
    - `neutre` : le bleu ardoise, la couleur neutre (textes, fonds, bordures). Référence : `neutre-800` = #1E2733.
  - **Tokens sémantiques**, à utiliser en priorité. Chacun a une valeur claire et une valeur sombre :
    - fonds : `bg-page`, `bg-surface`, `bg-doux`, `bg-sombre` (en-tête, pied de page, menu de l'application), `bg-marque`, `bg-marque-survol`, `bg-marque-doux`… ;
    - textes : `text-principal`, `text-secondaire`, `text-discret`, `text-sur-sombre`, `text-sur-marque` (texte ardoise sur l'orange), `text-marque` (orange lisible sur blanc) ;
    - bordures : `border-base`, `border-forte`, `border-principal`, `border-marque` ;
    - focus : `ring-focus`, `outline-focus`.
  - Dans le prototype (styles en ligne), l'objet `COLORS` pointe vers les mêmes variables CSS.
  - **Thème sombre** : actif dans la plateforme seulement (le site public reste en clair). Il s'active avec `data-theme="sombre"` sur `<html>`.
    - choix : bouton lune/soleil dans la barre du haut et sur la connexion et l'inscription, plus « Apparence » dans les paramètres de l'admin (clair, sombre, comme l'appareil). Clair par défaut (`THEME_PAR_DEFAUT`) ;
    - code : `components/app/Theme.jsx` (`useTheme`, `useThemeApplique` appelé dans `Plateforme.jsx`, `BoutonTheme`, `ChoixTheme`) et `lib/theme.js` (clé du navigateur, script posé dans la page `/plateforme` pour éviter un flash clair) ;
    - texte orange : jamais l’orange de fond comme couleur de texte (2,5:1). Sur blanc `text-marque` (`COLORS.orangeText`), sur orange doux `text-marque-fort` (`COLORS.orangeStrong`), sur fond sombre `text-marque-vif` (`COLORS.orangeOnDark`). Le texte discret (`neutre-550`) passe 4,5:1 sur tous les fonds clairs ;
    - pastilles et logos sombres : `bg-sombre-doux` (`COLORS.darkSoft`), qui reste visible en thème sombre ;
    - règle : pas de couleur fixe dans le prototype. Statuts via `COLORS.success`, `danger`, `info`… (tokens `statut`), texte sur un statut plein en `text-sur-statut`. Un bloc qui doit rester clair (fac-similé de document) porte `data-theme="clair"`.
  - Ajouter ou modifier une couleur : changer `lib/tokens/couleurs.mjs`, puis vérifier les contrastes dans Storybook.
- **Polices** :
  - Plus Jakarta Sans pour l'interface (`font-sans`, chargée par `next/font`), comme le modèle JobStock ;
  - Georgia pour les contenus éditoriaux (`font-serif`).
- **Typographie et espacements** (repris du modèle JobStock, https://jobstock-shreethemes.netlify.app/) :
  - texte courant : 15 px, interligne 1,5 ; titres en demi-gras (`font-semibold`), jamais en gras ;
  - grand titre de l'accueil : 25 px sur mobile, 40 px, puis 57 px sur ordinateur ; texte du bandeau : 20 px, interligne 1,8 ;
  - titres de section (h2) : 22 px sur mobile, 35 px sur ordinateur ; phrase d'intro : 15 px, interligne 1,7 ;
  - sections : 48 px d'espace en haut et en bas sur mobile, 80 px à partir de 768 px (`py-12 md:py-20`) ; conteneur de 1 320 px maximum, marges de 12 px ;
  - sous 768 px, les blocs longs sont compactés sans changer le style (le public est surtout sur téléphone) : offres en carrousel horizontal, cartes d'atouts et d'engagements avec l'icône à gauche du titre, maquette du téléphone masquée dans « Comment ça marche », chiffres et secteurs sur deux colonnes, pied de page sur deux colonnes. Au-dessus de 768 px, rien ne change ;
  - menu : 14 px, moyen ; étiquettes de formulaire : 12 px ; champs de 56 px de haut ; pied de page : titres 15 px, liens 13 px.
- **Icônes** : `lucide-react`.
- **Formes** : boutons à coins de 4 px (y compris les boutons écrits à la main dans le prototype), cartes à coins de 8 px, ombre `shadow-carte`. Champs : 56 px sur le site, 48 px dans la plateforme (`FORM`).
- **Logo** : `public/logo/` (versions ardoise, blanche, et monogramme orange).

## Storybook

`npm run storybook` (http://localhost:6006). Les stories vivent dans `stories/` :

- `fondations/` : les tokens (couleurs, typographie, espacements, formes et ombres, icônes, logos, classes utilitaires) ;
- `composants/site/` : un fichier par famille de composants du site (actions, formulaires, navigation, mise en page, contenus, médias, offres, accueil, tarifs, Job Dating, ressources, gabarits) ;
- `composants/application/` : les composants de la plateforme, importés depuis le bloc d'exports de `LiggeeyPrototype.jsx`. `_outils.jsx` fournit `AvecPlateforme` (contextes d'abonnement et de mémoire partagée) ;
- `ecrans/` : chaque écran de l'application, par espace, rendu par le composant racine (`_ecran.jsx`).

Tout nouveau composant reçoit sa story, avec ses états. Simulations (`.storybook/`) : `lib/images` (lecture disque), envoi des formulaires (`parameters.formulaire` : `succes`, `erreur`, `attente`), absence de photos (`parameters.sansPhotos`). `.storybook/main.js` contient aussi un correctif de compatibilité Next 16.4 / Storybook 10.6.2, à retirer quand Storybook gérera `parentRenderTree`.

## Bibliothèque de l'application (`components/app/`)

Structure de la plateforme inspirée du modèle Mifty (https://mannatthemes.com/mifty/default/index.html), refaite avec les tokens, les couleurs et la police de LIGGEEY. Aucun code ni visuel de Mifty n'est copié.

- `Coquille.jsx` : barre d'icônes bleu foncé avant le menu (`BarreIcones`, ordinateur seulement), avec les icônes et la mise en page d'origine. Chaque icône est un raccourci, avec info-bulle et compteur du menu ; son rôle est fixe et adapté à chaque espace (`RACCOURCIS_PAR_ESPACE` dans le prototype) : Flame = priorités, Grid3x3 = explorer, Zap = action rapide (`creer: true` ouvre le formulaire de création d'offre ou de service), Triangle = à surveiller, AlignJustify = mes suivis, Layers = progresser, Bell = messages. Barre latérale claire (groupes en petites capitales, élément actif teinté avec barre orange, encart de formule en bas, repliable et retenu dans le navigateur ; tiroir sur mobile), barre du haut (salutation, recherche de page, notifications alimentées par les tâches « À faire », menu du compte), en-tête de page (titre et fil d'Ariane), pied de page.
- `Carte.jsx` : `Carte`, `CarteStat`, `CarteProfil`, `PastilleIcone`, `LigneInfo`, `EtatVide`.
- `Badge.jsx`, `Avatar.jsx`, `Controles.jsx` (boutons ronds, recherche, sélecteur, onglets, segments, pagination, interrupteur), `Tableau.jsx`, `Progression.jsx`, `Messagerie.jsx`.
- `Export.jsx` : `MenuExport`, bouton « Exporter » des listes de l'admin (PDF, Excel .xlsx, CSV), sur toutes les lignes filtrées. Logique dans `lib/export.js` : le .xlsx et le CSV sont écrits sans bibliothèque ; le PDF utilise `jspdf` et `jspdf-autotable`, chargés seulement au clic.
- Tout s'importe depuis `components/app` (`import * as App from "../app"` dans le prototype). Le `Bouton` du site a deux variantes de plus pour l'application : `doux` et `neutre`.
- Le titre de chaque écran est affiché par la coquille (libellé du menu) : un écran ne remet pas de `h1`. Ses sous-titres sont des `h2` en demi-gras.
- Onglets et filtres : `App.Onglets` (soulignés) pour les sections d’une page, `App.Segments` (pastilles) pour filtrer une liste, avec `BarreFiltres` (recherche dans une carte) et `CompteResultats`. Pas d’onglets recopiés à la main.
- Couleurs de statut : tokens `statut` (`bg-statut-succes-doux`, `text-statut-danger`…). Les tons de `StatusBadge` sont dans `STATUT_TONS`.
- Stories : `stories/composants/application/bibliotheque/`.

## Pages du site

- **Accueil et parcours** : `/`, `/talents`, `/independants`, `/entreprises`, `/entreprises/demande-de-demo`.
- **Offres et services** : `/tarifs`, `/formations-mentorat`, `/job-dating`, `/job-dating/[slug]`.
- **Confiance et contenus** : `/verification` (« Comment nous vérifions »), `/a-propos`, `/ressources` et `/ressources/[slug]` (articles Markdown dans `content/ressources/`), `/faq`, `/contact`.
- **Pages légales** : `/mentions-legales`, `/cgu`, `/confidentialite`.

Les formulaires (contact, démo, Job Dating, newsletter) passent par `app/api/formulaires/route.js`, qui les transmet au webhook `FORM_WEBHOOK_URL`.

Pour le référencement : chaque page a ses métadonnées, avec `app/sitemap.js` et `app/robots.js`.

**Publicités des marques affiliées** (service à 25 000 FCFA / campagne) : bannières maison, sans régie extérieure (pas d'AdSense : pas de script tiers ni de cookies).
- campagnes dans `content/fr/publicites.js` (annonceur, lien, `alt`, image mobile 640 × 400 et large 2 600 × 500 dans `public/images/publicites/`, emplacements, dates de début et de fin incluses), choix dans `lib/publicites.js` (`choisirCampagne`) ;
- composant `components/blocs/BannierePub.jsx` (aussi `App.BannierePub`) : mention « Publicité » visible, lien `rel="sponsored"`, pleine largeur comme les cartes voisines, `<picture>` 16:10 sous 768 px et 26:5 au-dessus, place réservée ; sans campagne, il ne rend rien ;
- emplacements : `accueil` (sous la vitrine des offres), `ressources` (fin d'article, après le bouton d'inscription), `tableau-de-bord` (bas du tableau de bord chercheur, prestataire et entreprise, `PubTableauDeBord` dans le prototype) ;
- jamais dans l'espace Cap Métier (mineurs), chez les mentors, dans l'admin, sur la connexion et l'inscription, ni au milieu des offres (confusion avec les offres vérifiées). Pas de bannière pour les comptes de démonstration ni dans Storybook : les captures restent identiques ;
- campagne d'exemple (`publicites.exemple`, `animation: 'liggeey'`) : publicité animée pour LIGGEEY elle-même, `components/blocs/PubLiggeey.jsx`. Style moderne : personne détourée (WebP transparent, `public/images/publicites/liggeey-*.webp`, photos Unsplash créditées dans `content/fr/legal.js`) qui dépasse du haut de la carte sur un disque orange, formes lumineuses, badge par message, effet de profondeur à la souris. Diaporama de 4 messages de 5 s (slogan, talents, indépendants, entreprises), animé en CSS (classes `.pub-…` de `app/globals.css`) ; le JavaScript ne gère que la profondeur. Textes dans `publicites.liggeey`. Pause au survol et au clavier, immobile si `prefers-reduced-motion`. Elle est affichée sur les trois emplacements, comptes de démonstration compris, si `NEXT_PUBLIC_PUB_EXEMPLE=true`. Sert aux tests et aux captures ; `false` avant la mise en ligne ;
- à venir : table `campagnes`, écran « Publicités » de l'admin, décompte des affichages et des clics.

## La plateforme (prototype)

- **Fichier** : `components/plateforme/LiggeeyPrototype.jsx`. C'est le prototype repris tel quel, en un seul fichier d'environ 8 300 lignes, avec un sommaire en tête.
- **Montage** : côté navigateur seulement (`components/plateforme/Plateforme.jsx`, avec `dynamic(..., { ssr: false })`), sur `app/plateforme/[[...ecran]]/page.jsx`.
- **Espaces** : chercheur, prestataire, entreprise, Cap Métier (`jeune` : orientation, ateliers découverte, mentor attribué), mentor (`mentor` : mentorés, séances, comptes rendus, charte) et admin (dont l'écran « Cap Métier » : accords parentaux et attribution des mentors). Cap Métier et mentor n'ont pas d'abonnement : leur tarif reste à décider.
- **Écrans ouverts depuis le site** : uniquement la connexion et l'inscription.
  - `/plateforme/connexion` ;
  - `/plateforme/inscription`, avec `?profil=chercheur`, `prestataire`, `entreprise`, `jeune` ou `mentor`.
- **Adresses** (`lib/routesPlateforme.js`) : chaque écran a la sienne, `/plateforme/{espace}/{écran}` (espaces : `chercheur`, `prestataire`, `entreprise`, `cap-metier`, `mentor`, `admin` ; écrans : identifiants du menu, `dashboard` devient `tableau-de-bord`), par exemple `/plateforme/admin/offres`. L'adresse suit la navigation ; Précédent, Suivant et le rechargement fonctionnent.
- **Règle d'accès**, contrôlée côté serveur par `app/plateforme/[[...ecran]]/page.jsx`, avec la session :
  - le site ne renvoie jamais directement vers une page interne de la plateforme (offres, tableau de bord…) ;
  - un écran interne n'est ouvert qu'au compte connecté de cet espace. Un compte d'un autre espace arrive sur son propre tableau de bord ; sans session, on arrive sur `/plateforme/connexion` ;
  - déjà connecté, la connexion et l'inscription renvoient vers le tableau de bord ;
  - une adresse inconnue renvoie vers le tableau de bord, ou vers la connexion sans session.

  Le prototype refait le même contrôle quand on utilise Précédent et Suivant. Les offres se consultent sur le site, dans la vitrine de l'accueil et sa fenêtre de détail (`/?offre=…`, `/?secteur=…`), qui invite à se connecter.
- **Données** :
  - les comptes sont réels (base PostgreSQL, API `app/api/auth/`). Le nom, le rôle et les initiales affichés dans la coquille viennent du compte connecté ;
  - le reste est encore de démonstration, gardé dans le navigateur (localStorage) : offres, candidatures, messages, abonnements… Les paiements sont simulés. Ces données passeront au serveur domaine par domaine (voir « Chantiers ouverts »).
- **Affichage** : plein écran, sans l'en-tête ni le pied de page du site (`components/layout/Cadre.jsx`). La plateforme n'est pas indexée par Google.
- **Changements faits au fichier d'origine** (à refaire si une nouvelle version du prototype remplace ce fichier) :
  - la directive `'use client'` et les props `ecranInitial`, `espaceInitial` et `profilInitial` du composant racine ;
  - la barre « Mode test » n'est plus affichée (les deux `<TestModeBar … />` du composant racine sont retirés ; la sauvegarde locale reste) ;
  - les liens de retour vers le site (constante `SITE_URL`) : logo cliquable, « Retour au site » sur la connexion et l'inscription, et en bas du menu de l'application ;
  - le bouton « Découvrir les offres d'emploi » de la connexion mène aux offres du site (`/#offres`), plus aux offres internes ;
  - un bloc `export { … }` en fin de fichier, qui expose les composants et données de démo à Storybook (sans changer le comportement) ;
  - la date de naissance et les règles d'âge à l'inscription, les profils « Je cherche ma voie » (Cap Métier) et « Je veux devenir mentor », et la section « 11 bis. Cap Métier et espace mentor » ;
  - les comptes réels : props `compte` et `comptesDemo` du composant racine. Elles alimentent `ServeurContext`, qui vaut `null` dans Storybook, où la connexion reste simulée. Ce mode touche :
    - `ConnexionScreen` : e-mail ou téléphone, appel à l'API, choix d'un compte de démonstration ;
    - `SignupInfoScreen` : envoi à l'API, erreurs affichées par champ ;
    - `ConfirmationScreen` : textes sans SMS ni e-mail automatiques ;
    - le menu du compte : « Se déconnecter » ;
    - les règles d'âge, importées de `lib/comptes.mjs` ;
  - les formulaires des espaces, refaits au style des écrans de connexion (`AUTH`) avec des briques communes placées juste après : `FORM` (classes des champs de 48 px, grilles, pastilles de choix, barre d'actions), `Champ` (libellé relié, aide ou erreur), `ListeChamp` (liste déroulante avec flèche), `useFormulaire` (valeurs, erreurs affichées après un premier envoi, attributs `aria-*`), `AlerteFormulaire` et `BoutonDanger`. Tout nouveau formulaire les utilise, avec `App.Carte` et `App.Bouton`.
- **Messagerie** : chaque profil (chercheur, prestataire, entreprise, Cap Métier, mentor) a un écran « Messages » pour écrire à l'équipe LIGGEEY. L'admin répond depuis Communication › Messagerie : c'est la même conversation (mémoire partagée « conversations », `CONVERSATIONS_INITIAL`). Pas de messagerie entre utilisateurs pour l'instant. Les non-lus alimentent les compteurs du menu et les tâches « À faire ».
- **Régularisation des prestataires** : facultative. Le prestataire travaille et est payé sans régulariser ; l'écran pose d'abord une question (« Souhaitez-vous qu'on vous accompagne… ? », mémoire `regul-choix`) : Oui → les étapes à suivre ; Non → seulement les informations à savoir (comment ça marche, avec ou sans, questions) et « J'ai changé d'avis ». En cours de route, « Arrêter la régularisation » (avec confirmation) : plus de rappels, étapes validées gardées, documents envoyés toujours vérifiés, et « Reprendre ma régularisation » repart au même point (écran et carte du profil). Les rappels (tâches, compteur du menu, badge « en cours ») ne concernent que ceux qui ont commencé, et la régularisation ne compte plus dans la complétion du profil.
- **Vérification des offres** : une offre créée par l'entreprise (ou refusée puis corrigée) part « En vérification » et n'est visible des candidats qu'une fois validée par l'admin (écran « Offres », bloc « Offres à vérifier » : points à contrôler, puis « Valider et publier » ou « Refuser » avec un motif, que l'entreprise voit sur son offre).
- **Dépendances** : `recharts` et `lucide-react` (plus `jspdf` et `jspdf-autotable` pour l'export PDF de l'admin). Si la compilation échoue sur une icône, vérifier son nom dans la version installée de `lucide-react`.

## Back-end

- **Pile** : routes Next (`app/api/…`) et code serveur dans `lib/serveur/` (jamais importé par un composant client), base PostgreSQL avec Drizzle ORM.
- **Base** :
  - `DATABASE_URL` vide : PGlite (PostgreSQL intégré) dans `.donnees/pglite`, en développement seulement. Les migrations s'y appliquent toutes seules. Un seul processus à la fois : arrêter `npm run dev` avant un script `db:…`, sinon la base locale peut s'abîmer ;
  - en production : `DATABASE_URL` obligatoire, et `npm run db:migrer` à chaque mise en ligne.
- **Fichiers** :
  - `lib/serveur/schema.mjs` : les tables `utilisateurs`, `tuteurs` (parent d'un jeune de 15 à 17 ans), `sessions` et `tentatives_connexion` ;
  - `lib/serveur/db.mjs` : la connexion ;
  - `lib/serveur/comptes.mjs` : la validation de l'inscription, la création de compte et `comptePublic` (ce que le navigateur voit) ;
  - `lib/serveur/session.js` : `ouvrirSession`, `compteConnecte`, `utilisateurConnecte`, `fermerSession` ;
  - `lib/serveur/http.js` : réponses JSON, refus des autres origines, limite d'essais de connexion ;
  - `lib/serveur/motDePasse.mjs` : scrypt.
- **Règles partagées** entre le navigateur et le serveur : `lib/comptes.mjs` (profils, âges, téléphone sénégalais au format +221…, mot de passe) et `lib/comptesDemo.mjs` (comptes de démonstration).
- **Fichiers `.mjs`** : ceux qui sont aussi lus par les scripts Node (`scripts/`). Ils s'importent entre eux par chemin relatif, avec l'extension.
- **Modifier le schéma** : changer `schema.mjs`, puis lancer `npm run db:generer`. Committer la migration créée dans `drizzle/`.
- **Nouvelle route protégée** :
  - appeler `utilisateurConnecte()` et vérifier `profil` et `statut` ;
  - pour un POST, commencer par `refuserSiAutreOrigine(requete)` ;
  - ne jamais renvoyer `motDePasseHash`.
- **Pas encore fait** :
  - mot de passe oublié (l'écran reste simulé) ;
  - SMS au parent ou tuteur, et e-mails ;
  - validation des mentors par l'admin (statut `a_valider`, accès laissé ouvert pour la démo) ;
  - suspension de compte depuis l'admin.

## Chantiers ouverts (ordre de priorité suggéré)

1. ~~Aligner les formules du prototype (`PLANS_INITIAL`) sur les tarifs ci-dessus.~~ Fait : Essentiel 1 500 et Premium 3 000 FCFA (chercheur et prestataire), formule unique Entreprise à 40 000 FCFA, paiement mensuel par Wave ou Orange Money. Reste à trancher : la commission des prestataires (retirée, absente du site) et l'accompagnement à la formalisation, inclus dans Premium sur la plateforme mais vendu 5 000 FCFA sur le site.
2. **Remplacer les vraies entreprises** citées dans les données de démo du prototype (Sonatel, Banque Atlantique, Teranga Capital…) par des noms fictifs.
3. **Lire le paramètre `formule`** dans le prototype. Il est envoyé par les boutons d'inscription de la page Tarifs.
4. **Découper le prototype en modules**, un dossier par espace (chercheur, prestataire, entreprise, admin), sans changer son comportement.
5. **Optimiser le référencement et l'accessibilité** : audit Lighthouse sur mobile, contrastes, navigation au clavier, données schema.org.
6. **Préparer la checklist** de mise en ligne et de tests.
7. **Back-end, par étapes** :
   - ~~socle : comptes, sessions, contrôle d'accès côté serveur~~ (fait) ;
   - mot de passe oublié par SMS ou e-mail ;
   - offres (création par l'entreprise, vérification par l'admin, vitrine `APP_API_URL`) ;
   - candidatures ;
   - messagerie avec l'équipe ;
   - profils et documents (stockage de fichiers) ;
   - Cap Métier (accord parental, attribution des mentors) ;
   - paiements Wave et Orange Money ;
   - écrans de l'admin.

## Valeurs provisoires

La liste complète est dans `README.md`, section « Valeurs provisoires ». À remplacer avant la mise en ligne :

- dans `lib/site.js` : numéro WhatsApp, e-mail et horaires ;
- les unités des prix ;
- les informations du Job Dating du 12 décembre 2026 ;
- les mentions légales, à faire valider par un juriste ;
- les logos Wave et Orange Money ;
- les photos Unsplash provisoires (`public/images/README.md`) et celles des profils de démonstration de la plateforme (`public/images/plateforme/README.md`).

## Maquettes de référence

`docs/design/` contient les livrables de conception :

- l'arborescence et les parcours ;
- les contenus des pages ;
- les wireframes ;
- l'aperçu haute fidélité de l'accueil.

Pour les ouvrir, lancer un petit serveur local, par exemple `npx serve docs/design`. Ce sont des références visuelles, pas du code à copier.
