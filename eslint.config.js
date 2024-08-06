import js from "@eslint/js"
import vue from "eslint-plugin-vue"
import prettier from "eslint-config-prettier"

export default [
    js.configs.recommended,
    ...vue.configs["flat/recommended"],
    prettier,
    {
        files: ["**/*.js", "**/*.vue"],
        rules: {
            // how about no because I'm lazy
            "vue/multi-word-component-names": "off",
            "prefer-const": "error",
            eqeqeq: "error",
        },

    }
]