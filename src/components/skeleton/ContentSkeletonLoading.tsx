// src/components/skeleton/ContentSkeletonLoading.tsx
export default function ContentSkeletonLoading() {
  const shimmerClass =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className={`w-24 h-6 md:w-32 md:h-8 rounded ${shimmerClass}`} />
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`w-20 h-6 md:w-24 md:h-8 rounded ${shimmerClass}`} />
          <div className={`w-20 h-6 md:w-24 md:h-8 rounded ${shimmerClass}`} />
        </div>
      </header>

      <div className="w-full h-px bg-gray-200" />

      {/* Main Content Skeleton */}
      <main className="flex-grow bg-white">
        <div className="max-w-[1920px] mx-auto relative pt-[60px] md:pt-[75px] lg:pt-[92px]">
          {/* Navigation Skeleton - 데스크탑에서만 표시 */}
          <div className="hidden lg:block absolute right-8 xl:right-32 top-[200px]">
            <div className="w-48">
              <div
                className={`w-32 h-8 mb-8 ml-auto rounded ${shimmerClass}`}
              />
              <div className="flex flex-col items-end space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-36 h-6 rounded ${shimmerClass}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="w-full max-w-[946px] mx-auto mb-16 md:mb-20 lg:mb-28 px-4 md:px-6 lg:px-0">
            {/* Title Section */}
            <div className="flex flex-col items-center mb-6 md:mb-8 lg:mb-12">
              <div
                className={`w-24 h-4 md:w-32 md:h-6 mb-2 rounded ${shimmerClass}`}
              />
              <div
                className={`w-36 h-6 md:w-48 md:h-8 rounded ${shimmerClass}`}
              />
            </div>

            {/* Image Slider Skeleton */}
            <div className="relative w-full h-[250px] md:h-[400px] lg:h-[524px] mb-8 md:mb-12 lg:mb-16">
              <div className={`w-full h-full rounded-lg ${shimmerClass}`} />
              {/* Navigation Dots */}
              <div className="absolute z-10 flex gap-1 -translate-x-1/2 md:gap-2 bottom-2 md:bottom-4 left-1/2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${shimmerClass}`}
                  />
                ))}
              </div>
            </div>

            {/* Text Content Skeleton */}
            <div className="flex flex-col lg:flex-row lg:gap-[157px] lg:justify-center">
              {/* Left Content */}
              <div className="w-full lg:w-[330px] mb-8 lg:mb-0">
                <div className="h-auto lg:h-[100px] flex items-center justify-center mb-4 lg:mb-0">
                  <div
                    className={`w-full max-w-[280px] h-12 md:h-16 rounded ${shimmerClass}`}
                  />
                </div>
                <div className="mt-4 space-y-4 lg:mt-8">
                  {[1].map((i) => (
                    <div
                      key={i}
                      className={`w-full h-20 rounded ${shimmerClass}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Content */}
              <div className="w-full lg:w-[335px] space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-full h-16 md:h-20 rounded ${shimmerClass}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={`h-[80px] md:h-[100px] ${shimmerClass}`} />
    </div>
  );
}
