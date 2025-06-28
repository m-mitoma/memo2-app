module.exports = {
  // ESLintがこの設定ファイルをルートとして扱うようにする
  root: true,
  // 実行環境を指定
  env: {
    browser: true,
    es2020: true,
  },
  // 継承するESLintの設定やプラグインを指定
  extends: [
    // ESLintの推奨ルール
    "eslint:recommended",
    // TypeScriptの推奨ルール
    "plugin:@typescript-eslint/recommended",
    // Reactの推奨ルール
    "plugin:react/recommended",
    // React Hooksの推奨ルール
    "plugin:react-hooks/recommended",
    // Viteのreact-refreshプラグインの推奨ルール
    "plugin:react-refresh/recommended",
    // Prettierと競合するルールを無効化 (これを一番最後に置くのが重要)
    "prettier",
  ],
  // TypeScriptのパーサーを指定
  parser: "@typescript-eslint/parser",
  // パーサーのオプション
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // 型チェックを伴うルールのための設定
    project: ["./tsconfig.json"],
    // ReactのJSX構文を有効化
    ecmaFeatures: {
      jsx: true,
    },
  },
  // Reactのバージョンを自動で検出
  settings: {
    react: {
      version: "detect",
    },
  },
  // 使用するプラグインを指定 (extendsで指定されたものは不要な場合もある)
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-refresh"],
  // 個別のルールのカスタマイズ
  rules: {
    // 例: TypeScriptのany型を許可しないルールを無効化
    "@typescript-eslint/no-explicit-any": "off",
    // 例: `import React from 'react'` が不要な場合に警告を出さないようにする (React 17+ の新しいJSX transformに対応)
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
