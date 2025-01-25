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
import { fetchAttendanceHistory } from "@/apis/api/fetchAttendanceHistory";
import { claimAttendanceReward } from "@/apis/api/attendanceReward";
import { fetchAttendanceRewardHistory } from "@/apis/api/fetchAttendanceRewardHistory";

export default function AttendancePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: "checked";
  }>({});
  const [modalInfo, setModalInfo] = useState({ isOpen: false, message: "" });
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [rewardStatus, setRewardStatus] = useState({
    fifteenDays: false,
    monthly: false,
    claimed15Days: false,
    claimedMonthly: false,
  });

  const handleAttendanceCountChange = (count: number, total: number) => {
    setAttendanceCount(count);
    setTotalDays(total);
  };

  const updateRewardStatus = async () => {
    try {
      const rewardHistory = await fetchAttendanceRewardHistory();
      setRewardStatus((prev) => ({
        ...prev,
        claimed15Days: rewardHistory.halfAttendanceRewardStatus,
        claimedMonthly: rewardHistory.fullAttendanceRewardStatus,
        fifteenDays:
          attendanceCount >= 15 && !rewardHistory.halfAttendanceRewardStatus,
        monthly:
          attendanceCount === totalDays &&
          !rewardHistory.fullAttendanceRewardStatus,
      }));
    } catch (error) {
      console.error("보상 기록 조회 실패:", error);
    }
  };

  useEffect(() => {
    updateRewardStatus();
  }, [attendanceCount, totalDays]);

  const handleRewardClaim = async (type: "15days" | "allDays") => {
    try {
      await claimAttendanceReward(type);
      await updateRewardStatus();
      setModalInfo({
        isOpen: true,
        message: "보상을 수령하였습니다!",
      });
    } catch (error) {
      console.error("보상 수령 실패:", error);
    }
  };

  const updateAttendanceData = async () => {
    try {
      const history = await fetchAttendanceHistory();
      setAttendanceCount(history.attendanceCount);
      setTotalDays(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate()
      );

      const newAttendanceData: { [key: string]: "checked" } = {};
      history.attendanceHistory.forEach((date) => {
        const dateStr = date.split("T")[0];
        newAttendanceData[dateStr] = "checked";
      });

      setAttendanceData(newAttendanceData);
    } catch (error) {
      console.error("출석 기록 조회 실패:", error);
    }
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

      await updateAttendanceData();
      setModalInfo({
        isOpen: true,
        message: "출석체크 하였습니다!",
      });
    } catch (error) {
      console.error("출석체크 실패:", error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        const [info, history] = await Promise.all([
          getUserInfo(),
          fetchAttendanceHistory(),
        ]);

        setUserInfo(info);
        setAttendanceCount(history.attendanceCount);

        const newAttendanceData: { [key: string]: "checked" } = {};
        history.attendanceHistory.forEach((date) => {
          const dateStr = date.split("T")[0];
          newAttendanceData[dateStr] = "checked";
        });

        setAttendanceData(newAttendanceData);
        setTotalDays(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).getDate()
        );

        await updateRewardStatus();
      } catch (error: any) {
        console.error("데이터 로드 실패:", error);
        if (error.errorCode === "ExpiredAccessTokenError") {
          try {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
              const [retryInfo, retryHistory] = await Promise.all([
                getUserInfo(),
                fetchAttendanceHistory(),
              ]);
              setUserInfo(retryInfo);
              await updateAttendanceData();
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
      } finally {
        setLoading(false);
      }
    };

    initPage();
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

        <div className="flex justify-center">
          <div className="w-48 shrink-0">
            <MenuNavigation currentMenu="출석체크" />
          </div>

          <div className="flex justify-center flex-1">
            <div className="w-full max-w-[800px]">
              <h3 className="text-[34px] font-bold mb-4 text-center">
                출석 체크
              </h3>

              <div className="flex flex-col items-center">
                <div className="w-full max-w-[600px] mb-8 flex justify-between">
                  <div className="px-6 py-2 bg-gray-100 rounded-full">
                    이번달 출석률: {attendanceCount}/{totalDays}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRewardClaim("15days")}
                      disabled={
                        !rewardStatus.fifteenDays || rewardStatus.claimed15Days
                      }
                      className={`px-4 py-2 rounded-full transition-colors ${
                        rewardStatus.claimed15Days
                          ? "bg-green-800 cursor-not-allowed text-white"
                          : !rewardStatus.fifteenDays
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      15일 출석 보상
                    </button>
                    <button
                      onClick={() => handleRewardClaim("allDays")}
                      disabled={
                        !rewardStatus.monthly || rewardStatus.claimedMonthly
                      }
                      className={`px-4 py-2 rounded-full transition-colors ${
                        rewardStatus.claimedMonthly
                          ? "bg-green-800 cursor-not-allowed text-white"
                          : !rewardStatus.monthly
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      월간 보상
                    </button>
                  </div>
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
