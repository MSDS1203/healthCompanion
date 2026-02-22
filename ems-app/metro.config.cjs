const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // Add mts and cts to the sourceExtensions array
    sourceExtensions: [...defaultConfig.resolver.sourceExtensions, 'mts', 'cts'],
  },
};

module.exports = mergeConfig(defaultConfig, config);