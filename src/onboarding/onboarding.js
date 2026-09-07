document.querySelector("#openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.querySelector("#openHistory").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("src/history/history.html") });
});
