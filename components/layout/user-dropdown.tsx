"use client";

import { useState } from "react";
import Cookies from "js-cookie";

import Popover from "@/components/shared/popover";
import Image from "next/image";

export default function UserDropdown({ token }: { token: String }) {
  const [openPopover, setOpenPopover] = useState(false);

  const handleLogout = () => {
    // "authorize" 쿠키 삭제
    Cookies.remove("Bearer", {
      path: "/",
      domain: "meethare.site",
      secure: true,
    });
    window.location.href = "/";

    // 로그아웃 후 추가적인 작업을 수행하려면 여기에 코드를 추가하세요.

    // 팝오버 닫기
    setOpenPopover(false);
  };
  const preference = () => {
    window.location.href = "/preference";
    setOpenPopover(false);
  };

  if (!token) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <>
            <div className="flex-direction-column flex">
              <button
                className="mx-1 rounded-lg px-6 py-3 font-bold text-white hover:bg-blue-400"
                style={{ backgroundColor: "#9381FF" }}
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <button
                className="mx-1 rounded-lg px-6 py-3 font-bold text-white hover:bg-blue-400"
                style={{ backgroundColor: "#9381FF" }}
                onClick={preference}
              >
                좋아하는 것
              </button>
            </div>
          </>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt="logo"
            src={"/meetHare-logo.png"}
            quality={100}
            width={50}
            height={50}
          />
        </button>
      </Popover>
    </div>
  );
}
