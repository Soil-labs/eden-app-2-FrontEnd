/** @type {import('eslint').ESLint.ConfigData} */
const config = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [
    {
      files: [
        "*.js",
        "*.cjs",
        "*.mjs",
        "apps/*/*.js",
        "apps/*/*.cjs",
        "apps/*/*.mjs",
        "packages/*/*.js",
        "packages/*/*.cjs",
        "packages/*/*.mjs",
      ],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.eslint.json",
          "./apps/*/tsconfig.json",
          "./packages/*/tsconfig.json",
        ],
        extends: [
          "plugin:@typescript-eslint/recommended-requiring-type-checking",
        ],
      },
    },
    {
      files: ["apps/**"],
      env: {
        browser: true,
      },
      settings: {
        next: {
          rootDir: ["apps/*"],
        },
      },
      extends: ["plugin:@next/next/recommended", "next"],
    },
  ],
};

module.exports = config;
