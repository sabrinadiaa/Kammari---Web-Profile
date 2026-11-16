/* Kammari Café — beranda.js
   Diekstrak dari script.js tanpa mengubah logika fitur. */


/* ---------- HERO: Animasi pergantian font Kammari ---------- */

(function heroFontAnimation() {
  const heroWord = document.getElementById("hero-word");

  if (!heroWord) return;

  // Font yang sudah digunakan atau tersedia di project
  const fonts = [
    '"Playpen Sans Hebrew", cursive',
    '"Belgiano Serif", Georgia, serif',
    '"Autery", cursive',
    'Georgia, serif'
  ];

  let currentFont = 0;

  const CHANGE_INTERVAL = 2500;
  const FADE_DURATION = 250;

  setInterval(() => {
    heroWord.classList.add("is-font-changing");

    setTimeout(() => {
      currentFont = (currentFont + 1) % fonts.length;

      heroWord.style.fontFamily = fonts[currentFont];

      heroWord.classList.remove("is-font-changing");
    }, FADE_DURATION);

  }, CHANGE_INTERVAL);
})();

/* ---------- HERO: Background Slideshow (Slide ke kanan) ---------- */

(function heroSlideshow() {
  const firstBg = document.querySelector(".scene__bg");
  if (!firstBg) return;

  const scene = firstBg.parentElement;

  const backgrounds = [
    "../assets/fasilitas/gresik/ruang-utama-pajangan-seni.jpeg",
    "../assets/fasilitas/gresik/kursi-outdoor-dinding-vintage.jpeg",
    "../assets/fasilitas/gresik/area-bar-peracikan.jpg",
    "../assets/fasilitas/gresik/rak-buku-area-duduk.jpeg",
    "../assets/fasilitas/gresik/papan-identitas-fasad.jpg"
  ];

  const INTERVAL = 3000;
  const SLIDE_TIME = 1000;
  const EASE = "cubic-bezier(.65, 0, .35, 1)";

  // Preload seluruh gambar
  backgrounds.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let currentIndex = 0;
  let current = firstBg;

  // Pastikan foto awal sesuai dengan daftar slideshow
  current.style.setProperty(
    "--src",
    `url("${backgrounds[0]}")`
  );

  function slideNext() {
    currentIndex = (currentIndex + 1) % backgrounds.length;

    const next = document.createElement("div");
    next.className = "scene__bg";

    next.style.setProperty(
      "--src",
      `url("${backgrounds[currentIndex]}")`
    );

    next.style.transition = "none";
    next.style.transform = "translateX(100%) scale(1.06)";

    scene.insertBefore(next, current.nextSibling);

    // Memastikan posisi awal terbaca browser
    next.getBoundingClientRect();

    const transition = `transform ${SLIDE_TIME}ms ${EASE}`;

    next.style.transition = transition;
    current.style.transition = transition;

    // Animasi foto baru masuk dari kanan
    next.style.transform = "translateX(0) scale(1.06)";
    current.style.transform = "translateX(-100%) scale(1.06)";

    const old = current;
    current = next;

    setTimeout(() => {
      old.remove();
      next.style.transition = "";
    }, SLIDE_TIME);
  }

  setInterval(slideNext, INTERVAL);
})();


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

/* ==========================================================
   MUSIK LATAR KAMMARI (dipakai di SEMUA halaman)
   ========================================================== */

// Daftar lagu (alamat relatif terhadap file HTML)
const MUSIC_TRACKS = [
  "assets/audio/lagu-1.mp3",
  "assets/audio/lagu-2.mp3",
  "assets/audio/lagu-3.mp3",
  "assets/audio/lagu-4.mp3",
  "assets/audio/lagu-5.mp3",
  "assets/audio/lagu-6.mp3"
];
const MUSIC_VOLUME = 0.3;      // 0 (sunyi) sampai 1 (penuh)
const MUSIC_AUTOSTART = true;  // coba putar otomatis saat pertama kali membuka website
const MUSIC_SHUFFLE = false;   // true = urutan lagu diacak (tetap sama selama pengunjung di website)

const STATE_KEY = "kammari-music-state"; // posisi lagu selama kunjungan (sessionStorage)
const CHOICE_KEY = "kammari-music";      // pilihan pengunjung: "off" jika pernah dimatikan (localStorage)

/* ---------- Tombol musik ---------- */
// Di Beranda sudah ada badge #music-toggle. Di halaman lain tombol kecil dibuat otomatis.
let musicToggle = document.getElementById("music-toggle");
if (!musicToggle) {
  musicToggle = document.createElement("button");
  musicToggle.id = "music-toggle";
  musicToggle.type = "button";
  musicToggle.className = "music-fab";
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.setAttribute("aria-label", "Putar musik");
  musicToggle.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>';
  document.body.appendChild(musicToggle);
}

/* ---------- Penyimpanan ---------- */
function readState() {
  try { return JSON.parse(sessionStorage.getItem(STATE_KEY)); } catch (e) { return null; }
}
function writeState(data) {
  try { sessionStorage.setItem(STATE_KEY, JSON.stringify(data)); } catch (e) {}
}
function musicWasTurnedOff() {
  try { return localStorage.getItem(CHOICE_KEY) === "off"; } catch (e) { return false; }
}
function saveMusicChoice(on) {
  try { localStorage.setItem(CHOICE_KEY, on ? "on" : "off"); } catch (e) {}
}

/* ---------- Susunan lagu ---------- */
const saved = readState();
let playlist;
if (saved && Array.isArray(saved.order) && saved.order.length === MUSIC_TRACKS.length &&
    saved.order.every(t => MUSIC_TRACKS.includes(t))) {
  playlist = saved.order;               // lanjutkan urutan yang sama dari halaman sebelumnya
} else {
  playlist = [...MUSIC_TRACKS];
  if (MUSIC_SHUFFLE) {
    for (let i = playlist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }
  }
}

let trackIndex = saved && saved.i < playlist.length ? saved.i : 0;
let failedInARow = 0;
let leaving = false; // true saat halaman sedang ditinggalkan

const bgMusic = new Audio(playlist[trackIndex]);
bgMusic.volume = MUSIC_VOLUME;
bgMusic.preload = "auto";
bgMusic.loop = playlist.length === 1;

// Lanjutkan dari detik terakhir halaman sebelumnya
if (saved && saved.t > 0) {
  const gap = Math.min((Date.now() - saved.at) / 1000, 5); // waktu yang terpakai saat pindah halaman
  const resumeAt = saved.t + (saved.playing ? gap : 0);
  bgMusic.addEventListener("loadedmetadata", () => {
    try { bgMusic.currentTime = resumeAt; } catch (e) {}
  }, { once: true });
}

function saveState() {
  if (leaving && bgMusic.ended) return;
  writeState({
    order: playlist,
    i: trackIndex,
    t: bgMusic.currentTime || 0,
    playing: !bgMusic.paused && !bgMusic.ended,
    at: Date.now(),
  });
}

/* ---------- Pemutaran ---------- */
function playNextTrack() {
  trackIndex = (trackIndex + 1) % playlist.length;
  bgMusic.src = playlist[trackIndex];
  bgMusic.play().catch(() => {});
}
bgMusic.addEventListener("ended", playNextTrack);

// Lagu yang gagal dimuat dilewati. Berhenti kalau semua lagu bermasalah.
bgMusic.addEventListener("error", () => {
  console.warn("Lagu tidak ditemukan atau tidak bisa diputar: " + playlist[trackIndex]);
  failedInARow++;
  if (failedInARow < playlist.length) playNextTrack();
});
bgMusic.addEventListener("playing", () => { failedInARow = 0; });

// Tampilan tombol (ikon berdenyut saat musik jalan)
function updateMusicStatus(playing) {
  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute("aria-pressed", String(playing));
  musicToggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
}
bgMusic.addEventListener("play", () => { updateMusicStatus(true); saveState(); });
bgMusic.addEventListener("pause", () => {
  if (leaving || bgMusic.ended) return; // jeda otomatis saat pindah halaman / akhir lagu: abaikan
  updateMusicStatus(false);
  saveState();
});

// Simpan posisi terus-menerus supaya halaman berikutnya bisa melanjutkan
bgMusic.addEventListener("timeupdate", saveState);
window.addEventListener("pagehide", () => { saveState(); leaving = true; });

// Klik tombol: putar atau jeda
musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => saveMusicChoice(true)).catch(() => {});
  } else {
    bgMusic.pause();
    saveMusicChoice(false);
  }
});

/* ---------- Mulai otomatis ---------- */
// Halaman pertama: ikuti MUSIC_AUTOSTART. Halaman berikutnya: lanjutkan jika tadi sedang menyala.
const shouldStart = saved ? saved.playing : (MUSIC_AUTOSTART && !musicWasTurnedOff());

if (shouldStart) {
  bgMusic.play().catch(() => {
    // Browser memblokir putar otomatis: mulai saat pengunjung pertama kali mengklik/menyentuh halaman
    const events = ["click", "keydown", "touchend"];
    function startOnFirstTouch(e) {
      events.forEach(ev => document.removeEventListener(ev, startOnFirstTouch));
      if (musicToggle.contains(e.target)) return; // biarkan tombol musik yang mengatur
      bgMusic.play().catch(() => {});
    }
    events.forEach(ev => document.addEventListener(ev, startOnFirstTouch));
  });
}