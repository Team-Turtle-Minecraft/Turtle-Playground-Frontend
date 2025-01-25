// app/my/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { fetchMyPosts } from "@/apis/api/fetchMyPosts";

export default function CommunityActivityPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
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
          const [info, postsData] = await Promise.all([
            getUserInfo(),
            fetchMyPosts(),
          ]);

          setUserInfo(info);
          setPosts(postsData);
        } catch (error: any) {
          console.error("데이터 로드 실패:", error);
          if (error.message === "accessToken이 없습니다.") {
            alert("로그인을 먼저 진행해주세요!");
            window.location.href = "/auth";
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-xl">로딩중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-4 py-8 mx-auto">
        <CharacterInfo
          nickname={userInfo.nickname}
          title={userInfo.title}
          money={userInfo.money}
        />

        <div className="w-full h-px my-8 bg-gray-200"></div>

        <div className="flex">
          <div className="w-48">
            <MenuNavigation currentMenu="커뮤니티 활동" />
          </div>

          <div className="flex-grow pl-8">
            <h3 className="text-[34px] font-bold mb-4">커뮤니티 활동</h3>

            {/* 작성한 게시물 수 */}
            <div className="w-[960px] mb-8 bg-[#F8F9FD] p-4 rounded">
              <div className="flex items-center justify-between">
                <span className="text-[15px]">작성한 게시물 수</span>
                <span className="text-[15px]">{posts?.postCount || 0}개</span>
              </div>
            </div>

            {/* 게시물 목록 */}
            {posts && posts.myPosts.length > 0 && (
              <div className="w-[960px] border-collapse">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#CFD8E7]">
                      <th className="w-2/3 py-4 text-left">제목</th>
                      <th className="w-1/3 py-4 text-right">작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.myPosts.map((post) => (
                      <tr
                        key={post.postId}
                        className="border-b border-[#CFD8E7]"
                      >
                        <td className="py-4">{post.title}</td>
                        <td className="py-4 text-right">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
