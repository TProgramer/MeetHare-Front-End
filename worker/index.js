// Handle web push
self.addEventListener("push", (e) => {
  const data = e.data?.json();
  if (data) {
    self.registration.showNotification(data.title, {
      body: data.body,
      badge: "/meetHare-logo.png",
    });
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(focusOrOpenWindow());
});

async function focusOrOpenWindow() {
  const url = new URL("/", self.location.origin).href;

  const allWindows = await self.clients.matchAll({
    type: "window",
  });
  const appWindow = allWindows.find((w) => w.url === url);

  if (appWindow) {
    return appWindow.focus();
  } else {
    return self.clients.openWindow(url);
  }
}

self.addEventListener("install", () => {
  self.skipWaiting();
});
