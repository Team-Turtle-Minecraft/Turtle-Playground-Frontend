// components/common/PostsSkeletonLoading.tsx
// PostsSkeletonLoading.tsx
export default function PostsSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded ${shimmerClass}`} />
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded ${shimmerClass}`} />
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-[60px] h-[42px] md:w-[98px] md:h-[68px] rounded ${shimmerClass}`}
          />
          <div
            className={`w-24 h-4 md:w-32 md:h-6 mt-1 rounded ${shimmerClass}`}
          />
        </div>
        <div className={`w-16 h-6 md:w-20 md:h-8 rounded ${shimmerClass}`} />
      </header>

      <div className="w-full h-px bg-gray-200" />

      <div className="container flex-grow px-4 py-6 mx-auto max-w-7xl md:px-6 md:py-8 lg:px-8">
        {/* 캐릭터 정보 스켈레톤 */}
        <div className="flex justify-center w-full">
          <div className="flex flex-col items-center md:flex-row md:items-center md:gap-[50px] lg:gap-[100px]">
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div
                className={`w-36 h-8 md:w-44 md:h-9 lg:w-48 lg:h-10 mb-2 rounded ${shimmerClass}`}
              />
              <div
                className={`w-36 h-8 md:w-44 md:h-9 lg:w-48 lg:h-10 mb-4 md:mb-6 rounded ${shimmerClass}`}
              />
              <div
                className={`w-[120px] h-[124px] md:w-[130px] md:h-[134px] lg:w-[150px] lg:h-[154.64px] rounded ${shimmerClass}`}
              />
            </div>
            <div className="mt-4 md:mt-[100px] lg:mt-[150px]">
              <div className="w-full md:w-[350px] lg:w-[400px] space-y-2">
                <div className={`h-12 rounded ${shimmerClass}`} />
                <div className={`h-12 rounded ${shimmerClass}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px my-6 bg-gray-200 md:my-8" />

        <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-8">
          {/* 메뉴 네비게이션 스켈레톤 */}
          <div className="w-full mb-6 lg:w-48 lg:mb-0">
            <div className="flex px-4 space-x-4 overflow-x-auto lg:overflow-x-visible lg:flex-col lg:space-x-0 lg:space-y-4 lg:px-0">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-24 md:w-28 lg:w-32 h-6 md:h-7 shrink-0 rounded ${shimmerClass}`}
                />
              ))}
            </div>
          </div>

          {/* 컨텐츠 영역 스켈레톤 */}
          <div className="w-full lg:max-w-[960px] px-4 md:px-6 lg:px-0">
            {/* 제목 */}
            <div
              className={`w-40 md:w-48 lg:w-56 h-8 md:h-9 lg:h-10 mb-4 md:mb-6 rounded ${shimmerClass}`}
            />

            {/* 게시물 수 카드 */}
            <div
              className={`w-full h-[72px] mb-6 md:mb-8 rounded-lg ${shimmerClass}`}
            />

            {/* 게시물 리스트 스켈레톤 */}
            <div className="hidden md:block">
              {/* 테이블 헤더 */}
              <div className={`w-full h-[52px] mb-2 rounded ${shimmerClass}`} />

              {/* 게시물 행들 */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-full h-[52px] rounded ${shimmerClass}`}
                  />
                ))}
              </div>
            </div>

            {/* 모바일 카드 스켈레톤 */}
            <div className="space-y-4 md:hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-full h-[80px] rounded-lg ${shimmerClass}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden w-48 lg:block" />
        </div>
      </div>

      <footer className={`h-[80px] md:h-[90px] lg:h-[100px] ${shimmerClass}`} />
    </div>
  );
}
