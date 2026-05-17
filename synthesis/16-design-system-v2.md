# c4twweb Design System v2 — synthesized from skillui + visual cross-check

> **Method:** Each of the 5 locked references was passed through skillui (static CSS
> reverse-engineering). Each output (`DESIGN.md` + `SKILL.md` + bundled fonts) was
> then cross-checked against the actual full-page screenshot in
> `/home/thomas/c4twweb/assets/references/*.png`. Where the static scrape disagreed
> with the visual reality, the visual reality wins.
>
> This document records (a) what skillui reported, (b) what the screenshot actually
> shows, (c) which signals we trust, (d) the synthesized c4twweb spec.
>
> **Anchor that overrides everything else:** the existing 創照 logo
> "手托台灣 sage" `~#7A9B8A` (cannot be changed; new CI builds around it).

---

## Part 1 — Per-reference audit

Every reference has a single `homepage.png` capture from skillui's headless run, plus an older full-page playwright capture in `assets/references/`. Skillui's static CSS pass mostly mines `<style>` and stylesheet rules — it does **not** see actual rendered pixels. That's why JS-heavy pages, framework defaults, and cookie banners pollute its palette.

### A. Aesop — `https://www.aesop.com/tw/`

| Layer | skillui report | Visual reality (`assets/references/aesop.png`) | Trust |
|---|---|---|---|
| Theme | "light, neutral, sans-serif" | Dark olive editorial hero (~`#2C2C24`) + cream chrome (~`#FFFEF2`) | ❌ Wrong direction |
| Colors | **0 detected** | Cream `#FFFEF2`, dark olive `#2C2C24`, ink `#1A1A14` | ❌ Skillui blocked (anti-bot) |
| Fonts | **0 detected** | Aesop Suisse-class custom serif wordmark + sans body | ❌ Blocked |
| Components | 0 | Top nav with utilities + search + cart, full-bleed hero photo with center-aligned caption | ❌ Blocked |
| Spacing | 4px grid (default fallback) | Generous 80–96px gutters, controlled hero copy width | ⚠️ Default, not extracted |
| **Verdict** | Useless — anti-bot blocked the entire static scrape | **What we use:** ONLY the visual register. Borrow: cream chrome over photo, controlled H1, generous gutters, restrained editorial typography hierarchy. | 0% skillui usable |

### B. 暮しの保健室 (Kuraho) — `https://kuraho.jp/`

| Layer | skillui report | Visual reality (`assets/references/kuraho-jp.png`) | Trust |
|---|---|---|---|
| Theme | "dark, warm, accent #cc0000, motion subtle" | **Light/cream**, warm wood interior photo hero with white serif overlay | ❌ Wrong direction |
| Background | `#333333` | Warm wood/cream `~#F5EFE3` background, white panels | ❌ skillui caught splash CSS not body |
| Surface | `#000000` | White `#FFFFFF` for cards on cream | ❌ |
| Accent | `#cc0000` | Warm orange `~#F58A1F` (only on splash + occasional pull-quote bar) | ⚠️ Wrong hue but right intent (warm pop) |
| Text primary | `#FFFFFF` (white) | Dark `#2B2B2B` on cream | ❌ |
| Text muted | `#726660` warm gray | Plausible — warm gray is consistent | ✅ Keep |
| Fonts | Noto Serif Japanese (heading) + Raleway (body) | Confirmed — Japanese serif display, sans body | ✅ Pattern correct, swap to TC equivalents |
| Border-radius | `2.5em` (very pill-y) | Crisp, minimal radius — possibly 0–4px | ❌ Wrong |
| Components | Layout/Nav/Button/Input/Image | Hero overlay, nav minimal, photo grid, no chrome cards | ⚠️ Generic only |
| **Verdict** | Polluted by splash screen + swiper-cookie-banner CSS. Color palette inverted. | **What we use:** font-pairing pattern (display serif + sans body), `#726660` warm gray text token, `--text-muted`. **Discard:** dark theme, `#cc0000` accent, 2.5em radius. | ~25% skillui usable |

### C. Mae Fah Luang Foundation — `https://www.maefahluang.org/en/homepage/`

| Layer | skillui report | Visual reality (`assets/references/maefahluang-home.png`) | Trust |
|---|---|---|---|
| Theme | "dark, neutral, expressive motion" | **Light cream chrome with photo-led editorial hero**, weaving loom craft detail | ❌ Wrong |
| Background | `#000000` | Cream `~#F4EDDC` chrome, full-bleed photo hero | ❌ Bootstrap default scraped |
| Surface | `#1e1f26` | White `#FFFFFF` content surface | ❌ |
| Accent | `#007bff` (Bootstrap blue) | Foundation cream + earth craft tones, weaving brick `~#A26B60` | ❌ Framework default leaked |
| Status colors | `#dc3545 / #28a745 / #007bff` (Bootstrap traffic-light) | Not used visibly | ❌ Bootstrap noise |
| Real palette colors | `#a26b60` listed as "unknown" | Mae Fah Luang weaving brick — actual brand color buried in "extended palette" | ✅ Recoverable |
| Text | `#FFFFFF` on dark | Dark `#2B2B2B` on cream/white | ❌ |
| Fonts | Roboto + Montserrat (claimed body/display) | Real fonts: K2D (Thai), Montserrat (Latin), DTKaLaTeXa (Thai) — see `fonts/` folder | ⚠️ Latin fonts right, Thai fonts ignored |
| Heading sizes | H1 200px, H2 6rem, H3 90px | Plausible huge editorial scale, but skillui likely caught a `font-size: 200px` outlier | ⚠️ Direction right, exact values suspect |
| Components | Card variants `shadow/green/column/item` | WordPress `so-widgets-bundle` patterns — generic | ⚠️ WP framework noise |
| **Verdict** | Heavily polluted by Bootstrap defaults + WordPress preset palette + so-widgets icons. The actual brand voice (cream + craft + people) is invisible in skillui. | **What we use:** `#A26B60` clay (rescued from "unknown"), Montserrat as one Latin display option. **Discard:** entire dark theme, all Bootstrap colors, fake huge-px heading scale. | ~10% skillui usable |

### D. 掌生穀粒 (Greeninhand) — `https://www.greeninhand.com/main.php`

| Layer | skillui report | Visual reality (`assets/references/greeninhand.png`) | Trust |
|---|---|---|---|
| Theme | "light, neutral, 5px grid, flat" | Light cream `#FAF5EB`, brush logo seal red, magazine-spread editorial 4-col grid | ✅ Direction correct |
| Background | `#FFFFFF` page, `#FAF5EB` surface | Confirmed: cream `#FAF5EB` is the dominant ground, white shows through behind cards | ✅ Accurate |
| Text primary | `#2B2B2B` | Confirmed | ✅ |
| Text muted | `#424242` | Plausible — warm dark gray for secondary captions | ✅ |
| Border | `#62625A` | Confirmed — warm gray hairline | ✅ Distinctive token |
| Earth palette | `#754B27`, `#9D896C`, `#A59C90`, `#737369`, `#6F5436`, `#906F52`, `#B3ADA0` | Confirmed — full earth/wood/sage spectrum visible in field photography captions and text | ✅✅ Best palette of the 5 |
| Seal red | `#BA2636` | Confirmed — vertical brush logo seal | ✅ |
| Fonts | Tahoma (heading) + Lucida Sans Unicode (body) | These are CSS fallbacks, not the brand intent. Real site likely uses 思源宋體 / Noto Serif TC + system zh-TW sans | ⚠️ Stack reflects what's loaded but the brand intent is editorial serif |
| Type scale | H1 22 / H2 19 / H3 18 / Body 17 / Caption 16 | Visually consistent — magazine-tight | ✅ Confirmed (but smaller than we want for c4twweb hero) |
| Grid | 5px base | Plausible — editorial sites often use 5px not 4px | ⚠️ We choose 8px for c4twweb, more breathing room |
| Components | Button, Input, Image | Photo-led grid cards with cream surface, no shadow | ✅ Pattern correct |
| **Verdict** | Best-quality skillui run of the 5. Color palette is genuinely usable. | **What we use:** ENTIRE color palette as primary basis for c4twweb. `#FAF5EB` becomes our `--bg`, `#2B2B2B` our `--text`, `#62625A` our `--text-body`, `#9D896C` / `#6F5436` our earth tones. Fonts swap to proper Noto Serif/Sans TC. | ~80% skillui usable |

### E. 田中央工作群 (Fieldoffice) — `http://www.fieldoffice-architects.com/`

| Layer | skillui report | Visual reality (`assets/references/fieldoffice.png`) | Trust |
|---|---|---|---|
| Theme | "light, neutral, 5px grid, subtle motion" | Light cream `~#E8E2D0` chrome + concrete-grey editorial archive layout with tiny Arial-sized body type | ✅ Direction correct |
| Background | `#FFFFFF` | Cream chrome at top, white content area | ✅ Plausible |
| Surface | `#F2F2F2` | Confirmed — light gray panels for project cards | ✅ |
| Text primary | `#2E2E2E` | Confirmed — near-black on cream | ✅ |
| Text muted | `#8F98A1` | Plausible — cool gray for archive metadata | ✅ Distinctive token |
| Border | `#555D66` | Confirmed — slate divider | ✅ |
| Status accents | `#F9E848` yellow / `#F8725C` coral | These appear in WordPress widget defaults, not the actual archive | ❌ WP noise |
| Fonts | Open Sans (heading) + sdrn (body) | **`sdrn` is an icon font** (`SD-mobile-nav`) — NOT body. Real body is Open Sans. Real headings use 微軟正黑體 / system zh-TW serif | ❌ Body/heading roles inverted |
| Type scale | H1 48px / H2 42px / H3 36px / Body 12px / Caption 13px | The 12–13px body is real and famously tiny — fieldoffice's signature. Heading sizes plausible. | ⚠️ Body too small for c4twweb (we use 17px) |
| Grid | 5px base | Plausible | ⚠️ |
| **Verdict** | Mid-quality. Palette mostly OK but body/heading font roles are inverted (sdrn is icons, not text). The 12px body is fieldoffice's intentional signature, not aspirational for our register. | **What we use:** `--text-muted` `#8F98A1` cool gray for archive/metadata, the documentary-archive layout pattern (project grid as if photographed on a surface). **Discard:** `sdrn` font, 12px body size. | ~40% skillui usable |

### Summary table

| Reference | Skillui usable | What we borrow |
|---|---:|---|
| Aesop | 0% (blocked) | Visual: cream chrome over photo, generous gutters, controlled hero |
| Kuraho | ~25% | Display-serif + sans-body pairing pattern, `--text-muted` warm gray |
| Mae Fah Luang | ~10% | Clay `#A26B60` (rescued from "unknown" bucket), photo-led editorial hero |
| Greeninhand | ~80% | Entire surface + earth palette, layout density logic |
| Fieldoffice | ~40% | Cool muted text token, archive-grid pattern |

**Net synthesis confidence:** The skillui CSS extraction alone would produce a wrong design system (4 of 5 references mis-extracted). But cross-checked against the visual screenshots, we can rescue the right tokens from each. The synthesis below is anchored mainly on greeninhand (the only fully accurate run), with rescued earth/clay tones from maefahluang and the muted-archive token from fieldoffice.

---

## Part 2 — c4twweb design system spec

### 2.1 Token map with provenance

Every token below is annotated with: `[source]:reference` and a confidence badge.

```css
:root {
  /* === Surfaces (anchor: greeninhand) === */
  --bg:           #FAF5EB; /* [skillui]:greeninhand ✅ — warm cream, dominant ground */
  --bg-pure:      #FFFFFF; /* [skillui]:greeninhand ✅ — pure white card surface */
  --bg-deep:      #F0E9D6; /* [synth]:greeninhand-derived — section break */
  --bg-ink:       #2B2B2B; /* [skillui]:greeninhand ✅ — inverted hero only */

  /* === Brand (anchor: 創照 logo, NOT from any reference) === */
  --sage:         #7A9B8A; /* [logo]:c4tw ✅ — hand-supports-Taiwan logo color */
  --sage-deep:    #5C7A6A; /* [synth]:logo-darkened — hover state */
  --sage-light:   #B8CDC1; /* [synth]:logo-tinted — subtle wash for tags */

  /* === Earth (anchor: greeninhand + maefahluang clay) === */
  --earth:        #9D896C; /* [skillui]:greeninhand ✅ — warm wood */
  --earth-deep:   #6F5436; /* [skillui]:greeninhand ✅ — deep wood */
  --earth-light:  #B3ADA0; /* [skillui]:greeninhand ✅ — soft taupe */
  --clay:         #A26B60; /* [skillui]:maefahluang ⚠️ — rescued from "unknown" — 伯拉罕 craft pages */
  --seal:         #BA2636; /* [skillui]:greeninhand ✅ — brand-seal red, chapter marks only */

  /* === Text (anchor: greeninhand + fieldoffice muted) === */
  --text:         #2B2B2B; /* [skillui]:greeninhand ✅ — primary headings/body */
  --text-body:    #62625A; /* [skillui]:greeninhand ✅ — long-form warm gray */
  --text-muted:   #8F98A1; /* [skillui]:fieldoffice ✅ — captions, metadata */
  --text-warm:    #424242; /* [skillui]:greeninhand ✅ — secondary on cream */
  --text-on-dark: #FAF5EB; /* [synth]:inverted-bg — text on dark hero blocks */

  /* === Accents (used sparingly) === */
  --warmth:       #D88444; /* [visual]:kuraho-splash ⚠️ — 226 actions ONLY (not from skillui's wrong #cc0000) */

  /* === Banned tokens — never reach for these === */
  /* #cc0000 (kuraho swiper-cookie noise — wrong red) */
  /* #007bff #dc3545 #28a745 (maefahluang Bootstrap defaults) */
  /* #1e1f26 #333333 #000000 (kuraho/maefahluang dark theme — inverted from real brand) */
}
```

### 2.2 Typography

```css
:root {
  /* zh-TW first (we are a Taiwanese organization) */
  --font-display:   "Noto Serif TC", "Source Han Serif TC", "PingFang TC", "Songti TC", serif;
  --font-body:      "Noto Sans TC", "Source Han Sans TC", "PingFang TC", system-ui, sans-serif;

  /* Latin (mission-statement quotes, eyebrows) */
  --font-latin-display: "Cormorant Garamond", "Noto Serif TC", serif;
  --font-latin-body:    "IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif;
}
```

**Provenance:** Skillui-extracted fonts (Tahoma, Lucida, sdrn, Roboto, Open Sans) are all rejected — they are CSS fallback chains or icon fonts, not the brand intent. Our zh-TW context demands proper TC fonts. Pattern-borrow: kuraho's Japanese-serif + sans pairing = our TC-serif + sans pairing.

**Banned per project taste-skill rubric:** Inter, Roboto, Open Sans, Lucida, Tahoma, Arial, Helvetica.

#### Type scale (editorial, generous — NOT skillui's compact 12–22px range)

| Role | Family | Desktop | Mobile | Line-height | Weight |
|---|---|---:|---:|---:|---:|
| H0 hero display | display | 72px | 44px | 1.1 | 400 |
| H1 page title | display | 56px | 36px | 1.15 | 400 |
| H2 section | display | 40px | 30px | 1.2 | 400 |
| H3 sub | display | 28px | 22px | 1.3 | 500 |
| Lead paragraph | body | 22px | 18px | 1.6 | 400 |
| Body | body | 17px | 16px | 1.75 | 400 |
| Caption | body | 14px | 13px | 1.5 | 400 |
| Eyebrow | body | 12px | 12px | 1.4 | 500 / `letter-spacing: 0.08em` / uppercase |

**Why bigger than greeninhand's H1=22px:** greeninhand is a magazine-density catalog. c4twweb is a hero-led social-movement site — needs editorial heroism (Aesop register, Mae Fah Luang register). Hero copy must carry a single sentence with weight.

### 2.3 Spacing

```css
:root {
  /* 8px base — airier than skillui's 4px (kuraho/maefahluang) and 5px (greeninhand/fieldoffice) */
  --space-1:   8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-5:  48px;
  --space-6:  64px;
  --space-7:  96px;
  --space-8: 128px;
  --space-9: 160px;
  --space-10: 192px;
}
```

| Range | Use |
|---|---|
| 8–16px | Caption ↔ image, eyebrow ↔ title |
| 24–32px | Paragraph spacing, card padding |
| 48–64px | Section breaks within a chapter |
| 96–128px | Major chapter breaks (hero → mission → 共生之家) |
| 160–192px | Page open/close breathing room |

**Why 8px not 4px or 5px:** skillui scraped 4px/5px from compact editorial sites, but our register is hero-led with documentary photography. 8px gives the air the photos need to breathe.

### 2.4 Layout

```css
:root {
  --max-page:    1280px;  /* main page container */
  --max-reading:  720px;  /* long-form story column (個案故事 / about) */
  --max-hero:    100vw;   /* full-bleed hero photos */
  --gutter-d:     80px;   /* desktop side margin */
  --gutter-m:     24px;   /* mobile side margin */
}
```

### 2.5 Border radius

```css
:root {
  --radius-0:  0;     /* default — editorial blocks (Mae Fah Luang / fieldoffice register) */
  --radius-1:  4px;   /* buttons, inputs */
  --radius-2:  8px;   /* small cards (sparingly) */
}
```

**Banned:** 9999px / pill / rounded-full. Skillui reported `2.5em` (kuraho) and `1.5em` (maefahluang) — both rejected because they came from polluted CSS (cookie banners, swiper controls).

### 2.6 Elevation

**Flat by default.** No box-shadow on cards (greeninhand register). Separation by:
1. Whitespace
2. 1px hairline `--earth-light` at top edge of card
3. Surface shift between `--bg` and `--bg-pure` or `--bg-deep`

Reject all skillui shadow tokens — `0 0 .8em 0 rgba(0,0,0,0.5)` (kuraho dark) and `0 0 0 .2rem rgba(0,123,255,.25)` (maefahluang Bootstrap focus ring) are wrong register.

### 2.7 Motion

```css
:root {
  --d-micro: 150ms;
  --d-state: 250ms;
  --d-page:  400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:  cubic-bezier(0.7, 0, 0.84, 0);
}
```

- Hover: opacity / color shift only — never scale/lift/shadow grow
- Page enter: subtle 12px fade-up on body content; hero photo no animation
- Always respect `prefers-reduced-motion`

**Banned per anti-pattern:** parallax, marquee, auto-video hero, cursor-follower, blur-on-scroll. (Skillui reported `expressive motion` for maefahluang based on `slideInUp/fadeIn/spinner-border` keyframes — those are Bootstrap default keyframes, not maefahluang's intent.)

---

## Part 3 — Components

Direct CSS-var references; no skillui code blocks copied verbatim (all polluted).

### 3.1 Hero — three approved patterns

**Pattern A — Photo-overlay hero (kuraho register)**
```
Full-bleed environmental photo (real human + real space)
Top: cream chrome strip 72px tall over photo with subtle 8% darken
Center copy block, max-width 720px:
  Eyebrow (eyebrow type)
  H0 display (--font-display, --text-on-dark)
  Lead paragraph (lead type, --text-on-dark @ 90% alpha)
  Single ghost button (--text-on-dark border, transparent fill)
```
Use for: Home, /共生之家 hub, /照顧學校 hub.

**Pattern B — Editorial craft hero (Mae Fah Luang register)**
```
Tight crop on craft/material/hands — humans implied, not centered
Bottom-left copy block 480px wide:
  Eyebrow
  H1 display
  Paragraph (body type)
  Ghost button "了解更多 →"
```
Use for: /部落幸福經濟, /個案故事 inner pages.

**Pattern C — Magazine-spread hero (fieldoffice register)**
```
Wide grid: 2-row composition of multiple project thumbnails as if laid on a surface
No primary copy — let the photos speak
Footer caption strip with --text-muted metadata
```
Use for: /共生之家 hub index, archive pages.

**❌ Banned hero patterns:**
- Center-stacked text on flat color (no photo)
- Stat counter hero
- Auto-rotating carousel
- Video-bg with overlaid CTA pile-up

### 3.2 Card (story / 據點 / 共生之家)

```css
.card {
  background: var(--bg);
  border: 0;
  box-shadow: none;
  padding: var(--space-4);  /* 32px */
}
.card::before {
  /* hairline top */
  content: "";
  display: block;
  height: 1px;
  background: var(--earth-light);
  margin-bottom: var(--space-3);
}
.card__photo { aspect-ratio: 4 / 3; }
.card__eyebrow { /* eyebrow type, --sage */ }
.card__title { /* H3 type */ }
.card__body { font: var(--font-body); color: var(--text-body); font-size: 17px; line-height: 1.75; }
```

### 3.3 Buttons — three states only

```css
/* Primary — only home hero CTA */
.btn-primary {
  background: var(--sage);
  color: var(--bg);
  border: 1px solid var(--sage);
  padding: 14px 28px;
  border-radius: var(--radius-1);
  font-family: var(--font-body);
}
.btn-primary:hover { background: var(--sage-deep); border-color: var(--sage-deep); }

/* Ghost — default for "了解更多 →" */
.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--text);
  padding: 14px 28px;
  border-radius: var(--radius-1);
}
.btn-ghost:hover { background: var(--text); color: var(--bg); }

/* Inline link in body copy */
.link {
  color: var(--sage-deep);
  text-decoration: underline 1px from-font;
  text-underline-offset: 4px;
}
.link:hover { color: var(--sage); }
```

### 3.4 Nav

```css
.nav {
  height: 72px;
  background: var(--bg);
  border-bottom: 1px solid transparent;     /* fades in on scroll */
  display: flex;
  align-items: center;
  padding: 0 var(--gutter-d);
}
.nav.scrolled { border-bottom-color: var(--earth-light); }
.nav__logo { /* 創照 wordmark, 32px height, --sage */ }
.nav__links { display: flex; gap: var(--space-4); }
.nav__link {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--text);
}
.nav__link.active {
  border-bottom: 1px solid var(--sage);
  padding-bottom: 4px;
}
```

### 3.5 Footer

```css
.footer {
  background: var(--bg-deep);
  padding: var(--space-7) var(--gutter-d) var(--space-5);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;     /* 家族陣列 | 聯繫 | 法定資訊 */
  gap: var(--space-5);
  font-size: 14px;
  color: var(--text-body);
}
```

---

## Part 4 — Photography rules

(Locked from `feedback_design_success_criteria.md`. Photos cannot be re-shot — work from existing pool only.)

### Hero-tier photo assignments

| Photo bucket | Chosen hero | Section target |
|---|---|---|
| 部落多代社區 | Pa-lahan 老奶奶 + 孩子互動 | Home hero (Pattern A) |
| 文山共生之家 | 5 人客廳活動 wide | /共生之家 hub hero (Pattern A) |
| 東勢爺爺 | 個案故事 portrait close | /個案故事/東勢爺爺 (Pattern B) |
| 杜格納烘焙 | 揉麵團集體 | /部落幸福經濟 hub (Pattern B) |
| CFT 課堂 | 林依瑩 + 學員多代 | /照顧學校 hub (Pattern A) |
| 林依瑩單人 | About / 創辦人語錄 | /關於 (Pattern B) |

### Photo treatment rules

- **No filters** — preserve documentary tonality
- **Warm white-balance preferred** — pull cool casts toward neutral
- **Tight on humans** — show face / hands / interaction; never empty room
- **Min 1 human per hero** — never landscape-only
- **Caption** = 14px `--text-body` italic eyebrow above with location/year
- **No duotone, no gradient overlays, no color washes**
- **No "photo + dark gradient + giant white text" Instagram-ad pattern**

---

## Part 5 — Anti-pattern checklist (gate-keeper rejects)

Reject any mock that contains:

- [ ] box-shadow on cards
- [ ] gradient backgrounds
- [ ] backdrop-blur / filter:blur
- [ ] rounded-full / pill buttons / 9999px radius
- [ ] 3-column generic icon-tile cards (e.g. "❤️ 人本 / 🌱 永續 / 🤝 共生")
- [ ] Hero stat-counter rows
- [ ] Center-stacked text hero with no photo backing
- [ ] Teal CTA color (sage `#7A9B8A` is brand — never tech-teal)
- [ ] Banned fonts: Inter, Roboto, Open Sans, Lucida, Tahoma, Arial
- [ ] Photo + dark gradient + giant white text (Instagram-ad register)
- [ ] Auto-rotating carousel hero
- [ ] Comparison framings ("不是 X，是 Y") used as hero copy
- [ ] Bootstrap status colors `#007bff` / `#dc3545` / `#28a745`
- [ ] Dark theme anywhere (cream is the brand ground)
- [ ] `#cc0000` red anywhere (it's swiper-noise from kuraho's CSS, not a real brand color)

---

## Part 6 — How references map to v8 axes

| v8 axis | Reference borrow | Specific |
|---|---|---|
| V1 以人為本 + V11 共生之家 | greeninhand + fieldoffice | cream surface, photo-led editorial grid |
| V3 在地跨專業 + V9 文化嵌入 | greeninhand + 暮しの保健室 | warm wood register, multi-gen documentary photos |
| V5 降階實踐 + V8 急重症共生 | One-Forty (memory) + Aesop visual | story-led editorial typography, controlled hero |
| V7 部落幸福經濟 | Mae Fah Luang | weaving / craft heritage detail crops + clay accent on sub-pages |
| V13 整體 typography hierarchy | Aesop visual + Mae Fah Luang visual | controlled H1, generous gutters, single hero focal point |

---

## Part 7 — Handoff bundle for Claude Design

When invoking the `claude-design` skill via Chrome 9224, paste this set:

1. **This document** sections 2.1 → 3.5 verbatim (token map + typography + components)
2. **Section 4** photography rules + the 6 hero photo assignments
3. **Section 5** anti-pattern checklist
4. **The 12 hero photos** from the curated subset of `synthesis/14-photo-inventory.md`
5. **The v8 對外語錄** (hero copy + section openings) from `synthesis/12-integration-v8.md`
6. **The 創照 logo SVG** from `assets/photos/logo/`

**Do NOT paste** the raw skillui DESIGN.md / SKILL.md outputs — they are mostly CSS noise contaminated with framework defaults, cookie-banner styles, and icon fonts. The synthesis above is the cleaned-up product.

---

## Part 8 — Open questions for Thomas review

1. **Secondary brand color — `--clay` for 部落 / 伯拉罕 sub-pages?** Currently in spec as `#A26B60` (rescued from maefahluang). Alternative: keep monolithic on `--sage` and use `--clay` only as a tag/badge tint. Preview before commit.

2. **8px grid — confirm?** Skillui scraped 4px (kuraho/maefahluang) and 5px (greeninhand/fieldoffice). I chose 8px because our register is hero-led with documentary photography, which needs more air than magazine-density layouts.

3. **Display font — confirm Noto Serif TC?** Alternatives: Source Han Serif TC, GenYoMin TC, 蘭亭明朝體. All open-license. Noto Serif TC is the most universal install + Google Fonts CDN reliable.

4. **`--warmth` `#D88444` accent** — kuraho's splash orange. Spec says "226 actions ONLY". Alternative: drop entirely, use `--seal` `#BA2636` brush-red as the only pop. Decision pending whether 226 deserves a visual hook.

5. **H0 hero size 72px desktop — confirm?** Aesop and Mae Fah Luang both run smaller hero copy (~48–56px). 72px is closer to social-movement-poster register; safer 56px is closer to corporate editorial.
