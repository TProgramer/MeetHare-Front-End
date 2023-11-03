// "use client"
// import React, { useState, useEffect } from 'react';

export default async function recommendPlace() {
  // useEffect(() => {
  //     async function fetchData() {
  //         try {
  //             const response = await fetch('http://3.36.122.35:8080/map/test');
  //             const data = await response.text();
  //             setData(data);
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //         }
  //     }

  //     fetchData();
  // }, []);

  // const [data, setData] = useState<string | null>(null);

  const data = await fetch(`${process.env.NEXT_PUBLIC_serverURL}map/test`, {
    cache: "no-store",
  });
  const ddata = await data.text();
  console.log(data);
  console.log(ddata);

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        근데 왜 안나오지?
        {ddata && <p>{ddata}</p>}
        <div id="map"></div>
      </div>
    </>
  );
}
