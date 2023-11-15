"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRoomInfoStore from "../../store/store";
import Cookies from "js-cookie";

export default function RecommendMap() {
  const [jwtToken, setJwtToken] = useState<any>();

  const [loading, setLoading] = useState(false);
  interface userInfo {
    latitude: number;
    longitude: number;
    transPath: string;
    userId: string;
    minTime: number;
    minPath: string;
  }

  interface Station {
    stationId: number;
    stationName: string;
    longitude: number;
    latitude: number;
    infraCount: number;
  }

  interface Recommend {
    station: Station;
    list: Array<userInfo>;
    averageTime: number;
  }

  const { roominfo } = useRoomInfoStore();

  const [stationNameList, setStationNameList] = useState<Recommend[]>([]);
  const router = useRouter(); // useRouter 훅 사용

  useEffect(() => {
    const token = Cookies.get("Bearer");
    // 쿠키 삭제
    Cookies.remove("originpath");
    if (token) {
      setJwtToken(`Bearer ${token}`);
    }

    const testFunction = () => {
      const stationList = localStorage.getItem("stationList");
      if (stationList != null) {
        const stationData = JSON.parse(stationList);
        for (var i = 0; i < stationData.length; i++) {
          var avg = 0;
          for (var j = 0; j < stationData[i].list.length; j++) {
            avg += stationData[i].list[j].minTime;
          }
          stationData[i].averageTime = Math.floor(
            avg / stationData[i].list.length,
          );
        }
        setStationNameList(stationData);
      }
    };

    testFunction();
  }, []);

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <div className="relative col-span-1 flex h-96 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ">
          <div className="my-7 flex flex-col items-center justify-center">
            <p className={` text-2xl`}>추천 장소 리스트</p>
          </div>
          {!loading && (
            <div className=" flex flex-col items-center justify-center">
              <table>
                <thead>
                  <tr className="text-sm">
                    <th className="w-1/3 pb-7">추천 역</th>
                    <th className="w-1/3 pb-7">평균 소요 시간(분)</th>
                    <th className="w-1/3 pb-7">주변 인프라</th>
                  </tr>
                </thead>
                <tbody>
                  {stationNameList?.length > 0 &&
                    jwtToken != undefined &&
                    stationNameList.map((data, index) => (
                      <tr
                        key={index}
                        className={` my-5 text-center text-lg hover:bg-purple-300 active:bg-purple-300`}
                        onClick={() => (
                          localStorage.setItem("station", JSON.stringify(data)),
                          setLoading(true),
                          fetch(
                            `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/setstation`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: jwtToken,
                              },
                              body: JSON.stringify({
                                roomId: roominfo.roomId,
                                station: data.station.stationId,
                              }),
                            },
                          )
                            .then((response) => {
                              // 처리가 필요한 경우 여기에 추가적인 로직을 구현할 수 있습니다.
                              if (!response.ok) {
                                throw new Error(
                                  `HTTP 오류! 상태 코드: ${response.status}`,
                                );
                              }

                              return;
                            })
                            .then(() => {
                              // fetch 요청이 완료된 후에 실행될 코드
                              router.push("/maps");
                            })
                            .catch((error) => {
                              console.error("API 요청 에러:", error);
                            })
                        )}
                      >
                        <td>{data.station.stationName}</td>
                        <td>{data.averageTime}</td>
                        <td>{data.station.infraCount}</td>
                      </tr>
                    ))}
                  {stationNameList?.length > 0 &&
                    jwtToken == undefined &&
                    stationNameList.map((data, index) => (
                      <tr
                        key={index}
                        className={` my-5 text-center text-lg hover:bg-purple-300 active:bg-purple-300`}
                        onClick={() => (
                          localStorage.setItem("station", JSON.stringify(data)),
                          setLoading(true),
                          router.push("/maps")
                        )}
                      >
                        <td>{data.station.stationName}</td>
                        <td>{data.averageTime}</td>
                        <td>{data.station.infraCount}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center">
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
              <div>이동 경로 그리는 중...</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
