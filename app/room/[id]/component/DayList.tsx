"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  roomId: string;
  token: string;
  periodStart: string;
  periodEnd: string;
  master: string;
  totalNumber: number;
  submitNumber: number;
};

type datelist = {
  dateList: string[];
};

export default function Daylist({
  roomId,
  periodStart,
  periodEnd,
  token,
  master,
  totalNumber,
  submitNumber,
}: Props) {
  useEffect(() => {
    getAllImpossiTime();
  }, []);

  const [fixDate, setFixDate] = useState("");
  const [responseData, setResponseData] = useState<string[] | null>(null);
  const router = useRouter();

  const handleDateClick = (date: any) => {
    setFixDate(date.data);
  };

  const isMaster = () => {
    const base64Payload = token.substring(7).split(".")[1]; // value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
    const payload = Buffer.from(base64Payload, "base64");
    const result = JSON.parse(payload.toString());
    if (result.email === master) {
      return true;
    }

    return false;
  };

  const handleSendClick = async () => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/sendFixDate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            roomId: parseInt(roomId, 10),
            date: fixDate,
          }),
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("API 요청 실패");
          }
          window.location.reload();
        })
        .then((data) => {
          // 여기에서 API 응답 데이터를 처리
          console.log("API 응답 데이터:", data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllImpossiTime = async () => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/getallroomtime`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            roomId: parseInt(roomId, 10),
            periodStart: periodStart,
            periodEnd: periodEnd,
          }),
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("API 요청 실패");
          }
          return response.json();
        })
        .then((data) => {
          // 여기에서 API 응답 데이터를 처리
          console.log("API 응답 데이터:", data);
          setResponseData(data.dateList); // 전체 응답 데이터를 상태에 저장
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {responseData && responseData.length > 0 && (
        <>
          <div>
            {responseData.map((data, index) => (
              <input
                key={index}
                className="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-center text-gray-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                type="text"
                value={data}
                readOnly
                onClick={() => handleDateClick({ data })} // 클릭 이벤트 핸들러 추가
              />
            ))}
          </div>

          {isMaster() && (
            <button
              type="button"
              className="mt-4 flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
              onClick={() => {
                if (!fixDate) {
                  alert("날짜를 선택해주세요");
                  return;
                }
                handleSendClick();
              }}
            >
              선택
            </button>
          )}
        </>
      )}
    </div>
  );
}
