/* eslint-disable */

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage',
    '<rootDir>/dist',
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/src',
    '<rootDir>/pages',
  ],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@pages/(.*)': '<rootDir>/pages/$1',
    '@styles/(.*)': '<rootDir>/styles/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/assetsTransformer.js", "\\.(css|less)$": "<rootDir>/assetsTransformer.js"
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
