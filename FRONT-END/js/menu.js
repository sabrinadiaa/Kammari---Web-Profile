/* Kammari Café & Roastery — menu.js
   Gabungan dari: menu-data.js, menu.js.
   Gunakan sebagai script biasa, bukan type="module".
*/

/* ============ MULAI: menu-data.js ============ */

/* Alamat API menu (Spring Boot: MenuController → GET /api/menu?branch=gresik|surabaya) */
const MENU_API = "/api/menu";

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
  const AUTO_EVERY = 3000;     // jeda geser daftar menu (ms) = 3 detik
  const SLIDE_MS = 700;        // lama animasi daftar menu — samakan dengan .mc di menu.css
  const SPOT_EVERY = 2500;     // jeda geser spotlight hero (ms)
  const SPOT_SLIDE = 600;      // lama animasi spotlight — samakan dengan .spot__photo di menu.css

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

  let branch = null;
  let reqId = 0;
  let items = [];
  let query = "";
  const groups = {
    makanan: { catIndex: -1, cats: [], list: [], view: [], center: 0, busy: false, paused: false },
    minuman: { catIndex: -1, cats: [], list: [], view: [], center: 0, busy: false, paused: false }
  };

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

  const matches = i => {
    const q = query.trim().toLowerCase();
    return !q || (i.name + " " + i.desc + " " + i.catName).toLowerCase().includes(q);
  };

  function buildGroups() {
    Object.entries(groups).forEach(([key, g]) => {
      g.list = items
        .filter(i => groupOf(i.cat) === key && matches(i))
        .sort((a, b) => rank(a.cat) - rank(b.cat));

      const map = new Map();
      g.list.forEach(i => {
        if (!map.has(i.cat)) map.set(i.cat, { id: i.cat, title: i.catName });
      });
      g.cats = [...map.values()];
      g.catIndex = -1;
    });
  }

  /* ---------- Carousel daftar menu (melingkar, 5 menu terlihat) ----------
     Tiap menu punya posisi relatif ke menu tengah: 0 = tengah (sorotan),
     ±1 dan ±2 = kiri/kanan (agak blur). Lebih dari ±2 disembunyikan. */
  const inCat = (g, c) => c < 0 ? g.list : g.list.filter(i => i.cat === g.cats[c].id);

  const rel = (i, c, n) => {
    let o = (((i - c) % n) + n) % n;
    if (o > Math.floor(n / 2)) o -= n;
    return o;
  };
  const bucket = o => (o < -2 ? "l" : o > 2 ? "r" : String(o));

  function setNow(el, o) {                 // pindah tanpa animasi
    el.style.transition = "none";
    el.dataset.o = bucket(o);
    void el.offsetWidth;
    el.style.transition = "";
  }

  function place(key, init = false, steps = 1) {
    const g = groups[key];
    const sec = $(`[data-group="${key}"]`);
    const n = g.view.length;
    const wrapAt = steps > 1 ? 2 : 1;

    $$(".mc", sec).forEach(el => {
      const o = rel(Number(el.dataset.i), g.center, n);
      const prev = el._o === undefined ? o : el._o;
      clearTimeout(el._tp);

      if (init) {
        setNow(el, o);
      } else if (Math.abs(o - prev) > wrapAt) {
        el.dataset.o = prev < o ? "l" : "r";
        el._tp = setTimeout(() => setNow(el, o), SLIDE_MS + 20);
      } else {
        el.dataset.o = bucket(o);
      }
      el._o = o;
    });
  }

  function go(key, dir) {
    const g = groups[key];
    const n = g.view.length;
    if (n < 2 || g.busy) return;
    g.busy = true;
    setTimeout(() => { g.busy = false; }, SLIDE_MS + 40);
    g.center = (g.center + dir + n) % n;
    place(key);
  }

  function goTo(key, index) {
    const g = groups[key];
    const n = g.view.length;
    if (n < 2 || g.busy || index === g.center) return;
    const steps = Math.abs(rel(index, g.center, n));
    g.busy = true;
    setTimeout(() => { g.busy = false; }, SLIDE_MS + 40);
    g.center = index;
    place(key, false, steps);
  }

  function itemHTML(it, i) {
    const price = (it.priceVaries ? "Mulai " : "") + rupiah(it.price);
    return `
      <article class="mi mc${it.available ? "" : " is-soldout"}" data-i="${i}">
        <div class="mi__img">${imgTag(it)}</div>
        <h3>${esc(it.name)}</h3>
        <span class="mi__price">${price}</span>
        ${it.available ? "" : `<span class="mi__tag">Habis</span>`}
      </article>`;
  }

  function render(key) {
    const g = groups[key];
    const sec = $(`[data-group="${key}"]`);
    const track = $(".mtrack", sec);

    $(".mchips", sec).innerHTML =
      `<button class="mchip" data-cat="-1" aria-pressed="${g.catIndex < 0}">Semua</button>` +
      g.cats.map((c, i) =>
        `<button class="mchip" data-cat="${i}" aria-pressed="${g.catIndex === i}">${esc(c.title)}</button>`
      ).join("");

    g.view = inCat(g, g.catIndex);
    g.center = 0;
    track.classList.toggle("is-empty", !g.view.length);
    track.innerHTML = g.view.length
      ? g.view.map(itemHTML).join("")
      : `<p class="mempty">${query.trim() ? "Menu yang dicari tidak ditemukan." : "Belum ada menu."}</p>`;

    if (g.view.length) place(key, true);
    $$(".mnav", sec).forEach(btn => { btn.disabled = g.view.length < 2; });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initSliders() {
    $$("[data-group]").forEach(sec => {
      const key = sec.dataset.group;
      const g = groups[key];

      $$(".mnav", sec).forEach(btn =>
        btn.addEventListener("click", () => go(key, Number(btn.dataset.dir))));
      
      // Klik menu di kiri/kanan → menu itu pindah ke tengah
      $(".mtrack", sec).addEventListener("click", e => {
        const card = e.target.closest(".mc");
        if (!card || card.dataset.o === "0") return;
        goTo(key, Number(card.dataset.i));
      });

      $(".mchips", sec).addEventListener("click", e => {
        const chip = e.target.closest(".mchip");
        if (!chip) return;
        g.catIndex = Number(chip.dataset.cat);
        render(key);
      });

      // Geser (swipe)
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

  /* ---------- Hero: spotlight foto menu ---------- */
  const spotEl = $("#spot");
  const spotTrack = $("#spot-track");
  const spotDots = $("#spot-dots");
  let spotTimer = null, spotBusy = false, spotIdx = 0, spotLen = 0;

  const spotN = () => Number.parseInt(getComputedStyle(spotEl).getPropertyValue("--n"), 10) || 3;
  const spotCenter = () => Math.floor(spotN() / 2);

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

  function updateDots() {
    if (!spotDots || !spotLen) return;
    const a = ((spotIdx % spotLen) + spotLen) % spotLen;
    [...spotDots.children].forEach((d, i) => d.classList.toggle("is-active", i === a));
  }

  function spotMove(dir) {
    if (spotBusy || !spotTrack || spotTrack.children.length <= spotN()) return;
    spotBusy = true;
    spotIdx += dir;
    updateDots();

    if (dir > 0) {
      const kids = [...spotTrack.children];
      const c = spotCenter();
      kids[c].classList.remove("is-center");
      kids[c + 1].classList.add("is-center");

      spotTrack.style.transition = `transform ${SPOT_SLIDE}ms cubic-bezier(.65,0,.35,1)`;
      spotTrack.style.transform = "translateX(calc(-100% / var(--n)))";

      setTimeout(() => {
        spotTrack.style.transition = "none";
        spotTrack.appendChild(spotTrack.firstElementChild);
        spotTrack.style.transform = "translateX(0)";
        void spotTrack.offsetWidth;
        spotBusy = false;
      }, SPOT_SLIDE + 30);
    } else {
      spotTrack.style.transition = "none";
      spotTrack.insertBefore(spotTrack.lastElementChild, spotTrack.firstElementChild);
      spotTrack.style.transform = "translateX(calc(-100% / var(--n)))";
      void spotTrack.offsetWidth;
      markCenter();
      spotTrack.style.transition = `transform ${SPOT_SLIDE}ms cubic-bezier(.65,0,.35,1)`;
      spotTrack.style.transform = "translateX(0)";
      setTimeout(() => { spotBusy = false; }, SPOT_SLIDE + 30);
    }
  }

  function stopSpot() { clearInterval(spotTimer); spotTimer = null; }
  function startSpot() {
    stopSpot();
    if (reduceMotion.matches || !spotTrack || spotTrack.children.length <= spotN()) return;
    spotTimer = setInterval(() => spotMove(1), SPOT_EVERY);
  }

  function renderSpot() {
    if (!spotTrack) return;
    stopSpot();
    spotBusy = false;
    spotTrack.style.transition = "none";
    spotTrack.style.transform = "translateX(0)";

    const base = spotPicks();
    if (!base.length) {
      spotTrack.innerHTML = "";
      if (spotDots) spotDots.innerHTML = "";
      return;
    }
    spotLen = base.length;
    spotIdx = 0;

    let list = base;
    while (list.length < 8) list = list.concat(base);

    // Susun supaya foto pertama berada di posisi tengah
    const total = list.length, c = spotCenter();
    const ordered = list.map((_, p) => list[(p - c + total) % total]);

    spotTrack.innerHTML = ordered.map(it =>
      `<div class="spot__item"><div class="spot__photo">${imgTag(it, false)}</div></div>`).join("");
    if (spotDots) {
      spotDots.innerHTML = base.map(() => `<span class="spot__dot"></span>`).join("");
    }
    markCenter();
    updateDots();
    startSpot();
  }

  if (spotEl) {
    spotEl.addEventListener("mouseenter", stopSpot);
    spotEl.addEventListener("mouseleave", startSpot);
    document.addEventListener("visibilitychange", () => document.hidden ? stopSpot() : startSpot());
    window.addEventListener("resize", markCenter);

    const manual = dir => { spotMove(dir); startSpot(); };
    $("#spot-prev")?.addEventListener("click", () => manual(-1));
    $("#spot-next")?.addEventListener("click", () => manual(1));
  }

  /* ---------- Kartu "Daftar Menu" (setelah pilih cabang) ---------- */
  function renderHead() {
    const box = $("#branch-detail");
    box.hidden = !branch;
    if (!branch) return;
    $("#bd-branch").textContent = BRANCH_NAME[branch];
  }

  function setBranch(b) {
    branch = b;

    $$("[data-branch]").forEach(btn =>
      btn.setAttribute("aria-pressed", String(btn.dataset.branch === b)));

    query = "";
    const search = $("#menu-search");
    if (search) search.value = "";

    $("#bd-branch").textContent = b ? BRANCH_NAME[b] : "";
    $("#branch-detail").hidden = !b;
    loadMenu();
  }

  /* ---------- Event ---------- */
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-branch]");
    if (btn) {
      const b = btn.dataset.branch;
      setBranch(b === branch ? null : b);
      if (branch) {
        $("#branch-detail").scrollIntoView({ behavior: "smooth", block: "start" });
      }
     }
  });

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
  setBranch(null);
}

/* ============ SELESAI: menu.js ============ */