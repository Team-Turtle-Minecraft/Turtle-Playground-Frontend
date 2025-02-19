// app/ranking/post/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RankingLayout from "@/components/ranking/RankingLayout";
import { fetchPostRanking } from "@/apis/api/fetchPostRanking";
import { Post } from "@/types/postList";
import { PostRankingSkeletonLoading } from "@/components/skeleton/PostRankingSkeletonLoading";
import Modal from "@/components/common/Modal";

export default function PostRankingPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postImagePrefix, setPostImagePrefix] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchRanking = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchPostRanking();
        const sortedPosts = response.posts.sort((a, b) => {
          if (a.likes !== b.likes) {
            return b.likes - a.likes;
          }
          return b.views - a.views;
        });
        setPosts(sortedPosts);
        setPostImagePrefix(response.postImageApiUrlPrefix);
      } catch (error) {
        console.error("랭킹 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (isLoading) {
    return <PostRankingSkeletonLoading />;
  }

  const getPostType = (type: string) => {
    switch (type) {
      case "Free":
        return "자유";
      case "Architecture":
        return "건축";
      case "Item":
        return "아이템";
      case "Solution":
        return "공략";
      default:
        return "팁";
    }
  };

  return (
    <RankingLayout>
      <div className="rounded-lg shadow bg-gray-50">
        <div className="grid grid-cols-1 py-4 text-center bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
          <div className="py-2">순위</div>
          <div className="py-2 sm:col-span-2 lg:col-span-1">게시물 정보</div>
          <div className="hidden py-2 lg:block">작성자</div>
        </div>

        <div className="divide-y">
          {posts.map((post, index) => (
            <div
              key={post.postId}
              className="grid items-center grid-cols-1 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div className="mb-4 text-center sm:mb-0">
                <span className="text-xl font-bold sm:text-2xl">
                  {index + 1}
                </span>
              </div>

              <div className="flex justify-center w-full sm:col-span-2 lg:col-span-1">
                <div
                  className="w-full overflow-hidden transition-shadow bg-white border rounded-lg cursor-pointer sm:w-64 lg:w-72 hover:shadow-lg"
                  onClick={() =>
                    (window.location.href = `/community/post/${post.postId}`)
                  }
                >
                  {/* 이미지 컨테이너 */}
                  <div className="relative pt-[65%] bg-gray-200">
                    <img
                      src={`${postImagePrefix}${post.imageName}`}
                      alt={post.title}
                      className="absolute top-0 left-0 object-cover w-full h-full"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        const token = localStorage.getItem("accessToken");
                        fetch(img.src, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                      }}
                    />
                  </div>

                  <div className="w-full h-px bg-gray-200"></div>

                  {/* 컨텐츠 영역 */}
                  <div className="flex flex-col h-40 p-4">
                    <span className="inline-block px-3 py-1 mb-2 text-xs bg-gray-100 rounded sm:text-sm w-fit">
                      {getPostType(post.postType)}
                    </span>

                    <div className="px-1 mb-2 text-sm font-bold sm:text-base line-clamp-2">
                      {post.title}
                    </div>

                    <div className="px-1 text-xs text-gray-500 sm:text-sm">
                      <span>{post.creator}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto text-xs text-gray-500 sm:text-sm">
                      <div className="flex items-center">
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
                      <div className="flex gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <img
                            src="/assets/post-like.png"
                            alt="좋아요"
                            className="w-4 h-4"
                          />
                          <span>{post.likes}</span>
                        </div>
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

              <div className="flex items-center justify-center w-full max-w-md gap-4 mx-auto mb-4 sm:mb-0 lg:flex">
                <div className="flex flex-col items-center justify-center w-full gap-2 sm:flex-row sm:gap-4">
                  <img
                    src={`https://api.creepernation.net/avatar/${post.creator}`}
                    alt={post.creator}
                    className="w-16 h-16 sm:w-[110px] sm:h-[103.96px] flex-shrink-0"
                  />
                  <div className="min-w-0 w-full sm:w-[120px] px-2 text-sm sm:text-lg truncate">
                    {post.creator}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          router.push("/auth");
        }}
        message="로그인을 먼저 진행해주세요!"
      />
    </RankingLayout>
  );
}
