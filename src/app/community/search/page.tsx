// app/community/post/search/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Modal from "@/components/common/Modal";
import { Post, PostResponse } from "@/types/postList";
import { fetchSearchPosts } from "@/apis/api/fetchSearchedPosts";
import SearchSkeletonLoading from "@/components/skeleton/PostSearchSkeletonLoading";

export default function SearchPage() {
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

  if (loading) {
    return <SearchSkeletonLoading />;
  }

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

  if (!posts && loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow"></div>
        <Footer />
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
        {/* 검색 폼 */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col justify-center gap-2 mb-6 sm:flex-row sm:gap-0 sm:mb-8"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목 또는 작성자 닉네임을 입력해주세요."
            className="flex-1 max-w-full px-4 py-2 text-sm border rounded-md sm:max-w-lg sm:text-base sm:rounded-r-none placeholder:text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2 text-sm text-white transition-colors bg-gray-800 rounded-md sm:text-base sm:rounded-l-none hover:bg-gray-700"
          >
            검색
          </button>
        </form>

        {/* 검색 결과 그리드 */}
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
                      src="/assets/post-createdAt.png"
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
                        src="/assets/post-like.png"
                        alt="좋아요"
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        src="/assets/post-views.png"
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
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-sm sm:text-base
        ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
            >
              &lt;&lt;
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-sm sm:text-base
        ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
            >
              &lt;
            </button>

            {/* 페이지 번호 버튼들 */}
            {Array.from({ length: metaData?.totalPage || 1 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-sm sm:text-base
          ${currentPage === i + 1 ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === (metaData?.totalPage || 1)}
              className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-sm sm:text-base
        ${currentPage === (metaData?.totalPage || 1) ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
            >
              &gt;
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === (metaData?.totalPage || 1)}
              className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-sm sm:text-base
        ${currentPage === (metaData?.totalPage || 1) ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
            >
              &gt;&gt;
            </button>
          </div>
        )}
      </main>

      <Footer />

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
