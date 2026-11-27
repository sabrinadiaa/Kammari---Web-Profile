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

  if (typeof MENU !== "undefined" && MENU.length > 0) {
    draw();
  } else if (typeof loadBranchMenu === "function") {
    loadBranchMenu("gresik");
  } else {
    console.error("Pemuat menu belum tersedia.");
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
const MUSIC_SHUFFLE = true;   // true = urutan lagu diacak (tetap sama selama pengunjung di website)

const STATE_KEY = "kammari-music-state"; // posisi lagu selama kunjungan (sessionStorage)
const CHOICE_KEY = "kammari-music";      // pilihan pengunjung: "off" jika pernah dimatikan (localStorage)

/* ---------- Tombol musik ---------- */
let musicToggle = document.getElementById("music-toggle");
if (!musicToggle) {
  musicToggle = document.createElement("button");
  musicToggle.id = "music-toggle";
  musicToggle.type = "button";
  musicToggle.className = "badge badge--float";
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.setAttribute("aria-label", "Putar atau jeda musik Kammari");
  musicToggle.innerHTML = `
    <svg viewBox="0 0 148 148" aria-hidden="true">
      <defs>
        <path id="circ" d="M74,74 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
      </defs>
      <text>
        <textPath href="#circ">Kopi Asli • Momen Manis • Aroma Rileks • Istimewa. •</textPath>
      </text>
    </svg>
    <span class="badge__icon" aria-hidden="true">
      <img src="assets/music.svg" alt="">
    </span>`;
  document.body.appendChild(musicToggle);
}

/* ---------- Penyimpanan ---------- */
function readState() {
  try { return JSON.parse(sessionStorage.getItem(STATE_KEY)); } catch (e) { return null; }
}
function writeState(data) {
  try { sessionStorage.setItem(STATE_KEY, JSON.stringify(data)); } catch (e) { }
}
function musicWasTurnedOff() {
  try { return localStorage.getItem(CHOICE_KEY) === "off"; } catch (e) { return false; }
}
function saveMusicChoice(on) {
  try { localStorage.setItem(CHOICE_KEY, on ? "on" : "off"); } catch (e) { }
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
    try { bgMusic.currentTime = resumeAt; } catch (e) { }
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
  bgMusic.play().catch(() => { });
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
    bgMusic.play().then(() => saveMusicChoice(true)).catch(() => { });
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
      bgMusic.play().catch(() => { });
    }
    events.forEach(ev => document.addEventListener(ev, startOnFirstTouch));
  });
}

/* JELAJAHI MAPS KAMMARI INTERAKSI */

(function initJelajahiKammari() {
  const root = document.getElementById("jk-explore");
  const cards = document.getElementById("jk-branches");

  if (!root || !cards) return;

  // Awalnya tidak ada peta yang ditampilkan
  cards.hidden = true;

  cards.querySelectorAll(".branch").forEach(card => {
    card.hidden = true;
  });

  const road = document.getElementById("jk-road");
  const runner = document.getElementById("jk-runner");
  const status = document.getElementById("jk-status");
  const gpsButton = document.getElementById("jk-nearest");
  const choices = [...root.querySelectorAll("[data-jk-choice]")];

  // DATA CABANG
  // Koordinat di bawah adalah titik CONTOH kawasan
  // untuk prototipe. Ganti dengan koordinat pin outlet
  // yang tepat dari Google Maps sebelum dipublikasikan.
  const CABANG = {
    gresik: {
      name: "Kammari Gresik",
      lat: -7.1558,
      lng: 112.6552,
      address: "Jl. Samanhudi No.17, Gresik, Indonesia",
      point: 0.02
    },
    surabaya: {
      name: "Kammari Surabaya",
      lat: -7.3188,
      lng: 112.7277,
      address: "Jl. Ketintang Baru II No.KAV 7, Surabaya, Indonesia",
      point: 0.98
    }
  };

  const length = road.getTotalLength();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let position = 0.5;
  let animationId = null;
  // Mengatur jeda animasi otomatis setelah outlet diklik
  let autoPauseUntil = 0;

  // Tempatkan mobil di atas jalan
  // Tempatkan runner di atas jalan

  let arahRunner = 1;

  function drawRunner(progress) {

    const panjangJalan = road.getTotalLength();
    const jarakUtama = progress * panjangJalan;

    // Tentukan arah gerakan
    if (progress > position + 0.00001) {
      arahRunner = 1;
    } else if (progress < position - 0.00001) {
      arahRunner = -1;
    }

    // Jarak antar karakter dalam satuan SVG
    // Urutan: pengejar 1, 2, 3, pembawa kopi
    const jarakPengejar = [185, 145, 100, 0];

    // Hapus transform rombongan lama,
    // karena sekarang setiap orang mengikuti jalan sendiri
    runner.removeAttribute("transform");

    const rombongan = runner.querySelector(".jk-chase-pack");

    if (rombongan) {
      rombongan.removeAttribute("transform");
    }

    const orangOrang = runner.querySelectorAll(".jk-chaser");

    orangOrang.forEach((orang, index) => {

      const jarakBelakang = jarakPengejar[index] ?? 0;

      // Pengejar selalu berada di belakang pembawa kopi
      const jarakOrang = Math.max(
        0,
        Math.min(
          panjangJalan,
          jarakUtama - arahRunner * jarakBelakang
        )
      );

      // Titik posisi masing-masing orang di jalan
      const titik = road.getPointAtLength(jarakOrang);

      const titikSebelum = road.getPointAtLength(
        Math.max(0, jarakOrang - 2)
      );

      const titikSesudah = road.getPointAtLength(
        Math.min(panjangJalan, jarakOrang + 2)
      );

      // Kemiringan mengikuti lengkungan jalan
      const sudut = Math.atan2(
        titikSesudah.y - titikSebelum.y,
        titikSesudah.x - titikSebelum.x
      ) * 180 / Math.PI;

      // Hadap kiri ketika berlari menuju Gresik
      const hadap = arahRunner === -1 ? -1 : 1;

      // Posisi kaki dibuat mendekati permukaan jalan
      orang.setAttribute(
        "transform",
        `translate(${titik.x} ${titik.y - 15})
       rotate(${sudut})
       scale(${hadap} 1)`
      );

    });

    // Tulisan mengikuti orang pembawa kopi
    const tulisan = runner.querySelector(".jk-chase-caption");

    if (tulisan) {
      const titikDepan = road.getPointAtLength(
        Math.max(0, Math.min(panjangJalan, jarakUtama))
      );

      tulisan.setAttribute(
        "x",
        titikDepan.x - arahRunner * 35
      );

      tulisan.setAttribute(
        "y",
        titikDepan.y - 52
      );
    }

    position = progress;
  }


  /* 4 ORANG KEJAR-KEJARAN*/

  function moveRunner(destination) {
    cancelAnimationFrame(animationId);

    const from = position;
    const duration = 1800;
    let start = null;

    // Mulai animasi tangan dan kaki
    runner.classList.add("is-running");

    if (reduceMotion) {
      drawRunner(destination);
      runner.classList.remove("is-running");
      animationId = null;
      return;
    }

    function frame(time) {
      if (start === null) start = time;

      const t = Math.min(
        (time - start) / duration,
        1
      );

      const easing = t * t * (3 - 2 * t);

      // Gerakkan semua karakter sesuai jalannya
      drawRunner(
        from + (destination - from) * easing
      );

      if (t < 1) {
        animationId = requestAnimationFrame(frame);
      } else {
        runner.classList.remove("is-running");
        animationId = null;
      }
    }

    animationId = requestAnimationFrame(frame);
  }

  // Hubungkan peta dan link dengan cabang yang benar
  Object.entries(CABANG).forEach(([key, branch]) => {
    const card = cards.querySelector(`[data-branch="${key}"]`);
    if (!card) return;


    const link = card.querySelector(".branch__body a.link");

    if (link) {
      const destination = encodeURIComponent(
        `${branch.name}, ${branch.address}`
      );

      // TOMBOL 1: Buka lokasi outlet di Google Maps
      link.textContent = "Buka di Google Maps";
      link.href =
        `https://www.google.com/maps/search/?api=1&query=${destination}`;

      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // TOMBOL 2: Petunjuk arah menuju outlet
      let routeLink = card.querySelector(".jk-route-link");

      if (!routeLink) {
        routeLink = document.createElement("a");
        routeLink.className = "link jk-route-link";
        routeLink.textContent = "Petunjuk arah";

        link.insertAdjacentElement("afterend", routeLink);
      }

      routeLink.href =
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

      routeLink.target = "_blank";
      routeLink.rel = "noopener noreferrer";

      // Satukan kedua link dalam satu baris
      let linksRow = card.querySelector(".jk-map-links");

      if (!linksRow) {
        linksRow = document.createElement("span");
        linksRow.className = "jk-map-links";
        link.parentNode.insertBefore(linksRow, link);
      }

      linksRow.append(link, routeLink);
    }
  });

  // Pilih Gresik atau Surabaya

  function selectBranch(key, mode = "manual", distance = null) {
    const branch = CABANG[key];
    if (!branch) return;

    // Hentikan perjalanan otomatis sementara
    autoPauseUntil = Date.now() + 8000;

    // Arahkan mobil ke outlet yang dipilih
    moveRunner(branch.point);

    // Tandai sketsa outlet yang aktif
    choices.forEach(outlet => {
      const active = outlet.dataset.jkChoice === key;

      outlet.classList.toggle("is-active", active);
      outlet.setAttribute("aria-pressed", String(active));
    });

    // Tampilkan area peta
    cards.hidden = false;

    // Hanya tampilkan kartu cabang yang dipilih
    cards.querySelectorAll(".branch").forEach(card => {
      const selected = card.dataset.branch === key;

      card.hidden = !selected;
      card.classList.toggle("jk-active", selected);

      if (!selected) {
        delete card.dataset.jkTag;
        return;
      }

      card.dataset.jkTag =
        mode === "gps" ? "Terdekat darimu" : "Pilihanmu";

      // Muat peta outlet yang dipilih
      const iframe = card.querySelector("iframe");

      if (iframe) {
        const mapUrl =
          "https://www.google.com/maps?q=" +
          encodeURIComponent(branch.address) +
          "&output=embed";

        if (iframe.getAttribute("src") !== mapUrl) {
          iframe.src = mapUrl;
        }

        iframe.title = `Peta ${branch.name}`;
      }
    });

    // Informasi pilihan cabang
    if (mode === "gps" && distance !== null) {
      status.textContent =
        `${branch.name} diperkirakan paling dekat, ` +
        `sekitar ${distance.toFixed(1)} km secara garis lurus.`;
    } else {
      status.textContent =
        `Menuju ${branch.name}! Lihat peta dan petunjuk arah di bawah.`;
    }
  }


  // Interaksi tombol cabang
  choices.forEach(button => {
    button.addEventListener("click", () => {
      selectBranch(button.dataset.jkChoice);
    });
  });


  /* KEMBALI KE TAMPILAN AWAL SAAT KLIK DI LUAR */

  function resetJelajahiKammari() {

    // Sembunyikan seluruh detail cabang
    cards.hidden = true;

    cards.querySelectorAll(".branch").forEach(card => {
      card.hidden = true;
      card.classList.remove("jk-active");
      card.style.order = "";
      delete card.dataset.jkTag;
    });

    // Hapus status aktif pada gambar outlet
    choices.forEach(outlet => {
      outlet.classList.remove("is-active");
      outlet.setAttribute("aria-pressed", "false");
    });

    // Kembalikan tulisan seperti tampilan awal
    status.textContent =
      "Klik salah satu outlet atau temukan cabang terdekat.";

    // Kembalikan orang berlari ke tengah,
    // lalu biarkan animasi otomatis berjalan lagi
    autoPauseUntil = 0;
    moveRunner(0.5);
  }

  // Deteksi klik di seluruh halaman
  document.addEventListener("click", event => {

    const target = event.target;

    if (!(target instanceof Element)) return;

    // Jangan reset jika klik fitur yang terhubung
    if (
      target.closest("[data-jk-choice]") ||
      target.closest("#jk-nearest") ||
      target.closest("#jk-branches")
    ) {
      return;
    }

    // Jika detail sedang terbuka, tutup
    if (!cards.hidden) {
      resetJelajahiKammari();
    }
  });


  // Rumus Haversine: jarak garis lurus antarkoordinat
  function distanceKm(lat1, lng1, lat2, lng2) {
    const rad = n => n * Math.PI / 180;
    const dLat = rad(lat2 - lat1);
    const dLng = rad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLng / 2) ** 2;

    return 6371 * 2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );
  }

  // Deteksi GPS pengunjung
  gpsButton?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      status.textContent =
        "Browser ini tidak mendukung lokasi. Pilih cabang secara manual.";
      return;
    }

    gpsButton.disabled = true;
    status.textContent = "Sedang mencari lokasi kamu...";

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;

        const distances = Object.entries(CABANG).map(
          ([key, branch]) => ({
            key,
            km: distanceKm(
              latitude,
              longitude,
              branch.lat,
              branch.lng
            )
          })
        );

        distances.sort((a, b) => a.km - b.km);

        const nearest = distances[0];

        selectBranch(nearest.key, "gps", nearest.km);
        gpsButton.disabled = false;
      },

      error => {
        gpsButton.disabled = false;

        status.textContent =
          error.code === 1
            ? "Izin lokasi tidak diberikan. Kamu tetap bisa memilih cabang."
            : "Lokasi belum berhasil ditemukan. Coba lagi atau pilih manual.";
      },

      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  });

  // Orang mulai dari awal
  drawRunner(0.5);

  // Arah perjalanan otomatis bergantian
  let autoDestination = "surabaya";

  // Jalankan setiap 3 detik
  if (!reduceMotion) {
    setInterval(() => {

      // Jangan ganggu perjalanan yang dipilih pengguna
      if (Date.now() < autoPauseUntil) return;

      // Jeda jika tab browser tidak sedang dibuka
      if (document.hidden) return;

      // Gerakkan mobil menuju cabang berikutnya
      moveRunner(CABANG[autoDestination].point);

      // Ganti tujuan perjalanan berikutnya
      autoDestination =
        autoDestination === "surabaya"
          ? "gresik"
          : "surabaya";

    }, 3000);
  }
})();


/* EVENT ARCHIVE - TAMPILKAN LEBIH BANYAK KHUSUS MOBILE */

document.addEventListener("click", function (event) {
  const button = event.target.closest(".kt-more");

  if (!button) return;

  // Hanya berlaku untuk HP
  if (!window.matchMedia("(max-width: 720px)").matches) {
    return;
  }

  const gallery = document.querySelector(
    "#past-event-gallery.kt-collection"
  );

  if (!gallery) return;

  const expanded = gallery.classList.toggle(
    "kt-mobile-expanded"
  );

  if (expanded) {
    // Tampilkan seluruh poster tambahan
    gallery.querySelectorAll(".kt-ticket").forEach(ticket => {
      ticket.hidden = false;
    });
  }

  button.textContent = expanded
    ? "Tampilkan lebih sedikit ↑"
    : "Tampilkan lebih banyak ↓";

  button.setAttribute("aria-expanded", String(expanded));
});

/* ==========================================================
   OUR STORY — SLIDE MENGIKUTI SCROLL + JEJAK KAKI
   Desktop : scroll halaman, papan sticky
   HP      : scroll halaman, papan sticky + otomatis diperkecil
             agar muat di layar
   Layar lain (mis. HP landscape pendek): swipe kiri/kanan
========================================================== */

(function initStorySlider() {
  const wrap = document.getElementById("story-scroll");
  const board = document.getElementById("story-board");

  if (!wrap || !board) return;

  const sticky = wrap.querySelector(".story-sticky");
  const slides = [...board.querySelectorAll(".story-slide")];
  const N = slides.length;

  if (!sticky || N === 0) return;

  // HARUS sama dengan media query di CSS
  const mqDesktop = window.matchMedia(
    "(min-width: 761px) and (min-height: 600px)"
  );
  const mqMobile = window.matchMedia("(max-width: 760px)");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // true = slide dikendalikan scroll (desktop & HP)
  const scrollMode = () => mqDesktop.matches || mqMobile.matches;

  const MOBILE_MIN_SCALE = 0.62;   // papan HP tidak diperkecil lebih dari ini
  const MOBILE_SHELF = 50;         // ruang untuk rak kayu di bawah papan (px)

  let index = -1;
  let ticking = false;
  let startX = null;
  let lastDesktop = null;
  let lastW = 0;
  let lastH = 0;
  let rafId = 0;

  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));


  /* ========================================================
     KONFIGURASI JALUR JEJAK
     Satu array per slide (urutan sama dengan slide di HTML).
     Tiap titik = [x, y] dalam pecahan 0–1 dari ukuran slide:
       x: 0 = kiri,  1 = kanan
       y: 0 = atas,  1 = bawah
  ======================================================== */

  const TRAILS = [
    // Slide 1 — dari label "About Kammari" turun ke kanan
    [
      [0.18, 0.14],
      [0.28, 0.18],
      [0.35, 0.28],
      [0.43, 0.43],
      [0.51, 0.57],
      [0.63, 0.61],
      [0.82, 0.62],
      [1.0, 0.64],
    ],

    // Slide 2 — masuk dari kiri bawah, naik, lalu ke kanan
    [
      [0.0, 0.6],
      [0.06, 0.57],
      [0.05, 0.43],
      [0.06, 0.28],
      [0.1, 0.18],
      [0.16, 0.16],
      [0.21, 0.24],
      [0.25, 0.33],
      [0.33, 0.36],
      [0.55, 0.36],
      [0.78, 0.34],
      [0.9, 0.28],
      [1.0, 0.26],
    ],

    // Slide 3 — masuk dari kiri bawah, naik ke label "Brand Architecture"
    [
      [0.0, 0.6],
      [0.07, 0.58],
      [0.1, 0.5],
      [0.1, 0.36],
      [0.12, 0.25],
      [0.14, 0.18],
    ],
  ];

  const SVG_NS = "http://www.w3.org/2000/svg";
  const DURATION = 3200;      // ms, jejak muncul otomatis (mode swipe)
  const STEP_GAP = 40;        // jarak antar jejak (px) di desktop
  const STEP_GAP_SMALL = 28;  // jarak antar jejak (px) di layar sempit
  const FOOT_OFFSET = 6;      // jarak kiri/kanan dari garis tengah (px)
  const MAX_OPACITY = 0.5;    // kepekatan jejak


  /* ========================================================
     JEJAK
  ======================================================== */

  function svgEl(name, attrs) {
    const node = document.createElementNS(SVG_NS, name);
    if (attrs) {
      for (const key in attrs) node.setAttribute(key, attrs[key]);
    }
    return node;
  }

  // Titik-titik -> kurva halus (Catmull-Rom ke Bezier)
  function toPath(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }

    return d;
  }

  const trails = slides.map((slide, k) => {
    const pts = TRAILS[k];
    if (!pts) return null;

    const svg = svgEl("svg", {
      class: "story-trail",
      "aria-hidden": "true",
    });

    const guide = svgEl("path", { class: "story-trail__guide" });
    const steps = svgEl("g");

    svg.append(guide, steps);
    slide.prepend(svg);

    return { slide, pts, svg, guide, steps, items: [], p: 0 };
  });

  // Satu telapak kaki: bagian depan + tumit
  function makeFoot(x, y, angle, scale) {
    const outer = svgEl("g", {
      transform:
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) ` +
        `rotate(${angle.toFixed(1)}) scale(${scale})`,
    });

    const foot = svgEl("g", { class: "story-step" });

    foot.append(
      svgEl("ellipse", { cx: 0, cy: -5, rx: 4.2, ry: 7 }),
      svgEl("ellipse", { cx: 0, cy: 6.5, rx: 3.2, ry: 3.6 })
    );

    outer.append(foot);
    return { outer, foot };
  }

  function buildTrail(t) {
    const w = t.slide.clientWidth;
    const h = t.slide.clientHeight;
    if (!w || !h) return;

    t.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    t.guide.setAttribute(
      "d",
      toPath(t.pts.map(([x, y]) => [x * w, y * h]))
    );

    const len = t.guide.getTotalLength();
    const small = w < 600;
    const gap = small ? STEP_GAP_SMALL : STEP_GAP;
    const scale = small ? 0.8 : 1;
    const n = Math.max(1, Math.floor(len / gap));
    const spacing = len / n;

    t.steps.textContent = "";
    t.items = [];

    for (let k = 0; k < n; k++) {
      const dist = (k + 0.5) * spacing;

      const a = t.guide.getPointAtLength(dist);
      const b = t.guide.getPointAtLength(Math.min(len, dist + 2));
      const c = t.guide.getPointAtLength(Math.max(0, dist - 2));

      const dx = b.x - c.x;
      const dy = b.y - c.y;
      const mag = Math.hypot(dx, dy) || 1;

      // kaki kiri & kanan bergantian, bergeser tegak lurus dari garis
      const side = k % 2 ? 1 : -1;
      const x = a.x + (-dy / mag) * side * FOOT_OFFSET;
      const y = a.y + (dx / mag) * side * FOOT_OFFSET;

      // telapak digambar menghadap atas, jadi +90°
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90 + side * 8;

      const { outer, foot } = makeFoot(x, y, angle, scale);
      t.steps.append(outer);
      t.items.push(foot);
    }

    applyProgress(t, t.p);
  }

  function rebuildTrails() {
    trails.forEach((t) => t && buildTrail(t));
  }

  // p: 0–1 -> jejak yang sudah dipijak tetap terlihat (tidak memudar).
  // Kalau scroll balik ke atas, jejaknya hilang lagi satu per satu.
  function applyProgress(t, p) {
    t.p = clamp(p);

    const count = Math.floor(t.p * t.items.length + 1e-6);

    t.items.forEach((foot, k) => {
      const stepped = k < count;

      foot.classList.toggle("is-on", stepped);
      foot.style.opacity = stepped ? String(MAX_OPACITY) : "0";
    });
  }

  function setProgress(i, p) {
    const t = trails[i];
    if (t) applyProgress(t, p);
  }

  // Mode swipe: jejak muncul otomatis saat slide aktif
  function playTrail(i) {
    cancelAnimationFrame(rafId);

    const t = trails[i];
    if (!t) return;

    if (reduceMotion) {
      setProgress(i, 1);
      return;
    }

    setProgress(i, 0);

    const start = performance.now();

    const step = (now) => {
      const x = clamp((now - start) / DURATION);
      const eased = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

      setProgress(i, eased);

      if (x < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
  }


  /* ========================================================
     HP: PERKECIL PAPAN AGAR MUAT DI LAYAR
     Papan dilebarkan (100% / scale) lalu di-scale kembali,
     jadi isi tetap utuh dan tinggi papan = tinggi layar.
  ======================================================== */

  function fitBoard() {
    if (!mqMobile.matches) {
      board.style.width = "";
      board.style.transform = "";
      sticky.style.height = "";
      return;
    }

    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const avail = window.innerHeight - top - MOBILE_SHELF - 8;

    let s = 1;

    // tinggi papan tergantung lebarnya, jadi hitung beberapa kali
    for (let i = 0; i < 5; i++) {
      board.style.width = `${100 / s}%`;
      board.style.transform = "none";

      const h = board.offsetHeight;
      const next = clamp(avail / h, MOBILE_MIN_SCALE, 1);

      if (Math.abs(next - s) < 0.01) {
        s = next;
        break;
      }
      s = next;
    }

    board.style.width = `${100 / s}%`;
    board.style.transform = `scale(${s})`;
    sticky.style.height = `${Math.ceil(board.offsetHeight * s)}px`;
  }


  /* ========================================================
     SLIDE
  ======================================================== */

  function showSlide(i) {
    const next = Math.max(0, Math.min(N - 1, i));
    if (next === index) return;
    index = next;

    slides.forEach((slide, k) => {
      const active = k === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    if (!scrollMode()) playTrail(index);
  }

  function onScroll() {
    if (!scrollMode()) return;

    const rect = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - sticky.offsetHeight;
    if (total <= 0) return;

    const topOffset = parseFloat(getComputedStyle(sticky).top) || 0;
    const progress = clamp((topOffset - rect.top) / total);

    const raw = progress * N;
    const idx = Math.min(N - 1, Math.floor(raw));
    const local = raw - idx;                    // 0–1 di dalam slide ini

    // jejak mulai muncul sedikit setelah slide tampil,
    // lengkap sebelum slide berganti
    const walkP = clamp((local - 0.05) / 0.8);

    showSlide(idx);
    setProgress(idx, walkP);
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  }

  function updateMode() {
    const scrolling = scrollMode();

    wrap.classList.toggle("is-scroll", scrolling);

    fitBoard();
    rebuildTrails();

    if (scrolling) {
      onScroll();
    } else if (lastDesktop !== false) {
      playTrail(index < 0 ? 0 : index);
    }

    lastDesktop = scrolling;
  }

  window.addEventListener("scroll", requestTick, { passive: true });

  window.addEventListener("resize", () => {
    // abaikan resize kecil (address bar HP muncul/hilang)
    const dw = Math.abs(window.innerWidth - lastW);
    const dh = Math.abs(window.innerHeight - lastH);

    if (dw > 0 || dh > 120) {
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      updateMode();
    }

    requestTick();
  });

  window.addEventListener("load", () => {
    fitBoard();
    rebuildTrails();
    requestTick();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      fitBoard();
      rebuildTrails();
      requestTick();
    });
  }

  [mqDesktop, mqMobile].forEach((mq) => {
    if (mq.addEventListener) mq.addEventListener("change", updateMode);
    else mq.addListener(updateMode);
  });


  /* Swipe (hanya mode non-scroll) */

  board.addEventListener("touchstart", (e) => {
    if (scrollMode()) return;
    startX = e.touches[0].clientX;
  }, { passive: true });

  board.addEventListener("touchend", (e) => {
    if (scrollMode() || startX === null) { startX = null; return; }

    const diff = e.changedTouches[0].clientX - startX;
    startX = null;

    if (Math.abs(diff) < 50) return;
    showSlide(diff < 0 ? index + 1 : index - 1);
  }, { passive: true });


  /* Keyboard (hanya mode non-scroll) */

  board.addEventListener("keydown", (e) => {
    if (scrollMode()) return;
    if (e.key === "ArrowRight") showSlide(index + 1);
    if (e.key === "ArrowLeft") showSlide(index - 1);
  });


  /* Init */

  lastW = window.innerWidth;
  lastH = window.innerHeight;

  showSlide(0);
  updateMode();
})();

/* KAMMARI - INTERACTIVE MENU BOOK */

(function initKammariMenuBook() {

  async function initialize() {
    const book = document.getElementById("kmb-book");
    if (!book) return;

    const prev = document.getElementById("kmb-prev");
    const next = document.getElementById("kmb-next");

    const photo = document.getElementById("kmb-photo");
    const photoPlaceholder =
      document.getElementById("kmb-photo-placeholder");

    const nameEl = document.getElementById("kmb-name");
    const priceEl = document.getElementById("kmb-price");
    const descEl = document.getElementById("kmb-description");
    const indexEl = document.getElementById("kmb-index");
    const progressEl = document.getElementById("kmb-progress");
    const captionEl = document.getElementById(
      "kmb-photo-caption"
    );

    const pageNumbers = book.querySelectorAll(
      ".kmb-page-number"
    );

    // Urutan menu favorit yang diutamakan
    const favoriteNames = [
      "Thai Basil Chicken",
      "Mee Nyedas Kami",
      "Kentang Goreng Masala",
      "Milo Malaysia Ashoy",
      "Teh Jasmine"
    ];

    const rupiah = value =>
      "Rp " + Number(value || 0).toLocaleString("id-ID");

    let menus = [];
    let currentIndex = 0;
    let isTurning = false;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const mobileLayout = window.matchMedia(
      "(max-width: 650px)"
    );

    // MENAMPILKAN SATU MENU PADA BUKU
    function renderPage() {
      if (!menus.length) return;

      const item = menus[currentIndex];

      nameEl.textContent = item.name || "Menu Kammari";
      priceEl.textContent = rupiah(item.price);

      descEl.textContent =
        item.description ||
        "Pilihan favorit untuk menemani cerita di Kammari.";

      indexEl.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ` +
        String(menus.length).padStart(2, "0");

      progressEl.textContent =
        `Halaman ${String(currentIndex + 1)
          .padStart(2, "0")} dari ${String(menus.length)
          .padStart(2, "0")}`;

      captionEl.textContent =
        "A little taste of Kammari.";

      // Nomor halaman buku fisik
      const leftPage = 6 + currentIndex * 2;

      if (pageNumbers[0]) {
        pageNumbers[0].textContent =
          `— ${String(leftPage).padStart(2, "0")} —`;
      }

      if (pageNumbers[1]) {
        pageNumbers[1].textContent =
          `— ${String(leftPage + 1).padStart(2, "0")} —`;
      }

      // Foto tetap berasal dari database
      photo.hidden = true;
      photoPlaceholder.hidden = false;
      photoPlaceholder.textContent = "Memuat foto menu...";

      if (item.image) {
        try {
          const imageUrl = new URL(
            String(item.image),
            document.baseURI
          ).href;

          photo.onload = function () {
            photo.hidden = false;
            photoPlaceholder.hidden = true;
          };

          photo.onerror = function () {
            photo.hidden = true;
            photoPlaceholder.hidden = false;
            photoPlaceholder.textContent =
              "Foto menu belum tersedia";
          };

          photo.alt = `Foto ${item.name}`;
          photo.src = imageUrl;

          if (photo.complete && photo.naturalWidth > 0) {
            photo.hidden = false;
            photoPlaceholder.hidden = true;
          }
        } catch (error) {
          photoPlaceholder.textContent =
            "Foto menu belum tersedia";
        }
      } else {
        photo.removeAttribute("src");
        photoPlaceholder.textContent =
          "Foto menu belum tersedia";
      }
    }

    // ANIMASI MEMBALIK HALAMAN
    function turnPage(direction) {
      if (!menus.length || isTurning) return;

      const nextIndex =
        (currentIndex + direction + menus.length) %
        menus.length;

      if (
        reducedMotion.matches ||
        mobileLayout.matches
      ) {
        currentIndex = nextIndex;
        renderPage();
        return;
      }

      isTurning = true;

      book.classList.remove("is-next", "is-prev");

      // Mulai animasi membalik
      void book.offsetWidth;

      book.classList.add(
        direction > 0 ? "is-next" : "is-prev"
      );

      // Ganti isi saat lembar berada di tengah putaran
      setTimeout(() => {
        currentIndex = nextIndex;
        renderPage();
      }, 340);

      // Selesai membalik halaman
      setTimeout(() => {
        book.classList.remove("is-next", "is-prev");
        isTurning = false;
      }, 700);
    }

    prev.addEventListener("click", () => turnPage(-1));
    next.addEventListener("click", () => turnPage(1));

    // Bisa juga menggunakan panah keyboard
    book.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        turnPage(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        turnPage(-1);
      }
    });

    // AMBIL DATA DARI SPRING BOOT
    try {
      const response = await fetch(
        "/api/menu?branch=gresik",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const items = Array.isArray(data.items)
        ? data.items
        : [];

      // Cari menu favorit berdasarkan nama
      const selected = favoriteNames
        .map(favorite =>
          items.find(item =>
            String(item.name || "").trim().toLowerCase() ===
            favorite.toLowerCase()
          )
        )
        .filter(Boolean);

      // Lengkapi sampai maksimal 5 menu dari database
      const selectedIds = new Set(
        selected.map(item => String(item.id))
      );

      const remaining = items.filter(item =>
        !selectedIds.has(String(item.id))
      );

      menus = [...selected, ...remaining].slice(0, 5);

      if (!menus.length) {
        throw new Error("Belum ada menu dalam database.");
      }

      renderPage();

      prev.disabled = menus.length < 2;
      next.disabled = menus.length < 2;

      console.log(
        "Buku menu Kammari berhasil dimuat:",
        menus.length,
        "menu"
      );

    } catch (error) {
      console.error(
        "Gagal memuat buku menu Kammari:",
        error
      );

      nameEl.textContent = "Menu belum tersedia";
      priceEl.textContent = "";
      descEl.textContent =
        "Pilihan menu belum dapat dimuat. Coba muat ulang halaman.";
      photoPlaceholder.textContent =
        "Foto belum tersedia";

      prev.disabled = true;
      next.disabled = true;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }

})();

/* ==========================================
   KAMMARI FOOD GALLERY — BERANDA
   Data langsung dari Spring Boot API
========================================== */

(function initKammariFoodGallery() {
  const gallery = document.getElementById("food-gallery");
  if (!gallery) return;

  const $ = id => document.getElementById(id);

  const status = $("fg-status");
  const layout = $("fg-layout");
  const image = $("fg-main-img");
  const fallback = $("fg-image-fallback");
  const nameEl = $("fg-name");
  const priceEl = $("fg-price");
  const descEl = $("fg-description");
  const numberEl = $("fg-number");
  const counterEl = $("fg-counter");
  const previews = $("fg-previews");
  const prev = $("fg-prev");
  const next = $("fg-next");

  const FAVORITES = [
    "Thai Basil Chicken",
    "Mee Nyedas Kami",
    "Kentang Goreng Masala",
    "Milo Malaysia Ashoy",
    "Teh Jasmine"
  ];

  let menus = [];
  let current = 0;

  const rupiah = n =>
    "Rp " + Number(n || 0).toLocaleString("id-ID");

  function getImage(path) {
    if (!path) return "";

    try {
      const url = new URL(path, document.baseURI);
      return ["http:", "https:"].includes(url.protocol)
        ? url.href : "";
    } catch {
      return "";
    }
  }

  function showMenu(index) {
    if (!menus.length) return;

    current = (index + menus.length) % menus.length;

    const item = menus[current];
    const num = String(current + 1).padStart(2, "0");
    const total = String(menus.length).padStart(2, "0");

    nameEl.textContent = item.name;
    priceEl.textContent = rupiah(item.price);
    descEl.textContent = item.description ||
      "Pilihan rasa dari Kammari.";

    numberEl.textContent = `${num} / ${total} — MOST LOVED`;
    counterEl.textContent = `${num} / ${total}`;

    // Foto utama
    const src = getImage(item.image);
    image.alt = `Foto ${item.name}`;
    fallback.textContent = item.name;

    image.hidden = !src;
    fallback.hidden = !!src;

    image.onerror = () => {
      if (image.src !== src) return;
      image.hidden = true;
      fallback.hidden = false;
    };

    if (src) {
      image.style.animation = "none";
      void image.offsetWidth;
      image.style.animation = "";
      image.src = src;
    } else {
      image.removeAttribute("src");
    }

    // Dua foto menu berikutnya
    previews.replaceChildren();

    for (let offset = 1;
         offset <= Math.min(2, menus.length - 1);
         offset++) {

      const target = (current + offset) % menus.length;
      const menu = menus[target];

      const button = document.createElement("button");
      button.type = "button";
      button.className = "fg-thumb";
      button.setAttribute(
        "aria-label",
        `Tampilkan ${menu.name}`
      );

      const url = getImage(menu.image);

      if (url) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "";
        img.loading = "lazy";
        img.onerror = () => img.remove();
        button.appendChild(img);
      }

      const label = document.createElement("span");
      label.className = "fg-thumb__name";
      label.textContent = menu.name;

      button.appendChild(label);
      button.addEventListener("click", () => showMenu(target));
      previews.appendChild(button);
    }

    prev.disabled = menus.length <= 1;
    next.disabled = menus.length <= 1;
  }

  prev.addEventListener("click", () => showMenu(current - 1));
  next.addEventListener("click", () => showMenu(current + 1));

  async function load() {
    try {
      const response = await fetch(
        "/api/menu?branch=gresik",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const all = Array.isArray(data.items) ? data.items : [];

      const chosen = [];
      const used = new Set();

      function add(item) {
        if (!item) return;

        const id = String(item.id ?? item.name);
        if (used.has(id)) return;

        used.add(id);
        chosen.push(item);
      }

      // Prioritaskan menu favorit
      FAVORITES.forEach(name => {
        add(all.find(item =>
          String(item.name || "").trim().toLowerCase()
          === name.toLowerCase()
        ));
      });

      // Lengkapi hingga lima menu
      all.forEach(item => {
        if (chosen.length < 5) add(item);
      });

      menus = chosen.slice(0, 5);

      if (!menus.length) {
        status.textContent = "Menu belum tersedia.";
        return;
      }

      showMenu(0);
      status.hidden = true;
      layout.hidden = false;

      console.log(
        "Food Gallery berhasil dimuat:",
        menus.length,
        "menu"
      );

    } catch (error) {
      console.error("Food Gallery:", error);
      status.textContent =
        "Gagal memuat menu favorit dari database.";
    }
  }

  load();
})();
