"use client";

import Link from "next/link";

export default function MenuNavigation({
  currentMenu,
}: {
  currentMenu: string;
}) {
  const menus = [
    { name: "기본 정보", path: "/my/basic" },
    { name: "강화 정보", path: "/my/enchant" },
    { name: "커뮤니티 활동", path: "/my/posts" },
    { name: "출석체크", path: "/my/attendance" },
  ];

  return (
    <div className="flex px-4 space-x-4 overflow-x-auto lg:overflow-x-visible lg:flex-col lg:space-x-0 lg:space-y-4 lg:px-0">
      {menus.map((menu) => (
        <Link
          key={menu.name}
          href={menu.path}
          className={`text-base md:text-lg whitespace-nowrap ${
            currentMenu === menu.name
              ? "font-bold text-black"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {menu.name}
        </Link>
      ))}
    </div>
  );
}
