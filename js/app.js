// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: "Áo thun nam cao cấp",
        description: "Áo thun nam chất liệu cotton 100%, thoáng mát, thấm hút mồ hôi tốt",
        price: 299000,
        originalPrice: 399000,
        image: "https://via.placeholder.com/300x300/4CAF50/ffffff?text=Áo+thun+nam",
        category: "fashion",
        rating: 4.5,
        reviews: 128,
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Điện thoại thông minh XY Pro",
        description: "Smartphone cao cấp với camera 108MP, chip xử lý mạnh mẽ",
        price: 8990000,
        originalPrice: 10990000,
        image: "https://via.placeholder.com/300x300/2196F3/ffffff?text=Điện+thoại",
        category: "electronics",
        rating: 4.8,
        reviews: 256,
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Nồi cơm điện cao cấp",
        description: "Nồi cơm điện 1.8L, công nghệ fuzzy logic, nấu cơm ngon",
        price: 1590000,
        originalPrice: 1990000,
        image: "https://via.placeholder.com/300x300/FF9800/ffffff?text=Nồi+cơm",
        category: "home",
        rating: 4.3,
        reviews: 89,
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Kem dưỡng da mặt",
        description: "Kem dưỡng da chống lão hóa, phù hợp mọi loại da",
        price: 450000,
        originalPrice: 600000,
        image: "https://via.placeholder.com/300x300/E91E63/ffffff?text=Kem+dưỡng",
        category: "beauty",
        rating: 4.7,
        reviews: 167,
        inStock: true,
        featured: true
    },
    {
        id: 5,
        name: "Quần jeans nam slim fit",
        description: "Quần jeans nam form slim, chất liệu denim cao cấp",
        price: 549000,
        originalPrice: 699000,
        image: "https://via.placeholder.com/300x300/3F51B5/ffffff?text=Quần+jeans",
        category: "fashion",
        rating: 4.4,
        reviews: 94,
        inStock: true,
        featured: false
    },
    {
        id: 6,
        name: "Tai nghe Bluetooth Premium",
        description: "Tai nghe không dây, chất lượng âm thanh hi-fi, pin 30h",
        price: 1200000,
        originalPrice: 1500000,
        image: "https://via.placeholder.com/300x300/9C27B0/ffffff?text=Tai+nghe",
        category: "electronics",
        rating: 4.6,
        reviews: 203,
        inStock: true,
        featured: false
    },
    {
        id: 7,
        name: "Bộ dao thớt gỗ cao cấp",
        description: "Bộ dao nhà bếp sắc bén với thớt gỗ tự nhiên",
        price: 890000,
        originalPrice: 1200000,
        image: "https://via.placeholder.com/300x300/795548/ffffff?text=Dao+thớt",
        category: "home",
        rating: 4.2,
        reviews: 76,
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "Son môi lâu trôi",
        description: "Son môi màu đỏ cam, lâu trôi, không khô môi",
        price: 320000,
        originalPrice: 450000,
        image: "https://via.placeholder.com/300x300/F44336/ffffff?text=Son+môi",
        category: "beauty",
        rating: 4.5,
        reviews: 142,
        inStock: true,
        featured: false
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    products = sampleProducts;
    initializeApp();
});

function initializeApp() {
    updateCartCount();
    setupEventListeners();
    loadFeaturedProducts();
    initializeSlider();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch(this.value);
            }
        });

        // Search button
        const searchButton = searchInput.nextElementSibling;
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                handleSearch(searchInput.value);
            });
        }
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            handleNewsletterSignup(email);
        });
    }
}

// Handle search
function handleSearch(query) {
    if (!query.trim()) return;
    
    const searchParams = new URLSearchParams();
    searchParams.set('search', query.trim());
    window.location.href = `products.html?${searchParams.toString()}`;
}

// Handle newsletter signup
function handleNewsletterSignup(email) {
    if (!email) return;
    
    // Simulate API call
    showNotification('Đăng ký thành công! Cảm ơn bạn đã quan tâm đến Daiko Shop.', 'success');
    
    // Clear form
    const form = document.querySelector('.newsletter-form');
    form.reset();
}

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featuredProducts = products.filter(product => product.featured);
    
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to add to cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            addToCart(productId);
        });
    });
}

// Create product card HTML
function createProductCard(product) {
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${discountPercent > 0 ? `<span class="product-badge">-${discountPercent}%</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="toggleWishlist(${product.id})" title="Yêu thích">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Xem nhanh">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews} đánh giá)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''
                    }
                </div>
                <button class="add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                </button>
            </div>
        </div>
    `;
}

// Generate stars for rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star"></i>';
    }
    
    return stars;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Add to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    
    // If on cart page, reload cart display
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
}

// Update cart quantity
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = quantity;
    saveCart();
    updateCartCount();
    
    // If on cart page, reload cart display
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Toggle wishlist (placeholder)
function toggleWishlist(productId) {
    showNotification('Tính năng yêu thích sẽ được cập nhật sớm!', 'info');
}

// Quick view (placeholder)
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`Xem nhanh: ${product.name}`, 'info');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: getNotificationColor(type),
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        zIndex: '2000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '350px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#4CAF50';
        case 'error': return '#F44336';
        case 'warning': return '#FF9800';
        default: return '#2196F3';
    }
}

// Initialize slider
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Initialize first slide
    showSlide(0);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// Back to top button (if exists)
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    }, 100));
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Export functions for use in other files
window.DaikoShop = {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    formatCurrency,
    showNotification,
    generateStars,
    createProductCard
};
