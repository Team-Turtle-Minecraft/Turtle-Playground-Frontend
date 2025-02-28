// components/search/SearchContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Modal from "@/components/common/Modal";
import { Post, PostResponse } from "@/types/postList";
import { fetchSearchPosts } from "@/apis/api/fetchSearchedPosts";
import SearchSkeletonLoading from "@/components/skeleton/PostSearchSkeletonLoading";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [metaData, setMetaData] = useState<PostResponse["metaData"] | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLengthModal, setShowLengthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) {
      setSearchQuery(keyword);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      const keyword = searchParams.get("keyword");
      if (!keyword) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchSearchPosts({
          keyword,
          page: currentPage,
        });

        if (response) {
          setPosts(response.posts);
          setMetaData(response.metaData);
        }
      } catch (error) {
        console.error("검색 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 2) {
      setShowLengthModal(true);
      return;
    }

    router.push(`/community/search?keyword=${encodeURIComponent(searchQuery)}`);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => {
    if (metaData?.totalPage) setCurrentPage(metaData.totalPage);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (metaData?.totalPage && currentPage < metaData.totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <SearchSkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
        {/* 검색 폼 - 최대 너비 축소 */}
        <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 또는 작성자 닉네임을 입력해주세요."
              className="flex-1 px-4 py-2 text-sm border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-200 sm:text-base"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white transition-colors bg-[#1E293B] rounded-r-md hover:bg-[#334155] sm:text-base"
            >
              검색
            </button>
          </form>
        </div>

        {/* 검색 결과 또는 빈 상태 */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <div
                  key={post.postId}
                  className="flex flex-col w-full mx-auto overflow-hidden transition-shadow border rounded-lg cursor-pointer hover:shadow-lg sm:w-64 lg:w-72"
                  onClick={() => router.push(`/community/post/${post.postId}`)}
                >
                  <div className="relative pt-[65%] bg-gray-200">
                    <img
                      src={`${metaData?.postImageApiUrlPrefix}${post.imageName}`}
                      alt={post.title}
                      className="absolute top-0 left-0 object-cover w-full h-full"
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

                  <div className="w-full h-px bg-gray-200" />

                  <div className="flex flex-col flex-grow h-40 p-3 sm:p-4">
                    <span className="inline-block px-2 py-1 mb-2 text-xs bg-gray-100 rounded sm:text-sm w-fit">
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

                    <h3 className="mb-2 text-sm font-bold sm:text-base line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="mb-2 text-xs text-gray-500 sm:text-sm">
                      {post.creator}
                    </p>

                    <div className="flex items-center justify-between mt-auto text-xs text-gray-500 sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <img
                          src={`${process.env.ASSET_PREFIX}/front/assets/post-createdAt.png`}
                          alt="작성시간"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <span>
                          {post.createdAt.split("T")[0].replace(/-/g, ".")}
                        </span>
                      </div>

                      <div className="flex gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <img
                            src={`${process.env.ASSET_PREFIX}/front/assets/post-like.png`}
                            alt="좋아요"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img
                            src={`${process.env.ASSET_PREFIX}/front/assets/post-views.png`}
                            alt="조회수"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {posts.length > 0 && (
              <div className="flex items-center justify-center gap-1 mt-6 sm:gap-2 sm:mt-8">
                {/* 기존 페이지네이션 코드 유지 */}
              </div>
            )}
          </>
        ) : (
          <div className="w-full mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
              <p className="text-lg text-gray-600 sm:text-xl">
                검색 결과가 없습니다.
              </p>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                다른 검색어로 다시 시도해보세요.
              </p>
              <button
                onClick={() => router.push("/community")}
                className="px-6 py-2 mt-6 text-sm text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-50 sm:text-base"
              >
                커뮤니티로 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* 모달 컴포넌트들 */}
      <Modal
        isOpen={showLengthModal}
        onClose={() => setShowLengthModal(false)}
        message="공백없이 2글자 이상 입력해주세요!"
      />

      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          router.push("/auth");
        }}
        message="로그인을 먼저 진행해주세요!"
      />
    </div>
  );
}
