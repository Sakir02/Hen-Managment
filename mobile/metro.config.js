const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = function (context, moduleName, platform) {
  if (moduleName && moduleName.startsWith('@expo/log-box')) {
    return {
      filePath: path.resolve(__dirname, 'src/utils/logBoxPolyfill.js'),
      type: 'sourceFile',
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
