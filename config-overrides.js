const { override, addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const path = require('path');
const webpack = require('webpack');

module.exports = override(
  // Removed process alias, let CRA 5 handle it if possible
  addWebpackAlias({
    // Example: '@components': path.resolve(__dirname, 'src/components')
  }),

  (config) => {
    // Keep necessary fallbacks for Node core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify"),
      "constants": require.resolve("constants-browserify"),
      "fs": false,
      "child_process": false,
      "module": false,
      "net": false,
      "tls": false,
      "zlib": false,
      "http": false,
      "https": false,
      "url": false
    };

    // Keep rule for OpenAI if it helped before, otherwise remove
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: path.resolve(__dirname, 'node_modules/openai'),
      resolve: {
        fullySpecified: false
      },
    });

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Failed to parse source map/,
    ];

    console.log("Applied core module fallbacks and OpenAI specific rule.");
    return config;
  },

  // Removed ProvidePlugin for process and Buffer
  // Let react-scripts@5 handle these if possible
  // addWebpackPlugin(
  //   new webpack.ProvidePlugin({
  //     process: 'process/browser',
  //     Buffer: ['buffer', 'Buffer'],
  //   })
  // )
); 