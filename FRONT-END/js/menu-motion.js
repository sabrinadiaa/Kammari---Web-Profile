/* menu-motion.js — script biasa. Muat SETELAH menu.js, di akhir <body>.
   Efek foto pemisah sekarang murni CSS (foto fixed + banner sebagai jendela), jadi tidak ada JS untuknya.
   Header menempel lewat CSS dan selalu terlihat. File ini hanya menyinkronkan --bar-h. */
(() => {
  if (document.body.dataset.page !== "menu") return;

  const header = document.querySelector("#site-header");

  function syncBarHeight() {
    const h = header ? header.getBoundingClientRect().height : 0;
    const fallback = parseFloat(getComputedStyle(document.body).getPropertyValue("--nav-h")) || 72;
    document.body.style.setProperty("--bar-h", (h || fallback) + 12 + "px");
  }

  addEventListener("resize", syncBarHeight);
  if (header && "ResizeObserver" in window) new ResizeObserver(syncBarHeight).observe(header);
  syncBarHeight();
})();