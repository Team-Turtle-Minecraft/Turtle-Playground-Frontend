// app/ranking/collection/page.tsx
"use client";

import { useEffect, useState } from "react";
import RankingLayout from "@/components/ranking/RankingLayout";
import { CollectionRankingResponse } from "@/types/collectionRanking";
import { getCollectionRanking } from "@/apis/api/fetchCollectionRanking";

export default function CollectionRankingPage() {
  const [rankingData, setRankingData] =
    useState<CollectionRankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRankingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCollectionRanking();
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

  // DENSE_RANK 순위 계산 함수
  const calculateRank = (index: number, progress: number) => {
    if (!rankingData?.collectionRankers) return 1;

    let rank = 1;
    for (let i = 0; i < index; i++) {
      if (rankingData.collectionRankers[i].progress > progress) {
        rank = i + 1 + 1;
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
      {/* 랭킹 테이블 */}
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-3 py-4 text-center bg-gray-100 border-b">
          <div>순위</div>
          <div>캐릭터 정보</div>
          <div>진행률</div>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="text-gray-500">랭킹 데이터를 불러오는 중...</div>
          </div>
        ) : (
          /* 테이블 바디 */
          <div className="divide-y">
            {rankingData?.collectionRankers &&
            rankingData.collectionRankers.length > 0 ? (
              rankingData.collectionRankers.map((player, index) => (
                <div
                  key={player.playerName}
                  className="grid items-center grid-cols-3 py-6 text-center transition-colors hover:bg-gray-50"
                >
                  <div className="text-2xl font-bold">
                    {calculateRank(index, player.progress)}
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
                  <div className="text-xl font-medium">{player.progress}%</div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-500">
                도감 랭킹 데이터가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </RankingLayout>
  );
}
