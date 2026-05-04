# Canary UI Editor Test

This document describes how to test the experimental responsive UI editor before replacing the released `split-flap-card` implementation.

## Why this canary exists

The UI editor is being redesigned to be more logical, responsive, accessible and polished. To avoid breaking the existing card, the canary should be tested separately before it is merged into the main card implementation.

## Canary custom element

The canary build should register a separate card type:

```yaml
type: custom:split-flap-card-canary
```

This avoids replacing the existing released card during testing.

## Test resource

When the canary JavaScript file is available locally in Home Assistant, add it as a dashboard resource:

```yaml
url: /local/ha-split-flap-card-canary.js?v=0.1.0-alpha.2-canary.1
type: module
```

## Basic test card

```yaml
type: custom:split-flap-card-canary
source: text
text: SPLIT-FLAP TEST
segments: 16
theme: mechanical_gold
font_preset: mechanical
animation: true
initial_animation: true
animation_feel: mechanical
```

## Text mode test

Expected editor behavior:

- Text field is visible.
- Entity / sensor fields are hidden or disabled.
- Clock fields are hidden or disabled.

```yaml
type: custom:split-flap-card-canary
source: text
text: NÄSSJÖ CENTRAL
language: sv
charset: sv
segments: 14
theme: mechanical_gold
```

## Entity / sensor mode test

Expected editor behavior:

- Entity / sensor input is visible.
- Optional attribute input is visible.
- Text field is hidden or disabled.
- Clock fields are hidden or disabled.

```yaml
type: custom:split-flap-card-canary
source: entity
entity: input_text.split_flap_message
segments: 24
theme: mechanical_gold
```

## Clock mode test

Expected editor behavior:

- Clock format field is visible.
- Update interval field is visible.
- Text and entity / sensor fields are hidden or disabled.

```yaml
type: custom:split-flap-card-canary
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
charset: custom
custom_charset: " 0123456789:"
segments: 8
theme: mechanical_gold
cycle_chars: false
```

## Responsive checks

- Narrow editor panel should use one column.
- Wider editor panel may use two columns.
- No horizontal scrolling should be required.
- Touch targets should be usable on tablet/mobile.

## Accessibility checks

- Focus state should be visible.
- Inputs should have clear labels.
- Accent color should not be the only information indicator.
- Help links marked with `?` should be reachable by keyboard.

## Release rule

Do not replace the released `split-flap-card` implementation until the canary has been tested in Home Assistant.