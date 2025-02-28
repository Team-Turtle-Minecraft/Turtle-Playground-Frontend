// app/ranking/collection/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RankingLayout from "@/components/ranking/RankingLayout";
import { CollectionRankingResponse } from "@/types/collectionRanking";
import { getCollectionRanking } from "@/apis/api/fetchCollectionRanking";
import { CollectionRankingSkeletonLoading } from "@/components/skeleton/CollectionRankingLoading";
import Modal from "@/components/common/Modal";

export default function CollectionRankingPage() {
  const router = useRouter();
  const [rankingData, setRankingData] =
    useState<CollectionRankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchRankingData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

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

  const calculateRank = (
    index: number,
    players: CollectionRankingResponse["collectionRankers"]
  ) => {
    if (index === 0) return 1;

    const currentProgress = players[index].progress;
    const previousProgress = players[index - 1].progress;

    if (currentProgress === previousProgress) {
      return calculateRank(index - 1, players);
    }

    return index + 1;
  };

  if (isLoading) {
    return <CollectionRankingSkeletonLoading />;
  }

  return (
    <RankingLayout>
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-3 py-3 text-sm text-center bg-gray-100 border-b sm:py-4 sm:text-base">
          <div>순위</div>
          <div>캐릭터 정보</div>
          <div>진행률</div>
        </div>

        <div className="divide-y">
          {rankingData?.collectionRankers &&
          rankingData.collectionRankers.length > 0 ? (
            rankingData.collectionRankers.map((player, index) => (
              <div
                key={player.playerName}
                className="grid items-center grid-cols-3 py-4 text-center transition-colors sm:py-6 hover:bg-gray-50"
              >
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  {calculateRank(index, rankingData.collectionRankers)}
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
                <div className="text-base font-medium sm:text-lg">
                  {player.progress}%
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 sm:py-16">
              도감 랭킹 데이터가 없습니다.
            </div>
          )}
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
