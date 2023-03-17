module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json'
  },
  rules: {
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true
      }
    ],
    'max-len': ['error', { code: 80, ignoreComments: true }],
    semi: 'off',
    '@typescript-eslint/semi': [2, 'always'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        overrides: {
          typeLiteral: {
            multiline: {
              delimiter: 'semi'
            },
            singleline: {
              delimiter: 'semi'
            }
          }
        }
      }
    ]
  }
};
