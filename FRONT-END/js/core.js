/* Kammari Café — core.js
   Diekstrak dari script.js tanpa mengubah logika fitur. */

/* Kammari Cafe & Roastery — script.js */

const WA_NUMBER = "6281234567890"; // ganti dengan nomor WhatsApp cafe (format 62...)
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kammari, saya ingin reservasi.")}`;

/* ---------- Ikon (SVG inline) ---------- */
const ICON = {
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.8.7a3.6 3.6 0 0 1-1.7-1.7l.7-.8-1-2L9 9.5z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c-.8 1 .8 1.6 0 2.8M12 3.5c-.8 1 .8 1.6 0 2.8"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-14 15-14 0 9-5 15-13 15"/><path d="M5 19c3-4 6-7 10-9"/></svg>',
  arch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7M3 21h18"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19.2" r=".9" fill="currentColor"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
  door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 12h16M9 7.5h6M9 16.500h6"/></svg>',
  paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.500" cy="10" r="1.800"/><circle cx="10" cy="6.200" r="1.800"/><circle cx="14" cy="6.200" r="1.800"/><circle cx="17.500" cy="10" r="1.800"/><path d="M12 12c-3 0-5 3-5 5 0 2 2 2.500 3.500 2s2.500-.5 3 0 1.500.5 3 0S17 19 17 17c0-2-2-5-5-5z"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500z"/></svg>',
  bean: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18c-3-3-1-9 4-12s9-3 10-1c1 2-1 8-5 11s-7 4-9 2z"/><path d="M8 17c2-1 3-3 4-5s2-4 5-5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.500v2.500M12 19v2.500M2.500 12H5M19 12h2.500M5.300 5.300l1.800 1.800M16.900 16.900l1.800 1.800M5.300 18.700l1.800-1.800M16.900 7.100l1.800-1.800"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="10" rx="1.500"/><path d="M2.500 19h19"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-4l2-5h12l2 5v4M4 16h16M4 16v2.500M20 16v2.500"/><circle cx="7.500" cy="13" r=".8" fill="currentColor"/><circle cx="16.500" cy="13" r=".8" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.500l3 3 5-6"/></svg>',
  qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.500" y="3.500" width="6" height="6" rx="1"/><rect x="14.500" y="3.500" width="6" height="6" rx="1"/><rect x="3.500" y="14.500" width="6" height="6" rx="1"/><path d="M14.500 14.500h2.500v2.500h-2.500zM19 14.500v2M14.500 19h3M19.500 19.500v1"/></svg>',
};
window.KAMMARI_ICON = ICON;
document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = ICON[el.dataset.icon] || ""; });

/* ---------- Header & footer dipakai bersama ---------- */
const page = document.body.dataset.page;
const link = (href, key, label) =>
  `<li><a href="${href}"${page === key ? ' aria-current="page"' : ""}>${label}</a></li>`;

const header = document.getElementById("site-header");
if (header) {
  header.className = "site-header";
  header.innerHTML = `
  <div class="wrap nav">
    <a class="logo" href="index.html" aria-label="Kammari, ke beranda"><span class="logo__text">Kammari</span><i class="logo__dot" aria-hidden="true"></i><small>Cafe &amp; Roastery</small></a>
    <ul class="nav__links" id="nav-links">
      ${link("index.html", "home", "Beranda")}
      ${link("menu.html", "menu", "Menu")}
      ${link("fasilitas.html", "fasilitas", "Fasilitas")}
    </ul>
      <div class="nav__actions">
      <!-- WhatsApp -->
      <a class="icon-btn icon-btn--wa" href="${WA_LINK}" target="_blank" rel="noopener" aria-label="WhatsApp">
        <img src="assets/wa.svg" alt="">
      </a>

      <!-- Instagram -->
      <a class="icon-btn icon-btn--ig" href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
        <img src="assets/ig.svg" alt="">
      </a>

      <!-- Menu -->
      <button class="icon-btn nav__toggle" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="nav-links">
        ${ICON.menu}
      </button>
    </div>
  </div>`;
  const toggle = header.querySelector(".nav__toggle");
  const links = header.querySelector("#nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
}

const footer = document.getElementById("site-footer");
if (footer) {
  footer.className = "site-footer";
  footer.innerHTML = `
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="logo" href="index.html" aria-label="Kammari, ke beranda"><span class="logo__text">Kammari</span><i class="logo__dot" aria-hidden="true"></i><small>Cafe &amp; Roastery</small></a>
        <p>Kopi sangrai sendiri dan ruang yang nyaman untuk duduk lama, di Gresik dan Surabaya.</p>
        <div style="display:flex;gap:18px">
          <!-- WhatsApp -->
          <a href="${WA_LINK}" target="_blank" rel="noopener" aria-label="WhatsApp">
            <img src="assets/wa.svg" alt="">
          </a>

          <!-- Instagram -->
          <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
            <img src="assets/ig.svg" alt="">
          </a>
        </div>
      </div>
      <div>
        <h4>Jelajahi</h4>
        <ul>
          <li><a href="index.html">Beranda</a></li>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="fasilitas.html">Fasilitas</a></li>
        </ul>
      </div>
      <div>
        <h4>Lokasi kami</h4>
        <p class="footer__loc"><b>Gresik</b>Jl. Samanhudi No.17, Kemuteran, Kec. Gresik, Kabupaten Gresik, Jawa Timur.<br>Buka setiap hari 09.00 sampai 23.00 WIB</p>
        <p class="footer__loc"><b>Surabaya</b>Jl. Ketintang Baru II No.KAV 7, Ketintang, Kec. Gayungan, Surabaya, Jawa Timur.<br>Buka setiap hari 09.00 sampai 23.00 WIB</p>
      </div>
    </div>
    <div class="footer__legal">
      <span>© ${new Date().getFullYear()} Kammari Cafe &amp; Roastery, Gresik dan Surabaya.</span>
      <span>Dibuat dengan hormat pada arsitektur dan cita rasa kopi lokal.</span>
    </div>
  </div>`;
}

/* ANIMASI SAAT SCROLL */
function initScrollAnimation() {
  const elements = document.querySelectorAll(
    ".story__photos, .story > div:last-child, .section-head, .dish, .picker, .gallery, .amenities, .branches, .venue"
  );

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  elements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
    observer.observe(element);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimation);
} else {
  initScrollAnimation();
}
