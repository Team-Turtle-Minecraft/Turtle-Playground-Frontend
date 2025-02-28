import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

export const PostRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      <div className="rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-1 py-4 text-center bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className={`h-6 mx-auto w-16 sm:w-20 rounded ${shimmerClass}`}
          ></div>
          <div
            className={`h-6 mx-auto w-16 sm:w-20 rounded hidden lg:block ${shimmerClass}`}
          ></div>
          <div
            className={`h-6 mx-auto w-16 sm:w-20 rounded sm:col-span-2 lg:col-span-1 ${shimmerClass}`}
          ></div>
        </div>

        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid items-center grid-cols-1 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {/* 순위 */}
              <div
                className={`h-8 w-16 mx-auto rounded mb-4 sm:mb-0 ${shimmerClass}`}
              ></div>

              {/* 게시물 카드 */}
              <div className="flex justify-center w-full sm:col-span-2 lg:col-span-1">
                <div className="w-full overflow-hidden bg-white border rounded-lg sm:w-64 lg:w-72">
                  {/* 이미지 영역 */}
                  <div className={`relative pt-[65%] ${shimmerClass}`}></div>
                  <div className="w-full h-px bg-gray-200"></div>

                  {/* 컨텐츠 영역 */}
                  <div className="p-4 space-y-3">
                    {/* 게시글 타입 */}
                    <div className={`h-6 w-16 rounded ${shimmerClass}`}></div>
                    {/* 제목 */}
                    <div className={`h-10 rounded ${shimmerClass}`}></div>
                    {/* 작성자 */}
                    <div className={`h-5 w-24 rounded ${shimmerClass}`}></div>
                    {/* 하단 정보 */}
                    <div className="flex justify-between pt-2">
                      <div className={`h-5 w-24 rounded ${shimmerClass}`}></div>
                      <div className="flex gap-4">
                        <div
                          className={`h-5 w-12 rounded ${shimmerClass}`}
                        ></div>
                        <div
                          className={`h-5 w-12 rounded ${shimmerClass}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div className="items-center justify-center hidden w-full max-w-md gap-4 mx-auto lg:flex">
                <div className="flex flex-col items-center justify-center w-full gap-2 sm:flex-row sm:gap-4">
                  <div
                    className={`w-16 h-16 sm:w-[110px] sm:h-[103.96px] rounded ${shimmerClass}`}
                  ></div>
                  <div
                    className={`w-full sm:w-[120px] h-6 rounded ${shimmerClass}`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
