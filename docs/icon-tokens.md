# Icon Tokens

Split-Flap Card can render Home Assistant / Material Design Icons by using text tokens.

Instead of writing an MDI icon directly in the text, you write a token such as:

```text
:sunny:
```

The card then renders it as an icon segment using Home Assistant's `ha-icon`.

Example:

```text
:sunny: SUNNY 3 °C
```

This displays one icon segment followed by text segments.

---

## Enable icon tokens

Icon tokens are disabled by default.

Enable them with:

```yaml
icon_tokens: true
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

## Important behavior

Each icon token counts as **one split-flap segment**.

This means:

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

This is important for paging and segment calculation.

---

## Default icon tokens

| Token | Rendered icon |
|---|---|
| `:sunny:` | `mdi:weather-sunny` |
| `:sun:` | `mdi:weather-sunny` |
| `:clear:` | `mdi:weather-sunny` |
| `:cloudy:` | `mdi:weather-cloudy` |
| `:cloud:` | `mdi:weather-cloudy` |
| `:partlycloudy:` | `mdi:weather-partly-cloudy` |
| `:partly_cloudy:` | `mdi:weather-partly-cloudy` |
| `:partly-cloudy:` | `mdi:weather-partly-cloudy` |
| `:partly:` | `mdi:weather-partly-cloudy` |
| `:rain:` | `mdi:weather-pouring` |
| `:rainy:` | `mdi:weather-rainy` |
| `:pouring:` | `mdi:weather-pouring` |
| `:showers:` | `mdi:weather-pouring` |
| `:snow:` | `mdi:weather-snowy` |
| `:snowy:` | `mdi:weather-snowy` |
| `:sleet:` | `mdi:weather-snowy-rainy` |
| `:storm:` | `mdi:weather-lightning-rainy` |
| `:thunder:` | `mdi:weather-lightning` |
| `:lightning:` | `mdi:weather-lightning` |
| `:lightning_rainy:` | `mdi:weather-lightning-rainy` |
| `:lightning-rainy:` | `mdi:weather-lightning-rainy` |
| `:fog:` | `mdi:weather-fog` |
| `:foggy:` | `mdi:weather-fog` |
| `:mist:` | `mdi:weather-fog` |
| `:windy:` | `mdi:weather-windy` |
| `:wind:` | `mdi:weather-windy` |
| `:hail:` | `mdi:weather-hail` |
| `:exceptional:` | `mdi:alert` |
| `:thermometer:` | `mdi:thermometer` |
| `:temperature:` | `mdi:thermometer` |
| `:temp:` | `mdi:thermometer` |
| `:train:` | `mdi:train` |
| `:bus:` | `mdi:bus` |
| `:tram:` | `mdi:tram` |
| `:info:` | `mdi:information` |
| `:warning:` | `mdi:alert` |
| `:alert:` | `mdi:alert` |
| `:clock:` | `mdi:clock-outline` |

---

## Weather example

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SUNNY 3 °C"
charset: weather
segments: 16
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2
theme: kiosk_gold
```

---

## Swedish weather example

This example demonstrates Swedish text, the degree symbol, and the Swedish weather charset.

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SOLIGT 3 °C"
language: sv
charset: weather_sv
segments: 16
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2
theme: kiosk_gold
```

---

## Train example

```yaml
type: custom:split-flap-card
source: text
text: ":train: TRAIN TO CENTRAL STATION"
charset: en
segments: 28
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Swedish train example

```yaml
type: custom:split-flap-card
source: text
text: ":train: TÅG MOT EXEMPELSTAD C"
language: sv
charset: sv
segments: 28
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Bus example

```yaml
type: custom:split-flap-card
source: text
text: ":bus: LINE 12 TO STATION A"
charset: en
segments: 28
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Swedish bus example

```yaml
type: custom:split-flap-card
source: text
text: ":bus: LINJE 12 MOT STATION A"
language: sv
charset: sv
segments: 28
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Custom icon map

You can override existing tokens or add your own.

```yaml
type: custom:split-flap-card
source: text
text: ":departures: DEPARTURES :train:"
segments: 20
icon_tokens: true
icon_map:
  departures: mdi:sign-direction
  train: mdi:train
theme: kiosk_gold
```

In this example:

| Token | Rendered icon |
|---|---|
| `:departures:` | `mdi:sign-direction` |
| `:train:` | `mdi:train` |

---

## Custom transport icon map

```yaml
type: custom:split-flap-card
source: text
text: ":platform: PLATFORM 5 :train:"
charset: en
segments: 20
icon_tokens: true
icon_map:
  platform: mdi:map-marker
  train: mdi:train
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Custom weather icon map

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: 3 °C :wind: 4 M/S"
charset: weather
segments: 20
icon_tokens: true
icon_map:
  sunny: mdi:weather-sunny
  wind: mdi:weather-windy
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Icon styling

### Icon color

```yaml
icon_color: "#DCB215"
```

If no icon color is set, the card uses `text_color`.

### Icon size

```yaml
icon_size: 24
```

### Icon vertical offset

```yaml
icon_vertical_offset: -2
```

Negative values move the icon upward.  
Positive values move the icon downward.

---

## Auto-paging with icons

Smart page splitting treats icon tokens as one segment.

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SUNNY 3 °C FROM CENTRAL STATION VIA PLATFORM 5"
charset: weather
segments: 20
page_mode: auto
page_duration: 3
page_split: smart
icon_tokens: true
theme: kiosk_gold
```

The icon will stay together as one segment and will not be split into separate characters.

---

## Swedish auto-paging with icons

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SOLIGT 3 °C FRÅN EXEMPELSTAD VIA STATION A"
language: sv
charset: weather_sv
segments: 20
page_mode: auto
page_duration: 3
page_split: smart
icon_tokens: true
theme: kiosk_gold
```

---

## Token syntax

Tokens must use this format:

```text
:name:
```

Correct:

```text
:sunny:
:train:
:bus:
```

Incorrect:

```text
mdi:weather-sunny
sunny
{sunny}
```

---

## Notes

- Icon tokens only work when `icon_tokens: true` is enabled.
- Unknown tokens are displayed as normal text.
- Icon tokens are rendered using Home Assistant's `ha-icon`.
- Icons do not cycle through the charset like normal characters.
- Icon changes use direct flip behavior internally.
- Each icon token counts as one segment.
- MDI icon availability depends on the Home Assistant frontend version.
- Public examples should use generic names such as `CENTRAL STATION`, `STATION A`, or `EXEMPELSTAD`.
