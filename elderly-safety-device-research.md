# Elderly Safety Device — Market Research & Opportunity Analysis

**Research date:** May 2026  
**Purpose:** Validate demand, map the competitive landscape, and identify the strongest product opportunity for a check-in / emergency-alert device for the elderly.

---

## 1. Why This Market — The Demand Signal

### The demographic reality (hard numbers)
| Stat | Figure | Source |
|------|--------|--------|
| US seniors (65+) living alone | **16.2 million** (26% of all 65+) | Pew Research 2025 |
| Women 85+ living alone | **50%** | PRB |
| Global population 60+ by 2050 | **2.1 billion** (double 2017 levels) | UN / NCOA |
| US adults 65+ by 2040 | **80 million** | Urban Institute |
| Falls per year among US elderly | **1 in 4** — 25% of seniors fall annually | CDC / SeniorSite |
| Falls that happen in the bathroom | **80%** | SeniorSite |

**The core tension:** The people who most need a safety device (very elderly, cognitively declining, physically frail) are the ones least likely to adopt technology or consistently use it.

---

## 2. Market Size — Is There Real Money Here?

| Metric | Figure |
|--------|--------|
| Elderly Safety Monitoring Device market (2025) | **USD $754 million** |
| Projected value by 2035 | **USD $1.35 billion** |
| CAGR | **6.0–6.5%** |
| Elderly Care Products & Services total market (2025) | **USD $994 billion** |
| Projected total by 2031 | **USD $1.4 trillion** |
| Family segment share of monitoring market | **44%** of buyers are family members |

**High-growth regions:** China (8.1% CAGR), India (7.5%), Germany (6.9%), USA (5.7%)

Verdict: **The market is real, growing, and underpenetrated** — particularly in the mid-market between "cheap panic button" and "expensive monthly monitoring subscription."

---

## 3. What Already Exists — The Competitive Landscape

### Category A: Medical Alert / PERS (Personal Emergency Response Systems)
Classic pendant/wristband + monitoring centre. These dominate the current market.

| Product | Key Features | Price |
|---------|-------------|-------|
| **Bay Alarm Medical SOS Smartwatch** | Fall detection, 24/7 monitoring, GPS | ~$25–30/mo |
| **Medical Guardian MGMini Lite** | 80% fall detection accuracy, 0 false alarms | ~$35/mo |
| **LifeFone** | Two-way voice, GPS, caregiver app | ~$30/mo |
| **ADT Medical Alert** | Home + mobile, fall detection add-on | ~$30/mo |

**Fall detection accuracy:** Best devices catch ~80% of falls. None are 100%. All require a subscription.

### Category B: GPS Trackers / Dementia Wandering Devices
Specifically for location tracking, especially dementia and Alzheimer's patients.

| Product | Key Features | Price |
|---------|-------------|-------|
| **AngelSense** | Real-time GPS, geofencing, two-way audio | ~$40/mo |
| **Family1st Senior GPS** | Real-time tracking, SOS button, long battery | ~$20/mo |
| **SecuLife GPS + Fall Detection** | GPS + fall detection + SOS + caregiver app | ~$25/mo |
| **AlzStore GPS Watch** | Locking clasp (prevents removal), GPS | ~$30/mo |

### Category C: Daily Check-In Apps / Services
Wellness confirmation — "I'm okay" — rather than emergency response.

| Product | Key Features | Price |
|---------|-------------|-------|
| **mySeniorCareHub** | Tap to confirm, missed check-in alerts 3 contacts, emergency dispatch | ~$10–20/mo |
| **AssureOkay** | Daily check-in via app, SMS, or AI phone call, 5 family members | **$4.99/mo** |
| **Snug Safety** | Scheduled check-ins, auto-alerts if missed | ~$5/mo |
| **Senior Care: Daily Checkup** (App Store) | Family coordination, shared calendar | App-based |
| **HelpAlert** (AU → US, launched Feb 2026) | Automated phone calls to any landline/mobile, NO app/wearable required | ~$10/mo |
| **Caring Village** | Full caregiver hub: meds, calendar, AI assistant | Freemium |

### Category D: Passive / Ambient Monitoring (No Wearable)
The newest and fastest-growing category.

| Technology | How It Works | Status |
|------------|-------------|--------|
| **Radar sensors** (e.g. Butlr) | Wall-mounted, detects motion/presence, AI anomaly detection | Commercial, ~$200 device + subscription |
| **Infrared sensors** | Tracks room-to-room movement, flags inactivity | Niche, mostly B2B/care homes |
| **Floor vibration sensors** | Detects human fall impact pattern | Emerging |
| **AI + WiFi motion** | Uses router signal disturbance to detect falls | Research stage |

Key finding: **Non-wearable + AI achieves the highest fall detection performance** according to peer-reviewed systematic review (MDPI Sensors, 2025).

---

## 4. The Critical Problem Nobody Has Fully Solved

### The Compliance Crisis
> **86% of PERS users don't wear their device 24 hours a day.** Most ends up in a drawer.

Root causes (backed by research):
1. **Stigma** — the pendant = "I'm old and helpless." 86% refuse because it signals frailty.
2. **Forget to charge** — smartwatches with 18-hour battery lives are a failure point, especially with cognitive decline.
3. **Fine motor skill issues** — arthritis makes touchscreens and clasps difficult.
4. **Monthly subscription fatigue** — families cancel after the senior refuses to wear it.
5. **80% of dangerous falls happen when the wearable is NOT being worn** — bathroom trips at 3am, shower, etc.

### The Complexity Gap
Most apps assume the senior owns a smartphone, has Wi-Fi, and can navigate an interface. HelpAlert (2026) is a rare exception — it works on ANY phone including landlines. This is the right direction but still limited.

### The Stigma Gap
No current mainstream product has cracked "desirable design" for a safety device. Apple Watch is the closest but costs $400+ and has a steep learning curve.

---

## 5. Opportunity Map — Where You Can Play

Based on the research, here are three ranked opportunities:

---

### Opportunity 1 — The "Invisible Check-In" Physical Button Device ⭐⭐⭐⭐⭐
**The gap:** HelpAlert proved the phone-call approach works and there is demand for no-app, no-wearable solutions. But nobody has built a **dedicated physical device** — a small, always-plugged-in home hub with ONE button — that is:
- Permanently on (no charging)
- Sends a daily "I'm okay" signal automatically at a set time unless the senior presses "need help"
- Calls family AND dispatches help if no confirmation by a set window
- Has a panic button for immediate SOS
- Looks like a home appliance, not a medical device (removes stigma)
- Works on 4G/LTE cellular — no Wi-Fi setup needed

**Hardware:** Raspberry Pi or ESP32 + SIM module + single large tactile button + speaker/mic. Cost to build: ~$30–50 BOM. Retail: $79–99 + $5–9/month cellular plan.

**Competitive moat:** No charging needed (always plugged in) + physical presence in home removes the "forgot to press app" problem + stigma-free design.

---

### Opportunity 2 — Passive Room Sensor Kit for Families ⭐⭐⭐⭐
**The gap:** Radar/ambient sensors exist but are B2B-only or extremely expensive. No consumer-friendly kit exists that:
- A family member can install in 10 minutes
- Monitors inactivity patterns ("Mum hasn't moved in her bedroom for 6 hours")
- Detects probable falls via sudden impact + no movement
- Sends WhatsApp/SMS/push alerts to family
- Does NOT require cameras (huge privacy concern for seniors)

**Hardware:** mmWave radar sensor (e.g. HLK-LD2450 — ~$8 wholesale) + ESP32 + cloud backend. Kit price: $99–149.

**Competitive moat:** Privacy-first (no camera), simple install, family-app driven, no monthly subscription needed beyond cloud hosting ($2–3/month).

---

### Opportunity 3 — A "Beautiful" Everyday Wearable ⭐⭐⭐
**The gap:** Solving stigma by making the device actually desirable — something that looks like jewellery or a stylish accessory, not a medical device.

**Examples of early movers:** Haelo Health is tackling this. Nobody has won this space yet.

**Challenge:** Harder to execute — requires industrial design investment and the core wearable compliance problem remains. Highest cost, highest risk.

---

## 6. Validation Evidence Summary

| Claim | Evidence |
|-------|----------|
| Market is growing | $754M → $1.35B by 2035 at 6% CAGR (FutureMarketInsights 2025) |
| Seniors live alone at scale | 16.2M US seniors live alone (Pew Research 2025) |
| Falls are the #1 danger | 1 in 4 seniors fall annually; 80% in bathroom (CDC) |
| Wearables fail due to non-compliance | 86% don't wear 24/7 (Haelo Health study) |
| Families are the buyer | 44% of market is family-driven purchasing (FMI 2025) |
| No-wearable demand is real | HelpAlert US launch Feb 2026 (GlobeNewswire) |
| Passive sensors outperform wearables | Systematic review, MDPI Sensors 2025 |
| Stigma is the #1 adoption killer | Multiple peer-reviewed studies confirm |
| Check-in app space growing | AssureOkay, Snug, mySeniorCareHub all active and growing |

---

## 7. Recommended First Move

**Build Opportunity 1 first** — the always-on home check-in hub.

Why:
- Lowest hardware complexity (single button, plug-in power = no battery problem)
- Directly addresses the #1 failure mode (non-compliance / forgot to charge)
- Validated demand: HelpAlert just proved this space is real but hasn't built hardware
- Lowest cost to prototype: ~$50 in parts
- Monthly revenue model: $5–9/month SIM + cloud = ~70% gross margin at scale
- Defensible: The physical, branded, always-present device creates loyalty

**Stack suggestion for a prototype:**
- Microcontroller: ESP32 with built-in Wi-Fi/BT or add a SIM7600 LTE module
- Button: Large 60mm tactile button, backlit green/red
- Speaker: Small 3W for two-way voice
- Backend: Firebase or Supabase for real-time alerts + Twilio for SMS/calls
- Family app: React Native (shares codebase with existing Remotion/JS work)

---

## Sources

- [Elderly Safety Monitoring Device Market 2025–2035 — FutureMarketInsights](https://www.futuremarketinsights.com/reports/elderly-safety-monitoring-device-market)
- [Elderly Safety Monitoring Market Forecast 2026–2036 — Newstrail](https://www.newstrail.com/elderly-safety-monitoring-device-market-valuation-roi-potential-long-term-growth-prospects-2026-2036/)
- [Best Fall Detection Devices 2026 — The Senior List](https://www.theseniorlist.com/medical-alert-systems/best/fall-detection/)
- [Best Medical Alert Systems with Fall Detection 2026 — NCOA](https://www.ncoa.org/product-resources/medical-alert-systems/best-medical-alert-systems-with-fall-detection/)
- [Best GPS Trackers for Elderly 2026 — Tracki Guide](https://tracki.com/blogs/post/elderly-gps-tracker-guide)
- [Best GPS Trackers for Dementia Patients 2026 — GPSTracker24/7](https://gpstracker247.com/blogs/gps-trackers/best-gps-trackers-for-dementia-patients)
- [Why Seniors Refuse to Wear Medical Alert Devices — Haelo Health](https://haelohealth.com/blog/why-seniors-refuse-to-wear-medical-alert-devices)
- [Daily Check-In App for Elderly Safety — mySeniorCareHub](https://myseniorcarehub.com/blog/daily-check-in-app-ensuring-elderly-safety/)
- [Daily Wellness Check for Seniors — AssureOkay](https://assureokay.com/daily-wellness-check-for-seniors)
- [HelpAlert US Launch Feb 2026 — GlobeNewswire](https://www.globenewswire.com/news-release/2026/02/26/3246004/0/en/HelpAlert-Launches-Elderly-Welfare-Check-In-App-in-the-United-States-That-Requires-No-Wearable-Device-And-Is-Very-Simple-To-Use.html)
- [Privacy-First Fall Detection No-Camera AI 2026 — AgeInPlaceHQ](https://ageinplacehq.com/privacy-first-fall-detection-no-camera-ai-monitoring-systems-for-seniors/)
- [Fall Detection Without Wearables 2026 — PorchLight at Home](https://porchlightathome.com/blog/fall-detection-without-wearable/)
- [Fall Detection Systematic Review — MDPI Sensors 2025](https://www.mdpi.com/1424-8220/25/21/6540)
- [Smaller Share of Older Americans Live Alone — Pew Research 2025](https://www.pewresearch.org/short-reads/2025/12/04/a-smaller-share-of-older-us-adults-live-alone-today-than-in-1990/)
- [Get the Facts on Older Americans — NCOA](https://www.ncoa.org/article/get-the-facts-on-older-americans/)
- [Top Trending Elderly Care Products 2025 — Accio](https://www.accio.com/business/trending-elderly-care-products)
- [10 Essential Safety Devices for Seniors Living Alone 2025 — SeniorSite](https://seniorsite.org/resource/10-essential-safety-devices-for-seniors-living-alone-in-2025/)
- [SecuLife GPS Tracker with Fall Detection — Amazon](https://www.amazon.com/SecuLife-GPS-Tracker-Fall-Detection/dp/B0BFZQKB2V)
