console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  let {body}=data;
  let formatedBody = JSON.parse(body);
  console.log(formatedBody)
  self.registration.showNotification(data.title, {
    body,
    icon: "/public/logo-placeholder.png",
    vibrate: [200, 100, 200],
    tag: "Creation d'incident",
    data:{link:data.link}
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const page_parms = event.notification.data.link; // Access the link from the notification data
  event.waitUntil(
    clients.openWindow(page_parms) // The PWA route you want to open
  );
});