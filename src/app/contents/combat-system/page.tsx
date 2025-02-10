import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentPage from "@/components/contents/ContentsIntro";
import Navigation from "@/components/contents/ContentNavigation";

export default function CombatSystem() {
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
              title="Combat System"
              koreanTitle="전투 시스템"
              images={[
                "/assets/discord-logo.png",
                "/assets/turtle-playground-banner.png",
                "/assets/turtle-playground-logo.png",
              ]}
              mainTitle="전직과 보스 레이드로 스펙업까지!"
              leftDescription={[
                "거북이 놀이터에서 유저분들은 원하는 스타일의 스킬을 가진 직업을 고를 수 있습니다.",
                "이후 던전에서 솔로 또는 파티를 꾸려 보스 몬스터와 전투할 수 있습니다.",
              ]}
              rightDescription={[
                "각각의 보스 몬스터는 고유한 공격 패턴을 지니고 있습니다! 즉사 패턴도 있으니 조심하세요..!",
                "보스 몬스터를 무찌르면 일정 확률로 '룬'을 얻어 새로운 스킬을 획득할 수 있습니다.",
                "여러 보스 몬스터와의 전투로 모험가님의 전투직업에 해당하는 다양한 스킬들을 해금해보세요!",
              ]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
