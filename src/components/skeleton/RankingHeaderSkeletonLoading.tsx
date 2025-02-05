// components/common/RankingHeaderSkeletonLoading.tsx

export const RankingHeaderSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <>
      <div className="relative">
        <div className={`h-[310px] w-full ${shimmerClass}`}></div>
        <div className="absolute flex items-center bottom-4 left-20">
          <div
            className={`w-[68px] h-[68px] mr-4 rounded ${shimmerClass}`}
          ></div>
          <div className={`w-48 h-[50px] rounded ${shimmerClass}`}></div>
        </div>
      </div>

      {/* 네비게이션 스켈레톤 */}
      <div className="flex mb-8 border-b">
        <div className={`w-24 py-2 rounded ${shimmerClass}`}></div>
        <div className="flex flex-1 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-24 h-10 rounded ${shimmerClass}`}></div>
          ))}
        </div>
      </div>
    </>
  );
};
