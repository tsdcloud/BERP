self.addEventListener('push', (event) => {
    const payload = event.data ? event.data.json() : {};
    
    event.waitUntil(
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        data: payload.data
      })
    );
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow(event.notification.data?.url || '/');
      })
    );
  });