// app/community/search/page.tsx
"use client";

import SearchContent from "@/components/community/SearchContent";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
