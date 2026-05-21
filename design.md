# Laborex AI — Design System

## Overview

This design system governs the visual language of the Laborex AI platform. It originates from the homepage (landing page) and extends across the entire application to ensure a consistent, trustworthy, and modern healthcare experience.

---

## Brand Identity

**Name:** LABOREX AI  
**Tagline:** AI-Powered Pharmacy Safety  
**Personality:** Clinical precision meets modern intelligence. Trustworthy, clean, and reassuring.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Teal | `#2BBFAA` | Primary brand color, CTAs, accents, highlights, active states |
| Navy | `#1B2D3E` | Headings, dark backgrounds, footer, primary text on light |

### Secondary & UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Card backgrounds, navbar background, content areas |
| Light Gray | `#F9FAFB` | Page background, subtle sections |
| Slate Text | `#4A5568` | Body text, secondary content |
| Muted Text | `#718096` | Captions, hints, disabled states |
| Light Border | `#E2E8F0` | Dividers, card borders, subtle separators |

### Semantic Colors

| State | Color | Usage |
|-------|-------|-------|
| Success | `#27C93F` / green shades | Positive feedback, verified states, safe to proceed |
| Error | `#FF6B6B` / red shades | Alerts, interaction warnings, scan failures, blocking errors |
| Warning | `#FFB347` / amber shades | Cascade warnings, cautionary information |
| Info | `#63B3ED` / blue shades | Scanning states, processing indicators |

### Gradient Patterns

- **Hero Background:** `linear-gradient(135deg, #e8faf8 0%, #eef4ff 55%, #f0f9ff 100%)`
- **CTA / Dark Section:** `linear-gradient(135deg, #1B2D3E 0%, #1a3a52 100%)`
- **Stats Banner:** Solid `#2BBFAA`
- **Accent Blob:** `linear-gradient(160deg, rgba(43,191,170,0.22) 0%, rgba(99,179,237,0.18) 100%)`

### Glow & Blur Effects

- Teal glow: `rgba(43,191,170,0.08)` with `blur(60px)`
- Blue glow: `rgba(99,179,237,0.08)` with `blur(60px)`

---

## Typography

### Font Families

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Headings | `Playfair Display`, serif | 600, 700 | Hero headlines, section titles, stat numbers |
| Body / UI | `DM Sans`, sans-serif | 400, 500, 600 | Body text, buttons, navigation, labels |
| Monospace | `DM Sans` monospace fallback | 400 | Terminal-style displays, audit logs, code-like UI |

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 (Hero) | `clamp(34px, 4vw, 52px)` | 700 | 1.15 | Main hero headline |
| H2 (Section) | `clamp(28px, 3vw, 40px)` | 700 | 1.2 | Section titles |
| H3 (Card Title) | 15px | 600 | 1.3 | Card headings, feature titles |
| Body | 14–15px | 400 | 1.75 | Paragraphs, descriptions |
| Caption | 11–12px | 500 | 1.65 | Labels, metadata, small text |
| Eyebrow | 11px | 600 | 1 | Section labels with letter-spacing `0.15em` |
| Nav Link | 13px | 500 | 1 | Navigation items |
| Button | 13–14px | 600 | 1 | CTA and action buttons |

---

## Spacing & Layout

### Container

- **Max Width:** `1200px`
- **Horizontal Padding:** `24px` on all viewports
- **Centered with:** `margin: 0 auto`

### Section Spacing

- Standard section vertical padding: `96px` top and bottom
- CTA section padding: `80px` top and bottom
- Stats banner padding: `56px` top and bottom
- Compact sections: `60px` top and bottom

### Grid Patterns

| Pattern | Columns | Gap | Usage |
|---------|---------|-----|-------|
| Two-column | `1fr 1fr` | `48px` | Hero, About, split content |
| Three-column | `repeat(3, 1fr)` | `24px` | Features, testimonials |
| Four-column | `repeat(4, 1fr)` | `24px` | Stats banner |
| Footer | `1.6fr 1fr 1fr 1.4fr` | `48px` | Footer layout |

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `max-width: 900px` | Two-column grids collapse to single column |
| `max-width: 768px` | Desktop nav hidden, mobile menu shown |
| `max-width: 600px` | Three/four-column grids collapse to 1–2 columns |

---

## Components

### Buttons

#### Primary Button (Teal)
- Background: `#2BBFAA`
- Color: `#FFFFFF`
- Padding: `12px 26px` (standard), `14px 30px` (large)
- Border Radius: `50px` (pill shape)
- Font Size: `13–14px`, Weight: `600`
- Box Shadow: `0 6px 20px rgba(43,191,170,0.35)`
- Hover: Background `#1A9E8C`, translateY `-2px`, enhanced shadow

#### Secondary Button (Outline)
- Border: `1.5px solid #2BBFAA`
- Color: `#2BBFAA`
- Padding: `12px 26px`
- Border Radius: `50px`
- Hover: Background `rgba(43,191,170,0.08)`

#### Ghost Button (Dark)
- Border: `1.5px solid rgba(255,255,255,0.25)`
- Color: `#FFFFFF`
- Hover: Border and text become `#2BBFAA`

### Cards

#### Standard Card
- Background: `#FFFFFF`
- Border: `1px solid rgba(43,191,170,0.1)`
- Border Radius: `20px`
- Padding: `32px 28px` (large), `36px 40px` (features)
- Box Shadow: `0 4px 28px rgba(27,45,62,0.08)`
- Hover: `0 12px 48px rgba(43,191,170,0.18)`, translateY `-4px`

#### Dark / Terminal Card
- Background: `#1B2D3E`
- Border Radius: `24px`
- Padding: `28px`
- Box Shadow: `0 20px 40px rgba(27,45,62,0.2)`

#### Alert Card
- Error: Background `rgba(255,107,107,0.1)`, Left border `#FF6B6B`
- Warning: Background `rgba(255,179,71,0.1)`, Left border `#FFB347`
- Success: Background `#F0FDF4`, Border `#BBF7D0`

### Icons

- Default size: `20px` (UI), `24px` (feature icons), `40–60px` (illustrative)
- Stroke width: `1.8`
- Primary color: `#2BBFAA`
- Icon containers: `44–52px` squares, `12–14px` border radius, `rgba(43,191,170,0.1)` background

### Eyebrow Label

- Display: flex with horizontal lines
- Color: `#2BBFAA`
- Font Size: `11px`, Weight: `600`
- Letter Spacing: `0.15em`
- Text Transform: `uppercase`
- Lines: `28px` wide, `1.5px` tall, `#2BBFAA` background

### Status Badges

- Success: Green dot + "System Online" text
- Neutral: Gray text with icon

### Progress Bar

- Track: `#F3F4F6` background, `10px` height, full radius
- Fill: `#2563EB` (blue-600), animated width transition `500ms`

---

## Animation & Motion

### Keyframe Animations

| Name | Duration | Easing | Behavior |
|------|----------|--------|----------|
| `float` | `3.5–8s` | `ease-in-out` | Infinite vertical oscillation `±10px` |
| `fadeUp` | `0.7s` | `ease` | `opacity: 0→1`, `translateY: 22px→0` |
| `fadeIn` | `0.9s` | `ease` | `opacity: 0→1` |
| `pulse` | `1s` | `ease` | `opacity: 1→0.5→1`, infinite |
| `slide-in-from-bottom-4` | `0.5s` | `ease-out` | `translateY: 1rem→0`, `opacity: 0→1` |

### Transition Defaults

- Color / background: `0.2s`
- Transform / shadow: `0.25–0.3s`
- Width / progress: `0.3–0.5s`

---

## Background Patterns

### Dot Grid

- Pattern: `radial-gradient(circle, rgba(43,191,170,0.18) 1.5px, transparent 1.5px)`
- Size: `22px × 22px`
- Position: absolute, full inset, `pointer-events: none`
- Opacity varies by section: `0.6` (hero), `0.4` (about), `0.3` (workflow), `0.1` (dark CTA)

---

## Navbar

- Position: fixed, top, full width, z-index `100`
- Height: `64px`
- Background: `rgba(255,255,255,0.92)` with `backdrop-filter: blur(8px)`
- Scroll state: solid white + subtle shadow `0 2px 20px rgba(27,45,62,0.10)`
- Logo: `34px` teal rounded square + "LABOREX" wordmark

---

## Footer

- Background: `#1B2D3E`
- Text: `rgba(255,255,255,0.65)` (body), `#FFFFFF` (headings)
- Links: `rgba(255,255,255,0.6)` → `#2BBFAA` on hover
- Social icons: `rgba(255,255,255,0.07)` background → `#2BBFAA` on hover
- Divider: `1px solid rgba(255,255,255,0.08)`

---

## Application-Specific UI (Step Pages)

### Step Page Layout

- Container: `max-w-2xl mx-auto px-6 py-10`
- Card: White background, `rounded-xl`, `border border-gray-200`, `p-6`, `shadow-sm`
- Section icon: `24px`, `text-blue-600`, Lucide icon

### Step Header

- Icon badge: `40px` circle, `bg-blue-600`, white `Pill` icon
- Title: `text-2xl font-bold text-gray-900`
- Subtitle: `text-gray-600 mt-1`

### AI Explanation Box

- Background: `bg-blue-50`
- Border: `border border-blue-100`
- Border Radius: `rounded-lg`
- Padding: `p-4`
- Heading: `text-sm font-bold text-blue-800`
- Body: `text-sm text-blue-700`

### Form Inputs

- Border: `border border-gray-200`
- Radius: `rounded-lg`
- Padding: `px-4 py-3`
- Focus: `focus:outline-none focus:ring-2 focus:ring-blue-500`
- Monospace font for ID fields

---

## Z-Index Scale

| Layer | Z-Index | Element |
|-------|---------|---------|
| Navbar | 100 | Fixed top navigation |
| Modals / Overlays | 50 | Popup content |
| Content | 1–10 | Standard page layers |
| Background | 0 | Decorative blobs, dot grids |

---

## Usage Rules

1. **Always use the Teal + Navy pairing** for primary branding. Do not introduce new primary colors.
2. **Playfair Display is reserved for headlines** — never use it for body text or UI elements.
3. **Pill-shaped buttons** (border-radius 50px) are the standard for CTAs; sharp or slight rounding is for cards and inputs.
4. **Dot grid pattern** is the signature background texture — use it on light sections, reduce opacity on dark sections.
5. **Green = safe/verified, Red = danger/blocking, Amber = warning/caution, Blue = processing/information** — these semantic colors are consistent across marketing and app UI.
6. **Max-width 1200px** is the standard content constraint for landing sections; step pages use `max-w-2xl` for focused workflows.
7. **All hover states** should include both color change and subtle transform (translateY or shadow) for tactile feedback.
