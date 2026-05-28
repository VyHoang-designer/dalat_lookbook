"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductDetailClientProps {
  images: {
    id: string;
    image_url: string;
    sort_order: number;
  }[];
  thumbnailUrl: string | null;
}

export default function ProductDetailClient({ images, thumbnailUrl }: ProductDetailClientProps) {
  const [mainImage, setMainImage] = useState(0);

  // Combine thumbnail and additional images
  const allImages = [];
  if (thumbnailUrl) {
    allImages.push({ id: 'thumb', image_url: thumbnailUrl, sort_order: 0 });
  }
  
  images.forEach(img => {
    if (img.image_url !== thumbnailUrl) {
      allImages.push(img);
    }
  });

  const displayImages = allImages.length > 0 
    ? allImages 
    : [{ id: 'fallback', image_url: '', sort_order: 1 }];

  return (
    <div className="flex flex-col items-center lg:items-start w-full">
      <div className="w-full max-w-[460px] mx-auto lg:mx-0">
        <div className="aspect-[3/4] w-full bg-gradient-to-br from-surface to-surface-hover rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-sm relative group">
          {displayImages[mainImage].image_url ? (
            <Image
              src={displayImages[mainImage].image_url}
              alt="Product Image"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 460px"
              priority
            />
          ) : (
            <span className="text-[120px] lg:text-[140px]">👗</span>
          )}
        </div>
        
        {displayImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2.5">
            {displayImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setMainImage(i)}
                className={`aspect-[3/4] rounded-lg bg-surface flex items-center justify-center overflow-hidden transition-all relative ${
                  i === mainImage ? "ring-2 ring-primary ring-offset-1" : "hover:opacity-80"
                }`}
              >
                {img.image_url ? (
                  <Image
                    src={img.image_url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                ) : (
                  <span className="text-xl">👗</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
