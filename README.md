# Split-Flap Card for Home Assistant

![Split-Flap Card preview](preview.svg)

## Notice

This project is currently in alpha.

The configuration API may change before `v1.0.0`.

## Overview

Split-Flap Card is a Home Assistant Lovelace custom card that renders static text, entity states, entity attributes and a browser-based clock as a mechanical split-flap display.

## Current alpha features

- Static text
- Entity state
- Entity attribute
- Built-in browser clock
- Mechanical split-flap animation
- `segments` and `max_chars`
- Swedish charset support with `Å`, `Ä`, `Ö`
- Nordic charset support
- Western European charset support
- Weather charset support with `°`
- Extended charset preset
- Custom charset
- Configurable colors
- Configurable segment size
- Configurable font family and size
- Built-in themes:
  - `kiosk_gold`
  - `classic_airport`
  - `terminal_amber`
  - `monochrome`
- HACS-compatible dashboard plugin structure

## Not included yet

- Auto-paging
- MDI icon token rendering
- Visual editor
- Google Font loader
- Custom font URL loader
- Advanced flip modes such as `shortest` and `direct`

## Installation

### HACS custom repository

1. Open **HACS**.
2. Open **Custom repositories**.
3. Add this repository:

```text
https://github.com/ph13t0n/ha-split-flap-card
