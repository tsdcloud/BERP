import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePushNotification = (userId) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    async function setupPush() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        
        const existingSubscription = await reg.pushManager.getSubscription();
        if (existingSubscription) {
          setSubscription(existingSubscription);
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setupPush();
    }
  }, []);

  const subscribeUser = async () => {
    if (!registration) return;
    
    try {
      // Get public key from server
      const response = await fetch('/api/push/public-key');
      const publicKey = response.data.publicKey;
      
      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      
      // Send subscription to server
      await axios.post('/api/push/subscribe', {
        subscription: newSubscription,
        userId
      });
      
      setSubscription(newSubscription);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const unsubscribeUser = async () => {
    if (!subscription) return;
    
    try {
      await subscription.unsubscribe();
      await axios.delete('/api/push/subscribe', {
        data: { endpoint: subscription.endpoint }
      });
      
      setSubscription(null);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  const requestPermission = async () => {
    if (Notification.permission === 'denied') {
      alert('Push notifications are blocked. Please enable them in your browser settings.');
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeUser();
    }
  };

  return {
    isSubscribed,
    subscription,
    requestPermission,
    unsubscribeUser
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}