import { PROTECTED_BRANDS } from "../utils/domainAnalyzer.js";

const BRAND_KEY = "vaultguardProtectedBrands";
const SETTINGS_KEY = "vaultguardSettings";
const TRUSTED_KEY = "vaultguardTrustedDomains";
const DISMISSED_KEY = "vaultguardDismissedWarnings";
const DEFAULT_SETTINGS = {
  autoScanEnabled: false,
  warningBannerEnabled: true,
  historyEnabled: true,
  historyLimit: 100,
  feedbackFormUrl: ""
};
const POLICY_PRESETS = {
  crypto: {
    label: "Crypto Team",
    brands: [
      { name: "Coinbase", aliases: ["coinbase"], domains: ["coinbase.com"] },
      { name: "MetaMask", aliases: ["metamask"], domains: ["metamask.io"] },
      { name: "Kraken", aliases: ["kraken"], domains: ["kraken.com"] },
      { name: "Binance", aliases: ["binance"], domains: ["binance.com", "binance.us"] },
      { name: "Uniswap", aliases: ["uniswap"], domains: ["uniswap.org"] },
      { name: "OpenSea", aliases: ["opensea"], domains: ["opensea.io"] }
    ],
    trustedDomains: []
  },
  finance: {
    label: "Finance Team",
    brands: [
      { name: "PayPal", aliases: ["paypal"], domains: ["paypal.com"] },
      { name: "Chase", aliases: ["chase"], domains: ["chase.com"] },
      { name: "Bank of America", aliases: ["bankofamerica", "bofa"], domains: ["bankofamerica.com"] },
      { name: "Wells Fargo", aliases: ["wellsfargo"], domains: ["wellsfargo.com"] },
      { name: "Fidelity", aliases: ["fidelity"], domains: ["fidelity.com"] },
      { name: "Charles Schwab", aliases: ["schwab", "charlesschwab"], domains: ["schwab.com"] }
    ],
    trustedDomains: []
  },
  cloud: {
    label: "Cloud Dev Team",
    brands: [
      { name: "OpenAI", aliases: ["openai", "chatgpt"], domains: ["openai.com", "chatgpt.com"] },
      { name: "Supabase", aliases: ["supabase"], domains: ["supabase.com"] },
      { name: "Vercel", aliases: ["vercel"], domains: ["vercel.com"] },
      { name: "Railway", aliases: ["railway"], domains: ["railway.app", "railway.com"] },
      { name: "GitHub", aliases: ["github"], domains: ["github.com"] },
      { name: "Cloudflare", aliases: ["cloudflare"], domains: ["cloudflare.com"] }
    ],
    trustedDomains: []
  }
};

const brandForm = document.querySelector("#brandForm");
const brandName = document.querySelector("#brandName");
const brandAliases = document.querySelector("#brandAliases");
const brandDomains = document.querySelector("#brandDomains");
const brandCards = document.querySelector("#brandCards");
const brandTemplate = document.querySelector("#brandTemplate");
const exportBrands = document.querySelector("#exportBrands");
const importBrands = document.querySelector("#importBrands");
const importFile = document.querySelector("#importFile");
const resetBrands = document.querySelector("#resetBrands");
const status = document.querySelector("#status");
const autoScanEnabled = document.querySelector("#autoScanEnabled");
const warningBannerEnabled = document.querySelector("#warningBannerEnabled");
const historyEnabled = document.querySelector("#historyEnabled");
const historyLimit = document.querySelector("#historyLimit");
const trustedForm = document.querySelector("#trustedForm");
const trustedDomain = document.querySelector("#trustedDomain");
const trustedCards = document.querySelector("#trustedCards");
const trustedTemplate = document.querySelector("#trustedTemplate");
const exportPolicy = document.querySelector("#exportPolicy");
const importPolicy = document.querySelector("#importPolicy");
const clearDismissed = document.querySelector("#clearDismissed");
const openOnboarding = document.querySelector("#openOnboarding");
const presetButtons = document.querySelectorAll(".preset");
const feedbackFormUrl = document.querySelector("#feedbackFormUrl");
const saveFeedbackFormUrl = document.querySelector("#saveFeedbackFormUrl");

let brands = [];
let trustedDomains = [];
let settings = { ...DEFAULT_SETTINGS };
let importMode = "brands";

function setStatus(message) {
  status.textContent = message;
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDomain(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

function cleanBrand(brand) {
  const name = String(brand.name || "").trim();
  const aliases = Array.isArray(brand.aliases) ? brand.aliases.map(String).map((alias) => alias.trim()).filter(Boolean) : [];
  const domains = Array.isArray(brand.domains) ? brand.domains.map(String).map(normalizeDomain).filter(Boolean) : [];

  if (!name) {
    throw new Error("Each brand needs a name.");
  }

  if (domains.length === 0) {
    throw new Error(`${name} needs at least one legitimate domain.`);
  }

  return {
    name,
    aliases: aliases.length > 0 ? [...new Set(aliases)] : [name.toLowerCase().replace(/[^a-z0-9]/g, "")],
    domains: [...new Set(domains)]
  };
}

function validateBrands(value) {
  if (!Array.isArray(value)) {
    throw new Error("Brand list must be an array.");
  }

  return value.map(cleanBrand);
}

function mergeBrandLists(...brandLists) {
  const mergedBrands = new Map();

  brandLists.flat().forEach((brand) => {
    const cleanedBrand = cleanBrand(brand);
    const key = cleanedBrand.name.toLowerCase();
    const existingBrand = mergedBrands.get(key) || {
      name: cleanedBrand.name,
      aliases: [],
      domains: []
    };

    existingBrand.aliases.push(...cleanedBrand.aliases);
    existingBrand.domains.push(...cleanedBrand.domains);
    existingBrand.aliases = [...new Set(existingBrand.aliases)];
    existingBrand.domains = [...new Set(existingBrand.domains)];
    mergedBrands.set(key, existingBrand);
  });

  return [...mergedBrands.values()];
}

function validateTrustedDomains(value) {
  if (!Array.isArray(value)) {
    throw new Error("Trusted domains must be an array.");
  }

  return [...new Set(value.map(String).map(normalizeDomain).filter(Boolean))];
}

function normalizeFeedbackFormUrl(value) {
  const trimmedValue = String(value || "").trim();

  if (!trimmedValue) {
    return "";
  }

  const parsedUrl = new URL(trimmedValue);

  if (parsedUrl.protocol !== "https:") {
    throw new Error("Use an HTTPS Google Form link.");
  }

  return parsedUrl.href;
}

function renderSettings() {
  autoScanEnabled.checked = Boolean(settings.autoScanEnabled);
  warningBannerEnabled.checked = Boolean(settings.warningBannerEnabled);
  historyEnabled.checked = Boolean(settings.historyEnabled);
  historyLimit.value = String([25, 100, 500].includes(Number(settings.historyLimit)) ? settings.historyLimit : 100);
  feedbackFormUrl.value = settings.feedbackFormUrl || "";
  warningBannerEnabled.disabled = !settings.autoScanEnabled;
  historyLimit.disabled = !settings.historyEnabled;
}

function renderBrands() {
  brandCards.textContent = "";

  brands.forEach((brand, index) => {
    const card = brandTemplate.content.firstElementChild.cloneNode(true);

    card.querySelector("h3").textContent = brand.name;
    card.querySelector(".aliases").textContent = `Aliases: ${brand.aliases.join(", ")}`;
    card.querySelector(".domains").textContent = `Domains: ${brand.domains.join(", ")}`;
    card.querySelector(".remove").addEventListener("click", async () => {
      brands.splice(index, 1);
      renderBrands();
      await saveBrands(`${brand.name} removed from protected brands.`);
    });

    brandCards.append(card);
  });

  if (brands.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No protected brands saved yet.";
    brandCards.append(empty);
  }
}

function renderTrustedDomains() {
  trustedCards.textContent = "";

  trustedDomains.forEach((domain, index) => {
    const card = trustedTemplate.content.firstElementChild.cloneNode(true);

    card.querySelector("h3").textContent = domain;
    card.querySelector(".remove").addEventListener("click", async () => {
      trustedDomains.splice(index, 1);
      renderTrustedDomains();
      await saveTrustedDomains(`${domain} removed from trusted domains.`);
    });

    trustedCards.append(card);
  });

  if (trustedDomains.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No trusted domains saved yet.";
    trustedCards.append(empty);
  }
}

function downloadJson(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveBrands(message = "Protected brand list saved locally.") {
  await chrome.storage.local.set({ [BRAND_KEY]: brands });
  setStatus(message);
}

async function saveTrustedDomains(message = "Trusted domain list saved locally.") {
  await chrome.storage.local.set({ [TRUSTED_KEY]: trustedDomains });
  setStatus(message);
}

async function saveSettings(message = "Browsing protection settings saved locally.") {
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
  setStatus(message);
}

async function savePolicy(message) {
  await chrome.storage.local.set({
    [BRAND_KEY]: brands,
    [TRUSTED_KEY]: trustedDomains,
    [SETTINGS_KEY]: settings
  });
  setStatus(message);
}

async function loadOptions() {
  const saved = await chrome.storage.local.get([BRAND_KEY, SETTINGS_KEY, TRUSTED_KEY]);
  brands = mergeBrandLists(PROTECTED_BRANDS, saved[BRAND_KEY] || []);
  trustedDomains = validateTrustedDomains(saved[TRUSTED_KEY] || []);
  settings = {
    ...DEFAULT_SETTINGS,
    ...(saved[SETTINGS_KEY] || {})
  };
  renderBrands();
  renderTrustedDomains();
  renderSettings();
}

function downloadBrands() {
  downloadJson("vaultguard-protected-brands.json", brands);
}

function downloadPolicy() {
  downloadJson("vaultguard-policy.json", {
    version: "1.4.1",
    exportedAt: new Date().toISOString(),
    settings,
    protectedBrands: brands,
    trustedDomains
  });
}

function importSettings(parsed) {
  settings = {
    ...DEFAULT_SETTINGS,
    ...(parsed.settings || {})
  };
  brands = mergeBrandLists(PROTECTED_BRANDS, parsed.protectedBrands || parsed.brands || []);
  trustedDomains = validateTrustedDomains(parsed.trustedDomains || []);
}

function importBrandFile(file) {
  const reader = new FileReader();

  reader.addEventListener("load", async () => {
    try {
      const parsed = JSON.parse(String(reader.result || "[]"));

      if (importMode === "policy") {
        importSettings(parsed);
        renderBrands();
        renderTrustedDomains();
        renderSettings();
        await savePolicy("VaultGuard policy imported locally with baseline protections included.");
      } else {
        brands = validateBrands(parsed);
        renderBrands();
        await saveBrands("Protected brand list imported locally.");
      }
    } catch (error) {
      setStatus(`Could not import: ${error.message}`);
    } finally {
      importFile.value = "";
      importMode = "brands";
    }
  });

  reader.readAsText(file);
}

async function applyPreset(presetName) {
  const preset = POLICY_PRESETS[presetName];

  if (!preset) {
    return;
  }

  brands = mergeBrandLists(PROTECTED_BRANDS, preset.brands);
  trustedDomains = validateTrustedDomains(preset.trustedDomains);
  renderBrands();
  renderTrustedDomains();
  await savePolicy(`${preset.label} preset loaded with baseline protections included. Review and customize domains before sharing with a customer.`);
}

brandForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const brand = cleanBrand({
      name: brandName.value,
      aliases: splitList(brandAliases.value),
      domains: splitList(brandDomains.value)
    });

    brands.push(brand);
    brands = validateBrands(brands);
    renderBrands();
    await saveBrands(`${brand.name} added to protected brands.`);
    brandForm.reset();
    brandName.focus();
  } catch (error) {
    setStatus(`Could not add brand: ${error.message}`);
  }
});

trustedForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const domain = normalizeDomain(trustedDomain.value);

    if (!domain) {
      throw new Error("Enter a domain to trust.");
    }

    trustedDomains = validateTrustedDomains([...trustedDomains, domain]);
    renderTrustedDomains();
    await saveTrustedDomains(`${domain} added to trusted domains.`);
    trustedForm.reset();
    trustedDomain.focus();
  } catch (error) {
    setStatus(`Could not add trusted domain: ${error.message}`);
  }
});

exportBrands.addEventListener("click", downloadBrands);
exportPolicy.addEventListener("click", downloadPolicy);
importBrands.addEventListener("click", () => {
  importMode = "brands";
  importFile.click();
});
importPolicy.addEventListener("click", () => {
  importMode = "policy";
  importFile.click();
});
importFile.addEventListener("change", () => {
  const file = importFile.files[0];

  if (file) {
    importBrandFile(file);
  }
});
resetBrands.addEventListener("click", async () => {
  brands = validateBrands(PROTECTED_BRANDS);
  renderBrands();
  await saveBrands("Default protected brand list restored.");
});
autoScanEnabled.addEventListener("change", async () => {
  settings.autoScanEnabled = autoScanEnabled.checked;
  renderSettings();
  await saveSettings(settings.autoScanEnabled ? "Auto-scan enabled." : "Auto-scan disabled.");
});
warningBannerEnabled.addEventListener("change", async () => {
  settings.warningBannerEnabled = warningBannerEnabled.checked;
  renderSettings();
  await saveSettings(settings.warningBannerEnabled ? "High-risk warning banner enabled." : "High-risk warning banner disabled.");
});
historyEnabled.addEventListener("change", async () => {
  settings.historyEnabled = historyEnabled.checked;
  renderSettings();
  await saveSettings(settings.historyEnabled ? "Hostname history enabled." : "Hostname history disabled.");
});
historyLimit.addEventListener("change", async () => {
  settings.historyLimit = Number(historyLimit.value);
  renderSettings();
  await saveSettings(`History retention set to the last ${settings.historyLimit} checks.`);
});
saveFeedbackFormUrl.addEventListener("click", async () => {
  try {
    settings.feedbackFormUrl = normalizeFeedbackFormUrl(feedbackFormUrl.value);
    renderSettings();
    await saveSettings(settings.feedbackFormUrl ? "Feedback form link saved." : "Feedback form link cleared. VaultGuard will use the email feedback page.");
  } catch (error) {
    setStatus(`Could not save feedback form: ${error.message}`);
  }
});
clearDismissed.addEventListener("click", async () => {
  await chrome.storage.local.set({ [DISMISSED_KEY]: {} });
  setStatus("Dismissed warning list cleared.");
});
openOnboarding.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("src/onboarding/onboarding.html") });
});
presetButtons.forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

loadOptions();
