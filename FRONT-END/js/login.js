
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const toggle = document.getElementById("togglePassword");
  const remember = document.getElementById("remember");
  const message = document.getElementById("loginMessage");
  const submitButton = form.querySelector('button[type="submit"]');

  function showMessage(text) {
    message.textContent = text;
    message.classList.add("show");
  }

  function clearMessage() {
    message.textContent = "";
    message.classList.remove("show");
  }

  // Tampilkan/sembunyikan password
  toggle.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";

    passwordInput.type = hidden ? "text" : "password";
    toggle.textContent = hidden ? "Tutup" : "Lihat";
    toggle.setAttribute("aria-pressed", String(hidden));
    toggle.setAttribute(
      "aria-label",
      hidden ? "Sembunyikan password" : "Tampilkan password"
    );
  });

  // Ingat email saja, bukan password
  const savedEmail = localStorage.getItem("kammari_owner_email");

  if (savedEmail) {
    emailInput.value = savedEmail;
    remember.checked = true;
  }

  // Mengambil token CSRF dari Spring Security
  async function getCsrfToken() {
    const response = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil token CSRF.");
    }

    return await response.json();
  }

  // Login Owner
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Email dan password wajib diisi.");
      return;
    }

    if (!emailInput.validity.valid) {
      showMessage("Format email tidak valid.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Memeriksa akun...";

    try {
      const csrf = await getCsrfToken();

      const body = new URLSearchParams({
        email: email,
        password: password
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          [csrf.headerName]: csrf.token
        },
        body: body.toString()
      });

      if (response.status === 401) {
        showMessage("Email atau password salah.");
        return;
      }

      if (response.status === 403) {
        showMessage(
          "Akses ditolak. Muat ulang halaman dan coba lagi."
        );
        return;
      }

      if (response.status !== 204) {
        showMessage(
          "Login gagal. Status server: " + response.status
        );
        return;
      }

      // Verifikasi sesi Owner sebelum membuka dashboard
      const verification = await fetch("/api/owner/me", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!verification.ok) {
        showMessage(
          "Login diproses, tetapi akses Owner belum valid."
        );
        return;
      }

      // Simpan email hanya jika diminta
      if (remember.checked) {
        localStorage.setItem("kammari_owner_email", email);
      } else {
        localStorage.removeItem("kammari_owner_email");
      }

      window.location.replace("/owner/dashboard.html");

    } catch (error) {
      console.error("Kesalahan login:", error);

      showMessage(
        "Tidak dapat menghubungi server. " +
        "Pastikan Spring Boot sedang berjalan."
      );

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Masuk ke Dashboard";
    }
  });
});
