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

  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) {
      setSearchQuery(keyword);
    }
  }, [searchParams]);

  // 검색 데이터 fetching
  useEffect(() => {
    const fetchSearchResults = async () => {
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

    // 공백을 제거한 실제 문자 길이 체크
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 2) {
      setShowLengthModal(true);
      return;
    }

    router.push(`/community/search?keyword=${encodeURIComponent(searchQuery)}`);
  };

  // 페이지네이션 핸들러
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container flex-grow px-4 py-8 mx-auto">
        {/* 검색 바 */}
        <form onSubmit={handleSearch} className="flex justify-center mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력해주세요."
            className="px-4 py-2 border w-96 rounded-l-md"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-gray-800 rounded-r-md hover:bg-gray-700"
          >
            검색
          </button>
        </form>

        {/* 검색 결과 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.postId}
                className="overflow-hidden border rounded-lg cursor-pointer"
                onClick={() =>
                  (window.location.href = `/community/post/${post.postId}`)
                }
              >
                <div className="bg-gray-200 aspect-w-16 aspect-h-9">
                  <img
                    src={`${metaData?.postImageApiUrlPrefix}${post.imageName}`}
                    alt={post.title}
                    className="object-cover w-full h-48"
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
                <div className="p-4">
                  <h3 className="mb-2 font-bold">{post.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{post.creator}</span>
                    <span>{post.createdAt.split("T")[0]}</span>
                  </div>
                  <div className="flex justify-end mt-2 space-x-4 text-sm text-gray-600">
                    <span>👁 {post.views}</span>
                    <span>💖 {post.likes}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 py-20 text-center text-gray-500">
              <p className="text-xl">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {posts.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-md ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &lt;&lt;
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-md ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &lt;
            </button>
            {Array.from({ length: metaData?.totalPage || 1 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 border rounded-md ${
                  currentPage === i + 1 ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === metaData?.totalPage}
              className={`px-3 py-2 border rounded-md ${
                currentPage === metaData?.totalPage
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &gt;
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === metaData?.totalPage}
              className={`px-3 py-2 border rounded-md ${
                currentPage === metaData?.totalPage
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
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
    </div>
  );
}
