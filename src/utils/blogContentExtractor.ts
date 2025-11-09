import type { BlogContent } from '@/api/blog/blogTypes';

// HTML 태그 제거
const stripHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// 마크다운 문법 제거
const stripMarkdownSyntax = (text: string): string => {
  if (!text) {
    return '';
  }

  return text
    .replace(/`{3}[\s\S]*?`{3}/g, '') // 코드 블록
    .replace(/`([^`]+)`/g, '$1') // 인라인 코드
    .replace(/!\[[^\]]*]\([^)]*\)/g, '') // 이미지
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1') // 링크
    .replace(/^#{1,6}\s+/gm, '') // 헤딩
    .replace(/^>\s?/gm, '') // 인용
    .replace(/^(\s*[-*+]|\s*\d+\.)\s+/gm, '') // 리스트
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 볼드
    .replace(/(\*|_)(.*?)\1/g, '$2') // 이탤릭
    .replace(/~~(.*?)~~/g, '$1') // 취소선
    .replace(/^---+$|^\*\*\*+$|^___+$|^-\s?-\s?-\s?$/gm, '') // 수평선
    .replace(/\r?\n\s*\r?\n/g, '\n') // 연속 개행 정리
    .trim();
};

// contents TEXT/MARKDOWN 추출
export const getFirstTextContent = (contents: BlogContent[]): string => {
  const textContents = contents
    .filter(c => c.contentType === 'TEXT' || c.contentType === 'MARKDOWN')
    .sort((a, b) => a.contentOrder - b.contentOrder)
    .map(c => stripMarkdownSyntax(stripHtmlTags(c.content)))
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
