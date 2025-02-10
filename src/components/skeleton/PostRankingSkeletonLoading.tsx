import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

// components/common/RankingSkeletonLoading.tsx에서 PostRankingSkeletonLoading 수정
export const PostRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      {/* 랭킹 테이블 스켈레톤 */}
      <div className="bg-gray-50">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-3 py-4 text-center bg-gray-100">
          {["순위", "작성자", "게시물 정보"].map((_, i) => (
            <div
              key={i}
              className={`h-6 mx-auto w-24 rounded ${shimmerClass}`}
            ></div>
          ))}
        </div>

        {/* 테이블 바디 */}
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid items-center grid-cols-3 py-6">
              {/* 순위 */}
              <div className="text-center">
                <div
                  className={`h-8 w-16 mx-auto rounded ${shimmerClass}`}
                ></div>
              </div>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`w-[110px] h-[103.96px] rounded ${shimmerClass}`}
                ></div>
                <div className={`w-32 h-6 rounded ${shimmerClass}`}></div>
              </div>

              {/* 게시물 카드 */}
              <div className="flex justify-center w-full">
                <div className="border rounded-lg overflow-hidden bg-white w-[300px] h-[365px] flex flex-col">
                  {/* 이미지 영역 */}
                  <div className={`w-[300px] h-[194px] ${shimmerClass}`}></div>

                  {/* 구분선 */}
                  <div className="w-full h-[1px] bg-gray-200"></div>

                  {/* 컨텐츠 영역 */}
                  <div className="flex flex-col flex-grow p-4">
                    {/* 카테고리 태그 */}
                    <div
                      className={`w-16 h-6 mb-2 rounded ${shimmerClass}`}
                    ></div>

                    {/* 제목 */}
                    <div
                      className={`w-full h-6 mb-2 rounded ${shimmerClass}`}
                    ></div>

                    {/* 작성자 */}
                    <div
                      className={`w-24 h-4 mb-2 rounded ${shimmerClass}`}
                    ></div>

                    {/* 하단 정보 */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className={`w-32 h-4 rounded ${shimmerClass}`}></div>
                      <div className="flex gap-4">
                        <div
                          className={`w-16 h-4 rounded ${shimmerClass}`}
                        ></div>
                        <div
                          className={`w-16 h-4 rounded ${shimmerClass}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
