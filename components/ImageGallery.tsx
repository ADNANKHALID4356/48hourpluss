// components/ImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

export default function ImageGallery({ images, altText }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || '/placeholder.png');

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
        <Image
          src={activeImage}
          alt={altText}
          fill
          className="object-cover object-center transition duration-200"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
                activeImage === img ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${altText} thumbnail ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}