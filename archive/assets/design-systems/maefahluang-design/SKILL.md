---
name: maefahluang-design
description: Design system skill for maefahluang. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# maefahluang Design System

You are building UI for **maefahluang**. Dark-themed, neutral palette, sans-serif typography (Roboto), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![maefahluang Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — Roboto for body/UI text, Montserrat for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **neutral palette** — the color temperature runs neutral, matching the sans-serif typography.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#000000` | Page/app background |
| Surface | `--surface` | `#1e1f26` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#ffffff` | Headings, body text |
| Text Muted | `--text-muted` | `#6c757d` | Captions, placeholders |
| Border | `--border` | `#333333` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#155724` | Confirmations, positive trends |
| Warning | `#ffc107` | Caution states, pending items |
| Danger | `#dc3545` | Errors, destructive actions |

### Extended Palette

- **primary:** `#007bff`
- `#f0f0f0` — Light surface or highlight color
- **success:** `#28a745` — Confirmations, positive trend indicators
- `#dddddd`
- **info:** `#1ea0c3`
- `#495057`
- `#5a6268`
- `#40464d`

### CSS Variable Tokens

```css
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
```

## Typography

### Font Stack

- **Roboto** — Heading 1, Heading 2, Heading 3
- **Montserrat** — Body, Caption
- **SFMono-Regular** — Code

### Font Sources

```css
@font-face {
  font-family: "DTKaLaTeXaText-Regular";
  src: url("fonts/DTKaLaTeXaText-Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaText-Bold";
  src: url("fonts/DTKaLaTeXaText-Bold-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaDisplay-Regular";
  src: url("fonts/DTKaLaTeXaDisplay-Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaDisplay-Bold";
  src: url("fonts/DTKaLaTeXaDisplay-Bold-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "K2D-Light";
  src: url("fonts/K2D-Light-300.woff2") format("woff2");
  font-weight: 300;
}
@font-face {
  font-family: "K2D-Default";
  src: url("fonts/K2D-Default-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "K2D-Medium";
  src: url("fonts/K2D-Medium-600.woff2") format("woff2");
  font-weight: 600;
}
@font-face {
  font-family: "K2D-Bold";
  src: url("fonts/K2D-Bold-800.woff2") format("woff2");
  font-weight: 800;
}
@font-face {
  font-family: "K2D-Thin";
  src: url("fonts/K2D-Thin-100.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "so-slider-pointers";
  src: url("fonts/so-slider-pointers-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "sow-ionicons";
  src: url("fonts/sow-ionicons-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "feature-background";
  src: url("fonts/feature-background-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "Roboto";
  src: url("fonts/Roboto-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Roboto";
  src: url("fonts/Roboto-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Roboto | 200px | 700 |
| Heading 2 | Roboto | 6rem | 700 |
| Heading 3 | Roboto | 90px | 700 |
| Body | Montserrat | 1rem | 400 |
| Caption | Montserrat | 1.25rem | 400 |
| Code | SFMono-Regular | 14px | 400 |

### Typography Rules

- Body/UI: **Roboto**, Headings: **Montserrat** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 26` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `2em, inherit, 0em, .1em, .2rem, .25rem, .3rem, .5rem, 0.75rem, 1rem, 1.5em, 3px, 5px, 6px, 8px, 10rem, 10px, 15px, 20px, 50rem`
Default: `1.5em`

### Container

Max-width: `991px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| sm | 37.5em |
| xs | 360px |
| xs | 375px |
| xs | 400px |
| xs | 425px |
| xs | 480px |
| sm | 500px |
| sm | 520px |
| sm | 560px |
| sm | 575.98px |
| sm | 576px |
| sm | 600px |
| sm | 610px |
| md | 650px |
| md | 767px |
| md | 767.98px |
| md | 768px |
| lg | 769px |
| lg | 780px |
| lg | 781px |
| lg | 782px |
| lg | 900px |
| lg | 960px |
| lg | 975px |
| lg | 991px |
| lg | 991.98px |
| lg | 992px |
| lg | 1024px |
| xl | 1025px |
| xl | 1100px |
| xl | 1199px |
| xl | 1199.98px |
| xl | 1200px |
| xl | 1280px |
| 2xl | 1281px |
| 2xl | 1440px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #1e1f26;
  border: 1px solid #333333;
  border-radius: 1.5em;
  padding: 16px;
  box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #444444;
  color: #ffffff;
  border-radius: 1.5em;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #333333;
  color: #ffffff;
  border-radius: 1.5em;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #000000;
  border: 1px solid #333333;
  border-radius: 1.5em;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
}
.input:focus { border-color: var(--accent); outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #1e1f26;
  color: #6c757d;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #1e1f26;
  border: 1px solid #333333;
  border-radius: 50rem;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 0 10px rgba(0,0,0,0.6);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #333333;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #333333;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #333333;
}
.nav-link {
  color: #6c757d;
  padding: 8px 12px;
  border-radius: 1.5em;
  transition: color 150ms;
}
.nav-link:hover { color: #ffffff; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**Card** (`html`)
- Variants: `shadow`, `green`, `column`, `item`

**Navigation** (`html`)

**Badge** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (29 items)
- **Hero** — Hero/banner section with headline and CTAs
- **Features** — Feature/benefit cards grid (38 items)
- **Footer** — Page footer with links and info (33 items)
- **Testimonials** — Testimonials/reviews section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `sgb-focusfade`
- `progress-bar-stripes`
- `spinner-border`
- `spinner-grow`
- `fa-spin`

### Motion Tokens

- **Duration scale:** `0s`, `0ms`, `0.001s`, `0.5s`, `.75s`, `1s`, `2s`, `100ms`, `150ms`, `170ms`, `250ms`, `300ms`, `350ms`, `400ms`, `500ms`, `600ms`
- **Easing functions:** `linear`, `ease`, `ease-in-out`, `ease-out`, `cubic-bezier(.215,.61,.355,1)`, `cubic-bezier(.755,.05,.855,.06)`, `ease-in`, `cubic-bezier(.55,.055,.675,.19)`, `cubic-bezier(.175,.885,.32,1)`
- **Animated properties:** `opacity`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0s) for micro-interactions, long (600ms) for page transitions
- **Easing:** Use `linear` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)`
- Subtle: `0 0 2px 2px rgba(0,0,0,0.6)`
- Raised (cards, buttons): `0 0 0 .2rem rgba(0,123,255,.25)`
- Raised (cards, buttons): `0 0 0 .2rem rgba(40,167,69,.25)`
- Raised (cards, buttons): `0 0 0 .2rem rgba(220,53,69,.25)`
- Raised (cards, buttons): `0 0 0 .2rem rgba(38,143,255,.5)`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 7, 10, 12, 13, 15, 20, 21, 25, 100, 101, 999, 1000, 1001, 1020, 1030, 1040, 1050, 1060, 1070, 9999, 100000, 1000000`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Roboto and Montserrat and SFMono-Regular are allowed
- **No arbitrary border-radius** — use the scale: 2em, 0em, .1em, .2rem, .25rem, .3rem, .5rem, 0.75rem, 1rem, 1.5em
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Roboto, Montserrat, SFMono-Regular only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `https://www.maefahluang.org/wp-content/uploads/2021/04/logo-mflf-favicon-150x150.png`
- **Site URL:** `https://www.maefahluang.org/en/homepage/`
- **Brand typeface:** Roboto

## Quick Reference

```
Background:     #000000
Surface:        #1e1f26
Text:           #ffffff / #6c757d
Accent:         (not extracted)
Border:         #333333
Font:           Roboto
Spacing:        4px grid
Radius:         1.5em
Components:     9 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for maefahluang
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "maefahluang" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# maefahluang DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 9
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![maefahluang Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a neutral tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **Montserrat** for display/headings with **Roboto** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| wp--preset--color--black | `#000000` | background | Page background, darkest surface |
| surface | `#1e1f26` | surface | Card and panel backgrounds |
| wp--preset--color--white | `#ffffff` | text-primary | Headings and body text |
| secondary | `#6c757d` | text-muted | Captions, placeholders, secondary info |
| border | `#333333` | border | Dividers, card borders, outlines |
| danger | `#dc3545` | danger | Error states, destructive actions |
| success | `#155724` | success | Success states, positive indicators |
| warning | `#ffc107` | warning | Warning states, caution indicators |
| primary | `#007bff` | info | Informational highlights |
| unknown | `#f0f0f0` | unknown | Palette color |
| success | `#28a745` | unknown | Palette color |
| unknown | `#dddddd` | unknown | Palette color |
| info | `#1ea0c3` | unknown | Palette color |
| unknown | `#495057` | unknown | Palette color |
| unknown | `#5a6268` | unknown | Palette color |
| unknown | `#40464d` | unknown | Palette color |
| wp--preset--color--cyan-bluish-gray | `#b3b7bb` | unknown | Palette color |
| unknown | `#b8daff` | unknown | Palette color |
| wp--preset--color--vivid-red | `#c82333` | unknown | Palette color |
| unknown | `#4aa646` | unknown | Palette color |

### CSS Variable Tokens

```css
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
--primary: #007bff;
--secondary: #6c757d;
```


---

## 3. Typography Rules

**Font Stack:**
- **Roboto** — Heading 1, Heading 2, Heading 3
- **Montserrat** — Body, Caption
- **SFMono-Regular** — Code

**Font Sources:**

```css
@font-face {
  font-family: "DTKaLaTeXaText-Regular";
  src: url("fonts/DTKaLaTeXaText-Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaText-Bold";
  src: url("fonts/DTKaLaTeXaText-Bold-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaDisplay-Regular";
  src: url("fonts/DTKaLaTeXaDisplay-Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaDisplay-Bold";
  src: url("fonts/DTKaLaTeXaDisplay-Bold-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "K2D-Light";
  src: url("fonts/K2D-Light-300.woff2") format("woff2");
  font-weight: 300;
}
@font-face {
  font-family: "K2D-Default";
  src: url("fonts/K2D-Default-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "K2D-Medium";
  src: url("fonts/K2D-Medium-600.woff2") format("woff2");
  font-weight: 600;
}
@font-face {
  font-family: "K2D-Bold";
  src: url("fonts/K2D-Bold-800.woff2") format("woff2");
  font-weight: 800;
}
@font-face {
  font-family: "K2D-Thin";
  src: url("fonts/K2D-Thin-100.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "so-slider-pointers";
  src: url("fonts/so-slider-pointers-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "sow-ionicons";
  src: url("fonts/sow-ionicons-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "feature-background";
  src: url("fonts/feature-background-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "Roboto";
  src: url("fonts/Roboto-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Roboto";
  src: url("fonts/Roboto-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Roboto | 200px | 700 |
| Heading 2 | Roboto | 6rem | 700 |
| Heading 3 | Roboto | 90px | 700 |
| Body | Montserrat | 1rem | 400 |
| Caption | Montserrat | 1.25rem | 400 |
| Code | SFMono-Regular | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **Roboto** for body/UI text, **Montserrat** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (3)

**Card** — `html`
- Variants: `shadow`, `green`, `column`, `item`

**Badge** — `html`

**List** — `html`

### Data Input (1)

**Button** — `html`
- Animation: 

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 26
- **Border radius:** 2em, inherit, 0em, .1em, .2rem, .25rem, .3rem, .5rem, 0.75rem, 1rem, 1.5em, 3px, 5px, 6px, 8px, 10rem, 10px, 15px, 20px, 50rem
- **Max content width:** 991px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)`
- `0 0 2px 2px rgba(0,0,0,0.6)`

### Raised — cards, buttons, interactive elements

- `0 0 0 .2rem rgba(0,123,255,.25)`
- `0 0 0 .2rem rgba(40,167,69,.25)`
- `0 0 0 .2rem rgba(220,53,69,.25)`

### Floating — dropdowns, popovers, modals

- `0 0 10px rgba(0,0,0,0.6)`
- `0 11px 12px rgba(0,0,0,0.5)`
- `0 4px 10px rgba(0,0,0,0.2)`

### Overlay — full-screen overlays, top-level dialogs

- `inset 0 0 0 99999px rgba(0,0,0,.05)`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 7, 10, 12, 13, 15, 20, 21, 25, 100, 101, 999, 1000, 1001, 1020, 1030, 1040, 1050, 1060, 1070, 9999, 100000, 1000000`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes sgb-focusfade`
- `@keyframes progress-bar-stripes`
- `@keyframes spinner-border`
- `@keyframes spinner-grow`
- `@keyframes fa-spin`
- `@keyframes fadeIn`
- `@keyframes fadeOut`
- `@keyframes slideInUp`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#000000` as the primary page background
- Pair **Roboto** (body) with **Montserrat** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2em, inherit, 0em, .1em, .2rem
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Roboto and Montserrat and SFMono-Regular
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 37.5em | css |
| xs | 360px | css |
| xs | 375px | css |
| xs | 400px | css |
| xs | 425px | css |
| xs | 480px | css |
| sm | 500px | css |
| sm | 520px | css |
| sm | 560px | css |
| sm | 575.98px | css |
| sm | 576px | css |
| sm | 600px | css |
| sm | 610px | css |
| md | 650px | css |
| md | 767px | css |
| md | 767.98px | css |
| md | 768px | css |
| lg | 769px | css |
| lg | 780px | css |
| lg | 781px | css |
| lg | 782px | css |
| lg | 900px | css |
| lg | 960px | css |
| lg | 975px | css |
| lg | 991px | css |
| lg | 991.98px | css |
| lg | 992px | css |
| lg | 1024px | css |
| xl | 1025px | css |
| xl | 1100px | css |
| xl | 1199px | css |
| xl | 1199.98px | css |
| xl | 1200px | css |
| xl | 1280px | css |
| 2xl | 1281px | css |
| 2xl | 1440px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #1e1f26
Border: 1px solid #333333
Radius: 1.5em
Padding: 16px
Font: Roboto
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border #333333
Padding: 8px 16px
Radius: 1.5em
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #000000
Max-width: 991px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #1e1f26
Label: #6c757d (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #000000
Input border: 1px solid #333333
Focus: border-color var(--accent)
Label: #6c757d 12px
Spacing: 16px between fields
Radius: 1.5em
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Roboto, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/DTKaLaTeXaDisplay-Bold-Regular.woff`
- `fonts/DTKaLaTeXaDisplay-Bold-Regular.woff2`
- `fonts/DTKaLaTeXaDisplay-Regular-Regular.woff`
- `fonts/DTKaLaTeXaDisplay-Regular-Regular.woff2`
- `fonts/DTKaLaTeXaText-Bold-Regular.woff`
- `fonts/DTKaLaTeXaText-Bold-Regular.woff2`
- `fonts/DTKaLaTeXaText-Regular-Regular.woff`
- `fonts/DTKaLaTeXaText-Regular-Regular.woff2`
- `fonts/K2D-Bold-800.woff`
- `fonts/K2D-Bold-800.woff2`
- `fonts/K2D-Default-Regular.woff`
- `fonts/K2D-Default-Regular.woff2`
- `fonts/K2D-Light-300.woff`
- `fonts/K2D-Light-300.woff2`
- `fonts/K2D-Medium-600.woff`
- `fonts/K2D-Medium-600.woff2`
- `fonts/K2D-Thin-100.woff`
- `fonts/K2D-Thin-100.woff2`
- `fonts/Montserrat-Black.ttf`
- `fonts/Montserrat-Bold.ttf`
- `fonts/Montserrat-ExtraBold.ttf`
- `fonts/Montserrat-ExtraLight.ttf`
- `fonts/Montserrat-Light.ttf`
- `fonts/Montserrat-Medium.ttf`
- `fonts/Montserrat-Regular.ttf`
- `fonts/Montserrat-SemiBold.ttf`
- `fonts/Montserrat-Thin.ttf`
- `fonts/Roboto-Black.ttf`
- `fonts/Roboto-Bold.ttf`
- `fonts/Roboto-ExtraBold.ttf`
- `fonts/Roboto-ExtraLight.ttf`
- `fonts/Roboto-Light.ttf`
- `fonts/Roboto-Medium.ttf`
- `fonts/Roboto-Regular.ttf`
- `fonts/Roboto-SemiBold.ttf`
- `fonts/Roboto-Thin.ttf`
- `fonts/feature-background-Regular.ttf`
- `fonts/feature-background-Regular.woff`
- `fonts/so-slider-pointers-Regular.ttf`
- `fonts/so-slider-pointers-Regular.woff`
- `fonts/sow-ionicons-Regular.ttf`
- `fonts/sow-ionicons-Regular.woff`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

