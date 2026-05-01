# Standing Context — Split-Flap Card

This document contains standing project context for future updates, pull requests and design decisions.

## Project intent

Split-Flap Card is a Home Assistant Lovelace custom card intended to render text, entity states, entity attributes and clock values as a visually convincing mechanical split-flap display.

The project should feel like a physical display, not only a digital text widget.

## Visual direction

The preferred visual direction is:

- dark recessed display housing
- black or near-black mechanical flap segments
- warm amber/gold typography
- subtle but visible shadows
- clear horizontal split line through each segment
- mechanical hinge/pin impression
- condensed display-like typography
- high contrast against dark backgrounds
- restrained glow, not neon
- a premium kiosk/signage feeling

## Mechanical target theme

The `mechanical_gold` theme should be treated as the main visual target for a more realistic split-flap look.

It should prioritize:

- physical depth
- segment realism
- readable amber text
- clean Home Assistant dashboard integration
- compatibility with existing card configuration

Existing themes such as `kiosk_gold`, `classic_airport`, `terminal_amber` and `monochrome` should remain available and should not be removed without a clear migration reason.

## UX and editor reference

Andy Segment Displaycard is used as a reference for configuration UX and visual grouping, especially:

- clear section headers
- dark UI surface
- gold/brown highlighted group bars
- grouped configuration areas
- support/project information section
- global settings area
- render style selection
- visual clarity for non-developer users

This is a UX reference, not a dependency.

Split-Flap Card should avoid directly copying another project’s code or proprietary design, but may use similar clarity, grouping and dashboard-friendly configuration patterns.

## Support/project section

A support section may be included in documentation or editor UI when appropriate.

Tone should be personal but professional:

- hobby project
- Home Assistant focused
- built while learning
- support helps continued maintenance

## Update rules

When updating the card:

1. Do not break existing YAML configurations.
2. Keep backwards compatibility unless a breaking change is clearly documented.
3. Update both `src/ha-split-flap-card.js` and `dist/ha-split-flap-card.js`.
4. Keep HACS compatibility in mind.
5. Do not remove existing themes unless explicitly planned.
6. Prefer additive changes over destructive changes.
7. Document new options in README.
8. Test syntax before release.
9. Keep the visual goal aligned with the mechanical split-flap reference.

## Local and GitHub workflow

Preferred workflow:

1. Create a feature branch.
2. Make changes in branch only.
3. Keep `main` untouched until reviewed.
4. Open a Pull Request.
5. Test in Home Assistant locally.
6. Merge only after visual and functional review.

## Design caution

Do not change layout, naming, theme behavior or default behavior unless explicitly approved.

Visual improvements are welcome, but they should be scoped, documented and reversible.
