"use client";

import { useRef, useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import HomeSkeletonLoading from "@/components/skeleton/HomeSkeletonLoading";
import { getUserCount } from "@/apis/api/getUserCount";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const discordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preloadImages = async () => {
      const images = [
        `${process.env.ASSET_PREFIX}/front/assets/turtle-playground-banner.png`,
        `${process.env.ASSET_PREFIX}/front/assets/story-thumbnail.png`,
        `${process.env.ASSET_PREFIX}/front/assets/content/achievement.png`,
        `${process.env.ASSET_PREFIX}/front/assets/combat-thumbnail.png`,
        `${process.env.ASSET_PREFIX}/front/assets/content/living.png`,
        `${process.env.ASSET_PREFIX}/front/assets/turtle-playground-discord.png`,
      ];

      try {
        await Promise.all(
          images.map(
            (src) =>
              new Promise((resolve) => {
                const img = document.createElement("img");
                img.src = src;
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
              })
          )
        );
      } catch (error) {
        console.warn("Some images failed to preload:", error);
      } finally {
        const timeoutId = setTimeout(() => setLoading(false), 3000);
        setLoading(false);
        return () => clearTimeout(timeoutId);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await getUserCount();
        setUserCount(response.countOfUsers);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDiscord = () => {
    discordRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <HomeSkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="w-full h-px bg-gray-200" />

      <main className="flex-grow">
        {/* Banner Section - 반응형 높이 조정 */}
        <section className="relative w-full h-[300px] md:h-[450px] lg:h-[651px]">
          <div className="relative w-full h-full">
            <Image
              src={`${process.env.ASSET_PREFIX}/front/assets/turtle-playground-banner02.png`}
              alt="거북이 놀이터 배너"
              fill
              sizes="100vw"
              priority
              style={{
                objectFit: "contain",
                backgroundColor: "#e5e7eb",
              }}
            />
          </div>

          {/* 반응형 버튼 크기 및 간격 조정 */}
          <div className="absolute z-10 flex flex-col space-y-2 transform -translate-x-1/2 md:flex-row md:space-y-0 md:space-x-4 bottom-4 md:bottom-8 left-1/2">
            <button
              onClick={scrollToContent}
              className="px-4 py-2 text-sm transition-colors bg-white rounded-full shadow-md md:text-base md:px-6 hover:bg-gray-50"
            >
              게임 컨텐츠 살펴보기
            </button>
            <button
              onClick={scrollToDiscord}
              className="px-4 py-2 text-sm transition-colors bg-white rounded-full shadow-md md:text-base md:px-6 hover:bg-gray-50"
            >
              서버에 참여하기
            </button>
          </div>
        </section>

        {/* Grid Section - 반응형 그리드 레이아웃 */}
        <section
          ref={contentRef}
          className="container px-4 py-8 mx-auto md:px-6 md:py-12 scroll-mt-20"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
            {[
              {
                src: `${process.env.ASSET_PREFIX}/front/assets/story-thumbnail.png`,
                alt: "스토리 시스템",
                title: "컨텐츠 소개 - 스토리",
                href: "/contents/story-system",
              },
              {
                src: `${process.env.ASSET_PREFIX}/front/assets/achievement-thumbnail.png`,
                alt: "도전과제 시스템",
                title: "컨텐츠 소개 - 도전과제",
                href: "/contents/achievement-system",
              },
              {
                src: `${process.env.ASSET_PREFIX}/front/assets/combat-thumbnail.png`,
                alt: "전투 시스템",
                title: "컨텐츠 소개 - 전투",
                href: "/contents/combat-system",
              },
              {
                src: `${process.env.ASSET_PREFIX}/front/assets/living-thumbnail.png`,
                alt: "생활 시스템",
                title: "컨텐츠 소개 - 생활",
                href: "/contents/living-system",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative p-2 overflow-hidden bg-gray-100 cursor-pointer md:p-4 group"
                onClick={() => (window.location.href = item.href)}
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-black/50 backdrop-blur-sm">
                  <h3 className="text-base font-bold text-white md:text-lg">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discord Section - 반응형 텍스트 및 이미지 크기 */}
        <section
          ref={discordRef}
          className="py-8 text-center bg-white md:py-12 scroll-mt-20"
        >
          <div className="max-w-2xl px-4 mx-auto md:px-6">
            <p className="mb-2 text-sm md:text-base md:mb-4">
              거북이 놀이터 서비스는 일부 공개되어 운영됩니다!
            </p>
            <p className="mb-4 text-sm md:text-base md:mb-8">
              공식 디스코드 서버에 참가하여 게임을 즐겨보세요!
            </p>
            <div className="relative">
              <div className="inline-block p-2 mt-4 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium md:text-base">
                  현재 참여 인원:{" "}
                  <span className="font-bold text-blue-600">
                    {userCount !== null ? `${userCount} / 35` : "로딩 중..."}
                  </span>
                </p>
              </div>
              <div className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[600px] aspect-[2/1] mx-auto">
                <Image
                  src={`${process.env.ASSET_PREFIX}/front/assets/turtle-playground-discord.png`}
                  alt="Discord"
                  fill
                  sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 600px"
                  className="object-contain cursor-pointer hover:opacity-90 md:-translate-x-10"
                  onClick={() => window.open("https://discord.gg/dF2zb62J")}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
