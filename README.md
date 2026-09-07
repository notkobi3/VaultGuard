# VaultGuard

VaultGuard is an educational Chrome extension that helps identify phishing-style domain names for banking, cryptocurrency, wallet, and financial-service websites.

VaultGuard v0.3 analyzes the current tab hostname locally and explains why a domain looks safe, suspicious, or high risk.

## Educational Prototype Warning

VaultGuard v0.3 is a learning project and should not be treated as a complete financial-security product. It can identify some obvious domain imitation patterns, but it cannot prove that a website is safe.

## Current Features

- Manifest V3 Chrome extension foundation.
- Popup showing protection status, current hostname, risk level, risk score, and reasons.
- Local domain-analysis engine.
- Protected-brand checks for Coinbase, MetaMask, Kraken, Binance, PayPal, Chase, Bank of America, and Wells Fargo.
- Popup link to the extension options page.
- Form-based protected-brand editor in the options page.
- Protected-brand import and export from the options page.
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

## Security Philosophy

VaultGuard v0.3 follows privacy and least privilege:

- Analysis happens locally in the browser.
- The extension reads the current tab URL only when the user opens the popup.
- The extension uses `activeTab` instead of broad host permissions.
- Custom protected brands are stored with `chrome.storage.local`.
- The extension does not send data to any server.
- The extension does not modify websites or transactions.
- The extension does not automatically block websites yet.

## What VaultGuard Never Collects

VaultGuard v0.3 does not collect:

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

## Install Locally in Chrome Developer Mode

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked`.
5. Select the `vaultguard` folder.
6. Pin VaultGuard to the toolbar if you want quick access.
7. Open a website, then click the VaultGuard icon to analyze the current hostname.

## Edit Protected Brands

1. Open `chrome://extensions`.
2. Find VaultGuard.
3. Click `Details`.
4. Click `Extension options`.
5. Add, remove, import, export, or restore protected brands.

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
- Open `chrome://extensions` and confirm VaultGuard handles Chrome internal pages gracefully.

## Recommended v0.4 Tasks

1. Add better public-suffix handling for domains like `.co.uk`.
2. Add optional automatic tab-update badge checks with carefully explained permissions.
3. Add a suspicious-domain history page that stores hostnames only.
4. Add a trusted-domains list for false positives.
5. Add a carefully scoped content-script warning banner.
