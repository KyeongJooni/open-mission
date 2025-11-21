import dotenv from 'dotenv';
dotenv.config();

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',

  testEnvironment: 'jsdom',

  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
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
