"use client";

// src/components/contents/ContentNavigation.tsx
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navigation() {
  const pathname = usePathname();

  const navigationItems = [
    { name: "스토리 시스템", path: "/contents/story-system" },
    { name: "도전과제 시스템", path: "/contents/achievement-system" },
    { name: "전투 시스템", path: "/contents/combat-system" },
    { name: "생활 시스템", path: "/contents/living-system" },
  ];

  return (
    <nav className="w-48">
      <div className="text-right">
        <h2 className="mb-8 text-xl">Contents</h2>
        <div className="flex flex-col items-end space-y-4">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm ${
                pathname === item.path
                  ? "text-gray-900"
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
