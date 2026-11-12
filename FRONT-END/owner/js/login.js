
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

  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginMessage.classList.remove("show");

    if (!email || !password) {
      showMessage("Email dan password wajib diisi.");
      return;
    }

    // Simpan hanya email, bukan password
    if (rememberInput.checked) {
      localStorage.setItem("kammari_owner_email", email);
    } else {
      localStorage.removeItem("kammari_owner_email");
    }

    // Autentikasi belum dihubungkan ke backend.
    // Jangan menganggap login berhasil atau
    // mengarahkan pengguna ke dashboard.

    showMessage(
      "Tampilan login sudah siap. " +
      "Autentikasi Owner belum terhubung " +
      "dengan backend PHP."
    );

  });

  // =====================================
  // 4. MENAMPILKAN PESAN
  // =====================================

  function showMessage(message) {

    loginMessage.textContent = message;
    loginMessage.classList.add("show");

  }

});
