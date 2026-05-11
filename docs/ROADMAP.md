# Split-Flap Card Roadmap

This roadmap captures the next planned work after the `v0.1.0-beta.13` pre-release and the `v0.1.0-beta.14` security hotfix.

## Current priority

1. Keep the beta release channel clean and versioned.
2. Close CodeQL/security warnings before adding more complex animation code.
3. Continue visual/editor improvements without breaking the working editor layout.

## v0.1.0-beta.14

Security and release metadata hotfix.

- CodeQL DOM text warning: preview summary path.
- CodeQL DOM text warning: diagnostics path.
- Package metadata bump.
- Dedicated release notes.

## Next feature beta

Planned focus:

- `display_frame` refinement.
- Decorative frame around the actual segment rail, not the entire card.
- Better screw visibility and frame density.
- `segment_depth` visual tuning:
  - raised
  - flat
  - recessed / inset
- Editor copy improvements so visual settings are understandable for both beginners and advanced users.
- Clock source default toward `HH:mm:ss` where appropriate.
- Saved Looks polish.
- Theme/look import and export improvements.

## Animation engine beta

Planned focus:

- Clearer upper-flap fall.
- Over-roll / roll-past behavior.
- Better mechanical timing.
- Better multi-segment synchronization for clock changes.
- Avoiding unnecessary flicker or full re-render side effects.
- Keeping reduced-motion behavior accessible.

## Security rule for future code

- Dynamic text should use `textContent`.
- HTML templates should contain static/safe markup only.
- Config/entity/user values must not be inserted raw into `innerHTML`.
- Copilot Autofix should be reviewed by diff before merge.
