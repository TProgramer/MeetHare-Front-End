"use client";

import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const WebSocketPage = () => {
  const stompClient = useRef<Client | null>(null);
  const [userName, setUserName] = useState("test1");
  const [channelId, setChannelId] = useState("chaeyeong");
  const [startStation, setStartStation] = useState<Station[]>([]);
  //useState<Station | null>(null);
  //
  interface Station {
    stationId?: number;
    stationName?: string;
    longitude: number;
    latitude: number;
    transPath?: string;
    infracount?: string;
    userId: string;
  }

  interface RealTimePosition {
    channelId: any;
    data: Coordinate;
    sender: string;
  }

  interface Coordinate {
    longitude: number;
    latitude: number;
  }

  const [positions, setPositions] = useState<RealTimePosition[]>([]);

  const connectAndSubscribe = () => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        login: "guest",
        passcode: "guest",
      },
      debug: (str) => {
        console.log(str);
      },
    });

    stompClient.current.activate();

    stompClient.current.onConnect = (frame) => {
      console.log("Stomp Connected:", frame);

      // Stomp 서버로 메시지를 보내는 로직
      const locationData = {
        type: "message",
        sender: userName,
        channelId: channelId,
        data: { latitude: "latitude", longitude: "longitude" },
      };

      stompClient.current?.publish({
        destination: "/pub/hello",
        body: JSON.stringify(locationData),
      });

      const position: RealTimePosition[] = [];

      // Stomp 서버에서 메시지를 받는 로직
      stompClient.current?.subscribe(`/sub/channel/${channelId}`, (message) => {
        console.log(JSON.parse(message.body));
        position.push(JSON.parse(message.body));
        // setStartStation 초기화시키고
        // 여기서 받는 바디들을
        // 배열로 만들어서
        // 넣어야함
        setStartStation(JSON.parse(message.body));
        setPositions(position);
      });
    };
  };

  const shareLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = {
          type: "message",
          sender: userName,
          channelId: channelId,
          data: { latitude, longitude },
        };

        console.log(latitude, longitude);

        // Stomp 서버로 메시지 보내기
        stompClient.current?.publish({
          destination: "/pub/hello",
          body: JSON.stringify(locationData),
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  };

  useEffect(() => {
    connectAndSubscribe();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [channelId, userName]);

  const [station, setStation] = useState<Station | null>(null);
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

              // setCardInfo(jsonValue.list);
              resolve(jsonValue.list); // jsonValue를 반환합니다.
            } else {
              reject(new Error("Unable to get station data")); // 에러 처리
            }
          });
        };

        var polyline: any[] = [];

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
    };

    kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
  }, [map]);

  const myStation: Station = {
    stationId: station?.stationId || 0,
    stationName: station?.stationName || "",
    longitude: station?.longitude || 0,
    latitude: station?.latitude || 0,
    transPath: station?.transPath || "",
    infracount: station?.infracount || "",
    userId: station?.userId || "",
  };

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
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
            {positions.length > 0 &&
              positions.map((Station, index) => (
                <MapMarker
                  key={`${index}`}
                  position={{
                    lat: Station.data.latitude,
                    lng: Station.data.longitude,
                  }}
                  clickable={true}
                >
                  <div>{Station.sender}</div>
                </MapMarker>
              ))}
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
          </Map>
        )}
      </div>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <input
          className="w-30 mt-4 flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
          type="text"
          placeholder="방 이름"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        <input
          className="w-30 mt-4 flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
          type="text"
          placeholder="유저이름"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          onClick={shareLocation}
          className="w-50 mt-4 flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
        >
          내 위치 공유하기
        </button>
      </div>
    </>
  );
};

export default WebSocketPage;
