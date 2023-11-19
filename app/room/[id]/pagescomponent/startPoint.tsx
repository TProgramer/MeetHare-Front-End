"use client";
import { useState } from "react";

type Props = {
  roomId: string;
  token: string;
  totalNumber: number;
  submitNumber: number;
};

export default function StartPoint({ roomId, token }: Props) {
  // 유저 검색어를 저장할 상태 변수
  const [searchValue, setSearchValue] = useState("");
  // 서버에서 온 검색결과를 저장할 상태 변수

  const [responseData, setResponseData] = useState<
    { stationName: string; longitude: number; latitude: number }[] | null
  >(null);

  const [selectedStation, setSelectedStation] = useState<{
    stationName: string;
    longitude: number;
    latitude: number;
  } | null>(null); // 클릭한 역 이름 상태 추가

  // 검색 버튼을 클릭했을 때 호출될 이벤트 핸들러
  const handleSearchClick = () => {
    // URL 매개변수 생성
    const queryParams = new URLSearchParams();
    queryParams.append("stationName", searchValue);
    const queryString = queryParams.toString();

    // GET 요청 보내기
    fetch(`${process.env.NEXT_PUBLIC_serverURL}/map/myStation?${queryString}`, {
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
        setResponseData(data); // 전체 응답 데이터를 상태에 저장
      })
      .catch((error) => {});
  };

  //제출버튼
  const handleNextClick = (
    Name: string,
    longitude: number,
    latitude: number,
  ) => {
    fetch(
      `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/changestartpoint`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          roomId: parseInt(roomId, 10),
          startPoint: Name,
          longitude: longitude,
          latitude: latitude,
        }),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("API 요청 실패");
        }
        alert(`${Name}이 선택되었습니다.`);
        window.location.reload();
        return response;
      })

      .catch((error) => {});
  };

  const handleStationClick = (
    stationName: string,
    longitude: number,
    latitude: number,
  ) => {
    setSelectedStation({ stationName, longitude, latitude });
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      <p className="pt-4 text-center text-sm font-semibold text-[#1d9bf0]">
        출발역을 검색하세요
      </p>

      <div className="flex justify-center">
        <button className="mr-4 mt-3 text-white">
          찾기
        </button>
        <input
          className="mt-4 flex w-60 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSearchClick();
          }}
        />
        <button className="ml-4 mt-3" onClick={handleSearchClick}>
          찾기
        </button>
      </div>

      {responseData && responseData.length > 0 && (
        <>
          <div className="z-10 w-full max-w-xl px-5 xl:px-0 flex flex-wrap justify-center">
            {responseData.map((data, index) => (
              <input
                key={index}
                className="mt-4 flex w-60 items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-center text-gray-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                type="text"
                value={data.stationName}
                readOnly
                onClick={() =>
                  handleStationClick(
                    data.stationName,
                    data.longitude,
                    data.latitude,
                  )
                } // 클릭 이벤트 핸들러 추가
              />
            ))}
          </div>
          <div className="flex justify-end">
          <button
            type="button"
            className="mt-4 flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
            onClick={() => {
              if (!selectedStation) {
                alert("역을 선택해주세요");
                return;
              }

              handleNextClick(
                selectedStation?.stationName,
                selectedStation?.longitude,
                selectedStation?.latitude,
              );
            }}
          >
            선택
          </button>
          </div>
        </>
      )}
    </div>
  );
}
