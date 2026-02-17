// eslint.config.cjs
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["**/src/logger/**", "**/src/tests**"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.node, // This includes 'process', 'require', 'module' etc.
        commonjs: true,
        es2021: true,
      },
    },
    rules: {
      "no-useless-escape": "off",
      "no-console": "warn",
      "no-empty-function": "error",
      "no-eq-null": "error",
      "prefer-const": "warn",
      "yoda": ["error", "never", { exceptRange: true }],
      "no-unneeded-ternary": "warn",
      "no-undefined": "error",
      "no-undef-init": "error",
      "no-constant-binary-expression": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];
