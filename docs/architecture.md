# VaultGuard v0.3 Architecture

```text
manifest.json
  |
  | declares popup, options page, icons, activeTab, and storage
  v
src/popup/popup.html
  |
  | loads popup CSS and JavaScript
  v
src/popup/popup.js
  |
  | uses chrome.tabs.query after the user opens the popup
  | uses chrome.storage.local to read protected-brand settings
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

## Options Page

```text
src/options/options.html
  |
  | lets the user edit protected brand JSON
  v
chrome.storage.local
  |
  | stores brand names, aliases, and legitimate domains
  v
popup.js
```

The options page stores detection settings only. It supports adding, removing, importing, exporting, and restoring protected brands. It should never contain passwords, banking details, recovery codes, API keys, seed phrases, or private keys.

## Why There Is No Content Script Yet

A content script runs inside matching web pages and can inspect or change page content. VaultGuard v0.3 does not need that power because it only analyzes the active tab hostname when the popup opens.

Skipping a content script keeps the extension simpler and more private.

## Why There Is No Background Service Worker Yet

A Manifest V3 service worker runs in the background for extension events. VaultGuard v0.3 updates the badge when the popup runs, so it does not need continuous background work.

If VaultGuard later adds automatic navigation warnings or badge checks before the popup opens, a service worker may become useful. That would require a fresh permission review.

## Permission Choices

VaultGuard v0.3 uses `activeTab` so the popup can read the current tab URL after a user action.

VaultGuard v0.3 uses `storage` so the options page can save the protected-brand list locally.

It does not request broad host permissions like `<all_urls>`, because v0.3 does not need ongoing access to every website the user visits.
