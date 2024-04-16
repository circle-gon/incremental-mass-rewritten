module.exports = {
  env: {
    browser: true,
    es2024: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // how about no because I'm lazy
    "vue/multi-word-component-names": "off",
    "prefer-const": "error",
    eqeqeq: "error",
  },
};
