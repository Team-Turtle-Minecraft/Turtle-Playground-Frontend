// app/ranking/level/page.tsx
"use client";

import RankingLayout from "@/components/ranking/RankingLayout";

export default function LevelRankingPage() {
  // 임시 랭킹 데이터
  const rankingData = [
    {
      rank: 1,
      playerImage: "/assets/players/_appli_.png",
      playerName: "_appli_",
      score: 100,
    },
    {
      rank: 2,
      playerImage: "/assets/players/Koo_pa_.png",
      playerName: "Koo_pa_",
      score: 96,
    },
    {
      rank: 3,
      playerImage: "/assets/players/_YYH_.png",
      playerName: "_YYH_",
      score: 94,
    },
    {
      rank: 4,
      playerImage: "/assets/players/KSH_1348.png",
      playerName: "KSH_1348",
      score: 93,
    },
    {
      rank: 5,
      playerImage: "/assets/players/ulu3111.png",
      playerName: "ulu3111",
      score: 90,
    },
  ];

  return (
    <RankingLayout>
      <div className="bg-gray-50">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-3 py-4 text-center bg-gray-100">
          <div>순위</div>
          <div>캐릭터 정보</div>
          <div>레벨</div>
        </div>

        {/* 테이블 바디 */}
        {rankingData.map((player) => (
          <div
            key={player.rank}
            className="grid items-center grid-cols-3 py-4 text-center border-b"
          >
            <div className="text-xl font-bold">{player.rank}</div>
            <div className="flex items-center justify-center space-x-4">
              <img
                src={player.playerImage}
                alt={player.playerName}
                className="w-12 h-12"
              />
              <span>{player.playerName}</span>
            </div>
            <div>{player.score}</div>
          </div>
        ))}
      </div>
    </RankingLayout>
  );
}
