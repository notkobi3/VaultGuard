# VaultGuard Chrome Permissions

Last updated: September 7, 2026

This document explains why VaultGuard requests each Chrome permission.

## `activeTab`

Purpose: lets VaultGuard read limited information about the current tab after the user interacts with the extension.

Used for: manual popup checks.

Privacy note: VaultGuard extracts the hostname and analyzes it locally.

## `storage`

Purpose: lets VaultGuard save settings in Chrome local extension storage.

Used for:

- Protected brands.
- Brand aliases.
- Legitimate domains.
- Auto-scan setting.
- Warning-banner setting.

Privacy note: users should not enter secrets into settings.

## `tabs`

Purpose: lets VaultGuard react to tab URL changes.

Used for: optional auto-scan badge updates while browsing.

Privacy note: URLs can reveal browsing context. VaultGuard v0.7 uses the URL to extract the hostname locally and does not transmit it to a server.

## `scripting`

Purpose: lets VaultGuard inject extension code into webpages.

Used for: showing the high-risk warning banner.

Privacy note: VaultGuard uses this permission only to place and remove the warning banner. It does not read page forms, passwords, transactions, or page account data.

## `host_permissions`

Current value:

```json
[
  "http://*/*",
  "https://*/*"
]
```

Purpose: lets VaultGuard display warnings on ordinary websites.

Used for: optional high-risk warning banner injection.

Privacy note: broad host access should be handled carefully. VaultGuard keeps auto-scan off by default, performs local-only hostname checks, and does not transmit browsing data.

## Update Requirement

Update this document any time `manifest.json` changes permissions, host permissions, background behavior, content scripts, or data handling.
