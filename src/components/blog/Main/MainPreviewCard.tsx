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
}

const BlogPreviewCard = ({
  className = '',
  id,
  title = '',
  content,
  imageSrc,
  nickName,
  profileUrl,
  createdAt,
  commentCount,
}: BlogPreviewCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className={`blog-preview-row ${className} cursor-pointer`} onClick={handleClick}>
      <div className="flex flex-col">
        <PostCard title={title} content={content} hasImage={Boolean(imageSrc)} />
        <PostDetails nickName={nickName} profileUrl={profileUrl} createdAt={createdAt} commentCount={commentCount} />
      </div>
      {imageSrc && <MainPreviewImage src={imageSrc} />}
    </div>
  );
};

export default BlogPreviewCard;
