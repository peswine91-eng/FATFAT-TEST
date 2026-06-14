const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
const output = fs.createWriteStream('/home/user/FATFAT-TEST/Dashkit_Prototype_Makers_Bandung.pdf');
doc.pipe(output);

const C = {
  navy:   '#1A2B4A',
  teal:   '#0D7377',
  accent: '#F4A261',
  light:  '#F0F4F8',
  white:  '#FFFFFF',
  dark:   '#2D2D2D',
  muted:  '#888888',
  green:  '#2E7D32',
  red:    '#B71C1C',
  orange: '#E65100',
  border: '#CCCCCC',
  gold:   '#F9A825',
};

const W = doc.page.width - 100;

// ─── helpers ────────────────────────────────────────────────────────────────
function newPage() { doc.addPage(); }

function sectionHeader(title, sub) {
  const y = doc.y;
  doc.rect(50, y, W, 42).fill(C.navy);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(15)
     .text(title, 62, y + 8, { width: W - 20 });
  if (sub) {
    doc.fillColor('#BDC8D4').font('Helvetica').fontSize(9)
       .text(sub, 62, y + 26, { width: W - 20 });
  }
  doc.y = y + 52;
}

function subHeader(title, color) {
  doc.moveDown(0.4);
  doc.fillColor(color || C.teal).font('Helvetica-Bold').fontSize(11).text(title);
  doc.moveTo(50, doc.y + 1).lineTo(50 + W, doc.y + 1)
     .strokeColor(color || C.teal).lineWidth(0.8).stroke();
  doc.moveDown(0.5);
}

function para(text, opts) {
  doc.fillColor(C.dark).font('Helvetica').fontSize(10)
     .text(text, { width: W, ...(opts || {}) });
  doc.moveDown(0.25);
}

function bullet(text, color) {
  doc.fillColor(color || C.dark).font('Helvetica').fontSize(10)
     .text('•  ' + text, 60, doc.y, { width: W - 10 });
  doc.moveDown(0.2);
}

function kv(key, val, keyColor) {
  const sy = doc.y;
  doc.fillColor(keyColor || C.teal).font('Helvetica-Bold').fontSize(9)
     .text(key, 60, sy, { width: 110, continued: false });
  doc.fillColor(C.dark).font('Helvetica').fontSize(9)
     .text(val, 175, sy, { width: W - 125 });
  doc.y = doc.y + 2;
}

function noteBox(text, bg, border) {
  const sy = doc.y;
  const h = 36;
  doc.rect(50, sy, W, h).fill(bg || '#FFF8E1');
  doc.rect(50, sy, 4, h).fill(border || C.gold);
  doc.fillColor(C.dark).font('Helvetica-Oblique').fontSize(9)
     .text(text, 62, sy + 10, { width: W - 20 });
  doc.y = sy + h + 8;
}

function tHead(cols, widths) {
  const sy = doc.y;
  doc.rect(50, sy, W, 20).fill(C.navy);
  let x = 50;
  cols.forEach((c, i) => {
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(8.5)
       .text(c, x + 4, sy + 6, { width: widths[i] - 8 });
    x += widths[i];
  });
  doc.y = sy + 22;
}

function tRow(cells, widths, idx, tall) {
  const h = tall || 18;
  const sy = doc.y;
  doc.rect(50, sy, W, h).fill(idx % 2 === 0 ? C.white : C.light);
  let x = 50;
  cells.forEach((cell, i) => {
    const isObj = typeof cell === 'object' && cell !== null;
    const txt  = isObj ? cell.t : cell;
    const col  = isObj ? (cell.c || C.dark) : C.dark;
    const bold = isObj && cell.b;
    doc.fillColor(col).font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5)
       .text(txt, x + 4, sy + 5, { width: widths[i] - 8 });
    x += widths[i];
  });
  doc.moveTo(50, sy + h).lineTo(50 + W, sy + h)
     .strokeColor(C.border).lineWidth(0.3).stroke();
  doc.y = sy + h + 1;
}

function tagBox(label, color) {
  const sy = doc.y;
  doc.roundedRect(50, sy, W, 22, 4).fill(color || C.teal);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(10)
     .text(label, 58, sy + 6, { width: W - 16 });
  doc.y = sy + 30;
}

function makerCard(num, name, track, location, contact, website, wa, goodFor, pricing, note) {
  const sy = doc.y;
  // Card background
  doc.rect(50, sy, W, 110).fill(C.light);
  doc.rect(50, sy, 4, 110).fill(track === 1 ? C.teal : track === 2 ? C.orange : track === 3 ? C.red : C.navy);

  // Number badge
  doc.circle(73, sy + 16, 11).fill(track === 1 ? C.teal : track === 2 ? C.orange : track === 3 ? C.red : C.navy);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(10).text(num, 67, sy + 10, { width: 13, align: 'center' });

  // Name
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(12).text(name, 92, sy + 8, { width: W - 80 });
  doc.fillColor(C.muted).font('Helvetica').fontSize(8)
     .text(location, 92, sy + 24, { width: W - 80 });

  // Contact info
  const col2 = 290;
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8).text('WA / PHONE', 92, sy + 40);
  doc.fillColor(C.dark).font('Helvetica').fontSize(8).text(wa || contact, 92, sy + 51, { width: 180 });
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8).text('WEBSITE', col2, sy + 40);
  doc.fillColor(C.dark).font('Helvetica').fontSize(8).text(website, col2, sy + 51, { width: W - col2 + 30 });

  // Good for
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8).text('GOOD FOR', 92, sy + 68);
  doc.fillColor(C.dark).font('Helvetica').fontSize(8).text(goodFor, 92, sy + 79, { width: 180 });

  // Pricing
  doc.fillColor(C.green).font('Helvetica-Bold').fontSize(8).text('EST. PRICING', col2, sy + 68);
  doc.fillColor(C.dark).font('Helvetica').fontSize(8).text(pricing, col2, sy + 79, { width: W - col2 + 30 });

  if (note) {
    doc.fillColor(C.orange).font('Helvetica-BoldOblique').fontSize(7.5)
       .text('★  ' + note, 92, sy + 97, { width: W - 60 });
  }

  doc.y = sy + 118;
}

function divider() {
  doc.moveDown(0.4);
  doc.moveTo(50, doc.y).lineTo(50 + W, doc.y).strokeColor(C.border).lineWidth(0.4).stroke();
  doc.moveDown(0.4);
}

function pageNumbers() {
  const r = doc.bufferedPageRange();
  for (let i = r.start; i < r.start + r.count; i++) {
    if (i === 0) continue;
    doc.switchToPage(i);
    doc.fillColor(C.muted).font('Helvetica').fontSize(8)
       .text('Dashkit Prototype Makers — Bandung & Jakarta 2026  ·  Page ' + i,
             50, doc.page.height - 30, { align: 'center', width: W });
    doc.moveTo(50, doc.page.height - 35).lineTo(50 + W, doc.page.height - 35)
       .strokeColor(C.border).lineWidth(0.3).stroke();
  }
}

// ═══════════════════════════════════════════════
// COVER
// ═══════════════════════════════════════════════
doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.navy);
doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill(C.accent);
doc.rect(0, 0, doc.page.width, 8).fill(C.accent);

doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(10)
   .text('DASHKIT · CONFIDENTIAL', 50, 70, { align: 'center', width: W });

doc.fillColor(C.white).font('Helvetica-Bold').fontSize(40)
   .text('PROTOTYPE', 50, 105, { align: 'center', width: W });
doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(28)
   .text('MAKERS DIRECTORY', 50, 155, { align: 'center', width: W });

doc.moveTo(150, 200).lineTo(doc.page.width - 150, 200).strokeColor(C.accent).lineWidth(2).stroke();

doc.fillColor('#BDC8D4').font('Helvetica').fontSize(12)
   .text('Bandung & Jakarta  ·  Spice Kit + Cooking Kit Shell  ·  June 2026', 50, 215, { align: 'center', width: W });

// Product summary boxes
const products = [
  { label: 'PRODUCT 1', name: 'Spice/Halal Kit', desc: 'Semi-hard EVA shell\nCustom inserts · Travel size' },
  { label: 'PRODUCT 2', name: 'Cooking Kit', desc: 'Heat-resistant shell\nMoulded casing · Portable' },
];
products.forEach((p, i) => {
  const bx = 50 + i * (W / 2 + 5);
  const bw = W / 2 - 5;
  doc.roundedRect(bx, 265, bw, 80, 6).fill('#243858');
  doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(8).text(p.label, bx + 10, 277, { width: bw - 20 });
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(13).text(p.name, bx + 10, 290, { width: bw - 20 });
  doc.fillColor('#BDC8D4').font('Helvetica').fontSize(9).text(p.desc, bx + 10, 310, { width: bw - 20 });
});

// Track legend
const tracks = [
  { num: 1, label: 'Track 1 — Semi-Hard Case Makers', color: C.teal },
  { num: 2, label: 'Track 2 — 3D Printing Prototypers', color: C.orange },
  { num: 3, label: 'Track 3 — Injection Moulding', color: C.red },
  { num: 4, label: 'Track 4 — Makerspace / FabLab', color: C.navy },
];
doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(10)
   .text('WHAT\'S INSIDE', 50, 375, { align: 'center', width: W });
doc.moveTo(200, 390).lineTo(doc.page.width - 200, 390).strokeColor(C.accent).lineWidth(0.5).stroke();

tracks.forEach((t, i) => {
  const ty = 400 + i * 22;
  doc.circle(68, ty + 7, 8).fill(t.color);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(8).text(t.num, 64, ty + 3, { width: 8, align: 'center' });
  doc.fillColor('#BDC8D4').font('Helvetica').fontSize(10).text(t.label, 85, ty + 2);
});

const extras = ['Recommended Step-by-Step Sequence', 'Pricing Comparison Table', 'WhatsApp Message Templates (Bahasa Indonesia)', 'Notes & Checklist Pages'];
extras.forEach((e, i) => {
  doc.fillColor('#BDC8D4').font('Helvetica').fontSize(10).text('·  ' + e, 50, 492 + i * 18, { align: 'center', width: W });
});

doc.fillColor('#7A8FA6').font('Helvetica').fontSize(9)
   .text('Prepared June 14, 2026  ·  Dashkit · For personal use only', 50, doc.page.height - 50, { align: 'center', width: W });

// ═══════════════════════════════════════════════
// PAGE 2 — SEQUENCE + OVERVIEW
// ═══════════════════════════════════════════════
newPage();
sectionHeader('RECOMMENDED SEQUENCE', 'What to do first, second, and third — before spending serious money');

subHeader('The Strategy in Plain English');
para('You have two products at different prototyping stages. Neither has a finalised design yet. The smartest move is to start cheap and fast — use 3D printing to get something physical in your hands first, then hand that to a case/mould maker. Do NOT pay for injection moulds before you have a shape you\'re happy with.');
para('Both products can follow the same 3-step flow:');

doc.moveDown(0.3);
const steps = [
  { n: '01', title: 'Sketch → 3D File', desc: 'Use Lovable/AI tools to create reference images and rough dimensions. Then get a 3D design file made (DR3D offers this service). Without a file, no maker can quote you accurately.', who: 'You + DR3D or FabLab Bandung', cost: 'IDR 0–500k (SGD 0–35)', color: C.teal },
  { n: '02', title: '3D Print a Rough Prototype', desc: 'Print in ABS or Nylon. For the spice kit — check if the size and compartment layout feels right. For the cooking kit — verify the shell shape and heat tolerance. Iterate fast, cost is low.', who: 'DR3D / Sultan 3D / FabLab', cost: 'IDR 200k–2M (SGD 14–142)', color: C.orange },
  { n: '03', title: 'Hand Off to Specialist Maker', desc: 'Spice Kit → Give the 3D print to Eureka/Intama to replicate in semi-hard EVA. Cooking Kit → Give to PT Dinamika Polimerindo to build proper heat-resistant injection mould piece.', who: 'Eureka / Intama / PT Dinamika', cost: 'IDR 300k–8M (SGD 21–570)', color: C.red },
];

steps.forEach(s => {
  const sy = doc.y;
  doc.rect(50, sy, W, 68).fill(C.light);
  doc.rect(50, sy, 4, 68).fill(s.color);
  doc.circle(73, sy + 18, 13).fill(s.color);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(11).text(s.n, 66, sy + 12, { width: 15, align: 'center' });
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(12).text('Step ' + s.n + ' — ' + s.title, 94, sy + 8);
  doc.fillColor(C.dark).font('Helvetica').fontSize(9).text(s.desc, 94, sy + 24, { width: W - 60 });
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8).text('WHO: ', 94, sy + 52, { continued: true });
  doc.fillColor(C.dark).font('Helvetica').fontSize(8).text(s.who + '   ', { continued: true });
  doc.fillColor(C.green).font('Helvetica-Bold').fontSize(8).text('COST: ', { continued: true });
  doc.fillColor(C.dark).font('Helvetica').fontSize(8).text(s.cost);
  doc.y = sy + 76;
});

doc.moveDown(0.5);
subHeader('Two Products — Two Tracks');
tHead(['Product', 'Shell Type', 'Primary Track', 'Backup Track', 'Final Destination'], [130, 120, 110, 100, W - 460]);
[
  [{ t: 'Spice / Halal Kit', b: true }, 'Semi-hard EVA, ~travel-kit size', { t: 'Track 1 (bag makers)', c: C.teal }, 'Track 2 (3D print first)', 'China factory (mass)'],
  [{ t: 'Cooking Kit Shell', b: true }, 'Heat-resistant moulded shell', { t: 'Track 2 (3D print first)', c: C.orange }, 'Track 3 (injection mould)', 'China factory (mass)'],
].forEach((r, i) => tRow(r, [130, 120, 110, 100, W - 460], i));

doc.moveDown(0.6);
noteBox('KEY TIP: Go to FabLab Bandung first this week — free consultation, on-site machines, and you can leave with a rough 3D-printed shape in hours. Take that shape to the other makers for accurate quotes.', '#E3F2FD', C.teal);

// ═══════════════════════════════════════════════
// PAGE 3 — TRACK 1
// ═══════════════════════════════════════════════
newPage();
tagBox('TRACK 1  —  SEMI-HARD CASE / BAG MAKERS  (Spice Kit Shell)', C.teal);
para('These are Bandung bag and case manufacturers who can produce the semi-rigid EVA outer shell with custom compartments. Bandung is Indonesia\'s bag manufacturing capital — these people do this every day.');
doc.moveDown(0.3);

makerCard('1', 'Eureka Indonesia', 1,
  'Bandung, West Java',
  '081317098975', 'eureka.id/konveksi-tas-koper-di-bandung', '081317098975',
  'Semi-hard & hardcase kits — polycarbonate, ABS, EVA. Does free samples.',
  'Sample: IDR 300k–800k (SGD 21–57). Production MOQ negotiable.',
  'Explicitly offers FREE sample/prototype before any bulk commitment — start here.');

makerCard('2', 'Intama Bagmaker', 1,
  'Kab. Bandung — Banjaran / Margahayu (Taman Kopo Indah Blok B2-4A No.11)',
  '0822-4045-8686', 'intamakonveksi.com', '0822-4045-8686',
  'Structured kit cases, custom compartments. Does prototype sample then final sample.',
  'DP 50% before prototype. Sample: IDR 300k–1M (SGD 21–71).',
  'Clean 2-stage sample process: prototype sample (shape check) → final sample (real materials).');

makerCard('3', 'Bagprovider', 1,
  'Bandung (serves national + HK clients)',
  'via bagprovider.com', 'bagprovider.com/pabrik-tas-koper-bandung', 'Contact via website',
  'Structured bag cases, rigid casing, international client experience.',
  'Sample pricing on request — contact directly.',
  'Has produced samples for Hong Kong clients — understands export-quality expectations.');

makerCard('4', 'Yeye Bags', 1,
  'Bandung (first-hand supplier)',
  'via yeyebags.com', 'yeyebags.com/konveksi-tas-custom-di-bandung', 'Contact via website',
  'Custom semi-rigid cases, open to 1-piece sample discussions.',
  'Sample pricing on request.',
  'Positioned as a first-hand (no middleman) supplier — potential for lower sample cost.');

makerCard('5', 'OSCAS', 1,
  'Bandung',
  'via oscas.co.id', 'oscas.co.id', 'Contact via website',
  'Modern machinery, high-volume but does custom samples too.',
  'Sample pricing on request — larger facility.',
  'Good if you want a more industrial-feel finish on the prototype.');

// ═══════════════════════════════════════════════
// PAGE 4 — TRACK 2
// ═══════════════════════════════════════════════
newPage();
tagBox('TRACK 2  —  3D PRINTING PROTOTYPE MAKERS  (Both Products — Best First Step)', C.orange);
para('3D printing is your fastest and cheapest way to get a physical object in your hands before committing to any mould or case maker. For the cooking kit specifically, ABS, Nylon, and Carbon Fibre Composite can withstand heat — suitable for a first functional prototype. Both products should start here.');
doc.moveDown(0.3);

makerCard('6', 'DR3D Indonesia  ★ RECOMMENDED FIRST CONTACT', 2,
  'Bandung + Jakarta (serves both, operates online)',
  '085875333516', 'dr3d.co.id', '085875333516',
  'Industrial & mechanical prototypes. Materials incl. Carbon Fibre, Kevlar, Nylon, ABS, PC.',
  'IDR 200k–2M per piece (SGD 14–142) depending on size & material.',
  'ONLY provider found with Carbon Fibre + Kevlar materials — critical for heat-resistant cooking kit shell.');

makerCard('7', 'Sultan 3D Printing', 2,
  'Bandung',
  'via sultan3dprinting.com', 'sultan3dprinting.com', 'Contact via website',
  'Fast turnaround (24h for small pieces). All-in pricing, no hidden charges.',
  'All-in per piece — contact for quote. Free Zoom consultation.',
  '24-hour service good for quick shape iterations. Free consultation before committing.');

makerCard('8', 'Evolusi 3D', 2,
  'Serves Bandung (ships or pickup)',
  'via evolusi3d.com', 'evolusi3d.com/jasa-3d-print/', 'Contact via website',
  'Standard 3D printing range, safe delivery to Bandung.',
  'Contact for quote per piece.',
  'Good backup option if DR3D or Sultan have a waiting list.');

doc.moveDown(0.3);
subHeader('Materials Guide — What to Ask For');
tHead(['Material', 'Heat Resistance', 'Strength', 'Best For', 'Approx. Cost'], [90, 90, 90, 170, W - 440]);
[
  ['ABS', 'Medium (~80°C)', 'Good', 'Spice kit shell first prototype', 'Low'],
  ['PETG', 'Medium (~80°C)', 'Good', 'Semi-rigid enclosures', 'Low'],
  [{ t: 'Nylon (PA)', b: true }, { t: 'High (~120°C)', c: C.green }, 'Very Good', 'Cooking kit — functional prototype', 'Medium'],
  [{ t: 'Polycarbonate (PC)', b: true }, { t: 'High (~130°C)', c: C.green }, 'Excellent', 'Cooking kit — tougher test piece', 'Medium-High'],
  [{ t: 'Carbon Fibre Composite', b: true }, { t: 'Very High (150°C+)', c: C.green, b: true }, 'Superior', { t: 'Cooking kit — ideal first prototype', b: true }, { t: 'Higher', c: C.orange }],
].forEach((r, i) => tRow(r, [90, 90, 90, 170, W - 440], i));

noteBox('For the cooking kit shell: ask for Nylon or Carbon Fibre Composite (DR3D has both). For the spice kit: ABS or PETG is fine for the first shape test.', '#FFF3E0', C.orange);

// ═══════════════════════════════════════════════
// PAGE 5 — TRACK 3 + 4
// ═══════════════════════════════════════════════
newPage();
tagBox('TRACK 3  —  INJECTION MOULDING  (Cooking Kit Shell — When Design is Finalised)', C.red);
para('Use these only after your design is locked. Injection moulding requires building a physical mould first (expensive), but produces the closest result to final China-factory quality. These companies are in Greater Jakarta — reachable for a day trip or via courier/email.');
doc.moveDown(0.3);

makerCard('9', 'PT Dinamika Polimerindo', 3,
  'Jurumudi, Tangerang (Greater Jakarta) — Jl. Abdul Rachman Saleh No.8',
  '(021) 540-0288', 'polimerindo.com', 'info@polimerindo.com (email first)',
  'Full service: 3D design → prototype → low-volume injection moulding.',
  'Low-vol prototype: IDR 2M–8M (SGD 142–570). Mould build: more.',
  'BEST for cooking kit — they do 3D design + prototype + mould in one place.');

makerCard('10', 'PT Daijo Industrial', 3,
  'Kawasan Berikat Nusantara, Jakarta Utara',
  'via daijo.co.id', 'daijo.co.id', 'Contact via website',
  'Precision moulding tools + plastic injection. End-to-end design to production.',
  'Contact for quote.',
  'Good for precision parts. Better for when you need exact engineering tolerances.');

makerCard('11', 'Presisi Group', 3,
  'Cileungsi / Cimanggis, Greater Jakarta',
  'via presisiplastics.co.id', 'presisiplastics.co.id', 'Contact via website',
  'In-house mould design, manufacturing and maintenance. Wide machine range.',
  'Contact for quote.',
  'One of the few Indonesian companies with full in-house mould capability.');

doc.moveDown(0.2);
tagBox('TRACK 4  —  MAKERSPACE / FABLAB  (Consult + Build First, Cheapest Option)', C.navy);
para('Go here FIRST if you want to consult face-to-face, try different materials, and walk away with a rough prototype the same day. No MOQ. Pay only for machine time and materials used. They also have people who can help translate your concept into a 3D file.');
doc.moveDown(0.2);

makerCard('12', 'FabLab Bandung  ★ GO HERE FIRST', 4,
  'Jl. Kopo No. 78, Bangunan Gusto Lantai 2, Bandung (first FabLab in West Java)',
  '+62 895 6060 73321', 'fablabs.io/labs/fablabbandung', '+62 895 6060 73321',
  '3D printers, laser cutters, CNC machines on-site. Can build rough prototype same day.',
  'Machine hour rate only — IDR 50k–200k per session (SGD 3.55–14). No MOQ.',
  'Non-profit, open-access. Can help sketch your concept → 3D file → print in same visit.');

// ═══════════════════════════════════════════════
// PAGE 6 — PRICING COMPARISON
// ═══════════════════════════════════════════════
newPage();
sectionHeader('PRICING COMPARISON', 'All makers — estimated cost for 1–2 prototype pieces');

tHead(['#', 'Maker', 'Track', 'Service', 'Est. Cost (IDR)', 'Est. Cost (SGD)'], [25, 155, 60, 120, 110, W - 470]);
[
  ['12', { t: 'FabLab Bandung', b: true }, { t: 'T4', c: C.navy }, '3D print rough + consult', 'IDR 50k–200k', { t: 'SGD 3–14', c: C.green }],
  ['7',  { t: 'Sultan 3D', b: true },  { t: 'T2', c: C.orange }, '3D print prototype piece', 'IDR 150k–800k', { t: 'SGD 11–57', c: C.green }],
  ['6',  { t: 'DR3D Indonesia ★', b: true }, { t: 'T2', c: C.orange }, 'Industrial 3D prototype (ABS/CF)', 'IDR 200k–2M', { t: 'SGD 14–142', c: C.green }],
  ['1',  { t: 'Eureka Indonesia', b: true }, { t: 'T1', c: C.teal }, 'Semi-hard EVA case sample', 'IDR 300k–800k', { t: 'SGD 21–57', c: C.green }],
  ['2',  { t: 'Intama Bagmaker', b: true }, { t: 'T1', c: C.teal }, 'Prototype + final sample (2-stage)', 'IDR 300k–1M', { t: 'SGD 21–71', c: C.green }],
  ['3',  { t: 'Bagprovider', b: true }, { t: 'T1', c: C.teal }, 'Custom case sample', 'TBC — request quote', 'TBC'],
  ['4',  { t: 'Yeye Bags', b: true }, { t: 'T1', c: C.teal }, 'Custom case sample (1 piece)', 'TBC — request quote', 'TBC'],
  ['5',  { t: 'OSCAS', b: true }, { t: 'T1', c: C.teal }, 'Custom case sample', 'TBC — request quote', 'TBC'],
  ['9',  { t: 'PT Dinamika', b: true }, { t: 'T3', c: C.red }, '3D design + low-vol prototype mould', 'IDR 2M–8M', { t: 'SGD 142–570', c: C.red }],
  ['10', { t: 'PT Daijo', b: true }, { t: 'T3', c: C.red }, 'Precision mould + injection piece', 'TBC — request quote', 'TBC'],
  ['11', { t: 'Presisi Group', b: true }, { t: 'T3', c: C.red }, 'Mould design + injection mould', 'TBC — request quote', 'TBC'],
].forEach((r, i) => tRow(r, [25, 155, 60, 120, 110, W - 470], i));

doc.moveDown(0.6);
noteBox('Exchange rate used: 1 SGD ≈ IDR 14,079 (June 2026). All prices are estimates from industry research — get formal quotes before committing to anything.', '#E8F5E9', C.green);

doc.moveDown(0.5);
subHeader('Quick Decision Matrix');
tHead(['Situation', 'Who to Contact First'], [240, W - 240]);
[
  ['I just want to see a rough shape today — cheapest possible', { t: 'FabLab Bandung — walk in or WhatsApp now', c: C.teal }],
  ['I have a 3D file and want a quality industrial print', { t: 'DR3D Indonesia (WA: 085875333516)', c: C.orange }],
  ['I want the spice kit case made in actual semi-hard EVA material', { t: 'Eureka Indonesia first (free sample), then Intama', c: C.teal }],
  ['I want the cooking kit shell in heat-resistant material', { t: 'DR3D (Nylon/CF) → then PT Dinamika for mould', c: C.orange }],
  ['I want someone to help me design the product from scratch', { t: 'FabLab Bandung (has design help on-site)', c: C.navy }],
  ['I want a near-final injection moulded piece', { t: 'PT Dinamika Polimerindo (Jakarta) — but have design ready', c: C.red }],
].forEach((r, i) => tRow(r, [240, W - 240], i));

// ═══════════════════════════════════════════════
// PAGE 7 — WHATSAPP TEMPLATES (Bahasa Indonesia)
// ═══════════════════════════════════════════════
newPage();
sectionHeader('WHATSAPP MESSAGE TEMPLATES', 'Bahasa Indonesia — ready to send to each maker');

para('Three template types below, each tailored to the maker category. Attach your reference image/sketch when you send. Personalize [NAMA ANDA] with your name.');

doc.moveDown(0.3);

// Template 1
subHeader('TEMPLATE A — For Bag/Case Makers (Eureka, Intama, Bagprovider, Yeye, OSCAS)', C.teal);
const tA = [
  'Halo, selamat siang.',
  '',
  'Perkenalkan, nama saya [NAMA ANDA]. Saya seorang entrepreneur yang sedang berada di Bandung dan sedang mengembangkan dua produk baru yang membutuhkan prototype fisik.',
  '',
  'Produk pertama yang ingin saya buat prototyp-nya adalah sebuah SPICE KIT — semacam tempat penyimpanan bumbu masak dalam format travel kit. Materialnya saya inginkan semi-hard casing (bukan softcase biasa), mirip dengan hardcase koper kecil, namun ukurannya sebesar travel kit toiletries. Di dalamnya bisa ada insert/tray untuk menyimpan botol bumbu kecil.',
  '',
  'Saya hanya butuh 1–2 buah prototype dulu untuk melihat bentuk, ukuran, dan material yang cocok. Desain masih dalam tahap awal (akan saya kirimkan referensi gambar).',
  '',
  'Boleh saya tanya:',
  '1. Apakah Anda bisa membuat prototype/sample sejenis ini dalam jumlah satuan (1–2 pcs)?',
  '2. Berapa estimasi harga untuk pembuatan sample-nya?',
  '3. Berapa lama waktu yang dibutuhkan?',
  '4. Material apa saja yang tersedia untuk casing semi-hard seperti ini (EVA, ABS, Polycarbonate)?',
  '',
  'Saya akan segera kirim referensi gambar dan ukuran kasar setelah menerima respon Anda.',
  '',
  'Terima kasih banyak, ditunggu ya!',
  '[NAMA ANDA]',
];

const boxY1 = doc.y;
doc.rect(50, boxY1, W, tA.length * 13 + 20).fill('#F8FBF8');
doc.rect(50, boxY1, 4, tA.length * 13 + 20).fill(C.teal);
tA.forEach((line, i) => {
  doc.fillColor(C.dark).font('Helvetica').fontSize(8.5)
     .text(line, 62, boxY1 + 10 + i * 13, { width: W - 20 });
});
doc.y = boxY1 + tA.length * 13 + 28;

// Template 2
doc.moveDown(0.2);
subHeader('TEMPLATE B — For 3D Printing Makers (DR3D, Sultan 3D, Evolusi 3D)', C.orange);
const tB = [
  'Halo, selamat siang.',
  '',
  'Perkenalkan, nama saya [NAMA ANDA]. Saya entrepreneur yang sedang di Bandung, sedang develop dua produk consumer goods dan butuh bantuan pembuatan prototype via 3D printing.',
  '',
  'Produk 1 — SPICE KIT CASING: Casing semi-hard ukuran travel kit (~20x12x8 cm estimasi), bisa dicetak dulu untuk cek bentuk. Material: ABS atau PETG cukup untuk awal.',
  '',
  'Produk 2 — COOKING KIT SHELL: Ini yang lebih kritis. Butuh casing yang tahan panas karena produk ini bersentuhan dengan peralatan memasak portable. Material idealnya Nylon, Polycarbonate, atau Carbon Fibre Composite.',
  '',
  'Pertanyaan saya:',
  '1. Apakah Anda memiliki material Nylon / Carbon Fibre Composite untuk cetak 3D?',
  '2. Berapa estimasi harga per piece untuk ukuran kira-kira 20–25 cm?',
  '3. Apakah Anda juga menyediakan jasa desain 3D jika saya hanya punya referensi gambar 2D?',
  '4. Berapa lama waktu pengerjaan untuk 1–2 piece prototype?',
  '',
  'Saya akan kirimkan referensi gambar segera. Terima kasih!',
  '[NAMA ANDA]',
];

const boxY2 = doc.y;
doc.rect(50, boxY2, W, tB.length * 13 + 20).fill('#FFF8F0');
doc.rect(50, boxY2, 4, tB.length * 13 + 20).fill(C.orange);
tB.forEach((line, i) => {
  doc.fillColor(C.dark).font('Helvetica').fontSize(8.5)
     .text(line, 62, boxY2 + 10 + i * 13, { width: W - 20 });
});
doc.y = boxY2 + tB.length * 13 + 28;

// ═══════════════════════════════════════════════
// PAGE 8 — TEMPLATE C + FABLAB + NOTES
// ═══════════════════════════════════════════════
newPage();
subHeader('TEMPLATE C — For Injection Moulding Companies (PT Dinamika, PT Daijo, Presisi)', C.red);
const tC = [
  'Dear Tim PT [NAMA PERUSAHAAN],',
  '',
  'Perkenalkan, saya [NAMA ANDA], entrepreneur yang sedang mengembangkan produk consumer goods.',
  '',
  'Saya sedang mencari mitra untuk pembuatan prototype dan nantinya low-volume production dari sebuah',
  'COOKING KIT SHELL — casing/housing untuk peralatan masak portable yang harus tahan panas.',
  '',
  'Tahap saat ini:',
  '• Desain masih dalam proses finalisasi (referensi gambar akan dikirimkan)',
  '• Butuh 1–2 pcs prototype untuk validasi bentuk dan material',
  '• Setelah prototype disetujui, akan dilanjut ke tahap mould dan produksi',
  '',
  'Pertanyaan:',
  '1. Apakah Anda melayani pembuatan prototype (pre-production) dalam jumlah 1–2 pcs?',
  '2. Jika iya, berapa estimasi biaya untuk prototype injection moulded piece dengan material tahan panas?',
  '3. Apakah Anda juga menerima jasa 3D design jika kami hanya memiliki referensi gambar?',
  '4. Berapa lama timeline dari approval desain hingga prototype selesai?',
  '',
  'Saya berencana mengunjungi Jabodetabek dalam waktu dekat untuk bertemu langsung jika memungkinkan.',
  '',
  'Terima kasih atas perhatiannya.',
  'Hormat saya, [NAMA ANDA]',
];

const boxY3 = doc.y;
doc.rect(50, boxY3, W, tC.length * 13 + 20).fill('#FFF5F5');
doc.rect(50, boxY3, 4, tC.length * 13 + 20).fill(C.red);
tC.forEach((line, i) => {
  doc.fillColor(C.dark).font('Helvetica').fontSize(8.5)
     .text(line, 62, boxY3 + 10 + i * 13, { width: W - 20 });
});
doc.y = boxY3 + tC.length * 13 + 28;

doc.moveDown(0.3);
subHeader('TEMPLATE D — For FabLab Bandung (Walk-In or WhatsApp)', C.navy);
const tD = [
  'Halo FabLab Bandung, selamat siang!',
  '',
  'Saya [NAMA ANDA], entrepreneur yang sedang berada di Bandung. Saya sedang develop dua produk baru:',
  '(1) Spice Kit — casing semi-hard untuk bumbu perjalanan',
  '(2) Cooking Kit Shell — casing tahan panas untuk peralatan masak portable',
  '',
  'Saya ingin konsultasi dan kalau memungkinkan langsung buat rough prototype 3D print-nya di sana.',
  'Apakah memungkinkan untuk datang langsung minggu ini? Dan apakah ada yang bisa bantu untuk konversi',
  'referensi gambar ke file 3D untuk bisa langsung dicetak?',
  '',
  'Terima kasih, ditunggu balasannya!',
  '[NAMA ANDA]',
];

const boxY4 = doc.y;
doc.rect(50, boxY4, W, tD.length * 13 + 20).fill('#EEF2FF');
doc.rect(50, boxY4, 4, tD.length * 13 + 20).fill(C.navy);
tD.forEach((line, i) => {
  doc.fillColor(C.dark).font('Helvetica').fontSize(8.5)
     .text(line, 62, boxY4 + 10 + i * 13, { width: W - 20 });
});
doc.y = boxY4 + tD.length * 13 + 28;

// ═══════════════════════════════════════════════
// PAGE 9 — CONTACT QUICK REF + NOTES
// ═══════════════════════════════════════════════
newPage();
sectionHeader('QUICK CONTACT REFERENCE', 'All makers at a glance — print and carry');

tHead(['#', 'Maker', 'Track', 'WhatsApp / Phone', 'Website / Email'], [20, 145, 50, 130, W - 345]);
[
  ['1',  'Eureka Indonesia',       'T1', '081317098975',         'eureka.id'],
  ['2',  'Intama Bagmaker',        'T1', '0822-4045-8686',       'intamakonveksi.com'],
  ['3',  'Bagprovider',            'T1', 'via website',          'bagprovider.com'],
  ['4',  'Yeye Bags',              'T1', 'via website',          'yeyebags.com'],
  ['5',  'OSCAS',                  'T1', 'via website',          'oscas.co.id'],
  ['6',  'DR3D Indonesia ★',       'T2', '085875333516',         'dr3d.co.id'],
  ['7',  'Sultan 3D Printing',     'T2', 'via website',          'sultan3dprinting.com'],
  ['8',  'Evolusi 3D',             'T2', 'via website',          'evolusi3d.com'],
  ['9',  'PT Dinamika Polimerindo','T3', '(021) 540-0288',       'info@polimerindo.com'],
  ['10', 'PT Daijo Industrial',    'T3', 'via website',          'daijo.co.id'],
  ['11', 'Presisi Group',          'T3', 'via website',          'presisiplastics.co.id'],
  ['12', 'FabLab Bandung ★',       'T4', '+62 895 6060 73321',   'fablabbandung@gmail.com'],
].forEach((r, i) => tRow(r, [20, 145, 50, 130, W - 345], i));

doc.moveDown(0.8);
subHeader('Notes & Follow-Up Tracker');

['Eureka Indonesia', 'Intama Bagmaker', 'Bagprovider', 'DR3D Indonesia', 'Sultan 3D Printing', 'FabLab Bandung', 'PT Dinamika Polimerindo'].forEach(name => {
  const ny = doc.y;
  doc.rect(50, ny, W, 32).stroke();
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(8.5).text(name, 56, ny + 4);
  doc.fillColor(C.muted).font('Helvetica').fontSize(8)
     .text('Date contacted:                    Response:                    Quote received:                    Next step:', 56, ny + 16, { width: W - 12 });
  doc.y = ny + 38;
});

doc.moveDown(0.5);
divider();
doc.fillColor(C.muted).font('Helvetica-Oblique').fontSize(8)
   .text('Prepared June 14, 2026  ·  Dashkit — Prototype Makers Directory  ·  For personal use only. Prices and availability subject to change — verify directly with each maker.', { width: W, align: 'center' });

pageNumbers();
doc.end();

output.on('finish', () => console.log('✅  PDF ready: Dashkit_Prototype_Makers_Bandung.pdf'));
output.on('error', err => console.error('❌', err));
