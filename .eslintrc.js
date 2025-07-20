module.exports = {
  root: true,
  ignorePatterns: ["node_modules/**", "dist/**", "coverage/**", "*.d.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "unused-imports", "header"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "header/header": [
      "error",
      "block",
      [
        "",
        " * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.",
        " ",
      ],
      2,
    ],
    "prettier/prettier": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.base.json"],
      },
    },
  ],
};
