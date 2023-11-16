"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "./navbar";
import { useRouter } from "next/navigation";

export default function Nav() {
  // jwtToken 변수를 useState로 선언하여 컴포넌트 상태로 사용
  const [jwtToken, setJwtToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 클라이언트 측에서 "jwtToken" 키의 쿠키를 가져오기
    const token = Cookies.get("Bearer");

    if (token) setJwtToken(`Bearer ${token}`); // 토큰을 상태로 설정
    else {
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImV4cCI6MTcwMDkwNTY1OCwiZW1haWwiOiI4ZWQzNmU4Yi1mZTA4LTQ5NzctYWUwNi1hOWU0NWNkZTEzOGNAc29jaWFsVXNlci5jb20ifQ.X1TZLCUlcow_cE1HlUBAUUfHGti8AGoP2OeKHPkJDdeLoNjETH3LgBKKViX5hMN1sPzZT61bAwvfeTZUDw_u2A";
      Cookies.set("Bearer", token, {
        damain: "localhost:3000",
        path: "/",
      });
      setJwtToken(`Bearer Bearer ${token}`);
    }

    if (token === undefined) return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then(function (sub) {
        // check if subscription is already exist
        if (sub) {
          // send subscription to server to be saved
          // parse string version of the json to get the expected object structure
        }
        // check if subscription is not exist and the process is for initial generation
        // if (!sub && !onlyRefreshToken) {
        else if (jwtToken !== "") {
          // ask for permission
          Notification.requestPermission();

          //generate subscription object
          reg.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            })
            .then(function (subscribe) {
              // send subscription to server to be saved
              // parse string version of the json to get the expected object structure
              const res = fetch(
                `${process.env.NEXT_PUBLIC_serverURL}/webpush`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                  body: JSON.stringify(subscribe),
                },
              );
              // 구독 취소
              // const unsubscribed = await subscription.unsubscribe();
            })
            .catch((e) => {
              console.error(e);
            });
        }
      });
    });
  }, [jwtToken]);

  useEffect(() => {
    // 쿠키 읽기
    const originPathCookie = Cookies.get("originpath");

    // 쿠키가 존재하면 처리
    if (originPathCookie) {
      // 쿠키 값으로 리디렉션
      router.push(originPathCookie);
    }
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return <Navbar token={jwtToken} />;
}
