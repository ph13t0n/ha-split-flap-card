# HACS

This document describes how **Split-Flap Card** is intended to work with HACS.

In the HACS frontend, this type of custom card is usually shown as:

```text
Dashboard
```

In HACS publishing documentation and repository validation, this category is also referred to as:

```text
plugin
```

Official HACS documentation:

```text
https://www.hacs.xyz/docs/publish/plugin/
https://www.hacs.xyz/docs/publish/start/
https://www.hacs.xyz/docs/publish/action/
https://www.hacs.xyz/docs/faq/custom_repositories/
```

---

## Repository type

Split-Flap Card is a Home Assistant Lovelace custom card.

For HACS, it should be treated as:

```text
Dashboard / Plugin
```

It is not a Home Assistant integration.

---

## Required repository files

Recommended minimum repository structure:

```text
ha-split-flap-card/
├─ ha-split-flap-card.js
├─ README.md
├─ hacs.json
├─ CHANGELOG.md
├─ LICENSE
└─ docs/
   ├─ installation.md
   ├─ configuration.md
   ├─ examples.md
   ├─ charsets.md
   ├─ icon-tokens.md
   ├─ themes.md
   ├─ visual-editor.md
   ├─ troubleshooting.md
   ├─ faq.md
   ├─ hacs.md
   └─ development.md
```

---

## hacs.json

For the current simple structure where `ha-split-flap-card.js` is placed in the repository root, use:

```json
{
  "name": "Split-Flap Card",
  "content_in_root": true,
  "filename": "ha-split-flap-card.js",
  "render_readme": true
}
```

---

## Alternative dist structure

If the card file is later moved to a `dist/` folder, the structure may become:

```text
ha-split-flap-card/
├─ dist/
│  └─ ha-split-flap-card.js
├─ README.md
├─ hacs.json
└─ docs/
```

Then `hacs.json` should be reviewed and adjusted.

For the first public alpha release, the root-file structure is simpler and easier to validate.

---

## HACS custom repository installation

Users can install the card by adding it as a custom repository.

Steps:

1. Open HACS in Home Assistant.
2. Open the menu in the top-right corner.
3. Select **Custom repositories**.
4. Add the repository URL.
5. Select category:

```text
Dashboard
```

6. Click **Add**.
7. Install **Split-Flap Card**.
8. Refresh the browser.

Example repository URL:

```text
https://github.com/OWNER/ha-split-flap-card
```

Replace `OWNER` with the GitHub account or organization that owns the repository.

---

## Expected HACS resource

After installation, Home Assistant should load the card as a dashboard resource similar to:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

Users should not normally need to add this manually if HACS handles the resource registration.

---

## Manual resource fallback

For development or manual installation:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

For local testing:

```yaml
url: /local/ha-split-flap-card.js?v=dev
type: module
```

Do not load both HACS and manual versions at the same time.

---

## Repository description

The GitHub repository should have a short public description.

Recommended description:

```text
A Home Assistant Lovelace card that displays text, entity states, clocks, auto-paged messages, and MDI icon tokens as a mechanical split-flap display.
```

Keep it under GitHub’s description limit.

---

## Repository topics

Recommended GitHub topics:

```text
home-assistant
hacs
lovelace
lovelace-card
custom-card
dashboard
split-flap
split-flap-display
home-assistant-card
mdi-icons
weather
clock
```

Topic rules:

- Use lowercase letters
- Use hyphens instead of spaces
- Avoid uppercase letters
- Avoid special characters

---

## README requirements

The repository root should include:

```text
README.md
```

The README should include:

- Short project description
- Preview image
- Alpha notice
- Features
- HACS installation
- Manual installation
- Minimal YAML example
- Documentation links
- Troubleshooting link
- License information

---

## Preview image

Recommended preview files:

```text
images/preview.png
```

or:

```text
preview.svg
```

Screenshots should be generic and should not reveal private dashboards, real homes, personal locations, reflections, API data, or private entity names.

Recommended preview text:

```text
CENTRAL STATION
TRAIN TO CENTRAL STATION
PLATFORM 5
:sunny: SUNNY 3 °C
```

---

## HACS validation

HACS provides a GitHub Action that can validate a repository.

Recommended workflow file:

```text
.github/workflows/hacs.yml
```

Example:

```yaml
name: HACS

on:
  push:
  pull_request:
  workflow_dispatch:

jobs:
  hacs:
    name: HACS validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: HACS validation
        uses: hacs/action@main
        with:
          category: plugin
```

The HACS frontend category is `Dashboard`, but the validation category is commonly referred to as `plugin`.

---

## GitHub Releases

For public releases, use GitHub Releases.

Recommended first release:

```text
v0.1.0-alpha.1
```

Recommended release title:

```text
Split-Flap Card v0.1.0-alpha.1
```

Recommended release status:

```text
Pre-release
```

Use pre-releases while the project is still alpha.

---

## Versioning

Recommended version format:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
v0.2.0-beta.1
v1.0.0
```

Suggested meaning:

| Version | Meaning |
|---|---|
| `alpha` | Early public testing |
| `beta` | More complete testing release |
| `patch` | Bugfix release |
| `minor` | New backwards-compatible features |
| `major` | Breaking changes |

---

## First release checklist

Before the first HACS-ready release:

- [ ] Repository is public
- [ ] Repository has a clear description
- [ ] Repository has relevant topics
- [ ] `README.md` exists in root
- [ ] `hacs.json` exists in root
- [ ] `ha-split-flap-card.js` exists in root
- [ ] `CHANGELOG.md` exists
- [ ] `LICENSE` exists
- [ ] Documentation exists in `docs/`
- [ ] HACS validation passes
- [ ] Manual installation has been tested
- [ ] HACS custom repository installation has been tested
- [ ] Browser cache behavior has been tested
- [ ] Screenshots are generic
- [ ] No private data is included

---

## Recommended release flow

1. Update `ha-split-flap-card.js`.
2. Test locally through `/local/`.
3. Update documentation.
4. Update `CHANGELOG.md`.
5. Commit changes.
6. Push to GitHub.
7. Confirm HACS validation passes.
8. Create a GitHub Release.
9. Mark alpha releases as pre-release.
10. Test installation from HACS custom repository.

---

## HACS default repository submission

Before submitting to be included as a default HACS repository, verify:

- Repository is public
- Repository can be added as a custom repository
- HACS Action passes
- README is complete
- GitHub description is set
- GitHub topics are set
- A GitHub Release exists
- The card works after installation
- Documentation is clear
- Issues are enabled

Default inclusion should wait until the card has at least one tested alpha release.

---

## Common HACS issues

### Custom repository cannot be added

Check:

- The repository is public
- The repository URL is correct
- The category is `Dashboard`
- `hacs.json` exists
- `README.md` exists
- The JavaScript file exists at the expected path

### Card installs but does not appear

Check dashboard resources.

Expected HACS resource:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

### Old version remains visible

Refresh the browser and clear cache if needed.

For manual testing, use a version query:

```yaml
url: /local/ha-split-flap-card.js?v=030
type: module
```

### Duplicate card versions

Do not load both:

```yaml
/hacsfiles/ha-split-flap-card/ha-split-flap-card.js
```

and:

```yaml
/local/ha-split-flap-card.js
```

at the same time.

---

## Public documentation policy

Public HACS documentation should use generic examples.

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
```

Avoid private or identifying examples in screenshots, YAML, README files, issues, or release notes.

---

## Related documentation

- [Installation](installation.md)
- [Configuration](configuration.md)
- [Examples](examples.md)
- [Troubleshooting](troubleshooting.md)
- [Development](development.md)
- [Release Notes](release-notes.md)
- [Privacy and Public Examples](privacy-and-public-examples.md)
