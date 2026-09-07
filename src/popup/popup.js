import { analyzeDomain } from "../utils/domainAnalyzer.js";

const STORAGE_KEY = "vaultguardProtectedBrands";
const SETTINGS_KEY = "vaultguardSettings";
const TRUSTED_KEY = "vaultguardTrustedDomains";
const HISTORY_KEY = "vaultguardHistory";
const DEFAULT_SETTINGS = {
  autoScanEnabled: false,
  warningBannerEnabled: true,
  historyEnabled: true
};
const hostnameElement = document.querySelector("#hostname");
const riskLevelElement = document.querySelector("#risk-level");
const summaryElement = document.querySelector("#summary");
const reasonsElement = document.querySelector("#reasons");
const openOptionsButton = document.querySelector("#open-options");
const autoScanStatusElement = document.querySelector("#auto-scan-status");
const historyElement = document.querySelector("#history");
const clearHistoryButton = document.querySelector("#clear-history");

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

function renderHistory(history) {
  historyElement.textContent = "";

  if (!history.length) {
    const item = document.createElement("li");
    item.textContent = "No recent hostname checks yet.";
    historyElement.append(item);
    return;
  }

  history.slice(0, 8).forEach((entry) => {
    const item = document.createElement("li");
    const host = document.createElement("span");
    const score = document.createElement("span");

    host.className = "history-host";
    host.textContent = entry.hostname;
    score.className = "history-score";
    score.textContent = `${entry.score}`;
    item.title = `${entry.level} at ${new Date(entry.checkedAt).toLocaleString()}`;
    item.append(host, score);
    historyElement.append(item);
  });
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
  const saved = await chrome.storage.local.get([STORAGE_KEY, SETTINGS_KEY, TRUSTED_KEY, HISTORY_KEY]);

  return {
    protectedBrands: saved[STORAGE_KEY],
    trustedDomains: saved[TRUSTED_KEY] || [],
    history: saved[HISTORY_KEY] || [],
    settings: {
      ...DEFAULT_SETTINGS,
      ...(saved[SETTINGS_KEY] || {})
    }
  };
}

async function updateBadge(analysis) {
  const badgeText = analysis.level === "Safe" ? "OK" : analysis.level === "Suspicious" ? "!" : "!!";
  const badgeColor = analysis.level === "Safe" ? "#198754" : analysis.level === "Suspicious" ? "#ffc107" : "#dc3545";

  await chrome.action.setBadgeText({ text: badgeText });
  await chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

async function saveManualHistory(history, analysis, settings) {
  if (!settings.historyEnabled) {
    return;
  }

  const nextHistory = [
    {
      hostname: analysis.hostname,
      level: analysis.level,
      score: analysis.score,
      checkedAt: new Date().toISOString()
    },
    ...history.filter((item) => item.hostname !== analysis.hostname)
  ].slice(0, 25);

  await chrome.storage.local.set({ [HISTORY_KEY]: nextHistory });
  renderHistory(nextHistory);
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
    const { protectedBrands, trustedDomains, history, settings } = await getProtectedBrands();
    const analysis = analyzeDomain(hostname, { protectedBrands, trustedDomains });
    autoScanStatusElement.textContent = settings.autoScanEnabled
      ? "Auto-scan: On"
      : "Auto-scan: Off";
    renderAnalysis(analysis);
    renderHistory(history);
    await saveManualHistory(history, analysis, settings);
    await updateBadge(analysis);
  } catch (error) {
    renderError("VaultGuard could not read this tab URL. Chrome internal pages may not be available to extensions.");
  }
});

openOptionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
clearHistoryButton.addEventListener("click", async () => {
  await chrome.storage.local.set({ [HISTORY_KEY]: [] });
  renderHistory([]);
});
