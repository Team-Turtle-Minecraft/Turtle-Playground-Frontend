"use client";

import { useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const discordRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDiscord = () => {
    discordRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative w-full h-[651px]">
          {/* 배너 이미지 */}
          <div className="relative w-full h-full">
            <Image
              src="/assets/turtle-playground-banner.png"
              alt="거북이 놀이터 배너"
              fill
              sizes="100vw"
              priority
              style={{
                objectFit: "contain", // 'cover'에서 'contain'으로 변경
                backgroundColor: "#f3f4f6", // 선택적: 이미지 주변 배경색 설정
              }}
            />
          </div>

          {/* 배너 위에 올라가는 버튼들 */}
          <div className="absolute z-10 flex space-x-4 transform -translate-x-1/2 bottom-8 left-1/2">
            <button
              onClick={scrollToContent}
              className="px-6 py-2 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              게임 컨텐츠 살펴보기
            </button>
            <button
              onClick={scrollToDiscord}
              className="px-6 py-2 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              서버에 참여하기
            </button>
          </div>
        </section>

        {/* Grid Section */}
        <section
          ref={contentRef}
          className="container px-6 py-12 mx-auto scroll-mt-20"
        >
          <div className="grid grid-cols-2 gap-8">
            <div
              className="p-4 bg-gray-100 cursor-pointer aspect-video"
              onClick={() => (window.location.href = "/contents/story-system")}
            >
              <h3 className="text-lg font-bold">컨텐츠 소개 - 스토리</h3>
            </div>
            <div
              className="p-4 bg-gray-100 cursor-pointer aspect-video"
              onClick={() =>
                (window.location.href = "/contents/achievement-system")
              }
            >
              <h3 className="text-lg font-bold">컨텐츠 소개 - 도전과제</h3>
            </div>
            <div
              className="p-4 bg-gray-100 cursor-pointer aspect-video"
              onClick={() => (window.location.href = "/contents/combat-system")}
            >
              <h3 className="text-lg font-bold">컨텐츠 소개 - 전투</h3>
            </div>
            <div
              className="p-4 bg-gray-200 cursor-pointer aspect-video"
              onClick={() => (window.location.href = "/contents/living-system")}
            >
              <h3 className="text-lg font-bold">컨텐츠 소개 - 생활</h3>
            </div>
          </div>
        </section>

        {/* Discord Section */}
        <section
          ref={discordRef}
          className="py-12 text-center bg-white scroll-mt-20"
        >
          <div className="max-w-2xl px-6 mx-auto">
            <p className="mb-4">
              거북이 놀이터 서비스는 일부 공개되어 운영됩니다!
            </p>
            <p className="mb-8">
              공식 디스코드 서버에 참가하여 게임을 즐겨보세요!
            </p>
            <img
              src="/assets/discord-logo.png"
              alt="Discord"
              className="mx-auto cursor-pointer hover:opacity-90"
              onClick={() => window.open("https://discord.gg/2Ah2ktBp")}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
