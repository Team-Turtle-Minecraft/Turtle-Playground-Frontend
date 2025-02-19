"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentPage from "@/components/contents/ContentsIntro";
import Navigation from "@/components/contents/ContentNavigation";
import ContentSkeletonLoading from "@/components/skeleton/ContentSkeletonLoading";

export default function StorySystem() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      const images = [
        "/assets/story-01.png",
        "/assets/story-02.png",
        "/assets/story-03.png",
        "/assets/story-04.gif",
      ];

      try {
        await Promise.all(
          images.map(
            (src) =>
              new Promise((resolve) => {
                const imgElement = document.createElement("img");
                imgElement.src = src;
                imgElement.onload = () => resolve(true);
                imgElement.onerror = () => resolve(false); // 이미지 로드 실패해도 진행
              })
          )
        );
      } catch (error) {
        console.warn("Some images failed to preload:", error);
      } finally {
        // 일정 시간 후에도 강제로 로딩 완료
        const timeoutId = setTimeout(() => {
          setLoading(false);
        }, 3000); // 3초 후 타임아웃

        setLoading(false);
        return () => clearTimeout(timeoutId);
      }
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
              title="Story System"
              koreanTitle="스토리 시스템"
              images={[
                "/assets/story-01.png",
                "/assets/story-02.png",
                "/assets/story-03.png",
                "/assets/story-04.gif",
              ]}
              mainTitle={
                <>
                  잊혀진 신들의 <br />
                  이야기를 찾아서
                </>
              }
              leftDescription={[
                "드라비엘 마을의 사제로부터 전해받은 세상의 신화가 담긴 책... 그러나 책의 뒷부분은 읽을 수 없었습니다. 고대 신들의 이야기를 찾아 떠나는 놀라운 모험이 시작됩니다!",
              ]}
              rightDescription={[
                "스토리를 진행하며 신들의 이야기를 알아보고 세상의 비밀에 한 걸음 다가가세요!",
                "거북이 놀이터는 진실을 찾아 모험을 떠날 모험가 분들을 기다립니다!",
              ]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
