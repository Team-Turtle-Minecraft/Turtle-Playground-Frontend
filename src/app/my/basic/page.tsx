// BasicInfoPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";
import Modal from "@/components/common/Modal";
import { getUserInfo } from "@/apis/api/getUserInfo";
import type { UserInfo } from "@/types/userInfo";
import BasicInfoContent from "@/components/user/BasicInfoContent";
import BasicInfoSkeletonLoading from "@/components/skeleton/BasicInfoSkeletonLoading";
import { BasicInfoSkeletonContent } from "@/components/skeleton/BasicInfoSkeletonContent";

// BasicInfoPage.tsx
export default function BasicInfoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        if (error instanceof Error && error.message === "토큰이 없습니다.") {
          setShowLoginModal(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <DashboardHeader />
      <div className="w-full h-px bg-gray-400"></div>
      <div className="container flex-grow px-4 py-6 mx-auto mb-20 max-w-7xl md:px-6 md:mb-20 md:py-8 lg:px-8 lg:mb-20">
        {loading ? (
          // 로딩 상태일 때는 CharacterInfo와 컨텐츠 부분만 스켈레톤으로 표시
          <>
            <BasicInfoSkeletonContent />
          </>
        ) : (
          // 로딩이 완료되면 실제 컨텐츠 표시
          <>
            <CharacterInfo />
            <div className="w-full h-px my-6 bg-gray-200 md:my-8"></div>
            <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-8">
              <div className="w-full mb-6 lg:w-48 lg:mb-0">
                <MenuNavigation currentMenu="기본 정보" />
              </div>
              <div className="w-full lg:max-w-[960px]">
                {userInfo && <BasicInfoContent userInfo={userInfo} />}
              </div>
              <div className="hidden w-48 lg:block"></div>
            </div>
          </>
        )}
      </div>
      <Footer />
      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          router.push("/auth");
        }}
        message="로그인을 먼저 진행해주세요!"
      />
    </div>
  );
}
