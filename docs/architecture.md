# VaultGuard v0.1 Architecture

```text
manifest.json
  |
  | declares popup and activeTab permission
  v
src/popup/popup.html
  |
  | loads CSS and JavaScript
  v
src/popup/popup.js
  |
  | uses chrome.tabs.query after the user opens the popup
  v
Current active tab URL
  |
  | extracts hostname only
  v
src/utils/domainAnalyzer.js
  |
  | returns risk score, level, and reasons
  v
Popup UI
```

## Why There Is No Content Script Yet

A content script runs inside matching web pages and can inspect or change page content. VaultGuard v0.1 does not need that power because it only analyzes the active tab hostname when the popup opens.

Skipping a content script keeps the extension simpler and more private.

## Why There Is No Background Service Worker Yet

A Manifest V3 service worker runs in the background for extension events. VaultGuard v0.1 does not need continuous background work because it does not block pages, monitor every navigation, or store state.

If VaultGuard later adds icon badges or automatic warnings, a service worker may become useful.

## Permission Choice

VaultGuard v0.1 uses `activeTab` so the popup can read the currently active tab URL after a user action.

It does not request broad host permissions like `<all_urls>`, because v0.1 does not need ongoing access to every website the user visits.
