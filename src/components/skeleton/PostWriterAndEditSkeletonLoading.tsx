// components/common/WritePostSkeletonLoading.tsx
// components/skeleton/WritePostSkeletonLoading.tsx
export default function WritePostSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 스켈레톤 */}
      <header className="bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="items-center justify-between hidden h-16 sm:h-20 lg:h-24 lg:flex">
            <div className="w-20 sm:w-[150px] lg:w-[200px]" />
            <div className="flex items-center space-x-8 sm:space-x-12">
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 sm:w-20 lg:w-[98px] h-12 sm:h-16 lg:h-[68px] rounded ${shimmerClass}`}
                />
                <div
                  className={`w-24 sm:w-28 lg:w-32 h-4 sm:h-5 lg:h-6 mt-1 rounded ${shimmerClass}`}
                />
              </div>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`w-16 sm:w-20 lg:w-24 h-6 sm:h-7 lg:h-8 rounded ${shimmerClass}`}
                  />
                ))}
            </div>
            <div
              className={`w-20 sm:w-[150px] lg:w-[200px] h-8 sm:h-10 lg:h-12 rounded ${shimmerClass}`}
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 스켈레톤 */}
      <main className="flex-grow w-full">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            {/* 카테고리/제목 영역 */}
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:gap-4">
              <div
                className={`w-full sm:w-32 lg:w-40 h-10 rounded ${shimmerClass}`}
              />
              <div className={`w-full h-10 rounded ${shimmerClass}`} />
            </div>

            {/* 에디터 영역 */}
            <div
              className={`w-full h-[calc(100vh-300px)] rounded ${shimmerClass}`}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 sm:gap-4">
            <div
              className={`w-20 sm:w-24 h-9 sm:h-10 rounded ${shimmerClass}`}
            />
            <div
              className={`w-20 sm:w-24 h-9 sm:h-10 rounded ${shimmerClass}`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
