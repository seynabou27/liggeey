import { talents } from './talents';
import { independants } from './independants';
import { entreprises } from './entreprises';
import { tarifs } from './tarifs';

export const ressources = {
  meta: { titre: 'Ressources', description: 'Conseils pratiques pour trouver un emploi, développer votre activité et mieux recruter au Sénégal.' },
  hero: { surtitre: 'Ressources', titre: 'Ressources', texte: 'Des conseils pratiques pour trouver un emploi, développer votre activité et mieux recruter.' },
  filtres: [
    { id: 'tous', label: 'Tous' },
    { id: 'talents', label: 'Talents' },
    { id: 'independants', label: 'Indépendants' },
    { id: 'entreprises', label: 'Entreprises' },
  ],
  vide: 'Pas encore d’article ici. Le prochain arrive bientôt.',
  minutes: 'min',
  retenir: 'À retenir',
  lireAussi: 'À lire aussi',
  cta: {
    talents: { titre: 'Postulez à des offres vérifiées', bouton: 'Créer mon compte' },
    independants: { titre: 'Faites reconnaître votre savoir-faire', bouton: 'Créer mon profil' },
    entreprises: { titre: 'Recrutez des profils vérifiés', bouton: 'Demander une démo' },
  },
};

export const faq = {
  meta: { titre: 'Questions fréquentes', description: 'Prix, vérification des offres, paiement Wave et Orange Money, données personnelles : les réponses à vos questions sur LIGGEEY.' },
  hero: { surtitre: 'FAQ', titre: 'Questions fréquentes', texte: 'Vous ne trouvez pas la réponse ? Écrivez-nous sur WhatsApp.' },
  rubriques: [
    {
      id: 'general',
      titre: 'Général',
      questions: [
        { q: 'Qu’est-ce que LIGGEEY ?', r: 'Une plateforme sénégalaise d’insertion professionnelle. Elle rapproche talents, indépendants et entreprises, avec des offres vérifiées et un accompagnement humain.' },
        { q: 'Que veut dire « Liggeey » ?', r: '« Travail », en wolof.' },
        { q: 'Où se trouve votre bureau ?', r: 'À Dakar, Hann Maristes 1, Îlot J, Villa n° 63. Ouvert du lundi au vendredi, 9 h – 18 h, et le samedi, 9 h – 13 h.' },
      ],
    },
    {
      id: 'talents',
      titre: 'Talents',
      questions: [
        ...talents.faq,
        { q: 'Comment obtenir le badge « Profil vérifié » ?', r: 'Envoyez une pièce d’identité et vos diplômes depuis votre profil. Notre équipe les contrôle sous 48 h ouvrées.' },
      ],
    },
    { id: 'independants', titre: 'Indépendants', questions: independants.faq },
    {
      id: 'entreprises',
      titre: 'Entreprises',
      questions: [
        ...entreprises.faq,
        { q: 'Combien coûte l’abonnement Entreprise ?', r: '40 000 FCFA par mois. Il comprend la publication d’offres, la sélection et la short-list des profils.' },
      ],
    },
    {
      id: 'paiement',
      titre: 'Paiement et données',
      questions: [
        { q: 'Quels moyens de paiement acceptez-vous ?', r: 'Wave et Orange Money.' },
        { q: 'Comment changer de formule ou résilier ?', r: tarifs.faq[1].r },
        { q: 'Que faites-vous de mes documents ?', r: 'Ils servent uniquement à vérifier votre profil et à vous mettre en relation. Ils ne sont jamais vendus ni partagés sans votre accord.' },
        { q: 'Comment supprimer mon compte ?', r: 'Depuis vos paramètres, ou sur simple demande par WhatsApp ou e-mail. Vos documents sont alors effacés.' },
      ],
    },
  ],
  pasTrouve: { titre: 'Vous n’avez pas trouvé ?', bouton: 'Écrire sur WhatsApp' },
};

export const contact = {
  meta: { titre: 'Contact', description: 'WhatsApp, bureau d’accueil à Dakar ou formulaire : contactez l’équipe LIGGEEY.' },
  hero: {
    surtitre: 'Contact',
    titre: 'Parlons-en.',
    texte: 'Une question, besoin d’aide pour vous inscrire, envie de devenir partenaire ? Choisissez le moyen qui vous convient.',
    image: '/images/contact-hero.jpg',
    message: 'Envoyer un message',
  },
  moyens: {
    whatsapp: 'WhatsApp',
    bureau: 'Bureau d’accueil',
    email: 'E-mail',
    ecrire: 'Écrire sur WhatsApp',
    itineraire: 'Itinéraire',
    envoyerEmail: 'Envoyer un e-mail',
    textes: {
      whatsapp: 'Écrivez-nous depuis votre téléphone : notre équipe vous répond.',
      bureau: 'Venez nous voir à Dakar, aux horaires d’ouverture.',
      email: 'Pour les partenariats et les demandes détaillées.',
    },
  },
  formulaire: {
    titre: 'Écrivez-nous',
    champs: { nom: 'Nom et prénom', telephone: 'Téléphone (WhatsApp)', email: 'E-mail', profil: 'Vous êtes', motif: 'Motif', message: 'Message', consentement: 'J’accepte la politique de confidentialité.' },
    profils: ['Talent', 'Indépendant', 'Entreprise', 'Établissement ou institution', 'Autre'],
    motifs: [
      { id: 'question', label: 'Une question' },
      { id: 'aide-inscription', label: 'Aide à l’inscription' },
      { id: 'rendez-vous', label: 'Rendez-vous au bureau' },
      { id: 'offre-suspecte', label: 'Signaler une offre suspecte' },
      { id: 'partenariat', label: 'Partenariat' },
      { id: 'autre', label: 'Autre' },
    ],
    bouton: 'Envoyer',
    succes: 'Merci ! Nous vous répondons {delai}.',
  },
  carte: { titre: 'Bureau d’accueil LIGGEEY', afficher: 'Afficher la carte', note: 'La carte se charge à la demande, pour garder la page légère.' },
};
