// src/app/contents/achievement-system/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentPage from "@/components/contents/ContentsIntro";
import Navigation from "@/components/contents/ContentNavigation";
import ContentSkeletonLoading from "@/components/skeleton/ContentSkeletonLoading";

export default function AchievementSystem() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      const images = [
        "/assets/achievement-01.gif",
        "/assets/achievement-02.gif",
        "/assets/achievement-03.gif",
        "/assets/achievement-04.gif",
      ];

      try {
        await Promise.all(
          images.map(
            (src) =>
              new Promise((resolve) => {
                const imgElement = document.createElement("img");
                imgElement.src = src;
                imgElement.onload = () => resolve(true);
                imgElement.onerror = () => resolve(false);
              })
          )
        );
      } catch (error) {
        console.warn("Some images failed to preload:", error);
      }

      // setTimeout으로 최소 로딩 시간 보장
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1초로 줄임
    };

    preloadImages();
  }, []);

  if (loading) {
    return <ContentSkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="w-full h-px bg-gray-200"></div>

      <main className="flex-grow bg-white">
        <div className="max-w-[1920px] mx-auto relative pt-[92px]">
          <div className="hidden lg:block absolute right-32 top-[200px]">
            <Navigation />
          </div>
          <div className="w-full max-w-[946px] mx-auto mb-28">
            <ContentPage
              title="Achievement System"
              koreanTitle="도전과제 시스템"
              images={[
                "/assets/achievement-01.gif",
                "/assets/achievement-02.gif",
                "/assets/achievement-03.gif",
                "/assets/achievement-04.gif",
              ]}
              imageDescriptions={[
                "사진1 - 프롤로그 중 보라색 블럭과의 상호작용1",
                "사진2 - 프롤로그 중 보라색 블럭과의 상호작용2",
                "사진3 - 도전과제 예시",
                "사진4 - 도전과제 보상",
              ]}
              mainTitle={
                <>
                  여기에... 뭔가.. <br />
                  있을거 같은데..?
                </>
              }
              leftDescription={[
                "모험 중 조금 쉬어갈 수 있도록 월드 전체에 특별한 장치들을 숨겨두었습니다!",
              ]}
              rightDescription={[
                "튜토리얼에서 보라색 블럭과의 특별한 상호작용에 대해서 알아볼 수 있습니다.",
                "이후 모험 중 보라색 블럭을 발견한다면 근처에 기믹이 숨겨져 있다는 표식입니다.",
                "근처 블럭 또는 사물들과 상호작용하여 기믹을 풀고 보상을 획득해보세요!",
                "상호작용 방법에는 우클릭 뿐만이 아니랍니다. 채팅이라던가... 또 다른 방법이 있겠죠..!",
              ]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
