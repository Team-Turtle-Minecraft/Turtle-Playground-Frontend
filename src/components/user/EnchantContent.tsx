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
    <div className="relative flex items-center justify-center w-80 h-80">
      <div className="w-64 h-64 rounded-full" style={circleStyle}></div>
      <div className="absolute w-48 h-48 bg-white rounded-full"></div>
      <div className="absolute text-3xl font-bold">
        {successRate.toFixed(2)}%
      </div>
    </div>
  );
};

export default function EnchantContent({ userInfo }: EnchantContentProps) {
  return (
    <div className="w-full max-w-[960px]">
      <h3 className="text-[34px] font-bold mb-8">강화 정보</h3>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h4 className="mb-2 text-lg font-semibold text-gray-600">
            전체 시도
          </h4>
          <p className="text-3xl font-bold text-gray-800">
            {userInfo.totalEnchantAttempts}회
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h4 className="mb-2 text-lg font-semibold text-gray-600">성공</h4>
          <p className="text-3xl font-bold text-green-500">
            {userInfo.totalEnchantSuccess}회
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h4 className="mb-2 text-lg font-semibold text-gray-600">실패</h4>
          <p className="text-3xl font-bold text-red-500">
            {userInfo.totalEnchantFail}회
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h4 className="mb-2 text-lg font-semibold text-gray-600">성공률</h4>
          <p className="text-3xl font-bold text-blue-500">
            {userInfo.totalEnchantRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="p-8 bg-white rounded-lg shadow-md">
        <h4 className="mb-6 text-xl font-semibold text-center text-gray-800">
          강화 성공/실패 비율
        </h4>
        <div className="flex flex-col items-center">
          <CircleChart successRate={userInfo.totalEnchantRate} />
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-green-400 rounded-full"></div>
              <span>성공 ({userInfo.totalEnchantSuccess}회)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-red-400 rounded-full"></div>
              <span>실패 ({userInfo.totalEnchantFail}회)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
