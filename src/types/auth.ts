export type SnsType = "Google" | "Naver" | "Kakao";

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface SignupData {
  snsType: SnsType;
  accessToken: string;
  nickname: string;
}
