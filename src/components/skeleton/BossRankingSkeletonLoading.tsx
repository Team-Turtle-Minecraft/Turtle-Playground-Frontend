import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

// components/skeleton/BossRankingSkeletonLoading.tsx
export const BossRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      {/* 플레이 타입과 보스 선택 네비게이션 스켈레톤 */}
      <div className="mb-6 space-y-4 sm:mb-8 md:mb-10">
        {/* 플레이 타입 선택 */}
        <div className="flex flex-col border-b sm:flex-row">
          <div className="w-full py-2 sm:w-24">
            <div className={`h-6 w-20 mx-auto sm:mx-4 ${shimmerClass}`}></div>
          </div>
          <div className="flex gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`flex-1 sm:w-28 h-10 rounded ${shimmerClass}`}
              ></div>
            ))}
          </div>
        </div>

        {/* 보스 선택 */}
        <div className="flex flex-col border-b sm:flex-row">
          <div className="w-full py-2 sm:w-24">
            <div className={`h-6 w-20 mx-auto sm:mx-4 ${shimmerClass}`}></div>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <div className="flex gap-3 pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 w-28 sm:w-36 h-10 rounded ${shimmerClass}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* First Clear 스켈레톤 */}
      <div className="mb-8 sm:mb-12 md:mb-16">
        <div className={`h-8 w-36 mb-6 ${shimmerClass}`}></div>
        <div className="p-6 rounded-lg shadow sm:p-8 bg-gray-50">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${shimmerClass}`}
            ></div>
            <div className="space-y-3">
              <div className={`h-6 w-32 sm:w-40 ${shimmerClass}`}></div>
              <div className={`h-4 w-24 sm:w-32 ${shimmerClass}`}></div>
              <div className={`h-4 w-28 sm:w-36 ${shimmerClass}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Time Ranking 스켈레톤 */}
      <div>
        <div className={`h-8 w-36 sm:w-48 mb-6 ${shimmerClass}`}></div>
        <div className="overflow-x-auto rounded-lg shadow bg-gray-50">
          <div className="min-w-full">
            <div className="grid grid-cols-12 py-4 sm:py-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-6 mx-auto w-20 sm:w-24 ${
                    i === 1
                      ? "col-span-1"
                      : i === 2
                        ? "col-span-2"
                        : i === 3
                          ? "col-span-7"
                          : "col-span-2"
                  } ${shimmerClass}`}
                ></div>
              ))}
            </div>

            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 py-6 sm:py-8">
                  <div
                    className={`col-span-1 h-8 w-16 mx-auto ${shimmerClass}`}
                  ></div>
                  <div
                    className={`col-span-2 h-8 w-24 mx-auto ${shimmerClass}`}
                  ></div>
                  <div className="col-span-7">
                    <div className="space-y-4">
                      <div className={`h-6 w-32 mx-auto ${shimmerClass}`}></div>
                      <div className="flex justify-center">
                        <div className="inline-flex gap-2 sm:gap-3 md:gap-4">
                          {[1, 2, 3, 4].map((j) => (
                            <div
                              key={j}
                              className="flex flex-col items-center space-y-1"
                            >
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${shimmerClass}`}
                              ></div>
                              <div className={`h-4 w-16 ${shimmerClass}`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`col-span-2 h-8 w-24 mx-auto ${shimmerClass}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
