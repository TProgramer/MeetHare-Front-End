"use client";
/*global kakao*/
// import KakaoMap from 'components/layout/maps';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState, useMemo, useRef } from "react";
import Script from "next/script";
import { start } from "repl";

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

  const [startStation, setStartStation] = useState<Station[]>([]);
  const [mapBound, setMapBound] = useState<any>([]);

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
                  console.log(subPath);

                  if (subPath.trafficType != 1) {
                    return;
                  }

                  if (subPath.trafficType == 1) {
                    subLinePath.push(
                      new window.kakao.maps.LatLng(
                        subPath.startY,
                        subPath.startX,
                      ),
                    );
                    subLinePath.push(
                      new window.kakao.maps.LatLng(subPath.endY, subPath.endX),
                    );
                  }
                },
              );

              linePath.push(subLinePath);
            });
            setMapBound(bounds);

            setTimeout(() => {
              map = mapRef.current;

              linePath.forEach((line: any) => {
                console.log(line);
                polyline.push(
                  new window.kakao.maps.Polyline({
                    path: line, // 선을 구성하는 좌표배열 입니다
                    strokeWeight: 5, // 선의 두께 입니다
                    strokeColor: "#FF0000", // 선의 색깔입니다
                    strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: "solid", // 선의 스타일입니다
                  }),
                );
              });

              if (map) {
                mapRef.current?.setBounds(bounds);
              }
              polyline.forEach((poly: any) => {
                console.log(1);
                poly.setMap(map);
              });
            }, 100);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };

    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
  }, [map]);

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
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        {station && (
          <Map
            center={{ lat: myStation.latitude, lng: myStation.longitude }}
            style={{ width: "100%", height: "360px" }}
            level={6}
            id="PlaceMap"
            ref={mapRef}
          >
            <MapMarker
              position={{ lat: myStation.latitude, lng: myStation.longitude }}
            >
              <div style={{ color: "#000" }}>{myStation.stationName}</div>
            </MapMarker>

            {startStation.length > 0 &&
              startStation.map((Station, index) => (
                <MapMarker
                  key={`${Station.userId}-${Station.longitude}-${Station.latitude}`}
                  position={{ lat: Station.latitude, lng: Station.longitude }}
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
    </>
  );
}
