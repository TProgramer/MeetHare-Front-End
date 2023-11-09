"use client";
import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { type } from "os";
import local from "./styles.module.css";
import RoomFrame from "./component/roomFrame";
import { useRouter, usePathname } from "next/navigation";
import useRoomInfoStore from "../../../store/store";

export default function Room(props: any) {
  type user = {
    id: number;
    nickName: string;
    stationName: string;
    latitude: number;
    longitude: number;
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

  const {
    myRoomName: roomName,
    setMyRoomName,
    setMemberList,
    setRoomInfo,
  } = useRoomInfoStore();

  // const roomName = useRoomInfoStore((state) => state.myRoomName);
  // const setMyRoomName = useRoomInfoStore((state) => state.setMyRoomName);
  // const setMemberList = useRoomInfoStore((state) => state.setMemberList);
  // const setRoomInfo = useRoomInfoStore((state) => state.setRoomInfo);

  const [jwtToken, setJwtToken] = useState("");
  const [fixCalendarDates, setFixCalendarDates] = useState<Date[]>([]);

  const [dataList, setDataList] = useState<specificRoomDTO | null>(null); // API에서 받은 데이터를 저장할 배열
  const router = useRouter();
  const pathname = usePathname();

  const parts = pathname.split("/");
  const roomUuid = parts[parts.length - 1];

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
          router.push(`/middlespot/${props.params.id}`);
        } else if (
          res.roominfo.processivity === "RecommendPlace" ||
          res.roominfo.processivity === "Fix"
        ) {
          setMyRoomName(res?.myRoomName);
          setMemberList(res?.memberList);
          setRoomInfo(res?.roominfo);
          router.push(`/place/${res.fixStation}`);
        }
      } else if (resp.status === 204) {
        console.log("204코드");
        alert("잘못된 접근입니다.");
        router.push(`/`);
      } else {
        console.log("else");
        alert("입장할 수 없습니다.");
        router.push(`/`);
      }
    } catch (error) {
      console.log(error);
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
        <div>데이터가 없습니다</div>
      )}
    </div>
  );
}