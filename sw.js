const CACHE_NAME = 'alhajami-store-v1.0.0';
const urlsToCache = [
  '/alhijama/',
  '/alhijama/index.html',
  '/alhijama/app.js',
  '/alhijama/manifest.json',
  'https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached App Shell');
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate Event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming Clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Cache First Strategy
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetch Event', event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Found in Cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from Network', event.request.url);
        return fetch(event.request).then(fetchResponse => {
          // Check if we received a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Clone the response
          const responseToCache = fetchResponse.clone();

          // Add to cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return fetchResponse;
        });
      })
      .catch(() => {
        // If both cache and network fail, show a fallback page
        if (event.request.destination === 'document') {
          return caches.match('/alhijama/index.html');
        }
      })
  );
});

// Background Sync
self.addEventListener('sync', event => {
  console.log('Service Worker: Background Sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise((resolve, reject) => {
    // Perform background tasks here
    console.log('Service Worker: Performing background sync');
    resolve();
  });
}

// Push Notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push Event');
  
  const iconUrl = 'https://firebasestorage.googleapis.com/v0/b/messageemeapp.appspot.com/o/alhijama%2F472208534_122180270408092809_6379164161521111948_n.jpg?alt=media&token=c2381395-7d6c-460c-a197-1a42d05b42c1';
  const options = {
    body: event.data ? event.data.text() : 'عرض جديد من محلات الحجامي!',
    icon: iconUrl,
    badge: iconUrl,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'تصفح المنتجات',
        icon: iconUrl
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: iconUrl
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('محلات الحجامي', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification Click');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/alhijama/')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('/alhijama/')
    );
  }
});

// Message handling
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', event => {
  console.error('Service Worker: Error', event.error);
});

// Unhandled rejection
self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled rejection', event.reason);
});

// Update available
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'UPDATE_AVAILABLE') {
    event.ports[0].postMessage({
      action: 'UPDATE_AVAILABLE'
    });
  }
});