const HISTORY_KEY = "vaultguardHistory";
const levelFilter = document.querySelector("#levelFilter");
const historyRows = document.querySelector("#historyRows");
const historyTemplate = document.querySelector("#historyTemplate");
const exportJson = document.querySelector("#exportJson");
const exportCsv = document.querySelector("#exportCsv");
const clearHistory = document.querySelector("#clearHistory");

let history = [];

function downloadFile(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function getFilteredHistory() {
  const filter = levelFilter.value;

  if (filter === "all") {
    return history;
  }

  if (filter === "trusted") {
    return history.filter((entry) => entry.trusted);
  }

  return history.filter((entry) => entry.level === filter);
}

function renderHistory() {
  const filteredHistory = getFilteredHistory();
  historyRows.textContent = "";

  if (filteredHistory.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No matching hostname checks yet.";
    historyRows.append(empty);
    return;
  }

  filteredHistory.forEach((entry) => {
    const row = historyTemplate.content.firstElementChild.cloneNode(true);
    const title = row.querySelector("h2");
    const meta = row.querySelector("p");
    const score = row.querySelector("strong");

    title.textContent = entry.hostname;
    meta.textContent = `${entry.level}${entry.trusted ? " / Trusted" : ""} - ${new Date(entry.checkedAt).toLocaleString()}`;
    score.textContent = `${entry.score}/100`;
    historyRows.append(row);
  });
}

async function loadHistory() {
  const saved = await chrome.storage.local.get(HISTORY_KEY);
  history = saved[HISTORY_KEY] || [];
  renderHistory();
}

levelFilter.addEventListener("change", renderHistory);
exportJson.addEventListener("click", () => {
  downloadFile("vaultguard-history.json", "application/json", JSON.stringify(getFilteredHistory(), null, 2));
});
exportCsv.addEventListener("click", () => {
  const rows = [
    ["hostname", "level", "score", "trusted", "checkedAt"].map(escapeCsv).join(","),
    ...getFilteredHistory().map((entry) => [
      entry.hostname,
      entry.level,
      entry.score,
      Boolean(entry.trusted),
      entry.checkedAt
    ].map(escapeCsv).join(","))
  ];

  downloadFile("vaultguard-history.csv", "text/csv", rows.join("\n"));
});
clearHistory.addEventListener("click", async () => {
  history = [];
  await chrome.storage.local.set({ [HISTORY_KEY]: [] });
  renderHistory();
});

loadHistory();
