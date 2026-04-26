# Configuration

This document describes the available configuration options for **Split-Flap Card**.

For practical YAML examples, see [Examples](examples.md).

---

## Basic structure

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: kiosk_gold
```

The card supports three main display sources:

| Source | Description |
|---|---|
| `text` | Displays static text from the card configuration |
| `entity` | Displays a Home Assistant entity state or attribute |
| `clock` | Displays the built-in clock |

---

## Source options

### Static text

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
```

### Entity state

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
```

### Entity attribute

```yaml
type: custom:split-flap-card
source: entity
entity: weather.home
attribute: temperature
```

### Built-in clock

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
```

Clock mode automatically uses a numeric charset suitable for time display and direct flip behavior for reliable time updates.

---

## Static text

Static text mode displays text directly from the card configuration.

```yaml
type: custom:split-flap-card
source: text
text: DEPARTURES
segments: 10
theme: kiosk_gold
```

For Swedish characters:

```yaml
type: custom:split-flap-card
source: text
text: ÅÄÖ TEST FRÅN EXEMPELSTAD
language: sv
charset: sv
segments: 28
theme: kiosk_gold
```

---

## Entity mode

Entity mode displays the current state of a Home Assistant entity.

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
segments: 32
theme: kiosk_gold
```

The entity state is normalized according to the selected charset.

---

## Entity attribute mode

You can display an attribute instead of the entity state.

```yaml
type: custom:split-flap-card
source: entity
entity: weather.home
attribute: temperature
charset: weather
segments: 6
theme: kiosk_gold
```

This is useful for weather data, sensor attributes, calendar attributes, and similar Home Assistant entities.

---

## Clock mode

Clock mode displays time directly from the browser running the dashboard.

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
segments: 8
theme: kiosk_gold
```

Supported clock tokens:

| Token | Description | Example |
|---|---|---|
| `HH` | Two-digit hour | `09`, `17` |
| `H` | Hour without leading zero | `9`, `17` |
| `mm` | Two-digit minutes | `05`, `42` |
| `ss` | Two-digit seconds | `08`, `59` |

Examples:

```yaml
clock_format: HH:mm:ss
```

```yaml
clock_format: HH:mm
```

Clock mode automatically applies:

```yaml
charset: custom
custom_charset: " 0123456789:"
flip_mode: direct
randomize_speed: false
page_mode: off
icon_tokens: false
```

---

## Auto-paging

Auto-paging allows long text to be split into several split-flap pages.

```yaml
page_mode: auto
page_duration: 3
page_split: smart
```

Example:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
segments: 32
page_mode: auto
page_duration: 3
page_split: smart
theme: kiosk_gold
```

If the source text is longer than the configured number of segments, the card shows one page at a time and flips to the next page after the configured delay.

### Page modes

| Value | Description |
|---|---|
| `off` | Paging disabled |
| `auto` | Automatically split long text into pages |

### Page split modes

| Value | Description |
|---|---|
| `smart` | Tries to split on words and punctuation |
| `fixed` | Splits strictly by segment count |

Example text:

```text
TRAIN TO CENTRAL STATION ARRIVES AT PLATFORM 5 WITH NEW ARRIVAL TIME 16:54
```

With `segments: 32`, smart paging may split it into:

```text
TRAIN TO CENTRAL STATION
```

```text
ARRIVES AT PLATFORM 5 WITH
```

```text
NEW ARRIVAL TIME 16:54
```

---

## MDI icon tokens

The card can render Home Assistant / Material Design Icons by using text tokens.

Example text:

```text
:sunny: SUNNY 3 °C
```

Example YAML:

```yaml
type: custom:split-flap-card
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

Each icon token counts as **one split-flap segment**.

This means:

```text
:sunny: SUNNY
```

is treated as:

```text
[icon] S U N N Y
```

not as:

```text
: s u n n y :
```

---

## Custom icon map

You can override or add icon tokens using `icon_map`.

```yaml
type: custom:split-flap-card
source: text
text: ":departures: DEPARTURES :train:"
segments: 20
icon_tokens: true
icon_map:
  departures: mdi:sign-direction
  train: mdi:train
theme: kiosk_gold
```

---

## Charset presets

| Charset | Description |
|---|---|
| `en` | English letters, numbers, and common punctuation |
| `sv` | English + Swedish `Å`, `Ä`, `Ö` |
| `nordic` | Swedish + Nordic `Æ`, `Ø` |
| `western` | Western European characters |
| `weather` | English + weather symbols + `°` |
| `weather_sv` | Swedish + weather symbols + `°` |
| `extended` | Extended Latin / CP1252-style printable characters |
| `custom` | User-defined charset |

Example:

```yaml
charset: weather
```

Swedish weather example:

```yaml
charset: weather_sv
```

Custom charset example:

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ:-.,°"
```

---

## Language

The `language` option is used as a language hint and for text casing behavior.

```yaml
language: sv
```

Common values:

| Value | Description |
|---|---|
| `en` | English |
| `sv` | Swedish |
| `nordic` | Nordic charset-oriented use |
| `western` | Western European charset-oriented use |

For Swedish text, use:

```yaml
language: sv
charset: sv
```

For Swedish weather text with `°`, use:

```yaml
language: sv
charset: weather_sv
```

---

## Text transform

By default, the card transforms text to uppercase.

```yaml
text_transform: uppercase
```

Supported values:

| Value | Description |
|---|---|
| `uppercase` | Converts text to uppercase |
| `lowercase` | Converts text to lowercase |
| Any other value | Leaves text unchanged |

Example:

```yaml
text_transform: uppercase
```

---

## Themes

Built-in themes:

| Theme | Description |
|---|---|
| `kiosk_gold` | Black and gold kiosk-style display |
| `classic_airport` | Classic black/white split-flap look |
| `terminal_amber` | Amber terminal display |
| `monochrome` | Neutral monochrome display |

Example:

```yaml
theme: kiosk_gold
```

---

## Visual styling

### Card styling

```yaml
card_background: "#000000"
card_padding: 8
card_border_radius: 10
card_shadow: true
card_highlight: false
card_highlight_opacity: 0.18
```

### Segment styling

```yaml
segment_background: "#111111"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
segment_width: 23
segment_height: 58
segment_gap: 3
segment_radius: 4
```

### Text styling

```yaml
text_color: "#DCB215"
font_family: "Roboto Mono, monospace"
font_size: 32
font_weight: 800
letter_spacing: 0
text_vertical_offset: -3
```

### Hinge and pins

```yaml
hinge: true
hinge_color: "#000000"
hinge_thickness: 1
hinge_opacity: 0.35
pins: false
pin_size: 7
pin_opacity: 0.35
```

---

## Font options

### Preset / CSS font family

```yaml
font_source: preset
font_family: "Roboto Mono, monospace"
```

### Google Font

```yaml
font_source: google
google_font: "Roboto Mono"
font_family: "Roboto Mono, monospace"
```

Google Fonts require internet access on the dashboard device.

### Custom font URL

```yaml
font_source: custom_url
custom_font_url: /local/fonts/my-font.woff2
custom_font_family: MyCustomFont
font_family: "MyCustomFont, monospace"
```

---

## Animation options

```yaml
animation: true
animation_engine: mechanical
flip_mode: shortest
step_duration: 70
final_step_duration: 190
stagger: 8
randomize_speed: true
initial_animation: true
max_steps_per_update: 80
```

### Animation engine

| Value | Description |
|---|---|
| `mechanical` | Mechanical split-flap animation |
| `none` | No animation |

### Flip mode

| Value | Description |
|---|---|
| `cycle` | Cycles forward through the charset |
| `shortest` | Uses the shortest path through the charset |
| `direct` | Directly flips to the new character |

For frequently changing values, use:

```yaml
flip_mode: direct
```

For more mechanical visual behavior, use:

```yaml
flip_mode: shortest
```

---

## Full configuration example

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message

language: en
charset: weather

segments: 32
page_mode: auto
page_duration: 3
page_split: smart

icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2

theme: kiosk_gold
card_background: "#000000"
card_padding: 8
card_border_radius: 10
card_shadow: true
card_highlight: false

text_color: "#DCB215"
segment_background: "#111111"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
hinge_color: "#000000"

segment_width: 23
segment_height: 58
segment_gap: 3
segment_radius: 4

font_family: "Roboto Mono, monospace"
font_size: 32
font_weight: 800
letter_spacing: 0
text_vertical_offset: -3

hinge: true
hinge_thickness: 1
hinge_opacity: 0.35
pins: false
pin_size: 7
pin_opacity: 0.35

animation: true
animation_engine: mechanical
flip_mode: shortest
step_duration: 70
final_step_duration: 190
stagger: 8
randomize_speed: true
initial_animation: true
max_steps_per_update: 80
```

---

## Swedish full configuration example

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message

language: sv
charset: weather_sv

segments: 32
page_mode: auto
page_duration: 3
page_split: smart

icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2

theme: kiosk_gold
card_background: "#000000"
card_padding: 8
card_border_radius: 10
card_shadow: true
card_highlight: false

text_color: "#DCB215"
segment_background: "#111111"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
hinge_color: "#000000"

segment_width: 23
segment_height: 58
segment_gap: 3
segment_radius: 4

font_family: "Roboto Mono, monospace"
font_size: 32
font_weight: 800
letter_spacing: 0
text_vertical_offset: -3

hinge: true
hinge_thickness: 1
hinge_opacity: 0.35
pins: false

animation: true
animation_engine: mechanical
flip_mode: shortest
step_duration: 70
final_step_duration: 190
stagger: 8
randomize_speed: true
initial_animation: true
max_steps_per_update: 80
```

---

## Configuration reference

| Option | Type | Default | Description |
|---|---:|---|---|
| `source` | string | `text` | Display source: `text`, `entity`, or `clock` |
| `text` | string | — | Static text to display |
| `entity` | string | — | Home Assistant entity ID |
| `attribute` | string | — | Optional entity attribute |
| `clock_format` | string | `HH:mm:ss` | Built-in clock format |
| `clock_tick_interval` | number | `1000` | Clock update interval in milliseconds |
| `segments` | number | text length | Number of split-flap segments |
| `max_chars` | number | — | Legacy alias for segment count |
| `language` | string | `en` | Language hint |
| `charset` | string | `en` | Charset preset |
| `custom_charset` | string | — | Custom charset when using `charset: custom` |
| `locale` | string | — | Locale hint for casing behavior |
| `text_transform` | string | `uppercase` | Text transform mode |
| `fallback_character` | string | space | Character used when unsupported input is found |
| `pad_character` | string | space | Character used to pad empty segments |
| `pad_mode` | string | `end` | Padding direction: `start` or `end` |
| `align` | string | `center` | Display alignment: `left`, `center`, or `right` |
| `page_mode` | string | `off` | Page mode: `off` or `auto` |
| `page_duration` | number | `3` | Seconds per page |
| `page_split` | string | `smart` | Page splitting mode: `smart` or `fixed` |
| `icon_tokens` | boolean | `false` | Enables `:token:` icon rendering |
| `icon_map` | object | built-in | Custom token-to-MDI map |
| `icon_color` | string | `text_color` | Icon color |
| `icon_size` | number | based on font | Icon size in pixels |
| `icon_vertical_offset` | number | `0` | Vertical icon adjustment |
| `theme` | string | `classic_airport` | Built-in theme |
| `card_background` | string | theme value | Card background color |
| `card_padding` | number | `10` | Card padding in pixels |
| `card_border_radius` | number | `12` | Card border radius |
| `card_shadow` | boolean | `true` | Enables card shadow |
| `card_highlight` | boolean | `false` | Enables subtle card highlight |
| `card_highlight_opacity` | number | `0.18` | Card highlight opacity |
| `text_color` | string | theme value | Text color |
| `segment_background` | string | theme value | Segment background |
| `segment_background_top` | string | theme value | Top flap background |
| `segment_background_bottom` | string | theme value | Bottom flap background |
| `segment_border_color` | string | theme value | Segment border color |
| `segment_separator_color` | string | theme value | Segment separator color |
| `hinge_color` | string | theme value | Center hinge color |
| `segment_width` | number | `56` | Segment width in pixels |
| `segment_height` | number | `82` | Segment height in pixels |
| `segment_gap` | number | `6` | Gap between segments |
| `segment_radius` | number | `6` | Segment border radius |
| `font_family` | string | `Roboto Mono, monospace` | Font family |
| `font_source` | string | `preset` | Font source mode |
| `google_font` | string | — | Google Font family name |
| `custom_font_url` | string | — | Custom font URL |
| `custom_font_family` | string | — | Custom font family name |
| `font_size` | number | `48` | Font size in pixels |
| `font_weight` | string/number | `800` | Font weight |
| `letter_spacing` | number | `0` | Letter spacing in pixels |
| `text_vertical_offset` | number | `-4` | Vertical text adjustment |
| `hinge` | boolean | `true` | Show center hinge line |
| `hinge_thickness` | number | `1` | Hinge thickness |
| `hinge_opacity` | number | `0.35` | Hinge opacity |
| `pins` | boolean | `false` | Show pin details |
| `pin_size` | number | `7` | Pin size |
| `pin_opacity` | number | `0.35` | Pin opacity |
| `animation` | boolean | `true` | Enable animation |
| `animation_engine` | string | `mechanical` | Animation engine: `mechanical` or `none` |
| `flip_mode` | string | `cycle` | Flip mode: `cycle`, `shortest`, or `direct` |
| `step_duration` | number | `55` | Duration for intermediate flip steps |
| `final_step_duration` | number | `170` | Duration for final flip step |
| `stagger` | number | `25` | Delay between segment animations |
| `randomize_speed` | boolean | `true` | Adds slight variation between segments |
| `initial_animation` | boolean | `true` | Animate from blank on first render |
| `max_steps_per_update` | number | `80` | Safety limit for character cycling |
| `debug` | boolean | `false` | Show internal debug output |

---

## Notes

- Clock mode automatically forces a numeric charset and direct flip mode.
- Icon tokens count as one segment.
- Unknown icon tokens are displayed as normal text.
- Very large charsets can make `cycle` animation slower.
- For frequently changing values, use `flip_mode: shortest` or `flip_mode: direct`.
- Fonts must support the characters used by the selected charset.
- Public examples should use generic names such as `CENTRAL STATION`, `STATION A`, `PLATFORM 5`, and `EXEMPELSTAD`.
