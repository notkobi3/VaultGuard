# VaultGuard

VaultGuard is an educational Chrome extension that helps identify phishing-style domain names for banking, cryptocurrency, wallet, and financial-service websites.

VaultGuard v0.4 analyzes website hostnames locally and explains why a domain looks safe, suspicious, or high risk.

## Educational Prototype Warning

VaultGuard v0.4 is a learning project and should not be treated as a complete financial-security product. It can identify some obvious domain imitation patterns, but it cannot prove that a website is safe.

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
- Duplicate reason handling to avoid repeated identical warnings.
- Extension badge status after popup analysis:
  - `OK`: Safe
  - `!`: Suspicious
  - `!!`: High Risk
- Punycode and internationalized-domain-name warning signals.
- Deceptive protected-domain checks such as `paypal.com.example.net`.
- Explainable risk scoring:
  - 0-20: Safe
  - 21-50: Suspicious
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
```

## Component Flow

```text
User clicks extension icon
        |
        v
Chrome opens src/popup/popup.html
        |
        v
popup.js asks Chrome for active tab URL and local brand settings
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

VaultGuard v0.4 follows a privacy-first design:

- Analysis happens locally in the browser.
- Manual checks read the current tab URL when the user opens the popup.
- Auto-scan is optional and is off by default.
- When auto-scan is enabled, VaultGuard can check hostnames as pages load.
- Custom protected brands are stored with `chrome.storage.local`.
- The extension does not send data to any server.
- The extension does not read passwords, form fields, transactions, private keys, or page account data.
- The warning banner only appears on high-risk hostnames when the setting is enabled.

## What VaultGuard Never Collects

VaultGuard v0.4 does not collect:

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

Security/privacy risk: URLs can reveal browsing context. VaultGuard reduces this risk by using the URL only inside the popup, extracting the hostname, not storing browsing history, and not sending it anywhere.

### `storage`

What it allows: VaultGuard can save extension settings locally in Chrome.

Why VaultGuard needs it: the options page lets the user edit the protected-brand list.

Security/privacy risk: stored settings persist on the device. VaultGuard stores brand names, aliases, and legitimate domains only. Do not enter secrets in the options page.

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

## Install Locally in Chrome Developer Mode

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked`.
5. Select the `vaultguard` folder.
6. Pin VaultGuard to the toolbar if you want quick access.
7. Open a website, then click the VaultGuard icon to analyze the current hostname.
8. Open VaultGuard options and enable auto-scan if you want automatic badge updates.

## Edit Protected Brands

1. Open `chrome://extensions`.
2. Find VaultGuard.
3. Click `Details`.
4. Click `Extension options`.
5. Add, remove, import, export, or restore protected brands.
6. Turn auto-scan and the high-risk banner on or off.

Only store brand names, aliases, and legitimate domains.

## Run Tests

From inside the `vaultguard` folder:

```bash
npm test
```

The tests verify that known legitimate domains have a Safe risk score and phishing-like examples produce suspicious or high-risk scores. They also check custom brands, duplicate reason handling, and internal-result cleanup.

## Manual Test Ideas

- Visit `https://coinbase.com` and confirm it shows Safe.
- Visit `https://paypal.com` and confirm it shows Safe.
- Try a non-existing or test URL like `https://paypa1.com` and confirm it is not Safe.
- Try `https://coinbase-login-secure.com` and confirm the popup explains brand resemblance and suspicious keywords.
- Try `https://paypal.com.example.net` and confirm deceptive protected-domain detection appears.
- Try an IDN/punycode hostname and confirm the popup warns about punycode.
- Open the options page and add a custom protected brand.
- Enable auto-scan, visit a risky test hostname, and confirm the badge updates automatically.
- Enable the warning banner and confirm High Risk hostnames show a top-of-page warning.
- Open `chrome://extensions` and confirm VaultGuard handles Chrome internal pages gracefully.

## Recommended v0.5 Tasks

1. Add better public-suffix handling for domains like `.co.uk`.
2. Add a suspicious-domain history page that stores hostnames only.
3. Add a trusted-domains list for false positives.
4. Add a temporary dismiss list so users can hide warnings for a single hostname.
5. Add screenshots and a Chrome Web Store readiness checklist.
