import { useState } from 'react';
import { fn } from 'storybook/test';
import { ElementConversation, BulleMessage, ZoneSaisie, SeparateurDate, Carte } from '../../../../components/app';

export default {
  title: 'Composants/Application/Bibliothèque/Messagerie',
  component: BulleMessage,
  parameters: { docs: { description: { component: 'Messagerie : conversations, bulles, saisie. `components/app/Messagerie.jsx`' } } },
};

export const Conversations = {
  name: 'ElementConversation',
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <ElementConversation nom="Moussa Diop" apercu="Merci, je passe au bureau demain." heure="10:24" nonLus={2} presence="en-ligne" actif onClick={fn()} />
      <ElementConversation nom="Fatou Sarr" apercu="Mon document est-il validé ?" heure="Hier" presence="absent" onClick={fn()} />
      <ElementConversation nom="Senegal Construction" heure="09:02" enTrainEcrire onClick={fn()} />
    </div>
  ),
};

export const Fil = {
  name: 'Fil de discussion',
  render: () => {
    const [messages, setMessages] = useState([
      { moi: false, texte: 'Bonjour, mon document est-il validé ?', heure: '09:12' },
      { moi: true, texte: 'Bonjour Fatou, il est en cours de vérification.', heure: '09:15' },
      { moi: true, texte: 'Vous aurez une réponse sous 48 h.', heure: '09:15' },
    ]);
    return (
      <Carte flush className="max-w-2xl">
        <div className="flex flex-col gap-4 p-5">
          <SeparateurDate>Aujourd’hui</SeparateurDate>
          {messages.map((m, i) => (
            <BulleMessage key={i} {...m} nom={m.moi ? 'Admin LIGGEEY' : 'Fatou Sarr'} montrerAvatar={!messages[i + 1] || messages[i + 1].moi !== m.moi} />
          ))}
        </div>
        <ZoneSaisie onEnvoyer={(texte) => setMessages((l) => [...l, { moi: true, texte, heure: 'à l’instant' }])} onJoindre={fn()} />
      </Carte>
    );
  },
};
