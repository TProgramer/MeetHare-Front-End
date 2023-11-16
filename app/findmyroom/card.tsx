import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

type Props = {
  title: string;
  roomId: string;
  token: string;
};

export default function Card({ title, roomId, token }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEditClick = (e: any) => {
    e.preventDefault(); // 링크 동작을 막음
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handleTitleChange = (e: any) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmitClick = () => {
    setIsEditing(false);
    onTitleChange();
  };

  const onTitleChange = async () => {
    if (editedTitle.replace(/\s/g, '').length < 3) {
      alert("최소 3글자 입력");
      return;
    }
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_serverURL}/user-manage/room/nameChange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ uuid: roomId, editedTitle: editedTitle }),
        },
      );

      if (resp.ok) {
        // API에서 받은 데이터를 배열로 변환하여 상태로 설정
        window.location.reload();
      } else {
      }
    } catch (error) {
      //여기서 캐시를 지우던가 리프레시 토큰을 주도록 해야 겠다.
    }
  };

  const handleClick = (e: any) => {
    if (isEditing) {
      e.preventDefault(); // 편집 모드에서는 링크 동작을 막음
    }
  };

  return (
    <div
      className={`flex w-full overflow-hidden rounded-xl border border-gray-200 bg-white pb-3 pt-3 shadow-md`}
      onClick={handleClick}
    >
      {isEditing ? (
        <>
          <br />
          <div className="w-1/6"></div>
          <input
            className="w-4/6 rounded-xl text-center text-xl font-bold"
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
          />
          <div className="w-1/6 pr-4 pt-3 text-end">
            <button onClick={handleSubmitClick}>✅ </button>
            <button onClick={handleCancelClick}>❌ </button>
          </div>
          <br />
        </>
      ) : (
        <>
          <div className="w-1/6"></div>
          <h2 className="w-4/6 text-center text-xl font-bold ">{title}</h2>
          <button className="w-1/6" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
        </>
      )}
      {/* </div> */}
    </div>
  );
}
