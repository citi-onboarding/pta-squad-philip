import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@database$': '<rootDir>/src/database/index.ts',
    '^@controllers$': '<rootDir>/src/controllers/index.ts',
  },
  testMatch: ['**/tests/**/*.test.ts'],
}

export default config