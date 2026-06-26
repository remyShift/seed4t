import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["**/build/**", "**/coverage/**", "**/node_modules/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Type-checked rigor, scoped to source so config files stay light.
  {
    files: ["packages/*/src/**/*.ts"],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Convention B: data shapes are `type` (TInputBrick), contracts are `interface`
      // (IPort). So do NOT force object shapes to interface.
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
          filter: { regex: "^I[a-z]", match: false },
        },
        { selector: "typeAlias", format: ["PascalCase"], prefix: ["T"] },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          filter: { regex: "^[A-Z]([A-Z0-9]+|[a-z0-9]*)$", match: true },
        },
      ],
    },
  },

  // Tests: vitest rules + guard against a committed focused test.
  {
    files: ["packages/*/src/**/*.{test,spec}.ts"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/no-focused-tests": "error",
    },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },

  eslintConfigPrettier,
);
