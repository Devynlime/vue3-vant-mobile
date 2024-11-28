import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,

    // enable UnoCSS support
    // https://unocss.dev/integrations/vscode
    unocss: true,

    formatters: {
      css: true,
    },

  },
  {
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'no-console': 'off',
    },
  },
  {
    ignores: [
      '.github/**',
      'scripts/**',
      'public/webapp-MicroApplication.1.0.js',
      'public/version.json',
      'src/components/smart-cable/**',
      'src/pages/smartCable/**',
      '**/*.js',
      'public/assets/data/*_full.json',
      'public/assets/data/*_value.json',
    ],
  },
)
