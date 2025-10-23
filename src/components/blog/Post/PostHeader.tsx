interface PostHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PostHeader = ({ title, subtitle, className = '' }: PostHeaderProps) => {
  return (
    <div className={`w-content flex max-w-content flex-col items-start justify-center gap-3 px-4 py-3 ${className}`}>
      <h1 className="self-stretch text-2xl font-medium text-black">{title}</h1>
      {subtitle && <p className="self-stretch text-sm font-light text-gray-dark">{subtitle}</p>}
    </div>
  );
};

export default PostHeader;
