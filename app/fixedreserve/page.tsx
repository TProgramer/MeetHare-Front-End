"use client";

import { useEffect, useState } from "react";
import useRoomInfoStore from "store/store";
import Final from "../room/[id]/pagescomponent/Final";

export default function FiexedReserve() {
  const roominfo = useRoomInfoStore((state) => state.roominfo);
  const myRoomName = useRoomInfoStore((state) => state.myRoomName);
  const memberList = useRoomInfoStore((state) => state.memberList);

  const [roominfos, setRoomInfos] = useState<room>({
    category: "",
    processivity: "",
    fixDay: [],
    fixPlace: "",
    fixStation: 0,
    submitNumber: 0,
    roomId: 0,
    number: 0,
    periodStart: "",
    periodEnd: "",
    master: "",
  });
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState<member[]>([]);

  type member = {
    id: number;
    nickName: string;
    stationName: string;
    latitude: number;
    longitude: number;
  };

  type room = {
    category: string;
    processivity: string;
    fixDay: any[];
    fixPlace: string;
    fixStation: number;
    submitNumber: number;
    number: number;
    periodStart: string;
    periodEnd: string;
    master: string;
    roomId: number;
  };

  useEffect(() => {
    setRoomInfos(roominfo);
    setRoomName(myRoomName);
    setMembers(memberList);
  }, []);

  return (
    <div className="z-10 w-full max-w-xl break-keep px-5 xl:px-0">
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 break-keep px-5 md:grid-cols-3 xl:px-0">
        <div className="w-full overflow-auto md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
          <div className="flex flex-col justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
            <h1 className="font-display text-2xl font-bold">{roomName}</h1>
            <br />
            <h2 className="mr-5 flex flex-col justify-center text-left text-sm font-bold text-gray-600">
              ⏰ 모임 시간
            </h2>
            <br />
            {roominfos.fixDay[0]}년 {roominfos.fixDay[1]}월{" "}
            {roominfos.fixDay[2]}일
            <br />
            <br />
            <h2 className="mr-5 flex flex-col justify-center text-left text-sm font-bold text-gray-600">
              🏁 모임 장소
            </h2>
            <br />
            {roominfos.fixPlace}
            <br />
            <br />
            <h2 className="mr-5 flex flex-col justify-center text-left text-sm font-bold text-gray-600">
              👨‍👩‍👧‍👦 모이는 사람들
            </h2>
            <br />
            {members.map((member: any) => member.nickName + " ")}
            <br />
            <br />
            <h2 className="mr-5 flex flex-col justify-center text-left text-sm font-bold text-gray-600">
              🚉 가는길
            </h2>
            <br />
            <Final memberList={members} roomInfo={roominfos}></Final>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
