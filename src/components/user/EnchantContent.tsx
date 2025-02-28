// components/enchant/EnchantContent.tsx
"use client";

import { UserInfo } from "@/types/userInfo";
import { useEffect, useState, useRef } from "react";

interface CircleChartProps {
  successRate: number;
  successCount: number;
  failCount: number;
}

interface EnchantContentProps {
  userInfo: UserInfo;
}

const CircleChart = ({
  successRate,
  successCount,
  failCount,
}: CircleChartProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1500; // 1.5초 애니메이션

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      // 이징 함수 적용 (easeOutQuad)
      const eased = 1 - (1 - progress) * (1 - progress);
      setAnimationProgress(eased); // 0-1 사이 값

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // SVG 좌표 계산을 위한 설정
  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  // 성공률과 실패율 계산
  const failRate = 100 - successRate;

  // 애니메이션 진행에 따른 현재 각도 계산
  const totalAngle = 360 * animationProgress;

  // 시계 반대 방향으로 그리기 위한 시작 각도 (12시 방향 = 0도)
  const startAngle = 0;

  // 현재 애니메이션 진행률에 따른 실패 부분의 끝 각도
  const failEndAngle = Math.min(totalAngle, 360 * (failRate / 100));

  // 성공 부분의 시작 및 끝 각도
  const successStartAngle = failEndAngle;
  const successEndAngle = totalAngle;

  // 실패 부분 경로 생성 (항상 빨간색으로 채워져야 함)
  let failPath = "";
  if (failRate > 0) {
    failPath = getArcPath(centerX, centerY, radius, startAngle, failEndAngle);
  }

  // 성공 부분 경로 생성
  let successPath = "";
  if (successRate > 0 && successEndAngle > successStartAngle) {
    successPath = getArcPath(
      centerX,
      centerY,
      radius,
      successStartAngle,
      successEndAngle
    );
  }

  // 애니메이션 끝났을 때 성공률이 0%면 빨간색으로 완전히 채워짐
  const finalArcPath =
    successRate === 0 && animationProgress === 1
      ? getArcPath(centerX, centerY, radius, 0, 360)
      : "";

  return (
    <div className="relative flex items-center justify-center w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80">
      <svg
        className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64"
        viewBox="0 0 200 200"
      >
        {/* 배경 회색 원 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth="20"
        />

        {/* 실패율이 0%가 아니고 애니메이션이 끝난 상태라면 빨간색 원으로 채우기 */}
        {successRate === 0 && animationProgress === 1 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke="#f87171"
            strokeWidth="20"
          />
        )}

        {/* 실패율 부분 (빨간색) - 시계 반대 방향 */}
        {failPath && (
          <path
            d={failPath}
            fill="transparent"
            stroke="#f87171"
            strokeWidth="20"
            strokeLinecap="butt"
          />
        )}

        {/* 성공률 부분 (녹색) - 시계 반대 방향 */}
        {successPath && (
          <path
            d={successPath}
            fill="transparent"
            stroke="#4ade80"
            strokeWidth="20"
            strokeLinecap="butt"
          />
        )}

        {/* 가운데 흰색 원 */}
        <circle cx={centerX} cy={centerY} r="60" fill="white" />

        {/* 퍼센트 텍스트 */}
        <text
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
          fontWeight="bold"
        >
          {(successRate * animationProgress).toFixed(2)}%
        </text>
      </svg>
    </div>
  );
};

// 시계 반대 방향으로 호를 그리는 경로를 생성하는 함수
function getArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  // 각도가 같거나 너무 작으면 빈 경로 반환
  if (Math.abs(endAngle - startAngle) < 0.1) {
    return "";
  }

  // 시계 반대 방향(12시->9시->6시->3시)으로 그리기 위한 변환
  const start = {
    x: centerX + radius * Math.sin((startAngle * Math.PI) / 180),
    y: centerY - radius * Math.cos((startAngle * Math.PI) / 180),
  };

  const end = {
    x: centerX + radius * Math.sin((endAngle * Math.PI) / 180),
    y: centerY - radius * Math.cos((endAngle * Math.PI) / 180),
  };

  // 180도보다 큰 호인지 확인
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  // SVG 경로 문자열 생성
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function EnchantContent({ userInfo }: EnchantContentProps) {
  // userInfo가 null, undefined일 경우 기본값 설정
  if (!userInfo) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  // UserInfo의 필드가 존재하는지 안전하게 확인
  const totalAttempts = userInfo.totalEnchantAttempts || 0;
  const totalSuccess = userInfo.totalEnchantSuccess || 0;
  const totalFail = userInfo.totalEnchantFail || 0;
  const successRate = userInfo.totalEnchantRate || 0;

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
            {totalAttempts}회
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            성공
          </h4>
          <p className="text-xl font-bold text-green-500 md:text-2xl lg:text-3xl">
            {totalSuccess}회
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            실패
          </h4>
          <p className="text-xl font-bold text-red-500 md:text-2xl lg:text-3xl">
            {totalFail}회
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
          <h4 className="mb-2 text-base font-semibold text-gray-600 md:text-lg">
            성공률
          </h4>
          <p className="text-xl font-bold text-blue-500 md:text-2xl lg:text-3xl">
            {successRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800 md:mb-6 md:text-xl">
          강화 성공/실패 비율
        </h4>
        <div className="flex flex-col items-center">
          <CircleChart
            successRate={successRate}
            successCount={totalSuccess}
            failCount={totalFail}
          />
          <div className="flex flex-col justify-center gap-4 mt-4 md:flex-row md:gap-8 md:mt-6">
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 mr-2 bg-green-400 rounded-full md:w-4 md:h-4" />
              <span className="text-sm md:text-base">
                성공 ({totalSuccess}회)
              </span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 mr-2 bg-red-400 rounded-full md:w-4 md:h-4" />
              <span className="text-sm md:text-base">실패 ({totalFail}회)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
