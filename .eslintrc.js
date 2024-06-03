module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        tabWidth: 2,
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'none',
        jsxBracketSameLine: true
      }
    ]
  }
}
