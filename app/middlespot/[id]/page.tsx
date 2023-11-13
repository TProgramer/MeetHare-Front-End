"use client";

import { Long_Cang } from "next/font/google";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useRoomInfoStore from "store/store";

export default function MiddleSpotRoom() {


  //현재 방의 myRoomName , memberList , roominfo 불러오기
  const myRoomName = useRoomInfoStore((state) => state.myRoomName);
  const memberList = useRoomInfoStore((state) => state.memberList);
  const roominfo = useRoomInfoStore((state) => state.roominfo);

  const router = useRouter();
  const [userLocations, setUserLocations] = useState(memberList);
  

  const handleFindLocationClick = () => {
    const newArray = userLocations.map((item) => ({
      userId: item.nickName,
      stationName: item.stationName,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
    console.log(JSON.stringify(newArray));
    // 사용자 위치 정보를 서버에 전달

    fetch(`${process.env.NEXT_PUBLIC_serverURL}/map/middlespot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ locations: userLocations }),
      body: JSON.stringify(newArray),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API 요청 실패");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("stationList", JSON.stringify(data));
        window.location.href = "/recommendMap";
      })
      .catch((error) => {
        console.error("API 요청 에러:", error);
      });
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      <div className="relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ">
        <div className="flex h-60 items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            <form>
              {userLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  className="mt-4 flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                >
                  {location.nickName} - {""}
                  {location.stationName ? location.stationName : "미정"}
                </button>
              ))}
              <button
                className="ml-3 pt-4 text-center"
                type="button"
                onClick={handleFindLocationClick}
              >
                <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
                  중간지점 찾기
                </h2>
              </button>
            </form>
          </div>
          <div className="flex h-60 items-center justify-center"></div>
        </div>
        <div className="mx-auto max-w-md text-center">
          <div className="prose-sm mt-3 leading-normal text-gray-500 [text-wrap:balance] md:prose">
            <p>
              유저아이디를 눌러 위치를 입력하고 <br />
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-800 underline transition-colors"
              >
                중간지점찾기
              </a>
              를 눌러 <br />
              약속장소를 정해보세요 <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
