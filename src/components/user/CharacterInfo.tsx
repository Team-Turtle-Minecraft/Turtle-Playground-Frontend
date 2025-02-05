// components/user/CharacterInfo.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "@/apis/api/getUserInfo";
import type { UserInfo } from "@/types/userInfo";

export default function CharacterInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    fetchData();
  }, []);

  if (!userInfo) return null;

  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center gap-[100px]">
        <div className="flex flex-col items-center">
          <h1 className="text-[36px] mb-2">{userInfo.nickname}님</h1>
          <h2 className="text-[36px] mb-6">캐릭터 정보</h2>
          <img
            src={`https://api.creepernation.net/avatar/${userInfo.nickname}`}
            alt={userInfo.nickname}
            className="w-[150px] h-[154.64px]"
          />
        </div>

        <div className="mt-[150px]">
          <table className="w-[400px] border-collapse border border-[#CFD8E7]">
            <tbody>
              <tr>
                <td className="w-[159px] text-center p-4 text-[15px] bg-[#F5F7FC] border border-[#CFD8E7]">
                  칭호
                </td>
                <td className="w-[241px] text-center p-4 text-[15px] border border-[#CFD8E7]">
                  {userInfo.title}
                </td>
              </tr>
              <tr>
                <td className="w-[159px] text-center p-4 text-[15px] bg-[#F5F7FC] border border-[#CFD8E7]">
                  보유 자산
                </td>
                <td className="w-[241px] text-center p-4 text-[15px] border border-[#CFD8E7]">
                  {userInfo.money}G
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
