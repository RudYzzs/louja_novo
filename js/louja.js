// frontend/js/louja.js

let products = [
  { id: 1, name: "Sabre de Luz Jedi", price: 250.00, category: "colecionaveis", image: "https://via.placeholder.com/200/09120e/00ff87?text=Sabre+de+Luz" },
  { id: 2, name: "Action Figure Goku", price: 150.00, category: "colecionaveis", image: "https://via.placeholder.com/200/09120e/00ff87?text=Goku+Figure" },
  { id: 3, name: "Headset Gamer RGB", price: 299.90, category: "eletronicos", image: "https://via.placeholder.com/200/09120e/00ff87?text=Headset+RGB" },
  { id: 4, name: "Teclado Mecânico", price: 350.00, category: "eletronicos", image: "https://via.placeholder.com/200/09120e/00ff87?text=Teclado+Mecanico" }
];

let cart = [];
let currentShippingCost = 0;
let isDeliveryAllowed = true;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  setupEventListeners();
  updateCartUI();
});

function addProductToCatalog(productData) {
  const newProduct = {
    id: Date.now(),
    name: productData.name,
    price: parseFloat(productData.price),
    category: productData.category,
    image: productData.image || "https://via.placeholder.com/200/09120e/00ff87?text=GeekZone"
  };
  products.push(newProduct);
}

function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = '';

  productList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${product.name}</h3>
        <p class="card-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
        <button class="btn-buy" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Comprar
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function handleShippingCalculation() {
  const distanceInput = document.getElementById('shipping-distance');
  const alertEl = document.getElementById('shipping-alert');
  if (!distanceInput) return;

  const distance = parseFloat(distanceInput.value);

  if (isNaN(distance) || distance < 0) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Informe uma distância válida em km.';
    }
    return;
  }

  if (distance > 100) {
    isDeliveryAllowed = false;
    currentShippingCost = 0;
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Entrega indisponível: Limite máximo de 100km excedido.';
    }
  } else {
    isDeliveryAllowed = true;
    currentShippingCost = distance * 2.50;
    if (alertEl) alertEl.style.display = 'none';
  }

  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartShippingCost = document.getElementById('cart-shipping-cost');
  const cartItemsContainer = document.getElementById('cart-items');
  const checkoutBtn = document.getElementById('checkout-btn');
  const discountRow = document.getElementById('discount-row');
  const discountVal = document.getElementById('cart-discount');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let effectiveShippingCost = currentShippingCost;
  let discountAmount = 0;

  if (typeof cthulhuBotInstance !== 'undefined' && cthulhuBotInstance) {
    const discountData = cthulhuBotInstance.calculateDiscounts();
    discountAmount = discountData.discountAmount;
    effectiveShippingCost = discountData.finalShippingCost;
  } else {
    if (subtotal >= 300) {
      discountAmount = subtotal * 0.10;
    } else if (subtotal >= 200) {
      effectiveShippingCost = 0;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + effectiveShippingCost);

  if (cartCount) cartCount.textContent = totalItems;
  
  if (cartTotal) cartTotal.textContent = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
  if (cartSubtotal) cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  if (cartShippingCost) cartShippingCost.textContent = `R$ ${effectiveShippingCost.toFixed(2).replace('.', ',')}`;

  if (discountRow && discountVal) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `-R$ ${discountAmount.toFixed(2).replace('.', ',')}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary); margin-top: 1rem;">Seu carrinho está vazio.</p>';
    } else {
      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div>
              <h4 style="margin:0; color:var(--text-primary);">${item.name}</h4>
              <small style="color:var(--text-secondary);">${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</small>
            </div>
            <button onclick="removeFromCart(${item.id})" class="btn-remove">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
    }
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = (cart.length === 0 || !isDeliveryAllowed);
  }
}

function abrirCheckout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  if (!isDeliveryAllowed) {
    alert("Não é possível finalizar a compra: Endereço excede o limite de entrega!");
    return;
  }

  alert("🐙 Pedido confirmado nas profundezas! Obrigado pela compra na GeekZone.");
  
  cart = [];
  currentShippingCost = 0;
  
  const modalEl = document.getElementById('cart-modal');
  if (modalEl) modalEl.classList.remove('open');
  
  updateCartUI();
}

function setupEventListeners() {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }

  const cartModal = document.getElementById('cart-modal');
  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart');

  if (cartBtn && cartModal) cartBtn.addEventListener('click', () => cartModal.classList.add('open'));
  if (closeCartBtn && cartModal) closeCartBtn.addEventListener('click', () => cartModal.classList.remove('open'));

  const productModal = document.getElementById('product-modal');
  const addProdBtn = document.getElementById('add-product-btn');
  const closeProdBtn = document.getElementById('close-product-modal');

  if (addProdBtn && productModal) addProdBtn.addEventListener('click', () => productModal.classList.add('open'));
  if (closeProdBtn && productModal) closeProdBtn.addEventListener('click', () => productModal.classList.remove('open'));

  const prodForm = document.getElementById('product-form');
  if (prodForm) {
    prodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prod-name').value.trim();
      const price = document.getElementById('prod-price').value;
      const category = document.getElementById('prod-category').value;
      const image = document.getElementById('prod-image').value.trim();

      if (name && price) {
        addProductToCatalog({ name, price, category, image });
        renderProducts(products);
        if (productModal) productModal.classList.remove('open');
        prodForm.reset();
      }
    });
  }

  const btnCalcShipping = document.getElementById('btn-calc-shipping');
  if (btnCalcShipping) btnCalcShipping.addEventListener('click', handleShippingCalculation);

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', abrirCheckout);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const category = e.target.dataset.category;
      if (category === 'all') {
        renderProducts(products);
      } else {
        renderProducts(products.filter(p => p.category === category));
      }
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(term));
      renderProducts(filtered);
    });
  }
}