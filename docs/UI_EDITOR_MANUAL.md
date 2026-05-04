# UI Editor Manual

This manual describes the Split-Flap Card visual editor as it exists in the current beta.

## UI editor manual

The editor exposes the most common card options directly in the Home Assistant visual editor.

Advanced styling options can still be edited directly in YAML.

## Content

Use **Source** to choose what the card should display.

Available source modes:

- **text** — show fixed text from the card configuration.
- **entity** — show a Home Assistant entity state or one of its attributes.
- **clock** — show a browser-side clock using the selected format.

Only the fields relevant to the selected source are shown.

## Language and charset

The editor supports language and charset selection.

Available language presets:

- `en`
- `sv`
- `nordic`
- `western`

Available charset presets:

- `auto`
- `en`
- `sv`
- `nordic`
- `western`
- `weather`
- `weather_sv`
- `extended`
- `custom`

Use `custom_charset` when you need strict control over which characters the display may cycle through.

## Appearance

Use **Theme** to choose the visual style.

Available themes:

- `classic`
- `kiosk_gold`
- `classic_airport`
- `terminal_amber`
- `monochrome`

Themes apply colors to the card, split-flap segments, separator line, segment border and text.

## Layout

The editor exposes:

- `segments`
- `align`
- `text_transform`

Advanced layout values can be edited in YAML:

- `card_background`
- `card_border_radius`
- `card_padding`
- `segment_width`
- `segment_height`
- `segment_gap`
- `segment_radius`

## Typography

The current beta supports typography configuration through YAML.

Available YAML options:

- `font_family`
- `font_size`
- `font_weight`
- `text_color`

Example:

```yaml
font_family: "Roboto Mono, monospace"
font_size: 44
font_weight: 800
text_color: "#dcb215"
```

This beta does not include built-in typography presets or a built-in `font_stylesheet` loader.

## Motion

The editor exposes:

- `animation`
- `cycle_chars`
- `flip_duration`
- `flip_stagger`

Additional animation options can be edited in YAML:

- `initial_animation`
- `cycle_count`
- `clock_tick_interval`

Example:

```yaml
animation: true
initial_animation: true
cycle_chars: true
cycle_count: 2
flip_duration: 520
flip_stagger: 45
```

## Entity and attribute display

For entity mode, use:

```yaml
source: entity
entity: input_text.split_flap_message
```

For attribute mode, add:

```yaml
attribute: temperature
```

If an entity is not found, the card displays:

```text
ENTITY NOT FOUND
```

## Clock display

For clock mode, use:

```yaml
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
charset: custom
custom_charset: " 0123456789:"
segments: 8
```

Supported clock format tokens:

- `HH`
- `H`
- `mm`
- `ss`

## Custom fonts

Custom fonts can be used if they are already available in Home Assistant, your theme or the browser environment.

Example:

```yaml
font_family: "Roboto Condensed, Arial Narrow, sans-serif"
font_size: 52
font_weight: 900
```

If you load or upload fonts yourself, make sure you have the correct rights and licenses.

## Accessibility notes

The card is designed for high-contrast display use cases such as dashboards, kiosks and information boards.

For best readability:

- Use enough contrast between `segment_background` and `text_color`.
- Keep `segments` wide enough for the text you want to display.
- Avoid very small `font_size` values on wall displays or tablets.
- Prefer uppercase text for transit-board style layouts.

## Future work

Planned future work includes:

- Auto-paging.
- MDI/icon token rendering.
- Symbol packs.
- Airport/railway wayfinding presets.
- Typography presets.
- Custom stylesheet/font URL loader.
- In-editor issue report helper.
- Community library for shared themes and examples.
- Import/export of reusable presets.
