import MDEditor from '@uiw/react-md-editor';

interface PostBodyProps {
  content: string;
  placeholder?: string;
  className?: string;
  isMarkdown?: boolean;
}

const PostBody = ({ content, placeholder = '', className = '', isMarkdown = false }: PostBodyProps) => {
  const isEmpty = !content || content.trim().length === 0;

  // 마크다운 렌더링
  if (isMarkdown && !isEmpty) {
    return (
      <div className={`flex w-full max-w-[688px] items-center justify-center gap-2.5 p-3 ${className}`}>
        <div className="flex-1" data-color-mode="light">
          <MDEditor.Markdown source={content} style={{ backgroundColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  // 특수 HTML 태그 감지
  const hasSpecialTags = /<(h[1-6]|strong|em|ul|ol|li|blockquote|code|pre)/i.test(content);

  // HTML 렌더링
  return (
    <div className={`flex w-full max-w-[688px] items-start justify-start gap-2.5 p-3 ${className}`}>
      <div
        className={
          hasSpecialTags
            ? `prose prose-sm max-w-none flex-1 ${isEmpty ? 'text-gray-56' : 'text-gray-dark'}`
            : `flex-1 text-sm font-light leading-[160%] tracking-[-0.07px] ${isEmpty ? 'text-gray-56' : 'text-gray-dark'}`
        }
        dangerouslySetInnerHTML={{ __html: isEmpty ? placeholder : content }}
      />
    </div>
  );
};

export default PostBody;
