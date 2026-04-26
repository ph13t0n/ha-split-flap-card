# Visual Editor

Split-Flap Card includes a basic Home Assistant visual editor using Home Assistant's built-in card configuration form.

The visual editor is intended to make common configuration easier, while advanced layouts and detailed styling can still be configured in YAML.

---

## Open the visual editor

1. Open your Home Assistant dashboard.
2. Enter edit mode.
3. Add a new card.
4. Search for:

```text
Split-Flap Card
```

5. Select the card.
6. Configure the available options in the editor.

---

## Display source

The card supports three display sources:

| Source | Description |
|---|---|
| `Static text` | Displays text written directly in the card configuration |
| `Entity state / attribute` | Displays a Home Assistant entity state or attribute |
| `Built-in clock` | Displays a clock directly from the card |

---

## Static text mode

Use static text mode when you want the card to show fixed text.

Example:

```yaml
source: text
text: CENTRAL STATION
```

Static text is useful for:

- Dashboard headers
- Section labels
- Transit-style signs
- Static status messages

---

## Entity mode

Use entity mode when the displayed value should come from Home Assistant.

Example:

```yaml
source: entity
entity: input_text.split_flap_message
```

Entity mode is useful for:

- `input_text` helpers
- Sensor states
- Weather states
- Template sensors
- Calendar-derived messages
- Dynamic status rows

---

## Entity attribute mode

Use an attribute when the information is stored as an entity attribute rather than the entity state.

Example:

```yaml
source: entity
entity: weather.home
attribute: temperature
```

If an attribute is selected, the card displays the attribute value instead of the entity state.

---

## Clock mode

Clock mode displays time directly from the browser running the dashboard.

Example:

```yaml
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
```

Clock mode automatically optimizes the charset and animation behavior for time display.

---

## Charset selection

The visual editor allows selecting a charset preset.

Common choices:

| Charset | Use case |
|---|---|
| `en` | English text |
| `sv` | Swedish text with `Å`, `Ä`, `Ö` |
| `weather` | Weather text and `°` |
| `weather_sv` | Swedish weather text and `°` |
| `extended` | Broader Latin / CP1252-style text |
| `custom` | Manually defined character list |

For Swedish text:

```yaml
language: sv
charset: sv
```

For Swedish weather text:

```yaml
language: sv
charset: weather_sv
```

---

## Segments

One segment equals one displayed character or one icon token.

Example:

```yaml
segments: 32
```

If the source text is longer than the number of configured segments, enable auto-paging.

---

## Auto-paging

Auto-paging splits long text into multiple pages.

```yaml
page_mode: auto
page_duration: 3
page_split: smart
```

Use auto-paging for long messages such as:

```text
TRAIN TO CENTRAL STATION ARRIVES AT PLATFORM 5 WITH NEW ARRIVAL TIME 16:54
```

---

## Icon tokens

Icon tokens can be enabled in the visual editor.

```yaml
icon_tokens: true
```

Example text:

```text
:sunny: SUNNY 3 °C
```

The token `:sunny:` is rendered as an MDI icon using Home Assistant's `ha-icon`.

Icon tokens count as one segment.

---

## Icon styling

Common icon options:

```yaml
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2
```

Use `icon_vertical_offset` if icons do not visually align with text.

---

## Theme

The visual editor includes built-in themes.

| Theme | Description |
|---|---|
| `kiosk_gold` | Black and gold kiosk-style display |
| `classic_airport` | Classic black/white display |
| `terminal_amber` | Amber terminal-style display |
| `monochrome` | Neutral monochrome display |

Example:

```yaml
theme: kiosk_gold
```

---

## Typography

Typography can be configured with:

```yaml
font_family: "Roboto Mono, monospace"
font_size: 48
font_weight: 800
```

Split-flap displays usually work best with monospaced fonts.

Recommended:

```yaml
font_family: "Roboto Mono, monospace"
```

---

## Segment size

Segment size controls the physical size of each split-flap tile.

```yaml
segment_width: 56
segment_height: 82
segment_gap: 6
segment_radius: 6
```

For compact rows:

```yaml
segment_width: 23
segment_height: 58
segment_gap: 3
segment_radius: 4
font_size: 32
```

For larger displays:

```yaml
segment_width: 56
segment_height: 82
segment_gap: 6
segment_radius: 6
font_size: 48
```

---

## Hinge and pins

The hinge line simulates the split between the upper and lower flap.

```yaml
hinge: true
hinge_thickness: 1
hinge_opacity: 0.35
pins: false
```

For best readability:

```yaml
pins: false
```

For a more mechanical appearance:

```yaml
pins: true
pin_size: 7
pin_opacity: 0.45
```

---

## Animation

Animation can be configured from the visual editor or in YAML.

Common balanced settings:

```yaml
animation: true
animation_engine: mechanical
flip_mode: shortest
step_duration: 70
final_step_duration: 190
stagger: 8
randomize_speed: true
```

For faster updates:

```yaml
flip_mode: direct
step_duration: 40
final_step_duration: 90
stagger: 0
randomize_speed: false
```

For a more mechanical feel:

```yaml
flip_mode: shortest
step_duration: 80
final_step_duration: 220
stagger: 12
randomize_speed: true
```

---

## When to use YAML mode

The visual editor exposes the most important options, but YAML mode is recommended for advanced layouts.

Use YAML mode when configuring:

- Custom icon maps
- Compact kiosk rows
- Advanced theme overrides
- Custom font URLs
- Complex layout-card setups
- Detailed animation tuning

Example:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
charset: weather
segments: 32
page_mode: auto
icon_tokens: true
theme: kiosk_gold
```

---

## Recommended workflow

1. Start with the visual editor.
2. Select a display source.
3. Choose a charset.
4. Set segment count.
5. Pick a theme.
6. Save the card.
7. Switch to YAML mode for detailed styling if needed.

---

## Notes

- Not all advanced options may be convenient to edit visually.
- YAML mode gives full control over the card.
- If an option behaves unexpectedly in the visual editor, verify the generated YAML.
- Clock mode automatically overrides some settings for reliable time display.
- Icon tokens require `icon_tokens: true`.
- Auto-paging only activates when the content is longer than the segment count.
- Keep public examples generic, such as `CENTRAL STATION`, `STATION A`, and `PLATFORM 5`.
