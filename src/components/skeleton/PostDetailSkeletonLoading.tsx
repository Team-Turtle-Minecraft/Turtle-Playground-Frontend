// components/common/PostDetailSkeletonLoading.tsx
export default function PostDetailSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  const widths = [
    "w-3/4",
    "w-full",
    "w-5/6",
    "w-4/5",
    "w-11/12",
    "w-2/3",
    "w-4/6",
    "w-5/6",
    "w-3/4",
    "w-7/8",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 스켈레톤 (위와 동일) */}
      <header className="bg-white">{/* ... 헤더 내용 ... */}</header>

      <div className="flex flex-col items-center w-full mt-[129px]">
        <div className="w-[1260px] h-[1px] bg-black"></div>

        {/* 게시물 정보 영역 */}
        <div className="w-[1260px] py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-6 rounded ${shimmerClass}`}></div>
                <div className={`w-96 h-8 rounded ${shimmerClass}`}></div>
              </div>
              <div className="flex items-center gap-6">
                <div className={`w-32 h-5 rounded ${shimmerClass}`}></div>
                <div className={`w-24 h-5 rounded ${shimmerClass}`}></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-20 h-5 rounded ${shimmerClass}`}></div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded ${shimmerClass}`}></div>
                <div className={`w-24 h-5 rounded ${shimmerClass}`}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1260px] h-[1px] bg-[#B5B5B5]"></div>
      </div>

      <main className="flex flex-col items-center w-full">
        {/* 본문 내용 */}
        <div className="w-[1260px] p-6">
          <div className="space-y-4">
            {widths.map((width, i) => (
              <div
                key={i}
                className={`${width} h-4 rounded ${shimmerClass}`}
              ></div>
            ))}
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <div className="w-[1260px] flex justify-center mt-12">
          <div className={`w-20 h-8 rounded ${shimmerClass}`}></div>
        </div>

        <div className="w-[1260px] h-[1px] bg-[#B5B5B5] my-8"></div>

        {/* 버튼 영역 */}
        <div className="w-[1260px] flex justify-center mb-40">
          <div className={`w-24 h-10 rounded ${shimmerClass}`}></div>
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
