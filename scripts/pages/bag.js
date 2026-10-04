let bagItemObjects = [];

onLoad();

function onLoad() {
  loadBagItemObjects();
  displayBagItems();
  displayBagIcon();
  displayBagSummary();
}

/* =========================
   LOAD ITEMS FROM BAG
========================= */

function loadBagItemObjects() {
  const bagItemsStr = localStorage.getItem("bagItems");

  const bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];

  bagItemObjects = [];

  bagItems.forEach((itemId) => {
    const item = items.find((product) => product.id === String(itemId));

    if (item) {
      bagItemObjects.push(item);
    }
  });
}

/* =========================
   DISPLAY BAG PRODUCTS
========================= */

function displayBagItems() {
  const containerElement = document.querySelector(".bag-items-container");

  if (!containerElement) {
    return;
  }

  if (bagItemObjects.length === 0) {
    containerElement.innerHTML = `
      <div class="empty-bag">
        <span class="material-symbols-outlined empty-bag-icon">
          shopping_bag
        </span>

        <h2>Your Bag is Empty</h2>

        <p>Add products to your bag to see them here.</p>

        <a
          href="../../index.html"
          class="continue-shopping"
        >
          CONTINUE SHOPPING
        </a>
      </div>
    `;

    return;
  }

  let innerHtml = "";

  bagItemObjects.forEach((bagItem, index) => {
    innerHtml += generateItemHtml(bagItem, index);
  });

  containerElement.innerHTML = innerHtml;
}

/* =========================
   CREATE PRODUCT HTML
========================= */

function generateItemHtml(item, index) {
  return `
    <div class="bag-item-container">

      <div class="item-left-part">
        <img
          class="bag-item-img"
          src="../../${item.image}"
          alt="${item.item_name}"
        />
      </div>

      <div class="item-right-part">

        <div class="company">
          ${item.company}
        </div>

        <div class="item-name">
          ${item.item_name}
        </div>

        <div class="price-container">

          <span class="current-price">
            Rs ${item.current_price}
          </span>

          <span class="original-price">
            Rs ${item.actual_price}
          </span>

          ${
            item.discount > 0
              ? `
                <span class="discount-percentage">
                  (${item.discount}% OFF)
                </span>
              `
              : ""
          }

        </div>

        ${
          item.return_period
            ? `
              <div class="return-period">
                <span class="return-period-days">
                  ${item.return_period} days
                </span>
                return available
              </div>
            `
            : ""
        }

        ${
          item.delivery_date
            ? `
              <div class="delivery-details">
                Delivery by
                <span class="delivery-details-days">
                  ${item.delivery_date}
                </span>
              </div>
            `
            : ""
        }

      </div>

      <div
        class="remove-from-cart"
        onclick="removeFromBag(${index})"
        title="Remove item"
      >
        ×
      </div>

    </div>
  `;
}

/* =========================
   BAG COUNT
========================= */

function displayBagIcon() {
  const bagItemCountElement = document.querySelector(".bag_item_count");

  if (!bagItemCountElement) {
    return;
  }

  const bagItemsStr = localStorage.getItem("bagItems");

  const bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];

  bagItemCountElement.innerText = bagItems.length;

  if (bagItems.length === 0) {
    bagItemCountElement.style.visibility = "hidden";
  } else {
    bagItemCountElement.style.visibility = "visible";
  }
}

/* =========================
   REMOVE FROM BAG
========================= */

function removeFromBag(index) {
  const bagItemsStr = localStorage.getItem("bagItems");

  const bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];

  if (index < 0 || index >= bagItems.length) {
    return;
  }

  bagItems.splice(index, 1);

  localStorage.setItem("bagItems", JSON.stringify(bagItems));

  loadBagItemObjects();
  displayBagItems();
  displayBagIcon();
  displayBagSummary();
}

/* =========================
   PRICE SUMMARY
========================= */

function displayBagSummary() {
  let totalMrp = 0;
  let totalCurrentPrice = 0;

  bagItemObjects.forEach((item) => {
    totalMrp += Number(item.actual_price);
    totalCurrentPrice += Number(item.current_price);
  });

  const discount = totalMrp - totalCurrentPrice;

  const convenienceFee = bagItemObjects.length > 0 ? 99 : 0;

  const totalAmount = totalCurrentPrice + convenienceFee;

  const totalMrpElement = document.querySelector("#total-mrp");

  const discountElement = document.querySelector("#discount-on-mrp");

  const convenienceFeeElement = document.querySelector("#convenience-fee");

  const totalAmountElement = document.querySelector("#total-amount");

  const itemCountElement = document.querySelector(".items-count-text");

  if (totalMrpElement) {
    totalMrpElement.innerText = `Rs ${totalMrp}`;
  }

  if (discountElement) {
    discountElement.innerText = `-Rs ${discount}`;
  }

  if (convenienceFeeElement) {
    convenienceFeeElement.innerText = `Rs ${convenienceFee}`;
  }

  if (totalAmountElement) {
    totalAmountElement.innerText = `Rs ${totalAmount}`;
  }

  if (itemCountElement) {
    itemCountElement.innerText = `(${bagItemObjects.length} ${
      bagItemObjects.length === 1 ? "Item" : "Items"
    })`;
  }
}

/* =========================
   PLACE ORDER
========================= */

function placeOrder() {
  if (bagItemObjects.length === 0) {
    alert("Your bag is empty.");
    return;
  }

  alert("Order placed successfully!");
}
