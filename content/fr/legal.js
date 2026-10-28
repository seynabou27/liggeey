import { site } from '@/lib/site';

/**
 * Pages légales : structure et valeurs PROVISOIRES.
 * ⚠️ Textes à rédiger ou valider par votre conseil juridique avant publication.
 */
const l = site.legal;

export const legal = {
  avertissement: 'Document provisoire, à valider par notre conseil juridique.',
  miseAJour: `Dernière mise à jour : ${l.miseAJour}`,
  pages: {
    'mentions-legales': {
      titre: 'Mentions légales',
      description: 'Éditeur, directrice de la publication, hébergeur et propriété intellectuelle du site LIGGEEY.',
      sections: [
        { titre: 'Éditeur', texte: [`${l.raisonSociale}, au capital de ${l.capital}.`, `Siège : ${l.siege}.`, `NINEA : ${l.ninea}. RCCM : ${l.rccm}.`, `Contact : ${site.contact.email} · ${site.contact.whatsappAffiche}.`] },
        { titre: 'Directrice de la publication', texte: [l.directionPublication] },
        { titre: 'Hébergeur', texte: [l.hebergeur] },
        { titre: 'Propriété intellectuelle', texte: ['Les textes, le logo et les visuels du site appartiennent à LIGGEEY ou à leurs auteurs. Toute reproduction sans autorisation est interdite.'] },
        { titre: 'Crédits photos', texte: [
            "Photos d’illustration provisoires, via Unsplash, sous licence Unsplash : Ninthgrid (accueil), Francis Odeyemi (bande des chiffres), Smart Anwana (formations, accueil), Divaris Shirichena (talents), Ali Mkumbwa (indépendants), Christina Morillo / WOCinTech Chat (entreprises), Iwaria Inc. (formations et Job Dating), Daniel Thomas (à propos), Ahmed Nasiru (tarifs), Blessing Olarewaju (contact).",
            "Photos de la bannière publicitaire LIGGEEY, via Unsplash, sous licence Unsplash : Etty Fidele, Inocent Drici, Bruno Ngarukiye et alex starnes.",
            "Photos des profils de démonstration de la plateforme, via Unsplash, sous licence Unsplash : Abraham Eli, Ali Mkumbwa, Angelo Casto, Ayo Ogunseinde, Blessing Olarewaju, Desmond Charles Mushi, Divaris Shirichena, Divine Effiong, Dominic Uzoanya, Emmanuel Ikwuegbu, Etty Fidele, Folakemi Oke, Fortune Vieyra, Fotografía Editorial, Idowu Emmanuel, Its Adonis, Johnnathan Tshibangu, Lanre Tobi, Micheal Ogungbe, Mike Aikins, Muhammad-Taha Ibrahim, Nana Adwuma, Nana Kwame, Nana O., Nathan Wong, Ninthgrid, Olawale Munna, Oluwaferanmi Caleb, Oluwatobi Fasipe, Patrick Amofah, Prince Akachi, Sammyayot254, Shedrack Salami, Sikwe Scarter et Sweder Breet.",
          ],
        },
      ],
    },
    cgu: {
      titre: 'Conditions générales d’utilisation',
      description: 'Règles d’utilisation de la plateforme LIGGEEY : inscription, vérification, offres, abonnements et paiement.',
      sections: [
        { titre: 'Objet', texte: ['Les présentes conditions encadrent l’utilisation du site et de la plateforme LIGGEEY.'] },
        { titre: 'Inscription et compte', texte: ['À rédiger.'] },
        { titre: 'Profils et vérification', texte: ['À rédiger : documents demandés, délai de 48 h ouvrées, badge « Profil vérifié ».'] },
        { titre: 'Offres et publication', texte: ['À rédiger : contrôle des entreprises (NINEA, RCCM) et des offres avant publication.'] },
        { titre: 'Abonnements, prix et paiement', texte: ['Pack Essentiel 1 500 FCFA/mois, Premium 3 000 FCFA/mois, abonnement Entreprise 40 000 FCFA/mois. Paiement par Wave ou Orange Money. Sans engagement.'] },
        { titre: 'Services complémentaires', texte: ['Mentorat personnalisé, formations et ateliers, suivi post-embauche, Job Dating, accompagnement à la formalisation : voir la page Tarifs.'] },
        { titre: 'Engagements des utilisateurs', texte: ['À rédiger.'] },
        { titre: 'Responsabilité', texte: ['À rédiger.'] },
        { titre: 'Résiliation', texte: ['La formule reste active jusqu’à la fin du mois payé.'] },
        { titre: 'Droit applicable', texte: ['Droit sénégalais.'] },
      ],
    },
    confidentialite: {
      titre: 'Politique de confidentialité',
      description: 'Données collectées par LIGGEEY, usages, durée de conservation et droits des personnes.',
      sections: [
        { titre: 'Responsable du traitement', texte: [`${l.raisonSociale}, ${l.siege}.`] },
        { titre: 'Données collectées', texte: ['Identité, coordonnées, CV, diplômes, documents liés à votre activité.'] },
        { titre: 'Pourquoi', texte: ['Vérifier les profils, vous mettre en relation, suivre les candidatures et les embauches, gérer les paiements.'] },
        { titre: 'Destinataires', texte: ['Vos documents ne sont jamais vendus ni partagés sans votre accord.'] },
        { titre: 'Durée de conservation', texte: ['3 ans après votre dernière connexion.'] },
        { titre: 'Sécurité', texte: ['À rédiger : mesures techniques et organisationnelles.'] },
        { titre: 'Vos droits', texte: ['Accès, rectification, opposition et suppression : écrivez-nous par e-mail ou WhatsApp.', 'Vous pouvez aussi adresser une réclamation à la Commission de protection des données personnelles (CDP).'] },
      ],
    },
  },
};
