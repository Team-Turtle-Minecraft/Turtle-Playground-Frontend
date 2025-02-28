// CharacterInfoSkeleton.tsx
export default function CharacterInfoSkeleton() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex justify-center w-full px-4 md:px-0">
      <div className="flex flex-col items-center md:flex-row md:items-center md:gap-[50px] lg:gap-[100px]">
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <div
            className={`w-36 h-8 md:w-44 md:h-9 lg:w-48 lg:h-10 mb-2 rounded ${shimmerClass}`}
          />
          <div
            className={`w-36 h-8 md:w-44 md:h-9 lg:w-48 lg:h-10 mb-4 md:mb-6 rounded ${shimmerClass}`}
          />
          <div
            className={`w-[120px] h-[124px] md:w-[130px] md:h-[134px] lg:w-[150px] lg:h-[154.64px] rounded ${shimmerClass}`}
          />
        </div>

        <div className="mt-4 md:mt-[100px] lg:mt-[150px]">
          <div className="w-full md:w-[350px] lg:w-[400px] space-y-2">
            <div className={`h-12 rounded ${shimmerClass}`} />
            <div className={`h-12 rounded ${shimmerClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
