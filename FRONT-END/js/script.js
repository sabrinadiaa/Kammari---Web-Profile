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
        <img src="assets/whatsapp.svg" alt="">
      </a>

      <!-- Instagram -->
      <a class="icon-btn icon-btn--ig" href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
        <img src="assets/instagram.svg" alt="">
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
            <img src="assets/whatsapp.svg" alt="">
          </a>

          <!-- Instagram -->
          <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
            <img src="assets/instagram.svg" alt="">
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

/* ---------- Data menu ---------- */
const G = "gresik", S = "surabaya";
const CATEGORIES = [];
const MENU = [];
let latestMenuRequest = 0;

async function loadBranchMenu(branch) {
  const requestId = ++latestMenuRequest;

  try {
    const response = await fetch(
      `../BACKEND/api/menu.php?branch=${encodeURIComponent(branch)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (requestId !== latestMenuRequest) return;

    const items = data.items || [];

    const catMap = new Map();

    items.forEach(item => {
      if (!catMap.has(item.category_slug)) {
        catMap.set(item.category_slug, {
          id: item.category_slug,
          title: item.category_name,
          note: item.category_description || ""
        });
      }
    });

    CATEGORIES.splice(
      0,
      CATEGORIES.length,
      ...catMap.values()
    );

    MENU.splice(
      0,
      MENU.length,
      ...items.map(item => ({
        id: Number(item.id),
        cat: item.category_slug,
        name: item.name,
        desc: item.description || "",
        price: Number(item.price),
        image: item.image || "",
        b: [branch],
        mood: [
          "main-course",
          "snack",
          "makanan-penutup",
          "combo-makassar",
          "combo-penak"
        ].includes(item.category_slug)
          ? ["lapar", "santai"]
          : ["santai", "fokus"]
      }))
    );

    document.dispatchEvent(
      new CustomEvent("kammari-menu-loaded", {
        detail: { branch }
      })
    );

  } catch (error) {
    if (requestId !== latestMenuRequest) return;

    console.error("Gagal memuat menu:", error);

    document.dispatchEvent(
      new CustomEvent("kammari-menu-error", {
        detail: { branch }
      })
    );
  }
}
const rupiah = n => "Rp " + n.toLocaleString("id-ID");
const BRANCH_NAME = { gresik: "Gresik", surabaya: "Surabaya" };


function dishCard(item, showBranch) {
  const where = item.b.length === 2
    ? ""
    : `<span class="tag tag--sage">
         Hanya di ${BRANCH_NAME[item.b[0]]}
       </span>`;

  // Mengambil alamat gambar dari database
  const imageStyle = item.image
    ? `style="--src: url('${new URL(item.image, document.baseURI).href}')"`
    : "";

  return `
    <article class="dish">

      <figure
  class="photo arch"
  role="img"
  aria-label="Foto ${item.name}"
  ${imageStyle}
>
  <figcaption>${item.name}</figcaption>
</figure>

      <div class="dish__top">
        <h3>${item.name}</h3>
        <span class="price">${rupiah(item.price)}</span>
      </div>

      <p>${item.desc}</p>

      ${showBranch ? where : ""}

    </article>
  `;
}


/* ---------- Beranda: menu rekomendasi + pemilih mood ---------- */

const featured = document.getElementById("featured");

if (featured) {
  const chips = document.getElementById("featured-chips");

  // Filter beranda sesuai kategori di database
  const FILTERS = [
  {
    key: "semua",
    label: "Semua",
    cats: null
  },
  {
    key: "kopi",
    label: "Kopi",
    cats: ["coffee-based", "kopi"]
  },
  {
    key: "minuman",
    label: "Minuman",
    cats: [
      "signature",
      "tea-based",
      "milk-based",
      "menu-seasonal"
    ]
  },
  {
    key: "makanan",
    label: "Makanan Berat",
    cats: [
      "main-course",
      "makanan-utama",
      "makanan-berat"
    ]
  },
  {
    key: "camilan",
    label: "Camilan",
    cats: [
      "snack",
      "makanan-ringan",
      "makanan-penutup",
      "dessert"
    ]
  },
  {
    key: "combo",
    label: "Combo",
    cats: [
      "combo-makassar",
      "combo-penak"
    ]
  }
];

  const FAVORITES = [
  "Milo Malaysia Ashoy",
  "Thai Basil Chicken",
  "Mee Nyedas Kami",
  "Kentang Goreng Masala",
  "Teh Jasmine"
];

  let activeFilter = "semua";

  const wrapper =
    featured.closest(".featured-carousel-wrap");

  document.querySelectorAll(".featured-carousel-nav")
    .forEach(el => el.remove());

  const nav = document.createElement("div");
  nav.className = "featured-carousel-nav";

  nav.innerHTML = `
    <button class="carousel-arrow carousel-prev"
            type="button" aria-label="Menu sebelumnya">
      &lsaquo;
    </button>
    <button class="carousel-arrow carousel-next"
            type="button" aria-label="Menu berikutnya">
      &rsaquo;
    </button>
  `;

  (wrapper || featured.parentElement)
    .appendChild(nav);

  const prevBtn = nav.querySelector(".carousel-prev");
  const nextBtn = nav.querySelector(".carousel-next");

  function updateArrows() {
    const maxScroll =
      featured.scrollWidth - featured.clientWidth;

    prevBtn.hidden = featured.scrollLeft <= 2;
    nextBtn.hidden =
      maxScroll <= 2 ||
      featured.scrollLeft >= maxScroll - 2;
  }

  // Tampilkan filter yang memiliki menu
  function renderFilters() {
    const available = FILTERS.filter(filter =>
      filter.key === "semua" ||
      MENU.some(item => filter.cats.includes(item.cat))
    );

    if (!available.some(f => f.key === activeFilter)) {
      activeFilter = "semua";
    }

    chips.innerHTML = available.map(filter => `
      <button type="button"
              class="chip"
              data-key="${filter.key}"
              aria-pressed="${filter.key === activeFilter}">
        ${filter.label}
      </button>
    `).join("");
  }

  // Isi kartu berasal dari MENU hasil API MySQL
  function draw() {
    const filter = FILTERS.find(
      f => f.key === activeFilter
    );

    const matches = MENU.filter(item =>
      !filter.cats || filter.cats.includes(item.cat)
    );

    // Utamakan menu yang sudah memiliki foto
    const list = activeFilter === "semua"
  ? [
      ...FAVORITES
        .map(name =>
          MENU.find(item =>
            item.name.toLowerCase() === name.toLowerCase()
          )
        )
        .filter(Boolean),

      ...matches.filter(item =>
        !FAVORITES.some(name =>
          name.toLowerCase() === item.name.toLowerCase()
        )
      )
    ].slice(0, 5)

  : matches
      .sort((a, b) =>
        Number(Boolean(b.image)) -
        Number(Boolean(a.image))
      )
      .slice(0, 5);
    
    featured.innerHTML = list.length
      ? list.map(item => dishCard(item, false)).join("")
      : `<p class="empty">Belum ada menu pada kategori ini.</p>`;

    featured.scrollLeft = 0;
    requestAnimationFrame(updateArrows);
  }

  chips.addEventListener("click", event => {
    const btn = event.target.closest("button[data-key]");
    if (!btn || !chips.contains(btn)) return;

    activeFilter = btn.dataset.key;

    chips.querySelectorAll("button").forEach(b => {
      b.setAttribute(
        "aria-pressed",
        String(b === btn)
      );
    });

    draw();
  });

  function move(direction) {
    const card = featured.querySelector(".dish");
    if (!card) return;

    const distance =
      card.getBoundingClientRect().width + 24;

    featured.scrollBy({
      left: distance * direction,
      behavior: "smooth"
    });
  }

  prevBtn.addEventListener("click", () => move(-1));
  nextBtn.addEventListener("click", () => move(1));

  featured.addEventListener("scroll", updateArrows, {
    passive: true
  });

  window.addEventListener("resize", updateArrows);

  // Render ulang setelah data MySQL berhasil diambil
  document.addEventListener(
    "kammari-menu-loaded",
    ({ detail }) => {
      if (detail.branch !== "gresik") return;

      renderFilters();
      draw();
    }
  );

  document.addEventListener(
    "kammari-menu-error",
    () => {
      featured.textContent =
        "Gagal memuat menu dari database.";
      updateArrows();
    }
  );

  featured.innerHTML =
    `<p class="empty">Memuat pilihan menu...</p>`;

  if (MENU.length) {
    renderFilters();
    draw();
  }
}

const pickerOut = document.getElementById("picker-out");
if (pickerOut) {
  document.querySelectorAll("#picker-moods .chip").forEach(btn =>
    btn.addEventListener("click", () => {
      document.querySelectorAll("#picker-moods .chip").forEach(b => b.setAttribute("aria-pressed", b === btn));
      const pool = MENU.filter(m => m.mood.includes(btn.dataset.mood));
      if (!pool.length) {
        pickerOut.textContent = "Menu belum tersedia.";
        return;
      }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      pickerOut.innerHTML = `<span class="small">Coba ini</span><h4>${pick.name}</h4><p class="small">${pick.desc}</p><span class="price">${rupiah(pick.price)}</span>`;
    }));
}


/* ---------- Halaman menu ---------- */
const menuRoot = document.getElementById("menu-root");

if (menuRoot) {
  let branch = "gresik";

  const note = document.getElementById("branch-note");
  const catNav = document.getElementById("cat-nav");

  function renderMenu() {
    // Hanya kategori yang mempunyai menu
    const availableCategories = CATEGORIES.filter(cat =>
      MENU.some(item => item.cat === cat.id)
    );

    note.textContent =
      `${MENU.length} pilihan menu tersedia di cabang ` +
      `${BRANCH_NAME[branch]}.`;

    // Navigasi kategori dari database
    catNav.innerHTML = availableCategories.map(cat => `
      <a class="chip" href="#cat-${cat.id}">
        ${cat.title}
      </a>
    `).join("");

    if (!MENU.length) {
      menuRoot.innerHTML =
        `<p class="empty">Belum ada menu untuk cabang ini.</p>`;
      return;
    }

    // Isi tiap kategori berdasarkan category_slug
    menuRoot.innerHTML = availableCategories.map(cat => {
      const items = MENU.filter(
        item => item.cat === cat.id
      );

      return `
        <section class="menu-cat"
                 id="cat-${cat.id}"
                 aria-labelledby="h-${cat.id}">

          <div class="menu-cat__head">
            <h2 class="h-lg" id="h-${cat.id}">
              ${cat.title}
            </h2>
            <p>${cat.note || ""}</p>
          </div>

          <div class="dishes">
            ${items.map(item =>
        dishCard(item, false)
      ).join("")}
          </div>

        </section>
      `;
    }).join("");
  }

  // Saat API mengirim data, tampilkan menu cabang aktif
  document.addEventListener(
    "kammari-menu-loaded",
    ({ detail }) => {
      if (detail.branch === branch) {
        renderMenu();
      }
    }
  );

  document.addEventListener(
    "kammari-menu-error",
    ({ detail }) => {
      if (detail.branch === branch) {
        menuRoot.textContent =
          "Gagal memuat menu. Periksa koneksi database.";
      }
    }
  );

  // Tombol cabang Gresik / Surabaya
  document.querySelectorAll("#branch-toggle button")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        branch = btn.dataset.branch;

        document.querySelectorAll(
          "#branch-toggle button"
        ).forEach(b => {
          b.setAttribute(
            "aria-pressed",
            String(b === btn)
          );
        });

        menuRoot.textContent = "Memuat menu...";
        catNav.innerHTML = "";

        loadBranchMenu(branch);
      });
    });

  menuRoot.textContent = "Memuat menu...";
}

// Jalankan pengambilan data awal SATU KALI
if (featured || menuRoot) {
  loadBranchMenu("gresik");
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

/* PENDAFTARAN EVENT VIA WHATSAPP */
document.querySelectorAll(".event-register").forEach(button => {
  const eventName = button.dataset.event;

  const message =
    `Halo Kammari, saya ingin mendaftar event ${eventName}. ` +
    `Boleh minta informasi biaya, kuota, dan cara pendaftarannya?`;

  button.href =
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  button.target = "_blank";
  button.rel = "noopener noreferrer";
});


/* =====================================
   SISTEM EVENT KAMMARI
   Semua data event dikelola dari sini
===================================== */

/* =====================================
   SISTEM EVENT KAMMARI
   Event berpindah otomatis ke "Telah Terlaksana"
   setelah dateISO / endDateISO lewat.
   Event TANPA tanggal mengikuti flag "past".
===================================== */

const EVENTS = [

  // ---------- EVENT YANG SUDAH TERLAKSANA (punya tanggal) ----------
  {
    id: "JunkJournaling",
    title: "Junk Journaling",
    status: "SELESAI",
    past: true,
    comingSoon: false,
    date: "18 Oktober 2026",
    dateISO: "2026-10-18",
    endDateISO: "2026-10-18",
    location: "Kammari Cafe",
    description: "Kegiatan kreatif Junk Journaling bersama Kammari.",
    poster: "assets/Poster-event-terlaksana/Junk-Journaling.png",
    video: "assets/video-animasi-poster/junk_journaling_creative_motion.mp4"
  },

  {
    id: "ArtJournaling",
    title: "Weekend Art Journaling",
    status: "SELESAI",
    past: true,
    comingSoon: false,
    date: "13 September 2026",
    dateISO: "2026-09-13",
    endDateISO: "2026-09-13",
    location: "Kammari Cafe",
    description: "Kegiatan kreatif Art Journaling bersama Kammari.",
    poster: "assets/Poster-event-terlaksana/weekend-art-journaling.jpg",
    video: ""
  },


  // ---------- POSTER LAMA (tanpa tanggal, ikut flag "past") ----------
  {
    id: "OpenMicBola",
    title: "Open Mic Bola",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-bola.jpg"
  },

  {
    id: "OpenMicJumpaLagi",
    title: "Open Mic Jumpa Lagi",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-jumpa-lagi.jpg"
  },

  {
    id: "OpenMicLagi",
    title: "Open Mic Lagi",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-lagi.jpg"
  },

  {
    id: "OpenMicListrik",
    title: "Open Mic Listrik",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-listrik.jpg"
  },

  {
    id: "OpenMicPerampasan",
    title: "Open Mic Perampasan Aset",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-perampasan-aset.jpg"
  },

  {
    id: "OpenMicTasyakuran",
    title: "Open Mic Tasyakuran",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-tasyakuran.jpg"
  },

  {
    id: "OpenMicTawa",
    title: "Open Mic Tawa",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic-tawa.jpg"
  },

  {
    id: "OpenMic",
    title: "Open Mic",
    status: "SELESAI",
    past: true,
    poster: "assets/Poster-event-terlaksana/open-mic.jpg"
  },


  // ---------- EVENT MENDATANG (punya tanggal) ----------
  // Setelah tanggalnya lewat, otomatis pindah ke "Telah Terlaksana".
  {
    id: "Crochet",
    title: "Crochet Workshop",
    status: "EVENT MENDATANG",
    past: false,
    comingSoon: false,
    date: "8 November 2026",
    dateISO: "2026-11-08",
    endDateISO: "2026-11-08",
    location: "Kammari Cafe",
    description:
      "Yuk, eksplorasi kreativitas melalui Crochet! " +
      "Buat karya unik menggunakan benang dan jarum crochet.",
    poster: "assets/poster-event-mendatang/crochet_workshop.jpg",
    video: ""
  },


  // ---------- TEMPLATE COMING SOON ----------
  // Jangan beri dateISO di sini. Kalau event sudah pasti,
  // ganti isinya: comingSoon: false, status, date, dateISO, poster.
  {
    id: "event4",
    title: "Event Selanjutnya",
    status: "COMING SOON",
    past: false,
    comingSoon: true,
    date: "Belum diumumkan",
    location: "Kammari Cafe",
    description:
      "Informasi event ini akan segera hadir. " +
      "Nantikan kegiatan menarik berikutnya bersama Kammari.",
    poster: "",
    video: ""
  },

  {
    id: "event5",
    title: "Event Selanjutnya",
    status: "COMING SOON",
    past: false,
    comingSoon: true,
    date: "Belum diumumkan",
    location: "Kammari Cafe",
    description:
      "Informasi event ini akan segera hadir. " +
      "Nantikan kegiatan menarik berikutnya bersama Kammari.",
    poster: "",
    video: ""
  },

  {
    id: "event6",
    title: "Event Selanjutnya",
    status: "COMING SOON",
    past: false,
    comingSoon: true,
    date: "Belum diumumkan",
    location: "Kammari Cafe",
    description:
      "Informasi event ini akan segera hadir. " +
      "Nantikan kegiatan menarik berikutnya bersama Kammari.",
    poster: "",
    video: ""
  },

  {
    id: "event7",
    title: "Event Selanjutnya",
    status: "COMING SOON",
    past: false,
    comingSoon: true,
    date: "Belum diumumkan",
    location: "Kammari Cafe",
    description:
      "Informasi event ini akan segera hadir. " +
      "Nantikan kegiatan menarik berikutnya bersama Kammari.",
    poster: "",
    video: ""
  },

  {
    id: "event8",
    title: "Event Selanjutnya",
    status: "COMING SOON",
    past: false,
    comingSoon: true,
    date: "Belum diumumkan",
    location: "Kammari Cafe",
    description:
      "Informasi event ini akan segera hadir. " +
      "Nantikan kegiatan menarik berikutnya bersama Kammari.",
    poster: "",
    video: ""
  }

];


/* ---------- Pengaturan dasar ---------- */

const eventGallery = document.getElementById("event-gallery");
const pastGallery = document.getElementById("past-event-gallery");

const getEvent = id =>
  EVENTS.find(event => event.id === id);

function todayJakarta() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

// Selesai otomatis jika hari terakhir event sudah lewat
const isFinished = event => {
  if (event.comingSoon) return false;

  const lastDay = event.endDateISO || event.dateISO;
  if (lastDay) return lastDay < todayJakarta();

  return event.past === true;
};

/* ---------- Membuat kartu event otomatis ---------- */

function renderUpcomingEvents() {
  if (!eventGallery) return;

  const expanded = document.getElementById("event-expanded");

  // Hapus kartu sebelumnya, bukan detail event
  eventGallery.querySelectorAll(".event-tile")
    .forEach(card => card.remove());

  const upcoming = EVENTS.filter(event =>
    !isFinished(event)
  );

  upcoming.forEach((event, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      `photo event-tile g${(index % 5) + 1}`;

    button.dataset.event = event.id;

    if (!event.poster) {
      button.classList.add("event-tile--placeholder");
    } else {
      const img = document.createElement("img");

      img.className = "event-tile__image";
      img.src = event.poster;
      img.alt = `Poster ${event.title}`;
      img.loading = "lazy";

      button.appendChild(img);
    }

    const label = document.createElement("span");
    label.className = "event-tile__label";

    const small = document.createElement("small");
    small.textContent = event.status;

    const title = document.createTextNode(event.title);

    label.appendChild(small);
    label.appendChild(title);

    button.appendChild(label);

    // Kartu diletakkan sebelum detail event
    eventGallery.insertBefore(button, expanded);
  });
}


/* ---------- Detail event ---------- */

if (eventGallery) {
  const expanded = document.getElementById("event-expanded");
  const video = document.getElementById("event-video");
  const poster = document.getElementById("event-poster");
  const registerButton = document.getElementById("event-register");

  let lastClicked = null;
  let isClosing = false;

  function openEvent(button) {
    if (isClosing) return;

    const data = getEvent(button.dataset.event);
    if (!data) return;

    lastClicked = button;

    document.getElementById("event-status").textContent =
      data.status || "";

    document.getElementById("event-detail-title").textContent =
      data.title;

    document.getElementById("event-meta").textContent =
      `${data.date || ""} • ${data.location || "Kammari Cafe"}`;

    document.getElementById("event-description").textContent =
      data.description || "";

    poster.style.backgroundImage = data.poster
      ? `url("${data.poster}")`
      : "linear-gradient(135deg, #f4d3ac, #c98f5c)";

    video.pause();
    video.classList.remove("is-ready");

    if (data.video) {
      video.src = data.video;
      video.load();
      video.play().catch(() => {});
    } else {
      video.removeAttribute("src");
      video.load();
    }

    registerButton.hidden =
      isFinished(data) || data.comingSoon;

    if (!registerButton.hidden) {
      const message =
        `Halo Kammari, saya ingin mengetahui informasi ` +
        `dan pendaftaran event ${data.title}.`;

      registerButton.href =
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    }

    expanded.hidden = false;
    eventGallery.classList.add("event-is-open");

    expanded.animate(
      [
        { opacity: 0, transform: "scale(0.94)" },
        { opacity: 1, transform: "scale(1)" }
      ],
      {
        duration: 650,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );

    expanded.focus({ preventScroll: true });
  }

  function closeEvent() {
    if (expanded.hidden || isClosing) return;

    isClosing = true;

    expanded.getAnimations().forEach(animation =>
      animation.cancel()
    );

    const animation = expanded.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.94)" }
      ],
      {
        duration: 550,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    );

    animation.onfinish = () => {
      expanded.hidden = true;
      eventGallery.classList.remove("event-is-open");

      video.pause();
      video.removeAttribute("src");
      video.load();
      video.classList.remove("is-ready");

      isClosing = false;

      lastClicked?.focus({ preventScroll: true });
    };
  }

  video.addEventListener("loadeddata", () =>
    video.classList.add("is-ready")
  );

  video.addEventListener("error", () =>
    video.classList.remove("is-ready")
  );

  eventGallery.addEventListener("click", event => {
    const button = event.target.closest(".event-tile");

    if (!button || !expanded.hidden) return;

    event.stopPropagation();
    openEvent(button);
  });

  document.addEventListener("click", event => {
    if (expanded.hidden) return;
    if (registerButton.contains(event.target)) return;

    closeEvent();
  });
}


/* ---------- Galeri event yang sudah terlaksana ---------- */

function renderPastEvents() {
  if (!pastGallery) return;

  const viewer = document.getElementById("past-event-viewer");
  const viewerImage = document.getElementById("past-event-viewer-image");

  if (!viewer || !viewerImage) return;

  pastGallery.innerHTML = "";

  const pastEvents = EVENTS.filter(isFinished);

  pastEvents.forEach(event => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "past-event-card";
    button.setAttribute(
      "aria-label",
      `Lihat poster ${event.title}`
    );

    if (event.poster) {
      const img = document.createElement("img");

      img.src = event.poster;
      img.alt = `Poster ${event.title}`;
      img.loading = "lazy";

      button.appendChild(img);
    } else {
      button.classList.add("past-event-card--empty");

      button.innerHTML = `
        <span class="past-event-card__label">
          <small>DOKUMENTASI MENYUSUL</small>
          ${event.title}
        </span>
      `;
    }

    button.addEventListener("click", () => {
      if (event.poster) {
        viewer.classList.remove("is-placeholder");
        viewerImage.style.display = "block";
        viewerImage.src = event.poster;
        viewerImage.alt = `Poster ${event.title}`;
      } else {
        viewer.classList.add("is-placeholder");
        viewerImage.removeAttribute("src");
        viewerImage.style.display = "none";
      }

      viewer.showModal();
    });

    pastGallery.appendChild(button);
  });

  // Tutup viewer saat area luar poster diklik
  viewer.addEventListener("click", () => {
    if (viewer.classList.contains("is-closing")) return;

    viewer.classList.add("is-closing");

    viewer.addEventListener("animationend", () => {
      viewer.close();
      viewer.classList.remove("is-closing");
    }, { once: true });
  });
}


/* ---------- Popup event terdekat ---------- */

function todayJakarta() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  return parts;
}

function showNearestEventPopup() {
  if (document.body.dataset.page !== "home") return;

  const next = EVENTS
    .filter(event =>
      !isFinished(event) &&
      !event.comingSoon &&
      /^\d{4}-\d{2}-\d{2}$/.test(event.dateISO || "") &&
      event.dateISO >= todayJakarta() &&
      document.querySelector(
        `#event-gallery .event-tile[data-event="${event.id}"]`
      )
    )
    .sort((a, b) =>
      a.dateISO.localeCompare(b.dateISO)
    )[0];

  if (!next) return;

  const dialog = document.createElement("dialog");
  dialog.className = "next-event-popup";

  dialog.innerHTML = `
    <div class="next-event-popup__layout">
      <div class="next-event-popup__photo">
        <img alt="">
      </div>

      <div class="next-event-popup__content">
        <span class="next-event-popup__label">EVENT TERDEKAT</span>
        <h2></h2>
        <p class="next-event-popup__meta"></p>
        <p class="next-event-popup__desc"></p>

        <div class="next-event-popup__actions">
          <button type="button" class="next-event-popup__detail">
            Lihat Detail Event
          </button>
        </div>
      </div>
    </div>
  `;

  dialog.querySelector("h2").textContent = next.title;

  dialog.querySelector(".next-event-popup__meta").textContent =
    `${next.date} • ${next.location}`;

  dialog.querySelector(".next-event-popup__desc").textContent =
    next.description || "";

  const image = dialog.querySelector("img");

  if (next.poster) {
    image.src = next.poster;
    image.alt = `Poster ${next.title}`;
  } else {
    image.remove();
  }

  dialog.querySelector(".next-event-popup__detail")
    .addEventListener("click", () => {
      dialog.close();

      document.getElementById("event")
        ?.scrollIntoView({ behavior: "smooth" });

      document.querySelector(
        `#event-gallery .event-tile[data-event="${next.id}"]`
      )?.click();
    });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => dialog.remove());

  document.body.appendChild(dialog);
  dialog.showModal();
}


/* ---------- Jalankan sistem event ---------- */

renderUpcomingEvents();
renderPastEvents();

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    showNearestEventPopup,
    { once: true }
  );
} else {
  showNearestEventPopup();
}

