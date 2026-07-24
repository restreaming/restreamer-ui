import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "public/_playersite/**",
      "src/locales/*/messages.js",
      "src/locales/*/messages.mjs",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    plugins: {
      import: {
        rules: {
          "no-anonymous-default-export": {
            meta: { type: "problem" },
            create: () => ({}),
          },
        },
      },
    },
  },
  tseslint.configs.recommended,
  {
    rules: {
      "no-anonymous-default-export": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
