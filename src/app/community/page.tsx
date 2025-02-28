// app/community/page.tsx
"use client";

import { Suspense } from "react";
import CommunityContent from "@/components/community/CommunityContent";
import CommunitySkeletonLoading from "@/components/skeleton/CommunityMainSkeletonLoading";

export default function CommunityPage() {
  return (
    <Suspense fallback={<CommunitySkeletonLoading />}>
      <CommunityContent />
    </Suspense>
  );
}
