// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const a11yPlugin = require('eslint-plugin-react-native-a11y');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      'react-native-a11y': a11yPlugin,
    },
    rules: {
      ...a11yPlugin.configs.all.rules,
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
