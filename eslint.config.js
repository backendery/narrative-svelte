import antfu from '@antfu/eslint-config'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import { SelectorKind } from 'eslint-plugin-better-tailwindcss/types'

const TW_CALLEES = ['clsx', 'cn', 'cx', 'tv', 'twJoin', 'twMerge', 'twcn']

export default antfu(
  {
    svelte: true,
    typescript: {
      tsconfigPath: './tsconfig.json',
      overrides: {
        'ts/consistent-type-imports': ['error', {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        }],
        'ts/no-explicit-any': 'error',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-non-null-assertion': 'error',
        'ts/no-unsafe-argument': 'error',
        'ts/no-unsafe-assignment': 'error',
        'ts/no-unsafe-call': 'error',
        'ts/no-unsafe-member-access': 'error',
      },
    },
    formatters: {
      html: true,
      css: true,
      prettierOptions: {
        arrowParens: 'always',
        bracketSameLine: false,
        bracketSpacing: true,
        endOfLine: 'lf',
        htmlWhitespaceSensitivity: 'css',
        printWidth: 100,
        quoteProps: 'consistent',
        semi: true,
        singleAttributePerLine: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
    },
    ignores: [
      // Dirs
      '.cache/**',
      '.git/**',
      '.github/**',
      '.husky/**',
      '.svelte-kit/**',
      '.vercel/**',
      '.vscode/**',
      'build/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'src/lib/generated/**',
      'static/**',
      // Files
      'AGENTS*.md',
      'LICENSE*.md',
      'pnpm-*.yaml',
    ],
  },
  {
    rules: {
      'eqeqeq': ['error', 'smart'],
      'import/order': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-var': 'error',
      'no-undef': 'off',
      'perfectionist/sort-imports': ['error', {
        type: 'natural',
        order: 'asc',
        groups: [
          'side-effect',
          'side-effect-style',
          'value-builtin',
          'value-external',
          'value-internal',
          ['value-parent', 'value-sibling', 'value-index'],
          'type-builtin',
          'type-external',
          'type-internal',
          ['type-parent', 'type-sibling', 'type-index'],
          'unknown',
        ],
        internalPattern: ['^\\$lib/.*', '^\\$app/.*', '^\\$env/.*'],
        newlinesBetween: 1,
        sortSideEffects: false,
      }],
      'perfectionist/sort-named-imports': ['error', {
        type: 'natural',
        order: 'asc',
      }],
      'prefer-const': 'error',
      'style/indent': ['error', 2],
      'style/max-len': 'off',
      'style/quotes': ['error', 'single', { avoidEscape: true }],
      'style/semi': ['error', 'never'],
      'svelte/no-at-html-tags': 'error',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'ts/prefer-const': 'off',
      'ts/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    rules: {
      'no-const-assign': 'off',
      'no-redeclare': 'off',
      'prefer-const': 'off',
      'svelte/button-has-type': 'error',
      'svelte/no-reactive-reassign': 'error',
      'svelte/no-target-blank': 'error',
      'svelte/no-navigation-without-resolve': 'off',
      'svelte/no-unknown-style-directive-property': 'error',
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/prefer-svelte-reactivity': 'error',
      'svelte/sort-attributes': ['warn', {
        order: [
          'this',
          'bind:this',
          { match: '/^use:/u', sort: 'alphabetical' },
          { match: '/^transition:/u', sort: 'alphabetical' },
          { match: '/^in:/u', sort: 'alphabetical' },
          { match: '/^out:/u', sort: 'alphabetical' },
          { match: '/^animate:/u', sort: 'alphabetical' },
          'slot',
          'id',
          'name',
          'type',
          'href',
          'src',
          'for',
          'value',
          'class',
          { match: '/^class:/u', sort: 'alphabetical' },
          { match: '/^(?!on[A-Z]|bind:|on:).*/u', sort: 'alphabetical' },
          { match: '/^bind:/u', sort: 'alphabetical' },
          { match: '/^on/u', sort: 'alphabetical' },
          { match: '/^aria-/u', sort: 'alphabetical' },
          'role',
          { match: '/^data-/u', sort: 'alphabetical' },
        ],
      }],
      'svelte/valid-compile': ['error', { ignoreWarnings: false }],
      'ts/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/routes/**/*.ts', 'src/routes/**/*.svelte'],
    rules: {
      'import/no-unused-modules': 'off',
    },
  },
  {
    files: [
      '**/*.config.{ts,js,mjs}',
      'eslint.config.js',
    ],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      'ts/no-explicit-any': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-member-access': 'off',
    },
  },
  {
    plugins: {
      'better-tailwindcss': betterTailwind,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app.css',
        selectors: [
          ...getDefaultSelectors(),
          ...TW_CALLEES.map(name => ({
            kind: SelectorKind.Callee,
            name: `^${name}$`,
            match: [{ type: 'strings' }],
          })),
          {
            kind: SelectorKind.Callee,
            name: '^cva$',
            match: [
              { type: 'strings' },
              {
                type: 'objectValues',
                path: '^compoundVariants\\[\\d+\\]\\.(?:className|class)$',
              },
            ],
          },
          {
            kind: SelectorKind.Callee,
            name: '^tv$',
            match: [
              { type: 'strings' },
              {
                type: 'objectValues',
                path: '^compoundSlots\\[\\d+\\]\\.(?:className|class)$',
              },
              {
                type: 'objectValues',
                path: '^compoundVariants\\[\\d+\\]\\.(?:className|class)$',
              },
            ],
          },
          {
            kind: SelectorKind.Tag,
            name: '^tw$',
            match: [{ type: 'strings' }],
          },
          {
            kind: SelectorKind.Variable,
            name: '^.*(Classes|Styles|Variants|ClassName|ClassNames)$',
            match: [{ type: 'strings' }],
          },
        ],
      },
    },
    rules: {
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/enforce-consistent-important-position': 'error',
      'better-tailwindcss/enforce-consistent-line-wrapping': ['error', {
        indent: 2,
        preferSingleLine: true,
        printWidth: 100,
      }],
      'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
      'better-tailwindcss/enforce-consistent-variant-order': 'error',
      'better-tailwindcss/enforce-logical-properties': 'off',
      'better-tailwindcss/enforce-shorthand-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/no-unnecessary-whitespace': ['error', {
        allowMultiline: true,
      }],
      'better-tailwindcss/no-unregistered-classes': 'off',
    },
  },
)
