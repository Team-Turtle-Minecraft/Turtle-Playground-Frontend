// components/user/Calendar.tsx
import { useEffect, useMemo } from "react";

interface CalendarProps {
  attendanceData: { [key: string]: "checked" };
  onAttendanceCountChange: (count: number, total: number) => void;
}

const Calendar = ({
  attendanceData,
  onAttendanceCountChange,
}: CalendarProps) => {
  const { calendar, totalDays } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

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
  }, [attendanceData]);

  const getDateStatus = (day: number) => {
    if (day === 0) return "";
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;
    return attendanceData[dateStr];
  };

  return (
    <div className="w-[600px] h-[600px] bg-gray-100 p-6 rounded-lg">
      <div className="grid grid-cols-7 gap-2 mb-4 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendar.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`aspect-square flex items-center justify-center relative
                ${day === 0 ? "bg-transparent" : "bg-white rounded-lg shadow"}`}
            >
              {day !== 0 && (
                <>
                  <span>{day}</span>
                  {getDateStatus(day) === "checked" && (
                    <span className="absolute text-3xl text-green-500">✓</span>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
