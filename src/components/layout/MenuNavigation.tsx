// components/layout/MenuNavigation.tsx
"use client";

import Link from "next/link";

interface MenuNavigationProps {
  currentMenu: string;
}

export default function MenuNavigation({ currentMenu }: MenuNavigationProps) {
  const menus = [
    { name: "기본 정보", path: "/my/basic" },
    { name: "강화 정보", path: "/my/enhancement" },
    { name: "커뮤니티 활동", path: "/my/community" },
    { name: "출석체크", path: "/my/attendance" },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {menus.map((menu) => (
        <Link
          key={menu.name}
          href={menu.path}
          className={`text-lg ${currentMenu === menu.name ? "font-bold" : ""}`}
        >
          {menu.name}
        </Link>
      ))}
    </div>
  );
}
