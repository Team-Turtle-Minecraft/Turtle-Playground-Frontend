interface CharacterInfoProps {
  nickname: string;
  title: string;
  money: number;
}

export default function CharacterInfo({
  nickname,
  title,
  money,
}: CharacterInfoProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center gap-[100px]">
        <div className="flex flex-col items-center">
          <h1 className="text-[36px] mb-2">{nickname}님</h1>
          <h2 className="text-[36px] mb-6">캐릭터 정보</h2>
          <img
            src={`https://api.creepernation.net/avatar/${nickname}`}
            alt={nickname}
            className="w-[150px] h-[154.64px]"
          />
        </div>

        {/* margin-top 값을 더 늘림 */}
        <div className="mt-[90px]">
          <table className="w-[400px] border-collapse border border-[#CFD8E7]">
            <tbody>
              <tr>
                <td className="w-[159px] text-center p-4 text-[15px] bg-[#F5F7FC] border border-[#CFD8E7]">
                  칭호
                </td>
                <td className="w-[241px] text-center p-4 text-[15px] border border-[#CFD8E7]">
                  {title}
                </td>
              </tr>
              <tr>
                <td className="w-[159px] text-center p-4 text-[15px] bg-[#F5F7FC] border border-[#CFD8E7]">
                  보유 자산
                </td>
                <td className="w-[241px] text-center p-4 text-[15px] border border-[#CFD8E7]">
                  {money}G
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
