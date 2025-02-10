"use client";

// src/components/contents/ContentsIntro.tsx

import { useState, JSX } from "react";
import Image from "next/image";

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

  // 현재 보이는 이미지와 다음/이전 이미지만 렌더링
  const visibleImages = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    return [prevIndex, currentIndex, nextIndex].map((index) => images[index]);
  };

  const handleSlideChange = (direction: "next" | "prev") => {
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
  };

  return (
    <div>
      {/* Top section with centered titles */}
      <div className="flex flex-col items-center mb-12">
        <p className="text-sm text-gray-600">{title}</p>
        <h1 className="mt-2 text-3xl font-bold">{koreanTitle}</h1>
      </div>

      {/* Image slider */}
      <div className="relative w-full h-[524px] bg-gray-100 mb-16 overflow-hidden">
        {/* Slider container */}
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
                priority={index === 1} // 현재 이미지에 priority 부여
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={() => handleSlideChange("prev")}
          className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition-all -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 hover:bg-black/70"
          disabled={isAnimating}
        >
          ←
        </button>
        <button
          onClick={() => handleSlideChange("next")}
          className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition-all -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 hover:bg-black/70"
          disabled={isAnimating}
        >
          →
        </button>

        {/* Image indicators */}
        <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
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
            />
          ))}
        </div>
      </div>

      {/* Text content area */}
      <div className="flex gap-[157px] justify-center">
        <div className="w-[330px]">
          <div className="h-[100px] flex items-center justify-center">
            <h2 className="text-[32px] font-medium text-center leading-tight">
              " {mainTitle} "
            </h2>
          </div>
          <div className="h-[150px] mt-8">
            {leftDescription.map((text, index) => (
              <p
                key={index}
                className={`text-[18px] leading-relaxed ${
                  index > 0 ? "mt-4" : ""
                }`}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
        <div className="w-[335px] mt-3">
          {rightDescription.map((text, index) => (
            <p
              key={index}
              className={`text-[18px] leading-relaxed ${
                index < rightDescription.length - 1 ? "mb-4" : ""
              }`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
