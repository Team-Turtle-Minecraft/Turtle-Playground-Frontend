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
    <div className="flex flex-col mb-4 border-b sm:flex-row sm:mb-6 md:mb-8">
      <div className="w-full py-2 font-bold text-center sm:w-24 sm:border-r">
        카테고리
      </div>
      <div className="flex flex-wrap w-full sm:flex-nowrap">
        {RANKING_ROUTES.map(({ path, label }) => (
          <Link
            key={path}
            href={path}
            className={`flex-1 sm:flex-none text-center px-3 sm:px-6 py-2 text-sm sm:text-base text-gray-600 
              ${
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
