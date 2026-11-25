/* menu-motion.js — script biasa (bukan module). Muat SETELAH menu.js.
   Foto pemisah digerakkan murni oleh CSS (fixed + clip-path), jadi tidak ada JS untuk fotonya.
   Isi: pergeseran halus logo, header sembunyi/muncul, sinkron --bar-h. */
(() => {
  if (document.body.dataset.page !== "menu") return;

  const HIDE_HEADER_ON_SCROLL_DOWN = true;  // false = header selalu terlihat
  const CONTENT_SHIFT = 0.08;               // logo bergeser ±8% tinggi banner relatif terhadap jendela

  const divider = document.querySelector("#menu-divider");
  const tools = document.querySelector("#menu-tools");
  const content = divider && divider.querySelector(".menu-divider__content");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: sembunyi saat scroll turun, muncul saat scroll naik ---------- */
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
    if (!HIDE_HEADER_ON_SCROLL_DOWN) return;
    const nav = getNav();
    if (!nav) return;
    const y = scrollY, d = y - lastY;
    let hide = nav.classList.contains("nav-hide");
    if (y < 80) hide = false;
    else if (d > 6) hide = true;
    else if (d < -6) hide = false;
    if (Math.abs(d) > 6 || y < 80) lastY = y;
    nav.classList.toggle("nav-hide", hide);
  }

  /* ---------- Logo: pergeseran halus terpisah dari foto ---------- */
  function updateContent() {
    if (!divider || !content || reduced) return;
    const r = divider.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -50 || r.top > vh + 50) return;
    const t = (vh - r.top) / (vh + r.height) - 0.5;          // -0.5 .. +0.5
    const y = -t * 2 * r.height * CONTENT_SHIFT;
    content.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  }

  /* ---------- --bar-h: jarak aman saat lompat ke kategori ---------- */
  function syncBarHeight() {
    if (!tools) return;
    const cs = getComputedStyle(tools);
    const navH = parseFloat(cs.getPropertyValue("--nav-h")) || 72;
    const extra = cs.position === "sticky" ? tools.offsetHeight : 0;
    document.body.style.setProperty("--bar-h", navH + extra + 12 + "px");
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateHeader(); updateContent(); ticking = false; });
  }

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { syncBarHeight(); onScroll(); });

  if ("ResizeObserver" in window) {
    const main = document.querySelector("main");
    if (main) new ResizeObserver(() => { syncBarHeight(); onScroll(); }).observe(main);
  }

  syncBarHeight();
  updateContent();
  updateHeader();
})();