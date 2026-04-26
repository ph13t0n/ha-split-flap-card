# Changelog

All notable changes to **Split-Flap Card** will be documented in this file.

This project follows semantic versioning where possible.

Recommended version format:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
v0.2.0-beta.1
v1.0.0
```

---

## Unreleased

### Added

- Initial documentation structure.
- Installation guide.
- Configuration guide.
- Examples guide.
- Charset documentation.
- Icon token documentation.
- Theme documentation.
- Visual editor documentation.
- Troubleshooting guide.
- FAQ.
- HACS documentation.
- Development guide.
- Roadmap.
- Release notes guide.
- Credits and inspiration documentation.
- Privacy and public examples guide.
- Support guide.

### Changed

- Public examples changed to generic names and placeholder entities.
- Documentation now avoids private, personal, or location-specific examples.

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
v0.2.0-beta.1
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
