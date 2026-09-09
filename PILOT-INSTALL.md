# VaultGuard Private Pilot Install Guide

VaultGuard is a private pilot Chrome extension that helps employees review website hostnames for phishing-style look-alike risk before trusting login, banking, payroll, cloud, vendor, or client-portal pages.

VaultGuard runs locally in Chrome. It does not ask for passwords, seed phrases, private keys, recovery codes, bank details, API keys, payment card numbers, or page contents.

## Before You Start

Use Google Chrome on a desktop or laptop.

The pilot ZIP should be named something like:

```text
vaultguard-pilot-1.4.1.zip
```

## Install VaultGuard

1. Download the VaultGuard pilot ZIP.
2. Right-click the ZIP and choose `Extract All`.
3. Open Chrome.
4. Go to `chrome://extensions`.
5. Turn on `Developer mode` in the top-right corner.
6. Click `Load unpacked`.
7. Select the extracted VaultGuard folder that contains `manifest.json`.
8. Pin VaultGuard to the Chrome toolbar.

If VaultGuard was already installed, click `Reload` on the VaultGuard card in `chrome://extensions` after replacing the files.

## Uninstall VaultGuard

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Find `VaultGuard`.
4. Click `Remove`.
5. Confirm removal when Chrome asks.

If your team extracted the pilot ZIP to a folder on the computer, you can also delete that extracted folder after removing the extension from Chrome.

## First Setup

1. Click the VaultGuard icon.
2. Click `Settings`.
3. Choose a company preset if it fits your team:
   - `Finance Team`
   - `Crypto Team`
   - `Cloud Dev Team`
4. Add important protected brands and domains your team uses.
5. Add trusted domains only when your team has verified that the domain is legitimate.
6. Add the pilot Google Form link in `Feedback form URL` if your pilot contact gave you one.
7. Keep auto-scan off at first if you want to test manually.
8. Turn on auto-scan when you want VaultGuard to update the toolbar badge automatically as pages load.

## Suggested Test Sites

Use normal work websites your team already trusts, such as:

- Email login.
- Payroll.
- Accounting or QuickBooks.
- Banking.
- CRM.
- Vendor portals.
- Cloud dashboards.
- Company intranet or client portals.

Then try clearly fake-looking examples by typing the hostname into a new tab:

```text
paypa1.com
coinbase-login-secure.com
paypal.com.example.net
```

Do not enter real credentials on suspicious or unknown websites.

## What To Review

Please check:

- Was the install process easy enough?
- Did the risk score and risk level make sense?
- Did trusted domains work as expected?
- Did normal work websites stay Safe or Trusted?
- Did fake-looking domains become Needs Review or High Risk?
- Was the warning banner clear?
- Was the history page useful?
- Was the Report Feedback button easy to use?
- Did anything feel confusing or too technical?

## Submit Feedback

Click `Report Feedback` in the VaultGuard popup when you are ready to share notes.

If a feedback form URL is configured in Settings, VaultGuard opens that form. If no form link is configured, VaultGuard opens a local email draft instead.

## Pilot Feedback Questions

Send feedback using these questions:

1. What kind of business or team tested VaultGuard?
2. How many people tried it?
3. Was installation easy or confusing?
4. Which features were useful?
5. Which warnings were unclear?
6. Did it flag any legitimate domains incorrectly?
7. Did it miss any domain you expected it to flag?
8. Would this be useful if it had company-wide setup and support?
9. What would make it worth paying for?

## Important Limitations

VaultGuard helps identify suspicious domain patterns, but it cannot guarantee that a website is safe.

VaultGuard should be used with:

- A password manager.
- Strong, unique passwords.
- Passkeys or multi-factor authentication.
- Security training.
- Bank, payroll, cloud, and vendor account alerts.

## Support

Pilot contact: Kobi / Layer Zero Security

Feedback email: layerzerosecurity@gmail.com
