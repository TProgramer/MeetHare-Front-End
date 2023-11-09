"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Kakao: any;
  }
}

type Prop = {
  nickNameList: string;
};

export default function KakaoShareButton({ nickNameList }: Prop) {
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js";
    script.integrity =
      "sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    script.onload = () => {
      console.log("초기화");
      setIsLoaded(true);
    };
  }, []);

  const handleShareButton = () => {
    const { Kakao } = window;
    if (Kakao && isLoaded) {
      if (!window.Kakao.isInitialized()) {
        Kakao.init(`${process.env.NEXT_PUBLIC_KakaoJavaApi}`);
      }
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "우리 지금 만나🎵",
          description: `${nickNameList}와 함께 만나요`,
          imageUrl:
            "https://i.namu.wiki/i/6Wltl32pUBAnqaQkg-ow4diVQxSJFVnHZkKOrOjwvIvsghokdVbdphQD5obKTAiSJOPkToy2TKCB19rWjDGMPa73OVLTB3-vKwPZjJgc_5btjiZ-4WJvgvDlr6ZjqBxPSdw-RmVHdv9XzhUhvPJvIQ.webp",
          link: {
            mobileWebUrl: `https://meethare.site${pathname}`,
            webUrl: `https://meethare.site${pathname}`,
          },
        },
      });
    }
  };

  return (
    <div className=" flex w-10  items-center justify-self-end rounded font-bold">
      <button
        onClick={handleShareButton}
        value="Custom"
        className="w-10  rounded pt-1 font-bold"
      >
        <img src="/kakaoShare.png"></img>
      </button>
    </div>
  );
}
