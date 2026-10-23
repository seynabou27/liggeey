/* Export des listes de la plateforme : PDF, Excel (.xlsx) et CSV, générés dans le navigateur.
   - PDF : jsPDF et jspdf-autotable, chargés seulement au moment de l'export (rien sur les pages du site) ;
   - Excel : fichier .xlsx écrit à la main (archive zip sans compression), sans bibliothèque ;
   - CSV : séparateur « ; » et encodage UTF-8 avec BOM, pour qu'Excel en français l'ouvre directement.

   exporterListe({ format, titre, colonnes, lignes, sousTitre })
   - format : 'pdf' | 'xlsx' | 'csv'
   - colonnes : [{ titre, valeur(ligne) }] ; valeur renvoie un texte ou un nombre
   - lignes : les objets à exporter (toutes les lignes filtrées, pas seulement la page affichée) */

import { palettes, BLANC } from './tokens/couleurs.mjs';

export const FORMATS_EXPORT = [
  { id: 'pdf', label: 'PDF', extension: 'pdf', description: 'Pour imprimer ou partager' },
  { id: 'xlsx', label: 'Excel', extension: 'xlsx', description: 'Pour trier et calculer' },
  { id: 'csv', label: 'CSV', extension: 'csv', description: 'Pour importer ailleurs' },
];

/* ---------- Outils ---------- */

function slug(texte) {
  return String(texte)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function dateIso(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function dateLisible(d = new Date()) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function nomFichierExport(titre, extension, d = new Date()) {
  return `liggeey-${slug(titre) || 'export'}-${dateIso(d)}.${extension}`;
}

/** Valeurs de chaque ligne, dans l'ordre des colonnes. Les valeurs vides deviennent « — » dans le PDF seulement. */
function matrice(colonnes, lignes) {
  return lignes.map((l) =>
    colonnes.map((c) => {
      const v = c.valeur(l);
      if (v === null || v === undefined) return '';
      if (typeof v === 'number') return Number.isFinite(v) ? v : '';
      if (Array.isArray(v)) return v.join(', ');
      return String(v);
    })
  );
}

function telecharger(blob, nom) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function rvb(code) {
  const h = code.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/* ---------- CSV ---------- */

function celluleCsv(v) {
  const s = typeof v === 'number' ? String(v).replace('.', ',') : String(v);
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function contenuCsv(colonnes, lignes) {
  const entete = colonnes.map((c) => celluleCsv(c.titre)).join(';');
  const corps = matrice(colonnes, lignes).map((l) => l.map(celluleCsv).join(';'));
  return [entete, ...corps].join('\r\n');
}

/* ---------- Excel (.xlsx) ---------- */

const echapperXml = (s) =>
  String(s)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function lettreColonne(n) {
  let s = '';
  for (let i = n + 1; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
  return s;
}

function feuilleXlsx(colonnes, valeurs) {
  const cellule = (v, ref, style) => {
    if (typeof v === 'number') return `<c r="${ref}"${style}><v>${v}</v></c>`;
    if (v === '') return `<c r="${ref}"${style}/>`;
    return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${echapperXml(v)}</t></is></c>`;
  };
  const toutes = [colonnes.map((c) => c.titre), ...valeurs];
  const largeurs = colonnes.map((_, j) => Math.min(60, Math.max(10, ...toutes.map((l) => String(l[j] ?? '').length + 2))));
  const derniere = `${lettreColonne(colonnes.length - 1)}${toutes.length}`;
  const lignesXml = toutes
    .map((l, i) => `<row r="${i + 1}">${l.map((v, j) => cellule(v, `${lettreColonne(j)}${i + 1}`, i === 0 ? ' s="1"' : '')).join('')}</row>`)
    .join('');
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `<dimension ref="A1:${derniere}"/>` +
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
    `<cols>${largeurs.map((w, j) => `<col min="${j + 1}" max="${j + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>` +
    `<sheetData>${lignesXml}</sheetData>` +
    `<autoFilter ref="A1:${derniere}"/>` +
    '</worksheet>'
  );
}

function stylesXlsx() {
  const fond = palettes.primaire[100].replace('#', 'FF');
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
    `<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="${fond}"/></patternFill></fill></fills>` +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>'
  );
}

/** Nom d'onglet Excel : 31 caractères au plus, sans : \ / ? * [ ] */
function nomOnglet(titre) {
  return String(titre).replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31) || 'Export';
}

export function fichiersXlsx(titre, colonnes, lignes) {
  return {
    '[Content_Types].xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '</Types>',
    '_rels/.rels':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      '</Relationships>',
    'xl/workbook.xml':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      `<sheets><sheet name="${echapperXml(nomOnglet(titre))}" sheetId="1" r:id="rId1"/></sheets>` +
      `<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'${echapperXml(nomOnglet(titre)).replace(/'/g, "''")}'!$A$1:$${lettreColonne(colonnes.length - 1)}$${lignes.length + 1}</definedName></definedNames>` +
      '</workbook>',
    'xl/_rels/workbook.xml.rels':
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>',
    'xl/worksheets/sheet1.xml': feuilleXlsx(colonnes, matrice(colonnes, lignes)),
    'xl/styles.xml': stylesXlsx(),
  };
}

/* Archive zip minimale, sans compression (méthode « stored »), noms en UTF-8. */
const TABLE_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(octets) {
  let c = 0xffffffff;
  for (let i = 0; i < octets.length; i++) c = TABLE_CRC[(c ^ octets[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zip(fichiers) {
  const enc = new TextEncoder();
  const locaux = [];
  const centraux = [];
  let decalage = 0;
  for (const [nom, contenu] of Object.entries(fichiers)) {
    const n = enc.encode(nom);
    const d = typeof contenu === 'string' ? enc.encode(contenu) : contenu;
    const crc = crc32(d);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // noms en UTF-8
    local.setUint16(8, 0, true); // stored
    local.setUint16(10, 0, true);
    local.setUint16(12, 0x21, true); // 1er janvier 1980
    local.setUint32(14, crc, true);
    local.setUint32(18, d.length, true);
    local.setUint32(22, d.length, true);
    local.setUint16(26, n.length, true);
    local.setUint16(28, 0, true);
    locaux.push(new Uint8Array(local.buffer), n, d);

    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, 0, true);
    central.setUint16(14, 0x21, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, d.length, true);
    central.setUint32(24, d.length, true);
    central.setUint16(28, n.length, true);
    central.setUint32(42, decalage, true);
    centraux.push(new Uint8Array(central.buffer), n);
    decalage += 30 + n.length + d.length;
  }
  const tailleCentrale = centraux.reduce((s, p) => s + p.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, centraux.length / 2, true);
  fin.setUint16(10, centraux.length / 2, true);
  fin.setUint32(12, tailleCentrale, true);
  fin.setUint32(16, decalage, true);
  const parties = [...locaux, ...centraux, new Uint8Array(fin.buffer)];
  const sortie = new Uint8Array(parties.reduce((s, p) => s + p.length, 0));
  let i = 0;
  for (const p of parties) {
    sortie.set(p, i);
    i += p.length;
  }
  return sortie;
}

/* ---------- PDF ---------- */

/* Les polices standard du PDF ne couvrent que l'alphabet latin (accents français compris) :
   les espaces fines (milliers en fr-FR) deviennent des espaces simples, le reste est retiré. */
function textePdf(v) {
  return String(v)
    .replace(/[   ]/g, ' ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\u0000-ÿŒœ€–—…]/g, '');
}

async function exporterPdf({ titre, sousTitre, colonnes, lignes, nom }) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const paysage = colonnes.length > 5;
  const doc = new jsPDF({ orientation: paysage ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
  const marge = 14;
  const ardoise = rvb(palettes.neutre[800]);
  const orange = rvb(palettes.primaire[700]);
  const discret = rvb(palettes.neutre[500]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...orange);
  doc.text('LIGGEEY', marge, 16);
  doc.setFontSize(16);
  doc.setTextColor(...ardoise);
  doc.text(textePdf(titre), marge, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...discret);
  const meta = `Exporté le ${dateLisible()} · ${lignes.length} ${lignes.length > 1 ? 'éléments' : 'élément'}${sousTitre ? ` · ${sousTitre}` : ''}`;
  doc.text(textePdf(meta), marge, 30);

  autoTable(doc, {
    startY: 35,
    margin: { left: marge, right: marge, bottom: 16 },
    head: [colonnes.map((c) => textePdf(c.titre))],
    body: matrice(colonnes, lignes).map((l) => l.map((v) => (v === '' ? '—' : textePdf(typeof v === 'number' ? v.toLocaleString('fr-FR') : v)))),
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.2, textColor: ardoise, lineColor: rvb(palettes.neutre[150]), lineWidth: 0.1 },
    headStyles: { fillColor: ardoise, textColor: rvb(BLANC), fontStyle: 'bold' },
    alternateRowStyles: { fillColor: rvb(palettes.primaire[50]) },
    didDrawPage: () => {
      const h = doc.internal.pageSize.getHeight();
      const w = doc.internal.pageSize.getWidth();
      doc.setFontSize(8);
      doc.setTextColor(...discret);
      doc.text('LIGGEEY · document interne, données confidentielles', marge, h - 8);
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, w - marge, h - 8, { align: 'right' });
    },
  });
  doc.save(nom);
}

/* ---------- Point d'entrée ---------- */

export async function exporterListe({ format, titre, sousTitre, colonnes, lignes }) {
  const f = FORMATS_EXPORT.find((x) => x.id === format);
  if (!f) throw new Error(`Format d'export inconnu : ${format}`);
  const nom = nomFichierExport(titre, f.extension);
  if (format === 'pdf') {
    await exporterPdf({ titre, sousTitre, colonnes, lignes, nom });
  } else if (format === 'xlsx') {
    telecharger(new Blob([zip(fichiersXlsx(titre, colonnes, lignes))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), nom);
  } else {
    telecharger(new Blob(['﻿', contenuCsv(colonnes, lignes)], { type: 'text/csv;charset=utf-8' }), nom);
  }
  return nom;
}
