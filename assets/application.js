// --- Cart Drawer UI Toggle Logic ---
const cartSidebar = document.querySelector('.js-cart-sidebar');
const closeIcon = document.querySelector('.js-close-icon');
const cartBtn = document.querySelector('.js-cart-btn');
const cartBtn2 = document.querySelector('.js-cart-btn2'); // Assuming this is another button to open the cart

/**
 * Toggles the visibility of the cart sidebar.
 * @param {boolean} isOpen - True to open, false to close.
 */
function toggleCartSidebar(isOpen) {
  if (cartSidebar) {
    // Check if the element exists
    if (isOpen) {
      cartSidebar.classList.remove('right-[-100%]');
      cartSidebar.classList.add('right-0');
    } else {
      cartSidebar.classList.remove('right-0');
      cartSidebar.classList.add('right-[-100%]');
    }
  }
}

// Event listeners for opening the cart sidebar
if (cartBtn) {
  cartBtn.addEventListener('click', () => toggleCartSidebar(true));
}
if (cartBtn2) {
  cartBtn2.addEventListener('click', () => toggleCartSidebar(true));
}

// Event listener for closing the cart sidebar
if (closeIcon) {
  closeIcon.addEventListener('click', () => toggleCartSidebar(false));
}
