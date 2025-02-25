import prettier from "eslint-plugin-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [
      "dist/**", // Ignore built files
      "node_modules/**", // Ignore dependencies
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
      },
    },
  },
  {
    plugins: {
      prettier,
      tailwindcss,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
    },
  },
];
