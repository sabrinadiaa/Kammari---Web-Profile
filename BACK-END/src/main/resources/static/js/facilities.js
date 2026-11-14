async function loadFacilities(list) {
  const branch = list.dataset.branch;

  try {
    const response = await fetch(
      `/api/facilities?branch=${encodeURIComponent(branch)}`
    );

    if (!response.ok) {
      throw new Error(`API fasilitas mengembalikan HTTP ${response.status}`);
    }

    const { facilities } = await response.json();

    if (!Array.isArray(facilities) || facilities.length === 0) {
      return;
    }

    const items = facilities.map((facility) => {
      const item = document.createElement("li");

      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      if (typeof ICON !== "undefined" && Object.hasOwn(ICON, facility.icon)) {
        icon.innerHTML = ICON[facility.icon];
      }

      const content = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = facility.name;
      content.append(title);

      if (facility.description) {
        const description = document.createElement("p");
        description.textContent = facility.description;
        content.append(description);
      }

      item.append(icon, content);
      return item;
    });

    list.replaceChildren(...items);
  } catch (error) {
    console.error(`Gagal memuat fasilitas ${branch}`, error);
    list.firstElementChild.textContent = "Fasilitas gagal dimuat. Coba muat ulang halaman.";
  }
}

document.querySelectorAll(".flist[data-branch]").forEach(loadFacilities);

async function loadBranchAddresses() {
  try {
    const response = await fetch("/api/branches");
    if (!response.ok) {
      throw new Error(`API cabang mengembalikan HTTP ${response.status}`);
    }

    const { branches } = await response.json();

    document.querySelectorAll("[data-branch-address]").forEach((label) => {
      const branch = branches.find(
        (item) => item.slug === label.dataset.branchAddress
      );

      if (branch?.address) {
        label.textContent = branch.address;
      }
    });
  } catch (error) {
    console.error("Gagal memuat alamat cabang", error);
  }
}

loadBranchAddresses();