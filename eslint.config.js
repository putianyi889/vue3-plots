import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default tseslint.config(
    {
        ignores: ['dist/**', 'docs/.vitepress/dist/**', 'docs/.vitepress/cache/**', 'docs/.vitepress/.temp/**', 'node_modules/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs['flat/recommended'],
    stylistic.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: false,
        commaDangle: 'always-multiline',
        jsx: false,
    }),
    {
        files: ['**/*.{js,ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            '@stylistic/comma-spacing': ['error', { before: false, after: true }],
            '@stylistic/computed-property-spacing': ['error', 'never'],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/function-call-spacing': ['error', 'never'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
            '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
            '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
            '@stylistic/no-multi-spaces': 'error',
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/operator-linebreak': ['error', 'before'],
            '@stylistic/padded-blocks': ['error', 'never'],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/space-before-blocks': ['error', 'always'],
            '@stylistic/space-before-function-paren': ['error', {
                anonymous: 'always',
                asyncArrow: 'always',
                named: 'never',
            }],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/type-annotation-spacing': 'error',
            'vue/block-lang': ['error', { script: { lang: 'ts' } }],
            'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
            'vue/block-tag-newline': 'error',
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/component-name-in-template-casing': 'error',
            'vue/component-options-name-casing': 'error',
            'vue/custom-event-name-casing': 'error',
            'vue/define-emits-declaration': 'error',
            'vue/define-macros-order': 'error',
            'vue/define-props-declaration': ['error', 'runtime'],
            'vue/define-props-destructuring': ['error', { destructure: 'never' }],
            // vue/enforce-style-attribute
            // vue/html-button-has-type
            'vue/html-closing-bracket-newline': 'error',
            'vue/html-closing-bracket-spacing': 'error',
            'vue/html-comment-content-newline': 'error',
            'vue/html-comment-content-spacing': 'error',
            'vue/html-comment-indent': ['error', 4],
            'vue/html-indent': ['error', 4],
            'vue/html-quotes': ['error', 'double'],
            // vue/match-component-file-name
            // vue/match-component-import-name
            'vue/max-attributes-per-line': 'off',
            'vue/max-lines-per-block': ['warn', { script: 100, template: 100, style: 50, skipBlankLines: true }],
            // vue/max-props
            // vue/max-template-depth
            'vue/multi-word-component-names': 'off',
            // vue/new-line-between-multi-line-property
            // vue/next-tick-style
            // vue/no-bare-strings-in-template
            'vue/no-boolean-default': 'error',
            // vue/no-duplicate-attr-inheritance
            'vue/no-duplicate-class-names': 'error',
            'vue/no-empty-component-block': 'error',
            'vue/no-import-compiler-macros': 'error',
            // vue/no-literals-in-template
            // vue/no-multiple-objects-in-class
            // vue/no-negated-v-if-condition
            // vue/no-potential-component-option-typo
            // vue/no-ref-object-reactivity-loss
            // vue/no-restricted-block
            // vue/no-restricted-call-after-await
            // vue/no-restricted-class
            // vue/no-restricted-component-names
            // vue/no-restricted-component-options
            // vue/no-restricted-custom-event
            // vue/no-restricted-html-elements
            // vue/no-restricted-props
            // vue/no-restricted-static-attribute
            // vue/no-restricted-v-bind
            // vue/no-restricted-v-on
            'vue/no-root-v-if': 'error',
            // vue/no-setup-props-reactivity-loss
            // vue/no-static-inline-styles
            // vue/no-template-target-blank
            // vue/no-this-in-before-route-enter
            'vue/no-undef-components': 'error',
            'vue/no-undef-directives': 'error',
            'vue/no-undef-properties': 'error',
            'vue/no-unsupported-features': ['error', { version: '^3.5.0' }],
            'vue/no-unused-emit-declarations': 'error',
            'vue/no-unused-properties': 'off',
            'vue/no-unused-refs': 'error',
            'vue/no-use-v-else-with-v-for': 'error',
            'vue/no-useless-mustaches': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/no-v-text': 'error',
            'vue/padding-line-between-blocks': 'error',
            'vue/padding-line-between-tags': 'off',
            // vue/padding-lines-in-component-definition
            'vue/prefer-define-options': 'error',
            'vue/prefer-prop-type-boolean-first': 'error',
            'vue/prefer-separate-static-class': 'error',
            'vue/prefer-single-event-payload': 'off',
            'vue/prefer-true-attribute-shorthand': 'error',
            'vue/prefer-use-template-ref': 'error',
            'vue/prefer-v-model': 'error',
            // vue/require-default-export
            // vue/require-direct-export
            // vue/require-emit-validator
            'vue/require-explicit-slots': 'error',
            'vue/require-expose': 'error',
            'vue/require-macro-variable-name': 'error',
            // vue/require-name-property
            'vue/require-prop-comment': 'error',
            'vue/require-typed-object-prop': 'error',
            'vue/require-typed-ref': 'error',
            'vue/restricted-component-names': 'off',
            // 'vue/script-indent': ['error', 4],
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        files: ['tests/**/*.{ts,vue}'],
        languageOptions: {
            globals: globals.vitest,
        },
    },
)
