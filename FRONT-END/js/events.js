/* Kammari Café — events.js
   Diekstrak dari script.js tanpa mengubah logika fitur. */

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

  pastGallery.classList.add("kt-collection");
  pastGallery.replaceChildren();

  // Data tetap berasal dari sistem event yang sudah ada
  const pastEvents = EVENTS
    .filter(isFinished)
    .sort((a, b) =>
      (b.dateISO || "").localeCompare(a.dateISO || "")
    );

  // Hapus tombol lama ketika render ulang
  document.getElementById("kt-show-all")?.remove();

  if (!pastEvents.length) {
    const empty = document.createElement("p");
    empty.className = "kt-empty";
    empty.textContent = "Belum ada kenangan yang tersimpan. Nantikan cerita Kammari berikutnya!";
    pastGallery.appendChild(empty);
    return;
  }

  const buttons = [];

  pastEvents.forEach((event, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "kt-ticket";
    button.dataset.event = String(event.id);
    button.hidden = index >= 5;

    button.setAttribute(
      "aria-label",
      `Lihat poster event ${event.title}`
    );

    // Struktur tiket vintage
    button.innerHTML = `
      <span class="kt-ticket__cover">
        <span class="kt-ticket__brand">KAMMARI</span>
        <span class="kt-ticket__poster"></span>
        <span class="kt-ticket__name"></span>
      </span>

      <span class="kt-ticket__tearline" aria-hidden="true"></span>

      <span class="kt-ticket__stub">
        <span class="kt-ticket__number"></span>
        <span class="kt-ticket__date"></span>
      </span>
    `;

    const posterBox = button.querySelector(
      ".kt-ticket__poster"
    );

    // Gunakan poster asli dari database
    if (event.poster) {
      const img = document.createElement("img");
      img.src = event.poster;
      img.alt = `Poster ${event.title}`;
      img.loading = "lazy";

      img.onerror = () => {
        img.remove();
        posterBox.textContent = "POSTER BELUM TERSEDIA";
        posterBox.classList.add("kt-ticket__poster--empty");
      };

      posterBox.appendChild(img);
    } else {
      posterBox.textContent = "POSTER BELUM TERSEDIA";
      posterBox.classList.add("kt-ticket__poster--empty");
    }

    button.querySelector(".kt-ticket__name").textContent =
      event.title;

    button.querySelector(".kt-ticket__number").textContent =
      `KAMMARI / ${String(index + 1).padStart(2, "0")}`;

    button.querySelector(".kt-ticket__date").textContent =
      event.date || event.location || "PAST MOMENTS";

    // Klik tiket: efek sobek lalu buka poster
    button.addEventListener("click", () => {
      if (button.classList.contains("is-tearing")) return;
      if (!viewer || !viewerImage || viewer.open) return;

      button.classList.add("is-tearing");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.setTimeout(() => {
        button.classList.remove("is-tearing");

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
      }, reduceMotion ? 0 : 350);
    });

    buttons.push(button);
    pastGallery.appendChild(button);
  });

  // Tombol Lihat Semua Event
  if (pastEvents.length > 5) {
    const more = document.createElement("button");

    more.type = "button";
    more.id = "kt-show-all";
    more.className = "kt-more";
    more.textContent = "Lihat semua event";
    more.setAttribute("aria-expanded", "false");

    let expanded = false;

    more.addEventListener("click", () => {
      expanded = !expanded;

      buttons.forEach((button, index) => {
        button.hidden = !expanded && index >= 5;
      });

      more.textContent = expanded
        ? "Tampilkan lebih sedikit"
        : "Lihat semua event";

      more.setAttribute("aria-expanded", String(expanded));
    });

    pastGallery.insertAdjacentElement("afterend", more);
  }

  // Tutup viewer (dipasang satu kali saja)
  if (viewer && !viewer.dataset.ktViewerBound) {
    viewer.dataset.ktViewerBound = "true";

    viewer.addEventListener("click", () => {
      if (viewer.open) viewer.close();
    });
  }
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

  // Jangan membuat popup kedua jika sudah ada
  if (document.querySelector(".next-event-popup")) return;

  // Batasi popup sekali setiap 5 jam
  const POPUP_KEY = "kammari_event_popup_last_shown";
  const FIVE_HOURS = 5 * 60 * 60 * 1000;

  const lastShown = Number(localStorage.getItem(POPUP_KEY) || 0);

  if (lastShown && Date.now() - lastShown < FIVE_HOURS) {
    return;
  }

  // Cari event terdekat yang belum selesai
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
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))[0];

  // Tidak ada event mendatang
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

  // Catat waktu popup benar-benar ditampilkan
  localStorage.setItem(
    "kammari_event_popup_last_shown",
    String(Date.now())
  );
}


/* ---------- Jalankan sistem event ---------- */

async function loadEventsFromDatabase() {
  if (!eventGallery && !pastGallery) return;

  try {
    const response = await fetch(
      "/api/events",
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

/* EVENT ARCHIVE - LIHAT SEMUA DI TABLET */

document.addEventListener("click", function (event) {

  // Hanya aktif di tablet
  const isTablet = window.matchMedia(
    "(min-width: 721px) and (max-width: 1100px)"
  ).matches;

  if (!isTablet) return;

  // Gunakan tombol yang sudah ada
  const button = event.target.closest(".kt-more");
  if (!button) return;

  const gallery = document.getElementById(
    "past-event-gallery"
  );

  if (!gallery) return;

  // Tangani klik tablet tanpa menjalankan
  // aksi tombol lain pada saat yang sama
  event.preventDefault();
  event.stopImmediatePropagation();

  // Simpan tulisan awal tombol
  if (!button.dataset.tabletOriginalLabel) {
    button.dataset.tabletOriginalLabel =
      button.textContent.trim();
  }

  // Buka atau tutup poster tambahan
  const expanded = gallery.classList.toggle(
    "kt-tablet-expanded"
  );

  button.textContent = expanded
    ? "Tampilkan lebih sedikit"
    : button.dataset.tabletOriginalLabel;

  button.setAttribute(
    "aria-expanded",
    String(expanded)
  );

}, true);
