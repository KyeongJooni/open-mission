import type { CreatePostPayload, ContentItem } from '@/types/blog';

const MAX_CONTENT_LENGTH = 255;

const splitContentByLength = (text: string, maxLength: number): string[] => {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    chunks.push(remaining.substring(0, maxLength));
    remaining = remaining.substring(maxLength);
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
};

export const convertToApiFormat = (title: string, content: string, isMarkdown = false): CreatePostPayload => {
  if (isMarkdown) {
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

      // 이미지 URL 추가
      contents.push({
        contentOrder: order++,
        content: match[2], // URL 부분
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

    return {
      title: title.trim() || '제목 없음',
      contents,
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const contents: ContentItem[] = [];
  let order = 1;

  // 블록 레벨 요소
  const blockElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'UL', 'OL', 'DIV'];

  const processNodeWithContext = (node: Node, insideImgBlock = false) => {
    if (node.nodeName === 'IMG') {
      const img = node as HTMLImageElement;
      if (img.src) {
        contents.push({
          contentOrder: order++,
          content: img.src,
          contentType: 'IMAGE',
        });
      }
      return;
    }

    if (node.nodeType === Node.TEXT_NODE && insideImgBlock) {
      const text = node.textContent?.trim();
      if (text) {
        const chunks = splitContentByLength(text, MAX_CONTENT_LENGTH);
        chunks.forEach(chunk => {
          contents.push({
            contentOrder: order++,
            content: chunk,
            contentType: 'TEXT',
          });
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (blockElements.includes(element.tagName)) {
        const hasImg = element.querySelector('img');
        if (hasImg) {
          Array.from(element.childNodes).forEach(child => processNodeWithContext(child, true));
          return;
        }

        const text = element.textContent?.trim();
        if (text) {
          const htmlContent = element.outerHTML.trim();
          const chunks = splitContentByLength(htmlContent, MAX_CONTENT_LENGTH);
          chunks.forEach(chunk => {
            contents.push({
              contentOrder: order++,
              content: chunk,
              contentType: 'TEXT',
            });
          });
        }
      } else {
        Array.from(element.childNodes).forEach(child => processNodeWithContext(child, insideImgBlock));
      }
    }
  };

  Array.from(doc.body.childNodes).forEach(node => processNodeWithContext(node));

  if (contents.length === 0) {
    contents.push({
      contentOrder: 1,
      content: '',
      contentType: 'TEXT',
    });
  }

  return {
    title: title.trim() || '제목 없음',
    contents,
  };
};
