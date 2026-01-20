const formatPrice = (cents) => {
  const amount = cents / 100;
  if (Number.isInteger(amount)) {
    return `BDT ${amount}`;
  }
  return `BDT ${amount.toFixed(2)}`;
};

const CART_STORAGE_KEY = "terracotta_cart";
const MAX_ITEM_QTY = 10;

const getQueryParam = (name) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

const ingredientBank = {
  chicken: ["Chicken", "garlic", "ginger", "yogurt", "warming spices"],
  beef: ["Beef", "onion", "garlic", "ginger", "toasted spices"],
  mutton: ["Mutton", "onion", "garlic", "ginger", "whole spices"],
  lamb: ["Lamb", "onion", "garlic", "ginger", "aromatic spices"],
  duck: ["Duck", "onion", "garlic", "ginger", "bhuna spices"],
  prawn: ["Prawn", "coconut milk", "garlic", "ginger", "green chili"],
  fish: ["Fresh fish", "mustard", "green chili", "turmeric", "mustard oil"],
  seafood: ["Seafood medley", "coconut milk", "garlic", "ginger", "spices"],
  vegetable: ["Seasonal vegetables", "onion", "garlic", "ginger", "spices"],
  rice: ["Basmati rice", "ghee", "whole spices"],
  bread: ["Flour", "ghee", "salt"],
  dessert: ["Milk", "sugar", "cardamom", "nuts"],
  drink: ["Chilled dairy", "sugar", "aromatics"],
  tea: ["Tea leaves", "milk", "sugar", "spices"],
  coffee: ["Espresso", "steamed milk", "cocoa"],
  fries: ["Potatoes", "salt", "oil"],
  sandwich: ["Toasted bread", "protein filling", "fresh vegetables"],
};

const uniqueList = (items) => Array.from(new Set(items.filter(Boolean)));

const getKeywords = (name, category) => {
  const lower = name.toLowerCase();
  const keywords = ["bangladeshi food", "restaurant"];

  if (lower.includes("chicken")) keywords.push("chicken");
  if (lower.includes("beef")) keywords.push("beef");
  if (lower.includes("mutton")) keywords.push("mutton");
  if (lower.includes("lamb")) keywords.push("lamb");
  if (lower.includes("duck")) keywords.push("duck");
  if (lower.includes("prawn") || lower.includes("chingri")) keywords.push("prawn");
  if (lower.includes("fish") || lower.includes("ilish") || lower.includes("rupchanda"))
    keywords.push("fish");
  if (lower.includes("seafood")) keywords.push("seafood");
  if (lower.includes("kabab") || lower.includes("tikka") || lower.includes("grill"))
    keywords.push("grilled");
  if (lower.includes("soup")) keywords.push("soup");
  if (lower.includes("sandwich")) keywords.push("sandwich");
  if (lower.includes("fries")) keywords.push("fries");
  if (lower.includes("pudding") || lower.includes("ice cream") || category === "Desserts")
    keywords.push("dessert");
  if (
    lower.includes("lassi") ||
    lower.includes("lemonade") ||
    lower.includes("juice") ||
    lower.includes("milkshake")
  )
    keywords.push("drink");
  if (category === "Coffee" || lower.includes("coffee") || lower.includes("latte"))
    keywords.push("coffee");
  if (lower.includes("tea")) keywords.push("tea");

  return uniqueList(keywords).slice(0, 4);
};

const getIngredients = (name, category) => {
  const lower = name.toLowerCase();
  let ingredients = [];

  if (lower.includes("chicken")) ingredients = ingredients.concat(ingredientBank.chicken);
  if (lower.includes("beef")) ingredients = ingredients.concat(ingredientBank.beef);
  if (lower.includes("mutton")) ingredients = ingredients.concat(ingredientBank.mutton);
  if (lower.includes("lamb")) ingredients = ingredients.concat(ingredientBank.lamb);
  if (lower.includes("duck")) ingredients = ingredients.concat(ingredientBank.duck);
  if (lower.includes("prawn") || lower.includes("chingri"))
    ingredients = ingredients.concat(ingredientBank.prawn);
  if (lower.includes("fish") || lower.includes("ilish") || lower.includes("rupchanda"))
    ingredients = ingredients.concat(ingredientBank.fish);
  if (lower.includes("seafood")) ingredients = ingredients.concat(ingredientBank.seafood);
  if (lower.includes("vegetable")) ingredients = ingredients.concat(ingredientBank.vegetable);
  if (lower.includes("rice") || lower.includes("polao") || lower.includes("khichuri"))
    ingredients = ingredients.concat(ingredientBank.rice);
  if (lower.includes("naan") || lower.includes("porota") || lower.includes("luchi"))
    ingredients = ingredients.concat(ingredientBank.bread);
  if (category === "Desserts" || lower.includes("pudding") || lower.includes("ice cream"))
    ingredients = ingredients.concat(ingredientBank.dessert);
  if (category === "Drinks" || lower.includes("lassi") || lower.includes("lemonade"))
    ingredients = ingredients.concat(ingredientBank.drink);
  if (category === "Coffee" || lower.includes("latte") || lower.includes("cappuccino"))
    ingredients = ingredients.concat(ingredientBank.coffee);
  if (lower.includes("tea")) ingredients = ingredients.concat(ingredientBank.tea);
  if (lower.includes("fries")) ingredients = ingredients.concat(ingredientBank.fries);
  if (lower.includes("sandwich")) ingredients = ingredients.concat(ingredientBank.sandwich);

  if (ingredients.length === 0) {
    ingredients = ["House spice blend", "seasonal ingredients", "fresh herbs"];
  }

  return uniqueList(ingredients).slice(0, 6);
};

const getDescription = (item, category) => {
  if (item.description) {
    return item.description;
  }

  const base = `${item.name} is a ${category.toLowerCase()} favorite prepared with our clay-fired techniques.`;
  const extra = "Expect warm spices, balanced heat, and a finish that stays fragrant table-side.";
  return `${base} ${extra}`;
};

const getItemImage = (name) => {
  const lower = String(name).toLowerCase();
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
  return null;
};

const updateItemPage = (item, category) => {
  const nameEl = document.getElementById("item-name");
  const priceEl = document.getElementById("item-price");
  const descriptionEl = document.getElementById("item-description");
  const categoryEl = document.getElementById("item-category");
  const imageEl = document.getElementById("item-image");
  const ingredientsEl = document.getElementById("item-ingredients");
  const tagEl = document.getElementById("item-tag");

  if (!item) {
    if (nameEl) nameEl.textContent = "Dish not found";
    if (descriptionEl) descriptionEl.textContent = "We could not find that dish.";
    return;
  }

  const keywords = getKeywords(item.name, category);
  const imageUrl =
    getItemImage(item.name) ||
    `https://source.unsplash.com/1200x900/?${encodeURIComponent(
      keywords.join(","),
    )}`;

  if (nameEl) nameEl.textContent = item.name;
  if (priceEl) priceEl.textContent = formatPrice(item.price_cents);
  if (descriptionEl) descriptionEl.textContent = getDescription(item, category);
  if (categoryEl) categoryEl.textContent = category;
  if (imageEl) {
    imageEl.src = imageUrl;
    imageEl.alt = `${item.name} from Terracotta Tales`;
  }
  if (tagEl) tagEl.textContent = category;
  if (ingredientsEl) {
    ingredientsEl.innerHTML = "";
    getIngredients(item.name, category).forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsEl.appendChild(li);
    });
  }
};

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Failed to save cart", error);
  }
};

const getCartImageUrl = (name) => {
  if (String(name).toLowerCase() === "battered calamari") {
    return "https://mojo.generalmills.com/api/public/content/42fcy1-KA0GiwnfkjviV1g_webp_base.webp?v=002b7bd3&t=191ddcab8d1c415fa10fa00a14351227";
  }
  const keywords = ["bangladeshi food"];
  const lower = String(name || "").toLowerCase();
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

const renderMiniCart = () => {
  const itemsEl = document.getElementById("mini-cart-items");
  const totalEl = document.getElementById("mini-cart-total");
  if (!itemsEl || !totalEl) {
    return;
  }

  const cart = readCart();
  itemsEl.innerHTML = "";

  if (!cart.length) {
    itemsEl.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price_cents * item.qty;
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
    price.className = "cart-item-total";
    price.textContent = formatPrice(item.price_cents * item.qty);

    header.appendChild(thumb);
    header.appendChild(name);
    header.appendChild(price);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    controls.innerHTML = `
      <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}">-</button>
      <span class="qty-value">${item.qty}</span>
      <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}">+</button>
      <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">Remove</button>
    `;

    row.appendChild(header);
    row.appendChild(controls);

    itemsEl.appendChild(row);
  });

  totalEl.textContent = formatPrice(total);
};

const updateCartItem = (itemId, action) => {
  const cart = readCart();
  const index = cart.findIndex((entry) => String(entry.id) === String(itemId));
  if (index === -1) {
    return;
  }

  if (action === "increase") {
    cart[index].qty = Math.min(MAX_ITEM_QTY, cart[index].qty + 1);
  } else if (action === "decrease") {
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  } else if (action === "remove") {
    cart.splice(index, 1);
  }

  writeCart(cart);
  renderMiniCart();
};

const setupMiniCart = () => {
  const openBtn = document.getElementById("open-cart");
  const closeBtn = document.getElementById("close-cart");
  const clearBtn = document.getElementById("mini-cart-clear");
  const modal = document.getElementById("mini-cart-modal");
  const itemsEl = document.getElementById("mini-cart-items");

  if (!openBtn || !modal) {
    return;
  }

  const open = () => {
    renderMiniCart();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", open);
  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      writeCart([]);
      renderMiniCart();
    });
  }
  if (itemsEl) {
    itemsEl.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !button.dataset.action) {
        return;
      }
      updateCartItem(button.dataset.id, button.dataset.action);
    });
  }
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      close();
    }
  });
};

const setupQuantityPicker = () => {
  const dec = document.getElementById("qty-decrease");
  const inc = document.getElementById("qty-increase");
  const value = document.getElementById("qty-value");

  if (!dec || !inc || !value) {
    return;
  }

  const getQty = () => Number.parseInt(value.textContent || "1", 10) || 1;

  dec.addEventListener("click", () => {
    const next = Math.max(1, getQty() - 1);
    value.textContent = String(next);
  });

  inc.addEventListener("click", () => {
    const next = Math.min(MAX_ITEM_QTY, getQty() + 1);
    value.textContent = String(next);
  });
};

const setupAddToCart = (item) => {
  const button = document.getElementById("add-to-cart");
  const message = document.getElementById("item-message");
  const value = document.getElementById("qty-value");

  if (!button || !value) {
    return;
  }

  button.addEventListener("click", () => {
    const qty = Number.parseInt(value.textContent || "1", 10) || 1;
    const cart = readCart();
    const existing = cart.find((entry) => String(entry.id) === String(item.id));

    if (existing) {
      existing.qty = Math.min(MAX_ITEM_QTY, existing.qty + qty);
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price_cents: item.price_cents,
        qty: Math.min(MAX_ITEM_QTY, qty),
      });
    }

    writeCart(cart);
    if (message) {
      message.textContent = `Added ${Math.min(qty, MAX_ITEM_QTY)} to cart.`;
    }
    value.textContent = "1";
  });
};

const loadItem = async () => {
  const itemId = getQueryParam("id");
  if (!itemId) {
    updateItemPage(null, "");
    return;
  }

  try {
    const response = await fetch("/api/menu");
    if (!response.ok) {
      throw new Error("Failed to load menu");
    }

    const data = await response.json();
    const categories = data.categories || [];
    let foundItem = null;
    let foundCategory = "Menu";

    categories.forEach((category) => {
      (category.items || []).forEach((item) => {
        if (String(item.id) === String(itemId)) {
          foundItem = item;
          foundCategory = category.name;
        }
      });
    });

    updateItemPage(foundItem, foundCategory);
    if (foundItem) {
      setupQuantityPicker();
      setupAddToCart(foundItem);
    }
  } catch (error) {
    updateItemPage(null, "");
  }
};

setupMiniCart();
loadItem();
