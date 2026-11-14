const branchSelect = document.querySelector("#branch");
const menuList = document.querySelector("#menu-list");
const statusText = document.querySelector("#status");

async function api(path, options) {
  const response = await fetch(path, {
    cache: "no-store",
    ...options
  });

  if (response.status === 401 ||
      (response.redirected && new URL(response.url).pathname === "/owner/login.html")) {
    window.location.replace("/owner/login.html");
    throw new Error("Silakan login kembali.");
  }

  if (!response.ok) {
    throw new Error(`Permintaan gagal (HTTP ${response.status}).`);
  }

  return response;
}

function renderItem(item, branch) {
  const row = document.createElement("li");
  const form = document.createElement("form");
  const label = document.createElement("label");
  const price = document.createElement("input");
  const save = document.createElement("button");

  label.textContent = `${item.name} — harga (Rp) `;
  price.type = "number";
  price.min = "0";
  price.max = "99999999.99";
  price.step = "0.01";
  price.required = true;
  price.value = item.price;
  label.append(price);

  save.type = "submit";
  save.textContent = "Simpan";
  form.append(label, save);
  row.append(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    save.disabled = true;
    statusText.textContent = "Menyimpan harga…";

    try {
      const csrfResponse = await api("/api/auth/csrf");
      const csrf = await csrfResponse.json();

      await api(
        `/api/owner/menus/${encodeURIComponent(item.id)}?branch=${encodeURIComponent(branch)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [csrf.headerName]: csrf.token
          },
          body: JSON.stringify({ price: price.valueAsNumber })
        }
      );

      statusText.textContent = `Harga ${item.name} berhasil disimpan.`;
    } catch (error) {
      statusText.textContent = error.message;
    } finally {
      save.disabled = false;
    }
  });

  return row;
}

let latestLoad = 0;

async function loadMenus() {
  const loadId = ++latestLoad;
  const branch = branchSelect.value;
  menuList.replaceChildren();
  statusText.textContent = "Memuat menu…";

  try {
    const response = await api(`/api/owner/menus?branch=${encodeURIComponent(branch)}`);
    const { items } = await response.json();
    if (loadId !== latestLoad) return;

    menuList.replaceChildren(...items.map((item) => renderItem(item, branch)));
    statusText.textContent = items.length ? "" : "Belum ada menu aktif di cabang ini.";
  } catch (error) {
    if (loadId === latestLoad) statusText.textContent = error.message;
  }
}

branchSelect.addEventListener("change", loadMenus);
loadMenus();