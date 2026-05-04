# Changelog

All notable changes to **Split-Flap Card** will be documented in this file.

This project follows semantic versioning where possible.

Recommended version format:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
v0.1.0-beta.1
v0.1.0-beta.2
v1.0.0
```

---

## Unreleased

### Added

- Nothing yet.

### Changed

- Nothing yet.

---

## v0.1.0-beta.2

Documentation correction release.

This release aligns the public documentation with the actual beta implementation currently shipped in `dist/ha-split-flap-card.js`.

### Changed

- Corrected README status to `v0.1.0-beta.2`.
- Corrected README examples to use the implemented `kiosk_gold` theme.
- Corrected the documented built-in themes to:
  - `classic`
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
- Corrected the visual editor documentation so it only describes options currently exposed by the editor.
- Clarified that typography, font loading, issue helper and symbol/icon features are planned or YAML-only where applicable.
- Bumped `package.json` to `0.1.0-beta.2`.

### Fixed

- Fixed public documentation that incorrectly mentioned not-yet-implemented themes and editor features.

### Notes

- No JavaScript card behavior changed in this release.
- This release is intended to make HACS/GitHub documentation accurate and consistent.

---

## v0.1.0-beta.1

First public beta milestone.

This release moves **Split-Flap Card** from alpha to beta and prepares the card for broader HACS testing.

### Added

- Static text mode.
- Entity state mode.
- Entity attribute mode.
- Browser clock mode.
- Visual editor for common options.
- Mechanical split-flap animation.
- Initial animation from blank state.
- Configurable animation behavior.
- Advanced animation timing through YAML.
- `segments` and `max_chars` support.
- Swedish charset support with `Å`, `Ä`, `Ö`.
- Nordic charset support.
- Western European charset support.
- Weather charset support with `°`.
- Extended charset preset.
- Custom charset support.
- Configurable colors through YAML.
- Configurable segment size through YAML.
- Configurable font family, font size and font weight through YAML.
- Built-in themes:
  - `classic`
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
- HACS-compatible dashboard plugin structure.

### Changed

- Changed package version to `0.1.0-beta.1`.
- Updated README status from alpha to beta.
- Updated repository presentation with beta preview graphics.

### Notes

- This is a beta release. Configuration may still evolve before `v1.0.0`.
- Refresh the Home Assistant dashboard after updating.
- Clear browser/app cache if the old version is still loaded.
- Auto-paging, MDI/icon token rendering, symbol packs, typography presets, custom stylesheet/font URL loader and in-editor issue helper are planned future work.

---

## v0.1.0-alpha.2

Workflow, documentation and preparation release.

### Added

- Added pull request template with version impact, changelog categories and standing context checklist.
- Added commit message template for structured local commits.
- Added README links to standing project context and changelog.

### Changed

- Bumped package version to `0.1.0-alpha.2`.
- Clarified that future updates should keep `src` and `dist` aligned.

### Notes

- Some early documentation in this stage referred to planned visual directions that were later corrected in the beta documentation.

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
- English charset preset.
- Swedish charset preset with `Å`, `Ä`, and `Ö`.
- Nordic charset preset.
- Western European charset preset.
- Weather charset preset with `°`.
- Swedish weather charset preset with `Å`, `Ä`, `Ö`, and `°`.
- Extended charset preset.
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
- Configurable animation timing.
- Built-in themes:
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
- Basic Home Assistant visual editor support.
- HACS-compatible dashboard plugin structure.
- Manual installation support.

### Known limitations

- Early alpha documentation and feature planning may not exactly match later beta implementation.
- The configuration API may change before `v1.0.0`.
- Visual editor grouping is still basic.
- Very large charsets may make cycle animation slower.
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
v0.1.0-beta.2
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
