// app/my/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";
import Modal from "@/components/common/Modal";

import { checkAttendance } from "@/apis/api/attendance";
import { fetchAttendanceHistory } from "@/apis/api/fetchAttendanceHistory";
import { claimAttendanceReward } from "@/apis/api/attendanceReward";
import { fetchAttendanceRewardHistory } from "@/apis/api/fetchAttendanceRewardHistory";
import AttendanceContent from "@/components/user/AttendanceContent";
import AttendanceSkeletonLoading from "@/components/skeleton/AttendanceSkeletonLoading";

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    const initPage = async () => {
      try {
        const [history, rewardHistory] = await Promise.all([
          fetchAttendanceHistory(),
          fetchAttendanceRewardHistory(),
        ]);

        const totalDays = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();

        const attendanceHistory: { [key: string]: "checked" } = {};
        history.attendanceHistory.forEach((date: string) => {
          const dateStr = date.split("T")[0];
          attendanceHistory[dateStr] = "checked";
        });

        setAttendanceData({
          attendanceCount: history.attendanceCount,
          totalDays,
          rewardStatus: {
            fifteenDays:
              history.attendanceCount >= 15 &&
              !rewardHistory.halfAttendanceRewardStatus,
            monthly:
              history.attendanceCount === totalDays &&
              !rewardHistory.fullAttendanceRewardStatus,
            claimed15Days: rewardHistory.halfAttendanceRewardStatus,
            claimedMonthly: rewardHistory.fullAttendanceRewardStatus,
          },
          attendanceHistory,
        });
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };

    initPage();
  }, []);

  const handleAttendance = async () => {
    try {
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

      // 로딩 상태 설정
      setLoading(true);

      try {
        // 출석체크 성공 후 데이터 새로고침
        const [history, rewardHistory] = await Promise.all([
          fetchAttendanceHistory(),
          fetchAttendanceRewardHistory(),
        ]);

        const totalDays = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();

        const attendanceHistory: { [key: string]: "checked" } = {};
        history.attendanceHistory.forEach((date: string) => {
          const dateStr = date.split("T")[0];
          attendanceHistory[dateStr] = "checked";
        });

        setAttendanceData({
          attendanceCount: history.attendanceCount,
          totalDays,
          rewardStatus: {
            fifteenDays:
              history.attendanceCount >= 15 &&
              !rewardHistory.halfAttendanceRewardStatus,
            monthly:
              history.attendanceCount === totalDays &&
              !rewardHistory.fullAttendanceRewardStatus,
            claimed15Days: rewardHistory.halfAttendanceRewardStatus,
            claimedMonthly: rewardHistory.fullAttendanceRewardStatus,
          },
          attendanceHistory,
        });

        setModalInfo({
          isOpen: true,
          message: "출석체크 하였습니다!",
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("출석체크 실패:", error);
      setModalInfo({
        isOpen: true,
        message: "출석체크에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  // AttendancePage.tsx - return 부분 수정
  if (loading) {
    return <AttendanceSkeletonLoading />;
  }

  if (!attendanceData) {
    return <div>데이터를 불러오는 중에 오류가 발생했습니다.</div>;
  }

  const handleRewardClaim = async (type: "15days" | "allDays") => {
    try {
      setLoading(true);
      await claimAttendanceReward(type);

      try {
        // 보상 수령 후 데이터 새로고침
        const [history, rewardHistory] = await Promise.all([
          fetchAttendanceHistory(),
          fetchAttendanceRewardHistory(),
        ]);

        const totalDays = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();

        const attendanceHistory: { [key: string]: "checked" } = {};
        history.attendanceHistory.forEach((date: string) => {
          const dateStr = date.split("T")[0];
          attendanceHistory[dateStr] = "checked";
        });

        setAttendanceData({
          attendanceCount: history.attendanceCount,
          totalDays,
          rewardStatus: {
            fifteenDays:
              history.attendanceCount >= 15 &&
              !rewardHistory.halfAttendanceRewardStatus,
            monthly:
              history.attendanceCount === totalDays &&
              !rewardHistory.fullAttendanceRewardStatus,
            claimed15Days: rewardHistory.halfAttendanceRewardStatus,
            claimedMonthly: rewardHistory.fullAttendanceRewardStatus,
          },
          attendanceHistory,
        });

        setModalInfo({
          isOpen: true,
          message: "보상을 수령하였습니다!",
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("보상 수령 실패:", error);
      setModalInfo({
        isOpen: true,
        message: "보상 수령에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <DashboardHeader />

      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-6 py-8 mx-auto max-w-7xl">
        <CharacterInfo />

        <div className="w-full h-px my-8 bg-gray-200"></div>

        {/* flex 컨테이너에 justify-center 추가 */}
        <div className="flex justify-center gap-8">
          {/* 좌측 메뉴 너비 고정 */}
          <div className="w-48 shrink-0">
            <MenuNavigation currentMenu="출석체크" />
          </div>

          <div className="w-full max-w-[960px]">
            <AttendanceContent
              attendanceData={attendanceData}
              onAttendance={handleAttendance}
              onRewardClaim={handleRewardClaim}
            />
          </div>

          <div className="w-48 shrink-0"></div>
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
