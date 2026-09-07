# Enterprise Install Notes

These notes are for companies that want to evaluate or deploy VaultGuard in managed Chrome environments.

## Current Deployment Model

VaultGuard 1.0.0 is a Chrome extension release candidate. It can be installed manually in Developer Mode or packaged for Chrome Web Store distribution.

Business deployment should use the Chrome Web Store or managed Chrome policies after the extension is approved.

## Managed Chrome Considerations

Companies may need to review:

- Extension permissions.
- Host permissions.
- Privacy policy.
- Security overview.
- Terms of service.
- Support process.
- Vulnerability disclosure process.
- Whether auto-scan should be enabled by default for employees.
- Whether protected brands should be customized for the company.
- Whether trusted domains should be centrally defined.

## Suggested Company Setup

1. Start with a company preset in VaultGuard options.
2. Add the company's exact login, finance, crypto, cloud, and vendor domains.
3. Add verified internal domains to trusted domains only when necessary.
4. Export the VaultGuard policy file.
5. Test with a small pilot group.
6. Review user feedback and false positives.
7. Prepare support and incident reporting instructions.

## Policy File

VaultGuard can export a local policy JSON file containing:

- Browsing protection settings.
- Protected brands.
- Trusted domains.

This file is useful for repeat customer setup. A future enterprise version could add managed policy support for centralized deployment.

## Important Limitations

VaultGuard 1.0.0 does not provide:

- Centralized admin console.
- Managed Chrome policy ingestion.
- Cloud sync.
- Remote telemetry.
- Endpoint protection.
- Guaranteed phishing prevention.

These should be considered future enterprise features.
