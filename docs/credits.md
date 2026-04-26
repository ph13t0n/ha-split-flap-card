# Credits and Inspiration

Split-Flap Card is a custom-built Home Assistant Lovelace card inspired by classic mechanical split-flap displays used in railway stations, airports, transit hubs, and information boards.

The implementation in this repository is custom-built for Home Assistant and is not intended to be presented as a direct fork of any specific project unless explicitly stated in the repository history.

---

## Inspiration

This project was inspired by the general visual and mechanical concept of split-flap displays, sometimes also known as Solari-style displays.

Useful references and related projects:

| Project / Resource | Notes |
|---|---|
| [SolariDisplay](https://github.com/spite/SolariDisplay) | Split-flap display with CSS and JavaScript |
| [react-split-flap-effect](https://github.com/jayKayEss/react-split-flap-effect) | React-based split-flap display component |
| [Flapper](https://github.com/jayKayEss/Flapper) | jQuery split-flap style number display |
| [FlipDown](https://github.com/PButcher/flipdown) | Countdown display with flip-style animation |
| [Split-flap display - Wikipedia](https://en.wikipedia.org/wiki/Split-flap_display) | General background on split-flap displays |

---

## Data source examples

Split-Flap Card does not include any built-in public transport API integration.

However, it can display text generated from Home Assistant entities, template sensors, automations, REST sensors, or external integrations.

Examples of possible external data sources include:

| Source | Use case |
|---|---|
| [Trafiklab](https://www.trafiklab.se/) | Swedish public transport open data |
| Home Assistant sensors | Local sensor states |
| Home Assistant template sensors | Formatted dashboard messages |
| Home Assistant REST sensors | External API values |
| Calendar entities | Events, departures, schedules, and reminders |

Trafiklab provides official open data for public transport in Sweden and can be used as a source for transit-board style dashboards. Split-Flap Card only displays data that is already available in Home Assistant.

---

## Attribution note

This card is inspired by the visual language of mechanical split-flap displays.

Unless otherwise stated:

- No external JavaScript library is bundled.
- No third-party source code is copied directly into this project.
- External projects are credited as inspiration and reference material.
- Users are responsible for complying with the terms of any external API or data source they connect to Home Assistant.

---

## Public example policy

Examples in this repository should use generic names and placeholder data.

Recommended examples:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
GATE A12
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
:sunny: SUNNY 3 °C
```

Avoid using private, identifying, or location-specific examples in public documentation.

---

## Related documentation

- [Installation](installation.md)
- [Configuration](configuration.md)
- [Examples](examples.md)
- [Charsets](charsets.md)
- [Icon Tokens](icon-tokens.md)
- [Themes](themes.md)
- [Troubleshooting](troubleshooting.md)
- [Privacy and Public Examples](privacy-and-public-examples.md)
