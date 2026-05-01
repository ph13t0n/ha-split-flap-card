# UI Editor Test Plan

This test plan is used before merging UI editor changes into `main`.

## Goal

Verify that the Split-Flap Card visual editor is logical, responsive, accessible where practical, lightweight and safe for existing YAML configurations.

## Test environment

Recommended test targets:

- Desktop browser
- Tablet browser or Home Assistant companion app
- Mobile/narrow editor panel
- Home Assistant dashboard edit mode

## Baseline checks

- [ ] Existing card YAML still renders.
- [ ] Unknown YAML keys are preserved after using the visual editor.
- [ ] No browser console errors appear when opening the editor.
- [ ] No browser console errors appear when saving from the editor.
- [ ] The card still works without the visual editor.

## Source / content logic

### Text mode

Configuration:

```yaml
type: custom:split-flap-card
source: text
text: SPLIT-FLAP TEST
segments: 16
theme: mechanical_gold
```

Expected result:

- [ ] Text input is visible.
- [ ] Entity / sensor fields are hidden or disabled.
- [ ] Clock fields are hidden or disabled.
- [ ] Preview updates after text changes.

### Entity / sensor mode

Configuration:

```yaml
type: custom:split-flap-card
source: entity
entity: input_text.split_flap_message
segments: 24
theme: mechanical_gold
```

Expected result:

- [ ] Entity / sensor input is visible.
- [ ] Optional attribute input is visible.
- [ ] Text field is hidden or disabled.
- [ ] Clock fields are hidden or disabled.
- [ ] Missing entity is handled clearly.

### Clock mode

Configuration:

```yaml
type: custom:split-flap-card
source: clock
clock_format: HH:mm:ss
clock_tick_interval: 1000
charset: custom
custom_charset: " 0123456789:"
segments: 8
theme: mechanical_gold
cycle_chars: false
```

Expected result:

- [ ] Clock format field is visible.
- [ ] Tick interval field is visible.
- [ ] Text field is hidden or disabled.
- [ ] Entity / sensor fields are hidden or disabled.
- [ ] Clock updates without unnecessary extra polling.

## Standard editor checks

- [ ] Main sections are clear and logically ordered.
- [ ] Terminology follows Home Assistant-friendly language.
- [ ] `Content` is used instead of `Source` as a visible section heading.
- [ ] `Entity / Sensor` is used instead of `Entity` alone.
- [ ] `Flap slots` is used instead of `Segments` in the standard editor.
- [ ] `Manual & Help` is used instead of `Support`.
- [ ] Standard mode does not overwhelm the user with advanced options.
- [ ] Typography is available as simple presets.
- [ ] Animation is available as an easy-to-understand animation feel.

## Advanced editor checks

- [ ] Advanced section can be expanded and collapsed.
- [ ] Advanced typography settings are grouped together.
- [ ] Font preset is available.
- [ ] Custom font family is available without external font loading.
- [ ] Font size is available.
- [ ] Font weight is available.
- [ ] Italic is available.
- [ ] Letter spacing is available.
- [ ] Text transform is available.
- [ ] Text glow strength is available if implemented.
- [ ] Segment/flap size controls are grouped separately.
- [ ] Animation fine-tuning uses descriptive labels.
- [ ] Color controls are grouped separately.
- [ ] Charset and fallback controls are grouped under advanced settings.

## Animation terminology checks

Technical YAML names may remain unchanged internally, but UI labels should be descriptive.

- [ ] `flip_duration` is shown as `Flip speed` / `Bläddringshastighet`.
- [ ] `flip_stagger` is shown as `Delay between flaps` / `Fördröjning mellan teckenrutor`.
- [ ] `cycle_count` is shown as `Shuffle steps before final letter` / `Mellansteg före slutbokstav`.
- [ ] Standard mode prefers `Animation feel` / `Animationskänsla` over raw timing fields.

## Conditional logic checks

- [ ] `charset: custom` shows custom charset input.
- [ ] Non-custom charset hides custom charset input.
- [ ] Animation off hides or disables animation fine-tuning.
- [ ] Animation on shows animation-relevant controls.
- [ ] Advanced controls do not appear in standard mode unless intentionally shown.

## Responsive layout checks

- [ ] Narrow editor panel uses one column.
- [ ] Wider editor panel may use two compact columns.
- [ ] No horizontal scrolling is required.
- [ ] Labels and help text wrap cleanly.
- [ ] Touch targets are usable on tablet/mobile.
- [ ] Preview scales or collapses cleanly on small screens.

## WCAG-oriented checks

- [ ] Text contrast is sufficient against the dark editor surface.
- [ ] Warm gold-orange accent is not the only information indicator.
- [ ] Focus state is visible for inputs, selects, buttons and links.
- [ ] Inputs have clear labels.
- [ ] Help links are understandable and reachable by keyboard.
- [ ] Layout remains understandable when zoomed.

## Manual & Help checks

- [ ] Manual/help section links to the GitHub documentation/manual.
- [ ] Repository link is visible.
- [ ] Ko-fi/support link is present but secondary.
- [ ] Help links marked with `?` point to relevant documentation.

## Performance checks

- [ ] No external fonts are loaded automatically.
- [ ] No heavy runtime dependencies are added.
- [ ] No unnecessary timers are created by the editor.
- [ ] Card timers are stopped when disconnected.
- [ ] Visual effects remain subtle and efficient.

## Release decision

Do not merge into `main` until:

- [ ] Syntax checks pass.
- [ ] `src` and `dist` are aligned.
- [ ] Standard editor path is tested.
- [ ] Advanced editor path is tested.
- [ ] Mobile/narrow layout is tested.
- [ ] README and CHANGELOG are updated.
