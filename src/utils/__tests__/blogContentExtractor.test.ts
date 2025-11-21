import { getFirstTextContent, getFirstImageUrl, truncateText } from '../blogContentExtractor';
import type { BlogContent } from '@/api/blog/blogTypes';

describe('getFirstTextContent', () => {
  describe('빈 값 처리', () => {
    it('빈 배열은 빈 문자열을 반환해야 함', () => {
      expect(getFirstTextContent([])).toBe('');
    });

    it('TEXT 타입이 없으면 빈 문자열을 반환해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'IMAGE', content: 'image.png', contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe('');
    });
  });

  describe('TEXT 콘텐츠 추출', () => {
    it('단일 TEXT 콘텐츠를 추출해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '안녕하세요', contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe('안녕하세요');
    });

    it('여러 TEXT 콘텐츠를 공백으로 연결해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '첫 번째', contentOrder: 1 },
        { contentType: 'TEXT', content: '두 번째', contentOrder: 2 },
      ];
      expect(getFirstTextContent(contents)).toBe('첫 번째 두 번째');
    });

    it('contentOrder 순서대로 정렬해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '두 번째', contentOrder: 2 },
        { contentType: 'TEXT', content: '첫 번째', contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe('첫 번째 두 번째');
    });

    it('MARKDOWN 타입도 추출해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'MARKDOWN', content: '# 제목', contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe('제목');
    });
  });

  describe('HTML 태그 제거', () => {
    it.each([
      ['<p>텍스트</p>', '텍스트'],
      ['<div><span>중첩</span></div>', '중첩'],
      ['<a href="url">링크</a>', '링크'],
      ['<strong>볼드</strong>', '볼드'],
    ])('HTML %s에서 %s를 추출해야 함', (html, expected) => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: html, contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe(expected);
    });
  });

  describe('마크다운 문법 제거', () => {
    it.each([
      ['# 제목', '제목'],
      ['## 제목', '제목'],
      ['**볼드**', '볼드'],
      ['*이탤릭*', '이탤릭'],
      ['~~취소선~~', '취소선'],
      ['`코드`', '코드'],
      ['[링크](url)', '링크'],
      ['> 인용', '인용'],
      ['- 리스트', '리스트'],
      ['1. 숫자 리스트', '숫자 리스트'],
    ])('마크다운 %s에서 %s를 추출해야 함', (markdown, expected) => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: markdown, contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe(expected);
    });

    it('이미지 문법을 제거해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '![대체텍스트](image.png)', contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe('');
    });

    it('코드 블록을 제거해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '```javascript\nconst a = 1;\n```', contentOrder: 1 },
      ];
      expect(getFirstTextContent(contents)).toBe('');
    });
  });

  describe('복합 시나리오', () => {
    it('HTML과 마크다운이 섞인 콘텐츠를 처리해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '<p>**볼드**</p>', contentOrder: 1 },
      ];
      const result = getFirstTextContent(contents);
      expect(result).toBe('볼드');
    });

    it('IMAGE 타입은 무시해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '텍스트', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'image.png', contentOrder: 2 },
      ];
      expect(getFirstTextContent(contents)).toBe('텍스트');
    });
  });
});

describe('getFirstImageUrl', () => {
  describe('이미지 추출', () => {
    it('첫 번째 IMAGE URL을 반환해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'IMAGE', content: 'https://example.com/image.png', contentOrder: 1 },
      ];
      expect(getFirstImageUrl(contents)).toBe('https://example.com/image.png');
    });

    it('여러 이미지 중 첫 번째를 반환해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'IMAGE', content: 'first.png', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'second.png', contentOrder: 2 },
      ];
      expect(getFirstImageUrl(contents)).toBe('first.png');
    });

    it('이미지가 없으면 undefined를 반환해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '텍스트', contentOrder: 1 },
      ];
      expect(getFirstImageUrl(contents)).toBeUndefined();
    });

    it('빈 배열은 undefined를 반환해야 함', () => {
      expect(getFirstImageUrl([])).toBeUndefined();
    });
  });

  describe('순서 처리', () => {
    it('contentOrder와 상관없이 배열의 첫 번째 이미지를 반환해야 함', () => {
      const contents: BlogContent[] = [
        { contentType: 'TEXT', content: '텍스트', contentOrder: 1 },
        { contentType: 'IMAGE', content: 'second.png', contentOrder: 3 },
        { contentType: 'IMAGE', content: 'first.png', contentOrder: 2 },
      ];
      expect(getFirstImageUrl(contents)).toBe('second.png');
    });
  });
});

describe('truncateText', () => {
  describe('기본 동작', () => {
    it('최대 길이 이하의 텍스트는 그대로 반환해야 함', () => {
      expect(truncateText('안녕', 100)).toBe('안녕');
      expect(truncateText('Hello', 100)).toBe('Hello');
    });

    it('최대 길이를 초과하면 ...을 추가해야 함', () => {
      expect(truncateText('123456', 5)).toBe('12345...');
    });

    it('기본 최대 길이는 100이어야 함', () => {
      const text = 'a'.repeat(150);
      const result = truncateText(text);
      expect(result).toBe('a'.repeat(100) + '...');
    });
  });

  describe('경계값 테스트', () => {
    it.each([
      ['12345', 5, '12345'],
      ['123456', 5, '12345...'],
      ['1234', 5, '1234'],
      ['', 5, ''],
    ])('텍스트 %s (maxLength: %d)는 %s를 반환해야 함', (text, maxLength, expected) => {
      expect(truncateText(text, maxLength)).toBe(expected);
    });

    it('maxLength가 0이면 빈 문자열에 ...를 추가해야 함', () => {
      expect(truncateText('text', 0)).toBe('...');
    });

    it('빈 문자열은 그대로 반환해야 함', () => {
      expect(truncateText('', 100)).toBe('');
    });
  });

  describe('유니코드 처리', () => {
    it('한글을 올바르게 자르야 함', () => {
      expect(truncateText('안녕하세요', 3)).toBe('안녕하...');
    });

    it('이모지를 포함한 텍스트를 처리해야 함', () => {
      const text = '😊'.repeat(10);
      const result = truncateText(text, 5);
      expect(result.endsWith('...')).toBe(true);
    });
  });
});
