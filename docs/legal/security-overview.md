# VaultGuard Security Overview

Last updated: September 7, 2026

This document explains VaultGuard's current security posture for users, reviewers, and potential business customers.

## Current Security Model

VaultGuard v1.4 is a local-first Chrome extension. It analyzes website hostnames in the browser and displays a risk score, risk level, and explanation.

The extension is designed to help users notice suspicious domains before trusting a website.

## What VaultGuard Checks

VaultGuard checks hostnames for signals such as:

- Known protected-brand names on unapproved domains.
- Character substitutions such as `0` for `o` or `1` for `l`.
- Domains that are one character away from protected brands.
- Sensitive words like `login`, `secure`, `verify`, `support`, `account`, and `wallet` when another phishing signal is already present.
- Punycode labels that may hide look-alike international characters.
- Protected domains placed inside unrelated hostnames, such as `paypal.com.example.net`.
- Multiple subdomain levels that can hide the real domain.

## What VaultGuard Does Not Check

VaultGuard v1.4 does not:

- Read passwords.
- Read form fields.
- Inspect banking transactions.
- Inspect cryptocurrency transactions.
- Inspect account balances.
- Scan page text.
- Contact a server for reputation checks.
- Block network traffic.
- Guarantee that a site is safe.

## Auto-Scan

Auto-scan is optional and off by default.

When enabled, VaultGuard listens for tab changes and analyzes `http` and `https` hostnames locally. It updates the toolbar badge with:

- `OK`: Safe
- `!`: Needs Review
- `!!`: High Risk
- `TR`: Trusted

## Warning Banner

The warning banner is optional and enabled only when auto-scan is enabled.

When a hostname is rated High Risk, VaultGuard can inject a top-of-page warning into the site. The banner includes the hostname, risk score, and risk reasons.

## Data Handling

VaultGuard v1.4 stores only local settings in Chrome extension storage:

- Protected brands.
- Brand aliases.
- Legitimate domains.
- Trusted domains.
- Auto-scan setting.
- Warning-banner setting.
- Hostname-only recent check history, if enabled.
- Dismissed warning hostnames.

VaultGuard v1.4 does not transmit data to a VaultGuard server.

## Pilot Feedback

The pilot feedback form creates an email draft. It does not submit feedback automatically.

Users should review the email before sending it and should not include passwords, recovery codes, private keys, seed phrases, API keys, banking details, customer records, or other sensitive information.

## Security Boundaries

VaultGuard is a defense-in-depth tool. It should be used alongside:

- A password manager.
- Unique passwords.
- Hardware security keys or passkeys.
- Multi-factor authentication.
- Account recovery hardening.
- Security alerts from banks, brokers, exchanges, and cloud platforms.

## Future Security Work

Before commercial release, VaultGuard should add:

- Trusted-domain handling for false positives.
- A dedicated suspicious-domain history page with stronger filters and retention controls.
- Better public-suffix handling for domains like `.co.uk`.
- A review of all Chrome Web Store policies.
- A formal vulnerability disclosure process.
- A clear support and incident response contact.
