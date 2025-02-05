// components/basic/BasicInfoContent.tsx
"use client";

import { UserInfo } from "@/types/userInfo";

interface BasicInfoContentProps {
  userInfo: UserInfo;
}

export default function BasicInfoContent({ userInfo }: BasicInfoContentProps) {
  return (
    <div className="w-full max-w-[960px]">
      {/* 전투 직업 */}
      <div className="mb-8">
        <h3 className="text-[34px] font-bold mb-4">전투 직업</h3>
        <table className="w-full border-collapse border border-[#CFD8E7]">
          <tbody>
            <tr className="h-[50px]">
              <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                클래스
              </td>
              <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                {userInfo.characterClass || "-"}
              </td>
              <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                레벨
              </td>
              <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                {userInfo.characterLevel || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 생활 직업 */}
      <div>
        <h3 className="text-[34px] font-bold mb-4">생활 직업</h3>
        <div className="space-y-4">
          {[
            ["채집", userInfo.gatheringLevel],
            ["농부", userInfo.farmingLevel],
            ["요리사", userInfo.cookingLevel],
            ["대장장이", userInfo.smithingLevel],
            ["채굴", userInfo.miningLevel],
            ["낚시꾼", userInfo.fisherLevel],
          ].map(([job, level]) => (
            <table
              key={job}
              className="w-full border-collapse border border-[#CFD8E7]"
            >
              <tbody>
                <tr className="h-[50px]">
                  <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                    직업
                  </td>
                  <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                    {job}
                  </td>
                  <td className="w-[159px] text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                    레벨
                  </td>
                  <td className="w-[321px] text-[15px] text-center border border-[#CFD8E7]">
                    {level || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
}
