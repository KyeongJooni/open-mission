export const MYPAGE_ROUTES = {
  BASE: '/mypage',
  MY_PROFILE: '/mypage/myprofile',
  EDIT_PROFILE: '/mypage/editprofile',
  SIGNUP: '/mypage/signup',
} as const;

export const MYPAGE_TEXTS = {
  BUTTONS: {
    EMAIL_SIGNUP: '이메일로 회원가입',
    KAKAO_SIGNUP: '카카오로 회원가입',
    SIGNUP_SUBMIT: '회원가입 완료',
    ADD_PROFILE_PHOTO: '프로필 사진 추가',
    LOGIN_REDIRECT: '로그인 하러 가기',
  },
  DIVIDER: {
    OR: '또는',
  },
  LABELS: {
    PROFILE_PHOTO: '프로필 사진',
    KAKAO_LOGIN: '카카오 로그인',
    SOCIAL_LOGIN: '소셜 로그인',
  },
  MODAL: {
    SIGNUP_COMPLETE: '회원가입이 완료되었습니다.',
  },
  PROFILE: {
    SETTINGS: '내 프로필 설정',
    DEFAULT_BIO: '한줄 소개를 입력해주세요',
    DEFAULT_USER_NAME: '사용자',
    NICKNAME_PLACEHOLDER: '닉네임',
    BIO_PLACEHOLDER: '한줄 소개',
    NICKNAME_HINT: '*20글자 이내',
    SAVE_SUCCESS: '저장했습니다!',
  },
} as const;

export const MYPAGE_HEADER_CONTENT = {
  [MYPAGE_ROUTES.BASE]: {
    title: '회원가입',
    subtitle: undefined,
  },
  [MYPAGE_ROUTES.SIGNUP]: {
    title: '회원가입',
    subtitle: '가입을 위해 회원님의 정보를 입력해주세요.',
  },
} as const;

export const SIGNUP_FORM_FIELDS = [
  { name: 'email', title: '이메일', type: 'email' as const, placeholder: '이메일', hintText: undefined },
  { name: 'password', title: '비밀번호', type: 'password' as const, placeholder: '비밀번호', hintText: undefined },
  {
    name: 'passwordConfirm',
    title: '비밀번호 확인',
    type: 'password' as const,
    placeholder: '비밀번호를 다시 입력하세요',
    hintText: undefined,
  },
  { name: 'name', title: '이름', type: undefined, placeholder: '이름', hintText: undefined },
  { name: 'birthDate', title: '생년월일', type: undefined, placeholder: 'YYYY-MM-DD', hintText: undefined },
  { name: 'nickname', title: '닉네임', type: undefined, placeholder: '닉네임', hintText: '20글자 이내' },
  { name: 'bio', title: '한 줄 소개', type: undefined, placeholder: '한 줄 소개', hintText: undefined },
] as const;
