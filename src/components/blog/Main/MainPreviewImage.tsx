import { memo } from 'react';
import profileImage from '@/assets/profile.png';
import { cn } from '@/utils/cn';

interface MainPreviewImageProps {
  className?: string;
  src?: string;
  priority?: boolean;
}

const containerStyle = 'flex w-preview-w h-preview-h px-4 py-3 items-center gap-2 bg-white';
const imageStyle = 'flex-1 self-stretch rounded-sm object-cover';

const MainPreviewImage = memo(({ className, src, priority = false }: MainPreviewImageProps) => {
  const imageUrl = src || profileImage;

  return (
    <div className={cn(containerStyle, className)}>
      <img
        src={imageUrl}
        alt="Blog preview"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        className={imageStyle}
      />
    </div>
  );
});

MainPreviewImage.displayName = 'MainPreviewImage';

export default MainPreviewImage;
