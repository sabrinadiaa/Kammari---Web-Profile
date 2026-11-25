
/* ============================================
   KAMMARI CAFÉ — OWNER LOGIN
   Spring Boot + Spring Security
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. AMBIL ELEMEN
  // ==========================================

  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginMessage = document.getElementById("loginMessage");
  const loginButton = document.getElementById("loginButton");

  // Email internal akun admin pada database.
  // Ubah jika email akun di database berubah.
  const ADMIN_EMAIL = "admin@kammari";

  if (
    !loginForm ||
    !usernameInput ||
    !passwordInput ||
    !loginMessage
  ) {
    console.error("Elemen form Login Owner tidak lengkap.");
    return;
  }

  // ==========================================
  // 2. TAMPILKAN / SEMBUNYIKAN PASSWORD
  // ==========================================

  togglePassword?.addEventListener("click", () => {

    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden
      ? "text"
      : "password";

    togglePassword.textContent = isHidden
      ? "Tutup"
      : "Lihat";

    togglePassword.setAttribute(
      "aria-pressed",
      String(isHidden)
    );

    togglePassword.setAttribute(
      "aria-label",
      isHidden
        ? "Sembunyikan password"
        : "Tampilkan password"
    );

  });

  // ==========================================
  // 3. TAMPILKAN PESAN
  // ==========================================

  function showMessage(message) {
    loginMessage.textContent = message;
    loginMessage.classList.add("show");
  }

  function clearMessage() {
    loginMessage.textContent = "";
    loginMessage.classList.remove("show");
  }

  // ==========================================
  // 4. STATUS TOMBOL LOGIN
  // ==========================================

  function setLoading(loading) {

    if (!loginButton) return;

    loginButton.disabled = loading;

    const label = loginButton.querySelector("span");

    if (label) {
      label.textContent = loading
        ? "Memproses..."
        : "Masuk";
    }

  }

  // ==========================================
  // 5. AMBIL TOKEN CSRF
  // ==========================================

  async function getCsrfToken() {

    const response = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        "Gagal mendapatkan token keamanan (HTTP " +
        response.status + ")."
      );
    }

    const csrf = await response.json();

    if (
      typeof csrf.token !== "string" ||
      typeof csrf.headerName !== "string"
    ) {
      throw new Error("Format token CSRF tidak sesuai.");
    }

    return csrf;
  }

  // ==========================================
  // 6. VERIFIKASI SESSION OWNER
  // ==========================================

  async function verifyOwnerSession(expectedEmail) {

    const response = await fetch("/api/owner/me", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok || response.redirected) {
      throw new Error(
        "Login belum terverifikasi. Periksa sesi Owner."
      );
    }

    const owner = await response.json();

    if (
      !owner.email ||
      owner.email.toLowerCase() !==
        expectedEmail.toLowerCase()
    ) {
      throw new Error(
        "Sesi Owner tidak sesuai dengan akun login."
      );
    }

    return owner;
  }

  // ==========================================
  // 7. PROSES LOGIN
  // ==========================================

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearMessage();

    const username = usernameInput.value
      .trim()
      .toLowerCase();

    const password = passwordInput.value;

    if (!username || !password) {
      showMessage("Username dan password wajib diisi.");
      return;
    }

    // Konversi username 'admin' ke email internal.
    // Spring Security saat ini mencari akun dari email.
    const email = username === "admin"
      ? ADMIN_EMAIL
      : username;

    setLoading(true);

    try {

      // 1. Ambil CSRF Token
      const csrf = await getCsrfToken();

      // 2. Format yang diterima Spring Security
      const formData = new URLSearchParams();

      formData.set("email", email);
      formData.set("password", password);

      // 3. Kirim login sebagai form-urlencoded
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
          [csrf.headerName]: csrf.token
        },
        body: formData.toString()
      });

      // 4. Tangani autentikasi gagal
      if (response.status === 401) {
        throw new Error("Username atau password salah.");
      }

      if (response.status === 403) {
        throw new Error(
          "Akses ditolak. Periksa CSRF dan hak akses Owner."
        );
      }

      // Konfigurasi login Kammari mengembalikan 204
      if (response.status !== 204) {
        throw new Error(
          "Respons login tidak sesuai (HTTP " +
          response.status + ")."
        );
      }

      // 5. Pastikan sesi benar-benar terautentikasi
      await verifyOwnerSession(email);

      // 6. Berhasil, masuk Dashboard
      window.location.replace(
        "/owner/dashboard.html"
      );

    } catch (error) {

      console.error("Owner login error:", error);

      showMessage(
        error instanceof TypeError
          ? "Tidak dapat menghubungi server. Pastikan Spring Boot berjalan."
          : error.message || "Login gagal. Silakan coba lagi."
      );

    } finally {

      setLoading(false);

    }

  });

});
