// app/ranking/post/page.tsx
"use client";

import { useEffect, useState } from "react";
import RankingLayout from "@/components/ranking/RankingLayout";
import { fetchPostRanking } from "@/apis/api/fetchPostRanking";
import { Post } from "@/types/postList";

export default function PostRankingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postImagePrefix, setPostImagePrefix] = useState("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetchPostRanking();
        // 게시물을 좋아요 수로 먼저 정렬하고, 동일한 경우 조회수로 정렬
        const sortedPosts = response.posts.sort((a, b) => {
          if (a.likes !== b.likes) {
            return b.likes - a.likes; // 좋아요 수 내림차순
          }
          return b.views - a.views; // 좋아요 수가 같은 경우 조회수 내림차순
        });
        setPosts(sortedPosts);
        setPostImagePrefix(response.postImageApiUrlPrefix);
      } catch (error) {
        console.error("랭킹 로드 실패:", error);
      }
    };

    fetchRanking();
  }, []);

  return (
    <RankingLayout>
      <div className="bg-gray-50">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-3 py-4 text-center bg-gray-100">
          <div>순위</div>
          <div>작성자</div>
          <div>게시물 정보</div>
        </div>

        {/* 테이블 바디 */}
        <div className="divide-y">
          {posts.map((post, index) => (
            <div
              key={post.postId}
              className="grid items-center grid-cols-3 py-6"
            >
              {/* 순위 */}
              <div className="text-center">
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-center gap-4">
                <img
                  src={`https://api.creepernation.net/avatar/${post.creator}`}
                  alt={post.creator}
                  className="w-[110px] h-[103.96px]"
                />
                <span>{post.creator}</span>
              </div>

              {/* 게시물 정보 카드 영역 */}
              <div className="flex justify-center w-full">
                <div
                  className="border rounded-lg overflow-hidden bg-white cursor-pointer w-[300px] h-[365px] flex flex-col"
                  onClick={() =>
                    (window.location.href = `/community/post/${post.postId}`)
                  }
                >
                  {/* 이미지 영역 */}
                  <div className="bg-gray-200">
                    <img
                      src={`${postImagePrefix}${post.imageName}`}
                      alt={post.title}
                      className="object-cover w-[300px] h-[194px]"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        const token = localStorage.getItem("accessToken");
                        fetch(img.src, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                      }}
                    />
                  </div>

                  {/* 구분선 추가 */}
                  <div className="w-full h-[1px] bg-gray-200"></div>

                  {/* 컨텐츠 영역 */}
                  <div className="flex flex-col flex-grow p-4">
                    {/* 카테고리 태그 */}
                    <span className="inline-block px-3 py-1 mb-2 text-sm bg-gray-100 rounded w-fit">
                      {post.postType === "Free"
                        ? "자유"
                        : post.postType === "Architecture"
                          ? "건축"
                          : post.postType === "Item"
                            ? "아이템"
                            : post.postType === "Solution"
                              ? "공략"
                              : "팁"}
                    </span>

                    {/* 제목 */}
                    <div className="px-1 mb-2 font-bold">{post.title}</div>

                    {/* 작성자 */}
                    <div className="px-1 text-sm text-gray-500">
                      <span>{post.creator}</span>
                    </div>

                    {/* 하단 정보 - 마진으로 아래쪽 배치 */}
                    <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {/* 작성시간 */}
                        <div className="flex items-center gap-1 px-1">
                          <img
                            src="/assets/post-createdAt.png"
                            alt="작성시간"
                            className="w-4 h-4"
                          />
                          <span>
                            {post.createdAt.split("T")[0].replace(/-/g, ".")}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {/* 좋아요 */}
                        <div className="flex items-center gap-1">
                          <img
                            src="/assets/post-like.png"
                            alt="좋아요"
                            className="w-4 h-4"
                          />
                          <span>{post.likes}</span>
                        </div>
                        {/* 조회수 */}
                        <div className="flex items-center gap-1">
                          <img
                            src="/assets/post-views.png"
                            alt="조회수"
                            className="w-4 h-4"
                          />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RankingLayout>
  );
}
