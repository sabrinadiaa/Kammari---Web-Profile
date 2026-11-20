
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

  const savedEmail = localStorage.getItem("kammari_owner_email");

  if (savedEmail && remember) {
    emailInput.value = savedEmail;
    remember.checked = true;
  }

  async function getCsrfToken() {
    const response = await fetch("/api/auth/csrf", {
      credentials: "same-origin",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil token CSRF.");
    }

    return response.json();
  }

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

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          [csrf.headerName]: csrf.token
        },
        body: new URLSearchParams({ email, password })
      });

      if (response.status === 401) {
        showMessage("Email atau password salah.");
        return;
      }

      if (response.status === 403) {
        showMessage(
          "Permintaan ditolak. Muat ulang halaman dan coba lagi."
        );
        return;
      }

      if (response.status !== 204) {
        showMessage("Login gagal. Status: " + response.status);
        return;
      }

      const check = await fetch("/api/owner/me", {
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!check.ok) {
        showMessage("Sesi Owner belum valid.");
        return;
      }

      if (remember?.checked) {
        localStorage.setItem("kammari_owner_email", email);
      } else {
        localStorage.removeItem("kammari_owner_email");
      }

      window.location.replace("/owner/dashboard.html");

    } catch (error) {
      console.error("Login Owner:", error);
      showMessage(
        "Tidak dapat menghubungi Spring Boot. Periksa server."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Masuk ke Dashboard";
    }
  });
});
