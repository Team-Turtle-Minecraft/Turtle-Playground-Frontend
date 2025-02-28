// components/posts/CommunityContent.tsx
"use client";

import { PostsResponse } from "@/types/myPosts";
import { UserInfo } from "@/types/userInfo";

interface CommunityContentProps {
  posts: PostsResponse;
}

export default function CommunityContent({ posts }: { posts: PostsResponse }) {
  return (
    <div className="w-full px-4 md:px-6 lg:px-0">
      <h3 className="text-2xl md:text-3xl lg:text-[34px] font-bold mb-4 md:mb-6">
        커뮤니티 활동
      </h3>

      <div className="w-full mb-6 md:mb-8 bg-[#F8F9FD] p-4 rounded">
        <div className="flex items-center justify-between">
          <span className="text-sm md:text-[15px]">작성한 게시물 수</span>
          <span className="text-sm md:text-[15px]">
            {posts.postCount || 0}개
          </span>
        </div>
      </div>

      {posts && posts.myPosts.length > 0 ? (
        <div className="w-full">
          {/* 데스크탑 테이블 뷰 */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#CFD8E7]">
                  <th className="w-2/3 py-4 text-left font-medium text-[15px]">
                    제목
                  </th>
                  <th className="w-1/3 py-4 text-right font-medium text-[15px]">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.myPosts.map((post) => (
                  <tr key={post.postId} className="border-b border-[#CFD8E7]">
                    <td
                      className="py-4 text-[15px] cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        (window.location.href = `/community/post/${post.postId}`)
                      }
                    >
                      {post.title}
                    </td>
                    <td className="py-4 text-right text-[15px] text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="space-y-4 md:hidden">
            {posts.myPosts.map((post) => (
              <div
                key={post.postId}
                className="p-4 transition-shadow bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
                onClick={() =>
                  (window.location.href = `/community/post/${post.postId}`)
                }
              >
                <h4 className="mb-2 text-base font-medium">{post.title}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          작성한 게시물이 없습니다.
        </div>
      )}
    </div>
  );
}
