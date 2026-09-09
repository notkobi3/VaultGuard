# VaultGuard Pilot Limitations

VaultGuard is a local-first phishing-risk helper. It helps users notice suspicious domain patterns, but it cannot prove that a website is safe.

## What VaultGuard Can Detect Well

VaultGuard is strongest at domain-level signals such as:

- Look-alike protected brand domains.
- Character substitutions such as `paypa1.com`.
- Protected domains placed inside unrelated hostnames, such as `paypal.com.example.net`.
- Punycode labels that may hide look-alike characters.
- Sensitive words like `login`, `secure`, `verify`, `support`, or `wallet` when another phishing signal is present.
- Repeated hyphens and unusual domain structure.

## What VaultGuard May Miss

VaultGuard may not detect:

- Brand-new malicious domains with no obvious brand or typo pattern.
- Compromised legitimate websites.
- Fake pages hosted on otherwise legitimate platforms.
- Shortened links before they redirect.
- Malicious page content on a normal-looking domain.
- Email sender spoofing.
- Malware downloads.
- Fraudulent transactions after login.

## What VaultGuard Does Not Do

VaultGuard does not:

- Read passwords.
- Read form fields.
- Inspect page content.
- Inspect banking or crypto transactions.
- Send browsing data to a server.
- Guarantee phishing prevention.
- Replace password managers, passkeys, MFA, endpoint protection, or employee security training.

## Pilot Positioning

Use this language with testers:

> VaultGuard checks domain patterns locally and helps users pause before trusting risky-looking login pages. It is a defense-in-depth tool, not a guarantee that a website is safe.

Avoid this language:

> VaultGuard prevents phishing.

> VaultGuard guarantees safe browsing.

> VaultGuard protects every account automatically.
