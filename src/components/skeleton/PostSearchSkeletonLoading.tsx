export default function SearchSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 스켈레톤 */}
      <header className="bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="items-center justify-between hidden h-16 sm:h-20 lg:h-24 lg:flex">
            {/* 왼쪽 공간 */}
            <div className="w-20 sm:w-[150px] lg:w-[200px]" />

            {/* 네비게이션 아이템 */}
            <div className="flex items-center space-x-8 sm:space-x-12">
              {/* 로고 영역 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 sm:w-20 lg:w-[98px] h-12 sm:h-16 lg:h-[68px] rounded ${shimmerClass}`}
                />
                <div
                  className={`w-24 sm:w-28 lg:w-32 h-4 sm:h-5 lg:h-6 mt-1 rounded ${shimmerClass}`}
                />
              </div>

              {/* 네비게이션 메뉴 */}
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`w-16 sm:w-20 lg:w-24 h-6 sm:h-7 lg:h-8 rounded ${shimmerClass}`}
                  />
                ))}
            </div>

            {/* 오른쪽 공간 */}
            <div
              className={`w-20 sm:w-[150px] lg:w-[200px] h-8 sm:h-10 lg:h-12 rounded ${shimmerClass}`}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
        {/* 검색바 스켈레톤 */}
        <div className="flex flex-col items-center justify-center gap-2 mb-6 sm:flex-row sm:gap-0 sm:mb-8">
          <div
            className={`w-full sm:w-96 h-10 sm:h-12 rounded-md sm:rounded-r-none ${shimmerClass}`}
          />
          <div
            className={`w-full sm:w-24 h-10 sm:h-12 rounded-md sm:rounded-l-none ${shimmerClass}`}
          />
        </div>

        {/* 검색 결과 그리드 스켈레톤 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex flex-col w-full mx-auto overflow-hidden border rounded-lg sm:w-64 lg:w-72"
              >
                {/* 이미지 영역 */}
                <div className={`relative pt-[65%] ${shimmerClass}`} />

                {/* 구분선 */}
                <div className="w-full h-px bg-gray-200" />

                {/* 콘텐츠 영역 */}
                <div className="h-40 p-3 space-y-3 sm:p-4">
                  {/* 카테고리 태그 */}
                  <div
                    className={`w-16 sm:w-20 h-5 sm:h-6 rounded ${shimmerClass}`}
                  />

                  {/* 제목 (2줄) */}
                  <div className="space-y-2">
                    <div
                      className={`w-full h-5 sm:h-6 rounded ${shimmerClass}`}
                    />
                    <div
                      className={`w-4/5 h-5 sm:h-6 rounded ${shimmerClass}`}
                    />
                  </div>

                  {/* 작성자 */}
                  <div
                    className={`w-24 sm:w-28 h-4 sm:h-5 rounded ${shimmerClass}`}
                  />

                  {/* 하단 메타 정보 */}
                  <div className="flex items-center justify-between pt-2">
                    {/* 날짜 */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${shimmerClass}`}
                      />
                      <div
                        className={`w-20 sm:w-24 h-4 rounded ${shimmerClass}`}
                      />
                    </div>

                    {/* 좋아요/조회수 */}
                    <div className="flex gap-2 sm:gap-4">
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${shimmerClass}`}
                        />
                        <div className={`w-8 h-4 rounded ${shimmerClass}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${shimmerClass}`}
                        />
                        <div className={`w-8 h-4 rounded ${shimmerClass}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 페이지네이션 스켈레톤 */}
        <div className="flex items-center justify-center gap-1 mt-6 sm:gap-2 sm:mt-8">
          {/* 처음/이전 버튼 */}
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded ${shimmerClass}`} />
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded ${shimmerClass}`} />

          {/* 페이지 번호 */}
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`w-8 sm:w-10 h-8 sm:h-10 rounded ${shimmerClass}`}
              />
            ))}

          {/* 다음/마지막 버튼 */}
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded ${shimmerClass}`} />
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded ${shimmerClass}`} />
        </div>
      </main>

      {/* 푸터 스켈레톤 */}
      <footer className="py-4 bg-gray-800 sm:py-6">
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
