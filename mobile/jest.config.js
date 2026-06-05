module.exports = {
  preset: "jest-expo",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testMatch: ["<rootDir>/__tests__/**/*.test.[jt]s?(x)"],

  testPathIgnorePatterns: ["<rootDir>/app/"],

  transformIgnorePatterns: [
    "node_modules/.pnpm/(?!(react-native|@react-native\\+js-polyfills|@react-native\\+.*|@react-native-community\\+.*|jest-react-native|expo|expo-.*|@expo\\+.*|@testing-library\\+react-native|lucide-react-native|react-native-svg)@)",
    "node_modules/(?!\\.pnpm|((jest-)?react-native|@react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|@expo/.*|expo-.*|@testing-library/react-native|lucide-react-native|react-native-svg)/)",
  ],
};
