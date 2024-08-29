module.exports = {
  $schema: "https://json.schemastore.org/eslintrc",
  root: true,
  plugins: ["import", "react", "@typescript-eslint", "tailwindcss"],
  extends: [
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  rules: {
    "react/jsx-key": "off",
    "tailwindcss/no-custom-classname": "off",
    "react/jsx-sort-props": [
      "error",
      {
        shorthandFirst: true,
      },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "import/namespace": [
      "error",
      {
        allowComputed: true,
      },
    ],
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "./tailwind.config.js",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json", "tsconfig.json"],
      },
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
};
