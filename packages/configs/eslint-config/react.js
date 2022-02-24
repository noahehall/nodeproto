module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    '@nodeproto/eslint-config',
  ],
  plugins: ['react'],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
      flowVersion: '0.173.0',
      componentWrapperFunctions: ['styled'],
      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to',
        },
      ],
    },
  },
  env: {
    browser: true,
    serviceworker: true,
    'shared-node-browser': true,
    webextensions: true,
    worker: true,
  },
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'error',
    'react/forbid-component-props': [
      'error',
      {
        forbid: ['reactsucks', 'angularisgreat'],
      },
    ],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-max-depth': [
      'error',
      {
        max: 5,
      },
    ],
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 3,
        when: 'multiline',
      },
    ],
    'react/jsx-no-literals': 'warn',
    'react/jsx-one-expression-per-line': [
      'error',
      {
        allow: 'single-child',
      },
    ],
    'react/destructuring-assignment': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
  },
};
