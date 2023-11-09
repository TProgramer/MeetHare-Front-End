"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from "./navbar";

export default function Nav() {
  // jwtToken 변수를 useState로 선언하여 컴포넌트 상태로 사용
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    // 클라이언트 측에서 "jwtToken" 키의 쿠키를 가져오기
    const token = Cookies.get('Bearer');

    if (token) {
      setJwtToken(`Bearer ${token}`); // 토큰을 상태로 설정
    }
    

  }, []);

  
  return <Navbar token={jwtToken} />;
}