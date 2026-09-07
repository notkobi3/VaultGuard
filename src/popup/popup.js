import { analyzeDomain } from "../utils/domainAnalyzer.js";

const STORAGE_KEY = "vaultguardProtectedBrands";
const hostnameElement = document.querySelector("#hostname");
const riskLevelElement = document.querySelector("#risk-level");
const summaryElement = document.querySelector("#summary");
const reasonsElement = document.querySelector("#reasons");
const openOptionsButton = document.querySelector("#open-options");

function setRiskClass(level) {
  riskLevelElement.className = "risk";

  if (level === "High Risk") {
    riskLevelElement.classList.add("high-risk");
    return;
  }

  if (level === "Suspicious") {
    riskLevelElement.classList.add("suspicious");
    return;
  }

  riskLevelElement.classList.add("safe");
}

function renderAnalysis(analysis) {
  hostnameElement.textContent = analysis.hostname || "Unavailable";
  riskLevelElement.textContent = analysis.level;
  setRiskClass(analysis.level);

  summaryElement.textContent = `Risk Score: ${analysis.score}/100. ${analysis.level} rating based on local domain checks.`;
  reasonsElement.textContent = "";

  analysis.reasons.forEach((reason) => {
    const item = document.createElement("li");
    item.textContent = reason;
    reasonsElement.append(item);
  });
}

function renderError(message) {
  hostnameElement.textContent = "Unavailable";
  riskLevelElement.textContent = "Suspicious";
  setRiskClass("Suspicious");
  summaryElement.textContent = message;
  reasonsElement.textContent = "";
}

async function getProtectedBrands() {
  const saved = await chrome.storage.local.get(STORAGE_KEY);
  return saved[STORAGE_KEY];
}

async function updateBadge(analysis) {
  const badgeText = analysis.level === "Safe" ? "OK" : analysis.level === "Suspicious" ? "!" : "!!";
  const badgeColor = analysis.level === "Safe" ? "#198754" : analysis.level === "Suspicious" ? "#ffc107" : "#dc3545";

  await chrome.action.setBadgeText({ text: badgeText });
  await chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

async function getActiveTabHostname() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const activeTab = tabs[0];

  if (!activeTab || !activeTab.url) {
    return "";
  }

  const parsedUrl = new URL(activeTab.url);
  return parsedUrl.hostname;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const hostname = await getActiveTabHostname();
    const protectedBrands = await getProtectedBrands();
    const analysis = analyzeDomain(hostname, { protectedBrands });
    renderAnalysis(analysis);
    await updateBadge(analysis);
  } catch (error) {
    renderError("VaultGuard could not read this tab URL. Chrome internal pages may not be available to extensions.");
  }
});

openOptionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
