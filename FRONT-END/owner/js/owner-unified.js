(() => {
  "use strict";

  const BASE = "/owner/";

  const NAV_ITEMS = [
    {
      label: "Beranda",
      href: `${BASE}dashboard.html`,
      icon: `
        <path d="m3 10 9-7 9 7v11H3z"></path>
        <path d="M9 21v-7h6v7"></path>
      `
    },
    {
      label: "Kelola Menu",
      href: `${BASE}owner-menu.html`,
      icon: `
        <path d="M4 6h16"></path>
        <path d="M4 12h16"></path>
        <path d="M4 18h16"></path>
      `
    },
    {
      label: "Kelola Event",
      href: `${BASE}owner-event.html`,
      icon: `
        <rect x="3" y="5" width="18" height="16" rx="2"></rect>
        <path d="M7 3v4"></path>
        <path d="M17 3v4"></path>
        <path d="M3 10h18"></path>
      `
    },
    {
      label: "Kelola Fasilitas",
      href: `${BASE}owner-facility.html`,
      icon: `
        <path d="M4 21V7l8-4 8 4v14"></path>
        <path d="M9 21v-7h6v7"></path>
      `
    }
  ];

  const LOGOUT_ICON = `
    <path d="M10 17l5-5-5-5"></path>
    <path d="M15 12H3"></path>
    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"></path>
  `;

  function currentFileName() {
    return window.location.pathname.split("/").pop().toLowerCase();
  }

  function svg(iconPaths) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        ${iconPaths}
      </svg>
    `;
  }

  function buildSidebar() {
    const sidebar = document.querySelector(".owner-layout .sidebar");
    if (!sidebar) return;

    if (sidebar.dataset.sidebarBuilt === "true") return;
    sidebar.dataset.sidebarBuilt = "true";

    const current = currentFileName();

    const navHtml = NAV_ITEMS.map(item => {
      const file = item.href.split("/").pop().toLowerCase();
      const isActive = file === current;

      return `
        <a
          href="${item.href}"
          class="ku-nav-link ${isActive ? "active" : ""}"
          ${isActive ? 'aria-current="page"' : ""}
        >
          <span class="ku-nav-icon">
            ${svg(item.icon)}
          </span>
          <span class="ku-nav-text">${item.label}</span>
        </a>
      `;
    }).join("");

    sidebar.innerHTML = `
      <div class="ku-sidebar-top">
        <div class="ku-brand-wrap">
          <a href="${BASE}dashboard.html" class="ku-brand-link" aria-label="Beranda Owner Kammari">
            <img
              class="ku-brand-logo"
              src="/assets/logo_kammari_mask.svg"
              alt="Kammari"
              onerror="this.onerror=null;this.src='/owner/assets/kammari-wordmark-transparent.png';"
            >
          </a>
          <span class="ku-brand-subtitle">OWNER PORTAL</span>
        </div>

        <span class="ku-menu-label">MENU UTAMA</span>

        <nav class="ku-sidebar-nav" aria-label="Navigasi Owner">
          ${navHtml}
        </nav>
      </div>

      <div class="ku-sidebar-bottom">
        <p class="ku-branches">
          <span class="ku-branch-dot"></span>
          Gresik &amp; Surabaya
        </p>

        <button type="button" id="kuLogoutButton" class="ku-logout-btn">
          <span class="ku-nav-icon">
            ${svg(LOGOUT_ICON)}
          </span>
          <span>Keluar</span>
        </button>

        <small class="ku-sidebar-copy">© 2026 Kammari</small>
      </div>
    `;

    bindLogout();
  }

  async function bindLogout() {
    const logoutBtn = document.getElementById("kuLogoutButton");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;

      try {
        const csrfRes = await fetch("/api/auth/csrf", {
          credentials: "same-origin"
        });

        if (!csrfRes.ok) {
          throw new Error("CSRF token gagal diambil");
        }

        const csrf = await csrfRes.json();
        const headers = {};

        if (csrf.headerName && csrf.token) {
          headers[csrf.headerName] = csrf.token;
        }

        const logoutRes = await fetch("/logout", {
          method: "POST",
          credentials: "same-origin",
          headers
        });

        if (!logoutRes.ok) {
          throw new Error("Logout gagal");
        }

        window.location.href = "/owner/login.html";
      } catch (err) {
        console.error(err);
        alert("Logout gagal. Coba lagi.");
        logoutBtn.disabled = false;
      }
    });
  }

  function classifyButton(button) {
    if (!button) return;

    const text = button.textContent.trim().toLowerCase();

    button.classList.remove(
      "ku-btn-save",
      "ku-btn-edit",
      "ku-btn-delete",
      "ku-btn-add"
    );

    if (text.includes("simpan")) {
      button.classList.add("ku-btn-save");
    } else if (text.includes("edit")) {
      button.classList.add("ku-btn-edit");
    } else if (text.includes("hapus")) {
      button.classList.add("ku-btn-delete");
    } else if (text.includes("tambah")) {
      button.classList.add("ku-btn-add");
    }
  }

  function styleCrudButtons(root = document) {
    const buttons = root.querySelectorAll("button");
    buttons.forEach(classifyButton);
  }

  function observeCrudChanges() {
    const targets = [
      document.getElementById("menu-table-body"),
      document.getElementById("eventTableBody"),
      document.getElementById("facilityTableBody"),
      document.getElementById("addMenuSection"),
      document.getElementById("eventFormSection"),
      document.getElementById("facilityFormSection")
    ].filter(Boolean);

    targets.forEach(target => {
      const observer = new MutationObserver(() => {
        styleCrudButtons(target);
      });

      observer.observe(target, {
        childList: true,
        subtree: true
      });
    });
  }

  function initMobileToggle() {
    const topbar = document.querySelector(".owner-layout .topbar");
    const sidebar = document.querySelector(".owner-layout .sidebar");

    if (!topbar || !sidebar) return;
    if (topbar.querySelector(".ku-mobile-toggle")) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "ku-mobile-toggle";
    toggle.innerHTML = "☰";
    toggle.setAttribute("aria-label", "Buka menu");

    topbar.prepend(toggle);

    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (window.innerWidth > 800) return;

      const clickSidebar = sidebar.contains(e.target);
      const clickToggle = toggle.contains(e.target);

      if (!clickSidebar && !clickToggle) {
        sidebar.classList.remove("open");
      }
    });
  }

  function init() {
    buildSidebar();
    styleCrudButtons();
    observeCrudChanges();
    initMobileToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();