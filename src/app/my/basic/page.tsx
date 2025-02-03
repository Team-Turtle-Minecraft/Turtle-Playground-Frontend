"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";
import { UserInfo } from "@/types/userInfo";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { refreshToken } from "@/apis/api/refreshToken";

export default function BasicInfoPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchInfo = async () => {
      try {
        // 로컬스토리지에서 토큰 확인
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          alert("로그인을 먼저 진행해주세요!");
          window.location.href = "/auth";
          return;
        }

        // 토큰이 있는 경우 유저 정보 조회
        try {
          const info = await getUserInfo();
          setUserInfo(info);
        } catch (error: any) {
          console.error("사용자 정보 로드 실패:", error);

          // 토큰이 만료되었거나 유효하지 않은 경우
          if (error.errorCode === "ExpiredAccessTokenError") {
            try {
              const newAccessToken = await refreshToken();
              if (newAccessToken) {
                const retryInfo = await getUserInfo();
                setUserInfo(retryInfo);
              } else {
                alert("로그인을 먼저 진행해주세요!");
                window.location.href = "/auth";
              }
            } catch (refreshError) {
              alert("로그인을 먼저 진행해주세요!");
              window.location.href = "/auth";
            }
          } else {
            alert("로그인을 먼저 진행해주세요!");
            window.location.href = "/auth";
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-xl">로딩중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      {/* 헤더와 캐릭터 정보 사이의 구분선 */}
      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-4 py-8 mx-auto">
        {/* CharacterInfo를 메뉴 위에 배치 */}
        <CharacterInfo
          nickname={userInfo.nickname}
          title={userInfo.title}
          money={userInfo.money}
        />

        {/* 캐릭터 정보와 메뉴/컨텐츠 사이의 구분선 */}
        <div className="w-full h-px my-8 bg-gray-200"></div>

        {/* 메뉴와 컨텐츠를 포함하는 flex 컨테이너 */}
        <div className="flex">
          {/* 왼쪽 메뉴 */}
          <div className="w-48">
            <MenuNavigation currentMenu="기본 정보" />
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-grow pl-8">
            {/* 전투 직업 */}
            <div className="mb-8">
              <h3 className="text-[34px] font-bold mb-4">전투 직업</h3>
              <table className="w-[960px] border-collapse border border-[#CFD8E7]">
                <tbody>
                  <tr className="h-[50px]">
                    <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                      클래스
                    </td>
                    <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                      {userInfo.characterClass || "-"}
                    </td>
                    <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                      레벨
                    </td>
                    <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                      {userInfo.characterLevel || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 생활 직업 */}
            <div>
              <h3 className="text-[34px] font-bold mb-4">생활 직업</h3>
              <div className="space-y-4">
                {[
                  ["채집", userInfo.gatheringLevel],
                  ["농부", userInfo.farmingLevel],
                  ["요리사", userInfo.cookingLevel],
                  ["대장장이", userInfo.smithingLevel],
                  ["채굴", userInfo.miningLevel],
                  ["낚시꾼", userInfo.fisherLevel],
                ].map(([job, level]) => (
                  <table
                    key={job}
                    className="w-[960px] border-collapse border border-[#CFD8E7]"
                  >
                    <tbody>
                      <tr className="h-[50px]">
                        <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                          직업
                        </td>
                        <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                          {job}
                        </td>
                        <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                          레벨
                        </td>
                        <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                          {level || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
