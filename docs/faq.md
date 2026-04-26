# FAQ

Frequently asked questions for **Split-Flap Card**.

---

## What is Split-Flap Card?

Split-Flap Card is a Home Assistant Lovelace custom card that displays text, entity states, attributes, clocks, paged messages, and icon tokens as a mechanical split-flap display.

It is inspired by classic railway and airport departure boards.

---

## Is this card stable?

The project is currently in alpha.

The configuration API may change before `v1.0.0`.

Use it for testing, dashboards, and experimentation, but expect changes while the card is still under active development.

---

## Does it work with HACS?

Yes.

Split-Flap Card is designed as a HACS-compatible dashboard plugin.

Until it is included as a default HACS repository, it should be installed as a custom repository.

---

## Does it support the visual editor?

Yes.

The card includes a Home Assistant visual editor using Home Assistant's built-in configuration form.

Advanced configuration is still best done in YAML.

---

## Can it display entity states?

Yes.

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
segments: 32
theme: kiosk_gold
```

---

## Can it display entity attributes?

Yes.

```yaml
type: custom:split-flap-card
source: entity
entity: weather.home
attribute: temperature
charset: weather
segments: 6
theme: kiosk_gold
```

---

## Can it display a clock?

Yes.

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
segments: 8
theme: kiosk_gold
```

Clock mode automatically optimizes the charset and animation behavior for time display.

---

## Can it show seconds?

Yes.

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

## Can it display Swedish characters?

Yes.

Use:

```yaml
language: sv
charset: sv
```

This supports:

```text
Å Ä Ö
```

For Swedish weather text and the degree symbol:

```yaml
language: sv
charset: weather_sv
```

---

## Can it display the degree symbol?

Yes.

Use one of these charsets:

```yaml
charset: weather
```

or:

```yaml
charset: weather_sv
```

or:

```yaml
charset: extended
```

The degree symbol is:

```text
°
```

---

## Can it display MDI icons?

Yes, through icon tokens.

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

The token `:sunny:` is rendered as an MDI icon through Home Assistant's `ha-icon`.

---

## Can I write `mdi:weather-sunny` directly in the text?

No.

Use token syntax instead:

```text
:sunny:
```

Correct:

```text
:sunny: SUNNY 3 °C
```

Incorrect:

```text
mdi:weather-sunny SUNNY 3 °C
```

---

## Can I add my own icon tokens?

Yes.

Use `icon_map`.

```yaml
icon_tokens: true
icon_map:
  platform: mdi:map-marker
  departures: mdi:sign-direction
```

Then use:

```text
:platform: PLATFORM 5
```

---

## Do icon tokens count as one character?

They count as one segment.

This:

```text
:sunny: SUNNY
```

is counted as:

```text
[icon] S U N N Y
```

not as:

```text
: s u n n y :
```

---

## Can long text scroll?

The card does not currently use marquee-style scrolling.

Instead, it supports auto-paging.

```yaml
page_mode: auto
page_duration: 3
page_split: smart
```

Long text is split into multiple pages and the card flips between them.

---

## Can text be split automatically?

Yes.

Use:

```yaml
page_mode: auto
page_split: smart
```

Smart paging tries to split on words instead of cutting text in the middle of words.

---

## Why does auto-paging not change page?

Auto-paging only activates when the content is longer than the configured segment count.

Example:

```yaml
segments: 32
page_mode: auto
```

If the text is 32 segments or shorter, only one page is shown.

---

## Why are some characters missing?

The selected charset probably does not include those characters.

Use a broader charset or define a custom charset.

Example:

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ:-.,°"
```

---

## Which charset should I use?

Recommended choices:

| Use case | Recommended charset |
|---|---|
| English text | `en` |
| Swedish text | `sv` |
| Nordic text | `nordic` |
| Weather text | `weather` |
| Swedish weather text | `weather_sv` |
| Special Latin characters | `extended` |
| Clocks or numeric values | `custom` |

---

## Why is animation slow?

Large charsets make `cycle` animation slower because the card may need to flip through many characters.

Try:

```yaml
flip_mode: shortest
```

or:

```yaml
flip_mode: direct
```

For frequently changing values, use:

```yaml
flip_mode: direct
stagger: 0
randomize_speed: false
```

---

## Which flip mode should I use?

| Mode | Best for |
|---|---|
| `cycle` | Mechanical character cycling |
| `shortest` | Balanced animation |
| `direct` | Fast updates |

Recommended general setting:

```yaml
flip_mode: shortest
```

For clocks and fast-changing values:

```yaml
flip_mode: direct
```

---

## Can I customize the colors?

Yes.

Example:

```yaml
text_color: "#DCB215"
card_background: "#000000"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
```

---

## Can I customize the font?

Yes.

```yaml
font_family: "Roboto Mono, monospace"
font_size: 48
font_weight: 800
```

You can also use Google Fonts or local custom fonts.

---

## Can I use Google Fonts?

Yes.

```yaml
font_source: google
google_font: "Roboto Mono"
font_family: "Roboto Mono, monospace"
```

Google Fonts require internet access on the dashboard device.

---

## Can I use a local font?

Yes.

Place the font file in:

```text
/config/www/fonts/my-font.woff2
```

Then configure:

```yaml
font_source: custom_url
custom_font_url: /local/fonts/my-font.woff2
custom_font_family: MyCustomFont
font_family: "MyCustomFont, monospace"
```

---

## Why does the card not update after changing the JavaScript file?

Your browser may be using a cached version.

For manual installation, update the resource URL:

```yaml
url: /local/ha-split-flap-card.js?v=030
type: module
```

Then refresh the browser.

---

## Should I install both HACS and manual versions?

No.

Use either HACS:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

or manual installation:

```yaml
url: /local/ha-split-flap-card.js
type: module
```

Do not load both at the same time.

---

## Does it work on mobile?

It should work in modern browsers and the Home Assistant mobile app, but rendering may vary depending on device, browser engine, fonts, and available frontend features.

If you find a mobile-specific issue, include device and browser/app information in the bug report.

---

## Does it work on wall tablets and kiosk displays?

Yes, but test performance with your chosen segment count, animation settings, and browser.

For kiosk-style displays, keep the number of segments reasonable and use:

```yaml
flip_mode: shortest
```

or:

```yaml
flip_mode: direct
```

---

## Why do icons look different on different devices?

MDI icons are rendered through Home Assistant's frontend.

Icon rendering can vary slightly depending on Home Assistant version, browser, display scaling, and CSS.

---

## Why do emoji symbols look different on different devices?

Emoji rendering depends on the operating system and browser.

For consistent icons, use MDI icon tokens instead of emoji.

Recommended:

```text
:sunny:
```

instead of:

```text
🌞
```

---

## Can I use this card for weather?

Yes.

Recommended weather setup:

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SUNNY 3 °C"
charset: weather
segments: 16
icon_tokens: true
theme: kiosk_gold
```

For Swedish:

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SOLIGT 3 °C"
language: sv
charset: weather_sv
segments: 16
icon_tokens: true
theme: kiosk_gold
```

---

## Can I use this card for transit boards?

Yes.

Example:

```yaml
type: custom:split-flap-card
source: text
text: ":train: TRAIN TO CENTRAL STATION"
charset: en
segments: 28
icon_tokens: true
theme: kiosk_gold
```

---

## Can I use this card for information rows?

Yes.

Use compact segment dimensions:

```yaml
segment_width: 23
segment_height: 58
segment_gap: 3
font_size: 32
segments: 32
```

---

## What should I include in a bug report?

Include:

- Home Assistant version
- HACS version
- Browser and device
- Installation method
- Card version or resource URL
- Full YAML card configuration
- Screenshot or short video
- Browser console errors

---

## Where should I report bugs?

Use GitHub Issues in the project repository.

Please include enough information to reproduce the problem.

---

## Are public examples anonymized?

Yes, documentation examples should use generic values such as:

```text
CENTRAL STATION
STATION A
PLATFORM 5
EXEMPELSTAD
```

Avoid using private locations, personal dashboards, home addresses, or real private entity structures in public documentation.
