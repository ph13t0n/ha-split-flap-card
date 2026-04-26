# Troubleshooting

This document contains common problems and suggested fixes for **Split-Flap Card**.

For installation and basic usage, see the main [README](../README.md).  
For configuration options, see [Configuration](configuration.md).

---

## Card not found

If Home Assistant shows:

```text
Custom element doesn't exist: split-flap-card
```

the card JavaScript file is not loaded correctly.

### Check HACS resource

For HACS installation, the dashboard resource should normally look like:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

### Check manual resource

For manual installation, the dashboard resource should look like:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

The file should be placed in:

```text
/config/www/ha-split-flap-card.js
```

Home Assistant exposes `/config/www/` as `/local/`.

---

## Browser cache

If you updated the JavaScript file but do not see any changes, your browser may still be using an older cached version.

For manual testing, add or change a version query:

```yaml
url: /local/ha-split-flap-card.js?v=029
type: module
```

Then refresh the dashboard.

Recommended steps:

1. Save the updated JavaScript file.
2. Change the version query, for example from `v=029` to `v=030`.
3. Refresh the browser.
4. On mobile, fully close and reopen the Home Assistant app if needed.

---

## Duplicate resources

Avoid loading the card from multiple places at the same time.

Do not use both of these at once:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

and:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

Duplicate resources can cause confusing behavior, especially during development.

---

## HACS installation does not update

If HACS installs or updates the card but the dashboard still shows an old version:

1. Clear the browser cache.
2. Refresh the dashboard.
3. Restart the Home Assistant frontend or app.
4. Check that only one dashboard resource is registered.
5. Check that the file path points to the HACS resource.

Expected HACS path:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

---

## Manual installation does not update

For manual installation, make sure the updated file is placed here:

```text
/config/www/ha-split-flap-card.js
```

Then use:

```yaml
url: /local/ha-split-flap-card.js?v=029
type: module
```

Change the version query after each update.

Example:

```yaml
url: /local/ha-split-flap-card.js?v=030
type: module
```

---

## Entity value does not appear

Check that the entity exists.

Example:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
```

If the entity does not exist, the card may show:

```text
ENTITY NOT FOUND
```

Verify the entity in **Developer Tools → States** in Home Assistant.

---

## Entity attribute does not appear

When using an attribute:

```yaml
source: entity
entity: weather.home
attribute: temperature
```

make sure the selected entity actually has that attribute.

Check the entity attributes in **Developer Tools → States**.

If the attribute is missing or empty, the card may display an empty value.

---

## Text is missing characters

If some characters are missing or replaced with blanks, the selected charset does not include those characters.

Example:

```yaml
charset: en
```

does not include Swedish characters such as:

```text
Å Ä Ö
```

Use:

```yaml
language: sv
charset: sv
```

For weather text with degree symbol:

```yaml
charset: weather
```

or:

```yaml
language: sv
charset: weather_sv
```

---

## Degree symbol does not show

If this:

```text
3 °C
```

is shown as:

```text
3  C
```

the selected charset does not include `°`.

Use:

```yaml
charset: weather
```

or:

```yaml
charset: weather_sv
```

or define a custom charset:

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ:-.,°"
```

---

## Swedish characters do not show

If `Å`, `Ä`, or `Ö` do not show correctly, use:

```yaml
language: sv
charset: sv
```

For Swedish weather text:

```yaml
language: sv
charset: weather_sv
```

Also make sure the selected font supports Swedish characters.

---

## MDI icon token does not render

Icon tokens require:

```yaml
icon_tokens: true
```

Correct token syntax:

```text
:sunny:
```

Incorrect:

```text
mdi:weather-sunny
sunny
{sunny}
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SUNNY 3 °C"
charset: weather
segments: 16
icon_tokens: true
theme: kiosk_gold
```

---

## Unknown icon token appears as text

If a token is unknown, it is displayed as normal text.

For example:

```text
:my_custom_icon:
```

will not render as an icon unless it exists in `icon_map`.

Add it like this:

```yaml
icon_tokens: true
icon_map:
  my_custom_icon: mdi:star
```

---

## Auto-paging does not change page

Auto-paging only activates when the normalized content is longer than the configured segment count.

Example:

```yaml
segments: 32
page_mode: auto
page_duration: 3
page_split: smart
```

If the text is 32 segments or shorter, it only has one page and will not change.

To test auto-paging, use a longer text:

```yaml
type: custom:split-flap-card
source: text
text: TRAIN TO CENTRAL STATION ARRIVES AT PLATFORM 5 WITH NEW ARRIVAL TIME 16:54
segments: 32
page_mode: auto
page_duration: 3
page_split: smart
theme: kiosk_gold
```

---

## Auto-paging with icons seems wrong

Icon tokens count as one segment when `icon_tokens: true` is enabled.

Example:

```text
:sunny: SUNNY
```

counts as:

```text
[icon] S U N N Y
```

If `icon_tokens` is disabled, the same text is treated as normal characters.

Enable:

```yaml
icon_tokens: true
```

---

## Text is cut off

The number of displayed characters is controlled by:

```yaml
segments: 32
```

If text is longer than the number of segments and auto-paging is disabled, it will be cut off.

Use:

```yaml
page_mode: auto
page_duration: 3
page_split: smart
```

or increase:

```yaml
segments: 40
```

---

## Card is too wide

Each segment has a fixed width.

Reduce:

```yaml
segment_width: 23
segment_gap: 3
segments: 32
```

For compact rows, try:

```yaml
segment_width: 20
segment_height: 52
font_size: 28
segment_gap: 2
```

---

## Card is too tall

Reduce:

```yaml
segment_height: 58
font_size: 32
card_padding: 8
```

For very compact rows:

```yaml
segment_height: 46
font_size: 24
card_padding: 6
```

---

## Text is not vertically centered

Use:

```yaml
text_vertical_offset: -3
```

Negative values move text upward.  
Positive values move text downward.

For icons, use:

```yaml
icon_vertical_offset: -2
```

---

## Icons are not aligned with text

Icons use separate vertical positioning.

Try:

```yaml
icon_vertical_offset: -2
```

or:

```yaml
icon_vertical_offset: 0
```

You can also adjust size:

```yaml
icon_size: 24
```

---

## Animation is too slow

Large charsets and `cycle` mode can make animation slower.

Try:

```yaml
flip_mode: shortest
```

or:

```yaml
flip_mode: direct
```

For frequently changing values:

```yaml
animation: true
animation_engine: mechanical
flip_mode: direct
step_duration: 40
final_step_duration: 90
stagger: 0
randomize_speed: false
```

---

## Animation is too fast

Use longer durations:

```yaml
animation: true
animation_engine: mechanical
flip_mode: shortest
step_duration: 80
final_step_duration: 220
stagger: 12
randomize_speed: true
```

---

## Clock skips seconds or feels delayed

Clock mode is designed to use direct flip behavior.

Use:

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
segments: 8
animation: true
animation_engine: mechanical
```

Avoid overriding clock mode with large charsets or slow stagger settings.

Clock mode automatically applies a numeric charset and direct flip behavior internally.

---

## Clock does not show seconds

Use:

```yaml
clock_format: HH:mm:ss
segments: 8
```

For hours and minutes only:

```yaml
clock_format: HH:mm
segments: 5
```

---

## Font does not look right

Split-flap displays usually work best with monospaced fonts.

Recommended:

```yaml
font_family: "Roboto Mono, monospace"
```

If using Google Fonts:

```yaml
font_source: google
google_font: "Roboto Mono"
font_family: "Roboto Mono, monospace"
```

Google Fonts require internet access on the dashboard device.

---

## Custom font does not load

If using a local font:

```yaml
font_source: custom_url
custom_font_url: /local/fonts/my-font.woff2
custom_font_family: MyCustomFont
font_family: "MyCustomFont, monospace"
```

The font file should be placed in:

```text
/config/www/fonts/my-font.woff2
```

which becomes:

```text
/local/fonts/my-font.woff2
```

---

## Visual editor does not show all options clearly

The visual editor uses Home Assistant's built-in config form.

If the visual editor feels too limited, switch to YAML mode and configure the card manually.

All options are documented in:

```text
docs/configuration.md
```

---

## Browser console errors

If the card fails to load or behaves unexpectedly, check the browser console.

Useful information to include in a bug report:

```text
Home Assistant version
HACS version
Browser and device
Installation method
Card version or resource URL
Full YAML configuration
Screenshot or short video
Browser console errors
```

---

## When reporting an issue

Please include:

- Home Assistant version
- HACS version
- Browser and device
- Installation method: HACS or manual
- Card version or resource URL
- Full YAML card configuration
- Screenshot or short video
- Browser console errors

This makes issues much easier to reproduce and fix.

---

## Best practices

- Use the smallest charset that supports your content.
- Use `weather` or `weather_sv` when displaying `°`.
- Use `icon_tokens: true` when using tokens such as `:sunny:` or `:train:`.
- Use `page_mode: auto` for long text.
- Use `flip_mode: direct` for frequently changing values.
- Use `flip_mode: shortest` for a balance between speed and mechanical feel.
- Avoid loading both HACS and manual resources at the same time.
- Keep public examples generic, such as `CENTRAL STATION`, `STATION A`, and `PLATFORM 5`.
