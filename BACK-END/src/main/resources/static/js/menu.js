/* Kammari Café & Roastery — menu.js
   Gabungan dari: menu-data.js, menu.js.
   Gunakan sebagai script biasa, bukan type="module".
*/

/* ============ MULAI: menu-data.js ============ */

/* Alamat API menu.
   - Proyek PHP (versi Anda sekarang) : "../BACKEND/api/menu.php"
   - Proyek Spring Boot (BACK-END/)   : "/api/menu"                          */
const MENU_API = "../BACKEND/api/menu.php";

/* ---------- Data menu ---------- */
const G = "gresik", S = "surabaya";
const CATEGORIES = [];
const MENU = [];
let latestMenuRequest = 0;

async function loadBranchMenu(branch) {
  const requestId = ++latestMenuRequest;

  try {
    const response = await fetch(
      `${MENU_API}?branch=${encodeURIComponent(branch)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Ambil menu dari API menu
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
          "ekstra",
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


/* ============ MULAI: menu.js (halaman menu) ============ */

const menuPage = document.getElementById("menu-page");

if (menuPage) {
  const PER_PAGE = 4;          // maksimal menu tampil per halaman slider
  const SPOT_EVERY = 3500;     // jeda geser spotlight hero (ms)
  const SPOT_SLIDE = 900;      // lama animasi geser (ms) — samakan dengan transition di menu.css

  /* Kategori sesuai tabel menu_categories di database.
     Urutan di sini = urutan sort_order di database.
     Kalau menambah kategori baru di database, tambahkan slug-nya di sini
     (tanpa ini, kategori baru tetap tampil di daftar Makanan). */
  const GROUP_OF = {
    "main-course": "makanan",
    "snack": "makanan",
    "ekstra": "makanan",
    "makanan-penutup": "makanan",
    "combo-makassar": "makanan",
    "combo-penak": "makanan",
    "signature": "minuman",
    "tea-based": "minuman",
    "coffee-based": "minuman",
    "milk-based": "minuman",
    "menu-seasonal": "minuman"
  };
  const SLUG_ORDER = Object.keys(GROUP_OF);
  const groupOf = slug => GROUP_OF[slug] || "makanan";
  const rank = slug => {
    const i = SLUG_ORDER.indexOf(slug);
    return i < 0 ? 99 : i;
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let branch = null;      // null = belum pilih cabang → tampilkan semua menu
  let reqId = 0;
  let items = [];         // semua menu (cabang terpilih / gabungan)
  let query = "";         // kata kunci pencarian
  const groups = {
    makanan: { catIndex: -1, page: 0, cats: [], list: [] },
    minuman: { catIndex: -1, page: 0, cats: [], list: [] }
  };

  /* ---------- Gambar dari folder assets ----------
     Kolom `image` di database berisi path seperti
     "assets/Minuman/signature/oreo-shake.png".
     Jika file tidak ada, <img> dibuang dan bentuk bulat tetap tampil. */
  const imgSrc = p => new URL(p, document.baseURI).href;
  const imgTag = (it, lazy = true) => it.image
    ? `<img src="${esc(imgSrc(it.image))}" alt="${esc(it.name)}"
            ${lazy ? 'loading="lazy"' : ""} decoding="async" onerror="this.remove()">`
    : "";

  /* ---------- Ambil data ---------- */
  async function fetchBranch(b) {
    const res = await fetch(
      `${MENU_API}?branch=${encodeURIComponent(b)}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return (Array.isArray(data.items) ? data.items : []).map(i => ({
      id: Number(i.id),
      cat: i.category_slug,
      catName: i.category_name,
      name: i.name,
      slug: i.slug || "",
      desc: i.description || "",
      price: Number(i.price),
      image: i.image || "",
      available: i.is_available === undefined ? true : Number(i.is_available) !== 0,
      priceVaries: false
    }));
  }

  async function loadMenu() {
    const id = ++reqId;
    const status = $("#menu-status");
    status.hidden = false;
    status.textContent = "Memuat menu...";

    try {
      const lists = await Promise.all(
        (branch ? [branch] : ["gresik", "surabaya"]).map(fetchBranch)
      );
      if (id !== reqId) return;

      // Kalau dua cabang digabung: menu yang sama (kategori + slug) cukup sekali.
      // Jika harganya beda, tampilkan harga terendah dengan label "Mulai".
      const map = new Map();
      lists.flat().forEach(i => {
        const key = i.cat + "|" + (i.slug || i.name.toLowerCase());
        const ex = map.get(key);
        if (!ex) { map.set(key, { ...i }); return; }
        if (i.price !== ex.price) {
          ex.priceVaries = true;
          ex.price = Math.min(ex.price, i.price);
        }
        if (!ex.image && i.image) ex.image = i.image;
      });
      items = [...map.values()];

      status.hidden = true;
    } catch (err) {
      if (id !== reqId) return;
      console.error("Gagal memuat menu:", err);
      items = [];
      status.textContent = "Gagal memuat menu. Periksa koneksi database.";
    }

    buildGroups();
    renderSpot();
    renderHead();
    Object.keys(groups).forEach(k => render(k));
  }

  /* Pencarian: nama, deskripsi, atau nama kategori */
  const matches = i => {
    const q = query.trim().toLowerCase();
    return !q || (i.name + " " + i.desc + " " + i.catName).toLowerCase().includes(q);
  };

  function buildGroups() {
    Object.entries(groups).forEach(([key, g]) => {
      g.list = items
        .filter(i => groupOf(i.cat) === key && matches(i))
        .sort((a, b) => rank(a.cat) - rank(b.cat));   // urutan kategori mengikuti database

      const map = new Map();
      g.list.forEach(i => {
        if (!map.has(i.cat)) map.set(i.cat, { id: i.cat, title: i.catName });
      });
      g.cats = [...map.values()];
      g.catIndex = -1;
      g.page = 0;
    });
  }

  /* ---------- Slider daftar menu ---------- */
  const inCat = (g, c) =>
    c < 0 ? g.list : g.list.filter(i => i.cat === g.cats[c].id);
  const pagesIn = (g, c) =>
    Math.max(1, Math.ceil(inCat(g, c).length / PER_PAGE));

  // Hitung posisi berikutnya. Di akhir kategori → lompat ke kategori sebelah.
  function step(g, dir) {
    const c = g.catIndex, p = g.page;
    if (dir > 0) {
      if (p < pagesIn(g, c) - 1) return { c, p: p + 1 };
      if (c >= 0 && c < g.cats.length - 1) return { c: c + 1, p: 0 };
      return null;
    }
    if (p > 0) return { c, p: p - 1 };
    if (c > 0) return { c: c - 1, p: pagesIn(g, c - 1) - 1 };
    return null;
  }

  function go(key, dir) {
    const g = groups[key];
    const next = step(g, dir);
    if (!next) return;
    g.catIndex = next.c;
    g.page = next.p;
    render(key, dir);
  }

  function itemHTML(it) {
    const price = (it.priceVaries ? "Mulai " : "") + rupiah(it.price);
    return `
      <article class="mi${it.available ? "" : " is-soldout"}">
        <div class="mi__img">${imgTag(it)}</div>
        <h3>${esc(it.name)}</h3>
        <span class="mi__price">${price}</span>
        ${it.available ? "" : `<span class="mi__tag">Habis</span>`}
      </article>`;
  }

  function render(key, dir = 0) {
    const g = groups[key];
    const sec = $(`[data-group="${key}"]`);
    const track = $(".mtrack", sec);

    // Chip kategori (nama dari database)
    $(".mchips", sec).innerHTML =
      `<button class="mchip" data-cat="-1" aria-pressed="${g.catIndex < 0}">Semua</button>` +
      g.cats.map((c, i) =>
        `<button class="mchip" data-cat="${i}" aria-pressed="${g.catIndex === i}">${esc(c.title)}</button>`
      ).join("");

    // Isi (maks. 4 menu per halaman)
    const shown = inCat(g, g.catIndex).slice(g.page * PER_PAGE, (g.page + 1) * PER_PAGE);
    track.className = "mtrack";
    track.innerHTML = shown.length
      ? shown.map(itemHTML).join("")
      : `<p class="mempty">${query.trim() ? "Menu yang dicari tidak ditemukan." : "Belum ada menu."}</p>`;
    if (dir) {
      void track.offsetWidth;   // restart animasi
      track.classList.add(dir > 0 ? "in-next" : "in-prev");
    }

    // Panah
    $$(".mnav", sec).forEach(btn => {
      btn.disabled = !step(g, Number(btn.dataset.dir));
    });
  }

  function initSliders() {
    $$("[data-group]").forEach(sec => {
      const key = sec.dataset.group;

      $$(".mnav", sec).forEach(btn =>
        btn.addEventListener("click", () => go(key, Number(btn.dataset.dir))));

      $(".mchips", sec).addEventListener("click", e => {
        const chip = e.target.closest(".mchip");
        if (!chip) return;
        groups[key].catIndex = Number(chip.dataset.cat);
        groups[key].page = 0;
        render(key);
      });

      // Geser (swipe): kiri = berikutnya, kanan = sebelumnya
      const vp = $(".mviewport", sec);
      let startX = null;
      vp.addEventListener("pointerdown", e => { startX = e.clientX; });
      vp.addEventListener("pointerup", e => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) go(key, dx < 0 ? 1 : -1);
      });
      vp.addEventListener("pointercancel", () => { startX = null; });
    });
  }

  /* ---------- Hero: spotlight foto menu ----------
     Hanya foto (tanpa nama & harga). Foto tengah menjadi sorotan,
     seluruh deret bergeser ke kiri tiap SPOT_EVERY ms. */
  const spotEl = $("#spot");
  const spotTrack = $("#spot-track");
  let spotTimer = null, spotBusy = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Jumlah foto terlihat diatur lewat --n di menu.css (5 desktop, 3 HP)
  const spotN = () => Number.parseInt(getComputedStyle(spotEl).getPropertyValue("--n"), 10) || 5;
  const spotCenter = () => Math.floor(spotN() / 2);

  // Satu menu berfoto per kategori, selang-seling minuman & makanan
  function spotPicks() {
    const withImg = items
      .filter(i => i.image && i.available)
      .sort((a, b) => rank(a.cat) - rank(b.cat));
    const seen = new Set();
    const by = { minuman: [], makanan: [] };
    withImg.forEach(i => {
      if (!seen.has(i.cat)) { seen.add(i.cat); by[groupOf(i.cat)].push(i); }
    });
    const out = [];
    for (let k = 0; k < Math.max(by.minuman.length, by.makanan.length); k++) {
      if (by.minuman[k]) out.push(by.minuman[k]);
      if (by.makanan[k]) out.push(by.makanan[k]);
    }
    withImg.forEach(i => { if (out.length < 10 && !out.includes(i)) out.push(i); });
    return out.slice(0, 10);
  }

  function markCenter() {
    if (!spotTrack) return;
    const c = spotCenter();
    [...spotTrack.children].forEach((el, i) => el.classList.toggle("is-center", i === c));
  }

  function spotNext() {
    if (spotBusy || !spotTrack || spotTrack.children.length <= spotN()) return;
    spotBusy = true;
    const kids = [...spotTrack.children];
    const c = spotCenter();
    kids[c].classList.remove("is-center");        // sorotan pindah ke foto berikutnya
    kids[c + 1].classList.add("is-center");

    spotTrack.style.transition = `transform ${SPOT_SLIDE}ms cubic-bezier(.65,0,.35,1)`;
    spotTrack.style.transform = "translateX(calc(-100% / var(--n)))";   // geser ke kiri satu foto

    setTimeout(() => {                             // pindahkan foto pertama ke belakang → loop mulus
      spotTrack.style.transition = "none";
      spotTrack.appendChild(spotTrack.firstElementChild);
      spotTrack.style.transform = "translateX(0)";
      void spotTrack.offsetWidth;
      spotBusy = false;
    }, SPOT_SLIDE + 30);
  }

  function stopSpot() { clearInterval(spotTimer); spotTimer = null; }
  function startSpot() {
    stopSpot();
    if (reduceMotion.matches || !spotTrack || spotTrack.children.length <= spotN()) return;
    spotTimer = setInterval(spotNext, SPOT_EVERY);
  }

  function renderSpot() {
    if (!spotTrack) return;
    stopSpot();
    spotBusy = false;
    spotTrack.style.transition = "none";
    spotTrack.style.transform = "translateX(0)";

    let list = spotPicks();
    if (!list.length) { spotTrack.innerHTML = ""; return; }
    while (list.length < 8) list = list.concat(list);   // cukup panjang agar loop tidak terlihat patah

    spotTrack.innerHTML = list.map(it =>
      `<div class="spot__item"><div class="spot__photo">${imgTag(it, false)}</div></div>`).join("");
    markCenter();
    startSpot();
  }

  if (spotEl) {
    spotEl.addEventListener("mouseenter", stopSpot);   // jeda saat kursor di atasnya
    spotEl.addEventListener("mouseleave", startSpot);
    document.addEventListener("visibilitychange", () => document.hidden ? stopSpot() : startSpot());
    window.addEventListener("resize", markCenter);
  }

  /* ---------- Kartu "Daftar Menu" (setelah pilih cabang) ---------- */
  const priceK = n => n % 1000 === 0 ? (n / 1000) + "K" : rupiah(n);

  function renderHead() {
    const box = $("#branch-detail");
    box.hidden = !branch;
    if (!branch) return;

    $("#bd-branch").textContent = BRANCH_NAME[branch];

    // Foto latar: menu makanan berfoto pertama (cadangan: menu berfoto mana pun)
    const pick = items.find(i => groupOf(i.cat) === "makanan" && i.image) || items.find(i => i.image);
    $(".mh", box).style.setProperty("--mh-img", pick ? `url("${imgSrc(pick.image)}")` : "none");

    // Ekstra dapur: dari kategori "ekstra", mis. "+ Telur 3K • + Nasi 4K"
    const extras = items.filter(i => i.cat === "ekstra").slice(0, 2);
    $("#mh-extra").hidden = !extras.length;
    $("#mh-extra-list").textContent = extras
      .map(i => `+ ${i.name.split(" ")[0]} ${priceK(i.price)}`)
      .join(" • ");
  }

  function setBranch(b) {
    branch = b;

    // Sinkronkan tombol cabang
    $$("[data-branch]").forEach(btn =>
      btn.setAttribute("aria-pressed", String(btn.dataset.branch === b)));

    // Kosongkan pencarian saat cabang berganti
    query = "";
    const search = $("#menu-search");
    if (search) search.value = "";

    $("#bd-branch").textContent = b ? BRANCH_NAME[b] : "";
    $("#branch-detail").hidden = !b;
    loadMenu();
  }

  function setTab(key) {
    $$(".mtab").forEach(t => t.classList.toggle("is-active", t.dataset.tab === key));
  }

  /* ---------- Event ---------- */
  document.addEventListener("click", e => {
    // Tombol cabang
    const btn = e.target.closest("[data-branch]");
    if (btn) {
      const b = btn.dataset.branch;
      setBranch(b === branch ? null : b);   // klik cabang aktif = batal pilih (tampil semua)
      if (branch) {
        $("#branch-detail").scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    // Tab Makanan / Minuman
    const tab = e.target.closest(".mtab");
    if (tab) setTab(tab.dataset.tab);
  });

  // Kotak cari (tunda sebentar supaya tidak render di setiap ketikan)
  const searchBox = $("#menu-search");
  let searchTimer;
  if (searchBox) {
    searchBox.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        query = searchBox.value;
        buildGroups();
        Object.keys(groups).forEach(k => render(k));
      }, 150);
    });
  }

  initSliders();
  setBranch(null);   // awal: belum pilih cabang → semua menu
}

/* ============ SELESAI: menu.js ============ */