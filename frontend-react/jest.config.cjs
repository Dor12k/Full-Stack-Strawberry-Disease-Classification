
// module.exports = {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
//   moduleFileExtensions: ['js', 'jsx'],
//   transform: {
//     '^.+\\.jsx?$': 'babel-jest',
//   },
//   transformIgnorePatterns: [
//     "/node_modules/(?!axios|@fortawesome|react|some-other-package-to-transform)/",
//   ],
//   globals: {
//     'import.meta': {},
//   },
// };

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest', 
     '^.+\\.css$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!axios)',  
    '/node_modules/(?!axios-instance)/', 
  ],
  globals: {
    'process.env.VITE_BACKEND_BASE_API': 'http://localhost:8000/api',
  },
  testEnvironment: 'jsdom', 
};



