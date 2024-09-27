import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import js from '@eslint/js'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import'
import pluginImportConfig from 'eslint-plugin-import/config/recommended.js'
import pluginJSDoc from 'eslint-plugin-jsdoc'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'
import pluginEslintComments from 'eslint-plugin-eslint-comments'

const projectDirname = dirname(fileURLToPath(import.meta.url))

const allTsExtensionsArray = ['ts', 'mts', 'cts', 'tsx', 'mtsx']
const allJsExtensionsArray = ['js', 'mjs', 'cjs', 'jsx', 'mjsx']
const allTsExtensions = allTsExtensionsArray.join(',')
const allJsExtensions = allJsExtensionsArray.join(',')
const allExtensions = [...allTsExtensionsArray, ...allJsExtensionsArray].join(',')

const importRules = {
  'import/no-unresolved': 'error',
  'sort-imports': [
    'error',
    {
      allowSeparatedGroups: true,
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    },
  ],
  'import/order': [
    'error',
    {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'type',
        'unknown',
      ],
      'newlines-between': 'never',
      'alphabetize': {
        order: 'asc',
        caseInsensitive: true
      }
    },
  ],
}

const baseRules = {
  complexity: ['error', { max: 11 }],
  semi: ['error', 'never'],
  'no-console': ['warn', { allow: ['info', 'error'] }],
  'no-undef': 'error',
  eqeqeq: ['error', 'always'],
  'no-eval': 'error',
  curly: ['error', 'all'],
  indent: ['error', 2, { SwitchCase: 1 }],
  quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
  'prefer-const': [
    'error',
    {
      destructuring: 'any',
      ignoreReadBeforeAssign: false
    }
  ],
  'no-var': 'error',
  'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
  'max-params': ['warn', 4],
  'comma-dangle': ['error', 'never'],
  'prettier/prettier': ['warn', { semi: false }]
}

const commentRules = {
  'eslint-comments/require-description': ['error'],
  'eslint-comments/no-unused-disable': 'error',
  'eslint-comments/no-unused-enable': 'error',
  'eslint-comments/no-unlimited-disable': 'error',
  'eslint-comments/disable-enable-pair': 'error',
  'eslint-comments/no-duplicate-disable': 'error'
}

const jsdocRules = {
  'jsdoc/check-alignment': 'error',
  'jsdoc/check-param-names': 'error',
  'jsdoc/check-tag-names': 'error',
  'jsdoc/check-types': 'error',
  'jsdoc/require-description': 'warn',
  'jsdoc/require-jsdoc': [
    'error',
    {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false
      }
    }
  ],
  'jsdoc/require-param': 'error',
  'jsdoc/require-param-description': 'warn',
  'jsdoc/require-returns': 'error',
  'jsdoc/require-returns-description': 'warn',
  'jsdoc/require-returns-type': 'error',
}

const typescriptRules = {
  ...prettierConfig.rules,
  ...pluginImportConfig.rules,
  ...typescriptEslintPlugin.configs.recommended.rules,
  ...typescriptEslintPlugin.configs['recommended-type-checked'].rules,
  ...typescriptEslintPlugin.configs.strict.rules,
  ...typescriptEslintPlugin.configs['strict-type-checked'].rules,
  ...typescriptEslintPlugin.configs['stylistic-type-checked'].rules,
  ...commentRules,
  ...jsdocRules,
  ...importRules,
  ...baseRules,
}

const javascriptRules = {
  ...prettierConfig.rules,
  ...pluginImportConfig.rules,
  ...typescriptEslintPlugin.configs.recommended.rules,
  ...typescriptEslintPlugin.configs.strict.rules,
  ...typescriptEslintPlugin.configs['stylistic'].rules,
  ...js.configs.all.rules,
  ...js.configs.recommended.rules,
  ...commentRules,
  ...jsdocRules,
  ...importRules,
  ...baseRules,
}

const typescriptRulesDev = {
  '@typescript-eslint/no-explicit-any': ['warn'],
  '@typescript-eslint/prefer-nullish-coalescing': ['off'],
  '@typescript-eslint/no-inferrable-types': ['off'],
  '@typescript-eslint/dot-notation': ['off'],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }
  ],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
      allowConciseArrowFunctionExpressionsStartingWithVoid: false
    }
  ],
}

const javascriptRulesDev = {
  '@typescript-eslint/no-unused-vars': ['warn'],
  '@typescript-eslint/no-unsafe-member-access': ['off'],
  '@typescript-eslint/no-unsafe-assignment': ['off']
}

const config = [
  {
    /* setup parser for all files */
    files: [`**/*.{${allExtensions}}`],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        tsconfigRootDir: resolve(projectDirname),
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
  },
  {
    /* all typescript files, except config files */
    files: [`**/*.{${allTsExtensions}}`],
    ignores: [`**/*.config.{${allTsExtensions}}`],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'import': pluginImport,
      'prettier': prettierPlugin,
      'jsdoc': pluginJSDoc,
      'eslint-comments': pluginEslintComments,
    },
    rules: {
      ...typescriptRules,
      ...typescriptRulesDev,
    },
  },
  {
    /* all javascript files, except config */
    files: [`**/*.{${allJsExtensions}}`],
    ignores: [`**/*.config.{${allJsExtensions}}`],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'import': pluginImport,
      'prettier': prettierPlugin,
      'jsdoc': pluginJSDoc,
      'eslint-comments': pluginEslintComments,
    },
    rules: {
      ...javascriptRules,
      ...javascriptRulesDev,
    },
  },
  {
    /* config files: typescript */
    files: [`**/*.config.{${allTsExtensions}}`],
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'import': pluginImport,
      'prettier': prettierPlugin,
      'jsdoc': pluginJSDoc,
      'eslint-comments': pluginEslintComments,
    },
    rules: {
      ...typescriptRules
    },
  },
  {
    /* config files: javascript */
    files: [`**/*.config.{${allJsExtensions}}`],
    settings: {
      'import/resolver': {
        typescript: {}
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'import': pluginImport,
      'prettier': prettierPlugin,
      'jsdoc': pluginJSDoc,
      'eslint-comments': pluginEslintComments,
    },
    rules: {
      ...javascriptRules
    },
  },
  {
    ignores: [
      'dist',
      'build',
      'commitlint.config.ts',
      'jest.config.ts',
      'jest.setup.ts',
      'cz-config.ts',
      'eslint.config.mjs'
    ],
  },
]

export default config