import { useNavigate } from 'react-router-dom';
import { PostCard, PostDetails } from '@/components';
import MainPreviewImage from './MainPreviewImage';

interface BlogPreviewCardProps {
  className?: string;
  id: number;
  title: string;
  content?: string;
  imageSrc?: string;
}

const BlogPreviewCard = ({ className = '', id, title = '', content, imageSrc }: BlogPreviewCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className={`blog-preview-row ${className} cursor-pointer`} onClick={handleClick}>
      <div className="flex flex-col">
        <PostCard title={title} content={content} hasImage={Boolean(imageSrc)} />
        <PostDetails />
      </div>
      {imageSrc && <MainPreviewImage src={imageSrc} />}
    </div>
  );
};

export default BlogPreviewCard;
