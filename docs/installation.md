# Installation

This guide explains how to install **Split-Flap Card** in Home Assistant.

The card can be installed in two ways:

- HACS custom repository
- Manual installation

---

## Recommended method: HACS custom repository

HACS is the recommended installation method for most users.

### 1. Open HACS

In Home Assistant, open:

```text
HACS
```

Then open the menu in the top-right corner and select:

```text
Custom repositories
```

---

## 2. Add the repository

Add the GitHub repository URL:

```text
https://github.com/ph13t0n/ha-split-flap-card
```

Select category:

```text
Dashboard
```

Then click:

```text
Add
```

---

## 3. Install the card

After adding the custom repository:

1. Search for **Split-Flap Card** in HACS.
2. Open the card.
3. Click **Download** or **Install**.
4. Restart or refresh Home Assistant if required.
5. Refresh your browser.

---

## 4. Verify dashboard resource

After HACS installation, Home Assistant should load the card from a resource similar to:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

If the card does not load, check your dashboard resources.

---

## Manual installation

Manual installation is useful for development, testing, or when HACS is not available.

### 1. Download the JavaScript file

Download:

```text
ha-split-flap-card.js
```

---

## 2. Place the file in Home Assistant

Place the file in:

```text
/config/www/ha-split-flap-card.js
```

Home Assistant exposes the `/config/www/` folder as:

```text
/local/
```

This means the file becomes available as:

```text
/local/ha-split-flap-card.js
```

---

## 3. Add dashboard resource

In Home Assistant, add the card as a dashboard resource:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

For local testing, it is recommended to use a version query to avoid browser cache issues:

```yaml
url: /local/ha-split-flap-card.js?v=029
type: module
```

When updating the file manually, change the version query:

```yaml
url: /local/ha-split-flap-card.js?v=030
type: module
```

---

## Add your first card

After installation, add a new manual card:

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
segments: 16
theme: kiosk_gold
```

---

## Entity example

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
segments: 32
theme: kiosk_gold
```

---

## Clock example

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
segments: 8
theme: kiosk_gold
```

---

## HACS vs manual installation

Do not load both HACS and manual resources at the same time.

Avoid using both:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

and:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

at the same time.

Duplicate resources can cause confusing behavior during development and testing.

---

## Updating with HACS

When using HACS:

1. Open HACS.
2. Check for updates.
3. Update **Split-Flap Card**.
4. Refresh your browser.
5. Reload the dashboard.

If the old version is still shown, clear the browser cache or restart the Home Assistant app.

---

## Updating manually

When using manual installation:

1. Replace `/config/www/ha-split-flap-card.js`.
2. Update the resource version query.
3. Refresh your browser.

Example:

```yaml
url: /local/ha-split-flap-card.js?v=030
type: module
```

---

## Browser cache

Frontend JavaScript files are often cached by the browser.

If your changes do not appear:

1. Change the version query.
2. Refresh the dashboard.
3. Clear browser cache if needed.
4. Restart the Home Assistant mobile app if using mobile.
5. Make sure only one resource path is registered.

---

## Development installation

For development, manual installation is recommended.

Use:

```yaml
url: /local/ha-split-flap-card.js?v=dev
type: module
```

Then update the query when needed:

```yaml
url: /local/ha-split-flap-card.js?v=dev-001
type: module
```

---

## Expected file locations

### HACS installation

```text
/hacsfiles/ha-split-flap-card/ha-split-flap-card.js
```

### Manual installation

```text
/config/www/ha-split-flap-card.js
```

Dashboard resource:

```text
/local/ha-split-flap-card.js
```

---

## Common installation problems

### Custom element does not exist

If Home Assistant shows:

```text
Custom element doesn't exist: split-flap-card
```

check that the resource is added correctly.

### Card does not update

If the old version remains visible, clear cache or change the version query.

### HACS install works but card does not appear

Check that the dashboard resource exists and uses:

```yaml
type: module
```

### Manual file exists but card does not load

Check that the file is placed in:

```text
/config/www/
```

not in another folder.

---

## Next steps

After installation, see:

- [Examples](examples.md)
- [Configuration](configuration.md)
- [Charsets](charsets.md)
- [Icon Tokens](icon-tokens.md)
- [Themes](themes.md)
- [Troubleshooting](troubleshooting.md)
