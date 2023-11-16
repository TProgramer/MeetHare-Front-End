"use client";
import { useState } from "react";

type Props = {
  totalNumber: number;
  roomId: string;
  token: string;
  submitNumber: number;
};

export default function NextForce({
  token,
  roomId,
  totalNumber,
  submitNumber,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    // 데이터를 가져오기 전에 로딩 상태를 활성화

    if (totalNumber <= 1) {
      alert("2명 이상 참가해야 합니다");
      window.location.reload();
      return;
    }

    if (submitNumber !== totalNumber) {
      const confirmAction = window.confirm(
        "참여자들이 모두 제출하지 않았습니다. 그래도 진행하시겠습니까?",
      );

      if (!confirmAction) {
        // 사용자가 확인을 누르지 않으면 아무 작업도 수행하지 않음
        setIsLoading(false); // 로딩 상태 비활성화
        return;
      }
    }

    const confirmAction = window.confirm(
      "모두가 참여 가능한 날짜를 받으시겠어요??",
    );

    if (!confirmAction) {
      // 사용자가 확인을 누르지 않으면 아무 작업도 수행하지 않음
      setIsLoading(false); // 로딩 상태 비활성화
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/nextforce`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ roomId: roomId }),
        },
      );
      if ((await resp).status == 200) {
        //위의 조건이 맞는지 확인 필요ㅠ +
        //여기다가 새로고침 하도록 추가
        window.location.reload();
      }
    } catch (error) {
      // 데이터 가져오기 실패 시 에러 처리
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={fetchData} // 버튼 클릭 시 fetchData 함수 호출
        disabled={isLoading} // 데이터를 로딩 중일 때 버튼 비활성화
        className="rounded bg-blue-500 p-4 px-4 py-2 font-bold text-white  "
      >
        {isLoading
          ? "로딩 중..."
          : `참여자들이 모두 제출하였나요? ${submitNumber}/${totalNumber}`}
      </button>
    </div>
  );
}
