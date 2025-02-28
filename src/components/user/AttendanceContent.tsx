// components/attendance/AttendanceContent.tsx
"use client";

import Calendar from "./Calendar";
import type { AttendanceStatus } from "@/types/attendance";

interface AttendanceContentProps {
  attendanceData: {
    attendanceCount: number;
    totalDays: number;
    rewardStatus: {
      fifteenDays: boolean;
      monthly: boolean;
      claimed15Days: boolean;
      claimedMonthly: boolean;
    };
    attendanceHistory: { [key: string]: AttendanceStatus };
  };
  onAttendance: () => void;
  onRewardClaim: (type: "15days" | "allDays") => void;
}

export default function AttendanceContent({
  attendanceData,
  onAttendance,
  onRewardClaim,
}: AttendanceContentProps) {
  return (
    <div className="w-full px-4 md:px-6 lg:px-0">
      <h3 className="text-2xl md:text-3xl lg:text-[34px] font-bold mb-6 md:mb-8 text-center">
        출석 체크
      </h3>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-[600px] mb-6 md:mb-8">
          {/* 출석률 및 보상 버튼 */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
            <div className="px-4 py-2 text-sm text-center bg-gray-100 rounded-full md:text-base">
              이번달 출석률: {attendanceData.attendanceCount}/
              {attendanceData.totalDays}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onRewardClaim("15days")}
                disabled={
                  !attendanceData.rewardStatus.fifteenDays ||
                  attendanceData.rewardStatus.claimed15Days
                }
                className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                  attendanceData.rewardStatus.claimed15Days
                    ? "bg-green-800 cursor-not-allowed text-white"
                    : !attendanceData.rewardStatus.fifteenDays
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                15일 출석 보상
              </button>
              <button
                onClick={() => onRewardClaim("allDays")}
                disabled={
                  !attendanceData.rewardStatus.monthly ||
                  attendanceData.rewardStatus.claimedMonthly
                }
                className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                  attendanceData.rewardStatus.claimedMonthly
                    ? "bg-green-800 cursor-not-allowed text-white"
                    : !attendanceData.rewardStatus.monthly
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                월간 보상
              </button>
            </div>
          </div>
        </div>

        {/* 달력 */}
        <div className="w-full max-w-[320px] md:max-w-[500px] lg:max-w-[600px] bg-gray-100 p-4 md:p-6 rounded-lg mb-2 md:mb-2">
          <Calendar
            attendanceData={attendanceData.attendanceHistory}
            onAttendanceCountChange={(count: number, total: number) => {}}
          />
        </div>

        <p className="mt-0 mb-6 text-sm text-center md:mt-0 md:mb-8 md:text-base">
          출석 체크는 매일 오전 6시에 초기화됩니다!
        </p>

        <button
          onClick={onAttendance}
          className="px-8 py-2 text-sm text-green-800 transition-colors bg-green-200 rounded-full md:px-12 md:py-3 md:text-base hover:bg-green-300"
        >
          출석하기
        </button>
      </div>
    </div>
  );
}
