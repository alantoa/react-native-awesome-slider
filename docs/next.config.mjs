import nextra from 'nextra';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  search: {
    codeblocks: false,
  },
});

export default withNextra({
  webpack(config, options) {
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.alias = Object.assign(config.resolve.alias || {}, {
      'react-native$': 'react-native-web',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$':
        'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    });
    config.plugins.push(
      new options.webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      })
    );
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    if (!config.plugins) {
      config.plugins = [];
    }

    return config;
  },
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    'react-native-awesome-slider',
    'react-native-reanimated',
    'react-native-gesture-handler',
  ],
  experimental: {
    forceSwcTransforms: true,
  },
});
