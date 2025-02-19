"use client";

import { UserInfo } from "@/types/userInfo";
import {
  CHARACTER_CLASS_MAPPING,
  CharacterClassKey,
} from "@/types/characterClass";
import { TITLE_MAPPING, TitleKey } from "@/types/title";

interface BasicInfoContentProps {
  userInfo: UserInfo;
}

export default function BasicInfoContent({ userInfo }: BasicInfoContentProps) {
  const displayClass = (characterClass: string | null) => {
    if (!characterClass) return "-";
    return (
      CHARACTER_CLASS_MAPPING[characterClass as CharacterClassKey] ||
      characterClass
    );
  };

  const displayTitle = (title: string) => {
    return TITLE_MAPPING[title as TitleKey] || title;
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-0">
      {/* 전투 직업 */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-2xl md:text-3xl lg:text-[24px] font-bold mb-3 md:mb-4">
          전투 직업
        </h3>
        <table className="w-full border-collapse border border-[#CFD8E7]">
          <tbody>
            <tr className="h-[40px] md:h-[45px] lg:h-[50px]">
              <td className="w-1/4 md:w-[130px] lg:w-[159px] text-sm md:text-base lg:text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                클래스
              </td>
              <td className="w-1/4 text-sm md:text-base lg:text-[15px] text-center border border-[#CFD8E7]">
                {displayClass(userInfo.characterClass)}
              </td>
              <td className="w-1/4 md:w-[130px] lg:w-[159px] text-sm md:text-base lg:text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                레벨
              </td>
              <td className="w-1/4 text-sm md:text-base lg:text-[15px] text-center border border-[#CFD8E7]">
                {userInfo.characterLevel || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 생활 직업 */}
      <div>
        <h3 className="text-2xl md:text-3xl lg:text-[24px] font-bold mb-3 md:mb-4">
          생활 직업
        </h3>
        <div className="space-y-2 md:space-y-3 lg:space-y-4">
          {[
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
                <tr className="h-[40px] md:h-[45px] lg:h-[50px]">
                  <td className="w-1/4 md:w-[130px] lg:w-[159px] text-sm md:text-base lg:text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                    직업
                  </td>
                  <td className="w-1/4 text-sm md:text-base lg:text-[15px] text-center border border-[#CFD8E7]">
                    {job}
                  </td>
                  <td className="w-1/4 md:w-[130px] lg:w-[159px] text-sm md:text-base lg:text-[15px] text-center bg-[#F5F7FC] border border-[#CFD8E7]">
                    레벨
                  </td>
                  <td className="w-1/4 text-sm md:text-base lg:text-[15px] text-center border border-[#CFD8E7]">
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
