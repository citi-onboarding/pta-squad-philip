import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.ts'],
  moduleNameMapper: {
    '^@database$': '<rootDir>/src/database/index.ts',
    '^@controllers$': '<rootDir>/src/controllers/index.ts',
    '^generated/prisma$': '<rootDir>/generated/prisma',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: './tsconfig.test.json'
    }]
  },
  openHandlesTimeout: 10000,
  forceExit: true,
}

export default config