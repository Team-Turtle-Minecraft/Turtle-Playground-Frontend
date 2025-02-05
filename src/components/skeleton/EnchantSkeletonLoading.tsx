// components/common/EnchantSkeletonLoading.tsx
export default function EnchantSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded ${shimmerClass}`}></div>
          <div className={`w-8 h-8 rounded ${shimmerClass}`}></div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-[98px] h-[68px] rounded ${shimmerClass}`}></div>
          <div className={`w-32 h-6 mt-1 rounded ${shimmerClass}`}></div>
        </div>
        <div className={`w-20 h-8 rounded ${shimmerClass}`}></div>
      </header>

      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-6 py-8 mx-auto max-w-7xl">
        <div className="flex justify-center w-full">
          <div className="flex items-center gap-[100px]">
            <div className="flex flex-col items-center">
              <div className={`w-48 h-10 mb-2 rounded ${shimmerClass}`}></div>
              <div className={`w-48 h-10 mb-6 rounded ${shimmerClass}`}></div>
              <div
                className={`w-[150px] h-[154.64px] rounded ${shimmerClass}`}
              ></div>
            </div>
            <div className="mt-[150px]">
              <div className="w-[400px] space-y-2">
                <div className={`h-12 rounded ${shimmerClass}`}></div>
                <div className={`h-12 rounded ${shimmerClass}`}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px my-8 bg-gray-200"></div>

        <div className="flex justify-center gap-8">
          <div className="w-48 space-y-4 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-6 rounded ${shimmerClass}`}></div>
            ))}
          </div>

          <div className="w-full max-w-[960px]">
            <div className={`w-48 h-10 mb-8 rounded ${shimmerClass}`}></div>

            {/* 통계 카드 스켈레톤 */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-[120px] rounded-lg ${shimmerClass}`}
                ></div>
              ))}
            </div>

            {/* 차트 스켈레톤 */}
            <div
              className={`w-full h-[400px] rounded-lg ${shimmerClass}`}
            ></div>
          </div>

          <div className="w-48 shrink-0"></div>
        </div>
      </div>

      <footer className={`h-[100px] rounded ${shimmerClass}`}></footer>
    </div>
  );
}
