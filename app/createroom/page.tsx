"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [category, setCategory] = useState("restaurant"); // 초기 카테고리 설정
  const [jwtToken, setJwtToken] = useState("");
  const [isRequestSuccess, setIsRequestSuccess] = useState(false); // 요청 성공 상태 추가
  const router = useRouter();

  useEffect(() => {
    // 클라이언트 측에서 "jwtToken" 키의 쿠키를 가져오기
    const token = Cookies.get("Bearer");

    if (token) {
      setJwtToken(`Bearer ${token}`); // 토큰을 상태로 설정
    }
  }, []);

  const handleRoomNameChange = (event: any) => {
    setRoomName(event.target.value);
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);

    // 기간 시작이 변경되면 기간 종료의 최소 날짜를 설정
    if (date) {
      setEndDate(null); // 기간 시작이 변경되면 기간 종료를 초기화
    }
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (jwtToken === "") {
      alert("로그인 하십시오");
      router.push("/");
    }

    // 방 제목, 기간 시작, 기간 종료를 확인
    if (!roomName || !startDate || !endDate) {
      alert("방 제목, 기간 시작, 기간 종료를 모두 입력해주세요.");
      return;
    }

    if (endDate <= startDate) {
      alert("기간 종료는 기간 시작 이후여야 합니다.");
      return;
    }

    // 여기는 백이랑 스프링이랑 달라서...
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    // 서버로 데이터를 전송
    const requestData = {
      roomName,
      start,
      end,
      category, // 선택한 카테고리
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room`,
        {
          method: "POST", // 또는 다른 HTTP 메소드를 사용하세요.
          headers: {
            "Content-Type": "application/json",
            Authorization: jwtToken, // jwtToken을 헤더에 추가
          },
          body: JSON.stringify(requestData),
        },
      );
      if (response.ok) {
        const roomId = await response.text();
        // 서버 응답이 성공인 경우 처리
        router.push(`/room/${roomId}`);

        alert("방이 성공적으로 생성되었습니다.");
        // 입력항목 초기화
        setRoomName("");
        setStartDate(null);
        setEndDate(null);
        setCategory("restaurant");
        setIsRequestSuccess(true);
      } else {
        // 서버 응답이 실패인 경우 처리
        alert("방 생성 중 오류가 발생했습니다.");
        setIsRequestSuccess(false);
      }
    } catch (error) {
      router.push("/");
      setIsRequestSuccess(false);
    }
  };

  const maxEndDate = startDate
    ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="z-10 w-full max-w-xl rounded-xl border  border-gray-200 bg-white px-5 shadow-md xl:px-0">
      <div className="flex h-10 items-center justify-center"></div>
      <div className="flex">
        <img
          src="/question-logo.png"
          alt="question-logo"
          style={{ width: "20px", height: "20px" }}
        />
        <div className="mx-2 text-sm">
          <p className="font-bold">기간이 무엇을 의미하는지 아시나요?</p>
          <p className="font-bold">
            바로, 약속 가능한 날짜의 기간을 의미한답니다!
          </p>
          <p className="mt-1 text-xs">
            만약 1월 1일부터 1월 5일 중 약속을 가지고 싶다면 &apos;기간
            시작&apos;에 1월 1일을, &apos;기간 종료&apos;에 1월 5일을 입력하면
            된답니다!
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-md text-center">
        <h2 className="mt-4 bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal"></h2>
        <form onSubmit={handleSubmit}>
          <div className="my-1 flex h-10 items-center justify-center">
            <input
              type="text"
              placeholder="방 제목"
              value={roomName}
              onChange={handleRoomNameChange}
              className="my-2 w-full rounded-md border px-4 py-2 text-center"
            />
          </div>

          <div className="flex h-2"></div>

          <div className="my-1 flex h-10 items-center justify-center">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="my-2 w-full rounded-md border px-4 py-2 text-center"
            >
              <option value="restaurant">음식점</option>
              <option value="study">공부</option>
              <option value="activity">액티비티</option>
              <option value="culture">관람</option>
            </select>
          </div>

          <div className="flex h-2"></div>

          <div className="my-1 flex h-10 w-full items-center justify-center">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="기간 시작"
              minDate={new Date()} // 오늘부터
              dateFormat="yyyy-MM-dd"
              className="my-2 w-full rounded-md border px-20 py-2 text-center"
            />
          </div>

          <div className="flex h-2"></div>

          <div className="my-1 flex h-10 items-center justify-center">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="기간 종료"
              dateFormat="yyyy-MM-dd"
              minDate={startDate} // 기간 시작 이후의 날짜만 선택 가능
              maxDate={maxEndDate} // endDate의 최대값을 startDate + 30일로 설정
              className="my-2 w-full rounded-md border px-20 py-2 text-center"
            />
          </div>

          <div className="flex h-2"></div>

          <div className="flex h-10 items-center justify-center">
            <button
              type="submit"
              className="rounded-md px-4 py-2 text-white"
              style={{ backgroundColor: "#9381FF" }}
            >
              방 생성
            </button>
          </div>
        </form>
        {isRequestSuccess && (
          <div className="mt-4 text-green-500">
            요청이 성공적으로 완료되었습니다.
          </div>
        )}
      </div>
      <div className="flex h-10 items-center justify-center"></div>
    </div>
  );
}
