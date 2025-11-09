import type { BlogContent } from '@/api/blog/blogTypes';

// HTML 태그 제거
const stripHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// contents TEXT/MARKDOWN 추출
export const getFirstTextContent = (contents: BlogContent[]): string => {
  const textContents = contents
    .filter(c => c.contentType === 'TEXT' || c.contentType === 'MARKDOWN')
    .sort((a, b) => a.contentOrder - b.contentOrder)
    .map(c => stripHtmlTags(c.content))
    .join(' ');

  return textContents;
};

// contents IMAGE URL 추출
export const getFirstImageUrl = (contents: BlogContent[]): string | undefined => {
  const imageContent = contents.find(c => c.contentType === 'IMAGE');
  return imageContent?.content;
};

// 텍스트 미리보기
export const truncateText = (text: string, maxLength = 102): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};
