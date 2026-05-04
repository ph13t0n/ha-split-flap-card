<p align="center">
  <img src="https://raw.githubusercontent.com/ph13t0n/ha-split-flap-card/main/docs/assets/logo/split-flap-card-logo.svg" alt="Split-Flap Card logo" width="640">
</p>

<p align="center">
  <strong>Terminal-inspired split-flap display card for Home Assistant dashboards.</strong><br>
  Built for Lovelace, HACS, transit dashboards, kiosk displays and high-contrast information views.
</p>

<p align="center">
  <a href="https://github.com/ph13t0n/ha-split-flap-card/releases"><img alt="Release" src="https://img.shields.io/github/v/release/ph13t0n/ha-split-flap-card?include_prereleases&label=release"></a>
  <a href="https://github.com/ph13t0n/ha-split-flap-card/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/ph13t0n/ha-split-flap-card"></a>
  <a href="https://github.com/ph13t0n/ha-split-flap-card/issues"><img alt="Issues" src="https://img.shields.io/github/issues/ph13t0n/ha-split-flap-card"></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ph13t0n/ha-split-flap-card/main/docs/assets/images/split-flap-card-beta-preview.svg" alt="Split-Flap Card beta preview" width="100%">
</p>

## Status

> **Status:** Beta — `v0.1.0-beta.1`

Split-Flap Card has moved from **alpha** to **beta**.

This beta includes a visual editor for the most common options, configurable split-flap rendering, multiple charset presets, animation controls, built-in high-contrast themes and HACS-compatible installation.

The configuration API may still evolve before `v1.0.0`, but the project is now suitable for broader testing through HACS.

## Overview

Split-Flap Card is a Home Assistant Lovelace custom card that renders static text, entity states, entity attributes and a browser-based clock as a mechanical split-flap display.

The visual direction is inspired by mechanical transit displays, airport signage, railway information boards and high-contrast wayfinding systems.

## Current beta features

- Static text mode
- Entity state mode
- Entity attribute mode
- Browser clock mode
- Visual editor for common options
- Mechanical split-flap animation
- Initial animation from blank state
- Configurable animation feel
- Advanced animation timing controls through YAML
- `segments` and `max_chars`
- Swedish charset support with `Å`, `Ä`, `Ö`
- Nordic charset support
- Western European charset support
- Weather charset support with `°`
- Extended charset preset
- Custom charset
- Configurable colors through YAML
- Configurable segment size through YAML
- Configurable font family, size and weight through YAML
- Built-in themes:
  - `classic`
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
- HACS-compatible dashboard plugin structure

## Visual editor options

The visual editor currently exposes the most important configuration fields:

- `source`
- `text`
- `entity`
- `attribute`
- `clock_format`
- `clock_tick_interval`
- `language`
- `charset`
- `custom_charset`
- `segments`
- `theme`
- `align`
- `text_transform`
- `animation`
- `cycle_chars`
- `flip_duration`
- `flip_stagger`

Advanced styling options can still be edited directly in YAML.

## Not included yet

These are planned or future-facing ideas and should not block the beta release:

- Auto-paging
- MDI/icon token rendering
- Symbol packs for arrows, gates, check-in, information, security, baggage and wayfinding icons
- Two-slot square symbol segments
- Built-in typography presets
- Custom stylesheet/font URL loader
- In-editor issue report helper
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
theme: kiosk_gold
```

## Kiosk gold example

```yaml
type: custom:split-flap-card
source: text
text: SPLIT-FLAP CARD
segments: 16
theme: kiosk_gold
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
theme: kiosk_gold
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
theme: kiosk_gold
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
| `text_transform` | string | `uppercase` | `uppercase`, `lowercase`, or `none` |
| `fallback_character` | string | space | Character used when input is unsupported |
| `pad_character` | string | space | Character used to pad empty segments |
| `pad_mode` | string | `end` | `start` or `end` padding |
| `segments` | number | text length | Number of displayed segments |
| `max_chars` | number | — | Legacy alias for `segments` |
| `max_segments` | number | `96` | Safety limit for automatic segment count |
| `theme` | string | `classic` | `classic`, `kiosk_gold`, `classic_airport`, `terminal_amber`, `monochrome` |
| `card_background` | string | `#050505` | Card background color |
| `card_border_radius` | number | `16` | Card border radius in pixels |
| `card_padding` | number | `16` | Card padding in pixels |
| `segment_background` | string | `#111111` | Segment background color |
| `segment_background_top` | string | `#1b1b1b` | Top flap background color |
| `segment_background_bottom` | string | `#090909` | Bottom flap background color |
| `segment_separator_color` | string | `#000000` | Split line color |
| `segment_border_color` | string | `#2a2a2a` | Segment border color |
| `text_color` | string | `#dcb215` | Text color |
| `font_family` | string | `Roboto Mono, monospace` | CSS font-family |
| `font_size` | number | `44` | Text size in pixels |
| `font_weight` | number/string | `800` | Text weight |
| `segment_width` | number | `48` | Segment width in pixels |
| `segment_height` | number | `72` | Segment height in pixels |
| `segment_gap` | number | `6` | Gap between segments in pixels |
| `segment_radius` | number | `6` | Segment corner radius in pixels |
| `align` | string | `center` | `left`, `center`, or `right` |
| `animation` | boolean | `true` | Enable split-flap animation |
| `initial_animation` | boolean | `true` | Animate from blank on first render |
| `cycle_chars` | boolean | `true` | Show intermediate characters |
| `cycle_count` | number | `2` | Number of intermediate characters |
| `flip_duration` | number | `520` | Flip duration in milliseconds |
| `flip_stagger` | number | `45` | Delay between segment flips in milliseconds |

## Custom fonts

Custom fonts can be used by setting `font_family` to a CSS font stack that is already available in Home Assistant or loaded by your browser/theme.

```yaml
font_family: "Roboto Condensed, Arial Narrow, sans-serif"
font_size: 52
font_weight: 900
```

This beta does not include a built-in `font_stylesheet` loader. If you use custom fonts, make sure they are loaded through your Home Assistant setup, theme or browser environment.

You are responsible for making sure you have the correct rights and licenses for any font you load or upload.

## Documentation

- [UI Editor Manual](./docs/UI_EDITOR_MANUAL.md)
- [Support](./SUPPORT.md)
- [Changelog](./CHANGELOG.md)
- [Standing Context](./docs/STANDING_CONTEXT.md)

## Support and issue reports

Use GitHub Issues for bug reports, feature requests and support questions.

When reporting an issue, include:

- Home Assistant version
- Browser or app
- Card version
- Your card YAML
- A screenshot, if visual rendering is part of the issue

Avoid sharing screenshots or YAML containing private entity names, tokens, addresses or private URLs.

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
