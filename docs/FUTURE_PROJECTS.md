# Future Projects — Split-Flap Card

This document collects ideas that should not block the current release, but should be considered for future versions.

## Community Library

Create a shared library where users can upload, browse and download community-created assets for Split-Flap Card.

### Purpose

The library should make it easier for users to share polished visual configurations without manually copying long YAML examples.

Potential library content:

- Themes
- Color palettes
- Symbol sets
- Airport/signage presets
- Typography presets
- Example card configurations
- Dashboard-ready templates

### User value

Users should be able to:

- Download themes created by other users.
- Upload their own themes and examples.
- Browse themes visually before using them.
- Copy ready-to-use YAML.
- Import a preset into the UI editor if technically feasible later.

### Initial scope idea

Start simple:

1. A documented GitHub folder with community presets.
2. Each preset stored as YAML or JSON.
3. Each preset includes a preview image.
4. README index lists available presets.
5. Users submit presets through Pull Requests.

Possible folder structure:

```text
community/
  themes/
    mechanical-gold-plus/
      theme.yaml
      preview.png
      README.md
    airport-yellow-dark/
      theme.yaml
      preview.png
      README.md
  symbols/
    airport-wayfinding/
      symbols.yaml
      preview.png
      README.md
```

### Later scope idea

A more advanced future version could include a built-in library browser in the card editor.

Possible future features:

- Browse community themes directly from the editor.
- Import a selected theme into the card configuration.
- Validate contrast and required fields before import.
- Mark themes as WCAG-oriented, dark, light, airport, kiosk, terminal, railway, etc.
- Support locally installed community packs.

### Design caution

This should be treated as a future project and should not delay the current UI editor and `mechanical_gold` release candidate.

The first release should focus on stable local configuration before adding online/library behavior.
