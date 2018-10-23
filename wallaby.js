module.exports = wallaby => ({
  files: ['src/**/*.ts', { pattern: 'jest-cld-asm.json', instrument: false, load: true }],

  tests: ['spec/cld-asm/**/*.ts'],

  testFramework: {
    type: 'jest'
  },

  env: {
    type: 'node'
  },

  workers: {
    initial: 1,
    regular: 1
  },

  preprocessors: {
    '**/*.js?(x)': file =>
      require('babel-core').transform(file.content, {
        sourceMap: true,
        filename: file.path,
        presets: ['babel-preset-jest']
      })
  },

  setup: w => {
    const path = require('path');

    const jestConfig = (({ resetMocks }) => ({
      resetMocks
    }))(require('./jest-cld-asm.json'));

    w.testFramework.configure(jestConfig);
  }
});
