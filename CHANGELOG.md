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

## v0.1.0-beta.11

HACS metadata hotfix focused on release-channel hygiene.

This release hides default-branch downloads in HACS metadata so HACS should prefer tagged GitHub releases instead of offering loose commit-hash updates.

### Changed

- Added `hide_default_branch: true` to `hacs.json`.
- Bumped card/package version to `0.1.0-beta.11`.
- Updated README to mark `v0.1.0-beta.11` as the latest recommended version.
- Updated release-channel documentation to clarify that users should follow tagged releases rather than loose commits.

### Notes

- This release is focused on HACS metadata and release visibility.
- No visual editor functionality is introduced in this release.
- No editor layout changes are included in this release.
- `v0.1.0-beta.10` is superseded by this metadata hotfix.
- Refresh Home Assistant dashboard resources after updating.
- Clear app/browser cache if the old frontend file remains loaded.

---

## v0.1.0-beta.10

Maintenance pre-release focused on HACS metadata, release visibility and project presentation.

This release follows the emergency beta hotfixes and is intended to make version discovery clearer in HACS and GitHub.

### Changed

- Added `content_in_root: true` to `hacs.json`.
- Clarified that the HACS-loaded root file is `ha-split-flap-card.js`.
- Updated README presentation with the primary Split-Flap Card logo.
- Added a clearer latest recommended version/status block to README.
- Added a direct release notes link from README.
- Bumped card/package version to `0.1.0-beta.10`.

### Notes

- This release is focused on release hygiene and HACS metadata.
- No new visual editor functionality is introduced in this release.
- `v0.1.0-beta.7` and `v0.1.0-beta.8` should be considered superseded.
- `v0.1.0-beta.9` restored the self-contained card registration.
- Refresh Home Assistant dashboard resources after updating.
- Clear app/browser cache if the old frontend file remains loaded.

---

## v0.1.0-beta.8

Emergency hotfix for `v0.1.0-beta.7`.

This release restores the previous working visual editor layout and support workflow after the beta 7 editor redesign broke the intended editor design.

### Changed

- Restored the previous working beta/canary editor runtime.
- Reverted the simplified beta 7 visual editor layout that introduced large buttons, missing advanced styling, and a broken support card layout.
- Bumped card/package version to `0.1.0-beta.8`.
- Updated README to clearly mark beta 8 as a hotfix.

### Fixed

- Fixed the broken visual editor layout introduced in beta 7.
- Fixed the missing/changed Advanced styling section caused by beta 7.
- Fixed the simplified support section that replaced the intended support/report issue workflow.
- Restored the earlier editor structure with Content, Appearance, Motion, Advanced styling, Manual, Support, Report issue, and preview.

### Notes

- This is a pre-release / beta hotfix build.
- `v0.1.0-beta.7` should be considered superseded by this hotfix.
- The planned beta 7 features are deferred until they can be added without changing or breaking the working editor layout.
- Refresh the Home Assistant dashboard after updating.
- Clear browser/app cache if the previous version still appears.

---

## v0.1.0-beta.5

Editor support and mobile usability release.

This release restores the in-editor support/report issue workflow and improves the visual editor behavior on mobile devices.

### Added

- Restored the **Report issue** support modal inside the visual editor.
- Added locally generated diagnostic issue text.
- Added copy-to-clipboard support for generated issue reports.
- Added GitHub issue opening with generated issue body after explicit review confirmation.
- Added visible diagnostics for:
  - card version
  - card/resource URL
  - installation method
  - selected Split-Flap theme
  - active Home Assistant frontend theme when available
  - light/dark mode when available
  - Home Assistant version when available
  - browser/device information
  - selected card source, charset, font preset and animation feel
- Added a compact card theme / Home Assistant theme information block in the Appearance section.

### Changed

- Changed visual editor text and number inputs so they no longer rebuild the full editor on every typed character.
- Improved external link handling for Manual, Support and GitHub issue links in Home Assistant mobile/web contexts.
- Changed advanced styling fields to show default guidance as placeholders where possible.
- Bumped `package.json` to `0.1.0-beta.5`.

### Fixed

- Fixed the visual editor jumping back to the top while typing in fields on mobile.
- Fixed the missing in-editor support/report issue card workflow.

### Notes

- Diagnostic information is generated locally. Nothing is sent automatically.
- Users must review the generated issue text before opening GitHub Issues.
- Refresh the Home Assistant dashboard after updating.
- Clear browser/app cache if the old version is still loaded.

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
- Entity attribute mode.
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
