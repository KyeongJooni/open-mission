export const ROUTES = {
  HOME: '/',
  BLOG: {
    WRITE: '/blog/write',
    DETAIL: (id: string) => `/blog/${id}`,
    EDIT: (id: string) => `/blog/write?edit=${id}`,
  },
  AUTH: {
    LOGIN: '/login',
  },
  MYPAGE: {
    BASE: '/mypage',
    MY_PROFILE: '/mypage/myprofile',
    EDIT_PROFILE: '/mypage/editprofile',
    SIGNUP: '/mypage/signup',
  },
} as const;
