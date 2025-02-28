import { useEffect, useMemo } from "react";
import type { AttendanceStatus } from "@/types/attendance";

interface CalendarProps {
  attendanceData: { [key: string]: AttendanceStatus };
  onAttendanceCountChange: (count: number, total: number) => void;
}

const Calendar = ({
  attendanceData,
  onAttendanceCountChange,
}: CalendarProps) => {
  const { calendar, totalDays } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const weeks: number[][] = [];
    let currentWeek: number[] = [];

    // 첫 주의 빈 날짜 채우기
    for (let i = 0; i < startingDay; i++) {
      currentWeek.push(0);
    }

    // 날짜 채우기
    for (let day = 1; day <= totalDays; day++) {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // 마지막 주 남은 공간 채우기
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      weeks.push(currentWeek);
    }

    return { calendar: weeks, totalDays };
  }, []);

  const getDateStatus = (day: number): AttendanceStatus | "" => {
    if (day === 0) return "";

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

    return attendanceData[dateStr];
  };

  const getDateStyle = (
    day: number
  ): { className: string; style?: React.CSSProperties } => {
    if (day === 0) return { className: "bg-transparent" };

    const status = getDateStatus(day);
    if (status === "checked") {
      return {
        className: "rounded-lg shadow",
        style: { backgroundColor: "#DEF6DC" },
      };
    }
    if (status === "missed") {
      return { className: "bg-gray-300 rounded-lg shadow" };
    }
    return { className: "bg-white rounded-lg shadow" };
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2 text-center md:gap-2 md:mb-4">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="text-xs font-bold text-gray-600 md:text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {calendar.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`aspect-square flex items-center justify-center relative
                ${getDateStyle(day).className}`}
              style={getDateStyle(day).style}
            >
              {day !== 0 && (
                <span className="text-xs font-medium md:text-sm">{day}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
