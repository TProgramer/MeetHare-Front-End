"use client";
/*global kakao*/
// import KakaoMap from 'components/layout/maps';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState, useMemo, useRef } from "react";
import Script from "next/script";
import { start } from "repl";

export default function maps() {
  interface Station {
    stationId: number;
    stationName: string;
    longitude: number;
    latitude: number;
    infracount: string;
    userId: string;
  }

  const [startStation, setStartStation] = useState<Station[]>([]);
  const [mapBound, setMapBound] = useState<any>([]);

  const mapRef = useRef<any>(null);
  let map = undefined;

  useEffect(() => {
    const kakaoMapScript = document.createElement("script");
    kakaoMapScript.async = false;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=ef830f15ecdbe289eb83b2d4bce50ee3&libraries=services,clusterer&autoload=false`;
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

        fetchData()
          .then((list: Station[]) => {
            list.forEach((Station: Station) => {
              bounds.extend(
                new kakao.maps.LatLng(Station.latitude, Station.longitude),
              );
            });
            setMapBound(bounds);

            setTimeout(() => {
              map = mapRef.current;
              if (map) map.setBounds(bounds);
            }, 10);
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
