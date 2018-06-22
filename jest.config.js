module.exports = {
    transform: {
        '.(ts|tsx)': './node_modules/ts-jest/preprocessor.js'
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js'
    ],
    coveragePathIgnorePatterns: [
        'node_modules',
        'test'
    ],
    testURL: 'https://localhost',
    silent: true
}
