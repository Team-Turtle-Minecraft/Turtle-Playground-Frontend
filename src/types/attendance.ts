export interface AttendanceResponse {
  message?: string;
  errorCode?: "AlreadyCheckedInError" | "PlayerNotLoggedInError";
}
