"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FindNearStation() {
  // 유저 검색어를 저장할 상태 변수
  const [searchValue, setSearchValue] = useState("");
  // 서버에서 온 검색결과를 저장할 상태 변수
  // const [responseData, setResponseData] = useState<{ stationName: string }[] | null>(null);
  const [responseData, setResponseData] = useState<
    { stationName: string; longitude: number; latitude: number }[] | null
  >(null);

  const [selectedStation, setSelectedStation] = useState<{
    stationName: string;
    longitude: number;
    latitude: number;
  } | null>(null); // 클릭한 역 이름 상태 추가

  const [loading, setLoading] = useState(false);

  const router = useRouter(); // useRouter 훅 사용
  const searchParams = useSearchParams();

  // 검색 버튼을 클릭했을 때 호출될 이벤트 핸들러
  const handleSearchClick = () => {
    // URL 매개변수 생성
    const queryParams = new URLSearchParams();
    queryParams.append("stationName", searchValue);
    const queryString = queryParams.toString();
    setLoading(true);

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
      .catch((error) => {
        console.error("API 요청 에러:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStationClick = (
    stationName: string,
    longitude: number,
    latitude: number,
  ) => {
    setSelectedStation({ stationName, longitude, latitude });
  };

  return (
    <div className="z-10 flex w-full max-w-xl flex-col items-center justify-center px-5 xl:px-0">
      <a
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
      {/* {responseData && responseData.length > 0 && (
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
            )} */}
      {loading && (
        <>
          <div className="mt-4 flex grid w-36 place-items-center items-center justify-center rounded-md border border-gray-300">
            찾는 중....
          </div>
        </>
      )}
      {responseData && responseData.length > 0 && (
        <>
          <div className="z-10 flex w-full max-w-xl flex-col items-center justify-center px-5 xl:px-0">
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
          {/* <button>선택</button> */}
          <button
            type="button"
            className="mt-4 flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
            onClick={() => {
              if (!selectedStation) {
                alert("역을 선택해주세요");
                return;
              }
              let index = Number(searchParams.get("index"));
              let data = JSON.parse(searchParams.get("data") || "{}");
              data[index].latitude = selectedStation?.latitude;
              data[index].longitude = selectedStation?.longitude;
              data[index].stationName = selectedStation?.stationName;
              router.push(
                `/middlespot?data=${JSON.stringify(data)}&data=${data}`,
              );
            }}
          >
            선택
          </button>
        </>
      )}
    </div>
  );
}
