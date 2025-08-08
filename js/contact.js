// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html')) {
        initializeContactPage();
    }
});

function initializeContactPage() {
    setupContactEventListeners();
    initializeFAQ();
    setupFormValidation();
}

function setupContactEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Subject selection handler
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', handleSubjectChange);
    }
}

function handleContactFormSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name') || document.getElementById('name').value,
        email: formData.get('email') || document.getElementById('email').value,
        phone: formData.get('phone') || document.getElementById('phone').value,
        subject: formData.get('subject') || document.getElementById('subject').value,
        message: formData.get('message') || document.getElementById('message').value,
        newsletter: formData.get('newsletter') === 'on' || document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };
    
    // Validate form
    if (!validateContactForm(contactData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Store message in localStorage (for demo purposes)
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        e.target.reset();
        
        // Reset submit button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Handle newsletter subscription
        if (contactData.newsletter) {
            subscribeToNewsletter(contactData.email);
        }
        
    }, 2000);
}

function validateContactForm(data) {
    const errors = [];
    
    // Validate name
    if (!data.name || data.name.length < 2) {
        errors.push('Họ và tên phải có ít nhất 2 ký tự');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Email không hợp lệ');
    }
    
    // Validate phone (optional but if provided must be valid)
    if (data.phone) {
        const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.push('Số điện thoại không hợp lệ');
        }
    }
    
    // Validate subject
    if (!data.subject) {
        errors.push('Vui lòng chọn chủ đề');
    }
    
    // Validate message
    if (!data.message || data.message.length < 10) {
        errors.push('Tin nhắn phải có ít nhất 10 ký tự');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    // Clear any existing errors
    clearFormErrors();
    return true;
}

function showFormErrors(errors) {
    // Remove existing error display
    const existingErrors = document.querySelector('.form-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    // Create error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-errors';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="error-list">
                ${errors.map(error => `<p>${error}</p>`).join('')}
            </div>
        </div>
    `;
    
    // Insert before submit button
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
    
    // Style the error display
    Object.assign(errorDiv.style, {
        backgroundColor: '#ffebee',
        border: '1px solid #f44336',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        color: '#c62828'
    });
    
    // Scroll to errors
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFormErrors() {
    const existingErrors = document.querySelector('.form-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 4000);
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format Vietnamese phone number
    if (value.startsWith('84')) {
        value = '+84 ' + value.slice(2);
    } else if (value.startsWith('0')) {
        value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    e.target.value = value;
}

function handleSubjectChange(e) {
    const subject = e.target.value;
    const messageTextarea = document.getElementById('message');
    
    // Pre-fill message placeholder based on subject
    const placeholders = {
        general: 'Xin chào, tôi muốn biết thêm thông tin về...',
        product: 'Tôi quan tâm đến sản phẩm... và muốn hỏi về...',
        order: 'Tôi cần hỗ trợ về đơn hàng #... với vấn đề...',
        support: 'Tôi gặp vấn đề kỹ thuật khi...',
        complaint: 'Tôi muốn phản ánh về...',
        partnership: 'Tôi quan tâm đến việc hợp tác và muốn thảo luận về...'
    };
    
    if (messageTextarea && placeholders[subject]) {
        messageTextarea.placeholder = placeholders[subject];
    }
}

function subscribeToNewsletter(email) {
    // Get existing newsletter subscribers
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    
    // Check if already subscribed
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        
        setTimeout(() => {
            window.DaikoShop.showNotification('Cảm ơn bạn đã đăng ký nhận tin!', 'success');
        }, 3000);
    }
}

function setupFormValidation() {
    // Real-time validation
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear errors when user starts typing
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                isValid = false;
                errorMessage = 'Họ và tên phải có ít nhất 2 ký tự';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email không hợp lệ';
            }
            break;
            
        case 'phone':
            if (value) {
                const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Số điện thoại không hợp lệ';
                }
            }
            break;
            
        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Vui lòng chọn chủ đề';
            }
            break;
            
        case 'message':
            if (!value || value.length < 10) {
                isValid = false;
                errorMessage = 'Tin nhắn phải có ít nhất 10 ký tự';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.style.borderColor = '#f44336';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    faqItem.classList.toggle('active', !isActive);
}

// Social media link tracking (for analytics)
document.addEventListener('click', function(e) {
    if (e.target.closest('.social-link')) {
        const platform = e.target.closest('.social-link').className.split(' ').find(cls => 
            ['facebook', 'instagram', 'youtube', 'tiktok'].includes(cls)
        );
        
        if (platform) {
            // Track social media click (for analytics)
            console.log(`Social media click: ${platform}`);
            
            // You can integrate with Google Analytics or other tracking services here
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    'social_platform': platform,
                    'page_location': window.location.href
                });
            }
        }
    }
});

// Map interaction enhancement
function initializeMap() {
    const mapContainer = document.querySelector('.map-container iframe');
    if (mapContainer) {
        // Add loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'map-loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải bản đồ...';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        
        mapContainer.parentNode.style.position = 'relative';
        mapContainer.parentNode.appendChild(loadingDiv);
        
        // Remove loading when map loads
        mapContainer.addEventListener('load', function() {
            setTimeout(() => {
                if (loadingDiv.parentNode) {
                    loadingDiv.remove();
                }
            }, 1000);
        });
    }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeMap, 100);
});

// Contact info click handlers
document.addEventListener('click', function(e) {
    // Handle phone number clicks
    if (e.target.closest('a[href^="tel:"]')) {
        // Track phone call attempt
        console.log('Phone call initiated');
    }
    
    // Handle email clicks
    if (e.target.closest('a[href^="mailto:"]')) {
        // Track email attempt
        console.log('Email initiated');
    }
});

// Auto-save draft functionality
let draftTimer;
const DRAFT_KEY = 'contactFormDraft';

function setupDraftSaving() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(draftTimer);
            draftTimer = setTimeout(saveDraft, 1000);
        });
    });
    
    // Load draft on page load
    loadDraft();
}

function saveDraft() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const draft = {};
    
    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }
    
    // Also save unchecked checkboxes
    form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        draft[checkbox.name] = checkbox.checked;
    });
    
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    
    try {
        const draftData = JSON.parse(draft);
        
        Object.keys(draftData).forEach(key => {
            const input = document.querySelector(`[name="${key}"], #${key}`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = draftData[key];
                } else {
                    input.value = draftData[key];
                }
            }
        });
        
        // Show draft notification
        if (Object.keys(draftData).length > 0) {
            window.DaikoShop.showNotification('Đã khôi phục bản nháp của bạn', 'info');
        }
    } catch (e) {
        console.error('Error loading draft:', e);
    }
}

function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

// Clear draft when form is successfully submitted
document.addEventListener('DOMContentLoaded', function() {
    const originalSubmitHandler = handleContactFormSubmission;
    
    window.handleContactFormSubmission = function(e) {
        originalSubmitHandler(e);
        clearDraft();
    };
    
    setupDraftSaving();
});

// Add contact-specific CSS
const contactCSS = `
    .form-errors {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            max-height: 200px;
            transform: translateY(0);
        }
    }
    
    .field-error {
        animation: fadeIn 0.3s ease;
    }
    
    .faq-item {
        transition: all 0.3s ease;
    }
    
    .faq-item:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .faq-answer {
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
    }
    
    .faq-item.active .faq-answer {
        padding-bottom: 1.5rem;
    }
    
    .social-link {
        transition: all 0.3s ease;
    }
    
    .contact-form input:focus,
    .contact-form textarea:focus,
    .contact-form select:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
    }
    
    .success-message {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject contact-specific CSS
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactCSS;
document.head.appendChild(contactStyleSheet);
