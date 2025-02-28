// src/app/community/post/edit/[postId]/page.tsx
"use client";

import EditPostPage from "@/components/community/PostEditPage";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();

  return <EditPostPage postId={params.postId as string} />;
}
