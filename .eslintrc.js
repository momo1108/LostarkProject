module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
    "react/no-unescaped-entities": "off",
  },
};
