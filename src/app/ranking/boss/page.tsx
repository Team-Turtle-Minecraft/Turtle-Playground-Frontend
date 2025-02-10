"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function BossRankingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  useEffect(() => {
    const handleMouseLeave = () => setIsDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const [selectedPlayType, setSelectedPlayType] =
    useState<BossClearType>("Solo");
  const [selectedBoss, setSelectedBoss] =
    useState<string>("고대의 기계 에르지옥스");
  const [rankingData, setRankingData] = useState<BossRankingResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bossList = Object.keys(BOSS_MAPPING);

  const fetchRankingData = async () => {
    setIsLoading(true);
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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [selectedPlayType, selectedBoss]);

  useEffect(() => {
    console.log("Current ranking data:", rankingData);
  }, [rankingData]);

  if (isLoading) {
    return <BossRankingSkeletonLoading />;
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
      {/* 보스 선택 네비게이션 */}
      <div className="mb-8">
        {/* 플레이 타입 선택 */}
        <div className="flex mb-1 border-b">
          <div className="w-24 py-2 font-bold text-center">플레이 타입</div>
          <div className="flex flex-1">
            {["Solo", "Party"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPlayType(type as BossClearType)}
                className={`px-6 py-2 text-gray-600 ${
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

        {/* 보스 선택 */}
        <div className="flex border-b">
          <div className="flex-shrink-0 w-24 py-2 font-bold text-center">
            보스
          </div>
          <div
            ref={scrollContainerRef}
            className={`overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 cursor-${isDragging ? "grabbing" : "grab"}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
          >
            <div className="flex gap-1 pb-2">
              {bossList.map((boss) => (
                <button
                  key={boss}
                  onClick={() => setSelectedBoss(boss)}
                  className={`flex-shrink-0 px-4 py-2 text-sm whitespace-nowrap rounded-lg transition-colors ${
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

      {/* First Clear 섹션 */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">퍼스트 클리어</h2>
        <div className="p-6 rounded-lg shadow bg-gray-50">
          {!rankingData && (
            <div className="text-center text-gray-500">
              아직 해당 보스의 클리어 랭킹 기록이 없습니다.
            </div>
          )}
          {selectedPlayType === "Solo" && rankingData?.firstBossClearUser && (
            <div className="flex items-center justify-center gap-4">
              <img
                src={`https://api.creepernation.net/avatar/${rankingData.firstBossClearUser.playerName}`}
                alt={rankingData.firstBossClearUser.playerName}
                className="w-16 h-16"
              />
              <div>
                <div className="text-lg font-medium">
                  {rankingData.firstBossClearUser.playerName}
                </div>
                <div className="text-sm text-gray-500">
                  클리어 시간:{" "}
                  {formatClearTime(rankingData.firstBossClearUser.clearTime)}
                </div>
                <div className="text-sm text-gray-500">
                  클리어 날짜:{" "}
                  {formatClearDay(rankingData.firstBossClearUser.clearDay)}
                </div>
              </div>
            </div>
          )}

          {selectedPlayType === "Party" && rankingData?.firstBossClearParty && (
            <div>
              <div className="mb-4">
                <span className="font-medium">파티명: </span>
                {rankingData.firstBossClearParty.partyName}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {parsePartyMembers(
                  rankingData.firstBossClearParty.partyMembers
                ).map((member, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.creepernation.net/avatar/${member}`}
                        alt={member}
                        className="w-16 h-16"
                      />
                      <div>
                        <div className="font-medium">{member}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                클리어 시간:{" "}
                {formatClearTime(rankingData.firstBossClearParty.clearTime)}
              </div>
              <div className="text-sm text-gray-500">
                클리어 날짜:{" "}
                {formatClearDay(rankingData.firstBossClearParty.clearDay)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Time Ranking 섹션 */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">클리어 타임 순위</h2>
        <div className="overflow-hidden rounded-lg shadow bg-gray-50">
          <div className="grid grid-cols-12 py-4 text-center bg-gray-100">
            <div className="col-span-1">순위</div>
            <div className="col-span-2">클리어 시간</div>
            <div className="col-span-7">플레이어</div>
            <div className="col-span-2">클리어 날짜</div>
          </div>

          <div className="divide-y">
            {!rankingData && (
              <div className="py-20 text-center text-gray-500">
                아직 해당 보스의 클리어 랭킹 기록이 없습니다.
              </div>
            )}
            {rankingData &&
              selectedPlayType === "Solo" &&
              (!rankingData.soloClearTimeRankers ||
                rankingData.soloClearTimeRankers.length === 0) && (
                <div className="py-20 text-center text-gray-500">
                  퍼스트 클리어 기록은 클리어 타임 랭킹 등록에서 제외됩니다.
                </div>
              )}
            {rankingData &&
              selectedPlayType === "Party" &&
              (!rankingData.bossClearTimeRankerParties ||
                rankingData.bossClearTimeRankerParties.length === 0) && (
                <div className="py-20 text-center text-gray-500">
                  퍼스트 클리어 기록은 클리어 타임 랭킹 등록에서 제외됩니다.
                </div>
              )}
            {rankingData &&
              selectedPlayType === "Solo" &&
              rankingData.soloClearTimeRankers &&
              rankingData.soloClearTimeRankers.length > 0 &&
              rankingData?.soloClearTimeRankers?.map((ranker) => (
                <div
                  key={ranker.playerName}
                  className="grid items-center grid-cols-12 py-4 text-center"
                >
                  <div className="col-span-1 text-xl font-bold">
                    {ranker.rankPosition}
                  </div>
                  <div className="col-span-2 text-lg">
                    {formatClearTime(ranker.clearTime)}
                  </div>
                  <div className="col-span-7">
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={`https://api.creepernation.net/avatar/${ranker.playerName}`}
                        alt={ranker.playerName}
                        className="w-12 h-12"
                      />
                      <div className="font-medium">{ranker.playerName}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {formatClearDay(ranker.clearDay)}
                  </div>
                </div>
              ))}

            {selectedPlayType === "Party" &&
              rankingData?.bossClearTimeRankerParties?.map((party) => (
                <div
                  key={party.partyName}
                  className="grid items-center grid-cols-12 py-4 text-center"
                >
                  <div className="col-span-1 text-xl font-bold">
                    {party.rankPosition}
                  </div>
                  <div className="col-span-2 text-lg">
                    {formatClearTime(party.clearTime)}
                  </div>
                  <div className="col-span-7">
                    <div className="flex flex-wrap justify-center gap-4">
                      {parsePartyMembers(party.partyMembers).map(
                        (member, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <img
                              src={`https://api.creepernation.net/avatar/${member}`}
                              alt={member}
                              className="w-12 h-12"
                            />
                            <div className="font-medium">{member}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    {formatClearDay(party.clearDay)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </RankingLayout>
  );
}
