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
  const [loading, setLoading] = useState(false);

  const handleFindLocationClick = () => {
    const newArray = userLocations.map((item) => ({
      userId: item.nickName,
      stationName: item.stationName,
      latitude: item.latitude,
      longitude: item.longitude,
    }));

    setLoading(true);

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
        console.log(data);
        localStorage.setItem("stationList", JSON.stringify(data));
        window.location.href = "/recommendMap";
      })
      .catch((error) => {
        console.error("API 요청 에러:", error);
      });
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      {!loading && (
        <div className="relative col-span-1 flex h-96 flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          <div className="flex h-60 items-center justify-center">
            <div className="relative flex h-full w-full flex-col items-center justify-center">
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
      )}
      {loading && (
        <div className="relative col-span-1 flex h-96 flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          <svg
            aria-hidden="true"
            className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <br />
          <div>적절한 중간 지점 찾는 중...</div>
        </div>
      )}
    </div>
  );
}
