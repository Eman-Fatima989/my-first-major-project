let bagItems = [];

onLoad();

function onLoad() {
  loadBagItems();
  displayItemsOnHomePage();
  displayBagIcon();
  setupSearch();
}

function loadBagItems() {
  const bagItemsStr = localStorage.getItem("bagItems");

  if (!bagItemsStr) {
    bagItems = [];
    return;
  }

  try {
    const parsedBagItems = JSON.parse(bagItemsStr);

    bagItems = Array.isArray(parsedBagItems) ? parsedBagItems : [];
  } catch (error) {
    console.error("Unable to read bag items from localStorage:", error);

    bagItems = [];
    localStorage.removeItem("bagItems");
  }
}

function addToBag(itemId) {
  const id = String(itemId);

  bagItems.push(id);

  localStorage.setItem("bagItems", JSON.stringify(bagItems));

  displayBagIcon();
}

function displayBagIcon() {
  const bagItemCountElement = document.querySelector(".bag_item_count");

  if (!bagItemCountElement) {
    console.error("Bag count element was not found.");
    return;
  }

  if (bagItems.length > 0) {
    bagItemCountElement.style.visibility = "visible";
    bagItemCountElement.innerText = bagItems.length;
  } else {
    bagItemCountElement.style.visibility = "hidden";
  }
}

function displayItemsOnHomePage(itemsToDisplay = items) {
  const itemsContainerElement = document.querySelector(".items_container");

  const noResultsElement = document.querySelector(".no_results");

  if (!itemsContainerElement) {
    console.error("Items container was not found.");
    return;
  }

  let innerHtml = "";

  itemsToDisplay.forEach((item) => {
    const itemId = String(item.id);

    innerHtml += `
      <div class="item-container">
        <img
          class="item-image"
          src="${item.image}"
          alt="${item.company} - ${item.item_name}"
          loading="lazy"
        />

        <div class="rating">
          ${item.rating.stars} ⭐ | ${item.rating.count}
        </div>

        <div class="company-name">
          ${item.company}
        </div>

        <div class="item-name">
          ${item.item_name}
        </div>

        <div class="price">
          <span class="current-price">
            Rs ${item.current_price.toLocaleString()}
          </span>

          <span class="original-price">
            Rs ${item.actual_price.toLocaleString()}
          </span>

          <span class="discount">
            (${item.discount}% OFF)
          </span>
        </div>

        <button
          class="btn-add-bag"
          onclick="addToBag('${itemId}')"
          type="button"
        >
          Add to Bag
        </button>
      </div>
    `;
  });

  itemsContainerElement.innerHTML = innerHtml;

  if (noResultsElement) {
    noResultsElement.hidden = itemsToDisplay.length !== 0;
  }
}

function setupSearch() {
  const searchInput = document.querySelector(".search_input");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();

    if (searchText === "") {
      displayItemsOnHomePage(items);
      return;
    }

    const filteredItems = items.filter((item) => {
      const company = item.company.toLowerCase();
      const itemName = item.item_name.toLowerCase();

      return company.includes(searchText) || itemName.includes(searchText);
    });

    displayItemsOnHomePage(filteredItems);
  });
}
