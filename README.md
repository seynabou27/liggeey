# Site public LIGGEEY

Site vitrine de LIGGEEY, la plateforme sénégalaise d'insertion professionnelle.
Il est construit sur le modèle validé à l'étape 4 (wireframes 2a et 2b) et reprend
les contenus validés à l'étape 3.

- **Technologie** : Next.js (App Router), React, Tailwind CSS et les icônes Lucide, comme le prototype.
- **Langue** : français. Les textes sont rangés par page dans `content/fr/`, ce qui permettra d'ajouter le wolof et l'anglais plus tard.
- **Priorité mobile** : les pages sont légères, les images sont servies en AVIF ou WebP, et la carte et les vidéos ne se chargent qu'au clic.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run db:amorcer           # comptes de démonstration (mot de passe : demo1234)
npm run dev                  # http://localhost:3000
```

En développement, la base de données est créée toute seule dans `.donnees/pglite` (PGlite, un PostgreSQL intégré) : rien à installer.

Pour la mise en production, renseignez `DATABASE_URL` (PostgreSQL), lancez `npm run db:migrer`, `npm run build`, puis `npm start`. Vous pouvez aussi importer le dépôt dans Vercel : Next.js est détecté automatiquement.

## Où modifier quoi

| Je veux changer…                                   | Fichier                                   |
| -------------------------------------------------- | ----------------------------------------- |
| Numéro WhatsApp, e-mail, adresse, horaires, mentions légales | `lib/site.js`                   |
| Textes d'une page                                  | `content/fr/<page>.js`                    |
| Prix et contenu des formules                       | `content/fr/tarifs.js`                    |
| Secteurs, villes, contrats (recherche)             | `content/referentiels.js`                 |
| Job Dating (dates, lieu, programme, entreprises)   | `content/evenements.js`                   |
| Articles du blog                                   | `content/ressources/*.md` (modèle fourni) |
| Photos                                             | `public/images/` (voir `public/images/README.md`) |
| Bannières publicitaires des marques                | `content/fr/publicites.js` (mode d'emploi en tête du fichier) |
| Couleurs et polices                                | `tailwind.config.js`                      |

Pour publier un article, copiez `content/ressources/modele-article.md`, renommez le fichier
(le nom devient l'adresse : `/ressources/mon-article`), écrivez le texte, puis passez `brouillon` à `false`.

Pour une campagne de publicité (service à 25 000 FCFA), déposez les deux images de la marque dans
`public/images/publicites/` : 640 × 400 px pour le mobile et 2 600 × 500 px pour l'ordinateur, moins de 200 Ko chacune.
La bannière prend toute la largeur, comme les cartes voisines.
Les gabarits `gabarit-320x200.png` et `gabarit-1300x250.png` montrent ces formats ; vous pouvez les envoyer aux marques.
Ajoutez ensuite la campagne dans `content/fr/publicites.js`, avec ses dates de début et de fin.
La bannière apparaît pendant ces dates, dans l'heure qui suit le début, puis disparaît seule.
Pour voir la bannière d'exemple (une publicité animée pour LIGGEEY) sur l'accueil, les articles et les tableaux de bord,
comptes de démonstration compris, mettez `NEXT_PUBLIC_PUB_EXEMPLE=true` dans `.env.local`.

## Branchements

- **Application** : les boutons Connexion et Inscription mènent à `NEXT_PUBLIC_APP_URL`. L'inscription transmet le profil choisi : `?profil=chercheur`, `prestataire` ou `entreprise`, plus `formule` ou `objectif` selon le bouton. Côté app, il reste à lire ces paramètres pour présélectionner le profil.
- **Offres en vitrine** : elles sont lues sur `APP_API_URL/offres/vitrine`, au format décrit dans `lib/offres.js`. Tant que l'API n'est pas branchée, `NEXT_PUBLIC_DEMO_OFFRES=true` affiche des offres d'exemple avec des entreprises fictives. **Passez cette variable à `false` avant la mise en ligne.**
- **Formulaires** : le contact, la démo, le Job Dating et la newsletter sont envoyés à `/api/formulaires`, qui les transmet à `FORM_WEBHOOK_URL`. Ce webhook peut être Make, Zapier, Google Apps Script ou un CRM. Les formulaires sont protégés contre les robots par un champ piège.
- **Paiement du Job Dating** : renseignez les liens marchands Wave et Orange Money dans `NEXT_PUBLIC_WAVE_PAYMENT_URL` et `NEXT_PUBLIC_OM_PAYMENT_URL`.

## Plateforme (prototype intégré)

Le prototype de l'application est intégré au site, sur `/plateforme`. Les boutons Connexion et Inscription, et les offres, y mènent directement.

- Fichier : `components/plateforme/LiggeeyPrototype.jsx`, repris tel quel (environ 8 300 lignes, sommaire en tête de fichier).
- Route : `app/plateforme/[[...ecran]]/page.jsx` ouvre le bon écran selon l'adresse :
  - `/plateforme/connexion` : connexion ;
  - `/plateforme/inscription` : choix du profil, ou directement le formulaire avec `?profil=chercheur`, `prestataire` ou `entreprise` ;
  - `/plateforme/offres` : offres d'emploi (espace chercheur de démonstration).
- Plein écran, sans l'en-tête ni le pied de page du site (`components/layout/Cadre.jsx`). Non indexée par Google.
- **Comptes réels** : l'inscription, la connexion (e-mail ou téléphone) et la déconnexion passent par l'API (`app/api/auth/`), avec une base PostgreSQL. Les écrans internes sont réservés, côté serveur, au compte connecté de l'espace. Voir « Back-end » ci-dessous.
- Le reste des données (offres, candidatures, messages, paiements…) est encore de démonstration, gardé dans le navigateur (localStorage). Les paiements sont simulés.
- Quand l'application sera déployée à part, mettez son adresse dans `NEXT_PUBLIC_APP_URL` : les liens du site la suivront.

## Back-end (comptes)

- **Base** : PostgreSQL avec Drizzle ORM. Schéma : `lib/serveur/schema.mjs` ; migrations SQL : `drizzle/`.
  - `DATABASE_URL` vide : PGlite dans `.donnees/pglite`, en développement seulement. PGlite n'accepte qu'un seul programme à la fois : **arrêtez `npm run dev` avant de lancer une commande `db:…`**.
  - `DATABASE_URL` renseignée : n'importe quel PostgreSQL (Neon, Supabase, serveur dédié…).
- **API** :
  - `POST /api/auth/inscription` : crée le compte et ouvre la session. Toutes les règles du formulaire sont revérifiées, dont les âges et l'accord parental (Cap Métier) ;
  - `POST /api/auth/connexion` : e-mail ou téléphone, avec mot de passe. 5 échecs en 15 minutes bloquent l'identifiant ;
  - `POST /api/auth/deconnexion` ;
  - `GET /api/auth/session` : le compte connecté.
- **Sécurité** :
  - mots de passe chiffrés en scrypt ;
  - session dans un cookie httpOnly (30 jours avec « Se souvenir de moi ») ;
  - requêtes venues d'un autre site refusées.
- **Commandes** :

  | Commande | Rôle |
  | --- | --- |
  | `npm run db:generer` | Créer une migration après une modification du schéma |
  | `npm run db:migrer` | Appliquer les migrations (à chaque mise en ligne) |
  | `npm run db:amorcer` | Créer les comptes de démonstration, un par espace (refusé en production) |
  | `npm run db:admin` | Créer un compte admin (variables `ADMIN_NOM`, `ADMIN_EMAIL`, `ADMIN_TELEPHONE`, `ADMIN_MOT_DE_PASSE`) |
  | `npm run db:studio` | Explorer la base dans le navigateur |

- **Comptes de démonstration** : `demo-chercheur@liggeey.sn`, `demo-prestataire@`, `demo-entreprise@`, `demo-capmetier@`, `demo-mentor@` et `demo-admin@liggeey.sn`, avec le mot de passe `demo1234`. Avec `NEXT_PUBLIC_COMPTES_DEMO=true`, l'écran de connexion les propose. **Passez cette variable à `false` avant la mise en ligne.**

## ⚠️ Valeurs provisoires à remplacer avant la mise en ligne

Ces valeurs ont été choisies pour avancer. Elles sont fictives, ou déduites du mémoire et du prototype.

- **Coordonnées** (`lib/site.js`) : le WhatsApp `+221 77 000 00 00`, l'adresse `contact@liggeey.sn`, les horaires et les réseaux sociaux. Les adresses des réseaux sont vides : les icônes s'affichent dans le pied de page, mais sans lien.
- **Adresse** : Hann Maristes 1, Îlot J, Villa n° 63. C'est le siège prévu dans le mémoire, à confirmer comme adresse du bureau d'accueil.
- **Délais annoncés** : 48 h pour une demande de démo, 24 h pour le contact, 48 h pour vérifier un profil (repris du prototype).
- **Unités des prix** : abonnement Entreprise par mois, mentorat par séance, formations à l'unité, suivi par recrue, Job Dating par participant, formalisation par dossier.
- **Formules** : le contenu d'Essentiel et de Premium est repris du prototype, sans engagement.
- **Job Dating du 12 décembre 2026** : la date, le lieu, le programme et les conditions pour les entreprises sont provisoires.
- **Mentions légales** : NINEA et RCCM « en cours d'attribution », hébergeur Vercel, conservation des données 3 ans. **Les trois pages légales doivent être rédigées ou validées par votre conseil juridique.**
- **Chiffre ANSD** (22,9 %) : à revérifier à la source.
- **Formules du prototype** : `PLANS_INITIAL` n'est pas encore aligné sur les tarifs du site (Essentiel 1 500, Premium 3 000, Entreprise 40 000 FCFA).
- **Bannière publicitaire d'exemple** : `NEXT_PUBLIC_PUB_EXEMPLE` doit être à `false` (ou absente) en production.
- **Données de démo du prototype** : elles citent de vraies entreprises (Sonatel, Banque Atlantique, Teranga Capital…). À remplacer par des noms fictifs avant toute démonstration publique.

## Médias à fournir

Il manque les photos, la capture de l'application, les logos officiels Wave et Orange Money, les vidéos en wolof et les photos de l'équipe.
Tant qu'une photo manque, le site affiche un fond ardoise ou des initiales. Aucune image cassée n'apparaît.

## Structure

```
app/                 pages (une par dossier), API des formulaires, sitemap, robots
components/
  layout/            en-tête, menu mobile, pied de page, bouton WhatsApp
  accueil/           bandeau, recherche, vitrine d'offres, sections de l'accueil
  blocs/             blocs réutilisables (en-tête de page, étapes, FAQ, carte, vidéo…)
  formulaires/       champs accessibles, envoi, formulaires contact, démo, Job Dating
  tarifs/            mini-guide, onglets des formules, services à la carte
content/             textes (fr/), référentiels, événements, articles
lib/                 configuration, liens vers l'app, formats, validation, données
public/              logos, images
```

## Accessibilité (déjà en place)

- lien « Aller au contenu » ;
- navigation au clavier, avec un contour orange visible au focus ;
- zones tactiles d'au moins 44 px ;
- texte ardoise sur les boutons orange, avec un contraste de 6:1 ;
- libellés et messages d'erreur reliés à leurs champs ;
- FAQ en `details` / `summary` ;
- respect du réglage « réduire les animations ».

L'audit complet et l'optimisation SEO (données structurées schema.org) font l'objet de l'étape 6.
