# Release Candidate Decisions — Split-Flap Card

These decisions apply to the current UI editor and `mechanical_gold` release candidate work.

## Source and distribution paths

Validated project paths:

- Runtime source file: `src/ha-split-flap-card.js`
- HACS/distribution file: `dist/ha-split-flap-card.js`

The file `src/split-flap-card.js` is not present on the current feature branch.

When promoting the validated canary into the release candidate, update both source and distribution files.

## Canary status

`ha-split-flap-card-canary-v5.js` is considered user-validated as the current working baseline.

The release candidate should use V5 as the implementation baseline, then apply only the approved final corrections.

## Public visual material

Do not publish screenshots or images from V5 or earlier canary versions as public release assets.

The visual reference may be described in text as a target direction, for example:

- mechanical split-flap target
- airport/signage-inspired high-contrast display
- dark segment with crisp amber/yellow or white lettering

Use the term `målbild` only as a textual design reference, not as a public image unless an approved final asset is created later.

## Default text rendering

Default text must be crisp and high-contrast.

A split-flap display should normally use:

- dark flap backgrounds
- yellow/amber or white text
- hard, sharp letter edges
- no default glow
- strong contrast between text and flap background

Do not use glow as a default. Glow may remain as an optional advanced effect, but the default should be `off`.

Avoid wording such as "light glow" when describing the default visual style. Use wording such as:

- crisp text
- high contrast
- sharp letter edges
- display-grade readability

## Theme naming

`mechanical_gold` may be presented to users as `Default / Mechanical Gold` in the editor.

The internal YAML key may remain `mechanical_gold` for compatibility.

## Theme set for the release candidate

Planned built-in themes:

- Default / Mechanical Gold
- Classic Airport
- Terminal Amber
- Nordic Light
- Monochrome
- Home Assistant Blue

`Nordic Light` may use a silver/light housing, but must still keep WCAG-oriented contrast in mind.

## Airport/signage inspiration

Airport and transport signage should inform the theme system:

- high contrast
- limited palettes
- strong yellow/black combinations
- white/dark combinations
- blue/yellow or blue/white combinations where contrast allows
- clear symbolic language

## Future symbol work

Add future support for default symbols and sign-like elements.

Potential symbols:

- arrows in all directions
- forward/back arrows
- diagonal up/down arrows
- gates
- check-in
- information
- security
- baggage
- transfer
- arrivals
- departures

Some sign symbols may require two flap slots to render as a square icon segment.

This should be treated as a future enhancement and should not block the current release candidate unless implemented safely.

## Per-flap color work

Future or advanced release-candidate work may include color controls for the flap itself:

- flap top color
- flap bottom color
- flap border color
- split line color
- frame/housing background
- text color

Later work may support individual colored flap slots or special colored symbol slots.
