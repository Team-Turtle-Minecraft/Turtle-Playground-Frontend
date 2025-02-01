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

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <p>에디터 로딩중...</p>,
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

    // 현재 에디터에 표시된 이미지 URL들을 가져옴
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const currentImageUrls = new Set(
      Array.from(tempDiv.getElementsByTagName("img")).map((img) => img.src)
    );

    // 현재 에디터에 있는 이미지 파일들만 필터링
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

      // 현재 에디터에 표시된 이미지 파일들만 전송
      activeImageFiles.forEach((file) => {
        formData.append("imageFile", file);
      });

      await createPost(formData);

      // 모든 임시 URL 정리
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
    // 로그인 체크
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginModal(true);
    }

    const editor = editorRef.current?.getInstance();
    if (editor) {
      editor.on("change", () => {
        const content = editor.getHTML();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const currentImageUrls = new Set(
          Array.from(tempDiv.getElementsByTagName("img")).map((img) => img.src)
        );

        // 현재 에디터에 없는 이미지들의 URL 정리
        imageInfos.forEach((info) => {
          if (!currentImageUrls.has(info.url) && !info.isDeleted) {
            URL.revokeObjectURL(info.url);
            info.isDeleted = true;
          }
        });
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 모든 임시 URL 정리
      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });
    };
  }, [imageInfos]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container flex-grow px-4 py-8 mx-auto">
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              className="px-4 py-2 border rounded-md"
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
              className="flex-1 px-4 py-2 border rounded-md"
            />
          </div>

          <Editor
            ref={editorRef}
            initialValue={" "}
            height="600px"
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

        <div className="flex justify-end gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? "게시 중..." : "게시"}
          </button>
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
