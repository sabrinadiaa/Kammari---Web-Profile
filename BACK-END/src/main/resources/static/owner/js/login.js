
// =====================================
// KAMMARI CAFE - OWNER LOGIN
// =====================================

document.addEventListener("DOMContentLoaded", () => {

  // AMBIL ELEMEN
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const rememberInput = document.getElementById("remember");
  const loginMessage = document.getElementById("loginMessage");

  // =====================================
  // 1. TAMPILKAN / SEMBUNYIKAN PASSWORD
  // =====================================

  togglePassword.addEventListener("click", () => {

    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    togglePassword.textContent = isHidden ? "Tutup" : "Lihat";

    togglePassword.setAttribute(
      "aria-pressed",
      String(isHidden)
    );

    togglePassword.setAttribute(
      "aria-label",
      isHidden ? "Sembunyikan password" : "Tampilkan password"
    );

  });

  // =====================================
  // 2. INGAT EMAIL OWNER
  // =====================================

  const savedEmail = localStorage.getItem("kammari_owner_email");

  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberInput.checked = true;
  }

  // =====================================
  // 3. PROSES FORM LOGIN
  // =====================================

  loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  loginMessage.classList.remove("show");

  if (!email || !password) {
    showMessage("Email dan password wajib diisi.");
    return;
  }

  try {
    const csrfResponse = await fetch("/api/auth/csrf", { cache: "no-store" });
    if (!csrfResponse.ok) {
      showMessage("Gagal menyiapkan login. Muat ulang halaman.");
      return;
    }

    const csrf = await csrfResponse.json();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { [csrf.headerName]: csrf.token },
      body: new URLSearchParams({ email, password })
    });

    if (response.status === 204) {
      window.location.assign("/owner/dashboard.html");
    } else if (response.status === 401) {
      showMessage("Email atau password salah.");
    } else {
      showMessage(`Login gagal diproses (${response.status}).`);
    }
  } catch (error) {
    console.error("Gagal memproses login:", error);
    showMessage("Respons login gagal diproses. Cek tab Network atau Console.");
  }

  if (response.status === 204) {
    window.location.assign("/owner/dashboard.html");
    return;
  }
});

});
