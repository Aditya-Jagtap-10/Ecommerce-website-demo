/* ===================================================================
   NETTOCART — demo storefront logic
   Everything here is placeholder/in-memory. Swap PRODUCTS for a
   real API call, and swap the cart's in-memory store for a real
   backend session/cart service when you build this out further.
   See README.md for suggested next steps.
=================================================================== */

// ---------- 1. PRODUCT DATA ----------
// Replace this array with a fetch() to your product API.
const PRODUCTS = [
  { id: "p1", name: "Handloom Cotton Throw", desc: "Handwoven in Coimbatore, undyed cotton.", price: 42.00, category: "textile", origin: "Coimbatore, IN", emoji: "🧶" },
  { id: "p2", name: "Glazed Stoneware Vase", desc: "Wheel-thrown, reactive glaze, one of a kind.", price: 58.00, category: "home", origin: "Porto, PT", emoji: "🏺" },
  { id: "p3", name: "Teak Serving Board", desc: "Reclaimed teak, food-safe oil finish.", price: 36.00, category: "kitchen", origin: "Chiang Mai, TH", emoji: "🪵" },
  { id: "p4", name: "Woven Market Basket", desc: "Hand-plaited sisal, natural fiber.", price: 29.00, category: "home", origin: "Nairobi, KE", emoji: "🧺" },
  { id: "p5", name: "Hammered Copper Mug", desc: "Cold-hammered copper, food-grade lining.", price: 24.00, category: "kitchen", origin: "Oaxaca, MX", emoji: "🍺" },
  { id: "p6", name: "Rattan Pendant Lamp", desc: "Natural rattan shade, hardwired fitting.", price: 89.00, category: "lighting", origin: "Chiang Mai, TH", emoji: "💡" },
  { id: "p7", name: "Linen Table Runner", desc: "Stonewashed European flax linen.", price: 33.00, category: "textile", origin: "Porto, PT", emoji: "🧵" },
  { id: "p8", name: "Brass Table Lantern", desc: "Cast brass base, hurricane glass.", price: 47.00, category: "lighting", origin: "Nairobi, KE", emoji: "🏮" },
];

// ---------- 2. STATE ----------
// cart = { productId: quantity }
let cart = {};
let activeFilter = "all";
let searchTerm = "";

// ---------- 3. DOM REFS ----------
const productGrid   = document.getElementById("productGrid");
const resultCount   = document.getElementById("resultCount");
const cartDrawer    = document.getElementById("cartDrawer");
const cartOverlay   = document.getElementById("cartOverlay");
const cartItemsEl   = document.getElementById("cartItems");
const cartEmptyEl   = document.getElementById("cartEmpty");
const cartTotalEl   = document.getElementById("cartTotal");
const cartCountEl   = document.getElementById("cartCount");
const toastEl       = document.getElementById("toast");
const searchPanel   = document.getElementById("searchPanel");
const searchInput   = document.getElementById("searchInput");

// ---------- 4. RENDER PRODUCTS ----------
function getFilteredProducts(){
  return PRODUCTS.filter(p => {
    const matchesCategory = activeFilter === "all" || p.category === activeFilter;
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.desc.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts(){
  const items = getFilteredProducts();
  resultCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  if (items.length === 0){
    productGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--slate);font-size:14px;">No matches — try another search or category.</p>`;
    return;
  }

  productGrid.innerHTML = items.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">
        <span class="product-origin">${p.origin}</span>
        <span aria-hidden="true">${p.emoji}</span>
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-row">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

// ---------- 5. CART LOGIC ----------
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  const product = PRODUCTS.find(p => p.id === id);
  showToast(`Added ${product.name} to cart`);
  pulseAddButton(id);
}

function changeQty(id, delta){
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function removeFromCart(id){
  delete cart[id];
  renderCart();
}

function cartCount(){
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartTotal(){
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(prod => prod.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function renderCart(){
  const entries = Object.entries(cart);
  cartCountEl.textContent = cartCount();
  cartTotalEl.textContent = `$${cartTotal().toFixed(2)}`;

  if (entries.length === 0){
    cartItemsEl.innerHTML = "";
    cartItemsEl.appendChild(cartEmptyEl);
    return;
  }

  cartItemsEl.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find(prod => prod.id === id);
    if (!p) return "";
    return `
      <div class="cart-line" data-id="${p.id}">
        <div class="cart-line-media">${p.emoji}</div>
        <div class="cart-line-body">
          <p class="cart-line-name">${p.name}</p>
          <p class="cart-line-price">$${p.price.toFixed(2)}</p>
          <div class="cart-line-controls">
            <button class="qty-btn" data-qty-down="${p.id}">−</button>
            <span class="qty-val">${qty}</span>
            <button class="qty-btn" data-qty-up="${p.id}">+</button>
            <button class="remove-line" data-remove="${p.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ---------- 6. UI HELPERS ----------
let toastTimer;
function showToast(msg){
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function pulseAddButton(id){
  const btn = document.querySelector(`[data-add="${id}"]`);
  if (!btn) return;
  btn.classList.add("added");
  btn.textContent = "✓";
  setTimeout(() => { btn.classList.remove("added"); btn.textContent = "+"; }, 900);
}

function openCart(){ cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart(){ cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }

// ---------- 7. EVENT WIRING ----------
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("searchToggle").addEventListener("click", () => {
  searchPanel.classList.toggle("open");
  if (searchPanel.classList.contains("open")) searchInput.focus();
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderProducts();
});

document.querySelectorAll(".cat-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelector(".cat-chip.active").classList.remove("active");
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderProducts();
  });
});

// Event delegation for product grid (add-to-cart buttons)
productGrid.addEventListener("click", (e) => {
  const addId = e.target.closest("[data-add]");
  if (addId) addToCart(addId.dataset.add);
});

// Event delegation for cart drawer (qty / remove buttons)
cartItemsEl.addEventListener("click", (e) => {
  const up = e.target.closest("[data-qty-up]");
  const down = e.target.closest("[data-qty-down]");
  const remove = e.target.closest("[data-remove]");
  if (up) changeQty(up.dataset.qtyUp, 1);
  if (down) changeQty(down.dataset.qtyDown, -1);
  if (remove) removeFromCart(remove.dataset.remove);
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cartCount() === 0){
    showToast("Your cart is empty");
    return;
  }
  // TODO: replace with real checkout — redirect to payment provider
  // (Stripe Checkout, Razorpay, etc.) or your own /checkout route.
  showToast("Demo checkout — wire this up to your payment provider");
});

// ---------- 8. INIT ----------
renderProducts();
renderCart();
