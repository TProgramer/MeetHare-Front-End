// 참고 - https://ducanh-next-pwa.vercel.app/docs/next-pwa/custom-worker
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  // disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
  register: true,
  skipWaiting: true,
  customWorkerDir: "worker",
  // ... other options you like
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
