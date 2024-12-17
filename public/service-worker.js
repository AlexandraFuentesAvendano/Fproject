const CACHE_NAME = 'revit-viz-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/static/js/main.js',
    '/static/css/main.css',
    '/assets/materials/concrete.jpg',
    '/assets/materials/brick.jpg',
    '/assets/materials/wood.jpg',
    '/assets/materials/glass.jpg',
    '/assets/materials/metal.jpg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Handle API requests differently
    if (event.request.url.includes('/api/')) {
        event.respondWith(networkFirst(event.request));
    } else {
        event.respondWith(cacheFirst(event.request));
    }
});

// Cache-first strategy for static assets
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Handle fetch errors
        console.error('Fetch error:', error);
        // You might want to return a custom offline page here
        return new Response('Offline content not available');
    }
}

// Network-first strategy for API requests
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Handle both network and cache failures
        return new Response(JSON.stringify({ error: 'Network error' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1',
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver detalles',
            },
            {
                action: 'close',
                title: 'Cerrar',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification('Revit Visualizer', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // Handle explore action
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-building-data') {
        event.waitUntil(syncBuildingData());
    }
});

// Function to sync building data
async function syncBuildingData() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        const pendingRequests = requests.filter(request =>
            request.url.includes('/api/building/')
        );

        await Promise.all(
            pendingRequests.map(async (request) => {
                try {
                    const response = await fetch(request);
                    if (response.ok) {
                        await cache.put(request, response);
                    }
                } catch (error) {
                    console.error('Sync error:', error);
                }
            })
        );
    } catch (error) {
        console.error('Sync error:', error);
    }
}

// Handle periodic sync
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-building-data') {
        event.waitUntil(updateBuildingData());
    }
});

// Function to periodically update building data
async function updateBuildingData() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        const buildingRequests = requests.filter(request =>
            request.url.includes('/api/building/')
        );

        await Promise.all(
            buildingRequests.map(async (request) => {
                try {
                    const response = await fetch(request);
                    if (response.ok) {
                        await cache.put(request, response);
                    }
                } catch (error) {
                    console.error('Update error:', error);
                }
            })
        );
    } catch (error) {
        console.error('Update error:', error);
    }
}
