"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeNewsImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
}

/**
 * Componente de imagen con fallback automático a /images/band.webp
 * Si la imagen principal falla al cargar, muestra imagen placeholder de Megadeth
 */
export default function SafeNewsImage({
  src,
  alt,
  width,
  height,
  fill,
  style,
  sizes,
  priority,
}: SafeNewsImageProps) {
  const [imageError, setImageError] = useState(false);

  // Si hay error, usar imagen fallback
  const imageSrc = imageError ? "/images/band.webp" : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      style={style}
      sizes={sizes}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}
