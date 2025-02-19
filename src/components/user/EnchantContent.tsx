// components/enchant/EnchantContent.tsx
"use client";

import { UserInfo } from "@/types/userInfo";

interface CircleChartProps {
  successRate: number;
}

interface EnchantContentProps {
  userInfo: UserInfo;
}

const CircleChart = ({ successRate }: CircleChartProps) => {
  const circleStyle = {
    backgroundImage: `conic-gradient(
      #4ade80 0% ${successRate}%,
      #f87171 ${successRate}% 100%
    )`,
  };

  return (
    <div className="relative flex items-center justify-center w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80">
      <div
        className="w-48 h-48 rounded-full md:w-56 md:h-56 lg:w-64 lg:h-64"
        style={circleStyle}
      />
      <div className="absolute bg-white rounded-full w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48" />
      <div className="absolute text-xl font-bold md:text-2xl lg:text-3xl">
        {successRate.toFixed(2)}%
      </div>
    </div>
  );
};

export default function EnchantContent({ userInfo }: EnchantContentProps) {
  return (
    <div className="w-full px-4 md:px-6 lg:px-0">
      <h3 className="text-2xl md:text-3xl lg:text-[34px] font-bold mb-6 md:mb-8">
        강화 정보
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4 md:gap-4 md:mb-8">
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            전체 시도
          </h4>
          <p className="text-xl font-bold text-gray-800 md:text-2xl lg:text-3xl">
            {userInfo.totalEnchantAttempts}회
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            성공
          </h4>
          <p className="text-xl font-bold text-green-500 md:text-2xl lg:text-3xl">
            {userInfo.totalEnchantSuccess}회
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            실패
          </h4>
          <p className="text-xl font-bold text-red-500 md:text-2xl lg:text-3xl">
            {userInfo.totalEnchantFail}회
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            성공률
          </h4>
          <p className="text-xl font-bold text-blue-500 md:text-2xl lg:text-3xl">
            {userInfo.totalEnchantRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800 md:mb-6 md:text-xl">
          강화 성공/실패 비율
        </h4>
        <div className="flex flex-col items-center">
          <CircleChart successRate={userInfo.totalEnchantRate} />
          <div className="flex flex-col justify-center gap-4 mt-4 md:flex-row md:gap-8 md:mt-6">
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 mr-2 bg-green-400 rounded-full md:w-4 md:h-4" />
              <span className="text-sm md:text-base">
                성공 ({userInfo.totalEnchantSuccess}회)
              </span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 mr-2 bg-red-400 rounded-full md:w-4 md:h-4" />
              <span className="text-sm md:text-base">
                실패 ({userInfo.totalEnchantFail}회)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
