/* Kammari Café & Roastery — menu.js
   Gabungan dari: menu-data.js, menu.js.
   Gunakan sebagai script biasa, bukan type="module".
*/

/* ============ MULAI: menu-data.js ============ */

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

/* ============ SELESAI: menu-data.js ============ */

/* ============ MULAI: menu.js ============ */

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

// Data awal hanya dimuat di halaman Menu.
// Beranda memanggil loadBranchMenu setelah memasang event listener sendiri.
if (menuRoot) {
  loadBranchMenu("gresik");
}

/* ============ SELESAI: menu.js ============ */

