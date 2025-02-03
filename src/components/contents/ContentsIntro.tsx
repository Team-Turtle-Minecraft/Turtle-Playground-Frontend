"use client";

import { useState } from "react";
import Image from "next/image";

interface ContentProps {
  title: string;
  koreanTitle: string;
  subtitle: string;
  description: string[]; // 문자열 배열로 변경
  features: string[];
  images: string[];
}

export default function ContentPage({
  title,
  koreanTitle,
  subtitle,
  description,
  features,
  images,
}: ContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container px-6 mx-auto">
        {/* Title Section */}
        <div className="py-12 text-center">
          <p className="mb-2 text-base">{title}</p>
          <h1 className="text-[46px] font-bold">{koreanTitle}</h1>
        </div>

        {/* Image Slider Section */}
        <div className="relative w-[946px] h-[524px] bg-gray-100 mb-12 mx-auto">
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={`${title} 이미지`}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute p-4 text-white -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 hover:bg-black/70"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute p-4 text-white -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 hover:bg-black/70"
          >
            →
          </button>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">" {subtitle} "</h2>
            <div className="space-y-4 text-gray-600">
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-gray-50">
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
