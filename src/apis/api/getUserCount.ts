import { UserCountResponse } from "@/types/userCount";

export const getUserCount = async (): Promise<UserCountResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/common/count/users`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user count");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
