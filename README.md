
# Split-Flap Card for Home Assistant

![Split-Flap Card preview](preview.svg)

## Notice

This project is currently in alpha.

The configuration API may change before `v1.0.0`.  
Bug reports are welcome, but please include your full YAML card configuration, Home Assistant version, browser/device information, screenshots if possible, and any browser console errors.

---

## Overview

**Split-Flap Card** is a Home Assistant Lovelace custom card that renders text, entity states, entity attributes, auto-paged messages, MDI icon tokens, and a built-in clock as a classic mechanical split-flap display.

It is inspired by railway station and airport departure boards, with support for animated segment flipping, multilingual character sets, Swedish characters, weather text, degree symbols, and configurable visual styling.

---

## Features

- Display static text
- Display Home Assistant entity states
- Display entity attributes
- Built-in clock mode
- Mechanical split-flap animation
- Auto-paging for long text
- Smart page splitting by words
- Fixed-length page splitting
- MDI icon tokens rendered through `ha-icon`
- Configurable icon token map
- Configurable icon color, size, and vertical offset
- Built-in visual editor using Home Assistant config form
- Configurable colors
- Configurable segment size
- Configurable font family
- Configurable font size
- Configurable hinge line
- Configurable pin visibility
- Configurable card and segment shadows
- Swedish charset support with `Å`, `Ä`, `Ö`
- Nordic charset support
- Weather charset support including `°`
- Extended Latin / CP1252 charset preset
- Custom charset support
- HACS-compatible dashboard plugin structure

---

## Installation

### HACS custom repository

1. Open **HACS** in Home Assistant.
2. Open the menu in the top-right corner.
3. Select **Custom repositories**.
4. Add this repository URL:

   ```text
   https://github.com/YOUR_GITHUB_USERNAME/ha-split-flap-card