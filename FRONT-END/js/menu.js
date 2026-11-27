
(() => {
  if (document.body.dataset.page !== "menu") return;

  const MENU_API = "http://localhost:8080/api/menu";
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

  let activeCat = {}, branch = null, reqId = 0, items = [], query = "";

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
    if (status) { status.hidden = false; status.textContent = "Memuat menu..."; }
    try {
      const results = await Promise.allSettled((branch ? [branch] : ["gresik", "surabaya"]).map(fetchBranch));
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
      if (status) status.hidden = true;
    } catch (err) {
      if (id !== reqId) return;
      console.error("Gagal memuat menu:", err);
      items = [];
      if (status) status.textContent = "Gagal memuat menu. Periksa API dan database.";
    }
    renderLists();
    buildCircles();
  }

  /* ---------- Daftar menu (satu kategori per tab) ---------- */
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

  function renderLists() {
    const searching = query.trim() !== "";

    ["makanan", "minuman"].forEach(key => {
      const list = items.filter(i => groupOf(i.cat) === key && matches(i));
      const byCat = new Map();
      list.forEach(i => {
        if (!byCat.has(i.cat)) byCat.set(i.cat, { name: i.catName, rows: [] });
        byCat.get(i.cat).rows.push(i);
      });
      const cats = [...byCat];

      // Kategori aktif: pilihan terakhir; kalau tidak ada, pakai kategori pertama
      if (!byCat.has(activeCat[key])) activeCat[key] = cats[0]?.[0];
      const current = activeCat[key];

      // Normal: tampilkan 1 kategori. Saat mencari: tampilkan semua yang cocok
      const visible = searching ? cats : cats.filter(([slug]) => slug === current);
      const shown = visible.reduce((n, [, c]) => n + c.rows.length, 0);

      const box = $(`#menu-${key} .mlist`);
      if (box) box.innerHTML = visible.length
        ? visible.map(([slug, c]) => `
            <div class="mcat" id="cat-${esc(slug)}">
              <h3>${esc(c.name)}</h3>
              <ul class="mcat__items">${c.rows.map(rowHTML).join("")}</ul>
            </div>`).join("")
        : `<p class="mlist__empty">${searching ? "Menu yang dicari tidak ditemukan." : "Belum ada menu."}</p>`;

      const count = $(`#menu-${key} [data-count]`);
      if (count) count.textContent = `${key === "makanan" ? "Makanan" : "Minuman"} · ${shown} menu`;

      const nav = $(`#menu-cats-${key}`);
      if (nav) {
        nav.hidden = searching || cats.length < 2;
        nav.innerHTML = cats.map(([slug, c]) => `
          <button type="button" class="mchip" data-group="${key}" data-cat="${esc(slug)}"
            aria-current="${slug === current}">${esc(c.name)}</button>`).join("");
      }
    });
  }

  document.addEventListener("click", e => {
    const chip = e.target.closest(".mchip[data-cat]");
    if (!chip) return;
    const { group, cat } = chip.dataset;
    activeCat[group] = cat;
    renderLists();
    // render ulang membuat chip baru, jadi kembalikan fokus dan posisi geser chip
    const active = $(`.mchip[data-group="${group}"][aria-current="true"]`);
    active?.focus({ preventScroll: true });
    active?.scrollIntoView({ inline: "center", block: "nearest" });
  });

  /* ---------- Lightbox detail ---------- */
  const dialog = document.createElement("dialog");
  dialog.className = "kg-lightbox";
  dialog.innerHTML = `<button type="button" class="kg-lightbox__close" aria-label="Tutup">×</button><img alt="" hidden><h3></h3><p></p><span class="dish__price"></span>`;
  document.body.appendChild(dialog);
  dialog.addEventListener("click", e => {
    if (e.target === dialog || e.target.closest(".kg-lightbox__close")) dialog.close();
  });

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

  /* ---------- Cabang & pencarian ---------- */
  function setBranch(b) {
    branch = b;
    $$("[data-branch]").forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.branch === b)));
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
    $("#menu-makanan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  let st;
  $("#menu-search")?.addEventListener("input", e => {
    clearTimeout(st);
    st = setTimeout(() => { query = e.target.value; renderLists(); }, 150);
  });

  setBranch(null);
})();