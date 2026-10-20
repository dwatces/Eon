import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

const config = [
  js.configs.recommended,
  ...nextVitals,
  // eslint-config-next already registers the jsx-a11y plugin, so only
  // its recommended rules are added here.
  {
    files: ["**/*.{js,jsx,mjs}"],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    files: ["**/*.cjs"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default config;
