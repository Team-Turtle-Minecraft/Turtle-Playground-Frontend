"use client";

import { useEffect, useState } from "react";
import RankingLayout from "@/components/ranking/RankingLayout";
import { LevelRankingResponse } from "@/types/jobLevelRanking";
import { frontToBackJobMapping } from "@/apis/utility/jobMapping";
import { getLevelRanking } from "@/apis/api/fetchJobLevelRanking";

type JobCategory = "전투" | "생활";
type CombatJob = "전사" | "도적" | "궁수" | "마법사";
type LifeJob = "광부" | "어부" | "농부" | "요리사" | "대장장이";
type Job = CombatJob | LifeJob;

export default function LevelRankingPage() {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>("전투");
  const [selectedJob, setSelectedJob] = useState<Job>("전사");
  const [rankingData, setRankingData] = useState<LevelRankingResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jobsByCategory = {
    전투: ["전사", "도적", "궁수", "마법사"] as CombatJob[],
    생활: ["광부", "어부", "농부", "요리사", "대장장이"] as LifeJob[],
  };

  const fetchRankingData = async () => {
    setIsLoading(true);
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

  // DENSE_RANK 순위 계산 함수
  const calculateRank = (index: number, level: number) => {
    if (!rankingData?.rankers) return 1;

    // 현재까지의 순위를 계산
    let rank = 1;
    for (let i = 0; i < index; i++) {
      if (rankingData.rankers[i].level > level) {
        rank = i + 1 + 1; // i는 0부터 시작하므로 +1, 그리고 다음 순위이므로 한번 더 +1
      }
    }

    return rank;
  };

  if (error) {
    return (
      <RankingLayout>
        <div className="text-center text-red-600">{error}</div>
      </RankingLayout>
    );
  }

  return (
    <RankingLayout>
      {/* 직업 선택 네비게이션 */}
      <div className="mb-8">
        {/* 상위 카테고리 네비게이션 */}
        <div className="flex mb-1 border-b">
          <div className="w-24 py-2 font-bold text-center">직업 분류</div>
          <div className="flex flex-1">
            {["전투", "생활"].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category as JobCategory)}
                className={`px-6 py-2 text-gray-600 ${
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

        {/* 하위 직업 네비게이션 */}
        <div className="flex border-b">
          <div className="w-24 py-2 font-bold text-center">직업</div>
          <div className="flex flex-1">
            {jobsByCategory[selectedCategory].map((job) => (
              <button
                key={job}
                onClick={() => setSelectedJob(job)}
                className={`px-6 py-2 text-gray-600 ${
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
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-3 py-4 text-center bg-gray-100 border-b">
          <div>순위</div>
          <div>캐릭터 정보</div>
          <div>{selectedJob} 레벨</div>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="text-gray-500">랭킹 데이터를 불러오는 중...</div>
          </div>
        ) : (
          /* 테이블 바디 */
          <div className="divide-y">
            {rankingData?.rankers && rankingData.rankers.length > 0 ? (
              rankingData.rankers.map((player, index) => (
                <div
                  key={player.playerName}
                  className="grid items-center grid-cols-3 py-6 text-center transition-colors hover:bg-gray-50"
                >
                  <div className="text-2xl font-bold">
                    {calculateRank(index, player.level)}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={`https://api.creepernation.net/avatar/${player.playerName}`}
                      alt={player.playerName}
                      className="w-[110px] h-[103.96px] flex-shrink-0"
                    />
                    <div className="min-w-[120px] max-w-[200px] px-2 text-lg break-words">
                      {player.playerName}
                    </div>
                  </div>
                  <div className="text-xl font-medium">{player.level}</div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-500">
                아직 {selectedJob} 랭킹 데이터가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </RankingLayout>
  );
}
