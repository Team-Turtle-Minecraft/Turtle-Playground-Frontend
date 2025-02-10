import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

export const LevelRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      {/* 직업 선택 네비게이션 스켈레톤 */}
      <div className="mb-8">
        <div className="flex mb-1 border-b">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-24 h-10 rounded ${shimmerClass}`}></div>
          ))}
        </div>
        <div className="flex border-b">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-24 h-10 rounded ${shimmerClass}`}></div>
          ))}
        </div>
      </div>

      {/* 랭킹 테이블 스켈레톤 */}
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-3 py-4 bg-gray-100 border-b">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-6 mx-auto w-20 rounded ${shimmerClass}`}
            ></div>
          ))}
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-3 py-6">
              <div className={`h-8 w-16 mx-auto rounded ${shimmerClass}`}></div>
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`w-[110px] h-[103.96px] rounded ${shimmerClass}`}
                ></div>
                <div className={`w-32 h-6 rounded ${shimmerClass}`}></div>
              </div>
              <div className={`h-8 w-16 mx-auto rounded ${shimmerClass}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
