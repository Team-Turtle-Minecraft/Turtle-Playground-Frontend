"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";
import Calendar from "@/components/user/Calendar";
import Modal from "@/components/common/Modal";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { refreshToken } from "@/apis/api/refreshToken";
import { checkAttendance } from "@/apis/api/attendance";

export default function AttendancePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: "checked" | "missed";
  }>({});
  const [modalInfo, setModalInfo] = useState({ isOpen: false, message: "" });
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const handleAttendanceCountChange = (count: number, total: number) => {
    setAttendanceCount(count);
    setTotalDays(total);
  };

  const handleAttendance = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인을 먼저 진행해주세요!");
        window.location.href = "/auth";
        return;
      }

      const response = await checkAttendance();

      if (response.errorCode) {
        if (response.errorCode === "AlreadyCheckedInError") {
          setModalInfo({
            isOpen: true,
            message: "이미 출석체크를 하셨습니다.",
          });
        } else if (response.errorCode === "PlayerNotLoggedInError") {
          setModalInfo({
            isOpen: true,
            message: "먼저 거북이 놀이터에 접속해주세요!",
          });
        }
        return;
      }

      // 출석 성공 시 캘린더 업데이트
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      setAttendanceData((prev) => ({
        ...prev,
        [dateStr]: "checked",
      }));
    } catch (error) {
      console.error("출석체크 실패:", error);
    }
  };

  useEffect(() => {
    const checkAuthAndFetchInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          alert("로그인을 먼저 진행해주세요!");
          window.location.href = "/auth";
          return;
        }

        try {
          const info = await getUserInfo();
          setUserInfo(info);
        } catch (error: any) {
          console.error("사용자 정보 로드 실패:", error);

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

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-4 py-8 mx-auto">
        <CharacterInfo
          nickname={userInfo?.nickname}
          title={userInfo?.title}
          money={userInfo?.money}
        />

        <div className="w-full h-px my-8 bg-gray-200"></div>

        {/* 전체 컨텐츠를 감싸는 컨테이너 */}
        <div className="flex justify-center">
          {/* 왼쪽 메뉴 */}
          <div className="w-48 shrink-0">
            <MenuNavigation currentMenu="출석체크" />
          </div>

          {/* 가운데 정렬을 위한 wrapper */}
          <div className="flex justify-center flex-1">
            {/* 메인 컨텐츠 영역 */}
            <div className="w-full max-w-[800px]">
              <h3 className="text-[34px] font-bold mb-4 text-center">
                출석 체크
              </h3>

              <div className="flex flex-col items-center">
                <div className="px-6 py-2 mb-8 bg-gray-100 rounded-full">
                  이번달 출석률: {attendanceCount}/{totalDays}
                </div>

                <Calendar
                  attendanceData={attendanceData}
                  onAttendanceCountChange={handleAttendanceCountChange}
                />

                <p className="mt-8 mb-8 text-center">
                  출석 체크는 매일 오전 6시에 초기화됩니다!
                </p>

                <button
                  onClick={handleAttendance}
                  className="px-12 py-3 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  출석하기
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 여백을 위한 더미 div */}
          <div className="w-48 shrink-0" />
        </div>
      </div>

      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ isOpen: false, message: "" })}
        message={modalInfo.message}
      />

      <Footer />
    </div>
  );
}
