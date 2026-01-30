const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure asset extensions are properly handled
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
];

// Ensure source extensions include TypeScript
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "ts",
  "tsx",
];

module.exports = config;
