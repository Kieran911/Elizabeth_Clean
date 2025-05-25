class ProductImage extends HTMLElement {
  constructor() {
    super();
    this.openImageModal();
    this.addEventListener('click', this.loadContent);
  }

  loadContent() {
    // Any additional image loading logic can go here
  }

  getMediaID() {
    const id = this.getAttribute('data-media-id');
    return id;
  }

  getModal() {
    const modal = document.getElementById('productModelModal');
    return modal;
  }

  openImageModal() {
    const mediaID = this.getMediaID();
    const modal = this.getModal();

    if (!mediaID) return;

    const openModalButton = this.querySelector(
      `button[id="productImageOpenButton_${mediaID}"]`
    );

    openModalButton.addEventListener('click', function (e) {
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';

      modal.querySelector('#body').innerHTML = '';

      const template = document.querySelector(
        `product-image[data-media-id="${mediaID}"] > template`
      );
      const clone = template.content.cloneNode(true);

      // Add controls container
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'absolute bottom-4 right-4 flex gap-2 z-10';

      // Add zoom in button
      const zoomInButton = document.createElement('button');
      zoomInButton.className =
        'p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75';
      zoomInButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      `;
      zoomInButton.onclick = () => {
        const img = modal.querySelector('#body img');
        const currentScale =
          parseFloat(
            img.style.transform.replace('scale(', '').replace(')', '')
          ) || 1;
        if (currentScale < 3) {
          img.style.transform = `scale(${currentScale + 0.2})`;
        }
      };

      // Add zoom out button
      const zoomOutButton = document.createElement('button');
      zoomOutButton.className =
        'p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75';
      zoomOutButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      `;
      zoomOutButton.onclick = () => {
        const img = modal.querySelector('#body img');
        const currentScale =
          parseFloat(
            img.style.transform.replace('scale(', '').replace(')', '')
          ) || 1;
        if (currentScale > 0.25) {
          img.style.transform = `scale(${currentScale - 0.2})`;
        }
      };

      // Add fullscreen button
      const fullscreenButton = document.createElement('button');
      fullscreenButton.className =
        'p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75';
      fullscreenButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      `;

      // Add fullscreen close button (initially hidden)
      const fullscreenCloseButton = document.createElement('button');
      fullscreenCloseButton.className =
        'p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 hidden';
      fullscreenCloseButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `;

      fullscreenButton.onclick = () => {
        const img = modal.querySelector('#body img');
        if (document.fullscreenElement) {
          document.exitFullscreen();
          fullscreenButton.classList.remove('hidden');
          fullscreenCloseButton.classList.add('hidden');
        } else {
          img.requestFullscreen();
          fullscreenButton.classList.add('hidden');
          fullscreenCloseButton.classList.remove('hidden');
        }
      };

      fullscreenCloseButton.onclick = () => {
        document.exitFullscreen();
        fullscreenButton.classList.remove('hidden');
        fullscreenCloseButton.classList.add('hidden');
      };

      // Handle fullscreen change events
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          fullscreenButton.classList.remove('hidden');
          fullscreenCloseButton.classList.add('hidden');
        }
      });

      controlsContainer.appendChild(zoomInButton);
      controlsContainer.appendChild(zoomOutButton);
      controlsContainer.appendChild(fullscreenButton);
      controlsContainer.appendChild(fullscreenCloseButton);

      modal.querySelector('#body').appendChild(clone);
      modal.querySelector('#body').appendChild(controlsContainer);

      // Add transform-origin to the image
      const img = modal.querySelector('#body img');
      img.style.transformOrigin = 'center';
      img.style.transition = 'transform 0.15s ease-out';

      // Add scroll-based zooming with debounce
      let lastScrollY = 0;
      let scrollTimeout;
      const handleScroll = (e) => {
        e.preventDefault();

        // Clear any existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Set a new timeout
        scrollTimeout = setTimeout(() => {
          const currentScale =
            parseFloat(
              img.style.transform.replace('scale(', '').replace(')', '')
            ) || 1;
          const scrollDelta = e.deltaY;

          // Increase zoom sensitivity
          const zoomStep = 0.1; // Increased zoom step

          if (scrollDelta < 0 && currentScale < 3) {
            // Zoom in (scroll up)
            img.style.transform = `scale(${currentScale + zoomStep})`;
          } else if (scrollDelta > 0 && currentScale > 0.25) {
            // Zoom out (scroll down)
            img.style.transform = `scale(${currentScale - zoomStep})`;
          }
        }, 10); // Reduced debounce time
      };

      // Add wheel event listener
      modal
        .querySelector('#body')
        .addEventListener('wheel', handleScroll, { passive: false });

      // Clean up when modal is closed
      const closeModal = () => {
        document.body.style.overflow = ''; // Restore scrolling
        modal.querySelector('#body').removeEventListener('wheel', handleScroll);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
      };

      // Listen for modal close
      modal
        .querySelector('button[x-on\\:click="productModalOpen = false"]')
        .addEventListener('click', closeModal);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    });
  }
}

customElements.define('product-image', ProductImage);
