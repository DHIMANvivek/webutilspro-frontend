// Push Notification Widget for WebUtilsPro
// This widget enables web push notifications on any website

(function () {
    'use strict';

    // Get configuration from script tag
    const currentScript = document.currentScript || document.querySelector('script[data-api-key]');
    const API_KEY = currentScript?.getAttribute('data-api-key');
    const API_URL = 'https://api.webutilspro.com/api/notifications';

    if (!API_KEY) {
        console.error('[Push Widget] No API key provided');
        return;
    }

    // Firebase configuration - will be loaded dynamically
    let firebaseConfig = null;
    let messaging = null;

    // Initialize Firebase
    async function initializeFirebase() {
        try {
            // Dynamically import Firebase
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getMessaging, getToken, onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

            // Get Firebase config from backend
            const response = await fetch(`${API_URL}/config?apiKey=${API_KEY}`);
            if (!response.ok) throw new Error('Failed to get Firebase config');

            firebaseConfig = await response.json();

            // Initialize Firebase app
            const app = initializeApp(firebaseConfig);
            messaging = getMessaging(app);

            console.log('[Push Widget] Firebase initialized');
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

            // Initialize Firebase if not already done
            if (!messaging) {
                const initialized = await initializeFirebase();
                if (!initialized) {
                    alert('Failed to initialize push notifications');
                    return false;
                }
            }

            // Request permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('[Push Widget] Notification permission denied');
                return false;
            }

            // Get FCM token
            const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
            const token = await getToken(messaging, {
                vapidKey: firebaseConfig.vapidKey
            });

            // Send token to backend
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    apiKey: API_KEY,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                })
            });

            if (response.ok) {
                console.log('[Push Widget] Successfully subscribed to push notifications');
                localStorage.setItem('push_subscribed', 'true');
                hidePrompt();
                return true;
            }

            throw new Error('Subscription failed');
        } catch (error) {
            console.error('[Push Widget] Subscription error:', error);
            alert('Failed to subscribe to notifications. Please try again.');
            return false;
        }
    }

    // Create subscription prompt UI
    function createPrompt() {
        const prompt = document.createElement('div');
        prompt.id = 'push-notification-prompt';
        prompt.innerHTML = `
            <style>
                #push-notification-prompt {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    padding: 20px;
                    max-width: 360px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .push-prompt-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                
                .push-prompt-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-center;
                    font-size: 20px;
                }
                
                .push-prompt-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0;
                }
                
                .push-prompt-message {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.5;
                    margin-bottom: 16px;
                }
                
                .push-prompt-buttons {
                    display: flex;
                    gap: 8px;
                }
                
                .push-prompt-btn {
                    flex: 1;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .push-prompt-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .push-prompt-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .push-prompt-btn-secondary {
                    background: #f3f4f6;
                    color: #666;
                }
                
                .push-prompt-btn-secondary:hover {
                    background: #e5e7eb;
                }
                
                .push-prompt-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #999;
                    cursor: pointer;
                    padding: 4px;
                    line-height: 1;
                }
                
                .push-prompt-close:hover {
                    color: #666;
                }
            </style>
            
            <button class="push-prompt-close" onclick="this.parentElement.remove()">×</button>
            <div class="push-prompt-header">
                <div class="push-prompt-icon">🔔</div>
                <h3 class="push-prompt-title">Stay Updated!</h3>
            </div>
            <p class="push-prompt-message">
                Get instant notifications about new tools, features, and important updates.
            </p>
            <div class="push-prompt-buttons">
                <button class="push-prompt-btn push-prompt-btn-secondary" onclick="this.closest('#push-notification-prompt').remove()">
                    Not Now
                </button>
                <button class="push-prompt-btn push-prompt-btn-primary" id="push-subscribe-btn">
                    Enable Notifications
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
