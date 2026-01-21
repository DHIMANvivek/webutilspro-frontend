// Push Notification Widget for WebUtilsPro
// This widget enables web push notifications on any website

(function () {
    'use strict';

    // Get configuration from script tag
    const currentScript = document.currentScript || document.querySelector('script[data-api-key]');
    const API_KEY = currentScript?.getAttribute('data-api-key');
    const API_URL = 'https://webutilspro-backend.vercel.app/api/notifications';

    if (!API_KEY) {
        console.error('[Push Widget] No API key provided');
        return;
    }

    const MAIN_DOMAIN = 'https://webutilspro.com';
    const IS_EXTERNAL = window.location.hostname !== 'webutilspro.com' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

    // Firebase configuration - will be loaded dynamically
    let firebaseConfig = null;
    let messaging = null;

    // Initialize Firebase
    async function initializeFirebase() {
        try {
            // Dynamically import Firebase
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getMessaging } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

            // Get Firebase config from backend
            const response = await fetch(`${API_URL}/config?apiKey=${API_KEY}`);
            if (!response.ok) throw new Error('Failed to get Firebase config');

            firebaseConfig = await response.json();

            // Validate Firebase config
            if (!firebaseConfig.projectId || !firebaseConfig.apiKey || !firebaseConfig.messagingSenderId) {
                console.error('[Push Widget] Firebase credentials not configured');
                return false;
            }

            // Initialize Firebase app
            const app = initializeApp(firebaseConfig);
            messaging = getMessaging(app);

            // Register service worker ONLY if on same domain
            if (!IS_EXTERNAL && 'serviceWorker' in navigator) {
                try {
                    const swRegistration = await navigator.serviceWorker.register(
                        `/firebase-messaging-sw.js?apiKey=${API_KEY}`,
                        { scope: '/' }
                    );
                    console.log('[Push Widget] Service Worker registered');

                    if (swRegistration.active) {
                        swRegistration.active.postMessage({
                            type: 'INIT_FIREBASE',
                            apiKey: API_KEY
                        });
                    }
                } catch (err) {
                    console.error('[Push Widget] Service Worker registration failed:', err);
                }
            }

            console.log('[Push Widget] Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('[Push Widget] Firebase initialization failed:', error);
            return false;
        }
    }

    // Request notification permission and subscribe
    async function subscribe() {
        try {
            // Check if notifications are supported
            if (!('Notification' in window)) {
                alert('This browser does not support notifications');
                return false;
            }

            // If external domain, we must use a popup hosted on the main domain
            // This is because we cannot host the service worker on the external domain root
            if (IS_EXTERNAL) {
                const width = 500;
                const height = 600;
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;

                const popup = window.open(
                    `${MAIN_DOMAIN}/push-subscribe.html?apiKey=${API_KEY}&url=${encodeURIComponent(window.location.href)}`,
                    'WebUtilsProSubscribe',
                    `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,location=0,menubar=0,directories=0,resizable=1,scrollbars=1`
                );

                if (!popup) {
                    alert('Please allow popups to enable notifications');
                    return false;
                }

                return true;
            }

            // Internal flow
            if (!messaging) {
                const initialized = await initializeFirebase();
                if (!initialized) return false;
            }

            // Request permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') return false;

            // Get FCM token
            const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
            const token = await getToken(messaging, {
                vapidKey: firebaseConfig.vapidKey
            });

            // Send token to backend
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    apiKey: API_KEY,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                })
            });

            if (response.ok) {
                console.log('[Push Widget] Successfully subscribed');
                localStorage.setItem('push_subscribed', 'true');
                hidePrompt();
                return true;
            }

            throw new Error('Subscription failed');
        } catch (error) {
            console.error('[Push Widget] Subscription error:', error);
            alert('Failed to subscribe. Please try again.');
            return false;
        }
    }

    // Handle messages from popup
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_SUBSCRIBED') {
            console.log('[Push Widget] Subscription successful in popup');
            localStorage.setItem('push_subscribed', 'true');
            hidePrompt();
        }
    });

    // Create subscription prompt UI
    function createPrompt() {
        const prompt = document.createElement('div');
        prompt.id = 'push-notification-prompt';
        prompt.innerHTML = `
            <style>
                #push-notification-prompt {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
                    padding: 12px 16px;
                    max-width: 380px;
                    z-index: 99999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(0,0,0,0.06);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: default !important;
                }
                
                #push-notification-prompt * {
                    cursor: default !important;
                }
                
                #push-notification-prompt button {
                    cursor: pointer !important;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .push-prompt-icon {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                
                .push-prompt-content {
                    flex: 1;
                    min-width: 0;
                }
                
                .push-prompt-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 2px 0;
                }
                
                .push-prompt-message {
                    font-size: 12px;
                    color: #666;
                    line-height: 1.3;
                    margin: 0;
                }
                
                .push-prompt-actions {
                    display: flex;
                    gap: 6px;
                    flex-shrink: 0;
                }
                
                .push-prompt-btn {
                    padding: 6px 14px;
                    border: none;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                
                .push-prompt-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .push-prompt-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .push-prompt-btn-secondary {
                    background: transparent;
                    color: #666;
                }
                
                .push-prompt-btn-secondary:hover {
                    background: #f3f4f6;
                }
                
                .push-prompt-close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    font-size: 16px;
                    color: #999;
                    cursor: pointer;
                    padding: 2px;
                    line-height: 1;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.2s;
                    opacity: 0.6;
                }
                
                .push-prompt-close:hover {
                    background: #f3f4f6;
                    opacity: 1;
                }
                
                @media (max-width: 480px) {
                    #push-notification-prompt {
                        left: 16px;
                        right: 16px;
                        max-width: none;
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .push-prompt-actions {
                        width: 100%;
                    }
                    
                    .push-prompt-btn {
                        flex: 1;
                    }
                }
            </style>
            
            <button class="push-prompt-close" onclick="this.parentElement.remove()">×</button>
            <div class="push-prompt-icon">🔔</div>
            <div class="push-prompt-content">
                <div class="push-prompt-title">Stay Updated!</div>
                <div class="push-prompt-message">Get notified about new tools & updates</div>
            </div>
            <div class="push-prompt-actions">
                <button class="push-prompt-btn push-prompt-btn-secondary" onclick="this.closest('#push-notification-prompt').remove()">
                    Not Now
                </button>
                <button class="push-prompt-btn push-prompt-btn-primary" id="push-subscribe-btn">
                    Enable
                </button>
            </div>
        `;

        document.body.appendChild(prompt);

        // Add click handler for subscribe button
        document.getElementById('push-subscribe-btn').addEventListener('click', async function () {
            this.textContent = 'Subscribing...';
            this.disabled = true;
            await subscribe();
        });
    }

    function hidePrompt() {
        const prompt = document.getElementById('push-notification-prompt');
        if (prompt) {
            prompt.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => prompt.remove(), 300);
        }
    }

    // Listen for foreground messages
    async function setupMessageListener() {
        if (!messaging) return;

        const { onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

        onMessage(messaging, (payload) => {
            console.log('[Push Widget] Message received:', payload);

            // Show notification if permission is granted
            if (Notification.permission === 'granted') {
                new Notification(payload.notification.title, {
                    body: payload.notification.body,
                    icon: payload.notification.icon || '/logo.png',
                    badge: '/logo.png',
                    tag: payload.data?.notificationId || 'default',
                    data: payload.data
                });
            }
        });
    }

    // Initialize widget
    function init() {
        // Check if already subscribed
        if (localStorage.getItem('push_subscribed') === 'true') {
            console.log('[Push Widget] Already subscribed');
            initializeFirebase().then(setupMessageListener);
            return;
        }

        // Show prompt after a delay
        setTimeout(() => {
            // Don't show if user dismissed recently
            const lastDismissed = localStorage.getItem('push_prompt_dismissed');
            if (lastDismissed) {
                const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
                if (daysSinceDismissed < 7) {
                    console.log('[Push Widget] Prompt dismissed recently');
                    return;
                }
            }

            createPrompt();

            // Track dismissal
            const prompt = document.getElementById('push-notification-prompt');
            if (prompt) {
                const closeBtn = prompt.querySelector('.push-prompt-close');
                const notNowBtn = prompt.querySelector('.push-prompt-btn-secondary');

                [closeBtn, notNowBtn].forEach(btn => {
                    if (btn) {
                        btn.addEventListener('click', () => {
                            localStorage.setItem('push_prompt_dismissed', Date.now().toString());
                        });
                    }
                });
            }
        }, 5000); // Show after 5 seconds
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
