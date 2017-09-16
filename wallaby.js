module.exports = wallaby => ({
  files: ['src/**/*.ts', 'src/lib/asm/cld3.js', 'src/lib/wasm/cld3.js'],

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

  setup: function(w) {
    jestConfig = {
      resetMocks: true,
      resetModules: true,
      clearMocks: true
    };

    w.testFramework.configure(jestConfig);
  }
});
