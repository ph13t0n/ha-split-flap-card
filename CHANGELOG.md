# Changelog

All notable changes to **Split-Flap Card** will be documented in this file.

This project follows semantic versioning where possible.

Recommended version format:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
v0.1.0-beta.1
v1.0.0
```

---

## Unreleased

### Added

- Nothing yet.

### Changed

- Nothing yet.

---

## v0.1.0-beta.1

First public beta milestone.

This release moves **Split-Flap Card** from alpha to beta. It marks a major step from early experiment toward broader HACS testing, with a redesigned visual editor, improved mechanical rendering, built-in high-contrast themes, typography controls, animation tuning and a structured support/reporting flow.

### Milestone

- Moved project status from alpha to beta.
- Introduced the first beta-ready visual editor experience.
- Established a more polished transit/airport/wayfinding design direction.

### Added

- Added redesigned visual editor with guided sections:
  - Content
  - Appearance
  - Motion
  - Advanced
- Added dark Classic Airport / terminal-inspired editor UI.
- Added typography selector with visual previews.
- Added typography presets:
  - `theme_default`
  - `mechanical`
  - `transit`
  - `clean`
  - `mono`
  - `custom`
- Added optional custom font support through:
  - `font_family`
  - `font_stylesheet`
- Added custom font license/right-to-use notice in the editor/manual.
- Added `letter_vertical_offset` for moving letters up/down inside each flap.
- Added advanced animation controls with millisecond labels.
- Added improved built-in themes:
  - `mechanical_gold` / Default Mechanical Gold
  - `classic_airport`
  - `terminal_amber`
  - `nordic_light`
  - `monochrome`
  - `home_assistant_blue`
  - `sweden_delight`
- Added Manual & Help links in the visual editor.
- Added Report issue helper in the visual editor.
- Added locally generated diagnostic issue text based on `SUPPORT.md`.
- Added privacy-aware redaction for sensitive-looking support data.
- Added consent checkbox before opening a GitHub issue.
- Added Copy issue text action.
- Added GitHub issue draft action.
- Added `docs/UI_EDITOR_MANUAL.md`.
- Added `docs/FUTURE_PROJECTS.md` for later community library ideas.
- Added `docs/RELEASE_CANDIDATE_DECISIONS.md` for release candidate decisions.

### Changed

- Changed default visual direction to crisper split-flap lettering.
- Changed default `text_glow` to `off` for sharper, more readable text.
- Changed theme behavior so themes primarily affect flaps/segments and text rather than the entire card background.
- Changed editor interaction color to a high-contrast airport/signage yellow.
- Changed editor layout to a more step-based flow.
- Changed theme names shown to users to be more descriptive.
- Changed package version to `0.1.0-beta.1`.
- Updated README status from alpha to beta.

### Fixed

- Fixed theme selection not visibly applying theme colors.
- Fixed confusing Custom animation behavior by opening Advanced mode when Custom is selected.
- Fixed Custom/Advanced logic so automatically opened Advanced mode can close again when leaving Custom.
- Fixed typography selection being unclear by adding visual preview cards/dropdown behavior.
- Fixed helper links so the editor links to the UI editor manual instead of only the repository root.
- Fixed unclear field states by improving placeholder and editable field styling.
- Fixed incomplete local help text for editor sections.

### Security

- Added redaction for sensitive-looking data in generated issue reports, including emails, URLs, IP addresses, tokens, secrets, passwords, API keys, webhook-like fields and location fields.
- Issue reports are not sent automatically. The user must review the generated text and open/submit the GitHub issue manually.

### Notes

- This is still a beta release. Configuration may still evolve before `v1.0.0`.
- Refresh the Home Assistant dashboard after updating.
- Clear browser/app cache if the old version is still loaded.
- Symbol packs, two-slot icon segments and the future community library are planned future work and are not part of this beta release.

---

## v0.1.0-alpha.2

Workflow, documentation and preparation release for the `mechanical_gold` visual direction.

### Added

- Added pull request template with version impact, changelog categories and standing context checklist.
- Added commit message template for structured local commits.
- Added README links to standing project context and changelog.
- Added README examples for `mechanical_gold`.

### Changed

- Bumped package version to `0.1.0-alpha.2`.
- Updated README theme documentation to include `mechanical_gold`.
- Clarified that future updates should keep `src` and `dist` aligned.

### Removed

- Nothing.

### Fixed

- Nothing.

### Replaced

- Nothing.

---

## v0.1.0-alpha.1

Initial public alpha release.

### Added

- Home Assistant Lovelace custom card for split-flap style displays.
- Static text display mode.
- Entity state display mode.
- Entity attribute display mode.
- Built-in clock mode.
- Mechanical split-flap animation engine.
- Auto-paging for long text.
- Smart page splitting by words.
- Fixed-length page splitting.
- MDI icon token support through Home Assistant `ha-icon`.
- Built-in icon token map.
- Custom `icon_map` support.
- Configurable icon color.
- Configurable icon size.
- Configurable icon vertical offset.
- English charset preset.
- Swedish charset preset with `Å`, `Ä`, and `Ö`.
- Nordic charset preset.
- Western European charset preset.
- Weather charset preset with `°`.
- Swedish weather charset preset with `Å`, `Ä`, `Ö`, and `°`.
- Extended Latin / CP1252-style charset preset.
- Custom charset support.
- Configurable fallback character.
- Configurable padding character.
- Configurable segment count.
- Configurable card background.
- Configurable segment colors.
- Configurable text color.
- Configurable font family.
- Configurable font size.
- Configurable font weight.
- Configurable segment size.
- Configurable segment gap.
- Configurable segment radius.
- Configurable hinge line.
- Configurable pin visibility.
- Configurable animation timing.
- Configurable flip mode: `cycle`, `shortest`, and `direct`.
- Built-in themes:
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
- Basic Home Assistant visual editor support.
- HACS-compatible dashboard plugin structure.
- Manual installation support.
- Documentation for installation, configuration, examples, charsets, icon tokens, themes, troubleshooting, HACS, development, and support.

### Known limitations

- This project is currently alpha.
- The configuration API may change before `v1.0.0`.
- Visual editor grouping is still basic.
- Very large charsets may make `cycle` animation slower.
- MDI icon availability depends on the Home Assistant frontend version.
- Emoji rendering may vary between browsers and devices.
- Fonts must support the characters used by the selected charset.
- Some advanced layouts may require YAML configuration.

### Notes

After installation or update, refresh the Home Assistant dashboard.

For manual installation, update the dashboard resource query if changes do not appear:

```yaml
url: /local/ha-split-flap-card.js?v=0.1.0-alpha.1
type: module
```

For HACS installation, the expected resource path is:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

---

## Versioning guide

### Alpha

Alpha releases are early testing releases.

Example:

```text
v0.1.0-alpha.1
```

Alpha releases may include:

- New features
- Breaking configuration changes
- Incomplete visual editor behavior
- Documentation changes
- Experimental options

---

### Beta

Beta releases are more stable testing releases.

Example:

```text
v0.1.0-beta.1
```

Beta releases should aim for:

- More stable configuration
- Improved visual editor behavior
- Better documentation
- Fewer breaking changes

---

### Stable

Stable releases should avoid breaking changes.

Example:

```text
v1.0.0
```

Stable releases should include:

- Stable configuration API
- Complete installation documentation
- Clear troubleshooting guide
- Known limitations documented
- Tested HACS installation
- Tested manual installation

---

## Changelog categories

Use these categories for future releases:

### Added

For new features.

### Changed

For changes in existing functionality.

### Deprecated

For features that will be removed in a future version.

### Removed

For removed features.

### Fixed

For bug fixes.

### Security

For security-related changes.

---

## Release note template

```markdown
## vX.Y.Z

### Added

- Added ...

### Changed

- Changed ...

### Fixed

- Fixed ...

### Notes

- Refresh the Home Assistant dashboard after updating.
- Clear browser cache if the old version is still loaded.
```

---

## Public documentation policy

All public examples should use generic names and placeholder entities.

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
:sunny: SUNNY 3 °C
```

Recommended generic entity:

```yaml
entity: input_text.split_flap_message
```

Avoid private addresses, personal locations, private dashboard names, personal entity IDs, API keys, tokens, or screenshots showing private environments.
