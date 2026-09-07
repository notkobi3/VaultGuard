import { analyzeDomain } from "../utils/domainAnalyzer.js";

const BRAND_STORAGE_KEY = "vaultguardProtectedBrands";
const SETTINGS_STORAGE_KEY = "vaultguardSettings";
const DEFAULT_SETTINGS = {
  autoScanEnabled: false,
  warningBannerEnabled: true
};

function getBadgeForLevel(level) {
  if (level === "High Risk") {
    return { text: "!!", color: "#dc3545" };
  }

  if (level === "Suspicious") {
    return { text: "!", color: "#ffc107" };
  }

  return { text: "OK", color: "#198754" };
}

function canAnalyzeUrl(url) {
  return /^https?:\/\//.test(String(url || ""));
}

async function getSettings() {
  const saved = await chrome.storage.local.get([BRAND_STORAGE_KEY, SETTINGS_STORAGE_KEY]);

  return {
    protectedBrands: saved[BRAND_STORAGE_KEY],
    settings: {
      ...DEFAULT_SETTINGS,
      ...(saved[SETTINGS_STORAGE_KEY] || {})
    }
  };
}

async function clearTabBadge(tabId) {
  await chrome.action.setBadgeText({ tabId, text: "" });
}

async function updateTabBadge(tabId, analysis) {
  const badge = getBadgeForLevel(analysis.level);

  await chrome.action.setBadgeText({ tabId, text: badge.text });
  await chrome.action.setBadgeBackgroundColor({ tabId, color: badge.color });
}

async function showWarningBanner(tabId, analysis) {
  await chrome.scripting.insertCSS({
    target: { tabId },
    css: `
      #vaultguard-warning-banner {
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 2147483647;
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #8f281f;
        color: #fff7ed;
        background: #9f2d22;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.3);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.35;
      }

      #vaultguard-warning-banner strong {
        display: block;
        margin-bottom: 2px;
        font-size: 15px;
      }

      #vaultguard-warning-banner button {
        border: 1px solid rgba(255, 247, 237, 0.55);
        border-radius: 6px;
        padding: 8px 10px;
        color: #fff7ed;
        background: rgba(255, 255, 255, 0.12);
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      #vaultguard-warning-banner button:hover {
        background: rgba(255, 255, 255, 0.22);
      }

      @media (max-width: 720px) {
        #vaultguard-warning-banner {
          grid-template-columns: 1fr;
        }
      }
    `
  });

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/content/warning.js"]
  });

  await chrome.tabs.sendMessage(tabId, {
    type: "VAULTGUARD_SHOW_WARNING",
    analysis
  });
}

async function clearWarningBanner(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/content/warning.js"]
  });

  await chrome.tabs.sendMessage(tabId, {
    type: "VAULTGUARD_CLEAR_WARNING"
  });
}

async function scanTab(tabId, url) {
  const { protectedBrands, settings } = await getSettings();

  if (!settings.autoScanEnabled) {
    await clearTabBadge(tabId);
    if (canAnalyzeUrl(url)) {
      await clearWarningBanner(tabId);
    }
    return;
  }

  if (!canAnalyzeUrl(url)) {
    await clearTabBadge(tabId);
    return;
  }

  const hostname = new URL(url).hostname;
  const analysis = analyzeDomain(hostname, { protectedBrands });
  await updateTabBadge(tabId, analysis);

  if (settings.warningBannerEnabled && analysis.level === "High Risk") {
    await showWarningBanner(tabId, analysis);
  } else {
    await clearWarningBanner(tabId);
  }
}

async function scanActiveTab() {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (activeTab?.id) {
    await scanTab(activeTab.id, activeTab.url);
  }
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) {
      return;
    }

    scanTab(tabId, tab.url).catch(() => clearTabBadge(tabId));
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url && changeInfo.status !== "complete") {
    return;
  }

  scanTab(tabId, changeInfo.url || tab.url).catch(() => clearTabBadge(tabId));
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || (!changes[SETTINGS_STORAGE_KEY] && !changes[BRAND_STORAGE_KEY])) {
    return;
  }

  scanActiveTab().catch(() => {});
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "VAULTGUARD_OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
  }
});
