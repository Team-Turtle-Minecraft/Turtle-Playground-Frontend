export const logout = async (refreshToken: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: "POST",
      headers: {
        "Authorization-refresh": `Bearer ${refreshToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }
};
