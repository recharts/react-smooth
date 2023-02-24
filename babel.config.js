const BABEL_ENV = process.env.BABEL_ENV;

const plugins = [
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-export-namespace-from',
  ['@babel/plugin-proposal-decorators', { version: '2023-01' }],
  ['@babel/plugin-proposal-class-properties'],
  '@babel/plugin-proposal-object-rest-spread',
];

if (BABEL_ENV === 'umd') {
  plugins.push('@babel/plugin-external-helpers');
}

// eslint-disable-next-line no-nested-ternary
const babelModules = BABEL_ENV === 'commonjs' ? 'commonjs' : BABEL_ENV === 'test' ? 'auto' : false;

module.exports = {
  plugins,
  presets: [
    [
      '@babel/preset-env',
      {
        modules: babelModules,
        targets: {
          browsers: ['last 2 versions'],
        },
      },
    ],
    '@babel/preset-react',
  ],
};
