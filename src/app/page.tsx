"use client";

import { useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
        <section className="relative w-full h-[651px] bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold">배너</h1>
          </div>
          <div className="absolute flex space-x-4 transform -translate-x-1/2 bottom-8 left-1/2">
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
            <div className="p-4 bg-gray-100 aspect-video">
              <h3 className="text-lg font-bold">컨텐츠 소개 - 도전과제</h3>
            </div>
            <div className="p-4 bg-gray-100 aspect-video">
              <h3 className="text-lg font-bold">컨텐츠 소개 - 던전</h3>
            </div>
            <div className="p-4 bg-gray-100 aspect-video">
              <h3 className="text-lg font-bold">컨텐츠 소개 - 퀘스트</h3>
            </div>
            <div className="p-4 bg-gray-200 aspect-video">
              <h3 className="text-lg font-bold">컨텐츠 소개 - 퀘스트</h3>
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
