// components/ranking/RankingNavigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const RANKING_ROUTES = [
  { path: "/ranking/level", label: "레벨" },
  { path: "/ranking/post", label: "게시물" },
  { path: "/ranking/collection", label: "도감" },
  { path: "/ranking/boss", label: "보스" },
  { path: "/ranking/money", label: "돈" },
] as const;

export default function RankingNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex mb-8 border-b">
      <div className="w-24 py-2 font-bold text-center border-r">카테고리</div>
      <div className="flex flex-1">
        {RANKING_ROUTES.map(({ path, label }) => (
          <Link
            key={path}
            href={path}
            className={`px-6 py-2 text-gray-600 ${
              pathname === path
                ? "border-b-2 border-black font-bold text-black"
                : "hover:text-black"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
