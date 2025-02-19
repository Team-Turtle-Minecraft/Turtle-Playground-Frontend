"use client";

// src/components/contents/ContentsIntro.tsx

import { useState, JSX, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

// 커스텀 useInView 훅
function useInView(options = { threshold: 0.1 }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold]);

  return { ref, inView: isInView };
}

interface ContentProps {
  title: string;
  koreanTitle: string;
  images: string[];
  mainTitle: string | JSX.Element;
  leftDescription: string[];
  rightDescription: string[];
}

export default function ContentPage({
  title,
  koreanTitle,
  images,
  mainTitle,
  leftDescription,
  rightDescription,
}: ContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      setShouldLoad(true);
    }
  }, [inView]);

  const visibleImages = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    return [prevIndex, currentIndex, nextIndex].map((index) => images[index]);
  }, [currentIndex, images]);

  const handleSlideChange = useCallback(
    (direction: "next" | "prev") => {
      if (isAnimating) return;

      setIsAnimating(true);
      if (direction === "next") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating, images.length]
  );

  return (
    <div className="px-4 md:px-6 lg:px-0">
      {/* Top section with centered titles */}
      <div className="flex flex-col items-center mb-6 md:mb-8 lg:mb-12">
        <p className="text-xs text-gray-600 md:text-sm">{title}</p>
        <h1 className="mt-2 text-xl font-bold text-center md:text-2xl lg:text-3xl">
          {koreanTitle}
        </h1>
      </div>

      {/* Image slider with lazy loading */}
      <div
        ref={ref}
        className="relative w-full h-[250px] md:h-[400px] lg:h-[524px] bg-gray-100 mb-8 md:mb-12 lg:mb-16 overflow-hidden rounded-lg"
      >
        {shouldLoad && (
          <div
            className="absolute flex h-full w-[300%] transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${33.333333}%)`,
            }}
          >
            {visibleImages().map((image, index) => (
              <div key={index} className="relative w-1/3 h-full">
                <Image
                  src={image}
                  alt={`슬라이드 ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 1}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 946px"
                  quality={75}
                  loading={index === 1 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <button
          onClick={() => handleSlideChange("prev")}
          className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all -translate-y-1/2 rounded-full md:w-10 md:h-10 left-2 md:left-4 top-1/2 bg-black/50 hover:bg-black/70"
          disabled={isAnimating}
          aria-label="이전 슬라이드"
        >
          ←
        </button>
        <button
          onClick={() => handleSlideChange("next")}
          className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all -translate-y-1/2 rounded-full md:w-10 md:h-10 right-2 md:right-4 top-1/2 bg-black/50 hover:bg-black/70"
          disabled={isAnimating}
          aria-label="다음 슬라이드"
        >
          →
        </button>

        {/* Image indicators */}
        <div className="absolute z-10 flex gap-1 -translate-x-1/2 md:gap-2 bottom-2 md:bottom-4 left-1/2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating && index !== currentIndex) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              disabled={isAnimating}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Text content area - 반응형 레이아웃 */}
      <div className="flex flex-col lg:flex-row lg:gap-[157px] lg:justify-center">
        <div className="w-full lg:w-[330px] mb-8 lg:mb-0">
          <div className="h-auto lg:h-[100px] flex items-center justify-center mb-4 lg:mb-0">
            <h2 className="text-xl md:text-2xl lg:text-[32px] font-medium text-center leading-tight">
              " {mainTitle} "
            </h2>
          </div>
          <div className="mt-4 space-y-4 lg:mt-8">
            {leftDescription.map((text, index) => (
              <p
                key={index}
                className="text-base md:text-lg lg:text-[18px] leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[335px] space-y-4">
          {rightDescription.map((text, index) => (
            <p
              key={index}
              className="text-base md:text-lg lg:text-[18px] leading-relaxed"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
