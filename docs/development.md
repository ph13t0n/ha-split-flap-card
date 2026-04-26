# Development

This document describes a recommended development workflow for **Split-Flap Card**.

It is intended for maintainers and contributors who want to test, modify, or improve the card.

---

## Repository structure

Recommended project structure:

```text
ha-split-flap-card/
├─ ha-split-flap-card.js
├─ README.md
├─ CHANGELOG.md
├─ LICENSE
├─ hacs.json
├─ docs/
│  ├─ installation.md
│  ├─ configuration.md
│  ├─ examples.md
│  ├─ charsets.md
│  ├─ icon-tokens.md
│  ├─ themes.md
│  ├─ visual-editor.md
│  ├─ troubleshooting.md
│  ├─ development.md
│  └─ release-notes.md
└─ images/
   └─ preview.png
```

---

## Local development installation

For local development, use manual installation.

Copy:

```text
ha-split-flap-card.js
```

to:

```text
/config/www/ha-split-flap-card.js
```

Then add the resource in Home Assistant:

```yaml
url: /local/ha-split-flap-card.js?v=dev
type: module
```

When changing the JavaScript file, update the query string:

```yaml
url: /local/ha-split-flap-card.js?v=dev-001
type: module
```

This helps avoid browser cache issues.

---

## Do not load duplicate resources

Avoid loading both HACS and manual resources at the same time.

Use one of these:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

or:

```yaml
url: /local/ha-split-flap-card.js?v=dev
type: module
```

Do not use both during testing.

---

## Basic test card

Use this as a quick smoke test:

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: kiosk_gold
animation: true
animation_engine: mechanical
```

Expected result:

- Card loads without errors
- Text is visible
- Split-flap segments are rendered
- No browser console errors

---

## Entity test card

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
segments: 32
theme: kiosk_gold
animation: true
animation_engine: mechanical
```

Expected result:

- Card reads the entity state
- Updating the entity updates the card
- Animation runs when the entity value changes

---

## Clock test card

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
segments: 8
theme: kiosk_gold
animation: true
animation_engine: mechanical
```

Expected result:

- Clock updates every second
- Seconds do not skip under normal conditions
- Clock mode does not use long charset cycling

---

## Auto-paging test card

```yaml
type: custom:split-flap-card
source: text
text: TRAIN TO CENTRAL STATION ARRIVES AT PLATFORM 5 WITH NEW ARRIVAL TIME 16:54
segments: 32
page_mode: auto
page_duration: 3
page_split: smart
theme: kiosk_gold
animation: true
animation_engine: mechanical
```

Expected result:

- Long text is split into multiple pages
- Page changes after the configured delay
- Words are not split unnecessarily

---

## Icon token test card

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SUNNY 3 °C"
charset: weather
segments: 16
icon_tokens: true
theme: kiosk_gold
```

Expected result:

- `:sunny:` renders as an icon
- Icon counts as one segment
- Degree symbol is visible
- Text remains aligned

---

## Swedish charset test card

```yaml
type: custom:split-flap-card
source: text
text: ÅÄÖ TEST FRÅN EXEMPELSTAD
language: sv
charset: sv
segments: 28
theme: kiosk_gold
```

Expected result:

- `Å`, `Ä`, and `Ö` display correctly
- Text is transformed consistently
- No unsupported-character fallback is visible

---

## Browser console

When testing changes, always check the browser console.

Look for:

```text
Uncaught SyntaxError
Custom element doesn't exist
Failed to load resource
TypeError
ReferenceError
```

A release should not ship with known console errors.

---

## Recommended test checklist

Before creating a release, test:

- [ ] Static text
- [ ] Entity state
- [ ] Entity attribute
- [ ] Built-in clock
- [ ] Swedish charset
- [ ] Weather charset with `°`
- [ ] Custom charset
- [ ] Auto-paging
- [ ] MDI icon tokens
- [ ] Visual editor
- [ ] Manual YAML configuration
- [ ] HACS-style resource path
- [ ] Manual `/local/` resource path
- [ ] Browser refresh/cache behavior
- [ ] Mobile app rendering if possible

---

## Cache handling during development

Frontend files are often cached.

When changes do not appear:

1. Save the JavaScript file.
2. Change the resource query string.
3. Refresh the browser.
4. Clear browser cache if needed.
5. Restart the Home Assistant mobile app if testing on mobile.

Example:

```yaml
url: /local/ha-split-flap-card.js?v=dev-002
type: module
```

---

## Coding guidelines

Recommended principles:

- Keep the card dependency-free where possible.
- Keep defaults safe and predictable.
- Avoid breaking existing YAML options.
- Keep public examples generic.
- Keep visual defaults readable.
- Prefer explicit configuration over hidden behavior.
- Keep clock behavior fast and reliable.
- Treat icon tokens as one logical segment.
- Keep large charset behavior predictable.

---

## Configuration compatibility

Before changing an option name, consider backwards compatibility.

Prefer adding new options instead of renaming existing ones.

If a breaking change is required:

1. Document it in `CHANGELOG.md`.
2. Mention it in the GitHub Release notes.
3. Add migration instructions.
4. Avoid making the breaking change before `v1.0.0` unless necessary.

---

## Branch naming

Recommended branch names:

```text
feature/icon-tokens
feature/visual-editor
fix/clock-animation
fix/charset-degree-symbol
docs/update-examples
release/v0.1.0-alpha.1
```

Use clear names that describe the change.

---

## Commit message examples

```text
Add icon token rendering
Fix clock animation timing
Update generic examples
Improve charset documentation
Add troubleshooting guide
```

---

## Pull request checklist

Before opening or merging a pull request:

- [ ] The card loads in Home Assistant
- [ ] No browser console errors
- [ ] Existing examples still work
- [ ] New options are documented
- [ ] README links still work
- [ ] Screenshots are generic
- [ ] No personal or location-specific data is included
- [ ] CHANGELOG is updated when needed

---

## Public example policy

Public documentation should use generic examples.

Recommended:

```text
CENTRAL STATION
EXEMPELSTAD
STATION A
PLATFORM 5
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
```

Avoid examples that identify a real home, private dashboard, personal location, or private entity structure.

---

## Release preparation

Before release:

1. Test the latest JavaScript file.
2. Update documentation.
3. Update `CHANGELOG.md`.
4. Check `hacs.json`.
5. Confirm the README is accurate.
6. Commit all changes.
7. Create a GitHub Release.
8. Test installation after release.

---

## Related documentation

- [Installation](installation.md)
- [Configuration](configuration.md)
- [Examples](examples.md)
- [Charsets](charsets.md)
- [Icon Tokens](icon-tokens.md)
- [Themes](themes.md)
- [Visual Editor](visual-editor.md)
- [Troubleshooting](troubleshooting.md)
- [Release Notes](release-notes.md)
