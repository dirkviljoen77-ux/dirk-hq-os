self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Dirk HQ reminder", {
      body: data.body || "You have an upcoming meeting.",
      icon: "/favicon.ico",
      data: { url: data.url || "/calendar" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
