"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function FindNearStation() {
    // 유저 검색어를 저장할 상태 변수
    const [searchValue, setSearchValue] = useState("");
    // 서버에서 온 검색결과를 저장할 상태 변수
    const [responseData, setResponseData] = useState<{ stationName: string }[] | null>(null);

    // 검색 버튼을 클릭했을 때 호출될 이벤트 핸들러
    const handleSearchClick = () => {
        console.log("검색어:", searchValue);
        // URL 매개변수 생성
        const queryParams = new URLSearchParams();
        queryParams.append("stationName", searchValue);
        const queryString = queryParams.toString();

        // GET 요청 보내기
        fetch(`http://localhost:8080/map/myStation?${queryString}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("API 요청 실패");
                }
                return response.json();
            })
            .then((data) => {
                // 여기에서 API 응답 데이터를 처리
                console.log("API 응답 데이터:", data);
                setResponseData(data); // 전체 응답 데이터를 상태에 저장

            })
            .catch((error) => {
                console.error("API 요청 에러:", error);
            });
    };
    return (
        <div className="z-10 w-full max-w-xl px-5 xl:px-0">
            <a
                href="https://twitter.com/steventey/status/1613928948915920896"
                target="_blank"
                rel="noreferrer"
                className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
            >
                <p className="text-sm font-semibold text-[#1d9bf0]">
                    출발역을 검색하세요
                </p>
            </a>
            <div className="flex">
                <input
                    className="flex w-60 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100 text-blue-800 text-center mt-4"
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="ml-4 mt-3" onClick={handleSearchClick}>
                    찾기
                </button>
            </div>
            {responseData && responseData.length > 0 && (
                  <>
                <div className="z-10 w-full max-w-xl px-5 xl:px-0"> 
                    {responseData.map((data, index) => (
                        <input
                            key={index}
                            className="flex w-60 items-center bg-gray-100 justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100 text-gray-800 text-center mt-4"
                            type="text"
                            value={data.stationName}
                            readOnly
                        />
                    ))}
                </div>
                <div>선택</div>
                </>
            )}
        </div>
    );
}