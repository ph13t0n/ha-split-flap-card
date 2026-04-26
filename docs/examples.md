# Examples

This document contains practical YAML examples for **Split-Flap Card**.

For all available configuration options, see [Configuration](configuration.md).

---

## Minimal static text

```yaml
type: custom:split-flap-card
source: text
text: NÄSSJÖ CENTRAL
language: sv
charset: sv
segments: 14
theme: kiosk_gold
```

---

## Static text with Swedish characters

```yaml
type: custom:split-flap-card
source: text
text: ÅÄÖ TEST FRÅN JÖNKÖPING
language: sv
charset: sv
segments: 28
theme: kiosk_gold
animation: true
animation_engine: mechanical
flip_mode: shortest
```

---

## Entity state

Displays the state of a Home Assistant entity.

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.andy_testtext
language: sv
charset: sv
segments: 32
theme: kiosk_gold
animation: true
animation_engine: mechanical
```

---

## Entity attribute

Displays a specific attribute from an entity.

```yaml
type: custom:split-flap-card
source: entity
entity: weather.openweathermap
attribute: temperature
charset: weather_sv
segments: 6
theme: kiosk_gold
```

---

## Built-in clock

Displays a clock directly from the card without needing a Home Assistant template sensor.

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
theme: kiosk_gold
segments: 8
animation: true
animation_engine: mechanical
```

Clock mode automatically uses a numeric charset and direct flip behavior suitable for time display.

---

## Clock without seconds

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm
clock_tick_interval: 1000
theme: kiosk_gold
segments: 5
animation: true
animation_engine: mechanical
```

---

## Weather text with degree symbol

Use `weather_sv` when displaying Swedish text, weather symbols, or the degree symbol `°`.

```yaml
type: custom:split-flap-card
source: text
text: SOLIGT 3 °C
language: sv
charset: weather_sv
segments: 12
theme: kiosk_gold
```

---

## Weather text with MDI icon token

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

The token `:sunny:` is rendered as `mdi:weather-sunny`.

---

## Train information with icon token

```yaml
type: custom:split-flap-card
source: text
text: ":train: TÅG MOT MALMÖ CENTRAL"
language: sv
charset: sv
segments: 28
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Bus information with icon token

```yaml
type: custom:split-flap-card
source: text
text: ":bus: LINJE 61 MOT NORRBODA"
language: sv
charset: sv
segments: 28
icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
theme: kiosk_gold
```

---

## Auto-paging long text

Auto-paging splits long text into multiple pages.

```yaml
type: custom:split-flap-card
source: text
text: TÅG MOT MALMÖ CENTRALSTATION ANKOMMER SPÅR 5 MED NY ANKOMSTTID 16:54
language: sv
charset: sv
segments: 32
page_mode: auto
page_duration: 3
page_split: smart
theme: kiosk_gold
animation: true
animation_engine: mechanical
flip_mode: shortest
```

Example output may be split into pages such as:

```text
TÅG MOT MALMÖ CENTRALSTATION
```

```text
ANKOMMER SPÅR 5 MED NY
```

```text
ANKOMSTTID 16:54
```

---

## Auto-paging entity state

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.andy_testtext
language: sv
charset: weather_sv
segments: 32
page_mode: auto
page_duration: 3
page_split: smart
icon_tokens: true
theme: kiosk_gold
animation: true
animation_engine: mechanical
flip_mode: shortest
```

Example entity value:

```text
:sunny: 2026-04-26 SOLIGT 3 °C FRÅN JÖNKÖPING VIA NÄSSJÖ
```

---

## Compact kiosk info row

This example is useful when placing the card in a narrow information row.

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.andy_testtext

language: sv
charset: weather_sv

segments: 32
page_mode: auto
page_duration: 3
page_split: smart

icon_tokens: true
icon_color: "#DCB215"
icon_size: 24
icon_vertical_offset: -2

theme: kiosk_gold
card_background: "#000000"
card_padding: 8
card_border_radius: 10
card_shadow: true
card_highlight: false

text_color: "#DCB215"
segment_background: "#111111"
segment_background_top: "#1B1B1B"
segment_background_bottom: "#090909"
segment_border_color: "#2A2A2A"
hinge_color: "#000000"

segment_width: 23
segment_height: 58
segment_gap: 3
segment_radius: 4

font_family: "Roboto Mono, monospace"
font_size: 32
font_weight: 800
letter_spacing: 0
text_vertical_offset: -3

hinge: true
hinge_thickness: 1
hinge_opacity: 0.35
pins: false

animation: true
animation_engine: mechanical
flip_mode: shortest
step_duration: 70
final_step_duration: 190
stagger: 8
randomize_speed: true
initial_animation: true
max_steps_per_update: 80
```

---

## Full Home Assistant layout-card info row

This example replaces a segment/matrix ticker with Split-Flap Card.

```yaml
type: custom:layout-card
layout_type: custom:grid-layout
layout:
  grid-template-columns: 25% 75%
  grid-column-gap: 0
  align-items: center
  margin: 0
cards:
  - type: custom:button-card
    entity: sensor.trafik_kiosk_info_label
    show_icon: false
    show_name: false
    show_state: true
    tap_action:
      action: none
    state_display: |
      [[[
        return (entity && entity.state) ? entity.state : 'INFO';
      ]]]
    styles:
      card:
        - background: |
            [[[
              return entity && entity.state && entity.state !== 'INFO'
                ? 'var(--kiosk-accent)'
                : 'transparent';
            ]]]
        - border: none
        - border-radius: 8px
        - box-shadow: none
        - padding: |
            [[[
              return entity && entity.state && entity.state !== 'INFO'
                ? '6px 14px'
                : '0';
            ]]]
        - margin: 0
        - margin-left: 22px
        - min-height: 86px
        - height: 86px
        - display: flex
        - align-items: center
        - justify-content: flex-start
        - width: calc(100% - 22px)
      state:
        - justify-self: start
        - align-self: center
        - color: |
            [[[
              return entity && entity.state && entity.state !== 'INFO'
                ? '#050505'
                : 'var(--kiosk-accent)';
            ]]]
        - font-family: "'Roboto Mono', monospace"
        - font-size: clamp(18px, 1.2vw, 23px)
        - font-weight: 700
        - letter-spacing: 1px
        - white-space: nowrap
        - line-height: 1.1

  - type: custom:mod-card
    card_mod:
      style: |
        ha-card {
          position: relative !important;
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          overflow: visible !important;

          padding: 0 22px 0 0 !important;
          margin: 0 !important;

          min-height: 86px !important;
          height: 86px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;

          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;

          box-shadow: none !important;
        }

        ha-card::before,
        ha-card::after {
          display: none !important;
          content: none !important;
        }
    card:
      type: custom:split-flap-card
      source: entity
      entity: input_text.andy_testtext

      language: sv
      charset: weather_sv

      segments: 32
      page_mode: auto
      page_duration: 3
      page_split: smart

      icon_tokens: true
      icon_color: "#DCB215"
      icon_size: 24
      icon_vertical_offset: -2

      theme: kiosk_gold
      card_background: "#000000"
      card_padding: 8
      card_border_radius: 10
      card_shadow: true
      card_highlight: false

      text_color: "#DCB215"
      segment_background: "#111111"
      segment_background_top: "#1B1B1B"
      segment_background_bottom: "#090909"
      segment_border_color: "#2A2A2A"
      hinge_color: "#000000"

      segment_width: 23
      segment_height: 58
      segment_gap: 3
      segment_radius: 4

      font_family: "Roboto Mono, monospace"
      font_size: 32
      font_weight: 800
      letter_spacing: 0
      text_vertical_offset: -3

      hinge: true
      hinge_thickness: 1
      hinge_opacity: 0.35
      pins: false

      animation: true
      animation_engine: mechanical
      flip_mode: shortest
      step_duration: 70
      final_step_duration: 190
      stagger: 8
      randomize_speed: true
      initial_animation: true
      max_steps_per_update: 80
```

---

## Custom icon map

You can override or add your own icon tokens.

```yaml
type: custom:split-flap-card
source: text
text: ":departures: AVGÅNGAR :train:"
segments: 20
icon_tokens: true
icon_map:
  departures: mdi:sign-direction
  train: mdi:train
theme: kiosk_gold
```

---

## Custom charset

```yaml
type: custom:split-flap-card
source: text
text: "TEMP 3 °C"
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ:-.,°"
segments: 12
theme: kiosk_gold
```

---

## Faster animation

Use this when displaying frequently changing text.

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

## More mechanical animation

Use this when the visual split-flap feeling is more important than speed.

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

## Disable animation

```yaml
animation: false
animation_engine: none
```

---

## Tips

- Use `charset: weather_sv` when displaying Swedish text together with `°`.
- Use `icon_tokens: true` when using tokens such as `:sunny:` or `:train:`.
- Use `page_mode: auto` for long text.
- Use `flip_mode: shortest` for a balance between speed and visual effect.
- Use `flip_mode: direct` for frequently changing values.
- Keep `segments` as low as possible for better readability on small displays.
