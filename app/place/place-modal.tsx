"use client";
import Modal from "@/app/place/util/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import useRoomInfoStore from "../../store/store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface PlaceDetailDTO {
  place_num: number;
  place_name: string;
  place_grade: number;
  place_address: string;
  place_time: string[];
  place_detail: string;
  place_img_url: string;
}

const PlaceModal = ({
  showPlaceModal,
  setShowPlaceModal,
  modalData,
}: {
  showPlaceModal: boolean;
  setShowPlaceModal: Dispatch<SetStateAction<boolean>>;
  modalData: PlaceDetailDTO | null;
  setModalData: Dispatch<SetStateAction<PlaceDetailDTO | null>>;
}) => {
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  let roomId = useRoomInfoStore((state: any) => state.roominfo.roomId);
  let master = useRoomInfoStore((state: any) => state.roominfo.master);
  let { setFixPlace } = useRoomInfoStore();

  let removeToast: NodeJS.Timeout;
  function toast(text: string) {
    const toast = document.getElementById("toast");

    if (toast) {
      toast.classList.contains("reveal")
        ? (clearTimeout(removeToast),
          (removeToast = setTimeout(function () {
            toast.classList.remove("reveal");
          }, 1000)))
        : (removeToast = setTimeout(function () {
            toast.classList.remove("reveal");
          }, 1000));
      toast.classList.add("reveal");
      toast.innerText = text;
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage("주소가 복사되었습니다.");
      toast(toastMessage);
    });
  };
  const confirmPlace = async () => {
    try {
      await sendConfirmPlace();
      if (modalData !== null)
        setFixPlace(modalData.place_name + "\n" + modalData.place_address);
        router.push("/fixedreserve");
    } catch (error) {
      console.error("장소 확정 중 에러 발생:", error);
    }
  };

  const sendConfirmPlace = async () => {
    try {
      const token = Cookies.get("Bearer");
      if (token !== undefined) {
        const base64Payload = token.substring(7).split(".")[1];
        const payload = Buffer.from(base64Payload, "base64");
        const result = JSON.parse(payload.toString());
        const ownerEmail = result.email;
        if (ownerEmail !== master) return alert("방장만 가능합니다.");
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/setplace`;
      let requestData;
      let fixAddress;
      if (modalData !== null)
        fixAddress = modalData.place_name + "\n" + modalData.place_address;
      requestData = {
        roomId: roomId,
        place: fixAddress,
      };

      const JwtToken = `Bearer ${token}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: JwtToken,
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      else if (fixAddress) {
        setFixPlace(fixAddress);
      }
    } catch (error) {
      console.error("진행정보 업데이트 중 에러 발생:", error);
    }
  };
  return (
    <Modal showModal={showPlaceModal} setShowModal={setShowPlaceModal}>
      <div className="w-full overflow-auto md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          {modalData ? (
            <>
              <h2 className="font-display text-xl font-bold">
                {modalData.place_name}
              </h2>
              <div className="flex justify-center">
                {modalData.place_img_url === "등록된 사진 없음" ? (
                  <p className="text-gray-600">대표사진을 못 찾았어요..😅</p>
                ) : (
                  <img
                    src={modalData.place_img_url}
                    style={{ width: "80%", height: "auto" }}
                    alt="img"
                  />
                )}
              </div>
              <div className="flex">
                <img
                  className="mx-3"
                  src="/mark-logo.png"
                  style={{ width: "20px", height: "27px" }}
                  alt="map-logo"
                />
                <div className="mr-5 flex flex-col justify-center text-left text-sm text-gray-600">
                  <div>
                    {modalData.place_address}&nbsp;
                    <span
                      className="inline font-semibold active:bg-gray-300"
                      onClick={() => handleCopy(modalData.place_address)}
                      style={{ color: "#9381FF" }}
                    >
                      복사
                    </span>
                  </div>
                  <style>
                    {`
                        #toast.reveal {
                            opacity: 1;
                            visibility: visible;
                            transform: translate(-50%, 0);
                        }
                    `}
                  </style>
                  <div
                    id="toast"
                    className="invisible fixed bottom-1 left-1/2 z-50 w-11/12 -translate-x-1/2 transform rounded-lg px-3 py-2 text-white opacity-0 transition-all duration-500"
                    style={{ backgroundColor: "rgb(147, 129, 255, 90%)" }}
                  >
                    {toastMessage}
                  </div>
                </div>
              </div>
              <div className="flex">
                <img
                  className="mx-3"
                  src="/rating-logo.png"
                  style={{ width: "20px", height: "20px" }}
                  alt="rating-logo"
                />
                <p className="text-sm text-gray-600">
                  {modalData.place_grade
                    ? modalData.place_grade
                    : "별점이 없습니다"}
                </p>
              </div>
              <div className="flex">
                <img
                  className="mx-3"
                  src="/time-logo.png"
                  style={{ width: "20px", height: "20px" }}
                  alt="time-logo"
                />
                <p className="text-left text-sm text-gray-600">
                  {modalData.place_time
                    ? modalData.place_time.map((day, index) => (
                        <span key={index}>
                          {day}
                          {<br />}
                        </span>
                      ))
                    : "영업시간이 존재하지 않습니다."}
                </p>
              </div>
              <div className="flex">
                <img
                  className="mx-3"
                  src="/information-logo.png"
                  style={{ width: "20px", height: "20px" }}
                  alt="information"
                />
                <p className="ml-1 mr-5 text-left text-sm text-gray-600">
                  {modalData.place_detail}
                </p>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      {roomId != "" && (
        <>
          <div className="sticky bottom-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit pb-1">
            <button
              className="align-center flex w-36 items-center justify-center rounded-full border p-2 text-white transition-all duration-75 hover:border-gray-800 active:bg-gray-100"
              style={{ backgroundColor: "#9381FF" }}
              onClick={confirmPlace}
            >
              장소 확정
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export function usePlaceModal() {
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [modalData, setModalData] = useState<PlaceDetailDTO | null>(null);

  const PlaceModalCallback = useCallback(() => {
    return (
      <PlaceModal
        showPlaceModal={showPlaceModal}
        setShowPlaceModal={setShowPlaceModal}
        modalData={modalData}
        setModalData={setModalData}
      />
    );
  }, [showPlaceModal, modalData]);

  return useMemo(
    () => ({
      setShowPlaceModal,
      PlaceModal: PlaceModalCallback,
      setModalData: setModalData,
    }),
    [setShowPlaceModal, PlaceModalCallback, setModalData],
  );
}
