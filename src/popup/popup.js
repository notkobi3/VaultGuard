import { analyzeDomain } from "../utils/domainAnalyzer.js";

const hostnameElement = document.querySelector("#hostname");
const riskLevelElement = document.querySelector("#risk-level");
const summaryElement = document.querySelector("#summary");
const reasonsElement = document.querySelector("#reasons");

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
    const analysis = analyzeDomain(hostname);
    renderAnalysis(analysis);
  } catch (error) {
    renderError("VaultGuard could not read this tab URL. Chrome internal pages may not be available to extensions.");
  }
});
