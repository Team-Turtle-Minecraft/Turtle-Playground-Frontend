export default function HomeSkeletonLoading() {
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

      <main className="flex-grow">
        {/* Banner Section Skeleton */}
        <section className="relative w-full h-[300px] md:h-[450px] lg:h-[651px]">
          <div className={`w-full h-full ${shimmerClass}`} />

          {/* Banner Buttons Skeleton */}
          <div className="absolute z-10 flex flex-col space-y-2 transform -translate-x-1/2 md:flex-row md:space-y-0 md:space-x-4 bottom-4 md:bottom-8 left-1/2">
            <div
              className={`w-32 h-8 md:w-36 md:h-10 rounded-full ${shimmerClass}`}
            />
            <div
              className={`w-32 h-8 md:w-36 md:h-10 rounded-full ${shimmerClass}`}
            />
          </div>
        </section>

        {/* Grid Section Skeleton */}
        <section className="container px-4 py-8 mx-auto md:px-6 md:py-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative p-2 bg-gray-100 md:p-4">
                <div className="relative w-full aspect-video">
                  <div className={`w-full h-full rounded ${shimmerClass}`} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-black/50 backdrop-blur-sm">
                  <div
                    className={`w-36 h-5 md:w-48 md:h-6 rounded ${shimmerClass}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discord Section Skeleton */}
        <section className="py-8 text-center bg-white md:py-12">
          <div className="max-w-2xl px-4 mx-auto md:px-6">
            <div
              className={`w-64 h-5 md:w-80 md:h-6 mx-auto mb-2 md:mb-4 rounded ${shimmerClass}`}
            />
            <div
              className={`w-72 h-5 md:w-96 md:h-6 mx-auto mb-4 md:mb-8 rounded ${shimmerClass}`}
            />
            <div
              className={`w-full max-w-[300px] md:max-w-[400px] lg:max-w-[600px] aspect-[2/1] mx-auto rounded ${shimmerClass}`}
            />
          </div>
        </section>
      </main>

      <footer className={`h-[80px] md:h-[100px] ${shimmerClass}`} />
    </div>
  );
}
