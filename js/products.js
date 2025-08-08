// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
    }
});

let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentSort = 'default';
let currentFilters = {
    categories: [],
    priceMin: null,
    priceMax: null,
    rating: null
};

function initializeProductsPage() {
    filteredProducts = [...window.DaikoShop.products];
    setupProductsEventListeners();
    applyUrlFilters();
    renderProducts();
    renderPagination();
}

function setupProductsEventListeners() {
    // Filter event listeners
    setupCategoryFilters();
    setupPriceFilter();
    setupRatingFilters();
    setupSortFilter();
    setupViewToggle();
    setupClearFilters();
    
    // Search from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        document.getElementById('searchInput').value = searchQuery;
        applySearchFilter(searchQuery);
    }
}

function setupCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'all') {
                // If "all" is checked, uncheck others
                if (this.checked) {
                    categoryCheckboxes.forEach(cb => {
                        if (cb !== this) cb.checked = false;
                    });
                    currentFilters.categories = [];
                }
            } else {
                // If a specific category is checked, uncheck "all"
                if (this.checked) {
                    document.querySelector('input[value="all"]').checked = false;
                    currentFilters.categories.push(this.value);
                } else {
                    currentFilters.categories = currentFilters.categories.filter(cat => cat !== this.value);
                    // If no categories selected, check "all"
                    if (currentFilters.categories.length === 0) {
                        document.querySelector('input[value="all"]').checked = true;
                    }
                }
            }
            applyFilters();
        });
    });
}

function setupPriceFilter() {
    // Price filter will be applied when button is clicked
    // This is already handled in the HTML onclick="applyPriceFilter()"
}

function applyPriceFilter() {
    const priceMin = document.getElementById('priceMin').value;
    const priceMax = document.getElementById('priceMax').value;
    
    currentFilters.priceMin = priceMin ? parseInt(priceMin) : null;
    currentFilters.priceMax = priceMax ? parseInt(priceMax) : null;
    
    applyFilters();
}

function setupRatingFilters() {
    const ratingRadios = document.querySelectorAll('input[name="rating"]');
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentFilters.rating = this.checked ? parseFloat(this.value) : null;
            applyFilters();
        });
    });
}

function setupSortFilter() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            applySorting();
        });
    }
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            const productsContainer = document.getElementById('productsContainer');
            
            if (view === 'list') {
                productsContainer.classList.add('products-list');
            } else {
                productsContainer.classList.remove('products-list');
            }
        });
    });
}

function setupClearFilters() {
    // This function is called from HTML onclick="clearFilters()"
}

function clearFilters() {
    // Reset all filters
    currentFilters = {
        categories: [],
        priceMin: null,
        priceMax: null,
        rating: null
    };
    
    // Reset form elements
    document.querySelector('input[value="all"]').checked = true;
    document.querySelectorAll('input[name="category"]:not([value="all"])').forEach(cb => cb.checked = false);
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
    document.getElementById('sortSelect').value = 'default';
    
    currentSort = 'default';
    applyFilters();
}

function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Apply category filter from URL
    const category = urlParams.get('category');
    if (category && ['tools', 'accessories', 'parts', 'maintenance', 'battery'].includes(category)) {
        currentFilters.categories = [category];
        const categoryCheckbox = document.querySelector(`input[value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            document.querySelector('input[value="all"]').checked = false;
        }
    }
}

function applySearchFilter(query) {
    if (!query) return;
    
    filteredProducts = window.DaikoShop.products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts();
    renderPagination();
}

function applyFilters() {
    filteredProducts = window.DaikoShop.products.filter(product => {
        // Category filter
        if (currentFilters.categories.length > 0) {
            if (!currentFilters.categories.includes(product.category)) {
                return false;
            }
        }
        
        // Price filter
        if (currentFilters.priceMin !== null && product.price < currentFilters.priceMin) {
            return false;
        }
        if (currentFilters.priceMax !== null && product.price > currentFilters.priceMax) {
            return false;
        }
        
        // Rating filter
        if (currentFilters.rating !== null && product.rating < currentFilters.rating) {
            return false;
        }
        
        return true;
    });
    
    applySorting();
    currentPage = 1; // Reset to first page
    renderProducts();
    renderPagination();
}

function applySorting() {
    switch (currentSort) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Keep original order or shuffle for featured products
            break;
    }
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    const productCount = document.getElementById('productCount');
    
    if (!container) return;
    
    // Update product count
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <div class="no-products-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác.</p>
                <button class="btn btn-primary" onclick="clearFilters()">Xóa bộ lọc</button>
            </div>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Render products
    container.innerHTML = productsToShow.map(product => 
        window.DaikoShop.createProductCard(product)
    ).join('');
    
    // Add event listeners to add to cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            window.DaikoShop.addToCart(productId);
        });
    });
    
    // Add event listeners to action buttons
    container.querySelectorAll('.action-btn').forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = parseInt(productCard.dataset.productId);
        
        if (button.querySelector('.fa-heart')) {
            button.addEventListener('click', () => toggleWishlist(productId));
        }
        
        if (button.querySelector('.fa-eye')) {
            button.addEventListener('click', () => quickView(productId));
        }
    });
    
    // Animate product cards
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span>...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    container.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    renderPagination();
    
    // Scroll to top of products
    document.querySelector('.products-content').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Product interaction functions
function toggleWishlist(productId) {
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const isInWishlist = wishlist.includes(productId);
    
    if (isInWishlist) {
        wishlist = wishlist.filter(id => id !== productId);
        window.DaikoShop.showNotification('Đã xóa khỏi danh sách yêu thích', 'info');
    } else {
        wishlist.push(productId);
        window.DaikoShop.showNotification('Đã thêm vào danh sách yêu thích', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistIcons();
}

function updateWishlistIcons() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const heartIcon = card.querySelector('.fa-heart');
        
        if (heartIcon) {
            if (wishlist.includes(productId)) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = '#F44336';
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = '';
            }
        }
    });
}

function quickView(productId) {
    const product = window.DaikoShop.products.find(p => p.id === productId);
    if (!product) return;
    
    // Create and show quick view modal
    const modal = createQuickViewModal(product);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.display = 'block';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

function createQuickViewModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal quick-view-modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="modal-content" style="transform: scale(0.8); transition: transform 0.3s ease;">
            <div class="modal-header">
                <h2>Xem nhanh sản phẩm</h2>
                <span class="close" onclick="closeQuickView(this)">&times;</span>
            </div>
            <div class="modal-body">
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="quick-view-info">
                        <h3>${product.name}</h3>
                        <div class="product-rating">
                            <div class="stars">
                                ${window.DaikoShop.generateStars(product.rating)}
                            </div>
                            <span class="rating-text">(${product.reviews} đánh giá)</span>
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">
                            <span class="current-price">${window.DaikoShop.formatCurrency(product.price)}</span>
                            ${product.originalPrice > product.price ? 
                                `<span class="original-price">${window.DaikoShop.formatCurrency(product.originalPrice)}</span>` : ''
                            }
                        </div>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary" onclick="window.DaikoShop.addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i>
                                Thêm vào giỏ hàng
                            </button>
                            <button class="btn btn-outline" onclick="toggleWishlist(${product.id})">
                                <i class="far fa-heart"></i>
                                Yêu thích
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuickView(modal.querySelector('.close'));
        }
    });
    
    return modal;
}

function closeQuickView(closeBtn) {
    const modal = closeBtn.closest('.modal');
    modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Initialize wishlist icons when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateWishlistIcons, 500);
});

// Add CSS for additional features
const additionalCSS = `
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius-lg);
    }
    
    .no-products-icon i {
        font-size: 4rem;
        color: var(--text-light);
        margin-bottom: 1rem;
    }
    
    .no-products h3 {
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .no-products p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }
    
    .products-list .product-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .products-list .product-card {
        display: flex;
        align-items: center;
        padding: 1rem;
    }
    
    .products-list .product-image {
        width: 150px;
        height: 150px;
        flex-shrink: 0;
        margin-right: 1rem;
    }
    
    .products-list .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .quick-view-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    
    .quick-view-image img {
        width: 100%;
        border-radius: var(--border-radius);
    }
    
    .quick-view-info {
        padding: 1rem 0;
    }
    
    .quick-view-info h3 {
        font-size: var(--font-size-xl);
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .quick-view-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .quick-view-actions .btn {
        flex: 1;
    }
    
    @media (max-width: 768px) {
        .quick-view-content {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .products-list .product-card {
            flex-direction: column;
            text-align: center;
        }
        
        .products-list .product-image {
            margin-right: 0;
            margin-bottom: 1rem;
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);
