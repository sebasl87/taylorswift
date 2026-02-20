"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface SafeNewsImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  articleId?: string;
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
  articleId,
}: SafeNewsImageProps) {
  const [imageError, setImageError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState<string>(src);

  // Si la imagen viene de Googleusercontent, mapear a fallback local y persistir por articleId
  useEffect(() => {
    try {
      const isGoogle = /https?:\/\/lh3\.googleusercontent\.com\//.test(src);
      if (!isGoogle) {
        setDisplaySrc(src);
        return;
      }

      if (!articleId) {
        // Sin articleId, elegir fallback temporal aleatorio
        const n = Math.floor(Math.random() * 20) + 1;
        const pad = String(n).padStart(2, "0");
        setDisplaySrc(`/images/newsfallback/${pad}.png`);
        return;
      }

      const key = `news-fallback-${articleId}`;
      const existing = localStorage.getItem(key);
      if (existing) {
        setDisplaySrc(`/images/newsfallback/${existing}`);
        return;
      }

      // Deterministic selection based on articleId to reduce repeated collisions
      // Simple djb2 hash
      let h = 5381;
      for (let i = 0; i < articleId.length; i++) {
        h = (h * 33) ^ articleId.charCodeAt(i);
      }
      const n = (Math.abs(h) % 20) + 1;
      const pad = String(n).padStart(2, "0") + ".png";
      localStorage.setItem(key, pad);
      setDisplaySrc(`/images/newsfallback/${pad}`);
    } catch {
      setDisplaySrc(src);
    }
  }, [src, articleId]);

  // Si hay error, usar imagen fallback
  const imageSrc = imageError ? "/images/band.webp" : displaySrc;

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
