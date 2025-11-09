export const SIDEBAR_TEXTS = {
  LOGGED_IN: {
    MY_GITLOG: '나의 깃로그',
    WRITE_GITLOG: '깃로그 쓰기',
    SETTINGS: '설정',
    LOGOUT: '로그아웃',
  },

  // 비로그인 상태 텍스트
  NOT_LOGGED_IN: {
    QUOTE: 'You can make anything by writing',
    START_GITLOG: '깃로그 시작하기',
  },

  // 모달 텍스트
  MODAL: {
    LOGOUT_MESSAGE: '로그아웃을 진행할게요',
    LOGOUT_CONFIRM: '로그아웃',
    CANCEL: '취소',
  },
} as const;

// 사이드바 관련 모달 타입
export const SIDEBAR_MODAL_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const;
