// components/attendance/AttendanceContent.tsx
"use client";

import Calendar from "./Calendar";

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
    attendanceHistory: { [key: string]: "checked" };
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
    <div className="w-full max-w-[800px]">
      <h3 className="text-[34px] font-bold mb-4 text-center">출석 체크</h3>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-[600px] mb-8 flex justify-between">
          <div className="px-6 py-2 bg-gray-100 rounded-full">
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
              className={`px-4 py-2 rounded-full transition-colors ${
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
              className={`px-4 py-2 rounded-full transition-colors ${
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

        <Calendar
          attendanceData={attendanceData.attendanceHistory}
          onAttendanceCountChange={(count: number, total: number) => {}}
        />

        <p className="mt-8 mb-8 text-center">
          출석 체크는 매일 오전 6시에 초기화됩니다!
        </p>

        <button
          onClick={onAttendance}
          className="px-12 py-3 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
        >
          출석하기
        </button>
      </div>
    </div>
  );
}
