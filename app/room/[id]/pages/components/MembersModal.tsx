"use client";

import { useState } from "react";
import Cookies from "js-cookie";

import Popover from "@/components/shared/popover";
import Image from "next/image";

export default function Members({ userlist }: { userlist: String[] }) {
  const [openPopover, setOpenPopover] = useState(false);

 

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <>
            <div className="flex-direction-column flex">
              {userlist.map((userName, index) => (
                <div key={index} className="m-1 rounded-full bg-gradient-to-r from-gray-300 to-blue-200 p-2">
                  {userName}
                </div>
              ))}
            </div>
          </>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}>
          <div className="m-1 rounded-full bg-gradient-to-r from-gray-300 to-blue-200 p-2">
            참가자
          </div>
        </button>
      </Popover>
    </div>
  );
}







