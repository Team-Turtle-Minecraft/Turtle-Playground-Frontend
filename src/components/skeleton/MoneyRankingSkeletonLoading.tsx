// components/skeleton/MoneyRankingSkeletonLoading.tsx
import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

export const MoneyRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      <div className="overflow-hidden rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-2 py-3 bg-gray-100 border-b sm:py-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`h-6 mx-auto w-16 sm:w-20 rounded ${shimmerClass}`}
            ></div>
          ))}
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-2 py-4 sm:py-6">
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
            </div>
          ))}
        </div>
        <div className={`p-3 sm:p-4 mt-4 h-12 rounded ${shimmerClass}`}></div>
      </div>
    </div>
  );
};
