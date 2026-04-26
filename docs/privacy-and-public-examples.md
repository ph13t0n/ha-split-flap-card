# Privacy and Public Examples

This document describes the recommended privacy approach for examples, screenshots, documentation, and public issues related to **Split-Flap Card**.

The goal is to keep public documentation useful while avoiding personal, location-specific, or private Home Assistant details.

---

## Public example policy

Public documentation should use generic examples.

Recommended examples:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
GATE A12
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
```

Avoid examples that identify a real home, private dashboard, personal location, or private entity structure.

---

## Recommended generic entity names

Use generic Home Assistant entity names in documentation.

Recommended:

```yaml
entity: input_text.split_flap_message
```

```yaml
entity: sensor.example_temperature
```

```yaml
entity: weather.home
```

```yaml
entity: sensor.example_info_label
```

Avoid using real private entity names from a personal setup.

---

## Recommended generic text examples

### English

```text
CENTRAL STATION
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
ARRIVES AT PLATFORM 5
NEW ARRIVAL TIME 16:54
:sunny: SUNNY 3 °C
```

### Swedish

```text
EXEMPELSTAD CENTRAL
TÅG MOT EXEMPELSTAD C
LINJE 12 MOT STATION A
ANKOMMER SPÅR 5
NY ANKOMSTTID 16:54
:sunny: SOLIGT 3 °C
ÅÄÖ TEST FRÅN EXEMPELSTAD
```

---

## Avoid personal or identifying examples

Avoid using:

- Real home addresses
- Real personal locations
- Real private entity names
- Real private dashboard names
- Screenshots showing a home interior
- Screenshots showing reflections of people or rooms
- Calendar entries with names
- Device names tied to a private home
- Local transit data tied to a specific private dashboard
- Personal email addresses
- API keys, tokens, or secrets

---

## Screenshots

Screenshots should be generic and safe to publish.

Recommended screenshot content:

```text
CENTRAL STATION
DEPARTURES
TRAIN TO CENTRAL STATION
PLATFORM 5
:sunny: SUNNY 3 °C
```

Avoid screenshots that show:

- A home interior
- Reflections in a TV or display
- Personal dashboards
- Private rooms
- Real addresses
- Personal names
- Private calendar information
- Real device/entity names
- API keys or credentials

---

## Screenshot checklist

Before publishing a screenshot, check:

- [ ] No personal name is visible
- [ ] No address is visible
- [ ] No private entity names are visible
- [ ] No private dashboard URL is visible
- [ ] No API key or token is visible
- [ ] No home interior or reflection is visible
- [ ] No private calendar/event content is visible
- [ ] Example text is generic
- [ ] The image is cropped to only show the card or dashboard example

---

## GitHub Issues

When reporting bugs, users should include enough detail to reproduce the issue, but should avoid sharing private information.

Recommended bug report content:

```text
Home Assistant version
HACS version
Browser and device
Installation method
Card version or resource URL
Full YAML card configuration
Screenshot or short video
Browser console errors
```

Before posting YAML publicly, remove:

- Personal entity names
- URLs
- Tokens
- API keys
- Addresses
- Personal names
- Calendar details
- Private device names

---

## Sanitized YAML example

Instead of this:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.private_dashboard_message
text: "Real private place 3 °C"
```

Use this:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
text: "CENTRAL STATION 3 °C"
```

---

## Sanitized issue example

Good:

```text
The card does not render the degree symbol when using charset: en.

Home Assistant version: 2026.x.x
Installation: HACS
Browser: Chrome
Resource: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js

YAML:
type: custom:split-flap-card
source: text
text: "SUNNY 3 °C"
charset: en
segments: 12
```

Better fix:

```yaml
charset: weather
```

Avoid:

```text
The card does not show temperature on my private dashboard at my actual location.
```

---

## Documentation examples

Documentation should use generic names consistently.

Use:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
```

Avoid:

```text
Real personal location names
Real home-specific names
Real private entity IDs
Private project-specific dashboard names
```

---

## Swedish examples

Swedish examples are welcome because the card supports Swedish characters and Swedish charset presets.

Use generic Swedish examples:

```text
EXEMPELSTAD
TÅG MOT EXEMPELSTAD C
LINJE 12 MOT STATION A
SPÅR 5
SOLIGT 3 °C
ÅÄÖ TEST
```

This demonstrates Swedish support without exposing personal location details.

---

## API keys and secrets

Never include API keys, tokens, cookies, secrets, or private URLs in:

- README files
- Documentation
- Screenshots
- GitHub Issues
- Pull requests
- Example YAML

If a bug requires API-related configuration, replace private values with placeholders:

```yaml
api_key: YOUR_API_KEY
```

or omit the value entirely.

---

## Recommended placeholders

Use these placeholders in public documentation:

| Placeholder | Use for |
|---|---|
| `input_text.split_flap_message` | Generic message entity |
| `sensor.example_temperature` | Generic sensor |
| `sensor.example_info_label` | Generic label sensor |
| `weather.home` | Generic weather entity |
| `CENTRAL STATION` | Generic station/display text |
| `EXAMPLE CITY` | Generic English location |
| `EXEMPELSTAD` | Generic Swedish location |
| `STATION A` | Generic stop/station |
| `PLATFORM 5` | Generic platform |
| `GATE A12` | Generic gate |

---

## Maintainer checklist before release

Before publishing a release, check:

- [ ] README examples are generic
- [ ] Docs examples are generic
- [ ] Screenshots are generic
- [ ] No personal locations are visible
- [ ] No real private entity names are visible
- [ ] No private URLs are visible
- [ ] No secrets or API keys are present
- [ ] Issue templates ask users to remove private data
- [ ] Example YAML uses generic entity names

---

## Notes

This project can be used for local dashboards, transit boards, weather displays, and home information panels.

Public examples should stay generic even if the card was originally developed using a specific private Home Assistant setup.
