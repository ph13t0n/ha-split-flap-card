# Charsets

Split-Flap Card uses a charset to decide which characters can be displayed and cycled through during animation.

A charset is the list of characters the split-flap segments are allowed to show.

For example, a simple numeric charset could be:

```yaml
charset: custom
custom_charset: " 0123456789:"
```

This is useful for clocks or numeric values.

---

## Built-in charset presets

| Charset | Description |
|---|---|
| `en` | English letters, numbers, and common punctuation |
| `sv` | English + Swedish `Å`, `Ä`, `Ö` |
| `nordic` | Swedish + Nordic `Æ`, `Ø` |
| `western` | Western European characters |
| `weather` | English + weather symbols + `°` |
| `weather_sv` | Swedish + weather symbols + `°` |
| `extended` | Extended Latin / CP1252-style printable characters |
| `custom` | User-defined charset |

---

## English charset

Use `en` for English text, numbers, and common punctuation.

```yaml
charset: en
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: CENTRAL STATION
charset: en
segments: 16
theme: kiosk_gold
```

---

## Swedish charset

Use `sv` for Swedish text with `Å`, `Ä`, and `Ö`.

```yaml
language: sv
charset: sv
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: ÅÄÖ TEST FRÅN EXEMPELSTAD
language: sv
charset: sv
segments: 28
theme: kiosk_gold
```

---

## Nordic charset

Use `nordic` when you need Swedish and additional Nordic characters.

```yaml
charset: nordic
```

Includes support for characters such as:

```text
Å Ä Ö Æ Ø
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: NORDIC ÅÄÖ ÆØ TEST
charset: nordic
segments: 24
theme: kiosk_gold
```

---

## Western charset

Use `western` for broader Western European character support.

```yaml
charset: western
```

This preset is useful for names or text containing characters such as:

```text
Ü É È À Á Â Ã Ç Ñ Ó Ò Ô Õ Ú Ù Û Í Ì Î Ï Ê Ë Œ
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: CAFE ÉTAGE
charset: western
segments: 16
theme: kiosk_gold
```

---

## Weather charset

Use `weather` for English weather text, weather symbols, and the degree symbol.

```yaml
charset: weather
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: SUNNY 3 °C
charset: weather
segments: 12
theme: kiosk_gold
```

---

## Swedish weather charset

Use `weather_sv` for Swedish weather text, Swedish characters, weather symbols, and the degree symbol.

```yaml
language: sv
charset: weather_sv
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: SOLIGT 3 °C
language: sv
charset: weather_sv
segments: 12
theme: kiosk_gold
```

---

## Degree symbol

The degree symbol `°` is included in:

```text
weather
weather_sv
extended
```

If `°` does not appear, use one of these charsets:

```yaml
charset: weather
```

or:

```yaml
charset: weather_sv
```

or define a custom charset:

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ°:"
```

---

## Extended charset

Use `extended` when you need a broader set of printable Latin / CP1252-style characters.

```yaml
charset: extended
```

This is useful for testing or for special text values, but it can make character cycling slower because the charset is much larger.

For frequently changing values, consider using:

```yaml
flip_mode: shortest
```

or:

```yaml
flip_mode: direct
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: EXTENDED TEST ° € Ü É
charset: extended
segments: 24
theme: kiosk_gold
flip_mode: shortest
```

---

## Custom charset

Use `custom` when you want full control over which characters are available.

```yaml
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:-.,"
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: PLATFORM 5 16:54
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:-.,"
segments: 18
theme: kiosk_gold
```

---

## Custom Swedish charset

```yaml
type: custom:split-flap-card
source: text
text: SPÅR 5 16:54
language: sv
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ:-.,"
segments: 14
theme: kiosk_gold
```

---

## Custom weather charset

```yaml
type: custom:split-flap-card
source: text
text: TEMP 3 °C
charset: custom
custom_charset: " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:-.,°"
segments: 12
theme: kiosk_gold
```

---

## Clock charset

Clock mode automatically applies a numeric charset internally.

You normally do not need to define this manually:

```yaml
source: clock
clock_format: HH:mm:ss
```

Internally, clock mode uses a charset similar to:

```yaml
charset: custom
custom_charset: " 0123456789:"
```

If you create your own numeric display, use:

```yaml
charset: custom
custom_charset: " 0123456789:"
```

---

## Icon tokens and charsets

MDI icon tokens are not part of the charset.

For example:

```text
:sunny:
```

is treated as one icon segment when `icon_tokens: true` is enabled.

It is not treated as these characters:

```text
: s u n n y :
```

Example:

```yaml
type: custom:split-flap-card
source: text
text: ":sunny: SUNNY 3 °C"
charset: weather
segments: 16
icon_tokens: true
theme: kiosk_gold
```

---

## Fallback behavior

If the card receives a character that is not included in the selected charset, it uses the fallback character.

Default:

```yaml
fallback_character: " "
```

Example:

```yaml
fallback_character: "?"
```

If unsupported characters appear as blanks, choose a broader charset or define a custom charset.

---

## Performance considerations

Large charsets contain more characters to cycle through.

This can make animations slower when using:

```yaml
flip_mode: cycle
```

For large charsets, use:

```yaml
flip_mode: shortest
```

or:

```yaml
flip_mode: direct
```

Recommended:

| Use case | Recommended charset | Recommended flip mode |
|---|---|---|
| English text | `en` | `shortest` |
| Swedish text | `sv` | `shortest` |
| Weather text | `weather` | `shortest` |
| Swedish weather text | `weather_sv` | `shortest` |
| Clock | automatic/custom numeric | `direct` |
| Frequently changing values | custom minimal charset | `direct` |
| Special character testing | `extended` | `direct` |

---

## Best practices

- Use the smallest charset that supports your text.
- Use `sv` for Swedish text.
- Use `weather_sv` for Swedish weather text and `°`.
- Use `custom` for clocks, numbers, and highly controlled displays.
- Avoid `extended` unless you need broad character support.
- Use `flip_mode: direct` for values that update often.
- Use `flip_mode: shortest` for a good balance between speed and split-flap feeling.
- Keep public examples generic, such as `CENTRAL STATION`, `STATION A`, `PLATFORM 5`, and `EXEMPELSTAD`.
