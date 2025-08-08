// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample products data based on your Shopee store
const sampleProducts = [
    {
        id: 1,
        name: "Giá treo tường pin Dewalt 18v và 20v",
        description: "Giá treo tường chuyên dụng cho pin Dewalt, tiết kiệm không gian, dễ lắp đặt",
        price: 80000,
        originalPrice: 120000,
        image: "https://via.placeholder.com/300x300/FFD700/000000?text=Giá+treo+pin+Dewalt",
        category: "tools",
        rating: 4.8,
        reviews: 128,
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Máy siết bu lông dùng Pin 18V Makita",
        description: "Máy siết bu lông không chổi than, lực xiết mạnh, pin lithium bền bỉ",
        price: 659000,
        originalPrice: 859000,
        image: "https://via.placeholder.com/300x300/00BCD4/ffffff?text=Máy+siết+bu+lông",
        category: "tools",
        rating: 4.8,
        reviews: 256,
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Giá treo tường pin Dewalt 20v và 18v",
        description: "Giá treo pin Dewalt chuyên nghiệp, chất liệu nhựa ABS bền bỉ",
        price: 533000,
        originalPrice: 733000,
        image: "https://via.placeholder.com/300x300/FFB300/000000?text=Giá+treo+Dewalt",
        category: "tools",
        rating: 4.3,
        reviews: 89,
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Giá treo đế sạc Makita DC18RC siêu bền",
        description: "Giá treo đế sạc Makita chính hãng, tiết kiệm không gian làm việc",
        price: 458000,
        originalPrice: 658000,
        image: "https://via.placeholder.com/300x300/00BCD4/ffffff?text=Đế+sạc+Makita",
        category: "tools",
        rating: 4.7,
        reviews: 167,
        inStock: true,
        featured: true
    },
    {
        id: 5,
        name: "Giá treo đế sạc pin 2 cổng 18V Makita DC18SH",
        description: "Đế sạc pin đôi Makita, sạc nhanh, an toàn với công nghệ bảo vệ pin",
        price: 860000,
        originalPrice: 1060000,
        image: "https://via.placeholder.com/300x300/1976D2/ffffff?text=Đế+sạc+đôi",
        category: "tools",
        rating: 5.0,
        reviews: 94,
        inStock: true,
        featured: true
    },
    {
        id: 6,
        name: "Giá đỡ đầu phun cho máy thổi Makita DAS180 XSA01",
        description: "Phụ kiện chuyên dụng cho máy thổi Makita, tăng hiệu quả làm việc",
        price: 688000,
        originalPrice: 888000,
        image: "https://via.placeholder.com/300x300/607D8B/ffffff?text=Đầu+phun+Makita",
        category: "accessories",
        rating: 4.6,
        reviews: 203,
        inStock: true,
        featured: false
    },
    {
        id: 7,
        name: "Giá treo tường cho bộ sạc pin Bosch Professional",
        description: "Giá treo chuyên dụng cho sạc pin Bosch, thiết kế chắc chắn, dễ lắp đặt",
        price: 535000,
        originalPrice: 735000,
        image: "https://via.placeholder.com/300x300/1565C0/ffffff?text=Giá+Bosch",
        category: "accessories",
        rating: 4.2,
        reviews: 76,
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "Dầu gẫn mùi bán vít và vít trên máy Dewalt",
        description: "Dầu bảo dưỡng chuyên dụng cho máy Dewalt, tăng tuổi thọ thiết bị",
        price: 110000,
        originalPrice: 150000,
        image: "https://via.placeholder.com/300x300/FF6F00/ffffff?text=Dầu+bảo+dưỡng",
        category: "accessories",
        rating: 4.5,
        reviews: 142,
        inStock: true,
        featured: false
    },
    {
        id: 9,
        name: "Giá treo máy MAKITA năm ngang",
        description: "Giá treo máy Makita nằm ngang, tiết kiệm không gian xưởng",
        price: 175000,
        originalPrice: 225000,
        image: "https://via.placeholder.com/300x300/00BCD4/ffffff?text=Giá+máy+Makita",
        category: "accessories",
        rating: 4.8,
        reviews: 89,
        inStock: true,
        featured: false
    },
    {
        id: 10,
        name: "Hộp đựng pin lithium 18v Makita đựng 4 pin",
        description: "Hộp đựng pin chuyên dụng Makita, bảo vệ pin khỏi va đập và ẩm ướt",
        price: 250000,
        originalPrice: 350000,
        image: "https://via.placeholder.com/300x300/4CAF50/ffffff?text=Hộp+pin+Makita",
        category: "accessories",
        rating: 2.0,
        reviews: 156,
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
