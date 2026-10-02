let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  setupEventListeners();
});

function renderProducts(productList) {
  const grid = document.getElementById('product-grid');
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

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartShippingCost = document.getElementById('cart-shipping-cost');
  const drawerTotal = document.getElementById('drawer-cart-total');
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

  cartCount.textContent = totalItems;
  
  const formattedSubtotal = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  const formattedShipping = `R$ ${effectiveShippingCost.toFixed(2).replace('.', ',')}`;
  const formattedGrandTotal = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;

  cartTotal.textContent = formattedGrandTotal;
  cartSubtotal.textContent = formattedSubtotal;
  cartShippingCost.textContent = formattedShipping;
  drawerTotal.textContent = formattedGrandTotal;

  if (discountAmount > 0) {
    discountRow.style.display = 'flex';
    discountVal.textContent = `-R$ ${discountAmount.toFixed(2).replace('.', ',')}`;
  } else {
    discountRow.style.display = 'none';
  }

  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary); margin-top: 1rem;">Seu carrinho está vazio.</p>';
  } else {
    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div>
          <h4>${item.name}</h4>
          <small>${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</small>
        </div>
        <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color: var(--error-color); cursor:pointer;">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  if (cart.length === 0 || !isDeliveryAllowed) {
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
  }
}

function abrirCheckout() {
  const totalItens = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItens === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  if (!isDeliveryAllowed) {
    alert("Não é possível finalizar a compra: O endereço informado ultrapassa o limite de 100km para entrega via motoboy!");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmount = 0;
  let effectiveShippingCost = currentShippingCost;

  if (subtotal >= 300) {
    discountAmount = subtotal * 0.10;
  } else if (subtotal >= 200) {
    effectiveShippingCost = 0;
  }

  const totalGeral = subtotal - discountAmount + effectiveShippingCost;

  alert(`Pedido confirmado com sucesso!\n\nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\nDesconto Cósmico: R$ ${discountAmount.toFixed(2).replace('.', ',')}\nFrete: R$ ${effectiveShippingCost.toFixed(2).replace('.', ',')}\nTotal Geral: R$ ${totalGeral.toFixed(2).replace('.', ',')}`);
  
  cart = [];
  currentShippingCost = 0;
  document.getElementById('shipping-address').value = '';
  document.getElementById('shipping-distance').value = '';
  document.getElementById('shipping-alert').style.display = 'none';
  document.getElementById('cart-modal').classList.remove('open');
  updateCartUI();
}

function setupEventListeners() {
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });

  const cartModal = document.getElementById('cart-modal');
  document.getElementById('cart-btn').addEventListener('click', () => cartModal.classList.add('open'));
  document.getElementById('close-cart').addEventListener('click', () => cartModal.classList.remove('open'));

  const productModal = document.getElementById('product-modal');
  document.getElementById('add-product-btn').addEventListener('click', () => productModal.classList.add('open'));
  document.getElementById('close-product-modal').addEventListener('click', () => productModal.classList.remove('open'));

  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value.trim();
    const price = document.getElementById('prod-price').value;
    const category = document.getElementById('prod-category').value;
    const image = document.getElementById('prod-image').value.trim();

    if (name && price) {
      addProductToCatalog({ name, price, category, image });
      renderProducts(products);
      productModal.classList.remove('open');
      document.getElementById('product-form').reset();
    }
  });

  document.getElementById('btn-calc-shipping').addEventListener('click', handleShippingCalculation);
  document.getElementById('checkout-btn').addEventListener('click', abrirCheckout);

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

  document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
  });
}