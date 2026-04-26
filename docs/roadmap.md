# Roadmap

This document outlines the planned development direction for **Split-Flap Card**.

The roadmap is not a strict promise of delivery. It is a planning document that helps organize future improvements, priorities, and known areas of work.

---

## Current status

Split-Flap Card is currently in alpha.

The card already supports:

- Static text
- Entity states
- Entity attributes
- Built-in clock mode
- Mechanical split-flap animation
- Auto-paging for long text
- Smart page splitting
- MDI icon tokens
- Swedish charset support
- Weather charset support
- Degree symbol support
- Extended Latin / CP1252-style charset
- Custom charset
- Built-in themes
- Basic visual editor support
- HACS-compatible structure

---

## Version plan

Recommended version stages:

| Version | Status | Goal |
|---|---|---|
| `v0.1.0-alpha.1` | Alpha | First public test release |
| `v0.1.x-alpha` | Alpha patches | Bug fixes and documentation improvements |
| `v0.2.0-beta.1` | Beta | Improved visual editor and more stable configuration |
| `v0.x` | Pre-1.0 | Feature refinement and compatibility testing |
| `v1.0.0` | Stable | Stable configuration API and documented behavior |

---

## v0.1.0-alpha.1 goals

The first public alpha should focus on getting the card installable, testable, and documented.

### Required

- [ ] Public GitHub repository
- [ ] `README.md`
- [ ] `hacs.json`
- [ ] `CHANGELOG.md`
- [ ] `LICENSE`
- [ ] Basic documentation in `docs/`
- [ ] HACS custom repository installation
- [ ] Manual installation
- [ ] Generic preview image
- [ ] No private examples or personal entity names
- [ ] First GitHub Release marked as pre-release

### Feature scope

- [x] Static text
- [x] Entity state
- [x] Entity attribute
- [x] Built-in clock
- [x] Auto-paging
- [x] Smart page split
- [x] MDI icon tokens
- [x] Swedish charset
- [x] Weather charset
- [x] Visual editor basics

---

## v0.1.x-alpha goals

Alpha patch releases should focus on stability, bug fixes, and documentation.

Possible improvements:

- Fix rendering bugs
- Improve browser compatibility
- Improve mobile app behavior
- Improve cache/update guidance
- Improve documentation examples
- Add more generic screenshots
- Add issue templates
- Add pull request template
- Add HACS validation workflow
- Improve README structure
- Improve release notes

---

## v0.2.0-beta goals

The first beta should focus on a more polished user experience.

Possible improvements:

- Better visual editor grouping
- More intuitive option labels
- Better helper text in the visual editor
- Improved default layouts
- Better clock behavior validation
- Improved icon alignment
- Improved auto-paging behavior
- More built-in icon tokens
- More built-in themes
- Better documentation navigation

---

## Visual editor improvements

The current visual editor is functional but basic.

Planned improvements:

- Better grouping of options
- More logical option order
- Separate sections for source, layout, animation, typography, icons, and paging
- Hide or de-emphasize irrelevant fields depending on selected source
- Better helper text
- Safer defaults for compact displays
- Better default values for clock mode
- Better default values for weather/info rows

---

## Icon token improvements

Current icon tokens support common weather and transport icons.

Possible future improvements:

- More built-in weather tokens
- More transport tokens
- More status tokens
- More smart aliases
- Optional icon-only mode
- Optional fallback icon for unknown tokens
- Better icon alignment presets
- Icon color inheritance improvements

---

## Auto-paging improvements

Current auto-paging supports smart and fixed splitting.

Possible future improvements:

- Optional page indicators
- Optional page pause on update
- Better punctuation-aware splitting
- Better handling of very long words
- Optional forced line/page breaks
- Support for custom page separator tokens
- Better behavior when entity text updates while a page cycle is active

Example future syntax:

```yaml
page_separator: "|"
```

Example text:

```text
TRAIN TO CENTRAL STATION | PLATFORM 5 | NEW TIME 16:54
```

---

## Animation improvements

Current animation supports mechanical flipping with configurable timing.

Possible future improvements:

- Additional animation styles
- Stronger mechanical preset
- Faster compact preset
- Reduced-motion preset
- Better animation cancellation
- Better behavior on low-power devices
- Optional randomized mechanical delay
- Optional per-segment delay patterns

Possible future presets:

```yaml
animation_preset: compact
```

```yaml
animation_preset: mechanical
```

```yaml
animation_preset: fast
```

---

## Theme improvements

Current built-in themes:

- `kiosk_gold`
- `classic_airport`
- `terminal_amber`
- `monochrome`

Possible future themes:

- `railway_black`
- `airport_white`
- `retro_green`
- `blue_terminal`
- `high_contrast`
- `low_light`
- `paper_flap`

---

## Charset improvements

Current charset support includes:

- `en`
- `sv`
- `nordic`
- `western`
- `weather`
- `weather_sv`
- `extended`
- `custom`

Possible future improvements:

- More language-specific presets
- Better documentation of included characters
- Optional lowercase presets
- Optional numeric-only preset
- Optional clock preset
- Optional transport preset
- Better fallback character handling

---

## Layout improvements

Possible future improvements:

- Built-in compact preset
- Built-in wide display preset
- Built-in clock preset
- Built-in weather preset
- Built-in transit row preset
- Better alignment controls
- Optional responsive sizing
- Optional segment scaling based on available width

Example future syntax:

```yaml
layout_preset: compact
```

```yaml
layout_preset: clock
```

```yaml
layout_preset: transit
```

---

## Documentation improvements

Documentation should continue to improve before `v1.0.0`.

Planned documentation work:

- More screenshots
- More example cards
- More compact layout examples
- More weather examples
- More transit examples
- More visual editor documentation
- Better troubleshooting guide
- Better HACS installation guide
- More detailed release process
- More contributor guidance

---

## Testing improvements

Recommended future testing areas:

- Latest Home Assistant release
- HACS installation
- Manual installation
- Desktop browser
- Mobile browser
- Home Assistant mobile app
- Wall tablet browser
- Large dashboard display
- Compact row layout
- Clock mode
- Entity mode
- Auto-paging mode
- Icon token rendering
- Swedish charset
- Weather charset
- Extended charset

---

## HACS readiness

Before requesting broader HACS visibility, verify:

- [ ] Repository is public
- [ ] `hacs.json` is valid
- [ ] HACS validation passes
- [ ] README is complete
- [ ] Documentation is complete enough for new users
- [ ] GitHub Releases are used
- [ ] First release is tested
- [ ] Issues are enabled
- [ ] License is present
- [ ] Screenshots are generic
- [ ] No private information is included

---

## v1.0.0 stability goals

Before `v1.0.0`, the project should have:

- Stable configuration option names
- Stable source modes
- Stable paging behavior
- Stable icon token behavior
- Stable charset behavior
- Good HACS installation experience
- Clear documentation
- Clear troubleshooting guide
- Clear support policy
- Known limitations documented
- No known critical rendering bugs

---

## Out of scope for now

The following are not planned for the first alpha:

- Built-in API integrations
- Built-in public transport API clients
- Built-in weather API clients
- Server-side Home Assistant integration
- Backend services
- Entity creation
- Direct data fetching from external services

Split-Flap Card is a frontend Lovelace card. It displays data that already exists in Home Assistant.

---

## Data source philosophy

The card should remain data-source agnostic.

Recommended data sources include:

- Home Assistant entities
- Template sensors
- REST sensors
- Calendar entities
- Automations
- Input helpers
- External integrations that already expose data inside Home Assistant

The card should not require a specific external API to work.

---

## Public example policy

All public examples should remain generic.

Recommended:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
GATE A12
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
:sunny: SUNNY 3 °C
```

Avoid:

- Private addresses
- Personal locations
- Real private dashboard names
- Private entity IDs
- Personal names
- API keys
- Real home screenshots

---

## Feedback and feature requests

Feature requests should be opened as GitHub Issues.

A good feature request should include:

- What you want to achieve
- Why the current behavior is not enough
- Example YAML if possible
- Screenshot or mockup if useful
- Whether it should be a default behavior or optional setting

---

## Notes

This roadmap may change as the project develops.

The main priority before `v1.0.0` is stability, documentation, predictable configuration, and a reliable Home Assistant/HACS installation experience.
