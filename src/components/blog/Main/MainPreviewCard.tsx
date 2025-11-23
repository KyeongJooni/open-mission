import { memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard, PostDetails } from '@/components';
import { useTilt, useFadeIn } from '@/hooks';
import MainPreviewImage from './MainPreviewImage';

interface BlogPreviewCardProps {
  className?: string;
  id: number | string;
  title: string;
  content?: string;
  imageSrc?: string;
  nickName: string;
  profileUrl?: string;
  createdAt: string;
  commentCount: number;
  priority?: boolean;
  index?: number;
}

const BlogPreviewCard = memo(
  ({
    className = '',
    id,
    title = '',
    content,
    imageSrc,
    nickName,
    profileUrl,
    createdAt,
    commentCount,
    priority = false,
    index = 0,
  }: BlogPreviewCardProps) => {
    const navigate = useNavigate();
    const tiltRef = useTilt<HTMLDivElement>({ max: 5, scale: 1.01, speed: 300 });
    const [fadeRef, isVisible] = useFadeIn<HTMLDivElement>({ delay: index * 50 });

    const handleClick = useCallback(() => {
      navigate(`/blog/${id}`);
    }, [navigate, id]);

    // Combine refs
    useEffect(() => {
      if (fadeRef.current && tiltRef.current === null) {
        (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = fadeRef.current;
      }
    }, [fadeRef, tiltRef]);

    return (
      <div
        ref={fadeRef}
        className={`blog-preview-row ${className} cursor-pointer transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        onClick={handleClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div ref={tiltRef} className="flex flex-col">
          <PostCard title={title} content={content} hasImage={Boolean(imageSrc)} />
          <PostDetails nickName={nickName} profileUrl={profileUrl} createdAt={createdAt} commentCount={commentCount} />
        </div>
        {imageSrc && <MainPreviewImage src={imageSrc} priority={priority} />}
      </div>
    );
  }
);

BlogPreviewCard.displayName = 'BlogPreviewCard';

export default BlogPreviewCard;
