// app/ranking/money/page.tsx
"use client";

import { useEffect, useState } from "react";
import RankingLayout from "@/components/ranking/RankingLayout";
import { MoneyRankingResponse } from "@/types/moneyRanking";
import { getMoneyRanking } from "@/apis/api/fetchMoneyRanking";
import { MoneyRankingSkeletonLoading } from "@/components/skeleton/MoneyRankingSkeletonLoading";

export default function MoneyRankingPage() {
  const [rankingData, setRankingData] = useState<MoneyRankingResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRankingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMoneyRanking();
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
  }, []);

  if (isLoading) {
    return <MoneyRankingSkeletonLoading />;
  }

  if (error) {
    return (
      <RankingLayout>
        <div className="text-center text-red-600">{error}</div>
      </RankingLayout>
    );
  }

  return (
    <RankingLayout>
      {/* 랭킹 테이블 */}
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-2 py-4 text-center bg-gray-100 border-b">
          <div>순위</div>
          <div>캐릭터 정보</div>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="text-gray-500">랭킹 데이터를 불러오는 중...</div>
          </div>
        ) : (
          <>
            {/* 테이블 바디 */}
            <div className="divide-y">
              {rankingData?.moneyRankers &&
              rankingData.moneyRankers.length > 0 ? (
                rankingData.moneyRankers.map((playerName, index) => (
                  <div
                    key={playerName}
                    className="grid items-center grid-cols-2 py-6 text-center transition-colors hover:bg-gray-50"
                  >
                    <div className="text-2xl font-bold">{index + 1}</div>
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={`https://api.creepernation.net/avatar/${playerName}`}
                        alt={playerName}
                        className="w-[110px] h-[103.96px] flex-shrink-0"
                      />
                      <div className="min-w-[120px] max-w-[200px] px-2 text-lg break-words">
                        {playerName}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-500">
                  돈 랭킹 데이터가 없습니다.
                </div>
              )}
            </div>

            {/* 안내 메시지 */}
            <div className="p-4 mt-4 text-sm text-gray-600 bg-gray-100 rounded-b">
              * 과도한 경쟁을 방지하기 위해 정확한 보유 금액은 공개하지
              않습니다.
            </div>
          </>
        )}
      </div>
    </RankingLayout>
  );
}
