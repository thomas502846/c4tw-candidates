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
