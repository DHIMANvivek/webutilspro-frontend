// Firebase Cloud Messaging Service Worker
// This handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration will be fetched dynamically
let messaging = null;

// Initialize Firebase
async function initializeFirebase(providedApiKey = null) {
    try {
        // Get the API key from the service worker's own query parameters or provided message
        const params = new URLSearchParams(self.location.search);
        const apiKey = providedApiKey || params.get('apiKey');

        if (!apiKey) {
            console.error('[SW] No API key provided');
            return;
        }

        // Fetch Firebase config from backend
        const response = await fetch(`https://api.webutilspro.com/api/notifications/config?apiKey=${apiKey}`);
        const firebaseConfig = await response.json();

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        messaging = firebase.messaging();

        console.log('[SW] Firebase initialized');
    } catch (error) {
        console.error('[SW] Firebase initialization failed:', error);
    }
}

// Handle background messages
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INIT_FIREBASE') {
        initializeFirebase(event.data.apiKey);
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const notificationTitle = data.notification?.title || 'New Notification';
    const notificationOptions = {
        body: data.notification?.body || '',
        icon: data.notification?.icon || '/logo.png',
        badge: '/logo.png',
        tag: data.data?.notificationId || 'default',
        data: data.data || {},
        requireInteraction: false,
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window if none exists
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );

    // Track click event
    if (event.notification.data?.notificationId) {
        fetch('https://api.webutilspro.com/api/notifications/track-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                notificationId: event.notification.data.notificationId,
            }),
        }).catch((error) => console.error('[SW] Failed to track click:', error));
    }
});

console.log('[SW] Service worker loaded');
