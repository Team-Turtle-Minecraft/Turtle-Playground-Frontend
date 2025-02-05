// app/my/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";
import { fetchMyPosts } from "@/apis/api/fetchMyPosts";
import { PostsResponse } from "@/types/myPosts";
import CommunityContent from "@/components/user/CommunityContent";
import PostsSkeletonLoading from "@/components/skeleton/PostsSkeletonLoading";

export default function CommunityActivityPage() {
  const [posts, setPosts] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("로그인을 먼저 진행해주세요!");
          window.location.href = "/auth";
          return;
        }

        try {
          const postsData = await fetchMyPosts();
          setPosts(postsData);
        } catch (error: any) {
          console.error("데이터 로드 실패:", error);
          if (error.message === "accessToken이 없습니다.") {
            alert("로그인을 먼저 진행해주세요!");
            window.location.href = "/auth";
          }
        }
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };

    fetchData();
  }, []);

  if (loading || !posts) {
    return <PostsSkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <DashboardHeader />

      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-6 py-8 mx-auto max-w-7xl">
        <CharacterInfo />

        <div className="w-full h-px my-8 bg-gray-200"></div>

        {/* flex 컨테이너에 justify-center 추가 */}
        <div className="flex justify-center gap-8">
          {/* 좌측 메뉴 너비 고정 */}
          <div className="w-48 shrink-0">
            <MenuNavigation currentMenu="커뮤니티 활동" />
          </div>

          <div className="w-full max-w-[960px]">
            <CommunityContent posts={posts} />
          </div>
          <div className="w-48 shrink-0"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
