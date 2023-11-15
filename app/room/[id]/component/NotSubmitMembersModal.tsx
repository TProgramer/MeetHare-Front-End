"use client";

import { useState } from "react";
import Popover from "@/components/shared/popover";

type Props = {
  submitNumber: number;
  totalNumber: number;
  userlist: {
    nickName: string;
    progress: string;
  }[];
  roomProgress: string;
};

export default function Members({
  submitNumber,
  totalNumber,
  userlist,
  roomProgress,
}: Props) {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <>
            <div className="flex-direction-column flex">
              <div className="flex">미제출자</div>
              <div className="flex">
                {userlist.map((user, index) => (
                  <div
                    key={index}
                    className="m-1 rounded-full bg-gradient-to-r from-gray-300 to-blue-200 p-2"
                  >
                    {user.progress === roomProgress ? user.nickName : null}
                  </div>
                ))}
              </div>
            </div>
          </>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button onClick={() => setOpenPopover(!openPopover)}>
          <div className="m-1 rounded-full bg-gradient-to-r from-gray-300 to-blue-200 p-2">
            {submitNumber}/{totalNumber}
          </div>
        </button>
      </Popover>
    </div>
  );
}
