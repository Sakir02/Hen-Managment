// Polyfill for @expo/log-box in Expo SDK 57 / expo-router / metro-runtime
const noop = () => {};

const LogBox = {
  install: noop,
  uninstall: noop,
  clearAllLogs: noop,
  addLog: noop,
  addException: noop,
  ignoreLogs: noop,
  ignoreAllLogs: noop,
};

module.exports = {
  default: LogBox,
  LogBox,
  setupLogBox: noop,
  clearAllLogs: noop,
  withoutANSIColorStyles: (s) => s,
  parseWebBuildErrors: () => [],
};
