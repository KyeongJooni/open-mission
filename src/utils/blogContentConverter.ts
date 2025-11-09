import type { ContentItem, EditorMode } from '@/types/blog';
import { hasMarkdownSyntax } from './markdownDetector';

// 에디터 포맷 변환
export const parseApiContentToEditor = (contents: ContentItem[]): { content: string; editorMode: EditorMode } => {
  if (!contents || contents.length === 0) {
    return { content: '', editorMode: 'basic' };
  }

  // 마크다운 문법 체크
  const textContents = contents
    .filter(item => item.contentType === 'TEXT')
    .sort((a, b) => a.contentOrder - b.contentOrder)
    .map(item => item.content)
    .join('\n');

  const isMarkdown = hasMarkdownSyntax(textContents);

  // 마크다운 모드 반환
  if (isMarkdown) {
    let markdownContent = '';
    contents
      .sort((a, b) => a.contentOrder - b.contentOrder)
      .forEach(item => {
        if (item.contentType === 'TEXT') {
          markdownContent += item.content + '\n';
        } else if (item.contentType === 'IMAGE') {
          markdownContent += `![](${item.content})\n`;
        }
      });

    return {
      content: markdownContent.trim(),
      editorMode: 'markdown',
    };
  }

  // 기본 모드
  const htmlParts: string[] = [];
  contents
    .sort((a, b) => a.contentOrder - b.contentOrder)
    .forEach((item, index) => {
      if (item.contentType === 'TEXT') {
        htmlParts.push(item.content);

        const nextItem = contents[index + 1];
        if (nextItem && nextItem.contentType === 'TEXT') {
          htmlParts.push('<p><br></p>');
        }
      } else if (item.contentType === 'IMAGE') {
        htmlParts.push(`<p><img src="${item.content}" /></p>`);
      }
    });

  return {
    content: htmlParts.join(''),
    editorMode: 'basic',
  };
};
