import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard, PostDetails } from '@/components';
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
  }: BlogPreviewCardProps) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
      navigate(`/blog/${id}`);
    }, [navigate, id]);

    return (
      <div className={`blog-preview-row ${className} cursor-pointer`} onClick={handleClick}>
        <div className="flex flex-col">
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
