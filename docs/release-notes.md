# Release Notes

This document provides suggested release note templates for **Split-Flap Card**.

Use this file as a working reference when creating GitHub Releases.

For the actual project history, see [CHANGELOG](../CHANGELOG.md).

---

## Versioning

Split-Flap Card follows semantic versioning where possible.

Recommended format:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
v0.2.0-beta.1
v1.0.0
```

General meaning:

| Version part | Meaning |
|---|---|
| `alpha` | Early testing version, API may change |
| `beta` | Feature-complete testing version |
| `patch` | Bug fixes only |
| `minor` | New backwards-compatible features |
| `major` | Breaking changes |

---

## First alpha release template

```markdown
## Split-Flap Card v0.1.0-alpha.1

This is the first public alpha release of Split-Flap Card for Home Assistant.

Split-Flap Card is a Lovelace custom card that renders text, entity states, entity attributes, auto-paged messages, MDI icon tokens, and a built-in clock as a mechanical split-flap display.

### Added

- Static text support
- Entity state support
- Entity attribute support
- Built-in clock mode
- Mechanical split-flap animation
- Auto-paging for long text
- Smart page splitting
- MDI icon token support
- Built-in icon token map
- Swedish charset support with Å, Ä, Ö
- Weather charset support with degree symbol
- Extended Latin / CP1252-style charset preset
- Custom charset support
- Built-in themes
- Visual editor support
- HACS-compatible structure

### Known limitations

- This project is currently alpha.
- The configuration API may change before v1.0.0.
- Visual editor grouping is still basic.
- Very large charsets may make cycle animation slower.
- MDI icon availability depends on the Home Assistant frontend version.

### Notes

After installation or update, refresh the Home Assistant dashboard.

If using manual installation, update the dashboard resource version query, for example:

```yaml
url: /local/ha-split-flap-card.js?v=0.1.0-alpha.1
type: module
```

### Reporting issues

When reporting issues, please include:

- Home Assistant version
- HACS version
- Browser and device
- Installation method
- Card version or resource URL
- Full YAML card configuration
- Screenshot or short video
- Browser console errors
```

---

## Bugfix release template

```markdown
## Split-Flap Card v0.1.1-alpha.1

This release contains bug fixes and small stability improvements.

### Fixed

- Fixed ...
- Fixed ...
- Fixed ...

### Changed

- Improved ...
- Updated ...

### Notes

After updating, refresh the Home Assistant dashboard.

If the old version still appears, clear browser cache or update the manual resource version query.
```

---

## Feature release template

```markdown
## Split-Flap Card v0.2.0-beta.1

This release adds new functionality while keeping existing configuration compatible.

### Added

- Added ...
- Added ...
- Added ...

### Changed

- Improved ...
- Updated ...

### Fixed

- Fixed ...
- Fixed ...

### Migration notes

No configuration changes are required.

### Notes

After updating, refresh the Home Assistant dashboard.
```

---

## Breaking change release template

```markdown
## Split-Flap Card v1.0.0

This release contains breaking changes and marks the first stable release.

### Breaking changes

- Changed ...
- Removed ...
- Renamed ...

### Migration guide

Before:

```yaml
old_option: value
```

After:

```yaml
new_option: value
```

### Added

- Added ...

### Changed

- Changed ...

### Fixed

- Fixed ...

### Notes

Please review your YAML configuration after updating.
```

---

## Release checklist

Before creating a GitHub Release:

- [ ] JavaScript file updated
- [ ] README updated
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version number decided
- [ ] HACS validation passes
- [ ] Manual installation tested
- [ ] HACS custom repository installation tested
- [ ] Browser cache refresh tested
- [ ] Example YAML tested
- [ ] Screenshots updated if needed

---

## Recommended release flow

1. Update the card code.
2. Test manually in Home Assistant.
3. Update documentation.
4. Update `CHANGELOG.md`.
5. Commit changes.
6. Create a version tag.
7. Create a GitHub Release from the tag.
8. Add release notes.
9. Test installation/update from HACS.

---

## Cache note for users

Include this in releases when frontend behavior changes:

```markdown
### Cache note

If the dashboard still shows the previous version after updating:

1. Refresh the browser.
2. Clear browser cache if needed.
3. Restart the Home Assistant mobile app if using mobile.
4. Make sure only one card resource is registered.
```

---

## HACS note for users

```markdown
### HACS users

After updating through HACS, refresh your browser.

The expected resource path is:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```
```

---

## Manual installation note for users

```markdown
### Manual installation users

After replacing the JavaScript file, update the version query in your dashboard resource.

Example:

```yaml
url: /local/ha-split-flap-card.js?v=0.1.0-alpha.1
type: module
```
```

---

## Good release note practices

- Keep release notes clear and short.
- Separate `Added`, `Changed`, `Fixed`, and `Breaking changes`.
- Mention cache refresh when frontend files change.
- Mention migration steps if configuration changes.
- Link to documentation when new features are added.
- Avoid personal or location-specific examples.
- Use generic examples such as `CENTRAL STATION`, `STATION A`, and `PLATFORM 5`.
