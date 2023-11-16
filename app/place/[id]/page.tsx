"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { usePlaceModal } from "@/app/place/place-modal";
import Card from "@/app/place/util/card";
import Cookies from "js-cookie";
import useRoomInfoStore from "../../../store/store";

interface PlaceDTO {
  place_num: number;
  place_name: string;
  place_grade: number;
  place_address: string;
  place_category: string;
}

type member = {
  id: number;
  nickName: string;
  stationName: string;
  latitude: number;
  longitude: number;
};

interface Category {
  [key: string]: PlaceDTO[];
}

export default function Place(props: any) {
  const { PlaceModal, setShowPlaceModal, setModalData } = usePlaceModal();
  const [categoryList, setCategoryList]: [
    Category | undefined,
    Dispatch<SetStateAction<Category | undefined>>,
  ] = useState();
  const [category, setCategory] = useState("restaurant");

  const memberList: number[] = useRoomInfoStore((state: any) =>
    state.memberList.map((member: member) => member.id),
  );

  const fixCategory = useRoomInfoStore((state: any) => state.roominfo.category);

  const roomName = useRoomInfoStore((state: any) => state.myRoomName);

  const cardClick = async (placeNum: number) => {
    setShowPlaceModal(true);
    setModalData(null);
    setModalData(await fetchPlaceDetail(placeNum));
  };

  const fetchPlaceDetail = async (placeNum: number) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_serverURL}/place/detail/${placeNum}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    }
  };
  const fetchPlaceList = async (stationNum: number) => {
    try {
      if (fixCategory !== "") setCategory(fixCategory);
      const token = Cookies.get("Bearer");
      if (token && roomName !== "") {
        const apiUrl = `${process.env.NEXT_PUBLIC_serverURL}/place/complex`;
        const requestData = {
          station_id: Number(stationNum),
          category: fixCategory,
          user_list: memberList,
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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategoryList(data);
      } else {
        const apiUrl = `${process.env.NEXT_PUBLIC_serverURL}/place/simple/${stationNum}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategoryList(data);
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    }
  };
  useEffect(() => {
    fetchPlaceList(props.params.id);
  }, [props]);
  return (
    <>
      <div className="z-10 w-full px-5 xl:px-0">
        <div className="my-5 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
          <div className="sticky grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="flex-direction-row flex justify-between ">
              {roomName === "" && (
                <>
                  <button
                    onClick={() => setCategory("restaurant")}
                    className="align-center flex items-center justify-center rounded-md border border-gray-300 text-lg transition-all duration-75 hover:border-gray-800 active:bg-gray-100"
                    style={{
                      flexBasis: "20%",
                      backgroundColor:
                        category === "restaurant" ? "#9381FF" : "",
                    }}
                  >
                    🍽
                  </button>
                  <button
                    onClick={() => setCategory("activity")}
                    className="align-center flex items-center justify-center rounded-md border border-gray-300 text-lg transition-all duration-75 hover:border-gray-800 active:bg-gray-100"
                    style={{
                      flexBasis: "20%",
                      backgroundColor: category === "activity" ? "#9381FF" : "",
                    }}
                  >
                    💪
                  </button>
                  <button
                    onClick={() => setCategory("study")}
                    className="align-center flex items-center justify-center rounded-md border border-gray-300 text-lg transition-all duration-75 hover:border-gray-800 active:bg-gray-100"
                    style={{
                      flexBasis: "20%",
                      backgroundColor: category === "study" ? "#9381FF" : "",
                    }}
                  >
                    ✏
                  </button>
                  <button
                    onClick={() => setCategory("culture")}
                    className="align-center flex items-center justify-center rounded-md border border-gray-300 text-lg transition-all duration-75 hover:border-gray-800 active:bg-gray-100"
                    style={{
                      flexBasis: "20%",
                      backgroundColor: category === "culture" ? "#9381FF" : "",
                    }}
                  >
                    🎟
                  </button>
                </>
              )}
            </div>
            <PlaceModal />
          </div>
          <div className="" style={{ overflow: "auto", height: "450px" }}>
            {categoryList
              ? categoryList[category].map(
                  ({
                    place_num,
                    place_name,
                    place_address,
                    place_category,
                  }) => (
                    <Card
                      key={place_num}
                      place_num={place_num}
                      name={place_name}
                      address={place_address}
                      category={place_category}
                      onClick={() => cardClick(place_num)}
                    />
                  ),
                )
              : ""}
          </div>
        </div>
      </div>
      <style>
        {`
        [vaul-drawer]:after {
        position: absolute;
        top: 100%;
        background: inherit;
        background-color: inherit;
        left: 0;
        right: 0;
        height: 0;
        }
        `}
      </style>
    </>
  );
}
