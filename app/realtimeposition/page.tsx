"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

const WebSocketPage = () => {
  const stompClient = useRef<Client | null>(null);
  const [userName, setUserName] = useState('test1');
  const [channelId, setChannelId] = useState('chaeyeong');

  const connectAndSubscribe = () => {
    stompClient.current = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug: (str) => {
        console.log(str);
      },
    });

    stompClient.current.activate();

    stompClient.current.onConnect = (frame) => {
      console.log('Stomp Connected:', frame);

      // Stomp 서버로 메시지를 보내는 로직
      const locationData = {
        type: 'message',
        sender: userName,
        channelId: channelId,
        data: { latitude: 'latitude', longitude: 'longitude' },
      };

      stompClient.current?.publish({
        destination: '/pub/hello',
        body: JSON.stringify(locationData),
      });

      // Stomp 서버에서 메시지를 받는 로직
      stompClient.current?.subscribe(`/sub/channel/${channelId}`, (message) => {
        console.log('Message from server:', message.body);
      });
    };
  };

  const shareLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = {
          type: 'message',
          sender: userName,
          channelId: channelId,
          data: { latitude, longitude },
        };

        console.log(latitude, longitude);

        // Stomp 서버로 메시지 보내기
        stompClient.current?.publish({
          destination: '/pub/hello',
          body: JSON.stringify(locationData),
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  useEffect(() => {
    connectAndSubscribe();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [channelId, userName]);

  return (
    
    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
      <input
        className="mt-4 flex w-30 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
        type="text"
        placeholder="방 이름"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />
      <input
        className="mt-4 flex w-30 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
        type="text"
        placeholder="유저이름"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        onClick={shareLocation}
        className="mt-4 flex w-50 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-blue-800 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
      >
        내 위치 공유하기
      </button>
    </div>
  );
};

export default WebSocketPage;