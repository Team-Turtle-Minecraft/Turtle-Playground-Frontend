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
  const editorRef = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<PostType>("Free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState<{
    content: string;
    images: ImageInfo[];
  } | null>(null);

  const loadPost = async () => {
    try {
      if (!params.postId) return;

      const [postData, userInfo] = await Promise.all([
        fetchPostDetail(params.postId as string),
        getUserInfo(),
      ]);

      if (userInfo.nickname !== postData.creator) {
        setShowUnauthorizedModal(true);
        setLoading(false);
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
        const imagePromises = postData.postImages.map(
          async (imagePath, index) => {
            const imageUrl = `${postData.postImageApiUrlPrefix}${imagePath}`;
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File(
              [blob],
              `image-${Date.now()}-${index}.${blob.type.split("/")[1]}`,
              {
                type: blob.type,
              }
            );
            const tempUrl = URL.createObjectURL(blob);

            updatedContent = updatedContent.replace(
              `${postData.postImageApiUrlPrefix}${imagePath}`,
              tempUrl
            );

            return {
              url: tempUrl,
              file,
              isDeleted: false,
            };
          }
        );

        const loadedImages = await Promise.all(imagePromises);

        // 에디터가 준비되었을 때 사용하기 위해 상태 저장
        setPostContent({
          content: updatedContent,
          images: loadedImages,
        });

        // 에디터가 이미 준비되어 있다면 바로 설정
        if (
          editorRef.current &&
          typeof editorRef.current.getInstance === "function"
        ) {
          try {
            const editor = editorRef.current.getInstance();
            if (editor) {
              editor.setHTML(updatedContent);
              setImageInfos(loadedImages);
            }
          } catch (error) {
            console.error("에디터 설정 중 오류:", error);
          }
        }
      }
    } catch (error) {
      console.error("게시물 로드 실패:", error);
      alert("게시물을 불러오는데 실패했습니다.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

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

      await updatePost(Number(params.postId), formData);

      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });

      router.push(`/community/post/${params.postId}`);
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setLoading(false);
      setShowLoginModal(true);
      return;
    }

    loadPost();
  }, []);

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

        imageInfos.forEach((info) => {
          if (!currentImageUrls.has(info.url) && !info.isDeleted) {
            URL.revokeObjectURL(info.url);
            info.isDeleted = true;
          }
        });
      });
    }

    return () => {
      imageInfos.forEach((info) => {
        URL.revokeObjectURL(info.url);
      });
    };
  }, [imageInfos]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          Loading...
        </div>
        <Footer />
      </div>
    );
  }

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

          {postContent && ( // postContent가 있을 때만 Editor를 렌더링
            <Editor
              ref={editorRef}
              initialValue={postContent.content} // 초기값으로 직접 설정
              height="600px"
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
          )}
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
            {isSubmitting ? "수정 중..." : "수정"}
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
