export const getGoogleLoginUrl = () => {
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // prompt=select_account: 매번 계정 선택 화면을 표시
  // access_type=offline: refresh token을 받기 위해 필요
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&prompt=select_account&access_type=offline`;
};

export const getKakaoLoginUrl = () => {
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const state = "KAKAO_" + Math.random().toString(36).substring(7);

  // prompt=login: 매번 로그인 화면을 표시
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&prompt=login`;
};
