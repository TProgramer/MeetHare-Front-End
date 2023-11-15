// /work/index.js
// 서비스 워커에게 푸시 이벤트를 수신하도록 지시
// self.addEventListener("push", (event) => {
//   console.log("[Service Worker] Push Received.", event.data.text());
//   const { title, body } = event.data.json();
//   event.waitUntil(self.registration.showNotification(title, { body }));
// });

// self.addEventListener("notificationclick", (event) => {
//   console.log("[Service Worker] notificationclick");
//   clients.openWindow(event.notification.data.link);
// });

// self.addEventListener("install", () => {
//   console.log("[Service Worker] install");
//   self.skipWaiting();
// });

// Handle web push
console.log("커스텀 로딩 완료");

self.addEventListener("push", (e) => {
  const data = e.data?.json();
  if (data) {
    // 참고 : https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
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
  console.log("[Service Worker] install");
  self.skipWaiting();
});
