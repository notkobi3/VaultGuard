const PROTECTED_BRANDS = [
  {
    name: "Coinbase",
    aliases: ["coinbase"],
    domains: ["coinbase.com"]
  },
  {
    name: "MetaMask",
    aliases: ["metamask"],
    domains: ["metamask.io"]
  },
  {
    name: "Kraken",
    aliases: ["kraken"],
    domains: ["kraken.com"]
  },
  {
    name: "Binance",
    aliases: ["binance"],
    domains: ["binance.com", "binance.us"]
  },
  {
    name: "PayPal",
    aliases: ["paypal"],
    domains: ["paypal.com"]
  },
  {
    name: "Chase",
    aliases: ["chase"],
    domains: ["chase.com"]
  },
  {
    name: "Bank of America",
    aliases: ["bankofamerica", "bofa"],
    domains: ["bankofamerica.com"]
  },
  {
    name: "Wells Fargo",
    aliases: ["wellsfargo"],
    domains: ["wellsfargo.com"]
  }
];

const SUSPICIOUS_KEYWORDS = [
  "secure",
  "login",
  "verify",
  "verification",
  "support",
  "account",
  "wallet"
];

const SUBSTITUTIONS = [
  { character: "0", possibleLetters: ["o"] },
  { character: "1", possibleLetters: ["l", "i"] }
];

function normalizeHostname(hostname) {
  return String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
}

function stripCommonPrefix(hostname) {
  return hostname.replace(/^www\./, "");
}

function getRegistrableDomain(hostname) {
  const cleanHostname = stripCommonPrefix(normalizeHostname(hostname));
  const parts = cleanHostname.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return cleanHostname;
  }

  return parts.slice(-2).join(".");
}

function getDomainLabel(hostname) {
  const registrableDomain = getRegistrableDomain(hostname);
  return registrableDomain.split(".")[0] || "";
}

function compactDomainText(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function normalizeProtectedBrands(protectedBrands = PROTECTED_BRANDS) {
  return protectedBrands.map((brand) => ({
    name: brand.name,
    aliases: Array.isArray(brand.aliases) && brand.aliases.length > 0
      ? brand.aliases.map(compactDomainText)
      : [compactDomainText(brand.name)],
    domains: Array.isArray(brand.domains)
      ? brand.domains.map(normalizeHostname).filter(Boolean)
      : []
  }));
}

function hasAllowedDomain(hostname, allowedDomain) {
  return hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`);
}

function hasSuspiciousSubdomain(hostname, protectedBrand) {
  return protectedBrand.domains.some((allowedDomain) => {
    if (!hostname.endsWith(`.${allowedDomain}`)) {
      return false;
    }

    const subdomain = hostname.slice(0, -allowedDomain.length - 1);
    return SUSPICIOUS_KEYWORDS.some((keyword) => subdomain.split(".").includes(keyword));
  });
}

function createSubstitutionVariants(value) {
  let variants = [value];

  SUBSTITUTIONS.forEach(({ character, possibleLetters }) => {
    const nextVariants = [...variants];

    variants.forEach((variant) => {
      if (!variant.includes(character)) {
        return;
      }

      possibleLetters.forEach((letter) => {
        nextVariants.push(variant.replaceAll(character, letter));
      });
    });

    variants = [...new Set(nextVariants)];
  });

  return variants;
}

function containsSubstitution(value) {
  return SUBSTITUTIONS.some(({ character }) => value.includes(character));
}

function containsPunycodeLabel(hostname) {
  return hostname.split(".").some((part) => part.startsWith("xn--"));
}

function containsNonAscii(value) {
  return /[^\x00-\x7F]/.test(value);
}

function containsDeceptiveProtectedDomain(hostname, allowedDomain) {
  return hostname.includes(`${allowedDomain}.`) && !hasAllowedDomain(hostname, allowedDomain);
}

function hasOneEditDistance(value, target) {
  if (Math.abs(value.length - target.length) > 1) {
    return false;
  }

  let edits = 0;
  let valueIndex = 0;
  let targetIndex = 0;

  while (valueIndex < value.length && targetIndex < target.length) {
    if (value[valueIndex] === target[targetIndex]) {
      valueIndex += 1;
      targetIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) {
      return false;
    }

    if (value.length > target.length) {
      valueIndex += 1;
    } else if (value.length < target.length) {
      targetIndex += 1;
    } else {
      valueIndex += 1;
      targetIndex += 1;
    }
  }

  return true;
}

function getRiskLevel(score) {
  if (score >= 51) {
    return "High Risk";
  }

  if (score >= 21) {
    return "Suspicious";
  }

  return "Safe";
}

function addReason(result, points, reason) {
  if (result.reasonKeys.has(reason)) {
    return;
  }

  result.reasonKeys.add(reason);
  result.score += points;
  result.reasons.push(`+${points}: ${reason}`);
}

function finalizeResult(result) {
  result.score = Math.min(result.score, 100);
  result.level = getRiskLevel(result.score);

  if (result.reasons.length === 0) {
    result.reasons.push("No protected-brand imitation signals were found");
  }

  delete result.reasonKeys;
  return result;
}

export function analyzeDomain(hostname, options = {}) {
  const protectedBrands = normalizeProtectedBrands(options.protectedBrands);
  const normalizedHostname = normalizeHostname(hostname);
  const registrableDomain = getRegistrableDomain(normalizedHostname);
  const domainLabel = getDomainLabel(normalizedHostname);
  const compactLabel = compactDomainText(domainLabel);
  const compactHostname = compactDomainText(normalizedHostname);
  const result = {
    hostname: normalizedHostname,
    score: 0,
    level: "Safe",
    reasons: [],
    reasonKeys: new Set()
  };

  if (!normalizedHostname) {
    addReason(result, 20, "No hostname was available to analyze");
    return finalizeResult(result);
  }

  if (containsPunycodeLabel(normalizedHostname)) {
    addReason(result, 40, "Contains punycode label, which can hide look-alike international characters");
  }

  if (containsNonAscii(normalizedHostname)) {
    addReason(result, 30, "Contains non-ASCII characters that may be visually deceptive");
  }

  const matchedLegitimateBrand = protectedBrands.find((brand) =>
    brand.domains.some((domain) => hasAllowedDomain(normalizedHostname, domain))
  );

  if (matchedLegitimateBrand) {
    if (hasSuspiciousSubdomain(normalizedHostname, matchedLegitimateBrand)) {
      addReason(
        result,
        20,
        `Uses a sensitive word in a subdomain of legitimate ${matchedLegitimateBrand.name} domain`
      );
    } else {
      result.reasons.push(`Recognized legitimate ${matchedLegitimateBrand.name} domain`);
    }

    return finalizeResult(result);
  }

  protectedBrands.forEach((brand) => {
    brand.domains.forEach((domain) => {
      if (containsDeceptiveProtectedDomain(normalizedHostname, domain)) {
        addReason(result, 45, `Places approved domain "${domain}" inside a different hostname`);
      }
    });

    brand.aliases.forEach((alias) => {
      if (compactLabel === alias || compactHostname.includes(alias)) {
        addReason(result, 40, `Domain resembles ${brand.name} but is not an approved domain`);
        return;
      }

      const substitutedLabels = createSubstitutionVariants(compactLabel);
      if (substitutedLabels.includes(alias)) {
        addReason(result, 35, `Character substitution may be imitating ${brand.name}`);
        return;
      }

      if (hasOneEditDistance(compactLabel, alias)) {
        addReason(result, 35, `Domain is one character away from ${brand.name}`);
      }
    });
  });

  SUSPICIOUS_KEYWORDS.forEach((keyword) => {
    const keywordPattern = new RegExp(`(^|[-.])${keyword}($|[-.])`);
    if (keywordPattern.test(normalizedHostname)) {
      addReason(result, 15, `Contains suspicious keyword "${keyword}"`);
    }
  });

  if (domainLabel.includes("-")) {
    addReason(result, 10, "Uses hyphens in the main domain name");
  }

  if (containsSubstitution(domainLabel)) {
    addReason(result, 20, "Contains character substitution such as 0 for o or 1 for l/i");
  }

  if (normalizedHostname.split(".").length > 3) {
    addReason(result, 10, "Uses multiple subdomain levels, which can hide the real domain");
  }

  return finalizeResult(result);
}

export { PROTECTED_BRANDS, SUSPICIOUS_KEYWORDS };
