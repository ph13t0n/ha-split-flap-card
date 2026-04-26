# Themes

Split-Flap Card includes built-in themes and detailed styling options for creating different split-flap display looks.

Themes provide sensible defaults for:

- Card background
- Segment background
- Top flap color
- Bottom flap color
- Text color
- Border color
- Hinge color

You can use a built-in theme as-is or override individual style values.

---

## Built-in themes

| Theme | Description |
|---|---|
| `kiosk_gold` | Black and gold kiosk-style display |
| `classic_airport` | Classic black/white split-flap look |
| `terminal_amber` | Amber terminal display |
| `monochrome` | Neutral monochrome display |

---

## Kiosk Gold

A black and gold display style suitable for kiosk dashboards, transit boards, and information displays.

```yaml
theme: kiosk_gold
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: kiosk_gold
```

Recommended with:

```yaml
text_color: "#DCB215"
card_background: "#000000"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
```

---

## Classic Airport

A neutral airport-board inspired style with bright text on dark split-flap segments.

```yaml
theme: classic_airport
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: DEPARTURES
segments: 12
theme: classic_airport
```

Recommended use cases:

- Departure boards
- Arrival boards
- Gate displays
- General information displays

---

## Terminal Amber

A dark display with amber text, inspired by older terminal and transport displays.

```yaml
theme: terminal_amber
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: PLATFORM 5
segments: 12
theme: terminal_amber
```

Recommended use cases:

- Transport dashboards
- Night mode displays
- Retro terminal-style dashboards

---

## Monochrome

A simple black and white display style.

```yaml
theme: monochrome
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: INFORMATION
segments: 14
theme: monochrome
```

Recommended use cases:

- Minimal dashboards
- High-contrast layouts
- Neutral design systems

---

## Override theme colors

You can start with a built-in theme and override individual colors.

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: kiosk_gold
text_color: "#DCB215"
card_background: "#000000"
segment_background: "#111111"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
hinge_color: "#000000"
```

---

## Card styling

Card styling controls the outer card surface.

```yaml
card_background: "#000000"
card_padding: 8
card_border_radius: 10
card_shadow: true
card_highlight: false
card_highlight_opacity: 0.18
```

| Option | Description |
|---|---|
| `card_background` | Background color of the card |
| `card_padding` | Padding around the split-flap segments |
| `card_border_radius` | Outer card corner radius |
| `card_shadow` | Enables or disables card shadow |
| `card_highlight` | Enables a subtle top/left highlight |
| `card_highlight_opacity` | Opacity of the card highlight |

---

## Segment styling

Segment styling controls each split-flap tile.

```yaml
segment_background: "#111111"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
segment_width: 56
segment_height: 82
segment_gap: 6
segment_radius: 6
```

| Option | Description |
|---|---|
| `segment_background` | Base segment background |
| `segment_background_top` | Upper flap background |
| `segment_background_bottom` | Lower flap background |
| `segment_border_color` | Segment border color |
| `segment_width` | Segment width in pixels |
| `segment_height` | Segment height in pixels |
| `segment
