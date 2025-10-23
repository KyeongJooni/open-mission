import profileImage from '@/assets/profile.png';
import { cn } from '@/utils/cn';

interface MainPreviewImageProps {
  className?: string;
  src?: string;
}

const containerStyle = 'flex w-preview-w h-preview-h px-4 py-3 items-center gap-2 bg-white';
const imageStyle = 'flex-1 self-stretch rounded-sm bg-center bg-cover bg-no-repeat';

const MainPreviewImage = ({ className, src }: MainPreviewImageProps) => {
  const imageUrl = src || profileImage;

  return (
    <div className={cn(containerStyle, className)}>
      <div
        className={imageStyle}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: 'lightgray',
        }}
      />
    </div>
  );
};

export default MainPreviewImage;
