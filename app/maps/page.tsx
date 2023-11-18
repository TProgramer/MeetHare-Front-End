"use client";
/*global kakao*/
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { useRouter } from "next/navigation";
import useRoomInfoStore from "../../store/store";

export default function Maps() {
  interface Station {
    stationId: number;
    stationName: string;
    longitude: number;
    latitude: number;
    transPath: string;
    infracount: string;
    userId: string;
  }

  interface userInfo {
    latitude: number;
    longitude: number;
    transPath: string;
    userId: string;
    minTime: number;
    minPath: path[];
  }

  interface path {
    sectionTime: number;
    trafficType: number;
    startName?: string;
    endName?: string;
    lane?: Array<subway>;
  }

  interface subway {
    name: string;
    subwayCode: number;
  }

  interface carousel {
    userInfo: userInfo[];
    path: path[];
  }

  const { roominfo } = useRoomInfoStore();
  const [startStation, setStartStation] = useState<Station[]>([]);
  const [mapBound, setMapBound] = useState<any>([]);
  const [cardInfo, setCardInfo] = useState<userInfo[]>([]);
  const [pathInfo, setPathInfo] = useState<path[][]>([]);
  const router = useRouter();

  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
  });

  const mapRef = useRef<any>(null);
  let map: undefined;

  useEffect(() => {
    const kakaoMapScript = document.createElement("script");
    kakaoMapScript.async = false;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_kakaoMapKey}&libraries=services,clusterer&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const bounds = new window.kakao.maps.LatLngBounds();

        const fetchData = async () => {
          return await new Promise<Station[]>((resolve, reject) => {
            const myValue = localStorage.getItem("station");
            if (myValue != null) {
              const jsonValue = JSON.parse(myValue);
              setStation(jsonValue.station);
              setStartStation(jsonValue.list as Station[]);
              setCardInfo(jsonValue.list as userInfo[]);
              const pathArr: path[][] = [];
              jsonValue.list.forEach((user: any) => {
                pathArr.push(JSON.parse(user.minPath));
              });
              setPathInfo(pathArr);

              // setCardInfo(jsonValue.list);
              resolve(jsonValue.list); // jsonValue를 반환합니다.
            } else {
              reject(new Error("Unable to get station data")); // 에러 처리
            }
          });
        };

        var linePath: any[] = [];
        // var polyline: any = undefined;
        var polyline: any[] = [];

        fetchData()
          .then((list: Station[]) => {
            list.forEach((Station: Station) => {
              bounds.extend(
                new kakao.maps.LatLng(Station.latitude, Station.longitude),
              );

              // 지도에 표시할 선을 생성합니다
              var subLinePath: any[] = [];
              JSON.parse(Station.transPath).result.path[0].subPath.forEach(
                (subPath: any) => {
                  if (subPath.trafficType != 1) {
                    return;
                  }

                  if (subPath.trafficType == 1) {
                    subPath.passStopList.stations.forEach((ex: any) => {
                      subLinePath.push(
                        new window.kakao.maps.LatLng(ex.y, ex.x),
                      );
                    });
                  }
                },
              );

              linePath.push(subLinePath);
            });
            setMapBound(bounds);

            setTimeout(() => {
              map = mapRef.current;

              linePath.forEach((line: any) => {
                polyline.push(
                  new window.kakao.maps.Polyline({
                    path: line, // 선을 구성하는 좌표배열 입니다
                    strokeWeight: 5, // 선의 두께 입니다
                    strokeColor: "#9381ff", // 선의 색깔입니다
                    strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: "solid", // 선의 스타일입니다
                  }),
                );
              });

              if (map) {
                mapRef.current?.setBounds(bounds);
              }
              polyline.forEach((poly: any) => {
                poly.setMap(map);
              });
            }, 100);
          })
          .catch((error) => {
            console.error(error);
          });
      });

      const endStation = document.getElementById("endStation");
    };

    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
  }, [map]);

  useEffect(() => {
    if (embla && cardInfo.length > 0) {
      embla.reInit();
    }
  }, [embla, cardInfo]);

  const [station, setStation] = useState<Station | null>(null);

  const myStation: Station = {
    stationId: station?.stationId || 0,
    stationName: station?.stationName || "",
    longitude: station?.longitude || 0,
    latitude: station?.latitude || 0,
    transPath: station?.transPath || "",
    infracount: station?.infracount || "",
    userId: station?.userId || "",
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="z-10 flex w-full max-w-xl flex-col rounded-md px-5 xl:px-0">
        <div className="h-120 relative col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ">
          <br />
          <div className="flex flex-row items-center justify-center">
            추천 장소는 &nbsp;
            <p className={` text-2xl`}>{myStation.stationName}</p>&nbsp; 입니다
          </div>
          <br />
          <div className="grid place-items-center">
            {station && (
              <Map
                center={{ lat: myStation.latitude, lng: myStation.longitude }}
                style={{ width: "90%", height: "360px" }}
                level={6}
                id="PlaceMap"
                ref={mapRef}
                className=" outline outline-2 outline-offset-4 outline-purple-300"
              >
                <MapMarker
                  position={{
                    lat: myStation.latitude,
                    lng: myStation.longitude,
                  }}
                >
                  <div
                    style={{ color: "#000", width: "150px" }}
                    className="w-150 z-50 flex items-center justify-center"
                    id="endStation"
                  >
                    <div>{myStation.stationName}</div>
                  </div>
                </MapMarker>

                {startStation.length > 0 &&
                  startStation.map((Station, index) => (
                    <MapMarker
                      key={`${Station.userId}-${Station.longitude}-${Station.latitude}`}
                      position={{
                        lat: Station.latitude,
                        lng: Station.longitude,
                      }}
                      clickable={true}
                      onMouseOver={() => setIsOpen(true)}
                      onMouseOut={() => setIsOpen(false)}
                    >
                      {isOpen && (
                        <div style={{ color: "#000" }}>{Station.userId}</div>
                      )}
                    </MapMarker>
                  ))}
              </Map>
            )}
          </div>
          <br />
          <div>
            <div className="embla">
              <div className="embla__viewport" ref={viewportRef}>
                <div className="embla__container">
                  {cardInfo.length > 0 &&
                    cardInfo.map((card, index) => (
                      <div className="embla__slide flex flex-col" key={index}>
                        <div className="flex justify-between"></div>
                        <div className="flex flex-row justify-between">
                          {roominfo.roomId != 0 && (
                            <div className="text-xl">{card.userId} 님</div>
                          )}
                          {roominfo.roomId == 0 && (
                            <div className="text-xl">
                              {startStation[index].stationName} 출발
                            </div>
                          )}
                          <div>{card.minTime}분</div>
                        </div>
                        <br />
                        <div className="text-center text-xl">이동 경로</div>
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-col justify-center text-2xl">
                            &lt;
                          </div>
                          <div>
                            {pathInfo[index] &&
                              pathInfo[index]
                                .filter((info) => info.sectionTime != 0)
                                .map((p: any) => (
                                  <div className="my-3" key={card.userId}>
                                    <div className="flex flex-row items-center justify-center">
                                      <div>
                                        {p.trafficType == 1 && <p>지하철 🚉</p>}
                                      </div>
                                      &nbsp;
                                      <div>{p.lane && p.lane[0].name}</div>
                                      <div>
                                        {p.trafficType == 2 && <p>버스 🚌</p>}
                                      </div>
                                      <div>
                                        {p.trafficType == 3 && <p>걷기 🚶</p>}
                                      </div>
                                      &nbsp;
                                      <div>
                                        {p.sectionTime && (
                                          <p> {p.sectionTime}분</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-center text-sm">
                                      {p.startName && (
                                        <p> {p.startName}역 탑승</p>
                                      )}
                                    </div>
                                    <div className="text-center text-sm">
                                      {p.endName && <p> {p.endName}역 하차</p>}
                                    </div>
                                    <hr />
                                  </div>
                                ))}
                          </div>
                          <div className="flex flex-col justify-center text-2xl">
                            &gt;
                          </div>
                        </div>
                        <br />
                        <div className="items-align flex justify-center">
                          {index + 1} / {cardInfo.length}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-around">
              <Button variant="outlined" onClick={() => router.back()}>
                리스트로 돌아가기
              </Button>
              <Button variant="outlined" href={`/place/${station?.stationId}`}>
                약속 장소 정하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
