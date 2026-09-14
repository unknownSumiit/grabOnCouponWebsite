// Mock Data
const couponsData = [
    { id: 1, store: 'Nike', discount: 'Up to 40% Off', title: 'Up to 40% Off Select Styles', description: 'Save on selected shoes, activewear, and accessories.', code: 'SAVE40', category: 'Fashion', expires: 'Ends soon', type: 'DEAL', verified: true },
    { id: 2, store: 'Walmart', discount: '$20 OFF', title: '$20 Off Your First Grocery Order', description: 'Minimum spend of $50 required. Excludes electronics.', code: 'GROCERY20', category: 'Home', expires: 'Verified Today', type: 'COUPON', verified: true },
    { id: 3, store: 'Best Buy', discount: '20% OFF', title: '20% Off Select Electronics', description: 'Discount applies at checkout on eligible items.', code: 'TECHSAVE', category: 'Electronics', expires: '2 Days Left', type: 'COUPON', verified: true },
    { id: 4, store: 'Target', discount: '$5 OFF', title: '$5 Gift Card on $50 Purchase', description: 'Valid on health and beauty purchases online.', code: 'BEAUTY5', category: 'Beauty', expires: 'Verified Today', type: 'COUPON', verified: true },
    { id: 5, store: 'Amazon', discount: 'Free Shipping', title: 'Free One-Day Shipping', description: 'Available on eligible prime orders over $25.', code: '', category: 'Shopping', expires: 'Ongoing', type: 'DEAL', verified: true },
    { id: 6, store: 'Sephora', discount: '15% OFF', title: '15% Off Sitewide for Members', description: 'Beauty Insider members save 15% on all orders.', code: 'INSIDER15', category: 'Beauty', expires: 'Ends Tomorrow', type: 'COUPON', verified: true },
    { id: 7, store: 'Expedia', discount: '10% OFF', title: '10% Off Hotel Bookings', description: 'Save on select hotels. Must book by Friday.', code: 'TRAVEL10', category: 'Travel', expires: 'Verified Today', type: 'COUPON', verified: true },
    { id: 8, store: 'Adidas', discount: '30% OFF', title: '30% Off Outlet Items', description: 'Extra 30% off already reduced outlet apparel.', code: 'EXTRA30', category: 'Fashion', expires: 'Verified Today', type: 'COUPON', verified: true }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            // Toggle icon
            if(mobileMenu.classList.contains('open')) {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>';
            } else {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>';
            }
        });
    }

    // Modal logic
    const modalOverlay = document.getElementById('coupon-modal');
    const modalClose = document.getElementById('modal-close');
    const copyBtn = document.getElementById('modal-copy-btn');
    
    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('modal-code').textContent;
            if(code && code !== 'No Code Needed') {
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('success');
                    showToast('Coupon code copied to clipboard!');
                    
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Code';
                        copyBtn.classList.remove('success');
                    }, 3000);
                });
            } else {
                window.open('#', '_blank'); // Mock redirect for deals
            }
        });
    }

    // Initialize Pages
    if (document.getElementById('featured-deals')) {
        renderCoupons(couponsData.slice(0, 4), 'featured-deals');
    }

    if (document.getElementById('coupons-directory')) {
        initCouponsDirectory();
    }
});

// Toast Notification
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.openModal = function(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;

    document.getElementById('modal-store-name').textContent = coupon.store.charAt(0);
    document.getElementById('modal-title').textContent = coupon.title;
    document.getElementById('modal-desc').textContent = coupon.description;
    
    const codeEl = document.getElementById('modal-code');
    const copyBtn = document.getElementById('modal-copy-btn');
    
    if (coupon.type === 'COUPON') {
        codeEl.textContent = coupon.code;
        copyBtn.textContent = 'Copy Code';
    } else {
        codeEl.textContent = 'No Code Needed';
        copyBtn.textContent = 'Shop Sale';
    }

    const modal = document.getElementById('coupon-modal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('coupon-modal');
    modal.classList.remove('active');
}

function renderCoupons(coupons, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (coupons.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1;">No deals found matching your criteria.</p>';
        return;
    }
    
    coupons.forEach(coupon => {
        const isCoupon = coupon.type === 'COUPON';
        const badgeIcon = coupon.verified ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"></path></svg>' : '';
        
        const html = `
            <div class="coupon-card">
                <div class="card-top">
                    <div class="store-info">
                        <div class="store-logo-sm">${coupon.store.charAt(0)}</div>
                        <div class="store-name-sm">${coupon.store}</div>
                    </div>
                    ${coupon.verified ? `<span class="badge verified">${badgeIcon} Verified</span>` : ''}
                </div>
                
                <h3 class="coupon-discount">${coupon.discount}</h3>
                <p class="coupon-desc">${coupon.title}</p>
                
                <div class="card-bottom">
                    <div class="card-meta">
                        <span>${coupon.expires}</span>
                        <span class="badge deal-type">${coupon.type}</span>
                    </div>
                    <button class="btn-get-deal" onclick="openModal(${coupon.id})">
                        ${isCoupon ? 'Show Coupon' : 'Get Deal'}
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function initCouponsDirectory() {
    let currentCategory = 'All';
    let searchQuery = '';
    
    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const storeParam = params.get('store');
    const qParam = params.get('q');
    
    if(qParam) {
        searchQuery = qParam.toLowerCase();
        const searchInput = document.getElementById('directory-search');
        if(searchInput) searchInput.value = qParam;
    }

    function applyFilters() {
        let filtered = [...couponsData];
        
        if (currentCategory !== 'All') {
            filtered = filtered.filter(c => c.category === currentCategory);
        }
        
        if (storeParam) {
            filtered = filtered.filter(c => c.store.toLowerCase() === storeParam.toLowerCase());
        }
        
        if (searchQuery) {
            filtered = filtered.filter(c => 
                c.store.toLowerCase().includes(searchQuery) || 
                c.title.toLowerCase().includes(searchQuery)
            );
        }
        
        renderCoupons(filtered, 'coupons-directory');
    }

    // Category buttons
    const catBtns = document.querySelectorAll('.filter-btn.cat');
    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            catBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentCategory = e.currentTarget.dataset.cat;
            applyFilters();
        });
    });

    // Search input
    const searchInput = document.getElementById('directory-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            applyFilters();
        });
    }
    
    applyFilters();
}
