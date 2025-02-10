export default function AttendanceSkeletonLoading() {
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

          <div className="w-full max-w-[800px]">
            <div
              className={`w-48 h-10 mx-auto mb-4 rounded ${shimmerClass}`}
            ></div>

            {/* 출석률 및 보상 버튼 영역 */}
            <div className="flex justify-between max-w-[600px] mx-auto mb-8">
              <div className={`w-32 h-10 rounded-full ${shimmerClass}`}></div>
              <div className="flex gap-2">
                <div className={`h-10 rounded-full w-28 ${shimmerClass}`}></div>
                <div className={`h-10 rounded-full w-28 ${shimmerClass}`}></div>
              </div>
            </div>

            {/* 달력 영역 */}
            <div
              className={`w-[600px] h-[600px] mx-auto mb-8 rounded-lg ${shimmerClass}`}
            ></div>

            {/* 안내 텍스트 */}
            <div
              className={`h-6 mx-auto mb-8 w-80 rounded ${shimmerClass}`}
            ></div>

            {/* 출석하기 버튼 */}
            <div
              className={`w-32 h-12 mx-auto rounded-full ${shimmerClass}`}
            ></div>
          </div>

          <div className="w-48 shrink-0"></div>
        </div>
      </div>

      <footer className={`h-[100px] rounded ${shimmerClass}`}></footer>
    </div>
  );
}
