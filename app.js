// Products data
const products = [
    {
        id: 1,
        name: "شال حريري فاخر - أسود كلاسيكي",
        price: 45000,
        originalPrice: 60000,
        category: "shawls",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "شال حريري عالي الجودة مناسب لجميع المناسبات الرسمية",
        rating: 4.8,
        reviews: 124,
        badge: "خصم 25%"
    },
    {
        id: 2,
        name: "طرحة قطنية مطرزة - ألوان متعددة",
        price: 25000,
        category: "shawls",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "طرحة قطنية مريحة بتطريز يدوي جميل وألوان زاهية",
        rating: 4.6,
        reviews: 89,
        badge: "جديد"
    },
    {
        id: 3,
        name: "سجادة تركية كلاسيكية - نقوش تراثية",
        price: 180000,
        category: "carpets",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "سجادة تركية أصلية بنقوش تراثية عريقة وجودة استثنائية",
        rating: 4.9,
        reviews: 156,
        badge: "الأكثر مبيعاً"
    },
    {
        id: 4,
        name: "إحرام رجالي قطني - جودة عالية",
        price: 35000,
        category: "hajj",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "إحرام قطني عالي الجودة للحج والعمرة، خامة ممتازة ومريحة",
        rating: 4.7,
        reviews: 203,
        badge: "مُوصى به"
    },
    {
        id: 5,
        name: "شال شيفون ملون - تصميم عصري",
        price: 32000,
        originalPrice: 40000,
        category: "shawls",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "شال شيفون بألوان زاهية ونقوش جميلة، مثالي للمناسبات",
        rating: 4.5,
        reviews: 67,
        badge: "خصم 20%"
    },
    {
        id: 6,
        name: "سجادة صلاة محمولة - سهلة الحمل",
        price: 55000,
        category: "hajj",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "سجادة صلاة قابلة للطي، سهلة الحمل ومقاومة للبقع",
        rating: 4.8,
        reviews: 91,
        badge: "عملي"
    },
    {
        id: 7,
        name: "طقم شالات بالجملة (10 قطع) - متنوع",
        price: 280000,
        originalPrice: 350000,
        category: "wholesale",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "طقم من 10 شالات متنوعة الألوان والتصاميم بأسعار الجملة",
        rating: 4.6,
        reviews: 45,
        badge: "وفر 70,000"
    },
    {
        id: 8,
        name: "عباءة حج نسائية - قطن خالص",
        price: 65000,
        category: "hajj",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "عباءة قطنية مريحة مخصصة للحج والعمرة، تصميم محتشم وأنيق",
        rating: 4.9,
        reviews: 178,
        badge: "الأفضل"
    },
    {
        id: 9,
        name: "شال كشمير فاخر - دافئ وناعم",
        price: 95000,
        category: "shawls",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "شال كشمير طبيعي فاخر، دافئ جداً وناعم الملمس",
        rating: 5.0,
        reviews: 234,
        badge: "فاخر"
    },
    {
        id: 10,
        name: "سجادة صلاة إلكترونية - بوصلة ذكية",
        price: 120000,
        category: "hajj",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "سجادة صلاة ذكية مع بوصلة إلكترونية لتحديد القبلة",
        rating: 4.7,
        reviews: 67,
        badge: "تقنية حديثة"
    },
    {
        id: 11,
        name: "طقم مستلزمات حج كامل - للرجال",
        price: 150000,
        originalPrice: 200000,
        category: "hajj",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "طقم كامل يشمل إحرام وسجادة ومسبحة وحقيبة حج",
        rating: 4.8,
        reviews: 89,
        badge: "طقم كامل"
    },
    {
        id: 12,
        name: "شال ساتان لامع - للمناسبات الخاصة",
        price: 38000,
        category: "shawls",
        image: "https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1",
        description: "شال ساتان لامع مثالي للمناسبات الخاصة والأعراس",
        rating: 4.4,
        reviews: 76,
        badge: "للمناسبات"
    }
];

// Global variables
let cart = JSON.parse(localStorage.getItem('alhajami_cart')) || [];
let currentFilter = 'all';
let favorites = JSON.parse(localStorage.getItem('alhajami_favorites')) || [];
let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let deferredPrompt;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    showLoadingSpinner();
    
    setTimeout(() => {
        loadProducts();
        updateCartCount();
        setupSearch();
        initializeAdsSlider();
        animateOnScroll();
        setupPWA();
        handleURLParams();
        hideLoadingSpinner();
    }, 1000);
});

// PWA Setup
function setupPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt fired');
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
        showInstallBanner();
    });

    // Handle app installed
    window.addEventListener('appinstalled', (evt) => {
        console.log('App was installed');
        hideInstallButton();
        hideInstallBanner();
        showNotification('🎉 تم تثبيت التطبيق بنجاح!');
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        hideInstallButton();
        hideInstallBanner();
    }
}

// Install App
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                hideInstallBanner();
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Show/Hide Install Elements
function showInstallButton() {
    document.getElementById('installBtn').classList.add('show');
}

function hideInstallButton() {
    document.getElementById('installBtn').classList.remove('show');
}

function showInstallBanner() {
    const banner = document.getElementById('installBanner');
    if (banner && !localStorage.getItem('installBannerDismissed')) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 3000);
    }
}

function hideInstallBanner() {
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.classList.remove('show');
        localStorage.setItem('installBannerDismissed', 'true');
    }
}

// Handle URL Parameters
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        filterProducts(category);
    }
}

// Loading Spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Initialize ads slider
function initializeAdsSlider() {
    const adsContainer = document.getElementById('adsContainer');
    const adsSlider = document.getElementById('adsSlider');

    adsSlider.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - adsSlider.offsetLeft;
        scrollLeft = adsContainer.scrollLeft;
        adsContainer.style.animationPlayState = 'paused';
    });

    adsSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - adsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        adsContainer.scrollLeft = scrollLeft - walk;
    });

    adsSlider.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => {
            adsContainer.style.animationPlayState = 'running';
        }, 1000);
    });

    adsSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - adsSlider.offsetLeft;
        scrollLeft = adsContainer.scrollLeft;
        adsContainer.style.animationPlayState = 'paused';
    });

    adsSlider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - adsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        adsContainer.scrollLeft = scrollLeft - walk;
    });

    adsSlider.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => {
            adsContainer.style.animationPlayState = 'running';
        }, 1000);
    });

    adsSlider.addEventListener('mouseleave', () => {
        isDragging = false;
        adsContainer.style.animationPlayState = 'running';
    });
}

// Animation on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .category-card').forEach(el => {
        observer.observe(el);
    });
}

// Load products
function loadProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div style="position: absolute; top: 12px; left: 12px;">
                    <button onclick="toggleFavorite(${product.id})" style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; color: ${favorites.includes(product.id) ? '#ff6b6b' : '#999'}; transition: all 0.3s ease;">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-text">(${product.reviews} تقييم)</span>
                </div>
                <div class="product-price">
                    ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-left: 8px;">${product.originalPrice.toLocaleString()}</span>` : ''}
                    ${product.price.toLocaleString()} د.ع
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> إضافة للسلة
                    </button>
                    <button class="btn btn-secondary" onclick="quickOrder(${product.id})">
                        <i class="fab fa-whatsapp"></i> طلب سريع
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    setTimeout(animateOnScroll, 100);
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                loadProducts(currentFilter);
                return;
            }

            const filteredProducts = products.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category === query
            );
            
            const grid = document.getElementById('productsGrid');
            
            if (filteredProducts.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <h3>لم يتم العثور على منتجات</h3>
                        <p>جرب البحث بكلمات أخرى أو تصفح التصنيفات</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = filteredProducts.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                        <div style="position: absolute; top: 12px; left: 12px;">
                            <button onclick="toggleFavorite(${product.id})" style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; color: ${favorites.includes(product.id) ? '#ff6b6b' : '#999'};">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-rating">
                            <div class="stars">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            <span class="rating-text">(${product.reviews} تقييم)</span>
                        </div>
                        <div class="product-price">
                            ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-left: 8px;">${product.originalPrice.toLocaleString()}</span>` : ''}
                            ${product.price.toLocaleString()} د.ع
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> إضافة للسلة
                            </button>
                            <button class="btn btn-secondary" onclick="quickOrder(${product.id})">
                                <i class="fab fa-whatsapp"></i> طلب سريع
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }, 300);
    });
}

// Focus search
function focusSearch() {
    document.getElementById('searchInput').focus();
}

// Toggle favorites
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('💔 تم إزالة المنتج من المفضلة');
    } else {
        favorites.push(productId);
        showNotification('❤️ تم إضافة المنتج للمفضلة');
    }
    localStorage.setItem('alhajami_favorites', JSON.stringify(favorites));
    
    const heartBtn = event.target.closest('button');
    heartBtn.style.color = favorites.includes(productId) ? '#ff6b6b' : '#999';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    loadProducts(category);
    closeSidebar();
    
    // Update URL
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.background = 'transparent';
        item.style.transform = 'translateX(0)';
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('alhajami_cart', JSON.stringify(cart));
    updateCartCount();
    
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
    
    showNotification(`✅ تم إضافة "${product.name}" إلى السلة!`);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cartCount');
    countElement.textContent = count;
    
    if (count > 0) {
        countElement.style.display = 'flex';
        countElement.style.animation = 'bounce 0.5s ease';
    } else {
        countElement.style.display = 'none';
    }
}

// Toggle cart
function toggleCart() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        modal.classList.add('active');
        overlay.classList.add('active');
        loadCartItems();
    }
}

// Load cart items
function loadCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h3>السلة فارغة</h3>
                <p>ابدأ بإضافة منتجات رائعة إلى سلتك</p>
            </div>
        `;
        totalElement.textContent = '0';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} د.ع × ${item.quantity}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="quantity-btn remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    totalElement.textContent = total.toLocaleString();
}

// Change quantity
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('alhajami_cart', JSON.stringify(cart));
            updateCartCount();
            loadCartItems();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('alhajami_cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
    showNotification(`🗑️ تم حذف "${product.name}" من السلة`);
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('⚠️ السلة فارغة بالفعل');
        return;
    }
    
    if (confirm('هل أنت متأكد من إفراغ السلة؟')) {
        cart = [];
        localStorage.setItem('alhajami_cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        showNotification('🗑️ تم إفراغ السلة بنجاح');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('⚠️ السلة فارغة!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = `🛍️ *طلب جديد من محلات الحجامي* 🛍️\n\n`;
    message += `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n`;
    message += `🕐 الوقت: ${new Date().toLocaleTimeString('ar-SA')}\n\n`;
    message += `📋 *تفاصيل الطلب:*\n`;
    message += `${'─'.repeat(30)}\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   💰 السعر: ${item.price.toLocaleString()} د.ع\n`;
        message += `   📦 الكمية: ${item.quantity}\n`;
        message += `   💵 المجموع: ${(item.price * item.quantity).toLocaleString()} د.ع\n\n`;
    });
    
    message += `${'─'.repeat(30)}\n`;
    message += `💰 *المجموع الكلي: ${total.toLocaleString()} د.ع*\n\n`;
    message += `📞 يرجى التواصل معي لتأكيد الطلب وترتيب التوصيل\n`;
    message += `🙏 شكراً لثقتكم بمحلات الحجامي`;
    
    const whatsappUrl = `https://wa.me/9647736222077?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('📱 تم توجيهك لإكمال الطلب عبر واتساب');
}

// Quick order
function quickOrder(productId) {
    const product = products.find(p => p.id === productId);
    let message = `🛍️ *طلب سريع من محلات الحجامي* 🛍️\n\n`;
    message += `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n`;
    message += `🕐 الوقت: ${new Date().toLocaleTimeString('ar-SA')}\n\n`;
    message += `${'═'.repeat(35)}\n`;
    message += `📦 *تفاصيل المنتج المطلوب:*\n`;
    message += `${'═'.repeat(35)}\n\n`;
    
    message += `🏷️ *اسم المنتج:*\n${product.name}\n\n`;
    message += `📋 *الوصف:*\n${product.description}\n\n`;
    message += `💰 *السعر:* ${product.price.toLocaleString()} د.ع\n`;
    
    if (product.originalPrice) {
        message += `💸 *السعر الأصلي:* ${product.originalPrice.toLocaleString()} د.ع\n`;
        message += `🔥 *مقدار الخصم:* ${(product.originalPrice - product.price).toLocaleString()} د.ع\n`;
    }
    
    if (product.badge) {
        message += `🏆 *العلامة:* ${product.badge}\n`;
    }
    
    message += `⭐ *التقييم:* ${product.rating}/5 نجوم (${product.reviews} تقييم)\n`;
    message += `📂 *التصنيف:* `;
    
    // إضافة اسم التصنيف بالعربية
    switch(product.category) {
        case 'shawls': message += 'الشالات والطرحات'; break;
        case 'carpets': message += 'السجادات التركية'; break;
        case 'hajj': message += 'مستلزمات الحج والعمرة'; break;
        case 'wholesale': message += 'البيع بالجملة'; break;
        default: message += 'منتجات عامة';
    }
    
    message += `\n\n🖼️ *صورة المنتج:*\n${product.image}\n\n`;
    message += `${'─'.repeat(35)}\n`;
    message += `💬 *رسالة العميل:*\n`;
    message += `السلام عليكم، أرغب في طلب هذا المنتج.\n`;
    message += `يرجى التواصل معي لتأكيد الطلب وترتيب التوصيل.\n\n`;
    message += `📞 *ملاحظة للأدمن:*\n`;
    message += `عميل مهتم بشراء المنتج أعلاه - يرجى الرد عليه في أقرب وقت\n\n`;
    message += `🙏 شكراً لكم - محلات الحجامي`;
    
    const whatsappUrl = `https://wa.me/9647736222077?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showNotification('📱 تم توجيهك للطلب السريع عبر واتساب');
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Close sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Show page
function showPage(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    switch(page) {
        case 'home':
            filterProducts('all');
            break;
        case 'categories':
            toggleSidebar();
            break;
        case 'offers':
            filterProducts('offers');
            showNotification('🏷️ تصفح أحدث العروض والخصومات!');
            break;
        case 'favorites':
            if (favorites.length === 0) {
                showNotification('💔 لا توجد منتجات في المفضلة');
                return;
            }
            const favoriteProducts = products.filter(p => favorites.includes(p.id));
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = favoriteProducts.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                        <div style="position: absolute; top: 12px; left: 12px;">
                            <button onclick="toggleFavorite(${product.id})" style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; color: #ff6b6b;">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-rating">
                            <div class="stars">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            <span class="rating-text">(${product.reviews} تقييم)</span>
                        </div>
                        <div class="product-price">
                            ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-left: 8px;">${product.originalPrice.toLocaleString()}</span>` : ''}
                            ${product.price.toLocaleString()} د.ع
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> إضافة للسلة
                            </button>
                            <button class="btn btn-secondary" onclick="quickOrder(${product.id})">
                                <i class="fab fa-whatsapp"></i> طلب سريع
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            closeSidebar();
            showNotification('❤️ عرض المنتجات المفضلة');
            break;
        case 'orders':
            showNotification('📋 قريباً ستتمكن من تتبع طلباتك!');
            break;
        case 'account':
            showNotification('👤 قريباً ستتمكن من إدارة حسابك!');
            break;
    }
}

// Handle escape key and overlay clicks
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
        const cartModal = document.getElementById('cartModal');
        const overlay = document.getElementById('overlay');
        if (cartModal.classList.contains('active')) {
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
});

document.getElementById('overlay').addEventListener('click', function() {
    closeSidebar();
    const cartModal = document.getElementById('cartModal');
    if (cartModal.classList.contains('active')) {
        cartModal.classList.remove('active');
        this.classList.remove('active');
    }
});

// Network status
window.addEventListener('online', () => {
    showNotification('🌐 تم استعادة الاتصال بالإنترنت');
});

window.addEventListener('offline', () => {
    showNotification('📡 أنت تعمل في وضع عدم الاتصال', 'warning');
});