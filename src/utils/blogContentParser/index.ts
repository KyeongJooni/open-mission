import type { CreatePostPayload } from '@/types/blog';
import { buildMarkdownContents } from './markdownParser';
import { buildHtmlContents } from './htmlParser';

export const convertToApiFormat = (title: string, content: string, isMarkdown = false): CreatePostPayload => {
  const trimmedTitle = title.trim() || '제목 없음';
  const contents = isMarkdown ? buildMarkdownContents(content) : buildHtmlContents(content);

  return {
    title: trimmedTitle,
    contents,
  };
};
