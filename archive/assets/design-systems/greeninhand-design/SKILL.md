---
name: greeninhand-design
description: Design system skill for greeninhand. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# greeninhand Design System

You are building UI for **greeninhand**. Light-themed, neutral palette, sans-serif typography (Tahoma), standard density on a 5px grid, flat elevation (no shadows).

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![greeninhand Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Solid colors only** — no gradients anywhere. Every surface is a single flat color.
- **Type pairing** — Tahoma for body/UI text, Lucida Sans Unicode for headings/display. Never introduce a third typeface.
- **standard density** — 5px base grid. Every dimension is a multiple of 5.
- **neutral palette** — the color temperature runs neutral, matching the sans-serif typography.
- **Subtle motion** — transitions smooth state changes. Keep durations under 300ms, use ease-out curves.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#faf5eb` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#2b2b2b` | Headings, body text |
| Text Muted | `--text-muted` | `#424242` | Captions, placeholders |
| Border | `--border` | `#62625a` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Warning | `#6f5436` | Caution states, pending items |
| Danger | `#754b27` | Errors, destructive actions |

### Extended Palette

- `#a59c90`
- `#737369`
- `#919186`
- `#7d7d78`
- `#b3ada0`
- `#ba2636` — Warm accent — hover glow or decorative highlight
- `#9d896c`
- `#212121`

## Typography

### Font Stack

- **Tahoma** — Heading 1, Heading 2, Heading 3
- **Lucida Sans Unicode** — Body, Caption

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Tahoma | 22px | 700 |
| Heading 2 | Tahoma | 19px | 700 |
| Heading 3 | Tahoma | 18px | 700 |
| Body | Lucida Sans Unicode | 17px | 400 |
| Caption | Lucida Sans Unicode | 16px | 400 |

### Typography Rules

- Body/UI: **Tahoma**, Headings: **Lucida Sans Unicode** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 5px

Every dimension (margin, padding, gap, width, height) must be a multiple of **5px**.

### Spacing Scale

`5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |

### Border Radius

Scale: `2px, 5px, 17px`
Default: `5px`

## Component Patterns

### Card

```css
.card {
  background: #faf5eb;
  border: 1px solid #62625a;
  border-radius: 5px;
  padding: 20px;
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
  color: #2b2b2b;
  border-radius: 5px;
  padding: 10px 20px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #62625a;
  color: #2b2b2b;
  border-radius: 5px;
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
  border: 1px solid #62625a;
  border-radius: 5px;
  padding: 10px 15px;
  color: #2b2b2b;
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
  background: #faf5eb;
  color: #424242;
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
  background: #faf5eb;
  border: 1px solid #62625a;
  border-radius: 17px;
  padding: 30px;
  max-width: 480px;
  width: 90vw;
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
  color: #424242;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #62625a;
}
.table td {
  padding: 15px;
  border-bottom: 1px solid #62625a;
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
  border-bottom: 1px solid #62625a;
}
.nav-link {
  color: #424242;
  padding: 10px 15px;
  border-radius: 5px;
  transition: color 150ms;
}
.nav-link:hover { color: #2b2b2b; }
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

- **Duration scale:** `1s`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (1s) for micro-interactions, long (1s) for page transitions
- **Easing:** `ease-out` for enters, `ease-in` for exits
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

This design uses **flat elevation** — no box-shadows anywhere.

### Elevation Strategy

| Level | Technique | Use |
|-------|-----------|-----|
| 0 — Base | Background color | Page background |
| 1 — Raised | Lighter surface + subtle border | Cards, panels |
| 2 — Floating | Even lighter surface + stronger border | Dropdowns, popovers |
| 3 — Overlay | Backdrop + modal surface | Modals, dialogs |

### Z-Index Scale

`1, 2, 5, 100, 9999`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No box-shadow** on any element — use borders and surface colors for depth
- **No gradients** — solid colors only, everywhere
- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 5px
- **No extra fonts** — only Tahoma and Lucida Sans Unicode are allowed
- **No arbitrary border-radius** — use the scale: 2px, 5px, 17px
- **No opacity for disabled states** — use muted colors instead
- **No pill shapes** — this design doesn't use rounded-full / 9999px radius

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Tahoma, Lucida Sans Unicode only, using the type scale
4. **Build layout** on the 5px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — flat, surface color shifts only
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon.ico`
- **Site URL:** `https://www.greeninhand.com/main.php`
- **Brand typeface:** Tahoma

## Quick Reference

```
Background:     #ffffff
Surface:        #faf5eb
Text:           #2b2b2b / #424242
Accent:         (not extracted)
Border:         #62625a
Font:           Tahoma
Spacing:        5px grid
Radius:         5px
Components:     3 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for greeninhand
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "greeninhand" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# greeninhand DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 3
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![greeninhand Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography pairs **Lucida Sans Unicode** for display/headings with **Tahoma** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#ffffff` | background | Page background, darkest surface |
| surface | `#faf5eb` | surface | Card and panel backgrounds |
| text-primary | `#2b2b2b` | text-primary | Headings and body text |
| text-muted | `#424242` | text-muted | Captions, placeholders, secondary info |
| border | `#62625a` | border | Dividers, card borders, outlines |
| danger | `#754b27` | danger | Error states, destructive actions |
| warning | `#6f5436` | warning | Warning states, caution indicators |
| unknown | `#a59c90` | unknown | Palette color |
| unknown | `#737369` | unknown | Palette color |
| unknown | `#919186` | unknown | Palette color |
| unknown | `#7d7d78` | unknown | Palette color |
| unknown | `#b3ada0` | unknown | Palette color |
| unknown | `#ba2636` | unknown | Palette color |
| unknown | `#9d896c` | unknown | Palette color |
| unknown | `#212121` | unknown | Palette color |
| unknown | `#c7c7c7` | unknown | Palette color |
| unknown | `#5a544b` | unknown | Palette color |
| unknown | `#4d4d43` | unknown | Palette color |
| unknown | `#000000` | unknown | Palette color |
| unknown | `#906f52` | unknown | Palette color |


---

## 3. Typography Rules

**Font Stack:**
- **Tahoma** — Heading 1, Heading 2, Heading 3
- **Lucida Sans Unicode** — Body, Caption

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Tahoma | 22px | 700 |
| Heading 2 | Tahoma | 19px | 700 |
| Heading 3 | Tahoma | 18px | 700 |
| Body | Lucida Sans Unicode | 17px | 400 |
| Caption | Lucida Sans Unicode | 16px | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **Tahoma** for body/UI text, **Lucida Sans Unicode** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Data Input (2)

**Button** — `html`

**Input** — `html`
- State: :focus, :placeholder

### Media (1)

**Image** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
- **Border radius:** 2px, 5px, 17px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

No box-shadow values detected. The design appears to use a flat visual style.

**Z-Index Scale:** `1, 2, 5, 100, 9999`


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
- Pair **Tahoma** (body) with **Lucida Sans Unicode** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use border and background shifts for elevation — not shadows
- Use border-radius from the scale: 2px, 5px, 17px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Tahoma and Lucida Sans Unicode
- Don't use arbitrary spacing values — stick to multiples of 5px
- Don't add box-shadow — this design system uses flat elevation
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No box-shadow on any element
- No gradient backgrounds
- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #faf5eb
Border: 1px solid #62625a
Radius: 5px
Padding: 20px
Font: Tahoma
No shadows — use borders and surface colors for depth.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border #62625a
Padding: 10px 20px
Radius: 5px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1280px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #faf5eb
Label: #424242 (muted, 12px, uppercase)
Value: #2b2b2b (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #62625a
Focus: border-color var(--accent)
Label: #424242 12px
Spacing: 20px between fields
Radius: 5px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Tahoma, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: flat, surface shifts
```

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

