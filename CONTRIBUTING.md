# Contributing

Thank you for considering contributing to **Split-Flap Card**.

Split-Flap Card is a Home Assistant Lovelace custom card that renders text, entity states, clocks, auto-paged messages, and MDI icon tokens as a mechanical split-flap display.

This project is currently in alpha. Contributions, bug reports, documentation improvements, testing feedback, and feature ideas are welcome.

---

## Ways to contribute

You can contribute by:

- Reporting bugs
- Suggesting features
- Improving documentation
- Testing releases
- Creating generic screenshots or examples
- Improving visual editor behavior
- Improving themes
- Improving charset support
- Improving animation behavior
- Submitting pull requests

---

## Before contributing

Please read:

- [README](README.md)
- [Support](SUPPORT.md)
- [Installation](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Development](docs/development.md)
- [Privacy and Public Examples](docs/privacy-and-public-examples.md)

---

## Public example policy

Use generic examples in documentation, issues, screenshots, and pull requests.

Recommended:

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

Avoid:

- Private addresses
- Personal locations
- Real private entity names
- API keys
- Tokens
- Secrets
- Personal dashboard names
- Screenshots showing private homes or reflections
- Private calendar or sensor data

---

## Development setup

For development, use manual installation.

Copy:

```text
dist/ha-split-flap-card.js
```

to:

```text
/config/www/ha-split-flap-card.js
```

Then add this dashboard resource in Home Assistant:

```yaml
url: /local/ha-split-flap-card.js?v=dev
type: module
```

When making changes, update the query string:

```yaml
url: /local/ha-split-flap-card.js?v=dev-001
type: module
```

This avoids browser cache issues.

---

## Do not load duplicate resources

Do not load both HACS and manual resources at the same time.

Use either:

```yaml
url: /hacsfiles/ha-split-flap-card/ha-split-flap-card.js
type: module
```

or:

```yaml
url: /local/ha-split-flap-card.js?v=dev
type: module
```

but not both.

---

## Branch naming

Recommended branch names:

```text
feature/icon-tokens
feature/visual-editor
feature/theme-presets
fix/clock-animation
fix/charset-degree-symbol
fix/icon-alignment
docs/update-examples
docs/improve-readme
release/v0.1.0-alpha.1
```

---

## Commit messages

Use clear commit messages.

Good examples:

```text
Add icon token rendering
Fix clock animation timing
Update generic examples
Improve charset documentation
Add troubleshooting guide
```

Avoid vague commit messages such as:

```text
Update files
Fix stuff
Changes
```

---

## Pull request checklist

Before opening a pull request, check:

- [ ] The card loads in Home Assistant
- [ ] No browser console errors are present
- [ ] Existing examples still work
- [ ] New options are documented
- [ ] README links still work
- [ ] Documentation uses generic examples
- [ ] Screenshots do not contain private information
- [ ] `CHANGELOG.md` is updated if needed
- [ ] HACS validation passes if applicable

---

## Code guidelines

Recommended principles:

- Keep the card dependency-free where possible.
- Keep defaults safe and predictable.
- Avoid breaking existing YAML options.
- Prefer backwards-compatible changes.
- Keep clock mode fast and reliable.
- Treat icon tokens as one logical segment.
- Keep large charset behavior predictable.
- Keep public documentation generic.
- Keep visual defaults readable.
- Document new options.

---

## Configuration compatibility

Avoid renaming existing configuration options unless absolutely necessary.

Prefer adding new options instead of changing or removing existing ones.

If a breaking change is required:

1. Document it in `CHANGELOG.md`.
2. Mention it in the GitHub Release notes.
3. Add migration instructions.
4. Avoid making the breaking change before `v1.0.0` unless necessary.

---

## Testing checklist

Before submitting a change, test the relevant areas:

- [ ] Static text
- [ ] Entity state
- [ ] Entity attribute
- [ ] Built-in clock
- [ ] Swedish charset
- [ ] Weather charset with `°`
- [ ] Custom charset
- [ ] Auto-paging
- [ ] MDI icon tokens
- [ ] Visual editor
- [ ] Manual YAML configuration
- [ ] Browser cache refresh behavior
- [ ] Mobile or tablet rendering if possible

---

## Documentation contributions

Documentation improvements are welcome.

Good documentation contributions include:

- Clearer examples
- More generic examples
- Better troubleshooting steps
- Better visual editor explanations
- Better HACS installation instructions
- Better theme examples
- Better charset examples
- Corrected broken links
- Typo fixes

Documentation should use generic names and placeholder entities.

Recommended generic entity:

```yaml
entity: input_text.split_flap_message
```

---

## Issue labels

Common labels may include:

```text
bug
feature
documentation
configuration
hacs
visual-editor
animation
charset
theme
mdi-icons
needs-info
needs-review
confirmed
duplicate
wontfix
good-first-issue
breaking-change
```

---

## Security and privacy

Do not include secrets, API keys, tokens, private URLs, or personal data in issues or pull requests.

If you accidentally publish sensitive information, remove it immediately and rotate the affected secret.

For security-related guidance, see:

```text
SECURITY.md
```

---

## Release process

Release preparation is handled by maintainers.

Recommended release flow:

1. Test the latest JavaScript file.
2. Update documentation.
3. Update `CHANGELOG.md`.
4. Confirm `hacs.json`.
5. Confirm HACS validation passes.
6. Create a GitHub Release.
7. Mark alpha releases as pre-release.
8. Test installation after release.

---

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

The source code is licensed under the MIT License unless otherwise stated.

Project name, logo, screenshots, and branding assets may be subject to separate usage restrictions and are not automatically licensed for unrestricted reuse.

See [LICENSE](LICENSE).

---

## Thank you

Contributions help make Split-Flap Card better for Home Assistant users, dashboard builders, kiosk displays, wall tablets, and transit-style information boards.
