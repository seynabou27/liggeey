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
2. **la plateforme** : le prototype React, servi sur `/plateforme` (`components/plateforme/`).

Commandes : `npm install`, `npm run dev` (http://localhost:3000), `npm run build`, `npm run storybook` (http://localhost:6006, fondations et composants). Copier `.env.example` en `.env.local`.

## Règles à respecter

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
    - accompagnement à la formalisation : 5 000 FCFA.
  - Paiement : Wave et Orange Money.
- **Textes** : en français, avec le vouvoiement, des phrases courtes et un ton chaleureux et professionnel.
  - Ils vivent dans `content/fr/`, pas dans les composants.
  - Le wolof et l'anglais pourront s'ajouter plus tard dans `content/wo/` et `content/en/`.
- **Accessibilité** :
  - contraste de 4,5:1 minimum ;
  - l'orange (`bg-marque`, #F0891D) sert de fond, toujours avec du texte ardoise (`text-sur-marque`), ou de couleur de grand titre ;
  - le texte orange sur fond blanc utilise `text-marque` (primaire-700, #A85A0F) ;
  - zones cliquables de 44 px minimum, focus visible, `alt` sur les images, un seul `h1` par page.
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
  - **Thème sombre** : prêt mais inactif. Il s'active avec `data-theme="sombre"` sur `<html>`.
  - Ajouter ou modifier une couleur : changer `lib/tokens/couleurs.mjs`, puis vérifier les contrastes dans Storybook.
- **Polices** :
  - Plus Jakarta Sans pour l'interface (`font-sans`, chargée par `next/font`), comme le modèle JobStock ;
  - Georgia pour les contenus éditoriaux (`font-serif`).
- **Typographie et espacements** (repris du modèle JobStock, https://jobstock-shreethemes.netlify.app/) :
  - texte courant : 15 px, interligne 1,5 ; titres en demi-gras (`font-semibold`), jamais en gras ;
  - grand titre de l'accueil : 25 px sur mobile, 40 px, puis 57 px sur ordinateur ; texte du bandeau : 20 px, interligne 1,8 ;
  - titres de section (h2) : 22 px sur mobile, 35 px sur ordinateur ; phrase d'intro : 15 px, interligne 1,7 ;
  - sections : 80 px d'espace en haut et en bas (`py-20`) ; conteneur de 1 320 px maximum, marges de 12 px ;
  - menu : 14 px, moyen ; étiquettes de formulaire : 12 px ; champs de 56 px de haut ; pied de page : titres 15 px, liens 13 px.
- **Icônes** : `lucide-react`.
- **Formes** : boutons à coins de 4 px, cartes à coins de 8 px, ombre `shadow-carte`.
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

- `Coquille.jsx` : barre latérale claire (groupes en petites capitales, élément actif teinté avec barre orange, encart de formule en bas, repliable et retenu dans le navigateur ; tiroir sur mobile), barre du haut (salutation, recherche de page, notifications alimentées par les tâches « À faire », menu du compte), en-tête de page (titre et fil d'Ariane), pied de page.
- `Carte.jsx` : `Carte`, `CarteStat`, `CarteProfil`, `PastilleIcone`, `LigneInfo`, `EtatVide`.
- `Badge.jsx`, `Avatar.jsx`, `Controles.jsx` (boutons ronds, recherche, sélecteur, onglets, segments, pagination, interrupteur), `Tableau.jsx`, `Progression.jsx`, `Messagerie.jsx`.
- Tout s'importe depuis `components/app` (`import * as App from "../app"` dans le prototype). Le `Bouton` du site a deux variantes de plus pour l'application : `doux` et `neutre`.
- Le titre de chaque écran est affiché par la coquille (libellé du menu) : un écran ne remet pas de `h1`. Ses sous-titres sont des `h2` en demi-gras.
- Couleurs de statut : tokens `statut` (`bg-statut-succes-doux`, `text-statut-danger`…). Les tons de `StatusBadge` sont dans `STATUT_TONS`.
- Stories : `stories/composants/application/bibliotheque/`.

## Pages du site

- **Accueil et parcours** : `/`, `/talents`, `/independants`, `/entreprises`, `/entreprises/demande-de-demo`.
- **Offres et services** : `/tarifs`, `/formations-mentorat`, `/job-dating`, `/job-dating/[slug]`.
- **Confiance et contenus** : `/verification` (« Comment nous vérifions »), `/a-propos`, `/ressources` et `/ressources/[slug]` (articles Markdown dans `content/ressources/`), `/faq`, `/contact`.
- **Pages légales** : `/mentions-legales`, `/cgu`, `/confidentialite`.

Les formulaires (contact, démo, Job Dating, newsletter) passent par `app/api/formulaires/route.js`, qui les transmet au webhook `FORM_WEBHOOK_URL`.

Pour le référencement : chaque page a ses métadonnées, avec `app/sitemap.js` et `app/robots.js`.

## La plateforme (prototype)

- **Fichier** : `components/plateforme/LiggeeyPrototype.jsx`. C'est le prototype repris tel quel, en un seul fichier d'environ 8 300 lignes, avec un sommaire en tête.
- **Montage** : côté navigateur seulement (`components/plateforme/Plateforme.jsx`, avec `dynamic(..., { ssr: false })`), sur `app/plateforme/[[...ecran]]/page.jsx`.
- **Écrans ouverts depuis le site** : uniquement la connexion et l'inscription.
  - `/plateforme/connexion` ;
  - `/plateforme/inscription`, avec `?profil=chercheur`, `prestataire` ou `entreprise`.
- **Règle d'accès** : le site ne renvoie jamais directement vers une page interne de la plateforme (offres, tableau de bord…). Toute autre adresse sous `/plateforme/…` redirige vers `/plateforme/connexion`. Les offres se consultent sur le site, dans la vitrine de l'accueil et sa fenêtre de détail (`/?offre=…`, `/?secteur=…`), qui invite à se connecter.
- **Données** : de démonstration, gardées dans le navigateur (localStorage). Il n'y a pas de serveur ni de vrais comptes, et les paiements sont simulés.
- **Affichage** : plein écran, sans l'en-tête ni le pied de page du site (`components/layout/Cadre.jsx`). La plateforme n'est pas indexée par Google.
- **Changements faits au fichier d'origine** (à refaire si une nouvelle version du prototype remplace ce fichier) :
  - la directive `'use client'` et les props `ecranInitial`, `espaceInitial` et `profilInitial` du composant racine ;
  - la barre « Mode test » n'est plus affichée (les deux `<TestModeBar … />` du composant racine sont retirés ; la sauvegarde locale reste) ;
  - les liens de retour vers le site (constante `SITE_URL`) : logo cliquable, « Retour au site » sur la connexion et l'inscription, et en bas du menu de l'application ;
  - le bouton « Découvrir les offres d'emploi » de la connexion mène aux offres du site (`/#offres`), plus aux offres internes ;
  - un bloc `export { … }` en fin de fichier, qui expose les composants et données de démo à Storybook (sans changer le comportement).
- **Dépendances** : `recharts` et `lucide-react`. Si la compilation échoue sur une icône, vérifier son nom dans la version installée de `lucide-react`.

## Chantiers ouverts (ordre de priorité suggéré)

1. **Aligner les formules du prototype** (`PLANS_INITIAL`) sur les tarifs ci-dessus. Le prototype affiche encore Essentiel gratuit et Premium à 2 500, 5 000 ou 35 000 FCFA. Il propose aussi Free Money et la carte, en plus de Wave et Orange Money.
2. **Remplacer les vraies entreprises** citées dans les données de démo du prototype (Sonatel, Banque Atlantique, Teranga Capital…) par des noms fictifs.
3. **Lire le paramètre `formule`** dans le prototype. Il est envoyé par les boutons d'inscription de la page Tarifs.
4. **Découper le prototype en modules**, un dossier par espace (chercheur, prestataire, entreprise, admin), sans changer son comportement.
5. **Optimiser le référencement et l'accessibilité** : audit Lighthouse sur mobile, contrastes, navigation au clavier, données schema.org.
6. **Préparer la checklist** de mise en ligne et de tests.
7. **Plus tard** : construire la vraie application (comptes, API, paiements Wave et Orange Money), puis faire pointer `NEXT_PUBLIC_APP_URL` vers son adresse.

## Valeurs provisoires

La liste complète est dans `README.md`, section « Valeurs provisoires ». À remplacer avant la mise en ligne :

- dans `lib/site.js` : numéro WhatsApp, e-mail et horaires ;
- les unités des prix ;
- les informations du Job Dating du 12 décembre 2026 ;
- les mentions légales, à faire valider par un juriste ;
- les logos Wave et Orange Money ;
- les photos Unsplash provisoires (`public/images/README.md`).

## Maquettes de référence

`docs/design/` contient les livrables de conception :

- l'arborescence et les parcours ;
- les contenus des pages ;
- les wireframes ;
- l'aperçu haute fidélité de l'accueil.

Pour les ouvrir, lancer un petit serveur local, par exemple `npx serve docs/design`. Ce sont des références visuelles, pas du code à copier.
