"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  roomId: string;
  token: string;
  periodStart: string;
  periodEnd: string;
  master: string;
  totalNumber: number;
  submitNumber: number;
};

export default function Daylist({
  roomId,
  periodStart,
  periodEnd,
  token,
  master,
}: Props) {
  useEffect(() => {
    getAllImpossiTime();
  }, []);

  const [fixDate, setFixDate] = useState("");
  const [responseData, setResponseData] = useState<string[] | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(periodStart),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date(periodEnd));

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

  const maxEndDate = startDate
    ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;

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

  const handleRollBackClick = async () => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/rollback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            roomId: parseInt(roomId, 10),
            periodStart: startDate,
            periodEnd: endDate,
          }),
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("API 요청 실패");
          }
          window.location.reload();
        })
        .then(() => {
          // 여기에서 API 응답 데이터를 처리
        });
    } catch (error) {}
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
        .then(() => {
          // 여기에서 API 응답 데이터를 처리
        });
    } catch (error) {}
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
          setResponseData(data.dateList); // 전체 응답 데이터를 상태에 저장
        });
    } catch (error) {}
  };

  return (
    <div>
      {responseData && responseData.length > 0 ? (
        // 날짜 리스트가 존재하는 경우
        <>
          <div className="">
            {responseData.map((data, index) => (
              <input
                key={index}
                className="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-center text-gray-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                type="text"
                value={data}
                readOnly
                onClick={() => handleDateClick({ data })}
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
      ) : (
        // 날짜 리스트가 존재하지 않는 경우
        <div className="item-center justify-center text-center">
          <div>가능한 날짜가 존재하지 않습니다.</div>

          {isMaster() ? ( // 방장인 경우에만 추가 버튼을 표시
            <div className="">
              <div className="my-1 flex h-10 w-full items-center justify-center">
                <>기간 시작</>
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
                <>기간 종료</>
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
              <button
                type="button"
                className="mt-4 flex  justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                onClick={() => {
                  handleRollBackClick();
                }}
              >
                날짜 재설정 및 이전 페이지로 돌아가기
              </button>
            </div>
          ) : (
            // 방장이 아닌 경우에는 "방장만이 수정할 수 있습니다" 메시지를 표시
            <div className="text-center">방장만이 수정할 수 있습니다</div>
          )}
        </div>
      )}
    </div>
  );
}
