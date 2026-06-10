const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50, size: 'A4' });
const output = fs.createWriteStream('/home/user/FATFAT-TEST/Bandung_Relocation_Guide.pdf');
doc.pipe(output);

// ─── Colour Palette ───────────────────────────────────────────────────────────
const C = {
  navy:    '#1A2B4A',
  teal:    '#0D7377',
  accent:  '#F4A261',
  light:   '#F0F4F8',
  white:   '#FFFFFF',
  dark:    '#2D2D2D',
  muted:   '#666666',
  green:   '#2E7D32',
  red:     '#C62828',
  border:  '#CCCCCC',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const W = doc.page.width - 100;   // usable width

function newPage() {
  doc.addPage();
}

function coverPage() {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.navy);
  doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill(C.accent);

  doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(11)
     .text('CONFIDENTIAL PLANNING DOCUMENT', 50, 80, { align: 'center', width: W });

  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(36)
     .text('BANDUNG', 50, 130, { align: 'center', width: W });
  doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(28)
     .text('RELOCATION & TRIP GUIDE', 50, 175, { align: 'center', width: W });

  doc.moveTo(150, 220).lineTo(doc.page.width - 150, 220).strokeColor(C.accent).lineWidth(2).stroke();

  doc.fillColor('#BDC8D4').font('Helvetica').fontSize(13)
     .text('Route B · Visa Strategy · Accommodation · Domestic Help', 50, 235, { align: 'center', width: W });

  const boxes = [
    { label: 'Departure', val: 'June 12, 2026' },
    { label: 'Return', val: 'June 18, 2026' },
    { label: 'Travellers', val: '2 Adults' },
    { label: 'Route', val: 'SIN → JKT + Whoosh' },
  ];
  const bw = W / boxes.length - 10;
  boxes.forEach((b, i) => {
    const bx = 50 + i * (bw + 13);
    doc.roundedRect(bx, 290, bw, 65, 6).fill('#243858');
    doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(8)
       .text(b.label.toUpperCase(), bx + 8, 300, { width: bw - 16, align: 'center' });
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(12)
       .text(b.val, bx + 8, 315, { width: bw - 16, align: 'center' });
  });

  const sections = [
    '01  Route B — Full Journey Detail',
    '02  Whoosh High-Speed Train',
    '03  Cost Summary',
    '04  Visa & Immigration Strategy',
    '05  Rental Accommodation Websites',
    '06  Family Accommodation in Bandung',
    '07  Domestic Helper Agencies',
    '08  Admin Priority Checklist',
  ];
  doc.fillColor(C.accent).font('Helvetica-Bold').fontSize(10)
     .text('CONTENTS', 50, 390, { align: 'center', width: W });
  doc.moveTo(200, 405).lineTo(doc.page.width - 200, 405).strokeColor(C.accent).lineWidth(0.5).stroke();

  sections.forEach((s, i) => {
    doc.fillColor('#BDC8D4').font('Helvetica').fontSize(10)
       .text(s, 50, 415 + i * 18, { align: 'center', width: W });
  });

  doc.fillColor('#7A8FA6').font('Helvetica').fontSize(9)
     .text('Prepared June 10, 2026  ·  For personal use only', 50, doc.page.height - 40, { align: 'center', width: W });
}

function sectionHeader(title, subtitle) {
  doc.rect(50, doc.y, W, 38).fill(C.navy);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(15)
     .text(title, 62, doc.y - 30);
  if (subtitle) {
    doc.fillColor('#BDC8D4').font('Helvetica').fontSize(9)
       .text(subtitle, 62, doc.y + 2);
  }
  doc.moveDown(1.2);
}

function subHeader(title) {
  doc.moveDown(0.4);
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(12).text(title);
  doc.moveTo(50, doc.y).lineTo(50 + W, doc.y).strokeColor(C.teal).lineWidth(0.8).stroke();
  doc.moveDown(0.5);
}

function para(text, opts = {}) {
  doc.fillColor(C.dark).font('Helvetica').fontSize(10).text(text, { width: W, ...opts });
  doc.moveDown(0.3);
}

function boldPara(label, value) {
  doc.fillColor(C.dark).font('Helvetica-Bold').fontSize(10).text(label, { continued: true });
  doc.font('Helvetica').text('  ' + value, { width: W });
  doc.moveDown(0.2);
}

function bullet(text, indent = 0) {
  doc.fillColor(C.dark).font('Helvetica').fontSize(10)
     .text('•  ' + text, 50 + indent, doc.y, { width: W - indent });
  doc.moveDown(0.2);
}

function noteBox(text, color = C.accent) {
  const startY = doc.y;
  doc.rect(50, startY, W, 0).stroke(); // measure — we'll draw after
  const linesBefore = doc.y;
  // estimate height
  doc.fillColor(color === C.accent ? '#7A4200' : '#1A3C2A').font('Helvetica').fontSize(9)
     .text('', { width: W - 20 }); // placeholder
  const textHeight = 32;
  doc.rect(50, startY, W, textHeight + 8).fill(color === C.accent ? '#FFF3E0' : '#E8F5E9');
  doc.rect(50, startY, 4, textHeight + 8).fill(color);
  doc.fillColor(color === C.accent ? '#7A4200' : C.green).font('Helvetica-BoldOblique').fontSize(9)
     .text('⚠  ' + text, 62, startY + 8, { width: W - 20 });
  doc.y = startY + textHeight + 16;
  doc.moveDown(0.2);
}

function tableHeader(cols, colWidths) {
  const startX = 50;
  let x = startX;
  const rowH = 20;
  doc.rect(startX, doc.y, W, rowH).fill(C.navy);
  cols.forEach((col, i) => {
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9)
       .text(col, x + 4, doc.y - rowH + 6, { width: colWidths[i] - 8 });
    x += colWidths[i];
  });
  doc.y = doc.y + 4;
  return { startX, rowH };
}

function tableRow(cells, colWidths, rowIndex, extraH = 0) {
  const startX = 50;
  const rowH = 18 + extraH;
  const bg = rowIndex % 2 === 0 ? C.white : C.light;
  doc.rect(startX, doc.y, W, rowH).fill(bg);
  let x = startX;
  cells.forEach((cell, i) => {
    const isColored = typeof cell === 'object';
    const text = isColored ? cell.text : cell;
    const color = isColored ? cell.color : C.dark;
    doc.fillColor(color).font(isColored && cell.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
       .text(text, x + 4, doc.y - rowH + 5, { width: colWidths[i] - 8 });
    x += colWidths[i];
  });
  doc.moveTo(startX, doc.y).lineTo(startX + W, doc.y).strokeColor(C.border).lineWidth(0.3).stroke();
  doc.y = doc.y + 4;
}

function divider() {
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(50 + W, doc.y).strokeColor(C.border).lineWidth(0.5).stroke();
  doc.moveDown(0.5);
}

function pageNum() {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    if (i === 0) continue;
    doc.switchToPage(i);
    doc.fillColor(C.muted).font('Helvetica').fontSize(8)
       .text(`Bandung Relocation Guide 2026  ·  Page ${i}`, 50, doc.page.height - 30, { align: 'center', width: W });
    doc.moveTo(50, doc.page.height - 35).lineTo(50 + W, doc.page.height - 35)
       .strokeColor(C.border).lineWidth(0.3).stroke();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════════════════════
coverPage();

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — ROUTE B FLIGHT DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('01  ROUTE B — FULL JOURNEY DETAIL', 'Singapore → Jakarta → Whoosh Train → Bandung');

subHeader('Journey Overview');
para('Route B takes you from Singapore Changi (SIN) to Jakarta, then onto the Whoosh high-speed train from Halim station to Bandung. The key decision is which Jakarta airport you fly into — Halim (HLP) saves you the transfer time.');

// Journey flow box
const flowY = doc.y;
doc.rect(50, flowY, W, 90).fill(C.light);
doc.rect(50, flowY, 3, 90).fill(C.teal);
const steps = [
  { icon: '✈', label: 'Singapore Changi (SIN)', time: 'Depart ~06:00–09:00' },
  { icon: '↓', label: '~2 hour flight', time: '' },
  { icon: '🛬', label: 'Jakarta Halim (HLP) or Soekarno-Hatta (CGK)', time: 'Arrive ~08:00–11:00' },
  { icon: '↓', label: 'Walk (HLP) or 1.5h Grab (CGK) to Halim Whoosh Station', time: '' },
  { icon: '🚄', label: 'Whoosh Train — Halim → Padalarang', time: '46 minutes' },
  { icon: '↓', label: 'KA Feeder Train — Padalarang → Bandung Station', time: '25 minutes · IDR 5,000/person' },
  { icon: '📍', label: 'Central Bandung', time: 'Arrive ~Early afternoon' },
];
let sy = flowY + 8;
steps.forEach(s => {
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(9).text(s.icon + '  ' + s.label, 62, sy, { width: W - 80 });
  if (s.time) doc.fillColor(C.muted).font('Helvetica').fontSize(8).text(s.time, 62 + W - 150, sy, { width: 130, align: 'right' });
  sy += 12;
});
doc.y = flowY + 98;
doc.moveDown(0.8);

subHeader('Outbound Flights — June 12, 2026 (Morning)');
tableHeader(['Airline', 'Route', 'Est. Price/Person', 'Notes'], [100, 130, 110, W - 340]);
[
  [{ text: 'AirAsia', bold: true }, 'SIN → CGK', { text: 'SGD 86–172', color: C.green }, 'Budget, multiple morning slots'],
  [{ text: 'Scoot', bold: true }, 'SIN → CGK', { text: 'SGD 126–185', color: C.green }, 'Budget, reliable schedule'],
  [{ text: 'Citilink', bold: true, color: C.teal }, 'SIN → HLP ★', { text: 'SGD 100–160', color: C.green }, 'BEST — flies direct to Halim'],
  [{ text: 'Batik Air', bold: true }, 'SIN → CGK', { text: 'SGD 98–270', color: C.muted }, '11:25 (ID7154), 14:45 (ID7156)'],
  [{ text: 'Singapore Air', bold: true }, 'SIN → CGK', { text: 'SGD 169–245', color: C.muted }, 'Full service, not budget'],
].forEach((row, i) => tableRow(row, [100, 130, 110, W - 340], i));

doc.moveDown(0.6);
noteBox('★ Citilink SIN→HLP puts you right next to the Whoosh station — no Grab transfer needed. Book this if available on June 12.');

subHeader('Return Flights — June 18, 2026 (Recommended over June 19)');
tableHeader(['Date', 'Day', 'Why', 'Est. Price (per person)'], [80, 80, 220, W - 380]);
[
  [{ text: 'June 18', bold: true }, { text: 'Thursday', bold: true }, 'Weekday — lower demand, no weekend premium', { text: 'SGD 99–172', color: C.green, bold: true }],
  ['June 19', 'Friday', 'Higher demand — weekend travel surge', { text: 'SGD 130–210', color: C.red }],
].forEach((row, i) => tableRow(row, [80, 80, 220, W - 380], i));

doc.moveDown(0.6);
para('Book Return Flights Here:');
bullet('Google Flights (compare all airlines): google.com/travel/flights');
bullet('Skyscanner pre-filled (JKT→SIN, June 18, 2 adults): skyscanner.com.sg/transport/flights/jkt/sin/260618/?adults=2');
bullet('AirAsia direct: airasia.com/flights/from-jakarta-cgk-to-singapore-sin/');
bullet('Scoot direct: flyscoot.com/flights/en/flights-from-jakarta-to-singapore');
bullet('KAYAK HLP→SIN: kayak.sg/flight-routes/Jakarta-Halim-Perdana-Kusuma-HLP/Singapore-Changi-SIN');

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — WHOOSH TRAIN + COST SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('02  WHOOSH HIGH-SPEED TRAIN', 'Jakarta Halim → Bandung Padalarang · 46 Minutes');

subHeader('Key Train Facts');
const trainFacts = [
  ['Route', 'Halim (Jakarta) → Padalarang → Tegalluar (Bandung)'],
  ['Best Alighting Station', 'Padalarang — then take KA Feeder to Bandung Station (city centre)'],
  ['Journey Time', '46 minutes (Halim → Padalarang)'],
  ['Frequency', 'Every 30 minutes, daily'],
  ['Operating Hours', 'Early morning to late evening (check schedule on booking day)'],
  ['KA Feeder Connection', 'Padalarang → Bandung Station: ~25 min · IDR 5,000/person (SGD 0.35)'],
];
tableHeader(['Detail', 'Information'], [150, W - 150]);
trainFacts.forEach((row, i) => tableRow([{ text: row[0], bold: true }, row[1]], [150, W - 150], i));

doc.moveDown(0.8);
subHeader('Ticket Prices (per person, one-way)');
tableHeader(['Class', 'IDR (Rupiah)', 'SGD Equivalent', 'Recommendation'], [100, 120, 110, W - 330]);
[
  [{ text: 'Premium Economy', bold: true }, 'IDR 150,000–250,000', { text: 'SGD 11–18', color: C.green, bold: true }, { text: 'BEST VALUE ✓', color: C.green }],
  ['Business', 'IDR 300,000–400,000', 'SGD 21–28', 'Comfortable, wider seats'],
  ['VIP', 'Up to IDR 600,000', 'SGD 43', 'Unnecessary for short trip'],
].forEach((row, i) => tableRow(row, [100, 120, 110, W - 330], i));

doc.moveDown(0.8);
subHeader('For 2 Adults — Both Directions');
tableHeader(['Leg', 'Class', 'Per Person', '2 Adults Total'], [160, 100, 100, W - 360]);
[
  ['SIN → Bandung (Outbound)', 'Premium Economy', 'SGD 11–18', { text: 'SGD 22–36', color: C.green, bold: true }],
  ['Bandung → SIN (Return)', 'Premium Economy', 'SGD 11–18', { text: 'SGD 22–36', color: C.green, bold: true }],
  [{ text: 'TOTAL WHOOSH (both ways)', bold: true }, '—', '—', { text: 'SGD 44–72', color: C.teal, bold: true }],
].forEach((row, i) => tableRow(row, [160, 100, 100, W - 360], i));

doc.moveDown(0.8);
subHeader('How to Book Whoosh Tickets');
bullet('tiket.com (easiest online): en.tiket.com/kereta-api/kcic');
bullet('Traveloka: traveloka.com/en-sg/kereta-api/whoosh');
bullet('KCIC Official App: search "KCIC Access" on App Store / Google Play');
bullet('Book 3–5 days ahead for best seat selection');
bullet('Pay via credit card, GoPay, OVO, DANA, or bank transfer');
noteBox('Book Whoosh BEFORE you travel — seats fill fast on mornings and weekends. June 12 is a Friday, book early.', C.accent);

// ─── COST SUMMARY
sectionHeader('03  TOTAL TRIP COST SUMMARY (2 Adults)', 'June 12 Outbound · June 18 Return · Economy Class');

subHeader('All-In Cost Estimate');
tableHeader(['Item', 'Details', 'Est. SGD (Low)', 'Est. SGD (High)'], [190, 150, 90, W - 430]);
[
  ['Outbound flights × 2', 'SIN → CGK/HLP, June 12 AM', 'SGD 172', 'SGD 344'],
  ['Return flights × 2', 'JKT → SIN, June 18', 'SGD 198', 'SGD 344'],
  ['Whoosh train × 2 persons × 2 ways', 'Premium Economy', 'SGD 44', 'SGD 72'],
  ['CGK → Halim Grab (if not flying HLP)', 'Both directions, 2 pax', 'SGD 0', 'SGD 56'],
  [{ text: 'FLIGHTS + TRAIN TOTAL', bold: true }, '—', { text: 'SGD 414', bold: true, color: C.teal }, { text: 'SGD 816', bold: true, color: C.red }],
].forEach((row, i) => tableRow(row, [190, 150, 90, W - 430], i));

doc.moveDown(0.6);
para('Note: Exchange rate used — 1 SGD ≈ IDR 14,079 (June 2026). Actual prices vary; always compare on Google Flights or Skyscanner before booking.');

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — VISA STRATEGY
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('04  VISA & IMMIGRATION STRATEGY', 'Singapore Citizens (You + Kids) · German Passport (Henrik)');

subHeader('Your Household Visa Profile');
tableHeader(['Person', 'Passport', 'Status', 'Visa Category'], [100, 100, 130, W - 330]);
[
  ['You', 'Singapore', 'Citizen', 'ASEAN Visa-Free / VOA'],
  ['Children', 'Singapore', 'Citizen', 'ASEAN Visa-Free / VOA'],
  ['Henrik', 'German', 'SG PR (irrelevant in Indonesia)', 'VOA / B211A'],
].forEach((row, i) => tableRow(row, [100, 100, 130, W - 330], i));

doc.moveDown(0.8);
subHeader('Phase 1 — Arrival (First 60 Days)  ·  Most Practical');
tableHeader(['Visa Type', 'Duration', 'Cost/Person', 'Notes'], [130, 100, 100, W - 330]);
[
  [{ text: 'Visa on Arrival (VOA)', bold: true }, '30 days (+ 30 ext.)', 'IDR 500,000 (SGD 43)', 'Extendable once = 60 days total'],
  ['VOA Extension', '+30 days', 'IDR 350,000 (~SGD 25)', 'Apply at Kantor Imigrasi before Day 30'],
  ['ASEAN Visa-Free (SG only)', '30 days', 'FREE', 'NOT extendable — must exit Indonesia'],
].forEach((row, i) => tableRow(row, [130, 100, 100, W - 330], i));

doc.moveDown(0.4);
bullet('Apply for VOA on arrival at airport OR online before flying: molina.imigrasi.go.id');
bullet('Total for family of 4 (assume 2 adults + 2 kids) entering on VOA + extension: ~SGD 272');

doc.moveDown(0.6);
subHeader('Phase 2 — 60 to 180 Days  ·  B211A Social/Cultural Visa');
para('Apply at the Indonesian Embassy in Singapore BEFORE you leave. This is the most cost-effective medium-term option.');
tableHeader(['Item', 'Details'], [200, W - 200]);
[
  ['Duration', '60 days, extendable 2 more times = up to 180 days total'],
  ['Cost', '~IDR 1,500,000 (~SGD 107) + embassy processing fee'],
  ['Where to Apply', 'Indonesian Embassy Singapore — kemlu.go.id/singapore/en'],
  ['Requirements', 'Valid passport, photo, proof of funds, itinerary'],
  ['Processing Time', '3–5 working days at embassy'],
].forEach((row, i) => tableRow([{ text: row[0], bold: true }, row[1]], [200, W - 200], i));

doc.moveDown(0.6);
subHeader('Phase 3 — Visa Runs (Every 60 Days as Needed)');
para('If staying beyond 60 days without a B211A, you must exit Indonesia and re-enter. As Singapore citizens, you and the kids can easily fly back to Singapore for 1–2 nights and return.');
tableHeader(['Visa Run Option', 'Cost (approx.)', 'Duration', 'Notes'], [160, 100, 80, W - 340]);
[
  ['Bandung → Singapore (roundtrip)', 'SGD 150–300', '1–2 nights', 'Cheapest — can see family too'],
  ['Bandung → KL / Penang (roundtrip)', 'SGD 100–200', '1 night', 'Budget option'],
  ['Bandung → Kuching / Kota Kinabalu', 'SGD 80–150', '1 night', 'Malaysia, very cheap air'],
].forEach((row, i) => tableRow(row, [160, 100, 80, W - 340], i));

doc.moveDown(0.8);
subHeader('Long-Term Visa Options (Future — When Dashkit Earns)');
tableHeader(['Visa Type', 'Duration', 'Income Required', 'Suitable?'], [140, 90, 150, W - 380]);
[
  ['B211A rolling (repeat)', '180 days/cycle', 'None', { text: 'YES — best now', color: C.green }],
  ['E33G Digital Nomad KITAS', '1 year', 'USD 60,000/yr from foreign employer', { text: 'NOT YET — need employer', color: C.red }],
  ['PT PMA Investor KITAS', '2–8 years', 'IDR 10B share capital', { text: 'FUTURE — when funded', color: C.muted }],
  ['Spouse/Dependent KITAS', '1 year (renewable)', 'Via anchor KITAS holder', { text: 'YES — once one has KITAS', color: C.green }],
  ['Second Home Visa', '5–10 years', 'USD 130,000 bank deposit', { text: 'NOT NOW — too expensive', color: C.red }],
].forEach((row, i) => tableRow(row, [140, 90, 150, W - 380], i));

doc.moveDown(0.5);
noteBox("IMPORTANT — Henrik's Singapore PR Re-Entry Permit (REP): Check the REP expiry date BEFORE leaving Singapore. Extended overseas stays risk PR status if REP lapses. Renew at ICA Singapore (ica.gov.sg) if needed BEFORE departure.", C.red);
noteBox("Singapore Citizen children's passports: Verify all passports have at least 6 months validity from travel date.");

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — RENTAL WEBSITES
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('05  RENTAL ACCOMMODATION WEBSITES', 'Short-Term, Monthly & Family-Friendly · Central Bandung');

subHeader('International Booking Platforms (Tourist Visa Friendly)');
para('All platforms below accept tourist/visitor visa holders. Indonesian law does not restrict renting accommodation based on visa type for stays booked on these platforms.');

tableHeader(['Platform', 'Best For', 'URL', 'Price Range'], [100, 150, 170, W - 420]);
[
  [{ text: 'Airbnb Monthly', bold: true }, 'Flexible, no contract, fully furnished', 'airbnb.com/bandung-indonesia/stays/monthly', 'SGD 35–100/night'],
  [{ text: 'Airbnb Family', bold: true }, 'Family-filtered listings with kids amenities', 'airbnb.com/bandung-city-indonesia/stays/family-friendly', 'SGD 30–120/night'],
  [{ text: 'Vrbo', bold: true }, 'Whole house rentals, family-focused', 'vrbo.com/vacation-rentals/republic-of-indonesia/west-java/bandung', 'SGD 40–150/night'],
].forEach((row, i) => tableRow(row, [100, 150, 170, W - 420], i));

doc.moveDown(0.8);
subHeader('Local Indonesian Platforms (Cheaper, Direct Landlord)');
para('These give you 30–50% lower prices than international platforms. Landlords typically ask for a 1–3 month deposit but are flexible with tourist visa holders.');

tableHeader(['Platform', 'Type', 'URL', 'Best For'], [100, 100, 170, W - 370]);
[
  [{ text: 'Travelio', bold: true }, 'Serviced Apts', 'travelio.com/en/bandung', 'Furnished apts, Braga/Dago area'],
  [{ text: 'Mamikos', bold: true }, 'Kost / Houses', 'mamikos.com', 'Cheapest monthly rooms + houses'],
  [{ text: 'Flokq', bold: true }, 'Co-living', 'flokq.com/id/bandung', 'Expat-friendly, utilities included'],
  [{ text: 'Rumah123', bold: true }, 'House Rentals', 'rumah123.com/en/sale/bandung', 'Direct owner listings, negotiable'],
  [{ text: 'Lamudi', bold: true }, 'House / Apt', 'lamudi.co.id/bandung', 'Wide range, incl. Dago villas'],
  [{ text: 'Iproperty', bold: true }, 'House / Apt', 'iproperty.co.id/sewa/bandung', 'Long-term, good for 3–6 months'],
  [{ text: 'Sewa Apartemen', bold: true }, 'Apartments', 'sewa-apartemen.net/bandung', 'Direct from apartment owners'],
  [{ text: 'OLX Properti', bold: true }, 'All Types', 'olx.co.id → Properti → Bandung', 'Cheapest, direct landlord deals'],
].forEach((row, i) => tableRow(row, [100, 100, 170, W - 370], i));

doc.moveDown(0.8);
subHeader('Recommended Search Areas in Bandung for Families');
tableHeader(['Neighbourhood', 'Why Good for Family', 'Avg Monthly Rent (3BR)', 'Grab/Gojek'], [130, 180, 130, W - 440]);
[
  [{ text: 'Dago / Ciumbuleuit', bold: true }, 'Cooler climate, spacious, quiet, good schools nearby', 'IDR 6–12M (SGD 426–852)', '✓ Easy access'],
  [{ text: 'Cipaganti', bold: true }, 'Central, walkable, great restaurants', 'IDR 5–10M (SGD 355–710)', '✓ Excellent'],
  [{ text: 'Braga / Sumur Bandung', bold: true }, 'Most central, cultural, vibrant', 'IDR 7–15M (SGD 497–1,065)', '✓ Best coverage'],
  [{ text: 'Setiabudi / Buah Batu', bold: true }, 'Modern, clean, malls nearby', 'IDR 5–9M (SGD 355–639)', '✓ Good'],
  [{ text: 'Pasteur', bold: true }, 'Near Whoosh feeder route, convenient', 'IDR 4–8M (SGD 284–568)', '✓ Good'],
].forEach((row, i) => tableRow(row, [130, 180, 130, W - 440], i));

doc.moveDown(0.5);
noteBox('For your first 1–2 months: Book via Airbnb Monthly (Dago or Cipaganti) for flexibility. Then move to Mamikos or direct landlord for 30–40% savings once you know which area suits the children.');

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 6 — FAMILY ACCOMMODATION PICKS
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('06  FAMILY ACCOMMODATION IN BANDUNG', 'Budget · Child-Friendly · Tourist Visa Accepted');

subHeader('Recommended Budget Hotels (Short Stay / While House-Hunting)');
tableHeader(['Property', 'Location', 'Est. Price/Night', 'Why Good'], [130, 90, 90, W - 310]);
[
  [{ text: 'favehotel Braga', bold: true }, 'Braga Street', { text: 'SGD 28–48', color: C.green }, 'Central, clean, connected to Braga City Walk mall'],
  [{ text: 'éL Hotel Bandung', bold: true }, 'Steps from Braga', 'SGD 50–80', 'City centre, good reviews, kid-friendly'],
  [{ text: 'Ibis Bandung Trans Studio', bold: true }, 'Pasteur area', 'SGD 35–60', 'International chain standard, family rooms available'],
  [{ text: 'Pop! Hotel Citywalk', bold: true }, 'Braga', 'SGD 25–45', 'Budget chain, very central, reliable'],
  [{ text: 'Grand Mercure Bandung', bold: true }, 'City Centre', 'SGD 60–90', 'Mid-range, good if with kids, pool'],
].forEach((row, i) => tableRow(row, [130, 90, 90, W - 310], i));

doc.moveDown(0.8);
subHeader('Recommended Serviced Apartments (For Monthly Stays with Children)');
tableHeader(['Property', 'Beds', 'Est. Monthly', 'Platform'], [170, 60, 120, W - 350]);
[
  [{ text: 'Braga City Walk Apt by Travelio', bold: true }, '1–3BR', 'SGD 700–1,400/mo', 'travelio.com / Agoda'],
  [{ text: 'Parahyangan Residences (Aya Stays)', bold: true }, '2BR', 'SGD 600–1,000/mo', 'Airbnb / Booking.com'],
  [{ text: 'Nirasa by Kozystay – Paskal', bold: true }, '3BR', 'SGD 800–1,200/mo', 'Airbnb / Booking.com'],
  [{ text: 'Beverly Dago Apartment', bold: true }, '2–3BR', 'SGD 500–900/mo', 'Agoda / Traveloka'],
  [{ text: 'Tamansari La Grande Apartment', bold: true }, '2BR', 'SGD 550–950/mo', 'Expedia / Agoda'],
].forEach((row, i) => tableRow(row, [170, 60, 120, W - 350], i));

doc.moveDown(0.6);
para('Monthly rates are estimates based on nightly rates with Airbnb/Travelio monthly discounts (usually 20–40% off nightly). Always negotiate directly with the landlord via Travelio or OLX for the best rate after month 2.');

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 7 — DOMESTIC HELPER AGENCIES
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('07  DOMESTIC HELPER AGENCIES IN INDONESIA', 'Legitimate · Verifiable · Serving Bandung');

subHeader('What to Expect — Indonesian Domestic Help');
para('Hiring a local pembantu (domestic helper / ART — Asisten Rumah Tangga) in Bandung is very common, affordable, and accessible. Unlike Singapore/Malaysia, there is no complex government quota or work permit system for local domestic workers. Key difference: these are Indonesian nationals hired for work within Indonesia.');
bullet('Live-in helper: IDR 1,500,000–3,500,000/month (SGD 107–249) — a fraction of Singapore rates');
bullet('Live-out (part-time): IDR 500,000–1,500,000/month (SGD 35–107)');
bullet('Nanny/babysitter (live-in): IDR 2,000,000–4,000,000/month (SGD 142–284)');

doc.moveDown(0.6);
subHeader('Verified Agencies — Serving Bandung');

tableHeader(['Agency', 'Type', 'Contact / Website', 'Verify Via'], [110, 80, 180, W - 370]);
[
  [{ text: 'GoMaid Agency', bold: true }, 'Full service', 'gomaid-agency.com · WA: 0812-1211-6633', 'Ask for NIB on AHU.go.id'],
  [{ text: 'Ayasan Indonesia', bold: true }, 'ART specialist', 'ayasan-indonesia.com', 'Ask for Disnaker reg. no.'],
  [{ text: 'Seekmi', bold: true }, 'App-based mktpl', 'seekmi.com (app + web)', 'All workers background-checked'],
  [{ text: 'Gamelite', bold: true }, 'Service platform', 'gamelite.co.id', 'Reviews visible on platform'],
  [{ text: 'YukBeres', bold: true }, 'Cleaning / nanny', 'yukberes.com', 'Bandung-specific, app-based'],
  [{ text: 'Helpling Indonesia', bold: true }, 'Cleaning / maid', 'helpling.co.id', 'International-standard platform'],
].forEach((row, i) => tableRow(row, [110, 80, 180, W - 370], i));

doc.moveDown(0.8);
subHeader('Anti-Scam Checklist — What to Always Demand');
para('Given your recent experience with a fraudulent agency in Malaysia, here is the mandatory checklist before engaging ANY agency or helper:');

const scamChecks = [
  ['✅  NIB / SIUP', 'Ask for the agency\'s Nomor Induk Berusaha (NIB) and verify it at oss.go.id. This is Indonesia\'s official business registry.'],
  ['✅  Helper\'s KTP', 'Request a photocopy of the helper\'s KTP (Kartu Tanda Penduduk — National ID). Legitimate agencies provide this before any payment.'],
  ['✅  Formal contract', 'Demand a written contract on company letterhead with both parties\' names, scope of work, salary, and start date.'],
  ['✅  Bank account payment ONLY', 'Pay to the agency\'s official registered bank account. NEVER to a personal account or via informal transfer. Ask for official receipt.'],
  ['✅  No upfront full payment', 'Legitimate agencies take a deposit (typically 1 month fee) — not the full placement fee upfront. Walk away if they demand everything in advance.'],
  ['✅  Trial period', 'Insist on a 1–2 week trial period. Legitimate agencies support this.'],
  ['✅  Disnaker registration', 'For live-in helpers, the agency should be registered with Dinas Tenaga Kerja (local labor office). Ask for their registration number.'],
];
tableHeader(['Check', 'What to Look For'], [100, W - 100]);
scamChecks.forEach((row, i) => tableRow(row, [100, W - 100], i, 6));

doc.moveDown(0.6);
subHeader('Recommended Search — Local Bandung Communities');
bullet('Facebook Group: search "ART Bandung" or "Pembantu Bandung" — local direct referrals');
bullet('Facebook Group: "Expat in Bandung" — get recommendations from other foreign families');
bullet('Ask at your RT/RW (neighbourhood admin) once you have an address — they often know trusted helpers locally');

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 8 — ADMIN PRIORITY CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════
newPage();
sectionHeader('08  ADMIN PRIORITY CHECKLIST', 'Actions Before, During & After Departure');

subHeader('🔴 Urgent — Do This Week (Before Any Decisions)');
const urgent = [
  ['Check Henrik\'s Singapore PR Re-Entry Permit (REP)', 'ICA Singapore — ica.gov.sg. Must be valid for your planned overseas duration. Renew BEFORE leaving Singapore.'],
  ['Check all passport expiry dates', 'All passports must be valid for at least 6 months beyond your travel date. Renew at ICA/German Embassy if needed.'],
  ['List car on Carro for instant valuation', 'carro.co — takes 10 mins. Get a cash offer as a baseline, then compare against private sale on sgcarmart.com.'],
  ['Cross-check car loan outstanding', 'Contact your bank about early settlement fees. Confirm net proceeds after loan payoff.'],
];
tableHeader(['Action', 'How / Where'], [160, W - 160]);
urgent.forEach((row, i) => tableRow([{ text: row[0], bold: true, color: C.red }, row[1]], [160, W - 160], i, 8));

doc.moveDown(0.8);
subHeader('🟡 Before Departure — Book & Prepare');
const beforeDep = [
  ['Book outbound flight (June 12 morning)', 'Google Flights or Skyscanner — look for Citilink SIN→HLP or AirAsia SIN→CGK. Aim to book this week.'],
  ['Book return flight (June 18)', 'Skyscanner: skyscanner.com.sg/transport/flights/jkt/sin/260618/?adults=2'],
  ['Book Whoosh train tickets', 'tiket.com or Traveloka — book 3–5 days before travel. Both ways if possible.'],
  ['Apply for B211A visas at Indonesian Embassy SG', 'For whole family — before departure. kemlu.go.id/singapore/en'],
  ['Book first 1–2 months accommodation in Bandung', 'Airbnb Monthly (Dago/Cipaganti area) — flexible, no contract, tourist visa fine.'],
  ['Contact GoMaid or Seekmi for Bandung helper', 'WhatsApp GoMaid: 0812-1211-6633 or download Seekmi app. Request Bandung-based candidates.'],
  ['Notify landlord / tenants of your plans', 'If you have rental income property — ensure rent collection is arranged during your absence.'],
  ['Set up a Singapore bank account with overseas access', 'DBS/OCBC with PayLah/PayNow for easy SGD transfers to Indonesian accounts via Wise.'],
];
tableHeader(['Action', 'Details'], [180, W - 180]);
beforeDep.forEach((row, i) => tableRow([{ text: row[0], bold: true }, row[1]], [180, W - 180], i, 8));

doc.moveDown(0.8);
subHeader('🟢 On Arrival in Bandung');
const onArrival = [
  ['Get Indonesian SIM card', 'Buy Telkomsel, Indosat, or XL at the airport. ~IDR 50,000–100,000 with data (SGD 3.55–7.10).'],
  ['Download Gojek + Grab apps', 'Essential for daily transport and food delivery in Bandung. Set up with Indonesian number.'],
  ['Download GoFood / ShopeeFood', 'Food delivery apps — far cheaper than restaurants for daily meals with kids.'],
  ['Register with RT/RW (neighbourhood admin)', 'Your landlord/host will guide you. Required for extended stays, needed for visa extension.'],
  ['Locate nearest Kantor Imigrasi', 'For VOA extension before Day 30. Bandung immigration: Jl. P.H. Hasan Mustafa No. 38, Bandung.'],
  ['Open GoPay or OVO digital wallet', 'Via Gojek/Shopee app. Used for most everyday payments, far easier than cash.'],
];
tableHeader(['Action', 'Details'], [180, W - 180]);
onArrival.forEach((row, i) => tableRow([{ text: row[0], bold: true }, row[1]], [180, W - 180], i, 8));

doc.moveDown(0.8);
subHeader('Car Selling — Recommended Platforms (Singapore)');
tableHeader(['Platform', 'Best For', 'URL', 'Speed'], [130, 160, 130, W - 420]);
[
  [{ text: 'Carro', bold: true }, 'Instant cash offer in hours', 'carro.co', { text: 'Fastest', color: C.green }],
  [{ text: 'Motorist.sg', bold: true }, 'Consignment + quick sale', 'motorist.sg', 'Fast'],
  [{ text: 'SGCarMart', bold: true }, 'Private listing, max price', 'sgcarmart.com', 'Slower (1–3 weeks)'],
  [{ text: 'OneShift', bold: true }, 'Multiple dealer bids', 'oneshift.com', 'Fast (3–5 days)'],
].forEach((row, i) => tableRow(row, [130, 160, 130, W - 420], i));

doc.moveDown(0.6);
para('Strategy: Get an instant valuation from Carro and OneShift today for a floor price. Then list privately on SGCarMart — if a buyer matches within 1–2 weeks, take it. If not, accept the dealer offer. Minimises loss without a long wait.');

// ─── Footer note
doc.moveDown(1);
divider();
doc.fillColor(C.muted).font('Helvetica-Oblique').fontSize(8)
   .text('This document was prepared on June 10, 2026 based on publicly available information. Prices, visa regulations, and availability are subject to change. Always verify directly with airlines, immigration authorities, and booking platforms before making payments.', { width: W, align: 'center' });

// ─── Page numbers
pageNum();

doc.end();

output.on('finish', () => {
  console.log('✅  PDF generated: Bandung_Relocation_Guide.pdf');
});
output.on('error', (err) => {
  console.error('❌  Error:', err);
});
