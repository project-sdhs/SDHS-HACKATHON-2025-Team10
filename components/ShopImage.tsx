import React, { useState, useEffect } from 'react';

interface ShopImageProps {
  src?: string;
  alt: string;
  seed: string;
  width?: number;
  height?: number;
  className?: string;
}

const ShopImage: React.FC<ShopImageProps> = ({ src, alt, width = 400, height = 300, className }) => {
  // A generic, non-photographic placeholder using SVG data URI.
  // This avoids showing random "old pictures" from external services.
  const placeholderSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill="#1f2937"></rect>
      <text x="50%" y="50%" fill="#9ca3af" dy=".3em" font-family="sans-serif" font-size="1rem" text-anchor="middle">이미지 없음</text>
    </svg>
  `;
  const placeholderUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(placeholderSvg)}`;
  
  const [currentSrc, setCurrentSrc] = useState(src || placeholderUrl);

  useEffect(() => {
    // When the src prop changes, try to load the new image.
    // If src is null/undefined, immediately use the placeholder.
    setCurrentSrc(src || placeholderUrl);
  }, [src, placeholderUrl]);

  const handleError = () => {
    // If the provided src fails to load, fall back to the placeholder.
    setCurrentSrc(placeholderUrl);
  };

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default ShopImage;
