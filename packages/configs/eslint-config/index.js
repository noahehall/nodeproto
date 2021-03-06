module.exports = {
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    '**/*.html', // TODO
    '**/*.log',
    '**/*.jsonc',
    '**/*.png',
    '**/*.sh',
    '**/bundlestats/**',
    '**/copypasta/**',
    '**/dist/**',
    '**/firefox-profile/**',
    '**/fixtures/**',
    '**/flow-typed/**',
    '**/node_modules/**',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: true,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      globalReturn: true,
    },
    babelOptions: {
      rootMode: 'upward-optional',
    },
  },
  env: {
    es2021: true,
    es6: true,
    node: true,
    shelljs: false,
  },
  // remove html: failed to find dep domhandler
  plugins: ['markdown', 'promise', '@babel', 'fb-flow', 'flowtype-errors', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'plugin:markdown/recommended',
    'plugin:json/recommended',
    'plugin:flowtype-errors/recommended',
    'plugin:yml/prettier',
    'plugin:prettier/recommended',
  ],
  settings: {
    // 'html/html-extensions': ['.html', '.htm'],
    // 'html/xml-extensions': ['.xhtml', '.xml'],
    // 'html/indent': '+2',
    // 'html/report-bad-indent': 'error',
    'flowtype-errors': {
      stopOnExit: false,
    },
  },
  overrides: [
    {
      files: ['**/*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['**/*.yaml', '**/*.yml'],
      parser: 'yaml-eslint-parser',
    },
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown',
      rules: {
        'prettier/prettier': 'error',
        '@babel/no-unused-expressions': 0,
        'no-console': 0,
        'no-undef': 0,
        'no-unused-vars': 0,
        'padded-blocks': 0,
        'no-inline-html': 0,
      },
    },
  ],
  rules: {
    '@babel/new-cap': 'error',
    '@babel/no-invalid-this': 'error',
    '@babel/no-unused-expressions': 'error',
    '@babel/object-curly-spacing': ['error', 'always'],
    '@babel/semi': ['warn', 'always'],
    'json/*': [
      'warn',
      {
        allowComments: true,
      },
    ],
    'function-call-argument-newline': ['error', 'consistent'],
    'no-multiple-empty-lines': 'error',
    'no-throw-literal': 'error',
    'no-undef': 'error',
    'no-unused-vars': 'off',
    'node/no-unpublished-require': 'warn',
    'node/no-unsupported-features/es-syntax': 'off',
    'padded-blocks': ['error', 'never'],
    'prefer-named-capture-group': 0,
    'prefer-object-spread': 0,
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        allowSeparatedGroups: true,
        memberSyntaxSortOrder: ['none', 'multiple', 'all', 'single'],
      },
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: false,
        minKeys: 4,
        natural: true,
      },
    ],
    'max-lines-per-function': [
      'error',
      {
        skipBlankLines: true,
        skipComments: true,
        max: 120,
      },
    ],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info', 'table', 'assert'],
      },
    ],
    'flowtype-errors/show-errors': 'error',
    'flowtype-errors/show-warnings': 'warn',
    'flowtype-errors/enforce-min-coverage': ['warn', 80],
    'fb-flow/use-indexed-access-type': 'error',
    'fb-flow/use-exact-by-default-object-type': 'error',
    'fb-flow/use-flow-enums': 'error',
    'fb-flow/flow-enums-default-if-possible': 'error',
    'fb-flow/no-flow-enums-object-mapping': 'error',
    'MD033/no-inline-html': 'off',
    'no-inline-html': 'off',
    MD033: 'off',
    'arrow-parens': 0,
    'capitalized-comments': 0,
    'comma-dangle': 0,
    'id-length': 0,
    'line-comment-position': 0,
    'multiline-comment-style': 0,
    'no-inline-comments': 0,
    'no-ternary': 0,
    semi: 0,
    'jsx-quotes': 0,
    'node/no-unpublished-import': 0,
    'node/no-missing-require': 0,
    'node/no-missing-import': 0,
  },
};
