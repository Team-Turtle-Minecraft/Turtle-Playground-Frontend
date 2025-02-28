// components/community/CommunityContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Post, PostResponse, PostType, SortType } from "@/types/postList";
import { fetchCommunityPosts } from "@/apis/api/fetchPostList";
import Modal from "@/components/common/Modal";
import CommunitySkeletonLoading from "@/components/skeleton/CommunityMainSkeletonLoading";

export default function CommunityContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [metaData, setMetaData] = useState<PostResponse["metaData"] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<PostType | "전체">(
    "전체"
  );
  const [selectedSort, setSelectedSort] = useState<SortType>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLengthModal, setShowLengthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categories = ["전체", "자유", "건축", "아이템", "공략", "팁"];
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "views", label: "조회수순" },
    { value: "likes", label: "좋아요순" },
  ];

  const getCategoryType = (category: string): PostType | undefined => {
    const mapping: Record<string, PostType> = {
      자유: "Free",
      건축: "Architecture",
      아이템: "Item",
      공략: "Solution",
      팁: "Tip",
    };
    return mapping[category];
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSort !== "latest") params.set("sortType", selectedSort);
    if (selectedCategory !== "전체")
      params.set("postType", getCategoryType(selectedCategory)!);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    const path = queryString ? `/community?${queryString}` : "/community";
    router.push(path);
  }, [selectedCategory, selectedSort, currentPage]);

  useEffect(() => {
    const postType = searchParams.get("postType");
    const sortType = searchParams.get("sortType");
    const page = searchParams.get("page");

    if (sortType) setSelectedSort(sortType as SortType);
    if (postType && typeof postType === "string") {
      const category =
        postType === "Free"
          ? "자유"
          : postType === "Architecture"
            ? "건축"
            : postType === "Item"
              ? "아이템"
              : postType === "Solution"
                ? "공략"
                : postType === "Tip"
                  ? "팁"
                  : "전체";
      setSelectedCategory(category as PostType | "전체");
    }
    if (page) setCurrentPage(Number(page));
  }, [searchParams]);

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetchCommunityPosts({
          sortType: selectedSort,
          postType:
            selectedCategory === "전체"
              ? undefined
              : getCategoryType(selectedCategory),
          page: currentPage,
        });

        if (response) {
          setPosts(response.posts);
          setMetaData(response.metaData);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, selectedSort, currentPage]);

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

  if (!posts) {
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

  if (loading) {
    return <CommunitySkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 반응형 배너 섹션 */}
      <div className="relative w-full">
        <div className="flex justify-center h-48 sm:h-64 md:h-80 lg:h-[310px] bg-gray-200 overflow-hidden">
          <img
            src="/assets/turtle-playground-community-banner.png"
            alt="커뮤니티 배너"
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
        {/* 필터 및 검색 섹션 */}
        <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as PostType | "전체")
              }
              className="px-3 py-2 border rounded-md text-sm sm:text-base min-w-[100px] sm:min-w-[120px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortType)}
              className="px-3 py-2 border rounded-md text-sm sm:text-base min-w-[100px] sm:min-w-[120px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 또는 작성자 닉네임을 입력해주세요."
              className="flex-1 px-3 py-2 text-sm border sm:w-64 rounded-l-md sm:text-base placeholder:text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-gray-800 rounded-r-md hover:bg-gray-700 sm:text-base"
            >
              검색
            </button>
          </form>
        </div>

        {/* 게시물 그리드 */}
        {posts.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-gray-600 sm:text-xl">
              {selectedCategory === "전체"
                ? "아직 게시물이 없습니다."
                : `${selectedCategory} 카테고리에 아직 게시물이 없습니다.`}
            </p>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              첫 번째 게시물의 주인공이 되어보세요!
            </p>
            <button
              onClick={() => router.push("/community/post/write")}
              className="px-6 py-2 mt-6 text-sm text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 sm:text-base"
            >
              글쓰기
            </button>
          </div>
        )}

        {/* 글쓰기 버튼 */}
        {posts.length > 0 && (
          <div className="flex justify-end mt-4 sm:mt-6">
            <button
              onClick={() => router.push("/community/post/write")}
              className="px-4 py-2 text-sm text-green-800 transition-colors bg-green-100 rounded-md sm:px-6 hover:bg-green-200 sm:text-base"
            >
              글쓰기
            </button>
          </div>
        )}

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
