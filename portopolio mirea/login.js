const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");

if (sessionStorage.getItem("amiraAdminSession") === "active") {
  window.location.replace("admin.html");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  if (email === "admin@amira.com" && password === "admin123") {
    sessionStorage.setItem("amiraAdminSession", "active");
    window.location.replace("admin.html");
  } else {
    loginError.textContent = "Email atau kata sandi tidak sesuai.";
  }
});

document.querySelector("#toggle-password").addEventListener("click", (event) => {
  const password = document.querySelector("#password");
  const visible = password.type === "text";
  password.type = visible ? "password" : "text";
  event.currentTarget.textContent = visible ? "Tampilkan" : "Sembunyikan";
  event.currentTarget.setAttribute("aria-label", visible ? "Tampilkan kata sandi" : "Sembunyikan kata sandi");
});
