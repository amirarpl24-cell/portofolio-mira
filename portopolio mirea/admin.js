const dashboard = document.querySelector("#dashboard");
const toast = document.querySelector("#toast");

const defaultProjects = [
  { title: "Situs web menu Have Bites", description: "Menampilkan menu makanan dan pemesanan melalui WhatsApp", type: "PROYEK LANGSUNG", date: "20 Nov 2026" },
  { title: "Situs web profil pribadi", description: "Gagasan latihan memperkenalkan diri", type: "GAGASAN LATIHAN", date: "15 Nov 2026" },
  { title: "Aplikasi daftar kegiatan", description: "Ide aplikasi untuk mencatat kegiatan harian", type: "GAGASAN LATIHAN", date: "10 Nov 2026" },
  { title: "Sistem pencatatan sederhana", description: "Ide latihan mencatat informasi", type: "GAGASAN LATIHAN", date: "05 Nov 2026" },
  { title: "Karya Tulis", description: "Ringkasan gagasan dan pembahasan dalam bentuk tulisan", type: "KARYA TULIS", date: "20 Nov 2026" }
];

let projects = JSON.parse(localStorage.getItem("amiraProjects") || "null") || defaultProjects;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

if (sessionStorage.getItem("amiraAdminSession") !== "active") {
  window.location.replace("login.html");
}

renderProjects();

document.querySelector("#logout-button").addEventListener("click", () => {
  sessionStorage.removeItem("amiraAdminSession");
  window.location.replace("login.html");
});

function switchView(view) {
  document.querySelectorAll(".view-panel").forEach((panel) => { panel.hidden = panel.id !== `${view}-panel`; });
  document.querySelectorAll(".side-link").forEach((link) => link.classList.toggle("active", link.dataset.view === view));
  const titles = { ringkasan: "Halo, Amira!", profil: "Edit profil", karya: "Kelola karya", tulis: "Karya Tulis", pesan: "Kotak masuk" };
  document.querySelector("#page-title").textContent = titles[view];
  document.querySelector(".sidebar").classList.remove("open");
}

document.querySelectorAll("[data-view]").forEach((control) => {
  control.addEventListener("click", () => switchView(control.dataset.view));
});

document.querySelector("#mobile-menu").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

function renderProjects() {
  document.querySelector("#stat-projects").textContent = projects.length;
  document.querySelector("#project-count").textContent = projects.length;
  document.querySelector("#project-table").innerHTML = projects.map((project, index) => `
    <tr>
      <td><div class="project-title"><span>▦</span><strong>${escapeHtml(project.title)}</strong></div></td>
      <td><span class="status">Aktif</span></td>
      <td>${project.date}</td>
      <td><button class="row-action" data-delete="${index}" aria-label="Hapus ${escapeHtml(project.title)}">Hapus</button></td>
    </tr>
  `).join("");
  document.querySelector("#recent-projects").innerHTML = projects.slice(0, 3).map((project) => `
    <div class="activity-row"><span class="activity-thumb">▦</span><div><strong>${escapeHtml(project.title)}</strong><small>${escapeHtml(project.type)}</small></div><time>${project.date}</time></div>
  `).join("");
  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      projects.splice(Number(button.dataset.delete), 1);
      saveProjects();
      showToast("Karya berhasil dihapus.");
    });
  });
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function saveProjects() {
  localStorage.setItem("amiraProjects", JSON.stringify(projects));
  renderProjects();
}

const projectDialog = document.querySelector("#project-dialog");
document.querySelector("#add-project").addEventListener("click", () => projectDialog.showModal());
document.querySelector("#dialog-close").addEventListener("click", () => projectDialog.close());
document.querySelector("#dialog-cancel").addEventListener("click", () => projectDialog.close());

document.querySelector("#project-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  projects.unshift({
    title: form.get("title"),
    description: form.get("description"),
    type: form.get("type"),
    date: new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())
  });
  saveProjects();
  event.currentTarget.reset();
  projectDialog.close();
  showToast("Karya baru berhasil ditambahkan.");
});

document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem("amiraProfile", JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  showToast("Profil berhasil diperbarui.");
});

const writingTitle = document.querySelector("#writing-title");
const writingBody = document.querySelector("#writing-body");
const saveStatus = document.querySelector("#save-status");
const savedWriting = JSON.parse(localStorage.getItem("amiraWriting") || "null");

if (savedWriting) {
  writingTitle.value = savedWriting.title || "Karya Tulis";
  writingBody.value = savedWriting.body || "";
}

let saveTimer;
function saveWriting(showMessage = false) {
  localStorage.setItem("amiraWriting", JSON.stringify({
    title: writingTitle.value,
    body: writingBody.value,
    updatedAt: new Date().toISOString()
  }));
  saveStatus.textContent = "Tersimpan otomatis";
  if (showMessage) showToast("Karya tulis berhasil disimpan.");
}

writingTitle.addEventListener("input", () => {
  saveStatus.textContent = "Menyimpan...";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveWriting(false), 500);
});

writingBody.addEventListener("input", () => {
  saveStatus.textContent = "Menyimpan...";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveWriting(false), 500);
});

document.querySelector("#writing-form").addEventListener("submit", (event) => {
  event.preventDefault();
  saveWriting(true);
});

const writingDialog = document.querySelector("#writing-dialog");
document.querySelector("#preview-writing").addEventListener("click", () => {
  const title = writingTitle.value.trim() || "Karya Tulis";
  const body = writingBody.value.trim();
  document.querySelector("#writing-preview").innerHTML =
    `<p class="eyebrow">PRATINJAU</p><h2>${escapeHtml(title)}</h2>` +
    (body ? body.split(/\n+/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") : "<p>Belum ada isi karya tulis.</p>");
  writingDialog.showModal();
});
document.querySelector("#close-writing-preview").addEventListener("click", () => writingDialog.close());
