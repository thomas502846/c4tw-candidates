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
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/DTKaLaTeXaText-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaText-Bold";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/DTKaLaTeXaText-Bold.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaDisplay-Regular";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/DTKaLaTeXaDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "DTKaLaTeXaDisplay-Bold";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/DTKaLaTeXaDisplay-Bold.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "K2D-Light";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/K2D-Light.woff2") format("woff2");
  font-weight: 300;
}
@font-face {
  font-family: "K2D-Default";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/K2D-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "K2D-Medium";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/K2D-SemiBold.woff2") format("woff2");
  font-weight: 600;
}
@font-face {
  font-family: "K2D-Bold";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/K2D-ExtraBold.woff2") format("woff2");
  font-weight: 800;
}
@font-face {
  font-family: "K2D-Thin";
  src: url("https://www.maefahluang.org/wp-content/themes/mfl-2021/fonts/K2D-Thin.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "so-slider-pointers";
  src: url("https://www.maefahluang.org/wp-content/plugins/so-widgets-bundle/css/slider/fonts/slider.eot?8p86w5");
  font-weight: 400;
}
@font-face {
  font-family: "sow-ionicons";
  src: url("https://www.maefahluang.org/wp-content/plugins/so-widgets-bundle/icons/ionicons/font/ionicons.eot?v=2.0.0");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "feature-background";
  src: url("https://www.maefahluang.org/wp-content/plugins/so-widgets-bundle/widgets/features/css/fonts/feature-background.eot") format("embedded-opentype");
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
