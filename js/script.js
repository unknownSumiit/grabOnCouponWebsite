// script.js

// Mock Data
const couponsData = [
    { id: 1, store: 'Nike', discount: '20% OFF', title: '20% Off Selected Items', description: 'Save 20% on selected products.', code: 'SAVE20', category: 'Fashion', expires: 'Dec 31, 2026', type: 'COUPON', popular: true, new: true },
    { id: 2, store: 'Walmart', discount: '$10 OFF', title: '$10 Off Your Next Order', description: 'Save $10 when eligible.', code: 'SAVE10', category: 'Home', expires: 'Dec 31, 2026', type: 'COUPON', popular: true, new: false },
    { id: 3, store: 'Adidas', discount: '15% OFF', title: '15% Off Sitewide', description: 'Save 15% on your entire order.', code: 'DEAL15', category: 'Fashion', expires: 'Dec 31, 2026', type: 'COUPON', popular: true, new: true },
    { id: 4, store: 'Sephora', discount: '10% OFF', title: '10% Off Beauty Products', description: 'Save 10% on selected beauty products.', code: 'BEAUTY10', category: 'Beauty', expires: 'Dec 31, 2026', type: 'COUPON', popular: true, new: false },
    { id: 5, store: 'Target', discount: '$5 OFF', title: '$5 Off Orders Over $50', description: 'Save $5 when you spend $50 or more.', code: 'TARGET5', category: 'Shopping', expires: 'Nov 30, 2026', type: 'DEAL', popular: false, new: true },
    { id: 6, store: 'Best Buy', discount: '5% OFF', title: '5% Off Electronics', description: 'Save 5% on selected electronics.', code: 'TECH5', category: 'Electronics', expires: 'Oct 31, 2026', type: 'COUPON', popular: false, new: false },
    { id: 7, store: 'Macy\'s', discount: 'FREE SHIPPING', title: 'Free Shipping on Orders Over $25', description: 'Get free shipping on your next order.', code: 'FREESHIP', category: 'Fashion', expires: 'Dec 31, 2026', type: 'DEAL', popular: false, new: true },
    { id: 8, store: 'eBay', discount: '10% OFF', title: '10% Off Refurbished Items', description: 'Save 10% on certified refurbished items.', code: 'EBAY10', category: 'Electronics', expires: 'Dec 31, 2026', type: 'COUPON', popular: false, new: false }
];

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if(mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Modal elements
    const modalOverlay = document.getElementById('coupon-modal');
    const modalClose = document.getElementById('modal-close');
    const copyBtn = document.getElementById('modal-copy-btn');
    const copySuccess = document.getElementById('copy-success');
    
    // Close modal
    if(modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if(modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) closeModal();
        });
    }

    // Copy Code
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('modal-code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copySuccess.style.display = 'block';
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copySuccess.style.display = 'none';
                    copyBtn.textContent = 'Copy Code';
                }, 2000);
            });
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('newsletter-email');
            const msg = document.getElementById('newsletter-msg');
            
            if(input.value && input.value.includes('@')) {
                msg.style.display = 'block';
                input.value = '';
                setTimeout(() => {
                    msg.style.display = 'none';
                }, 3000);
            }
        });
    }

    // Initialize Home or Coupons Page
    if(document.getElementById('top-deals-container')) {
        renderCoupons(couponsData.slice(0, 4), 'top-deals-container');
    }

    if(document.getElementById('coupons-page-container')) {
        initCouponsPage();
    }
});

function openModal(couponId) {
    const coupon = couponsData.find(c => c.id === couponId);
    if(!coupon) return;

    document.getElementById('modal-discount').textContent = coupon.discount;
    document.getElementById('modal-store').textContent = coupon.store;
    document.getElementById('modal-title').textContent = 'Your Coupon Code';
    document.getElementById('modal-code').textContent = coupon.code;
    
    const modal = document.getElementById('coupon-modal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('coupon-modal');
    modal.classList.remove('active');
}

function renderCoupons(coupons, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    container.innerHTML = '';
    
    if(coupons.length === 0) {
        container.innerHTML = '<p>No coupons found matching your criteria.</p>';
        return;
    }
    
    coupons.forEach(coupon => {
        const badgeClass = coupon.type === 'COUPON' ? 'badge-coupon' : 'badge-deal';
        
        const card = document.createElement('div');
        card.className = 'coupon-card';
        card.innerHTML = `
            <div class="coupon-header">
                <span class="coupon-store">${coupon.store}</span>
                <span class="badge ${badgeClass}">${coupon.type}</span>
            </div>
            <div class="coupon-discount">${coupon.discount}</div>
            <div class="coupon-title">${coupon.title}</div>
            <div class="coupon-desc">${coupon.description}</div>
            <div class="coupon-meta">
                <span>${coupon.category}</span>
                <span>Expires ${coupon.expires}</span>
            </div>
            <button class="btn-get-coupon" onclick="openModal(${coupon.id})">Get Coupon</button>
        `;
        container.appendChild(card);
    });
}

function initCouponsPage() {
    let currentCategory = 'All';
    let currentStore = 'All';
    let currentSort = 'Most Popular';
    
    // Check URL params for store
    const urlParams = new URLSearchParams(window.location.search);
    const storeParam = urlParams.get('store');
    if(storeParam) {
        currentStore = storeParam;
        const storeSelect = document.getElementById('store-filter');
        if(storeSelect) storeSelect.value = storeParam;
    }

    function filterAndRender() {
        let filtered = [...couponsData];
        
        if(currentCategory !== 'All') {
            filtered = filtered.filter(c => c.category === currentCategory);
        }
        
        if(currentStore !== 'All Stores' && currentStore !== 'All') {
            filtered = filtered.filter(c => c.store.toLowerCase() === currentStore.toLowerCase());
        }
        
        // Sorting logic (mock logic)
        if(currentSort === 'Newest') {
            filtered = filtered.filter(c => c.new).concat(filtered.filter(c => !c.new));
        } else if (currentSort === 'Highest Discount') {
            // simple mock sort
            filtered = filtered.reverse();
        }
        
        renderCoupons(filtered, 'coupons-page-container');
    }

    // Category Buttons
    const catButtons = document.querySelectorAll('.category-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            catButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.cat;
            filterAndRender();
        });
    });
    
    // Store Filter
    const storeSelect = document.getElementById('store-filter');
    if(storeSelect) {
        storeSelect.addEventListener('change', (e) => {
            currentStore = e.target.value;
            filterAndRender();
        });
    }
    
    // Sort Filter
    const sortSelect = document.getElementById('sort-filter');
    if(sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndRender();
        });
    }
    
    // Search
    const searchInput = document.getElementById('page-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if(term === '') {
                filterAndRender();
                return;
            }
            
            const searched = couponsData.filter(c => 
                c.store.toLowerCase().includes(term) ||
                c.title.toLowerCase().includes(term) ||
                c.description.toLowerCase().includes(term) ||
                c.code.toLowerCase().includes(term)
            );
            renderCoupons(searched, 'coupons-page-container');
        });
    }

    filterAndRender();
}
