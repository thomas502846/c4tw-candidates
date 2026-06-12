# c4twweb Design System v1

> Synthesis from the locked 5-piece reference set after skillui static-CSS extraction
> ran on 2026-05-10. skillui was unreliable on JS-heavy sites (Aesop blocked outright,
> Mae Fah Luang / Fieldoffice screenshots blank, Kuraho captured only the splash). Greeninhand
> was the only fully accurate skillui run. Therefore this v1 is built from
> **visual extraction of `/home/thomas/c4twweb/assets/references/*.png`** plus
> the salvageable parts of greeninhand-design + kuraho splash accent.
>
> **Anchor that overrides everything:** 創照 logo sage `~#7A9B8A` (hand-supports-Taiwan).

---

## 1. Brand register in one sentence

**溫暖編輯式・部落木質感・以人為中心的社會運動** — warm editorial, wood/earth grounded, human-first social movement. Not journalism (cold), not lifestyle (fluff), not corporate (fluffy), not NGO (mournful).

---

## 2. Color tokens

### Surface

| Token | Hex | Source | Use |
|---|---|---|---|
| `--bg` | `#FAF5EB` | greeninhand | Page background — warm cream, the dominant ground |
| `--bg-pure` | `#FFFFFF` | kuraho café walls | Pure-white surface for photo-heavy cards |
| `--bg-deep` | `#F0E9D6` | greeninhand cards | Subtle section break, panels |
| `--bg-ink` | `#2B2B2B` | greeninhand text | Inverted hero blocks (used sparingly) |

### Brand

| Token | Hex | Source | Use |
|---|---|---|---|
| `--sage` | `#7A9B8A` | 創照 logo | Brand anchor — links, brand wordmark, single accent |
| `--sage-deep` | `#5C7A6A` | logo darkened | Hover state, body-text accents |
| `--sage-light` | `#B8CDC1` | logo tinted | Subtle background washes, tags |

### Earth (community / craft / 部落)

| Token | Hex | Source | Use |
|---|---|---|---|
| `--earth` | `#9D896C` | greeninhand | 部落 / 工藝 section palettes |
| `--earth-deep` | `#6F5436` | greeninhand | Deep wood text-on-cream |
| `--clay` | `#A26B60` | maefahluang weaving | 伯拉罕 craft / heritage tag color |

### Text

| Token | Hex | Source | Use |
|---|---|---|---|
| `--text` | `#2B2B2B` | greeninhand | Headings, primary body |
| `--text-body` | `#62625A` | greeninhand | Long-form body text — warm gray, not pure black |
| `--text-muted` | `#8F98A1` | fieldoffice | Captions, metadata, time stamps |
| `--text-on-dark` | `#FAF5EB` | inverted bg | Text on dark hero blocks |

### Accent — used sparingly, never as decoration

| Token | Hex | Source | Use |
|---|---|---|---|
| `--warmth` | `#D88444` | kuraho splash | 226 actions / time-sensitive callouts ONLY |
| `--seal` | `#B8412C` | greeninhand brush seal | Brand seal / chapter mark only |

### What we explicitly DON'T have
- ❌ No teal — even though "tech-feeling" sites use it; sage is the brand, period
- ❌ No bright red CTA (`#cc0000` from kuraho's CSS scrape was video-controls noise)
- ❌ No Bootstrap blue / success-green / danger-red (`#007bff`, `#28a745`, `#dc3545` from maefahluang scrape were framework defaults)

---

## 3. Typography

### Stack (zh-TW first)

```css
--font-display: "Noto Serif TC", "Source Han Serif TC", "PingFang TC", serif;
--font-body:    "Noto Sans TC", "Source Han Sans TC", "PingFang TC", system-ui, sans-serif;
--font-latin-display: "Cormorant Garamond", "Noto Serif TC", serif;
--font-latin-body:    "IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif;
```

**Banned (per taste-skill rubric):** Inter, Roboto, Open Sans, Lucida, Tahoma, Arial.

### Scale (editorial, generous, not compact)

| Role | Family | Size desktop | Size mobile | Line-height | Weight |
|---|---|---|---|---|---|
| Display H0 (hero) | display | 72px | 44px | 1.1 | 400 |
| H1 | display | 56px | 36px | 1.15 | 400 |
| H2 | display | 40px | 30px | 1.2 | 400 |
| H3 | display | 28px | 22px | 1.3 | 500 |
| Lead | body | 22px | 18px | 1.6 | 400 |
| Body | body | 17px | 16px | 1.75 | 400 |
| Caption | body | 14px | 13px | 1.5 | 400 |
| Eyebrow | body | 12px | 12px | 1.4 | 500 / tracking 0.08em uppercase |

### Type rules

- **No more than 3 weights per page** — display 400, body 400, eyebrow 500
- Headings use **serif display only** (Noto Serif TC / Cormorant) — never sans
- Body uses **sans only** — never serif (kills readability on long zh-TW)
- Eyebrows are uppercase Latin or 12px zh-TW with letter-spacing
- Line-length: max 38–42 zh characters / 65–75 Latin chars per line
- **Never** use centered text for body paragraphs — only for hero overlays + section eyebrows

---

## 4. Spacing & grid

### 8px base grid (airier than skillui's 4px default)

Scale: `8, 16, 24, 32, 48, 64, 96, 128, 160, 192`

### Spacing as meaning

| Range | Use |
|---|---|
| 8–16px | Tight: caption to image, eyebrow to title |
| 24–32px | Within a section: paragraph spacing, card padding |
| 48–64px | Between sections inside the same chapter |
| 96–128px | Major chapter breaks (hero → mission, mission → 共生之家) |
| 160–192px | Page-opening / page-closing breathing room |

### Layout containers

- **Max page width:** 1280px
- **Editorial reading column:** 720px (long-form story)
- **Photo-led full-bleed:** 100vw with cropped figure
- **Side-margin minimum:** 24px mobile / 80px desktop

### Border radius

- `0` — default for editorial blocks (Mae Fah Luang / Fieldoffice register)
- `4px` — buttons, input fields
- `8px` — small cards (sparingly)
- **Never** 9999px / pill / rounded-full

---

## 5. Components

### Hero — three approved patterns

**A. Photo-overlay hero (kuraho register)**
Full-bleed environmental photo (real space with humans). Serif display copy in white-cream `#FAF5EB`, semi-transparent or with subtle darken layer. Top-aligned brand strip cream over photo.

**B. Editorial weaving hero (Mae Fah Luang register)**
Tight crop on a craft/material detail with humans (loom, soil, hands, food). Smaller serif copy block bottom-left with paragraph + ghost button "了解更多 →".

**C. Magazine-spread hero (fieldoffice register)**
Wide grid of multiple project thumbnails laid out as if photographed on a physical surface. Used only for archive / project-index pages (e.g. /共生之家 hub).

❌ **Banned hero patterns:**
- Center-stacked text on flat color (no photo backing)
- Stat counter hero (e.g. "服務 12,000 人 → 100 位學員 → ...")
- Carousel hero with auto-rotating slides
- Video-bg hero with overlaid CTA buttons

### Card (story / 據點 / 共生之家)

```
Background: --bg (cream) — NOT a separate card surface
Border: none
Shadow: none
Separation: whitespace + thin 1px hairline `--earth` only at top edge
Photo: 4:3 or 3:2 aspect, cropped
Title: H3 serif display
Eyebrow: 12px uppercase --sage
Body: 17px --text-body
Padding: 32px outer / 16px between elements
```

### Button — three states only

```
Primary (rare — only home hero CTA):
  Background: --sage
  Color: --bg (cream)
  Border: 1px solid --sage
  Padding: 14px 28px
  Radius: 4px
  Hover: bg --sage-deep

Ghost (default for "了解更多 →"):
  Background: transparent
  Color: --text
  Border: 1px solid --text
  Padding: 14px 28px
  Radius: 4px
  Hover: bg --text, color --bg

Inline link (in body copy):
  Color: --sage-deep
  Text-decoration: underline 1px from-font, offset 4px
  Hover: color --sage
```

### Nav (top bar)

```
Height: 72px
Background: --bg (cream) — flat, no transparency, no blur
Border-bottom: 1px solid --earth (only at scroll > 0, soft hairline)
Logo: 創照 wordmark left, 32px height, brand sage
Links: serif 16px, --text, gap 32px between
Active link: underline 1px --sage, offset 8px
Mobile: hamburger right, drawer slides from right with cream bg
```

### Footer

```
Background: --bg-deep
Padding: 96px top / 48px bottom
Layout: 3-column on desktop (家族陣列 | 聯繫 | 法定資訊), stacked on mobile
Type: body 14px --text-body
Logo wordmark cream-on-dark version, 48px height
```

---

## 6. Photography direction

(Locked from `feedback_design_success_criteria.md` — photos cannot be re-shot)

### Hero-tier photos (must use existing pool)

| Photo bucket | Chosen hero | Section |
|---|---|---|
| 部落多代社區 | Pa-lahan 老奶奶 + 孩子互動 | Home hero A |
| 文山共生之家 | 5 人客廳活動 wide-shot | /共生之家 hub hero |
| 東勢爺爺 | 個案故事 portrait | /個案故事/東勢爺爺 |
| 杜格納烘焙 | 揉麵團集體 | /部落幸福經濟 hub |
| CFT 課堂 | 林依瑩 + 學員多代 | /照顧學校 hub |
| 林依瑩單人 | About / 創辦人語錄 | /關於 |

### Photo treatment rules

- **No filters** — keep documentary tonality
- **Warm white-balance** preferred — pull cool-cast photos toward neutral
- **Crop tight on humans** — show face / hands / interaction, not empty room
- **One human minimum per hero** — never landscape-only on hero
- **Caption in 14px** — `--text-body`, italic eyebrow above with location/year
- **No duotone, no overlay color washes** — photos stand on their own
- **No "photo + gradient + giant white text" Instagram-ad pattern**

---

## 7. Motion

```
--duration-micro: 150ms;
--duration-state: 250ms;
--duration-page:  400ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in:  cubic-bezier(0.7, 0, 0.84, 0);
```

- Hover: opacity / color shift only — no scale, no lift, no shadow grow
- Page enter: subtle fade-up (12px) on body content, hero photo no animation
- Scroll-trigger: only for chapter eyebrow underline draw — nothing parallax
- **Always respect `prefers-reduced-motion`**

❌ **Banned motion:**
- Parallax scroll
- Auto-playing video hero
- Marquee tickers
- Cursor-following effects
- Blur-on-scroll

---

## 8. Anti-pattern checklist (what gates "fail")

Reject any mock that contains:

- [ ] box-shadow on cards
- [ ] gradient backgrounds
- [ ] backdrop-blur
- [ ] rounded-full / pill buttons
- [ ] 3-column generic icon-tile cards ("我們的價值: ❤️ 人本 / 🌱 永續 / 🤝 共生")
- [ ] hero stat counters
- [ ] center-stacked text hero with no photo
- [ ] teal CTA color (sage is brand)
- [ ] Inter / Roboto / Open Sans
- [ ] photo with white-text + dark gradient overlay (Instagram-ad register)
- [ ] auto-carousel hero
- [ ] fluffy comparison framings ("不是 X，是 Y")

---

## 9. Reference axis mapping

How the 5 locked references map to v8 V-axes:

| v8 axis | Reference borrow | What |
|---|---|---|
| V1 以人為本 + V11 共生之家 | greeninhand + fieldoffice | cream surface + documentary photo grid |
| V3 在地跨專業 + V9 文化嵌入 | greeninhand + 暮しの保健室 | warm wood community register, multi-gen photos |
| V5 降階實踐 + V8 急重症共生 | One-Forty + Aesop | story-led editorial typography hierarchy |
| V7 部落幸福經濟 | Mae Fah Luang | weaving / craft heritage detail crops |
| V13 整體 typography | Aesop + Mae Fah Luang | controlled H1, generous gutters |

---

## 10. Handoff: what Claude Design gets

When invoking the claude-design skill, paste:

1. This document (sections 2-7) verbatim
2. The 12 hero photos from `/home/thomas/c4twweb/assets/photos/` (curated subset of `14-photo-inventory.md`)
3. The v8 對外語錄 (hero copy + section openings) from `synthesis/12-integration-v8.md`
4. The 創照 logo SVG from `/home/thomas/c4twweb/assets/photos/logo/`

Do **not** paste the full skillui DESIGN.md outputs — they are CSS noise contaminated with framework defaults.

---

## Open question for Thomas review

- Do we want a "secondary brand color" (e.g. --clay for 伯拉罕 / 部落 sub-pages) or keep everything monolithic on --sage? Current draft uses `--clay #A26B60` as a 部落-page tag color — preview before commit.
- 8px grid acceptable? (skillui scraped 4px from these sites, but compact density doesn't fit our register — editorial wants air.)
- Display serif: confirm Noto Serif TC over alternatives like 思源宋體 / Source Han Serif TC / GenYoMin TC.
