import Card from "@/app/util/card";
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
          일정 관리부터 중간 지점 찾기, 약속 장소 선정까지 <br />
          약속의 하나부터 열까지 모든 것을 한번에, <br />
          MeetHare에서 만나보세요.
        </p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        ></div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 break-keep px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo, link }) => (
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
            link={link}
          />
        ))}
      </div>
    </>
  );
}

const features = [
  {
    title: "중간 지점 찾기",
    description: "서로의 위치를 입력하고 만나기 좋은 중간 지점을 찾아보세요!",
    demo: (
      <Image
        className="m-2"
        src="/find-middle-logo.png"
        alt="Find Middle Location Image"
        width={90}
        height={30}
        unoptimized
      />
    ),
    link: "/middlespot",
  },
  {
    title: "약속 확인하기",
    description: "약속을 만들고 관리해보세요",
    demo: (
      <Image
        className="m-2"
        src="/meetHare-simple-logo.png"
        alt="Deploy with Vercel"
        width={90}
        height={30}
        unoptimized
      />
    ),
    link: "/findmyroom",
  },
];
