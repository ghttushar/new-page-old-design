import { imageUrls } from '@/constants/assets/images.constants';
import React from 'react';

interface ImageCompProps {
  imageURL: string | null;
  alt: string;
  customStyles?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  isProduct?: boolean;
}

export default function ImgComponent({
  imageURL,
  customStyles,
  alt,
  className,
  onClick,
  isProduct = false,
}: ImageCompProps) {
  const handleOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = isProduct ? imageUrls.placeHolderIcon : '';
  };

  return (
    <img
      onClick={onClick}
      src={imageURL ?? ''}
      onError={handleOnError}
      className={className}
      alt={alt}
      style={customStyles}
    />
  );
}
