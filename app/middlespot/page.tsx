"use client";

import Link from "next/link";
import { useState } from "react";


export default function MiddleSpot() {
  const [userLocations, setUserLocations] = useState([
    { latitude: 37.4979, longitude: 127.0276, userId: "일채영" },
    { latitude: 37.5594, longitude: 126.9436, userId: "이채영" },
    { latitude: 37.5462, longitude: 127.0575, userId: "삼채영" }
  ]);
  // setUserLocations(prev => [...prev, userId : "일채영"])
  // 버튼 클릭 시 사용자 위치 정보를 콘솔에 출력 
  const handleFindLocationClick = () => {
    userLocations.forEach((location, index) => {
      console.log(`사용자 위치: ${location.userId}, 위도: ${location.latitude}, 경도: ${location.longitude}`);
      console.log(JSON.stringify(userLocations));
    });
 // 사용자 위치 정보를 서버에 전달
 fetch("http://localhost:8080/map/middlespot", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  // body: JSON.stringify({ locations: userLocations }),
  body: JSON.stringify(userLocations),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("API 요청 실패");
    }
    console.log('response', response)
    // return response.json();
  })
  .then((data) => {
    console.log("API 응답 데이터:", data);
    // 여기에서 API 응답 데이터를 처리
  })
  .catch((error) => {
    console.error("API 요청 에러:", error);
  });
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      <div className="relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ">
        <div className="flex h-60 items-center justify-center">
          <div className="relative h-full w-full flex items-center justify-center">
            <form>
              {userLocations.map((location, index) => ( 
                // <input 
                //   key={index}
                //   className="flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100 text-blue-800 text-center mt-4"
                //   // type="text" 
                //   type="button"
                //   value={location.userId}
                //   readOnly
                // />
                <Link className="flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100 text-blue-800 text-center mt-4" 
                key={index}
                href="/findnearstation">{location.userId} 위치</Link>  
              ))}
              <button className="text-center pt-4 ml-3" type="button" onClick={handleFindLocationClick}>
                <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
                  중간지점 찾기
                </h2>
              </button>
            </form>

          </div>
          {/* <div className="relative h-full w-full">
               <svg className="absolute inset-0 m-auto" viewBox="0 0 100 100" width="100" height="100">
             
               <circle stroke-width="7" stroke-dasharray="1px 1px" stroke-linecap="round" transform="rotate(-90 50 50)" cx="50" cy="50" r="45" fill="#DCFCE7" stroke="#22C55E" pathLength="1" stroke-dashoffset="0px"></circle> 
                </svg>
                <p className="absolute inset-0 mx-auto flex items-center justify-center font-display text-5xl text-green-500">100</p>
                </div> */}
          <div className="flex h-60 items-center justify-center">
          </div>
        </div>
        <div className="mx-auto max-w-md text-center"> 
          <div className="prose-sm mt-3 leading-normal text-gray-500 [text-wrap:balance] md:prose">
            <p>유저아이디를 눌러 위치를 입력하고  <br/>
              <a target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 underline transition-colors">
                중간지점찾기
              </a>
              를 눌러 <br />약속장소를 정해보세요 <br />
              {/* <code inline="true" class="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800">@next/font</code> and <code inline="true" class="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800">next/image
              </code> for stellar performance. */}
            </p>
          </div>
        </div>
      </div>


      {/* <button className="flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
        <p className="text-gray-600">Modal</p>
      </button> */}
    </div>
  )
}