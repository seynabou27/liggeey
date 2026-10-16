import { useEffect, useState } from 'react';
import { NUANCES, palettes, semantiques, hex, canaux, variable, variablesCss } from '../../lib/tokens/couleurs.mjs';

/* Blocs d'affichage de la page « Fondations / Couleurs ». Tout est lu dans
   lib/tokens/couleurs.mjs : la page se met à jour quand les tokens changent. */

const BLANC = '#FFFFFF';
const ARDOISE = palettes.neutre[800];

function luminance(code) {
  const [r, g, b] = canaux(code)
    .split(' ')
    .map((v) => {
      const c = Number(v) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

function Note({ valeur }) {
  const niveau = valeur >= 7 ? 'AAA' : valeur >= 4.5 ? 'AA' : valeur >= 3 ? 'AA grand' : '—';
  return (
    <span className="tabular-nums">
      {valeur.toFixed(2)} <span className="text-discret">{niveau}</span>
    </span>
  );
}

const PREFIXES = { fond: 'bg', texte: 'text', bordure: 'border', etat: 'ring / outline', statut: 'bg-statut / text-statut' };

const NOMS_PALETTES = {
  primaire: { titre: 'Primaire — orange de marque', usage: 'Boutons, accents, éléments de marque. Référence : primaire-500.' },
  neutre: { titre: 'Neutre — bleu ardoise', usage: 'Textes, fonds, bordures, en-tête. Référence : neutre-800.' },
};

export function Nuancier({ nom }) {
  const p = palettes[nom];
  return (
    <section className="mb-10">
      <h3 className="mb-1 text-lg font-semibold">{NOMS_PALETTES[nom].titre}</h3>
      <p className="mb-4 text-sm text-secondaire">{NOMS_PALETTES[nom].usage} 18 nuances, de 50 à 900.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {NUANCES.map((n) => (
          <div key={n} className="overflow-hidden rounded-lg border border-base bg-surface text-xs">
            <div className="h-16" style={{ background: p[n] }} />
            <div className="space-y-0.5 p-2">
              <p className="font-semibold">
                {nom}-{n}
              </p>
              <p className="font-mono text-secondaire">{p[n]}</p>
              <p className="text-discret" title="Contraste sur blanc">
                ◻ <Note valeur={contraste(p[n], BLANC)} />
              </p>
              <p className="text-discret" title="Contraste sur ardoise (neutre-800)">
                ◼ <Note valeur={contraste(p[n], ARDOISE)} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pastille({ code }) {
  return <span className="inline-block h-5 w-5 shrink-0 rounded border border-base align-middle" style={{ background: code }} />;
}

export function TableSemantique({ groupe }) {
  const tokens = semantiques[groupe];
  return (
    <section className="mb-10">
      <h3 className="mb-1 text-lg font-semibold capitalize">{groupe}</h3>
      <p className="mb-3 text-sm text-secondaire">
        Classes Tailwind : <code className="font-mono">{PREFIXES[groupe]}-…</code>
      </p>
      <div className="overflow-x-auto rounded-lg border border-base">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-doux text-xs text-secondaire">
            <tr>
              <th className="p-3 font-semibold">Token</th>
              <th className="p-3 font-semibold">Variable CSS</th>
              <th className="p-3 font-semibold">Clair</th>
              <th className="p-3 font-semibold">Sombre</th>
              <th className="p-3 font-semibold">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base">
            {Object.entries(tokens).map(([nom, t]) => (
              <tr key={nom} className="bg-surface">
                <td className="p-3 font-mono font-semibold">
                  {groupe === 'etat' ? nom : groupe === 'statut' ? `statut-${nom}` : `${PREFIXES[groupe]}-${nom}`}
                </td>
                <td className="p-3 font-mono text-secondaire">{variable(groupe, nom)}</td>
                <td className="p-3">
                  <span className="flex items-center gap-2">
                    <Pastille code={hex(t.clair)} />
                    <span className="font-mono text-xs">
                      {t.clair.replace('.', '-')} · {hex(t.clair)}
                    </span>
                  </span>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-2">
                    <Pastille code={hex(t.sombre)} />
                    <span className="font-mono text-xs">
                      {t.sombre.replace('.', '-')} · {hex(t.sombre)}
                    </span>
                  </span>
                </td>
                <td className="p-3 text-secondaire">{t.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* Liste de toutes les variables CSS, avec la valeur réellement appliquée dans le thème courant. */
export function ListeVariables() {
  const [calculees, setCalculees] = useState({});
  const clair = variablesCss('clair');
  const sombre = variablesCss('sombre', { avecPalettes: false });

  useEffect(() => {
    const lire = () => {
      const st = getComputedStyle(document.documentElement);
      setCalculees(Object.fromEntries(Object.keys(clair).map((v) => [v, st.getPropertyValue(v).trim()])));
    };
    lire();
    const obs = new MutationObserver(lire);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-base">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-doux text-xs text-secondaire">
          <tr>
            <th className="p-3 font-semibold">Variable</th>
            <th className="p-3 font-semibold">:root (clair)</th>
            <th className="p-3 font-semibold">[data-theme="sombre"]</th>
            <th className="p-3 font-semibold">Valeur appliquée</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base font-mono text-xs">
          {Object.keys(clair).map((v) => (
            <tr key={v} className="bg-surface">
              <td className="p-3 font-semibold">{v}</td>
              <td className="p-3 text-secondaire">{clair[v]}</td>
              <td className="p-3 text-secondaire">{sombre[v] ?? '(identique)'}</td>
              <td className="p-3">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded border border-base" style={{ background: `rgb(var(${v}))` }} />
                  {calculees[v] && `rgb(${calculees[v]})`}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Mini-interface rendue dans les deux thèmes côte à côte (data-theme posé sur le bloc). */
function Apercu({ theme }) {
  return (
    <div data-theme={theme} className="flex-1 overflow-hidden rounded-lg border border-base bg-page text-principal">
      <div className="flex items-center justify-between bg-sombre px-4 py-3 text-sm text-sur-sombre">
        <span className="font-semibold">LIGGEEY</span>
        <span className="text-marque-vif">Offres</span>
      </div>
      <div className="space-y-3 p-4">
        <p className="text-sm font-semibold text-marque">Thème {theme}</p>
        <div className="rounded-lg border border-base bg-surface p-4 shadow-carte">
          <p className="font-semibold">Chargée de clientèle</p>
          <p className="text-sm text-secondaire">CDI · Dakar</p>
          <span className="mt-2 inline-block rounded-full bg-marque-doux px-3 py-1 text-xs font-semibold text-marque">Offre vérifiée</span>
        </div>
        <div className="rounded-lg bg-doux p-3 text-sm text-discret">Zone en retrait, texte discret.</div>
        <div className="flex gap-2">
          <button type="button" className="min-h-[44px] rounded bg-marque px-4 text-sm font-semibold text-sur-marque hover:bg-marque-survol">
            Postuler
          </button>
          <button type="button" className="min-h-[44px] rounded border-2 border-principal px-4 text-sm font-semibold text-principal">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

export function ApercuThemes() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Apercu theme="clair" />
      <Apercu theme="sombre" />
    </div>
  );
}
