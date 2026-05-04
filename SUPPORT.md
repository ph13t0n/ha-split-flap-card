# Support

This document explains how to get help with **Split-Flap Card** and how to report bugs or request features.

Split-Flap Card is currently in beta.  
The configuration API may still evolve before `v1.0.0`.

---

## Before opening an issue

Before creating a GitHub Issue, please check:

- [README](README.md)
- [Installation](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Examples](docs/examples.md)
- [Troubleshooting](docs/troubleshooting.md)
- [FAQ](docs/faq.md)
- [UI Editor Manual](docs/UI_EDITOR_MANUAL.md)

Many common problems are related to browser cache, missing dashboard resources, unsupported characters, duplicate resources, or incorrect YAML.

---

## Bug reports

Use GitHub Issues to report bugs.

A good bug report should include:

- Home Assistant version
- HACS version
- Browser and device
- Installation method: HACS or manual
- Card version or dashboard resource URL
- Full YAML card configuration
- Screenshot or short video if possible
- Browser console errors if available
- Clear description of expected behavior
- Clear description of actual behavior

The visual editor includes a **Report issue** helper that can generate a structured GitHub issue draft with diagnostic information. Nothing is submitted automatically. Review the generated issue text before posting it.

---

## Bug report template

Please include this information when reporting a bug:

```text
## Description

Describe the issue clearly.

## Expected behavior

What did you expect to happen?

## Actual behavior

What actually happened?

## Home Assistant version

Example: 2026.x.x

## HACS version

Example: 2.x.x

## Browser / device

Example: Chrome on desktop, Home Assistant Android app, wall tablet browser

## Installation method

HACS or manual

## Card version or resource URL

Example:
/hacsfiles/ha-split-flap-card/ha-split-flap-card.js

or:
/local/ha-split-flap-card.js?v=0.1.0-beta.1

## YAML configuration

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: mechanical_gold
```

## Screenshots or video

Attach if possible.

## Browser console errors

Paste any relevant errors here.
```

---

## Configuration help

If you need help with YAML configuration, include:

- What you want to display
- Current YAML configuration
- Screenshot of the current result
- Screenshot or description of the desired result
- Whether the data comes from text, entity, attribute, or clock mode

Use generic examples when possible.

Recommended generic entity:

```yaml
entity: input_text.split_flap_message
```

---

## Privacy when reporting issues

Please avoid sharing private information in public GitHub Issues.

Do not include:

- Home addresses
- Personal names
- Private dashboard URLs
- API keys
- Tokens
- Secrets
- Private calendar entries
- Personal location names
- Real private entity structures
- Screenshots showing your home, reflections, or personal data

Use generic examples instead.

Recommended:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
:sunny: SUNNY 3 °C
```

---

## Sanitized YAML example

Use this style when sharing configuration publicly:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
language: en
charset: weather
segments: 32
theme: mechanical_gold
```

Avoid sharing real private entity names if they reveal personal information.

---

## Browser console

For frontend issues, browser console errors are very helpful.

Common errors include:

```text
Custom element doesn't exist: split-flap-card
Failed to load resource
Uncaught SyntaxError
TypeError
ReferenceError
```

Include the relevant console output in the issue if possible.

---

## Common support topics

### Card not found

Usually caused by an incorrect dashboard resource.

For HACS:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

For manual installation:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

### Changes do not appear

Usually caused by browser cache.

For manual installation, update the version query:

```yaml
url: /local/ha-split-flap-card.js?v=0.1.0-beta.1
type: module
```

### Degree symbol missing

Use:

```yaml
charset: weather
```

or:

```yaml
charset: weather_sv
```

### Swedish characters missing

Use:

```yaml
language: sv
charset: sv
```

or for weather text:

```yaml
language: sv
charset: weather_sv
```

---

## What is supported

Supported:

- Latest stable Home Assistant version
- Recent HACS version
- Modern desktop browsers
- Home Assistant mobile app
- HACS custom repository installation
- Manual resource installation
- YAML configuration
- Visual editor basics and beta editor flow

Best effort:

- Wall tablets
- Kiosk browsers
- Older browsers
- Custom Home Assistant themes
- Highly customized dashboards

Not guaranteed:

- Very old Home Assistant versions
- Unsupported browser engines
- Fonts that do not contain the selected charset characters
- Duplicate HACS/manual resource loading
- External APIs or integrations not related to this card

---

## Response expectations

This is an open-source project maintained on a best-effort basis.

Please be clear, respectful, and provide enough information to reproduce the issue.

Incomplete reports may be marked as:

```text
needs-info
```

and may be closed if no additional information is provided.

---

## Security issues

Do not post secrets, tokens, API keys, private URLs, or credentials in public issues.

If you accidentally post sensitive data, remove it immediately and rotate the affected secret.

---

## Related documentation

- [Installation](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Examples](docs/examples.md)
- [Charsets](docs/charsets.md)
- [Icon Tokens](docs/icon-tokens.md)
- [Themes](docs/themes.md)
- [Visual Editor](docs/visual-editor.md)
- [UI Editor Manual](docs/UI_EDITOR_MANUAL.md)
- [Troubleshooting](docs/troubleshooting.md)
- [FAQ](docs/faq.md)
- [Privacy and Public Examples](docs/privacy-and-public-examples.md)
