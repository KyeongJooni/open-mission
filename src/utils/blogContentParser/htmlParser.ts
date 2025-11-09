import type { ContentItem } from '@/types/blog';
import { MAX_CONTENT_LENGTH, splitContentByLength } from './shared';

const BLOCK_ELEMENTS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'UL', 'OL', 'DIV'];

const parser = new DOMParser();

export const buildHtmlContents = (content: string): ContentItem[] => {
  const doc = parser.parseFromString(content, 'text/html');
  const contents: ContentItem[] = [];
  let order = 1;

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

      if (BLOCK_ELEMENTS.includes(element.tagName)) {
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

  return contents;
};
