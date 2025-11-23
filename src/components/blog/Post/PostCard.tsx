import { ReactNode, memo } from 'react';
import { cn } from '@/utils/cn';
import { postCardVariants, postTitleVariants, postContentVariants } from './PostCardVariants';

interface PostCardProps {
  title: string;
  content?: string;
  className?: string;
  hasImage?: boolean;
  renderTitle?: ReactNode;
}

const PostCard = memo(({ title, content, className, hasImage = false, renderTitle }: PostCardProps) => {
  return (
    <div className={cn(postCardVariants({ hasImage }), className)}>
      {renderTitle ? renderTitle : <h3 className={postTitleVariants()}>{title}</h3>}
      <p className={postContentVariants()}>{content || '\u00A0'}</p>
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
