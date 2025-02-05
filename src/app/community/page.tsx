"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Post, PostResponse, PostType, SortType } from "@/types/postList";
import { fetchCommunityPosts } from "@/apis/api/fetchPostList";
import Modal from "@/components/common/Modal";
import CommunitySkeletonLoading from "@/components/skeleton/CommunityMainSkeletonLoading";

export default function CommunityPage() {
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

  const getCategoryLabel = (postType: PostType): string => {
    const mapping: Record<PostType, string> = {
      Free: "자유",
      Architecture: "건축",
      Item: "아이템",
      Solution: "공략",
      Tip: "팁",
    };
    return mapping[postType] || "전체";
  };

  // URL 파라미터 업데이트
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

  // URL 파라미터에서 상태 업데이트
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

  // 데이터 fetching
  useEffect(() => {
    const fetchPosts = async () => {
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

  if (loading) {
    return <CommunitySkeletonLoading />;
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

  // 페이지네이션 핸들러 함수들
  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    if (metaData?.totalPage) {
      setCurrentPage(metaData.totalPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (metaData?.totalPage && currentPage < metaData.totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="relative">
        <div className="flex justify-center h-[310px] bg-gray-200">
          <img
            src="/assets/turtle-playground-banner.png"
            alt="커뮤니티 배너"
            className="h-full"
          />
          <div className="absolute flex items-center bottom-4 left-20">
            <img
              src="/assets/community-logo.png"
              alt="커뮤니티"
              className="w-[68.44px] h-[60px] mr-4"
            />
            <h1 className="text-[50px] font-bold">커뮤니티</h1>
          </div>
        </div>
      </div>
      <main className="container flex-grow px-4 py-8 mx-auto">
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as PostType | "전체")
              }
              className="px-4 py-2 border rounded-md"
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
              className="px-4 py-2 border rounded-md"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요."
              className="w-64 px-4 py-2 border rounded-l-md"
            />
            <button
              type="submit"
              className="px-4 py-2 text-white bg-gray-800 rounded-r-md hover:bg-gray-700"
            >
              검색
            </button>
          </form>
        </div>

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
                    className="object-contain w-full h-48"
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
                  <span className="inline-block px-3 py-1 mb-2 ml-0 text-sm bg-gray-100 rounded w-fit">
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
                  <div className="flex items-center justify-between mt-8 text-sm text-gray-500">
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
            ))
          ) : (
            <div className="col-span-4 py-20 text-center text-gray-500">
              <p className="text-xl">아직 작성된 게시물이 없습니다.</p>
              <p className="mt-2">첫 게시물의 주인공이 되어보세요!</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 text-green-800 bg-green-100 rounded-md hover:bg-green-200"
            onClick={() => {
              window.location.href = `/community/post/write`;
            }}
          >
            글쓰기
          </button>
        </div>

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
      </main>
      {/* 기존 코드 유지 */}
      <Footer />
      <Modal
        isOpen={showLengthModal}
        onClose={() => setShowLengthModal(false)}
        message="공백없이 2글자 이상 입력해주세요!"
      />
    </div>
  );
}
