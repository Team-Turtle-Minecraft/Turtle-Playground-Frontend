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

      <div className="relative w-full">
        <div className="flex justify-center h-48 sm:h-64 md:h-80 lg:h-[310px] bg-gray-200 overflow-hidden">
          <img
            src="/assets/turtle-playground-banner.png"
            alt="랭킹 배너"
            className="object-contain w-full h-full"
          />
          <div className="absolute flex items-center bottom-2 sm:bottom-4 left-4 sm:left-8 md:left-16 lg:left-20">
            <img
              src="/assets/ranking-logo.png"
              alt="랭킹"
              className="w-12 h-12 mr-2 sm:w-16 sm:h-16 md:w-20 md:h-20 sm:mr-4"
            />
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">랭킹</h1>
          </div>
        </div>
      </div>

      <main className="container flex-grow px-4 py-4 mx-auto mb-20 sm:py-6 md:py-8 sm:mb-28 md:mb-36">
        <RankingNavigation />
        {children}
      </main>

      <Footer />
    </div>
  );
}
