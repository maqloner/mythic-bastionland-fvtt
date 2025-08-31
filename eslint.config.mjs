import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import _import from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  extends: fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:i18n-json/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "@typhonjs-fvtt/eslint-config-foundry.js",
  )),

  plugins: {
    import: fixupPluginRules(_import),
    "@stylistic": stylistic,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.jquery,
      PoolTerm: "readonly",
    },

    ecmaVersion: "latest",
    sourceType: "module",
  },

  rules: {
    "prefer-const": 2,
    "comma-dangle": ["error", "never"],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-return-await": "error",

    "i18n-json/valid-message-syntax": [2, {
      syntax: "non-empty-string",
    }],

    "i18n-json/valid-json": 2,

    "i18n-json/sorted-keys": [2, {
      order: "asc",
      indentSpaces: 2,
    }],

    "i18n-json/identical-keys": 0,
  },

},
{
  files: ["module/data/**/*.json"],
  rules: {
    "i18n-json/valid-message-syntax": "off",
    "i18n-json/sorted-keys": "off",
    "i18n-json/identical-keys": "off",
    "i18n-json/valid-json": "off"
  }
}
]);
