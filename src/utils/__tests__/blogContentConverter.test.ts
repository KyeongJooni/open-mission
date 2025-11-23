import { parseApiContentToEditor } from '../blogContentConverter';
import type { ContentItem } from '@/types/blog';

describe('parseApiContentToEditor', () => {
  describe('빈 값 처리', () => {
    it.each([
      [[], { content: '', editorMode: 'basic' }],
      [undefined as unknown as ContentItem[], { content: '', editorMode: 'basic' }],
      [null as unknown as ContentItem[], { content: '', editorMode: 'basic' }],
    ])('빈 배열 %p는 기본값을 반환해야 함', (input, expected) => {
      expect(parseApiContentToEditor(input)).toEqual(expected);
    });
  });

  describe('기본 모드 (HTML)', () => {
    it('단일 TEXT 항목을 기본 모드로 반환해야 함', () => {
      const contents: ContentItem[] = [{ contentType: 'TEXT', content: '안녕하세요', contentOrder: 1 }];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('basic');
      expect(result.content).toBe('안녕하세요');
    });

    it('여러 TEXT 항목을 br로 구분해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '첫 번째', contentOrder: 1 },
        { contentType: 'TEXT', content: '두 번째', contentOrder: 2 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('basic');
      expect(result.content).toContain('첫 번째');
      expect(result.content).toContain('<p><br></p>');
      expect(result.content).toContain('두 번째');
    });

    it('IMAGE 항목을 img 태그로 변환해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'IMAGE', content: 'https://example.com/image.png', contentOrder: 1 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('basic');
      expect(result.content).toContain('<img src="https://example.com/image.png"');
    });

    it('TEXT와 IMAGE가 섞인 콘텐츠를 처리해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '텍스트', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'image.png', contentOrder: 2 },
        { contentType: 'TEXT', content: '더 많은 텍스트', contentOrder: 3 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('basic');
      expect(result.content).toContain('텍스트');
      expect(result.content).toContain('<img src="image.png"');
      expect(result.content).toContain('더 많은 텍스트');
    });

    it('contentOrder에 따라 정렬해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '두 번째', contentOrder: 2 },
        { contentType: 'TEXT', content: '첫 번째', contentOrder: 1 },
        { contentType: 'TEXT', content: '세 번째', contentOrder: 3 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.content.indexOf('첫 번째')).toBeLessThan(result.content.indexOf('두 번째'));
      expect(result.content.indexOf('두 번째')).toBeLessThan(result.content.indexOf('세 번째'));
    });
  });

  describe('마크다운 모드', () => {
    it('마크다운 문법이 있는 콘텐츠를 마크다운 모드로 반환해야 함', () => {
      const contents: ContentItem[] = [{ contentType: 'TEXT', content: '# 제목', contentOrder: 1 }];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('markdown');
      expect(result.content).toBe('# 제목');
    });

    it('여러 마크다운 항목을 줄바꿈으로 연결해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '# 제목', contentOrder: 1 },
        { contentType: 'TEXT', content: '**볼드**', contentOrder: 2 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('markdown');
      expect(result.content).toBe('# 제목\n**볼드**');
    });

    it('마크다운 모드에서 IMAGE를 ![](url) 형식으로 변환해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '# 제목', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'image.png', contentOrder: 2 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('markdown');
      expect(result.content).toContain('![](image.png)');
    });

    it.each([['**볼드**'], ['*이탤릭*'], ['- 리스트'], ['> 인용'], ['`코드`'], ['[링크](url)']])(
      '마크다운 문법 %s를 마크다운 모드로 인식해야 함',
      markdown => {
        const contents: ContentItem[] = [{ contentType: 'TEXT', content: markdown, contentOrder: 1 }];

        const result = parseApiContentToEditor(contents);

        expect(result.editorMode).toBe('markdown');
      }
    );
  });

  describe('복합 시나리오', () => {
    it('복잡한 블로그 포스트를 올바르게 변환해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '# 블로그 제목', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'header.png', contentOrder: 2 },
        { contentType: 'TEXT', content: '본문 내용입니다.', contentOrder: 3 },
        { contentType: 'TEXT', content: '**강조된** 텍스트', contentOrder: 4 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('markdown');
      expect(result.content).toContain('# 블로그 제목');
      expect(result.content).toContain('![](header.png)');
    });

    it('순서가 뒤섞인 콘텐츠를 올바르게 정렬해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '세 번째', contentOrder: 3 },
        { contentType: 'TEXT', content: '첫 번째', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'image.png', contentOrder: 2 },
      ];

      const result = parseApiContentToEditor(contents);

      const lines = result.content.split('\n');
      expect(lines[0]).toContain('첫 번째');
    });
  });

  describe('경계값 테스트', () => {
    it('빈 문자열 콘텐츠를 처리해야 함', () => {
      const contents: ContentItem[] = [{ contentType: 'TEXT', content: '', contentOrder: 1 }];

      const result = parseApiContentToEditor(contents);

      expect(result.editorMode).toBe('basic');
    });

    it('매우 긴 콘텐츠를 처리해야 함', () => {
      const longText = 'a'.repeat(10000);
      const contents: ContentItem[] = [{ contentType: 'TEXT', content: longText, contentOrder: 1 }];

      const result = parseApiContentToEditor(contents);

      expect(result.content).toBe(longText);
    });

    it('특수문자가 포함된 콘텐츠를 처리해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '<script>alert("xss")</script>', contentOrder: 1 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.content).toContain('<script>');
    });

    it('동일한 contentOrder를 가진 항목을 처리해야 함', () => {
      const contents: ContentItem[] = [
        { contentType: 'TEXT', content: '첫 번째', contentOrder: 1 },
        { contentType: 'TEXT', content: '두 번째', contentOrder: 1 },
      ];

      const result = parseApiContentToEditor(contents);

      expect(result.content).toContain('첫 번째');
      expect(result.content).toContain('두 번째');
    });
  });
});
