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

    // Ambil menu dari API menu.php
    const items = Array.isArray(data.items) ? data.items : [];


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
  const wrapper =
    featured.closest(".featured-carousel-wrap");

  // Hapus navigasi lama jika ada
  document.querySelectorAll(".featured-carousel-nav")
    .forEach(el => el.remove());

  // Tombol panah carousel
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

  (wrapper || featured.parentElement).appendChild(nav);

  const prevBtn = nav.querySelector(".carousel-prev");
  const nextBtn = nav.querySelector(".carousel-next");

  const FAVORITES = [
    "Milo Malaysia Ashoy",
    "Thai Basil Chicken",
    "Mee Nyedas Kami",
    "Kentang Goreng Masala",
    "Teh Jasmine"
  ];

  function updateArrows() {
    const maxScroll =
      featured.scrollWidth - featured.clientWidth;

    prevBtn.hidden = featured.scrollLeft <= 2;
    nextBtn.hidden =
      maxScroll <= 2 ||
      featured.scrollLeft >= maxScroll - 2;
  }

  // Tampilkan menu rekomendasi tanpa filter kategori
  function draw() {
    const list = [
      ...FAVORITES
        .map(name =>
          MENU.find(item =>
            item.name.toLowerCase() === name.toLowerCase()
          )
        )
        .filter(Boolean),

      ...MENU.filter(item =>
        !FAVORITES.some(name =>
          name.toLowerCase() === item.name.toLowerCase()
        )
      )
    ].slice(0, 5);

    featured.innerHTML = list.length
      ? list.map(item => dishCard(item, false)).join("")
      : `<p class="empty">Belum ada menu tersedia.</p>`;

    featured.scrollLeft = 0;
    requestAnimationFrame(updateArrows);
  }

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

  document.addEventListener(
    "kammari-menu-loaded",
    ({ detail }) => {
      if (detail.branch !== "gresik") return;
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


let EVENTS = [];

/* ---------- Pengaturan dasar ---------- */

const eventGallery = document.getElementById("event-gallery");
const pastGallery = document.getElementById("past-event-gallery");

const getEvent = id =>
  EVENTS.find(event => event.id === id);

// Selesai otomatis jika hari terakhir event sudah lewat
const isFinished = event => {
  if (event.past === true) return true;
  if (event.comingSoon) return false;

  const lastDay = event.endDateISO || event.dateISO;
  return Boolean(lastDay && lastDay < todayJakarta());
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
      video.play().catch(() => { });
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

async function loadEventsFromDatabase() {
  if (!eventGallery && !pastGallery) return;

  try {
    const response = await fetch(
      "../BACKEND/api/events.php",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.events)) {
      throw new Error("Format data event tidak valid");
    }

    // Format tanggal Indonesia
    function formatTanggal(dateISO) {
      if (!dateISO) return "Jadwal belum diumumkan";

      return new Date(
        `${dateISO}T12:00:00Z`
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      });
    }

    const statusLabel = {
      upcoming: "EVENT MENDATANG",
      ongoing: "BERLANGSUNG",
      completed: "SELESAI"
    };

    // Ambil data event dari MySQL
    EVENTS = data.events.map(item => {
      const startDate = item.start_at
        ? item.start_at.slice(0, 10)
        : "";

      const endDate = item.end_at
        ? item.end_at.slice(0, 10)
        : "";

      const startTime = item.start_at
        ? item.start_at.slice(11, 16)
        : "";

      return {
        id: String(item.id),
        title: item.title,
        slug: item.slug,

        status: statusLabel[item.status] || item.status,

        past: item.status === "completed",

        comingSoon:
          item.status === "upcoming" && !startDate,

        date: startDate
          ? formatTanggal(startDate) +
          (startTime ? `, ${startTime} WIB` : "")
          : "Jadwal belum diumumkan",

        dateISO: startDate,
        endDateISO: endDate || startDate,

        location:
          item.branch_name || "Kammari Cafe",

        description: item.description || "",

        poster: item.poster || "",

        // Video langsung dari database
        video: item.video || "",

        registrationUrl: item.registration_url || ""
      };
    });

    console.log(
      "Event berhasil dimuat dari database:",
      EVENTS.length
    );

    renderUpcomingEvents();
    renderPastEvents();
    showNearestEventPopup();

  } catch (error) {
    console.error("Gagal memuat event:", error);

    if (eventGallery) {
      const pesan = document.createElement("p");
      pesan.className = "empty";
      pesan.textContent =
        "Gagal memuat event dari database.";

      const expanded =
        document.getElementById("event-expanded");

      eventGallery.insertBefore(pesan, expanded);
    }

    if (pastGallery) {
      pastGallery.innerHTML =
        '<p class="empty">Gagal memuat event terlaksana.</p>';
    }
  }
}

// Jalankan setelah halaman siap
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    loadEventsFromDatabase,
    { once: true }
  );
} else {
  loadEventsFromDatabase();
}

/* ---------- Pita lengkung: tulisan "kammari" berjalan ---------- */
(function archMarquee() {
  const tp = document.getElementById("arch-tp");
  const probe = document.getElementById("arch-probe");
  if (!tp || !probe) return;

  const UNIT = "kammari •\u00A0";   // satu kata + 1 spasi: makin sedikit spasi, makin rapat
  const SPEED = 0.04;             // px per milidetik (0.04 = 40 px/detik)
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let unitW = 0, pos = 0, last = 0;

  function build() {
    probe.textContent = UNIT;
    unitW = probe.getComputedTextLength();
    if (!unitW) return;
    tp.textContent = UNIT.repeat(Math.ceil(2300 / unitW) + 2);
  }

  function tick(t) {
    if (!last) last = t;
    pos = (pos + (t - last) * SPEED) % unitW;
    last = t;
    tp.setAttribute("startOffset", -pos);
    requestAnimationFrame(tick);
  }

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    build();
    if (unitW && !reduce) requestAnimationFrame(tick);
  });
})();



/* ---------- SPOTIFY PLAYER KAMMARI ---------- */

const musicToggle = document.getElementById("music-toggle");
const spotifyPanel = document.getElementById("spotify-panel");
const spotifyEmbed = document.getElementById("spotify-embed");
const spotifyClose = document.getElementById("spotify-close");

const PLAYLIST_URI =
  "spotify:playlist:2XGX0bicft4fkI7nTD8Ze7";

let spotifyController = null;
let isPlaying = false;
let userRequestedPlay = false;

// Buka atau tutup panel
function setSpotifyPanel(open) {
  if (!spotifyPanel) return;

  spotifyPanel.classList.toggle("is-open", open);
  spotifyPanel.setAttribute("aria-hidden", String(!open));
}

// Update status badge
function updateMusicStatus(playing) {
  isPlaying = playing;

  if (musicToggle) {
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
  }
}

// Menunggu Spotify API siap
window.onSpotifyIframeApiReady = (IFrameAPI) => {

  if (!spotifyEmbed) return;

  IFrameAPI.createController(
    spotifyEmbed,
    {
      uri: PLAYLIST_URI,
      width: "100%",
      height: "352"
    },
    (controller) => {

      spotifyController = controller;

      // Memantau status pemutaran
      controller.addListener("playback_update", (event) => {
        updateMusicStatus(!event.data.isPaused);
      });

      // Ketika Spotify siap
      controller.addListener("ready", () => {

        if (userRequestedPlay) {
          controller.play();
          userRequestedPlay = false;
        } else {
          // Mencoba autoplay ketika website dibuka.
          // Browser mungkin tetap memblokirnya.
          controller.play();
        }

      });

    }
  );
};

// Memuat Spotify iFrame API
const spotifyScript = document.createElement("script");

spotifyScript.src =
  "https://open.spotify.com/embed/iframe-api/v1";

spotifyScript.async = true;

document.head.appendChild(spotifyScript);

// Klik badge musik
if (musicToggle) {

  musicToggle.addEventListener("click", () => {

    const panelIsOpen =
      spotifyPanel.classList.contains("is-open");

    setSpotifyPanel(true);

    if (!spotifyController) {
      userRequestedPlay = true;
      return;
    }

    // Jika player sedang bermain dan panel baru dibuka,
    // cukup tampilkan player tanpa menghentikan lagu.
    if (!panelIsOpen && isPlaying) {
      return;
    }

    if (isPlaying) {
      spotifyController.pause();
    } else {
      spotifyController.play();
    }

  });

}

// Klik tombol X
if (spotifyClose) {

  spotifyClose.addEventListener("click", () => {

    // Musik ikut berhenti ketika player ditutup
    if (spotifyController) {
      spotifyController.pause();
    }

    updateMusicStatus(false);
    setSpotifyPanel(false);

  });

}


/* Tutup Spotify Player ketika klik di luar popup */

document.addEventListener("click", (event) => {

  if (!spotifyPanel || !musicToggle) return;

  const clickedInsidePopup =
    spotifyPanel.contains(event.target);

  const clickedMusicBadge =
    musicToggle.contains(event.target);

  // Tutup popup jika klik di luar popup dan badge
  if (!clickedInsidePopup && !clickedMusicBadge) {
    setSpotifyPanel(false);
  }

});


/* ==========================================
   HERO FASILITAS KAMMARI
   Tab Gresik/Surabaya + Carousel Database
========================================== */

(() => {

  const root = document.getElementById("ks-hero");

  // Tidak berjalan di halaman lain
  if (!root) return;

  const tabs = [...root.querySelectorAll("[data-ks-branch]")];

  const image = document.getElementById("ks-slide-image");
  const caption = document.getElementById("ks-slide-title");
  const counter = document.getElementById("ks-slide-count");
  const dots = document.getElementById("ks-dots");
  const features = document.getElementById("ks-features");
  const ambient = document.getElementById("ks-ambient");
  const prev = document.getElementById("ks-prev");
  const next = document.getElementById("ks-next");
  const photo = document.getElementById("ks-photo");

  const cache = {};

  let branch = "gresik";
  let slides = [];
  let index = 0;
  let requestId = 0;

  // Menggunakan path foto dari branch_facilities.image
  function imageUrl(value) {

    let path = String(value || "")
      .trim()
      .replace(/\\/g, "/");

    path = path
      .replace(/^\.\//, "")
      .replace(/^\//, "")
      .replace(/^FRONT-END\//i, "");

    if (
      !path.startsWith("assets/") ||
      path.split("/").includes("..")
    ) {
      return "";
    }

    try {
      return new URL(path, document.baseURI).href;
    } catch {
      return "";
    }

  }

  // Tampilkan foto carousel
  function renderSlide() {

    const current = slides[index];

    if (!current) {

      image.hidden = true;

      caption.textContent =
        "Belum ada foto untuk cabang ini";

      counter.textContent = "";

      ambient.style.backgroundImage = "none";

      dots.replaceChildren();

      prev.hidden = true;
      next.hidden = true;

      return;
    }

    image.hidden = false;
    image.src = current.url;
    image.alt = current.title;

    caption.textContent = current.title;

    counter.textContent =
      `${index + 1} / ${slides.length}`;

    // Foto yang sama menjadi background samar
    ambient.style.backgroundImage =
      `url("${current.url}")`;

    // Sembunyikan panah kalau hanya ada 1 foto
    prev.hidden = slides.length < 2;
    next.hidden = slides.length < 2;

    dots.replaceChildren();

    // Maksimal 7 indikator agar rapi
    const first = Math.max(
      0,
      Math.min(index - 3, slides.length - 7)
    );

    const last = Math.min(
      slides.length,
      first + 7
    );

    for (let i = first; i < last; i++) {

      const dot = document.createElement("button");

      dot.type = "button";
      dot.className =
        "ks-dot" + (i === index ? " is-active" : "");

      dot.setAttribute(
        "aria-label",
        `Lihat foto ${i + 1}`
      );

      dot.setAttribute(
        "aria-current",
        i === index ? "true" : "false"
      );

      dot.addEventListener("click", () => {
        index = i;
        renderSlide();
      });

      dots.appendChild(dot);
    }

  }

  // Tampilkan fasilitas sesuai cabang
  function renderFacilities(data) {

    features.replaceChildren();

    const items = (data.facilities || [])
      .filter(item => item.name)
      .slice(0, 6);

    if (!items.length) {

      const message = document.createElement("p");
      message.className = "ks-empty";

      message.textContent =
        "Fasilitas cabang belum tersedia.";

      features.appendChild(message);

      return;
    }

    const knownIcons = window.KAMMARI_ICON || {};

    items.forEach(item => {

      const block = document.createElement("div");
      block.className = "ks-feature";

      const symbol = document.createElement("span");
      symbol.className = "ks-feature__icon";

      const iconKey = String(item.icon || "").trim();

      // Memakai ikon dari script.js Kammari
      symbol.innerHTML =
        Object.prototype.hasOwnProperty.call(
          knownIcons,
          iconKey
        )
          ? knownIcons[iconKey]
          : (knownIcons.cup || "•");

      const content = document.createElement("div");

      const name = document.createElement("strong");
      name.textContent = item.name;

      content.appendChild(name);
      block.append(symbol, content);

      features.appendChild(block);

    });

  }

  // Pilih cabang dan ambil data dari API
  async function switchBranch(slug) {

    if (!["gresik", "surabaya"].includes(slug)) {
      return;
    }

    branch = slug;
    index = 0;

    const ownRequest = ++requestId;

    // Perbarui tampilan tab
    tabs.forEach(tab => {

      const selected =
        tab.dataset.ksBranch === slug;

      tab.classList.toggle("is-active", selected);

      tab.setAttribute(
        "aria-pressed",
        String(selected)
      );

    });

    caption.textContent =
      "Memuat foto " +
      (slug === "gresik" ? "Gresik" : "Surabaya") +
      "...";

    counter.textContent = "";
    features.replaceChildren();

    try {

      if (!cache[slug]) {

        const response = await fetch(
          `../BACKEND/api/facilities.php?branch=${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        // Mendukung API lama dan API yang memakai branches
        const data = result.branches
          ? result.branches[slug]
          : result;

        if (
          !data ||
          (
            !Array.isArray(data.facilities) &&
            !Array.isArray(data.gallery)
          )
        ) {
          throw new Error("Format API tidak sesuai");
        }

        cache[slug] = data;
      }

      // Hindari hasil fetch sebelumnya menimpa cabang baru
      if (ownRequest !== requestId) return;

      const data = cache[slug];

      const seen = new Set();

      // Prioritaskan gallery jika API menyediakannya.
      // Jika tidak, ambil image dari branch_facilities.
      const photos =
        Array.isArray(data.gallery) && data.gallery.length
          ? data.gallery
          : (data.facilities || []);

      slides = photos.flatMap(item => {

        const url = imageUrl(item.image);

        if (!url || seen.has(url)) {
          return [];
        }

        seen.add(url);

        return [{
          url,
          title:
            item.title ||
            item.name ||
            "Suasana Kammari"
        }];

      });
      slides = slides.slice(0, 5);
      renderSlide();
      renderFacilities(data);

    } catch (error) {

      if (ownRequest !== requestId) return;

      console.error(
        "Gagal memuat fasilitas Kammari:",
        error
      );

      slides = [];
      renderSlide();

      caption.textContent =
        "Gagal memuat foto. Periksa API dan database.";

      const message = document.createElement("p");
      message.className = "ks-empty";
      message.textContent =
        "Data fasilitas belum dapat dimuat.";

      features.appendChild(message);
    }

  }

  // Navigasi carousel
  function move(direction) {

    if (slides.length < 2) return;

    index =
      (index + direction + slides.length) %
      slides.length;

    renderSlide();
  }

  // Tab cabang
  tabs.forEach(tab => {

    tab.addEventListener("click", () => {
      switchBranch(tab.dataset.ksBranch);
    });

  });

  // Tombol panah
  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  // Swipe di HP
  let startX = null;

  photo.addEventListener(
    "touchstart",
    event => {
      startX =
        event.changedTouches[0]?.clientX ?? null;
    },
    { passive: true }
  );

  photo.addEventListener(
    "touchend",
    event => {

      if (startX === null) return;

      const endX =
        event.changedTouches[0]?.clientX ?? startX;

      if (Math.abs(endX - startX) > 45) {

        move(endX < startX ? 1 : -1);
      }

      startX = null;
    },
    { passive: true }
  );

  // Jalankan pertama kali
  switchBranch(branch);

})();

/* HERO FOTO FASILITAS KAMMARI */

(() => {
  const hero = document.getElementById("kf-hero");
  if (!hero) return;

  const layers = [
    ...hero.querySelectorAll(".kf-hero__image")
  ];

  const title = document.getElementById("kf-photo-name");
  const counter = document.getElementById("kf-photo-count");
  const dots = document.getElementById("kf-hero-dots");
  const prev = document.getElementById("kf-hero-prev");
  const next = document.getElementById("kf-hero-next");
  const status = document.getElementById("kf-photo-status");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let slides = [];
  let index = 0;
  let shownLayer = 1;
  let loadVersion = 0;
  let timer = null;

  // Mengubah path database menjadi URL foto
  function photoUrl(raw) {
    let path = String(raw || "")
      .trim()
      .replace(/\\/g, "/");

    path = path
      .replace(/^\.\//, "")
      .replace(/^\/?FRONT-END\//i, "")
      .replace(/^\//, "");

    if (
      !path.startsWith("assets/") ||
      path.split("/").includes("..")
    ) {
      return "";
    }

    try {
      return new URL(path, document.baseURI).href;
    } catch {
      return "";
    }
  }

  // Mengambil foto dari database per cabang
  async function getBranchPhotos(branch) {
    const response = await fetch(
      `../BACKEND/api/facilities.php?branch=${encodeURIComponent(branch)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(
        `API ${branch}: HTTP ${response.status}`
      );
    }

    const result = await response.json();

    // Mendukung format API lama maupun API branches
    const data = result.branches
      ? result.branches[branch]
      : result;

    const items =
      Array.isArray(data?.gallery) && data.gallery.length
        ? data.gallery
        : Array.isArray(data?.facilities)
          ? data.facilities
          : [];

    return items
      .map((item, order) => ({
        branch,
        title:
          item.title ||
          item.name ||
          `Suasana Kammari ${branch}`,

        url: photoUrl(item.image),

        // Prioritas jika fasilitas ditandai highlight
        highlight: item.type === "highlight",

        order
      }))
      .filter(item => item.url);
  }

  // Prioritaskan foto ikonik
  function iconicFirst(items) {
    const terms =
      /ruang utama|roastery|tampak depan|teras|area bar|area duduk|halaman|outdoor|taman/i;

    return [...items].sort((a, b) =>
      Number(b.highlight) - Number(a.highlight) ||
      Number(
        terms.test(b.title + " " + b.url)
      ) -
      Number(
        terms.test(a.title + " " + a.url)
      ) ||
      a.order - b.order
    );
  }

  // Membuat indikator titik
  function showDots() {
    dots.replaceChildren();

    slides.forEach((item, i) => {
      const dot = document.createElement("button");

      dot.type = "button";

      dot.className =
        "kf-hero__dot" +
        (i === index ? " is-active" : "");

      dot.setAttribute(
        "aria-label",
        `Lihat foto ${i + 1}`
      );

      dot.setAttribute(
        "aria-current",
        String(i === index)
      );

      dot.addEventListener("click", () => {
        index = i;
        showSlide();
        restart();
      });

      dots.appendChild(dot);
    });
  }

  // Menampilkan foto dengan transisi fade
  function showSlide() {
    const item = slides[index];

    if (!item) {
      title.textContent = "Belum ada foto fasilitas";
      counter.textContent = "";

      status.textContent =
        "Foto belum tersedia di database.";

      prev.hidden = true;
      next.hidden = true;

      dots.replaceChildren();
      return;
    }

    const branchName =
      item.branch === "gresik" ? "Gresik" : "Surabaya";

    title.textContent =
      `${branchName} / ${item.title}`;

    counter.textContent =
      `${String(index + 1).padStart(2, "0")} / ` +
      `${String(slides.length).padStart(2, "0")}`;

    status.textContent = "";

    prev.hidden = slides.length < 2;
    next.hidden = slides.length < 2;

    showDots();

    // Dua layer agar foto bisa berganti halus
    const version = ++loadVersion;
    const targetIndex = 1 - shownLayer;
    const target = layers[targetIndex];

    target.classList.remove("is-active");
    target.hidden = true;

    target.onload = () => {
      if (version !== loadVersion) return;

      target.hidden = false;

      requestAnimationFrame(() => {
        if (version !== loadVersion) return;

        target.classList.add("is-active");

        layers[shownLayer].classList.remove(
          "is-active"
        );

        shownLayer = targetIndex;
      });
    };

    // Lewati jika file foto tidak ditemukan
    target.onerror = () => {
      if (version !== loadVersion) return;

      slides.splice(index, 1);

      index = slides.length
        ? index % slides.length
        : 0;

      showSlide();
    };

    target.src = item.url;
  }

  function move(direction) {
    if (slides.length < 2) return;

    index =
      (index + direction + slides.length) %
      slides.length;

    showSlide();
  }

  // Berganti otomatis setiap 6,5 detik
  function pause() {
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    pause();

    if (
      !reducedMotion &&
      slides.length > 1 &&
      !document.hidden
    ) {
      timer = setInterval(() => move(1), 6500);
    }
  }

  prev.addEventListener("click", () => {
    move(-1);
    restart();
  });

  next.addEventListener("click", () => {
    move(1);
    restart();
  });

  // Berhenti saat kursor berada di hero
  hero.addEventListener("mouseenter", pause);
  hero.addEventListener("mouseleave", restart);

  hero.addEventListener("focusin", pause);

  hero.addEventListener("focusout", event => {
    if (!hero.contains(event.relatedTarget)) {
      restart();
    }
  });

  document.addEventListener(
    "visibilitychange",
    () => document.hidden ? pause() : restart()
  );

  // Keyboard
  hero.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      move(-1);
      restart();
    }

    if (event.key === "ArrowRight") {
      move(1);
      restart();
    }
  });

  // Swipe di HP
  let touchStart = null;

  hero.addEventListener(
    "touchstart",
    event => {
      touchStart =
        event.changedTouches[0]?.clientX ?? null;
    },
    { passive: true }
  );

  hero.addEventListener(
    "touchend",
    event => {
      if (touchStart === null) return;

      const dx =
        (event.changedTouches[0]?.clientX ??
          touchStart) - touchStart;

      if (Math.abs(dx) > 50) {
        move(dx < 0 ? 1 : -1);
        restart();
      }

      touchStart = null;
    },
    { passive: true }
  );

  // Muat kedua cabang dari database
  Promise.allSettled([
    getBranchPhotos("gresik"),
    getBranchPhotos("surabaya")
  ])
    .then(results => {
      const gresik = iconicFirst(
        results[0].status === "fulfilled"
          ? results[0].value
          : []
      );

      const surabaya = iconicFirst(
        results[1].status === "fulfilled"
          ? results[1].value
          : []
      );

      const seen = new Set();

      function take(items, count) {
        for (const item of items) {
          if (
            count <= 0 ||
            slides.length >= 5
          ) break;

          if (seen.has(item.url)) continue;

          slides.push(item);
          seen.add(item.url);
          count--;
        }
      }

      // Prioritas kedua cabang, maksimal 5 foto
      take(gresik, 1);
      take(surabaya, 1);
      take(gresik, 2);
      take(surabaya, 1);

      // Isi sisa slot jika salah satu cabang
      // memiliki foto lebih sedikit
      take([...gresik, ...surabaya], 5);

      showSlide();
      restart();
    })
    .catch(error => {
      console.error(
        "Hero Fasilitas Kammari:",
        error
      );

      showSlide();
    });

})();
/* =====================================
   FASILITAS HERO CAROUSEL
===================================== */
async function loadFacilityHeroCarousel(branch = "gresik") {
  const suffix = branch === "surabaya" ? "-surabaya" : "";

  const stage = document.getElementById(`facility-stage${suffix}`);
  const caption = document.getElementById(`facility-caption${suffix}`);
  const dotsWrap = document.getElementById(`facility-dots${suffix}`);
  const prevBtn = document.getElementById(`facility-prev${suffix}`);
  const nextBtn = document.getElementById(`facility-next${suffix}`);

  if (!stage || !caption || !dotsWrap || !prevBtn || !nextBtn) {
    return;
  }

  // Hentikan timer lama jika carousel dimuat ulang
  clearInterval(stage._facilityTimer);

  stage.innerHTML = `<p class="facility-carousel__loading">Memuat foto ${branch}...</p>`;
  caption.innerHTML = "";
  dotsWrap.innerHTML = "";

  try {
    const response = await fetch(`../BACKEND/api/facilities.php?branch=${encodeURIComponent(branch)}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const semuaFoto = getKammariPhotoPool(data, branch);

    const fotoHighlight = semuaFoto.filter(
      item => item.type === "highlight"
    );

    const items = branch === "surabaya"
      ? (fotoHighlight.length
        ? fotoHighlight.slice(0, 4)
        : semuaFoto.slice(0, 4))
      : semuaFoto.slice(0, 5);

    if (!items.length) {
      stage.innerHTML = `<p class="facility-carousel__loading">Foto fasilitas belum tersedia.</p>`;
      return;
    }

    let current = 0;

    const getImageUrl = (value) => {
      let path = String(value || "")
        .trim()
        .replace(/\\/g, "/")
        .replace(/^\.\//, "")
        .replace(/^\/?FRONT-END\//i, "")
        .replace(/^\/+/, "");

      if (
        !path.startsWith("assets/") ||
        path.split("/").includes("..")
      ) {
        return "";
      }

      return new URL(path, document.baseURI).href;
    };

    stage.innerHTML = items.map((item, index) => `
      <article class="facility-slide" data-index="${index}">
        <img src="${getImageUrl(item.image)}" alt="${item.name}">
      </article>
    `).join("");

    dotsWrap.innerHTML = "";

    const slides = [...stage.querySelectorAll(".facility-slide")];

    function renderSlides() {
      slides.forEach((slide, index) => {
        slide.classList.remove("is-active", "is-prev", "is-next", "is-hidden");

        if (index === current) {
          slide.classList.add("is-active");
        } else if (index === (current - 1 + slides.length) % slides.length) {
          slide.classList.add("is-prev");
        } else if (index === (current + 1) % slides.length) {
          slide.classList.add("is-next");
        } else {
          slide.classList.add("is-hidden");
        }
      });


      // Tampilkan maksimal 7 titik indikator
      dotsWrap.innerHTML = "";

      const maxDots = 7;

      const start = Math.max(
        0,
        Math.min(
          current - Math.floor(maxDots / 2),
          Math.max(0, items.length - maxDots)
        )
      );

      const end = Math.min(items.length, start + maxDots);

      for (let i = start; i < end; i++) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.dataset.index = i;
        dot.className = i === current ? "is-active" : "";

        dot.setAttribute("aria-label", `Foto ${i + 1}`);
        dot.setAttribute(
          "aria-current",
          String(i === current)
        );

        dotsWrap.appendChild(dot);
      }


      const activeItem = items[current];
      caption.innerHTML = `
        <strong>${activeItem.name || "Fasilitas Kammari"}</strong>
        <span>${activeItem.description || ""}</span>
      `;
    }


    /* =====================================
       NAVIGASI + AUTOPLAY CAROUSEL
    ===================================== */

    // Hentikan timer lama agar tidak menumpuk
    function stopAutoSlide() {
      clearInterval(stage._facilityTimer);
    }

    // Mulai pergantian foto otomatis
    function startAutoSlide() {
      stopAutoSlide();

      if (slides.length < 2) return;

      stage._facilityTimer = setInterval(() => {
        if (document.hidden) return;

        current = (current + 1) % slides.length;
        renderSlides();
      }, 4500);
    }

    // Tombol kiri
    prevBtn.onclick = () => {
      current = (current - 1 + slides.length) % slides.length;
      renderSlides();
      startAutoSlide();
    };

    // Tombol kanan
    nextBtn.onclick = () => {
      current = (current + 1) % slides.length;
      renderSlides();
      startAutoSlide();
    };

    // Klik titik indikator
    dotsWrap.onclick = (event) => {
      const dot = event.target.closest("button[data-index]");

      if (!dot || !dotsWrap.contains(dot)) return;

      current = Number(dot.dataset.index);

      renderSlides();
      startAutoSlide();
    };


    /* ==========================================
       FIX SWIPE / DRAG CAROUSEL
       Agar tidak stuck saat digeser
    ========================================== */

    let startX = null;
    let startY = null;

    // Mencegah browser menyeret gambar secara langsung
    stage.ondragstart = (event) => {
      event.preventDefault();
    };

    // Saat mulai menyentuh / menggeser foto
    stage.onpointerdown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      startX = event.clientX;
      startY = event.clientY;

      if (stage.setPointerCapture) {
        stage.setPointerCapture(event.pointerId);
      }
    };

    // Saat selesai menggeser
    stage.onpointerup = (event) => {
      if (startX === null) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      startX = null;
      startY = null;

      // Hanya geser jika pergerakan horizontal cukup jauh
      if (
        Math.abs(deltaX) < 45 ||
        Math.abs(deltaX) <= Math.abs(deltaY)
      ) {
        return;
      }

      // Gunakan tombol yang sudah ada
      // agar autoplay ikut di-reset
      if (deltaX < 0) {
        nextBtn.click();
      } else {
        prevBtn.click();
      }
    };

    // Reset jika gesture dibatalkan
    stage.onpointercancel = () => {
      startX = null;
      startY = null;
    };


    // Jalankan carousel
    renderSlides();
    startAutoSlide();


  } catch (error) {
    console.error("Gagal memuat carousel fasilitas:", error);
    stage.innerHTML = `<p class="facility-carousel__loading">Gagal memuat foto.</p>`;
  }
}

if (document.body.dataset.page === "fasilitas") {
  loadFacilityHeroCarousel("gresik");
  loadFacilityHeroCarousel("surabaya");
}

/* ==========================================
   KAMMARI - EDITORIAL FACILITY GALLERY
   Mengambil foto dari branch_facilities
========================================== */

(() => {
  if (document.body.dataset.page !== "fasilitas") return;

  const galleries = document.querySelectorAll(
    "[data-kg-gallery]"
  );

  if (!galleries.length) return;

  // Sesuaikan path database dengan folder FRONT-END
  function getImageUrl(value) {
    let path = String(value || "")
      .trim()
      .replace(/\\/g, "/");

    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    path = path
      .replace(/^\.\//, "")
      .replace(/^\/?FRONT-END\//i, "")
      .replace(/^\/+/, "");

    if (
      !path.startsWith("assets/") ||
      path.split("/").includes("..")
    ) {
      return "";
    }

    return new URL(path, document.baseURI).href;
  }

  // Popup foto, dibuat otomatis
  const dialog = document.createElement("dialog");
  dialog.className = "kg-lightbox";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "kg-lightbox__close";
  closeButton.setAttribute("aria-label", "Tutup foto");
  closeButton.textContent = "×";

  const dialogImage = document.createElement("img");
  const dialogCaption = document.createElement("p");

  dialog.append(
    closeButton,
    dialogImage,
    dialogCaption
  );

  document.body.appendChild(dialog);

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  function openPhoto(photo) {
    dialogImage.src = photo.url;
    dialogImage.alt = photo.title;
    dialogCaption.textContent = photo.title;

    dialog.showModal();
  }

  function showMessage(container, message) {
    container.replaceChildren();

    const paragraph = document.createElement("p");
    paragraph.className = "kg-gallery__message";
    paragraph.textContent = message;

    container.appendChild(paragraph);
  }

  async function loadGallery(container) {
    const branch = container.dataset.kgGallery;

    try {
      const response = await fetch(
        `../BACKEND/api/facilities.php?branch=${encodeURIComponent(branch)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Mendukung format API lama dan baru




      const semuaFoto = getKammariPhotoPool(result, branch);

      // Khusus Surabaya, ambil foto bertipe facility
      const fotoSudutSurabaya = semuaFoto.filter(
        item => item.type === "facility"
      );

      // Gresik tetap menggunakan pembagian sebelumnya
      const pilihan = branch === "surabaya"
        ? fotoSudutSurabaya.slice(0, 4)
        : semuaFoto.slice(5, 9);

      const photos = pilihan
        .map(item => ({
          url: getImageUrl(item.image),
          title:
            item.title ||
            item.name ||
            `Suasana Kammari ${branch}`
        }))
        .filter(item => item.url);

      // Pastikan galeri muncul lagi
      const gallerySection = container.closest(".kg-gallery");

      if (gallerySection) {
        gallerySection.hidden = false;
      }

      if (!photos.length) {
        showMessage(
          container,
          "Foto Sudut-sudut Kammari Surabaya belum terbaca."
        );
        return;
      }

      container.replaceChildren();
      container.dataset.count = String(photos.length);

      photos.forEach(photo => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "kg-gallery__card";
        card.setAttribute(
          "aria-label",
          `Lihat foto ${photo.title}`
        );

        const img = document.createElement("img");
        img.src = photo.url;
        img.alt = photo.title;
        img.loading = "lazy";

        const caption = document.createElement("span");
        caption.className = "kg-gallery__caption";
        caption.textContent = photo.title;

        card.append(img, caption);
        container.appendChild(card);

        card.addEventListener("click", () => {
          openPhoto(photo);
        });

        // Hindari kartu kosong jika path gambar salah
        img.addEventListener("error", () => {
          card.remove();

          const remaining = container.querySelectorAll(
            ".kg-gallery__card"
          ).length;

          container.dataset.count = String(remaining);

          if (!remaining) {
            showMessage(
              container,
              "Foto tidak dapat ditampilkan. Periksa path gambar di database."
            );
          }
        }, { once: true });
      });

    } catch (error) {
      console.error(
        `Gagal memuat galeri ${branch}:`,
        error
      );

      showMessage(
        container,
        "Galeri belum dapat dimuat. Periksa koneksi database."
      );
    }
  }

  galleries.forEach(loadGallery);
})();

/* ========================================
   PEMBAGIAN FOTO FASILITAS KAMMARI
   Carousel dan galeri tidak menggunakan
   foto yang sama
======================================== */

function getKammariPhotoPool(result, branch) {
  const data = result.branches?.[branch] ?? result;

  const facilities = Array.isArray(data.facilities)
    ? data.facilities
    : [];

  const gallery = Array.isArray(data.gallery)
    ? data.gallery
    : [];

  const seen = new Set();

  return [...facilities, ...gallery].filter(item => {
    const path = String(item.image || "")
      .trim()
      .replace(/\\/g, "/")
      .replace(/^(\.\/)+/, "")
      .replace(/^\/?FRONT-END\//i, "")
      .replace(/^\/+/, "")
      .toLowerCase();

    if (!path || seen.has(path)) {
      return false;
    }

    seen.add(path);
    return true;
  });
}
