/* Kammari Café — beranda.js
   Diekstrak dari script.js tanpa mengubah logika fitur. */


/* ---------- HERO: Background otomatis berganti (slide ke kanan) ---------- */
(function heroSlideshow() {
  const firstBg = document.querySelector(".scene__bg");
  if (!firstBg) return;

  const scene = firstBg.parentElement;

  const backgrounds = [
    "../assets/fasilitas/gresik/ruang-utama-pajangan-seni.jpeg", // gambar awal di HTML
    "../assets/fasilitas/gresik/kursi-outdoor-dinding-vintage.jpeg",
    "../assets/fasilitas/gresik/area-bar-peracikan.jpg",
    "../assets/fasilitas/gresik/rak-buku-area-duduk.jpeg",
    "../assets/fasilitas/gresik/papan-identitas-fasad.jpg"
  ];

  const INTERVAL = 3000;   // jeda antar gambar
  const SLIDE_TIME = 1000; // durasi geser (ms)
  const EASE = "cubic-bezier(.65, 0, .35, 1)";

  // Preload supaya tidak kedip saat gambar baru muncul
  backgrounds.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let currentIndex = 0;
  let current = firstBg;

  function slideNext() {
    currentIndex = (currentIndex + 1) % backgrounds.length;

    // Layer baru, diletakkan di luar layar sebelah kanan
    const next = document.createElement("div");
    next.className = "scene__bg";
    next.style.setProperty("--src", `url("${backgrounds[currentIndex]}")`);
    next.style.transition = "none";
    next.style.transform = "translateX(100%) scale(1.06)";
    scene.insertBefore(next, current.nextSibling);

    // Paksa browser menghitung posisi awal sebelum animasi dimulai
    next.getBoundingClientRect();

    const transition = `transform ${SLIDE_TIME}ms ${EASE}`;
    next.style.transition = transition;
    current.style.transition = transition;

    // Layer baru masuk dari kanan, layer lama keluar ke kiri
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


// Memuat data menu pilihan setelah handler beranda siap.
loadBranchMenu("gresik");
