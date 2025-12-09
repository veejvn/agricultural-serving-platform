"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroCarouselProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function HeroCarousel({
  images,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  if (images.length === 0) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl shadow-xl ${className}`}
      >
        <div className="flex h-[400px] items-center justify-center bg-gray-200 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Không có hình ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-xl w-full ${className}`}
    >
      {/* Carousel Images */}
      <div className="relative h-[400px] w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? "translate-x-0"
                : index < currentIndex
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <img
              src={image}
              alt={`Nông nghiệp Xanh - Hình ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Only show if more than one image */}
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-black/80 dark:hover:bg-black"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-black/80 dark:hover:bg-black"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator - Only show if more than one image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
