
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // ELEMEN DASHBOARD
  // ========================================

  const ownerEmail = document.getElementById("ownerEmail");
  const totalMenu = document.getElementById("totalMenu");
  const menuGresik = document.getElementById("menuGresik");
  const menuSurabaya = document.getElementById("menuSurabaya");
  const dashboardStatus = document.getElementById("dashboardStatus");
  const logoutButton = document.getElementById("logoutButton");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");

  // ========================================
  // HELPER API
  // ========================================

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      cache: "no-store",
      ...options
    });

    if (response.status === 401) {
      window.location.replace("/owner/login.html");
      throw new Error("Sesi berakhir. Silakan login kembali.");
    }

    if (response.status === 403) {
      throw new Error("Akses ditolak.");
    }

    if (!response.ok) {
      throw new Error(
        `Permintaan gagal (HTTP ${response.status}).`
      );
    }

    return response;
  }

  // ========================================
  // CEK SESI OWNER
  // ========================================

  async function loadOwner() {
    const response = await api("/api/owner/me");
    const owner = await response.json();

    ownerEmail.textContent = owner.email;
  }

  // ========================================
  // STATISTIK MENU DARI DATABASE
  // ========================================

  async function getMenuCount(branch) {
    const response = await api(
      `/api/owner/menus?branch=${encodeURIComponent(branch)}`
    );

    const data = await response.json();

    if (!Array.isArray(data.items)) {
      throw new Error("Format data menu tidak sesuai.");
    }

    return data.items.length;
  }

  async function loadStatistics() {
    dashboardStatus.textContent = "Memuat statistik...";

    try {
      const [gresik, surabaya] = await Promise.all([
        getMenuCount("gresik"),
        getMenuCount("surabaya")
      ]);

      menuGresik.textContent = gresik.toLocaleString("id-ID");
      menuSurabaya.textContent = surabaya.toLocaleString("id-ID");
      totalMenu.textContent =
        (gresik + surabaya).toLocaleString("id-ID");

      dashboardStatus.textContent =
        "Data menu aktif berhasil dimuat.";

    } catch (error) {
      dashboardStatus.textContent = error.message;
      console.error("Statistik dashboard:", error);
    }
  }

  // ========================================
  // LOGOUT SPRING SECURITY
  // ========================================

  async function logout() {
    logoutButton.disabled = true;
    logoutButton.textContent = "Memproses...";

    try {
      const csrfResponse = await api("/api/auth/csrf");
      const csrf = await csrfResponse.json();

      const response = await api("/api/auth/logout", {
        method: "POST",
        headers: {
          [csrf.headerName]: csrf.token
        }
      });

      if (response.status !== 204) {
        throw new Error("Logout gagal.");
      }

      window.location.replace("/owner/login.html");

    } catch (error) {
      console.error("Logout:", error);
      dashboardStatus.textContent = error.message;

      logoutButton.disabled = false;
      logoutButton.textContent = "Keluar";
    }
  }

  logoutButton.addEventListener("click", logout);

  // ========================================
  // SIDEBAR RESPONSIVE
  // ========================================

  sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    sidebarToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      sidebar.classList.remove("open");
      sidebarToggle.setAttribute("aria-expanded", "false");
    }
  });

  // ========================================
  // INITIALIZATION
  // ========================================

  async function init() {
    try {
      await loadOwner();
      await loadStatistics();
    } catch (error) {
      dashboardStatus.textContent = error.message;
      console.error("Dashboard Owner:", error);
    }
  }

  init();
});
