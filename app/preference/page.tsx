"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface PreferenceDTO {
  user_id: number;
  quite: boolean;
  food: string;
  activity: string;
  culture: string;
  [key: string]: string | number | boolean;
}

const categoriesData: { name: string; options: string[] }[] = [
  {
    name: "quite",
    options: ["선호"],
  },
  {
    name: "food",
    options: [
      "족발",
      "보쌈",
      "찜",
      "탕",
      "찌개",
      "돈까스",
      "회",
      "일식",
      "피자",
      "고기",
      "양식",
      "치킨",
      "중식",
      "국수",
      "분식",
    ],
  },
  {
    name: "activity",
    options: [
      "헬스",
      "클라이밍",
      "수영",
      "탁구",
      "볼링",
      "배드민턴",
      "농구",
      "축구",
    ],
  },
  {
    name: "culture",
    options: ["미술", "영화", "공연"],
  },
];

const categoriesLan: { [key: string]: string } = {
  quite: "🤫 조용한 장소",
  food: "🍽 음식",
  activity: "💪 운동",
  culture: "🎟 문화",
};

export default function Home() {
  const [preference, setPreference] = useState<PreferenceDTO | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<PreferenceDTO>({
    user_id: 0,
    quite: false,
    food: "",
    activity: "",
    culture: "",
  });
  const router = useRouter();

  const loadCategories = async (user_id: number) => {
    try {
      selectedOptions.user_id = user_id;
      const apiUrl = `${process.env.NEXT_PUBLIC_serverURL}/place/priority/${user_id}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPreference(data);
    } catch (error) {
      console.error("데이터를 가져오는 중 에러 발생:", error);
    }
  };
  const savePreferences = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_serverURL}/place/priority`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOptions),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("저장되었습니다!");
      router.push("/");
    } catch (error) {
      console.error("선호도 업데이트 중 에러 발생:", error);
    }
  };
  useEffect(() => {
    const token = Cookies.get("Bearer");
    let user_id = 0;
    if (token !== undefined) {
      const base64Payload = token.substring(7).split(".")[1]; // value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
      const payload = Buffer.from(base64Payload, "base64");
      const result = JSON.parse(payload.toString());
      user_id = result.userId;
    }
    if (user_id !== 0) loadCategories(user_id);
  }, []);

  const handlequiteClick = (category: string, option: boolean) => {
    if (selectedOptions[category] === option) {
      setSelectedOptions({ ...selectedOptions, [category]: true });
    } else {
      setSelectedOptions({ ...selectedOptions, [category]: false });
    }
  };
  const handleOptionClick = (category: string, option: string) => {
    if (selectedOptions[category] === option) {
      setSelectedOptions({ ...selectedOptions, [category]: "" });
    } else {
      setSelectedOptions({ ...selectedOptions, [category]: option });
    }
  };

  useEffect(() => {
    if (preference) {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        quite: preference.quite,
        food: preference.food,
        activity: preference.activity,
        culture: preference.culture,
      }));
    }
  }, [preference]);

  return (
    <div className="z-10 w-full max-w-4xl overflow-x-auto px-5 xl:px-0">
      <div className="my-5 grid w-full max-w-full animate-fade-up grid-cols-1 gap-5 px-5 xl:px-0">
        <h1 className="mb-4 text-2xl font-bold">
          🤔제일 좋아하는 걸 하나만 골라주세요!
        </h1>
        <div className="-mx-2 flex flex-wrap">
          {categoriesData.map((categoryData, index) => (
            <div
              key={index}
              className="mb-4 w-full px-2 sm:w-1/4 md:w-1/4 lg:w-1/4"
            >
              <div className="w-full rounded-lg bg-white p-4 shadow">
                <h2 className="mb-2 text-xl font-semibold">
                  {categoriesLan[categoryData.name]}
                </h2>
                <div className="flex flex-nowrap overflow-x-auto">
                  {categoryData.name === "quite" ? (
                    <button
                      className={`border-gray-#9381FF m-1 h-full rounded-full border px-3.5 py-2 text-sm text-gray-500`}
                      style={{
                        backgroundColor: selectedOptions[categoryData.name]
                          ? `#9381FF`
                          : "",
                        color: selectedOptions[categoryData.name]
                          ? `#FFFFFF`
                          : "",
                      }}
                      onClick={() => handlequiteClick(categoryData.name, false)}
                    >
                      {categoryData.options[0]}
                    </button>
                  ) : (
                    categoryData.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        className={`border-gray-#9381FF m-1 h-full whitespace-nowrap rounded-full border px-3.5 py-2 text-sm text-gray-500`}
                        style={{
                          backgroundColor:
                            selectedOptions[categoryData.name] === option
                              ? `#9381FF`
                              : "",
                          color:
                            selectedOptions[categoryData.name] === option
                              ? `#FFFFFF`
                              : "",
                        }}
                        onClick={() =>
                          handleOptionClick(categoryData.name, option)
                        }
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className=" mt-4 rounded-lg px-4 py-2 text-white"
          style={{
            backgroundColor: "#9381FF",
          }}
          onClick={savePreferences}
        >
          저장
        </button>
      </div>
    </div>
  );
}
