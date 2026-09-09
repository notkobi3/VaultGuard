# VaultGuard v1.4 Architecture

```text
manifest.json
  |
  | declares popup, options page, background worker, icons, and permissions
  v
src/popup/popup.html
  |
  | loads popup CSS and JavaScript
  v
src/popup/popup.js
  |
  | uses chrome.tabs.query after the user opens the popup
  | uses chrome.storage.local to read protected brands, trusted domains, history, and settings
  v
Current active tab URL
  |
  | extracts hostname only
  v
src/utils/domainAnalyzer.js
  |
  | returns risk score, level, and reasons
  v
Popup UI, extension badge, and local history
```

## Optional Auto-Scan Flow

```text
Chrome tab is activated or updated
  |
  v
src/background/background.js
  |
  | checks whether auto-scan is enabled
  | extracts hostname from http/https URLs
  | reads protected-brand, trusted-domain, history, and banner settings
  v
src/utils/domainAnalyzer.js
  |
  v
Per-tab badge status
  |
  | High Risk plus banner setting enabled
  v
src/content/warning.js
  |
  v
Top-of-page warning banner
```

Auto-scan is off by default. When it is off, the background worker clears per-tab badge text and does not analyze browsing activity.

When history is enabled, only the hostname, risk level, risk score, and timestamp are saved locally. Full URLs and page contents are not stored.

## Options Page

```text
src/options/options.html
  |
  | lets the user edit protected brands, trusted domains, presets, and browsing protection settings
  v
chrome.storage.local
  |
  | stores brand names, aliases, legitimate domains, trusted domains, history setting, auto-scan state, and banner state
  v
popup.js and background.js
```

The options page stores detection settings only. It supports adding, removing, importing, exporting, and restoring protected brands; adding trusted domains; clearing dismissed warnings; and exporting or importing a full policy file. It should never contain passwords, banking details, recovery codes, API keys, seed phrases, or private keys.

## Company Policy Presets

VaultGuard v1.4 includes local presets for crypto, finance, and cloud development teams. A preset replaces the protected-brand list with a starter policy that the project owner can customize before sharing with a customer.

Full policy exports contain:

- Version.
- Export timestamp.
- Browsing protection settings.
- Protected brands.
- Trusted domains.

## Content Script Scope

VaultGuard v1.4 uses a content script only for the high-risk warning banner. The extension does not inspect forms, read page text, collect credentials, or modify transactions.

The warning banner is injected by the background worker after local hostname analysis returns `High Risk` and the user has the warning-banner setting enabled.

## Background Service Worker Scope

The Manifest V3 service worker listens for tab activation, tab updates, and local setting changes.

Its job is deliberately small:

- Check whether auto-scan is enabled.
- Extract hostnames from `http` and `https` tab URLs.
- Run local domain analysis.
- Save hostname-only history when enabled.
- Update the per-tab badge.
- Inject a warning banner only on High Risk hostnames when enabled and not dismissed for that hostname.

## Trusted Domains

Trusted domains are local overrides for known-safe false positives. If a hostname matches a trusted domain or one of its subdomains, VaultGuard returns a Trusted result and marks the analysis as trusted.

Trusted domains should be used carefully and only for domains the user or company actually controls or has independently verified.

## Permission Choices

VaultGuard v1.4 uses `activeTab` so the popup can read the current tab URL after a user action.

VaultGuard v1.4 uses `storage` so the options page can save protected-brand, trusted-domain, history, dismissed-warning, and browsing-protection settings locally.

VaultGuard v1.4 uses `tabs` so optional auto-scan can react to tab URL changes before the popup opens.

VaultGuard v1.4 uses `scripting` and `http/https` host permissions so it can place a warning banner onto high-risk pages.

These permissions are broader than v0.3 because automatic scanning and page warnings require them in Chrome. The privacy boundary remains: analysis is local, secrets are never requested, page contents are not analyzed, and no data is sent to a server.
