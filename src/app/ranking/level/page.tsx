//app/ranking/level/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RankingLayout from "@/components/ranking/RankingLayout";
import { LevelRankingResponse } from "@/types/jobLevelRanking";
import { frontToBackJobMapping } from "@/apis/utility/jobMapping";
import { getLevelRanking } from "@/apis/api/fetchJobLevelRanking";
import { LevelRankingSkeletonLoading } from "@/components/skeleton/LevelRankingSkeletonLoading";
import Modal from "@/components/common/Modal";

type JobCategory = "전투" | "생활";
type CombatJob = "전사" | "도적" | "궁수" | "마법사";
type LifeJob = "광부" | "어부" | "농부" | "요리사" | "대장장이";
type Job = CombatJob | LifeJob;

export default function LevelRankingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>("전투");
  const [selectedJob, setSelectedJob] = useState<Job>("전사");
  const [rankingData, setRankingData] = useState<LevelRankingResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const jobsByCategory = {
    전투: ["전사", "도적", "궁수", "마법사"] as CombatJob[],
    생활: ["광부", "어부", "농부", "요리사", "대장장이"] as LifeJob[],
  };

  const fetchRankingData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    setError(null);
    try {
      const jobType = frontToBackJobMapping[selectedCategory];
      const jobName = frontToBackJobMapping[selectedJob];
      const data = await getLevelRanking(jobType, jobName);
      setRankingData(data);
    } catch (err) {
      setError("랭킹 데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [selectedCategory, selectedJob]);

  const handleCategoryChange = (category: JobCategory) => {
    setSelectedCategory(category);
    setSelectedJob(jobsByCategory[category][0]);
  };

  if (isLoading) {
    return <LevelRankingSkeletonLoading />;
  }

  return (
    <RankingLayout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* 직업 분류 & 직업 선택 섹션 */}
        <div className="space-y-4">
          <div className="flex flex-col border-b sm:flex-row sm:items-center">
            <div className="w-full py-2 font-bold text-center sm:w-24">
              직업 분류
            </div>
            <div className="flex flex-wrap flex-1 sm:flex-nowrap">
              {["전투", "생활"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category as JobCategory)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2 text-sm sm:text-base text-gray-600 
                    ${
                      selectedCategory === category
                        ? "border-b-2 border-black font-bold text-black"
                        : "hover:text-black"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-b sm:flex-row">
            <div className="w-full py-2 font-bold text-center sm:w-24">
              직업
            </div>
            <div className="flex flex-wrap flex-1 sm:flex-nowrap">
              {jobsByCategory[selectedCategory].map((job) => (
                <button
                  key={job}
                  onClick={() => setSelectedJob(job)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2 text-sm sm:text-base text-gray-600 
                    ${
                      selectedJob === job
                        ? "border-b-2 border-black font-bold text-black"
                        : "hover:text-black"
                    }`}
                >
                  {job}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 랭킹 테이블 */}
        <div className="overflow-x-auto rounded-lg shadow bg-gray-50">
          <div className="min-w-full">
            <div className="grid grid-cols-3 py-3 text-sm text-center bg-gray-100 border-b sm:py-4 sm:text-base">
              <div>순위</div>
              <div>캐릭터 정보</div>
              <div>{selectedJob} 레벨</div>
            </div>

            <div className="divide-y">
              {rankingData?.rankers && rankingData.rankers.length > 0 ? (
                rankingData.rankers.map((player, index) => (
                  <div
                    key={player.playerName}
                    className="grid items-center grid-cols-3 py-4 text-center transition-colors sm:py-6 hover:bg-gray-50"
                  >
                    <div className="text-lg font-bold sm:text-xl md:text-2xl">
                      {index + 1}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full max-w-md gap-2 mx-auto sm:flex-row sm:gap-4">
                      <img
                        src={`https://api.creepernation.net/avatar/${player.playerName}`}
                        alt={player.playerName}
                        className="w-16 h-16 sm:w-[110px] sm:h-[103.96px] flex-shrink-0"
                      />
                      <div className="min-w-0 w-full sm:w-[120px] px-2 text-sm sm:text-lg truncate">
                        {player.playerName}
                      </div>
                    </div>
                    <div className="text-base font-medium sm:text-lg md:text-xl">
                      {player.level}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500 sm:py-16 md:py-20">
                  아직 {selectedJob} 랭킹 데이터가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          router.push("/auth");
        }}
        message="로그인을 먼저 진행해주세요!"
      />
    </RankingLayout>
  );
}
