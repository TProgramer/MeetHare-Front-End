import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const sfPro = localFont({
  src: "./SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const gmarketMedium = localFont({
  src: "./GmarketSansMedium.otf",
})

export const gmarketLight = localFont({
  src: "./GmarketSansLight.otf",
})

export const gmarketBold = localFont({
  src: "./GmarketSansBold.otf",
})

export const SCDreamThin = localFont({
  src: "./SCDreamThin.otf",
})

export const SCDreamLight = localFont({
  src: "./SCDreamLight.otf",
})

export const SCDreamNormal = localFont({
  src: "./SCDreamNormal.otf",
})
