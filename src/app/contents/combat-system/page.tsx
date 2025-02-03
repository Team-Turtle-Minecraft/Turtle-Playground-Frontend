// src/app/contents/combat-system/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentPage from "@/components/contents/ContentsIntro";
import Navigation from "@/components/contents/ContentNavigation";

export default function CombatSystem() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Max width container for 1920px screens */}
        <div className="max-w-[1920px] mx-auto w-full px-4 md:px-6 xl:px-8">
          <div className="relative flex justify-center">
            {/* Content wrapper with responsive width */}
            <div className="w-full max-w-[946px] mx-auto">
              <ContentPage
                title="Combat System"
                koreanTitle="전투 시스템"
                subtitle="전직과 스킬업, 보스 레이드까지!"
                description={[
                  "거북이 놀이터는 유저들이 원하는 스타일의 스킬을 가진 직업을 고를 수 있습니다.",
                  "이후 던전에서 솔로 또는 파티로 보스 몬스터와 전투할 수 있습니다.",
                ]}
                features={[
                  "전직 레벨 조건 기술",
                  "스킬 포인트(?) 획득 경로 기술",
                  "몇 개의 던전에서 여러 가지 패턴 공격을 가진 보스와 전투 가능",
                ]}
                images={[
                  "/assets/discord-logo.png",
                  "/assets/turtle-playground-banner.png",
                  "/assets/turtle-playground-logo.png",
                ]}
              />
            </div>
            {/* Navigation - positioned based on screen size */}
            <div className="hidden lg:block absolute lg:right-8 xl:right-[calc((100%-946px)/2-200px)] top-[92px]">
              <Navigation />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
