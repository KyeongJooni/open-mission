interface PostInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const PostInput = ({ value, onChange, placeholder = '댓글을 입력하세요.', className = '' }: PostInputProps) => {
  return (
    <div className={`flex h-28 max-w-content items-start gap-2.5 self-stretch px-4 py-3 ${className}`}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 resize-none text-sm font-light leading-[160%] tracking-[-0.07px] text-gray-dark placeholder:text-gray-78 focus:outline-none"
        rows={3}
      />
    </div>
  );
};

export default PostInput;
