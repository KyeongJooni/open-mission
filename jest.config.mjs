import dotenv from 'dotenv';
dotenv.config();

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',

  testEnvironment: 'jsdom',

  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],

  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/src/test-utils/__mocks__/svgMock.tsx',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test-utils/__mocks__/fileMock.ts',
    '^@uiw/react-md-editor$': '<rootDir>/src/test-utils/__mocks__/@uiw/react-md-editor.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
                    VITE_KAKAO_REST_API_KEY: process.env.VITE_KAKAO_REST_API_KEY,
                    VITE_KAKAO_REDIRECT_URI: process.env.VITE_KAKAO_REDIRECT_URI,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },

  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.ts'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/playground/**',
    '!src/test-utils/**',
  ],

  testTimeout: 10000,

  verbose: true,
};

export default config;
