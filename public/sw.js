if(!self.define){let e,s={};const t=(t,n)=>(t=new URL(t+".js",n).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(n,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let i={};const d=e=>t(e,c),r={module:{uri:c},exports:i,require:d};s[c]=Promise.all(n.map((e=>r[e]||d(e)))).then((e=>(a(...e),i)))}}define(["./workbox-8637ed29"],(function(e){"use strict";importScripts("/worker-a498713acfff9d15.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/9LLCmROljdwVLnZSFtBvm/_buildManifest.js",revision:"384b19584b1435ddd1d3e29d58feecf6"},{url:"/_next/static/9LLCmROljdwVLnZSFtBvm/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/249-a87e2f1c1ac51bb6.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/332-6fe10687e272ec22.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/45-eb3f37dc8b8a0b9c.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/534-8963cbadac559ca2.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/576ab989-6d6ca634fa6fb236.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/709-efce008c2cfcfbff.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/772-0ae26e25fc0a65b9.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/788-bba4c836fc2b8487.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/824-87fff7b9d8be427d.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/838-2762833c9a176671.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/868-8a90e2fc86a3d622.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/896-b827b7f01706a15f.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/906-40d6d6a07875f2a1.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/970-2d047ce1f2edb460.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/_not-found-e74eaf94d9d21e9d.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/createroom/page-2ec52221f6c95d4f.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/findmyroom/page-be4be46bf2c5e53a.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/findnearstation/page-61fb215a2c97f6c0.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/layout-5a815ecda04d9598.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/maps/page-501cf15ee709ad19.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/middlespot/%5Bid%5D/page-152d38d5e1744cd2.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/middlespot/page-7af111f9f4e74989.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/page-d9b262eeb143d1f8.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/place/%5Bid%5D/page-5dcc5bc8e5cd4cd2.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/preference/page-23f8a63d35d6d528.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/realtimeposition/page-02cd8adc3da422d9.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/recommendMap/page-69c565f665909879.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/app/room/%5Bid%5D/page-0196c9e1df357273.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/c54cacfa-b004c098e968e2aa.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/framework-510ec8ffd65e1d01.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/main-app-b8ee89dbebcc6632.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/main-cb1a6b08e058c7b3.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/pages/_app-2b112fe59b3a5a3b.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/pages/_error-9f2bd6d9ff5d73f8.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-d737213f40af9b10.js",revision:"9LLCmROljdwVLnZSFtBvm"},{url:"/_next/static/css/1c258675dc250e6c.css",revision:"1c258675dc250e6c"},{url:"/_next/static/css/4ff1d270e8c719ea.css",revision:"4ff1d270e8c719ea"},{url:"/_next/static/css/7b233cd83a8cff1c.css",revision:"7b233cd83a8cff1c"},{url:"/_next/static/css/d3eb0c9d3c2cdbde.css",revision:"d3eb0c9d3c2cdbde"},{url:"/_next/static/media/05a31a2ca4975f99-s.woff2",revision:"f1b44860c66554b91f3b1c81556f73ca"},{url:"/_next/static/media/0b556ab61bb788eb-s.p.otf",revision:"84cd2c3f2cd25d958fde6d8d7aed89bc"},{url:"/_next/static/media/513657b02c5c193f-s.woff2",revision:"c4eb7f37bc4206c901ab08601f21f0f2"},{url:"/_next/static/media/51ed15f9841b9f9d-s.woff2",revision:"bb9d99fb9bbc695be80777ca2c1c2bee"},{url:"/_next/static/media/52e3d01702839bd6-s.p.otf",revision:"d49f46d24559ebb5f147e61e2082498d"},{url:"/_next/static/media/739c3fc6205423fb-s.p.otf",revision:"47fb61abeca56faf941a28a022b31f7d"},{url:"/_next/static/media/7f69cf61c735ce66-s.p.otf",revision:"dcdb13e415566997f4a392e29ddfdd90"},{url:"/_next/static/media/97412f8cdee85c9b-s.p.otf",revision:"b183bdac8472171e3f7a0a428d7600c0"},{url:"/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",revision:"74c3556b9dad12fb76f84af53ba69410"},{url:"/_next/static/media/d6b16ce4a6175f26-s.woff2",revision:"dd930bafc6297347be3213f22cc53d3e"},{url:"/_next/static/media/de4067987e9e1eee-s.p.otf",revision:"51fd7406327f2b1dbc8e708e6a9da9a5"},{url:"/_next/static/media/ec159349637c90ad-s.woff2",revision:"0e89df9522084290e01e4127495fae99"},{url:"/_next/static/media/f246b15ee96487c0-s.p.otf",revision:"8be5836258dabb5c226e34e53a4c2c37"},{url:"/_next/static/media/fd4db3eb5472fc27-s.woff2",revision:"71f3fcaf22131c3368d9ec28ef839831"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:t})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&t&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:t})=>"1"===e.headers.get("RSC")&&t&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
