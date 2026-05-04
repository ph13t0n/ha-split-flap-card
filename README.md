# Split-Flap Card for Home Assistant

![Split-Flap Card preview](./docs/images/social-preview.jpg)

## Status

> **Status:** Beta — `v0.1.0-beta.1`

Split-Flap Card has moved from **alpha** to **beta**.

This marks a major project milestone. The card now includes a redesigned visual editor, built-in high-contrast themes, typography presets with previews, animation controls, improved split-flap rendering, accessibility-oriented editor decisions, and a structured support/reporting flow.

The configuration API may still evolve before `v1.0.0`, but the project is now suitable for broader testing through HACS.

## Project context

Standing design and update context is documented in:

[Standing Context](./docs/STANDING_CONTEXT.md)

Release changes are documented in:

[Changelog](./CHANGELOG.md)

The visual editor is documented in:

[UI Editor Manual](./docs/UI_EDITOR_MANUAL.md)

## Preview examples

<p align="center">
  <img src="./docs/images/tablet_mockup.jpg" alt="Split-Flap Card tablet mockup" width="100%">
</p>

<p align="center">
  <img src="./docs/images/tv_mockup.jpg" alt="Split-Flap Card TV mockup" width="100%">
</p>

<p align="center">
  <img src="./docs/images/waitroom_mockup.jpg" alt="Split-Flap Card waiting room mockup" width="100%">
</p>

## Overview

Split-Flap Card is a Home Assistant Lovelace custom card that renders static text, entity states, entity attributes and a browser-based clock as a mechanical split-flap display.

The visual direction is inspired by mechanical transit displays, airport signage, railway information boards and high-contrast wayfinding systems.

## Current beta features

- Static text mode
- Entity state mode
- Entity attribute mode
- Browser clock mode
- Redesigned visual editor
- Guided editor flow: Content, Appearance, Motion and Advanced
- Mechanical split-flap animation
- Initial animation from blank state
- Configurable animation feel
- Advanced animation timing controls
- `segments` and `max_chars`
- Swedish charset support with `Å`, `Ä`, `Ö`
- Nordic charset support
- Western European charset support
- Weather charset support with `°`
- Extended charset preset
- Custom charset
- Configurable colors
- Configurable segment size
- Configurable font family, size, weight and vertical offset
- Typography presets with visual preview
- Optional custom font family and stylesheet URL
- Built-in themes:
  - `mechanical_gold` — shown as **Default / Mechanical Gold**
  - `classic_airport`
  - `terminal_amber`
  - `nordic_light`
  - `monochrome`
  - `home_assistant_blue`
  - `sweden_delight`
- Manual & Help section in the editor
- Issue reporting helper with diagnostic data and privacy-aware redaction
- HACS-compatible dashboard plugin structure

## Not included yet

These are planned or future-facing ideas and should not block the beta release:

- Symbol packs for arrows, gates, check-in, information, security, baggage and wayfinding icons
- Two-slot square symbol segments
- Community library for shared themes and presets
- Direct in-editor import from a future community library
- Full stable `v1.0.0` API guarantee

## Installation

### HACS custom repository

1. Open **HACS**.
2. Open **Custom repositories**.
3. Add this repository:

```text
https://github.com/ph13t0n/ha-split-flap-card
```

4. Select category:

```text
Dashboard
```

5. Click **Add**.
6. Install **Split-Flap Card**.
7. Refresh your browser.

Expected HACS resource:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

### Manual installation

Copy `ha-split-flap-card.js` to your Home Assistant `www` folder and add it as a dashboard resource:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

For manual testing after updates, change the cache query:

```yaml
url: /local/ha-split-flap-card.js?v=0.1.0-beta.1
type: module
```

## Basic usage

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: mechanical_gold
```

## Mechanical gold example

```yaml
type: custom:split-flap-card
source: text
text: SPLIT-FLAP CARD
segments: 16
theme: mechanical_gold
animation: true
initial_animation: true
cycle_chars: true
cycle_count: 2
flip_duration: 760
flip_stagger: 45
```

## Swedish example

```yaml
type: custom:split-flap-card
source: text
text: NÄSSJÖ CENTRAL
language: sv
charset: sv
segments: 14
theme: mechanical_gold
```

## Entity example

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
language: sv
charset: sv
segments: 24
theme: classic_airport
```

## Attribute example

```yaml
type: custom:split-flap-card
source: entity
entity: weather.home
attribute: temperature
charset: weather
segments: 6
theme: terminal_amber
```

## Clock example

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
charset: custom
custom_charset: " 0123456789:"
segments: 8
theme: mechanical_gold
cycle_chars: false
```

## Configuration

| Option | Type | Default | Description |
|---|---:|---|---|
| `source` | string | inferred | `text`, `entity`, or `clock` |
| `text` | string | — | Static text to display |
| `entity` | string | — | Entity state to display |
| `attribute` | string | — | Entity attribute to display |
| `clock_format` | string | `HH:mm` | Clock format using `HH`, `H`, `mm`, `ss` |
| `clock_tick_interval` | number | `1000` | Clock update interval in milliseconds |
| `language` | string | `en` | Language hint |
| `charset` | string | language value | `en`, `sv`, `nordic`, `western`, `weather`, `weather_sv`, `extended`, `custom` |
| `custom_charset` | string | — | Custom charset when using `charset: custom` |
| `text_transform` | string | `uppercase` | `uppercase`, `lowercase`, or unchanged |
| `fallback_character` | string | space | Character used when input is unsupported |
| `pad_character` | string | space | Character used to pad empty segments |
| `segments` | number | text length | Number of displayed segments |
| `max_chars` | number | — | Legacy alias for `segments` |
| `theme` | string | `mechanical_gold` | Built-in theme |
| `font_preset` | string | `theme_default` | `theme_default`, `mechanical`, `transit`, `clean`, `mono`, `custom` |
| `font_family` | string | theme/preset | CSS font-family |
| `font_stylesheet` | string | — | Optional stylesheet URL for custom fonts |
| `font_size` | number | `60` | Text size |
| `font_weight` | number/string | `900` | Text weight |
| `letter_spacing` | number | `-1` | Letter spacing |
| `letter_vertical_offset` | number | `-9` | Moves letters up/down inside each flap |
| `text_glow` | string | `off` | `off`, `low`, `medium` |
| `align` | string | `center` | `left`, `center`, or `right` |
| `animation` | boolean | `true` | Enable split-flap animation |
| `initial_animation` | boolean | `true` | Animate from blank on first render |
| `cycle_chars` | boolean | `true` | Show intermediate characters |
| `cycle_count` | number | `2` | Number of intermediate characters |
| `flip_duration` | number | `760` | Flip duration in ms |
| `flip_stagger` | number | `45` | Delay between segment flips in ms |
| `segment_width` | number | `48` | Segment width |
| `segment_height` | number | `78` | Segment height |
| `segment_gap` | number | `6` | Gap between segments |
| `segment_radius` | number | `7` | Segment corner radius |

## Custom fonts

Custom fonts can be used by setting `font_preset: custom` and providing a CSS `font_family`. If the font is not already available in Home Assistant or the browser, provide a `font_stylesheet` URL.

Examples:

```yaml
font_preset: custom
font_family: "Roboto Condensed, Arial Narrow, sans-serif"
font_stylesheet: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;900&display=swap"
```

```yaml
font_preset: custom
font_family: "My Custom Font, sans-serif"
font_stylesheet: "/local/fonts/my-custom-font.css"
```

You are responsible for making sure you have the correct rights and licenses for any font you load or upload.

## Support and issue reports

The visual editor includes a **Report issue** helper that generates a structured GitHub issue draft using the support template.

Diagnostic data is generated locally in the browser. Nothing is submitted automatically. Sensitive-looking values are redacted before the issue text is generated, and users must review and confirm before opening GitHub.

See:

[Support](./SUPPORT.md)

## Optional support

This is a hobby project built while learning more about Home Assistant, smart homes, code, and dashboards.

If you find it useful and want to support continued development, you can leave a small tip on Ko-fi:

[![Support me on Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/lifarvidsson)

## Security

This is a frontend-only dashboard card.

It does not:

- Store credentials
- Require Home Assistant long-lived access tokens
- Modify Home Assistant configuration
- Create entities or services
- Submit issue reports automatically

Avoid sharing screenshots or YAML containing private entity names, tokens, addresses or private URLs.

## License

This project is licensed under the MIT License.

Copyright © 2026 Per Lif Arvidsson (ph13t0n).

See [LICENSE](./LICENSE) for details.

## Commercial support

This project is open source under the MIT License.

Commercial support, custom development, branding, theme adaptation and implementation assistance may be offered separately by agreement.

For business inquiries, contact [hej@lifarvidsson.se](mailto:hej@lifarvidsson.se?subject=Business%20inquiry) with the subject line `Business inquiry`.
