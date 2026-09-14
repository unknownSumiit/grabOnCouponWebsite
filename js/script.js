// script.js

// Mock Data (Demo only)
const couponsData = [
    { id: 1, store: 'Nike', discount: '20% OFF', title: '20% Off Selected Items', desc: 'Save 20% on selected products.', expires: 'Expires Dec 31, 2026', code: 'SAVE20', category: 'Fashion', type: 'COUPON' },
    { id: 2, store: 'Walmart', discount: '$10 OFF', title: '$10 Off Your Next Order', desc: 'Save on your next online grocery order.', expires: 'Expires Nov 30, 2026', code: 'WALMART10', category: 'Home', type: 'COUPON' },
    { id: 3, store: 'Adidas', discount: '15% OFF', title: '15% Off Sitewide', desc: 'Applies to full-price and sale items.', expires: 'Expires Dec 31, 2026', code: 'ADIDAS15', category: 'Fashion', type: 'COUPON' },
    { id: 4, store: 'Sephora', discount: '10% OFF', title: '10% Off Beauty Products', desc: 'Valid for beauty insider members.', expires: 'Expires Dec 31, 2026', code: 'BEAUTY10', category: 'Beauty', type: 'COUPON' },
    { id: 5, store: 'Target', discount: '$5 OFF', title: '$5 Off Orders Over $50', desc: 'Save on household essentials.', expires: 'Expires Oct 31, 2026', code: 'TARGET5', category: 'Home', type: 'COUPON' },
    { id: 6, store: 'Best Buy', discount: 'Free Ship', title: 'Free Shipping on Electronics', desc: 'No minimum purchase required.', expires: 'Expires Dec 31, 2026', code: '', category: 'Electronics', type: 'DEAL' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuToggle = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Modal
    const modal = document.getElementById('coupon-modal');
    const modalClose = document.getElementById('modal-close');
    if(modal && modalClose) {
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // Copy Code
    const copyBtn = document.getElementById('modal-copy-btn');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('modal-code').textContent;
            if(code && code !== 'DEAL APPLIED') {
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.textContent = 'Code Copied!';
                    copyBtn.classList.add('success');
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Code';
                        copyBtn.classList.remove('success');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy', err);
                });
            }
        });
    }

    // Initialize Pages
    if (document.getElementById('featured-coupons')) {
        renderCoupons(couponsData, 'featured-coupons');
    }

    if (document.getElementById('coupons-list')) {
        initCouponsPage();
    }
});

// Modal Functions
window.openModal = function(id) {
    const coupon = couponsData.find(c => c.id === id);
    if (!coupon) return;

    document.getElementById('modal-store').textContent = coupon.store;
    document.getElementById('modal-discount').textContent = coupon.discount;
    
    const codeEl = document.getElementById('modal-code');
    const copyBtn = document.getElementById('modal-copy-btn');
    
    if (coupon.type === 'COUPON') {
        codeEl.textContent = coupon.code;
        copyBtn.style.display = 'block';
    } else {
        codeEl.textContent = 'DEAL APPLIED';
        copyBtn.style.display = 'none';
    }

    const modal = document.getElementById('coupon-modal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('coupon-modal');
    modal.classList.remove('active');
}

// Render Coupons
function renderCoupons(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (data.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-sec);">No coupons found. Try another search.</p>';
        return;
    }

    data.forEach(coupon => {
        const badgeClass = coupon.type === 'COUPON' ? 'coupon-badge' : 'coupon-badge deal';
        const html = `
            <div class="coupon-card">
                <div class="coupon-header">
                    <span>${coupon.store}</span>
                    <span class="${badgeClass}">${coupon.type}</span>
                </div>
                <div class="coupon-discount">${coupon.discount}</div>
                <h3 class="coupon-title">${coupon.title}</h3>
                <p class="coupon-desc">${coupon.desc}</p>
                <div class="coupon-footer">
                    <span class="coupon-expires">${coupon.expires}</span>
                    <button class="btn-primary btn-block" onclick="openModal(${coupon.id})">Get ${coupon.type === 'COUPON' ? 'Coupon' : 'Deal'}</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Coupons Page Logic
function initCouponsPage() {
    let currentCat = 'All';
    let currentStore = 'All';
    let searchQuery = '';

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) searchQuery = params.get('search').toLowerCase();
    if (params.get('store')) currentStore = params.get('store');
    if (params.get('category')) currentCat = params.get('category');

    // Set initial UI state
    const searchInput = document.getElementById('page-search');
    if(searchInput && searchQuery) searchInput.value = searchQuery;

    const storeSelect = document.getElementById('store-filter');
    if(storeSelect && currentStore !== 'All') {
        const optionExists = Array.from(storeSelect.options).some(opt => opt.value === currentStore);
        if(optionExists) storeSelect.value = currentStore;
    }

    const catBtns = document.querySelectorAll('.cat-btn');
    if(catBtns) {
        catBtns.forEach(btn => {
            if(btn.dataset.cat === currentCat) {
                document.querySelector('.cat-btn.active')?.classList.remove('active');
                btn.classList.add('active');
            }
        });
    }

    function filterData() {
        let filtered = [...couponsData];

        if (searchQuery) {
            filtered = filtered.filter(c => 
                c.store.toLowerCase().includes(searchQuery) ||
                c.title.toLowerCase().includes(searchQuery) ||
                c.desc.toLowerCase().includes(searchQuery)
            );
        }

        if (currentStore !== 'All') {
            filtered = filtered.filter(c => c.store.toLowerCase() === currentStore.toLowerCase());
        }

        if (currentCat !== 'All') {
            filtered = filtered.filter(c => c.category === currentCat);
        }

        renderCoupons(filtered, 'coupons-list');
    }

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            filterData();
        });
    }

    if (storeSelect) {
        storeSelect.addEventListener('change', (e) => {
            currentStore = e.target.value;
            filterData();
        });
    }

    if (catBtns) {
        catBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                catBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentCat = e.target.dataset.cat;
                filterData();
            });
        });
    }

    // Initial render
    filterData();
}
