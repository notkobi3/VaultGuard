# Google Form Feedback Setup

Use a Google Form when you want pilot testers to submit feedback without emailing notes manually.

## Recommended Form

Title:

```text
VaultGuard Private Pilot Feedback
```

Description:

```text
Thank you for testing VaultGuard. Please do not include passwords, account numbers, customer data, private keys, recovery codes, API keys, payment details, or any sensitive information. This form is only for feedback about installation, warnings, risk scores, and general usability.
```

## Recommended Questions

1. Business name
   - Short answer
2. Your role
   - Short answer
3. How many people tested VaultGuard?
   - Multiple choice: `1`, `2-5`, `6-10`, `10+`
4. Was VaultGuard easy to install?
   - Multiple choice: `Yes`, `Mostly`, `No`
5. Which sites or workflows did you test it with?
   - Paragraph
6. Did the risk score make sense?
   - Multiple choice: `Yes`, `Mostly`, `No`, `Not sure`
7. Did VaultGuard incorrectly flag any legitimate website?
   - Paragraph
8. Did VaultGuard miss any suspicious website you expected it to catch?
   - Paragraph
9. Was the warning language clear?
   - Multiple choice: `Yes`, `Mostly`, `No`
10. Was the Report Feedback button easy to find?
    - Multiple choice: `Yes`, `No`, `Did not use it`
11. What would make VaultGuard more useful for your business?
    - Paragraph
12. Would you be interested in continuing after the pilot?
    - Multiple choice: `Yes`, `Maybe`, `No`
13. Can I follow up with you about your feedback?
    - Multiple choice: `Yes`, `No`
14. Best follow-up email
    - Short answer

## Connect The Form To VaultGuard

1. Create the Google Form.
2. Click `Send`.
3. Copy the public form link.
4. Open VaultGuard `Settings`.
5. Paste the link into `Feedback form URL`.
6. Click `Save Feedback Form`.
7. Open the VaultGuard popup and click `Report Feedback` to confirm the form opens.

If no feedback form URL is saved, VaultGuard opens its local email feedback page instead.

## Response Tracking

In Google Forms, use the `Responses` tab to review submissions. Link the form to a Google Sheet if you want a spreadsheet of pilot feedback across multiple businesses.
