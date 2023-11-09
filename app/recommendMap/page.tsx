"use client";

import Button from "@mui/material/Button";
import { gmarketMedium, gmarketBold, gmarketLight } from "../fonts";
import { useEffect, useState, useRef } from "react";

export default function RecommendMap() {
  interface userInfo {
    latitude: number;
    longitude: number;
    transPath: string;
    userId: string;
    minTime: number;
  }

  interface Station {
    stationId: number;
    stationName: string;
    longitude: number;
    latitude: number;
    infracount: string;
  }

  interface Recommend {
    station: Station;
    list: Array<userInfo>;
    averageTime: number;
  }

  const [stationNameList, setStationNameList] = useState<Recommend[]>([]);

  useEffect(() => {
    const testFunction = () => {
      const stationList = localStorage.getItem("stationList");
      if (stationList != null) {
        const stationData = JSON.parse(stationList);
        setStationNameList(stationData);

        for (var i = 0; i < stationData.length; i++) {
          var avg = 0;
          for (var j = 0; j < stationData[i].list.length; j++) {
            avg += stationData[i].list[j].minTime;
          }
          console.log("avg = ", Math.floor(avg / stationData[i].list.length));
          stationData[i].averageTime = Math.floor(
            avg / stationData[i].list.length,
          );
        }
      }
    };

    testFunction();
  }, []);

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <div className="relative col-span-1 flex h-96 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ">
          <div className="my-7 flex flex-col items-center justify-center">
            <p className={`${gmarketMedium.className} text-2xl`}>
              추천 장소 리스트
            </p>
          </div>
          <div className=" flex flex-col items-center justify-center">
            <table>
              <thead>
                <tr>
                  <th className="w-80 pb-7">추천 역</th>
                  <th className="pb-7">평균 소요 시간(분)</th>
                </tr>
              </thead>
              <tbody>
                {stationNameList.length > 0 &&
                  stationNameList.map((data, index) => (
                    <tr
                      key={index}
                      className={`${gmarketMedium.className} my-5 text-center text-2xl`}
                    >
                      <td>{data.station.stationName}</td>
                      <td>{data.averageTime}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
