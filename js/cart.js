// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    }
});

let shippingFee = 30000;
let discountAmount = 0;
let appliedCoupon = null;

// Sample coupons
const coupons = {
    'DAIKO10': { discount: 0.1, minAmount: 500000, description: 'Giảm 10% cho đơn hàng từ 500k' },
    'FREESHIP': { discount: 30000, type: 'fixed', description: 'Miễn phí vận chuyển' },
    'WELCOME': { discount: 50000, type: 'fixed', minAmount: 300000, description: 'Giảm 50k cho khách hàng mới' }
};

function initializeCartPage() {
    loadCartItems();
    setupCartEventListeners();
}

function setupCartEventListeners() {
    // Checkout button
    const checkoutBtn = document.querySelector('button[onclick="proceedToCheckout()"]');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Apply coupon button
    const applyCouponBtn = document.querySelector('button[onclick="applyCoupon()"]');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // Continue shopping link
    const continueShoppingLink = document.querySelector('.continue-shopping a');
    if (continueShoppingLink) {
        continueShoppingLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'products.html';
        });
    }
}

function loadCartItems() {
    const cart = window.DaikoShop.cart;
    const cartContent = document.getElementById('cartContent');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    const cartItemsList = document.getElementById('cartItemsList');
    
    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (cartContent) cartContent.style.display = 'block';
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    // Render cart items
    if (cartItemsList) {
        cartItemsList.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
        
        // Add event listeners to cart item controls
        setupCartItemControls();
    }
    
    // Update totals
    updateCartTotals();
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Mã SP: #${item.id}</p>
                </div>
            </div>
            <div class="cart-item-price">
                ${window.DaikoShop.formatCurrency(item.price)}
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       min="1" onchange="updateItemQuantity(${item.id}, this.value)">
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">
                ${window.DaikoShop.formatCurrency(item.price * item.quantity)}
            </div>
            <button class="remove-item" onclick="removeCartItem(${item.id})" title="Xóa sản phẩm">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

function setupCartItemControls() {
    // Quantity input event listeners
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('blur', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.productId);
            const quantity = parseInt(this.value) || 1;
            updateItemQuantity(productId, quantity);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    });
}

function updateItemQuantity(productId, quantity) {
    quantity = Math.max(1, parseInt(quantity));
    window.DaikoShop.updateCartQuantity(productId, quantity);
    
    // Update the specific cart item display
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
    if (cartItem) {
        const item = window.DaikoShop.cart.find(item => item.id === productId);
        if (item) {
            // Update quantity input
            const quantityInput = cartItem.querySelector('.quantity-input');
            quantityInput.value = quantity;
            
            // Update item total
            const itemTotal = cartItem.querySelector('.cart-item-total');
            itemTotal.textContent = window.DaikoShop.formatCurrency(item.price * quantity);
            
            // Update quantity buttons
            const minusBtn = cartItem.querySelector('.quantity-btn:first-child');
            const plusBtn = cartItem.querySelector('.quantity-btn:last-child');
            minusBtn.setAttribute('onclick', `updateItemQuantity(${productId}, ${quantity - 1})`);
            plusBtn.setAttribute('onclick', `updateItemQuantity(${productId}, ${quantity + 1})`);
        }
    }
    
    updateCartTotals();
}

function removeCartItem(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        window.DaikoShop.removeFromCart(productId);
        loadCartItems(); // Reload the entire cart display
        window.DaikoShop.showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    }
}

function updateCartTotals() {
    const cart = window.DaikoShop.cart;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply coupon discount
    let finalSubtotal = subtotal;
    if (appliedCoupon) {
        const coupon = coupons[appliedCoupon];
        if (coupon.type === 'fixed') {
            discountAmount = coupon.discount;
        } else {
            discountAmount = subtotal * coupon.discount;
        }
        finalSubtotal = Math.max(0, subtotal - discountAmount);
    }
    
    const total = finalSubtotal + shippingFee;
    
    // Update display elements
    updateElement('subtotal', window.DaikoShop.formatCurrency(subtotal));
    updateElement('shipping', window.DaikoShop.formatCurrency(shippingFee));
    updateElement('total', window.DaikoShop.formatCurrency(total));
    
    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (discountAmount > 0) {
        if (discountRow) {
            discountRow.style.display = 'flex';
            updateElement('discount', `-${window.DaikoShop.formatCurrency(discountAmount)}`);
        }
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
    
    // Update checkout summary
    updateElement('checkoutSubtotal', window.DaikoShop.formatCurrency(subtotal));
    updateElement('checkoutShipping', window.DaikoShop.formatCurrency(shippingFee));
    updateElement('checkoutTotal', window.DaikoShop.formatCurrency(total));
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        window.DaikoShop.showNotification('Vui lòng nhập mã giảm giá', 'warning');
        return;
    }
    
    if (appliedCoupon === couponCode) {
        window.DaikoShop.showNotification('Mã giảm giá này đã được áp dụng', 'info');
        return;
    }
    
    const coupon = coupons[couponCode];
    if (!coupon) {
        window.DaikoShop.showNotification('Mã giảm giá không hợp lệ', 'error');
        return;
    }
    
    const subtotal = window.DaikoShop.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (coupon.minAmount && subtotal < coupon.minAmount) {
        window.DaikoShop.showNotification(
            `Đơn hàng phải từ ${window.DaikoShop.formatCurrency(coupon.minAmount)} để sử dụng mã này`,
            'warning'
        );
        return;
    }
    
    appliedCoupon = couponCode;
    updateCartTotals();
    
    window.DaikoShop.showNotification(`Đã áp dụng mã giảm giá: ${coupon.description}`, 'success');
    couponInput.value = '';
}

function proceedToCheckout() {
    const cart = window.DaikoShop.cart;
    
    if (cart.length === 0) {
        window.DaikoShop.showNotification('Giỏ hàng của bạn đang trống', 'warning');
        return;
    }
    
    // Show checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
        
        // Update checkout totals
        updateCartTotals();
        
        // Set up form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.onsubmit = handleCheckoutSubmission;
        }
    }
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}

function handleCheckoutSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        customerInfo: {
            fullName: formData.get('fullName') || document.getElementById('fullName').value,
            phone: formData.get('phone') || document.getElementById('phone').value,
            email: formData.get('email') || document.getElementById('email').value,
            address: formData.get('address') || document.getElementById('address').value,
            city: formData.get('city') || document.getElementById('city').value,
            district: formData.get('district') || document.getElementById('district').value
        },
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'cod',
        notes: formData.get('notes') || document.getElementById('notes').value,
        items: window.DaikoShop.cart,
        totals: {
            subtotal: window.DaikoShop.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: shippingFee,
            discount: discountAmount,
            total: window.DaikoShop.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingFee - discountAmount
        },
        coupon: appliedCoupon
    };
    
    // Validate required fields
    if (!orderData.customerInfo.fullName || !orderData.customerInfo.phone || !orderData.customerInfo.address) {
        window.DaikoShop.showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
        return;
    }
    
    // Simulate order processing
    processOrder(orderData);
}

function processOrder(orderData) {
    // Show loading state
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate order number
        const orderNumber = '#DK' + Date.now().toString().slice(-6);
        
        // Store order in localStorage (for demo purposes)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
            ...orderData,
            orderNumber,
            orderDate: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        window.DaikoShop.cart.length = 0;
        window.DaikoShop.saveCart();
        window.DaikoShop.updateCartCount();
        
        // Close checkout modal
        closeCheckoutModal();
        
        // Show success modal
        showSuccessModal(orderNumber, orderData.totals.total);
        
        // Reset form
        document.getElementById('checkoutForm').reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

function showSuccessModal(orderNumber, total) {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        // Update order details
        updateElement('orderNumber', orderNumber);
        updateElement('orderTotal', window.DaikoShop.formatCurrency(total));
        
        successModal.style.display = 'block';
    }
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'none';
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// City/District dropdown functionality
document.addEventListener('change', function(e) {
    if (e.target.id === 'city') {
        updateDistrictOptions(e.target.value);
    }
});

function updateDistrictOptions(cityValue) {
    const districtSelect = document.getElementById('district');
    if (!districtSelect) return;
    
    // Clear existing options
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    
    // Sample districts for demo
    const districts = {
        hanoi: ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân'],
        hochiminh: ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Phú Nhuận', 'Tân Bình', 'Gò Vấp'],
        danang: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
        haiphong: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn']
    };
    
    if (districts[cityValue]) {
        districts[cityValue].forEach(district => {
            const option = document.createElement('option');
            option.value = district.toLowerCase().replace(/\s+/g, '');
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'checkoutModal') {
            closeCheckoutModal();
        } else if (e.target.id === 'successModal') {
            closeSuccessModal();
        }
    }
});

// Payment method selection handling
document.addEventListener('change', function(e) {
    if (e.target.name === 'payment') {
        // Update shipping fee based on payment method
        const paymentMethod = e.target.value;
        
        // Free shipping for bank transfer orders over 1M
        if (paymentMethod === 'banking') {
            const subtotal = window.DaikoShop.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (subtotal >= 1000000) {
                shippingFee = 0;
                window.DaikoShop.showNotification('Miễn phí vận chuyển cho đơn hàng chuyển khoản từ 1 triệu!', 'success');
            } else {
                shippingFee = 30000;
            }
        } else {
            shippingFee = 30000;
        }
        
        updateCartTotals();
    }
});

// Add CSS for cart-specific styling
const cartCSS = `
    .cart-item {
        transition: all 0.3s ease;
    }
    
    .cart-item:hover {
        background-color: var(--bg-secondary);
        border-radius: var(--border-radius);
    }
    
    .quantity-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .remove-item:hover {
        background-color: #c62828;
        transform: scale(1.1);
    }
    
    .modal {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .order-processing {
        pointer-events: none;
        opacity: 0.7;
    }
    
    .success-icon i {
        animation: checkmarkAnimation 0.5s ease;
    }
    
    @keyframes checkmarkAnimation {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;

// Inject cart-specific CSS
const cartStyleSheet = document.createElement('style');
cartStyleSheet.textContent = cartCSS;
document.head.appendChild(cartStyleSheet);
