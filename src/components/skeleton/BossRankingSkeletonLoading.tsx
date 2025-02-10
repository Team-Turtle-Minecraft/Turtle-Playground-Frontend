import React from "react";
import { RankingHeaderSkeletonLoading } from "./RankingHeaderSkeletonLoading";

export const BossRankingSkeletonLoading = () => {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      <RankingHeaderSkeletonLoading />

      {/* 플레이 타입과 보스 선택 네비게이션 스켈레톤 */}
      <div className="mb-8">
        {/* 플레이 타입 선택 */}
        <div className="flex mb-1 border-b">
          <div className="w-24 py-2">
            <div className={`h-6 w-16 mx-4 ${shimmerClass}`}></div>
          </div>
          <div className="flex">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`w-24 h-10 mx-2 rounded ${shimmerClass}`}
              ></div>
            ))}
          </div>
        </div>

        {/* 보스 선택 */}
        <div className="flex border-b">
          <div className="w-24 py-2">
            <div className={`h-6 w-16 mx-4 ${shimmerClass}`}></div>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <div className="flex gap-1 pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 w-32 h-10 rounded ${shimmerClass}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* First Clear 스켈레톤 */}
      <div className="mb-8">
        <div className={`h-8 w-32 mb-4 ${shimmerClass}`}></div>
        <div className="p-6 rounded-lg shadow bg-gray-50">
          <div className="flex items-center justify-center gap-4">
            <div className={`w-16 h-16 rounded-full ${shimmerClass}`}></div>
            <div className="space-y-2">
              <div className={`h-6 w-32 ${shimmerClass}`}></div>
              <div className={`h-4 w-24 ${shimmerClass}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Time Ranking 스켈레톤 */}
      <div>
        <div className={`h-8 w-48 mb-4 ${shimmerClass}`}></div>
        <div className="overflow-hidden rounded-lg shadow bg-gray-50">
          <div className="grid grid-cols-12 py-4 bg-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-6 mx-auto w-20 ${
                  i === 1
                    ? "col-span-1"
                    : i === 2
                      ? "col-span-2"
                      : i === 3
                        ? "col-span-7"
                        : "col-span-2"
                } ${shimmerClass}`}
              ></div>
            ))}
          </div>

          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid items-center grid-cols-12 py-6">
                <div
                  className={`col-span-1 h-8 w-16 mx-auto ${shimmerClass}`}
                ></div>
                <div
                  className={`col-span-2 h-8 w-24 mx-auto ${shimmerClass}`}
                ></div>
                <div className="flex items-center justify-center col-span-7 gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${shimmerClass}`}
                  ></div>
                  <div className={`h-6 w-32 ${shimmerClass}`}></div>
                </div>
                <div
                  className={`col-span-2 h-8 w-24 mx-auto ${shimmerClass}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
