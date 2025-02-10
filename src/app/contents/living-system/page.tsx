// src/app/contents/living-system/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentPage from "@/components/contents/ContentsIntro";
import Navigation from "@/components/contents/ContentNavigation";

export default function LivingSystem() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1920px] mx-auto relative pt-[92px]">
          <div className="hidden lg:block absolute right-32 top-[200px]">
            <Navigation />
          </div>
          <div className="w-full max-w-[946px] mx-auto mb-28">
            <ContentPage
              title="Living System"
              koreanTitle="생활 시스템"
              images={[
                "/assets/living-system-1.png",
                "/assets/living-system-2.png",
                "/assets/living-system-3.png",
              ]}
              mainTitle={
                <>
                  여러가지 직업을 <br />
                  통한 경제 활동
                </>
              }
              leftDescription={[
                "여러가지 생활직업의 레벨을 올리고 직업의 특성을 이용하여 자본을 획득하고 상황에 맞게 사용해보세요!",
              ]}
              rightDescription={[
                "거북이 놀이터에는 전투 직업 뿐만 아니라 광부, 농부, 어부, 요리사, 대장장이 같은 생활 직업이 존재합니다.",
                "각각의 직업은 별도의 레벨을 가집니다. 직업 레벨을 올려 상황에 맞게 효율적으로 경제 활동에 참여해보세요!",
                "꼭 모든 생활직업의 레벨을 마스터할 필요는 없을 수도 있습니다.",
              ]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
