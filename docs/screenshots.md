# Screenshots and Graphics

This document lists the recommended screenshots, mockups, and visual assets for **Split-Flap Card**.

All screenshots and graphics should use generic examples. Do not include private dashboards, personal locations, home interiors, reflections, private entity names, API keys, tokens, or real private data.

---

## Image folder

Recommended image location:

```text
images/
```

Recommended structure:

```text
images/
├─ preview.png
├─ preview.svg
├─ hero.png
├─ compact-info-row.png
├─ clock-example.png
├─ weather-example.png
├─ icon-token-example.png
├─ auto-paging-example.png
├─ visual-editor-overview.png
├─ visual-editor-content.png
├─ visual-editor-appearance.png
├─ visual-editor-typography.png
├─ visual-editor-animation.png
└─ hacs-installation.png
```

---

## Required images before first public release

### `preview.png`

Main preview image for README and HACS.

Recommended text:

```text
CENTRAL STATION
TRAIN TO CENTRAL STATION
PLATFORM 5
```

Recommended style:

- Dark background
- Gold text
- Clear split-flap segments
- No personal or location-specific data
- Cropped to show only the card

---

### `preview.svg`

Vector preview for GitHub README.

Recommended text:

```text
CENTRAL STATION
```

This can be used when a lightweight scalable preview is preferred.

---

### `hero.png`

Large promotional image for the top of the README.

Recommended text:

```text
SPLIT-FLAP CARD
CENTRAL STATION
:sunny: SUNNY 3 °C
```

Recommended use:

- GitHub README
- HACS preview
- Social preview if needed

---

## Example images

### `compact-info-row.png`

Shows the card in a narrow information row.

Recommended text:

```text
:sunny: SUNNY 3 °C FROM CENTRAL STATION
```

Recommended YAML concept:

```yaml
segments: 32
page_mode: auto
icon_tokens: true
theme: kiosk_gold
```

---

### `clock-example.png`

Shows built-in clock mode.

Recommended text:

```text
14:32:08
```

Recommended YAML concept:

```yaml
source: clock
clock_format: HH:mm:ss
segments: 8
```

---

### `weather-example.png`

Shows weather text with degree symbol.

Recommended text:

```text
:sunny: SUNNY 3 °C
```

Recommended YAML concept:

```yaml
charset: weather
icon_tokens: true
```

---

### `icon-token-example.png`

Shows MDI icon tokens rendered as split-flap segments.

Recommended text:

```text
:train: TRAIN TO CENTRAL STATION
```

Recommended YAML concept:

```yaml
icon_tokens: true
icon_map:
  train: mdi:train
```

---

### `auto-paging-example.png`

Shows long text split into multiple logical pages.

Recommended text page 1:

```text
TRAIN TO CENTRAL STATION
```

Recommended text page 2:

```text
ARRIVES AT PLATFORM 5
```

Recommended text page 3:

```text
NEW ARRIVAL TIME 16:54
```

---

## Visual editor images

### `visual-editor-overview.png`

Shows the card selected in the Home Assistant visual editor.

Should demonstrate:

- Card name
- Basic options
- Preview area if available

---

### `visual-editor-content.png`

Shows source-related settings.

Should demonstrate:

- Display source
- Static text
- Entity picker
- Attribute field
- Clock format

---

### `visual-editor-appearance.png`

Shows appearance settings.

Should demonstrate:

- Theme
- Text color
- Card background
- Segment colors
- Hinge color

---

### `visual-editor-typography.png`

Shows typography settings.

Should demonstrate:

- Font source
- Font family
- Font size
- Font weight
- Text vertical offset

---

### `visual-editor-animation.png`

Shows animation settings.

Should demonstrate:

- Animation engine
- Flip mode
- Step duration
- Final step duration
- Stagger
- Randomize speed

---

## HACS images

### `hacs-installation.png`

Shows the HACS custom repository installation flow.

Use generic repository path:

```text
https://github.com/ph13t0n/ha-split-flap-card
```

Make sure no private Home Assistant URL or personal data is visible.

---

## Screenshot privacy checklist

Before publishing any image, check:

- [ ] No personal name is visible
- [ ] No home address is visible
- [ ] No private entity names are visible
- [ ] No private dashboard URLs are visible
- [ ] No API keys, tokens, or secrets are visible
- [ ] No home interior is visible
- [ ] No reflections of people or rooms are visible
- [ ] No private calendar or sensor data is visible
- [ ] Example text is generic
- [ ] Image is cropped to only show the relevant UI or card

---

## Recommended public example text

Use:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
GATE A12
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
:sunny: SUNNY 3 °C
:sunny: SOLIGT 3 °C
```

Avoid:

```text
Real private locations
Real home-specific dashboard names
Real private entity IDs
Real personal addresses
Real personal calendar content
```

---

## README image usage

Recommended README usage:

```markdown
![Split-Flap Card preview](preview.svg)
```

or:

```markdown
![Split-Flap Card preview](images/preview.png)
```

If both exist, use `images/preview.png` for richer screenshots and keep `preview.svg` as a lightweight fallback.

---

## Notes

- Keep screenshots generic.
- Prefer clean mockups over personal dashboard screenshots.
- Use consistent colors across all preview images.
- Use the same example text across documentation where possible.
- Prefer dark background and gold text for the default preview style.
