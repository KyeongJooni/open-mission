import { buildMarkdownContents } from '../markdownParser';

describe('buildMarkdownContents', () => {
  it('텍스트만 있는 마크다운을 파싱해야 함', () => {
    const content = '# Hello World\n\nThis is a test.';
    const result = buildMarkdownContents(content);

    expect(result).toHaveLength(1);
    expect(result[0].contentType).toBe('TEXT');
    expect(result[0].content).toContain('Hello World');
  });

  it('이미지가 포함된 마크다운을 파싱해야 함', () => {
    const content = 'Some text\n\n![alt](https://example.com/image.jpg)\n\nMore text';
    const result = buildMarkdownContents(content);

    expect(result.length).toBeGreaterThanOrEqual(3);

    const textItems = result.filter(item => item.contentType === 'TEXT');
    const imageItems = result.filter(item => item.contentType === 'IMAGE');

    expect(textItems.length).toBeGreaterThanOrEqual(2);
    expect(imageItems.length).toBe(1);
    expect(imageItems[0].content).toBe('https://example.com/image.jpg');
  });

  it('여러 이미지를 파싱해야 함', () => {
    const content = '![img1](url1)\n\n![img2](url2)';
    const result = buildMarkdownContents(content);

    const imageItems = result.filter(item => item.contentType === 'IMAGE');
    expect(imageItems.length).toBe(2);
  });

  it('빈 문자열을 처리해야 함', () => {
    const content = '';
    const result = buildMarkdownContents(content);

    expect(result).toHaveLength(0);
  });

  it('contentOrder가 순차적으로 증가해야 함', () => {
    const content = 'Text 1\n\n![img](url)\n\nText 2';
    const result = buildMarkdownContents(content);

    result.forEach((item, index) => {
      expect(item.contentOrder).toBe(index + 1);
    });
  });

  it('이미지만 있는 마크다운을 파싱해야 함', () => {
    const content = '![alt](https://example.com/image.jpg)';
    const result = buildMarkdownContents(content);

    expect(result).toHaveLength(1);
    expect(result[0].contentType).toBe('IMAGE');
    expect(result[0].content).toBe('https://example.com/image.jpg');
  });

  it('이미지 전 텍스트만 있는 경우를 처리해야 함', () => {
    const content = 'Some text before\n\n![img](url)';
    const result = buildMarkdownContents(content);

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].contentType).toBe('TEXT');
    expect(result[result.length - 1].contentType).toBe('IMAGE');
  });

  it('이미지 후 텍스트만 있는 경우를 처리해야 함', () => {
    const content = '![img](url)\n\nSome text after';
    const result = buildMarkdownContents(content);

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].contentType).toBe('IMAGE');
    expect(result[result.length - 1].contentType).toBe('TEXT');
  });
});
