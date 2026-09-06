# VaultGuard

VaultGuard is an educational Chrome extension that helps identify phishing-style domain names for banking, cryptocurrency, wallet, and financial-service websites.

VaultGuard v0.1 analyzes the current tab hostname locally and explains why a domain looks safe, suspicious, or high risk.

## Educational Prototype Warning

VaultGuard v0.1 is a learning project and should not be treated as a complete financial-security product. It can identify some obvious domain imitation patterns, but it cannot prove that a website is safe.

## Current Features

- Manifest V3 Chrome extension foundation.
- Popup showing protection status, current hostname, risk level, risk score, and reasons.
- Local domain-analysis engine.
- Protected-brand checks for Coinbase, MetaMask, Kraken, Binance, PayPal, Chase, Bank of America, and Wells Fargo.
- Explainable risk scoring:
  - 0-20: Safe
  - 21-50: Suspicious
  - 51-100: High Risk
- Node.js tests for legitimate and suspicious domain examples.

## Project Architecture

```text
vaultguard/
  manifest.json
  README.md
  package.json
  .gitignore
  src/
    popup/
      popup.html
      popup.css
      popup.js
    utils/
      domainAnalyzer.js
  tests/
    domainAnalyzer.test.js
  assets/
  docs/
```

### Component Flow

```text
User clicks extension icon
        |
        v
Chrome opens src/popup/popup.html
        |
        v
src/popup/popup.js asks Chrome for the active tab URL
        |
        v
popup.js extracts only the hostname
        |
        v
src/utils/domainAnalyzer.js calculates the hostname risk score locally
        |
        v
Popup displays the risk level and reasons
```

## Security Philosophy

VaultGuard v0.1 follows privacy and least privilege:

- Analysis happens locally in the browser.
- The extension reads the current tab URL only when the user opens the popup.
- The extension uses the `activeTab` permission instead of broad host permissions.
- The extension does not send data to any server.
- The extension does not modify websites or transactions.

## What VaultGuard Never Collects

VaultGuard v0.1 does not collect:

- Passwords
- Banking credentials
- Credit card information
- Crypto private keys
- Seed phrases
- Sensitive form contents
- Banking transaction details
- Cryptocurrency transaction details

## Chrome Permission Used

### `activeTab`

What it allows: after the user interacts with the extension, Chrome lets VaultGuard read limited information about the currently active tab.

Why VaultGuard needs it: the popup needs the current tab URL so it can extract and analyze the hostname.

Security/privacy risk: URLs can reveal browsing context. VaultGuard reduces this risk by using the URL only inside the popup, extracting the hostname, not storing it, and not sending it anywhere.

## Install Locally in Chrome Developer Mode

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on `Developer mode`.
4. Click `Load unpacked`.
5. Select the `vaultguard` folder.
6. Pin VaultGuard to the toolbar if you want quick access.
7. Open a website, then click the VaultGuard icon to analyze the current hostname.

## Run Tests

From inside the `vaultguard` folder:

```bash
npm test
```

The tests verify that known legitimate domains have a Safe risk score and phishing-like examples produce suspicious or high-risk scores.

## Manual Test Ideas

- Visit `https://coinbase.com` and confirm it shows Safe.
- Visit `https://paypal.com` and confirm it shows Safe.
- Try a non-existing or test URL like `https://paypa1.com` and confirm it is not Safe.
- Try `https://coinbase-login-secure.com` and confirm the popup explains brand resemblance and suspicious keywords.
- Open `chrome://extensions` and confirm VaultGuard handles Chrome internal pages gracefully.

## Recommended v0.2 Tasks

1. Add an options page for editing the protected-brand list.
2. Add punycode and internationalized-domain-name detection.
3. Add stricter handling for deceptive subdomains such as `paypal.com.example.net`.
4. Add warning badges on the extension icon.
5. Add more tests for edge cases and false positives.
