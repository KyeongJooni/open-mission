/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 색상 토큰
      colors: {
        // 배경색
        background: '#ffffff',

        // 텍스트 색상
        'text-primary': '#00a1ff',
        'text-secondary': '#909090',
        'character-title-85': 'rgba(0, 0, 0, 0.85)',
        'character-disabled-25': 'rgba(0, 0, 0, 0.25)',

        // 주요 색상
        primary: {
          DEFAULT: '#00a1ff',
          hover: '#0088e6',
          active: '#0070cc',
        },

        // 중성 색상
        white: '#ffffff',
        black: '#000000',
        dark: '#111112',
        gray: '#909090',
        'gray-20': '#333333', // Gray-20
        'gray-33': '#555555', // Gray-33
        'gray-56': '#909090', // Gray-56
        'gray-78': '#C8C8C8', // Gray-78
        'gray-90': '#E6E6E6', // Gray-90 (테두리, 기존 gray-light와 동일)
        'gray-96': '#F5F5F5', // Gray-96 (사이드바 배경)
        'gray-dark': '#666666',
        'gray-light': '#e6e6e6', // 기존 호환성 유지

        // 상태 색상
        positive: '#15dc5e',
        warning: '#ff3f3f',
        error: '#ef4444',
        disabled: 'rgba(144, 144, 144, 0.5)',
        // 브랜드 색상
        brand: {
          kakao: {
            DEFAULT: '#FEE500',
            hover: '#FDD835',
          },
        },
        
        // 모달 오버레이 색상
        'modal-overlay': 'rgba(182, 182, 182, 0.30)',
      },

      // 폰트 패밀리
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },

      // 폰트 크기 토큰
      fontSize: {
        xs: ['12px', { lineHeight: '160%', letterSpacing: '-0.06px' }],
        sm: ['14px', { lineHeight: '160%', letterSpacing: '-0.07px' }],
        'sm-plus': ['15px', { lineHeight: '150%', letterSpacing: '-0.07px' }],
        base: ['16px', { lineHeight: '160%', letterSpacing: '-0.08px' }],
        lg: ['18px', { lineHeight: '160%', letterSpacing: '-0.09px' }],
        xl: ['20px', { lineHeight: '160%', letterSpacing: '-0.1px' }],
        '2xl': ['24px', { lineHeight: '160%', letterSpacing: '-0.12px' }],
        '3xl': ['30px', { lineHeight: '160%', letterSpacing: '-0.15px' }],
      },

      // 폰트 가중치 토큰
      fontWeight: {
        thin: '100',
        light: '300',
        regular: '400',
        medium: '500',
        'semi-bold': '600',
        bold: '700',
        'extra-bold': '800',
      },

      // 간격 토큰
      spacing: {
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        4.5: '18px',
        5: '20px',
        6: '24px',
        8: '32px',
        18: '72px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        // 페이지 헤더 패딩
        'page-header': '16px 12px 16px 12px', // px-4 py-4 pl-3
        // 프리뷰 이미지 크기
        'preview-h': '116px',
        'preview-w': '124px',
        // 로그인 컨테이너 패딩
        'login-logo-px': '18px',
        'login-button-px': '14px', // 로그인 버튼 좌우 패딩
        'login-form-px': '16px', // 로그인 폼 좌우 패딩
        'login-form-gap': '2px', // 로그인 폼 요소 간격
        'login-inputs-py': '4px', // 로그인 인풋 래퍼 상하 패딩
        'login-inputs-px': '16px', // 로그인 인풋 래퍼 좌우 패딩
        'login-inputs-gap': '8px', // 로그인 인풋들 사이 간격
      },

      // 크기 토큰
      width: {
        'mobile': '390px', // 모바일 디바이스 너비
        'sns-divider': '313px',
        'sns-divider-line': '123px',
        'sidebar': '240px', // 사이드바 너비
        'sidebar-button': '99px', // 사이드바 버튼 너비
        'logo-container-min': '240px', // 로고 컨테이너 최소 너비
        'login-textbox-container-min': '240px', // 로그인 텍스트박스 컨테이너 최소 너비
        'login-content-wrapper-min': '240px', // 로그인 콘텐츠 래퍼 최소 너비
        'login-page': '782px', // 로그인 페이지 너비
        'login-form-min': '240px', // 로그인 폼 최소 너비
        'login-form-max': '344px', // 로그인 폼 최대 너비
        'login-form-min-wide': '391px', // 로그인 폼 최소 너비(디자인 시안)
        'logo-text-wrapper-min': '240px', // 로고+텍스트 래퍼 최소 너비
      },
      height: {
        'mobile': '844px', // 모바일 디바이스 높이
        'logo-container': '160px', // 로고 컨테이너 높이
        'login-textbox-container': '46px', // 로그인 텍스트박스 컨테이너 높이
        'login-input': '46px', // 로그인 인풋 높이
        'login-button': '45px', // 로그인 버튼 높이
        'page-header-legacy': '50px', // 레거시 페이지 헤더 높이
        'spacer-mobile-top': '18px', // 마이페이지 상단 스페이서 높이 (모바일)
        'spacer-lg': '36px', // 블로그 포스트 스페이서 높이 (모바일)
      },
      minHeight: {
        'mobile': '844px', // 모바일 디바이스 최소 높이
        'sns-divider': '25px',
      },

      // 최소 너비 토큰 (min-w-*)
      minWidth: {
        'login-form-min-wide': '391px',
        'login-section-min': '312px',
        'login-form-min': '240px',
        'logo-container-min': '240px',
        'login-textbox-container-min': '240px',
      },

      // 최대 높이 토큰
      maxHeight: {
        'login-modal': '469px', // 로그인 모달 최대 높이 (데스크톱)
        'login-modal-mobile': '675px', // 로그인 모달 최대 높이 (모바일)
      },

      // 최대 너비 토큰
      maxWidth: {
        content: '688px', // 컨텐츠 최대 너비
        mobile: '390px', // 모바일 최대 너비
        'login-page': '782px', // 로그인 페이지 최대 너비
        'login-page-mobile': '813px', // 로그인 페이지 최대 너비 (모바일 브레이크포인트)
        'logo-container': '344px', // 로고 컨테이너 최대 너비
        'login-textbox-container': '344px', // 텍스트박스 컨테이너 최대 너비
        modal: '326px',
        'page-header': '1366px',
        'post-card': '548px', // 포스트카드 최대 너비 (데스크톱, 이미지 있음)
        'post-card-mobile': '250px', // 포스트카드 최대 너비 (모바일, 이미지 있음)
        'post-card-mobile-full': '390px', // 포스트카드 최대 너비 (모바일, 이미지 없음)
        sidebar: '240px', // 사이드바 너비
        'sidebar-content': '688px', // 사이드바 콘텐츠 최대 너비
      },

      // 보더 반지름 토큰
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
        'login-modal': '9px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },

      // 그림자 토큰
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        lg: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        xl: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
        modal: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'page-header': '0 4px 4px 0 rgba(0, 0, 0, 0.01)',
      },

      // 레이아웃 토큰
      gap: {
        'center-layout': '8px',
        'button-group': '4px',
      },

      // 아이콘 토큰
      iconSize: {
        sm: '14px', // 작은 아이콘 (TextBox 등)
        md: '20px', // 중간 아이콘 (일반적인 버튼 아이콘)
        lg: '40px', // 큰 아이콘 (주요 액션 아이콘)
      },
      iconState: {
        hover: {
          background: '#E6E6E6', // Gray90
          borderRadius: '4px',
        },
      },

      // 백드롭 필터 토큰
      backdropBlur: {
        'modal': '2px',
      },

      // 스크린 브레이크포인트
      screens: {
        'mobile-max': '813px', // 모바일 최대 너비
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
