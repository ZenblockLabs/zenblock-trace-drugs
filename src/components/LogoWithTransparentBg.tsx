
import { useEffect, useState } from 'react';
import { loadImage, removeBackground } from '@/utils/imageProcessing';
import { Skeleton } from '@/components/ui/skeleton';

type LogoProps = {
  src: string;
  alt: string;
  className?: string;
};

export const LogoWithTransparentBg = ({ src, alt, className = "" }: LogoProps) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsLoading(true);
        
        // Create a blob from the image URL
        const response = await fetch(src);
        const blob = await response.blob();
        
        // Load image and remove background
        const image = await loadImage(blob);
        const processedBlob = await removeBackground(image);
        
        // Create URL from processed blob
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedImageUrl(processedUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to process image:', err);
        setError('Failed to process image');
        setIsLoading(false);
        
        // Fallback to original image
        setProcessedImageUrl(src);
      }
    };

    processImage();

    // Cleanup
    return () => {
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [src]);

  if (isLoading) {
    return <Skeleton className={className || "h-24 w-24"} />;
  }

  if (error) {
    // Fallback to original image if processing failed
    return <img src={src} alt={alt} className={className} />;
  }

  return <img src={processedImageUrl || src} alt={alt} className={className} />;
};
