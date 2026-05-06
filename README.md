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

> **Status:** Beta — `v0.1.0-beta.7`

Split-Flap Card is currently in beta. The configuration API may still evolve before `v1.0.0`, but the project is suitable for broader testing through HACS.

`v0.1.0-beta.7` focuses on visual editor branding, compact support branding, mobile-friendly signed number input, 24h/12h clock options, and adaptive segment handling for text, entity and clock sources.

## Overview

Split-Flap Card is a Home Assistant Lovelace custom card that renders static text, entity states, entity attributes and a browser-based clock as a mechanical split-flap display.

The visual direction is inspired by mechanical transit displays, airport signage, railway information boards and high-contrast wayfinding systems.

## Current beta features

- Static text mode.
- Entity state mode.
- Entity attribute mode.
- Browser clock mode.
- 24-hour clock mode.
- 12-hour AM/PM clock mode.
- Adaptive segment handling with `segments_mode: auto`.
- Manual segment override with `segments_mode: manual` and `segments`.
- Visual editor for common options.
- Primary logo branding in the visual editor header.
- Micro logo / wordmark branding in the support/report issue modal.
- Mechanical split-flap rendering.
- Initial animation-related configuration compatibility.
- Swedish charset support with `Å`, `Ä`, `Ö`.
- Nordic charset support.
- Western European charset support.
- Weather charset support with `°`.
- Extended charset preset.
- Custom charset support.
- Configurable colors.
- Configurable segment size.
- Configurable font family, size and weight.
- Mobile-friendly signed controls for values such as `letter_vertical_offset` and `letter_spacing`.
- Built-in themes:
  - `mechanical_gold`
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
  - `home_assistant_blue`
  - `sweden_delight`
- HACS-compatible dashboard plugin structure.

## Visual editor options

The visual editor exposes the most important configuration fields:

- `source`
- `text`
- `entity`
- `attribute`
- `clock_mode`
- `clock_format`
- `clock_tick_interval`
- `segments_mode`
- `segments`
- `language`
- `charset`
- `theme`
- `align`
- `text_transform`
- `letter_vertical_offset`
- `letter_spacing`

Advanced styling options can still be edited directly in YAML.

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
url: /local/ha-split-flap-card.js?v=0.1.0-beta.7
type: module
```

## Basic usage

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments_mode: auto
theme: mechanical_gold
```

## Text example with automatic segments

```yaml
type: custom:split-flap-card
source: text
text: SPLIT-FLAP CARD
segments_mode: auto
theme: mechanical_gold
```

## Text example with manual segments

```yaml
type: custom:split-flap-card
source: text
text: NÄSSJÖ CENTRAL
language: sv
charset: sv
segments_mode: manual
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
segments_mode: auto
theme: classic_airport
```

## Attribute example

```yaml
type: custom:split-flap-card
source: entity
entity: weather.home
attribute: temperature
charset: weather
segments_mode: auto
theme: terminal_amber
```

## 24-hour clock example

```yaml
type: custom:split-flap-card
source: clock
clock_mode: 24h
clock_format: HH:mm
segments_mode: auto
theme: mechanical_gold
```

## 12-hour clock example

```yaml
type: custom:split-flap-card
source: clock
clock_mode: 12h
clock_format: h:mm A
segments_mode: auto
theme: mechanical_gold
```

## Configuration

| Option | Type | Default | Description |
|---|---:|---|---|
| `source` | string | inferred | `text`, `entity`, or `clock` |
| `text` | string | — | Static text to display |
| `entity` | string | — | Entity state to display |
| `attribute` | string | — | Entity attribute to display |
| `clock_mode` | string | `24h` | `24h` or `12h` |
| `clock_format` | string | `HH:mm` | Clock format using `HH`, `H`, `hh`, `h`, `mm`, `ss`, `A` |
| `clock_tick_interval` | number | `1000` | Clock update interval in milliseconds |
| `segments_mode` | string | `auto` | `auto` follows output length, `manual` uses `segments` |
| `segments` | number | `16` | Number of displayed segments when `segments_mode: manual` |
| `language` | string | `sv` | Language hint |
| `charset` | string | `sv` | `en`, `sv`, `nordic`, `western`, `weather`, `weather_sv`, `extended`, `custom` |
| `custom_charset` | string | — | Custom charset when using `charset: custom` |
| `text_transform` | string | `uppercase` | `uppercase`, `lowercase`, or `none` |
| `pad_character` | string | space | Character used to pad empty manual segments |
| `pad_mode` | string | `end` | `start` or `end` padding |
| `theme` | string | `mechanical_gold` | Built-in theme |
| `card_background` | string | `#030303` | Card background color |
| `segment_background` | string | theme | Segment background color |
| `segment_background_top` | string | theme | Top flap background color |
| `segment_background_bottom` | string | theme | Bottom flap background color |
| `segment_separator_color` | string | theme | Split line color |
| `segment_border_color` | string | theme | Segment border color |
| `text_color` | string | theme | Text color |
| `font_family` | string | theme | CSS font-family |
| `font_size` | number | `60` | Text size in pixels |
| `font_weight` | number/string | theme | Text weight |
| `letter_spacing` | number | `-1` | Letter spacing adjustment |
| `letter_vertical_offset` | number | `-9` | Vertical letter offset inside the flap |
| `segment_width` | number | `48` | Segment width in pixels |
| `segment_height` | number | `78` | Segment height in pixels |
| `segment_gap` | number | `6` | Gap between segments in pixels |
| `segment_radius` | number | `7` | Segment corner radius in pixels |
| `align` | string | `center` | `left`, `center`, or `right` |

## Notes about adaptive segments

`segments_mode: auto` is recommended for most use cases. It automatically adapts the displayed segment count to the current output length.

This is especially useful for:

- Text values with varying length.
- Entity states and attributes.
- Clock formats such as `HH:mm`, `HH:mm:ss`, `h:mm A`, and `hh:mm A`.

Use `segments_mode: manual` when you want a fixed display width.

## Documentation

- [UI Editor Manual](./docs/UI_EDITOR_MANUAL.md)
- [Support](./SUPPORT.md)
- [Changelog](./CHANGELOG.md)
- [Standing Context](./docs/STANDING_CONTEXT.md)

## Support and issue reports

Use GitHub Issues for bug reports, feature requests and support questions.

When reporting an issue, include:

- Home Assistant version.
- Browser or app.
- Card version.
- Your card YAML.
- A screenshot, if visual rendering is part of the issue.

Avoid sharing screenshots or YAML containing private entity names, tokens, addresses or private URLs.

## Optional support

This is a hobby project built while learning more about Home Assistant, smart homes, code, and dashboards.

If you find it useful and want to support continued development, you can leave a small tip on Ko-fi:

[![Support me on Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/lifarvidsson)

## Security

This is a frontend-only dashboard card.

It does not:

- Store credentials.
- Require Home Assistant long-lived access tokens.
- Modify Home Assistant configuration.
- Create entities or services.
- Submit issue reports automatically.

Avoid sharing screenshots or YAML containing private entity names, tokens, addresses or private URLs.

## License

This project is licensed under the MIT License.

Copyright © 2026 Per Lif Arvidsson (ph13t0n).

See [LICENSE](./LICENSE) for details.

## Commercial support

This project is open source under the MIT License.

Commercial support, custom development, branding, theme adaptation and implementation assistance may be offered separately by agreement.

For business inquiries, contact [hej@lifarvidsson.se](mailto:hej@lifarvidsson.se?subject=Business%20inquiry) with the subject line `Business inquiry`.
