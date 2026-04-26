# Visual Editor Reference

This document explains each option available in the Split-Flap Card visual editor.

For a shorter introduction, see [Visual Editor](visual-editor.md).  
For full YAML configuration, see [Configuration](configuration.md).

---

## Overview

The visual editor is divided into configuration areas such as:

- Content
- Paging
- Icons
- Appearance
- Typography
- Segment layout
- Hinge and pins
- Animation
- Debug

Some advanced options may still be easier to configure directly in YAML.

---

## Content

### Display source

Controls where the displayed text comes from.

| Option | Description |
|---|---|
| `Static text` | Displays text written directly in the card configuration |
| `Entity state / attribute` | Displays a Home Assistant entity state or attribute |
| `Built-in clock` | Displays a clock directly from the browser running the dashboard |

YAML option:

```yaml
source: text
```

Supported values:

```yaml
source: text
source: entity
source: clock
```

---

### Static text

Text shown when `source: text` is selected.

Example:

```yaml
source: text
text: CENTRAL STATION
```

Use this for fixed labels, headers, and static information.

---

### Entity

Entity used when `source: entity` is selected.

Example:

```yaml
source: entity
entity: input_text.split_flap_message
```

Useful entity types include:

- `input_text`
- `sensor`
- `binary_sensor`
- `weather`
- `calendar`
- Template sensors
- REST sensors

---

### Attribute

Optional attribute to display from the selected entity.

Example:

```yaml
source: entity
entity: weather.home
attribute: temperature
```

If no attribute is selected, the card displays the entity state.

---

## Clock

### Clock format

Controls how the built-in clock is displayed.

Example:

```yaml
source: clock
clock_format: HH:mm:ss
```

Supported tokens:

| Token | Description | Example |
|---|---|---|
| `HH` | Two-digit hour | `09`, `17` |
| `H` | Hour without leading zero | `9`, `17` |
| `mm` | Two-digit minutes | `05`, `42` |
| `ss` | Two-digit seconds | `08`, `59` |

Common formats:

```yaml
clock_format: HH:mm:ss
```

```yaml
clock_format: HH:mm
```

---

### Clock update interval

Controls how often the clock updates.

Example:

```yaml
clock_tick_interval: 1000
```

Recommended values:

| Value | Use case |
|---:|---|
| `1000` | Clock with seconds |
| `60000` | Clock without seconds |
| `500` | More frequent checking, usually not needed |

Clock mode automatically uses a numeric charset and fast direct flip behavior.

---

## Segments

### Segments

Controls how many split-flap tiles are shown.

Example:

```yaml
segments: 32
```

One segment equals:

- One character
- One space
- One icon token when `icon_tokens: true`

Example:

```text
:sunny: SUNNY
```

counts as:

```text
[icon] S U N N Y
```

---

## Language and charset

### Language

Language hint used for text handling.

Example:

```yaml
language: sv
```

Common values:

| Value | Description |
|---|---|
| `en` | English |
| `sv` | Swedish |
| `nordic` | Nordic-oriented text |
| `western` | Western European text |

---

### Charset

Controls which characters the split-flap segments can display.

Example:

```yaml
charset: weather_sv
```

Common values:

| Charset | Use case |
|---|---|
| `en` | English text |
| `sv` | Swedish text with `Å`, `Ä`, `Ö` |
| `nordic` | Nordic characters |
| `western` | Western European characters |
| `weather` | Weather text and `°` |
| `weather_sv` | Swedish weather text and `°` |
| `extended` | Broader Latin / CP1252-style text |
| `custom` | Manually defined characters |

---

### Custom charset

Used when `charset: custom`.

Example:

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:-.,°"
```

For Swedish:

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ:-.,°"
```

Use the smallest charset that supports the text. Smaller charsets usually animate faster.

---

## Paging

### Page mode

Controls whether long text is split into pages.

Example:

```yaml
page_mode: auto
```

Supported values:

| Value | Description |
|---|---|
| `off` | Long text is cut to the configured segment count |
| `auto` | Long text is split into pages |

---

### Page duration

How long each page stays visible before switching to the next page.

Example:

```yaml
page_duration: 3
```

The value is in seconds.

---

### Page split

Controls how text is split into pages.

Example:

```yaml
page_split: smart
```

Supported values:

| Value | Description |
|---|---|
| `smart` | Tries to split on words |
| `fixed` | Splits by segment count |

Recommended:

```yaml
page_split: smart
```

---

## Icon tokens

### Icon tokens

Enables or disables MDI icon token rendering.

Example:

```yaml
icon_tokens: true
```

When enabled, text like this:

```text
:sunny: SUNNY 3 °C
```

renders `:sunny:` as an icon segment.

---

### Icon color

Controls icon color.

Example:

```yaml
icon_color: "#DCB215"
```

If empty, the card uses `text_color`.

---

### Icon size

Controls icon size in pixels.

Example:

```yaml
icon_size: 24
```

---

### Icon vertical offset

Moves icons up or down.

Example:

```yaml
icon_vertical_offset: -2
```

Negative values move icons upward.  
Positive values move icons downward.

---

## Appearance

### Theme

Selects a built-in visual theme.

Example:

```yaml
theme: kiosk_gold
```

Built-in themes:

| Theme | Description |
|---|---|
| `kiosk_gold` | Black and gold kiosk-style display |
| `classic_airport` | Classic black/white display |
| `terminal_amber` | Amber terminal-style display |
| `monochrome` | Neutral monochrome display |

---

### Text color

Controls the displayed text color.

Example:

```yaml
text_color: "#DCB215"
```

---

### Card background

Controls the outer card background.

Example:

```yaml
card_background: "#000000"
```

---

### Top flap color

Controls the upper half of each split-flap segment.

Example:

```yaml
segment_background_top: "#1B1B1B"
```

---

### Bottom flap color

Controls the lower half of each split-flap segment.

Example:

```yaml
segment_background_bottom: "#090909"
```

---

### Segment border color

Controls the segment border.

Example:

```yaml
segment_border_color: "#2A2A2A"
```

---

### Hinge color

Controls the center split line between the upper and lower flap.

Example:

```yaml
hinge_color: "#000000"
```

---

## Typography

### Font source

Controls where the font comes from.

Supported values:

| Value | Description |
|---|---|
| `preset` | Uses a normal CSS font family |
| `google` | Loads a Google Font |
| `custom_url` | Loads a local/custom font file |

---

### Font family

CSS font family used for text.

Example:

```yaml
font_family: "Roboto Mono, monospace"
```

Recommended:

```yaml
font_family: "Roboto Mono, monospace"
```

---

### Google Font

Used when `font_source: google`.

Example:

```yaml
font_source: google
google_font: "Roboto Mono"
font_family: "Roboto Mono, monospace"
```

Google Fonts require internet access on the dashboard device.

---

### Custom font URL

Used when `font_source: custom_url`.

Example:

```yaml
font_source: custom_url
custom_font_url: /local/fonts/my-font.woff2
custom_font_family: MyCustomFont
font_family: "MyCustomFont, monospace"
```

The font file should be placed in:

```text
/config/www/fonts/my-font.woff2
```

and referenced as:

```text
/local/fonts/my-font.woff2
```

---

### Font size

Controls text size in pixels.

Example:

```yaml
font_size: 32
```

---

### Font weight

Controls text weight.

Example:

```yaml
font_weight: 800
```

Common values:

| Value | Description |
|---:|---|
| `400` | Normal |
| `500` | Medium |
| `700` | Bold |
| `800` | Extra bold |

---

### Text vertical offset

Moves text up or down inside the segment.

Example:

```yaml
text_vertical_offset: -3
```

Negative values move text upward.  
Positive values move text downward.

---

## Segment layout

### Segment width

Width of each split-flap segment in pixels.

Example:

```yaml
segment_width: 23
```

---

### Segment height

Height of each split-flap segment in pixels.

Example:

```yaml
segment_height: 58
```

---

### Segment gap

Space between segments in pixels.

Example:

```yaml
segment_gap: 3
```

---

### Segment radius

Corner radius of each segment.

Example:

```yaml
segment_radius: 4
```

---

## Hinge and pins

### Hinge

Shows or hides the center split line.

Example:

```yaml
hinge: true
```

---

### Hinge thickness

Thickness of the hinge line.

Example:

```yaml
hinge_thickness: 1
```

---

### Hinge opacity

Opacity of the hinge line.

Example:

```yaml
hinge_opacity: 0.35
```

Recommended range:

```text
0.25 - 0.45
```

---

### Pins

Shows or hides circular pin details.

Example:

```yaml
pins: false
```

Recommended for readability:

```yaml
pins: false
```

Recommended for a more mechanical look:

```yaml
pins: true
```

---

### Pin size

Size of the pin details.

Example:

```yaml
pin_size: 7
```

---

### Pin opacity

Opacity of the pin details.

Example:

```yaml
pin_opacity: 0.35
```

---

## Animation

### Animation engine

Controls animation behavior.

Example:

```yaml
animation_engine: mechanical
```

Supported values:

| Value | Description |
|---|---|
| `mechanical` | Mechanical split-flap animation |
| `none` | No animation |

---

### Flip mode

Controls how characters change.

Example:

```yaml
flip_mode: shortest
```

Supported values:

| Value | Description |
|---|---|
| `cycle` | Cycles forward through the charset |
| `shortest` | Uses the shortest path through the charset |
| `direct` | Directly flips to the new character |

Recommended:

```yaml
flip_mode: shortest
```

For clocks and fast-changing values:

```yaml
flip_mode: direct
```

---

### Step duration

Duration for intermediate flip steps.

Example:

```yaml
step_duration: 70
```

---

### Final step duration

Duration for the final visible flip.

Example:

```yaml
final_step_duration: 190
```

---

### Stagger

Delay between segment animations.

Example:

```yaml
stagger: 8
```

Use lower values for compact rows and clocks.

---

### Max steps per update

Safety limit for how many character steps one segment may cycle through.

Example:

```yaml
max_steps_per_update: 80
```

---

### Initial animation

Animates from blank when the card first loads.

Example:

```yaml
initial_animation: true
```

---

### Randomize speed

Adds slight variation to the animation.

Example:

```yaml
randomize_speed: true
```

For clock mode or very frequent updates:

```yaml
randomize_speed: false
```

---

## Debug

### Debug

Shows internal debug information.

Example:

```yaml
debug: true
```

Use only when troubleshooting.

---

## Recommended presets

### Compact information row

```yaml
segments: 32
segment_width: 23
segment_height: 58
segment_gap: 3
segment_radius: 4
font_size: 32
text_vertical_offset: -3
hinge: true
hinge_opacity: 0.35
pins: false
flip_mode: shortest
step_duration: 70
final_step_duration: 190
stagger: 8
```

---

### Clock

```yaml
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
segments: 8
theme: kiosk_gold
animation: true
animation_engine: mechanical
```

---

### Weather with icon

```yaml
source: text
text: ":sunny: SUNNY 3 °C"
charset: weather
segments: 16
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2
theme: kiosk_gold
```

---

### Swedish weather with icon

```yaml
source: text
text: ":sunny: SOLIGT 3 °C"
language: sv
charset: weather_sv
segments: 16
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2
theme: kiosk_gold
```

---

## Notes

- One segment equals one character or one icon token.
- Auto-paging only activates when text is longer than the segment count.
- Icon tokens require `icon_tokens: true`.
- Use `weather` or `weather_sv` for the degree symbol `°`.
- Use `sv` or `weather_sv` for Swedish `Å`, `Ä`, and `Ö`.
- Use `flip_mode: direct` for fast-changing values.
- Use YAML mode for advanced configuration.
- Public examples should stay generic.
