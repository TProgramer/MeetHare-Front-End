import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import { Suspense } from "react";
import { SCDreamNormal } from "./fonts";

declare global {
  interface Window {
    Kakao: any;
  }
}

export const metadata = {
  title: "MeetHare 시계토끼",
  description: "클릭한번으로 약속의 모든 과정을 한번에",
  metadataBase: new URL("https://meethare.site"),
  themeColor: "#FFF",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`cx(sfPro.variable, inter.variable) ${SCDreamNormal.className}`}
      >
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pt-16">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
