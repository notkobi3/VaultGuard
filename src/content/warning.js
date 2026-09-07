(function initializeVaultGuardWarning() {
  if (globalThis.vaultGuardWarningInitialized) {
    return;
  }

  globalThis.vaultGuardWarningInitialized = true;

  const BANNER_ID = "vaultguard-warning-banner";

  function removeExistingBanner() {
    document.querySelector(`#${BANNER_ID}`)?.remove();
  }

  function renderWarning(analysis) {
    removeExistingBanner();

    const banner = document.createElement("div");
    const message = document.createElement("div");
    const title = document.createElement("strong");
    const details = document.createElement("span");
    const optionsButton = document.createElement("button");
    const dismissButton = document.createElement("button");

    banner.id = BANNER_ID;
    title.textContent = "VaultGuard warning: high-risk domain";
    details.textContent = `${analysis.hostname} has a risk score of ${analysis.score}/100. ${analysis.reasons.join(" ")}`;
    optionsButton.type = "button";
    optionsButton.textContent = "Options";
    dismissButton.type = "button";
    dismissButton.textContent = "Dismiss";

    optionsButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "VAULTGUARD_OPEN_OPTIONS" });
    });

    dismissButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        type: "VAULTGUARD_DISMISS_HOSTNAME",
        hostname: analysis.hostname
      });
      removeExistingBanner();
    });

    message.append(title, details);
    banner.append(message, optionsButton, dismissButton);
    document.documentElement.append(banner);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "VAULTGUARD_SHOW_WARNING") {
      renderWarning(message.analysis);
    }

    if (message?.type === "VAULTGUARD_CLEAR_WARNING") {
      removeExistingBanner();
    }
  });
})();
