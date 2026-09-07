# VaultGuard v0.4 Architecture

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
  | uses chrome.storage.local to read protected-brand and auto-scan settings
  v
Current active tab URL
  |
  | extracts hostname only
  v
src/utils/domainAnalyzer.js
  |
  | returns risk score, level, and reasons
  v
Popup UI and extension badge
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
  | reads protected-brand settings
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

## Options Page

```text
src/options/options.html
  |
  | lets the user edit protected brands and browsing protection settings
  v
chrome.storage.local
  |
  | stores brand names, aliases, legitimate domains, auto-scan state, and banner state
  v
popup.js and background.js
```

The options page stores detection settings only. It supports adding, removing, importing, exporting, and restoring protected brands. It should never contain passwords, banking details, recovery codes, API keys, seed phrases, or private keys.

## Content Script Scope

VaultGuard v0.4 uses a content script only for the high-risk warning banner. The extension does not inspect forms, read page text, collect credentials, or modify transactions.

The warning banner is injected by the background worker after local hostname analysis returns `High Risk` and the user has the warning-banner setting enabled.

## Background Service Worker Scope

The Manifest V3 service worker listens for tab activation, tab updates, and local setting changes.

Its job is deliberately small:

- Check whether auto-scan is enabled.
- Extract hostnames from `http` and `https` tab URLs.
- Run local domain analysis.
- Update the per-tab badge.
- Inject a warning banner only on High Risk hostnames when enabled.

## Permission Choices

VaultGuard v0.4 uses `activeTab` so the popup can read the current tab URL after a user action.

VaultGuard v0.4 uses `storage` so the options page can save protected-brand and browsing-protection settings locally.

VaultGuard v0.4 uses `tabs` so optional auto-scan can react to tab URL changes before the popup opens.

VaultGuard v0.4 uses `scripting` and `http/https` host permissions so it can place a warning banner onto high-risk pages.

These permissions are broader than v0.3 because automatic scanning and page warnings require them in Chrome. The privacy boundary remains: analysis is local, secrets are never requested, page contents are not analyzed, and no data is sent to a server.
