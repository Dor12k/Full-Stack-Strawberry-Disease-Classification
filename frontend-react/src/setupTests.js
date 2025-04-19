

// src/setupTests.js
import '@testing-library/jest-dom';


global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

Object.defineProperty(global, 'import.meta', {
    value: { env: { VITE_BACKEND_BASE_API: 'http://localhost:8000/api' } },
});
  