// components/skeleton/RankingHeaderSkeletonLoading.tsx
export const RankingHeaderSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <>
      <div className="relative">
        <div
          className={`h-40 sm:h-60 md:h-72 lg:h-80 w-full ${shimmerClass}`}
        ></div>
        <div className="absolute flex items-center bottom-2 sm:bottom-4 left-4 sm:left-8 md:left-16 lg:left-20">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-2 sm:mr-4 rounded ${shimmerClass}`}
          ></div>
          <div
            className={`w-32 sm:w-40 md:w-48 h-8 sm:h-10 md:h-12 rounded ${shimmerClass}`}
          ></div>
        </div>
      </div>

      <div className="flex flex-col mb-4 border-b sm:flex-row sm:mb-6 md:mb-8">
        <div className={`w-full sm:w-24 h-10 rounded ${shimmerClass}`}></div>
        <div className="flex flex-wrap flex-1 gap-2 sm:flex-nowrap sm:gap-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex-1 h-10 rounded ${shimmerClass}`}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};
