"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackText?: string;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackText = "No Image",
  containerClassName,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const shouldShowFallback = !src || hasError;

  if (shouldShowFallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-neutral-100 text-neutral-400 text-xs",
          containerClassName,
          fallbackClassName
        )}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

