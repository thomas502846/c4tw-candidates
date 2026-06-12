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
