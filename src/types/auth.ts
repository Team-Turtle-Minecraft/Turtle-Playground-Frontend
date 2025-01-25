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

export interface SignupResponse {
  message: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginResponse {
  message: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
