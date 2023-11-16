"use client";
import React from "react";
import Calendar from "./Calendar";
import StartPoint from "./startPoint";
import DayList from "./DayList";
import Members from "./MembersModal";
import NotSubmitMembers from "./NotSubmitMembersModal";
import Final from "./Final";

type user = {
  id: number;
  nickName: string;
  stationName: string;
  latitude: number;
  longitude: number;
  progress: string;
};

type SpecificRoomDTO = {
  myRoomName: string;
  memberList: user[];
  roominfo: {
    category: string;
    processivity: string;
    fixDay: [];
    fixPlace: number;
    fixStation: number;
    submitNumber: number;
    number: number;
    periodStart: string;
    periodEnd: string;
    master: string;
  };
};
type Props = {
  roomdata: SpecificRoomDTO;
  roomId: string;
  token: string;
  fixCalendarDates: Date[];
};

export default function RoomFrame({
  roomdata,
  roomId,
  token,
  fixCalendarDates,
}: Props) {
  return (
    <div
      className={`h-150 z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white px-5 shadow-md xl:px-0`}
    >
      <div className="flex justify-between">
        <div className="flex pt-4 text-sm font-bold">
          <Members
            userlist={roomdata.memberList.map((user) => user.nickName)}
          />
        </div>
        <div className="flex pt-4 text-2xl font-bold">
          {roomdata.myRoomName}
        </div>
        <div className="pt-4 align-middle text-xl font-bold">
          <NotSubmitMembers
            submitNumber={roomdata.roominfo.submitNumber}
            totalNumber={roomdata.roominfo.number}
            userlist={roomdata.memberList.map((user) => ({
              nickName: user.nickName,
              progress: user.progress,
            }))}
            roomProgress={roomdata.roominfo.processivity}
          />
        </div>
      </div>

      <div className="flex h-2"></div>

      <div className="flex w-full justify-center">
        {roomdata.roominfo.processivity === "InSubmission" ? (
          <Calendar
            token={token}
            fixCalendarDates={fixCalendarDates}
            periodStart={new Date(roomdata.roominfo.periodStart)}
            periodEnd={new Date(roomdata.roominfo.periodEnd)}
            roomId={roomId}
            totalNumber={roomdata.roominfo.number}
            submitNumber={roomdata.roominfo.submitNumber}
            memberList={roomdata.memberList}
            master={roomdata.roominfo.master}
          />
        ) : roomdata.roominfo.processivity === "RecommendDay" ? (
          <DayList
            token={token}
            periodStart={roomdata.roominfo.periodStart}
            periodEnd={roomdata.roominfo.periodEnd}
            roomId={roomId}
            master={roomdata.roominfo.master}
            totalNumber={roomdata.roominfo.number}
            submitNumber={roomdata.roominfo.submitNumber}
          />
        ) : roomdata.roominfo.processivity === "SubmitStation" ? (
          <StartPoint
            roomId={roomId}
            token={token}
            totalNumber={roomdata.roominfo.number}
            submitNumber={roomdata.roominfo.submitNumber}
          />
        ) : roomdata.roominfo.processivity === "Fix" ? (
          <Final
            roomId={roomId}
            token={token}
            memberList={roomdata.memberList}
            stationId={roomdata.roominfo.fixStation}
          />
        ) : null}
      </div>
      <div className="flex h-10"></div>
    </div>
  );
}
