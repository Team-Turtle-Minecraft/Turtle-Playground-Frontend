"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PostType } from "@/types/postList";
import { createPost } from "@/apis/api/createPost";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import WritePostSkeletonLoading from "@/components/skeleton/PostWriterAndEditSkeletonLoading";

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <WritePostSkeletonLoading />,
  }
);

interface ImageInfo {
  url: string;
  file: File;
  isDeleted: boolean;
}

export default function WritePostPage() {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<PostType>("Free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 전체 페이지 로딩 상태 추가

  const categories = [
    { value: "Free", label: "자유" },
    { value: "Architecture", label: "건축" },
    { value: "Item", label: "아이템" },
    { value: "Solution", label: "공략" },
    { value: "Tip", label: "팁" },
  ];

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

      await createPost(formData);

      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });

      router.push("/community");
    } catch (error) {
      console.error("글 작성 실패:", error);
      alert("글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
      }
      // 에디터 초기화 등 필요한 작업을 수행
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 에디터 로딩 시간 고려
      setIsLoading(false);
    };

    initializePage();

    return () => {
      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });
    };
  }, []);

  if (isLoading) {
    return <WritePostSkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow w-full">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6">
            {/* 카테고리/제목 입력 영역 */}
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

            {/* 에디터 영역 */}
            <div className="border rounded-md">
              <Editor
                ref={editorRef}
                initialValue={" "}
                height="calc(100vh - 300px)"
                initialEditType="wysiwyg"
                previewStyle="tab"
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
          </div>

          {/* 버튼 영역 */}
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
              className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md sm:px-6 sm:text-base hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? "게시 중..." : "게시"}
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
    </div>
  );
}
