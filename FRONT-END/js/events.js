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
