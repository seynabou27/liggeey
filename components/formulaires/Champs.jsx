import { ChevronDown } from 'lucide-react';

const BASE =
  'w-full rounded border bg-surface px-3.5 text-[15px] text-principal placeholder:text-discret focus:border-marque focus:outline-none focus:ring-2 focus:ring-focus/40';
const bord = (erreur) => (erreur ? 'border-primaire-700' : 'border-base');

function Libelle({ pour, children, requis }) {
  return (
    <label htmlFor={pour} className="text-sm font-semibold">
      {children}
      {requis && <span aria-hidden="true"> *</span>}
    </label>
  );
}

function Erreur({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="text-sm font-medium text-marque">
      {children}
    </p>
  );
}

const aria = (nom, erreur) => ({
  'aria-invalid': erreur ? true : undefined,
  'aria-describedby': erreur ? `${nom}-erreur` : undefined,
});

export function ChampTexte({ nom, label, requis, erreur, type = 'text', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Libelle pour={nom} requis={requis}>
        {label}
      </Libelle>
      <input id={nom} name={nom} type={type} aria-required={requis || undefined} {...aria(nom, erreur)} className={`${BASE} h-12 ${bord(erreur)}`} {...props} />
      <Erreur id={`${nom}-erreur`}>{erreur}</Erreur>
    </div>
  );
}

export function ChampZone({ nom, label, requis, erreur, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Libelle pour={nom} requis={requis}>
        {label}
      </Libelle>
      <textarea id={nom} name={nom} rows={5} maxLength={2000} aria-required={requis || undefined} {...aria(nom, erreur)} className={`${BASE} py-3 ${bord(erreur)}`} {...props} />
      <Erreur id={`${nom}-erreur`}>{erreur}</Erreur>
    </div>
  );
}

/** Liste déroulante. `options` : chaînes ou objets { id, label|nom }. */
export function ChampSelect({ nom, label, requis, erreur, options, vide = 'Choisir', defaultValue = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Libelle pour={nom} requis={requis}>
        {label}
      </Libelle>
      <div className="relative">
        <select id={nom} name={nom} defaultValue={defaultValue} aria-required={requis || undefined} {...aria(nom, erreur)} className={`${BASE} h-12 appearance-none pr-10 ${bord(erreur)}`} {...props}>
          <option value="">{vide}</option>
          {options.map((o) => (
            <option key={o.id ?? o} value={o.id ?? o}>
              {o.label ?? o.nom ?? o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-discret" aria-hidden="true" />
      </div>
      <Erreur id={`${nom}-erreur`}>{erreur}</Erreur>
    </div>
  );
}

/** Choix unique sous forme de pastilles (boutons radio). */
export function GroupeChoix({ nom, label, options, defaultValue }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={nom} value={o} defaultChecked={o === defaultValue} className="peer sr-only" />
            <span className="inline-flex min-h-[44px] items-center rounded-full border-2 border-base px-4 text-sm font-medium peer-checked:border-principal peer-checked:bg-sombre peer-checked:text-sur-sombre peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-focus">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Choix multiples (cases à cocher). Les valeurs arrivent dans un tableau `nom`. */
export function GroupeCases({ nom, label, options, cochees = [] }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold">{label}</legend>
      {options.map((o) => (
        <label key={o} className="flex min-h-[40px] cursor-pointer items-center gap-3">
          <input type="checkbox" name={`${nom}[]`} value={o} defaultChecked={cochees.includes(o)} className="h-5 w-5 accent-neutre-800" />
          {o}
        </label>
      ))}
    </fieldset>
  );
}

/** Case de consentement, avec lien vers la politique de confidentialité. */
export function CaseConsentement({ label, erreur }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="consentement" aria-required="true" {...aria('consentement', erreur)} className="mt-0.5 h-5 w-5 shrink-0 accent-neutre-800" />
        <span>
          {label}{' '}
          <a href="/confidentialite" className="lien">
            Politique de confidentialité
          </a>
        </span>
      </label>
      <Erreur id="consentement-erreur">{erreur}</Erreur>
    </div>
  );
}

/** Champ invisible : les robots le remplissent, les humains non. */
export function PotDeMiel() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="site_web">Ne pas remplir</label>
      <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/** Message d'échec d'envoi, avec repli WhatsApp. */
export function MessageErreur({ lienWhatsApp }) {
  return (
    <p role="alert" className="rounded-lg bg-marque-doux p-4">
      L'envoi n'a pas abouti. Réessayez dans un instant, ou{' '}
      <a href={lienWhatsApp} target="_blank" rel="noopener noreferrer" className="lien">
        écrivez-nous sur WhatsApp
      </a>
      .
    </p>
  );
}
