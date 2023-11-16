"use client";

import { useEffect, useState, useRef } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import Cookies from "js-cookie";
import useRoomInfoStore from "store/store";  

declare global {
  interface Window {
    kakao: any;
  }
}
 
const WebSocketPage = () => {
  
  const stompClient = useRef<Client | null>(null);
  const [userName, setUserName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [startStation, setStartStation] = useState<Station[]>([]);
  const [targetStationLong, setTargetStationLong] = useState(0);
  const [targetStationLat, setTargetStationLat] = useState(0);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  const { myRoomName, roominfo } = useRoomInfoStore();
  const { fixStation } = roominfo;
  const coodRef = useRef({lat: null, lng: null});
 

  const token = Cookies.get("Bearer");
  if(token && userName ==="" ){
    const base64Payload = token.substring(7).split(".")[1]; // value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
    const payload = Buffer.from(base64Payload, "base64");
    const result = JSON.parse(payload.toString()); 
    setUserName(result.nickName);
    setChannelId(myRoomName);

    console.log(userName);
    console.log(channelId);
  }
 

  // 출발지 좌표를 가져오기 위한 fetch
  useEffect(() => {
    const fetchStationInfo = async () => {
      try {
        const encodedFixStation = encodeURIComponent(fixStation);
        const response = await fetch(`${process.env.NEXT_PUBLIC_serverURL}/map/getStationInfo?fixStation=${encodedFixStation}`);
        const data = await response.json(); 
        // 가져온 데이터를 사용할 수 있습니다.
        console.log('여기여기여기여기:', data);
 
        console.log('경도 :', data[0].longitude);
        console.log('위도 :', data[0].latitude);
        setTargetStationLong(data[0].longitude);
        setTargetStationLat(data[0].latitude);

      } catch (error) {
        console.error("Error fetching station info:", error);
      }
    };

    // 페이지 로딩 시 한 번 실행
    fetchStationInfo();
  }, []);

 

  interface Station {
    stationId?: number; 
    longitude: number;
    latitude: number;
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
      // brokerURL: "ws://localhost:8080/ws",
      brokerURL: `${process.env.NEXT_PUBLIC_STOMP_serverURL}/ws`,
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

      const position: RealTimePosition[] = [];

      // Stomp 서버에서 메시지를 받는 로직
      stompClient.current?.subscribe(`/sub/channel/${channelId}`, (message) => {
        console.log(JSON.parse(message.body));
        position.push(JSON.parse(message.body));
        setStartStation(JSON.parse(message.body));
        setPositions([...position]);
      });
      console.log([...position]);
      console.log(positions);
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
        console.log('서버 보내기 전 체크'+userName)

        console.log(latitude, longitude);

        // Stomp 서버로 메시지 보내기
        stompClient.current?.publish({
          destination: "/pub/connect",
          body: JSON.stringify(locationData),
        });
        setIsSharingLocation(true);
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
  }, [channelId]);

  const [station, setStation] = useState<Station | null>(null);
  const [mapBound, setMapBound] = useState<any>([]);

  const mapRef = useRef<any>(null);
  let map: undefined;

 
  const [points, setPoints] = useState<{ title: string; latlng: any; }[]>([]); 
  
  useEffect( () => {  
    const fetchData = async () => {
 

    const kakaoMapScript = document.createElement('script');
    kakaoMapScript.async = true;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_kakaoMapKey}&autoload=false`;
    document.head.appendChild(kakaoMapScript);
    /////////////////////////////////////////// 

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        var container = document.getElementById('map');
        console.log(coodRef);
        if (container) {
          navigator.geolocation.getCurrentPosition((point) => {
            var options = {
              
              center: new window.kakao.maps.LatLng(point.coords.latitude, point.coords.longitude),
              
              level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);

            // 맵을 위로 80px 올립니다.
            if (container) {
              container.style.marginTop = "-80px";
            }
            var centerMarkerPosition = new window.kakao.maps.LatLng(  targetStationLat, targetStationLong);

            var centermarker = new window.kakao.maps.Marker({
              position: centerMarkerPosition,
              title: '도착지'
            });

            // 마커가 지도 위에 표시되도록 설정합니다
            centermarker.setMap(map);

            var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

            var bounds = new kakao.maps.LatLngBounds();

            // centermarker의 위치를 bounds에 추가
            bounds.extend(centerMarkerPosition);

            for (var i = 0; i < points.length; i++) {
              var imageSize = new kakao.maps.Size(24, 35);
              var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

              var marker = new kakao.maps.Marker({
                map: map,
                position: points[i].latlng,
                title: points[i].title, 
                image: markerImage
              });

              // 각 마커의 위치를 bounds에 추가
              bounds.extend(points[i].latlng);

              // 각 마커에 텍스트를 표시하는 CustomOverlay 생성
              var customOverlay = new window.kakao.maps.CustomOverlay({
                position: points[i].latlng,
                content: '<div style="point: absolute; text-align: center; white-space: nowrap; top: 5px;">' +
                  '<div style="display: inline-block; background-color: white; padding: 5px; border-radius: 5px; box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3); font-size:12px">' +
                  points[i].title +
                  '</div>' +
                  '</div>',
              });

              // CustomOverlay 지도에 표시
              customOverlay.setMap(map);
            }

            // 현재 좌표와 일정 범위를 고려하여 bounds를 조절
            var extraPadding = 0.5; // 상하좌우 여백 비율 조절 가능
            map.setBounds(bounds, extraPadding);

          });
        } else {
          console.error("Container element not found");
        }
      });
    };
 
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI);
  }
  fetchData();
    return () => {
    }; 
    
  }, [points, targetStationLong, targetStationLat]); // points 의존성으로 추가

  const handleClick = () => {

    navigator.geolocation.getCurrentPosition((point) => {
      const newLocation = {
        // title: '내 위치',
        title:  userName,
        latlng: new window.kakao.maps.LatLng(point.coords.latitude, point.coords.longitude),
      };

      setPoints((prevPoints) => [
        ...prevPoints,
        newLocation,
      ]);


    }, (error) => {
      console.error("Error getting current point:", error);
    });

    console.log('New userName:', userName);
  };

  const testFunction = () => {
    shareLocation();
    handleClick();
  }

  //5초에 한번씩 
  useEffect(() => {  
    let timer = setInterval(() => { 
      shareLocation();
      console.log(positions);
    }, 5000);

    return () => clearInterval(timer);
  }, []);


  return (
    <main className="w-full flex flex-col items-center justify-center pt-4">
      <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]" style={{ position: "relative" }}>
        <div id="map" style={{ width: "100%", height: "100%" }}></div> 
        <button  className="w-30 mt-4 flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100" onClick={testFunction}  style={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)" }}>내 위치 공유하기</button>

        {/* {isSharingLocation && <p className="items-center text-center"> {userName} 님이 실시간 위치를 공유하고 있어요</p>} */}

      </div>
    </main>
  );
};
export default WebSocketPage;

