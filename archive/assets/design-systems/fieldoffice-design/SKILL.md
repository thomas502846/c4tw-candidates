---
name: fieldoffice-design
description: Design system skill for fieldoffice. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# fieldoffice Design System

You are building UI for **fieldoffice**. Light-themed, neutral palette, sans-serif typography (Open Sans), standard density on a 5px grid.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![fieldoffice Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — Open Sans for body/UI text, sdrn for headings/display. Never introduce a third typeface.
- **standard density** — 5px base grid. Every dimension is a multiple of 5.
- **neutral palette** — the color temperature runs neutral, matching the sans-serif typography.
- **Subtle motion** — transitions smooth state changes. Keep durations under 300ms, use ease-out curves.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#f2f2f2` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#2e2e2e` | Headings, body text |
| Text Muted | `--text-muted` | `#8f98a1` | Captions, placeholders |
| Border | `--border` | `#555d66` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Warning | `#f9e848` | Caution states, pending items |
| Danger | `#f8725c` | Errors, destructive actions |

### Extended Palette

- `#000000` — Deep background layer or shadow color
- `#666666`
- `#d3d3d3`
- `#0d0d0d` — Deep background layer or shadow color
- `#c8c8c8`
- `#dddddd`
- `#f1da17`
- `#4a3f21`

## Typography

### Font Stack

- **Open Sans** — Heading 1, Heading 2, Heading 3
- **sdrn** — Body, Caption

### Font Sources

```css
@font-face {
  font-family: "sdrn";
  src: url("fonts/sdrn-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "Open Sans";
  src: url("fonts/OpenSans-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Open Sans";
  src: url("fonts/OpenSans-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Open Sans | 48px | 700 |
| Heading 2 | Open Sans | 42px | 700 |
| Heading 3 | Open Sans | 36px | 700 |
| Body | sdrn | 12px | 400 |
| Caption | sdrn | 13px | 400 |

### Typography Rules

- Body/UI: **Open Sans**, Headings: **sdrn** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 5px

Every dimension (margin, padding, gap, width, height) must be a multiple of **5px**.

### Spacing Scale

`5, 10, 15, 20, 25, 30, 40, 45, 50, 55, 60, 70` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |

### Border Radius

Scale: `1px, 2em, 2px, 4px, 5px, 7px, 24px, 28px, 30px, 50px, 70px`
Default: `7px`

### Container

Max-width: `961px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 320px |
| xs | 321px |
| xs | 479px |
| xs | 480px |
| sm | 481px |
| sm | 600px |
| md | 767px |
| md | 768px |
| lg | 782px |
| lg | 959px |
| lg | 960px |
| lg | 961px |
| lg | 962px |
| lg | 1000px |
| lg | 1024px |
| xl | 1025px |
| xl | 1280px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #f2f2f2;
  border: 1px solid #555d66;
  border-radius: 7px;
  padding: 20px;
  box-shadow: 0px 2px 5px #a3a3a3;
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
  background: #cccccc;
  color: #2e2e2e;
  border-radius: 7px;
  padding: 10px 20px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #555d66;
  color: #2e2e2e;
  border-radius: 7px;
  padding: 10px 20px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #ffffff;
  border: 1px solid #555d66;
  border-radius: 7px;
  padding: 10px 15px;
  color: #2e2e2e;
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
  padding: 5px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #f2f2f2;
  color: #8f98a1;
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
  background: #f2f2f2;
  border: 1px solid #555d66;
  border-radius: 70px;
  padding: 30px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 0 0 5px #19F;
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
  padding: 10px 15px;
  font-weight: 500;
  font-size: 12px;
  color: #8f98a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #555d66;
}
.table td {
  padding: 15px;
  border-bottom: 1px solid #555d66;
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
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid #555d66;
}
.nav-link {
  color: #8f98a1;
  padding: 10px 15px;
  border-radius: 7px;
  transition: color 150ms;
}
.nav-link:hover { color: #2e2e2e; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

## Page Structure

The following page sections were detected:

- **Hero** — Hero section (detected from heading structure)

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without calling attention.

### Motion Tokens

- **Duration scale:** `100ms`, `300ms`
- **Easing functions:** `ease-in-out`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (100ms) for micro-interactions, long (300ms) for page transitions
- **Easing:** Use `ease-in-out` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `2px 0 0 rgba(0,0,0,0.05)`
- Raised (cards, buttons): `0px 2px 5px #a3a3a3`
- Raised (cards, buttons): `0 0 0 5px #19F`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 7, 9, 10, 98, 99, 999, 1000, 1001, 1100, 2000, 2500, 2600, 2700, 9500, 9999, 10000, 20000, 99997, 99998`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 5px
- **No extra fonts** — only Open Sans and sdrn are allowed
- **No arbitrary border-radius** — use the scale: 1px, 2em, 2px, 4px, 5px, 7px, 24px, 28px, 30px, 50px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Open Sans, sdrn only, using the type scale
4. **Build layout** on the 5px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `http://www.fieldoffice-architects.com/wp-content/uploads/2013/10/fav.jpg`
- **Site URL:** `http://www.fieldoffice-architects.com/`
- **Brand typeface:** Open Sans

## Quick Reference

```
Background:     #ffffff
Surface:        #f2f2f2
Text:           #2e2e2e / #8f98a1
Accent:         (not extracted)
Border:         #555d66
Font:           Open Sans
Spacing:        5px grid
Radius:         7px
Components:     3 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for fieldoffice
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "fieldoffice" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# fieldoffice DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 3
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![fieldoffice Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography pairs **sdrn** for display/headings with **Open Sans** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 40, 45px. Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#ffffff` | background | Page background, darkest surface |
| surface | `#f2f2f2` | surface | Card and panel backgrounds |
| text-primary | `#2e2e2e` | text-primary | Headings and body text |
| text-muted | `#8f98a1` | text-muted | Captions, placeholders, secondary info |
| border | `#555d66` | border | Dividers, card borders, outlines |
| danger | `#f8725c` | danger | Error states, destructive actions |
| warning | `#f9e848` | warning | Warning states, caution indicators |
| unknown | `#000000` | unknown | Palette color |
| unknown | `#666666` | unknown | Palette color |
| unknown | `#d3d3d3` | unknown | Palette color |
| unknown | `#0d0d0d` | unknown | Palette color |
| unknown | `#c8c8c8` | unknown | Palette color |
| unknown | `#dddddd` | unknown | Palette color |
| unknown | `#f1da17` | unknown | Palette color |
| unknown | `#4a3f21` | unknown | Palette color |
| unknown | `#acacac` | unknown | Palette color |
| unknown | `#888888` | unknown | Palette color |
| unknown | `#ee83b3` | unknown | Palette color |
| unknown | `#f9891b` | unknown | Palette color |
| unknown | `#b4da1b` | unknown | Palette color |


---

## 3. Typography Rules

**Font Stack:**
- **Open Sans** — Heading 1, Heading 2, Heading 3
- **sdrn** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "sdrn";
  src: url("fonts/sdrn-Regular.woff") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "Open Sans";
  src: url("fonts/OpenSans-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Open Sans";
  src: url("fonts/OpenSans-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Open Sans | 48px | 700 |
| Heading 2 | Open Sans | 42px | 700 |
| Heading 3 | Open Sans | 36px | 700 |
| Body | sdrn | 12px | 400 |
| Caption | sdrn | 13px | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **Open Sans** for body/UI text, **sdrn** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Data Display (1)

**List** — `html`

### Media (2)

**Image** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 40, 45, 50, 55, 60, 70
- **Border radius:** 1px, 2em, 2px, 4px, 5px, 7px, 24px, 28px, 30px, 50px, 70px
- **Max content width:** 961px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `2px 0 0 rgba(0,0,0,0.05)`

### Raised — cards, buttons, interactive elements

- `0px 2px 5px #a3a3a3`
- `0 0 0 5px #19F`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 7, 9, 10, 98, 99, 999, 1000, 1001, 1100, 2000, 2500, 2600, 2700, 9500, 9999, 10000, 20000, 99997, 99998`



---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ffffff` as the primary page background
- Pair **Open Sans** (body) with **sdrn** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 1px, 2em, 2px, 4px, 5px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Open Sans and sdrn
- Don't use arbitrary spacing values — stick to multiples of 5px
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
| xs | 320px | css |
| xs | 321px | css |
| xs | 479px | css |
| xs | 480px | css |
| sm | 481px | css |
| sm | 600px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 782px | css |
| lg | 959px | css |
| lg | 960px | css |
| lg | 961px | css |
| lg | 962px | css |
| lg | 1000px | css |
| lg | 1024px | css |
| xl | 1025px | css |
| xl | 1280px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f2f2f2
Border: 1px solid #555d66
Radius: 7px
Padding: 20px
Font: Open Sans
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border #555d66
Padding: 10px 20px
Radius: 7px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 961px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f2f2f2
Label: #8f98a1 (muted, 12px, uppercase)
Value: #2e2e2e (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #555d66
Focus: border-color var(--accent)
Label: #8f98a1 12px
Spacing: 20px between fields
Radius: 7px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Open Sans, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/OpenSans-Bold.ttf`
- `fonts/OpenSans-ExtraBold.ttf`
- `fonts/OpenSans-Light.ttf`
- `fonts/OpenSans-Medium.ttf`
- `fonts/OpenSans-Regular.ttf`
- `fonts/OpenSans-SemiBold.ttf`
- `fonts/sdrn-Regular.ttf`
- `fonts/sdrn-Regular.woff`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

