import { act } from '@testing-library/react';
import { useBlogWriteStore } from '../useBlogWriteStore';

describe('useBlogWriteStore', () => {
  beforeEach(() => {
    act(() => {
      useBlogWriteStore.getState().reset();
    });
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정되어야 함', () => {
      const state = useBlogWriteStore.getState();
      expect(state.title).toBe('');
      expect(state.mode).toBe('basic');
      expect(state.basicContent).toBe('');
      expect(state.markdownContent).toBe('');
      expect(state.editPostId).toBeNull();
    });
  });

  describe('setTitle', () => {
    it.each([
      ['테스트 제목'],
      [''],
      ['매우 긴 제목'.repeat(100)],
    ])('제목을 "%s"로 설정해야 함', (title) => {
      act(() => {
        useBlogWriteStore.getState().setTitle(title);
      });
      expect(useBlogWriteStore.getState().title).toBe(title);
    });
  });

  describe('setMode', () => {
    it.each([
      ['basic'],
      ['markdown'],
    ] as const)('모드를 %s로 설정해야 함', (mode) => {
      act(() => {
        useBlogWriteStore.getState().setMode(mode);
      });
      expect(useBlogWriteStore.getState().mode).toBe(mode);
    });
  });

  describe('setBasicContent', () => {
    it('기본 콘텐츠를 설정해야 함', () => {
      const content = '<p>테스트 콘텐츠</p>';
      act(() => {
        useBlogWriteStore.getState().setBasicContent(content);
      });
      expect(useBlogWriteStore.getState().basicContent).toBe(content);
    });

    it('HTML 콘텐츠를 저장해야 함', () => {
      const content = '<p><strong>볼드</strong> 텍스트</p>';
      act(() => {
        useBlogWriteStore.getState().setBasicContent(content);
      });
      expect(useBlogWriteStore.getState().basicContent).toBe(content);
    });
  });

  describe('setMarkdownContent', () => {
    it('마크다운 콘텐츠를 설정해야 함', () => {
      const content = '# 제목\n\n본문 내용';
      act(() => {
        useBlogWriteStore.getState().setMarkdownContent(content);
      });
      expect(useBlogWriteStore.getState().markdownContent).toBe(content);
    });
  });

  describe('setEditPostId', () => {
    it.each([
      ['123'],
      ['abc-456'],
      [null],
    ])('editPostId를 %s로 설정해야 함', (id) => {
      act(() => {
        useBlogWriteStore.getState().setEditPostId(id);
      });
      expect(useBlogWriteStore.getState().editPostId).toBe(id);
    });
  });

  describe('reset', () => {
    it('모든 상태를 초기화해야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setTitle('제목');
        useBlogWriteStore.getState().setMode('markdown');
        useBlogWriteStore.getState().setBasicContent('기본');
        useBlogWriteStore.getState().setMarkdownContent('마크다운');
        useBlogWriteStore.getState().setEditPostId('123');
      });

      act(() => {
        useBlogWriteStore.getState().reset();
      });

      const state = useBlogWriteStore.getState();
      expect(state.title).toBe('');
      expect(state.mode).toBe('basic');
      expect(state.basicContent).toBe('');
      expect(state.markdownContent).toBe('');
      expect(state.editPostId).toBeNull();
    });
  });

  describe('getCurrentContent', () => {
    it('basic 모드에서 basicContent를 반환해야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setMode('basic');
        useBlogWriteStore.getState().setBasicContent('기본 콘텐츠');
        useBlogWriteStore.getState().setMarkdownContent('마크다운 콘텐츠');
      });

      expect(useBlogWriteStore.getState().getCurrentContent()).toBe('기본 콘텐츠');
    });

    it('markdown 모드에서 markdownContent를 반환해야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setMode('markdown');
        useBlogWriteStore.getState().setBasicContent('기본 콘텐츠');
        useBlogWriteStore.getState().setMarkdownContent('마크다운 콘텐츠');
      });

      expect(useBlogWriteStore.getState().getCurrentContent()).toBe('마크다운 콘텐츠');
    });

    it('빈 콘텐츠도 반환해야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setMode('basic');
      });

      expect(useBlogWriteStore.getState().getCurrentContent()).toBe('');
    });
  });

  describe('글 작성 시나리오', () => {
    it('새 글 작성 플로우가 정상 동작해야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setTitle('새 글 제목');
        useBlogWriteStore.getState().setMode('markdown');
        useBlogWriteStore.getState().setMarkdownContent('# 본문');
      });

      const state = useBlogWriteStore.getState();
      expect(state.title).toBe('새 글 제목');
      expect(state.getCurrentContent()).toBe('# 본문');
      expect(state.editPostId).toBeNull();
    });

    it('글 수정 플로우가 정상 동작해야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setEditPostId('post-123');
        useBlogWriteStore.getState().setTitle('수정된 제목');
        useBlogWriteStore.getState().setMode('basic');
        useBlogWriteStore.getState().setBasicContent('<p>수정된 내용</p>');
      });

      const state = useBlogWriteStore.getState();
      expect(state.editPostId).toBe('post-123');
      expect(state.title).toBe('수정된 제목');
      expect(state.getCurrentContent()).toBe('<p>수정된 내용</p>');
    });

    it('모드 전환 시 콘텐츠가 유지되어야 함', () => {
      act(() => {
        useBlogWriteStore.getState().setBasicContent('기본');
        useBlogWriteStore.getState().setMarkdownContent('마크다운');
        useBlogWriteStore.getState().setMode('markdown');
      });

      expect(useBlogWriteStore.getState().getCurrentContent()).toBe('마크다운');

      act(() => {
        useBlogWriteStore.getState().setMode('basic');
      });

      expect(useBlogWriteStore.getState().getCurrentContent()).toBe('기본');
    });
  });
});
