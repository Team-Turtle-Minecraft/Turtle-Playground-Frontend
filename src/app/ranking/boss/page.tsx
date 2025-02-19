//app/ranking/boss/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BossRankingSkeletonLoading } from "@/components/skeleton/BossRankingSkeletonLoading";
import {
  BossClearType,
  BossRankingResponse,
  BOSS_MAPPING,
} from "@/types/bossRanking";
import {
  getBossRanking,
  formatClearTime,
  formatClearDay,
  parsePartyMembers,
} from "@/apis/api/fetchBossRanking";
import RankingLayout from "@/components/ranking/RankingLayout";
import Modal from "@/components/common/Modal";

export default function BossRankingPage() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedPlayType, setSelectedPlayType] =
    useState<BossClearType>("Solo");
  const [selectedBoss, setSelectedBoss] =
    useState<string>("고대의 기계 에르지옥스");
  const [rankingData, setRankingData] = useState<BossRankingResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ... (스크롤 관련 핸들러와 useEffect는 그대로 유지)

  const bossList = Object.keys(BOSS_MAPPING);

  const fetchRankingData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    setError(null);
    try {
      const data = await getBossRanking(
        selectedPlayType,
        BOSS_MAPPING[selectedBoss]
      );
      setRankingData(data);
    } catch (err: any) {
      if (
        err.errorCode === "FirstSoloBossClearLogNotFoundError" ||
        err.errorCode === "FirstPartyBossClearLogNotFoundError"
      ) {
        setRankingData(null);
      } else {
        setError("랭킹 데이터를 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [selectedPlayType, selectedBoss]);

  if (isLoading) return <BossRankingSkeletonLoading />;

  return (
    <RankingLayout>
      <div className="space-y-8">
        {/* 플레이 타입 & 보스 선택 섹션 */}
        <div className="space-y-4">
          <div className="flex flex-col border-b sm:flex-row sm:items-center">
            <div className="w-full py-2 font-bold text-center sm:w-24">
              플레이 타입
            </div>
            <div className="flex flex-1">
              {["Solo", "Party"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedPlayType(type as BossClearType)}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-gray-600 ${
                    selectedPlayType === type
                      ? "border-b-2 border-black font-bold text-black"
                      : "hover:text-black"
                  }`}
                >
                  {type === "Solo" ? "솔로" : "파티"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-b sm:flex-row">
            <div className="w-full py-2 font-bold text-center sm:w-24">
              보스
            </div>
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 cursor-grab"
            >
              <div className="flex gap-2 pb-2">
                {bossList.map((boss) => (
                  <button
                    key={boss}
                    onClick={() => setSelectedBoss(boss)}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 text-sm whitespace-nowrap rounded-lg transition-colors ${
                      selectedBoss === boss
                        ? "bg-gray-800 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {boss}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 퍼스트 클리어 섹션 */}
        <div>
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">퍼스트 클리어</h2>
          <div className="p-4 rounded-lg shadow sm:p-6 bg-gray-50">
            {!rankingData && (
              <div className="text-center text-gray-500">
                아직 해당 보스의 클리어 랭킹 기록이 없습니다.
              </div>
            )}

            {selectedPlayType === "Solo" && rankingData?.firstBossClearUser && (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <img
                  src={`https://api.creepernation.net/avatar/${rankingData.firstBossClearUser.playerName}`}
                  alt={rankingData.firstBossClearUser.playerName}
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
                <div className="text-center sm:text-left">
                  <div className="text-base font-medium sm:text-lg">
                    {rankingData.firstBossClearUser.playerName}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    클리어 시간:{" "}
                    {formatClearTime(rankingData.firstBossClearUser.clearTime)}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    클리어 날짜:{" "}
                    {formatClearDay(rankingData.firstBossClearUser.clearDay)}
                  </div>
                </div>
              </div>
            )}

            {selectedPlayType === "Party" &&
              rankingData?.firstBossClearParty && (
                <div className="space-y-4">
                  <div className="text-center sm:text-left">
                    <span className="font-medium">파티명: </span>
                    {rankingData.firstBossClearParty.partyName}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {parsePartyMembers(
                      rankingData.firstBossClearParty.partyMembers
                    ).map((member, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg shadow sm:p-4"
                      >
                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                          <img
                            src={`https://api.creepernation.net/avatar/${member}`}
                            alt={member}
                            className="w-12 h-12 sm:w-16 sm:h-16"
                          />
                          <div className="text-center sm:text-left">
                            <div className="text-sm font-medium sm:text-base">
                              {member}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-center text-gray-500 sm:text-sm sm:text-left">
                    클리어 시간:{" "}
                    {formatClearTime(rankingData.firstBossClearParty.clearTime)}
                  </div>
                  <div className="text-xs text-center text-gray-500 sm:text-sm sm:text-left">
                    클리어 날짜:{" "}
                    {formatClearDay(rankingData.firstBossClearParty.clearDay)}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* 클리어 타임 순위 섹션 */}
        <div>
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            클리어 타임 순위
          </h2>
          <div className="overflow-x-auto rounded-lg shadow bg-gray-50">
            <div className="min-w-full">
              <div className="grid grid-cols-12 py-3 text-sm text-center bg-gray-100 sm:py-4 sm:text-base">
                <div className="col-span-1">순위</div>
                <div className="col-span-2">클리어 시간</div>
                <div className="col-span-7">플레이어</div>
                <div className="col-span-2">클리어 날짜</div>
              </div>

              <div className="divide-y">
                {/* 랭킹 데이터 표시 로직은 여기에 구현 */}
              </div>
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
