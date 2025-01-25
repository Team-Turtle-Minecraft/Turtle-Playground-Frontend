import {
  AlreadyExistNicknameError,
  UserNotFoundErrorInTurtlePlayGround,
} from "../utility/errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/check/nickname`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: `include`,
    body: JSON.stringify({ nickname }),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    console.log(errorResult);

    if (errorResult.errorCode === "UserNotFoundErrorInTurtlePlayGround")
      throw new UserNotFoundErrorInTurtlePlayGround(errorResult.message);

    if (errorResult.errorCode === "AlreadyExistNicknameError")
      throw new AlreadyExistNicknameError(errorResult.message);
  }
  return true;
};
