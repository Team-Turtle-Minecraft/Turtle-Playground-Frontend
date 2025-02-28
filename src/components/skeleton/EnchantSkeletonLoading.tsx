// components/common/EnchantSkeletonLoading.tsx
export function EnchantSkeletonContent() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="w-full px-4 md:px-6 lg:px-0">
      {/* 제목 */}
      <div
        className={`w-40 md:w-48 lg:w-56 h-8 md:h-9 lg:h-10 mb-6 md:mb-8 rounded ${shimmerClass}`}
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4 md:gap-4 md:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow-md md:p-6">
            <div
              className={`w-24 md:w-28 h-5 md:h-6 mb-2 rounded ${shimmerClass}`}
            />
            <div
              className={`w-16 md:w-20 h-7 md:h-8 lg:h-9 rounded ${shimmerClass}`}
            />
          </div>
        ))}
      </div>

      {/* 차트 영역 */}
      <div className="p-4 bg-white rounded-lg shadow-md md:p-6 lg:p-8">
        <div
          className={`w-48 md:w-56 h-6 md:h-7 lg:h-8 mx-auto mb-4 md:mb-6 rounded ${shimmerClass}`}
        />
        <div className="flex flex-col items-center">
          {/* 원형 차트 */}
          <div
            className={`w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full ${shimmerClass}`}
          />
          {/* 범례 */}
          <div className="flex flex-col justify-center gap-4 mt-4 md:flex-row md:gap-8 md:mt-6">
            <div className={`w-32 h-6 rounded ${shimmerClass}`} />
            <div className={`w-32 h-6 rounded ${shimmerClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
