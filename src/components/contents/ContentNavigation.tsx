"use client";
// src/app/contents/combat-system/Navigation.tsx
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navigation() {
  const pathname = usePathname();

  const navigationItems = [
    { name: "전투 시스템", path: "/contents/combat-system" },
    { name: "생활 시스템", path: "/contents/living-system" },
    { name: "도전과제 시스템", path: "/contents/achievement-system" },
    { name: "스토리 시스템", path: "/contents/story-system" },
  ];

  return (
    <nav className="w-48 ">
      <div className="text-right ">
        <h2 className="text-[20px] font-medium mb-8">Contents</h2>
        <div className="flex flex-col space-y-4 items-right">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-[14px] ${
                pathname === item.path
                  ? "text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
