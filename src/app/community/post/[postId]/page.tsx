// app/community/post/[postId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { UserInfo } from "@/types/userInfo";
import Modal from "@/components/common/Modal";
import { PostDetail } from "@/types/postDetail";
import { fetchPostDetail } from "@/apis/api/fetchPostDetail";
import { fetchPostLikeStatus } from "@/apis/api/fetchPostLikeStatus";
import { postLike } from "@/apis/api/postLike";
import { increasePostViews } from "@/apis/api/increasePostViews";
import { deletePost } from "@/apis/api/deletePost";
import PostDetailSkeletonLoading from "@/components/skeleton/PostDetailSkeletonLoading";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }>({
    isOpen: false,
    message: "",
    onClose: () => {},
  });
  const [likeModalConfig, setLikeModalConfig] = useState<{
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }>({
    isOpen: false,
    message: "",
    onClose: () => {},
  });

  const handleLikeToggle = async () => {
    if (!post) return;

    try {
      const currentIsLiked = isLiked;
      setIsLiked(!currentIsLiked);
      setLikeCount((prevCount) =>
        currentIsLiked ? prevCount - 1 : prevCount + 1
      );

      try {
        await postLike(post.postId);
        const likeStatus = await fetchPostLikeStatus(post.postId.toString());
        setIsLiked(likeStatus.postLikeStatus);

        setLikeModalConfig({
          isOpen: true,
          message: !currentIsLiked
            ? "게시물에 좋아요를 누르셨습니다!"
            : "게시물에 좋아요를 취소하였습니다.",
          onClose: () => {
            setLikeModalConfig((prev) => ({ ...prev, isOpen: false }));
          },
        });

        setTimeout(() => {
          setLikeModalConfig((prev) => ({ ...prev, isOpen: false }));
        }, 2000);
      } catch (error) {
        setIsLiked(currentIsLiked);
        setLikeCount((prevCount) =>
          currentIsLiked ? prevCount + 1 : prevCount - 1
        );
        throw error;
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!post || !window.confirm("정말로 이 게시물을 삭제하시겠습니까?"))
      return;

    try {
      const result = await deletePost(post.postId);
      setModalConfig({
        isOpen: true,
        message: result.message,
        onClose: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          router.push("/community");
        },
      });
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      try {
        const userInfoData = await getUserInfo();
        setUserInfo(userInfoData);

        if (params.postId) {
          await increasePostViews(params.postId as string);
          const postData = await fetchPostDetail(params.postId as string);
          setPost(postData);
          setLikeCount(postData.likes);
          const likeStatus = await fetchPostLikeStatus(params.postId as string);
          setIsLiked(likeStatus.postLikeStatus);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.postId]);

  if (loading) {
    return <PostDetailSkeletonLoading />;
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-gray-500">게시물을 찾을 수 없습니다.</div>
        </div>
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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex flex-col flex-grow">
        {/* 게시물 헤더 영역 */}
        <div className="w-full mt-4 sm:mt-6 lg:mt-10">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="w-full h-px bg-black"></div>

            <div className="px-3 py-4 sm:py-6 sm:px-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded sm:px-3 sm:text-sm w-fit">
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
                    <h1 className="text-xl sm:text-2xl lg:text-[24px] font-medium break-all">
                      {post.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-6 sm:text-base">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <img
                        src="/assets/post-createdAt.png"
                        alt="작성시간"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <span>
                        {new Date(post.createdAt).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <img
                        src="/assets/post-views.png"
                        alt="조회수"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <span className="text-sm sm:text-base">작성자</span>
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={`https://api.creepernation.net/avatar/${post.creator}`}
                      alt="작성자 아바타"
                      className="w-8 h-8 rounded sm:w-10 sm:h-10"
                    />
                    <span className="text-sm sm:text-base">{post.creator}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#B5B5B5] w-full"></div>
          </div>
        </div>

        {/* 본문 영역 */}
        <main className="flex-grow w-full">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="p-3 sm:p-6">
              <div
                className="prose max-w-none prose-img:mx-auto prose-img:my-4"
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(
                    /blob:http:\/\/localhost:3000\/[a-z0-9-]+/g,
                    (match, offset) => {
                      const imageIndex =
                        post.content
                          .slice(0, offset)
                          .match(/blob:http:\/\/localhost:3000\/[a-z0-9-]+/g)
                          ?.length || 0;
                      return `${post.postImageApiUrlPrefix}${post.postImages[imageIndex]}`;
                    }
                  ),
                }}
              />
            </div>

            {/* 좋아요 버튼 */}
            <div className="flex justify-center mt-8 sm:mt-12">
              <button
                className="flex items-center gap-2 transition-colors sm:gap-3 hover:opacity-80"
                onClick={handleLikeToggle}
              >
                <img
                  src={
                    isLiked
                      ? "/assets/post-like.png"
                      : "/assets/post-unlike.png"
                  }
                  alt={isLiked ? "좋아요 취소" : "좋아요"}
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
                <span className="text-lg sm:text-xl">{likeCount}</span>
              </button>
            </div>

            <div className="h-px bg-[#B5B5B5] my-6 sm:my-8"></div>

            {/* 작성자 전용 버튼 */}
            {userInfo?.nickname === post.creator && (
              <div className="flex justify-end mt-4 space-x-2 sm:space-x-4">
                <button
                  onClick={() =>
                    router.push(`/community/post/edit/${post.postId}`)
                  }
                  className="px-3 py-2 text-sm text-white transition-colors bg-blue-500 rounded sm:px-4 sm:text-base hover:bg-blue-600"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 text-sm text-white transition-colors bg-red-500 rounded sm:px-4 sm:text-base hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            )}

            {/* 목록으로 버튼 */}
            <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-sm text-gray-600 transition-colors border rounded sm:px-6 sm:text-base hover:bg-gray-100"
              >
                목록으로
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* 모달 컴포넌트들 */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={modalConfig.onClose}
        message={modalConfig.message}
      />
      <Modal
        isOpen={likeModalConfig.isOpen}
        onClose={likeModalConfig.onClose}
        message={likeModalConfig.message}
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
