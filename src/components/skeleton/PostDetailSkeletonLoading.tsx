// components/skeleton/PostDetailSkeletonLoading.tsx
export default function PostDetailSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  // 미리 정의된 고정 너비값 배열
  const presetWidths = [
    "w-3/4", // 75%
    "w-11/12", // 91.666667%
    "w-5/6", // 83.333333%
    "w-4/5", // 80%
    "w-2/3", // 66.666667%
    "w-7/8", // 87.5%
  ];

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

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col flex-grow">
        {/* 게시물 헤더 영역 */}
        <div className="w-full mt-4 sm:mt-6 lg:mt-10">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="w-full h-px bg-black"></div>

            <div className="px-3 py-4 sm:py-6 sm:px-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div
                      className={`w-16 sm:w-20 h-6 sm:h-7 rounded ${shimmerClass}`}
                    />
                    <div
                      className={`w-full sm:w-96 h-7 sm:h-8 lg:h-9 rounded ${shimmerClass}`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                    <div
                      className={`w-32 sm:w-36 h-5 sm:h-6 rounded ${shimmerClass}`}
                    />
                    <div
                      className={`w-24 sm:w-28 h-5 sm:h-6 rounded ${shimmerClass}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div
                    className={`w-16 sm:w-20 h-5 sm:h-6 rounded ${shimmerClass}`}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded ${shimmerClass}`}
                    />
                    <div
                      className={`w-20 sm:w-24 h-4 sm:h-5 rounded ${shimmerClass}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#B5B5B5] w-full"></div>
          </div>
        </div>

        {/* 본문 스켈레톤 */}
        <main className="flex-grow w-full">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="p-3 sm:p-6">
              {/* 텍스트 라인들 */}
              <div className="space-y-4 sm:space-y-5">
                {presetWidths.map((width, i) => (
                  <div
                    key={i}
                    className={`${width} h-4 sm:h-5 rounded ${shimmerClass}`}
                  />
                ))}
              </div>

              {/* 이미지 영역 */}
              <div className="mt-8 sm:mt-10">
                <div
                  className={`w-full max-w-2xl mx-auto aspect-video rounded ${shimmerClass}`}
                />
              </div>
            </div>

            {/* 좋아요 버튼 */}
            <div className="flex justify-center mt-8 sm:mt-12">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${shimmerClass}`}
                />
                <div
                  className={`w-8 h-6 sm:w-10 sm:h-7 rounded ${shimmerClass}`}
                />
              </div>
            </div>

            <div className="h-px bg-[#B5B5B5] my-6 sm:my-8"></div>

            {/* 작성자 전용 버튼 */}
            <div className="flex justify-end mt-4 space-x-2 sm:space-x-4">
              <div
                className={`w-16 sm:w-20 h-8 sm:h-10 rounded ${shimmerClass}`}
              />
              <div
                className={`w-16 sm:w-20 h-8 sm:h-10 rounded ${shimmerClass}`}
              />
            </div>

            {/* 목록으로 버튼 */}
            <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16">
              <div
                className={`w-24 sm:w-28 h-8 sm:h-10 rounded ${shimmerClass}`}
              />
            </div>
          </div>
        </main>
      </div>

      {/* 푸터 스켈레톤 */}
      <footer className="w-full py-4 bg-gray-800 sm:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-2 sm:space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={`w-48 sm:w-56 lg:w-64 h-3 sm:h-4 rounded ${shimmerClass}`}
                />
              ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
