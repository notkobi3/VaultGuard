const SUPPORT_EMAIL = "layerzerosecurity@gmail.com";
const domain = document.querySelector("#domain");
const feedbackType = document.querySelector("#feedbackType");
const expectedResult = document.querySelector("#expectedResult");
const actualResult = document.querySelector("#actualResult");
const company = document.querySelector("#company");
const notes = document.querySelector("#notes");
const feedbackForm = document.querySelector("#feedbackForm");

function getQueryDomain() {
  const params = new URLSearchParams(window.location.search);
  return params.get("domain") || "";
}

function createEmailBody() {
  return [
    "VaultGuard Pilot Feedback",
    "",
    `Feedback type: ${feedbackType.value}`,
    `Domain/hostname: ${domain.value}`,
    `Expected result: ${expectedResult.value}`,
    `Actual result: ${actualResult.value}`,
    `Company/team: ${company.value || "Not provided"}`,
    "",
    "Notes:",
    notes.value || "Not provided",
    "",
    "Please do not include passwords, recovery codes, private keys, seed phrases, API keys, banking details, or customer data."
  ].join("\n");
}

domain.value = getQueryDomain();

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = encodeURIComponent(`VaultGuard pilot feedback: ${feedbackType.value}`);
  const body = encodeURIComponent(createEmailBody());
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
});
