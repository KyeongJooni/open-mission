import type { CreatePostPayload, ContentItem } from '@/types/blog';

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
        contents.push({
          contentOrder: order++,
          content: textBefore,
          contentType: 'TEXT',
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
      contents.push({
        contentOrder: order++,
        content: remainingText,
        contentType: 'TEXT',
      });
    }

    if (contents.length === 0) {
      contents.push({
        contentOrder: 1,
        content: content.trim(),
        contentType: 'TEXT',
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
        contents.push({
          contentOrder: order++,
          content: text,
          contentType: 'TEXT',
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
          contents.push({
            contentOrder: order++,
            content: htmlContent,
            contentType: 'TEXT',
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
