// app/community/post/edit/[postId]/page.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PostType } from "@/types/postList";
import { updatePost } from "@/apis/api/updatePost";
import { fetchPostDetail } from "@/apis/api/fetchPostDetail";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/common/Modal";
import WritePostSkeletonLoading from "@/components/skeleton/PostWriterAndEditSkeletonLoading";

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

interface ImageInfo {
  url: string;
  file: File;
  isDeleted: boolean;
}

const categories = [
  { value: "Free", label: "자유" },
  { value: "Architecture", label: "건축" },
  { value: "Item", label: "아이템" },
  { value: "Solution", label: "공략" },
  { value: "Tip", label: "팁" },
];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const editorRef = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<PostType>("Free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postContent, setPostContent] = useState<{
    content: string;
    images: ImageInfo[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onUploadImage = useCallback(
    async (blob: Blob | File, callback: (url: string, alt: string) => void) => {
      try {
        const imageFile = new File(
          [blob],
          `image-${Date.now()}.${blob.type.split("/")[1]}`,
          { type: blob.type }
        );

        const tempUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          callback(tempUrl, imageFile.name);

          setImageInfos((prev) => [
            ...prev,
            {
              url: tempUrl,
              file: imageFile,
              isDeleted: false,
            },
          ]);
        };
        img.src = tempUrl;
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    },
    []
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const content = editorRef.current?.getInstance().getHTML();
    if (!content || content.length < 2) {
      alert("본문을 최소 2글자 이상 입력해주세요.");
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const currentImageUrls = new Set(
      Array.from(tempDiv.getElementsByTagName("img")).map((img) => img.src)
    );

    const activeImageFiles = imageInfos
      .filter((info) => currentImageUrls.has(info.url))
      .map((info) => info.file);

    if (activeImageFiles.length === 0) {
      alert("이미지를 첨부해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const postData = {
        postType,
        title,
        content,
      };

      formData.append(
        "post",
        new Blob([JSON.stringify(postData)], { type: "application/json" })
      );

      activeImageFiles.forEach((file) => {
        formData.append("imageFile", file);
      });

      await updatePost(Number(postId), formData);

      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });

      router.push(`/community/post/${postId}`);
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }

      try {
        if (!postId) {
          setError("게시물 ID가 없습니다");
          setIsLoading(false);
          return;
        }

        console.log("게시물 로딩 시작: ID", postId);

        const [postData, userInfo] = await Promise.all([
          fetchPostDetail(postId),
          getUserInfo(),
        ]);

        console.log("게시물 데이터 로드 완료:", postData);

        if (userInfo.nickname !== postData.creator) {
          setShowUnauthorizedModal(true);
          setIsLoading(false);
          return;
        }

        setTitle(postData.title);
        setPostType(postData.postType as PostType);

        if (
          postData.content &&
          postData.postImages &&
          postData.postImageApiUrlPrefix
        ) {
          let updatedContent = postData.content;

          // blob URL 패턴을 정규식으로 찾아 대체
          const blobPattern = /blob:(https?:\/\/[^\/]+)\/([a-z0-9-]+)/g;
          if (blobPattern.test(updatedContent)) {
            updatedContent = updatedContent.replace(
              blobPattern,
              (match, domain, blobId, offset) => {
                const imageIndex =
                  updatedContent.slice(0, offset).match(blobPattern)?.length ||
                  0;

                if (imageIndex < postData.postImages.length) {
                  return `${postData.postImageApiUrlPrefix}${postData.postImages[imageIndex]}`;
                }
                return match;
              }
            );
          }

          const imagePromises = postData.postImages.map(
            async (imagePath, index) => {
              try {
                const imageUrl = `${postData.postImageApiUrlPrefix}${imagePath}`;
                console.log(`이미지 ${index} URL:`, imageUrl);

                const response = await fetch(imageUrl);
                if (!response.ok) {
                  throw new Error(
                    `이미지 로드 실패 (HTTP ${response.status}): ${imageUrl}`
                  );
                }

                const blob = await response.blob();
                const file = new File(
                  [blob],
                  `image-${Date.now()}-${index}.${blob.type.split("/")[1]}`,
                  { type: blob.type }
                );
                const tempUrl = URL.createObjectURL(blob);

                // 이미지 URL 패턴 교체
                updatedContent = updatedContent.replace(
                  new RegExp(
                    `${postData.postImageApiUrlPrefix}${imagePath}`.replace(
                      /[.*+?^${}()|[\]\\]/g,
                      "\\$&"
                    ),
                    "g"
                  ),
                  tempUrl
                );

                return {
                  url: tempUrl,
                  file,
                  isDeleted: false,
                };
              } catch (error) {
                console.error(`이미지 ${index} 로드 실패:`, error);
                return null;
              }
            }
          );

          const loadedImages = (await Promise.all(imagePromises)).filter(
            (image): image is ImageInfo => image !== null
          );

          console.log("로드된 이미지 수:", loadedImages.length);

          setPostContent({
            content: updatedContent,
            images: loadedImages,
          });
          setImageInfos(loadedImages);
        } else {
          console.warn("게시물 데이터 누락:", {
            hasContent: !!postData.content,
            hasImages: !!postData.postImages,
            hasPrefix: !!postData.postImageApiUrlPrefix,
          });
          setPostContent({
            content: postData.content || "",
            images: [],
          });
        }
      } catch (error) {
        console.error("게시물 로드 실패:", error);
        setError("게시물을 불러오는데 실패했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();

    return () => {
      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });
    };
  }, [postId]);

  useEffect(() => {
    const editor = editorRef.current?.getInstance();
    if (editor) {
      editor.on("change", () => {
        const content = editor.getHTML();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const currentImageUrls = new Set(
          Array.from(tempDiv.getElementsByTagName("img")).map((img) => img.src)
        );

        setImageInfos((prev) =>
          prev.map((info) => ({
            ...info,
            isDeleted: !currentImageUrls.has(info.url) ? true : info.isDeleted,
          }))
        );
      });
    }

    return () => {
      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });
    };
  }, [imageInfos.length]);

  if (isLoading) {
    return <WritePostSkeletonLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <div className="p-6 text-center">
            <div className="mb-4 text-red-500">⚠️ 오류</div>
            <div className="text-gray-700">{error}</div>
            <button
              onClick={() => router.push("/community")}
              className="px-4 py-2 mt-4 text-gray-600 transition-colors border rounded hover:bg-gray-100"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow w-full">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:gap-4">
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as PostType)}
                className="px-3 py-2 text-sm border rounded-md sm:px-4 sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-32 lg:w-40"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="flex-1 px-3 py-2 text-sm border rounded-md sm:px-4 sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {postContent && (
              <div className="border rounded-md">
                <Editor
                  ref={editorRef}
                  initialValue={postContent.content}
                  height="calc(100vh - 300px)"
                  initialEditType="wysiwyg"
                  previewStyle="vertical"
                  hideModeSwitch={true}
                  useCommandShortcut={true}
                  usageStatistics={false}
                  hooks={{
                    addImageBlobHook: onUploadImage,
                  }}
                  toolbarItems={[
                    ["heading", "bold", "italic", "strike"],
                    ["hr", "quote"],
                    ["ul", "ol", "task"],
                    ["table", "image", "link"],
                    ["code", "codeblock"],
                  ]}
                  placeholder="게시물 작성시 이미지 첨부는 필수입니다!"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-gray-600 transition-colors border rounded-md sm:px-6 sm:text-base hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-green-800 transition-colors bg-green-200 rounded-md sm:px-6 sm:text-base hover:bg-green-300 disabled:bg-green-400"
            >
              {isSubmitting ? "수정 중..." : "수정"}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          router.push("/auth");
        }}
        message="로그인을 먼저 진행해주세요!"
      />

      <Modal
        isOpen={showUnauthorizedModal}
        onClose={() => {
          setShowUnauthorizedModal(false);
          router.push("/community");
        }}
        message="권한이 없습니다!"
      />
    </div>
  );
}
