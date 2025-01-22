export const getGoogleLoginUrl = () => {
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
};

export const getKakaoLoginUrl = () => {
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const state = "KAKAO_" + Math.random().toString(36).substring(7);
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
};
