// components/ranking/RankingLayout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RankingNavigation from "./RankingNavigation";

interface RankingLayoutProps {
  children: React.ReactNode;
}

export default function RankingLayout({ children }: RankingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="relative">
        <div className="flex justify-center h-[310px] bg-gray-200">
          <img
            src="/assets/turtle-playground-banner.png"
            alt="랭킹 배너"
            className="h-full"
          />
          <div className="absolute flex items-center bottom-4 left-20">
            <img
              src="/assets/ranking-logo.png"
              alt="랭킹"
              className="w-[68px] h-[68px] mr-4"
            />
            <h1 className="text-[50px] font-bold">랭킹</h1>
          </div>
        </div>
      </div>

      <main className="container flex-grow px-4 py-8 mx-auto mb-36">
        {/* 네비게이션 */}
        <RankingNavigation />

        {/* 페이지 컨텐츠 */}
        {children}
      </main>

      <Footer />
    </div>
  );
}
