import Script from "next/script";
import { Map } from "react-kakao-maps-sdk";

const KakaoMap = () => {
  return (
    <>
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=8c54cde8a79d24c3addc3d07a9730bb2&libraries=services,clusterer&autoload=false"
        strategy="beforeInteractive"
      />
      <Map
        center={{ lat: 33.450701, lng: 126.570667 }}
        style={{ width: "100%", height: "100%" }}
      ></Map>
    </>
  );
};

export default KakaoMap;
