"use client";
import { useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import RoomFrame from "./pagescomponent/roomFrame";
import { useRouter, usePathname } from "next/navigation";
import useRoomInfoStore from "../../../store/store";

export default function Room(props: any) {
  type user = {
    id: number;
    nickName: string;
    stationName: string;
    latitude: number;
    longitude: number;
    progress: string;
  };

  type specificRoomDTO = {
    memberList: user[];
    roomId: number;
    myProgress: number;
    roomProgress: string;
    submitNumber: number;
    myStartPoint: string; // 나의 약속 출발지
    fixCalendarList: string[]; // 나의 불가능한 날짜들
    fixDay: Date; // 고정약속날짜
    fixPlace: string; // 고정 약속 장소
    myRoomName: string;
    periodStart: string;
    periodEnd: string;
    roominfo: any;
  };

  const { setUserId, setMyRoomName, setMemberList, setRoomInfo } =
    useRoomInfoStore();

  const [jwtToken, setJwtToken] = useState("");
  const [fixCalendarDates, setFixCalendarDates] = useState<Date[]>([]);

  const [dataList, setDataList] = useState<specificRoomDTO | null>(null); // API에서 받은 데이터를 저장할 배열
  const router = useRouter();
  const pathname = usePathname();

  const parts = pathname.split("/");
  const roomUuid = parts[parts.length - 1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("Bearer");
        // 쿠키 삭제
        Cookies.remove("originpath");
        if (token) {
          setJwtToken(`Bearer ${token}`);
          await fetchDataWithToken(`Bearer ${token}`);
        } else {
          const currentUri = window.location.href;
          Cookies.set("originpath", currentUri, {
            damain: "meethare.site",
            path: "/",
          });
          alert("로그인 해주세요");
          location.href = `${process.env.NEXT_PUBLIC_serverURL}/oauth2/authorization/kakao`;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // jwtToken을 사용하여 API 호출 시 Authorization 헤더에 토큰을 설정
    if (dataList && dataList.fixCalendarList) {
      convertDateStringArrayToDateArray(dataList.fixCalendarList);
    }
  }, [dataList]);

  function convertDateStringArrayToDateArray(dateStrings: string[]) {
    setFixCalendarDates(dateStrings.map((dateString) => new Date(dateString)));
  }

  const fetchDataWithToken = async (token: string) => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/enter/${roomUuid}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        },
      );

      if (resp.status === 200) {
        // API에서 받은 데이터를 배열로 변환하여 상태로 설정
        const res = await resp.json();
        setDataList(res); // API에서 받은 데이터를 리스트로 저장

        if (res.roominfo.processivity === "RecommendStation") {
          setMyRoomName(res?.myRoomName);
          setMemberList(res?.memberList);
          setRoomInfo(res?.roominfo);
          setUserId(res?.userId);

          router.push(`/middlespot/${props.params.id}`);
        } else if (
          res.roominfo.processivity === "RecommendPlace" ||
          res.roominfo.processivity === "Fix"
        ) {
          setMyRoomName(res?.myRoomName);
          setMemberList(res?.memberList);
          setRoomInfo(res?.roominfo);
          setUserId(res?.userId);
          router.push(`/place/${res.fixStation}`);
        }
      } else if (resp.status === 204) {
        alert("잘못된 접근입니다.");
        router.push(`/`);
      } else {
        alert("입장할 수 없습니다.");
        router.push(`/`);
      }
    } catch (error) {
      router.push(`/`);
    }
  };

  return (
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      {dataList ? (
        <div className="w-full flex-col items-center">
          {" "}
          {/* Flexbox를 사용하여 요소들을 수직으로 배치 */}
          <RoomFrame
            roomdata={dataList}
            roomId={dataList.roominfo.roomId}
            token={jwtToken}
            fixCalendarDates={fixCalendarDates}
          />
        </div>
      ) : (
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
          <div>정보를 가져오고 있어요...</div>
        </div>
      )}
    </div>
  );
}
