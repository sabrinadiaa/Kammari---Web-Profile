/* Kammari Café & Roastery — menu.js (script biasa, bukan type="module")
   API: GET /api/menu?branch=gresik|surabaya */
   
window.MENU = window.MENU || [];
window.CATEGORIES = window.CATEGORIES || [];

let latestMenuRequest = 0;

window.loadBranchMenu = async function (branch = "gresik") {
  const requestId = ++latestMenuRequest;

  try {
    const response = await fetch(
      `/api/menu?branch=${encodeURIComponent(branch)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (requestId !== latestMenuRequest) return;

    const items = Array.isArray(data.items)
      ? data.items
      : [];

    const categories = new Map();

    items.forEach(item => {
      if (!categories.has(item.category_slug)) {
        categories.set(item.category_slug, {
          id: item.category_slug,
          title: item.category_name,
          note: item.category_description || ""
        });
      }
    });

    window.CATEGORIES.splice(
      0,
      window.CATEGORIES.length,
      ...categories.values()
    );

    window.MENU.splice(
      0,
      window.MENU.length,
      ...items.map(item => ({
        id: Number(item.id),
        cat: item.category_slug,
        name: item.name,
        desc: item.description || "",
        price: Number(item.price) || 0,
        image: item.image || "",
        b: [branch],
        mood: ["main-course", "snack", "makanan-penutup"]
          .includes(item.category_slug)
            ? ["lapar", "santai"]
            : ["santai", "fokus"]
      }))
    );

    document.dispatchEvent(
      new CustomEvent("kammari-menu-loaded", {
        detail: { branch }
      })
    );

    console.log("Menu berhasil dimuat:", window.MENU.length);

  } catch (error) {
    console.error("Gagal memuat menu:", error);

    document.dispatchEvent(
      new CustomEvent("kammari-menu-error", {
        detail: { branch }
      })
    );
  }
};

/* Helper untuk kartu rekomendasi */
if (typeof window.dishCard !== "function") {
  window.dishCard = function (item) {
    const escapeHTML = value =>
      String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);

    const image = item.image
      ? `style="--src: url('${new URL(
          item.image,
          document.baseURI
        ).href.replace(/'/g, "%27")}')"`
      : "";

    return `
      <article class="dish">
        <figure class="photo arch"
                role="img"
                aria-label="Foto ${escapeHTML(item.name)}"
                ${image}>
          <figcaption>${escapeHTML(item.name)}</figcaption>
        </figure>

        <div class="dish__top">
          <h3>${escapeHTML(item.name)}</h3>
          <span class="price">
            Rp ${Number(item.price).toLocaleString("id-ID")}
          </span>
        </div>

        <p>${escapeHTML(item.desc)}</p>
      </article>
    `;
  };
}

(() => {
  if (document.body.dataset.page !== "menu") return;

  const MENU_API = "/api/menu";
  const BRANCH_NAME = { gresik: "Gresik", surabaya: "Surabaya" };
  const GROUP_OF = {
    "main-course": "makanan", "snack": "makanan", "ekstra": "makanan", "makanan-penutup": "makanan",
    "combo-makassar": "makanan", "combo-penak": "makanan",
    "signature": "minuman", "tea-based": "minuman", "coffee-based": "minuman", "milk-based": "minuman", "menu-seasonal": "minuman"
  };
  const ORDER = Object.keys(GROUP_OF);
  const rank = s => { const i = ORDER.indexOf(s); return i < 0 ? 99 : i; };
  const groupOf = s => GROUP_OF[s] || "makanan";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rupiah = n => "Rp " + Number(n).toLocaleString("id-ID");

  function imageUrl(value) {
    const path = String(value || "").trim().replace(/\\/g, "/")
      .replace(/^(\.\/)+/, "").replace(/^\/?FRONT-END\//i, "").replace(/^\/+/, "");
    if (!path.startsWith("assets/") || path.split("/").includes("..")) return "";
    try { return new URL(path, document.baseURI).href; } catch { return ""; }
  }
  const imgTag = it => it.image
    ? `<img src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy" decoding="async" onerror="this.remove()">` : "";

  let branch = null, reqId = 0, items = [], query = "";

  /* ---------- Data ---------- */
  async function fetchBranch(b) {
    const res = await fetch(`${MENU_API}?branch=${encodeURIComponent(b)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return (Array.isArray(data.items) ? data.items : []).map(i => ({
      id: Number(i.id), cat: i.category_slug, catName: i.category_name, name: i.name, slug: i.slug || "",
      desc: i.description || "", price: Number(i.price), image: imageUrl(i.image),
      available: i.is_available === undefined ? true : Number(i.is_available) !== 0, varies: false
    }));
  }

  async function loadMenu() {
    const id = ++reqId, status = $("#menu-status");
    status.hidden = false;
    status.textContent = "Memuat menu...";
    try {
      const results = await Promise.allSettled(
        (branch ? [branch] : ["gresik", "surabaya"]).map(fetchBranch)
    );
      const lists = results.filter(r => r.status === "fulfilled").map(r => r.value);
      if (!lists.length) throw new Error("Semua cabang gagal dimuat");
      if (id !== reqId) return;
      const map = new Map();
      lists.flat().forEach(i => {
        const key = i.cat + "|" + (i.slug || i.name.toLowerCase());
        const ex = map.get(key);
        if (!ex) return map.set(key, { ...i });
        if (i.price !== ex.price) { ex.varies = true; ex.price = Math.min(ex.price, i.price); }
        if (!ex.image && i.image) ex.image = i.image;
      });
      items = [...map.values()].sort((a, b) => rank(a.cat) - rank(b.cat));
      status.hidden = true;
    } catch (err) {
      if (id !== reqId) return;
      console.error("Gagal memuat menu:", err);
      items = [];
      status.textContent = "Gagal memuat menu. Periksa API dan database.";
    }
    renderLists();
    buildCircles();
  }

  /* ---------- Daftar menu (vertikal, per kategori) ---------- */
  const matches = i => {
    const q = query.trim().toLowerCase();
    return !q || (i.name + " " + i.desc + " " + i.catName).toLowerCase().includes(q);
  };

  function rowHTML(it) {
    return `<li class="mrow${it.available ? "" : " is-soldout"}">
      <button type="button" class="mrow__btn" data-id="${it.id}">
        <span class="mrow__pic">${imgTag(it)}</span>
        <h4>${esc(it.name)}${it.available ? "" : ' <span class="dish__tag">Habis</span>'}</h4>
        <span class="mrow__price">${it.varies ? "Mulai " : ""}${rupiah(it.price)}</span>
        <p class="mrow__desc">${esc(it.desc)}</p>
      </button></li>`;
  }

/* Menandai kategori yang sedang terlihat */
let io;

function observeCats() {
  if (io) io.disconnect();

  const links = $$("#menu-category-nav a");

  if (!links.length) return;

  const barHeight =
    parseInt(
      getComputedStyle(document.body)
        .getPropertyValue("--bar-h"),
      10
    ) || 190;

  io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        links.forEach(link => {
          link.setAttribute(
            "aria-current",
            String(link.hash === "#" + entry.target.id)
          );
        });
      });
    },
    {
      rootMargin: `-${barHeight + 10}px 0px -60% 0px`
    }
  );

  $$(".mcat").forEach(category => io.observe(category));
}

  
/* ---------- Daftar menu per kelompok ---------- */

function renderLists() {
  const categoryGroups = {
    makanan: [],
    minuman: []
  };

  ["makanan", "minuman"].forEach(key => {
    const list = items.filter(
      item => groupOf(item.cat) === key && matches(item)
    );

    const byCat = new Map();

    list.forEach(item => {
      if (!byCat.has(item.cat)) {
        byCat.set(item.cat, {
          name: item.catName,
          rows: []
        });
      }

      byCat.get(item.cat).rows.push(item);
    });

    const categories = [...byCat];

    const container = $(`#menu-${key} .mlist`);

    if (!container) return;

    container.innerHTML = categories.length
      ? categories.map(([slug, category]) => {
          categoryGroups[key].push({
            slug,
            name: category.name
          });

          return `
            <div class="mcat" id="cat-${esc(slug)}">
              <h3>${esc(category.name)}</h3>
              <ul class="mcat__items">
                ${category.rows.map(rowHTML).join("")}
              </ul>
            </div>
          `;
        }).join("")
      : `
        <p class="mlist__empty">
          ${query.trim()
            ? "Menu yang dicari tidak ditemukan."
            : "Belum ada menu."}
        </p>
      `;

    const count = $(`#menu-${key} [data-count]`);

    if (count) {
      count.textContent =
        `${key === "makanan" ? "Makanan" : "Minuman"} · ${list.length} menu`;
    }

    // Navigasi kategori masing-masing kelompok
    const nav = $(`#menu-cats-${key}`);

    if (nav) {
      nav.innerHTML = categoryGroups[key].map(category => `
        <a
          class="mchip"
          href="#cat-${esc(category.slug)}"
          aria-current="false">
          ${esc(category.name)}
        </a>
      `).join("");
    }
  });

  observeCats();
}


  /* ---------- Lightbox detail ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "kg-lightbox";
  dialog.innerHTML = `<button type="button" class="kg-lightbox__close" aria-label="Tutup">×</button><img alt="" hidden><h3></h3><p></p><span class="dish__price"></span>`;
  document.body.appendChild(dialog);
  dialog.addEventListener("click", e => { if (e.target === dialog || e.target.closest(".kg-lightbox__close")) dialog.close(); });

  document.addEventListener("click", e => {
    const btn = e.target.closest(".mrow__btn");
    const it = btn && items.find(i => i.id === Number(btn.dataset.id));
    if (!it) return;
    const img = $("img", dialog);
    img.hidden = !it.image;
    if (it.image) { img.src = it.image; img.alt = it.name; }
    $("h3", dialog).textContent = it.name;
    $("p", dialog).textContent = it.desc;
    $(".dish__price", dialog).textContent = (it.varies ? "Mulai " : "") + rupiah(it.price) + (it.available ? "" : " · Habis");
    dialog.showModal();
  });

  /* ---------- CTA: tiga lingkaran foto ---------- */
  function buildCircles() {
    const pics = [...new Set(items.filter(i => i.image).map(i => i.image))].slice(-3);
    $("#cta-circles").innerHTML = pics.map(src => `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()">`).join("");
  }

  /* ---------- Cabang & pencarian ---------- */
  
function setBranch(b) {
  branch = b;

  $$("[data-branch]").forEach(btn => {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.branch === b)
    );
  });

  const label = $("#menu-branch-label");

  if (label) {
    label.textContent = b
      ? `Menampilkan menu cabang ${BRANCH_NAME[b]}`
      : "Menampilkan menu semua cabang";
  }

  query = "";

  const search = $("#menu-search");

  if (search) search.value = "";

  loadMenu();
}


  
document.addEventListener("click", e => {
  const btn = e.target.closest(".menu-hero [data-branch]");

  if (!btn) return;

  const b = btn.dataset.branch;

  setBranch(b === branch ? null : b);

  $("#menu-tools")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

  let st;
  $("#menu-search").addEventListener("input", e => {
    clearTimeout(st);
    st = setTimeout(() => { query = e.target.value; renderLists(); }, 150);
  });


  setBranch(null);
})();

/* menu-motion.js — script biasa (bukan module). Muat SETELAH menu.js.
   Isi: parallax pemisah foto, header sembunyi/muncul saat scroll, sinkron --bar-h. */
(() => {
  if (document.body.dataset.page !== "menu") return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const divider = document.querySelector("#menu-divider");
  const tools = document.querySelector("#menu-tools");
  const IMG_RANGE = 180;       // total gerak foto (px), maksimal 128 sesuai CSS
  const CONTENT_RANGE = 70;   // total gerak logo (px), arah berlawanan dengan foto

  /* ---------- Header0: elemen yang benar-benar menempel di layar ---------- */
  let navEl = null;
  function getNav() {
    const h = document.querySelector("#site-header");
    if (!h) return null;
    const el = /fixed|sticky/.test(getComputedStyle(h).position) ? h : (h.firstElementChild || h);
    if (el !== navEl) {
      navEl = el;
      if (!reduced) navEl.style.transition = "transform .35s ease";
    }
    return navEl;
  }

  let lastY = scrollY;
  function updateHeader() {
    const nav = getNav();
    if (!nav) return;
    const y = scrollY, d = y - lastY;
    let hide = nav.classList.contains("nav-hide");
    if (y < 80) hide = false;
    else if (d > 6) hide = true;
    else if (d < -6) hide = false;
    if (Math.abs(d) > 6 || y < 80) lastY = y;
    nav.classList.toggle("nav-hide", hide);
    document.body.classList.toggle("nav-hidden", hide);
  }

  /* ---------- Parallax pemisah: foto lambat, logo cepat ---------- */
  function updateParallax() {
    if (!divider || reduced) return;
    const r = divider.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -100 || r.top > vh + 100) return;       // di luar layar, lewati
    const t = (vh - r.top) / (vh + r.height) - 0.5;        // -0.5 (masuk) .. +0.5 (keluar)
    divider.style.setProperty("--img-y", `${(t * IMG_RANGE).toFixed(1)}px`);
    divider.style.setProperty("--content-y", `${(-t * CONTENT_RANGE).toFixed(1)}px`);
  }

  /* ---------- --bar-h: jarak aman untuk lompat ke kategori ---------- */
  function syncBarHeight() {
    if (!tools) return;
    const cs = getComputedStyle(tools);
    const navH = parseFloat(cs.getPropertyValue("--nav-h")) || 72;
    const sticky = cs.position === "sticky";
    const h = navH + (sticky ? tools.offsetHeight : 0) + 12;
    document.body.style.setProperty("--bar-h", h + "px");
  }

  /* ---------- Satu loop scroll untuk semuanya ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateParallax();
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { syncBarHeight(); onScroll(); });

  /* ---------- Muncul sekali saat banner masuk layar ---------- */
  if (divider && !reduced && "IntersectionObserver" in window) {
    divider.classList.add("is-armed");
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      divider.classList.add("is-in");
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(divider);
  }

  /* Tinggi halaman berubah setelah menu dimuat dari API → hitung ulang */
  const main = document.querySelector("main");
  if (main && "ResizeObserver" in window) {
    new ResizeObserver(() => { syncBarHeight(); onScroll(); }).observe(main);
  }

  syncBarHeight();
  updateParallax();
  updateHeader();
})();