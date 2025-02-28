"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import type { AttendanceStatus } from "@/types/attendance";
import AttendanceSkeletonLoading from "@/components/skeleton/AttendanceSkeletonLoading";

export default function AttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, message: "" });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const processAttendanceHistory = (
    history: string[],
    totalDays: number
  ): { [key: string]: AttendanceStatus } => {
    const attendanceHistory: { [key: string]: AttendanceStatus } = {};
    const checkedDates = new Set(
      history.map((date: string) => date.split("T")[0])
    );
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const today = now.getDate();

    for (let day = 1; day <= today; day++) {
      const dateStr = `${year}-${month}-${day.toString().padStart(2, "0")}`;
      attendanceHistory[dateStr] = checkedDates.has(dateStr)
        ? "checked"
        : "missed";
    }

    return attendanceHistory;
  };

  useEffect(() => {
    const initPage = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

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

        const attendanceHistory = processAttendanceHistory(
          history.attendanceHistory,
          totalDays
        );

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
        setLoading(false);
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

      setLoading(true);

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

        const attendanceHistory = processAttendanceHistory(
          history.attendanceHistory,
          totalDays
        );

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

  const handleRewardClaim = async (type: "15days" | "allDays") => {
    try {
      setLoading(true);
      await claimAttendanceReward(type);

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

        const attendanceHistory = processAttendanceHistory(
          history.attendanceHistory,
          totalDays
        );

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

  if (loading) {
    return <AttendanceSkeletonLoading />; // 전체 페이지 스켈레톤으로 돌아감
  }

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <DashboardHeader />
      <div className="w-full h-px bg-gray-200"></div>
      <div className="container flex-grow px-4 py-6 mx-auto mb-20 max-w-7xl md:px-6 md:py-8 md:mb-20 lg:px-8 lg:mb-20">
        <CharacterInfo />
        <div className="w-full h-px my-6 bg-gray-200 md:my-8"></div>
        <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-8">
          <div className="w-full mb-6 lg:w-48 lg:mb-0">
            <MenuNavigation currentMenu="출석체크" />
          </div>
          <div className="w-full lg:max-w-[960px]">
            {attendanceData && (
              <AttendanceContent
                attendanceData={attendanceData}
                onAttendance={handleAttendance}
                onRewardClaim={handleRewardClaim}
              />
            )}
          </div>
          <div className="hidden w-48 lg:block"></div>
        </div>
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
      {/* 여기에 출석체크 관련 모달 추가 */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ isOpen: false, message: "" })}
        message={modalInfo.message}
      />
    </div>
  );
}
