"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NextForce from "./nextForce";
import KakaoShare from "./KakaoShare";

type user = {
  id: number;
  nickName: string;
  stationName: string;
  latitude: number;
  longitude: number;
};

type Props = {
  fixCalendarDates: Date[];
  periodStart: Date;
  periodEnd: Date;
  token: string;
  roomId: string;
  totalNumber: number;
  submitNumber: number;
  memberList: user[];
};

export default function CalendarComponent({
  fixCalendarDates,
  periodStart,
  periodEnd,
  token,
  roomId,
  totalNumber,
  submitNumber,
  memberList,
}: Props) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  useEffect(() => {
    const start = new Date(periodStart);
    start.setDate(start.getDate() - 1);
    setStartDate(start);
  }, []);

  const nickNameList = memberList.map((user) => user.nickName);

  const formattedString = nickNameList.join(" , ");

  const [selectedDates, setSelectedDates] = useState<Date[]>(fixCalendarDates); // 초기 선택 날짜를 사용자가 제공한 날짜로 설정
  useEffect(() => {
    // 클라이언트 측에서 "jwtToken" 키의 쿠키를 가져오기
    if (true) {
      setSelectedDates(fixCalendarDates); // 토큰을 상태로 설정
    }
  }, []);

  const [deletedDates, setDeletedDates] = useState<Date[]>([]);
  const [addedDates, setAddedDates] = useState<Date[]>([]);

  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  const handleDateChange = (value: any) => {
    const date = new Date(value);
    // 클릭한 날짜가 이미 선택된 날짜인지 확인
    const isDateSelected = selectedDates.some((selectedDate) =>
      isSameDay(selectedDate, date),
    );

    if (isDateSelected) {
      // 여기가 선택 해제를 위한 삭제

      // 선택이 해제된 날짜인 경우, 해당 날짜를 selectedDates 배열에서 제거
      const updatedSelectedDates = selectedDates.filter(
        (selectedDate) => !isSameDay(selectedDate, date),
      );
      setSelectedDates(updatedSelectedDates);

      // fix에 존재한다면 delete추가   아니면 add 삭제
      if (fixCalendarDates.some((fixDate) => isSameDay(fixDate, date))) {
        setDeletedDates([...deletedDates, date]);
        // 수정된 날짜 배열을 부모 컴포넌트로 전달하려면 적절한 콜백 함수를 부모 컴포넌트에서 호출해야 합니다.
      } else {
        const updatedAddedDates = addedDates.filter(
          (fixDate) => !isSameDay(fixDate, date),
        );

        setAddedDates(updatedAddedDates);
      }
    }

    //새롭게 추가하는 경우
    else {
      // 선택이 해제되지 않은 날짜인 경우, 해당 날짜를 선택된 날짜 배열에 추가
      setSelectedDates([...selectedDates, date]);

      //fix에 존재한다면 delete삭제   아니면 add추가
      if (fixCalendarDates.some((fixDate) => isSameDay(fixDate, date))) {
        const updatedDeletedDates = deletedDates.filter(
          (deleteDate) => !isSameDay(deleteDate, date),
        );

        setDeletedDates(updatedDeletedDates);
      } else {
        setAddedDates([...addedDates, date]);
      }
    }
  };

  //날짜를 1일 더해서 보내기 위해서
  const subtractOneDayFromDates = (dates: any) => {
    return dates.map((date: any) => {
      const modifiedDate = new Date(date);
      modifiedDate.setDate(modifiedDate.getDate() + 1);
      return modifiedDate;
    });
  };

  const handleSubmit = () => {
    // 여기에서 fetch 요청을 보내세요.
    // 예를 들어, 서버의 API 엔드포인트를 지정하고 데이터를 전송하는 방식으로 요청을 보낼 수 있습니다.

    const modifiedAddedDates = subtractOneDayFromDates(addedDates);
    const modifiedDeletedDates = subtractOneDayFromDates(deletedDates);

    fetch(`${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/submittime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        roomId: parseInt(roomId, 10),
        addDayList: modifiedAddedDates,
        deleteDayList: modifiedDeletedDates,
      }),
    })
      .then((resp) => {
        // 성공 또는 오류 처리를 수행하세요.
        if (resp.status === 200) {
          alert("날짜를 갱신합니다");
          window.location.reload();
        }
      })
      .catch(() => {});
  };

  return (
    <div className="flex-column w-full items-center justify-center">
      <NextForce
        token={token}
        roomId={roomId}
        totalNumber={totalNumber}
        submitNumber={submitNumber}
      />
      <div className="mt-1 h-8 text-center">불가능한 날짜를 제출해주세요</div>
      <div className=" flex  w-full justify-center">
        <Calendar
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
          className=" w-full  items-center rounded-md text-center"
          onChange={handleDateChange}
          value={new Date()} // 달력에는 선택된 날짜 배열을 표시
          tileContent={({ date, view }) => {
            if (view === "month") {
              const isDateSelected = selectedDates.some((selectedDate) =>
                isSameDay(selectedDate, date),
              );

              // 초기 값인 fixCalendarDates 중에서 현재 날짜가 선택된 날짜인지 확인
              const isInitialDateSelected = fixCalendarDates.some(
                (initialDate) => isSameDay(initialDate, date),
              );

              const isdeletedSelected = deletedDates.some((deleteDate) =>
                isSameDay(deleteDate, date),
              );

              return isDateSelected ||
                (isInitialDateSelected && !isdeletedSelected) ? (
                <div className="redText">❌</div>
              ) : null;
            }
          }}
          tileDisabled={({ date }) => {
            // 선택 가능한 범위 밖의 날짜를 비활성화
            return !(date >= startDate && date <= periodEnd);
          }}
        />
      </div>
      {/* 나머지 부분은 동일하게 유지 */}

      <div className="flex justify-around">
        <div></div>
        <button
          onClick={handleSubmit}
          className="mt-2 rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white "
        >
          제출
        </button>
        <KakaoShare nickNameList={formattedString} />
      </div>
    </div>
  );
}
