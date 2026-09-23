const products = [
  {
    id: 1,
    name: 'Гречневый корм для щенков',
    category: 'dogs',
    price: 1490,
    oldPrice: 1890,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    badge: 'Новинка'
  },
  {
    id: 2,
    name: 'Когтеточка "Клубок"',
    category: 'cats',
    price: 980,
    oldPrice: 1300,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80',
    badge: 'Хит'
  },
  {
    id: 3,
    name: 'Игрушка для зубов Bone',
    category: 'toys',
    price: 540,
    oldPrice: 760,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
    badge: 'Популярно'
  },
  {
    id: 4,
    name: 'Дождевик для прогулок',
    category: 'accessories',
    price: 1290,
    oldPrice: 1690,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80',
    badge: 'Осень'
  },
  {
    id: 5,
    name: 'Лежанка Luxe Cloud',
    category: 'dogs',
    price: 2190,
    oldPrice: 2790,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80',
    badge: 'Топ'
  },
  {
    id: 6,
    name: 'Корм с лососем для кошек',
    category: 'cats',
    price: 860,
    oldPrice: 1100,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=80',
    badge: 'Премиум'
  },
  {
    id: 7,
    name: 'Мяч-головоломка',
    category: 'toys',
    price: 690,
    oldPrice: 930,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=900&q=80',
    badge: 'Игровой'
  },
  {
    id: 8,
    name: 'Шлейка Urban Pet',
    category: 'accessories',
    price: 1420,
    oldPrice: 1860,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
    badge: 'Удобно'
  },
  {
    id: 9,
    name: 'Миска антискользящая',
    category: 'dogs',
    price: 640,
    oldPrice: 820,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
    badge: 'Легко'
  },
  {
    id: 10,
    name: 'Домик для кота Soft Nest',
    category: 'cats',
    price: 2490,
    oldPrice: 3090,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80',
    badge: 'Комфорт'
  }
];

const categoryMap = {
  all: 'Все',
  dogs: 'Собаки',
  cats: 'Кошки',
  toys: 'Игрушки',
  accessories: 'Аксессуары'
};

const state = {
  filter: 'all',
  sort: 'default',
  search: '',
  favorites: JSON.parse(localStorage.getItem('pawshop-favorites') || '[]'),
  cart: JSON.parse(localStorage.getItem('pawshop-cart') || '[]')
};

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const favoriteButton = document.getElementById('favoriteButton');
const favoriteCount = document.getElementById('favoriteCount');
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartContent = document.getElementById('cartContent');
const promoButton = document.getElementById('promoButton');
const promoButtonStrip = document.getElementById('promoButtonStrip');
const scrollTopButton = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const toastContainer = document.getElementById('toastContainer');

const cartModal = document.getElementById('cartModal');
const promoModal = document.getElementById('promoModal');

function saveCart() {
  localStorage.setItem('pawshop-cart', JSON.stringify(state.cart));
}

function saveFavorites() {
  localStorage.setItem('pawshop-favorites', JSON.stringify(state.favorites));
}

function getFilteredProducts() {
  let result = [...products];

  if (state.filter !== 'all') {
    result = result.filter((product) => product.category === state.filter);
  }

  if (state.search.trim()) {
    const term = state.search.toLowerCase();
    result = result.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        categoryMap[product.category].toLowerCase().includes(term)
      );
    });
  }

  if (state.sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (state.sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (state.sort === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    productGrid.innerHTML = `
      <div class="cart-empty" style="grid-column: 1 / -1; padding: 46px 22px;">
        По вашему запросу ничего не найдено.
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map((product) => {
      const isFavorite = state.favorites.includes(product.id);
      const quantity = state.cart.find((item) => item.id === product.id)?.quantity || 0;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image">
            <span class="product-badge">${product.badge}</span>
            <button
              class="favorite-toggle ${isFavorite ? 'active' : ''}"
              type="button"
              data-product-id="${product.id}"
              aria-label="Добавить в избранное"
            >
              ${isFavorite ? '♥' : '♡'}
            </button>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <div class="product-top">
              <div class="product-name">${product.name}</div>
            </div>
            <div class="rating">★ ${product.rating}</div>
            <div class="price-box">
              <span class="price">${formatPrice(product.price)}</span>
              <span class="old-price">${formatPrice(product.oldPrice)}</span>
            </div>
            <div class="discount-tag">-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</div>
            <div class="product-actions">
              <button class="add-cart-btn" data-product-id="${product.id}" type="button">
                ${quantity > 0 ? 'Добавить ещё' : 'В корзину'}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderCart() {
  if (!state.cart.length) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        Ваша корзина пуста. Добавьте что-нибудь из каталога.
      </div>
    `;
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartContent.innerHTML = `
    ${state.cart
      .map((item) => {
        return `
          <div class="cart-item" data-cart-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-meta">
                <span>${formatPrice(item.price)}</span>
                <div class="quantity-controls">
                  <button class="qty-btn" data-action="decrease" data-product-id="${item.id}" type="button">−</button>
                  <span>${item.quantity}</span>
                  <button class="qty-btn" data-action="increase" data-product-id="${item.id}" type="button">+</button>
                </div>
              </div>
            </div>
            <div class="cart-item-total">
              <strong>${formatPrice(item.price * item.quantity)}</strong>
              <button class="remove-btn" type="button" data-product-id="${item.id}">Удалить</button>
            </div>
          </div>
        `;
      })
      .join('')}
    <div class="cart-footer">
      <div class="cart-total">Итого: ${formatPrice(total)}</div>
      <button class="primary-btn" type="button">Оформить заказ</button>
    </div>
  `;
}

function updateCounts() {
  favoriteCount.textContent = state.favorites.length;
  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateCounts();
  renderCart();
  showToast(`${product.name} добавлен в корзину`);
}

function toggleFavorite(productId) {
  const id = Number(productId);

  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter((item) => item !== id);
    showToast('Товар удалён из избранного');
  } else {
    state.favorites.push(id);
    showToast('Товар добавлен в избранное');
  }

  saveFavorites();
  updateCounts();
  renderProducts();
}

function changeQuantity(productId, delta) {
  const item = state.cart.find((entry) => entry.id === Number(productId));
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== Number(productId));
  }

  saveCart();
  updateCounts();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  saveCart();
  updateCounts();
  renderCart();
  showToast('Товар удалён из корзины');
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function initializeCategoryButtons() {
  document.querySelectorAll('.category-card').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      state.filter = category;

      document.querySelectorAll('.category-card').forEach((card) => {
        card.classList.toggle('active', card.dataset.category === state.filter);
      });

      document.querySelectorAll('.filter-button').forEach((filterButton) => {
        filterButton.classList.toggle('active', filterButton.dataset.filter === state.filter);
      });

      renderProducts();
    });
  });
}

function initializeFilterButtons() {
  document.querySelectorAll('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.filter;
      state.filter = value;

      document.querySelectorAll('.filter-button').forEach((item) => {
        item.classList.toggle('active', item === button);
      });

      document.querySelectorAll('.category-card').forEach((card) => {
        card.classList.toggle('active', card.dataset.category === state.filter);
      });

      renderProducts();
    });
  });
}

function bindEvents() {
  searchInput.addEventListener('input', (event) => {
    state.search = event.target.value.trim();
    renderProducts();
  });

  sortSelect.addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  productGrid.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-cart-btn');
    if (addButton) {
      addToCart(addButton.dataset.productId);
      return;
    }

    const favoriteButtonElement = event.target.closest('.favorite-toggle');
    if (favoriteButtonElement) {
      toggleFavorite(favoriteButtonElement.dataset.productId);
    }
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-product-id]');
    const quantityButton = event.target.closest('[data-action]');

    if (quantityButton) {
      const action = quantityButton.dataset.action;
      const productId = quantityButton.dataset.productId;
      if (action === 'increase') changeQuantity(productId, 1);
      if (action === 'decrease') changeQuantity(productId, -1);
    }

    if (event.target.closest('.remove-btn')) {
      const id = event.target.closest('.remove-btn').dataset.productId;
      removeFromCart(id);
    }

    if (event.target.closest('[data-close]')) {
      const modalId = event.target.closest('[data-close]').dataset.close;
      closeModal(modalId);
    }

    if (event.target.closest('#cartButton')) {
      openModal('cartModal');
    }

    if (event.target.closest('#favoriteButton')) {
      const favoriteIds = [...state.favorites];
      if (!favoriteIds.length) {
        showToast('У вас пока нет избранных товаров');
        return;
      }
      const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));
      showToast(`Избранное: ${favoriteProducts.length} товаров`);
    }

    if (event.target.closest('#promoButton') || event.target.closest('#promoButtonStrip')) {
      openModal('promoModal');
    }

    if (event.target.closest('#copyPromoCode')) {
      const code = document.getElementById('promoCodeBox').textContent;
      navigator.clipboard.writeText(code).then(() => {
        showToast('Промокод скопирован');
      });
    }

    if (event.target.closest('.close-btn')) {
      const modalId = event.target.closest('.close-btn').dataset.close;
      if (modalId) {
        closeModal(modalId);
      }
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('modal-backdrop')) {
      const modalId = target.closest('.modal')?.id;
      if (modalId) closeModal(modalId);
    }
  });

  window.addEventListener('scroll', () => {
    scrollTopButton.classList.toggle('visible', window.scrollY > 420);
  });

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 2) {
      showToast('Пожалуйста, введите корректное имя');
      return;
    }

    if (!emailRegex.test(email)) {
      showToast('Введите корректный email');
      return;
    }

    if (!message || message.length < 10) {
      showToast('Сообщение должно содержать минимум 10 символов');
      return;
    }

    showToast('Ваше сообщение отправлено');
    contactForm.reset();
  });
}

function init() {
  updateCounts();
  renderProducts();
  renderCart();
  initializeCategoryButtons();
  initializeFilterButtons();
  bindEvents();
}

init();
