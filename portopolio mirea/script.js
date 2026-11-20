const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");

const updateHeaderShadow = () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderShadow();
window.addEventListener("scroll", updateHeaderShadow, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu");
    navLinks.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const writingPublicDialog = document.querySelector("#writing-public-dialog");
const writingPublicOpen = document.querySelector(".karya-tulis-open");

function loadPublishedWriting() {
  const writing = JSON.parse(localStorage.getItem("amiraWriting") || "null");
  if (!writing) return;

  document.querySelector("#karya-tulis .project-name h3").textContent = writing.title || "Karya Tulis";
  document.querySelector("#karya-tulis-summary").textContent =
    (writing.body || "Ringkasan gagasan dan pembahasan yang disusun dalam bentuk tulisan")
      .replace(/\s+/g, " ")
      .slice(0, 110);
  document.querySelector("#writing-public-title").textContent = writing.title || "Karya Tulis";
  document.querySelector("#writing-public-body").innerHTML =
    (writing.body || "Belum ada isi karya tulis.")
      .split(/\n+/)
      .map((paragraph) => `<p>${escapeHtmlForPublic(paragraph)}</p>`)
      .join("");
}

function escapeHtmlForPublic(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

if (writingPublicDialog && writingPublicOpen) {
  writingPublicOpen.addEventListener("click", () => writingPublicDialog.showModal());
  document.querySelector("#writing-public-close").addEventListener("click", () => writingPublicDialog.close());
}

loadPublishedWriting();
