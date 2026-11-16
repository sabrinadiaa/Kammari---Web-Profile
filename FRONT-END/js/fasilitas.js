/* Kammari Café & Roastery — fasilitas.js
   Gabungan dari: fasilitas-data.js, fasilitas-hero.js, fasilitas-carousel.js, fasilitas-galeri.js.
   Gunakan sebagai script biasa, bukan type="module".
*/

/* ============ MULAI: fasilitas-data.js ============ */

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

/* ============ SELESAI: fasilitas-data.js ============ */

/* ============ MULAI: fasilitas-hero.js ============ */

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

/* ============ SELESAI: fasilitas-hero.js ============ */

/* ============ MULAI: fasilitas-carousel.js ============ */

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

/* ============ SELESAI: fasilitas-carousel.js ============ */

/* ============ MULAI: fasilitas-galeri.js ============ */

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

/* ============ SELESAI: fasilitas-galeri.js ============ */

