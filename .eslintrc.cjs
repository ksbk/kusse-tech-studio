module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    globals: {
        gtag: "readonly",
        dataLayer: "readonly",
    },
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-unused-vars": ["warn"],
        "no-console": ["off"],
        "no-undef": ["off"],
        indent: ["error", 2],
        "comma-dangle": ["error", "never"],
    },
    ignorePatterns: ["app/static/dist/**", "node_modules/**", "htmlcov/**"],
};
