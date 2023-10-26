// import KakaoMap from 'components/layout/maps';
import { Map, MapMarker } from "react-kakao-maps-sdk"
import Script from "next/script"

export default function maps() {
    
    return (
        <>
            <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                근데 왜 안나오지1232
                <Map
                center={{ lat: 33.5563, lng: 126.79581 }}
                style={{ width: "100%", height: "360px" }}
                >
                    <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
                        <div style={{ color: "#000" }}>Hello World!</div>
                    </MapMarker>
                </Map>
            </div>

        <Script
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=ef830f15ecdbe289eb83b2d4bce50ee3&libraries=services,clusterer&autoload=false"
          strategy="beforeInteractive"
        />
        </>  
    );
}