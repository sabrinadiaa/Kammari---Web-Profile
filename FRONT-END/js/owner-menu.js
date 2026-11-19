
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================
  // ELEMEN HALAMAN
  // =========================================

  const $ = (id) => document.getElementById(id);

  const branchSelect = $("branch");
  const searchInput = $("menuSearch");
  const tableBody = $("menu-table-body");
  const menuCount = $("menuCount");
  const statusText = $("status");

  const addButton = $("addMenuButton");
  const addSection = $("addMenuSection");
  const addForm = $("addMenuForm");
  const cancelButton = $("cancelAddMenu");
  const closeButton = $("closeAddMenu");
  const submitButton = $("submitAddMenu");
  const addStatus = $("addMenuStatus");

  const nameInput = $("newMenuName");
  const newBranchSelect = $("newMenuBranch");
  const categorySelect = $("newMenuCategory");
  const priceInput = $("newMenuPrice");
  const descriptionInput = $("newMenuDescription");

  const imageInput = $("newMenuImage");
  const imagePreviewContainer = $("menuImagePreviewContainer");
  const imagePreview = $("menuImagePreview");
  const imageCaption = $("menuImageCaption");

  const availableInput = $("newMenuAvailable");
  const recommendedInput = $("newMenuRecommended");

  const formHeading = addSection?.querySelector(
    ".section-heading h3"
  );

  let menuItems = [];
  let loadVersion = 0;

  let editId = null;
  let originalImage = null;
  let previewObjectUrl = null;

  let saving = false;
  let formVersion = 0;

  // =========================================
  // HELPER API
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

  async function getCsrfHeaders() {
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

    return {
      [csrf.headerName]: csrf.token
    };
  }

  function getErrorMessage(response, action) {
    switch (response.status) {
      case 400:
        return "Data tidak valid. Periksa kembali isian.";
      case 404:
        return "Menu tidak ditemukan.";
      case 409:
        return "Nama menu sudah digunakan pada cabang ini.";
      case 413:
        return "Ukuran foto terlalu besar.";
      case 415:
        return "Format foto tidak didukung.";
      default:
        return `${action} gagal (HTTP ${response.status}).`;
    }
  }

  // =========================================
  // STATUS
  // =========================================

  function setStatus(message) {
    statusText.textContent = message;
  }

  function setFormStatus(message, isError = false) {
    addStatus.textContent = message;

    addStatus.style.color = isError
      ? "#A33C32"
      : "#426A47";
  }

  // =========================================
  // VALIDASI
  // =========================================

  function parsePrice(input) {
    const raw = input.value.trim();
    const price = Number(raw);

    if (
      raw === "" ||
      !/^\d+(\.\d{1,2})?$/.test(raw) ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 99999999.99
    ) {
      throw new Error(
        "Harga harus valid, maksimal 2 angka desimal."
      );
    }

    return price;
  }

  function validateImage(file) {
    if (!file) return;

    const supported = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!supported.includes(file.type)) {
      throw new Error(
        "Foto harus berformat JPG, PNG, atau WebP."
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "Ukuran foto maksimal 5 MB."
      );
    }

    if (file.size === 0) {
      throw new Error(
        "File foto tidak boleh kosong."
      );
    }
  }

  // =========================================
  // FOTO MENU & PREVIEW
  // =========================================

  function clearPreview() {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }

    imagePreview.removeAttribute("src");
    imagePreviewContainer.hidden = true;
    imageCaption.textContent = "";
  }

  function showImagePreview(src, caption) {
    imagePreview.src = src;
    imagePreviewContainer.hidden = false;
    imageCaption.textContent = caption || "";
  }

  function previewExistingImage(path) {
    clearPreview();

    if (!path) return;

    // Path foto lama dipertahankan sebagaimana
    // tersimpan di database.
    showImagePreview(path, "Foto saat ini");
  }

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    clearPreview();

    if (!file) {
      previewExistingImage(originalImage);
      return;
    }

    try {
      validateImage(file);

      previewObjectUrl = URL.createObjectURL(file);

      showImagePreview(
        previewObjectUrl,
        file.name
      );

      setFormStatus("");

    } catch (error) {
      imageInput.value = "";
      previewExistingImage(originalImage);
      setFormStatus(error.message, true);
    }
  });

  // =========================================
  // UPLOAD FOTO KE SPRING BOOT
  // =========================================

  async function uploadImage(file) {
    validateImage(file);

    const csrfHeaders = await getCsrfHeaders();

    const formData = new FormData();
    formData.append("file", file);

    const response = await api(
      "/api/owner/menu-images",
      {
        method: "POST",
        headers: csrfHeaders,
        body: formData
      }
    );

    // Jangan menetapkan Content-Type manual
    // untuk multipart/form-data.

    if (!response.ok) {
      throw new Error(
        getErrorMessage(response, "Upload foto")
      );
    }

    const result = await response.json();

    if (
      typeof result.image !== "string" ||
      !result.image.startsWith("/uploads/menu/")
    ) {
      throw new Error(
        "Respons upload foto tidak valid."
      );
    }

    return result.image;
  }

  // =========================================
  // LOAD MENU
  // =========================================

  async function loadMenus() {
    const version = ++loadVersion;
    const branch = branchSelect.value;

    menuItems = [];
    tableBody.replaceChildren();
    menuCount.textContent = "Memuat menu...";
    setStatus("");

    try {
      const response = await api(
        `/api/owner/menus?branch=${encodeURIComponent(branch)}`
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(response, "Mengambil menu")
        );
      }

      const data = await response.json();

      if (version !== loadVersion) return;

      if (!Array.isArray(data.items)) {
        throw new Error(
          "Format daftar menu tidak sesuai."
        );
      }

      menuItems = data.items;
      renderMenus();

    } catch (error) {
      if (version !== loadVersion) return;

      menuCount.textContent = "Gagal memuat menu";
      setStatus(error.message);
      console.error(error);
    }
  }

  // =========================================
  // BUAT TOMBOL
  // =========================================

  function makeButton(label, className) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = className;
    button.textContent = label;

    return button;
  }

  // =========================================
  // RENDER BARIS MENU
  // =========================================

  function renderRow(item, branch) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.className = "menu-name";
    nameCell.textContent = item.name;

    const priceCell = document.createElement("td");

    const actionCell = document.createElement("td");
    actionCell.className = "menu-row-actions";

    const priceField = document.createElement("input");
    priceField.type = "number";
    priceField.className = "price-input";
    priceField.min = "0";
    priceField.max = "99999999.99";
    priceField.step = "0.01";
    priceField.value = item.price;

    priceField.setAttribute(
      "aria-label",
      `Harga ${item.name}`
    );

    const savePriceButton = makeButton(
      "Simpan",
      "save-button"
    );

    const editButton = makeButton(
      "Edit",
      "secondary-button"
    );

    const deleteButton = makeButton(
      "Hapus",
      "delete-button"
    );

    priceCell.appendChild(priceField);

    actionCell.append(
      savePriceButton,
      editButton,
      deleteButton
    );

    row.append(nameCell, priceCell, actionCell);

    // =====================================
    // EDIT HARGA LANGSUNG
    // =====================================

    savePriceButton.addEventListener(
      "click",
      async () => {
        let price;

        try {
          price = parsePrice(priceField);
        } catch (error) {
          setStatus(error.message);
          priceField.focus();
          return;
        }

        savePriceButton.disabled = true;
        savePriceButton.textContent = "Menyimpan...";

        try {
          const csrf = await getCsrfHeaders();

          const response = await api(
            `/api/owner/menus/${encodeURIComponent(item.id)}?branch=${encodeURIComponent(branch)}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                ...csrf
              },
              body: JSON.stringify({ price })
            }
          );

          if (!response.ok) {
            throw new Error(
              getErrorMessage(response, "Ubah harga")
            );
          }

          item.price = price;

          setStatus(
            `Harga ${item.name} berhasil diperbarui.`
          );

        } catch (error) {
          setStatus(error.message);

        } finally {
          savePriceButton.disabled = false;
          savePriceButton.textContent = "Simpan";
        }
      }
    );

    // =====================================
    // EDIT MENU LENGKAP
    // =====================================

    editButton.addEventListener(
      "click",
      async () => {
        try {
          await openEditForm(item.id, branch);
        } catch (error) {
          setStatus(error.message);
        }
      }
    );

    // =====================================
    // HAPUS MENU (SOFT DELETE)
    // =====================================

    deleteButton.addEventListener(
      "click",
      async () => {
        const confirmed = window.confirm(
          `Nonaktifkan menu "${item.name}"?\n\n` +
          "Menu tidak akan tampil sebagai menu aktif."
        );

        if (!confirmed) return;

        deleteButton.disabled = true;
        deleteButton.textContent = "Menghapus...";

        try {
          const csrf = await getCsrfHeaders();

          const response = await api(
            `/api/owner/menus/${encodeURIComponent(item.id)}?branch=${encodeURIComponent(branch)}`,
            {
              method: "DELETE",
              headers: csrf
            }
          );

          if (!response.ok) {
            throw new Error(
              getErrorMessage(response, "Hapus menu")
            );
          }

          if (editId === item.id) {
            closeForm();
          }

          await loadMenus();

          setStatus(
            `Menu "${item.name}" berhasil dinonaktifkan.`
          );

        } catch (error) {
          setStatus(error.message);

        } finally {
          deleteButton.disabled = false;
          deleteButton.textContent = "Hapus";
        }
      }
    );

    return row;
  }

  // =========================================
  // FILTER & RENDER
  // =========================================

  function renderMenus() {
    const keyword = searchInput.value
      .trim()
      .toLowerCase();

    const branch = branchSelect.value;

    const filtered = menuItems.filter((item) =>
      String(item.name)
        .toLowerCase()
        .includes(keyword)
    );

    tableBody.replaceChildren();

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 3;
      cell.className = "empty-state";

      cell.textContent = keyword
        ? "Menu tidak ditemukan."
        : "Belum ada menu aktif.";

      row.appendChild(cell);
      tableBody.appendChild(row);

    } else {
      tableBody.append(
        ...filtered.map((item) =>
          renderRow(item, branch)
        )
      );
    }

    menuCount.textContent =
      `${filtered.length} dari ${menuItems.length} menu`;
  }

  // =========================================
  // KATEGORI MENU
  // =========================================

  async function loadCategories() {
    categorySelect.disabled = true;

    categorySelect.replaceChildren(
      new Option("Memuat kategori...", "")
    );

    const response = await api(
      "/api/owner/menu-categories"
    );

    if (!response.ok) {
      throw new Error(
        getErrorMessage(response, "Mengambil kategori")
      );
    }

    const categories = await response.json();

    if (!Array.isArray(categories)) {
      throw new Error(
        "Format kategori tidak sesuai."
      );
    }

    categorySelect.replaceChildren(
      new Option("Pilih kategori", "")
    );

    categories.forEach((category) => {
      categorySelect.add(
        new Option(
          category.name,
          String(category.id)
        )
      );
    });

    categorySelect.disabled = categories.length === 0;

    if (categories.length === 0) {
      throw new Error(
        "Tidak ada kategori menu aktif."
      );
    }
  }

  // =========================================
  // FORM TAMBAH / EDIT
  // =========================================

  function closeForm() {
    if (saving) return;

    formVersion++;

    addSection.hidden = true;
    addButton.setAttribute("aria-expanded", "false");

    addForm.reset();

    editId = null;
    originalImage = null;

    newBranchSelect.disabled = false;
    availableInput.checked = true;
    recommendedInput.checked = false;

    clearPreview();
    setFormStatus("");

    submitButton.textContent = "Simpan Menu";
  }

  function showForm() {
    addSection.hidden = false;

    addButton.setAttribute("aria-expanded", "true");

    addSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // =========================================
  // TAMBAH MENU
  // =========================================

  async function openCreateForm() {
    if (saving) return;

    closeForm();

    const version = formVersion;

    formHeading.textContent = "Tambah Menu Baru";
    submitButton.textContent = "Simpan Menu";

    newBranchSelect.value = branchSelect.value;
    newBranchSelect.disabled = false;

    availableInput.checked = true;
    recommendedInput.checked = false;

    showForm();

    try {
      await loadCategories();
    } catch (error) {
      if (version === formVersion) {
        setFormStatus(error.message, true);
      }
    }

    if (version === formVersion) {
      nameInput.focus();
    }
  }

  // =========================================
  // EDIT MENU LAMA
  // =========================================

  async function openEditForm(id, branch) {
    if (saving) return;

    closeForm();

    const version = formVersion;

    const response = await api(
      `/api/owner/menus/${encodeURIComponent(id)}?branch=${encodeURIComponent(branch)}`
    );

    if (!response.ok) {
      throw new Error(
        getErrorMessage(response, "Mengambil detail menu")
      );
    }

    const detail = await response.json();

    if (version !== formVersion) return;

    editId = id;

    formHeading.textContent = "Edit Menu";
    submitButton.textContent = "Simpan Perubahan";

    nameInput.value = detail.name ?? "";
    priceInput.value = detail.price ?? "";
    descriptionInput.value = detail.description ?? "";

    newBranchSelect.value = branch;
    newBranchSelect.disabled = true;

    originalImage = detail.image || null;

    availableInput.checked =
      detail.isAvailable === true;

    recommendedInput.checked =
      detail.isRecommended === true;

    previewExistingImage(originalImage);

    showForm();

    try {
      await loadCategories();

      if (version !== formVersion) return;

      categorySelect.value = String(
        detail.categoryId
      );

      if (!categorySelect.value) {
        setFormStatus(
          "Kategori lama tidak aktif. Pilih kategori baru.",
          true
        );
      }

    } catch (error) {
      if (version === formVersion) {
        setFormStatus(error.message, true);
      }
    }
  }

  // =========================================
  // SIMPAN TAMBAH / EDIT MENU
  // =========================================

  async function saveForm(event) {
    event.preventDefault();

    if (saving) return;

    if (!addForm.reportValidity()) return;

    const name = nameInput.value.trim();
    const branch = newBranchSelect.value;
    const categoryId = Number(categorySelect.value);
    const description = descriptionInput.value.trim();

    if (!name) {
      setFormStatus(
        "Nama menu wajib diisi.",
        true
      );
      nameInput.focus();
      return;
    }

    if (
      !Number.isSafeInteger(categoryId) ||
      categoryId <= 0
    ) {
      setFormStatus(
        "Pilih kategori menu.",
        true
      );
      categorySelect.focus();
      return;
    }

    let price;

    try {
      price = parsePrice(priceInput);
    } catch (error) {
      setFormStatus(error.message, true);
      priceInput.focus();
      return;
    }

    const file = imageInput.files?.[0] || null;

    try {
      validateImage(file);
    } catch (error) {
      setFormStatus(error.message, true);
      return;
    }

    const editing = editId !== null;
    const currentId = editId;

    saving = true;

    submitButton.disabled = true;
    cancelButton.disabled = true;

    if (closeButton) {
      closeButton.disabled = true;
    }

    addButton.disabled = true;

    submitButton.textContent = "Menyimpan...";
    setFormStatus("Menyimpan menu...");

    try {
      // Pertahankan gambar lama jika
      // Owner tidak memilih gambar baru.
      let image = originalImage;

      // Upload gambar baru terlebih dahulu.
      if (file) {
        setFormStatus("Mengunggah foto...");

        image = await uploadImage(file);
      }

      const csrf = await getCsrfHeaders();

      const endpoint = editing
        ? `/api/owner/menus/${encodeURIComponent(currentId)}?branch=${encodeURIComponent(branch)}`
        : "/api/owner/menus";

      const response = await api(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...csrf
        },
        body: JSON.stringify({
          name,
          branch,
          categoryId,
          description,
          price,
          image,
          isAvailable: availableInput.checked,
          isRecommended: recommendedInput.checked
        })
      });

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            response,
            editing ? "Edit menu" : "Tambah menu"
          )
        );
      }

      const message = editing
        ? `Menu "${name}" berhasil diperbarui.`
        : `Menu "${name}" berhasil ditambahkan.`;

      saving = false;
      closeForm();

      branchSelect.value = branch;
      searchInput.value = "";

      await loadMenus();

      setStatus(message);

    } catch (error) {
      setFormStatus(error.message, true);
      console.error("Gagal menyimpan menu:", error);

    } finally {
      saving = false;

      submitButton.disabled = false;
      cancelButton.disabled = false;
      addButton.disabled = false;

      if (closeButton) {
        closeButton.disabled = false;
      }

      submitButton.textContent =
        editId !== null
          ? "Simpan Perubahan"
          : "Simpan Menu";
    }
  }

  // =========================================
  // EVENT LISTENERS
  // =========================================

  branchSelect.addEventListener("change", () => {
    closeForm();
    loadMenus();
  });

  searchInput.addEventListener(
    "input",
    renderMenus
  );

  addButton.addEventListener("click", () => {
    if (saving) return;

    if (!addSection.hidden && editId === null) {
      closeForm();
    } else {
      openCreateForm();
    }
  });

  cancelButton.addEventListener("click", closeForm);

  if (closeButton) {
    closeButton.addEventListener("click", closeForm);
  }

  addForm.addEventListener("submit", saveForm);

  // =========================================
  // INITIALIZATION
  // =========================================

  closeForm();
  loadMenus();
});
