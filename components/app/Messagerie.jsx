'use client';

import { useState } from 'react';
import { Paperclip, SendHorizontal } from 'lucide-react';
import { Avatar } from './Avatar';
import { Compteur } from './Badge';

/* Messagerie : liste des conversations, bulles, zone de saisie. */

/** Conversation dans la liste de gauche. */
export function ElementConversation({ nom, apercu, heure, nonLus = 0, presence = 'aucune', actif = false, enTrainEcrire = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={actif ? 'true' : undefined}
      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${actif ? 'border-marque bg-marque-subtil' : 'border-base bg-surface hover:bg-doux'}`}
    >
      <Avatar nom={nom} taille="md" presence={presence} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium text-principal">{nom}</span>
          <span className="shrink-0 text-xs text-discret">{heure}</span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className={`truncate text-sm ${enTrainEcrire ? 'text-marque' : 'text-secondaire'}`}>{enTrainEcrire ? 'En train d’écrire…' : apercu}</span>
          <Compteur valeur={nonLus} label={`${nonLus} messages non lus`} />
        </span>
      </span>
    </button>
  );
}

/** Bulle de message. moi : bulle orange à droite ; sinon bulle claire à gauche avec avatar. */
export function BulleMessage({ texte, heure, moi = false, nom, montrerAvatar = true }) {
  return (
    <div className={`flex items-end gap-2.5 ${moi ? 'flex-row-reverse' : ''}`}>
      {montrerAvatar ? <Avatar nom={nom} taille="xs" ton={moi ? 'plein' : 'marque'} /> : <span className="w-7 shrink-0" />}
      <div className={`flex max-w-[75%] flex-col ${moi ? 'items-end' : 'items-start'}`}>
        <p className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${moi ? 'rounded-br-sm bg-marque text-sur-marque' : 'rounded-bl-sm border border-base bg-surface text-principal'}`}>{texte}</p>
        {heure && <span className="mt-1 text-[11px] text-discret">{heure}</span>}
      </div>
    </div>
  );
}

/** Zone de saisie au pied d'une conversation. */
export function ZoneSaisie({ onEnvoyer, placeholder = 'Écrivez votre message…', onJoindre }) {
  const [texte, setTexte] = useState('');
  const envoyer = (e) => {
    e.preventDefault();
    if (!texte.trim()) return;
    onEnvoyer?.(texte.trim());
    setTexte('');
  };
  return (
    <form onSubmit={envoyer} className="flex items-center gap-2 border-t border-base px-4 py-3">
      <label className="flex-1">
        <span className="sr-only">Message</span>
        <input value={texte} onChange={(e) => setTexte(e.target.value)} placeholder={placeholder} className="h-11 w-full bg-transparent text-sm text-principal placeholder:text-discret focus:outline-none" />
      </label>
      {onJoindre && (
        <button type="button" onClick={onJoindre} aria-label="Joindre un fichier" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-discret hover:bg-doux hover:text-principal">
          <Paperclip size={18} aria-hidden="true" />
        </button>
      )}
      <button type="submit" aria-label="Envoyer" disabled={!texte.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-marque text-sur-marque hover:bg-marque-survol disabled:opacity-40">
        <SendHorizontal size={18} aria-hidden="true" />
      </button>
    </form>
  );
}

/** Séparateur de date dans le fil (« Hier », « Aujourd'hui »). */
export function SeparateurDate({ children }) {
  return (
    <div className="flex items-center gap-3 text-xs text-discret" role="separator">
      <span className="h-px flex-1 bg-[rgb(var(--bordure-base))]" />
      {children}
      <span className="h-px flex-1 bg-[rgb(var(--bordure-base))]" />
    </div>
  );
}
