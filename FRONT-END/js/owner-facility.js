
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const branchFilter = $("branchFilter");
  const searchInput = $("facilitySearch");
  const tableBody = $("facilityTableBody");
  const countText = $("facilityCount");
  const statusText = $("facilityStatusMessage");

  const addButton = $("addFacilityButton");
  const formSection = $("facilityFormSection");
  const form = $("facilityForm");
  const formTitle = $("facilityFormTitle");
  const closeButton = $("closeFacilityForm");
  const cancelButton = $("cancelFacility");
  const saveButton = $("saveFacility");
  const formMessage = $("facilityFormMessage");

  const nameInput = $("facilityName");
  const branchInput = $("facilityBranch");
  const typeInput = $("facilityType");
  const orderInput = $("facilityOrder");
  const descriptionInput = $("facilityDescription");
  const iconInput = $("facilityIcon");
  const imageInput = $("facilityImage");
  const imagePreview = $("facilityImagePreview");
  const availableInput = $("facilityAvailable");

  const API = "/api/owner/facility-management";

  let facilities = [];
  let editingId = null;
  let originalImage = null;
  let previewUrl = null;
  let saving = false;
  let deleting = false;
  let loadVersion = 0;
  let formVersion = 0;

  // =====================================
  // API
  // =====================================

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
        new URL(response.url).pathname === "/owner/login.html"
      )
    ) {
      window.location.replace("/owner/login.html");
      throw new Error("Sesi berakhir. Login kembali.");
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
      throw new Error("Gagal mengambil token keamanan.");
    }

    const data = await response.json();

    if (!data.headerName || !data.token) {
      throw new Error("Token keamanan tidak tersedia.");
    }

    return {
      [data.headerName]: data.token
    };
  }

  async function readError(response, action) {
    let detail = "";

    try {
      const body = await response.json();
      detail = body.message || body.error || "";
    } catch (_) {
      // Jika respons bukan JSON.
    }

    if (response.status === 409) {
      return "Data fasilitas sudah digunakan.";
    }

    if (response.status === 413) {
      return "Ukuran file terlalu besar.";
    }

    if (response.status === 404) {
      return "Data atau endpoint tidak ditemukan.";
    }

    return detail && response.status < 500
      ? detail
      : `${action} gagal (HTTP ${response.status}).`;
  }

  function setStatus(message, error = false) {
    statusText.textContent = message;
    statusText.style.color = error ? "#A33C32" : "";
  }

  function setFormStatus(message, error = false) {
    formMessage.textContent = message;
    formMessage.style.color = error
      ? "#A33C32"
      : "#426A47";
  }

  // =====================================
  // PHOTO PREVIEW
  // =====================================

  function revokePreviewUrl() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
  }

  function updatePreview() {
    revokePreviewUrl();

    const file = imageInput.files?.[0];

    if (file) {
      previewUrl = URL.createObjectURL(file);
      imagePreview.src = previewUrl;
      imagePreview.hidden = false;
    } else if (originalImage) {
      imagePreview.src = originalImage;
      imagePreview.hidden = false;
    } else {
      imagePreview.removeAttribute("src");
      imagePreview.hidden = true;
    }
  }

  function validateImage(file) {
    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowed.includes(file.type)) {
      throw new Error(
        "Foto harus berformat JPG, PNG, atau WebP."
      );
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran foto maksimal 5 MB.");
    }
  }

  imageInput.addEventListener("change", () => {
    try {
      validateImage(imageInput.files?.[0]);
      setFormStatus("");
    } catch (error) {
      imageInput.value = "";
      setFormStatus(error.message, true);
    }

    updatePreview();
  });

  // =====================================
  // UPLOAD FOTO
  // =====================================

  async function uploadImage(file) {
    validateImage(file);

    const csrf = await csrfHeaders();
    const data = new FormData();

    data.append("file", file);

    const response = await api(
      "/api/owner/facility-images",
      {
        method: "POST",
        headers: csrf,
        body: data
      }
    );

    // Jangan menentukan Content-Type manual.
    // Browser membuat multipart boundary.

    if (!response.ok) {
      throw new Error(
        await readError(response, "Upload foto")
      );
    }

    const result = await response.json();

    if (
      typeof result.image !== "string" ||
      !/^\/uploads\/facilities\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(result.image)
    ) {
      throw new Error("Respons upload foto tidak valid.");
    }

    return result.image;
  }

  // =====================================
  // LOAD DATA
  // =====================================

  async function loadFacilities() {
    const version = ++loadVersion;

    tableBody.replaceChildren();
    countText.textContent = "Memuat fasilitas...";
    setStatus("");

    try {
      const branch = branchFilter.value;
      const query = branch
        ? `?branch=${encodeURIComponent(branch)}`
        : "";

      const response = await api(API + query);

      if (!response.ok) {
        throw new Error(
          await readError(response, "Memuat fasilitas")
        );
      }

      const result = await response.json();

      if (version !== loadVersion) return;

      if (!Array.isArray(result)) {
        throw new Error(
          "Format daftar fasilitas tidak sesuai."
        );
      }

      facilities = result;
      renderFacilities();

    } catch (error) {
      if (version !== loadVersion) return;

      facilities = [];
      countText.textContent = "Gagal memuat fasilitas";
      setStatus(error.message, true);

      console.error(error);
    }
  }

  // =====================================
  // TABLE
  // =====================================

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
    nameCell.className = "facility-name";
    nameCell.textContent = item.name || "-";

    const branchCell = document.createElement("td");
    branchCell.textContent = item.branchName || "-";

    const typeCell = document.createElement("td");
    typeCell.textContent =
      item.type === "highlight" ? "Highlight" : "Fasilitas";

    const availabilityCell = document.createElement("td");
    const availability = document.createElement("span");

    availability.className = item.isAvailable
      ? "status-pill"
      : "status-pill unavailable";

    availability.textContent = item.isAvailable
      ? "Tersedia"
      : "Tidak tersedia";

    availabilityCell.appendChild(availability);

    const actionCell = document.createElement("td");
    actionCell.className = "facility-actions";

    const editButton = createButton(
      "Edit",
      "secondary-button"
    );

    const deleteButton = createButton(
      "Hapus",
      "danger-button"
    );

    actionCell.append(editButton, deleteButton);

    row.append(
      nameCell,
      branchCell,
      typeCell,
      availabilityCell,
      actionCell
    );

    editButton.addEventListener("click", async () => {
      if (saving || deleting) return;

      try {
        await openEditForm(item.id);
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    deleteButton.addEventListener("click", async () => {
      if (saving || deleting) return;

      const confirmed = window.confirm(
        `Hapus fasilitas "${item.name}"?\n\n` +
        "Data fasilitas akan dihapus dari database."
      );

      if (!confirmed) return;

      deleting = true;
      deleteButton.disabled = true;
      deleteButton.textContent = "Menghapus...";

      try {
        const headers = await csrfHeaders();

        const response = await api(
          `${API}/${encodeURIComponent(item.id)}`,
          {
            method: "DELETE",
            headers
          }
        );

        if (!response.ok) {
          throw new Error(
            await readError(response, "Hapus fasilitas")
          );
        }

        if (editingId === item.id) {
          closeForm();
        }

        await loadFacilities();

        setStatus(
          `Fasilitas "${item.name}" berhasil dihapus.`
        );

      } catch (error) {
        setStatus(error.message, true);

      } finally {
        deleting = false;
        deleteButton.disabled = false;
        deleteButton.textContent = "Hapus";
      }
    });

    return row;
  }

  function renderFacilities() {
    const keyword = searchInput.value
      .trim()
      .toLowerCase();

    const filtered = facilities.filter((item) =>
      String(item.name || "")
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
        ? "Fasilitas tidak ditemukan."
        : "Belum ada fasilitas.";

      row.appendChild(cell);
      tableBody.appendChild(row);

    } else {
      tableBody.append(
        ...filtered.map(renderRow)
      );
    }

    countText.textContent =
      `${filtered.length} dari ${facilities.length} fasilitas`;
  }

  // =====================================
  // FORM
  // =====================================

  function closeForm() {
    if (saving) return;

    formVersion++;
    form.reset();

    editingId = null;
    originalImage = null;

    revokePreviewUrl();
    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");

    formSection.hidden = true;
    addButton.setAttribute("aria-expanded", "false");

    formTitle.textContent = "Tambah Fasilitas";
    saveButton.textContent = "Simpan Fasilitas";

    setFormStatus("");
  }

  function showForm() {
    formSection.hidden = false;
    addButton.setAttribute("aria-expanded", "true");

    formSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function openCreateForm() {
    if (saving || deleting) return;

    closeForm();

    branchInput.value =
      branchFilter.value === "gresik"
        ? "1"
        : branchFilter.value === "surabaya"
          ? "2"
          : "";

    typeInput.value = "facility";
    orderInput.value = "0";
    availableInput.checked = true;

    showForm();
    nameInput.focus();
  }

  async function openEditForm(id) {
    if (saving || deleting) return;

    closeForm();

    const version = formVersion;

    const response = await api(
      `${API}/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
      throw new Error(
        await readError(response, "Memuat detail fasilitas")
      );
    }

    const detail = await response.json();

    if (version !== formVersion) return;

    editingId = id;

    nameInput.value = detail.name ?? "";
    branchInput.value = String(detail.branchId ?? "");
    typeInput.value = detail.type ?? "facility";
    orderInput.value = detail.sortOrder ?? 0;
    descriptionInput.value = detail.description ?? "";
    iconInput.value = detail.icon ?? "";
    availableInput.checked = detail.isAvailable === true;

    originalImage = detail.image || null;
    imageInput.value = "";

    updatePreview();

    formTitle.textContent = "Edit Fasilitas";
    saveButton.textContent = "Simpan Perubahan";

    showForm();
  }

  // =====================================
  // SIMPAN
  // =====================================

  async function saveFacility(event) {
    event.preventDefault();

    if (saving || deleting) return;
    if (!form.reportValidity()) return;

    const name = nameInput.value.trim();
    const branchId = Number(branchInput.value);
    const sortOrder = Number(orderInput.value);
    const file = imageInput.files?.[0] || null;

    if (!name) {
      setFormStatus("Nama fasilitas wajib diisi.", true);
      return;
    }

    if (
      !Number.isSafeInteger(branchId) ||
      branchId <= 0
    ) {
      setFormStatus("Pilih cabang fasilitas.", true);
      return;
    }

    if (
      !Number.isSafeInteger(sortOrder) ||
      sortOrder < 0
    ) {
      setFormStatus(
        "Urutan harus bilangan bulat positif atau nol.",
        true
      );
      return;
    }

    try {
      validateImage(file);
    } catch (error) {
      setFormStatus(error.message, true);
      return;
    }

    const editing = editingId !== null;
    const currentId = editingId;

    const payload = {
      branchId,
      name,
      description: descriptionInput.value.trim(),
      image: originalImage,
      icon: iconInput.value.trim() || null,
      type: typeInput.value,
      isAvailable: availableInput.checked,
      sortOrder
    };

    saving = true;

    addButton.disabled = true;
    saveButton.disabled = true;
    closeButton.disabled = true;
    cancelButton.disabled = true;

    saveButton.textContent = "Menyimpan...";
    setFormStatus("Menyiapkan fasilitas...");

    try {
      if (file) {
        setFormStatus("Mengunggah foto...");
        payload.image = await uploadImage(file);
      }

      const headers = await csrfHeaders();

      const endpoint = editing
        ? `${API}/${encodeURIComponent(currentId)}`
        : API;

      setFormStatus("Menyimpan fasilitas...");

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
          await readError(
            response,
            editing ? "Edit fasilitas" : "Tambah fasilitas"
          )
        );
      }

      const message = editing
        ? `Fasilitas "${name}" berhasil diperbarui.`
        : `Fasilitas "${name}" berhasil ditambahkan.`;

      saving = false;
      closeForm();

      branchFilter.value = "";
      searchInput.value = "";

      await loadFacilities();
      setStatus(message);

    } catch (error) {
      setFormStatus(error.message, true);
      console.error(error);

    } finally {
      saving = false;

      addButton.disabled = false;
      saveButton.disabled = false;
      closeButton.disabled = false;
      cancelButton.disabled = false;

      saveButton.textContent =
        editingId !== null
          ? "Simpan Perubahan"
          : "Simpan Fasilitas";
    }
  }

  // =====================================
  // EVENTS
  // =====================================

  branchFilter.addEventListener("change", () => {
    closeForm();
    loadFacilities();
  });

  searchInput.addEventListener("input", renderFacilities);

  addButton.addEventListener("click", () => {
    if (saving || deleting) return;

    if (formSection.hidden) {
      openCreateForm();
    } else {
      closeForm();
    }
  });

  closeButton.addEventListener("click", closeForm);
  cancelButton.addEventListener("click", closeForm);
  form.addEventListener("submit", saveFacility);

  // =====================================
  // START
  // =====================================

  closeForm();
  loadFacilities();
});
