# Changelog

## 1.3.0 - Trusted Domain and Scoring Refinement

- Added `Trusted` as a distinct risk level for user-approved domains.
- Renamed the middle risk level from `Suspicious` to `Needs Review`.
- Adjusted keyword scoring so secure/login/account words alone do not raise risk for normal university or verified business domains.
- Kept keyword risk increases when another phishing signal is already present.
- Added tests for normal university and business domains.

## 1.2.0 - UI Clarity Pass

- Made `Export Policy` and `Import Policy` visually distinct from company preset buttons.
- Changed the popup `Options` button to `Settings`.
- Refreshed extension page backgrounds with a softer high-contrast color treatment.
- Added dark-mode color support for Chrome users using dark appearance settings.
- Added `docs/timeline.md` to track the v1.1-v1.2 UI improvement window.

## 1.0.0 - Release Candidate

- Added first-run onboarding page.
- Added dedicated hostname history page with filters.
- Added JSON and CSV history export.
- Added configurable history retention for 25, 100, or 500 checks.
- Added Chrome Web Store readiness documentation.
- Added enterprise install notes for managed Chrome environments.
- Updated legal and trust documents for local history, trusted domains, and v1.0 positioning.
- Kept VaultGuard local-first with no server-side browsing data collection.

## 0.7.0

- Added trusted domains for known-safe false positives.
- Added hostname-only recent check history.
- Added company presets for crypto, finance, and cloud development teams.
- Added full policy export and import.
- Added smarter detection for more keywords, lookalike substitutions, repeated hyphens, and common multi-part suffixes.

## 0.4.0

- Added optional auto-scan setting.
- Added high-risk warning banner.
- Added Manifest V3 background scanner.
- Added warning banner content script.
- Added legal and trust document drafts.

## 0.3.0

- Added options page for protected-brand management.
- Added custom protected-brand import and export.
- Added toolbar badge status.
- Added punycode and deceptive protected-domain checks.

## 0.1.0

- Created the initial VaultGuard Chrome extension prototype.
- Added local domain analysis.
- Added popup risk score, risk level, and explanations.
