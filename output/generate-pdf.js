const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 45, size: 'A4', bufferPages: true });
const outputPath = path.join(__dirname, 'attrage-sale-guide.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// ─── COLORS ───────────────────────────────────────────────────────────────
const NAVY    = '#1a237e';
const GREEN   = '#2e7d32';
const ORANGE  = '#e65100';
const RED     = '#c62828';
const LGREY   = '#f5f5f5';
const DGREY   = '#555555';
const WHITE   = '#ffffff';
const TEAL    = '#075e54';
const WAGREEN = '#25d366';

// ─── HELPERS ──────────────────────────────────────────────────────────────
function pageW() { return doc.page.width - doc.page.margins.left - doc.page.margins.right; }

function sectionHeader(title, color = NAVY) {
  doc.addPage();
  doc.rect(0, 0, doc.page.width, 44).fill(color);
  doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(14)
     .text(title, doc.page.margins.left, 14, { width: pageW() });
  doc.fillColor('#1a1a1a');
  doc.y = 58;
}

function heading(text, size = 12, color = NAVY) {
  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(size).fillColor(color).text(text);
  doc.fillColor('#1a1a1a');
}

function body(text, size = 10) {
  doc.font('Helvetica').fontSize(size).fillColor('#222').text(text, { lineGap: 2 });
}

function bullet(text, size = 10) {
  doc.font('Helvetica').fontSize(size).fillColor('#222')
     .text(`• ${text}`, { indent: 10, lineGap: 2 });
}

function alertBox(text, bgColor = '#fff3e0', borderColor = ORANGE) {
  const bw = pageW();
  const startY = doc.y + 4;
  // measure text height
  const h = doc.heightOfString(text, { width: bw - 28, fontSize: 9.5 }) + 16;
  doc.rect(doc.page.margins.left, startY, 4, h).fill(borderColor);
  doc.rect(doc.page.margins.left + 4, startY, bw - 4, h).fill(bgColor);
  doc.fillColor('#333').font('Helvetica').fontSize(9.5)
     .text(text, doc.page.margins.left + 14, startY + 8, { width: bw - 28, lineGap: 2 });
  doc.fillColor('#1a1a1a');
  doc.y = startY + h + 6;
}

function table(headers, rows, colWidths) {
  const x = doc.page.margins.left;
  const total = colWidths.reduce((a, b) => a + b, 0);
  const rowH = 18;
  // header row
  let cx = x;
  doc.rect(x, doc.y, total, rowH).fill(NAVY);
  headers.forEach((h, i) => {
    doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(8.5)
       .text(h, cx + 4, doc.y - rowH + 5, { width: colWidths[i] - 8, lineBreak: false });
    cx += colWidths[i];
  });
  doc.y += 2;
  // data rows
  rows.forEach((row, ri) => {
    const rowY = doc.y;
    // measure max height in this row
    let maxH = rowH;
    row.forEach((cell, ci) => {
      const cellH = doc.heightOfString(String(cell), { width: colWidths[ci] - 8, fontSize: 8.5 }) + 8;
      if (cellH > maxH) maxH = cellH;
    });
    if (rowY + maxH > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      doc.y = doc.page.margins.top;
    }
    const bg = ri % 2 === 0 ? WHITE : '#f0f4ff';
    doc.rect(doc.page.margins.left, doc.y, total, maxH).fill(bg);
    cx = x;
    row.forEach((cell, ci) => {
      doc.fillColor('#222').font('Helvetica').fontSize(8.5)
         .text(String(cell), cx + 4, doc.y + 4, { width: colWidths[ci] - 8, lineBreak: true });
      cx += colWidths[ci];
    });
    doc.y += maxH;
  });
  doc.rect(x, doc.y - rows.length * rowH - rowH, total, rows.length * rowH + rowH).stroke('#cccccc');
  doc.y += 8;
}

function contactBox(name, sub, number, isHighlight = false) {
  const bw = pageW();
  const startY = doc.y + 3;
  const lines = [`${name}`, sub, `📞 ${number}`];
  const h = 54;
  const bg = isHighlight ? '#e8f5e9' : '#f0f4ff';
  const border = isHighlight ? GREEN : NAVY;
  doc.rect(doc.page.margins.left, startY, bw, h).fill(bg).stroke(border);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(border)
     .text(name, doc.page.margins.left + 10, startY + 8, { width: bw - 20, lineBreak: false });
  doc.font('Helvetica').fontSize(8.5).fillColor(DGREY)
     .text(sub, doc.page.margins.left + 10, startY + 22, { width: bw - 20, lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(WAGREEN)
     .text(`WhatsApp: ${number}`, doc.page.margins.left + 10, startY + 35, { width: bw - 20, lineBreak: false });
  doc.fillColor('#1a1a1a');
  doc.y = startY + h + 4;
}

function financialRow(label, value, highlight = false) {
  const bw = pageW();
  const h = 20;
  const bg = highlight ? NAVY : '#e8eaf6';
  const fg = highlight ? WHITE : '#1a1a1a';
  doc.rect(doc.page.margins.left, doc.y, bw, h).fill(bg);
  doc.font(highlight ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor(fg)
     .text(label, doc.page.margins.left + 8, doc.y + 5, { width: bw * 0.65, lineBreak: false });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(highlight ? '#ffcc02' : NAVY)
     .text(value, doc.page.margins.left + bw * 0.65, doc.y - 15, { width: bw * 0.35 - 8, align: 'right', lineBreak: false });
  doc.y += h + 1;
}

// ══════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ══════════════════════════════════════════════════════════════════════════
doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(28)
   .text('MITSUBISHI ATTRAGE 1.2 CVT', 45, 130, { width: pageW(), align: 'center' });
doc.font('Helvetica').fontSize(16).fillColor('#90caf9')
   .text('Complete Car Sale Guide — Singapore', { align: 'center' });
doc.moveDown(2);

// badges
const badges = ['Normal Plate ✓', 'COE till Oct 2030', 'Target $44,000–$48,000', 'June 2026'];
badges.forEach((b, i) => {
  doc.rect(doc.page.width / 2 - 120 + i * 0, 300 + i * 30, 240, 24).fill('#ffffff22');
  doc.font('Helvetica-Bold').fontSize(11).fillColor(WHITE)
     .text(b, doc.page.width / 2 - 120, 306 + i * 30, { width: 240, align: 'center' });
});

doc.font('Helvetica').fontSize(10).fillColor('#ffffff66')
   .text('Prepared for private use only · Do not distribute', 45, 450, { width: pageW(), align: 'center' });

// urgency box on cover
doc.rect(45, 490, pageW(), 70).fill('#b71c1c');
doc.font('Helvetica-Bold').fontSize(12).fillColor(WHITE)
   .text('⚠  URGENT SITUATION', 55, 500, { width: pageW() - 20 });
doc.font('Helvetica').fontSize(10).fillColor('#ffcdd2')
   .text('Outstanding Genie loan: $66,000 · Car value: $38,000–$48,000 · Husband unemployed · Act immediately', 55, 518, { width: pageW() - 20, lineGap: 2 });

// ══════════════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ══════════════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, doc.page.width, 44).fill(NAVY);
doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(14)
   .text('TABLE OF CONTENTS', doc.page.margins.left, 14, { width: pageW() });
doc.y = 70;

const contents = [
  ['1', 'Your Financial Situation — The Numbers'],
  ['2', 'What Your Car Is Worth — Market Evidence'],
  ['3', 'How the Genie Loan & Log Card Process Works'],
  ['4', 'The WhatsApp Message — Copy & Send'],
  ['5', 'All Dealer WhatsApp Numbers — Mobile (Send First)'],
  ['6', 'All Dealer Numbers — Office Lines (Try WA or Call)'],
  ['7', 'Online Platforms — Submit via Website'],
  ['8', 'Every Private Listing Platform'],
  ['9', 'Ready-to-Use Listing Description (Copy & Paste)'],
  ['10', 'Complete Photo Guide — 28 Shots'],
  ['11', 'Day-by-Day Action Plan'],
  ['12', 'Free Financial Help Contacts'],
];

contents.forEach(([num, title]) => {
  doc.rect(doc.page.margins.left, doc.y, 28, 22).fill(NAVY);
  doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(11)
     .text(num, doc.page.margins.left, doc.y + 6, { width: 28, align: 'center', lineBreak: false });
  doc.rect(doc.page.margins.left + 28, doc.y, pageW() - 28, 22).fill(LGREY);
  doc.fillColor('#1a1a1a').font('Helvetica').fontSize(10)
     .text(title, doc.page.margins.left + 38, doc.y + 6, { width: pageW() - 48, lineBreak: false });
  doc.y += 24;
});

// ══════════════════════════════════════════════════════════════════════════
// SECTION 1: FINANCIAL SITUATION
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('1.  YOUR FINANCIAL SITUATION — THE NUMBERS', RED);

heading('Your Car Details', 11);
table(
  ['Detail', 'Information'],
  [
    ['Car', '2019 Mitsubishi Attrage 1.2 CVT'],
    ['Registration', 'October 2020 (YOM 2019)'],
    ['COE Expiry', '14 October 2030 (~4 years 4 months remaining)'],
    ['Plate Status', 'Normal Plate — converted from ROPC. NO restrictions. Drive any time.'],
    ['Owners', '3'],
    ['Colour / Engine', 'Red | 1193cc Petrol, 79 bhp, Auto CVT'],
    ['Paper Value (LTA)', '$18,811 — this is your absolute floor (scrap value)'],
    ['Outstanding Loan', '$66,000 (Genie Financial Services — Carro subsidiary)'],
  ],
  [140, pageW() - 140]
);

heading('The Shortfall Problem', 11);
alertBox('If you sell at the Quotz bid of $18,800 you still owe $47,200 to Genie — with no car. DO NOT ACCEPT THIS BID. Your car is worth significantly more. See Section 2.', '#ffebee', RED);

doc.moveDown(0.3);
financialRow('Outstanding loan (Genie)', '$66,000');
financialRow('If sold at Carro offer (~$48,000)', '– $48,000');
financialRow('Remaining shortfall', '$18,000', true);
doc.moveDown(0.5);
financialRow('If sold privately (~$44,000)', '– $44,000');
financialRow('Remaining shortfall', '$22,000', true);
doc.moveDown(0.5);
financialRow('If sold at Quotz bid ($18,800)', '– $18,800');
financialRow('Remaining shortfall — AVOID THIS', '$47,200', true);

doc.moveDown(0.5);
alertBox('KEY FACT: Carro (who offered $44K–$52K last month) is the PARENT COMPANY of Genie (your loan provider). Call Carro first: +65 6714 6652. They can buy the car and settle the Genie loan in one transaction.', '#e8f5e9', GREEN);

// ══════════════════════════════════════════════════════════════════════════
// SECTION 2: MARKET VALUE
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('2.  WHAT YOUR CAR IS WORTH — LIVE MARKET EVIDENCE', GREEN);

heading('Comparable Cars Currently Listed by Dealers (June 2026)', 11);
table(
  ['Year/Reg', 'COE Expiry', 'Mileage', 'Owners', 'Listed At'],
  [
    ['2020 reg', 'Apr 2030', '66,300 km', '2', '$53,800'],
    ['2020 reg', 'Dec 2030', '59,000 km', 'Certified', '$58,800'],
    ['2020 reg', 'Oct 2030', '29,000 km', '2', 'Active listing'],
    ['2019', 'Apr 2030', '70,000 km', '—', '$52,800'],
    ['2019', '3y 7m left', '131,000 km', '—', '$42,588'],
  ],
  [75, 80, 80, 65, pageW() - 300]
);

heading('Your Car — Realistic Sale Price Range', 11);
table(
  ['Method', 'Realistic Price', 'Loan Shortfall After'],
  [
    ['Private sale (Carousell, SGCarMart)', '$40,000 – $48,000', '$18,000 – $26,000'],
    ['Carro direct offer', '$44,000 – $52,000', '$14,000 – $22,000'],
    ['Independent dealer (walk-in)', '$32,000 – $42,000', '$24,000 – $34,000'],
    ['Quotz/SGCarMart bid — DO NOT ACCEPT', '$18,800', '$47,200'],
  ],
  [190, 140, pageW() - 330]
);

alertBox('Why so much better than $18,800? Because Quotz dealers were bidding to SCRAP the car. Dealers who sell to private buyers can retail it for $48K–$58K — so they can afford to offer you $38K–$48K. Target private buyers and you get the full value.', '#e3f2fd', NAVY);

// ══════════════════════════════════════════════════════════════════════════
// SECTION 3: LOAN & LOG CARD PROCESS
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('3.  HOW THE GENIE LOAN & LOG CARD PROCESS WORKS', NAVY);

heading('Who is Genie Financial Services?', 11);
body('Genie Financial Services Pte Ltd (UEN: 201624030E) is a wholly owned subsidiary of CARRO — Singapore\'s largest used-car platform. Genie is legitimate, ACRA-registered, has $30M paid-up capital and is backed by HSBC with a $75M facility. It operates under Singapore\'s Hire-Purchase Act.');

heading('Why You Cannot Simply Return the Car and End the Loan', 11);
alertBox('CRITICAL: Under Singapore\'s Hire-Purchase Act, if you return/surrender the car, the loan is NOT cancelled. Genie sells the car and deducts the proceeds from your balance. If the sale price is less than your outstanding balance, YOU STILL OWE THE DIFFERENCE. There is no "walk away" rule in Singapore.', '#ffebee', RED);

heading('The Correct Sale Process — Step by Step', 11);
const steps = [
  ['1', 'Call Genie (+65 6715 1518)', 'Ask for your "early settlement amount today." This may be LESS than $66,000 — the HP outstanding is the exact payoff amount. Get it in writing.'],
  ['2', 'Find a buyer and agree price', 'Through private listings, dealer, or Carro. Agree verbally first.'],
  ['3', 'Collect a 10% deposit', 'On a $45,000 sale = $4,500 deposit. Sign a Sales & Purchase Agreement (template at LTA OneMotoring website). This locks in the buyer.'],
  ['4', 'Buyer pays full balance', 'You receive the agreed price from the buyer.'],
  ['5', 'Settle Genie loan', 'Use the buyer\'s payment to pay Genie\'s settlement amount. If the sale price is LESS than the settlement amount, you must top up the difference before Genie releases the log card.'],
  ['6', 'Genie releases log card', 'Within 1–3 business days after full settlement.'],
  ['7', 'Transfer ownership via LTA', 'Go to onemotoring.lta.gov.sg — both parties log in with SingPass. Seller initiates, buyer accepts. Fee: $25. Done online, no need to visit LTA.'],
];
steps.forEach(([num, title, desc]) => {
  const startY = doc.y + 3;
  if (startY > doc.page.height - 100) { doc.addPage(); doc.y = doc.page.margins.top; }
  doc.rect(doc.page.margins.left, doc.y + 3, 28, 28).fill(NAVY);
  doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(13)
     .text(num, doc.page.margins.left, doc.y + 10, { width: 28, align: 'center', lineBreak: false });
  doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(10)
     .text(title, doc.page.margins.left + 36, doc.y + 4, { width: pageW() - 36, lineBreak: false });
  doc.fillColor('#444').font('Helvetica').fontSize(9)
     .text(desc, doc.page.margins.left + 36, doc.y + 2, { width: pageW() - 36, lineGap: 1 });
  doc.y += 10;
});

// ══════════════════════════════════════════════════════════════════════════
// SECTION 4: WHATSAPP MESSAGE
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('4.  THE WHATSAPP MESSAGE — COPY THIS AND SEND TO ALL DEALERS', TEAL);

heading('About Photos At This Stage', 11);
alertBox('DO NOT send photos yet. An initial quote only needs the car details below. The message already says photos are available on request. Only send photos when a dealer confirms genuine interest. This saves you time.', '#e8f5e9', GREEN);

heading('Copy This Message Exactly — Send to Every Dealer', 11);
doc.moveDown(0.3);
const msgBg = '#f0fff4';
const msgText = `Hi, I am a private car owner looking for an initial quote to sell my car.
I am relocating overseas and looking to sell quickly.
Photos are available upon request.

--- CAR DETAILS ---
2019 Mitsubishi Attrage 1.2 CVT
Normal Plate (ROPC Converted to Normal — no restrictions)
COE expiry: October 2030 (~4 years remaining)
Year of Manufacture: 2019 | Reg: Oct 2020
Mileage: 66,000 km
Colour: Red | Auto CVT
Engine: 1193cc Petrol
Owners: 3
PARF rebate: ~$2,500

--- CONDITION ---
No accident history
Last serviced: June 2026 at 66,000 km
New battery: January 2026
New infotainment screen + rear camera installed
Oil recently changed
Interior & exterior cleaning done
Full service records available

Kindly advise your best offer. Thank you!`;

const msgH = doc.heightOfString(msgText, { width: pageW() - 24, fontSize: 9.5 }) + 20;
if (doc.y + msgH > doc.page.height - doc.page.margins.bottom) { doc.addPage(); doc.y = doc.page.margins.top; }
doc.rect(doc.page.margins.left, doc.y, pageW(), msgH).fill(msgBg).stroke(WAGREEN);
doc.fillColor('#1a1a1a').font('Helvetica').fontSize(9.5)
   .text(msgText, doc.page.margins.left + 12, doc.y + 10, { width: pageW() - 24, lineGap: 2 });
doc.y += msgH + 8;

heading('Negotiation Tip', 11);
bullet('Get every offer in writing (WhatsApp message is fine).');
bullet('Tell each new dealer: "I already have an offer of $X — can you beat it?"');
bullet('The highest offer after calling all dealers is your real market price.');
bullet('Always ask: "If my sale price is below my outstanding loan, can you help arrange a payment plan with the finance company?"');

// ══════════════════════════════════════════════════════════════════════════
// SECTION 5: MOBILE WHATSAPP NUMBERS
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('5.  DEALER WHATSAPP NUMBERS — MOBILE (SEND FIRST)', WAGREEN);

heading('These are mobile numbers — WhatsApp should work directly', 11);
alertBox('Send to these 9 numbers first. Mobile numbers (starting with 8 or 9) almost always have WhatsApp active. Tap the number in your contacts, open WhatsApp chat, paste the message from Section 4, and send.', '#e8f5e9', GREEN);

doc.moveDown(0.3);
const mobileContacts = [
  ['⭐  CARRO', 'Genie\'s parent company — offered $44K–$52K last month. CALL THIS ONE FIRST.', '+65 6714 6652'],
  ['Paragon Motors', 'Bukit Batok · Transparent valuation · Home evaluation available', '+65 9632 2370'],
  ['Republic Auto', 'Cycle & Carriage · Pandan Gardens · Corporate buyer', '+65 8878 7812'],
  ['Car Choice Singapore', '5 locations islandwide · Daily 10am–7pm', '+65 8318 9089'],
  ['Speedo Motoring — Sandy', 'Ubi Ave 3 · WhatsApp confirmed active', '+65 8688 7883'],
  ['Speedo Motoring — Ben', 'Ubi Ave 3 · WhatsApp confirmed active', '+65 9628 8231'],
  ['DirectCars', '300+ dealer network · Quote in 3 hours', '+65 9144 1158'],
  ['Hua Yang Group', 'Sin Ming Road · Est. 1984', '+65 8010 5517'],
  ['Platinum Motoring', 'Tampines · SGCarMart Award Winner', '+65 9239 9992'],
];
mobileContacts.forEach(([name, sub, num]) => {
  contactBox(name, sub, num, name.includes('CARRO'));
});

// ══════════════════════════════════════════════════════════════════════════
// SECTION 6: OFFICE/LANDLINE NUMBERS
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('6.  DEALER NUMBERS — OFFICE LINES (TRY WHATSAPP, THEN CALL)', NAVY);

heading('Try WhatsApp first on these numbers — many offices use WhatsApp Business', 11);
alertBox('Office numbers (starting with 6) may or may not have WhatsApp. Send the message via WhatsApp first. If it shows one tick only (not delivered) after 10 minutes, call instead and read/email the message details.', '#fff3e0', ORANGE);
doc.moveDown(0.3);

const officeContacts = [
  ['SGCarMart / Quotz', 'The same platform that bid $18,800. Ask them to run a new bid or quote directly.', '+65 6744 7571'],
  ['OneShift by Carousell', '500+ independent dealers · Separate from Quotz network', '+65 6533 5878'],
  ['Carsome Singapore', 'SE Asia\'s largest platform · Direct buyer', '+65 6222 0401'],
  ['Carsnap', 'Fixed offer · Quote in 24 hours', '+65 6631 8430'],
  ['SGCarDeals', 'Serangoon · Reaches direct buyers + dealers', '+65 6100 7999'],
  ['CarTimes Automobile', 'Ubi Ave 2 (Automobile Megamart) · Largest independent marketplace', '+65 6844 5111'],
  ['Vincar', '24 Leng Kee Road · Top-rated direct buyer', '+65 6473 1119'],
  ['Jack Cars Enterprise', 'Kampong Ubi · Japanese cars specialist · Est. 1984', '+65 6744 1900'],
  ['ICP Reowned (Inchcape)', '48 Pandan Road · 145-point inspection · Fair valuation', '+65 6631 1666'],
  ['Platinum Motoring (Office)', 'Tampines T-Space · Office line', '+65 6584 2502'],
];
officeContacts.forEach(([name, sub, num]) => {
  if (doc.y > doc.page.height - 80) { doc.addPage(); doc.y = doc.page.margins.top + 10; }
  contactBox(name, sub, num, false);
});

// ══════════════════════════════════════════════════════════════════════════
// SECTION 7: ONLINE PLATFORMS
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('7.  ONLINE PLATFORMS — SUBMIT VIA WEBSITE', '#1565c0');

heading('These have no WhatsApp — submit via their website forms. Takes 5 minutes each.', 11);
table(
  ['Platform', 'Website', 'What It Does', 'Cost'],
  [
    ['Motorist.sg', 'motorist.sg/sell-car', '600+ dealers bid independently of Quotz. Response same day.', 'Free'],
    ['UCARS', 'ucars.sg', '230+ dealers. NO commission charged to seller.', 'Free'],
    ['Carro', 'carro.co/sg/en/sell', 'Direct buyer. Also call +65 6714 6652. Genie parent company.', 'Free'],
    ['Carsome', 'carsome.sg', 'Direct buyer. 175-point inspection.', 'Free'],
    ['SGCarDeals', 'sgcardeals.com', 'AI quote in 10 min. Reaches private buyers + dealers.', 'Commission on sale only'],
    ['DirectCars', 'directcars.com.sg', '300+ dealer network. Quote in 3 hours.', 'Free'],
  ],
  [100, 130, 180, pageW() - 410]
);

// ══════════════════════════════════════════════════════════════════════════
// SECTION 8: PRIVATE LISTING PLATFORMS
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('8.  EVERY PRIVATE LISTING PLATFORM', '#6a1b9a');

heading('List on ALL of these simultaneously — costs almost nothing', 11);
alertBox('Private buyers pay $5,000–$10,000 more than dealers. Every platform you list on is another chance to find a buyer at $44,000–$48,000. Listing all of them takes one afternoon.', '#f3e5f5', '#6a1b9a');

heading('Priority 1 — Free, Highest Traffic (List Today)', 11);
table(
  ['Platform', 'Cost', 'How to List', 'Tip'],
  [
    ['Carousell\ncarousell.sg/autos', 'Free (1 per 3 months)', 'App → Sell → Cars → Used Cars. Upload 10 photos.', 'Use "Bump" ($2–$5) every 2 days to stay at top of results'],
    ['Facebook Marketplace\nfacebook.com/marketplace', 'Free', 'Facebook App → Marketplace → Sell → Vehicles. Upload up to 50 photos + video.', 'Also post in Facebook groups: search "Singapore cars for sale direct owners"'],
    ['SGCarMart Direct Owner\nsgcarmart.com', '~$20–$50 listing fee', 'Register → Sell My Car → Direct Owner listing. Plate number auto-fills LTA data.', 'Most trusted SG car site. "Direct Owner" badge builds buyer confidence. Worth paying for.'],
    ['MyCarForum\nmycarforum.com', 'FREE', 'Register → Marketplace → Cars For Sale. Post with photos.', '200,000+ members, all car-savvy Singaporeans. Very active.'],
  ],
  [100, 75, 165, pageW() - 340]
);

heading('Priority 2 — Free, List Same Day', 11);
table(
  ['Platform', 'Cost', 'Notes'],
  [
    ['Facebook Car Groups', 'Free', 'Search: "Singapore cars for sale direct owners", "SG used car marketplace". Groups with 50,000+ members.'],
    ['HardwareZone Marketplace\nforums.hardwarezone.com.sg', 'Free', 'Register → Marketplace → Cars For Sale. Active Singapore forum.'],
    ['Singapore Expats Forum\nsingaporeexpats.com', 'Free', 'forum.singaporeexpats.com → Cars. Expats often pay fair prices without heavy negotiation.'],
    ['Instagram', 'Free', 'Post photos as Reel. Use: #sgcars #singaporecar #mitsubishiattrage #carforsalesg'],
    ['Telegram groups', 'Free', 'Search Telegram: "Singapore Cars For Sale". Multiple active groups.'],
  ],
  [120, 50, pageW() - 170]
);

heading('Priority 3 — Consignment (They Manage Viewings for You)', 11);
table(
  ['Platform', 'Fee', 'What They Do'],
  [
    ['OneShift "Sell For Me"\noneshift.com', '$109 on sale only', 'Lists on Carousell, manages all viewings and negotiations for you.'],
    ['Gingerbread Autos\ngingerbreadautos.com', 'Commission on sale', 'Free consignment — you keep driving until the car sells.'],
    ['SGCarDeals\nsgcardeals.com', 'Commission on sale', 'AI-assisted. Reaches both dealers and private buyers.'],
  ],
  [140, 95, pageW() - 235]
);

// ══════════════════════════════════════════════════════════════════════════
// SECTION 9: LISTING DESCRIPTION
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('9.  READY-TO-USE LISTING DESCRIPTION — COPY & PASTE', TEAL);

heading('Use this on Carousell, SGCarMart, Facebook, MyCarForum — all platforms', 11);
heading('Suggested Asking Price', 10);
table(
  ['Your Goal', 'List At', 'Accept At'],
  [
    ['Fast sale (1–2 weeks)', '$44,000', '$40,000 – $42,000'],
    ['Balanced (3–4 weeks) — RECOMMENDED', '$48,000', '$44,000 – $46,000'],
    ['Maximum price (4–8 weeks)', '$52,000', '$46,000 – $50,000'],
  ],
  [180, 100, pageW() - 280]
);

doc.moveDown(0.4);
const listing = `2019 Mitsubishi Attrage 1.2 CVT | Normal Plate | COE till Oct 2030

✅ NORMAL PLATE — No restrictions. Drive any time, any day.
✅ Upgraded infotainment screen + rear camera (newly installed)
✅ New battery installed January 2026

COE till: October 2030 (~4 years remaining)
PARF rebate: ~$2,500 (verify at LTA OneMotoring)
Year of Manufacture: 2019 | Registration: Oct 2020
Mileage: 66,000 km
Colour: Red | Transmission: Auto CVT | Engine: 1193cc Petrol
Previous owners: 3

— CONDITION —
No accident history.
Last serviced: June 2026 at 66,000 km.
Recently upgraded: New infotainment screen + rear camera installed.
New battery: January 2026. Oil recently changed.
All aircon, windows, locks, lights fully working.
Service records available for viewing.

— MARKET CONTEXT —
Similar Attrages (2020 reg, COE to 2030) listed by dealers at $48,000–$58,800.
Buying direct from owner saves you $5,000–$10,000 in dealer markup.

— ASKING PRICE —
$[your price] (negotiable for serious buyers)
No agents please. Direct buyers only.

— CONTACT —
WhatsApp preferred: [your number]
Available for viewing: [your area] — weekday evenings & weekends
Please message before calling.`;

const listH = doc.heightOfString(listing, { width: pageW() - 24, fontSize: 9.5 }) + 20;
if (doc.y + listH > doc.page.height - doc.page.margins.bottom) { doc.addPage(); doc.y = doc.page.margins.top; }
doc.rect(doc.page.margins.left, doc.y, pageW(), listH).fill('#f5f5f5').stroke('#cccccc');
doc.fillColor('#1a1a1a').font('Helvetica').fontSize(9.5)
   .text(listing, doc.page.margins.left + 12, doc.y + 10, { width: pageW() - 24, lineGap: 2 });
doc.y += listH + 8;

// ══════════════════════════════════════════════════════════════════════════
// SECTION 10: PHOTO GUIDE
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('10.  COMPLETE PHOTO GUIDE — 28 SHOTS', '#37474f');

heading('Assessment of Your Current Photos (from Quotz)', 11);
alertBox('Your current photos show the car in a covered carpark under fluorescent lighting with a cluttered background. They are NOT good enough for a $44,000–$48,000 private sale listing. Spend one morning this weekend taking better photos — it is worth $5,000+ in buyer confidence.', '#fff3e0', ORANGE);

heading('Before You Shoot — Preparation', 11);
const prepSteps = [
  'Wash the car thoroughly — exterior, windows, wheels',
  'Vacuum inside completely — seats, boot, floor mats, door pockets',
  'Wipe dashboard, door panels, centre console with a damp cloth',
  'Remove ALL personal items — bags, ERP device covers, sunshades, everything',
  'Apply tyre shine spray to all 4 tyres ($5 from any petrol kiosk)',
  'Clean engine bay with a dry cloth — just remove dust',
];
prepSteps.forEach(s => bullet(s));

heading('When & Where to Shoot', 11);
table(
  ['When/Where', 'Details'],
  [
    ['Best time', '7:00–8:00am (after sunrise) OR 6:15–7:00pm (before sunset) — soft golden light'],
    ['Second best', 'Overcast day — uniform soft light, no harsh shadows'],
    ['Avoid', '11am–4pm midday sun — creates black shadows, washes out red paint'],
    ['Best location', 'Multi-storey carpark rooftop — open sky, clean background'],
    ['Avoid', 'HDB void decks, covered carparks, locations with many cars behind'],
  ],
  [120, pageW() - 120]
);

heading('The 28 Shots — Complete Checklist', 11);
table(
  ['#', 'Shot Name', 'How to Take It'],
  [
    ['1', 'Front 3/4 — COVER PHOTO', 'Crouch to wheel height, stand 45° from front-left corner. Take 5 versions, pick the best.'],
    ['2', 'Rear 3/4', 'Same from rear-right corner. Crouch slightly.'],
    ['3', 'Driver-side profile', 'Stand back, full car in frame, keep horizon level.'],
    ['4', 'Passenger-side profile', 'Same from other side.'],
    ['5', 'Front straight-on', 'Centred, slightly below bonnet height.'],
    ['6', 'Rear straight-on', 'Centred. Shows tail lights and boot lid.'],
    ['7–10', 'Each wheel (4 shots)', 'Crouch close. Show tyre tread and rim condition. All 4 wheels.'],
    ['11', 'Full dashboard', 'From passenger seat, car switched ON so cluster lights up.'],
    ['12 ⚠', 'Odometer — MANDATORY', 'Mileage MUST be clearly readable. Every buyer looks for this.'],
    ['13', 'New infotainment screen', 'Car on, show the screen. Highlight the upgrade.'],
    ['14', 'Driver seat', 'Shows wear honestly.'],
    ['15', 'Rear seats', 'Open rear door, show legroom and seat condition.'],
    ['16', 'Boot/trunk', 'Fully open, empty, well-lit.'],
    ['17', 'Gear shifter', 'Confirms automatic CVT.'],
    ['18', 'Steering wheel', 'Shows condition.'],
    ['19', 'Engine bay wide', 'Bonnet fully open. Clean first with dry cloth.'],
    ['20', 'Engine bay close-up', 'Shows cleanliness and any new parts.'],
    ['21', 'Fuel cap sticker', 'Open fuel cap, photograph sticker (shows 95 octane fuel type).'],
    ['22', 'Rear camera working', 'Show rear camera view active. Proves the upgrade works.'],
    ['23–28', 'All scratches/dents', 'Close-up of every scratch, dent, stone chip. Honesty prevents wasted viewings.'],
  ],
  [35, 105, pageW() - 140]
);

heading('Licence Plate — BLUR IT', 11);
alertBox('Blur your plate in all public listings. No law requires it, but your plate links to your personal details and enables identity theft. Use FREE Snapseed app: Tools → Selective → place blur dot on the plate. 30 seconds per photo. Show unblurred plate only to serious buyers via WhatsApp.', '#fff3e0', ORANGE);

heading('Record a 60-Second Video', 11);
body('Walk around the car slowly, then start the engine (show no warning lights on dashboard). Upload to Facebook Marketplace and Carousell. Video listings get 3x more enquiries. This is the single most effective thing you can do to speed up the sale.');

// ══════════════════════════════════════════════════════════════════════════
// SECTION 11: ACTION PLAN
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('11.  DAY-BY-DAY ACTION PLAN', RED);

alertBox('Every week you delay, ~$200–$300 of COE value is consumed. Start TODAY.', '#ffebee', RED);

heading('TODAY — Within the Next Few Hours', 11);
table(
  ['#', 'Action', 'Contact/Details'],
  [
    ['1', 'Call Carro — FIRST PRIORITY', '+65 6714 6652 | They offered $44K–$52K last month. Mention Genie loan. Ask for revaluation + direct Genie settlement.'],
    ['2', 'Submit online to Motorist + UCARS + DirectCars', 'motorist.sg/sell-car | ucars.sg | directcars.com.sg — All free, takes 10 min each.'],
    ['3', 'DM the Instagram contact', 'Find them and send: "Still interested in my Attrage? COE Oct 2030, Normal Plate, 66,000 km."'],
    ['4', 'Call Genie', '+65 6715 1518 | Ask: "What is my early settlement amount today?" Explain husband lost job — ask about hardship options.'],
  ],
  [20, 145, pageW() - 165]
);

heading('TOMORROW', 11);
table(
  ['#', 'Action', 'Details'],
  [
    ['5', 'Let Quotz auction close at 2PM', 'Do NOT accept the $18,800 bid. Simply let it expire. You are under no obligation to accept.'],
    ['6', 'Submit to Carsome, OneShift, Carsnap, SGCarDeals', 'carsome.sg | oneshift.com | carsnap.sg | sgcardeals.com — Submit all four online forms.'],
    ['7', 'WhatsApp all 19 dealers', 'Use the message from Section 4. Send to all mobile numbers first, then office numbers.'],
  ],
  [20, 145, pageW() - 165]
);

heading('THIS WEEKEND', 11);
table(
  ['#', 'Action', 'Details'],
  [
    ['8', 'Wash car + take all 28 photos + video', 'Early morning or evening light. Carpark rooftop. Full checklist in Section 10. Blur plates with Snapseed app.'],
    ['9', 'Post private listings on all platforms', 'Carousell, SGCarMart, Facebook Marketplace, Facebook groups, MyCarForum, HardwareZone. Use description from Section 9.'],
    ['10', 'Visit dealers in person', 'Paragon Motors (+65 9632 2370), Car Choice (+65 8318 9089), Speedo Motoring (+65 6769 7757). Bring your highest quote.'],
  ],
  [20, 145, pageW() - 165]
);

heading('ONGOING — Every Day Until Sold', 11);
bullet('Respond to ALL enquiries within 1 hour. Turn on notifications for Carousell and Facebook.');
bullet('Bump your Carousell listing every 2 days ($2–$5). Keeps it at the top of search.');
bullet('When a dealer gives an offer, use it to negotiate with the next one: "I have $X — can you beat it?"');
bullet('Arrange viewings as fast as possible. Never let a serious buyer wait more than 24 hours.');

// ══════════════════════════════════════════════════════════════════════════
// SECTION 12: HELP CONTACTS
// ══════════════════════════════════════════════════════════════════════════
sectionHeader('12.  FREE FINANCIAL HELP CONTACTS', NAVY);

table(
  ['Organisation', 'Contact', 'What They Can Do For You'],
  [
    ['Genie Financial Services', '+65 6715 1518\ngenie.sg', 'Get early settlement figure. Ask about hardship deferment. Ask about payment plan for any shortfall. Call today.'],
    ['Credit Counselling Singapore (CCS)', '6225 5227\nccs.org.sg', 'FREE debt counselling. They deal with exactly your situation daily — outstanding car loan, job loss, negative equity. They will contact Genie ON YOUR BEHALF and negotiate. Free and confidential.'],
    ['Legal Aid Bureau', '1800 225 1424\nlab.mlaw.gov.sg', 'Free legal advice on loan terms and your rights if you financially qualify.'],
    ['ComCare (MSF)', '1800 222 0000\nmsf.gov.sg', 'Emergency financial assistance for families in severe hardship due to job loss.'],
    ['NTUC e2i', '6474 0606\ne2i.com.sg', 'Job placement for your husband. Faster income = faster ability to manage the loan shortfall.'],
    ['Carro (Genie parent)', '+65 6714 6652\ncarro.sg', 'Car valuation. Potential direct loan settlement in one transaction.'],
  ],
  [120, 130, pageW() - 250]
);

alertBox('MOST IMPORTANT FREE CALL: Credit Counselling Singapore at 6225 5227. They deal with exactly this situation every day and it is completely free. Call them this week.', '#e8f5e9', GREEN);

// back cover note
doc.addPage();
doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(20)
   .text('You Can Do This.', 45, 200, { width: pageW(), align: 'center' });
doc.font('Helvetica').fontSize(12).fillColor('#90caf9')
   .text('Your car is worth $40,000–$48,000. The Quotz bid was a trap.\nStart with Carro and Genie today. Post your listings this weekend.\nEvery call you make brings you closer to closing this debt.', 45, 240, { width: pageW(), align: 'center', lineGap: 4 });
doc.font('Helvetica').fontSize(10).fillColor('#ffffff66')
   .text('Prepared June 2026 · For private use only', 45, 430, { width: pageW(), align: 'center' });

doc.end();
console.log('PDF generated:', outputPath);
