"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "@/apis/api/getUserInfo";
import type { UserInfo } from "@/types/userInfo";
import { TITLE_MAPPING, TitleKey } from "@/types/title";

export default function CharacterInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const displayTitle = (title: string) => {
    return TITLE_MAPPING[title as TitleKey] || title;
  };

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
    <div className="flex justify-center w-full px-4 md:px-0">
      <div className="flex flex-col items-center md:flex-row md:items-center md:gap-[50px] lg:gap-[100px]">
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <h1 className="text-2xl md:text-3xl lg:text-[36px] mb-2">
            {userInfo.nickname}님
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-[36px] mb-4 md:mb-6">
            캐릭터 정보
          </h2>
          <img
            src={`https://api.creepernation.net/avatar/${userInfo.nickname}`}
            alt={userInfo.nickname}
            className="w-[120px] h-[124px] md:w-[130px] md:h-[134px] lg:w-[150px] lg:h-[154.64px]"
          />
        </div>

        <div className="mt-4 md:mt-[100px] lg:mt-[150px]">
          <table className="w-full md:w-[350px] lg:w-[400px] border-collapse border border-[#CFD8E7]">
            <tbody>
              <tr>
                <td className="w-[100px] md:w-[130px] lg:w-[159px] text-center p-3 md:p-4 text-sm md:text-base lg:text-[15px] bg-[#F5F7FC] border border-[#CFD8E7]">
                  칭호
                </td>
                <td className="text-center p-3 md:p-4 text-sm md:text-base lg:text-[15px] border border-[#CFD8E7]">
                  {displayTitle(userInfo.title)}
                </td>
              </tr>
              <tr>
                <td className="text-center p-3 md:p-4 text-sm md:text-base lg:text-[15px] bg-[#F5F7FC] border border-[#CFD8E7]">
                  보유 자산
                </td>
                <td className="text-center p-3 md:p-4 text-sm md:text-base lg:text-[15px] border border-[#CFD8E7]">
                  {userInfo.money.toLocaleString()}원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
