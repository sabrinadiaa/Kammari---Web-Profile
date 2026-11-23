
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================
  // KAMMARI OWNER - EVENT MANAGEMENT
  // =========================================

  const $ = (id) => document.getElementById(id);

  const branchFilter = $("branchFilter");
  const searchInput = $("eventSearch");
  const tableBody = $("eventTableBody");
  const eventCount = $("eventCount");
  const statusMessage = $("eventStatusMessage");

  const addButton = $("addEventButton");
  const formSection = $("eventFormSection");
  const form = $("eventForm");
  const formTitle = $("eventFormTitle");
  const closeButton = $("closeEventForm");
  const cancelButton = $("cancelEvent");
  const saveButton = $("saveEvent");
  const formMessage = $("eventFormMessage");

  const titleInput = $("eventTitle");
  const branchInput = $("eventBranch");
  const statusInput = $("eventStatus");
  const startInput = $("eventStart");
  const endInput = $("eventEnd");
  const descriptionInput = $("eventDescription");
  const posterInput = $("eventPoster");
  const videoInput = $("eventVideo");
  const registrationInput = $("eventRegistration");

  const posterPreview = $("eventPosterPreview");
  const videoPreview = $("eventVideoPreview");

  let events = [];
  let editingId = null;
  let saving = false;
  let loadVersion = 0;
  let formVersion = 0;

  let originalPoster = null;
  let originalVideo = null;
  let posterObjectUrl = null;
  let videoObjectUrl = null;

  const statusLabels = {
    draft: "Draft",
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
    cancelled: "Cancelled"
  };

  // =========================================
  // API & AUTH
  // =========================================

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      cache: "no-store",
      ...options
    });

    if (
      response.status === 401 ||
      (
        response.redirected &&
        new URL(response.url).pathname ===
          "/owner/login.html"
      )
    ) {
      window.location.replace("/owner/login.html");

      throw new Error(
        "Sesi berakhir. Silakan login kembali."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Akses ditolak atau token keamanan tidak valid."
      );
    }

    return response;
  }

  async function csrfHeaders() {
    const response = await api("/api/auth/csrf");

    if (!response.ok) {
      throw new Error(
        "Gagal mengambil token keamanan."
      );
    }

    const csrf = await response.json();

    if (!csrf.token || !csrf.headerName) {
      throw new Error(
        "Token keamanan tidak tersedia."
      );
    }

    return { [csrf.headerName]: csrf.token };
  }

  function getErrorMessage(response, action) {
    switch (response.status) {
      case 400:
        return "Data event tidak valid. Periksa kembali form.";
      case 404:
        return "Event tidak ditemukan.";
      case 409:
        return "Judul atau slug event sudah digunakan.";
      case 413:
        return "Ukuran file terlalu besar.";
      case 415:
        return "Format file tidak didukung.";
      default:
        return `${action} gagal (HTTP ${response.status}).`;
    }
  }

  function setStatus(message, error = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = error ? "#A33C32" : "";
  }

  function setFormStatus(message, error = false) {
    formMessage.textContent = message;
    formMessage.style.color = error
      ? "#A33C32"
      : "#426A47";
  }

  // =========================================
  // DATETIME HELPERS
  // =========================================

  function toDateInput(value) {
    if (!value) return "";

    if (typeof value === "string") {
      return value.replace(" ", "T").slice(0, 16);
    }

    return "";
  }

  function toApiDateTime(value) {
    if (!value) return null;

    return value.length === 16
      ? `${value}:00`
      : value;
  }

  function formatDate(value) {
    if (!value) return "-";

    const normalized = typeof value === "string"
      ? value.replace(" ", "T")
      : value;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  // =========================================
  // MEDIA PREVIEW
  // =========================================

  function clearObjectUrls() {
    if (posterObjectUrl) {
      URL.revokeObjectURL(posterObjectUrl);
      posterObjectUrl = null;
    }

    if (videoObjectUrl) {
      URL.revokeObjectURL(videoObjectUrl);
      videoObjectUrl = null;
    }
  }

  function updateMediaPreview() {
    clearObjectUrls();

    const posterFile = posterInput.files?.[0] || null;
    const videoFile = videoInput.files?.[0] || null;

    const posterSource = posterFile
      ? (posterObjectUrl = URL.createObjectURL(posterFile))
      : originalPoster;

    const videoSource = videoFile
      ? (videoObjectUrl = URL.createObjectURL(videoFile))
      : originalVideo;

    if (posterSource) {
      posterPreview.src = posterSource;
      posterPreview.hidden = false;
    } else {
      posterPreview.hidden = true;
      posterPreview.removeAttribute("src");
    }

    videoPreview.pause();

    if (videoSource) {
      videoPreview.src = videoSource;
      videoPreview.hidden = false;
      videoPreview.load();
    } else {
      videoPreview.hidden = true;
      videoPreview.removeAttribute("src");
      videoPreview.load();
    }
  }

  function clearMedia() {
    clearObjectUrls();

    originalPoster = null;
    originalVideo = null;

    posterInput.value = "";
    videoInput.value = "";

    posterPreview.hidden = true;
    posterPreview.removeAttribute("src");

    videoPreview.pause();
    videoPreview.hidden = true;
    videoPreview.removeAttribute("src");
    videoPreview.load();
  }

  function validateMedia(file, type) {
    if (!file) return;

    const allowedTypes = type === "poster"
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["video/mp4", "video/webm"];

    const maxSize = type === "poster"
      ? 5 * 1024 * 1024
      : 50 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        type === "poster"
          ? "Poster harus JPG, PNG, atau WebP."
          : "Video harus MP4 atau WebM."
      );
    }

    if (file.size === 0 || file.size > maxSize) {
      throw new Error(
        type === "poster"
          ? "Poster maksimal 5 MB."
          : "Video maksimal 50 MB."
      );
    }
  }

  posterInput.addEventListener("change", () => {
    try {
      validateMedia(posterInput.files?.[0], "poster");
      setFormStatus("");
    } catch (error) {
      posterInput.value = "";
      setFormStatus(error.message, true);
    }

    updateMediaPreview();
  });

  videoInput.addEventListener("change", () => {
    try {
      validateMedia(videoInput.files?.[0], "video");
      setFormStatus("");
    } catch (error) {
      videoInput.value = "";
      setFormStatus(error.message, true);
    }

    updateMediaPreview();
  });

  // =========================================
  // UPLOAD MEDIA
  // =========================================

  async function uploadMedia(file, type) {
    validateMedia(file, type);

    const headers = await csrfHeaders();

    const data = new FormData();
    data.append("file", file);
    data.append("type", type);

    const response = await api(
      "/api/owner/event-media",
      {
        method: "POST",
        headers,
        body: data
      }
    );

    // Content-Type sengaja tidak ditentukan.
    // Browser otomatis menambahkan multipart boundary.

    if (!response.ok) {
      throw new Error(
        getErrorMessage(response, `Upload ${type}`)
      );
    }

    const result = await response.json();

    const expectedExtension = type === "poster"
      ? "(jpg|png|webp)"
      : "(mp4|webm)";

    const urlPattern = new RegExp(
      `^/uploads/events/[a-f0-9-]{36}\\.${expectedExtension}$`
    );

    if (
      typeof result.url !== "string" ||
      !urlPattern.test(result.url)
    ) {
      throw new Error(
        "Respons upload media tidak valid."
      );
    }

    return result.url;
  }

  // =========================================
  // LOAD EVENTS
  // =========================================

  async function loadEvents() {
    const version = ++loadVersion;

    tableBody.replaceChildren();
    eventCount.textContent = "Memuat event...";
    setStatus("");

    try {
      const branch = branchFilter.value;

      const query = branch
        ? `?branch=${encodeURIComponent(branch)}`
        : "";

      const response = await api(
        `/api/owner/events${query}`
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(response, "Mengambil event")
        );
      }

      const result = await response.json();

      if (version !== loadVersion) return;

      if (!Array.isArray(result)) {
        throw new Error(
          "Format daftar event tidak sesuai."
        );
      }

      events = result;
      renderEvents();

    } catch (error) {
      if (version !== loadVersion) return;

      events = [];
      eventCount.textContent = "Gagal memuat event";
      setStatus(error.message, true);
      console.error("Gagal memuat event:", error);
    }
  }

  // =========================================
  // RENDER EVENTS
  // =========================================

  function createButton(label, className) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = className;
    button.textContent = label;

    return button;
  }

  function renderRow(item) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.className = "event-title";
    nameCell.textContent = item.title || "-";

    const branchCell = document.createElement("td");
    branchCell.textContent =
      item.branchName || "Semua Cabang";

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(item.startAt);

    const statusCell = document.createElement("td");

    const badge = document.createElement("span");
    badge.className =
      `status-pill ${item.status || ""}`;
    badge.textContent =
      statusLabels[item.status] || item.status || "-";

    statusCell.appendChild(badge);

    const actions = document.createElement("td");
    actions.className = "event-actions";

    const editButton = createButton(
      "Edit",
      "secondary-button"
    );

    const cancelEventButton = createButton(
      "Batalkan",
      "danger-button"
    );

    cancelEventButton.disabled =
      item.status === "cancelled";

    actions.append(editButton, cancelEventButton);

    row.append(
      nameCell,
      branchCell,
      dateCell,
      statusCell,
      actions
    );

    editButton.addEventListener("click", async () => {
      try {
        await openEditForm(item.id);
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    cancelEventButton.addEventListener(
      "click",
      async () => {
        if (saving) return;

        const confirmed = window.confirm(
          `Batalkan event "${item.title}"?\n\n` +
          "Event akan berstatus Cancelled."
        );

        if (!confirmed) return;

        cancelEventButton.disabled = true;
        cancelEventButton.textContent = "Membatalkan...";

        try {
          const headers = await csrfHeaders();

          const response = await api(
            `/api/owner/events/${encodeURIComponent(item.id)}`,
            {
              method: "DELETE",
              headers
            }
          );

          if (!response.ok) {
            throw new Error(
              getErrorMessage(response, "Batalkan event")
            );
          }

          if (editingId === item.id) {
            closeForm();
          }

          await loadEvents();

          setStatus(
            `Event "${item.title}" berhasil dibatalkan.`
          );

        } catch (error) {
          setStatus(error.message, true);

        } finally {
          cancelEventButton.disabled = false;
          cancelEventButton.textContent = "Batalkan";
        }
      }
    );

    return row;
  }

  function renderEvents() {
    const keyword = searchInput.value
      .trim()
      .toLowerCase();

    const filtered = events.filter((item) =>
      String(item.title || "")
        .toLowerCase()
        .includes(keyword)
    );

    tableBody.replaceChildren();

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 5;
      cell.className = "empty-state";
      cell.textContent = keyword
        ? "Event tidak ditemukan."
        : "Belum ada event.";

      row.appendChild(cell);
      tableBody.appendChild(row);

    } else {
      tableBody.append(
        ...filtered.map((item) => renderRow(item))
      );
    }

    eventCount.textContent =
      `${filtered.length} dari ${events.length} event`;
  }

  // =========================================
  // FORM CREATE / EDIT
  // =========================================

  function closeForm() {
    if (saving) return;

    formVersion++;

    form.reset();
    clearMedia();

    editingId = null;

    formSection.hidden = true;

    addButton.setAttribute(
      "aria-expanded",
      "false"
    );

    formTitle.textContent = "Tambah Event";
    saveButton.textContent = "Simpan Event";

    setFormStatus("");
  }

  function showForm() {
    formSection.hidden = false;

    addButton.setAttribute(
      "aria-expanded",
      "true"
    );

    formSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function openCreateForm() {
    if (saving) return;

    closeForm();

    branchInput.value =
      branchFilter.value === "gresik"
        ? "1"
        : branchFilter.value === "surabaya"
          ? "2"
          : "";

    statusInput.value = "draft";

    showForm();
    titleInput.focus();
  }

  async function openEditForm(id) {
    if (saving) return;

    closeForm();

    const version = formVersion;

    const response = await api(
      `/api/owner/events/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
      throw new Error(
        getErrorMessage(response, "Mengambil detail")
      );
    }

    const detail = await response.json();

    if (version !== formVersion) return;

    editingId = id;

    titleInput.value = detail.title || "";

    branchInput.value = detail.branchId == null
      ? ""
      : String(detail.branchId);

    statusInput.value = detail.status || "draft";

    startInput.value = toDateInput(detail.startAt);
    endInput.value = toDateInput(detail.endAt);

    descriptionInput.value =
      detail.description || "";

    registrationInput.value =
      detail.registrationUrl || "";

    originalPoster = detail.poster || null;
    originalVideo = detail.video || null;

    posterInput.value = "";
    videoInput.value = "";

    updateMediaPreview();

    formTitle.textContent = "Edit Event";
    saveButton.textContent = "Simpan Perubahan";

    showForm();
  }

  // =========================================
  // SAVE EVENT
  // =========================================

  async function saveEvent(event) {
    event.preventDefault();

    if (saving) return;
    if (!form.reportValidity()) return;

    const title = titleInput.value.trim();
    const startAt = toApiDateTime(startInput.value);
    const endAt = toApiDateTime(endInput.value);

    if (!title) {
      setFormStatus(
        "Nama event wajib diisi.",
        true
      );
      titleInput.focus();
      return;
    }

    if (!startAt || !endAt || endAt <= startAt) {
      setFormStatus(
        "Waktu selesai harus setelah waktu mulai.",
        true
      );
      return;
    }

    const branchId = branchInput.value
      ? Number(branchInput.value)
      : null;

    if (
      branchId !== null &&
      (!Number.isSafeInteger(branchId) || branchId <= 0)
    ) {
      setFormStatus(
        "Cabang tidak valid.",
        true
      );
      return;
    }

    const posterFile = posterInput.files?.[0] || null;
    const videoFile = videoInput.files?.[0] || null;

    try {
      validateMedia(posterFile, "poster");
      validateMedia(videoFile, "video");
    } catch (error) {
      setFormStatus(error.message, true);
      return;
    }

    const editing = editingId !== null;
    const id = editingId;

    const payload = {
      title,
      branchId,
      description: descriptionInput.value.trim(),
      startAt,
      endAt,
      poster: originalPoster,
      video: originalVideo,
      registrationUrl:
        registrationInput.value.trim() || null,
      status: statusInput.value
    };

    saving = true;

    saveButton.disabled = true;
    cancelButton.disabled = true;
    closeButton.disabled = true;
    addButton.disabled = true;

    saveButton.textContent = "Menyimpan...";
    setFormStatus("Menyiapkan event...");

    try {
      // Upload poster baru apabila dipilih.
      if (posterFile) {
        setFormStatus("Mengunggah poster...");

        payload.poster = await uploadMedia(
          posterFile,
          "poster"
        );
      }

      // Upload video baru apabila dipilih.
      if (videoFile) {
        setFormStatus("Mengunggah video...");

        payload.video = await uploadMedia(
          videoFile,
          "video"
        );
      }

      const headers = await csrfHeaders();

      setFormStatus("Menyimpan event...");

      const endpoint = editing
        ? `/api/owner/events/${encodeURIComponent(id)}`
        : "/api/owner/events";

      const response = await api(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            response,
            editing ? "Edit event" : "Tambah event"
          )
        );
      }

      const message = editing
        ? `Event "${title}" berhasil diperbarui.`
        : `Event "${title}" berhasil ditambahkan.`;

      saving = false;
      closeForm();

      branchFilter.value = "";
      searchInput.value = "";

      await loadEvents();
      setStatus(message);

    } catch (error) {
      setFormStatus(error.message, true);
      console.error(
        "Gagal menyimpan event:",
        error
      );

    } finally {
      saving = false;

      saveButton.disabled = false;
      cancelButton.disabled = false;
      closeButton.disabled = false;
      addButton.disabled = false;

      saveButton.textContent =
        editingId !== null
          ? "Simpan Perubahan"
          : "Simpan Event";
    }
  }

  // =========================================
  // EVENT LISTENERS
  // =========================================

  branchFilter.addEventListener(
    "change",
    loadEvents
  );

  searchInput.addEventListener(
    "input",
    renderEvents
  );

  addButton.addEventListener("click", () => {
    if (saving) return;

    if (formSection.hidden) {
      openCreateForm();
    } else {
      closeForm();
    }
  });

  closeButton.addEventListener(
    "click",
    closeForm
  );

  cancelButton.addEventListener(
    "click",
    closeForm
  );

  form.addEventListener(
    "submit",
    saveEvent
  );

  // =========================================
  // INITIALIZATION
  // =========================================

  closeForm();
  loadEvents();
});
