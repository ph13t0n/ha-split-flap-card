# UI Editor Manual

This manual describes the Split-Flap Card visual editor.

## UI editor manual

The editor is organized as a guided flow:

1. **Content** — choose what the card should display.
2. **Appearance** — choose theme, typography, alignment and flap slots.
3. **Motion** — choose animation behavior.
4. **Advanced** — fine-tune typography, flap geometry, animation, colors and character data.

The editor is designed for high contrast, clear interaction states and a dark terminal/wayfinding visual language.

## Content

Use **Content** to choose the data source.

Available source modes:

- **Text** — show fixed text from the card configuration.
- **Entity / Sensor** — show a Home Assistant entity state or one of its attributes.
- **Clock** — show a browser-side clock using the selected format.

Only the fields relevant to the selected source are shown.

## Appearance

Use **Appearance** to choose the visual style.

### Theme

Themes change the split-flap segments and text color. They do not replace the whole card background by default.

Available themes:

- Default / Mechanical Gold
- Classic Airport
- Terminal Amber
- Nordic Light
- Monochrome
- Home Assistant Blue
- Sweden Delight

The dark card background and frame/housing remain stable unless changed manually in Advanced mode.

### Typography

The typography selector shows a compact preview for each font style.

Available typography presets:

- **Theme default** — uses the selected theme typography.
- **Mechanical** — condensed and mechanical.
- **Transit** — wayfinding and airport signage inspired.
- **Clean** — modern and neutral.
- **Mono** — technical, monospaced terminal style.
- **Custom** — uses a custom CSS `font-family` and optional stylesheet URL.

### Custom fonts

When **Custom** is selected, Advanced mode opens and shows fields for:

- `font_family`
- `font_stylesheet`

The stylesheet URL may point to a supported stylesheet such as a Google Fonts CSS URL or a local Home Assistant `/local/...` stylesheet.

Examples:

```yaml
font_preset: custom
font_family: "Roboto Condensed, Arial Narrow, sans-serif"
font_stylesheet: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;900&display=swap"
```

For locally hosted fonts, add your own stylesheet under Home Assistant `www`, then reference it through `/local/...`.

Example:

```yaml
font_preset: custom
font_family: "My Custom Font, sans-serif"
font_stylesheet: "/local/fonts/my-custom-font.css"
```

The user is responsible for making sure they have the correct rights and licenses for any font they load or upload.

## Motion

Use **Motion** to choose animation behavior.

Available animation feels:

- Calm
- Mechanical
- Fast
- Instant
- Custom

When **Custom** is selected, Advanced mode opens and exposes animation fine-tuning.

Animation values use milliseconds where marked with `(ms)`.

## Advanced

Advanced mode exposes detailed controls.

### Advanced typography

Controls:

- Font size
- Font weight
- Italic
- Letter spacing
- Letter position up/down
- Text transform
- Text glow

Default text glow should remain `off` for crisp split-flap readability.

### Flap slot design

Controls:

- Slot width
- Slot height
- Gap between slots
- Corner radius

### Animation fine-tuning

Controls:

- Flip duration (ms)
- Delay between flaps (ms)
- Shuffle steps before final letter

### Colors

Controls:

- Card background
- Frame / housing
- Top flap color
- Bottom flap color
- Flap border
- Split line
- Text color

Theme selection updates flap and text colors. Card background and frame/housing remain dark unless changed manually.

### Advanced text data

Controls:

- Charset
- Custom charset
- Fallback character
- Pad character

Use this when you need Swedish/Nordic characters, special characters or controlled padding behavior.

## Accessibility notes

The editor uses:

- High-contrast interaction colors.
- Visible focus outlines.
- Clear section grouping.
- Help buttons for each section.
- Labels for form controls.

Themes should maintain strong contrast between segment background and text color.

## Future work

Planned future work includes:

- Symbol packs.
- Airport/railway wayfinding presets.
- Community library for shared themes and examples.
- Import/export of reusable presets.
