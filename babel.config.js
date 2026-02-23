module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@layouts': './src/layouts',
            '@utils': './src/utils',
            '@styles': './src/styles',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@store': './src/store',
            '@assets': './src/assets',
            '@context': './src/context',
            '@api': './src/api',
          },
        },
      ],
    ],
  };
};
