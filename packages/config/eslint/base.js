import babelParser from "@babel/eslint-parser";
import { createRequire } from "node:module";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";

// Caminho absoluto resolvido a partir DESTE pacote. Uma string nua
// ("@babel/preset-typescript") seria resolvida a partir do pacote sendo
// lintado, onde pode haver um v7 hoisted incompatível com o @babel/core 8
// declarado aqui. O preset precisa continuar sendo uma string: o ESLint 10
// serializa a config para workers, e um módulo não é clonável.
const presetTypescript = createRequire(import.meta.url).resolve(
  "@babel/preset-typescript",
);

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          // Referência ao módulo, não string: uma string seria resolvida a
          // partir do pacote sendo lintado, onde pode existir um @babel/preset-typescript
          // v7 hoisted, incompatível com o @babel/core 8 daqui.
          presets: [presetTypescript],
        },
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
