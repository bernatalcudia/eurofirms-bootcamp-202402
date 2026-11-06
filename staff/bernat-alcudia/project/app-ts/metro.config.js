// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const sharedPackage = path.resolve(__dirname, '../com-ts');

config.watchFolders = [...(config.watchFolders || []), sharedPackage];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  com: sharedPackage,
};
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(sharedPackage, 'node_modules'),
];

module.exports = config;
