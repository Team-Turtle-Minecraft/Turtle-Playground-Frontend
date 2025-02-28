import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

export const LevelRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      {/* 직업 선택 네비게이션 스켈레톤 */}
      <div className="mb-4 space-y-4 sm:space-y-6 sm:mb-6 md:mb-8">
        {/* 직업 분류 */}
        <div className="flex flex-col border-b sm:flex-row">
          <div className={`w-full sm:w-24 h-10 rounded ${shimmerClass}`}></div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-0">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`flex-1 sm:w-24 h-10 rounded ${shimmerClass}`}
              ></div>
            ))}
          </div>
        </div>

        {/* 직업 선택 */}
        <div className="flex flex-col border-b sm:flex-row">
          <div className={`w-full sm:w-24 h-10 rounded ${shimmerClass}`}></div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 sm:w-24 h-10 rounded ${shimmerClass}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 랭킹 테이블 스켈레톤 */}
      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-3 py-3 bg-gray-100 border-b sm:py-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-6 mx-auto w-16 sm:w-20 rounded ${shimmerClass}`}
            ></div>
          ))}
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-3 py-4 sm:py-6">
              <div
                className={`h-6 sm:h-8 w-12 sm:w-16 mx-auto rounded ${shimmerClass}`}
              ></div>
              <div className="flex flex-col items-center justify-center w-full max-w-md gap-2 mx-auto sm:flex-row sm:gap-4">
                <div
                  className={`w-16 h-16 sm:w-[110px] sm:h-[103.96px] rounded ${shimmerClass}`}
                ></div>
                <div
                  className={`w-full sm:w-[120px] h-6 rounded ${shimmerClass}`}
                ></div>
              </div>
              <div
                className={`h-6 sm:h-8 w-16 sm:w-20 mx-auto rounded ${shimmerClass}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
