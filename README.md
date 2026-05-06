<p align="center">
  <img src="https://raw.githubusercontent.com/ph13t0n/ha-split-flap-card/main/docs/assets/logo/split-flap-card-primary-logo.svg" alt="Split-Flap Card primary logo" width="760">
</p>

<p align="center">
  <strong>Terminal-inspired split-flap display card for Home Assistant dashboards.</strong><br>
  Built for Lovelace, HACS, transit dashboards, kiosk displays and high-contrast information views.
</p>

<p align="center">
  <a href="https://github.com/ph13t0n/ha-split-flap-card/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/ph13t0n/ha-split-flap-card?include_prereleases&label=latest%20release"></a>
  <a href="https://github.com/ph13t0n/ha-split-flap-card/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/ph13t0n/ha-split-flap-card"></a>
  <a href="https://github.com/ph13t0n/ha-split-flap-card/issues"><img alt="Issues" src="https://img.shields.io/github/issues/ph13t0n/ha-split-flap-card"></a>
</p>

> **Latest recommended version:** `v0.1.0-beta.11`  
> **Status:** Beta metadata hotfix  
> **What changed:** hides default-branch downloads in HACS metadata so HACS should prefer tagged GitHub releases instead of loose commit updates.  
> [Read release notes →](https://github.com/ph13t0n/ha-split-flap-card/releases/tag/v0.1.0-beta.11)

<p align="center">
  <img src="https://raw.githubusercontent.com/ph13t0n/ha-split-flap-card/main/docs/assets/images/split-flap-card-beta-preview.svg" alt="Split-Flap Card beta preview" width="100%">
</p>

## Status

> **Status:** Beta — `v0.1.0-beta.11`

Split-Flap Card is currently in beta. The configuration API may still evolve before `v1.0.0`, but the project is suitable for broader testing through HACS.

`v0.1.0-beta.11` is a HACS metadata hotfix focused on hiding default-branch downloads so users are not prompted to update from a clear release version to a commit hash.

`v0.1.0-beta.7`, `v0.1.0-beta.8`, `v0.1.0-beta.9` and `v0.1.0-beta.10` should be considered superseded by the latest beta metadata hotfix.

## Overview

Split-Flap Card is a Home Assistant Lovelace custom card that renders static text, entity states, entity attributes and a browser-based clock as a mechanical split-flap display.

The visual direction is inspired by mechanical transit displays, airport signage, railway information boards and high-contrast wayfinding systems.

## Current beta features

- Static text mode.
- Entity state mode.
- Entity attribute mode.
- Browser clock mode.
- Self-contained HACS-loaded root file.
- Direct registration of `custom:split-flap-card`.
- Direct registration of the visual editor.
- HACS metadata configured with `content_in_root: true`.
- HACS metadata configured with `hide_default_branch: true`.
- Visual editor for common options.
- Advanced styling section in the editor.
- Mechanical split-flap rendering.
- Swedish charset support with `Å`, `Ä`, `Ö`.
- Nordic charset support.
- Western European charset support.
- Weather charset support with `°`.
- Extended charset preset.
- Custom charset support.
- Configurable colors.
- Configurable segment size.
- Configurable font family, size and weight.
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

The visual editor exposes the most important configuration fields while keeping the editor layout stable:

- Content
- Appearance
- Motion
- Advanced styling
- Manual / Support / Report issue links
- Preview

Experimental additions such as adaptive segments, explicit 24h/12h editor controls, signed mobile controls and new in-editor logo placement are planned, but deferred until they can be added without changing or breaking the working editor layout.

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
url: /local/ha-split-flap-card.js?v=0.1.0-beta.11
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

## Text example

```yaml
type: custom:split-flap-card
source: text
text: SPLIT-FLAP CARD
segments: 16
theme: mechanical_gold
```

## Swedish text example

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
segments: 16
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
clock_format: HH:mm
segments: 5
theme: mechanical_gold
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
| `segments` | number | `16` | Number of displayed segments |
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

## Maintenance note

`v0.1.0-beta.11` intentionally prioritizes HACS metadata and release-channel hygiene.

Deferred items:

- Primary logo replacement inside the visual editor header without changing the editor layout.
- Micro logo / wordmark inside the support modal header.
- Safer signed number controls for mobile keyboards.
- Explicit 24h / 12h AM/PM clock mode selector.
- Adaptive segment mode for text, entity and clock sources.

## Documentation

- [UI Editor Manual](./docs/UI_EDITOR_MANUAL.md)
- [Support](./SUPPORT.md)
- [Changelog](./CHANGELOG.md)
- [Standing Context](./docs/STANDING_CONTEXT.md)
- [Releases](https://github.com/ph13t0n/ha-split-flap-card/releases)

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
