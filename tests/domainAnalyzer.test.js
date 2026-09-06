import assert from "node:assert/strict";
import { analyzeDomain } from "../src/utils/domainAnalyzer.js";

function testLegitimateDomain(hostname, brandName) {
  const result = analyzeDomain(hostname);

  assert.equal(result.level, "Safe", `${hostname} should be Safe`);
  assert.equal(result.score, 0, `${hostname} should have a score of 0`);
  assert.ok(
    result.reasons.some((reason) => reason.includes(`legitimate ${brandName}`)),
    `${hostname} should explain that it matched ${brandName}`
  );
}

function testRiskyDomain(hostname, minimumScore, expectedReason) {
  const result = analyzeDomain(hostname);

  assert.ok(
    result.score >= minimumScore,
    `${hostname} should score at least ${minimumScore}, got ${result.score}`
  );
  assert.notEqual(result.level, "Safe", `${hostname} should not be Safe`);
  assert.ok(
    result.reasons.some((reason) => reason.includes(expectedReason)),
    `${hostname} should include reason: ${expectedReason}`
  );
}

testLegitimateDomain("coinbase.com", "Coinbase");
testLegitimateDomain("paypal.com", "PayPal");
testLegitimateDomain("chase.com", "Chase");
testLegitimateDomain("wellsfargo.com", "Wells Fargo");

testRiskyDomain("coinbase-login-secure.com", 50, "Domain resembles Coinbase");
testRiskyDomain("paypa1.com", 35, "Character substitution may be imitating PayPal");
testRiskyDomain("chase-account-verification.com", 50, "Domain resembles Chase");
testRiskyDomain("metamask-wallet-support.net", 50, "Domain resembles MetaMask");

console.log("All VaultGuard domain analyzer tests passed.");
