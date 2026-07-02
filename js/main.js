// KRAYVO main JavaScript
// Platform embedding detection, Firestore data loading, UI helpers

(function() {
  'use strict';

  // ---------- Platform embedding rules ----------
  const iframeSupported = ['flipkart', 'savana']; // platforms that allow iframe embedding

  // ---------- Toast notification ----------
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ---------- Open platform product ----------
  window.openPlatform = function(platform, productUrl) {
    // platform: lowercase string (e.g., 'amazon', 'flipkart')
    // productUrl: direct URL to the product on that platform
    if (!platform || !productUrl) return;

    if (iframeSupported.includes(platform)) {
      // Attempt iframe – not used in card clicks, but for future dedicated view
      // For now, card clicks all open new tab unless explicitly iframe-supported
      // (We handle card clicks differently, see below)
    }

    // Default: open in new tab (works for all, including iframe-supported as fallback)
    window.open(productUrl, '_blank', 'noopener,noreferrer');
    showToast(`Opening on ${platform.charAt(0).toUpperCase() + platform.slice(1)} ↗`);
  };

  // ---------- Attach click events to product cards ----------
  function bindProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', function(e) {
        const platform = this.dataset.platform;
        const productUrl = this.dataset.url;
        if (platform && productUrl) {
          openPlatform(platform, productUrl);
        }
      });
    });
  }

  // ---------- Load products (static demo data + Firestore placeholder) ----------
  async function loadProducts(containerSelector, category = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Static fallback data (replace with Firestore in production)
    const demoProducts = [
      { id:1, name:"Wireless Earbuds", price:"₹1,499", platform:"amazon", img:"https://picsum.photos/200", url:"https://www.amazon.in/dp/example1" },
      { id:2, name:"Men's Running Shoes", price:"₹2,299", platform:"flipkart", img:"https://picsum.photos/201", url:"https://www.flipkart.com/example2" },
      { id:3, name:"Cotton Kurta", price:"₹899", platform:"myntra", img:"https://picsum.photos/202", url:"https://www.myntra.com/example3" },
      { id:4, name:"Sunglasses", price:"₹799", platform:"ajio", img:"https://picsum.photos/203", url:"https://www.ajio.com/example4" },
      { id:5, name:"Yoga Mat", price:"₹599", platform:"meesho", img:"https://picsum.photos/204", url:"https://www.meesho.com/example5" },
      { id:6, name:"Denim Jacket", price:"₹2,499", platform:"savana", img:"https://picsum.photos/205", url:"https://www.savana.com/example6" }
    ];

    // TODO: Replace with Firestore getDocs query, filter by category if needed
    // const snapshot = await getDocs(collection(db, "products"));

    let products = demoProducts;
    if (category) {
      products = products.filter(p => p.platform === category); // simplistic
    }

    container.innerHTML = products.map(p => `
      <div class="product-card" data-platform="${p.platform}" data-url="${p.url}">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="card-body">
          <div class="product-name">${p.name}</div>
          <div class="product-price">${p.price}</div>
          <div class="platform-badge">
            ${p.platform} <span class="external-icon">↗</span>
          </div>
        </div>
      </div>
    `).join('');

    bindProductCards();
  }

  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Load home page product grid if present
    const grid = document.getElementById('home-product-grid');
    if (grid) {
      loadProducts('#home-product-grid');
    }
    // Also bind any static cards that might be in the HTML
    bindProductCards();
  });

  // Expose for other pages
  window.loadProducts = loadProducts;
})();
