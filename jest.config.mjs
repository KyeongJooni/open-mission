/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',

  //jsdom 사용
  testEnvironment: 'jsdom',

  // 테스트 파일 위치 지정
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],

  // 경로 별칭 매핑
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 커버리지 수집 대상
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/playground/**',
  ],

  // 테스트 결과를 상세하게 표시
  verbose: true,
};

export default config;
