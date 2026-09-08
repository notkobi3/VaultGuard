# VaultGuard

VaultGuard is an educational Chrome extension that helps identify phishing-style domain names for banking, cryptocurrency, wallet, and financial-service websites.

VaultGuard v1.3 analyzes website hostnames locally and explains why a domain looks trusted, safe, needs review, or high risk.

## Educational Prototype Warning

VaultGuard v1.3 is a release-candidate learning project and should not be treated as a complete financial-security product. It can identify many obvious domain imitation patterns, but it cannot prove that a website is safe.

## Current Features

- Manifest V3 Chrome extension foundation.
- Popup showing protection status, current hostname, risk level, risk score, and reasons.
- Local domain-analysis engine.
- Protected-brand checks for Coinbase, MetaMask, Kraken, Binance, PayPal, Chase, Bank of America, and Wells Fargo.
- Popup link to the extension options page.
- Form-based protected-brand editor in the options page.
- Protected-brand import and export from the options page.
- Optional auto-scan setting for automatic badge updates while browsing.
- Optional high-risk warning banner for pages that look like brand-imitation phishing attempts.
- Trusted-domain list for known-safe false positives.
- Hostname-only recent check history with local clear controls.
- Dedicated history page with Trusted, Safe, Needs Review, and High Risk filters.
- JSON and CSV history export.
- Configurable history retention for the last 25, 100, or 500 checks.
- Temporary hostname warning dismissals.
- Company presets for crypto, finance, and cloud development teams.
- Full policy export and import for repeat customer setups.
- First-run onboarding page.
- Chrome Web Store listing draft, release checklist, and enterprise install notes.
- Duplicate reason handling to avoid repeated identical warnings.
- Extension badge status after popup analysis:
  - `TR`: Trusted
  - `OK`: Safe
  - `!`: Needs Review
  - `!!`: High Risk
- Punycode and internationalized-domain-name warning signals.
- Deceptive protected-domain checks such as `paypal.com.example.net`.
- Expanded suspicious keyword and character-substitution detection.
- Contextual keyword scoring so normal secure-login subdomains are not penalized by those words alone.
- Basic multi-part suffix handling for common domains such as `.co.uk`.
- Explainable risk scoring:
  - Trusted: User-approved trusted domain
  - 0-20: Safe
  - 21-50: Needs Review
  - 51-100: High Risk
- Node.js tests for legitimate, suspicious, custom-brand, punycode, and deceptive-subdomain examples.

## Project Architecture

```text
vaultguard/
  manifest.json
  README.md
  package.json
  .gitignore
  src/
    options/
      options.html
      options.css
      options.js
    onboarding/
      onboarding.html
      onboarding.css
      onboarding.js
    history/
      history.html
      history.css
      history.js
    background/
      background.js
    content/
      warning.js
    popup/
      popup.html
      popup.css
      popup.js
    utils/
      domainAnalyzer.js
  tests/
    domainAnalyzer.test.js
  assets/
    icon-16.png
    icon-32.png
    icon-48.png
    icon-128.png
    icon-16.svg
    icon-32.svg
    icon-48.svg
    icon-128.svg
  docs/
    architecture.md
    timeline.md
    legal/
      README.md
      privacy-policy.md
      terms-of-service.md
      security-overview.md
      permissions.md
      vulnerability-disclosure.md
      update-checklist.md
    store/
      chrome-web-store-checklist.md
      listing-copy.md
      enterprise-install.md
  CHANGELOG.md
```

## Component Flow

```text
User clicks extension icon
        |
        v
Chrome opens src/popup/popup.html
        |
        v
popup.js asks Chrome for active tab URL and local settings
        |
        v
popup.js extracts only the hostname
        |
        v
domainAnalyzer.js calculates the hostname risk score locally
        |
        v
Popup displays the risk level and reasons
        |
        v
Chrome toolbar badge updates to OK, !, or !!
        |
        v
Hostname-only history updates locally when enabled
```

When auto-scan is enabled:

```text
User opens or changes tabs
        |
        v
background.js reads the tab URL and local settings
        |
        v
domainAnalyzer.js checks the hostname locally
        |
        v
Chrome toolbar badge updates automatically
        |
        v
High-risk pages can receive an on-page warning banner
```

## Security Philosophy

VaultGuard v1.3 follows a privacy-first design:

- Analysis happens locally in the browser.
- Manual checks read the current tab URL when the user opens the popup.
- Auto-scan is optional and is off by default.
- When auto-scan is enabled, VaultGuard can check hostnames as pages load.
- Custom protected brands, trusted domains, settings, dismissed warnings, and hostname-only history are stored with `chrome.storage.local`.
- The extension does not send data to any server.
- The extension does not read passwords, form fields, transactions, private keys, or page account data.
- The warning banner only appears on high-risk hostnames when the setting is enabled.

## What VaultGuard Never Collects

VaultGuard v1.3 does not collect:

- Passwords
- Banking credentials
- Credit card information
- Crypto private keys
- Seed phrases
- Sensitive form contents
- Banking transaction details
- Cryptocurrency transaction details

## Chrome Permissions Used

### `activeTab`

What it allows: after the user interacts with the extension, Chrome lets VaultGuard read limited information about the currently active tab.

Why VaultGuard needs it: the popup needs the current tab URL so it can extract and analyze the hostname.

Security/privacy risk: URLs can reveal browsing context. VaultGuard reduces this risk by extracting the hostname, storing only hostname-level recent checks when history is enabled, and not sending browsing data anywhere.

### `storage`

What it allows: VaultGuard can save extension settings locally in Chrome.

Why VaultGuard needs it: the options page lets the user edit protected brands, trusted domains, presets, auto-scan, warning banners, and local history settings.

Security/privacy risk: stored settings persist on the device. VaultGuard stores brand names, aliases, legitimate domains, trusted domains, dismissed hostnames, and hostname-only history only. Do not enter secrets in the options page.

### `tabs`

What it allows: VaultGuard can read tab URLs so the optional background scanner can analyze hostnames as pages change.

Why VaultGuard needs it: auto-scan cannot update the toolbar badge before the popup opens without access to tab URL changes.

Security/privacy risk: URLs can reveal browsing context. VaultGuard only extracts the hostname, analyzes it locally, and does not send it anywhere.

### `scripting`

What it allows: VaultGuard can inject its high-risk warning banner into a webpage.

Why VaultGuard needs it: a visible page warning is more useful than a toolbar badge alone when a hostname appears high risk.

Security/privacy risk: page injection is powerful. VaultGuard uses it only for the warning banner and only after local hostname analysis marks a page High Risk.

### `host_permissions`

What it allows: VaultGuard can run its optional banner on ordinary `http` and `https` sites.

Why VaultGuard needs it: Chrome requires site access before an extension can inject a warning into pages.

Security/privacy risk: broad site access should be treated carefully. VaultGuard keeps auto-scan optional, avoids page-content inspection, and does not transmit browsing data.

## Legal and Trust Documents

Draft legal and trust documents live in `docs/legal/`:

- `privacy-policy.md`
- `terms-of-service.md`
- `security-overview.md`
- `permissions.md`
- `vulnerability-disclosure.md`
- `update-checklist.md`

These are working drafts, not legal advice. Review them with a qualified attorney before selling VaultGuard, publishing it broadly, or offering it to companies.

Update the legal and trust documents whenever VaultGuard changes permissions, stores new data, adds accounts, adds a backend, adds analytics, adds payments, or makes stronger security claims.

## Store and Release Documents

Chrome Web Store and company-readiness drafts live in `docs/store/`:

- `chrome-web-store-checklist.md`
- `listing-copy.md`
- `enterprise-install.md`

Release history is tracked in `CHANGELOG.md`.

## Install Locally in Chrome Developer Mode

For non-technical private pilot testers, use `PILOT-INSTALL.md`.

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked`.
5. Select the `vaultguard` folder.
6. Pin VaultGuard to the toolbar if you want quick access.
7. Open a website, then click the VaultGuard icon to analyze the current hostname.
8. Open VaultGuard options and enable auto-scan if you want automatic badge updates.
9. Use the onboarding page for a guided first setup.

## Edit Protected Brands

1. Open `chrome://extensions`.
2. Find VaultGuard.
3. Click `Details`.
4. Click `Extension options`.
5. Add, remove, import, export, or restore protected brands.
6. Add trusted domains for known-safe false positives.
7. Load a company preset or export a full policy file for another setup.
8. Turn auto-scan, history, history retention, and the high-risk banner on or off.

Only store brand names, aliases, and legitimate domains.

## Run Tests

From inside the `vaultguard` folder:

```bash
npm test
```

The tests verify that known legitimate domains have a Safe risk score, trusted domains show as Trusted, and phishing-like examples produce Needs Review or High Risk scores. They also check custom brands, normal university/business domains, multi-part suffix handling, duplicate reason handling, and internal-result cleanup.

## Manual Test Ideas

- Visit `https://coinbase.com` and confirm it shows Safe.
- Visit `https://paypal.com` and confirm it shows Safe.
- Try a non-existing or test URL like `https://paypa1.com` and confirm it is not Safe.
- Try `https://coinbase-login-secure.com` and confirm the popup explains brand resemblance and suspicious keywords.
- Try `https://paypal.com.example.net` and confirm deceptive protected-domain detection appears.
- Try an IDN/punycode hostname and confirm the popup warns about punycode.
- Open the options page and add a custom protected brand.
- Add a trusted domain and confirm it bypasses warnings for that hostname.
- Load each company preset and export a policy file.
- Open the popup and confirm recent hostname checks appear.
- Open the full history page, filter results, and export JSON and CSV files.
- Enable auto-scan, visit a risky test hostname, and confirm the badge updates automatically.
- Enable the warning banner and confirm High Risk hostnames show a top-of-page warning.
- Open `chrome://extensions` and confirm VaultGuard handles Chrome internal pages gracefully.

## Recommended v1.3 Tasks

1. Add real Chrome Web Store screenshots after loading the extension in Chrome.
2. Add managed-policy support for company-wide protected brands and trusted domains.
3. Add optional remote reputation checks only after a privacy and legal review.
4. Add content-script visual QA for the warning banner across common websites.
5. Add a customer-facing website and payment flow after legal review.
