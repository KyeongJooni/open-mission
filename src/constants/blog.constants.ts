export const BLOG_TEXTS = {
  POST_DETAILS: {
    COMMENT_LABEL: '댓글',
  },
  COMMENTS: {
    TITLE: '댓글',
    NO_COMMENTS_LINE1: '작성된 댓글이 없습니다.',
    NO_COMMENTS_LINE2: '응원의 첫번째 댓글을 달아주세요',
    LOGIN_PROMPT: '로그인을 하고 댓글을 달아보세요!',
    INPUT_PLACEHOLDER: '댓글을 입력하세요.',
    SUBMIT_BUTTON: '등록',
    DELETE_MODAL: {
      TITLE: '댓글을 삭제하시겠어요?',
      CANCEL: '취소',
      CONFIRM: '삭제하기',
    },
  },
  WRITE: {
    PLACEHOLDERS: {
      TITLE: '제목',
      CONTENT: '어떠한 것을 깨달았나요?',
    },
    MODES: {
      BASIC: '기본모드',
      MARKDOWN: '마크다운',
    },
    TOOLBAR: {
      HEADERS: [{ header: [1, 2, 3, false] }],
      TEXT_STYLES: ['bold', 'italic', 'underline'],
      LISTS: [{ list: 'ordered' }, { list: 'bullet' }],
      LINKS_IMAGES: ['link', 'image'],
      CLEAN: ['clean'],
    },
  },
} as const;

export const BLOG_STYLES = {
  EDITOR: {
    HEIGHT: '600px',
    MIN_WIDTH: '656px',
    TOOLBAR_HEIGHT: '40px',
    EDITOR_HEIGHT: '520px',
    BORDER_RADIUS: '4px',
  },
  COLORS: {
    BORDER: '#d0d7de',
    TOOLBAR_BG: '#f6f8fa',
    TOOLBAR_HOVER: '#eaeef2',
    EDITOR_BG: '#ffffff',
    TEXT: '#24292f',
    PLACEHOLDER: '#999',
  },
  SPACING: {
    TOOLBAR_PADDING: '8px',
    EDITOR_PADDING: '12px',
    IMAGE_MARGIN: '8px auto',
  },
  MOBILE: {
    MIN_HEIGHT: '300px',
    FONT_FAMILY: '"Noto Sans KR"',
    FONT_SIZE: '14px',
    FONT_WEIGHT: '300',
    LINE_HEIGHT: '160%',
    LETTER_SPACING: '-0.07px',
  },
} as const;
