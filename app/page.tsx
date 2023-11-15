import Card from "@/components/home/card";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import DownloadModalClient from "@/components/layout/download-modal";

export default async function Home() {
  return (
    <>
      <DownloadModalClient />
      <div className="z-10 w-full max-w-xl break-keep px-5 xl:px-0">
        <br />
        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          일정관리부터 중간지점찾기, 약속장소선정까지 약속의 하나부터 열까지
          모든 것을 한번에, MeetHare에서 만나보세요.
        </p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        ></div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 break-keep px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={
              title === "Beautiful, reusable components" ? (
                <ComponentGrid />
              ) : (
                demo
              )
            }
          />
        ))}
      </div>
    </>
  );
}

const features = [
  {
    title: "번거로운 약속관리를 한 번에!",
    description:
      "약속 시간부터 위치와 장소 예약까지 잊을일 계속해서 관리해드려요!",
    demo: <WebVitals />,
  },
  {
    title: "중간지점찾기",
    description: "서로의 위치를 입력하고 만나기 좋은 중간 지점을 찾아보세요!",
    demo: (
      <a href="/middlespot">
        <Image
          src="/find-middle-logo.png"
          alt="Find Middle Location Image"
          width={120}
          height={30}
          unoptimized
        />
      </a>
    ),
  },
  {
    title: "나의 약속 확인하기",
    description: "나의 약속들을 관리해보세요",
    demo: (
      <a href="/findmyroom">
        <Image
          src="/meetHare-logo.png"
          alt="Deploy with Vercel"
          width={120}
          height={30}
          unoptimized
        />
      </a>
    ),
  },
];
