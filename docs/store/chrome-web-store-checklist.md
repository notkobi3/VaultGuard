# Chrome Web Store Release Checklist

Use this checklist before submitting VaultGuard to the Chrome Web Store.

## Product Listing

- Extension name: VaultGuard.
- Short description is accurate and avoids guarantee language.
- Long description explains local hostname checks, risk scores, and optional auto-scan.
- Category selected appropriately.
- Support contact added.
- Privacy policy URL added.
- Screenshots added for popup, options, onboarding, history, and warning banner.
- Promotional images prepared if required.

## Permission Review

- `activeTab` explanation added.
- `storage` explanation added.
- `tabs` explanation added.
- `scripting` explanation added.
- `http://*/*` and `https://*/*` host permission explanation added.
- Store privacy disclosure matches `docs/legal/privacy-policy.md`.
- Store listing does not claim VaultGuard guarantees safe browsing or prevents all phishing.

## Functionality Review

- Load unpacked extension in Chrome.
- Open onboarding page.
- Open popup on safe and risky test domains.
- Enable auto-scan and confirm badge updates.
- Confirm High Risk warning banner appears.
- Add and remove protected brands.
- Add and remove trusted domains.
- Export and import policy.
- Open history page.
- Filter history.
- Export history as JSON and CSV.
- Clear history.

## Business Readiness

- Privacy policy reviewed.
- Terms of service reviewed.
- Permissions document reviewed.
- Security overview reviewed.
- Vulnerability disclosure contact added.
- Refund and support terms prepared before charging customers.

## Packaging

- Version in `manifest.json` matches `package.json`.
- `npm test` passes.
- JavaScript syntax checks pass.
- No secrets, test credentials, or private customer data are included.
- Zip package contains the extension files only.
