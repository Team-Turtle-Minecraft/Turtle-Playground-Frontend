export default function SearchSkeletonLoading() {
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
        {/* 검색바 */}
        <div className="flex justify-center mb-8">
          <div className={`w-96 h-10 rounded-l ${shimmerClass}`}></div>
          <div className={`w-24 h-10 rounded-r ${shimmerClass}`}></div>
        </div>

        {/* 검색 결과 그리드 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="overflow-hidden border rounded-lg">
                <div className={`aspect-w-16 aspect-h-9 ${shimmerClass}`}></div>
                <div className="p-4">
                  <div className={`h-6 mb-2 rounded ${shimmerClass}`}></div>
                  <div className="flex justify-between">
                    <div className={`w-24 h-4 rounded ${shimmerClass}`}></div>
                    <div className={`w-24 h-4 rounded ${shimmerClass}`}></div>
                  </div>
                  <div className="flex justify-end mt-2 space-x-4">
                    <div className={`w-12 h-4 rounded ${shimmerClass}`}></div>
                    <div className={`w-12 h-4 rounded ${shimmerClass}`}></div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded ${shimmerClass}`}
              ></div>
            ))}
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
