// app/ranking/money/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RankingLayout from "@/components/ranking/RankingLayout";
import { MoneyRankingResponse } from "@/types/moneyRanking";
import { getMoneyRanking } from "@/apis/api/fetchMoneyRanking";
import { MoneyRankingSkeletonLoading } from "@/components/skeleton/MoneyRankingSkeletonLoading";
import Modal from "@/components/common/Modal";

export default function MoneyRankingPage() {
  const router = useRouter();
  const [rankingData, setRankingData] = useState<MoneyRankingResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const calculateRank = (
    index: number,
    rankers: MoneyRankingResponse["moneyRankers"]
  ) => {
    if (index === 0) return 1;

    const currentMoney = rankers[index].money;
    const previousMoney = rankers[index - 1].money;

    if (currentMoney === previousMoney) {
      return calculateRank(index - 1, rankers);
    }

    return index + 1;
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

  return (
    <RankingLayout>
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-2 py-3 text-sm text-center bg-gray-100 border-b sm:py-4 sm:text-base">
          <div>순위</div>
          <div>캐릭터 정보</div>
        </div>

        <div className="divide-y">
          {rankingData?.moneyRankers && rankingData.moneyRankers.length > 0 ? (
            rankingData.moneyRankers.map((ranker, index) => (
              <div
                key={ranker.playerName}
                className="grid items-center grid-cols-2 py-4 text-center transition-colors sm:py-6 hover:bg-gray-50"
              >
                <div className="text-lg font-bold sm:text-xl md:text-2xl">
                  {calculateRank(index, rankingData.moneyRankers)}
                </div>
                <div className="flex flex-col items-center justify-center w-full max-w-md gap-2 mx-auto sm:flex-row sm:gap-4">
                  <img
                    src={`https://api.creepernation.net/avatar/${ranker.playerName}`}
                    alt={ranker.playerName}
                    className="w-16 h-16 sm:w-[110px] sm:h-[103.96px] flex-shrink-0"
                  />
                  <div className="min-w-0 w-full sm:w-[120px] px-2 text-sm sm:text-lg truncate">
                    {ranker.playerName}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 sm:py-16">
              돈 랭킹 데이터가 없습니다.
            </div>
          )}
        </div>

        <div className="p-3 mt-4 text-xs text-gray-600 bg-gray-100 rounded-b sm:p-4 sm:text-sm">
          * 과도한 경쟁을 방지하기 위해 정확한 보유 금액은 공개하지 않습니다.
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
