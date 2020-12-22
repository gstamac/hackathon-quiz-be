module.exports = function () {
  return {
    files: [{ pattern: '.env', instrument: false }, { pattern: 'src/tests/**/*.ts', ignore: true }, 'src/**/*.ts'],
    tests: ['src/tests/**/*.test.ts'],
    env: {
      type: 'node',
    },
    testFramework: 'jest',
    // workers: {
    //   initial: 1,
    //   regular: 1,
    //   recycle: true,
    // },
    debug: true,
    runMode: 'onsave',
    delays: {
      run: 250,
    },
  }
}
