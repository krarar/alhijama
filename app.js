  // إعدادات Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyDGpAHia_wEmrhnmYjrPf1n1TrAzwEMiAI",
            authDomain: "messageemeapp.firebaseapp.com",
            databaseURL: "https://messageemeapp-default-rtdb.firebaseio.com",
            projectId: "messageemeapp",
            storageBucket: "messageemeapp.appspot.com",
            messagingSenderId: "255034474844",
            appId: "1:255034474844:web:5e3b7a6bc4b2fb94cc4199"
        };

        // تهيئة Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        const storage = firebase.storage();

        // متغيرات عامة
        let products = [];
        let ads = [];
        let messages = [];
        let cart = JSON.parse(localStorage.getItem('alhajami_cart')) || [];
        let favorites = JSON.parse(localStorage.getItem('alhajami_favorites')) || [];
        let isAdmin = localStorage.getItem('alhajami_admin') === 'true';
        let currentFilter = 'all';
        let currentProductId = null;
        let currentMessageProductId = null;
        let deferredPrompt = null;
        let productImages = [];
        let adImage = null;

        // متغيرات تحسين الأداء
        let isLoading = false;
        let debounceTimer = null;
        let intersectionObserver = null;

        // PWA Install
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            if (!localStorage.getItem('installPromptShown')) {
                setTimeout(() => {
                    showInstallPrompt();
                }, 3000);
            }
        });

        function showInstallPrompt() {
            const prompt = document.getElementById('installPrompt');
            prompt.classList.add('show');
            localStorage.setItem('installPromptShown', 'true');
        }

        function installApp() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((result) => {
                    if (result.outcome === 'accepted') {
                        showNotification('✅ تم تثبيت التطبيق بنجاح');
                    }
                    deferredPrompt = null;
                });
            }
            dismissInstall();
        }

        function dismissInstall() {
            document.getElementById('installPrompt').classList.remove('show');
        }

        // تحسين الأداء - Intersection Observer for Lazy Loading
        function setupIntersectionObserver() {
            if ('IntersectionObserver' in window) {
                intersectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const element = entry.target;
                            element.classList.add('loaded');
                            intersectionObserver.unobserve(element);
                        }
                    });
                }, {
                    rootMargin: '50px'
                });
            }
        }

        // تهيئة التطبيق - محسنة
        document.addEventListener('DOMContentLoaded', function() {
            showLoadingSpinner();
            setupIntersectionObserver();
            initializeApp();
        });

        async function initializeApp() {
            try {
                // تحميل البيانات بالتوازي
                await Promise.all([
                    loadProducts(),
                    loadAds(),
                    loadMessages()
                ]);
                
                updateCartCount();
                updateMessageCount();
                setupSearch();
                setupAdsAnimation();
                
                if (isAdmin) {
                    showAdminSection();
                }
                
                hideLoadingSpinner();
                
                // تحريك العناصر مع تأخير محسن
                requestAnimationFrame(() => {
                    document.querySelectorAll('.product-card').forEach((card, index) => {
                        card.classList.add('lazy-load');
                        if (intersectionObserver) {
                            intersectionObserver.observe(card);
                        }
                        setTimeout(() => {
                            card.classList.add('fade-in');
                        }, index * 50); // تقليل التأخير
                    });
                });
                
            } catch (error) {
                console.error('خطأ في تهيئة التطبيق:', error);
                showNotification('حدث خطأ في تحميل البيانات', 'error');
                hideLoadingSpinner();
            }
        }

        // تحميل المنتجات - محسنة
        async function loadProducts(filter = 'all') {
            if (isLoading) return;
            isLoading = true;
            
            try {
                const snapshot = await database.ref('products').once('value');
                const data = snapshot.val();
                
                products = data ? Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })) : [];
                
                displayProducts(filter);
                updateProductsInAdForm();
                
            } catch (error) {
                console.error('خطأ في تحميل المنتجات:', error);
                showNotification('خطأ في تحميل المنتجات', 'error');
            } finally {
                isLoading = false;
            }
        }

        // تحميل الرسائل
        async function loadMessages() {
            try {
                const snapshot = await database.ref('messages').orderByChild('timestamp').once('value');
                const data = snapshot.val();
                
                messages = data ? Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).reverse() : []; // عكس الترتيب لإظهار الأحدث أولاً
                
                updateMessageCount();
                
            } catch (error) {
                console.error('خطأ في تحميل الرسائل:', error);
            }
        }

        // تحديث عدد الرسائل
        function updateMessageCount() {
            const count = messages.length;
            const messageCountElements = document.querySelectorAll('#messageCount, #sidebarMessageCount');
            
            messageCountElements.forEach(element => {
                element.textContent = count;
                element.style.display = count > 0 ? 'flex' : 'none';
            });
        }

        // عرض الرسائل
        function displayMessages() {
            const container = document.getElementById('messagesContent');
            
            if (messages.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: var(--space-8); color: var(--gray-400);">
                        <i class="fas fa-envelope-open" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); opacity: 0.5;"></i>
                        <h3 style="font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); color: var(--gray-300);">لا توجد رسائل</h3>
                        <p style="font-size: var(--font-size-base);">ستظهر رسائل العملاء هنا عند توفرها</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = messages.map(message => {
                const product = products.find(p => p.id === message.productId);
                const productImage = product && product.images && product.images[0] ? product.images[0] : 
                                   (product && product.image ? product.image : 'https://via.placeholder.com/60x60?text=صورة');
                const messageDate = new Date(message.timestamp).toLocaleDateString('ar-SA');
                const messageTime = new Date(message.timestamp).toLocaleTimeString('ar-SA');
                
                return `
                    <div class="message-item">
                        <div class="message-header">
                            <div class="message-user">${message.senderName || 'عميل'}</div>
                            <div class="message-time">${messageDate} - ${messageTime}</div>
                        </div>
                        
                        ${product ? `
                            <div class="message-product">
                                <img src="${productImage}" alt="${product.name}" class="message-product-image" 
                                     onerror="this.src='https://via.placeholder.com/60x60?text=صورة'">
                                <div class="message-product-info">
                                    <h4>${product.name}</h4>
                                    <p>${product.description}</p>
                                    <div class="message-product-price">${parseInt(product.price).toLocaleString()} د.ع</div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="message-text">${message.text}</div>
                        
                        ${isAdmin ? `
                            <div class="message-actions">
                                <button class="message-action-btn reply" onclick="replyToMessage('${message.id}')">
                                    <i class="fab fa-whatsapp"></i>
                                    رد عبر واتساب
                                </button>
                                <button class="message-action-btn delete" onclick="deleteMessage('${message.id}')">
                                    <i class="fas fa-trash"></i>
                                    حذف
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
        }

        // الرد على الرسالة عبر واتساب
        function replyToMessage(messageId) {
            const message = messages.find(m => m.id === messageId);
            if (!message) return;
            
            const product = products.find(p => p.id === message.productId);
            let replyText = `🔄 *رد على استفسار العميل* 🔄\n\n`;
            replyText += `👤 العميل: ${message.senderName || 'عميل'}\n`;
            replyText += `📅 تاريخ الاستفسار: ${new Date(message.timestamp).toLocaleDateString('ar-SA')}\n\n`;
            
            if (product) {
                replyText += `📦 المنتج المستفسر عنه:\n`;
                replyText += `🏷️ ${product.name}\n`;
                replyText += `💰 السعر: ${parseInt(product.price).toLocaleString()} د.ع\n\n`;
            }
            
            replyText += `💬 استفسار العميل:\n"${message.text}"\n\n`;
            replyText += `${'─'.repeat(30)}\n`;
            replyText += `📞 مرحباً، شكراً لاستفسارك. يمكنني مساعدتك في:\n\n`;
            replyText += `✅ تفاصيل أكثر عن المنتج\n`;
            replyText += `✅ معلومات التوصيل والأسعار\n`;
            replyText += `✅ طرق الدفع المتاحة\n`;
            replyText += `✅ أي استفسارات أخرى\n\n`;
            replyText += `🙏 محلات الحجامي - خدمة عملاء متميزة`;
            
            const whatsappUrl = `https://wa.me/9647736222077?text=${encodeURIComponent(replyText)}`;
            window.open(whatsappUrl, '_blank');
            showNotification('📱 تم توجيهك للرد عبر واتساب');
        }

        // حذف الرسالة
        async function deleteMessage(messageId) {
            if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
            
            try {
                await database.ref(`messages/${messageId}`).remove();
                await loadMessages();
                displayMessages();
                showNotification('✅ تم حذف الرسالة بنجاح');
            } catch (error) {
                console.error('خطأ في حذف الرسالة:', error);
                showNotification('❌ خطأ في حذف الرسالة', 'error');
            }
        }

        // فتح نافذة إرسال الرسالة
        function openSendMessageModal(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            currentMessageProductId = productId;
            
            const productImage = product.images && product.images[0] ? product.images[0] : 
                               (product.image || 'https://via.placeholder.com/60x60?text=صورة');
            
            document.getElementById('messageProductInfo').innerHTML = `
                <div style="background: var(--glass); border-radius: var(--radius-lg); padding: var(--space-3); border: 1px solid var(--glass-border);">
                    <h4 style="color: var(--primary-solid); margin-bottom: var(--space-2); font-size: var(--font-size-base);">
                        <i class="fas fa-box"></i> المنتج المستفسر عنه
                    </h4>
                    <div style="display: flex; gap: var(--space-3); align-items: center;">
                        <img src="${productImage}" alt="${product.name}" 
                             style="width: 50px; height: 50px; border-radius: var(--radius-lg); object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/50x50?text=صورة'">
                        <div>
                            <h5 style="color: white; font-weight: 600; margin-bottom: var(--space-1); font-size: var(--font-size-sm);">${product.name}</h5>
                            <p style="color: var(--gray-300); font-size: var(--font-size-xs); margin-bottom: var(--space-1);">${product.description}</p>
                            <span style="color: var(--success-solid); font-weight: 600; font-size: var(--font-size-sm);">
                                ${parseInt(product.price).toLocaleString()} د.ع
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('messageSenderName').value = '';
            document.getElementById('messageText').value = '';
            
            document.getElementById('sendMessageModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        // معالج إرسال الرسالة
        async function handleSendMessage(event) {
            event.preventDefault();
            
            if (!currentMessageProductId) {
                showNotification('❌ خطأ في تحديد المنتج', 'error');
                return;
            }
            
            try {
                showLoadingSpinner();
                
                const senderName = document.getElementById('messageSenderName').value.trim();
                const messageText = document.getElementById('messageText').value.trim();
                
                if (!messageText) {
                    showNotification('يرجى كتابة رسالتك', 'error');
                    hideLoadingSpinner();
                    return;
                }
                
                const messageData = {
                    productId: currentMessageProductId,
                    senderName: senderName || 'عميل',
                    text: messageText,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    read: false
                };
                
                await database.ref('messages').push(messageData);
                
                closeModal('sendMessageModal');
                await loadMessages();
                
                showNotification('✅ تم إرسال رسالتك بنجاح! سيتم الرد عليك قريباً');
                hideLoadingSpinner();
                
            } catch (error) {
                console.error('خطأ في إرسال الرسالة:', error);
                showNotification('❌ خطأ في إرسال الرسالة', 'error');
                hideLoadingSpinner();
            }
        }

        // تحديث قائمة المنتجات في نموذج الإعلان
        function updateProductsInAdForm() {
            const select = document.getElementById('adLinkedProduct');
            if (select) {
                select.innerHTML = '<option value="">بدون ربط</option>';
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.name;
                    select.appendChild(option);
                });
            }
        }

        // عرض المنتجات - محسنة
        function displayProducts(filter = 'all') {
            const grid = document.getElementById('productsGrid');
            let filteredProducts = products;
            
            if (filter !== 'all') {
                if (filter === 'offers') {
                    filteredProducts = products.filter(p => p.badge || p.originalPrice);
                } else if (filter === 'favorites') {
                    filteredProducts = products.filter(p => favorites.includes(p.id));
                } else {
                    filteredProducts = products.filter(p => p.category === filter);
                }
            }
            
            if (filteredProducts.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: var(--space-10); color: var(--gray-400);">
                        <i class="fas fa-box-open" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); opacity: 0.5;"></i>
                        <h3 style="font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); color: var(--gray-300);">لا توجد منتجات</h3>
                        <p style="font-size: var(--font-size-base);">لم يتم العثور على منتجات في هذا التصنيف</p>
                    </div>
                `;
                return;
            }
            
            // استخدام DocumentFragment لتحسين الأداء
            const fragment = document.createDocumentFragment();
            
            filteredProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = createProductCard(product);
                fragment.appendChild(productElement.firstElementChild);
            });
            
            grid.innerHTML = '';
            grid.appendChild(fragment);
        }

        // إنشاء بطاقة المنتج - محسنة
        function createProductCard(product) {
            const images = product.images || (product.image ? [product.image] : []);
            const validImages = images.filter(img => img && img.trim() !== '');
            
            if (validImages.length === 0) {
                validImages.push('https://via.placeholder.com/400x300?text=صورة+المنتج');
            }
            
            return `
                <div class="product-card lazy-load" data-id="${product.id}">
                    <div class="product-image-container">
                        <div class="product-images-slider" id="slider_${product.id}">
                            ${validImages.map((img, index) => `
                                <img src="${img}" 
                                     alt="${product.name}" 
                                     class="product-image"
                                     style="transform: translateX(${index * -100}%)"
                                     loading="lazy"
                                     onerror="this.src='https://via.placeholder.com/400x300?text=صورة+المنتج'">
                            `).join('')}
                        </div>
                        
                        ${validImages.length > 1 ? `
                            <div class="image-indicators">
                                ${validImages.map((_, index) => `
                                    <div class="image-indicator ${index === 0 ? 'active' : ''}" 
                                         onclick="changeProductImage('${product.id}', ${index})"></div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                        
                        <div class="product-favorite ${favorites.includes(product.id) ? 'active' : ''}" 
                             onclick="toggleFavorite('${product.id}')">
                            <i class="fas fa-heart"></i>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        
                        <div class="product-rating">
                            <div class="rating-stars">
                                ${generateStars(product.rating || 4.5)}
                            </div>
                            <span class="rating-text">(${product.reviews || 0})</span>
                        </div>
                        
                        <div class="product-price">
                            <span class="price-current">${parseInt(product.price).toLocaleString()} د.ع</span>
                            ${product.originalPrice ? `<span class="price-original">${parseInt(product.originalPrice).toLocaleString()}</span>` : ''}
                        </div>
                        
                        <div class="product-actions">
                            <div class="action-icon primary" onclick="addToCart('${product.id}')" title="إضافة للسلة">
                                <i class="fas fa-cart-plus"></i>
                            </div>
                            <div class="action-icon secondary" onclick="quickOrder('${product.id}')" title="طلب سريع">
                                <i class="fab fa-whatsapp"></i>
                            </div>
                            <div class="action-icon warning" onclick="openSendMessageModal('${product.id}')" title="مراسلة الإدارة">
                                <i class="fas fa-comment"></i>
                            </div>
                            <div class="action-icon success" onclick="shareProduct('${product.id}')" title="مشاركة">
                                <i class="fas fa-share-alt"></i>
                            </div>
                            <div class="action-icon info" onclick="showProductDetail('${product.id}')" title="تفاصيل">
                                <i class="fas fa-info-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // تغيير صورة المنتج - محسنة
        function changeProductImage(productId, imageIndex) {
            const slider = document.getElementById(`slider_${productId}`);
            const indicators = slider?.parentElement.querySelectorAll('.image-indicator');
            
            if (slider) {
                slider.style.transform = `translateX(${imageIndex * -100}%)`;
                
                indicators?.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === imageIndex);
                });
            }
        }

        // توليد النجوم للتقييم
        function generateStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let stars = '';
            
            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star star"></i>';
            }
            
            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt star"></i>';
            }
            
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star star empty"></i>';
            }
            
            return stars;
        }

        // تحميل الإعلانات
        async function loadAds() {
            try {
                const snapshot = await database.ref('ads').once('value');
                const data = snapshot.val();
                
                ads = data ? Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })) : [];
                
                displayAds();
                
            } catch (error) {
                console.error('خطأ في تحميل الإعلانات:', error);
            }
        }

        // عرض الإعلانات
        function displayAds() {
            const wrapper = document.getElementById('adsWrapper');
            
            if (ads.length === 0) {
                wrapper.innerHTML = `
                    <div class="ad-card">
                        <div class="ad-content">
                            <h3>🔥 مرحباً بكم في محلات الحجامي</h3>
                            <p>أجود أنواع الشالات والطرحات والسجادات التركية</p>
                        </div>
                    </div>
                    <div class="ad-card">
                        <div class="ad-content">
                            <h3>✨ جودة عالية بأسعار تنافسية</h3>
                            <p>خبرة أكثر من 15 سنة في مجال تجارة الشالات</p>
                        </div>
                    </div>
                    <div class="ad-card">
                        <div class="ad-content">
                            <h3>🚚 توصيل مجاني</h3>
                            <p>لجميع أنحاء العراق عند الطلب أكثر من 100,000 د.ع</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            const repeatedAds = [...ads, ...ads, ...ads];
            
            wrapper.innerHTML = repeatedAds.map(ad => `
                <div class="ad-card" onclick="${ad.linkedProduct ? `showLinkedProduct('${ad.linkedProduct}')` : ''}" 
                     style="cursor: ${ad.linkedProduct ? 'pointer' : 'default'};">
                    ${ad.image ? `<img src="${ad.image}" alt="${ad.title}" class="ad-image" loading="lazy">` : 
                                 `<div class="ad-image" style="background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: var(--font-size-lg); font-weight: bold;">${ad.title.charAt(0)}</div>`}
                    <div class="ad-content">
                        <h3>${ad.title}</h3>
                        <p>${ad.description}</p>
                    </div>
                </div>
            `).join('');
        }

        // عرض المنتج المربوط بالإعلان
        function showLinkedProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                showProductDetail(productId);
            }
        }

        // إعداد تحريك الإعلانات - محسنة
        function setupAdsAnimation() {
            const wrapper = document.getElementById('adsWrapper');
            
            wrapper.addEventListener('mouseenter', () => {
                wrapper.style.animationPlayState = 'paused';
            });
            
            wrapper.addEventListener('mouseleave', () => {
                wrapper.style.animationPlayState = 'running';
            });
        }

        // إعداد البحث - محسنة مع debounce
        function setupSearch() {
            const searchInput = document.getElementById('searchInput');

            searchInput.addEventListener('input', function(e) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const query = e.target.value.toLowerCase().trim();
                    
                    if (query === '') {
                        displayProducts(currentFilter);
                        return;
                    }

                    const filteredProducts = products.filter(p => 
                        p.name.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query) ||
                        getCategoryName(p.category).toLowerCase().includes(query)
                    );
                    
                    displayFilteredProducts(filteredProducts, `نتائج البحث عن: "${query}"`);
                }, 200); // تقليل زمن الانتظار
            });
        }

        // عرض المنتجات المفلترة
        function displayFilteredProducts(filteredProducts, title) {
            const grid = document.getElementById('productsGrid');
            
            if (filteredProducts.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: var(--space-10); color: var(--gray-400);">
                        <i class="fas fa-search" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); opacity: 0.5;"></i>
                        <h3 style="font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); color: var(--gray-300);">لم يتم العثور على نتائج</h3>
                        <p style="font-size: var(--font-size-base);">جرب البحث بكلمات أخرى أو تصفح التصنيفات</p>
                    </div>
                `;
                return;
            }
            
            const sectionTitle = document.querySelector('.section-title');
            sectionTitle.textContent = title;
            
            const fragment = document.createDocumentFragment();
            filteredProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = createProductCard(product);
                fragment.appendChild(productElement.firstElementChild);
            });
            
            grid.innerHTML = '';
            grid.appendChild(fragment);
        }

        // مشاركة المنتج - محسنة
        function shareProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            if (navigator.share) {
                navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href
                }).catch(err => console.log('Error sharing:', err));
            } else {
                const url = window.location.href;
                const shareText = `${product.name}\n${product.description}\n${url}`;
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText).then(() => {
                        showNotification('🔗 تم نسخ رابط المنتج');
                    });
                } else {
                    // fallback للمتصفحات القديمة
                    const textArea = document.createElement('textarea');
                    textArea.value = shareText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showNotification('🔗 تم نسخ رابط المنتج');
                }
            }
        }

        // طلب سريع محسن
        function quickOrder(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            let message = `🛍️ *طلب سريع من محلات الحجامي* 🛍️\n\n`;
            message += `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n`;
            message += `🕐 الوقت: ${new Date().toLocaleTimeString('ar-SA')}\n\n`;
            message += `${'═'.repeat(35)}\n`;
            message += `📦 *تفاصيل المنتج المطلوب:*\n`;
            message += `${'═'.repeat(35)}\n\n`;
            
            message += `🏷️ *اسم المنتج:*\n${product.name}\n\n`;
            message += `📋 *الوصف:*\n${product.description}\n\n`;
            message += `💰 *السعر:* ${parseInt(product.price).toLocaleString()} د.ع\n`;
            
            if (product.originalPrice) {
                message += `💸 *السعر الأصلي:* ${parseInt(product.originalPrice).toLocaleString()} د.ع\n`;
                message += `🔥 *مقدار الخصم:* ${(product.originalPrice - product.price).toLocaleString()} د.ع\n`;
            }
            
            if (product.badge) {
                message += `🏆 *العلامة:* ${product.badge}\n`;
            }
            
            message += `⭐ *التقييم:* ${product.rating || 4.5}/5 نجوم (${product.reviews || 0} تقييم)\n`;
            message += `📂 *التصنيف:* ${getCategoryName(product.category)}\n\n`;
            
            const images = product.images || (product.image ? [product.image] : []);
            const validImages = images.filter(img => img && img.trim() !== '');
            if (validImages.length > 0) {
                message += `📸 *صور المنتج:*\n`;
                validImages.forEach((img, index) => {
                    message += `${index + 1}. ${img}\n`;
                });
                message += `\n`;
            }
            
            message += `${'─'.repeat(35)}\n`;
            message += `💬 *رسالة العميل:*\n`;
            message += `السلام عليكم، أرغب في طلب هذا المنتج.\n`;
            message += `يرجى التواصل معي لتأكيد الطلب وترتيب التوصيل.\n\n`;
            message += `🙏 شكراً لكم - محلات الحجامي`;
            
            const whatsappUrl = `https://wa.me/9647736222077?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            showNotification('📱 تم توجيهك للطلب السريع عبر واتساب');
        }

        // إضافة صورة جديدة للمنتج
        function addImageUpload() {
            const container = document.getElementById('imageUploadContainer');
            const currentUploads = container.querySelectorAll('.image-upload').length - 1;

            if (currentUploads >= 5) {
                showNotification('⚠️ يمكن إضافة 5 صور كحد أقصى', 'error');
                return;
            }

            const index = currentUploads;
            const uploadDiv = document.createElement('div');
            uploadDiv.className = 'image-upload';
            uploadDiv.innerHTML = `
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <div style="font-size: var(--font-size-sm); font-weight: 600;">صورة ${index + 1}</div>
                <input type="file" accept="image/*" style="display: none;" onchange="previewProductImage(this, ${index})">
            `;
            
            uploadDiv.onclick = () => uploadDiv.querySelector('input').click();
            
            const addButton = container.querySelector('.image-upload:last-child');
            container.insertBefore(uploadDiv, addButton);
        }

        // معاينة صورة المنتج
        function previewProductImage(input, index) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const uploadDiv = input.closest('.image-upload');
                    uploadDiv.innerHTML = `
                        <div class="image-preview-container">
                            <img src="${e.target.result}" class="image-preview" alt="معاينة">
                            <button type="button" class="remove-image" onclick="removeProductImage(this, ${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    
                    productImages[index] = input.files[0];
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        // إزالة صورة المنتج
        function removeProductImage(button, index) {
            const uploadDiv = button.closest('.image-upload');
            uploadDiv.innerHTML = `
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <div style="font-size: var(--font-size-sm); font-weight: 600;">صورة ${index + 1}</div>
                <input type="file" accept="image/*" style="display: none;" onchange="previewProductImage(this, ${index})">
            `;
            
            uploadDiv.onclick = () => uploadDiv.querySelector('input').click();
            productImages[index] = null;
        }

        // معاينة صورة الإعلان
        function previewAdImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('adImagePreview').innerHTML = `
                        <div class="image-preview-container">
                            <img src="${e.target.result}" class="image-preview" alt="معاينة">
                            <button type="button" class="remove-image" onclick="removeAdImage()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    
                    adImage = input.files[0];
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        // إزالة صورة الإعلان
        function removeAdImage() {
            document.getElementById('adImagePreview').innerHTML = '';
            document.getElementById('adImageInput').value = '';
            adImage = null;
        }

        // رفع صورة إلى Firebase Storage
        async function uploadImage(file, path) {
            try {
                const timestamp = Date.now();
                const fileName = `${timestamp}_${file.name}`;
                const storageRef = storage.ref(`${path}/${fileName}`);
                
                const snapshot = await storageRef.put(file);
                const url = await snapshot.ref.getDownloadURL();
                return url;
            } catch (error) {
                console.error('خطأ في رفع الصورة:', error);
                throw error;
            }
        }

        // معالج إضافة منتج محسن
        async function handleAddProduct(event) {
            event.preventDefault();
            
            try {
                showLoadingSpinner();
                
                const name = document.getElementById('productName').value.trim();
                const description = document.getElementById('productDescription').value.trim();
                const price = parseFloat(document.getElementById('productPrice').value);
                const originalPrice = document.getElementById('productOriginalPrice').value ? parseFloat(document.getElementById('productOriginalPrice').value) : null;
                const category = document.getElementById('productCategory').value;
                const badge = document.getElementById('productBadge').value.trim();
                const editId = event.target.dataset.editId;
                
                if (!name || !description || !price || !category) {
                    showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                    hideLoadingSpinner();
                    return;
                }
                
                const imageUrls = [];
                const validImages = productImages.filter(img => img !== null && img !== undefined);
                
                if (validImages.length === 0 && !editId) {
                    showNotification('يرجى إضافة صورة واحدة على الأقل', 'error');
                    hideLoadingSpinner();
                    return;
                }
                
                for (const imageFile of validImages) {
                    if (imageFile) {
                        const url = await uploadImage(imageFile, 'products');
                        imageUrls.push(url);
                    }
                }
                
                const productData = {
                    name,
                    description,
                    price,
                    originalPrice,
                    category,
                    badge: badge || null,
                    rating: 4.5,
                    reviews: 0,
                    updatedAt: firebase.database.ServerValue.TIMESTAMP
                };

                if (imageUrls.length > 0) {
                    productData.images = imageUrls;
                    productData.image = imageUrls[0];
                }

                if (editId) {
                    await database.ref(`products/${editId}`).update(productData);
                    showNotification('✅ تم تحديث المنتج بنجاح');
                } else {
                    productData.createdAt = firebase.database.ServerValue.TIMESTAMP;
                    await database.ref('products').push(productData);
                    showNotification('✅ تم إضافة المنتج بنجاح');
                }
                
                closeModal('addProductModal');
                await loadProducts(currentFilter);
                
                productImages = [];
                
                hideLoadingSpinner();
                
            } catch (error) {
                console.error('خطأ في حفظ المنتج:', error);
                showNotification('❌ خطأ في حفظ المنتج', 'error');
                hideLoadingSpinner();
            }
        }

        // معالج إضافة إعلان
        async function handleAddAd(event) {
            event.preventDefault();
            
            try {
                showLoadingSpinner();
                
                const title = document.getElementById('adTitle').value.trim();
                const description = document.getElementById('adDescription').value.trim();
                const linkedProduct = document.getElementById('adLinkedProduct').value;
                const editId = event.target.dataset.editId;
                
                if (!title || !description) {
                    showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                    hideLoadingSpinner();
                    return;
                }
                
                const adData = {
                    title,
                    description,
                    linkedProduct: linkedProduct || null,
                    updatedAt: firebase.database.ServerValue.TIMESTAMP
                };

                if (adImage) {
                    const imageUrl = await uploadImage(adImage, 'ads');
                    adData.image = imageUrl;
                }

                if (editId) {
                    await database.ref(`ads/${editId}`).update(adData);
                    showNotification('✅ تم تحديث الإعلان بنجاح');
                } else {
                    adData.createdAt = firebase.database.ServerValue.TIMESTAMP;
                    await database.ref('ads').push(adData);
                    showNotification('✅ تم إضافة الإعلان بنجاح');
                }
                
                closeModal('addAdModal');
                await loadAds();
                
                adImage = null;
                document.getElementById('adImagePreview').innerHTML = '';
                
                hideLoadingSpinner();
                
            } catch (error) {
                console.error('خطأ في حفظ الإعلان:', error);
                showNotification('❌ خطأ في حفظ الإعلان', 'error');
                hideLoadingSpinner();
            }
        }

        // دوال التصنيفات والتنقل
        function getCategoryName(category) {
            const names = {
                'all': 'جميع المنتجات',
                'shawls': 'الشالات والطرحات',
                'carpets': 'السجادات التركية',
                'hajj': 'مستلزمات الحج والعمرة',
                'wholesale': 'البيع بالجملة',
                'offers': 'العروض الخاصة',
                'favorites': 'المفضلة'
            };
            return names[category] || category;
        }

        function filterProducts(category) {
            currentFilter = category;
            displayProducts(category);
            
            const sectionTitle = document.querySelector('.section-title');
            sectionTitle.textContent = `✨ ${getCategoryName(category)}`;
            
            closeSidebar();
            showNotification(`📂 تم عرض: ${getCategoryName(category)}`);
        }

        function toggleFavorite(productId) {
            const index = favorites.indexOf(productId);
            const heartBtn = event.target.closest('.product-favorite');
            
            if (index > -1) {
                favorites.splice(index, 1);
                heartBtn.classList.remove('active');
                showNotification('💔 تم إزالة المنتج من المفضلة');
            } else {
                favorites.push(productId);
                heartBtn.classList.add('active');
                showNotification('❤️ تم إضافة المنتج للمفضلة');
            }
            
            localStorage.setItem('alhajami_favorites', JSON.stringify(favorites));
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({...product, quantity: 1});
            }
            
            localStorage.setItem('alhajami_cart', JSON.stringify(cart));
            updateCartCount();
            
            const cartBtn = document.querySelector('.action-btn .fa-shopping-cart').closest('.action-btn');
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
            
            showNotification(`✅ تم إضافة "${product.name}" إلى السلة!`);
        }

        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            const countElement = document.getElementById('cartCount');
            countElement.textContent = count;
            
            if (count > 0) {
                countElement.style.display = 'flex';
            } else {
                countElement.style.display = 'none';
            }
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            } else {
                modal.classList.add('active');
                document.getElementById('overlay').classList.add('active');
                loadCartItems();
            }
        }

        function loadCartItems() {
            const container = document.getElementById('cartItems');
            const totalElement = document.getElementById('totalPrice');
            
            if (cart.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: var(--space-8); color: var(--gray-400);">
                        <i class="fas fa-shopping-cart" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); opacity: 0.5;"></i>
                        <h3 style="font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); color: var(--gray-300);">السلة فارغة</h3>
                        <p style="font-size: var(--font-size-base);">ابدأ بإضافة منتجات رائعة إلى سلتك</p>
                    </div>
                `;
                totalElement.textContent = '0';
                return;
            }
            
            let total = 0;
            container.innerHTML = cart.map(item => {
                total += item.price * item.quantity;
                const itemImage = item.images && item.images[0] ? item.images[0] : (item.image || 'https://via.placeholder.com/60x60?text=صورة');
                return `
                    <div style="display: flex; gap: var(--space-3); padding: var(--space-3); background: var(--glass); border-radius: var(--radius-lg); margin-bottom: var(--space-3); border: 1px solid var(--glass-border);">
                        <img src="${itemImage}" 
                             alt="${item.name}" 
                             style="width: 60px; height: 60px; border-radius: var(--radius-lg); object-fit: cover; flex-shrink: 0;"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/60x60?text=صورة'">
                        
                        <div style="flex: 1;">
                            <h4 style="color: white; font-weight: 600; margin-bottom: var(--space-1); font-size: var(--font-size-base);">${item.name}</h4>
                            <p style="color: var(--gray-300); font-size: var(--font-size-sm); margin-bottom: var(--space-2);">${item.description}</p>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="color: var(--success-solid); font-weight: 600; font-size: var(--font-size-base);">
                                    ${parseInt(item.price).toLocaleString()} د.ع × ${item.quantity}
                                </div>
                                
                                <div style="display: flex; align-items: center; gap: var(--space-2);">
                                    <button onclick="changeQuantity('${item.id}', -1)" 
                                            style="background: var(--primary-solid); color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: var(--font-size-sm);">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    
                                    <span style="font-weight: 600; min-width: 25px; text-align: center; color: white; font-size: var(--font-size-base);">${item.quantity}</span>
                                    
                                    <button onclick="changeQuantity('${item.id}', 1)" 
                                            style="background: var(--primary-solid); color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: var(--font-size-sm);">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                    
                                    <button onclick="removeFromCart('${item.id}')" 
                                            style="background: var(--error-solid); color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; margin-right: var(--space-2); font-size: var(--font-size-sm);">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            totalElement.textContent = total.toLocaleString();
        }

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

        function removeFromCart(productId) {
            const product = cart.find(item => item.id === productId);
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('alhajami_cart', JSON.stringify(cart));
            updateCartCount();
            loadCartItems();
            if (product) {
                showNotification(`🗑️ تم حذف "${product.name}" من السلة`);
            }
        }

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

        function checkout() {
            if (cart.length === 0) {
                showNotification('⚠️ السلة فارغة!', 'error');
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
                message += `   💰 السعر: ${parseInt(item.price).toLocaleString()} د.ع\n`;
                message += `   📦 الكمية: ${item.quantity}\n`;
                message += `   💵 المجموع: ${(item.price * item.quantity).toLocaleString()} د.ع\n`;
                
                const images = item.images || (item.image ? [item.image] : []);
                const validImages = images.filter(img => img && img.trim() !== '');
                if (validImages.length > 0) {
                    message += `   📸 الصور:\n`;
                    validImages.forEach((img, imgIndex) => {
                        message += `      ${imgIndex + 1}. ${img}\n`;
                    });
                }
                message += `\n`;
            });
            
            message += `${'─'.repeat(30)}\n`;
            message += `💰 *المجموع الكلي: ${total.toLocaleString()} د.ع*\n\n`;
            message += `📞 يرجى التواصل معي لتأكيد الطلب وترتيب التوصيل\n`;
            message += `🙏 شكراً لثقتكم بمحلات الحجامي`;
            
            const whatsappUrl = `https://wa.me/9647736222077?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            showNotification('📱 تم توجيهك لإكمال الطلب عبر واتساب');
        }

        // دوال الشريط الجانبي والقوائم
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            } else {
                sidebar.classList.add('open');
                overlay.classList.add('active');
            }
        }

        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('overlay').classList.remove('active');
        }

        function closeAll() {
            closeSidebar();
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.getElementById('overlay').classList.remove('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        // دوال الإدارة
        function toggleAdmin() {
            const password = prompt('أدخل كلمة مرور الإدارة:');
            if (password === 'admin123') {
                isAdmin = !isAdmin;
                localStorage.setItem('alhajami_admin', isAdmin.toString());
                if (isAdmin) {
                    showAdminSection();
                    showNotification('🔓 تم تفعيل وضع الإدارة');
                } else {
                    hideAdminSection();
                    showNotification('🔒 تم إلغاء وضع الإدارة');
                }
            } else if (password !== null) {
                showNotification('❌ كلمة مرور خاطئة', 'error');
            }
        }

        function showAdminSection() {
            document.getElementById('adminSection').style.display = 'block';
        }

        function hideAdminSection() {
            document.getElementById('adminSection').style.display = 'none';
        }

        function openAddProductModal() {
            document.getElementById('addProductForm').reset();
            document.querySelector('#addProductModal .modal-title').innerHTML = '<i class="fas fa-plus-circle"></i> إضافة منتج جديد';
            delete document.getElementById('addProductForm').dataset.editId;
            
            const container = document.getElementById('imageUploadContainer');
            container.innerHTML = `
                <div class="image-upload" onclick="addImageUpload()">
                    <i class="fas fa-plus upload-icon"></i>
                    <div style="font-size: var(--font-size-sm); font-weight: 600;">إضافة صورة</div>
                </div>
            `;
            productImages = [];
            
            document.getElementById('addProductModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
            closeSidebar();
        }

        function openAddAdModal() {
            document.getElementById('addAdForm').reset();
            document.querySelector('#addAdModal .modal-title').innerHTML = '<i class="fas fa-bullhorn"></i> إضافة إعلان جديد';
            delete document.getElementById('addAdForm').dataset.editId;
            
            document.getElementById('adImagePreview').innerHTML = '';
            adImage = null;
            updateProductsInAdForm();
            
            document.getElementById('addAdModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
            closeSidebar();
        }

        function openManageModal(type) {
            const modal = document.getElementById('manageModal');
            const title = document.getElementById('manageModalTitle');
            const content = document.getElementById('manageContent');
            
            if (type === 'products') {
                title.innerHTML = '<i class="fas fa-edit"></i> إدارة المنتجات';
                loadProductsManagement(content);
            } else if (type === 'ads') {
                title.innerHTML = '<i class="fas fa-images"></i> إدارة الإعلانات';
                loadAdsManagement(content);
            }
            
            modal.classList.add('active');
            document.getElementById('overlay').classList.add('active');
            closeSidebar();
        }

        function loadProductsManagement(container) {
            if (products.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: var(--space-8); color: var(--gray-400);">
                        <i class="fas fa-box-open" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); opacity: 0.5;"></i>
                        <h3 style="font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); color: var(--gray-300);">لا توجد منتجات</h3>
                        <p style="font-size: var(--font-size-base);">ابدأ بإضافة منتجات جديدة</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>الصورة</th>
                            <th>الاسم</th>
                            <th>السعر</th>
                            <th>التصنيف</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => {
                            const productImage = product.images && product.images[0] ? product.images[0] : (product.image || 'https://via.placeholder.com/40x40?text=صورة');
                            return `
                                <tr>
                                    <td><img src="${productImage}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/40x40?text=صورة'"></td>
                                    <td>${product.name}</td>
                                    <td>${parseInt(product.price).toLocaleString()} د.ع</td>
                                    <td>${getCategoryName(product.category)}</td>
                                    <td>
                                        <div class="admin-actions">
                                            <button class="admin-btn edit" onclick="editProduct('${product.id}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="admin-btn delete" onclick="deleteProduct('${product.id}')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }

        function loadAdsManagement(container) {
            if (ads.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: var(--space-8); color: var(--gray-400);">
                        <i class="fas fa-bullhorn" style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); opacity: 0.5;"></i>
                        <h3 style="font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--space-2); color: var(--gray-300);">لا توجد إعلانات</h3>
                        <p style="font-size: var(--font-size-base);">ابدأ بإضافة إعلانات جديدة</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>الصورة</th>
                            <th>العنوان</th>
                            <th>الوصف</th>
                            <th>المنتج المربوط</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ads.map(ad => {
                            const linkedProduct = ad.linkedProduct ? products.find(p => p.id === ad.linkedProduct) : null;
                            return `
                                <tr>
                                    <td>
                                        ${ad.image ? 
                                            `<img src="${ad.image}" alt="${ad.title}" loading="lazy">` : 
                                            `<div style="width: 40px; height: 40px; background: var(--primary-solid); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${ad.title.charAt(0)}</div>`
                                        }
                                    </td>
                                    <td>${ad.title}</td>
                                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ad.description}</td>
                                    <td>${linkedProduct ? linkedProduct.name : 'بدون ربط'}</td>
                                    <td>
                                        <div class="admin-actions">
                                            <button class="admin-btn edit" onclick="editAd('${ad.id}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="admin-btn delete" onclick="deleteAd('${ad.id}')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }

        // دوال تحرير وحذف المنتجات والإعلانات
        async function editProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            closeModal('manageModal');
            
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productOriginalPrice').value = product.originalPrice || '';
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productBadge').value = product.badge || '';
            
            document.querySelector('#addProductModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> تحرير المنتج';
            document.getElementById('addProductForm').dataset.editId = productId;
            
            const container = document.getElementById('imageUploadContainer');
            container.innerHTML = `
                <div class="image-upload" onclick="addImageUpload()">
                    <i class="fas fa-plus upload-icon"></i>
                    <div style="font-size: var(--font-size-sm); font-weight: 600;">إضافة صورة</div>
                </div>
            `;
            productImages = [];
            
            document.getElementById('addProductModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        async function deleteProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
                try {
                    showLoadingSpinner();
                    await database.ref(`products/${productId}`).remove();
                    showNotification('✅ تم حذف المنتج بنجاح');
                    await loadProducts(currentFilter);
                    openManageModal('products');
                    hideLoadingSpinner();
                } catch (error) {
                    console.error('خطأ في حذف المنتج:', error);
                    showNotification('❌ خطأ في حذف المنتج', 'error');
                    hideLoadingSpinner();
                }
            }
        }

        async function editAd(adId) {
            const ad = ads.find(a => a.id === adId);
            if (!ad) return;

            closeModal('manageModal');
            
            document.getElementById('adTitle').value = ad.title;
            document.getElementById('adDescription').value = ad.description;
            document.getElementById('adLinkedProduct').value = ad.linkedProduct || '';
            
            document.querySelector('#addAdModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> تحرير الإعلان';
            document.getElementById('addAdForm').dataset.editId = adId;
            
            document.getElementById('adImagePreview').innerHTML = '';
            adImage = null;
            updateProductsInAdForm();
            
            document.getElementById('addAdModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        async function deleteAd(adId) {
            const ad = ads.find(a => a.id === adId);
            if (!ad) return;

            if (confirm(`هل أنت متأكد من حذف الإعلان "${ad.title}"؟`)) {
                try {
                    showLoadingSpinner();
                    await database.ref(`ads/${adId}`).remove();
                    showNotification('✅ تم حذف الإعلان بنجاح');
                    await loadAds();
                    openManageModal('ads');
                    hideLoadingSpinner();
                } catch (error) {
                    console.error('خطأ في حذف الإعلان:', error);
                    showNotification('❌ خطأ في حذف الإعلان', 'error');
                    hideLoadingSpinner();
                }
            }
        }

        function openMessagesModal() {
            displayMessages();
            document.getElementById('messagesModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
            closeSidebar();
        }

        // عرض تفاصيل المنتج
        function showProductDetail(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            currentProductId = productId;
            const images = product.images || (product.image ? [product.image] : []);
            const validImages = images.filter(img => img && img.trim() !== '');
            
            if (validImages.length === 0) {
                validImages.push('https://via.placeholder.com/400x300?text=صورة+المنتج');
            }
            
            document.getElementById('productDetailTitle').textContent = product.name;
            document.getElementById('productDetailContent').innerHTML = `
                <div style="margin-bottom: var(--space-6);">
                    <div style="position: relative; margin-bottom: var(--space-4);">
                        <div style="overflow: hidden; border-radius: var(--radius-xl);">
                            <div class="product-images-slider" id="detailSlider" style="display: flex; transition: transform 0.3s ease;">
                                ${validImages.map((img, index) => `
                                    <img src="${img}" alt="${product.name}" 
                                         style="width: 100%; height: 300px; object-fit: cover; flex-shrink: 0; transform: translateX(${index * -100}%);"
                                         loading="lazy"
                                         onerror="this.src='https://via.placeholder.com/400x300?text=صورة+المنتج'">
                                `).join('')}
                            </div>
                        </div>
                        
                        ${validImages.length > 1 ? `
                            <div style="position: absolute; bottom: var(--space-3); left: 50%; transform: translateX(-50%); display: flex; gap: var(--space-2); z-index: 10;">
                                ${validImages.map((_, index) => `
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; cursor: pointer;" 
                                         onclick="changeDetailImage(${index})"></div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <h3 style="color: white; margin-bottom: var(--space-3); font-size: var(--font-size-xl); font-weight: 600;">${product.name}</h3>
                    <p style="color: var(--gray-300); margin-bottom: var(--space-4); line-height: 1.6;">${product.description}</p>
                    
                    <div style="margin-bottom: var(--space-4);">
                        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                            <div class="rating-stars">${generateStars(product.rating || 4.5)}</div>
                            <span style="color: var(--gray-400); font-size: var(--font-size-sm);">(${product.reviews || 0} تقييم)</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: var(--space-4);">
                        <span style="font-size: var(--font-size-2xl); font-weight: 700; background: var(--success); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            ${parseInt(product.price).toLocaleString()} د.ع
                        </span>
                        ${product.originalPrice ? `<span style="color: var(--gray-500); text-decoration: line-through; margin-right: var(--space-3); font-size: var(--font-size-lg);">${parseInt(product.originalPrice).toLocaleString()}</span>` : ''}
                    </div>
                    
                    <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-6);">
                        <button class="btn btn-primary" onclick="addToCart('${product.id}')" style="flex: 1;">
                            <i class="fas fa-cart-plus"></i>
                            إضافة للسلة
                        </button>
                        <button class="btn btn-secondary" onclick="quickOrder('${product.id}')" style="flex: 1;">
                            <i class="fab fa-whatsapp"></i>
                            طلب سريع
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('productDetailModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function changeDetailImage(imageIndex) {
            const slider = document.getElementById('detailSlider');
            const indicators = slider?.parentElement.querySelectorAll('div[onclick*="changeDetailImage"]');
            
            if (slider) {
                slider.style.transform = `translateX(${imageIndex * -100}%)`;
                
                indicators?.forEach((indicator, index) => {
                    indicator.style.background = index === imageIndex ? 'white' : 'rgba(255,255,255,0.5)';
                });
            }
        }

        // دوال أخرى
        function focusSearch() {
            document.getElementById('searchInput').focus();
        }

        function showHome() {
            filterProducts('all');
            updateActiveNavItem(0);
            document.querySelector('.section-title').textContent = '✨ منتجاتنا المميزة';
        }

        function showOffers() {
            filterProducts('offers');
            updateActiveNavItem(2);
        }

        function showFavorites() {
            if (favorites.length === 0) {
                showNotification('💔 لا توجد منتجات في المفضلة');
                return;
            }
            filterProducts('favorites');
            updateActiveNavItem(3);
        }

        function showOrders() {
            showNotification('📋 قريباً ستتمكن من تتبع طلباتك!');
        }

        function updateActiveNavItem(index) {
            document.querySelectorAll('.nav-item').forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            
            const icon = notification.querySelector('i');
            if (type === 'error') {
                icon.className = 'fas fa-exclamation-circle';
            } else {
                icon.className = 'fas fa-check-circle';
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        function showLoadingSpinner() {
            document.getElementById('loadingSpinner').style.display = 'block';
        }

        function hideLoadingSpinner() {
            document.getElementById('loadingSpinner').style.display = 'none';
        }

        // معالجة الأخطاء العامة
        window.addEventListener('error', function(e) {
            console.error('خطأ عام:', e.error);
            showNotification('حدث خطأ غير متوقع', 'error');
        });

        // معالجة حالة الشبكة
        window.addEventListener('online', () => {
            showNotification('🌐 تم استعادة الاتصال بالإنترنت');
        });

        window.addEventListener('offline', () => {
            showNotification('📡 أنت تعمل في وضع عدم الاتصال', 'error');
        });

        // معالجة الضغط على مفتاح Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAll();
            }
        });

        // منع التصغير عند النقر المزدوج على iOS
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Service Worker للعمل بدون اتصال
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('Service Worker مسجل بنجاح:', registration);
                    })
                    .catch(error => {
                        console.log('فشل في تسجيل Service Worker:', error);
                    });
            });
        }

        console.log('🚀 تطبيق محلات الحجامي المحسن والمطور جاهز للعمل!');
