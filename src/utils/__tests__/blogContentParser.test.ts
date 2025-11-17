import { convertToApiFormat } from '../blogContentParser';

describe('blogContentParser', () => {
  describe('convertToApiFormat', () => {
    describe('마크다운 모드', () => {
      it('마크다운 콘텐츠를 TEXT 타입으로 변환해야 함', () => {
        const result = convertToApiFormat('제목', '# 마크다운 내용', true);

        expect(result).toEqual({
          title: '제목',
          contents: [
            {
              contentOrder: 1,
              content: '# 마크다운 내용',
              contentType: 'TEXT',
            },
          ],
        });
      });

      it('빈 제목은 "제목 없음"으로 처리해야 함', () => {
        const result = convertToApiFormat('', '마크다운', true);
        expect(result.title).toBe('제목 없음');
      });

      it('공백만 있는 제목은 "제목 없음"으로 처리해야 함', () => {
        const result = convertToApiFormat('   ', '마크다운', true);
        expect(result.title).toBe('제목 없음');
      });

      it('앞뒤 공백을 제거해야 함', () => {
        const result = convertToApiFormat('  제목  ', '  내용  ', true);
        expect(result.title).toBe('제목');
        expect(result.contents[0].content).toBe('내용');
      });
    });

    describe('HTML 모드 - 텍스트만', () => {
      it('단순 텍스트를 TEXT 타입으로 변환해야 함', () => {
        const html = '<p>안녕하세요</p>';
        const result = convertToApiFormat('제목', html, false);

        expect(result.title).toBe('제목');
        expect(result.contents).toHaveLength(1);
        expect(result.contents[0]).toMatchObject({
          contentOrder: 1,
          contentType: 'TEXT',
        });
      });

      it('여러 개의 p 태그를 순서대로 변환해야 함', () => {
        const html = '<p>첫 번째</p><p>두 번째</p><p>세 번째</p>';
        const result = convertToApiFormat('제목', html, false);

        expect(result.contents).toHaveLength(3);
        expect(result.contents[0].contentOrder).toBe(1);
        expect(result.contents[1].contentOrder).toBe(2);
        expect(result.contents[2].contentOrder).toBe(3);
        expect(result.contents[0].contentType).toBe('TEXT');
        expect(result.contents[1].contentType).toBe('TEXT');
        expect(result.contents[2].contentType).toBe('TEXT');
      });

      it('HTML 태그가 포함된 텍스트를 그대로 유지해야 함 (bold, italic 등)', () => {
        const html = '<p><strong>굵게</strong> 그리고 <em>기울임</em></p>';
        const result = convertToApiFormat('제목', html, false);

        expect(result.contents[0].content).toBe('<p><strong>굵게</strong> 그리고 <em>기울임</em></p>');
      });
    });

    describe('HTML 모드 - 이미지만', () => {
      it('이미지를 IMAGE 타입으로 변환해야 함', () => {
        const html = '<img src="https://example.com/image.jpg" />';
        const result = convertToApiFormat('제목', html, false);

        expect(result.contents).toHaveLength(1);
        expect(result.contents[0]).toMatchObject({
          contentOrder: 1,
          content: 'https://example.com/image.jpg',
          contentType: 'IMAGE',
        });
      });

      it('여러 이미지를 순서대로 변환해야 함', () => {
        const html = '<img src="img1.jpg" /><img src="img2.jpg" />';
        const result = convertToApiFormat('제목', html, false);

        expect(result.contents).toHaveLength(2);
        // DOMParser가 상대 경로를 절대 경로로 변환하므로 endsWith로 확인
        expect(result.contents[0].content).toContain('img1.jpg');
        expect(result.contents[1].content).toContain('img2.jpg');
        expect(result.contents[0].contentType).toBe('IMAGE');
        expect(result.contents[1].contentType).toBe('IMAGE');
      });
    });

    describe('HTML 모드 - 텍스트와 이미지 혼합', () => {
      it('텍스트와 이미지를 순서대로 변환해야 함', () => {
        const html = '<p>안녕하세요</p><img src="image.jpg" /><p>반갑습니다</p>';
        const result = convertToApiFormat('제목', html, false);

        expect(result.contents).toHaveLength(3);
        expect(result.contents[0]).toMatchObject({
          contentOrder: 1,
          contentType: 'TEXT',
        });
        expect(result.contents[1].contentOrder).toBe(2);
        expect(result.contents[1].contentType).toBe('IMAGE');
        expect(result.contents[1].content).toContain('image.jpg');
        expect(result.contents[2]).toMatchObject({
          contentOrder: 3,
          contentType: 'TEXT',
        });
      });

      it('p 태그 안의 이미지를 올바르게 처리해야 함', () => {
        const html = '<p>텍스트 <img src="inline.jpg" /> 계속</p>';
        const result = convertToApiFormat('제목', html, false);

        // p 태그 안의 img는 재귀적으로 분리되어야 함
        const imageContent = result.contents.find(c => c.contentType === 'IMAGE');
        expect(imageContent).toBeDefined();
        expect(imageContent?.content).toContain('inline.jpg');
      });
    });

    describe('엣지 케이스', () => {
      it('빈 HTML은 빈 TEXT 하나를 생성해야 함', () => {
        const result = convertToApiFormat('제목', '', false);

        expect(result.contents).toHaveLength(1);
        expect(result.contents[0]).toMatchObject({
          contentOrder: 1,
          content: '',
          contentType: 'TEXT',
        });
      });

      it('공백만 있는 HTML은 빈 TEXT 하나를 생성해야 함', () => {
        const result = convertToApiFormat('제목', '<p>   </p>', false);

        expect(result.contents).toHaveLength(1);
        expect(result.contents[0].contentType).toBe('TEXT');
      });

      it('src가 없는 img 태그는 무시해야 함', () => {
        const html = '<p>텍스트</p><img /><p>더 텍스트</p>';
        const result = convertToApiFormat('제목', html, false);

        expect(result.contents).toHaveLength(2);
        expect(result.contents.every(c => c.contentType === 'TEXT')).toBe(true);
      });
    });

    describe('제목 처리', () => {
      it('제목의 앞뒤 공백을 제거해야 함', () => {
        const result = convertToApiFormat('  제목  ', '<p>내용</p>', false);
        expect(result.title).toBe('제목');
      });

      it('빈 제목은 "제목 없음"으로 처리해야 함', () => {
        const result = convertToApiFormat('', '<p>내용</p>', false);
        expect(result.title).toBe('제목 없음');
      });

      it('공백만 있는 제목도 "제목 없음"으로 처리해야 함', () => {
        const result = convertToApiFormat('   ', '<p>내용</p>', false);
        expect(result.title).toBe('제목 없음');
      });
    });
  });
});
