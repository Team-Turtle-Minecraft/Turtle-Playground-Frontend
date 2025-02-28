export function BasicInfoSkeletonContent() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <>
      {/* Character Info Skeleton */}
      <div className="flex justify-center w-full">
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
          <div className="mt-4 md:mt-[100px] lg:mt-[150px] w-full md:w-[350px] lg:w-[400px]">
            <div className="space-y-2">
              <div className={`h-[50px] rounded ${shimmerClass}`} />
              <div className={`h-[50px] rounded ${shimmerClass}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px my-6 bg-gray-200 md:my-8"></div>

      {/* Navigation and Content Skeleton */}
      <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-8">
        <div className="w-full mb-6 lg:w-48 lg:mb-0">
          <div className="flex px-4 space-x-4 overflow-x-auto lg:overflow-x-visible lg:flex-col lg:space-x-0 lg:space-y-4 lg:px-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-24 md:w-28 lg:w-32 h-6 md:h-7 shrink-0 rounded ${shimmerClass}`}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:max-w-[960px] px-4 md:px-6 lg:px-0">
          <div className="mb-6 md:mb-8">
            <div
              className={`w-40 md:w-48 lg:w-56 h-8 md:h-9 lg:h-10 mb-3 md:mb-4 rounded ${shimmerClass}`}
            />
            <div
              className={`w-full h-[40px] md:h-[45px] lg:h-[50px] rounded ${shimmerClass}`}
            />
          </div>

          <div>
            <div
              className={`w-40 md:w-48 lg:w-56 h-8 md:h-9 lg:h-10 mb-3 md:mb-4 rounded ${shimmerClass}`}
            />
            <div className="space-y-2 md:space-y-3 lg:space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-full h-[40px] md:h-[45px] lg:h-[50px] rounded ${shimmerClass}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden w-48 lg:block"></div>
      </div>
    </>
  );
}
