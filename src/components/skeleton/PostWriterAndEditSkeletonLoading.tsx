// components/common/WritePostSkeletonLoading.tsx
export default function WritePostSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 스켈레톤 */}
      <header className="bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="items-center justify-between hidden h-24 lg:flex">
            <div className="w-[200px]" />
            <div className="flex items-center space-x-12">
              <div className="flex flex-col items-center">
                <div
                  className={`w-[98px] h-[68px] rounded ${shimmerClass}`}
                ></div>
                <div className={`w-32 h-6 mt-1 rounded ${shimmerClass}`}></div>
              </div>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`w-24 h-8 rounded ${shimmerClass}`}
                  ></div>
                ))}
            </div>
            <div className={`w-[200px] h-12 rounded ${shimmerClass}`}></div>
          </div>
        </div>
      </header>

      <main className="container flex-grow px-4 py-8 mx-auto">
        <div className="mb-6">
          {/* 카테고리 선택과 제목 입력 영역 */}
          <div className="flex gap-4 mb-4">
            <div className={`w-32 h-10 rounded ${shimmerClass}`}></div>
            <div className={`flex-1 h-10 rounded ${shimmerClass}`}></div>
          </div>

          {/* 에디터 영역 */}
          <div className={`w-full h-[600px] rounded ${shimmerClass}`}></div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2">
          <div className={`w-20 h-10 rounded ${shimmerClass}`}></div>
          <div className={`w-20 h-10 rounded ${shimmerClass}`}></div>
        </div>
      </main>

      <footer className="py-6 bg-gray-800">
        <div className="container px-6 mx-auto">
          <div className="space-y-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={`w-64 h-4 rounded ${shimmerClass}`}
                ></div>
              ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
