const BACKEND_URL = "https://api.sentraltop.id";

const state = {
  selectedProduct: null,
  selectedNominal: null,
  selectedPayment: null,
  userId: "",
  serverId: "",
};

const PRODUCTS = [
  { id: "ml", name: "Mobile Legends", icon: "⚔️", needServerId: true },
  { id: "ff", name: "Free Fire", icon: "🔥", needServerId: false },
  { id: "pubgm", name: "PUBG Mobile", icon: "🎯", needServerId: false },
  { id: "genshin", name: "Genshin Impact", icon: "⭐", needServerId: true },
  { id: "valorant", name: "Valorant", icon: "🎮", needServerId: false },
  { id: "steam", name: "Steam Wallet", icon: "💳", needServerId: false },
];

const NOMINALS = {
  ml: [
    { id: "ml_86", label: "86 Diamond", price: 22000 },
    { id: "ml_172", label: "172 Diamond", price: 44000 },
    { id: "ml_257", label: "257 Diamond", price: 66000 },
    { id: "ml_wk", label: "Weekly Pass", price: 30000 },
  ],
  ff: [
    { id: "ff_70", label: "70 Diamond", price: 10000 },
    { id: "ff_140", label: "140 Diamond", price: 20000 },
    { id: "ff_355", label: "355 Diamond", price: 50000 },
  ],
  pubgm: [
    { id: "pubg_60", label: "60 UC", price: 15000 },
    { id: "pubg_325", label: "325 UC", price: 75000 },
  ],
  genshin: [
    { id: "gi_60", label: "60 Crystal", price: 16000 },
    { id: "gi_300", label: "300 Crystal", price: 79000 },
  ],
  valorant: [
    { id: "vp_125", label: "125 VP", price: 15000 },
    { id: "vp_420", label: "420 VP", price: 50000 },
  ],
  steam: [
    { id: "steam_60k", label: "Rp 60.000", price: 62000 },
    { id: "steam_120k", label: "Rp 120.000", price: 123000 },
  ],
};

const PAYMENTS = [
  { id: "qris", label: "QRIS (semua e-wallet & bank)" },
  { id: "va_bca", label: "Virtual Account BCA" },
  { id: "va_bri", label: "Virtual Account BRI" },
  { id: "dana", label: "DANA" },
];

function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

function goTo(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById(viewId).classList.remove("hidden");
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  PRODUCTS.forEach(p => {
    const el = document.createElement("div");
    el.className = "product-card";
    el.innerHTML = `<div class="icon">${p.icon}</div><div>${p.name}</div>`;
    el.onclick = () => selectProduct(p);
    grid.appendChild(el);
  });
}

function selectProduct(product) {
  state.selectedProduct = product;
  document.getElementById("nominalGameTitle").textContent = "Pilih Nominal - " + product.name;
  document.getElementById("serverIdField").style.display = product.needServerId ? "block" : "none";
  renderNominals(product.id);
  goTo("viewNominal");
}

function renderNominals(productId) {
  const grid = document.getElementById("nominalGrid");
  grid.innerHTML = "";
  (NOMINALS[productId] || []).forEach(n => {
    const el = document.createElement("div");
    el.className = "nominal-card";
    el.innerHTML = `<div class="amount">${n.label}</div><div class="price">${formatRupiah(n.price)}</div>`;
    el.onclick = () => selectNominal(n);
    grid.appendChild(el);
  });
}

function selectNominal(nominal) {
  state.userId = document.getElementById("userId").value.trim();
  state.serverId = document.getElementById("serverId").value.trim();

  if (!state.userId) {
    alert("Masukkan User ID dulu ya");
    return;
  }

  state.selectedNominal = nominal;
  renderCheckout();
  goTo("viewCheckout");
}

function renderCheckout() {
  document.getElementById("ckProduct").textContent = state.selectedProduct.name;
  document.getElementById("ckNominal").textContent = state.selectedNominal.label;
  document.getElementById("ckUserId").textContent =
    state.userId + (state.serverId ? " (" + state.serverId + ")" : "");
  document.getElementById("ckPrice").textContent = formatRupiah(state.selectedNominal.price);
  document.getElementById("ckTotal").textContent = formatRupiah(state.selectedNominal.price);

  const list = document.getElementById("paymentList");
  list.innerHTML = "";
  PAYMENTS.forEach(pay => {
    const el = document.createElement("div");
    el.className = "payment-option";
    el.textContent = pay.label;
    el.onclick = () => {
      document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
      el.classList.add("selected");
      state.selectedPayment = pay;
    };
    list.appendChild(el);
  });
}

async function submitOrder() {
  if (!state.selectedPayment) {
    alert("Pilih metode pembayaran dulu");
    return;
  }

  const payload = {
    productId: state.selectedProduct.id,
    nominalId: state.selectedNominal.id,
    userId: state.userId,
    serverId: state.serverId,
    paymentMethod: state.selectedPayment.id,
    price: state.selectedNominal.price,
  };

  try {
    const data = { orderId: "STX" + Date.now() };

    document.getElementById("orderIdText").textContent = data.orderId;
    goTo("viewSuccess");

    if (window.SentralNative) {
      SentralNative.showToast("Pesanan berhasil dibuat");
    }
  } catch (err) {
    alert("Gagal membuat pesanan, coba lagi");
  }
}

renderProducts();
