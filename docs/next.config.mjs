import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  search: {
    codeblocks: false,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'react-native-web',
    'react-native-awesome-slider',
    'react-native-gesture-handler',
    'react-native-reanimated',
  ],
  webpack: (config, { webpack }) => {
    config.resolve = config.resolve || {};
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.resolve.alias = Object.assign(config.resolve.alias || {}, {
      'react-native$': 'react-native-web',
    });

    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      })
    );

    return config;
  },
};

export default withNextra(nextConfig);
