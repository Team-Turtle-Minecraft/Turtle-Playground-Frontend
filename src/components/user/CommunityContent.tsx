// components/posts/CommunityContent.tsx
"use client";

import { PostsResponse } from "@/types/myPosts";
import { UserInfo } from "@/types/userInfo";

interface CommunityContentProps {
  posts: PostsResponse;
}

export default function CommunityContent({ posts }: CommunityContentProps) {
  return (
    <div className="w-full max-w-[960px]">
      <h3 className="text-[34px] font-bold mb-4">커뮤니티 활동</h3>

      <div className="w-full mb-8 bg-[#F8F9FD] p-4 rounded">
        <div className="flex items-center justify-between">
          <span className="text-[15px]">작성한 게시물 수</span>
          <span className="text-[15px]">{posts.postCount || 0}개</span>
        </div>
      </div>

      {posts && posts.myPosts.length > 0 && (
        <div className="w-full border-collapse">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#CFD8E7]">
                <th className="w-2/3 py-4 text-left">제목</th>
                <th className="w-1/3 py-4 text-right">작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.myPosts.map((post) => (
                <tr key={post.postId} className="border-b border-[#CFD8E7]">
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
  );
}
