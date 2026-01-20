const categoryItems = document.getElementById("category-items");
const categoryTitle = document.getElementById("category-title");
const categorySubtitle = document.getElementById("category-subtitle");
const categoryEyebrow = document.getElementById("category-eyebrow");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const cartEmpty = document.getElementById("cart-empty");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutCartBtn = document.getElementById("checkout-cart");
const cartModal = document.getElementById("cart-modal");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout");
const cancelCheckoutBtn = document.getElementById("cancel-checkout");
const checkoutForm = document.getElementById("checkout-form");
const checkoutSummary = document.getElementById("checkout-summary");
const checkoutMessage = document.getElementById("checkout-message");

const CART_STORAGE_KEY = "terracotta_cart";
const cart = new Map();

const formatPrice = (cents) => {
  const amount = cents / 100;
  if (Number.isInteger(amount)) {
    return `BDT ${amount}`;
  }
  return `BDT ${amount.toFixed(2)}`;
};

const getCartImageUrl = (name) => {
  const lower = String(name || "").toLowerCase();
  if (lower === "battered calamari") {
    return "https://mojo.generalmills.com/api/public/content/42fcy1-KA0GiwnfkjviV1g_webp_base.webp?v=002b7bd3&t=191ddcab8d1c415fa10fa00a14351227";
  }
  if (lower === "boneless chicken chaap") {
    return "https://i0.wp.com/www.haleemeats.com/wp-content/uploads/2022/09/IMG_0607.jpg?resize=720%2C900&ssl=1";
  }
  if (lower === "chicken tikka porota roll") {
    return "https://bakewithzoha.com/wp-content/uploads/2024/03/chicken-tikka-paratha-rolls-featured.jpg";
  }
  if (lower === "club sandwich") {
    return "https://www.cookedbyjulie.com/wp-content/uploads/2025/06/chicken-club-sandwiches-one-500x500.jpg";
  }
  if (lower === "cream of mushroom soup") {
    return "https://www.allrecipes.com/thmb/kX9HDmz1gmYTKpVIyzk3BdXPFrk=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/13096-Cream-of-Mushroom-Soup-ddmfs-4x3-293-b505e37374d74e81807e8a93bcdd7bab.jpg";
  }
  if (lower === "fusion phuchka") {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mBSArEjAf8L6tUfiS5viPZuja8hpOPZj7Q&s";
  }
  if (lower === "loitta fish fry") {
    return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhG4M2JVxJeyrsutu_RAYLEeclAkVGM-7FuxUd6p9ZLPikS_-IIdcYgEUfsSOUrqekyvmKpI44OK37pHTI2pa_ib-ivCmBtaF7Z_LvyAfOr16pWv1IFGNX8dqT-MVz3DKPN_xfMuykHSQRO/s1600/loitta.JPG";
  }
  if (lower === "maki roll") {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8AL3oDaJYBVkhpemJXnhIt4iR1Y3VJ8fR9w&s";
  }
  if (lower === "minced beef porota roll") {
    return "https://merbow.cpcdn.com/global-web/production/step_attachments/cd5yytjgc0ckrfnqhdrg/video.thumbnail.0000000.jpg";
  }
  if (lower === "spicy chingri skewers") {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbNhWkUSBjZ_Fx5sp3wAg6j38GSHHLXBSndA&s";
  }
  if (lower === "tandoori prawn skewers") {
    return "https://flawlessfood.co.uk/wp-content/uploads/2022/06/Tandoori-King-Prawn-Skewers-168-Flawless.jpg";
  }
  const keywords = ["bangladeshi food"];
  if (lower.includes("chicken")) keywords.push("chicken");
  if (lower.includes("beef")) keywords.push("beef");
  if (lower.includes("mutton") || lower.includes("lamb")) keywords.push("lamb");
  if (lower.includes("duck")) keywords.push("duck");
  if (lower.includes("prawn") || lower.includes("chingri")) keywords.push("prawn");
  if (lower.includes("fish") || lower.includes("ilish") || lower.includes("rupchanda"))
    keywords.push("fish");
  if (lower.includes("seafood")) keywords.push("seafood");
  if (lower.includes("dessert") || lower.includes("ice cream") || lower.includes("pudding"))
    keywords.push("dessert");
  if (lower.includes("coffee") || lower.includes("latte") || lower.includes("cappuccino"))
    keywords.push("coffee");
  if (lower.includes("lassi") || lower.includes("lemonade") || lower.includes("juice"))
    keywords.push("drink");
  return `https://source.unsplash.com/120x120/?${encodeURIComponent(
    keywords.slice(0, 3).join(","),
  )}`;
};

const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return;
    }
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) {
      return;
    }
    saved.forEach((item) => {
      if (
        item &&
        typeof item.id !== "undefined" &&
        typeof item.name === "string" &&
        Number.isFinite(item.price_cents) &&
        Number.isFinite(item.qty)
      ) {
        cart.set(String(item.id), {
          id: item.id,
          name: item.name,
          price_cents: item.price_cents,
          qty: item.qty,
        });
      }
    });
  } catch (error) {
    console.warn("Failed to load cart", error);
  }
};

const saveCartToStorage = () => {
  try {
    const payload = Array.from(cart.values());
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to save cart", error);
  }
};

const updateMenuQtyBadges = () => {
  const qtyBadges = document.querySelectorAll(".menu-qty");
  qtyBadges.forEach((badge) => {
    const itemId = badge.dataset.id;
    const existing = cart.get(String(itemId));
    badge.textContent = String(existing ? existing.qty : 0);
  });
};

const updateCartTotals = () => {
  let subtotal = 0;
  let count = 0;

  cart.forEach((item) => {
    subtotal += item.price_cents * item.qty;
    count += item.qty;
  });

  if (cartCount) {
    cartCount.textContent = String(count);
  }
  if (cartSubtotal) {
    cartSubtotal.textContent = formatPrice(subtotal);
  }
  if (cartTotal) {
    cartTotal.textContent = formatPrice(subtotal);
  }
  if (checkoutCartBtn) {
    checkoutCartBtn.disabled = count === 0;
  }
  if (cartEmpty) {
    cartEmpty.style.display = count === 0 ? "block" : "none";
  }
  saveCartToStorage();
  updateMenuQtyBadges();
};

const updateCartDisplay = () => {
  if (!cartItems) {
    return;
  }

  cartItems.innerHTML = "";
  const items = Array.from(cart.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const header = document.createElement("div");
    header.className = "cart-item-header";

    const thumb = document.createElement("img");
    thumb.className = "cart-thumb";
    thumb.src = getCartImageUrl(item.name);
    thumb.alt = item.name;

    const name = document.createElement("span");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatPrice(item.price_cents * item.qty);

    header.appendChild(thumb);
    header.appendChild(name);
    header.appendChild(price);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const decrease = document.createElement("button");
    decrease.className = "qty-btn";
    decrease.type = "button";
    decrease.textContent = "-";
    decrease.dataset.action = "decrease";
    decrease.dataset.id = String(item.id);

    const qty = document.createElement("span");
    qty.className = "qty-value";
    qty.textContent = String(item.qty);

    const increase = document.createElement("button");
    increase.className = "qty-btn";
    increase.type = "button";
    increase.textContent = "+";
    increase.dataset.action = "increase";
    increase.dataset.id = String(item.id);

    const remove = document.createElement("button");
    remove.className = "remove-btn";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.dataset.action = "remove";
    remove.dataset.id = String(item.id);

    controls.appendChild(decrease);
    controls.appendChild(qty);
    controls.appendChild(increase);
    controls.appendChild(remove);

    row.appendChild(header);
    row.appendChild(controls);

    cartItems.appendChild(row);
  });

  updateCartTotals();
};

const renderCheckoutSummary = () => {
  if (!checkoutSummary) {
    return;
  }

  const items = Array.from(cart.values());
  if (!items.length) {
    checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  const lines = items
    .map(
      (item) =>
        `<li>${item.qty} x ${item.name} <strong>${formatPrice(
          item.price_cents * item.qty,
        )}</strong></li>`,
    )
    .join("");

  const totalCents = items.reduce(
    (sum, item) => sum + item.price_cents * item.qty,
    0,
  );

  checkoutSummary.innerHTML = `
    <h4>Order summary</h4>
    <ul>${lines}</ul>
    <div class="cart-summary" style="margin-top: 12px;">
      <div>
        <span>Total due</span>
        <span>${formatPrice(totalCents)}</span>
      </div>
    </div>
  `;
};

const openCheckout = () => {
  if (!checkoutModal) {
    return;
  }
  renderCheckoutSummary();
  checkoutMessage.textContent = "";
  checkoutModal.classList.add("show");
  checkoutModal.setAttribute("aria-hidden", "false");
};

const closeCheckout = () => {
  if (!checkoutModal) {
    return;
  }
  checkoutModal.classList.remove("show");
  checkoutModal.setAttribute("aria-hidden", "true");
};

const openCart = () => {
  if (!cartModal) {
    return;
  }
  cartModal.classList.add("show");
  cartModal.setAttribute("aria-hidden", "false");
};

const closeCart = () => {
  if (!cartModal) {
    return;
  }
  cartModal.classList.remove("show");
  cartModal.setAttribute("aria-hidden", "true");
};

const getCategoryId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const addToCart = (item) => {
  const existing = cart.get(String(item.id));
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(String(item.id), {
      id: item.id,
      name: item.name,
      price_cents: item.price_cents,
      qty: 1,
    });
  }
  updateCartDisplay();
};

const renderCategoryItems = (category) => {
  if (!categoryItems) {
    return;
  }

  categoryItems.innerHTML = "";
  if (!category || !Array.isArray(category.items) || !category.items.length) {
    categoryItems.innerHTML = "<p>No items listed yet.</p>";
    return;
  }

  category.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "menu-item";
    row.dataset.id = String(item.id);
    row.dataset.name = item.name;
    row.dataset.priceCents = String(item.price_cents);

    const info = document.createElement("a");
    info.className = "menu-item-info menu-item-link";
    info.href = `item.html?id=${encodeURIComponent(item.id)}`;
    info.setAttribute("aria-label", `${item.name} details`);

    const thumb = document.createElement("img");
    thumb.className = "menu-thumb";
    thumb.src = getCartImageUrl(item.name);
    thumb.alt = item.name;

    const textWrap = document.createElement("div");
    textWrap.className = "menu-item-text";

    const name = document.createElement("span");
    name.className = "menu-item-name";
    name.textContent = item.name;

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatPrice(item.price_cents);

    textWrap.appendChild(name);
    textWrap.appendChild(price);

    info.appendChild(thumb);
    info.appendChild(textWrap);

    const controls = document.createElement("div");
    controls.className = "menu-item-controls";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.className = "qty-btn";
    decrease.textContent = "-";
    decrease.dataset.id = String(item.id);
    decrease.dataset.action = "decrease";

    const qty = document.createElement("span");
    qty.className = "menu-qty qty-value";
    qty.dataset.id = String(item.id);
    qty.textContent = String(cart.get(String(item.id))?.qty || 0);

    const increase = document.createElement("button");
    increase.type = "button";
    increase.className = "qty-btn";
    increase.textContent = "+";
    increase.dataset.id = String(item.id);
    increase.dataset.action = "increase";

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-outline btn-small add-btn";
    addBtn.textContent = "Add";
    addBtn.dataset.id = String(item.id);
    addBtn.dataset.action = "increase";

    controls.appendChild(decrease);
    controls.appendChild(qty);
    controls.appendChild(increase);
    controls.appendChild(addBtn);

    row.appendChild(info);
    row.appendChild(controls);
    categoryItems.appendChild(row);
  });
};

const showCategoryError = (message) => {
  if (categoryTitle) {
    categoryTitle.textContent = "Section unavailable";
  }
  if (categorySubtitle) {
    categorySubtitle.textContent = message || "Please return to the menu.";
  }
  if (categoryItems) {
    categoryItems.innerHTML = "<p>Unable to load items right now.</p>";
  }
};

const loadCategory = async () => {
  const categoryId = getCategoryId();
  if (!categoryId) {
    showCategoryError("Missing category id.");
    return;
  }

  try {
    const response = await fetch("/api/menu");
    if (!response.ok) {
      throw new Error("Failed to fetch menu");
    }
    const data = await response.json();
    const categories = data.categories || [];
    const category = categories.find(
      (item) => String(item.id) === String(categoryId),
    );

    if (!category) {
      showCategoryError("That category was not found.");
      return;
    }

    if (categoryEyebrow) {
      categoryEyebrow.textContent = "Section";
    }
    if (categoryTitle) {
      categoryTitle.textContent = category.name;
    }
    if (categorySubtitle) {
      const count = Array.isArray(category.items) ? category.items.length : 0;
      categorySubtitle.textContent = `${count} dishes ready to order.`;
    }

    renderCategoryItems(category);
  } catch (error) {
    showCategoryError("Please refresh or try again later.");
  }
};

if (categoryItems) {
  categoryItems.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !button.dataset.id) {
      return;
    }

    const row = button.closest(".menu-item");
    const itemId = row?.dataset.id;
    const itemName = row?.dataset.name;
    const priceCents = Number.parseInt(row?.dataset.priceCents || "0", 10);
    if (!row || !itemId) {
      return;
    }

    if (button.dataset.action === "decrease") {
      const existing = cart.get(itemId);
      if (!existing) {
        return;
      }
      existing.qty -= 1;
      if (existing.qty <= 0) {
        cart.delete(itemId);
      }
      updateCartDisplay();
      return;
    }

    if (button.dataset.action === "increase") {
      addToCart({ id: itemId, name: itemName || "Dish", price_cents: priceCents });
    }
  });
}

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !button.dataset.action) {
      return;
    }

    const itemId = button.dataset.id;
    const item = cart.get(String(itemId));
    if (!item) {
      return;
    }

    if (button.dataset.action === "increase") {
      item.qty += 1;
    } else if (button.dataset.action === "decrease") {
      item.qty -= 1;
      if (item.qty <= 0) {
        cart.delete(String(itemId));
      }
    } else if (button.dataset.action === "remove") {
      cart.delete(String(itemId));
    }

    updateCartDisplay();
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart.clear();
    updateCartDisplay();
  });
}

if (checkoutCartBtn) {
  checkoutCartBtn.addEventListener("click", () => {
    if (cart.size === 0) {
      return;
    }
    closeCart();
    openCheckout();
  });
}

if (openCartBtn) {
  openCartBtn.addEventListener("click", openCart);
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCart);
}

if (cartModal) {
  cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      closeCart();
    }
  });
}

if (closeCheckoutBtn) {
  closeCheckoutBtn.addEventListener("click", closeCheckout);
}

if (cancelCheckoutBtn) {
  cancelCheckoutBtn.addEventListener("click", closeCheckout);
}

if (checkoutModal) {
  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      closeCheckout();
    }
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (cart.size === 0) {
      checkoutMessage.textContent = "Your cart is empty.";
      return;
    }

    const formData = new FormData(checkoutForm);
    const payload = {
      customer: {
        name: formData.get("name")?.trim(),
        phone: formData.get("phone")?.trim(),
        address: formData.get("address")?.trim(),
        notes: formData.get("notes")?.trim() || "",
      },
      items: Array.from(cart.values()),
    };

    checkoutMessage.textContent = "Processing payment...";

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      checkoutMessage.textContent = `Payment ${data.status}. Transaction: ${data.transaction_id}`;
      cart.clear();
      updateCartDisplay();
      checkoutForm.reset();
      renderCheckoutSummary();
      closeCheckout();
    } catch (error) {
      checkoutMessage.textContent = `Payment failed: ${error.message}`;
    }
  });
}

loadCartFromStorage();
updateCartDisplay();
loadCategory();
