# Split-Flap Card

A Home Assistant dashboard card that renders text, entity states, entity attributes and a browser-based clock as a mechanical split-flap display.

![Split-Flap Card preview](preview.svg)

## Current alpha features

- Static text
- Entity state
- Entity attribute
- Browser clock mode
- Basic visual editor
- Mechanical split-flap animation
- Swedish charset support with Å, Ä and Ö
- Weather charset with degree symbol
- Built-in themes:
  - kiosk_gold
  - classic_airport
  - terminal_amber
  - monochrome

## Installation notes

After installation:

1. Refresh your browser.
2. Restart the Home Assistant mobile app if needed.
3. Clear browser cache if the old version is still visible.

Home Assistant restart is normally not required.

## Repository

https://github.com/ph13t0n/ha-split-flap-card

## Resource path

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
