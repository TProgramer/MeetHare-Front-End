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

    if (token) {
      setJwtToken(`Bearer ${token}`); // 토큰을 상태로 설정
    }
  }, []);

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
