import type { ContentItem } from '@/types/blog';
import { MAX_CONTENT_LENGTH, splitContentByLength } from './shared';

export const buildMarkdownContents = (content: string): ContentItem[] => {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const contents: ContentItem[] = [];
  let order = 1;
  let lastIndex = 0;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index).trim();

    if (textBefore) {
      const chunks = splitContentByLength(textBefore, MAX_CONTENT_LENGTH);
      chunks.forEach(chunk => {
        contents.push({
          contentOrder: order++,
          content: chunk,
          contentType: 'TEXT',
        });
      });
    }

    contents.push({
      contentOrder: order++,
      content: match[2],
      contentType: 'IMAGE',
    });

    lastIndex = imageRegex.lastIndex;
  }

  const remainingText = content.substring(lastIndex).trim();
  if (remainingText) {
    const chunks = splitContentByLength(remainingText, MAX_CONTENT_LENGTH);
    chunks.forEach(chunk => {
      contents.push({
        contentOrder: order++,
        content: chunk,
        contentType: 'TEXT',
      });
    });
  }

  if (contents.length === 0) {
    const textContent = content.trim();
    const chunks = splitContentByLength(textContent, MAX_CONTENT_LENGTH);
    chunks.forEach(chunk => {
      contents.push({
        contentOrder: order++,
        content: chunk,
        contentType: 'TEXT',
      });
    });
  }

  return contents;
};
