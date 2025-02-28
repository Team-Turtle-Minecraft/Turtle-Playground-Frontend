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

  const handlePlayTypeChange = (type: BossClearType) => {
    setSelectedPlayType(type);
    setSelectedBoss("고대의 기계 에르지옥스"); // 플레이 타입 변경 시 기본 보스로 재설정
  };

  const hasNoRankingData =
    (!rankingData?.firstBossClearUser && !rankingData?.firstBossClearParty) ||
    (!rankingData?.soloClearTimeRankers &&
      !rankingData?.bossClearTimeRankerParties);

  const hasOnlyFirstClear =
    rankingData &&
    ((selectedPlayType === "Solo" &&
      rankingData.firstBossClearUser &&
      (!rankingData.soloClearTimeRankers ||
        rankingData.soloClearTimeRankers.length === 0)) ||
      (selectedPlayType === "Party" &&
        rankingData.firstBossClearParty &&
        (!rankingData.bossClearTimeRankerParties ||
          rankingData.bossClearTimeRankerParties.length === 0)));

  const bossList = Object.keys(BOSS_MAPPING);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
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
      const data = await getBossRanking(
        selectedPlayType,
        BOSS_MAPPING[selectedBoss]
      );
      setRankingData(data);
    } catch (err: any) {
      const errorObj = {
        errorCode: err?.errorCode || "UnknownError",
        message: err?.message || "알 수 없는 오류가 발생했습니다.",
        status: err?.status || 500,
      };

      // 클리어 기록이 없는 경우
      if (
        errorObj.errorCode === "FirstSoloBossClearLogNotFoundError" ||
        errorObj.errorCode === "FirstPartyBossClearLogNotFoundError"
      ) {
        setRankingData(null);
        return;
      }

      // 토큰 관련 에러
      if (
        errorObj.errorCode === "ExpiredAccessTokenError" ||
        errorObj.errorCode === "TokenRefreshError" ||
        errorObj.errorCode === "NoTokenError"
      ) {
        setShowLoginModal(true);
        setRankingData(null);
        return;
      }

      // 유효하지 않은 요청 에러
      if (errorObj.errorCode === "NotValidRequestError") {
        setError("유효하지 않은 요청입니다. 페이지를 새로고침 해주세요.");
        setRankingData(null);
        console.error("보스 랭킹 조회 실패:", errorObj);
        return;
      }

      // 그 외의 에러
      setError(errorObj.message);
      console.error("보스 랭킹 조회 실패:", errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [selectedPlayType, selectedBoss]);

  if (isLoading) {
    return <BossRankingSkeletonLoading />;
  }

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
                  onClick={() => handlePlayTypeChange(type as BossClearType)}
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
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
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
            {hasNoRankingData ? (
              <div className="text-center text-gray-500">
                아직 해당 보스에 대한 클리어 기록이 없습니다.
              </div>
            ) : (
              <>
                {selectedPlayType === "Solo" &&
                  rankingData?.firstBossClearUser && (
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
                          {formatClearTime(
                            rankingData.firstBossClearUser.clearTime
                          )}
                        </div>
                        <div className="text-xs text-gray-500 sm:text-sm">
                          클리어 날짜:{" "}
                          {formatClearDay(
                            rankingData.firstBossClearUser.clearDay
                          )}
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
                        {formatClearTime(
                          rankingData.firstBossClearParty.clearTime
                        )}
                      </div>
                      <div className="text-xs text-center text-gray-500 sm:text-sm sm:text-left">
                        클리어 날짜:{" "}
                        {formatClearDay(
                          rankingData.firstBossClearParty.clearDay
                        )}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 클리어 타임 순위 섹션 */}
      <div className="mt-8 sm:mt-12 md:mt-16">
        {" "}
        {/* 상단 여백 증가 */}
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">클리어 타임 순위</h2>
        <div className="overflow-x-auto rounded-lg shadow bg-gray-50">
          {hasNoRankingData ? (
            <div className="p-8 text-center text-gray-500">
              아직 해당 보스에 대한 클리어 기록이 없습니다.
            </div>
          ) : hasOnlyFirstClear ? (
            <div className="p-8 text-center text-gray-500">
              퍼스트 클리어에 대한 기록은 클리어 타임 순위에 반영되지 않습니다.
            </div>
          ) : (
            <div className="min-w-full">
              <div className="grid grid-cols-12 py-3 text-sm text-center bg-gray-100 sm:py-4 sm:text-base">
                <div className="col-span-1">순위</div>
                <div className="col-span-2">클리어 시간</div>
                <div className="col-span-7">
                  {selectedPlayType === "Solo" ? "플레이어" : "파티"}
                </div>
                <div className="col-span-2">클리어 날짜</div>
              </div>

              <div className="divide-y">
                {selectedPlayType === "Solo"
                  ? rankingData?.soloClearTimeRankers?.map((ranker) => (
                      <div
                        key={ranker.playerName}
                        className="grid items-center grid-cols-12 py-4 text-center sm:py-6 hover:bg-gray-50"
                      >
                        <div className="col-span-1 text-lg font-bold sm:text-xl">
                          {ranker.rankPosition}
                        </div>
                        <div className="col-span-2">
                          {formatClearTime(ranker.clearTime)}
                        </div>
                        <div className="col-span-7">
                          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                            <img
                              src={`https://api.creepernation.net/avatar/${ranker.playerName}`}
                              alt={ranker.playerName}
                              className="w-12 h-12 sm:w-16 sm:h-16"
                            />
                            <div className="text-sm font-medium sm:text-base">
                              {ranker.playerName}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-sm text-gray-600">
                          {formatClearDay(ranker.clearDay)}
                        </div>
                      </div>
                    ))
                  : rankingData?.bossClearTimeRankerParties?.map((party) => (
                      <div
                        key={party.partyName}
                        className="grid items-center grid-cols-12 py-4 text-center sm:py-6 hover:bg-gray-50"
                      >
                        <div className="col-span-1 text-lg font-bold sm:text-xl">
                          {party.rankPosition}
                        </div>
                        <div className="col-span-2">
                          {formatClearTime(party.clearTime)}
                        </div>
                        {/* 파티 멤버 표시 부분 */}
                        <div className="col-span-7">
                          <div className="space-y-3">
                            <div className="font-medium">{party.partyName}</div>
                            <div className="flex justify-center">
                              <div className="inline-flex gap-2 sm:gap-3 md:gap-4">
                                {parsePartyMembers(party.partyMembers).map(
                                  (member, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center space-y-1"
                                    >
                                      <img
                                        src={`https://api.creepernation.net/avatar/${member}`}
                                        alt={member}
                                        className="w-8 h-8 sm:w-10 sm:h-10"
                                        title={member}
                                      />
                                      <span className="text-xs text-gray-600 truncate max-w-[80px] sm:max-w-[100px]">
                                        {member}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-sm text-gray-600">
                          {formatClearDay(party.clearDay)}
                        </div>
                      </div>
                    ))}
              </div>
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
