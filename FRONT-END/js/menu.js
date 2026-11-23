/* Kammari Café & Roastery — menu.js (script biasa, bukan type="module")
   API: GET /api/menu?branch=gresik|surabaya */
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

  const links = $$("#menu-cats a");

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


  /* ==========================================
    SCROLL-DRIVEN PARALLAX MENU DIVIDER
  ========================================== */

  function initMenuParallax() {
    const divider = document.querySelector(".menu-divider");
    const image = document.querySelector(".menu-divider__image");
    const content = document.querySelector(".menu-divider__content");

    if (!divider || !image) return;

    // Hormati pengaturan reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let ticking = false;

    function updateParallax() {
      const rect = divider.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Progress pergerakan banner dalam viewport: 0 sampai 1
      const progress = Math.max(
        0,
        Math.min(
          1,
          (viewportHeight - rect.top) /
          (viewportHeight + rect.height)
        )
      );

      // Foto bergerak lebih lambat daripada halaman
      const imageMovement = (progress - 0.5) * -100;

      // Konten bergerak dengan kecepatan berbeda
      const contentMovement = (progress - 0.5) * 30;

      image.style.setProperty(
        "--parallax-y",
        `${imageMovement}px`
      );

      if (content) {
        content.style.setProperty(
          "--content-y",
          `${contentMovement}px`
        );
      }

      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(updateParallax);
    }

    window.addEventListener("scroll", requestUpdate, {
      passive: true
    });

    window.addEventListener("resize", requestUpdate);

    updateParallax();
  }

  // Jalankan parallax
  initMenuParallax();
  setBranch(null);
})();