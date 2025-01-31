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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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
      // 낙관적 업데이트
      setIsLiked(!currentIsLiked);
      setLikeCount((prevCount) =>
        currentIsLiked ? prevCount - 1 : prevCount + 1
      );

      try {
        await postLike(post.postId);
        const likeStatus = await fetchPostLikeStatus(post.postId.toString());
        setIsLiked(likeStatus.postLikeStatus);

        // 모달 메시지 설정 및 표시
        setLikeModalConfig({
          isOpen: true,
          message: !currentIsLiked
            ? "게시물에 좋아요를 누르셨습니다!"
            : "게시물에 좋아요를 취소하였습니다.",
          onClose: () => {
            setLikeModalConfig((prev) => ({ ...prev, isOpen: false }));
          },
        });

        // 2초 후 자동으로 모달 닫기
        setTimeout(() => {
          setLikeModalConfig((prev) => ({ ...prev, isOpen: false }));
        }, 2000);
      } catch (error) {
        // 실패시 원래 상태로 되돌리기
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
      try {
        const userInfoData = await getUserInfo();
        setUserInfo(userInfoData);

        if (params.postId) {
          await increasePostViews(params.postId as string);
          const postData = await fetchPostDetail(params.postId as string);
          setPost(postData);
          setIsLiked(postData.isLiked);
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

  if (loading) return <div className="min-h-screen">Loading...</div>;
  if (!post)
    return <div className="min-h-screen">게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-col items-center w-full mt-[129px]">
        <div className="w-[1260px] h-[1px] bg-black"></div>

        {/* 게시물 정보 영역 */}
        <div className="w-[1260px] py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm bg-gray-100 rounded">
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
                <h1 className="text-[24px] font-medium">{post.title}</h1>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/post-createdAt.png"
                    alt="작성시간"
                    className="w-5 h-5"
                  />
                  <p className="text-[15px]">
                    {new Date(post.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/post-views.png"
                    alt="조회수"
                    className="w-5 h-5"
                  />
                  <span className="text-[15px]">{post.views}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[15px]">작성자</span>
              <div className="flex flex-col items-center gap-1">
                <img
                  src={`https://api.creepernation.net/avatar/${post.creator}`}
                  alt="작성자 아바타"
                  className="w-10 h-10 rounded"
                />
                <span className="text-[15px]">{post.creator}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1260px] h-[1px] bg-[#B5B5B5]"></div>
      </div>

      <main className="flex flex-col items-center w-full">
        <div className="w-[1260px] p-6">
          <div
            className="prose max-w-none"
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

        {/* 좋아요 */}
        <div className="w-[1260px] flex justify-center mt-12">
          <button
            className="flex items-center gap-3 transition-colors hover:opacity-80"
            onClick={handleLikeToggle}
          >
            <img
              src={
                isLiked ? "/assets/post-like.png" : "/assets/post-unlike.png"
              }
              alt={isLiked ? "좋아요 취소" : "좋아요"}
              className="w-7 h-7"
            />
            <span className="text-[20px]">{likeCount}</span>
          </button>
        </div>

        {/* 수평선 추가 */}
        <div className="w-[1260px] h-[1px] bg-[#B5B5B5] my-8"></div>

        {/* 작성자 전용 버튼 */}
        {userInfo?.nickname === post.creator && (
          <div className="w-[1260px] flex justify-end space-x-4 mt-4">
            <button
              onClick={() => router.push(`/community/post/edit/${post.postId}`)}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        )}

        {/* 돌아가기 버튼 */}
        <div className="w-[1260px] flex justify-center mb-40">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 border rounded hover:bg-gray-100"
          >
            목록으로
          </button>
        </div>
      </main>

      <Footer />

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
    </div>
  );
}
