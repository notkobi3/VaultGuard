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
testRiskyDomain("paypal.com.example.net", 45, "Places approved domain \"paypal.com\" inside a different hostname");
testRiskyDomain("xn--coinbase-9ib.com", 40, "Contains punycode label");

const customBrandResult = analyzeDomain("mybroker-login.com", {
  protectedBrands: [
    {
      name: "MyBroker",
      aliases: ["mybroker"],
      domains: ["mybroker.com"]
    }
  ]
});

assert.equal(customBrandResult.level, "High Risk", "custom protected brands should be analyzed");
assert.ok(
  customBrandResult.reasons.some((reason) => reason.includes("Domain resembles MyBroker")),
  "custom protected brand result should explain the resemblance"
);
assert.equal(
  Object.hasOwn(customBrandResult, "reasonKeys"),
  false,
  "internal duplicate-reason tracking should not be returned"
);

const duplicateReasonResult = analyzeDomain("paypal.com.example.net");
assert.equal(
  duplicateReasonResult.reasons.filter((reason) => reason.includes("Places approved domain")).length,
  1,
  "duplicate reasons should be collapsed"
);

console.log("All VaultGuard domain analyzer tests passed.");
