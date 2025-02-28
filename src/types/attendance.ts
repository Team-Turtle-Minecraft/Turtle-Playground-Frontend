export interface AttendanceResponse {
  message?: string;
  errorCode?: "AlreadyCheckedInError" | "PlayerNotLoggedInError";
}

export interface AttendanceHistoryResponse {
  attendanceCount: number;
  attendanceHistory: string[];
}

export type AttendanceStatus = "checked" | "missed";
