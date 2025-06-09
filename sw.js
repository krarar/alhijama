// Service Worker للعمل بدون اتصال
const CACHE_NAME = 'alhajami-store-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js',
  'https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: تم التثبيت');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: خطأ في التثبيت:', error);
      })
  );
  
  // فرض التفعيل الفوري
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: تم التفعيل');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // حذف الكاش القديم
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // التحكم في جميع العملاء
      return self.clients.claim();
    })
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // تجاهل طلبات Firebase الديناميكية
  if (event.request.url.includes('firebaseapp.com') && 
      (event.request.url.includes('__/auth/') || 
       event.request.url.includes('__/firebase/') ||
       event.request.method !== 'GET')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إرجاع من الكاش إذا وُجد
        if (response) {
          console.log('Service Worker: من الكاش:', event.request.url);
          return response;
        }
        
        // محاولة جلب من الشبكة
        return fetch(event.request)
          .then((response) => {
            // التحقق من صحة الاستجابة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // نسخ الاستجابة للكاش
            const responseToCache = response.clone();
            
            // حفظ في الكاش للموارد المهمة فقط
            if (shouldCache(event.request.url)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch((error) => {
            console.log('Service Worker: خطأ في الشبكة:', error);
            
            // إرجاع صفحة بديلة عند عدم الاتصال
            if (event.request.destination === 'document') {
              return caches.match('./');
            }
            
            // إرجاع صورة بديلة للصور
            if (event.request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
                '<rect width="400" height="300" fill="#f3f4f6"/>' +
                '<text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">غير متصل</text>' +
                '</svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            
            throw error;
          });
      })
  );
});

// تحديد الملفات التي يجب حفظها في الكاش
function shouldCache(url) {
  // حفظ الصور من Firebase Storage
  if (url.includes('firebasestorage.googleapis.com')) {
    return true;
  }
  
  // حفظ ملفات CSS و JS
  if (url.includes('.css') || url.includes('.js')) {
    return true;
  }
  
  // حفظ الخطوط
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    return true;
  }
  
  return false;
}

// رسائل إلى العميل
self.addEventListener('message', (event) => {
  console.log('Service Worker: رسالة من العميل:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// معالجة الإشعارات Push (للمستقبل)
self.addEventListener('push', (event) => {
  console.log('Service Worker: إشعار Push');
  
  const options = {
    body: event.data ? event.data.text() : 'رسالة جديدة من محلات الحجامي',
    icon: 'https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1',
    badge: 'https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1',
    data: {
      url: './'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('محلات الحجامي', options)
  );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: نقر على الإشعار');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || './')
    );
  }
});

// معالجة تزامن البيانات في الخلفية
self.addEventListener('sync', (event) => {
  console.log('Service Worker: مزامنة البيانات:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// دالة مزامنة البيانات
async function doBackgroundSync() {
  try {
    console.log('Service Worker: بدء مزامنة البيانات');
    
    // يمكن إضافة منطق مزامنة البيانات هنا
    // مثل إرسال الرسائل المحفوظة محلياً أو تحديث البيانات
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: خطأ في مزامنة البيانات:', error);
    throw error;
  }
}

// معالجة تحديثات الكاش
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

// تحديث الكاش دورياً
async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    const updatePromises = requests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.status === 200) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.warn('Service Worker: خطأ في تحديث:', request.url);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('Service Worker: تم تحديث الكاش');
  } catch (error) {
    console.error('Service Worker: خطأ في تحديث الكاش:', error);
  }
}

console.log('✅ Service Worker محلات الحجامي جاهز للعمل!');
