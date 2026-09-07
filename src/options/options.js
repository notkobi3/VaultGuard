import { PROTECTED_BRANDS } from "../utils/domainAnalyzer.js";

const STORAGE_KEY = "vaultguardProtectedBrands";
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

let brands = [];

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
  return value
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

async function saveBrands(message = "Protected brand list saved locally.") {
  await chrome.storage.local.set({ [STORAGE_KEY]: brands });
  setStatus(message);
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

async function loadBrands() {
  const saved = await chrome.storage.local.get(STORAGE_KEY);
  brands = validateBrands(saved[STORAGE_KEY] || PROTECTED_BRANDS);
  renderBrands();
}

function downloadBrands() {
  const blob = new Blob([JSON.stringify(brands, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "vaultguard-protected-brands.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importBrandFile(file) {
  const reader = new FileReader();

  reader.addEventListener("load", async () => {
    try {
      brands = validateBrands(JSON.parse(String(reader.result || "[]")));
      renderBrands();
      await saveBrands("Protected brand list imported locally.");
    } catch (error) {
      setStatus(`Could not import: ${error.message}`);
    } finally {
      importFile.value = "";
    }
  });

  reader.readAsText(file);
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

exportBrands.addEventListener("click", downloadBrands);
importBrands.addEventListener("click", () => {
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

loadBrands();
