"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Card from "./card";
import { useRouter } from "next/navigation";

export default function Findmyroom() {
  type RoomListDTO = {
    uuid: string;
    roomName: string;
  };
  const [dataList, setDataList] = useState<RoomListDTO[]>([]); // API에서 받은 데이터를 저장할 배열
  const [jwtToken, setJwtToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 클라이언트 측에서 "jwtToken" 키의 쿠키를 가져오기
    const token = Cookies.get("Bearer");

    if (token) {
      setJwtToken(`Bearer ${token}`); // 토큰을 상태로 설정
    } else {
      alert("로그인 해주세요");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    // jwtToken을 사용하여 API 호출 시 Authorization 헤더에 토큰을 설정
    if (jwtToken) {
      fetchDataWithToken(jwtToken);
    }
  }, [jwtToken]);

  const fetchDataWithToken = async (token: string) => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/findmyroom/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );

      if (resp.ok) {
        // API에서 받은 데이터를 배열로 변환하여 상태로 설정
        const data = await resp.json();
        setDataList(data); // API에서 받은 데이터를 리스트로 저장
      } else {
        Cookies.remove("Bearer", { path: "/" });
        window.location.href = "/";
      }
    } catch (error) {
      //여기서 캐시를 지우던가 리프레시 토큰을 주도록 해야 겠다.
    }
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 md:grid-cols-1 xl:px-0">
        {dataList.map((item, index) => (
          <Link href={`/room/${item.uuid}`} key={index}>
            <div className="flex h-full w-full justify-center p-2">
              <Card title={item.roomName} roomId={item.uuid} token={jwtToken} />
            </div>
          </Link>
        ))}
      </div>
      {/* 원형 모양의 방 생성 버튼 */}
      <div
        style={{
          position: "fixed",
          cursor: "pointer",
          width: "60px",
          height: "60px",
          borderRadius: "50%", // 원형으로 만들기 위한 속성
          backgroundColor: "white", // 배경색 설정
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bottom: "50px",
          right: "50px",
        }}
      >
        <Link href="/createroom">
          {" "}
          {/* create-room 경로는 방 생성 페이지로 대체해야 합니다. */}
          <div style={{ color: "blue", fontSize: "24px", fontWeight: "bold" }}>
            +
          </div>
        </Link>
      </div>
    </div>
  );
}
