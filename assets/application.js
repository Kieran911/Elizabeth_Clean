/* Mobile nav js code */
document.addEventListener('DOMContentLoaded', () => {
  const mobileNavButton = document.querySelector('.mobile-nav-button');
  const mobileNavDiv = document.querySelector('.mobile-nav-div');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeButton = document.querySelector('.mobile-nav button');
  const plusIcon = document.querySelector('.plus-icon');
  const sublinkNav = document.querySelector('.sublink-nav');
  const minusIcon = document.querySelector('.minus-icon');
  const closeIcon = document.querySelector('.close-icon');

  let isNavOpen = false;
  let isSublinkOpen = false;

  function toggleNav() {
    isNavOpen = !isNavOpen;

    if (isNavOpen) {
      mobileNavDiv.classList.remove('opacity-0', 'pointer-events-none');

      mobileNav.classList.remove('-translate-x-full');
    } else {
      mobileNav.classList.add('-translate-x-full');

      isSublinkOpen = false;
      sublinkNav.classList.add('-translate-x-full');

      setTimeout(() => {
        mobileNavDiv.classList.add('opacity-0', 'pointer-events-none');
      }, 300);
    }
  }

  function toggleSublink() {
    isSublinkOpen = !isSublinkOpen;

    if (isSublinkOpen) {
      sublinkNav.classList.remove('-translate-x-full');
    } else {
      sublinkNav.classList.add('-translate-x-full');
    }
  }

  // Event listeners
  mobileNavButton.addEventListener('click', toggleNav);
  closeButton.addEventListener('click', toggleNav);
  plusIcon.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSublink();
  });
  minusIcon.addEventListener('click', toggleSublink);
  closeIcon.addEventListener('click', toggleNav);

  // Close nav when clicking outside
  mobileNavDiv.addEventListener('click', (e) => {
    if (e.target === mobileNavDiv) {
      toggleNav();
    }
  });
});

function openCartDrawer() {
  document.querySelector('.cart-drawer').classList.add('cart-drawer--active');
}

function closeCartDrawer() {
  document
    .querySelector('.cart-drawer')
    .classList.remove('cart-drawer--active');
}

function updateCartItemCounts(count) {
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = count;
  });
}

async function updateCartDrawer() {
  const res = await fetch('/?section_id=cart-drawer');
  const text = await res.text();
  const html = document.createElement('div');
  html.innerHTML = text;

  const newBox = html.querySelector('.cart-drawer').innerHTML;

  document.querySelector('.cart-drawer').innerHTML = newBox;

  addCartDrawerListeners();
}

function addCartDrawerListeners() {
  // Update quantities
  document
    .querySelectorAll('.cart-drawer-quantity-selector button')
    .forEach((button) => {
      button.addEventListener('click', async () => {
        // Get line item key
        const rootItem =
          button.parentElement.parentElement.parentElement.parentElement
            .parentElement;
        const key = rootItem.getAttribute('data-line-item-key');

        // Get new quantity
        const currentQuantity = Number(
          button.parentElement.querySelector('input').value
        );
        const isUp = button.classList.contains(
          'cart-drawer-quantity-selector-plus'
        );
        const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

        // Ajax update\
        const res = await fetch('/cart/update.js', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ updates: { [key]: newQuantity } }),
        });
        const cart = await res.json();

        updateCartItemCounts(cart.item_count);

        // Update cart
        updateCartDrawer();
      });
    });

  document.querySelector('.cart-drawer-box').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document
    .querySelectorAll('.cart-drawer-header-right-close, .cart-drawer')
    .forEach((el) => {
      el.addEventListener('click', () => {
        closeCartDrawer();
      });
    });
}

addCartDrawerListeners();

document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Submit form with ajax
    await fetch('/cart/add', {
      method: 'post',
      body: new FormData(form),
    });

    // Get cart count
    const res = await fetch('/cart.js');
    const cart = await res.json();
    updateCartItemCounts(cart.item_count);

    // Update cart
    await updateCartDrawer();

    // Open cart drawer
    openCartDrawer();
  });
});

document.querySelectorAll('a[href="/cart"]').forEach((a) => {
  // Skip the "View Cart" link in the cart drawer
  if (a.closest('.cart-drawer')) return;

  a.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  });
});
