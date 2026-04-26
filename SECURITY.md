# Security Policy

This document explains how to report security-related issues for **Split-Flap Card**.

Split-Flap Card is a frontend-only Home Assistant Lovelace custom card. It does not include a backend service, does not store credentials, and does not directly communicate with external APIs.

---

## Supported versions

This project is currently in alpha.

| Version | Supported |
|---|---|
| `v0.1.x-alpha` | Best effort |
| `v0.2.x-beta` | Best effort |
| `v1.x` | Planned stable support |

Before `v1.0.0`, the configuration API may change.

---

## Reporting a security issue

If you believe you have found a security issue, please do **not** open a public GitHub Issue containing sensitive details.

Instead, report it privately using GitHub’s security advisory feature if available.

If GitHub security advisories are not available, open a minimal public issue without sensitive details and state that you need a private security contact.

Do not include:

- API keys
- Tokens
- Cookies
- Secrets
- Private URLs
- Personal addresses
- Screenshots containing private information
- Home Assistant long-lived access tokens
- Full private dashboard exports
- Private entity structures that reveal personal information

---

## What counts as a security issue?

Examples of security-related concerns:

- Unsafe handling of user-provided text
- HTML/script injection risk
- Unsafe rendering behavior
- Unexpected execution of user-provided content
- Exposure of private data through card rendering
- Documentation that encourages users to publish secrets
- Example code that leaks private information

---

## What is not a security issue?

The following are usually not security issues:

- Styling bugs
- Animation bugs
- Missing characters
- Missing icons
- Broken visual editor fields
- HACS installation problems
- Browser cache issues
- Incorrect YAML examples
- Feature requests

Please report those as normal GitHub Issues.

---

## Frontend-only scope

Split-Flap Card is intended to be a frontend Lovelace card.

It should not:

- Store credentials
- Fetch external APIs directly
- Require API keys
- Create Home Assistant entities
- Modify Home Assistant configuration
- Send data to third-party services
- Execute user-provided scripts

The card displays data already available in Home Assistant.

---

## User responsibility

Users are responsible for protecting their own Home Assistant secrets.

Never publish:

```yaml
api_key: YOUR_REAL_API_KEY
token: YOUR_REAL_TOKEN
url: https://private.example.local
```

Use placeholders instead:

```yaml
api_key: YOUR_API_KEY
token: YOUR_TOKEN
url: https://example.local
```

---

## Public examples

Public examples should use generic placeholder data.

Recommended:

```text
CENTRAL STATION
EXAMPLE CITY
EXEMPELSTAD
STATION A
PLATFORM 5
TRAIN TO CENTRAL STATION
LINE 12 TO STATION A
:sunny: SUNNY 3 °C
```

Avoid:

- Real home addresses
- Personal names
- Private locations
- Private dashboard names
- Real private entity names
- Screenshots showing homes or reflections
- Calendar entries containing personal data
- API keys, tokens, or secrets

---

## Screenshots

Before posting screenshots publicly, verify that they do not contain:

- Personal names
- Addresses
- Private URLs
- API keys
- Tokens
- Home interiors
- Reflections of people or rooms
- Private calendar events
- Private entity names
- Private dashboard names

When possible, crop screenshots to show only the card.

---

## Dependencies

Split-Flap Card should avoid unnecessary external dependencies.

MDI icons are rendered through Home Assistant’s frontend using:

```text
ha-icon
```

Google Fonts may be used if configured by the user, but local fonts are recommended for fully offline or kiosk-style dashboards.

---

## Disclosure expectations

Please allow reasonable time for a security issue to be reviewed before public disclosure.

Maintainers may request:

- A minimal reproduction
- Home Assistant version
- Browser/device information
- Sanitized YAML configuration
- Browser console errors

Do not share private credentials or secrets as part of a reproduction.

---

## Accidental secret exposure

If you accidentally publish a secret in an issue, pull request, screenshot, or documentation example:

1. Remove the secret immediately.
2. Rotate or revoke the exposed secret.
3. Check where the secret may have been copied or cached.
4. Avoid reusing the same secret.

Deleting a public GitHub comment may not be enough if the secret has already been indexed, cloned, or cached.

---

## Related documentation

- [Support](SUPPORT.md)
- [Privacy and Public Examples](docs/privacy-and-public-examples.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Development](docs/development.md)
