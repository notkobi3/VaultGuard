# VaultGuard Timeline

## v1.4.1 - Google Form Feedback Setup

Focus: make private pilot feedback easier to collect from businesses.

- Add a configurable feedback form URL in settings.
- Send the popup `Report Feedback` action to the saved Google Form when configured.
- Keep the local email feedback page as a fallback.
- Add Google Form setup documentation for pilot testers.

## v1.4.0 - Pilot Readiness

Focus: make VaultGuard easier and safer to hand to real businesses for private pilot feedback.

- Add domain feedback/reporting entry points.
- Add clear product limitations inside the popup.
- Add pilot email templates.
- Add known limitations documentation for testers and business conversations.
- Rebuild the private pilot ZIP.

## v1.3.0 - Trusted Domain and Scoring Refinement

Focus: reduce false positives for legitimate organizations while keeping strong warnings for look-alike domains.

- Add `Trusted` as a distinct risk level for manually verified domains.
- Rename the middle risk level from `Suspicious` to `Needs Review`.
- Avoid raising risk for normal university or business domains solely because they use words like `secure`, `login`, `account`, or `billing`.
- Continue applying keyword risk when another phishing signal is already present.

## v1.2.0 - UI Clarity Pass

Focus: make the v1.0 release candidate easier to read, easier to explain, and cleaner for potential customers.

- Distinguish policy import/export actions from company preset buttons.
- Rename the popup `Options` button to `Settings`.
- Refresh page backgrounds with a softer, higher-contrast color treatment.
- Improve text readability across popup, options, onboarding, and history pages.
- Add dark-mode support so Chrome dark appearance settings keep the extension readable.

## v1.1-v1.2 Theme

The v1.1 through v1.2 window is focused on UI improvements:

- Clearer settings language.
- Better visual separation between different action types.
- Stronger readability.
- More polished release-candidate presentation.

## v1.0.0 - Release Candidate

- First-run onboarding.
- Dedicated history page.
- JSON and CSV history export.
- Chrome Web Store readiness documents.
- Enterprise install notes.
- Changelog.

## v0.7.0 - Policy and Detection Upgrades

- Trusted domains.
- Hostname-only history.
- Company presets.
- Policy import/export.
- Smarter local detection.
