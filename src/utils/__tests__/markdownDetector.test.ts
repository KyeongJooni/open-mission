import { hasMarkdownSyntax } from '../markdownDetector';

describe('hasMarkdownSyntax', () => {
  describe('빈 값 처리', () => {
    it.each([
      ['', false],
      [null as unknown as string, false],
      [undefined as unknown as string, false],
    ])('빈 값 %p는 %s를 반환해야 함', (input, expected) => {
      expect(hasMarkdownSyntax(input)).toBe(expected);
    });

    it('일반 텍스트는 false를 반환해야 함', () => {
      expect(hasMarkdownSyntax('Hello World')).toBe(false);
      expect(hasMarkdownSyntax('일반 텍스트입니다')).toBe(false);
    });
  });

  describe('헤딩', () => {
    it.each([
      ['# 제목', true],
      ['## 제목', true],
      ['### 제목', true],
      ['#### 제목', true],
      ['##### 제목', true],
      ['###### 제목', true],
    ])('헤딩 %p는 마크다운으로 인식해야 함', (input, expected) => {
      expect(hasMarkdownSyntax(input)).toBe(expected);
    });

    it('공백 없는 #은 마크다운이 아님', () => {
      expect(hasMarkdownSyntax('#태그')).toBe(false);
      expect(hasMarkdownSyntax('##해시태그')).toBe(false);
    });

    it('7개 이상의 #은 마크다운이 아님', () => {
      expect(hasMarkdownSyntax('####### 제목')).toBe(false);
    });
  });

  describe('강조', () => {
    it.each([
      ['**볼드**', true],
      ['*이탤릭*', true],
      ['~~취소선~~', true],
    ])('강조 문법 %p는 마크다운으로 인식해야 함', (input, expected) => {
      expect(hasMarkdownSyntax(input)).toBe(expected);
    });

    it('중첩 강조도 인식해야 함', () => {
      expect(hasMarkdownSyntax('***볼드 이탤릭***')).toBe(true);
    });
  });

  describe('링크와 이미지', () => {
    it('링크를 인식해야 함', () => {
      expect(hasMarkdownSyntax('[텍스트](https://example.com)')).toBe(true);
      expect(hasMarkdownSyntax('[링크](url)')).toBe(true);
    });

    it('이미지 문법을 인식해야 함', () => {
      expect(hasMarkdownSyntax('![대체텍스트](image.png)')).toBe(true);
    });

    it('빈 링크도 인식해야 함', () => {
      expect(hasMarkdownSyntax('[]()')).toBe(true);
    });
  });

  describe('리스트', () => {
    it.each([
      ['- 항목', true],
      ['+ 항목', true],
      ['1. 항목', true],
      ['10. 항목', true],
      ['99. 항목', true],
    ])('리스트 %p는 마크다운으로 인식해야 함', (input, expected) => {
      expect(hasMarkdownSyntax(input)).toBe(expected);
    });

    it('* 리스트도 마크다운으로 인식해야 함', () => {
      expect(hasMarkdownSyntax('* 항목')).toBe(true);
    });

    it('공백 없는 리스트 마커는 마크다운이 아님', () => {
      expect(hasMarkdownSyntax('-항목')).toBe(false);
      expect(hasMarkdownSyntax('1.항목')).toBe(false);
    });
  });

  describe('인용', () => {
    it('인용문을 인식해야 함', () => {
      expect(hasMarkdownSyntax('> 인용문')).toBe(true);
    });

    it('중첩 인용도 인식해야 함', () => {
      expect(hasMarkdownSyntax('> > 중첩 인용')).toBe(true);
    });
  });

  describe('코드', () => {
    it('인라인 코드를 인식해야 함', () => {
      expect(hasMarkdownSyntax('`코드`')).toBe(true);
      expect(hasMarkdownSyntax('텍스트 `코드` 텍스트')).toBe(true);
    });

    it('코드 블록을 인식해야 함', () => {
      expect(hasMarkdownSyntax('```\n코드\n```')).toBe(true);
      expect(hasMarkdownSyntax('```javascript\nconst a = 1;\n```')).toBe(true);
    });
  });

  describe('수평선', () => {
    it.each([
      ['---', true],
      ['----', true],
      ['-----', true],
    ])('수평선 %p는 마크다운으로 인식해야 함', (input, expected) => {
      expect(hasMarkdownSyntax(input)).toBe(expected);
    });

    it('짧은 대시는 마크다운이 아님', () => {
      expect(hasMarkdownSyntax('--')).toBe(false);
    });
  });

  describe('복합 문서', () => {
    it('여러 마크다운 문법이 포함된 문서를 인식해야 함', () => {
      const markdown = `
# 제목

이것은 **볼드** 텍스트입니다.

- 항목 1
- 항목 2

> 인용문
      `;
      expect(hasMarkdownSyntax(markdown)).toBe(true);
    });

    it('마크다운 문법 하나만 있어도 인식해야 함', () => {
      expect(hasMarkdownSyntax('일반 텍스트 **볼드** 일반 텍스트')).toBe(true);
    });
  });

  describe('경계값 테스트', () => {
    it('특수문자가 포함된 일반 텍스트는 false', () => {
      expect(hasMarkdownSyntax('price: $100')).toBe(false);
      expect(hasMarkdownSyntax('C++ 프로그래밍')).toBe(false);
    });

    it('불완전한 마크다운 문법', () => {
      expect(hasMarkdownSyntax('[링크만')).toBe(false);
      expect(hasMarkdownSyntax('~~취소선')).toBe(false);
    });
  });
});
